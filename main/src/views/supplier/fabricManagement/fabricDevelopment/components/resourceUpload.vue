<template>
  <el-scrollbar height="600px">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="面料报价" prop="fabricPrice" v-if="type === 1">
        <transfer :width="400" v-model="form.fabricPrice" @change="handleChange('fabricPrice')"
          :tip="'最多上传5张大小不超过20M的文件'" :limit="5" is-all />

      </el-form-item>
      <el-form-item label="面料成分" prop="fabricComponent" v-if="type === 1">
        <transfer :width="400" v-model="form.fabricComponent" @change="handleChange('fabricComponent')"
          :tip="'最多上传5张大小不超过20M的文件'" :limit="5" is-all />
      </el-form-item>
      <el-form-item label="报告">
        <s-text-area v-model="form.reportContent" class="!w400px" placeholder="请输入"
          :autosize="{ minRows: 3, maxRows: 4 }" maxlength="200" show-word-limit />
      </el-form-item>
      <el-form-item label="">
        <transfer :width="400" v-model="form.reportFile" :tip="'最多上传5张大小不超过20M的文件'" :limit="5" is-all />
      </el-form-item>
    </el-form>
  </el-scrollbar>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import * as fabricDevelopmentApi from '@/api/supplier/fabricManagement/fabricDevelopment'
import asyncWrapper from '@/utils/asyncWrapper'

type propsType = {
  id: string,
  fabricId: string,
  supplierId: string,
  type: number
}
const props = defineProps<propsType>()


const formRef = ref<FormInstance>()
const form = ref({
  fabricPrice: '',
  fabricComponent: '',
  reportContent: '',
  reportFile: '',
})

const message = useMessage() // 消息弹窗
const rules = reactive<FormRules>({
  fabricPrice: [{ required: true, message: '请上传面料报价', trigger: 'change' }],
  fabricComponent: [{ required: true, message: '请上传面料成分', trigger: 'change' }],
  // reportContent: [{ required: true, message: '请输入报告', trigger: 'blur' }],
})
let sourceData = ''

const handleChange = (val) => {
  setTimeout(() => {
    formRef.value?.validateField(val)
  }, 0);

}

const isEidit = () => {
  const lastData = JSON.stringify(form.value)
  return lastData === sourceData
}

const submit = async (closeCB, handleLoading) => {
  if (!form.value.reportContent && !form.value.reportFile) {
    message.error("报告至少填写或上传文件")
    return
  }
  await formRef.value?.validate()
  handleLoading(true)
  const reuqetParam = {
    id: props.id,
    fabricId: props.fabricId,
    supplierId: props.supplierId,
    ...form.value
  }
  const [data, error] = await asyncWrapper(fabricDevelopmentApi.uploadData(reuqetParam))
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
/* .composition-dialog {
  padding: 0 8px;
  height: 600px;
  overflow-y: auto;
}

.composition-dialog */
:deep(.el-input .el-input__suffix) {
  color: var(--el-text-color-placeholder);
}
</style>
