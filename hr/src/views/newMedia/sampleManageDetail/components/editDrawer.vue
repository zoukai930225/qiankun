<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle">
    <div class="drawerContent">
      <el-form class="dialogForm" :class="{ editForm: isEdit }" ref="formRef" v-loading="formLoading" :model="formData"
        :rules="formRules" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="条码" prop="barCode">
              <el-input style="width: 300px" placeholder="" v-model="formData.barcode" readonly disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productCategory" label="产品类目" required>
              <el-input style="width: 300px" placeholder="" v-model="formData.productCategory" readonly disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="SKU编码" prop="skuCode">
              <el-input style="width: 300px" placeholder="" v-model="formData.skuCode" readonly disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productModelNumber" label="产品款号" required>
              <el-input style="width: 300px" placeholder="" v-model="formData.productModelNumber" readonly disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-input style="width: 300px" placeholder="" v-model="formData.brand" readonly disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sampleCategory" label="样品类别" required>
              <el-input style="width: 300px" placeholder="" v-model="formData.sampleCategory" readonly disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="尺码" prop="size">
              <el-select class="!w-300px" v-model="formData.size" placeholder="请选择尺码" readonly disabled>
                <el-option v-for="dict in sampleSizeList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="colour" label="颜色" required>
              <el-input style="width: 300px" placeholder="" v-model="formData.colour" readonly disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 库位增加 -->
        <div v-for="(loc, index) in formData.details" :key="index">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="locationId" :label="`存放位置${index + 1}`" required>
                <el-select class="!w-300px" v-model="loc.locationId" placeholder="" readonly disabled>
                  <el-option v-for="dict in locationList" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item :label="`来源`">
              <!-- <el-input style="width:300px;" placeholder="" v-model="formData.source" :disabled="!isEdit"/> -->
              <el-select class="!w-300px" v-model="formData.source" placeholder="请选择来源" :disabled="!isEdit"
                prop="source">
                <el-option v-for="dict in resourceList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请人">
              <el-input style="width: 300px" placeholder="" v-model="formData.applicant" :disabled="!isEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请日期" required>
              <el-date-picker :disabled="!isEdit" v-model="formData.date" type="date" placeholder=""
                style="width: 300px" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="Number(formData.status) === 4">
          <el-col :span="12">
            <el-form-item label="申请数量">
              <el-input style="width: 300px" placeholder="" v-model="formData.number" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请用途" required>
              <!-- <el-input style="width:300px;" placeholder="" v-model="formData.purpose" :disabled="!isEdit"/> -->
              <el-select class="!w-300px" v-model="formData.purpose" placeholder="请选择申请用途" @change="changePurpose"
                :disabled="!isEdit">
                <el-option v-for="dict in applyPurposeList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="归还日期" prop="returnDate" :required="isRequired">
              <el-date-picker :disabled="!isEdit" v-model="formData.returnDate" type="date" placeholder=""
                style="width: 300px" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="图片">
              <UploadImg v-model:modelValue="imageList" :limit="1" :uploadDisabled="!isEdit" />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
                <el-form-item label="快递公司" required>
                  <el-input
                    style="width: 300px"
                    placeholder=""
                    v-model="formData.expressDeliveryCompany"
                    :disabled="!isEdit"
                  />
                </el-form-item>
              </el-col> -->
        </el-row>
        <!-- <el-row>
              <el-col :span="12">
                <el-form-item label="快递单号">
                  <el-input
                    style="width: 300px"
                    placeholder=""
                    v-model="formData.orderNumber"
                    :disabled="!isEdit"
                  />
                </el-form-item>
              </el-col>
              
            </el-row> -->
        <!-- <el-row v-if="Number(formData.status) === 4">
              <el-col :span="24">
                <el-form-item label="邮寄信息">
                  <el-input
                    style="width: 900px"
                    v-model="formData.mailingInformation"
                    placeholder=""
                    :rows="3"
                    
                    :disabled="!isEdit"
                  />
                </el-form-item>
              </el-col>
            </el-row> -->
        <el-row v-if="Number(formData.status) === 2">
          <el-col :span="24">
            <el-form-item label="报废原因">
              <s-text-area style="width: 900px" v-model="formData.remark" readonly :rows="3" :disabled="!isEdit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="当前状态">
              <el-input style="width: 300px" :value="getStatusName(formData.status)" disabled />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="drawerVisible = false" class="mr20px">关 闭</el-button>
      <!-- <el-button :disabled="formLoading" class="mr20px" type="primary" @click="submitForm">保 存</el-button> -->
    </template>
  </SWDrawer>

