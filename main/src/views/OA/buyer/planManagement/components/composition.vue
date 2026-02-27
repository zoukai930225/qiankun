<template>
  <div class="composition-dialog">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
      <el-form-item label="面料种类" prop="key">
        <el-input v-model.trim="form.key" placeholder="请输入" clearable />
      </el-form-item>
      <el-form-item label="面料占比" prop="value">
        <el-input v-model.trim="form.value" placeholder="请输入">
          <template #suffix>%</template>
        </el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="tsx" setup>
import { ref, reactive } from 'vue'
import { ElButton } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
// import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const props = defineProps<{
  init?: { key: string; value: number | string }
  onSubmit?: (item: { key: string; value: number | string }, continueAdd: boolean) => boolean | void
  selectedKeys?: string[]
  isAdd?: boolean
}>()

const formRef = ref<FormInstance>()
const form = reactive({
  key: props.init?.key ?? '',
  value:
    props.init?.value !== undefined && props.init?.value !== null ? String(props.init.value) : ''
})

// const fabricOptions = getIntDictOptions(DICT_TYPE.FABRIC, true)

const validatePercent = (_rule: any, value: string, callback: any) => {
  const str = String(value ?? '').trim()
  if (!str) return callback(new Error('请输入面料占比'))
  if (!/^\d+(\.\d{1,2})?$/.test(str)) return callback(new Error('请输入数字，最多保留2位小数'))
  const num = Number(str)
  if (!Number.isFinite(num)) return callback(new Error('请输入数字'))
  if (num < 0 || num > 100) return callback(new Error('请输入 0-100 之间的数'))
  callback()
}

const validateUniqueKey = (_rule: any, value: string, callback: any) => {
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
    { required: true, message: '请输入面料种类', trigger: 'blur' },
    { validator: validateUniqueKey, trigger: 'blur' }
  ],
  value: [
    { required: true, message: '请输入面料占比', trigger: 'blur' },
    { validator: validatePercent, trigger: 'blur' }
  ]
})

const submit = async (continueAdd: boolean = false) => {
  await formRef.value?.validate()
  const result = props.onSubmit?.({ key: String(form.key), value: String(form.value) }, continueAdd)
  return result !== false
}

const renderFooter = ({
  onConfirmClose,
  onClose
}: {
  onConfirmClose: () => void
  onClose: () => void
}) => {
  const handleContinueAdd = async () => {
    const shouldContinue = await submit(true)
    if (shouldContinue) {
      form.key = ''
      form.value = ''
      formRef.value?.clearValidate()
    }
  }

  const handleSubmit = async () => {
    const shouldClose = await submit(false)
    if (shouldClose) {
      onConfirmClose()
    }
  }

  return (
    <div class="composition-footer">
      <ElButton onClick={onClose}>取消</ElButton>
      {props.isAdd ? (
        <ElButton type="primary" plain onClick={handleContinueAdd}>
          继续添加
        </ElButton>
      ) : null}
      <ElButton type="primary" onClick={handleSubmit}>
        提交
      </ElButton>
    </div>
  )
}

defineExpose({ submit, renderFooter })
</script>
