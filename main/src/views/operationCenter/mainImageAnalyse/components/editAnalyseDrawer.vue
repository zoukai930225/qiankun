<template>
  <div>
    <SWDrawer v-model="drawerVisible" :title="drawerTitle" class="drawer" width="968" @close="reset">
      <el-scrollbar ref="scrollRef">
        <div ref="infoRef">
          <!-- 第一步 填写主图相关 -->
          <div class="step1" v-if="step === 1 || formType === 'view'">
            <el-form class="dialogForm" :class="{ editForm: isEdit }" ref="formRef" v-loading="formLoading"
              :model="formData" :rules="formRules" label-width="120px" label-position="right">
              <!-- 主图 -->
              <el-card shadow="never" class="drawerContent" v-if="formType !== 'update'">
                <template #header>
                  <div class="drawerContent-title">
                    <span class="line"></span>
                    <span>主图</span>
                  </div>
                </template>
                <div class="flex">
                  <el-form-item prop="store" label="店铺" required>
                    <StoreRangePlus v-model="formData.store" width="300px" :disabled="!isEdit" :showAllChannels="false"
                      placeholder="请选择店铺" />
                  </el-form-item>
                  <el-form-item label="货品编码" prop="productCode" style="margin-left: auto">
                    <el-input style="width: 300px" placeholder="请输入" v-model="formData.productCode"
                      :disabled="!isEdit" />
                  </el-form-item>
                </div>
                <el-form-item label="运营人员" prop="operatorList">
                  <SWSelectPeople v-if="formData.operator" :disabled="!isEdit" :tags="6" v-model="formData.operatorList"
                    placeholder="请选择运营人员" :roleId="roles.getRole('主图运营')" :showDisabledBg="true" />
                </el-form-item>
                <el-form-item label="链接主打方向" prop="mainDirection">
                  <s-text-area :disabled="!isEdit" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入"
                    v-model="formData.mainDirection" />
                </el-form-item>
                <el-form-item label="主推色" prop="mainColor">
                  <s-text-area :disabled="!isEdit" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入"
                    v-model="formData.mainColor" />
                </el-form-item>
                <el-form-item label="产品款式图(准确)" prop="mainImageInfo">
                  <UploadImg v-model:modelValue="mainImageList" :limit="1" :uploadDisabled="!isEdit"
                    @validate="emitValidate" />
                </el-form-item>
              </el-card>
              <!-- 目标人群 -->
              <el-card shadow="never" class="drawerContent" v-if="formType !== 'update'">
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
              <el-card shadow="never" class="drawerContent" v-if="formType !== 'update'">
                <template #header>
                  <div class="drawerContent-title">
                    <span class="line"></span>
                    <span>运营备注</span>
                  </div>
                </template>
                <el-form-item label="运营备注" prop="remark">
                  <s-text-area :autosize="{ minRows: 3, maxRows: 4 }" v-model="formData.remark" :disabled="!isEdit" />
                </el-form-item>
              </el-card>
            </el-form>
          </div>
          <!-- 第二步 填写分析相关 -->
          <div class="step2" v-if="step === 2 || formType === 'view' || formType === 'update'">
            <el-form class="dialogForm" :class="{ editForm: isEdit }" ref="formListRef" v-loading="formLoading"
              :model="formListData" :rules="formListRules" label-width="120px" label-position="right">
              <!-- 产品特点 feartureCard-->
              <el-card shadow="never" class="drawerContent" :header-class="featureCardList.length === 0 ? 'noLine' : ''"
                :body-class="featureCardList.length === 0 ? 'noContent' : ''"
                v-if="(formType == 'update' && showType === 'features') || formType !== 'update'">
                <template #header>
                  <div class="drawerContent-title">
                    <span class="line"></span>
                    <span>本产品特点(按重要程度填写,1为最核心)</span>
                    <el-button type="primary" :icon="Plus" class="commonAddBtn" @click="addBtnClick('features')"
                      v-if="isEdit">新增</el-button>
                  </div>
                </template>

                <el-form-item label-width="0" prop="features" class="drawerContent-content">
                  <!-- <div ref='featureCardContainer' class="content">
                  <featureCard :forms="n" :index='index' v-for="(n,index) in featureCardList" :key="index" @delete="handleDel" :isEdit="isEdit" @update="addBtnClick"/>
                </div> -->
                  <featureCard :forms="n" :index="index" v-for="(n, index) in featureCardList" :key="index"
                    @delete="handleDel" :isEdit="isEdit" @update="addBtnClick" />
                </el-form-item>
              </el-card>
              <!-- 竞品分析  competitorCard-->
              <el-card shadow="never" class="drawerContent"
                :header-class="competitorCardList.length === 0 ? 'noLine' : ''"
                :body-class="competitorCardList.length === 0 ? 'noContent' : ''"
                v-if="(formType == 'update' && showType === 'competitor') || formType !== 'update'">
                <template #header>
                  <div class="drawerContent-title">
                    <span class="line"></span>
                    <span>竞品分析</span>
                    <el-button type="primary" :icon="Plus" class="commonAddBtn" @click="addBtnClick('competitor')"
                      v-if="isEdit">新增</el-button>
                  </div>
                </template>

                <el-form-item label-width="0" prop="competitor" class="drawerContent-content">
                  <!-- <div ref='competitorCardContainer' class="drawerContent-content">
                  <competitorCard  :forms="n" :index='index' v-for="(n,index) in competitorCardList" :key="index" @delete="handleDel" :isEdit="isEdit" @update="addBtnClick"/>
                </div> -->
                  <competitorCard :forms="n" :index="index" v-for="(n, index) in competitorCardList" :key="index"
                    @delete="handleDel" :isEdit="isEdit" @update="addBtnClick" />
                </el-form-item>
              </el-card>
              <!-- 主图卖点 sellingPointCard-->
              <el-card shadow="never" class="drawerContent"
                :header-class="sellingPointCardList.length === 0 ? 'noLine' : ''" v-if="
                  (formType == 'update' && showType === 'sellingPoint') || formType !== 'update'
                " :body-class="sellingPointCardList.length === 0 ? 'noContent' : ''">
                <template #header>
                  <div class="drawerContent-title">
                    <span class="line"></span>
                    <span>本品主图卖点方向和透出顺序</span>
                    <el-button type="primary" :icon="Plus" class="commonAddBtn" @click="addBtnClick('sellingPoint')"
                      v-if="isEdit">新增</el-button>
                  </div>
                </template>

                <el-form-item label-width="0" prop="sellingPoint" class="drawerContent-content">
                  <!-- <div ref='sellingPointCardContainer' class="drawerContent-content">
                  <sellingPointCard  :forms="n" :index='index' v-for="(n,index) in sellingPointCardList" :key="index" @delete="handleDel" :isEdit="isEdit" @update="addBtnClick"/>
                </div> -->
                  <sellingPointCard :forms="n" :index="index" v-for="(n, index) in sellingPointCardList" :key="index"
                    @delete="handleDel" :isEdit="isEdit" @update="addBtnClick" />
                </el-form-item>
              </el-card>
              <!-- 视觉人员对接 -->
              <el-card shadow="never" class="drawerContent" v-if="formType === 'updateAll' || formType === 'view'">
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
                  <s-text-area :disabled="!isEdit" :autosize="{ minRows: 3, maxRows: 4 }" show-word-limit
                    maxlength="100" placeholder="请输入" v-model.trim="formListData.remarks" />
                </el-form-item>
              </el-card>
              <!-- 确认需求交付 -->
              <el-card shadow="never" class="drawerContent" v-if="formType === 'updateAll' || formType === 'view'">
                <template #header>
                  <div class="drawerContent-title">
                    <span class="line"></span>
                    <span>确认需求交付</span>
                  </div>
                </template>
                <div class="flex">
                  <el-form-item prop="superiorList" label="上级主管" class="inputBorder">
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
        </div>
        <!-- 快照生成 -->
        <el-card shadow="never" class="drawerContent" v-if="formType === 'view'"
          :header-class="!snapShot.fileUrl ? 'noLine' : ''" :body-class="!snapShot.fileUrl ? 'noContent' : ''"
          v-loading="formLoading">
          <template #header>
            <div class="drawerContent-title">
              <span class="line"></span>
              <span>快照生成</span>
              <el-button type="primary" @click="createSnapshot" v-if="canCreateSnapShot" style="margin-left: auto">
                <img :src="cameraSvg" class="mr4px" />
                快照生成
              </el-button>
            </div>
          </template>
          <!-- <el-form-item label="照片" label-width="120px"  v-if="snapShot.fileUrl">
            
          </el-form-item> -->
          <el-image v-if="snapShot.fileUrl" :src="snapShot.fileUrl" style="width: 54px; height: 54px"
            :preview-teleported="true" :preview-src-list="[snapShot.fileUrl]" />
        </el-card>
        <!-- 快照生成记录  -->
        <el-card shadow="never" class="drawerContent" v-loading="formLoading"
          :header-class="snapShotRecords?.length === 0 ? 'noLine' : ''"
          :body-class="snapShotRecords?.length === 0 ? 'noContent' : ''" v-if="formType === 'view'">
          <template #header>
            <div class="drawerContent-title">
              <span class="line"></span>
              <span>快照操作记录</span>
            </div>
          </template>
          <snapShotTimeLine :examineRecords="snapShotRecords" v-if="snapShotRecords.length" />
        </el-card>
      </el-scrollbar>
      <template #footer>
        <el-button @click="drawerVisible = false">{{
          formType === 'view' ? '关 闭' : '取 消'
        }}</el-button>
        <div v-if="formType !== 'view'" class="ml10px">
          <el-button :disabled="formLoading" :type="step === 1 ? 'primary' : ''" @click="handleStep">{{ step === 1 ?
            '下一步' : '上一步' }}</el-button>
          <el-button :disabled="formLoading" type="primary" @click="submitForm" v-if="step === 2">{{
            formType === 'create' ? '保 存' : '提 交'
          }}</el-button>
        </div>
        <!-- <el-button v-if="formType === 'view' && canCreateSnapShot" :disabled="!snapShot.fileUrl" type="primary"
          @click="submitSnapShot">提交</el-button> -->
      </template>
    </SWDrawer>
  </div>

  <addAnalyseDialog ref="addAnalyseDialogRef" @confirm="handleConfirm" />
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as mainImageApi from '@/api/oa/new/mainImageAnalyse'
import { commonUpload } from '@/api/common/upload'
import { Plus } from '@element-plus/icons-vue'

