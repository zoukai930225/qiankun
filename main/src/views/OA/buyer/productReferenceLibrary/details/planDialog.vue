<template>
  <scheme-dialog ref="detailsRef" name="PlanningConfirm" :width="520" top="15vh" :align="false">
    <template #card>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="6em" :disabled="isView">
        <el-form-item prop="confirmResult" label="确认结果">
          <el-select
            v-model="formData.confirmResult"
            placeholder="请选择确认结果"
            :disabled="isView"
          >
            <el-option
              v-for="item in resultOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          prop="latestCompletionDate"
          :label="'最晚完成\n日期'"
          class="multiline-label-item"
          v-if="formData.confirmResult === 4"
        >
          <!-- <template #label>
            <span class="text-right lh-16px"> 最晚完成<br />日期</span>
          </template> -->
          <el-date-picker
            v-model="formData.latestCompletionDate"
            type="date"
            placeholder="请选择最晚完成日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item prop="confirmRemark" label="备注">
          <s-text-area
            v-model="formData.confirmRemark"
            :rows="5"
            show-word-limit
            :maxlength="200"
            placeholder="请输入备注"
            :disabled="isView"
          />
        </el-form-item>
      </el-form>
    </template>

    <template #button>
      <el-button @click="handleCancel" :disabled="loading">取消</el-button>
      <el-button
        v-if="!isView"
        type="primary"
        :loading="loading"
        :disabled="loading"
        @click="handleSubmit"
      >
        确认
      </el-button>
    </template>
  </scheme-dialog>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { computed, nextTick, provide, reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { FormInstance, FormRules } from 'element-plus'
import {
  confirmResultOptions,
  planningConfirmDetail,
  savePlanningConfirm
} from '@/api/oa/buyer/productReference'
import { useMessage } from '@/hooks/web/useMessage'

type FormModel = {
  confirmResult: number | undefined
  confirmRemark: string
  latestCompletionDate: string | undefined
}

type ConfirmOption = {
  label: string
  value: number
}

type DialogMode = 'edit' | 'view'

const defaultForm = (): FormModel => ({
  confirmResult: undefined,
  confirmRemark: '',
  latestCompletionDate: undefined
})

const parseNumeric = (value: unknown): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined
  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}

const mapOptions = (source: any): ConfirmOption[] => {
  if (!source) return []
  const list = Array.isArray(source?.options) ? source.options : source
  if (!Array.isArray(list)) return []
  return list
    .map((item: any) => ({
      label: item?.label ?? item?.name ?? '',
      value: Number(item?.value)
    }))
    .filter((item) => item.label && !Number.isNaN(item.value))
}

const message = useMessage()
const emit = defineEmits<{ (e: 'refresh'): void }>()

const detailsRef = ref<any>(null)
const formRef = ref<FormInstance>()
const formData = ref<FormModel>(defaultForm())
const bukValue = ref<FormModel>(cloneDeep(formData.value))
const viewType = ref<DialogMode>('edit')
const loading = ref(false)
const resultOptions = ref<ConfirmOption[]>([])
const contextId = ref<string>('')

const title = computed(() => '企划确认')
const isView = computed(() => viewType.value === 'view')

const rules = reactive<FormRules<FormModel>>({
  confirmResult: [{ required: true, message: '请选择确认结果', trigger: 'change' }],
  latestCompletionDate: [{ required: true, message: '请选择最晚完成日期', trigger: 'change' }]
})

const resetForm = () => {
  formData.value = defaultForm()
  bukValue.value = cloneDeep(formData.value)
  resultOptions.value = []
}

const fillForm = (detail: Record<string, any> | null) => {
  const current = detail ?? {}
  formData.value = {
    confirmResult: parseNumeric(current.confirmResult),
    confirmRemark: current.confirmRemark ?? '',
    latestCompletionDate: current.latestCompletionDate ?? undefined
  }
  bukValue.value = cloneDeep(formData.value)
}

const fetchDetail = async (id: string) => {
  if (!id) return null
  const res = await planningConfirmDetail(id)
  return res ?? null
}

const fetchOptions = async (id: string) => {
  const res = await confirmResultOptions(id)
  resultOptions.value = mapOptions(res)
}

const openDialog = (options: { candidateProductId: string | number; mode?: DialogMode }) => {
  const { candidateProductId, mode = 'edit' } = options
  contextId.value = String(candidateProductId ?? '')
  viewType.value = mode
  resetForm()

  detailsRef.value?.openDialog(
    async () => {
      if (!contextId.value) return
      loading.value = true
      try {
        const fetchTasks = [fetchOptions(contextId.value)]
        if (mode === 'view') {
          fetchTasks.push(
            fetchDetail(contextId.value).then((res) => {
              if (res) {
                fillForm(res)
              }
            })
          )
        }
        await Promise.all(fetchTasks)
      } catch (error) {
        console.error(error)
        message.error('获取企划确认信息失败，请稍后再试')
      } finally {
        loading.value = false
      }
    },
    () => {
      nextTick(() => formRef.value?.clearValidate())
    }
  )
}

const buildPayload = () => ({
  candidateProductId: contextId.value,
  confirmResult: formData.value.confirmResult,
  confirmRemark: formData.value.confirmRemark?.trim() || '',
  latestCompletionDate: formData.value.latestCompletionDate
})

const handleSubmit = async () => {
  if (isView.value) {
    detailsRef.value?.close()
    return
  }
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true
    const payload = buildPayload()
    const res = await savePlanningConfirm(payload)
    if (res?.success === false) {
      message.error(res?.message || '保存失败，请稍后再试')
      return
    }
    message.success('保存成功！')
    bukValue.value = cloneDeep(formData.value)
    detailsRef.value?.close()
    emit('refresh')
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  detailsRef.value?.close()
}

defineExpose({ openDialog })
provide('PlanningConfirmDetails', { dataValue: formData, bukValue, viewType, title })
</script>
<style lang="less" scoped>
:deep(.el-form) {
  .el-input {
    width: 100%;
  }
  .el-date-picker {
    width: 100%;
  }
}
</style>
