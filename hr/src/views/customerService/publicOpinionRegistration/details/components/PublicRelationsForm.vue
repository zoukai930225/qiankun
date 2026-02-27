<!--
 * @Description: 公关处理表单组件
-->
<template>
  <div class="pr-form-wrapper">
    <div class="form-section-title">公关处理</div>
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      inline
      label-width="80px"
      class="opinion-form"
    >
      <el-form-item label="处置动作" prop="disposalAction" class="full-width-item">
        <el-input
          v-model="formData.disposalAction"
          type="textarea"
          placeholder="请输入处置动作"
          maxlength="500"
          show-word-limit
          :rows="3"
          :disabled="disabled"
        />
      </el-form-item>

      <el-form-item label="处置结果" prop="disposalResult">
        <el-select
          v-model="formData.disposalResult"
          placeholder="请选择处置结果"
          clearable
          :disabled="disabled"
        >
          <el-option
            v-for="item in disposalResultOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="公关备注" prop="prRemark" class="full-width-item">
        <el-input
          v-model="formData.prRemark"
          type="textarea"
          placeholder="请输入公关备注"
          maxlength="300"
          show-word-limit
          :rows="3"
          :disabled="disabled"
        />
      </el-form-item>

      <el-form-item label="截图" prop="screenshot" class="full-width-item">
        <UploadTransfer
          v-model="formData.screenshot"
          :limit="5"
          accept-type="image"
          :disabled="disabled"
          :upload-data="{ code: 'PUBLIC_OPINION_PR' }"
          value-type="string"
          tip="支持上传图片，单个文件不超过20M，最多5张"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="tsx" setup>
import { type DataItem } from '../../page/config'
import UploadTransfer from '@/components/common/upload/transfer.vue'
import type { FormInstance, FormRules } from 'element-plus'
const { dictDataList } = inject('PublicOpinionRegistrationForm') as {
  dictDataList: Ref<Record<string, any[]>>
}
interface Props {
  modelValue: DataItem
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: DataItem]
}>()

const formRef = ref<FormInstance>()

const formData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 处置结果选项
const disposalResultOptions = computed(() => dictDataList.value['pi_disposal_result'] || [])

// 表单验证规则
const rules = computed<FormRules>(() => ({
  disposalAction: [{ required: true, message: '请输入处置动作', trigger: 'blur' }],
  disposalResult: [{ required: true, message: '请选择处置结果', trigger: 'change' }],
  screenshot: [{ required: true, message: '请上传截图', trigger: 'change' }]
}))

// 暴露验证方法
const validate = async (): Promise<boolean> => {
  if (!formRef?.value) return false
  try {
    await formRef.value.validate()
    return true
  } catch {
    return false
  }
}

// 清除验证
const clearValidate = () => {
  formRef?.value?.clearValidate()
}

defineExpose({ validate, clearValidate })
</script>

<style lang="scss" scoped>
@use '../styles.scss';
</style>
