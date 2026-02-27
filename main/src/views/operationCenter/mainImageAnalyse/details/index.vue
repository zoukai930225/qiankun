<template>
  <scheme-details ref="detailsRef" name="MainImageAnalyse" :width="968" @closed="handleClosed">
    <template #card>
      <div class="main-image-analyse-details">
        <!-- 第一步 填写主图相关 -->
        <div class="step1" v-if="step === 1 || viewType === 'view'">
          <el-form class="dialogForm" :class="{ editForm: isEdit }" ref="formRef" v-loading="formLoading"
            :model="formData" :rules="formRules" label-width="120px" label-position="right">
            <!-- 主图 -->
            <el-card shadow="never" class="drawerContent" v-if="!isPartialMode">
              <template #header>
                <div class="drawerContent-title">
                  <span class="line"></span>
                  <span>主图</span>
                </div>
              </template>

              <el-row>
                <el-col :span="12">
                  <el-form-item prop="store" label="店铺" required>
                    <StoreRangePlus v-model="formData.store" width="300px" :disabled="!isEdit" :showAllChannels="false"
                      placeholder="请选择店铺" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="货品编码" prop="productCode">
                    <!-- <el-input
                    style="width: 300px"
                    placeholder="请输入"
                    v-model="formData.productCode"
                    :disabled="!isEdit"
                  /> -->
                    <el-select-v2 style="width: 100%" filterable multiple :multiple-limit="10"
                      :collapse-tags="!isReadonly" :collapse-tags-tooltip="!isReadonly"
                      :max-collapse-tags="!isReadonly ? 1 : undefined" clearable v-model="formData.productCode"
                      :options="WdtGoodsList" :disabled="!isEdit" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="运营人员" prop="operatorList">
                <SWSelectPeople v-if="formData.operator" :disabled="!isEdit" :tags="6" v-model="formData.operatorList"
                  placeholder="请选择运营人员" :roleId="roles.getRole('主图运营')" :showDisabledBg="true" />
              </el-form-item>
              <el-form-item label="链接主打方向+核心大卖点" prop="mainDirection" class="longLabel">
                <s-textarea :disabled="!isEdit" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入"
                  v-model="formData.mainDirection" />
              </el-form-item>
              <el-form-item label="主拍色" prop="mainColor">
                <s-textarea :disabled="!isEdit" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入"
                  v-model="formData.mainColor" />
              </el-form-item>
              <el-form-item label="产品款式图(准确)" prop="mainImageInfo">
                <template #label>
                  <span class="text-right lh-16px">产品款式图<br />(准确) </span>
                </template>
                <Transfer :upload-data="{ code: 'OPERATION' }" v-model="mainImageList" @change="emitValidate" :limit="1" accept-type="image" :is-file-show="true" :multiple="false" value-type="array" :disabled="!isEdit"/>
                <!-- <UploadImg v-model:modelValue="mainImageList" :limit="1" :uploadDisabled="!isEdit"
                  @validate="emitValidate" /> -->
              </el-form-item>
            </el-card>
            <!-- 目标人群 -->
            <el-card shadow="never" class="drawerContent" v-if="!isPartialMode">
              <template #header>
                <div class="drawerContent-title">
                  <span class="line"></span>
                  <span>目标人群(实际使用人群)</span>
                </div>
              </template>
              <el-form-item :label="index === 0 ? '人群特点' : ''" class="btns" v-for="(n, index) in targetFeatures"
                :key="n">
                <el-input placeholder="请输入" v-model="n.value" :disabled="!isEdit" />
                <template v-if="isEdit">
                  <div class="btn" :class="{ del: index > 0 }"></div>
                  <img :src="add" alt="" v-if="index === 0" @click="targetAdd('targetFeatures')" />
                  <img :src="del" alt="" v-else @click="targetDel('targetFeatures', index)" />
                </template>
              </el-form-item>
              <div class="gray"></div>
              <el-form-item :label="index === 0 ? '他们关心什么' : ''" prop="targetCares" class="btns"
                v-for="(n, index) in targetCares" :key="n">
                <el-input placeholder="请输入" v-model="n.value" :disabled="!isEdit" />
                <template v-if="isEdit">
                  <div class="btn" :class="{ del: index > 0 }"></div>
                  <img :src="add" alt="" v-if="index === 0" @click="targetAdd('targetCares')" />
                  <img :src="del" alt="" v-else @click="targetDel('targetCares', index)" />
                </template>
              </el-form-item>
            </el-card>
            <!-- 运营备注 -->
            <el-card shadow="never" class="drawerContent" v-if="!isPartialMode">
              <template #header>
                <div class="drawerContent-title">
                  <span class="line"></span>
                  <span>运营维护</span>
                </div>
              </template>
              <el-form-item label="核心差异卖点" prop="coreDifferencesSellingPoints">
                <s-textarea :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.coreDifferencesSellingPoints" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="备注" prop="remark">
                <s-textarea :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.remark" :disabled="!isEdit" />
              </el-form-item>
              
            </el-card>
          </el-form>
        </div>
        <!-- 第二步 填写分析相关 -->
        <div class="step2" v-if="step === 2 || viewType === 'view' || isPartialMode">
          <el-form class="dialogForm" :class="{ editForm: isEdit }" ref="formListRef" v-loading="formLoading"
            :model="formListData" :rules="formListRules" label-width="120px" label-position="right">
            <!-- 产品特点 feartureCard-->
            <el-card shadow="never" class="drawerContent card-items"
              :header-class="featureCardList.length === 0 ? 'noLine' : ''"
              :body-class="featureCardList.length === 0 ? 'noContent' : ''"
              v-if="(isPartialMode && showType === 'features') || !isPartialMode">
              <template #header>
                <div class="drawerContent-title">
                  <span class="line"></span>
                  <span>本产品特点(按重要程度填写,1为最核心)</span>
                  <el-button type="primary" :icon="Plus" class="commonAddBtn" @click="addBtnClick('features')"
                    v-if="isEdit">
                    新增
                  </el-button>
                </div>
              </template>

              <!-- <el-form-item label-width="0" prop="features" class="drawerContent-content"> -->
              <!-- <featureCard
                  :forms="n"
                  :index="index"
                  v-for="(n, index) in featureCardList"
                  :key="index"
                  @delete="handleDel"
                  :isEdit="isEdit"
                  @update="addBtnClick"
                /> -->
              <!-- <GenericDescription
                  :forms="n"
                  :index="index"
                  v-for="(n, index) in featureCardList"
                  :key="n.id || index"
                  @delete="handleDel"
                  :isEdit="isEdit"
                  @update="addBtnClick"
                  :data-fields="featureFields"
                  card-type="features"
                /> -->
              <!-- <ProductFeatureDescriptions :forms="n" :index="index" v-for="(n, index) in featureCardList"
                  :key="n.id || index" @delete="handleDel" :isEdit="isEdit" @update="addBtnClick" /> -->
              <!-- </el-form-item> -->
              <el-form-item label-width="0" prop="features" class="drawerContent-content">
                <Draggable v-model="featureCardList" group="features" item-key="id" :disabled="!isEdit"
                  class="draggable-list" @end="(event) => onCardDragEnd(event, 'features')"
                  handle=".custom-descriptions-table">
                  <template #item="{ element, index }">
                    <GenericDescription :forms="element" :index="index" :key="element.id || index" @delete="handleDel"
                      :isEdit="isEdit" @update="addBtnClick" :data-fields="featureFields" card-type="features" />
                  </template>
                </Draggable>
              </el-form-item>
            </el-card>
            <!-- 竞品分析  competitorCard-->
            <el-card shadow="never" class="drawerContent card-items"
              :header-class="competitorCardList.length === 0 ? 'noLine' : ''"
              :body-class="competitorCardList.length === 0 ? 'noContent' : ''"
              v-if="(isPartialMode && showType === 'competitor') || !isPartialMode">
              <template #header>
                <div class="drawerContent-title">
                  <span class="line"></span>
                  <span>竞品分析</span>
                  <el-button type="primary" :icon="Plus" class="commonAddBtn" @click="addBtnClick('competitor')"
                    v-if="isEdit">
                    新增
                  </el-button>
                </div>
              </template>

              <!-- <el-form-item label-width="0" prop="competitor" class="drawerContent-content"> -->
              <!-- <competitorCard :forms="n" :index="index" v-for="(n, index) in competitorCardList" :key="index"
                  @delete="handleDel" :isEdit="isEdit" @update="addBtnClick" /> -->
              <!-- <GenericDescription
                  :forms="n"
                  :index="index"
                  v-for="(n, index) in competitorCardList"
                  :key="n.id || index"
                  @delete="handleDel"
                  :isEdit="isEdit"
                  @update="addBtnClick"
                  :data-fields="competitorFields"
                  card-type="competitor"
                />
              </el-form-item> -->
              <el-form-item label-width="0" prop="competitor" class="drawerContent-content">
                <Draggable v-model="competitorCardList" group="competitor" item-key="id" :disabled="!isEdit"
                  class="draggable-list" @end="(event) => onCardDragEnd(event, 'competitor')"
                  handle=".custom-descriptions-table">
                  <template #item="{ element, index }">
                    <GenericDescription :forms="element" :index="index" :key="element.id || index" @delete="handleDel"
                      :isEdit="isEdit" @update="addBtnClick" :data-fields="competitorFields" card-type="competitor" />
                  </template>
                </Draggable>
              </el-form-item>
            </el-card>
            <!-- 主图卖点 sellingPointCard-->
            <el-card shadow="never" class="drawerContent card-items"
              :header-class="sellingPointCardList.length === 0 ? 'noLine' : ''"
              v-if="(isPartialMode && showType === 'sellingPoint') || !isPartialMode"
              :body-class="sellingPointCardList.length === 0 ? 'noContent' : ''">
              <template #header>
                <div class="drawerContent-title">
                  <span class="line"></span>
                  <span>本品主图卖点方向和透出顺序</span>
                  <el-button type="primary" :icon="Plus" class="commonAddBtn" @click="addBtnClick('sellingPoint')"
                    v-if="isEdit">
                    新增
                  </el-button>
                </div>
              </template>
              <el-form-item label-width="0" prop="sellingPoint" class="drawerContent-content">
                <Draggable v-model="sellingPointCardList" group="sellingPoint" item-key="id" :disabled="!isEdit"
                  class="draggable-list" @end="(event) => onCardDragEnd(event, 'sellingPoint')"
                  handle=".custom-descriptions-table">
                  <template #item="{ element, index }">
                    <GenericDescription :forms="element" :index="index" :key="element.id || index" @delete="handleDel"
                      :isEdit="isEdit" @update="addBtnClick" :data-fields="sellingPointFields"
                      card-type="sellingPoint" />
                  </template>
                </Draggable>
              </el-form-item>
              <!-- <el-form-item label-width="0" prop="sellingPoint" class="drawerContent-content"> -->
              <!-- <sellingPointCard :forms="n" :index="index" v-for="(n, index) in sellingPointCardList" :key="index"
                  @delete="handleDel" :isEdit="isEdit" @update="addBtnClick" /> -->
              <!-- <GenericDescription
                  :forms="n"
                  :index="index"
                  v-for="(n, index) in sellingPointCardList"
                  :key="n.id || index"
                  @delete="handleDel"
                  :isEdit="isEdit"
                  @update="addBtnClick"
                  :data-fields="sellingPointFields"
                  card-type="sellingPoint"
                /> -->
              <!-- </el-form-item> -->
            </el-card>
            <!-- 视觉人员对接 -->
            <el-card shadow="never" class="drawerContent"
              v-if="(viewType === 'updateAll' || viewType === 'view') && !isPartialMode">
              <template #header>
                <div class="drawerContent-title">
                  <span class="line"></span>
                  <span>与视觉部门对接</span>
                </div>
              </template>
              <div class="flex">
                <el-form-item label="对接时间" prop="connectionTime">
                  <el-date-picker v-model="formListData.connectionTime" type="date" placeholder="请选择"
                    format="YYYY-MM-DD" value-format="YYYY-MM-DD" :disabled="!isEdit" style="width: 300px" />
                </el-form-item>
                <el-form-item label="参会人员" prop="attendeesPersonnelList" style="margin-left: auto">
                  <SWSelectPeople :disabled="!isEdit" v-model="formListData.attendeesPersonnelList" placeholder="请选择"
                    style="width: 300px" :limit="10" :showDisabledBg="true" />
                </el-form-item>
              </div>
              <el-form-item label="备注">
                <s-text-area :disabled="!isEdit" :autosize="{ minRows: 3, maxRows: 4 }" show-word-limit maxlength="100"
                  placeholder="请输入" v-model.trim="formListData.remarks" />
              </el-form-item>
            </el-card>
            <!-- 确认需求交付 -->
            <el-card shadow="never" class="drawerContent" v-if="
              (viewType === 'updateAll' && isUnblock === 1) ||
              (viewType === 'view' && !isPartialMode)
            ">
              <template #header>
                <div class="drawerContent-title">
                  <span class="line"></span>
                  <span>确认需求交付</span>
                </div>
              </template>
              <div class="flex">
                <el-form-item prop="superiorList" label="直属上级" class="inputBorder">
                  <lineReveals :disabled="isEdit" :canDelete="isEdit" v-model:optionsList="formListData.superiorList"
                    style="width: 300px" />
                </el-form-item>
                <el-form-item label="视觉伙伴" prop="visualPartnerList" style="margin-left: auto">
                  <SWSelectPeople :disabled="!isEdit" v-model="formListData.visualPartnerList" placeholder="请选择"
                    style="width: 300px" :roleId="roles.getRole('主图视觉')" :showDisabledBg="true" />
                </el-form-item>
              </div>
            </el-card>
          </el-form>
        </div>
        <!-- 快照生成 -->
        <el-card shadow="never" class="drawerContent" v-if="viewType === 'view' && !isPartialMode"
          :header-class="!snapShot.fileUrl ? 'noLine' : ''" :body-class="!snapShot.fileUrl ? 'noContent' : ''"
          v-loading="formLoading">
          <template #header>
            <div class="drawerContent-title">
              <span class="line"></span>
              <span>快照生成</span>
              <!-- <el-button type="primary" @click="createSnapshot" v-if="canCreateSnapShot" style="margin-left: auto">
              <img :src="cameraSvg" class="mr4px" />
              快照生成
            </el-button> -->
            </div>
          </template>
          <el-image v-if="snapShot.fileUrl" :src="snapShot.fileUrl" style="width: 54px; height: 54px"
            :preview-teleported="true" :preview-src-list="[snapShot.fileUrl]" />
        </el-card>
        <!-- 快照生成记录  -->
        <el-card shadow="never" class="drawerContent" v-loading="formLoading"
          :header-class="snapShotRecords?.length === 0 ? 'noLine' : ''"
          :body-class="snapShotRecords?.length === 0 ? 'noContent' : ''" v-if="viewType === 'view' && !isPartialMode">
          <template #header>
            <div class="drawerContent-title">
              <span class="line"></span>
              <span>快照操作记录</span>
            </div>
          </template>
          <snapShotTimeLine :examineRecords="snapShotRecords" v-if="snapShotRecords.length" />
        </el-card>
      </div>

      <div class="snapshotHiddenWrapper">
        <Snapshot ref="snapshotRef" :form-data="formData" :form-list-data="formListData"
          :target-features="targetFeatures" :target-cares="targetCares" :main-image-list="mainImageList"
          :feature-card-list="featureCardList" :competitor-card-list="competitorCardList"
          :selling-point-card-list="sellingPointCardList" />
      </div>
      <addAnalyseDialog ref="addAnalyseDialogRef" @success="handleConfirm" :productFeatureList="featureCardList"
        :productComparisonList="competitorCardList" :productSellingPointList="sellingPointCardList" />
    </template>
    <template #button>
      <div class="flex justify-end">
        <el-button @click="handleCancel">{{ viewType === 'view' ? '关 闭' : '取 消' }}</el-button>
        <template v-if="!isReadonly">
          <el-button :disabled="formLoading" :type="step === 1 ? 'primary' : ''" @click="handleStep">
            {{ step === 1 ? '下一步' : '上一步' }}
          </el-button>
          <el-button :disabled="formLoading" type="primary" @click="submitForm" v-if="step === 2">
            {{ viewType === 'create' ? '保 存' : '提 交' }}
          </el-button>
        </template>
      </div>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'MainImageAnalyseDetails' }
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as mainImageApi from '@/api/oa/new/mainImageAnalyse'
import { commonUpload } from '@/api/common/upload'
import { Plus } from '@element-plus/icons-vue'
import { cloneDeep } from 'lodash-es'
import { unref } from 'vue'