import UploadImg from './uploadImg.vue'
import addAnalyseDialog from './addAnalyseDialog.vue'
import html2canvas from 'html2canvas'

import del from '@/assets/imgs/oa/mainImg/del.svg'
import add from '@/assets/imgs/oa/mainImg/add.svg'
import cameraSvg from '@/assets/svgs/common/camera.svg'

import featureCard from './featureCard.vue'
import competitorCard from './competitorCard.vue'
import sellingPointCard from './sellingPointCard.vue'

import snapShotTimeLine from './snapShotTimeLine.vue'

// 选择运营人员
import SWSelectPeople from '@/components/template/table/components/lineStaffs.vue'
import lineReveals from '@/components/template/table/components/lineReveals.vue'

// 获取当前用户
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

// 权限
const roles = inject<any>('roles')

// 是否可以生成快照
const canCreateSnapShot = computed(() => {
  if (roles.isMainImgVisual && formType.value == 'view') {
    const currentUserId = userStore.user.userNo as any
    console.log(formListData.value.visualPartner)
    return formListData.value.visualPartner?.split(',').includes(currentUserId)
  } else {
    return false
  }
})

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const scrollRef = ref()
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref<any>({
  store: '',
  productCode: '',
  operator: '',
  operatorList: [],
  mainDirection: '',
  mainColor: '',
  mainImageInfo: '',
  audienceFeatures: [],
  audienceFocus: [],
  remark: ''
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
  visualPartnerList: []
})
const formRef = ref()
const formListRef = ref()
const showType = ref()
const isEdit = ref(true)
const step = ref(1)
const mainId = ref('') // 主图id

