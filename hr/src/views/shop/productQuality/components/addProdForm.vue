<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer"
      @close="handleCloseDrawer" size="968">
      <div>
        <div class="drawerTitle">
          <div>{{ drawerTitle }}</div>
          <div @click="handleCloseDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="110px">
        <div class="drawerContent">
          <el-form-item label="产品编码" prop="productCode" required>
            <el-select-v2 class="dialogFormItemWidth" v-model="formData.productCode" placeholder="请选择" clearable
              filterable style="width: 100%" :options="productCodeList" />
            <!-- <el-select class="dialogFormItemWidth" v-model="formData.productCode" placeholder="请选择" clearable filterable
              style="width: 100%">
              <el-option v-for="dict in productCodeList" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select> -->
          </el-form-item>
          <el-form-item label="产品图" prop="productImage">
            <UploadImg :bussiness-code="UPLOAD_FILE_BISSONESSCODE.PRODUCT_QUALITY_INSPECT" uploadType="product"
              v-model:modelValue="productImagimgFileList" />
          </el-form-item>

          <el-form-item label="类目" prop="category" style="width: 100%" required>
            <el-select class="dialogFormItemWidth" v-model="formData.category" placeholder="请选择" clearable
              style="width: 100%">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PRODUCT_QUALITY_CHECK_CATEGORY, true)"
                :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="设计师" prop="designers">
            <selectPeople v-model:modelValue="formData.designers" :getSearchList="remoteMethod" />
          </el-form-item>

          <el-form-item label="尺码范围" prop="sizeRange" style="width: 100%">
            <el-select class="dialogFormItemWidth" v-model="sizeRangeStr" placeholder="请选择" clearable multiple
              @change="handleSizeRangeChange" style="width: 100%">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PRODUCT_QUALITY_CHECK_SIZE_RANGE, true)"
                :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="面料成分" prop="fabricComposition" style="width: 100%">
            <el-input class="dialogFormItemWidth" v-model="formData.fabricComposition" placeholder="填写值"
              style="width: 100%" />
          </el-form-item>
          <el-form-item label="内裤成分" prop="pantyIngredients" style="width: 100%">
            <el-input class="dialogFormItemWidth" v-model="formData.pantyIngredients" placeholder="填写值"
              style="width: 100%" />
          </el-form-item>
          <el-form-item label="成分报告打码版" prop="compositionReport">
            <UploadImg :bussiness-code="UPLOAD_FILE_BISSONESSCODE.PRODUCT_QUALITY_INSPECT" uploadType="attachment"
              v-model:modelValue="compositionReportfileList" />
          </el-form-item>
          <el-form-item label="抗菌报告打码版" prop="antimicrobialReport">
            <UploadImg :bussiness-code="UPLOAD_FILE_BISSONESSCODE.PRODUCT_QUALITY_INSPECT" uploadType="attachment"
              v-model:modelValue="antimicrobialReportfileList" />
          </el-form-item>
          <el-form-item label="执行标准" prop="enforceStandard">
            <el-select class="dialogFormItemWidth" v-model="formData.enforceStandard" placeholder="请选择" clearable
              style="width: 100%">
              <el-option v-for="dict in getIntDictOptions(
                DICT_TYPE.PRODUCT_QUALITY_CHECK_ENFORCE_STANDARD,
                true
              )" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="安全类别" prop="securityCategory">
            <el-select class="dialogFormItemWidth" v-model="formData.securityCategory" placeholder="请选择" clearable
              style="width: 100%">
              <el-option v-for="dict in getIntDictOptions(
                DICT_TYPE.PRODUCT_QUALITY_CHECK_SECURITY_CATEGORY,
                true
              )" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="风格" prop="style">
            <el-select class="dialogFormItemWidth" v-model="formData.style" placeholder="请选择" clearable
              style="width: 100%">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PRODUCT_QUALITY_CHECK_STYLE, true)"
                :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <s-text-area v-model="formData.remark" placeholder="请输入备注" :autosize="{ minRows: 3, maxRows: 8 }" />
          </el-form-item>
        </div>
      </el-form>
      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>