import UploadImg from '../components/uploadImg.vue'
import Transfer from '@/components/common/upload/transfer.vue'
import Snapshot from '../components/snapshot.vue'
import addAnalyseDialog from '../components/genericAddEditDialog.vue'

import del from '@/assets/imgs/oa/mainImg/del.svg'
import add from '@/assets/imgs/oa/mainImg/add.svg'
// import featureCard from '../components/featureCard.vue'
// import competitorCard from '../components/competitorCard.vue'
// import sellingPointCard from '../components/sellingPointCard.vue'

import snapShotTimeLine from '../components/snapShotTimeLine.vue'
// import ProductFeatureDescriptions from '../components/productFeatureDescriptions.vue'
import GenericDescription, { DescriptionField } from '../components/genericDescription.vue'
import Draggable from 'vuedraggable'

import { toPng } from 'html-to-image'

// 选择运营人员
import SWSelectPeople from '@/components/template/table/components/lineStaffs.vue'
import lineReveals from '@/components/template/table/components/lineReveals.vue'
import { selectWdtGoodsList } from '@/api/supplier/qcManagement/qcDailyReport'
// 获取当前用户
import { useUserStore } from '@/store/modules/user'
import { useLoadingStore } from '@/store/modules/loading'
const userStore = useUserStore()
const { showLoading, hideLoading } = useLoadingStore()

