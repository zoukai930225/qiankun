<template>
  <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
    <el-form-item label="选用原因" prop="chooseReason">
      <s-text-area
        v-model="form.chooseReason"
        class="!w100%"
        placeholder="请输入"
        :autosize="{ minRows: 3, maxRows: 4 }"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import request from '@/config/axios'
type propsType = {
  id: string
  fabricId: string
  supplierId: string
  type: number
}
const message = useMessage()
let sourceData = ''
const props = defineProps<propsType>()
const formRef = ref(),
  form = ref({
    chooseReason: ''
  })
const rules = ref({
  chooseReason: [{ required: true, message: '请输入选用原因', trigger: ['blur', 'change'] }]
})

const isEidit = () => {
  const lastData = JSON.stringify(form.value)
  return lastData === sourceData
}

const loading = ref(false)
const submit = async () => {
  if (loading.value) return
  await formRef.value?.validate()
  try {
    loading.value = true
    // handleLoading(true)
    const reuqetParam = {
      // id: props.id,
      fabricId: props.fabricId,
      supplierId: props.supplierId,
      ...form.value
    }
    await request.post({
      url: `/workflow-api/api/workflow/business/fabric/develop/supplier/choose`,
      data: reuqetParam
    })
    message.success('操作成功')
    // if (!error) {
    // closeCB()
    // }
  } finally {
    loading.value = false
    // handleLoading(false)
  }
}

onMounted(() => {
  sourceData = JSON.stringify(form.value)
})

defineExpose({ submit, isEidit })
</script>
