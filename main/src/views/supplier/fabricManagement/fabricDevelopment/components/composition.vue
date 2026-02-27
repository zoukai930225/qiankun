<template>
  <div class="composition-dialog">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="面料种类" prop="key">
        <el-select v-model="form.key" placeholder="请选择" clearable filterable>
          <el-option v-for="opt in fabricOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="面料占比" prop="value">
        <el-input-number v-model="(form.value as any)" placeholder="请输入" :controls="false" :precision="2" :max="100"
          style="width: 100%;">
          <template #suffix>%</template>
        </el-input-number>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const props = defineProps<{
  init?: { key: string; value: number | string }
  onSubmit?: (item: { key: string; value: number | string }) => void
  selectedKeys?: string[]
}>()

const formRef = ref<FormInstance>()
const form = reactive({
  key: props.init?.key ?? '',
  value:
    props.init?.value !== undefined && props.init?.value !== null ? Number(props.init.value) : null
})

const fabricOptions = getIntDictOptions(DICT_TYPE.FABRIC, true)

const validatePercent = (rule: any, value: string, callback: any) => {
  if (value === '' || value === undefined || value === null)
    return callback(new Error('请输入面料占比'))
  const num = Number(value)
  if (Number.isNaN(num)) return callback(new Error('请输入数字'))
  if (num <= 0 || num > 100) return callback(new Error('请输入 0-100 之间的数'))
  callback()
}

const validateUniqueKey = (rule: any, value: string, callback: any) => {
  const key = String(value ?? '')
  if (!key) return callback()
  const initKey = props.init?.key != null ? String(props.init.key) : null
  const exists = (props.selectedKeys || []).map((k) => String(k))
  const isDuplicate = exists.includes(key) && (initKey === null || key !== initKey)
  if (isDuplicate) return callback(new Error('该种类已存在'))
  callback()
}

const rules = reactive<FormRules>({
  key: [
    { required: true, message: '请选择面料种类', trigger: 'change' },
    { validator: validateUniqueKey, trigger: 'change' }
  ],
  value: [
    { required: true, message: '请输入面料占比', trigger: 'blur' },
    { validator: validatePercent, trigger: 'blur' }
  ]
})

const submit = async () => {
  await formRef.value?.validate()
  props.onSubmit?.({ key: String(form.key), value: String(form.value) })
}

defineExpose({ submit })
</script>

<style lang="scss" scoped>
.composition-dialog {
  padding: 0 8px;
}

.composition-dialog :deep(.el-input .el-input__suffix) {
  color: var(--el-text-color-placeholder);
}

.composition-dialog {
  :deep() {
    .el-input-number {
      .el-input__inner {
        text-align: left;
      }
    }
  }
}
</style>