// 1. 产品特点 (featureCard.vue)
const featureFields: DescriptionField[] = [
  { label: '属性（款式，材质，工艺，参数）', key: 'attributeType' },
  { label: '解决人群痛点', key: 'attributeUse' },
  // { label: '用处的优势', key: 'advantage' }
]

// 2. 竞品分析 (competitorCard.vue)
const competitorFields: DescriptionField[] = [
  // forms.mainImageInfo.fileUrl (使用嵌套路径)
  { label: '是否有竞品图', key: 'sfImage',isBoolean: true },
  { label: '图片', key: 'mainImageInfo.fileUrl', isImage: true },
  // forms.competitorAdvantage
  { label: '优势', key: 'competitorAdvantage' },
  // forms.competitorLearn
  { label: '可取之处', key: 'competitorLearn' },
  // forms.competitorUrl
  { label: '竞品链接', key: 'competitorUrl', isLink: true }
]

// 3. 本品主图卖点方向和透出顺序 (sellingPointCard.vue)
const sellingPointFields: DescriptionField[] = [
  // forms.mainImageInfo.fileUrl
  { label: '是否有图片', key: 'sfMainImage',isBoolean: true },
  { label: '图片', key: 'mainImageInfo.fileUrl', isImage: true },
  // forms.sellingPointRef
  { label: '图片参考点', key: 'sellingPointRef' },
  // forms.highlightPoint
  { label: '运营主图需求', key: 'highlightPoint' },
  { label: '图片类型', key: 'imgType' },
  { label: '建议拍摄颜色', key: 'suggestColor' },
  // forms.mainImageCopy
  { label: '主图文案', key: 'mainImageCopy' },
 
  
]
// 权限
const roles = inject<any>('roles')

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const detailsRef = ref<any>()
const formRef = ref()
const formListRef = ref()
const addAnalyseDialogRef = ref()
const snapshotRef = ref<any>()

