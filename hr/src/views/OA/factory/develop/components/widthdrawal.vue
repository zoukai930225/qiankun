<template>
  <el-form ref="formRef" :model="form" :rules="formRules" label-width="80">
    <el-form-item prop="withdrawReason" label="撤回原因">
      <s-text-area
        v-model="form.withdrawReason"
        :autosize="{ minRows: 4, maxRows: 6 }"
        style="width: 100%"
        show-word-limit
        maxlength="200"
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import request from '@/config/axios'
const message = useMessage()
const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  }
})
const formRef=ref()
const form = ref({
  withdrawReason: ''
})
const formRules = ref({
  withdrawReason: [
    {
      required: true,
      message: '请输入撤回原因',
      trigger: 'blur'
    }
  ]
})

const loading = ref(false)
const submit = async () => {
  if (loading.value) return
  await formRef?.value?.validate()
  try {
    loading.value = true
    //todo
    const data = {
      ...form.value,
      fsTaskId: props?.item?.fsTaskId || '',
      supplierId: props?.item?.supplierId || '',
      id: props?.item?.id || ''
    }
    await request.post({
      url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/withdrawQuotation`,
      data
    })
    message.success('操作成功')
  } finally {
    loading.value = false
  }
}

defineExpose({ submit })
</script>
