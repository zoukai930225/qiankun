<template>
  <el-table
    class="SWCommonTable"
    stripe
    :data="tableData"
    :show-overflow-tooltip="false"
    v-loading="loading"
    v-horizontal-scroll="'always'"
    row-class-name="commonTableRow"
    :header-cell-style="appStore.headerCellStyle"
    :span-method="spanMethod"
  >
    <el-table-column prop="dataDate" label="日期" min-width="110">
      <template #default="{ $index }">
        <div v-if="$index >= list.length - 2" class="flex">
          <span>总计</span>
          <el-button
            link
            :type="activeBtn === 0 ? `primary` : 'default'"
            class="mr-4px ml-16px"
            @click="handleShowAll"
          >
            全部
          </el-button>
          <span>|</span>
          <el-button
            link
            :type="activeBtn === 1 ? `primary` : 'default'"
            :style="{ marginLeft: '4px' }"
            @click="handleShowCurrentPage"
          >
            当前页
          </el-button>
        </div>
      </template>
    </el-table-column>
    <!-- <el-table-column prop="channel" label="渠道" />
    <el-table-column prop="store" label="店铺" /> -->
    <el-table-column prop="account" label="千川账号" min-width="160">
      <template #default="{ row }">
        <span class="underLine" @click="handleCostView(row)"> {{ row?.account }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="source" label="来源" min-width="80" />
    <el-table-column prop="typeName" label="类型" :min-width="columnWidth.typeName" />
    <el-table-column
      prop="actualConsumStore"
      label="实际消耗店铺"
      :min-width="columnWidth.actualConsumStore"
    />
    <el-table-column prop="businessTypeName" label="业务类型" width="80" />
    <el-table-column prop="orgType" label="来源平台" width="120" show-overflow-tooltip/>
    <el-table-column prop="cost" label="消耗" :min-width="columnWidth.cost" align="right">
      <template #default="{ row, $index }">
        <span v-if="$index === list.length - 1">{{ row.cost }}</span>
      </template>
    </el-table-column>
    <el-table-column label="消耗明细" :min-width="columnWidth.costDetail">
      <template #default="{ row, $index }">
        <div v-if="$index !== tableData.length - 1">{{ costDetail(row) }}</div>
      </template>
    </el-table-column>

    <el-table-column
      label="备注"
      :min-width="columnWidth.remark"
      prop="remark"
      show-overflow-tooltip
    >
      <template #default="{ row, $index }">
        <span v-if="$index !== tableData.length - 1">{{ row.remark ?? '--' }}</span>
      </template>
    </el-table-column>

    <template #empty>
      <div class="empty-img">
        <!-- <img src="@/assets/imgs/common/empty_list.png" alt="" /> -->
        <div>暂无数据</div>
      </div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AccountDetailListTable' })

import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  total: {
    type: Number,
    default: 0
  },
  loading: {
    type: Boolean,
    default: false
  },
  isView: {
    type: Boolean,
    default: false
  }
})

// const canView = (typeCode) => {
//   return (typeCode === '10' || typeCode === '11' || typeCode === '12') && !props.isView
// }

// 查看详情 -只有类型为“财务流水”的行可以查看
// const handleView = (row: any) => {
//   if (canView(row.type)) emits('view', row.id, row.type)
//   else return
// }
const activeBtn = ref(1)
const columnWidth = reactive({
  costDetail: 100,
  actualConsumStore: 110,
  typeName: 110,
  cost: 100,
  remark: 100
})

const tableData = computed(() => {
  if (props.list?.length === 0) return []

  const currentPageSum = props.list?.[props.list.length - 1]
  const allSum = props.list?.[props.list.length - 2]
  const data: any[] = [...(props.list?.filter((_, index) => index < props.list.length - 2) || [])]

  if (!data.length) return data
  return [...data, activeBtn.value === 1 ? allSum : currentPageSum]
})

watch(
  () => tableData.value,
  (data) => {
    // 计算表格宽度
    const costDetails = data
      .filter((row) => row.costDetail && row.costDetail !== '--')
      .map((row) => costDetail(row))
    const actualConsumStores = data.map((row) => row.actualConsumStore)
    const typeNames = data.map((row) => row.typeName)
    const costs = data.map((row) => row.cost)
    const remarks = data.map((row) => row.remark)

    fetchColumnWidth(costDetails as string[], 'costDetail')
    fetchColumnWidth(actualConsumStores as string[], 'actualConsumStore')
    fetchColumnWidth(typeNames as string[], 'typeName')
    fetchColumnWidth(costs as string[], 'cost')
    fetchColumnWidth(remarks as string[], 'remark')

    if (columnWidth.remark > 150) {
      columnWidth.remark = 150
    }
  },
  {
    deep: true
  }
)

function fetchColumnWidth(textArr: string[], key: string) {
  columnWidth[key] =
    Math.max(
      ...textArr.map((ele) => {
        const tempElement = document.createElement('span')
        tempElement.textContent = ele || ''
        tempElement.style.whiteSpace = 'nowrap'
        tempElement.style.fontSize = '14px'
        tempElement.style.padding = '0 12px'

        document.body.appendChild(tempElement)
        const width = tempElement.offsetWidth
        document.body.removeChild(tempElement)
        return width
      }),
      100
    ) + 1
}

// 查看
const handleCostView = (row: any) => {
  // if (canView(row.type))
  // else return
  emits('costView', row.account, row.type)
}
const emits = defineEmits(['view', 'costView'])

function costDetail({ type, costDetail }) {
  if (costDetail === '--' || !costDetail) return '--'

  const {
    nonGrantConsumption,
    consumBackRedEnv,
    sharedGrantConsumption,
    sharedWalletConsumption,
    grantConsumption
  } = JSON.parse(costDetail)

  if (!type) return
  // switch (type) {
  //   case '10':
  //     return `非赠款消耗：${nonGrantConsumption ?? 0}；消返红包消耗：${consumBackRedEnv ?? 0}；共享赠款消耗：${sharedGrantConsumption ?? 0}；共享钱包消耗：${sharedWalletConsumption ?? 0}`
  //   case '11':
  //     return `非赠款消耗：${nonGrantConsumption ?? 0}；赠款消耗：${grantConsumption ?? 0}；共享赠款消耗：${sharedGrantConsumption ?? 0}；共享钱包消耗：${sharedWalletConsumption ?? 0}`
  //   case '12':
  //     return `赠款消耗：${grantConsumption ?? 0}；消返红包消耗：${consumBackRedEnv ?? 0}；共享赠款消耗：${sharedGrantConsumption ?? 0}`
  //   default:
  //     return '--'
  // }
  return `赠款消耗：${grantConsumption || 0}；非赠款消耗：${nonGrantConsumption || 0}；消返红包消耗：${consumBackRedEnv || 0}；共享赠款消耗：${sharedGrantConsumption || 0}；共享钱包消耗：${sharedWalletConsumption || 0}`
}

function spanMethod({ rowIndex, columnIndex }) {
  if (rowIndex === tableData.value.length - 1 && columnIndex === 0) return [1, 2]
  if (rowIndex === tableData.value.length - 1 && columnIndex === 1) return [0, 0]
  return [1, 1]
}

function handleShowAll() {
  activeBtn.value = 0
}

function handleShowCurrentPage() {
  activeBtn.value = 1
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}

.underLine {
  cursor: pointer;
  color: #0064ff;

  &:hover {
    opacity: 0.8;
  }
}
</style>