const drawerTitle = ref('')
const viewType = ref<'create' | 'updateAll' | 'view' | 'partView'>('view')
const isEdit = ref(true)
const formLoading = ref(false)
const step = ref(1)
const showType = ref<string>()
const mainId = ref('') // 主图id
const isUnblock = ref(0)

const isReadonly = computed(() => ['view'].includes(viewType.value))
const isPartialMode = computed(() => Boolean(showType.value))

const formData = ref<any>({
  store: '',
  productCode: [] as any,
  operator: '',
  operatorList: [],
  mainDirection: '',
  mainColor: '',
  mainImageInfo: '',
  audienceFeatures: [],
  audienceFocus: [],
  remark: '',
  coreDifferencesSellingPoints: ''
})
const mainImageList = ref<any>([])
const operatorsList = ref<any>([])
const formListData = ref({
  features: [],
  competitor: [],
  sellingPoint: [],
  remarks: '',
  connectionTime: '',
  attendeesPersonnel: '',
  attendeesPersonnelList: [],
  superior: '',
  superiorList: [],
  visualPartner: '',
  visualPartnerList: [],
})

/**目标人群 特点/关心 列表 */
const targetFeatures = ref<any[]>([{ value: '' }])
const targetCares = ref<any[]>([{ value: '' }])

