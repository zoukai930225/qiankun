<template>
  <el-form label-width="92px" :model="promoteForm" :rules="formRules" ref="formRef">
    <form-content-layout :layouts="layouts">
      <template #primary>
        <el-form label-width="90px" :model="addForm">
          <el-row>
            <el-col :span="12">
              <el-form-item label="商品ID" prop="goodsId">
                <el-input disabled v-model="addForm.goodsId" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="类目" prop="categoryName">
                <el-input disabled v-model="addForm.categoryName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="商品编码" prop="goodsCode">
                <el-input disabled v-model="addForm.goodsCode" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="商品名称" prop="goodsName">
                <el-input disabled v-model="addForm.goodsName" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="产品定位" prop="productPositioning">
                <s-text-area
                  disabled
                  v-model="addForm.productPositioning"
                  :autosize="{ minRows: 4, maxRows: 4 }"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="主图" prop="mainImg">
                <el-image
                  style="width: 180px"
                  fit="contain"
                  :src="(addForm.productImage && addForm.productImage.fileUrl) || ''"
                  :preview-src-list="[addForm.productImage && addForm.productImage.fileUrl]"
                  :preview-teleported="true"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template #basicInfo>
        <!-- 基本信息表单项（与推广详情共用一个外层 el-form） -->
        <el-row>
          <el-col :span="12">
            <el-form-item label="需求方" prop="demandSide">
              <el-input v-model="promoteForm.demandSide" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="交付时间" prop="versionTime">
              <el-date-picker
                style="width: 100%"
                v-model="promoteForm.versionTime"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择交付时间"
                size="default"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测图目的" prop="mappingPurpose">
              <el-input v-model="promoteForm.mappingPurpose" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="推广ID" prop="promotionId" :required="isClickRateSevenFilled">
              <el-input v-model="promoteForm.promotionId" placeholder="请输入" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测图时间" prop="mappingTime">
              <el-date-picker
                style="width: 100%"
                v-model="promoteForm.mappingTime"
                value-format="YYYY-MM-DD"
                type="date"
                placeholder="请选择时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="运营人员" prop="operationPersonnel">
              <SWSelectPeople
                :isEdit="true"
                v-model:modelValue="promoteForm[`operationPersonnels`]"
                :getSearchList="fetchPersonOptions"
                @select-people-change="selectPeopleChange('operationPersonnel')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="策划人员" prop="planningPersonnel">
              <SWSelectPeople
                :isEdit="true"
                v-model:modelValue="promoteForm[`planningPersonnels`]"
                :getSearchList="fetchPersonOptions"
                @select-people-change="selectPeopleChange('planningPersonnel')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设计人员" prop="designer">
              <SWSelectPeople
                :isEdit="true"
                v-model:modelValue="promoteForm[`designers`]"
                :getSearchList="fetchPersonOptions"
                @select-people-change="selectPeopleChange('designer')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="拍摄人员" prop="cameraCrew">
              <SWSelectPeople
                :isEdit="true"
                v-model:modelValue="promoteForm[`cameraCrews`]"
                :getSearchList="fetchPersonOptions"
                @select-people-change="selectPeopleChange('cameraCrew')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="修图人员" prop="latePersonnel">
              <SWSelectPeople
                :isEdit="true"
                v-model:modelValue="promoteForm[`latePersonnels`]"
                :getSearchList="fetchPersonOptions"
                @select-people-change="selectPeopleChange('latePersonnel')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="label-wrap" label="7天付费点击率" prop="clickRateSeven">
              <template #label>
                <span class="label-text">7天付费<br />点击率</span>
              </template>
              <el-input v-model="promoteForm.clickRateSeven" placeholder="请输入" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="label-wrap" label="7天点击转化率" prop="clickConversionRateSeven">
              <template #label>
                <span class="label-text">7天点击<br />转化率</span>
              </template>
              <el-input
                v-model="promoteForm.clickConversionRateSeven"
                placeholder="请输入"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="label-wrap" label="15天付费点击率" prop="clickRateFifteen">
              <template #label>
                <span class="label-text">15天付费<br />点击率</span>
              </template>
              <el-input v-model="promoteForm.clickRateFifteen" placeholder="请输入" type="number" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              class="label-wrap"
              label="15天点击转化率"
              prop="clickConversionRateFifteen"
            >
              <template #label>
                <span class="label-text">15天点击<br />转化率</span>
              </template>
              <el-input
                v-model="promoteForm.clickConversionRateFifteen"
                placeholder="请输入"
                type="number"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测图计划状态" prop="conclusionType" v-if="promoteForm.type == '1'">
              <el-input
                v-if="isLegacyConclusion(promoteForm.conclusionType)"
                :model-value="
                  legacyConclusionMap[promoteForm.conclusionType] || promoteForm.conclusionType
                "
                disabled
                placeholder="历史数据"
              >
                <template #append>
                  <el-button @click="promoteForm.conclusionType = ''">重选</el-button>
                </template>
              </el-input>

              <el-select v-else v-model="promoteForm.conclusionType" placeholder="请选择" clearable>
                <el-option label="继续测图" :value="5" />
                <el-option label="测图结束" :value="6" />
                <el-option label="运营暂无安排测图" :value="7" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="multiline-label-item" :label="'图片最终\n用途'" prop="imageName">
              <el-select v-model="promoteForm.imageName" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="dict in promotionImageNameOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="结论" prop="conclusion">
              <s-text-area
                v-model="promoteForm.conclusion"
                placeholder="请输入"
                :autosize="{ minRows: 4, maxRows: 4 }"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template #detail>
        <transition-group name="version" tag="div" class="detail-list">
          <div
            v-for="(detail, index) in promoteForm.versionList"
            :key="detail._key"
            class="detail-item"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="推广版本">
                  <el-input-number v-model="detail.version" disabled />
                </el-form-item>
                <el-button
                  v-if="promoteForm.versionList.length > 1"
                  class="del-btn"
                  type="danger"
                  link
                  @click="removeVersion(index)"
                >
                  <el-icon :size="18">
                    <Delete />
                  </el-icon>
                </el-button>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  :label="'车图'"
                  :prop="`versionList.${index}.imgs`"
                  :rules="[
                    {
                      type: 'array',
                      required: true,
                      min: 1,
                      message: '请上传车图片',
                      trigger: 'change'
                    }
                  ]"
                >
                  <UploadImgs
                    class="sw-upload-file"
                    :limit="999"
                    :bussiness-code="UPLOAD_FILE_BISSONESSCODE.PICTURE_GALLERY_PROMOTION"
                    v-model:modelValue="detail.imgs"
                    @update:modelValue="onImgsUpdate(index, $event)"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </transition-group>
      </template>
    </form-content-layout>
  </el-form>
