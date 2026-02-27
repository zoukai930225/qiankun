<template>
  <div v-if="isVisible">
    <SWDrawer v-model="isVisible" @close="reset" :title="isView ? '编辑' : '上传车图'" class="promoteDrawer">
      <div class="form-wrapper">
        <div class="flex-row header-wrapper">
          <span class="icon"></span>
          <span>主图</span>
        </div>
        <el-form label-width="88px" :model="addForm" ref="baseFormRef">
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
                <s-text-area disabled v-model="addForm.productPositioning" :autosize="{ minRows: 4, maxRows: 4 }" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="主图" prop="mainImg">
                <el-image style="width: 180px" fit="contain"
                  :src="(addForm.productImage && addForm.productImage.fileUrl) || ''"
                  :preview-src-list="[addForm.productImage && addForm.productImage.fileUrl]"
                  :preview-teleported="true" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <div class="form-wrapper promoteForm">
        <div class="flex-row header-wrapper">
          <span class="icon"></span>
          <span>车图</span>
        </div>
        <el-form label-width="120px" :model="promoteForm" :rules="itemRules" ref="formRef"
          :validate-on-rule-change="false">
          <el-row>
            <el-col :span="12">
              <el-form-item label="需求方" prop="demandSide">
                <el-input v-model="promoteForm.demandSide" placeholder="请输入需求方" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="推广ID" prop="promotionId">
                <el-input v-model="promoteForm.promotionId" placeholder="请输入推广ID" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="测图目的" prop="mappingPurpose">
                <s-text-area v-model="promoteForm.mappingPurpose" placeholder="请输入测图目的"
                  :autosize="{ minRows: 4, maxRows: 4 }" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="推广版本" prop="version">
                <div style="display: flex; color: #666">
                  <div style="margin-right: 6px">第</div>
                  <el-input-number v-if="!isView" disabled v-model="promoteForm.version"
                    :min="addForm.promotionImageMaxVersion + 1" :max="addForm.promotionImageMaxVersion + 1" />
                  <el-input-number v-else disabled v-model="promoteForm.version"
                    :max="addForm.promotionImageMaxVersion" />
                  <div style="margin-left: 6px">版本</div>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="交付时间" prop="versionTime">
                <el-date-picker style="width: 100%" v-model="promoteForm.versionTime" value-format="YYYY-MM-DD"
                  type="date" placeholder="选择交付时间" size="default" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="测图时间" prop="mappingTime">
                <el-date-picker style="width: 100%" v-model="promoteForm.mappingTime" value-format="YYYY-MM-DD"
                  type="date" placeholder="选择测图时间" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运营人员" prop="operationPersonnel">
                <SWSelectPeople :isEdit="true" v-model:modelValue="promoteForm[`operationPersonnels`]"
                  :getSearchList="remoteMethod" @select-people-change="selectPeopleChange('operationPersonnel')" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="策划人员" prop="planningPersonnel">
                <SWSelectPeople :isEdit="true" v-model:modelValue="promoteForm[`planningPersonnels`]"
                  :getSearchList="remoteMethod" @select-people-change="selectPeopleChange('planningPersonnel')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="拍摄人员" prop="cameraCrew">
                <SWSelectPeople :isEdit="true" v-model:modelValue="promoteForm[`cameraCrews`]"
                  :getSearchList="remoteMethod" @select-people-change="selectPeopleChange('cameraCrew')" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="修图人员" prop="latePersonnel">
                <SWSelectPeople :isEdit="true" v-model:modelValue="promoteForm[`latePersonnels`]"
                  :getSearchList="remoteMethod" @select-people-change="selectPeopleChange('latePersonnel')" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="设计人员" prop="designer">
                <SWSelectPeople :isEdit="true" v-model:modelValue="promoteForm[`designers`]"
                  :getSearchList="remoteMethod" @select-people-change="selectPeopleChange('designer')" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="7天付费点击率" prop="clickRateSeven" v-if="promoteForm.type == '1' || !isView">
                <el-input v-model="promoteForm.clickRateSeven" placeholder="7天付费点击率" type="number" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="7天点击转化率" prop="clickConversionRateSeven" v-if="promoteForm.type == '1' || !isView">
                <el-input v-model="promoteForm.clickConversionRateSeven" placeholder="7天点击转化率" type="number" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="15天付费点击率" prop="clickRateFifteen" v-if="promoteForm.type == '1' || !isView">
                <el-input v-model="promoteForm.clickRateFifteen" placeholder="15天付费点击率" type="number" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="15天点击转化率" prop="clickConversionRateFifteen"
                v-if="promoteForm.type == '1' || !isView">
                <el-input v-model="promoteForm.clickConversionRateFifteen" placeholder="15天点击转化率" type="number" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="测图计划状态" prop="conclusionType" v-if="promoteForm.type == '1'">
                <el-input v-if="isLegacyConclusion(promoteForm.conclusionType)" :model-value="legacyConclusionMap[promoteForm.conclusionType] || promoteForm.conclusionType
                  " disabled placeholder="历史数据">
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
                  <el-option v-for="dict in promotionImageNameOptions" :key="dict.value" :label="dict.label"
                    :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="结论" prop="conclusion" v-if="promoteForm.type == '1'">
                <s-text-area v-model="promoteForm.conclusion" placeholder="请输入结论"
                  :autosize="{ minRows: 4, maxRows: 4 }" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="车图" prop="imgs">
                <Transfer :uploadData="{ code: UPLOAD_FILE_BISSONESSCODE.PICTURE_GALLERY_PROMOTION }"
                  :disabled="isView ? promoteForm.type == '2' : false" :limit="999" accept-type="image" multiple
                  value-type="array" v-model="promoteForm.imgs" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <img v-if="showInfoIndex === 0 && promoteInfoList.length > 1" class="arrow Left notAllow"
          :src="switch_arrow_left_Img" />
        <img v-if="showInfoIndex > 0 && promoteInfoList.length > 1" class="arrow Left" :src="switch_arrow_left_hlImg"
          @click="promotePreClick" />
        <img v-if="promoteInfoList.length > 1 && showInfoIndex < promoteInfoList.length - 1" class="arrow Right"
          :src="switch_arrow_right_hlImg" @click="promoteNextClick" />
        <img v-if="showInfoIndex === promoteInfoList.length - 1 && promoteInfoList.length > 1"
          class="arrow Right notAllow" :src="switch_arrow_rightImg" />
      </div>

      <template #footer>
        <el-button @click="reset">取消</el-button>
        <el-button :loading="loading" class="mr20px" type="primary" @click="submit">保存</el-button>
      </template>
    </SWDrawer>
  </div>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
