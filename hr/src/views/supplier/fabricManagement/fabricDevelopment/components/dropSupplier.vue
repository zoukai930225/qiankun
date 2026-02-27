<template>
  <div class="composition-dialog">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">

      <el-form-item label="淘汰原因" prop="remark">
        <s-text-area v-model="form.remark" class="!w100%" placeholder="请输入淘汰原因" :autosize="{ minRows: 3, maxRows: 4 }"
          maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label="附件" prop="value">
        <transfer style="width: 450px;" v-model="form.attachmentUrl" :tip="'最多上传5张大小不超过20M的文件'" :limit="5" is-all />
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
  fabricId: string,
  supplierId: string,
  type: number
}
const props = defineProps<propsType>()
let sourceData = ''

const formRef = ref<FormInstance>()
const form = ref({
  remark: '',
  attachmentUrl: '',
})

const rules = reactive<FormRules>({
  remark: [{ required: true, message: '请输入淘汰原因', trigger: 'blur' }],
})

const isEidit = () => {
  const lastData = JSON.stringify(form.value)
  return lastData === sourceData
}

const submit = async (closeCB, handleLoading) => {
  await formRef.value?.validate()
  handleLoading(true)
  const reuqetParam = {
    id: props.id,
    fabricId: props.fabricId,
    supplierId: props.supplierId,
    ...form.value
  }
  const [data, error] = await asyncWrapper(fabricDevelopmentApi.eliminateSupplier(reuqetParam), handleLoading(true))
  if (!error) {
    closeCB()
  }
}

onMounted(() => {
  sourceData = JSON.stringify(form.value)
})


defineExpose({ submit, isEidit })
</script>

<style scoped>
.composition-dialog {
  padding: 0 8px;
}

.composition-dialog :deep(.el-input .el-input__suffix) {
  color: var(--el-text-color-placeholder);
}
</style>
