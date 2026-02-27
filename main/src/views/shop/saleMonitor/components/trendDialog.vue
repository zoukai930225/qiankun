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
import SaleTrendChart from '@/components/SWChart/good/saleTrendChart.vue'

import * as GoodsShopApi from '@/api/shop'

const lineChartRef = ref()
const lineOption = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '销量',
  lineColor: '#0064ff'
})
const dialogVisible = ref(false) // 弹窗的是否展示
const formData = ref({
  goodsId: ''
})
/** 打开弹窗 */
const open = async (goodsId: string) => {
  dialogVisible.value = true
  formData.value.goodsId = goodsId
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 统计的时间
const staticsTime = ref('1')
const showChart = ref(true)
// 时间选择时间
const timeSelectChange = () => {
  showChart.value = false
  lineOption.value.xAxisData = []
  lineOption.value.yAxisData
  getList()
}

const getList = async () => {
  const param = {
    goodsId: formData.value.goodsId
  }
  const data = await GoodsShopApi.goodsSaleMonitorTrendList(param).catch(() => {})
  showChart.value = true
  if (data) {
    nextTick(() => {
      lineChartRef.value.setChartOptions()
      handleReqData(data)
    })
  }
}

const handleReqData = (data: any[]) => {
  const xAxisData = []
  const yAxisData = []

  data.forEach((item) => {
    if (item.date) {
      const dateArr = item.date.split('-')
      if (dateArr.length > 2) {
        xAxisData.push(`${dateArr[1]}/${dateArr[2]}`)
        if (item.goodsCount) {
          yAxisData.push(Number(item.goodsCount))
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
  /* background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%); */
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