defineOptions({ name: 'AddProdForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import STextArea from "@/components/common/input/s-textarea.vue";
import * as productQualityApi from '@/api/shop/productQuality'
import UploadImg from './uploadImg.vue'
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

import selectPeople from './selectPeople.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
const sizeRangeStr = ref([]) // 尺码范围数组
const formData = ref({
  id: '',
  productCode: '',
  productImage: '',
  category: '',
  designer: '',
  designers: [],
  sizeRange: '',
  fabricComposition: '',
  pantyIngredients: '',
  compositionReport: '',
  antimicrobialReport: '',
  enforceStandard: '',
  securityCategory: '',
  style: '',
  remark: ''
})
const formRules = reactive({
  productCode: [{ required: true, message: '请选择产品编码', trigger: 'change' }],
  category: [{ required: true, message: '请选择类目', trigger: 'change' }],
  designers: [{ required: true, message: '请选择设计师', trigger: 'change' }]
})

const formRef = ref() // 表单 Ref

const productImagimgFileList = ref([]) // 产品图文件列表
const compositionReportfileList = ref([]) // 成分报告文件列表
const antimicrobialReportfileList = ref([]) // 抗菌报告文件列表

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  drawerTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  productImagimgFileList.value = []
  compositionReportfileList.value = []
  antimicrobialReportfileList.value = []
  sizeRangeStr.value = []
  // console.log('打开弹窗', id)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await productQualityApi.getInspect(id)
      if (data.productImage !== '') {
        productImagimgFileList.value = data.productImage.split(',').map((item) => ({ url: item }))
      }
      if (data.compositionReport !== '') {
        compositionReportfileList.value = data.compositionReport
          .split(',')
          .map((item) => ({ url: item }))
      }
      if (data.antimicrobialReport !== '') {
        antimicrobialReportfileList.value = data.antimicrobialReport
          .split(',')
          .map((item) => ({ url: item }))
      }

      data.designers = data.designers.map((item) => item.userId)
      // 如果data.sizeRange不是一个空字符串，则设置sizeRangeStr
      if (data.sizeRange !== '') {
        sizeRangeStr.value = data.sizeRange.split(',')
      } else {
        sizeRangeStr.value = []
      }

      formData.value.sizeRange = data.sizeRange
      formData.value = data
    } finally {
      formLoading.value = false
    }
  }
  // 获取产品编码列表
  getProductCodeList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    console.log('提交', productImagimgFileList.value)
    if (productImagimgFileList.value.length > 0) {
      const arr = productImagimgFileList.value.map((item) => {
        if (item.response) {
          // @ts-ignore
          return `${item.response.data}`
        } else {
          return `${item.url}`
        }
      })
      // @ts-ignore
      formData.value.productImage = arr.join(',')
    }
    if (compositionReportfileList.value.length > 0) {
      const arr = compositionReportfileList.value.map((item) => {
        if (item.response) {
          // @ts-ignore
          return `${item.response.data}`
        } else {
          return `${item.url}`
        }
      })
      // @ts-ignore
      formData.value.compositionReport = arr.join(',')
    }
    if (antimicrobialReportfileList.value.length > 0) {
      const arr = antimicrobialReportfileList.value.map((item) => {
        if (item.response) {
          // @ts-ignore
          return `${item.response.data}`
        } else {
          return `${item.url}`
        }
      })
      // @ts-ignore
      formData.value.antimicrobialReport = arr.join(',')
    }
    console.log('提交的数据：', formData.value)

    if (formData.value.designers.length) {
      // 将data.designers里面每一项的userId拿出来放入一个新数组中，并转成字符串
      formData.value.designer = formData.value.designers.join(',')
      formData.value.designers = []
    }

    formData.value.sizeRange = sizeRangeStr.value.join(',')

    const data = formData.value as any
    if (formType.value === 'create') {
      data.id = undefined
      await productQualityApi.saveInspect(data)
      message.success(t('common.createSuccess'))
    } else {
      await productQualityApi.saveInspect(data)
      message.success(t('common.updateSuccess'))
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: '',
    productCode: '',
    productImage: '',
    category: '',
    designer: '',
    designers: [],
    sizeRange: '',
    fabricComposition: '',
    pantyIngredients: '',
    compositionReport: '',
    antimicrobialReport: '',
    enforceStandard: '',
    securityCategory: '',
    style: '',
    remark: ''
  }
}

// 获取产品编码列表

const productCodeList = ref([])
const getProductCodeList = async () => {
  let data = await productQualityApi.getProductCodeList({ productCode: formData.value.productCode })
  if (data) {
    productCodeList.value = data.map((item) => ({ label: item, value: item }))
  }
}

// 获取设计师列表
const remoteMethod = async (value) => {
  // console.log('调取接口')
  return await productQualityApi.getDesignerList(value)
}

const handleCloseDrawer = () => {
  drawerVisible.value = false
}

const handleSizeRangeChange = (value) => {
  // formData.value.sizeRange = value.join(',')
}
</script>

<style lang="scss" scoped>
// 尺码范围
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #fae8d066;
  border-radius: 15px;
}

:deep(.el-upload-list__item) {
  width: 110px;
  height: 110px;
}

:deep(.el-upload-list--text) {
  display: flex;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}

// 修改表单label的行高
:deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;

  &-title {
    margin: 0 0 18px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }

  .tips {
    margin: 0 0 16px 80px;
    color: #2693f8;
    font-size: 14px;

    &-important {
      color: #eb3737;
    }

    img {
      width: 12px;
    }
  }

  &-disabledInput {
    width: 340px;
    padding: 0 16px;
    min-height: 32px;
    box-sizing: border-box;
    background-image: url(@/assets/imgs/common/input_disabled.png);
    background-repeat: no-repeat;
  }

  .disabledInput_cover {
    background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    width: 100%;
  }

  .disabledInput_remark {
    background-image: url(@/assets/imgs/common/input_disabled_remark.png);
    width: 100%;
    min-height: 92px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