</template>

<script setup lang="tsx">
// 应用于上传车图
import { ref, computed, onMounted } from 'vue'
import { ElButton } from 'element-plus'
import FormContentLayout from '@/layout/components/ContentLayout'
import UploadImgs from '@/components/SWUoloadFile/index.vue'
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { Plus, ArrowUp, ArrowDown } from '@element-plus/icons-vue'
import * as GalleryApi from '@/api/gallery'
import { getIntDictOptions } from '@/utils/dict'

const props = defineProps({ row: { type: Object, default: () => ({}) } })
const emit = defineEmits(['submit-success'])

const legacyConclusionMap: Record<number, string> = {
  1: '优化成功',
  2: '优化失败',
  3: '继续优化',
  4: '停止优化'
}

// 判断是否为历史数据
const isLegacyConclusion = (val: any) => {
  // 如果值存在，且在历史映射表中，则视为历史数据
  return val && legacyConclusionMap[Number(val)] !== undefined
}

const primaryExpanded = ref(false)
const togglePrimaryExpanded = () => {
  primaryExpanded.value = !primaryExpanded.value
}

const addForm = ref({
  goodsId: undefined,
  categoryCode: '',
  categoryName: undefined,
  goodsName: '',
  goodsCode: '',
  productPositioning: '',
  productImage: {},
  promotionImageMaxVersion: undefined
}) as any

