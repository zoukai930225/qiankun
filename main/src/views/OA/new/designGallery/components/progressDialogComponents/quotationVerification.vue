<!--
 * @Date: 2025-07-22 08:46:34 报价核价
-->
<template>
  <SWDialog v-model="dialogVisible" :showTitleLine="true" :title="currentDetail?.supplierName" width="960">
    <div class="container">
      <el-form :model="form" label-width="120px" ref="formRef" :rules="rules" label-position="right">
        <el-row :gutter="10">
          <!-- <el-col :span="12">
          <el-form-item label="实物报价" prop="physicalQuotePrice">
            <el-input v-model="form.physicalQuotePrice" placeholder="请填写实物报价" />
          </el-form-item>
        </el-col> -->
          <el-col :span="12">
            <el-form-item label="生产周期" prop="lifeCycle">
              <el-input v-model="form.lifeCycle" placeholder="请填写生产周期" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单色起订量" prop="singleColorOrderQuantity">
              <el-input v-model="form.singleColorOrderQuantity" placeholder="请填写单色起订量" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <!-- <el-col :span="12">
            <el-form-item label="裸货价(不含税)元" prop="productCostExcludingTax" class="longLabel">
              <el-input-number placeholder="如有多个成本,填写最大的" v-model="form.productCostExcludingTax" style="width: 100%;"
                :controls="false" :precision="3" />
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="含税裸货价(元)" prop="productCostIncludingTax">
              <el-input-number placeholder="不含独立包装人工费,不含合格证贴纸,不含包材" v-model="form.productCostIncludingTax"
                style="width: 100%;" :controls="false" :precision="3" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包装人工费(元)" prop="packagingManpowerNew">
              <el-input-number placeholder="独立包装人工费" v-model="form.packagingManpowerNew" style="width: 100%;"
                :controls="false" :precision="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="成品价(元)" prop="finishedProductPrice">
              <el-input-number placeholder="不含包材" v-model="form.finishedProductPrice" style="width: 100%;"
                :controls="false" :precision="3" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="包材费用(元)" prop="packagingCostNew">
              <el-input-number placeholder="请填写包材费用" v-model="form.packagingCostNew" style="width: 100%;"
                :controls="false" :precision="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-row>
          <el-col>
            <el-form-item label="含税成品价" prop="finishedProductPrice">
              <el-input-number placeholder="不含包材" v-model="form.finishedProductPrice" style="width: 100%;"
                :controls="false" :precision="3" />
            </el-form-item>
          </el-col>
        </el-row> -->
        <el-row>
          <el-col>
            <el-form-item label="产品成本补充" prop="productCost">
              <s-text-area v-model="form.productCost" placeholder="请填写产品成本补充" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="remark">
              <s-text-area placeholder="请填写备注" v-model="form.remark" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="报价单" prop="attachmentUrl">
              <SWUploadFile ref="swUploadFileRef" v-model:modelValue="form.attachmentUrl" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">提 交</el-button>
    </template>
  </SWDialog>

</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { confirmQuotePrice,getSupplierAuditStatusInfo,updateQuotePrice } from '@/api/oa/new/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
const dialogVisible = ref(false)
const message = useMessage() // 消息弹窗

/**
 * 报价核价：physicalQuotePrice
  生产周期：lifeCycle
  单色起定量：singleColorOrderQuantity
  产品成本（裸货，含运）不含税（元）：productCostExcludingTax
  产品成本（裸货，含运）含税（元）：productCostIncludingTax
  产品成本补充：productCost
  包装人工费（元）：packagingManpowerNew
  包材费用（元）：packagingCostNew
  备注：remark
  报价单：attachmentUrl
 */
const form = ref({
  physicalQuotePrice: undefined,
  lifeCycle: undefined,
  singleColorOrderQuantity: undefined,
  productCostExcludingTax: 0.000,
  productCostIncludingTax: 0.000,
  productCost: undefined,
  finishedProductPrice: 0.000,
  packagingManpowerNew: 0.000,
  packagingCostNew: 0.000,
  remark: undefined,
  attachmentUrl: []
})
const rules = {
  physicalQuotePrice: [{ required: true, message: '请输入实物报价', trigger: 'blur' }],
  lifeCycle: [{ required: true, message: '请输入生命周期', trigger: 'blur' }],
  singleColorOrderQuantity: [{ required: true, message: '请输入单色起订量', trigger: 'blur' }],
  productCostIncludingTax: [{ required: true, message: '请输入含税裸货价', trigger: 'blur' }],
  packagingManpowerNew: [{ required: true, message: '请输入包装人工费', trigger: 'blur' }],
  packagingCostNew: [{ required: false, message: '请输入包材费用', trigger: 'blur' }],
  attachmentUrl: [{ required: true, message: '请上传报价单', trigger: 'change' }],
  finishedProductPrice: [{ required: true, message: '请输入成品价', trigger: 'blur' }]
}

const currentDetail = ref()
const currentType = ref()
const open = (item,type?) => {
  dialogVisible.value = true
  currentDetail.value = item
  currentType.value = type
  if(item.id && type === 'update'){
    getSupplierAuditStatusInfo({id:item.id}).then((res:any)=>{
      if(res)form.value = { ...res ,attachmentUrl:res.attachmentUrl?res.attachmentUrl.split(',').map((files:any)=>({ url:files})) : []}
    })
  }
}
const loading = ref(false) // 提交按钮加载状态
const emit = defineEmits(['success']) // 定义 success 事件

const formRef = ref()
const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  //二次确认提交逻辑
  if (Number(form.value.finishedProductPrice) === 0) {
    await message.confirm('该报价核价中，含税成品价为0元，请确认是否填写正确？', '系统提示')
  }
  await message.confirm('是否确认提交【报价核价】？', '系统提示')
  // 提交逻辑
  console.log('提交表单', form.value)
  try {
    const data = {
      id: currentDetail.value.id,
      ...form.value,
      attachmentUrl: form.value.attachmentUrl.map((file: any) => file.url).join(',')
    }
    loading.value = true
    currentType.value === 'update'? await updateQuotePrice(data) : await confirmQuotePrice(data)
    loading.value = false
    message.success('提交成功')
    console.log('提交成功')
    resetForm()
    currentDetail.value = null
    emit('success')
    dialogVisible.value = false
    console.log('关闭弹窗', dialogVisible.value)
  } catch (error) {
    loading.value = false
    console.error('提交失败', error)
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  form.value = {
    physicalQuotePrice: undefined,
    lifeCycle: undefined,
    singleColorOrderQuantity: undefined,
    productCostExcludingTax: 0.000,
    productCostIncludingTax: 0.000,
    productCost: undefined,
    finishedProductPrice: 0.000,
    packagingManpowerNew: 0.000,
    packagingCostNew: 0.000,
    remark: undefined,
    attachmentUrl: []
  }
}

// const autoCountFinishedProductPrice = () => {
//   if (form.value.productCostExcludingTax || form.value.packagingManpowerNew) {
//     form.value.finishedProductPrice = Number(form.value.productCostExcludingTax) + Number(form.value.packagingManpowerNew)
//   } else {
//     form.value.finishedProductPrice = undefined
//   }
// }

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
.container {
  margin-top: 20px;

  :deep(.longLabel .el-form-item__label) {
    line-height: 16px;
    text-align: right;
  }

  :deep(.el-input-number .el-input__inner) {
    text-align: left;
  }
}
</style>
