<template>
  <div class="box" v-show="dialogVisible">
    <el-dialog
      v-model="dialogVisible"
      :show-close="false"
      @close="closeDialog"
      @open="onDialogOpen"
    >
      <template #header>
        <div class="header">
          <div class="header-text">访客数曲线</div>
        </div>
      </template>
      <div class="close" @click="closeDialog"><img src="@/assets/imgs/web/close.png" alt="" /></div>
      <EChartLint ref="swChartRef" height="430px" :option1="option1" :option2="option2" />
      <div style="height: 20px"></div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import * as GalleryApi from '@/api/gallery'
import { nextTick, ref } from 'vue'
import EChartLint from './EchartAccessLine.vue'

const dialogVisible = ref(false)
const option1 = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '访客数',
  type: 'line',
  xAxisType: 'category',
  yAxisType: 'value',
  direction: 'horizontal',
  lineColor: '#3270FF'
})
const option2 = ref({
  xAxisData: [],
  yAxisData: [],
  tipsName: '30天前访客数',
  type: 'line',
  xAxisType: 'category',
  yAxisType: 'value',
  direction: 'horizontal',
  lineColor: '#FF7D08'
})
const swChartRef = ref()

// 转换日期格式的函数
const formatDate = (dateStr: string) => {
  const [, month, day] = dateStr.split('-')
  return `${month}/${day}`
}

const open = (id: any) => {
  const params = {
    goodsId: id,
    startTime: '',
    endTime: ''
  }
  GalleryApi.getVisitorCurve(params).then((res) => {
    // console.log(res, 'res结果数据')

    option1.value.xAxisData = res.map((item) => formatDate(item.dataDate))
    option2.value.xAxisData = res.map((item) => formatDate(item.dataDate))
    // 处理 sevenDayVisitors，去除逗号后转整数
    option1.value.yAxisData = res.map((item) =>
      parseInt(item?.goodsSllVisitorCount?.replace(/,/g, ''))
    )
    // 处理 thirtyDaysOfVisitors，去除逗号后转整数
    option2.value.yAxisData = res.map((item) =>
      parseInt(item?.beforeThirtyGoodsSllVisitorCount?.replace(/,/g, ''))
    )
    dialogVisible.value = true
  })
}

const closeDialog = () => {
  dialogVisible.value = false
}

const onDialogOpen = () => {
  nextTick(() => {
    swChartRef.value.setChartOptions()
  })
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.box {
  width: 100vw;
  height: 56.25vw;
}
.zhexiantu {
  width: 43.854167vw;
}
.header {
  display: flex;
  border-radius: 8px;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 14px;
  color: #333;
  text-align: left;
  font-style: normal;
  img {
    margin-top: 1.25vw;
    width: 0.729167vw;
    height: 0.625vw;
    vertical-align: middle;
    margin-left: 1.041667vw;
    margin-right: 0.833333vw;
  }
  .header-text {
    margin-left: 20px;
    margin-top: 1.041667vw;
  }
}
:deep(.el-dialog__body) {
  box-sizing: border-box;
  padding: 0;
  width: 43.854167vw;
}

:deep(.el-dialog) {
  width: 43.854167vw;
  box-sizing: border-box;
  padding: 0;
  background: #fff;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.close {
  position: absolute;
  width: 0.9375vw;
  height: 0.9375vw;
  top: 1.041667vw;
  right: 1.041667vw;
  cursor: pointer;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
