<template>
  <div class="composition-dialog">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item :label="type === 1 ? '测试结果' : '试穿结果'" prop="operateStatus">
        <el-radio-group v-model="form.operateStatus" style="margin-top:-10px ;">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" :prop="form.operateStatus === 2 ? 'remark' : ''" :key="form.operateStatus">
        <s-text-area v-model="form.remark" class="!w100%" placeholder="请填写备注" style="color: #333;margin-top: -10px;"
          :autosize="{ minRows: 3, maxRows: 4 }" maxlength="200" show-word-limit />
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
  type: number,
  chooseRecordId: string
}
const props = defineProps<propsType>()
const selectUserRef = ref(null)
let sourceData = ''


const formRef = ref<FormInstance>()
const form = ref({
  remark: '',
  operateStatus: 1
})


const rules = reactive<FormRules>({
  operateStatus: [{ required: true, message: '请选择测试结果', trigger: 'change' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'change' }],
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
    chooseRecordId: props.chooseRecordId,
    ...form.value
  }
  const promise = props.type === 1 ? fabricDevelopmentApi.trialResultTest : fabricDevelopmentApi.bfConfirmResult
  const [data, error] = await asyncWrapper(promise(reuqetParam))
  if (!error) {
    closeCB()
  }
  handleLoading(false)
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
