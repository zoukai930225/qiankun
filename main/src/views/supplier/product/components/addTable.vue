<template>
  <div class="title">
    采购生产单明细
    <div v-if="!isAudit" class="ml-auto">
      <component :is="() => easyBtnGroup(topBtns)" />
    </div>
  </div>
  <el-divider />

  <sw-table
    v-if="!isAudit"
    ref="tableRef"
    class="form-table"
    :data="tableData"
    :options="addPurchaseTable"
    :min-height="620"
    :span-method="spanMethod"
    :show-overflow-tooltop="true"
    :rules="rules"
    v-model:loading="loading"
    v-model:filters="filters"
    lazy
    @reset-span="emit('reset-span')"
  >
    <template #purchasedGoodsQuantity="{ row }">
      <el-tooltip
        :disabled="!!row.remainingGoodsQuantity"
        content="当前货品已没有剩余补单量"
        placement="bottom"
      >
        <sw-input-number
          v-model="row.purchasedGoodsQuantity"
          placeholder="请输入"
          :clearable="true"
          :disabled="isAudit"
          @change="handleChangePurchasedGoodsQuantity(row)"
        />
      </el-tooltip>
    </template>

    <!-- 合同清单时间 合同首批时间 -->
    <template
      v-for="slotName in ['orderArrivalTime', 'firstBatchTime']"
      :key="slotName"
      #[slotName]="{ index, row, column }"
    >
      <div class="flex">
        <el-tooltip
          :disabled="!!row.remainingGoodsQuantity"
          content="当前货品已没有剩余补单量"
          placement="bottom"
        >
          <span>
            <el-date-picker
              v-model="row[slotName]"
              placeholder="请选择"
              type="date"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              :disabled="isAudit"
              @change="handleChangeDate(slotName, index)"
            />
          </span>
        </el-tooltip>
        <el-tooltip
          v-if="row[slotName] && !isAudit"
          :content="`将 ${row[slotName]} 应用到此后所有 ${row.supplierName} 货品的${column.label}`"
          placement="top"
        >
          <el-button class="ml-4px" type="primary" link @click="handleCopy(row, column, index)">
            <copy-icon :size="16" />
          </el-button>
        </el-tooltip>
      </div>
    </template>

    <!-- 序号 -->
    <template #index="{ row, index }">
      <span>{{ row.index || index + 1 }}</span>
    </template>

    <!-- 裸货价 成品价 -->
    <template
      v-for="slotName in ['baseProdCost', 'fgCost']"
      :key="slotName"
      #[slotName]="{ row, index, column }"
    >
      <sw-input-number
        v-model="row[slotName]"
        placeholder="请输入"
        :clearabled="false"
        :precision="4"
        :disabled="isAudit"
      />

      <el-tooltip
        v-if="row[slotName] && !isAudit"
        :content="`将此价格应用到此后所有 ${row.supplierName} 的 ${row.goodsCode} 的 ${column.label}`"
        placement="top"
      >
        <el-button class="ml-4px" type="primary" link @click="handleCopy(row, column, index)">
          <copy-icon :size="16" />
        </el-button>
      </el-tooltip>
    </template>
  </sw-table>

  <sw-table
    v-else
    ref="tableRef"
    :show-summary="true"
    :summary-method="summaryMethod"
    :data="tableData"
    :options="[
      ...previewTableOption,
      ...COLUMN_1.filter((item) => !!item.prop).sort(
        (a, b) => Number(inTableSort[a.prop!]) - Number(inTableSort[b.prop!])
      )
    ]"
    :max-height="620"
    :span-method="spanMethod"
    :show-overflow-tooltop="true"
  />
</template>
<script lang="tsx" setup>
import { ElButton, ElTooltip, FormRules } from 'element-plus'
import SwTable from '../../components/table.vue'
import { addPurchaseTable, previewTableOption } from '../options'
import CopyIcon from '@/assets/svgs/supplier/copy.vue'
import { COLUMN_1, inTableSort } from '../../purchaseApplication/options'
import { getPermission } from '@/utils'
import { Icon } from '@/components/Icon'
import { easyBtnGroup } from '../../components/twoFourSix'
import SwTextTooltip from '@/components/SwTextTooltip/src/SwTextTooltip.vue'

const message = useMessage()

previewTableOption

const props = defineProps<{
  modelValue: any
  scPurchaseRequestOrderId?: string
  rules: FormRules
  spanMethod: any
  isAdd: boolean
  isEdit: boolean
  isAudit: boolean
  statisticDate: string
}>()

const tableRef = ref<InstanceType<typeof SwTable>>()
const filters = reactive({
  sku: [] as string[],
  goodsCode: [] as string[],
  supplierName: [] as string[]
})
const loading = ref(false)
const permissions = new Set(getPermission())

const tableData = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:model-value', val)
})

const emit = defineEmits<{
  (e: 'update:model-value', tableData: any): void
  (e: 'open-upload-dialog'): void
  (e: 'reset-span'): void
}>()

const topBtns = computed(() => {
  const node = props.isAdd ? 'Add' : 'Edit'

  const origin = [
    {
      component: (
        <ElTooltip content="请先选择需求编码" disabled={!!props.scPurchaseRequestOrderId}>
          <ElButton
            type="primary"
            disabled={!props.scPurchaseRequestOrderId}
            onClick={handleQuickFill}
          >
            一键补单
          </ElButton>
        </ElTooltip>
      ),
      permission: `SupplierProduct:MyOrder:${node}:QuickFill`
    },
    {
      component: (
        <ElTooltip content="请先选择需求编码" disabled={!!props.scPurchaseRequestOrderId}>
          <ElButton
            type="primary"
            disabled={!props.scPurchaseRequestOrderId}
            onClick={() => emit('open-upload-dialog')}
          >
            <Icon icon="ep:upload"></Icon>
            导入
          </ElButton>
        </ElTooltip>
      ),
      permission: `SupplierProduct:MyOrder:${node}:Import`
    }
  ]

  return origin.filter((ele) => permissions.has(ele.permission))
})

