<!--
 * @Date: 2025年5月14日16:37:15
-->
<template>
  <div class="edit-container">
    <div class="edit-content">
      <el-form label-width="120px" :model="form" :rules="rules" ref="formRef">
        <div v-if="!currentIsAuto">
          <!-- 第一行：需求方和测图目的 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="需求方" label-width="120px" prop="demandSide">
                <div class="input-container2 form-input">
                  <el-input v-model="form.demandSide" placeholder="请输入需求方" />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="测图目的" label-width="120px" prop="mappingPurpose">
                <div class="input-container2 form-input">
                  <el-input v-model="form.mappingPurpose" placeholder="请输入测图目的" />
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第二行：运营人员和策划人员 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="运营人员" label-width="120px" prop="operationPersonnel">
                <div class="input-container2 form-input">
                  <SWSelectPeople
                    :isEdit="true"
                    v-model:modelValue="form.operationPersonnels"
                    :getSearchList="remoteMethod"
                    @select-people-change="selectPeopleChange('operationPersonnel')"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="策划人员" label-width="120px">
                <div class="input-container2 form-input">
                  <SWSelectPeople
                    :isEdit="true"
                    v-model:modelValue="form.planningPersonnels"
                    :getSearchList="remoteMethod"
                    @select-people-change="selectPeopleChange('planningPersonnel')"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第三行：拍摄人员和后期人员 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="拍摄人员" label-width="120px" prop="cameraCrew">
                <div class="input-container2 form-input">
                  <SWSelectPeople
                    :isEdit="true"
                    v-model:modelValue="form.cameraCrews"
                    :getSearchList="remoteMethod"
                    @select-people-change="selectPeopleChange('cameraCrew')"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="后期人员" label-width="120px" prop="latePersonnel">
                <div class="input-container2 form-input">
                  <SWSelectPeople
                    :isEdit="true"
                    v-model:modelValue="form.latePersonnels"
                    :getSearchList="remoteMethod"
                    @select-people-change="selectPeopleChange('latePersonnel')"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第四行：设计人员（单独一行，居中） -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="设计人员" label-width="120px" prop="designer">
                <div class="input-container2 form-input">
                  <SWSelectPeople
                    :isEdit="true"
                    v-model:modelValue="form.designers"
                    :getSearchList="remoteMethod"
                    @select-people-change="selectPeopleChange('designer')"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第五行：7天付费点击率和转换率 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="7天付费点击率" label-width="120px" prop="clickRateSeven">
                <div class="input-container2 form-input">
                  <el-input type="number" v-model="form.clickRateSeven" placeholder="" />
                  <span class="percent-symbol">%</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="7天付费转换率" label-width="120px">
                <div class="input-container2 form-input">
                  <el-input type="number" v-model="form.clickConversionRateSeven" placeholder="" />
                  <span class="percent-symbol">%</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 第六行：15天付费点击率和转换率 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="15天付费点击率" label-width="120px" prop="clickRateFifteen">
                <div class="input-container2 form-input">
                  <el-input type="number" v-model="form.clickRateFifteen" placeholder="" />
                  <span class="percent-symbol">%</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="15天付费转换率"
                label-width="120px"
                prop="clickConversionRateFifteen"
              >
                <div class="input-container2 form-input">
                  <el-input
                    type="number"
                    v-model="form.clickConversionRateFifteen"
                    placeholder=""
                  />
                  <span class="percent-symbol">%</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 自动抓取的数据也同样用el-row和el-col结构 -->
        <div v-if="currentIsAuto">
          <!-- 这里可以添加自动抓取数据的特殊字段 -->
        </div>

        <!-- 结论部分 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <!-- <el-form-item label="结论类型" prop="conclusionType">
              <div class="input-container2 form-input result-type">
                <el-select clearable v-model="form.conclusionType" placeholder="请选择结论">
                  <el-option label="优化成功" value="1" />
                  <el-option label="优化失败" value="2" />
                  <el-option label="继续优化" value="3" />
                  <el-option label="优化停止" value="4" />
                </el-select>
              </div>
            </el-form-item> -->
            <el-form-item label="测图计划状态" prop="conclusionType">
              <div class="input-container2 form-input result-type">
                <el-input
                  v-if="isLegacyConclusion(form.conclusionType)"
                  :model-value="legacyConclusionMap[form.conclusionType] || form.conclusionType"
                  disabled
                  placeholder="历史数据"
                >
                  <template #append>
                    <el-button @click="form.conclusionType = ''">重选</el-button>
                  </template>
                </el-input>
                <el-select v-else v-model="form.conclusionType" placeholder="请选择" clearable>
                  <el-option label="继续测图" value="5" />
                  <el-option label="测图结束" value="6" />
                  <el-option label="运营暂无安排测图" value="7" />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item class="multiline-label-item" :label="'图片最终\n用途'" prop="imageName">
              <div class="input-container2 form-input">
                <el-select v-model="form.imageName" placeholder="请选择" clearable filterable>
                  <el-option
                    v-for="dict in promotionImageNameOptions"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 结论备注 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="结论备注" prop="conclusion">
              <s-text-area
                style="color: #333; width: 100%"
                v-model="form.conclusion"
                :rows="5"
                placeholder="请输入结论备注"
                resize="none"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 数据图上传 -->
        <el-row>
          <el-col :span="24">
            <el-form-item label="数据图上传" prop="dataImages">
              <Transfer
                v-model="form.dataImages"
                :accept-type="['image']"
                :upload-data="{ code: UPLOAD_FILE_BISSONESSCODE.PICTURE_GALLERY_PROMOTION }"
                multiple
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { ref, computed } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import * as GalleryApi from '@/api/gallery'
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import UploadFile from '@/components/SWUoloadFile/index.vue'
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import { getIntDictOptions } from '@/utils/dict'
import Transfer from '@/components/common/upload/transfer.vue'