// 移除未使用的引用
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import { debounce } from 'lodash-es'
const loading = ref(false)

// 引入 Transfer 组件
import Transfer from '@/components/common/upload/transfer.vue'

import switch_arrow_left_Img from '@/assets/imgs/visualGallery/switch_arrow_left.png'
import switch_arrow_left_hlImg from '@/assets/imgs/visualGallery/switch_arrow_left_hl.png'
import switch_arrow_rightImg from '@/assets/imgs/visualGallery/switch_arrow_right.png'
import switch_arrow_right_hlImg from '@/assets/imgs/visualGallery/switch_arrow_right_hl.png'

import * as GalleryApi from '@/api/gallery'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { getIntDictOptions } from '@/utils/dict'

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

const message = useMessage() // 消息弹窗
const isVisible = ref(false)

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
  planningPersonnells: [],
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
  version: 1,
  versionTime: '',
  conclusionType: '',
  type: '', // 1-车图 2-视频
  imageName: ''
}) as any

const promotionImageNameOptions = computed(() => getIntDictOptions('promotion_image_name'))

// 当 7天付费点击率 有值时，推广ID、测图时间 必填
const requireWhenPaid7dExists = (fieldLabel: string) => {
  return (_rule: any, value: any, callback: any) => {
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

const itemRules = computed(() => {
  const isClickRateSevenFilled =
    promoteForm.value.clickRateSeven !== '' &&
    promoteForm.value.clickRateSeven !== null &&
    promoteForm.value.clickRateSeven !== undefined

  return {
    promotionId: [
      { required: isClickRateSevenFilled, message: '推广ID不能为空', trigger: 'blur' },
      { validator: requireWhenPaid7dExists('推广ID'), trigger: 'blur' }
    ],
    mappingTime: [
      { required: isClickRateSevenFilled, message: '测图时间不能为空', trigger: 'change' },
      { validator: requireWhenPaid7dExists('测图时间'), trigger: 'change' }
    ],
    imgs: [{ required: true, message: '请上传车图片', trigger: 'change' }], // Trigger 改为 change 可能更好
    operationPersonnel: [{ required: true, message: '请选择运营人员', trigger: 'change' }],
    cameraCrew: [{ required: true, message: '请选择拍摄人员', trigger: 'change' }],
    latePersonnel: [{ required: true, message: '请选择修图人员', trigger: 'change' }],
    designer: [{ required: true, message: '请选择设计人员', trigger: 'change' }],
    // 需求方 必填
    demandSide: [{ required: true, message: '需求方不能为空', trigger: 'blur' }],
    // 测图目的 必填
    mappingPurpose: [{ required: true, message: '测图目的不能为空', trigger: 'blur' }],
    // 策划人员 和 交付时间 必填
    planningPersonnel: [{ required: true, message: '策划人员不能为空', trigger: 'blur' }],
    versionTime: [{ required: true, message: '交付时间不能为空', trigger: 'blur' }]
  }
})

const currentId = ref('') // 当前编辑的 id
const isView = ref(false) // 是否为查看
const promoteInfoList = ref([]) // 推广信息列表
const showInfoIndex = ref(0)

const open = async (data: any, isSee: string) => {
  isView.value = isSee === 'see'

  isVisible.value = true
  openIds.value = ''
  personList.value = []
  personalRequest.value = false
  addForm.value.goodsId = data.goodsId
  addForm.value.categoryCode = data.categoryCode || ''
  addForm.value.categoryName = data.categoryName
  addForm.value.goodsName = data.goodsName
  addForm.value.goodsCode = data.goodsCode
  addForm.value.productPositioning = data.productPositioning
  addForm.value.productImage = data.productImage
  addForm.value.promotionImageMaxVersion = data.promotionImageMaxVersion

  const res = await GalleryApi.getGoodsPromotionImageList({ goodsId: data.goodsId }).catch(
    () => undefined
  )
  const promotionList = Array.isArray(res) ? res : res?.data || []

  const ensureArray = (value: any) => (Array.isArray(value) ? value : [])
  const ensureString = (value: any) => (value === undefined || value === null ? '' : value)

  const maxVersionFromList = promotionList.reduce((max: number, item: any) => {
    const current = Number(item?.version)
    return Number.isFinite(current) && current > max ? current : max
  }, 0)
  const currentMaxVersion = Number(addForm.value.promotionImageMaxVersion) || 0
  addForm.value.promotionImageMaxVersion = Math.max(currentMaxVersion, maxVersionFromList)
  const nextVersion = (Number(addForm.value.promotionImageMaxVersion) || 0) + 1

  if (isView.value) {
    showInfoIndex.value = 0
    promoteInfoList.value = promotionList

    if (
      promoteInfoList.value.length > 0 &&
      showInfoIndex.value >= 0 &&
      showInfoIndex.value < promoteInfoList.value.length
    ) {
      promoteForm.value = promoteInfoList.value[showInfoIndex.value] || {}
      promoteForm.value.imgs = getImgs(promoteForm.value.imageList || [])
    } else {
      promoteForm.value.imgs = []
      promoteForm.value.version = nextVersion
    }
    console.log(promoteForm.value.imgs);
  } else {
    if (promotionList.length) {
      promoteForm.value = promotionList[promotionList.length - 1] || {}
    }
    promoteForm.value.imgs = []
    promoteInfoList.value = []
    showInfoIndex.value = 0
    promoteForm.value.version = nextVersion
    remoteMethod({})
  }

  const parsedVersion = Number(promoteForm.value.version)
  promoteForm.value.version = Number.isFinite(parsedVersion) ? parsedVersion : nextVersion
  promoteForm.value.type = promoteForm.value.type ? String(promoteForm.value.type) : ''
  promoteForm.value.operationPersonnels = ensureArray(promoteForm.value.operationPersonnels)
  promoteForm.value.planningPersonnels = ensureArray((promoteForm.value as any).planningPersonnels)
  promoteForm.value.cameraCrews = ensureArray(promoteForm.value.cameraCrews)
  promoteForm.value.latePersonnels = ensureArray(promoteForm.value.latePersonnels)
  promoteForm.value.designers = ensureArray(promoteForm.value.designers)
  promoteForm.value.operationPersonnel = ensureString(promoteForm.value.operationPersonnel)
  promoteForm.value.planningPersonnel = ensureString(promoteForm.value.planningPersonnel)
  promoteForm.value.cameraCrew = ensureString(promoteForm.value.cameraCrew)
  promoteForm.value.latePersonnel = ensureString(promoteForm.value.latePersonnel)
  promoteForm.value.designer = ensureString(promoteForm.value.designer)
  promoteForm.value.mappingTime = ensureString(promoteForm.value.mappingTime)
  promoteForm.value.versionTime = ensureString(promoteForm.value.versionTime)
  promoteForm.value.demandSide = ensureString(promoteForm.value.demandSide)
  promoteForm.value.promotionId = ensureString(promoteForm.value.promotionId)
  promoteForm.value.mappingPurpose = ensureString(promoteForm.value.mappingPurpose)
  promoteForm.value.conclusion = ensureString(promoteForm.value.conclusion)
  promoteForm.value.clickRateSeven = ensureString(promoteForm.value.clickRateSeven)
  promoteForm.value.clickConversionRateSeven = ensureString(
    promoteForm.value.clickConversionRateSeven
  )
  promoteForm.value.clickRateFifteen = ensureString(promoteForm.value.clickRateFifteen)
  promoteForm.value.clickConversionRateFifteen = ensureString(
    promoteForm.value.clickConversionRateFifteen
  )
  promoteForm.value.goodsId = ensureString(promoteForm.value.goodsId)

  promoteForm.value.conclusionType =
    promoteForm.value.conclusionType !== undefined &&
      promoteForm.value.conclusionType !== null &&
      promoteForm.value.conclusionType !== ''
      ? Number(promoteForm.value.conclusionType)
      : ''
  promoteForm.value.imageName =
    promoteForm.value.imageName !== undefined && promoteForm.value.imageName !== null
      ? String(promoteForm.value.imageName)
      : ''
}

const getImgs = (imageList: []) => {
  let list = [] as any
  imageList.forEach((item: any) => {
    if (item.fileUrl) {
      list.push({ url: item.fileUrl })
    }
  })
  return list
}

const promotePreClick = () => {
  console.log('2222')
  showInfoIndex.value -= 1
  if (showInfoIndex.value < promoteInfoList.value.length && showInfoIndex.value >= 0) {
    promoteForm.value = promoteInfoList.value[showInfoIndex.value]
    promoteForm.value.imgs = getImgs(promoteForm.value.imageList || [])
  }
}

const promoteNextClick = () => {
  console.log('1111111')
  showInfoIndex.value += 1
  if (showInfoIndex.value < promoteInfoList.value.length && showInfoIndex.value >= 0) {
    promoteForm.value = promoteInfoList.value[showInfoIndex.value]
    promoteForm.value.imgs = getImgs(promoteForm.value.imageList || [])
  }
}

const openIds = ref('')
const personList = ref([])
const personalRequest = ref(false)
const remoteMethod = async (_value) => {
  if (personalRequest.value) {
    return []
  }
  if (personList.value && personList.value.length > 0) {
    return personList.value
  }
  personalRequest.value = true
  const data = await PersonRosterApi.getPersonRosterAvatarOriginList({
    status: '2'
  }).catch(() => {
    personalRequest.value = false
  })
  personList.value = data || []
  personalRequest.value = false
  return personList.value
}

// 更新选择的人
const selectPeopleChange = (field: string) => {
  const codeList = promoteForm.value[`${field}s`]
  if (codeList && codeList.length > 0) {
    const userIds = codeList.map((item) => item.userId) || []
    promoteForm.value[`${field}`] = userIds.join(',')
  } else {
    // 当列表为空时，设置对应字段为空字符串
    promoteForm.value[`${field}`] = ''
  }
}

const getPromotionImage = (promotionImageUrl: string) => {
  let fileName = ''
  let fileUrl = promotionImageUrl || ''
  if (fileUrl) {
    const fileUrlArr = fileUrl.split('/') || []
    if (fileUrlArr.length > 0) {
      fileName = fileUrlArr[fileUrlArr.length - 1]
    }
  }
  return {
    fileName,
    fileUrl
  }
}
const getPromotionImageList = (imgList: []) => {
  let list = [] as any
  if (imgList && imgList.length > 0) {
    imgList.forEach((item: any) => {
      if (item) {
        list.push(getPromotionImage(item.url || ''))
      }
    })
  }
  return list || []
}
const baseFormRef = ref()
const formRef = ref() // 表单 Ref

// 保存
const submit = debounce(async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  try {
    const fileList = Array.isArray(promoteForm.value.imgs)
      ? promoteForm.value.imgs.map((item: any) => {
        return item?.fileUrl ? {
          fileUrl: `${item.fileUrl}?name=${item.fileName}`,
          fileName: item.fileName
        } : {
          fileUrl: item.url
        }
      })
      : []
    console.log(fileList);
    const data = {
      ...addForm.value,
      ...promoteForm.value,
      imageList: fileList,
      imgs: undefined
    } as any
    console.log('data', data)
    if (!data.conclusionType) {
      data.conclusionType = null
    }
    if (isView.value) await GalleryApi.updateGoodsPromotionImage(data)
    if (!isView.value) await GalleryApi.addGoodsPromotionImage(data)
    message.success('保存成功')
    emit('success')
    reset()
  } catch (error) { }
}, 300)

const reset = () => {
  isVisible.value = false
  currentId.value = ''
  addForm.value = {
    goodsId: undefined,
    categoryCode: '',
    categoryName: undefined,
    goodsName: '',
    goodsCode: '',
    productPositioning: '',
    productImage: {}
  }
  promoteForm.value = {
    demandSide: '',
    promotionId: '',
    mappingTime: '',
    operationPersonnel: '',
    planningPersonnel: '',
    cameraCrew: '',
    latePersonnel: '',
    designer: '',

    operationPersonnels: [],
    planningPersonnells: [],
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
    imageName: ''
  }
  formRef.value.clearValidate()
  emit('close')
}

const emit = defineEmits(['cancle', 'success', 'close'])

const close = () => {
  reset()
  isVisible.value = false
}

defineExpose({ open, close })
</script>

<style lang="scss" scoped>
.form-wrapper {
  width: 100%;
  margin: 0 auto 20px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;

  &.promoteForm {
    position: relative;
  }

  .header-wrapper {
    margin-bottom: 20px;
    align-items: center;

    .icon {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 6px;
    }

    span {
      font-weight: 600;
    }
  }
}

:deep(.el-select__wrapper) {
  background: #fff;
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.btn-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.arrow {
  position: absolute;
  width: 26px;
  height: 26px;
  cursor: pointer;
  top: 50%;

  &.Left {
    left: -18px;
  }

  &.Right {
    right: -18px;
  }

  &.notAllow {
    cursor: not-allowed;
  }
}

.promoteDrawer {
  :deep(.el-drawer__body) {
    padding: 0 !important;
  }
}
</style>
