<template>
  <div>
    <Dialog
      class="chartDialog"
      :width="1028"
      :border-radius="6"
      v-model="dialogVisible"
      title="查看"
    >
      <div class="staticsInfo">
        <RedBookDetailChart
          style="margin-top: -30px"
          ref="lineChartRef"
          :option="lineOption1"
          :option1="lineOption2"
          :option2="lineOption3"
        />
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import RedBookDetailChart from '@/components/SWChart/redBook/detailChart.vue'
import dayjs from 'dayjs'

import * as RedBookBookApi from '@/api/redBook'

const lineChartRef = ref()
const lineOption1 = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '点赞',
  lineColor: '#3270FF'
})

const lineOption2 = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '收藏',
  lineColor: '#FF7D08'
})

const lineOption3 = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '评论',
  lineColor: '#C460B8'
})

const dialogVisible = ref(false) // 弹窗的是否展示
const formData = ref({
  xhsId: ''
})
/** 打开弹窗 */
const open = async (xhsId: string) => {
  dialogVisible.value = true
  formData.value.xhsId = xhsId || ''
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const getList = async () => {
  const data = await RedBookBookApi.xhsListByXhsId(formData.value.xhsId).catch(() => {})
  if (data) {
    nextTick(() => {
      handleReqData(data)
    })
  }
}

const handleReqData = (data: any[]) => {
  //点赞数
  const xAxisData1 = []
  const yAxisData1 = []
  const yAxisData2 = []
  const yAxisData3 = []

  data &&
    data.forEach((item: any) => {
      if (item.statDatetime) {
        // 日期存在，则进行格式化
        const statDate = dayjs(item.statDatetime).format('YYYY-MM-DD') || ''
        const dateArr = statDate.split('-')
        if (dateArr.length > 2) {
          xAxisData1.push(`${dateArr[1]}/${dateArr[2]}`)
          if (item.likedCount) {
            yAxisData1.push(Number(item.likedCount))
          } else {
            yAxisData1.push(0)
          }

          if (item.collectedCount) {
            yAxisData2.push(Number(item.collectedCount))
          } else {
            yAxisData2.push(0)
          }

          if (item.commentCount) {
            yAxisData3.push(Number(item.commentCount))
          } else {
            yAxisData3.push(0)
          }
        }
      }
    })
  lineOption1.value.xAxisData = xAxisData1
  lineOption2.value.xAxisData = xAxisData1
  lineOption3.value.xAxisData = xAxisData1

  lineOption1.value.yAxisData = yAxisData1
  lineOption2.value.yAxisData = yAxisData2
  lineOption3.value.yAxisData = yAxisData3
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
  background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}

:deep(.el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}

.staticsInfo {
  margin-top: 0px;
}
</style>