// Props
interface Props {
  editData?: any
  currentIsAuto?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  editData: () => ({}),
  currentIsAuto: false
})

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

// Emits
const emit = defineEmits(['close', 'submit'])

// 表单引用和加载状态
const formRef = ref()
const loading = ref(false)
const message = useMessage()

// 表单数据
const form = ref({
  clickRateSeven: '',
  clickConversionRateSeven: '',
  clickRateFifteen: '',
  clickConversionRateFifteen: '',
  sevenClick: '',
  sevenAdPv: '',
  sevenDayDirectDealCount: '',
  sevenDayDirectConversionRate: '',
  fifteenClick: '',
  fifteenAdPv: '',
  fifteenDayDirectDealCount: '',
  fifteenDayDirectConversionRate: '',
  demandSide: '',
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
  mappingPurpose: '',
  conclusion: '',
  conclusionType: '',
  imageList: [],
  dataImages: '',
  imageName: ''
}) as any

const promotionImageNameOptions = computed(() => getIntDictOptions('promotion_image_name'))

// 添加表单验证规则
const rules = ref({
  demandSide: [{ required: true, message: '请输入需求方', trigger: 'blur' }],
  mappingPurpose: [{ required: true, message: '请输入测图目的', trigger: 'blur' }],
  operationPersonnel: [{ required: true, message: '请选择运营人员', trigger: 'blur' }],
  planningPersonnel: [{ required: true, message: '请选择策划人员', trigger: 'blur' }],
  designer: [{ required: true, message: '请选择设计人员', trigger: 'blur' }]
})

// 人员查询相关
const personList = ref([])
const personalRequest = ref(false)

const remoteMethod = async () => {
  if (personalRequest.value) return
  personalRequest.value = true
  try {
    const res = await PersonRosterApi.getPersonRosterAvatarOriginList({
      status: '2'
    })
    personList.value = res || []
    return res || []
  } catch (error) {
    console.error('获取人员列表失败:', error)
    return []
  } finally {
    personalRequest.value = false
  }
}

// 人员选择变化处理
const selectPeopleChange = (field) => {
  const fieldMap = {
    operationPersonnel: 'operationPersonnels',
    planningPersonnel: 'planningPersonnels',
    cameraCrew: 'cameraCrews',
    latePersonnel: 'latePersonnels',
    designer: 'designers'
  }

  const targetField = fieldMap[field]
  if (targetField && form.value[targetField]) {
    const codeList = form.value[targetField] || []
    if (codeList.length) {
      const userIds = codeList.map((item) => item.userId).filter((id) => id) || []
      form.value[field] = userIds.join(',')
    } else {
      form.value[field] = ''
    }
  }
}

