<template>
  <SWDialog v-model="dialogVisible" width="577px" :title="dialogTitle" :showTitleLine="true" :showBottomLine="true"
    v-loading="loading" @close="close">
    <el-form class="mt20px" :model="form" ref='formRef' :rules="rules">
      <el-form-item prop="blockReason">
        <s-text-area v-model.trim="form.blockReason" placeholder="请输入拉黑原因" :rows="7"
          :disabled="dialogType === 'unblock'" showWordLimit maxlength="500" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="btns mt10px mr20px">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" v-if="dialogType === 'block'" @click="submitBlock" :disabled="loading">提交</el-button>
        <el-button type="primary" v-else @click="cancelBlock">取消拉黑</el-button>
      </div>
    </template>
  </SWDialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as blockApi from '@/api/supplier/block'
const message = useMessage()
const dialogVisible = ref(false);
const dialogType = ref()
const dialogTitle = ref()
const loading = ref(false)
const open = (type: string, row: any) => {
  form.value.supplierId = row.id
  dialogVisible.value = true
  dialogType.value = type
  dialogTitle.value = type === 'block' ? '拉黑' : '拉黑原因'

  if (type === 'unblock') {
    loading.value = true
    blockApi.getBlockReason(row.id).then((res: any) => {
      console.log(res)
      form.value.blockReason = res
    }).finally(() => {
      loading.value = false
    })

  }
}
const close = () => {
  dialogVisible.value = false
  form.value = {
    supplierId: '',
    blockReason: '',
  }
  formRef.value?.resetFields()
}
const form = ref({
  supplierId: '',
  blockReason: '',
})
const formRef = ref()
const rules = reactive({
  blockReason: [{ required: true, message: '请输入拉黑原因', trigger: ['blur'] }]
})
defineExpose({
  open
})
const emits = defineEmits(['success'])
// 确认拉黑
const submitBlock = async () => {
  await formRef.value?.validate()
  loading.value = true
  blockApi.setBlockSupplier({ ...form.value }).then(() => {
    loading.value = false
    message.success('拉黑成功')
    close()
    emits('success', '4')
  }).catch(() => {
    loading.value = false
  })

}
// 取消拉黑
const cancelBlock = () => {
  loading.value = true
  const { supplierId } = form.value
  blockApi.cancelBlockSupplier({ supplierId }).then(() => {
    loading.value = false
    message.success('取消拉黑成功')
    close()
    emits('success', '2')
  }).catch(() => {
    loading.value = false
  })
}
</script>
<style lang="scss" scoped>
:deep() {
  .el-textarea__inner {
    color: #333;
  }
}
</style>