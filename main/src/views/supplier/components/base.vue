<template>
  <el-form class="base-form" :rules="formRules" ref="formRef" :model="formData" label-width="140px" :inline="true"
    right>
    <el-card shadow="never">
      <el-form-item label="公司全称" prop="fullCompany">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.fullCompany" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="socialCreditCode">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.socialCreditCode" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <!-- <el-form-item label="供应商简称" prop="abbreviationCompany">
        <el-input
          v-model.trim="formData.abbreviationCompany"
          class="dialogFormItemWidth"
          placeholder="请输入"
          :maxlength="50"
        />
      </el-form-item> -->
      <el-form-item label="注册日期" prop="registrationDate">
        <el-date-picker style="width: 100%" v-model.trim="formData.registrationDate" value-format="YYYY-MM-DD"
          placeholder="请选择时间" :disabled-date="pickerOptions" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="注册资金" prop="registeredCapital">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.registeredCapital" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="登记机关" prop="registrationAuthority">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.registrationAuthority" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="传真" prop="fax">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.fax" placeholder="请输入" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="法人代表姓名" prop="legalName">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.legalName" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="法人代表手机" prop="legalPhone">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.legalPhone" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <!-- <el-form-item label="供应商类型" prop="supplierType">
        <el-select class="dialogFormItemWidth" v-model.trim="formData.supplierType" placeholder="请选择"
          style="width: 100%" :disabled="disabled">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_TYPE, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="擅长类目">
        <el-select class="dialogFormItemWidth" v-model.trim="formData.supplierCategory" placeholder="请选择"
          style="width: 100%" :disabled="disabled">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_CATEGORY, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item> -->
      <!-- <el-form-item label="合作模式" prop="collabModeList">
        <el-select class="dialogFormItemWidth" v-model.trim="formData.collabModeList" placeholder="请选择"
          style="width: 100%" :disabled="disabled" multiple>
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_COLLAB_MODE, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="注册地址" style="width: 98.9%" prop="registeredAddress">
        <s-text-area v-model.trim="formData.registeredAddress" placeholder="请输入" :autosize="{ minRows: 3, maxRows: 8 }"
          :disabled="disabled" />
      </el-form-item>
    </el-card>

    <el-card shadow="never">
      <el-form-item label="实际经营人姓名" prop="actualOperatorName">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.actualOperatorName" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="实际经营人手机" prop="actualOperatorPhone">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.actualOperatorPhone" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="业务代表姓名" prop="businessRepresentativeName">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.businessRepresentativeName" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="业务代表手机" prop="businessRepresentativePhone">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.businessRepresentativePhone" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="办公详细地址" style="width: 98.9%" prop="officeAddress">
        <s-text-area v-model.trim="formData.officeAddress" placeholder="请输入注册地址" :disabled="disabled"
          :autosize="{ minRows: 3, maxRows: 8 }" />
      </el-form-item>
    </el-card>

    <el-card shadow="never">
      <el-form-item label="场地性质" prop="supplierSiteNature">
        <el-select class="dialogFormItemWidth" v-model.trim="formData.supplierSiteNature" placeholder="请选择"
          style="width: 100%" :disabled="disabled">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_SITE_NATURE, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="公司性质" prop="supplierCompanyProperty">
        <el-select class="dialogFormItemWidth" v-model.trim="formData.supplierCompanyProperty" placeholder="请选择"
          style="width: 100%" :disabled="disabled">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_COMPANY_PROPERTY, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="员工人数" prop="employeNumber">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.employeNumber" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="年生产值" prop="annualProductionValue">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.annualProductionValue" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="结算方式" prop="supplierPaymentMethod">
        <el-select class="dialogFormItemWidth" v-model.trim="formData.supplierPaymentMethod" placeholder="请选择"
          style="width: 100%" :disabled="disabled">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_PAYMENT_METHOD, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="发票类型" prop="supplierInvoiceType">
        <el-select class="dialogFormItemWidth" v-model.trim="formData.supplierInvoiceType" placeholder="请选择"
          style="width: 100%" :disabled="disabled">
          <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SUPPLIER_INVOICE_TYPE, true)" :key="dict.value"
            :label="dict.label" :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="税号" prop="taxId" :required="formData.supplierInvoiceType !== 'noInvoice'">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.taxId" placeholder="请输入" :disabled="disabled" />
      </el-form-item>
      <el-form-item label="账户名称" prop="accountName">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.accountName" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="开户行" prop="openingBank">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.openingBank" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
      <el-form-item label="账号" prop="accountNumber">
        <el-input class="dialogFormItemWidth" v-model.trim="formData.accountNumber" placeholder="请输入"
          :disabled="disabled" />
      </el-form-item>
    </el-card>

    <el-card shadow="never">
      <div>
        <el-form-item label="营业执照" style="width: 100%" prop="businessLicense">
          <UploadImgs :bussiness-code="UPLOAD_FILE_BISSONESSCODE.SUPPLIER_FILE"
            v-model:modelValue="formData.businessLicense" :disabled="disabled" />
        </el-form-item>
      </div>
      <div>
        <el-form-item label="开户许可证" style="width: 100%" prop="accountOpeningLicense">
          <UploadImgs :bussiness-code="UPLOAD_FILE_BISSONESSCODE.SUPPLIER_FILE"
            v-model:modelValue="formData.accountOpeningLicense" :disabled="disabled" />
        </el-form-item>
      </div>
      <div>
        <el-form-item label="法人身份证" style="width: 100%" prop="corporateCardOss">
          <UploadImgs :bussiness-code="UPLOAD_FILE_BISSONESSCODE.SUPPLIER_FILE"
            v-model:modelValue="formData.corporateCardOss" :disabled="disabled" />
        </el-form-item>
      </div>
    </el-card>
    <div class="drawerFooter" v-if="!disabled">
      <el-button :disabled="formLoading" type="primary" @click="nextHandle">下一步</el-button>
    </div>
  </el-form>
