<template>
  <scheme-dialog
    ref="dialogRef"
    name="MatchSupplier"
    :width="520"
    top="15vh"
    :align="false"
    title="匹配供应商"
  >
    <template #card>
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item prop="supplierId" label="供应商">
          <el-select
            v-model="formData.supplierId"
            placeholder="请选择供应商"
            clearable
            filterable
            multiple
            :loading="supplierLoading"
            style="width: 100%"
          >
            <el-option
              v-for="op in supplierOptions"
              :key="op.value"
              :label="op.label"
              :value="op.value"
            >
              <span>{{ op.label }}</span>
              <!-- <span v-if="op.statusName">（{{ op.statusName }}）</span> -->
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>

    <template #button>
      <el-button @click="handleCancel" :disabled="loading">取消</el-button>
      <el-button type="primary" :loading="loading" :disabled="loading" @click="handleSubmit">
        提交
      </el-button>
    </template>
  </scheme-dialog>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref, provide, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { FormInstance, FormRules } from 'element-plus'
import { getCandidateProductSupplierOptions, matchSupplier } from '@/api/oa/buyer/productReference'
import { useMessage } from '@/hooks/web/useMessage'

// 类型定义
type SupplierOption = {
  label: string
  value: string | number
  statusName?: string
  status?: string | number
}

type FormModel = {
  candidateProductId: string | number
  // 修改点：类型改为数组
  supplierId: (string | number)[]
}

const message = useMessage()
const emit = defineEmits<{ (e: 'refresh'): void }>()

// Refs
const dialogRef = ref<any>(null)
const formRef = ref<FormInstance>()

// State
const loading = ref(false)
const supplierLoading = ref(false)
const supplierOptions = ref<SupplierOption[]>([])
const formData = ref<FormModel>({
  candidateProductId: '',
  supplierId: [] // 修改点：默认为空数组
})
const bukValue = ref<FormModel>(cloneDeep(formData.value))
const viewType = ref('edit')
const title = computed(() => '匹配供应商')

// Rules
const rules = reactive<FormRules<FormModel>>({
  // 修改点：增加 array 类型校验
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change', type: 'array' }]
})

// Helper: 处理供应商数据
const ALLOWED_SUPPLIER_STATUS = new Set(['0', '2', 0, 2]) // 0-待验厂, 2-已通过

const normalizeSupplierOption = (item: any): SupplierOption | null => {
  const value = item?.id ?? item?.supplierId ?? item?.value
  if (value === undefined || value === null || value === '') return null
  const label =
    item?.abbreviationCompany ??
    item?.supplierName ??
    item?.companyName ??
    item?.name ??
    item?.label ??
    String(value)
  const status = item?.status ?? item?.statusCode
  const statusName = item?.statusName
  return { value, label, status, statusName }
}

const fetchSupplierOptions = async () => {
  if (supplierOptions.value.length > 0) return
  try {
    supplierLoading.value = true
    const res = await getCandidateProductSupplierOptions()
    const rawList = Array.isArray(res) ? res : res?.records || res?.list || []

    const list = rawList
      .map(normalizeSupplierOption)
      .filter((item): item is SupplierOption => !!item)
      .filter((item) =>
        item.status === undefined ? false : ALLOWED_SUPPLIER_STATUS.has(item.status)
      )

    const map = new Map<string | number, SupplierOption>()
    list.forEach((item) => {
      if (!map.has(item.value)) map.set(item.value, item)
    })
    supplierOptions.value = Array.from(map.values())
  } catch (error) {
    console.error(error)
  } finally {
    supplierLoading.value = false
  }
}

// Actions
const openDialog = (item: { id: string | number }) => {
  formData.value.candidateProductId = item.id
  formData.value.supplierId = [] // 每次打开重置为[]
  bukValue.value = cloneDeep(formData.value)

  dialogRef.value?.openDialog(
    async () => {
      await fetchSupplierOptions()
    },
    () => {
      nextTick(() => formRef.value?.clearValidate())
    }
  )
}

const handleCancel = () => {
  dialogRef.value?.close()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true

    // 修改点：提交时将数组转换为逗号分隔字符串
    const payload = {
      candidateProductId: formData.value.candidateProductId,
      supplierId: formData.value.supplierId.join(',')
    }

    const res = await matchSupplier(payload)

    message.success('匹配供应商成功')
    bukValue.value = cloneDeep(formData.value)
    dialogRef.value?.close()
    emit('refresh')
  } catch (error: any) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

defineExpose({ openDialog })
provide('MatchSupplierDetails', { dataValue: formData, bukValue, viewType, title, loading })
</script>
