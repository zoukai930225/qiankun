<template>
  <SWDialog v-model="dialogShow" title="采购信息填写" :showTitleLine="true" :showBottomLine="true" @closed="handleClosed">
    <el-form :model="formData" ref="formRef" :rules="rules" class="mt20px" :label-width="140">
      <el-form-item label="发货下单时间" prop="bulkGoodsOrderTime">
        <el-date-picker v-model="formData.bulkGoodsOrderTime" style="width: 100%;" type="datetime"
          value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" placeholder="请选择发货下单时间" :disabled="!isEdit" />
      </el-form-item>
      <el-form-item label="首批到仓时间" prop="firstArrivedWarehouseTime">
        <el-date-picker v-model="formData.firstArrivedWarehouseTime" style="width: 100%;" type="datetime"
          value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" placeholder="请选择首批到仓时间" :disabled="!isEdit" />
      </el-form-item>
      <el-form-item label="产前样时间" prop="prenatalSamplingTime">
        <el-date-picker v-model="formData.prenatalSamplingTime" style="width: 100%;" type="datetime"
          value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" placeholder="请选择产前样时间" :disabled="!isEdit" />
      </el-form-item>
      <el-form-item label="预计清单到货时间" prop="listEstimatedDeliveryTime">
        <el-date-picker v-model="formData.listEstimatedDeliveryTime" style="width: 100%;" type="datetime"
          value-format="YYYY-MM-DD HH:mm" format="YYYY-MM-DD HH:mm" placeholder="请选择预计清单到货时间" :disabled="!isEdit" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="btns mt10px mr20px">

        <el-button @click="dialogShow = false">取消</el-button>
        <el-button type="primary" v-if="isEdit" :loading="loading" @click="handleSubmit">提交</el-button>
      </div>
    </template>
  </SWDialog>
</template>

<script lang="ts" setup>
import * as factoryPlanApi from '@/api/oa/factory/plan'
const dialogShow = ref(false)
const loading = ref(false)
const formData = ref<any>({
  fsTaskId: "",
  supplierId: "",
  bulkGoodsOrderTime: "",
  firstArrivedWarehouseTime: "",
  prenatalSamplingTime: "",
  listEstimatedDeliveryTime: ""
})
const formRef = ref()
const rules = reactive({
  'bulkGoodsOrderTime': [{ required: true, message: '请选择发货下单时间', trigger: ['change', 'blur'] }],
  'firstArrivedWarehouseTime': [{ required: true, message: '请选择首批到仓时间', trigger: ['change', 'blur'] }],
  'prenatalSamplingTime': [{ required: true, message: '请选择产前样时间', trigger: ['change', 'blur'] }],
  'listEstimatedDeliveryTime': [{ required: true, message: '请选择预计清单到货时间', trigger: ['change', 'blur'] }]
})

const emit = defineEmits(['success'])
const message = useMessage()
const handleSubmit = async () => {
  await formRef.value?.validate()
  try {
    await factoryPlanApi.fillPurchaseInfo({ ...formData.value })
    message.success('提交成功')
    handleClosed()
    emit('success')
  } finally {

  }
}
const handleClosed = () => {
  dialogShow.value = false
}

const getPurchaseInfo = async () => {
  const { fsTaskId, supplierId } = formData.value
  const data = await factoryPlanApi.getPurchaseInfo({ fsTaskId, supplierId })
  formData.value = Object.assign(formData.value, data)
}
const isEdit = ref(true)
const open = async (taskId: string, suppId: string, isNodeInProgress: boolean) => {
  dialogShow.value = true
  formData.value.fsTaskId = taskId
  formData.value.supplierId = suppId
  isEdit.value = isNodeInProgress
  getPurchaseInfo()
}
defineExpose({ open })
</script>
<style lang="scss" scoped>
:deep(.el-form-item--default) {
  margin-bottom: 24px !important;

  .el-form-item__error {
    padding-top: 4px;
  }
}
</style>