function handleChangeDate(key: string, index: number) {
  tableRef.value?.validateFileds(
    [key === 'orderArrivalTime' ? 'firstBatchTime' : 'orderArrivalTime'],
    index
  )
}

function handleChangePurchasedGoodsQuantity(row: any) {
  const sameSkuRows = tableData.value.filter((ele) => ele.sku === row.sku)
  const totalQuantity = sameSkuRows.reduce((sum, ele) => {
    return sum + Number(ele.purchasedGoodsQuantity || 0)
  }, 0)
  sameSkuRows.forEach((ele) => {
    ele.purchasedGoodsQuantityTotal = totalQuantity
  })
}

async function handleCopy(row: any, column: any, index: number) {
  try {
    const { property: key, label } = column
    const value = row[key]
    const isPriceType = ['baseProdCost', 'fgCost'].includes(key)

    const confirmMessage = isPriceType
      ? `确定此价格应用到此后所有 ${row.supplierName} 的 ${row.goodsCode} 的 ${label}吗？`
      : `确定将 ${value} 应用到此后所有 ${row.supplierName} 的${label}吗？`

    await message.confirm(confirmMessage)

    tableRef.value?.filterData.forEach((item, i) => {
      const baseCondition =
        !!item.purchasedGoodsQuantity && item.supplierName === row.supplierName && i >= index

      const shouldUpdate = isPriceType
        ? baseCondition && item.goodsCode === row.goodsCode
        : baseCondition

      if (shouldUpdate) {
        item[key] = value
      }

      if (!isPriceType) {
        tableRef.value?.validateFileds(['firstBatchTime', 'latestArrivalTime'])
      }
    })
  } catch (error) {}
}

/** 更新采购数量 */
function updatePurchasedGoodsQuantityTotal(data: any[]) {
  const skuMap = new Map()
  data.forEach((row) => {
    if (!skuMap.has(row.sku)) {
      skuMap.set(row.sku, [])
    }
    skuMap.get(row.sku)!.push(row)
  })
  skuMap.forEach((rows) => {
    const total = rows.reduce((sum, row) => sum + Number(row.purchasedGoodsQuantity || 0), 0)
    rows.forEach((row) => {
      row.purchasedGoodsQuantityTotal = total
    })
  })
}

/** 根据对应供应商列表拆分表格信息 */
function renderTableMethod(tableTempt) {
  if (!tableTempt) return (tableData.value = [])
  updatePurchasedGoodsQuantityTotal(tableTempt)
  tableData.value = tableTempt.flatMap(
    (row) =>
      row.supplierList?.map((supplier) => ({
        ...row,
        ...supplier,
        id: row.id,
        supplier: supplier.supplierId,
        baseProdCost: supplier.baseProdCost ?? row.baseProdCost,
        fgCost: supplier.fgCost ?? row.fgCost,
        hasTax: supplier.hasTax ?? row.hasTax
      })) || [row]
  )
}

/** 一键补单 */
function handleQuickFill() {
  // 存储有多个供应商的货品
  const skusToSkip = new Set()
  tableRef.value?.filterData.forEach((row) => {
    if (
      tableRef.value?.filterData.some(
        (ele) => ele.sku === row.sku && ele.supplierName !== row.supplierName
      )
    )
      skusToSkip.add(row.sku)
  })

  // 对只有一个供应商的货品一键赋值
  tableRef.value?.filterData.forEach((row) => {
    if (skusToSkip.has(row.sku) || !row.remainingGoodsQuantity) return
    row.purchasedGoodsQuantity = row.remainingGoodsQuantity
  })

  // 校验
  tableRef.value?.validateFileds(['purchasedGoodsQuantity'])

  // 更新采购数量
  updatePurchasedGoodsQuantityTotal(tableData.value)
}

function summaryMethod(param) {
  const noShowSummaryColumns = [
    'imgUrl',
    'goodsCode',
    'goodsName',
    'sku',
    'formName',
    'formCode',
    'estimatePrice',
    'iterateCode',
    'orderItemTime',
    'firstOrderTime',
    'expectedArrivalTime',
    'supplierName',
    'orderArrivalTime',
    'firstBatchTime'
  ]

  const averageColumns = [
    'sevenTurnover',
    'turnoverDays',
    'fourteenTurnover',
    'thirtyTurnover',
    'turnoverDaysAfterRestocking'
  ]

  const { columns } = param
  const sums: (string | VNode)[] = []
  columns.forEach((column, index) => {
    if (index === 0) return (sums[index] = '合计')
    else if (noShowSummaryColumns.includes(column.rawColumnKey)) {
      return (sums[index] = '')
    } else {
      const values = tableData.value.reduce((pre, cur) => pre + Number(cur[column.rawColumnKey]), 0)

      const result = averageColumns.includes(column.rawColumnKey)
        ? Math.floor(values / tableData.value.length)
        : Math.floor(values)
      return (sums[index] = <SwTextTooltip content={result}>{result}</SwTextTooltip>)
    }
  })
  return sums
}

defineExpose({
  renderTableMethod,
  validateFileds: async () => await tableRef.value?.validateFileds(),
  filterData: () => tableRef.value?.filterData
})
</script>
<style lang="less" scoped>
@import url(../../index.scss);

* {
  --el-input-width: 220px;
}

:deep(.el-date-editor) {
  .el-input__prefix {
    display: none;
  }
}
</style>
