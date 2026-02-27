<template>
  <div class="title mt20px pos-relative mb--6px">
    <span>发货预约单明细</span>
    <component :is="easyBtnGroup(topBtns)" class="ml-auto" />
  </div>
  <el-divider />
  <sw-table
    ref="tableRef"
    class="form-table"
    :data="tableData"
    :options="tableOptions"
    :loading="loading"
    :max-height="620"
    :show-overflow-tooltop="true"
    :filters="filters"
    @change-filters="handleFilterChange"
  >
    <template #deliveryGoodsQuantity="{ index, row }">
      <sw-input-number
        v-if="index && !isCheck"
        v-model.trim.number="row.deliveryGoodsQuantity"
        placeholder="请输入"
        clearable
        :disabled="!!(isCheck || isImport)"
        @blur="handleBlur(index)"
        @change="handleChangeDeliveryGoodsQuantity(row)"
      />
      <span v-else>{{ row.deliveryGoodsQuantity }}</span>
    </template>
  </sw-table>

  <add-product-dialog
    v-bind="addProductDialogProps"
    v-model:model-value="addProductDialogProps.modelValue"
    @batch-add="handleBatchAdd"
  />
</template>
<script lang="tsx" setup>
import SwTable from '../../components/table.vue'
import { addPurchaseTable } from '../options'
import { FormInstance } from 'element-plus'
import addProductDialog from './addProductDialog.vue'
import { easyBtnGroup } from '../../components/twoFourSix'

defineOptions({ name: 'PurchaseProductOrderAdd' })

const props = defineProps<{
  data?: any
  loading?: boolean
  isImport?: boolean
  supplierId?: string
  appointmentType?: string
  poIds?: string
  selectedSkus?: string
}>()

interface Emit {
  (e: 'open-upload-dialog'): void
  (e: 'update:data', value: any[]): void
  (e: 'update:poIds', value: string): void
  (e: 'update:selectedSkus', value: string): void
}

const emit = defineEmits<Emit>()

const route = useRoute()

const filters = ref({
  goodsCode: [],
  sku: []
})
const tableRef = ref()
const addProductDialogProps = reactive({
  modelValue: false,
  supplierId: props.supplierId,
  isAlready: [] as any[]
})
const formRefs = ref<FormInstance[] | null[]>([])

const isCheck = computed(() => route.name === 'PurchaseAppointmentOrderCheck')
const isAdd = computed(() => route.name === 'PurchaseAppointmentOrderAdd')
const isEdit = computed(() => route.name === 'PurchaseAppointmentOrderEdit')

const tableOptions = computed(() => {
  const config = [...addPurchaseTable]

  if (isCheck.value) {
    const i = config.findIndex((ele) => ele.label === '发货数量')
    config.splice(i + 1, 0, {
      label: '入库量',
      prop: 'stockIn',
      minWidth: 110,
      fixed: 'right',
      showOverFlowTooltip: false
    })
  }

  const tableMap = new Map(config.map((ele) => [ele.label, ele]))

  if (isCheck.value) {
    tableMap.set('发货数量', {
      ...tableMap.get('发货数量'),
      align: 'right',
      required: false,
      minWidth: 110
    })
  }

  return Array.from(tableMap.values())
})

const sumRow = computed(() => {
  const row: any = {}

  function computedSum(key: string) {
    return Math.round(props.data.reduce((arr, cur) => arr + (cur[key] || 0), 0) * 100) / 100 || 0
  }

  const keys = [
    'purchasedGoodsQuantity',
    'remainingDeliveryQuantity',
    'deliveryGoodsQuantity',
    'stockIn'
  ]

  keys.forEach((key) => {
    row[key] = computedSum(key)
  })

  row.price =
    Math.round(
      props.data.reduce(
        (arr, cur) => arr + (cur.deliveryGoodsQuantity || 0) * (cur.supplierGoodsPrice || 0),
        0
      ) * 100
    ) / 100 || 0
  row.key = 'sumRow'
  return row
})

const tableData = computed({
  get: () => {
    return props.data.length ? [sumRow.value, ...props.data] : []
  },
  set: (val) => {
    emit('update:data', val)
  }
})

