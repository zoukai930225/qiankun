<template>
  <SWDialog v-model="dialogVisible" :title="dialogTitle" width="900px" @close="close">
    <priceCheckForm class="priceForm" ref="priceFormRef" :formData="formData"/>
    <template #footer>
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="submitFunc" :loading="loading">确定</el-button>
    </template>
  </SWDialog>

</template>
<script lang="ts" setup>
import * as factoryDevelopApi from '@/api/oa/factory/develop'
import priceCheckForm from './priceCheckForm.vue'
const emits = defineEmits(['success'])
const message = useMessage()
const dialogVisible = ref(false)
const dialogTitle = "报价核价"
const fsTaskId = ref('') // 工厂二开任务id
const supplierId = ref('') // 选择的工厂id
const priceFormRef = ref()
const formData = ref<any>({
  physicalQuotePrice: undefined,
  lifeCycle: undefined,
  singleColorOrderQuantity: undefined,
  productCostExcludingTax: undefined,
  productCostIncludingTax: undefined,
  productCost:undefined,
  packagingManpower:undefined,
  packagingCost:undefined,
  remark: undefined,
  attachmentUrl: []
})

const loading = ref(false)
const submitFunc = async()=>{
  await priceFormRef.value?.submitForm()
  await message.confirm('是否确认提交【报价核价】？', '系统提示')
  const loadingInstance = ElLoading.service({fullscreen: true, text: '数据提交中'})
  const data = {
    fsTaskId:fsTaskId.value,
    supplierId:supplierId.value,
    ...formData.value,
    attachmentUrl:formData.value.attachmentUrl.map((file:any)=>file.url).join(',')
  }
  try{
    await factoryDevelopApi.saveQuoteVerification(data)
    message.success('提交成功')
    close()
    emits('success')
  }finally{
    loadingInstance.close()
  }
}

const open = (taskId,checkedSupplierId) => {
  fsTaskId.value = taskId
  supplierId.value = checkedSupplierId
  dialogVisible.value = true
}
const close = () => {
  dialogVisible.value = false
  formData.value = {
    physicalQuotePrice: undefined,
    lifeCycle: undefined,
    singleColorOrderQuantity: undefined,
    productCostExcludingTax: undefined,
    productCostIncludingTax: undefined,
    productCost:undefined,
    packagingManpower:undefined,
    packagingCost:undefined,
    remark: undefined,
    attachmentUrl: []
  }
  priceFormRef.value?.resetForm()
}
defineExpose({ open })
</script>

<style lang="scss" scoped>
.priceForm{
  margin: 0 -16px;
  padding: 20px;
  border-top: 1px solid #e5e5e5;
}
</style>