const promoteForm = ref({
  demandSide: '',
  promotionId: '',
  mappingTime: '',
  operationPersonnel: '',
  planningPersonnel: '',
  cameraCrew: '',
  latePersonnel: '',
  designer: '',
  operationPersonnels: [],
  planningPersonnels: [],
  cameraCrews: [],
  latePersonnels: [],
  designers: [],
  clickRateSeven: '',
  clickConversionRateSeven: '',
  clickRateFifteen: '',
  clickConversionRateFifteen: '',
  mappingPurpose: '',
  conclusion: '',
  imgs: [],
  versionList: [{ version: 1, imgs: [] }],
  version: 1,
  versionTime: '',
  conclusionType: '',
  type: '',
  imageName: ''
}) as any

const promotionImageNameOptions = computed(() => getIntDictOptions('promotion_image_name'))

let versionUid = 1
const createVersionItem = (version: number) => ({ version, imgs: [] as any[], _key: versionUid++ })

// 当 7天付费点击率 有值时，推广ID、测图时间 必填
const requireWhenPaid7dExists = (fieldLabel: string) => {
  return (rule: any, value: any, callback: any) => {
    const hasPaid7d =
      promoteForm.value.clickRateSeven !== '' &&
      promoteForm.value.clickRateSeven !== null &&
      promoteForm.value.clickRateSeven !== undefined
    if (hasPaid7d && (value === '' || value === undefined || value === null)) {
      callback(new Error(`${fieldLabel}不能为空`))
    } else {
      callback()
    }
  }
}

const isClickRateSevenFilled = computed(() => {
  const v = promoteForm.value.clickRateSeven
  return v !== '' && v !== null && v !== undefined
})

const formRules = ref({
  promotionId: [{ validator: requireWhenPaid7dExists('推广ID'), trigger: 'blur' }],
  mappingTime: [{ trigger: 'change', required: true, message: '请输入测图时间' }],
  operationPersonnel: [{ required: true, message: '请选择运营人员', trigger: 'change' }],
  cameraCrew: [{ required: true, message: '请选择拍摄人员', trigger: 'change' }],
  latePersonnel: [{ required: true, message: '请选择修图人员', trigger: 'change' }],
  designer: [{ required: true, message: '请选择设计人员', trigger: 'change' }],
  demandSide: [{ required: true, message: '需求方不能为空', trigger: 'blur' }],
  mappingPurpose: [{ required: true, message: '测图目的不能为空', trigger: 'blur' }],
  planningPersonnel: [{ required: true, message: '策划人员不能为空', trigger: 'blur' }],
  versionTime: [{ required: true, message: '交付时间不能为空', trigger: 'blur' }]
})

const personList = ref([]) as any
const personalRequest = ref(false)
const fetchPersonOptions = async () => {
  if (personalRequest.value) return []
  if (personList.value && personList.value.length > 0) return personList.value
  personalRequest.value = true
  const data = await PersonRosterApi.getPersonRosterAvatarOriginList({ status: '2' }).catch(() => {
    personalRequest.value = false
  })
  personList.value = data || []
  personalRequest.value = false
  return personList.value
}

const selectPeopleChange = (field: string) => {
  const codeList = (promoteForm.value as any)[`${field}s`]
  if (codeList && codeList.length > 0) {
    const userIds = codeList.map((item: any) => item.userId) || []
    ;(promoteForm.value as any)[`${field}`] = userIds.join(',')
  } else {
    ;(promoteForm.value as any)[`${field}`] = ''
  }
}

const getImgsFromImageList = (imageList: any[] = []) => {
  const list: any[] = []
  imageList.forEach((item: any) => {
    if (item?.fileUrl) {
      list.push({ url: item.fileUrl })
    }
  })
  return list
}

// 转换前端上传的图片为后端所需结构
const getPromotionImage = (promotionImageUrl: string) => {
  let fileName = ''
  const fileUrl = promotionImageUrl || ''
  if (fileUrl) {
    const fileUrlArr = fileUrl.split('/') || []
    if (fileUrlArr.length > 0) {
      fileName = fileUrlArr[fileUrlArr.length - 1]
    }
  }
  return { fileName, fileUrl }
}

