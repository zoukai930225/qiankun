<template>
  <el-card shadow="never" class="mb-20px">
    <div class="flex justify-between overflow-hidden">
      <div class="!flex items-center">
        <component :is="iconsSrc['header']" />
        <span class="mr-auto ml-16px font-size-18px font-600">仓库出入库看板</span>
      </div>

      <time-filter
        ref="timeFilterRef"
        layout="日,周,月,自定义"
        :swift-options="timeSwiftOptions"
        :is-tooltip="false"
        :is-show-time="true"
        default-value="7天"
        :default-date="defaultDate"
        show-str="统计时间"
        :show-arrow="false"
        v-model="searchTime"
        @change="handleSearch"
      />
    </div>
  </el-card>

  <!-- 汇总看板 -->
  <summary-board ref="summaryRef" :params="queryParams" class="mb-20px" />

  <div class="charts-bar-area">
    <top-ten-board
      ref="top10Ref"
      v-for="chartsConfig in chartsBars"
      :key="chartsConfig.type"
      :config="chartsConfig"
      :other-params="queryParams"
      v-model:more-dialog-prop="moreDialogProp"
    />
  </div>

  <div class="charts-bar-area">
    <pie-charts
      ref="pieRef"
      v-for="chartsConfig in chartsPies"
      :key="chartsConfig.type"
      :config="chartsConfig"
      :other-params="queryParams"
    />
  </div>

  <more-dialog
    v-bind="moreDialogProp"
    v-model:model-value="moreDialogProp.modelValue"
    :otherParams="queryParams"
  />
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { defaultDate, iconsSrc, timeSwiftOptions } from '../supplierBoard/options'
import summaryBoard from './components/summaryBoard.vue'
import topTenBoard from './components/topTenBoard.vue'
import { chartsBars, chartsPies } from './options'
import moreDialog from './components/moreDialog.vue'
import pieCharts from './components/pieCharts.vue'

defineOptions({ name: 'WarhouseSummaryBoard' })

const queryParams = reactive({
  startDate: defaultDate[0],
  endDate: defaultDate[1]
})
const timeFilterRef = ref()
const moreDialogProp = ref({
  modelValue: false
})
const summaryRef = ref()
const top10Ref = ref()
const pieRef = ref()

const searchTime = ref<string | string[]>([queryParams.startDate, queryParams.endDate])

watch(
  () => searchTime.value,
  (val) => {
    switch (timeFilterRef?.value?.selectValue.componentType) {
      case 'week':
        queryParams.startDate = val as string
        const startDay = new Date(val as string)
        startDay.setDate(startDay.getDate() + 6)
        queryParams.endDate = formatDate(startDay, 'YYYY-MM-DD')
        break
      case 'day':
        queryParams.startDate = val as string
        queryParams.endDate = val as string
        break
      case 'month':
        const month = new Date(val as string)
        queryParams.startDate = formatDate(month, 'YYYY-MM-DD')
        month.setMonth(month.getMonth() + 1)
        month.setDate(month.getDate() - 1)
        queryParams.endDate = formatDate(month, 'YYYY-MM-DD')
        break
      default:
        queryParams.startDate = typeof val === 'string' ? val : val?.[0]
        queryParams.endDate = typeof val === 'string' ? val : val?.[1]
        break
    }
  }
)

function handleSearch() {
  nextTick(() => {
    summaryRef.value?.getData()
    top10Ref.value?.forEach((ele) => {
      ele.getData()
    })
    pieRef.value?.forEach((ele) => {
      ele.getData()
    })
  })
}

onMounted(() => {
  handleSearch()
})
</script>
<style lang="less" scoped>
:deep(.el-card),
.el-card {
  border-radius: 16px;
}

.charts-bar-area {
  display: grid;
  margin-bottom: 20px;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 20px;
}
</style>
