<template>
  <div class="composition-dialog">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">

      <el-form-item label="终止原因" :prop="type === 1 ? 'terminationReason' : ''">
        <s-text-area v-model="form.terminationReason" :disabled="type === 2" class="!w100%" placeholder="请输入终止原因"
          :autosize="{ minRows: 4, maxRows: 5 }" maxlength="200" show-word-limit />
      </el-form-item>

    </el-form>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import asyncWrapper from '@/utils/asyncWrapper'
import * as fabricDevelopmentApi from '@/api/supplier/fabricManagement/fabricDevelopment'

type propsType = {
  id: string,
  type: number
  detailData: any,
}
const props = defineProps<propsType>()
const selectUserRef = ref(null)
let sourceData = ''


const formRef = ref<FormInstance>()
const form = ref({
  terminationReason: '',
})

const rules = reactive<FormRules>({
  terminationReason: [{ required: true, message: '请输入终止原因', trigger: 'change' }],
})

const isEidit = () => {
  const lastData = JSON.stringify(form.value)
  return lastData === sourceData
}

const submit = async (closeCB, handleLoading) => {
  await formRef.value?.validate()
  handleLoading(true)
  const reuqetParam = {
    fabricId: props.id,
    ...form.value
  }
  const [data, error] = await asyncWrapper(fabricDevelopmentApi.stopProgress(reuqetParam))
  if (!error) {
    closeCB()
  }
  handleLoading(false)
}


onMounted(() => {
  if (props.type === 2) {
    form.value.terminationReason = props.detailData
  }
  sourceData = JSON.stringify(form.value)
})
defineExpose({ submit, isEidit })
</script>

<style lang="scss" scoped>
.composition-dialog {
  padding: 0 8px;
}

.composition-dialog :deep(.el-input .el-input__suffix) {
  color: var(--el-text-color-placeholder);
}
</style>