// 初始化表单数据
function initFormData(data) {
  console.log('Edit component initFormData called with:', data)

  form.value = {
    clickRateSeven: data.clickRateSeven || '',
    clickConversionRateSeven: data.clickConversionRateSeven || '',
    clickRateFifteen: data.clickRateFifteen || '',
    clickConversionRateFifteen: data.clickConversionRateFifteen || '',
    sevenClick: data?.sevenClick || '',
    sevenAdPv: data?.sevenAdPv || '',
    sevenDayDirectDealCount: data?.sevenDayDirectDealCount || '',
    sevenDayDirectConversionRate: data?.sevenDayDirectConversionRate || '',
    fifteenClick: data?.fifteenClick || '',
    fifteenAdPv: data?.fifteenAdPv || '',
    fifteenDayDirectDealCount: data?.fifteenDayDirectDealCount || '',
    fifteenDayDirectConversionRate: data?.fifteenDayDirectConversionRate || '',
    demandSide: data.demandSide || '',
    operationPersonnel: data.operationPersonnel || '',
    planningPersonnel: data.planningPersonnel || '',
    cameraCrew: data.cameraCrew || '',
    latePersonnel: data.latePersonnel || '',
    designer: data.designer || '',
    operationPersonnels: data.operationPersonnels || [],
    planningPersonnels: data.planningPersonnels || [],
    cameraCrews: data.cameraCrews || [],
    latePersonnels: data.latePersonnels || [],
    designers: data.designers || [],
    mappingPurpose: data.mappingPurpose || '',
    conclusion: data.conclusion || '',
    conclusionType: data.conclusionType || '',
    imageList: data.imageList || [],
    dataImages: data.dataImages || [],
    imageName: data.imageName || ''
  }

  console.log('Form data after initialization:', form.value)
}

// 监听 props.editData 的变化，自动更新表单数据
// watch(
//   () => props.editData,
//   (newData) => {
//     console.log('Props editData changed:', newData)
//     if (newData && Object.keys(newData).length > 0) {
//       initFormData(newData)
//     }
//   },
//   { deep: true, immediate: true }
// )

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    // 先验证表单
    await formRef.value.validate()

    loading.value = true
    let imageList = form.value.imageList.map((item) => {
      return { fileUrl: item }
    })

    const params = {
      ...props.editData,
      ...form.value,
      imageList: imageList,
      dataImages: form.value.dataImages
    }

    if (!params.conclusionType) {
      params.conclusionType = null
    }

    // 确保 goodsId 存在（优先使用 editData 中的，否则使用 masterImageInfo 中的）
    if (!params.goodsId && props.editData?.masterImageInfo?.goodsId) {
      params.goodsId = props.editData.masterImageInfo.goodsId
    }

    console.log('编辑提交参数:', {
      goodsId: params.goodsId,
      hasGoodsId: !!params.goodsId,
      editData: props.editData,
      params: params
    })

    await GalleryApi.updateGoodsPromotionImage(params)
    message.success('成功')

    // 触发提交事件
    emit('submit', params)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

// 关闭表单
const handleClose = async () => {
  // 重置表单
  if (formRef.value) {
    formRef.value.resetFields()
  }
  // form.value = {
  //   clickRateSeven: '',
  //   clickConversionRateSeven: '',
  //   clickRateFifteen: '',
  //   clickConversionRateFifteen: '',
  //   conclusion: '',
  //   conclusionType: ''
  // }
  await nextTick()
  initFormData({})
  emit('close')
}

// 暴露方法
defineExpose({
  initFormData,
  handleSubmit,
  handleClose
})
</script>

<style lang="scss" scoped>
.edit-container {
  padding: 20px;

  .edit-content {
    .input-container2 {
      position: relative;
      display: flex;
      align-items: center;

      &.form-input {
        width: 100%;

        .el-input,
        .el-select {
          flex: 1;
        }
      }

      .percent-symbol {
        position: absolute;
        right: -18px;
        color: #666;
        font-size: 14px;
        pointer-events: none;
      }
    }
  }
}

.result-type {
  width: 229px !important;
}
</style>