const featureCardList = ref<any>([])
const competitorCardList = ref<any>([])
const sellingPointCardList = ref<any>([])

const snapShot = ref<any>({})
const snapShotRecords = ref<any>([])

const dataValue = computed(() => ({
  step: step.value,
  formData: formData.value,
  formListData: formListData.value,
  targetFeatures: targetFeatures.value,
  targetCares: targetCares.value,
  mainImageList: mainImageList.value,
  featureCardList: featureCardList.value,
  competitorCardList: competitorCardList.value,
  sellingPointCardList: sellingPointCardList.value,
  snapShot: snapShot.value
}))
const bukValue = ref<any>({})
const shouldAutoSnapshot = computed(() => isEdit.value && isUnblock.value === 1)
const title = computed(() => drawerTitle.value)

provide('MainImageAnalyseDetails', {
  dataValue,
  bukValue,
  viewType,
  title,
  loading: formLoading
})

/** 打开详情 */
const openDrawer = (type: string, id?: string, part?: string) => {
  detailsRef.value?.openDrawer(
    async () => {
      getSelectOptions()
      viewType.value = (type as any) || 'view'
      drawerTitle.value =
        type === 'create' ? '新增' : type === 'updateAll' ? '编辑' : type === 'view' ? '查看' : ''
      showType.value = undefined
      formLoading.value = false
      step.value = 1
      if (part) {
        showType.value = part
      }
      if (id) {
        mainId.value = id
        formLoading.value = true
        try {
          const res = await mainImageApi.getNewProductMainImageById(id)
          formData.value = {
            ...res,
            productCode: res.productCode?.split(',') || [],
            operatorList: res.operatorList.map((user: any) => ({
              avatarOrigin: user.avatarOrigin,
              userId: user.userId,
              name: user.name
            }))
          }
          if (res.audienceFeatures) {
            targetFeatures.value = res.audienceFeatures.map((item) => ({
              value: item
            }))
          } else {
            targetFeatures.value = [{ value: '' }]
          }
          if (res.audienceFocus) {
            targetCares.value = res.audienceFocus.map((item) => ({
              value: item
            }))
          } else {
            targetCares.value = [{ value: '' }]
          }
          mainImageList.value = res.mainImageInfo ? [res.mainImageInfo] : []

          // 本产品特点/竞品分析/本品卖点
          await Promise.all([
            getfeatureCardList(),
            getcompetitorCardList(),
            getsellingPointCardList()
          ])

          // 视觉相关
          snapShot.value.fileUrl = res.lateatSnapshot || ''
          const visualData = await mainImageApi.getVisualInfo(id)
          if (visualData) {
            isUnblock.value = Number(visualData?.isUnblock ?? 0)
            const {
              connectionTime,
              remarks,
              attendeesPersonnel,
              superior,
              visualPartner,
              attendeesPersonnelList,
              superiorList,
              visualPartnerList
            } = visualData
            formListData.value = Object.assign(formListData.value, {
              connectionTime,
              remarks,
              attendeesPersonnel,
              superior,
              visualPartner,
              attendeesPersonnelList: attendeesPersonnelList || [],
              superiorList: superiorList || [],
              visualPartnerList: visualPartnerList || []
            })
          } else {
            isUnblock.value = 0
          }

          await getSnapShotList()

          if (part) {
            drawerTitle.value = `货品编码:${res.productCode || ''}`
          }
        } finally {
          formLoading.value = false
        }
      } else {
        mainId.value = ''
        isUnblock.value = 0
        const { avatarUrl, userNo, realName } = userStore.user
        formData.value.operatorList = [
          {
            avatarOrigin: avatarUrl,
            userId: userNo,
            name: realName
          }
        ]
        formData.value.operator = formData.value.operatorList[0].userId
        mainImageList.value = []
        featureCardList.value = []
        competitorCardList.value = []
        sellingPointCardList.value = []
        snapShot.value = {}
        snapShotRecords.value = []
      }
      isEdit.value = type !== 'view'
      snapshotState()
    },
    () => {
      nextTick(() => {
        formRef.value?.clearValidate()
        formListRef.value?.clearValidate()
      })
    }
  )
}