// import Sortable from 'sortablejs'
// const featureCardContainer = ref()
// const competitorCardContainer = ref()
// const sellingPointCardContainer = ref()
// const initSortable = () => {
//   if (featureCardContainer.value) {
//     const sortableInstance = new Sortable(featureCardContainer.value, {
//       animation: 150,
//       onStart: function (evt) {
//         if (!isEdit.value) {
//           sortableInstance.option('disabled', true)
//         } else {
//           sortableInstance.option('disabled', false)
//         }
//       },
//       // 结束拖拽
//       onEnd: function (evt) {
//         if (!isEdit.value) return
//         console.log('end', evt)
//         const { oldIndex, newIndex } = evt
//         //调整 featureCardList 中元素的顺序
//         const item = featureCardList.value.splice(oldIndex, 1)[0]
//         featureCardList.value.splice(newIndex, 0, item)
//       }
//     })
//   }
//   if (competitorCardContainer.value) {
//     const sortableInstance = new Sortable(competitorCardContainer.value, {
//       animation: 150,
//       onStart: function (evt) {
//         if (!isEdit.value) {
//           sortableInstance.option('disabled', true)
//         } else {
//           sortableInstance.option('disabled', false)
//         }
//       },
//       // 结束拖拽
//       onEnd: function (evt) {
//         if (!isEdit.value) return
//         const { oldIndex, newIndex } = evt
//         //调整 featureCardList 中元素的顺序
//         const item = competitorCardList.value.splice(oldIndex, 1)[0]
//         competitorCardList.value.splice(newIndex, 0, item)
//       }
//     })
//   }
//   if (sellingPointCardContainer.value) {
//     const sortableInstance = new Sortable(sellingPointCardContainer.value, {
//       animation: 150,
//       onStart: function (evt) {
//         if (!isEdit.value) {
//           sortableInstance.option('disabled', true)
//         } else {
//           sortableInstance.option('disabled', false)
//         }
//       },
//       // 结束拖拽
//       onEnd: function (evt) {
//         if (!isEdit.value) return
//         const { oldIndex, newIndex } = evt
//         //调整 featureCardList 中元素的顺序
//         const item = sellingPointCardList.value.splice(oldIndex, 1)[0]
//         sellingPointCardList.value.splice(newIndex, 0, item)
//       }
//     })
//     if (!isEdit) {
//       sortableInstance.option('disabled', false)
//     }
//   }
// }

