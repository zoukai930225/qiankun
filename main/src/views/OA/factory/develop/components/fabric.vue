<template>
  <el-form ref="formRef" :model="form" :rules="formRules" label-width="80px">
    <el-form-item prop="status" label="面料结果">
      <el-radio-group v-model="form.status">
        <el-radio label="审核通过" value="1"></el-radio>
        <el-radio label="继续调整" value="2"></el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- :rules="[{ required: form.status === '2', message: '请输入备注', trigger: 'blur' }]" -->
    <el-form-item prop="remark" label="备注" >
      <s-text-area
        v-model="form.remark"
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
const formRef =ref()
const form = ref({
  status: '1',
  remark: ''
})
const formRules = computed(() => {
  return {
    status: [{ required: true, message: '请选择面料结果', trigger: 'change' }],
    remark: [{ required: form.value.status === '2', message: '请输入备注', trigger: ['change', 'blur'] }]
  }
})

const loading = ref(false)
const submit = async () => {
  if (loading.value) return
  await formRef?.value?.validate()
  try {
    loading.value = true
    await message.confirm('请仔细核对备注信息,确认提交?')
    const data = {
      ...form.value,
      id: props?.item?.id || '',
      fsTaskId: props?.item?.fsTaskId || '',
      supplierId: props?.item?.supplierId || ''
    }
    await request.post({
      url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/confirmFabricResult`,
      data
    })
    message.success('提交成功')
  } finally {
    loading.value = false
  }
}

defineExpose({ submit })
</script>