const snapshotState = () => {
  bukValue.value = cloneDeep(unref(dataValue))
}

const scrollToTop = () => {
  nextTick(() => {
    const wrap = detailsRef.value?.$el?.querySelector('.el-scrollbar__wrap') as HTMLElement | null
    wrap?.scrollTo({ top: 0 })
  })
}

// 新增
const targetAdd = (type: string) => {
  if (type === 'targetFeatures') {
    targetFeatures.value.push({ value: '' })
  } else {
    targetCares.value.push({ value: '' })
  }
}
// 删除
const targetDel = (type: string, index: number) => {
  if (type === 'targetFeatures') {
    targetFeatures.value.splice(index, 1)
    formData.value.audienceFeatures.splice(index, 1)
  } else {
    targetCares.value.splice(index, 1)
    formData.value.audienceFocus.splice(index, 1)
  }
}

const handleParams = () => {
  const params = {
    ...formData.value,
    mainImageInfo: mainImageList.value[0],
    operator: formData.value.operatorList.map((user: any) => user.userId).join(','),
    productCode: formData.value.productCode?.join(',') || ''
  }

  params.audienceFeatures = []
  params.audienceFocus = []
  targetFeatures.value.forEach((item) => {
    if (item.value) params.audienceFeatures.push(item.value)
  })
  targetCares.value.forEach((item) => {
    if (item.value) params.audienceFocus.push(item.value)
  })
  return params
}

// 上一步下一步切换
const handleStep = async () => {
  if (step.value === 1) {
    if (!formRef.value) return
    const valid = await formRef.value.validate()
    if (!valid) return
    formLoading.value = true
    try {
      if (viewType.value === 'create' && !mainId.value) {
        const params = handleParams()
        const res = await mainImageApi.addNewProductMainImageList(params)
        mainId.value = res.id
      } else {
        const params = handleParams()
        await mainImageApi.updateNewProductMainImageList({ id: mainId.value, ...params })
      }
      message.success('保存成功')
      step.value = 2
      scrollToTop()

      if (formData.value.operatorList) {
        const ids = formData.value.operatorList.map((user: any) => user.userId)
        const leader = await mainImageApi.selectSuperiorList(ids)
        if (leader) {
          formListData.value.superiorList = leader
          formListData.value.superior = leader.map((user: any) => user.userId).join(',')
        }
      }
      snapshotState()
    } catch {
      // ignore
    } finally {
      formLoading.value = false
    }
  } else {
    step.value = 1
    scrollToTop()
  }
}

const getfeatureCardList = async () => {
  const params = {
    mainId: mainId.value
  }
  const res = await mainImageApi.getProductFeatureList(params)
  featureCardList.value = res.records
}
const getcompetitorCardList = async () => {
  const params = {
    mainId: mainId.value,
    type: 1
  }
  const res = await mainImageApi.getProductComparisonList(params)
  competitorCardList.value = res.records
}
const getsellingPointCardList = async () => {
  const params = {
    mainId: mainId.value,
    type: 2
  }
  const res = await mainImageApi.getProductComparisonList(params)
  sellingPointCardList.value = res.records
}
const handleConfirm = async (type: string) => {
  if (type === 'features') {
    await getfeatureCardList()
  } else if (type === 'competitor') {
    await getcompetitorCardList()
  } else {
    await getsellingPointCardList()
  }
  snapshotState()
}
// 删除操作
const handleDel = async (id: string, type: string) => {
  await message.confirm('确定是否删除该条数据？')
  if (type === 'features') {
    await mainImageApi.deleteProductFeature({ id }).catch(() => { })
    message.success('删除成功')
    await getfeatureCardList()
  } else if (type === 'competitor') {
    await mainImageApi.deleteProductComparison({ id }).catch(() => { })
    message.success('删除成功')
    await getcompetitorCardList()
  } else {
    await mainImageApi.deleteProductComparison({ id }).catch(() => { })
    message.success('删除成功')
    await getsellingPointCardList()
  }
  snapshotState()
}
// 新增按钮点击
const addBtnClick = (type: string, id?: string) => {
  if (!type) return

  const list =
    type === 'features'
      ? featureCardList.value
      : type === 'competitor'
        ? competitorCardList.value
        : sellingPointCardList.value

  let num = 0

  if (id) {
    const current = list.find((item: any) => item.id === id)
    if (current && current.orderNum != null) {
      num = Number(current.orderNum) || 0
    }
  } else if (list.length) {
    const last = list[list.length - 1]
    if (last && last.orderNum != null) {
      num = Number(last.orderNum) || list.length
    } else {
      num = list.length
    }
  }

  addAnalyseDialogRef.value.open(type, mainId.value, id, num)
}
defineExpose({ open: openDrawer })