/**目标人群 特点/关心 列表 */
const targetFeatures = ref<any[]>([{ value: '' }])
const targetCares = ref<any[]>([{ value: '' }])
// 新增
const targetAdd = (type: string) => {
  if (type === 'targetFeatures') {
    // 目标人群 特点
    targetFeatures.value.push({ value: '' })
  } else {
    targetCares.value.push({ value: '' })
  }
}
// 删除
const targetDel = (type: string, index: number) => {
  if (type === 'targetFeatures') {
    // 目标人群 特点
    targetFeatures.value.splice(index, 1)
    formData.value.audienceFeatures.splice(index, 1)
  } else {
    targetCares.value.splice(index, 1)
    formData.value.audienceFocus.splice(index, 1)
  }
}

/** 打开drawer */
const open = async (type: string, id?: string, part?: string) => {
  drawerVisible.value = true
  await nextTick()
  drawerTitle.value =
    type === 'create' ? '新增' : type === 'updateAll' ? '编辑' : type === 'view' ? '查看' : ''
  formType.value = type
  const productCode = ref('')
  // 修改/查看 查数据
  if (id) {
    mainId.value = id
    formLoading.value = true
    try {
      // 主图相关数据获取
      const res = await mainImageApi.getNewProductMainImageById(id)
      formData.value = {
        ...res,
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
      }
      if (res.audienceFocus) {
        targetCares.value = res.audienceFocus.map((item) => ({
          value: item
        }))
      }
      mainImageList.value = res.mainImageInfo ? [res.mainImageInfo] : []

      productCode.value = res.productCode

      // 本产品特点/竞品分析/本品卖点
      getfeatureCardList()
      getcompetitorCardList()
      getsellingPointCardList()

      // 视觉相关
      snapShot.value.fileUrl = res.lateatSnapshot || ''
      const visualData = await mainImageApi.getVisualInfo(id)
      if (visualData) {
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
      }

      getSnapShotList()
    } finally {
      formLoading.value = false
    }
  } else {
    // 新增 运营默认为当前登录用户
    mainId.value = ''
    const { avatarUrl, userNo, realName } = userStore.user
    formData.value.operatorList = [
      {
        avatarOrigin: avatarUrl,
        userId: userNo,
        name: realName
      }
    ]
    formData.value.operator = formData.value.operatorList[0].userId
  }
  if (type === 'update') {
    showType.value = part
    // title 显示货品编码
    drawerTitle.value = `货品编码:${productCode.value}`
  }
  if (type === 'view') {
    isEdit.value = false
  } else {
    isEdit.value = true
  }
}