</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import UploadImg from '../../components/uploadImg.vue'
import { sampleSizeList, resourceList, applyPurposeList } from '@/views/newMedia/hooks/useSample'
import * as sampleManageDetailApi from '@/api/sample/sampleManageDetail'
import * as sampleManageApi from '@/api//sample/sampleManage'
// 获取当前用户
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const scrollRef = ref()
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref<any>('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  barcode: '',
  productCategory: '', //产品类目
  skuCode: '', // SKU编码
  productModelNumber: '',
  brand: '',
  sampleCategory: '',
  size: '',
  colour: '',
  image: '',
  source: '',
  details: [
    {
      locationId: '',
      number: ''
    }
  ],
  totalNumber: '', //报废数量 总数只是前端使用 不传后端
  remark: '',
  status: '',
  applicant: '',
  date: '',
  number: '',
  purpose: '',
  returnDate: '',
  expressDeliveryCompany: '',
  orderNumber: '',
  mailingInformation: ''
})
const imageList = ref<any>([])

const formRef = ref()
const isEdit = ref(false)

// 库位
const locationList = ref<any>([])

// 状态
const getStatusName = (status) => {
  if (status === 2) return '报废'
  if (status === 3) return '已入库'
  if (status === 4) return '已出库'
}
/** 打开drawer */
const open = async (type?: string, id?: string, barcode?: string) => {
  resetForm()
  drawerVisible.value = true
  formType.value = type
  drawerTitle.value = type === 'edit' ? '编辑' : '查看'
  isEdit.value = type === 'edit'
  if (id) {
    // 查看详情
    const params = await sampleManageApi.queryBasicInfoByBarcode({ barcode })
    const data = await sampleManageDetailApi.getDetailById(id)
    if (params) {
      formData.value = Object.assign(params, data)
      if (data.image) imageList.value.push({ fileUrl: data.image })
    }
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 其中用途模特拍摄可归还、静物拍摄、调样留底选择这三个归还日期必填，其余的可以非必填
const isRequired = ref(false)
const changePurpose = (value) => {
  formRef.value.clearValidate('returnDate')
  if (value === '模特拍摄可归还' || value === '静物拍摄' || value === '调样留底') {
    isRequired.value = true
  } else {
    isRequired.value = false
  }
}
const returnDateValidator = (rule: any, value: any, callback: any) => {
  if (isRequired.value) {
    if (!formData.value.returnDate) {
      callback(new Error('请选择归还日期'))
    }
  } else {
    callback()
  }
}
// 表单校验规则
const formRules = reactive({
  productCategory: [{ required: true, message: '请输入产品类目', trigger: 'blur' }],
  skuCode: [{ required: true, message: '请输入skuCode', trigger: 'blur' }],
  productModelNumber: [{ required: true, message: '请输入产品款号', trigger: 'blur' }],
  brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  sampleCategory: [{ required: true, message: '请输入样品类别', trigger: 'blur' }],
  size: [{ required: true, message: '请选择尺码', trigger: 'blur' }],
  colour: [{ required: true, message: '请输入颜色', trigger: 'blur' }],
  returnDate: [{ validator: returnDateValidator, message: '请选择归还日期', trigger: 'blur' }],
  source: [{ required: true, message: '请选择来源', trigger: 'blur' }]
})

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 校验通过 提交
  formLoading.value = true
  try {
    if (formType.value === 'edit') {
      // 编辑
      /**
         * "id": "3dec3fac-575d-46c6-97ee-449e1ec17340",
    "applicant":"周世鹏",//申请人
    "date":"2025-06-12",//申请日期
    "purpose":"申请用途", //申请用途
    "returnDate":"2026-02-01",//归还日期
    "expressDeliveryCompany":"顺丰",//快递公司
    "orderNumber":"快递单号",//快递单号
    "mailingInformation":"邮寄信息"//
         */
      const params = { ...formData.value }
      console.log(params)
      await sampleManageDetailApi.outWarehouseUpdate(params)
    }
    message.success('保存成功')
    formLoading.value = false
    drawerVisible.value = false
    emit('success')
  } catch {
    formLoading.value = false
  }
  reset()
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  imageList.value = []
}

const reset = () => {
  resetForm()
  drawerVisible.value = false
  emit('success')
}
</script>

<style lang="less" scoped>
@import '@/views/newMedia/style/drawer.scss';
</style>
