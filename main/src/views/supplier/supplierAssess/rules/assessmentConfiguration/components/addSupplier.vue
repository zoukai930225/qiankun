<template>
  <dialog-flux-wrap>
    <template #header>
      <s-w-search-form
        ref="searchFormRef"
        :schema="searchSchema"
        :expand-threshold="3"
        :show-expand="false"
        label-width="auto"
        @search="onSearch"
        @reset="onReset"
      />
    </template>

    <s-table
      :auto-load="false"
      border
      ref="tableRef"
      selection
      row-key="supplierId"
      :columns="columns"
      :fetch="showSuppliers"
      :fetch-params="queryParams"
      :onSelectionChange="onSelectionChange"
      stripe
      :pagination-map="{ pageNum: 'pageNum', pageSize: 'pageSize' }"
      pagination-teleport="#add-supplier-footer"
      reserve-selection
    />
    <template #footer>
      <div id="add-supplier-footer"></div>
    </template>
  </dialog-flux-wrap>
</template>
<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import type { FormSchema } from '@/types/form'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { labelSelectInputFirstItem } from '../config/searchSchemas'
import { showSuppliers } from '@/api/supplier/assessmentConfiguration'

defineOptions({ name: 'AddSupplierDialog' })

const props = defineProps<{ selectedSupplierIds?: string[]; type: string }>()

const emits = defineEmits<{
  (e: 'success', rows: any[]): void
}>()

// 搜索
const searchFormRef = ref()
const selectedField = ref<string>('abbreviationCompany')
const searchSchema = ref<FormSchema[]>([
  {
    ...labelSelectInputFirstItem,
    componentProps: {
      ...labelSelectInputFirstItem.componentProps,
      'onUpdate:selectedField': (field: string) => (selectedField.value = field)
    }
  }
])

// 表格
const tableRef = ref()
const currentPageRows = ref<any[]>([])
const selectedRows = ref<any[]>([])
const queryParams = ref<any>({
  abbreviationCompany: undefined,
  fullCompany: undefined,
  supplierType: undefined,
  type: props.type,
  selectedSupplierIds: Array.isArray(props.selectedSupplierIds)
    ? props.selectedSupplierIds.map((v) => String(v))
    : []
})

const columns = ref<any[]>([
  { type: 'selection', width: 55 },
  {
    prop: 'abbreviationCompany',
    label: '供应商简称',
    minWidth: 160,
    align: 'left',
    headerAlign: 'left'
  },
  { prop: 'fullCompany', label: '公司名称', minWidth: 220, align: 'left', headerAlign: 'left' },
  {
    prop: 'supplierType',
    label: '供应商类型',
    minWidth: 120,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => getDictLabel(DICT_TYPE.SUPPLIER_TYPE, row.supplierType) || '-'
  }
])

function onSelectionChange(list: any[]) {
  console.log(list)
  selectedRows.value = list
}

async function onSearch(model: Record<string, any>) {
  const { supplierType, abbreviationCompany, fullCompany } = model || {}
  queryParams.value = {
    ...queryParams.value,
    supplierType: supplierType || undefined,
    abbreviationCompany: abbreviationCompany || undefined,
    fullCompany: fullCompany || undefined
  }
  await nextTick()
  tableRef.value?.refresh?.(true)
}

function onReset() {
  // queryParams.value = {
  //   page: 1,
  //   pageSize: 10,
  //   abbreviationCompany: undefined,
  //   fullCompany: undefined,
  //   supplierType: undefined
  // }
  // tableRef.value?.refresh?.(true)
}

// 供 openDialog 的确认按钮调用
async function submit() {
  emits('success', selectedRows.value)
}

onMounted(() => {
  nextTick(() => {
    tableRef.value?.refresh?.(true)
  })
})

defineExpose({ submit })
</script>
<style scoped lang="scss"></style>
