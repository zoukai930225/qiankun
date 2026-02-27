<!--
 * @Date: 2024-11-26 23:00:50
-->
<template>
  <div>
    <Dialog class="trendDialog" :width="1028" :border-radius="6" v-model="dialogVisible" title="">
      <template #title>
        <span style="color: #333; font-weight: 500; font-size: 14px">销量走势 </span>
      </template>
      <div class="staticsInfo">
        <SaleTrendChart
          v-if="showChart"
          style="margin-top: -30px"
          ref="lineChartRef"
          :option1="lineOption"
        />
        <div v-else style="margin-top: -30px; height: 350px"></div>
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import SaleTrendChart from './saleTrendChart.vue'
import { getThirtySumData } from '@/api/shop/InventoryLow/index'

const lineChartRef = ref()

interface LineOption {
  xAxisData: string[]
  yAxisData: number[]
  tipsName: string
  lineColor: string
}

const lineOption: Ref<LineOption> = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '销量',
  lineColor: '#0064ff'
})
const dialogVisible = ref(false) // 弹窗的是否展示
const currentId = ref()
/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true
  currentId.value = id
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const showChart = ref(true)
const getList = async () => {
  const data = await getThirtySumData({
    productNumber: currentId.value
  })
  showChart.value = true
  if (data) {
    nextTick(() => {
      lineChartRef.value.setChartOptions()
      handleReqData(data)
    })
  }
}

const handleReqData = (data: any[]) => {
  const xAxisData: string[] = []
  const yAxisData: number[] = []

  data.forEach((item) => {
    if (item.dataDate) {
      const dateArr = item.dataDate.split('-')
      if (dateArr.length > 2) {
        xAxisData.push(`${dateArr[1]}/${dateArr[2]}`)
        if (item.yesterdaySales) {
          yAxisData.push(Number(item.yesterdaySales))
        } else {
          yAxisData.push(0)
        }
      }
    }
  })

  lineOption.value.xAxisData = xAxisData
  lineOption.value.yAxisData = yAxisData
  lineOption.value.tipsName = '销量'

  nextTick(() => {
    lineChartRef.value.setChartOptions()
  })
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
  padding: 0px;
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}

:deep(.el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
</style>