const WdtGoodsList = ref<any>([])
provide('WdtGoodsList', WdtGoodsList)
const getSelectOptions = () => {
  selectWdtGoodsList().then((res: any) => {
    if (res && res.length) {
      WdtGoodsList.value = res.map((goods: any) => ({
        label: goods.goodsNo,
        value: goods.goodsNo
      }))
    }
  })
}

// 校验图片上传
const validateImg = (_rule: any, _value: any, callback: any) => {
  if (mainImageList.value?.length === 0) {
    callback(new Error('请上传产品款式图'))
  } else {
    callback()
  }
}

const emitValidate = () => {
  formRef.value && formRef.value.validateField('mainImageInfo')
}
const formRules = reactive({
  store: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
  productCode: [{ required: true, message: '请选择货品编码', trigger: 'blur' }],
  operatorList: [{ required: true, message: '请输入运营人员', trigger: 'blur' }],
  mainDirection: [{ required: false, message: '请输入连接主打方向', trigger: 'blur' }],
  mainColor: [{ required: false, message: '请输入主推色', trigger: 'blur' }],
  mainImageInfo: [{ required: true, validator: validateImg, trigger: 'blur' }],
  remark: [{ required: false, message: '请输入运营备注', trigger: 'blur' }]
})
const formListRules = reactive({
  connectionTime: [{ required: true, message: '请选择对接时间', trigger: 'blur' }],
  attendeesPersonnelList: [{ required: true, message: '请选择参会人员', trigger: 'blur' }],
  superiorList: [{ required: true, message: '请选择直属上级', trigger: 'blur' }],
  visualPartnerList: [{ required: true, message: '请选择视觉伙伴', trigger: 'blur' }]
})

// 提交视觉相关信息
const submitVisualInfo = async () => {
  await formListRef.value.validate()
  const params = {
    id: mainId.value,
    ...formListData.value,
    attendeesPersonnel: formListData.value.attendeesPersonnelList
      .map((user: any) => user.userId)
      .join(','),
    superior: formListData.value.superiorList.map((user: any) => user.userId).join(','),
    visualPartner: formListData.value.visualPartnerList.map((user: any) => user.userId).join(',')
  }
  await mainImageApi.submitVisualInfo(params)
}
/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  if (viewType.value === 'create') {
    message.success(t('common.createSuccess'))
    snapshotState()
    emit('success', true)
    detailsRef.value?.close()
  } else {
    try {
      if (shouldAutoSnapshot.value) {
        await message.confirm('请确认是否提交，提交后快照图片将不支持修改？')
      }
      showLoading()
      await submitVisualInfo()
      await autoSaveSnapshot()
      message.success(t('common.updateSuccess'))
      snapshotState()
      emit('success', true)
      detailsRef.value?.close()
    } catch (e) {
      return
    } finally {
      hideLoading()
    }
  }
}

const createSnapshot = async () => {
  const snapshotEl = snapshotRef.value?.getElement?.() as HTMLElement | undefined
  if (!snapshotEl) return

  try {
    const dataUrl = await toPng(snapshotEl, {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#ffffff'
    })

    // 将 dataUrl 转换为 Blob
    const response = await fetch(dataUrl)
    const blob = await response.blob()

    const formData = new FormData()
    formData.append('files', blob, `主图分析快照.png`)
    formData.append('code', 'OPERATION')

    const uploadResponse = await commonUpload(formData)
    if (uploadResponse?.data?.[0]) {
      snapShot.value = uploadResponse.data[0]
      await submitSnapShot()
    }
  } catch (error) {
    console.error('快照生成错误:', error)
    message.error('快照生成失败,请重试')
  }
}

const autoSaveSnapshot = async () => {
  if (!shouldAutoSnapshot.value) return
  try {
    await createSnapshot()
  } catch (error) {
    // ignore
  } finally {
  }
}
const submitSnapShot = async () => {
  if (snapShot.value.fileUrl) {
    const params = {
      mainId: mainId.value,
      imgUrl: snapShot.value.fileUrl,
      userIds: formData.value.operator
    }
    await mainImageApi.saveMainImageSnapshot(params)
    await getSnapShotList()
    snapshotState()
  }
}
const getSnapShotList = async () => {
  const snapShotData = await mainImageApi.querySnapshotByMainId({ mainId: mainId.value })
  if (snapShotData) {
    snapShotRecords.value = snapShotData
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    store: '',
    productCode: [] as any,
    operator: '',
    operatorList: [],
    mainDirection: '',
    mainColor: '',
    mainImageInfo: '',
    audienceFeatures: [],
    audienceFocus: [],
    remark: '',
    coreDifferencesSellingPoints: ''
  }
  formListData.value = {
    features: [],
    competitor: [],
    sellingPoint: [],
    remarks: '',
    connectionTime: '',
    attendeesPersonnel: '',
    attendeesPersonnelList: [],
    superior: '',
    superiorList: [],
    visualPartner: '',
    visualPartnerList: []
  }
  formRef.value?.resetFields()
  formListRef.value?.resetFields()
  operatorsList.value = []
  mainImageList.value = []
  targetFeatures.value = [{ value: '' }]
  targetCares.value = [{ value: '' }]
  featureCardList.value = []
  competitorCardList.value = []
  sellingPointCardList.value = []
  snapShotRecords.value = []
  snapShot.value = {}
  step.value = 1
  mainId.value = ''
  isUnblock.value = 0
  showType.value = undefined
  isEdit.value = true
  drawerTitle.value = ''
  snapshotState()
}