</template>
<script setup lang="ts">
import STextArea from "@/components/common/input/s-textarea.vue";
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import UploadImgs from '@/components/UploadFile/src/UploadImgs.vue'
import { UPLOAD_FILE_BISSONESSCODE } from '@/components/UploadFile/src/useUpload'
import { addSupplier, getSupplierById, updateSupplier } from '@/api/supplier'
import { Rule } from '@form-create/element-ui'
const message = useMessage()
defineOptions({
  name: 'BaseInfo'
})

const emit = defineEmits(['next', 'update:id'])
const props = defineProps({
  id: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'edit'
  }
})

const disabled = computed(() => props?.type === 'view');
const formLoading = ref(false)
const formData = ref({
  collabModeList: [],
  collabMode: '',
  id: '',
  fullCompany: '', //公司全称
  socialCreditCode: '', //统一社会信用代码
  registrationDate: '', //注册日期
  registeredCapital: '', //注册资金
  registrationAuthority: '', //登记机关
  fax: '', //传真
  legalName: '', //法人代表姓名
  legalPhone: '', //法人代表手机
  supplierType: '', //供应商类型
  supplierCategory: '', //擅长类目
  registeredAddress: '', //注册地址
  actualOperatorName: '', //实际经营人姓名
  actualOperatorPhone: '', //实际经营人手机
  businessRepresentativeName: '', //业务代表姓名
  businessRepresentativePhone: '', //业务代表手机
  officeAddress: '', //办公详细地址
  supplierSiteNature: '', //场地性质
  supplierCompanyProperty: '', //公司性质
  employeNumber: '', //员工人数
  annualProductionValue: '', //年生产值
  supplierPaymentMethod: '', //结算方式
  supplierInvoiceType: '', //发票类型
  taxId: '', //税号
  accountName: '', //账户名称
  openingBank: '', //开户行
  accountNumber: '', //账号
  businessLicense: [], //营业执照
  accountOpeningLicense: [],
  corporateCardOss: [],
  abbreviationCompany: '' // 供应商简称
})
const validatePhone = (rule: any, value: any, callback: any) => {
  const reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/
  if (!!value && !reg.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}
const validateCard = (rule: any, value: any, callback: any) => {
  // const reg = /^[0-9A-Z]{18}$/g;
  const reg = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/g
  if (!value) {
    callback(new Error('请输入统一社会信用代码'))
  } else if (!!value && !reg.test(value)) {
    callback(new Error('请输入正确的统一社会信用代码'))
  } else {
    callback()
  }
}
const validateNumber = (rule: any, value: any, callback: any) => {
  if (!!value && value.indexOf('-') > -1) {
    callback(new Error('请输入正确的数值，不能为负数'))
  } else {
    callback()
  }
}
const formRules = reactive<Rule>({
  fullCompany: [{ required: true, message: '请输入公司全称', trigger: 'blur' }],
  socialCreditCode: [{ required: true, validator: validateCard, trigger: 'blur' }],
  legalPhone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  actualOperatorPhone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  businessRepresentativePhone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
  employeNumber: [{ required: true, validator: validateNumber, trigger: 'blur' }],
  annualProductionValue: [{ required: true, validator: validateNumber, trigger: 'blur' }],
  registeredCapital: [{ required: true, validator: validateNumber, trigger: 'blur' }],
  businessRepresentativeName: [{ required: true, message: '请输入业务代表姓名', trigger: 'blur' }],
  abbreviationCompany: [{ required: true, message: '请输入供应商简称', trigger: 'blur' }],
  registrationDate: [{ required: true, message: '请选择注册日期', trigger: 'blur' }],
  registrationAuthority: [{ required: true, message: '请输入登记机关', trigger: 'blur' }],
  fax: [{ required: true, message: '请输入传真', trigger: 'blur' }],
  legalName: [{ required: true, message: '请输入法人代表姓名', trigger: 'blur' }],
  supplierType: [{ required: true, message: '请选择供应商类型', trigger: 'blur' }],
  collabModeList: [{ required: true, message: '请选择合作模式', trigger: 'blur' }],
  registeredAddress: [{ required: true, message: '请输入注册地址', trigger: 'blur' }],
  actualOperatorName: [{ required: true, message: '请输入实际经营人姓名', trigger: 'blur' }],
  officeAddress: [{ required: true, message: '请输入办公详细地址', trigger: 'blur' }],
  supplierSiteNature: [{ required: true, message: '请选择场地性质', trigger: 'blur' }],
  supplierCompanyProperty: [{ required: true, message: '请选择公司性质', trigger: 'blur' }],
  supplierPaymentMethod: [{ required: true, message: '请选择结算方式', trigger: 'blur' }],
  supplierInvoiceType: [{ required: true, message: '请选择发票类型', trigger: 'blur' }],
  taxId: [{ required: true, message: '请输入税号', trigger: 'blur' }],
  accountName: [{ required: true, message: '请输入账户名称', trigger: 'blur' }],
  openingBank: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
  accountNumber: [{ required: true, message: '请输入账号', trigger: 'blur' }],
})
const pickerOptions = (time) => {
  return time.getTime() > Date.now() // 禁用未来的日期
}
const getData = async () => {
  if (!props.id) return
  formLoading.value = false
  const res = await getSupplierById(props.id)
  const { businessLicense, accountOpeningLicense, corporateCardOss, collabMode } = res
  formData.value = {
    ...res,
    businessLicense: businessLicense ? businessLicense.split(',') : [],
    accountOpeningLicense: accountOpeningLicense ? accountOpeningLicense.split(',') : [],
    corporateCardOss: corporateCardOss ? corporateCardOss.split(',') : [],
    collabModeList: collabMode ? collabMode.split(',') : [],
  }
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    collabModeList: [],
    collabMode: '',
    id: '',
    fullCompany: '', //公司全称
    socialCreditCode: '', //统一社会信用代码
    registrationDate: '', //注册日期
    registeredCapital: '', //注册资金
    registrationAuthority: '', //登记机关
    fax: '', //传真
    legalName: '', //法人代表姓名
    legalPhone: '', //法人代表手机
    supplierType: '', //供应商类型
    supplierCategory: '', //擅长类目
    registeredAddress: '', //注册地址
    actualOperatorName: '', //实际经营人姓名
    actualOperatorPhone: '', //实际经营人手机
    businessRepresentativeName: '', //业务代表姓名
    businessRepresentativePhone: '', //业务代表手机
    officeAddress: '', //办公详细地址
    supplierSiteNature: '', //场地性质
    supplierCompanyProperty: '', //公司性质
    employeNumber: '', //员工人数
    annualProductionValue: '', //年生产值
    supplierPaymentMethod: '', //结算方式
    supplierInvoiceType: '', //发票类型
    taxId: '', //税号
    accountName: '', //账户名称
    openingBank: '', //开户行
    accountNumber: '', //账号
    businessLicense: [], //营业执照
    accountOpeningLicense: [],
    corporateCardOss: [],
    abbreviationCompany: ''
  }
}
const formRef = ref()
const nextHandle = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  const { businessLicense, accountOpeningLicense, corporateCardOss } = formData.value
  const params = {
    ...formData.value,
    businessLicense: businessLicense.length > 0 ? businessLicense.join(',') : '',
    accountOpeningLicense: accountOpeningLicense.length > 0 ? accountOpeningLicense.join(',') : '',
    corporateCardOss: corporateCardOss.length > 0 ? corporateCardOss.join(',') : '',
    source: props.id ? undefined : '1'
  }

  formLoading.value = true
  try {
    const api = props.id ? updateSupplier : addSupplier
    const res = await api(params)
    if (res.success) {
      emit('next', 'business')
      res.data && emit('update:id', res.data)
    }
  } catch (error) {
  } finally {
    formLoading.value = false
  }
}
onMounted(() => {
  resetForm()
  getData()
})
</script>
<style lang="scss" scoped>
@use '@/styles/drawer.scss';

.base-form.el-form--inline {
  >.el-card {
    border-radius: 8px;

    &+.el-card {
      margin-top: 20px;
    }
  }

  .el-form-item {
    margin-right: 10px;
    width: calc(50% - 10px);
  }

  .el-form-item__label {
    text-align: right;
    color: #666666;
  }
}

:deep(.el-upload-list--picture-card) {
  // display: flex!important;
  // flex-wrap: inherit!important;
}
</style>
