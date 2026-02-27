<template>
  <el-table
    class="SWCommonTable"
    :header-cell-style="{
      backgroundColor: '#fff',
      color:'#333',
      height: '45px'
    }"
    height="calc(100vh - 280px)"
    :data="displayedList"
    width="100%"
    :show-overflow-tooltip="false"
    v-loading="loading"
    v-horizontal-scroll="'always'"
    :row-class-name="form.filterCount !== 2 ? tableRowClassName : ''"
    :row-style="{
      height: '52px'
    }"
  >
    <el-table-column prop="goodsCode" label="商品编码" align="left" header-align="left" />

    <el-table-column :label="leftDateRangeDisplay" align="center">
      <el-table-column prop="count" label="计数" align="left" header-align="left">
        <template #default="{ row }">
          <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
            {{ row.count || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="yesterdayPercentage"
        label="占比"
        align="left"
        header-align="left"
        class-name="tight-padding"
      >
        <template #default="{ row }">
          <div :class="['percentage',Number(row.yesterdayPercentage) < 0 ? 'red' : '']">
            <div
              v-if="row.goodsCode !== '合计'"
              class="percentage-progress-label"
              :style="{ width: progressLabelWidth(formatPercent(row.yesterdayPercentage,false,true)) }"
            ></div>
            <div class="percentage-text">
              {{ formatPercent(row.yesterdayPercentage,true,true) }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column :label="rightDateRangeDisplay" align="center">
      <el-table-column prop="beforeCount" label="计数" align="left" header-align="left">
        <template #default="{ row }">
          <div :class="row.goodsCode === '合计' ? 'summary-count' : ''">
            {{ row.beforeCount || 0 }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="beforePercentage"
        label="占比"
        align="left"
        header-align="left"
        class-name="tight-padding"
      >
        <template #default="{ row }">
          <div :class="['percentage',Number(row.beforePercentage) < 0 ? 'red' : '']">
            <div
              v-if="row.goodsCode !== '合计'"
              class="percentage-progress-label"
              :style="{ width: progressLabelWidth(formatPercent(row.beforePercentage,false,true)) }"
            ></div>
            <div class="percentage-text">
              {{ formatPercent(row.beforePercentage,true,true) }}
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table-column>
    <el-table-column
      prop="chainRatio"
      label="环比"
      align="left"
      header-align="left"
      class-name="tight-padding"
    >
      <template #default="{ row }">
        <div :class="['percentage',Number(row.chainRatio) < 0 ? 'red' : '']">
          <div
            v-if="row.goodsCode !== '合计'"
            class="percentage-progress-label"
            :style="{ width: progressLabelWidth(formatPercent(row.chainRatio)) }"
          >
          </div>
          <div class="percentage-text"> {{ formatPercent(row.chainRatio,true) }} </div>
        </div>
      </template>
    </el-table-column>
    <template #empty>
      <img class="mt50px" src="@/assets/imgs/empty/empty1.png" alt="" />
      <div class="mb24px">暂无相关内容</div>
    </template>
  </el-table>
</template>
<script lang="ts" setup>
defineOptions({ name: 'DrawerFirstType' })
import * as negativeReviewDashboardApi from '@/api/negativeReviewDashboard'

const props = defineProps({
  form: {
    type: Object as any,
    default: () => ({})
  },
  list: {
    type: Array as any,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})



const leftDateRangeDisplay = ref('') //左边展示的时间范围
const rightDateRangeDisplay = ref('') //右边展示的时间范围
// 查询对比时间
const getComparisonTime = async () => {
  const params = {
    startTime: props.form.startTime,
    endTime: props.form.endTime
  }
  const res = await negativeReviewDashboardApi.getComparisonTime(params).catch(() => {})
  if (res) {
    console.log('---', res)
    leftDateRangeDisplay.value = `${props.form.startTime} ~ ${props.form.endTime}`
    rightDateRangeDisplay.value = `${res.beforeStartDate} ~ ${res.beforeEndDate}`
    console.log('rightDateRangeDisplay', rightDateRangeDisplay.value)
  }
}

/** 查询列表 */

// 合计行

// 在列表前面插入合计行
const displayedList = ref<any[]>([])

const tableRowClassName = ({ row }) => {
  // console.log('a', row)
  return row.goodsCode === '合计' ? 'summary-row' : ''
}
watch(()=>props.form,async (newVal) => {
  if (newVal) {
    await getComparisonTime()
  }
},{
  immediate: true,
  deep: true
})
watch(() => props.list, async (newVal) => {
  if (newVal) {
    console.log('newVal', newVal)
    const rawList = newVal.numberInfoList|| []
      const mappedList = rawList.map((item: any) => {
        const newItem: any = { ...item }
        if (newItem.customerComplaintCountOfBN === undefined) {
          newItem.customerComplaintCountOfBN = newItem.banniuComplaintCount ?? 0
        }
        if (newItem.wdtCount === undefined) {
          newItem.wdtCount = newItem.wangdiantongSalesCount ?? 0
        }
        if (newItem.goodsBadReviewRate === undefined) {
          newItem.goodsBadReviewRate = newItem.productMidNegativeReviewRate ?? 0
        }
        if (newItem.goodsComplaintRate === undefined) {
          newItem.goodsComplaintRate = newItem.productComplaintRate ?? 0
        }
        return newItem
      })
      displayedList.value  = [...mappedList]
  }
})


// 保留两位小数并可选加%
function formatPercent(percent: string, withSymbol = false,needPlus = false) {
  if (!percent) return withSymbol ? '0.00%' : '0.00'
  const num = !needPlus? parseFloat(percent.replace('%', '')) : parseFloat(percent.replace('%', '')) * 100
  const fixed = isNaN(num) ? '0.00' : num.toFixed(2)
  return withSymbol ? `${fixed}%` : fixed
}

// 进度条宽度
function progressLabelWidth(percent: string) {
  // 这里 percent 已经是去掉%的数字字符串

  return `${Math.abs(Number(percent))}%`
}


defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['close']) // 定义 close 事件
</script>

<style lang="scss" scoped>
@use './style.scss';
</style>