const getPromotionImageList = (imgList: any[] = []) => {
  const list: any[] = []
  if (imgList && imgList.length > 0) {
    imgList.forEach((item: any) => {
      if (item) list.push(getPromotionImage(item.url || ''))
    })
  }
  return list
}

const fillPeopleSelectionsFromStrings = async () => {
  await fetchPersonOptions()
  const setArray = (field: string, arrayField: string) => {
    const raw = (promoteForm.value as any)[field]
    if (!raw) {
      ;(promoteForm.value as any)[arrayField] = []
      return
    }
    const ids = String(raw)
      .split(',')
      .map((id: string) => id.trim())
      .filter(Boolean)
    ;(promoteForm.value as any)[arrayField] = (personList.value || []).filter((p: any) =>
      ids.includes(String(p.userId))
    )
  }
  setArray('operationPersonnel', 'operationPersonnels')
  setArray('planningPersonnel', 'planningPersonnels')
  setArray('cameraCrew', 'cameraCrews')
  setArray('latePersonnel', 'latePersonnels')
  setArray('designer', 'designers')
}

const initEchoData = async () => {
  const data = props.row || {}
  // 基本商品信息
  addForm.value.goodsId = data.goodsId
  addForm.value.categoryCode = data.categoryCode || ''
  addForm.value.categoryName = data.categoryName
  addForm.value.goodsName = data.goodsName
  addForm.value.goodsCode = data.goodsCode
  addForm.value.productPositioning = data.productPositioning
  addForm.value.productImage = data.productImage
  if (!addForm.value.goodsId) return
  const [versionResp, listResp] = await Promise.all([
    GalleryApi.getPromotionVersion({ goodsId: addForm.value.goodsId }).catch(() => 0),
    GalleryApi.getGoodsPromotionImageList({ goodsId: addForm.value.goodsId }).catch(() => [])
  ])

  let maxVersion = 0
  if (typeof versionResp === 'number') {
    maxVersion = versionResp
  }
  addForm.value.promotionImageMaxVersion = maxVersion

  const list = (listResp as any[]) || []
  const base = Number(addForm.value.promotionImageMaxVersion) || 0
  promoteForm.value.versionList = [createVersionItem(base + 1)]
  promoteForm.value.version = base + 1
  if (list.length > 0) {
    // 以最新一条数据回显基础信息
    const last = list[list.length - 1] || {}
    Object.assign(promoteForm.value, {
      demandSide: (last && last.demandSide) || '',
      promotionId: (last && last.promotionId) || '',
      mappingTime: (last && last.mappingTime) || '',
      operationPersonnel: (last && last.operationPersonnel) || '',
      operationPersonnels: (last && last.operationPersonnels) || [],
      planningPersonnel: (last && last.planningPersonnel) || '',
      planningPersonnels: (last && last.planningPersonnels) || [],
      cameraCrew: (last && last.cameraCrew) || '',
      cameraCrews: (last && last.cameraCrews) || [],
      latePersonnel: (last && last.latePersonnel) || '',
      latePersonnels: (last && last.latePersonnels) || [],
      designer: (last && last.designer) || '',
      designers: (last && last.designers) || [],
      clickRateSeven: (last && last.clickRateSeven) || '',
      clickConversionRateSeven: (last && last.clickConversionRateSeven) || '',
      clickRateFifteen: (last && last.clickRateFifteen) || '',
      clickConversionRateFifteen: (last && last.clickConversionRateFifteen) || '',
      mappingPurpose: (last && last.mappingPurpose) || '',
      conclusion: (last && last.conclusion) || '',
      version: (addForm.value.promotionImageMaxVersion || 0) + 1,
      versionTime: (last && last.versionTime) || '',
      conclusionType: last && last.conclusionType ? Number(last.conclusionType) : '',
      type: String((last && last.type) || ''),
      imageName: (last && last.imageName) || ''
    })
    console.log(promoteForm.value, 'promoteForm.value')
  }
}

onMounted(() => {
  initEchoData()
})

const addVersion = () => {
  const base = Number(addForm.value.promotionImageMaxVersion) || 0
  const currentMax = (promoteForm.value.versionList || []).reduce((max: number, item: any) => {
    const v = Number(item?.version) || 0
    return v > max ? v : max
  }, 0)
  const next = Math.max(base, currentMax) + 1
  promoteForm.value.versionList.push(createVersionItem(next))
  promoteForm.value.version = next
}

