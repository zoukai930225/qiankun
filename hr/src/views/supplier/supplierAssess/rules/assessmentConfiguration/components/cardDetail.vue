<template>
  <dialog-flux-wrap>
    <template #header>
      <s-w-search-form
        ref="searchFormRef"
        label-width="auto"
        :schema="searchSchema"
        :expand-threshold="4"
        :show-expand="false"
        @search="onSearch"
        @reset="onReset"
      />
    </template>

    <s-table
      :auto-load="false"
      border
      ref="tableRef"
      :columns="columns"
      :fetch="clickShowSuppliers"
      :fetch-params="queryParams"
      row-key="supplierId"
      :pagination-map="{ pageNum: 'pageNum', pageSize: 'pageSize' }"
      pagination-teleport="#assessment-section-footer"
    />
    <template #footer>
      <div id="assessment-section-footer"></div>
    </template>
  </dialog-flux-wrap>
</template>
<script lang="ts" setup>
import { ref, nextTick, computed } from 'vue'
import { labelSelectInputFirstItem } from '../config/searchSchemas'
import type { FormSchema } from '@/types/form'
import { clickShowSuppliers } from '@/api/supplier/assessmentConfiguration'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'

interface CardDetailProps {
  list?: any[]
  activeKey?: string | null
  activeIndex?: number
}

const props = defineProps<CardDetailProps>()

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
const queryParams = ref<any>({
  abbreviationCompany: undefined,
  fullCompany: undefined,
  supplierType: undefined
})

const baseColumns = [
  {
    prop: 'abbreviationCompany',
    label: '供应商简称',
    minWidth: 100,
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
    customRender: ({ row }: any) => getDictLabel(DICT_TYPE.SUPPLIER_TYPE, row?.supplierType) || '-'
  }
]

const columns = computed<any[]>(() => {
  if (props.activeKey === 'related') {
    return [
      ...baseColumns,
      {
        prop: 'assessmentType',
        label: '关联的考核模块',
        minWidth: 300,
        align: 'left',
        headerAlign: 'left'
      }
    ]
  }
  return baseColumns
})

function getStatisticType(): number | undefined {
  const key = props.activeKey
  switch (key) {
    case 'invited':
      return 0
    case 'related':
      return 1
    case 'unrelated':
      return 2
    case 'participated':
      return 3
    case 'unparticipated':
      return 4
    default:
      return undefined
  }
}

function onSearch(model: Record<string, any>) {
  // 自动识别当前可切换字段的值
  queryParams.value = {
    supplierType: undefined,
    abbreviationCompany: model?.abbreviationCompany || undefined,
    fullCompany: model?.fullCompany || undefined,
    statisticType: getStatisticType()
  }
  nextTick(() => tableRef.value?.refresh?.(true))
}

function onReset() {
  // queryParams.value = {
  //   abbreviationCompany: undefined,
  //   fullCompany: undefined,
  //   supplierType: undefined
  // }
}

onMounted(() => {
  queryParams.value.statisticType = getStatisticType()
  nextTick(() => tableRef.value?.refresh?.(true))
})
</script>
<style scoped lang="scss">
.card-detail {
  height: 60vh;
  display: flex;
  flex-direction: column;
}
</style>