const topBtns = computed(() => {
  const node = {
    [String(isAdd.value)]: 'Add',
    [String(isCheck.value)]: 'Check',
    [String(isEdit.value)]: 'Edit'
  }['true']

  return [
    {
      component: (
        <el-tooltip disabled={!!props.supplierId} content="请选择供应商">
          <el-button type="primary" disabled={!props.supplierId} onClick={handleAddProduct}>
            添加货品
          </el-button>
        </el-tooltip>
      ),
      permission: `SupplierAppointmentIndex:Appoint:${node}:Add`,
      page: (isAdd.value || isEdit.value) && props.appointmentType === '1'
    },
    {
      label: '一键发货',
      type: 'primary',
      onClick: handleFastAppoint,
      page: isAdd.value || isEdit.value,
      permission: `SupplierAppointmentIndex:Appoint:${node}:FastAppoint`
    },
    {
      label: '导入',
      type: 'primary',
      onClick: () => emit('open-upload-dialog'),
      page: isAdd.value && props.appointmentType !== '1',
      permission: `SupplierAppointmentIndex:Appoint:${node}:Import`
    }
  ]
})

watch(
  tableData,
  (val) => {
    addProductDialogProps.isAlready = [...val].filter((ele) => ele?.key !== 'sumRow')
  },
  { deep: true }
)

watch(
  () => props.supplierId,
  (val) => (addProductDialogProps.supplierId = val)
)

async function handleBlur(index: number) {
  await formRefs.value[index]?.validate()
}

async function validateAll() {
  const validates = formRefs.value.map(async (ele) => {
    if (!ele) return Promise.resolve(true)
    try {
      await ele.validate()
      return true
    } catch (error) {
      return false
    }
  })
  const results = await Promise.all(validates.filter((ele) => ele))
  return results.every((res) => res)
}

async function clearAll() {
  const validationPromises = props.data.flatMap((_, rowIndex: number) =>
    formRefs.value[rowIndex]?.clearValidate()
  )
  await Promise.all(validationPromises)
}

function handleChangeDeliveryGoodsQuantity(row: typeof props.data) {
  row.remainingDeliveryQuantity =
    (row.originalRemainingDeliveryQuantity ?? 0) - (row.deliveryGoodsQuantity ?? 0)
}

function handleFilterChange() {
  if (tableRef.value?.filterData.every((ele) => ele.key !== 'sumRow')) {
    tableRef.value?.filterData.unshift(sumRow.value)
  }
}

function handleFastAppoint() {
  tableRef.value?.filterData.forEach((row) => {
    row.deliveryGoodsQuantity =
      (row.deliveryGoodsQuantity ?? 0) + (row.remainingDeliveryQuantity ?? 0)
    row.remainingDeliveryQuantity = 0
  })
}

function handleAddProduct() {
  addProductDialogProps.modelValue = true
}

function handleBatchAdd(rows: typeof tableData.value) {
  const PoIds = Array.from(new Set(rows.flatMap((row) => row.poIds?.split(',')))).join(',')
  const selectedSkus = Array.from(
    new Set([...(props.selectedSkus ?? '').split(','), ...rows.map((row) => row.sku)])
  ).join(',')

  emit('update:poIds', PoIds)
  emit('update:selectedSkus', selectedSkus)

  tableData.value.splice(1, 0, ...rows)
  tableData.value = Array.from(new Map(tableData.value.map((ele) => [ele.sku, ele])).values())
}

defineExpose({ validateAll, clearAll, filterData: () => tableRef.value?.filterData })
</script>
<style lang="less" scoped>
@import url(../../index.scss);
* {
  --el-color-primary: #0064ff;
}

.commonTopFilterWrap-filter {
  flex: 1;
}

.commonTopFilterWrap-search {
  padding-left: 115px;
  justify-content: flex-end;
}

:deep(.cell) {
  // display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.canEdit {
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  font-size: 14px;
  color: #333;
  line-height: 20px;
  :deep(.el-form-item) {
    transform: translateY(9px);
  }
}

.el-card {
  border: 0;
  border-radius: 8px;

  :deep(.el-card__body) {
    padding-bottom: 0;
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
}

:deep(.el-card__body) {
  height: 100%;
}

.is_warning {
  // display: none;

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #ffca57;

    &:focus {
      box-shadow: 0 0 0 1px #ffca57 inset;
    }
  }
}
</style>