const removeVersion = (index: number) => {
  const list = promoteForm.value.versionList || []
  const removed = list[index]
  if (!removed) return
  const removedVersion = Number(removed.version) || 0
  list.splice(index, 1)
  list.forEach((item: any) => {
    const v = Number(item.version) || 0
    if (v > removedVersion) {
      item.version = v - 1
    }
  })
}

const onImgsUpdate = (index: number, imgs: any[]) => {
  const prop = `versionList.${index}.imgs`
  if (formRef?.value) {
    if (imgs && imgs.length > 0) {
      formRef.value.clearValidate(prop)
    } else {
      // 再次触发校验，提示需要上传车 图
      formRef.value.validateField(prop).catch(() => {})
    }
  }
}

const formRef = ref()

const layouts = computed(() => [
  {
    key: 'primary',
    label: '主图',
    show: primaryExpanded.value,
    right: () => (
      <ElButton link type="primary" size="small" onClick={togglePrimaryExpanded}>
        {primaryExpanded.value ? (
          <span class="flex items-center">
            收起
            <el-icon style="margin-left: 4px">
              <ArrowUp />
            </el-icon>
          </span>
        ) : (
          <span class="flex items-center">
            展开
            <el-icon style="margin-left: 4px">
              <ArrowDown />
            </el-icon>
          </span>
        )}
      </ElButton>
    )
  },
  {
    key: 'basicInfo',
    label: '基本信息'
  },
  {
    key: 'detail',
    label: '推广详情',
    right: () => (
      <ElButton type="primary" onClick={addVersion}>
        <el-icon style="margin-right: 4px">
          <Plus />
        </el-icon>
        添加
      </ElButton>
    )
  }
])

// 提交：将每个版本转为一条记录，调用批量新增接口
const submit = async () => {
  if (!formRef) return Promise.reject(new Error('表单未初始化'))
  try {
    await formRef.value.validate()
  } catch (e) {
    return Promise.reject(e)
  }

  const baseData: any = { ...addForm.value, ...promoteForm.value }
  if (!baseData.conclusionType) baseData.conclusionType = null
  const { imgs: _imgs, versionList: _versionList, ...baseWithoutImgs } = baseData

  const payload = (promoteForm.value.versionList || []).map((detail: any) => ({
    ...baseWithoutImgs,
    version: detail?.version,
    imageList: getPromotionImageList(detail?.imgs || [])
  }))

  await GalleryApi.addGoodsPromotionImages(payload)
  emit('submit-success')
  return true
}

defineExpose({ submit })
</script>

<style scoped lang="scss">
.el-form {
  .el-date-editor {
    width: 100%;
  }

  :deep(.label-wrap) {
    .el-form-item__label {
      line-height: 16px;
      align-items: unset;
      text-align: end;

      .label-text {
        width: 60px;
        word-break: break-all;
      }
    }
  }
}

.sw-upload-file {
  width: 100%;

  :deep(.el-upload-dragger) {
    background-color: transparent;
  }

  :deep(.uploadBg) {
    width: 100% !important;
    box-sizing: border-box;
  }

  :deep(.upload-tips) {
    margin-bottom: 0 !important;
    line-height: 14px;
  }

  :deep(.file-list) {
    width: unset !important; // trigger
  }
}

.detail-item {
  border-radius: 10px;
  background: #f4f6fa;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  padding: 20px;
  padding-left: 0;
  margin-bottom: 12px;
  position: relative;
}

.del-btn {
  position: absolute;
  right: 0;
  top: 8px;
}

/* 删除动效：向左移动并缩小；以及列表项移动过渡 */
.version-enter-active,
.version-leave-active,
.version-move {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
  will-change: transform, opacity;
}

.version-enter-from {
  opacity: 0;
  transform: translateX(12px) scale(0.98);
}

.version-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.version-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.version-leave-to {
  opacity: 0;
  transform: translateX(-12px) scale(0.95);
}
</style>