const handleParams = () => {
  const params = {
    ...formData.value,
    mainImageInfo: mainImageList.value[0],
    operator: formData.value.operatorList.map((user: any) => user.userId).join(',')
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
    // 当前是第一步 提交主图相关信息
    // 校验表单
    if (!formRef) return
    const valid = await formRef.value.validate()
    if (!valid) return
    // 校验通过 提交
    formLoading.value = true
    try {
      if (formType.value === 'create' && !mainId.value) {
        const params = handleParams()
        console.log(params)
        const res = await mainImageApi.addNewProductMainImageList(params)
        mainId.value = res.id
      } else {
        const params = handleParams()
        await mainImageApi.updateNewProductMainImageList({ id: mainId.value, ...params })
      }
      message.success('保存成功')
      step.value = 2
      formLoading.value = false
      // 滚动到顶部
      scrollRef.value.scrollTo({
        top: 0
      })

      // 根据运营人员查询上级列表
      if (formData.value.operatorList) {
        const ids = formData.value.operatorList.map((user: any) => user.userId)
        const leader = await mainImageApi.selectSuperiorList(ids)
        if (leader) {
          formListData.value.superiorList = leader
          formListData.value.superior = leader.map((user: any) => user.userId).join(',')
        }
      }
    } catch {
      formLoading.value = false
    }
  } else {
    // 当前是第二步
    step.value = 1
    // 滚动到顶部
    scrollRef.value.scrollTo({
      top: 0
    })
  }
}