const handleCancel = () => {
  detailsRef.value?.close()
}

const handleClosed = () => {
  resetForm()
  emit('success')
}

// 拖拽结束事件
const onCardDragEnd = async (event: any, listKey: string) => {
  if (!listKey || !isEdit.value) return
  // 核心判断：如果新旧索引一致，说明排序没变，直接返回
  if (event.newIndex === event.oldIndex) return
  let sourceList: any[] = []
  sourceList =
    listKey === 'features'
      ? featureCardList.value
      : listKey === 'competitor'
        ? competitorCardList.value
        : sellingPointCardList.value
  if (!sourceList.length) return

  // const normalizedList = sourceList.map((item, index) => ({
  //   ...item,
  //   mainId: mainId.value,
  //   orderNum: index + 1,
  //   ...(listKey === 'competitor' ? { type: 1 } : listKey === 'sellingPoint' ? { type: 2 } : {})
  // }))
  const normalizedList = sourceList.map((item, index) => ({
    id: item.id,
    orderNum: index + 1
  }))
  try {
    showLoading()
    if (listKey === 'competitor' || listKey === 'sellingPoint') {
      await mainImageApi.batchSortComparison(normalizedList)
      // if (type === 1) {
      //   competitorCardList.value = normalizedList
      // } else {
      //   sellingPointCardList.value = normalizedList
      // }
    } else {
      await mainImageApi.batchSortFeature(normalizedList)
    }
    message.success('排序更新成功')
    snapshotState()
  } catch (error) {
    console.error('排序更新失败:', error)
    if (listKey === 'features') {
      await getfeatureCardList()
    } else if (listKey === 'competitor') {
      await getcompetitorCardList()
    } else {
      await getsellingPointCardList()
    }
  } finally {
    hideLoading()
  }
}
</script>

<style lang="less" scoped>
.longLabel{
  :deep(.el-form-item__label) {
    line-height: 16px;
    text-align: right;
  }
}
// .main-image-analyse-details {
//   padding: 20px;
// }
.main-image-analyse-details {
  :deep(.el-card) {
    .el-card__header {
      padding: 16px 20px !important;
    }

    .el-card__body {
      padding: 10px !important;
    }

    &.card-items {
      .el-card__body {
        padding: 10px 20px !important;
      }
    }
  }
}

.drawerContent {
  border-radius: 8px;
  border: none !important;
  margin-bottom: 20px;

  :deep(.noContent) {
    display: none;
  }

  :deep(.noLine) {
    border-bottom: none;
  }

  &-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 700;

    &.center {
      margin-bottom: -20px;
    }

    .line {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 6px;
    }

    .commonAddBtn {
      margin-left: auto;
      width: 68px;
    }
  }

  &-content {
    :deep(.el-form-item__content) {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }

  .gray {
    width: 875px;
    height: 1px;
    background: #eceaea;
    margin: 14px 0;
  }

  .btns {
    display: flex;
    flex-wrap: nowrap;

    .el-input {
      flex: 1;
    }

    .btn {
      width: 34px;
      height: 32px;
      background: #0064ff;
      border-radius: 4px;
      opacity: 0.07;
      margin-left: 16px;
      cursor: pointer;

      &.del {
        background: #eb3737;
      }
    }

    img {
      cursor: pointer;
      position: absolute;
      right: 10px;
    }
  }

  :deep(.el-textarea) {
    .el-textarea__inner {
      color: #333;
    }

    &.is-disabled {
      .el-textarea__inner {
        color: #666;
      }
    }
  }

  :deep(.el-input.is-disabled) {
    .el-input__inner {
      color: #666;
      -webkit-text-fill-color: inherit;
    }
  }
}

.snapshotHiddenWrapper {
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
  z-index: -1;
  overflow: auto;
}

.dialogFormItemWidth {
  width: 100%;
}

.inputBorder {
  :deep(.el-form-item__content) {
    border: 1.2px solid var(--el-border-color);
    box-shadow: 0 0 0 1px var(--el-select-disabled-border) inset;
    border-radius: 5px;
    padding: 3px 5px;
    box-sizing: border-box;
    height: 34px;
    background: #f8f8f9;
  }
}

:deep(.el-form) {

  // 添加 Draggable 容器的样式，确保卡片能像网格布局一样排列
  .draggable-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
    width: 100%;
  }
}

:deep(.card_info) {
  background-color: unset;

  .el-card__body {
    padding: 6px 0;
    height: calc(100% - 16px);
  }
}
</style>