/** 新增操作 dialog  产品特点/竞品分析/主图卖点*/
// 产品特点 列表
const featureCardList = ref<any>([])
//竞品分析 列表
const competitorCardList = ref<any>([])
// 主图卖点 列表
const sellingPointCardList = ref<any>([])
const addAnalyseDialogRef = ref()
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
  // 数据新增
  if (type === 'features') {
    // 本产品特点
    getfeatureCardList()
  } else if (type === 'competitor') {
    // 竞品分析
    getcompetitorCardList()
  } else {
    // 主图卖点
    getsellingPointCardList()
  }
}
// 删除操作
const handleDel = async (id: string, type: string) => {
  console.log(id, type)
  await message.confirm('确定是否删除该条数据？')
  if (type === 'features') {
    // 本产品特点
    await mainImageApi.deleteProductFeature({ id }).catch(() => { })
    message.success('删除成功')
    getfeatureCardList()
  } else if (type === 'competitor') {
    // 竞品分析
    await mainImageApi.deleteProductComparison({ id }).catch(() => { })
    message.success('删除成功')
    getcompetitorCardList()
  } else {
    // 主图卖点
    await mainImageApi.deleteProductComparison({ id }).catch(() => { })
    message.success('删除成功')
    getsellingPointCardList()
  }
}
// 新增按钮点击
const addBtnClick = (type: string, id?: string) => {
  if (type) {
    let num = 1
    if (type === 'features') {
      num = featureCardList.value.length
        ? featureCardList.value[featureCardList.value.length - 1].orderNum
        : 1
    } else if (type === 'competitor') {
      num = competitorCardList.value.length
        ? competitorCardList.value[competitorCardList.value.length - 1].orderNum
        : 1
    } else {
      num = sellingPointCardList.value.length
        ? sellingPointCardList.value[sellingPointCardList.value.length - 1].orderNum
        : 1
    }
    addAnalyseDialogRef.value.open(type, mainId.value, id, num)
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// watch(()=>featureCardList.value, () => {
//   nextTick(() => {
//     initSortable();
//   });
// }, {
//   immediate:true,
//   deep: true
//  });

// 表单校验规则

// 校验图片上传
const validateImg = (rule: any, value: any, callback: any) => {
  console.log(mainImageList.value)
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
  productCode: [{ required: true, message: '请输入货品编码', trigger: 'blur' }],
  operatorList: [{ required: true, message: '请输入运营人员', trigger: 'blur' }],
  mainDirection: [{ required: false, message: '请输入连接主打方向', trigger: 'blur' }],
  mainColor: [{ required: false, message: '请输入主推色', trigger: 'blur' }],
  mainImageInfo: [{ required: false, validator: validateImg, trigger: 'blur' }],
  remark: [{ required: false, message: '请输入运营备注', trigger: 'blur' }]
})
const formListRules = reactive({
  connectionTime: [{ required: true, message: '请选择对接时间', trigger: 'blur' }],
  attendeesPersonnelList: [{ required: true, message: '请选择参会人员', trigger: 'blur' }],
  superiorList: [{ required: true, message: '请选择上级主管', trigger: 'blur' }],
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
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (formType.value === 'create') {
    message.success(t('common.createSuccess'))
  } else {
    await submitVisualInfo()
    message.success(t('common.updateSuccess'))
  }
  reset()
  emit('success', true)
}

// 生成快照 并上传
const infoRef = ref()
const snapShot = ref<any>({})
const snapShotRecords = ref<any>([])
const loadingInstance = ref()
const createSnapshot = async () => {
  await message.confirm('请确认是否提交，提交后快照图片将不支持修改')
  loadingInstance.value = ElLoading.service({ fullscreen: true, text: '生成快照中...' })
  const canvas = await html2canvas(infoRef.value, {
    useCORS: true
  })
  // const img = canvas.toDataURL('image/png')
  // // 创建一个a标签模拟点击进行下载
  // const downloadLink = document.createElement('a')
  // downloadLink.id = 'imgDownload'
  // downloadLink.style.display = 'none'
  // downloadLink.href = img
  // downloadLink.download = '快照'
  // document.body.appendChild(downloadLink)
  // downloadLink.click()
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((blob) => resolve(blob), 'image/png', 1)
  )
  console.log(blob)
  if (blob) {
    // 上传到 OSS
    const formData = new FormData()
    formData.append('files', blob, `主图分析快照.png`)
    formData.append('code', 'OPERATION')

    const response = await commonUpload(formData) // 调用上传接口
    console.log('上传成功:', response.data[0].fileUrl)
    snapShot.value = response.data[0]
    submitSnapShot()
  }
}
const submitSnapShot = async () => {
  if (snapShot.value.fileUrl) {
    const params = {
      mainId: mainId.value,
      imgUrl: snapShot.value.fileUrl,
      userIds: formData.value.operator
    }
    mainImageApi.saveMainImageSnapshot(params).then((res: any) => {
      getSnapShotList()
      loadingInstance.value.close()
    })
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
    productCode: '',
    operator: '',
    operatorList: [],
    mainDirection: '',
    mainColor: '',
    mainImageInfo: '',
    audienceFeatures: [],
    audienceFocus: [],
    remark: ''
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
}

const reset = () => {
  resetForm()
  drawerVisible.value = false
  emit('success')
}
</script>

<style lang="less" scoped>
.dialogForm {}

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
</style>
