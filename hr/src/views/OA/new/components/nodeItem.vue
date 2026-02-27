<template>
  <el-popover
    placement="bottom-start"
    :width="255"
    :offset="0"
    trigger="hover"
    :popper-style="{
      borderRadius: '10px',
      padding: '14px 16px',
      height:
        (Number(tab.isExamine || 0) === 0 &&
          (getNodeSubmitter(tab) || tab.remarks || parseExamineInfoFiles(tab).length > 0)) ||
        Number(tab.isExamine || 0) === 1
          ? '380px'
          : '200px'
    }"
  >
    <template #reference>
      <div>
        <div class="row-center topBg" :style="{ background: getTopBgColor(0) }">
          <div class="nodeName">{{ tab.nodeName }}</div>
          <img class="timeIcon" src="@/assets/imgs/oa/node/node_time.png" alt="" />
          <div class="timeLabel">持续</div>
          <div class="timeValue"
            >{{ getNodeWaitTime(tab.waitTime) }}{{ getNodeWaitTimeUnit(tab.waitTime) }}</div
          >
        </div>

        <div class="bottomBg">
          <img
            style="width: 18px; height: 18px"
            :src="getDotImg(Number(tab.status) || 0, tab.nodeCode, nodeList)"
            alt=""
          />
          <div
            class="nodeStatusLbl"
            :style="{
              color: getNodeBgStatusColor(tab.waitTime || '')
            }"
            >{{ getStatusLabel(tab.status, tab.nodeCode, nodeList) }}</div
          >
          <div class="nodeStatusTime">{{
            formatCustomDate(tab.actualEndTime, 'yyyy-MM-dd HH:mm')
          }}</div>
        </div>
      </div>
    </template>
    <NodeDetail :nodeList="nodeList" :tab="tab" :index="index" />
  </el-popover>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import NodeDetail from '@/views/OA/new/product/components/nodeComponents/nodeDetail.vue'

import {
  getNodeSubmitter,
  parseExamineInfoFiles,
  getDotImg,
  getStatusLabel,
  formatCustomDate,
  getNodeBgStatusColor,
  getNodeWaitTime,
  getNodeWaitTimeUnit
} from '@/views/OA/new/product/utils.js'

const props = defineProps({
  nodeList: {
    type: Array as PropType<any[]>,
    default: () => {
      return []
    }
  },
  tab: propTypes.object.def({}),
  index: propTypes.number.def(0)
})

const getTopBgColor = (index: number) => {
  if (index === 0) {
    // 分钟
    return '#F2FCF8'
  } else if (index === 1) {
    // 小时
    return '##FEF7EB'
  } else if (index === 2) {
    // 天
    return '#FFEBEB'
  }
  return 'F2FCF8'
}
onMounted(() => {})
</script>

<style lang="scss" scoped>
.topBg {
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 10px;
  height: 52px;
  .nodeName {
    max-width: 84px;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
  }
  .timeIcon {
    width: 12px;
    height: 12px;
    margin-left: auto;
    margin-right: 8px;
  }
  .timeLabel {
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    padding-right: 10px;
  }
  .timeValue {
    font-weight: 500;
    font-size: 14px;
    color: #24bc29;
    line-height: 20px;
  }
}
.bottomBg {
  padding-left: 8px;
  padding-right: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 52px;
  .nodeStatusLbl {
    padding-left: 6px;
    font-size: 14px;
    line-height: 20px;
  }
  .nodeStatusTime {
    padding-left: 6px;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
  }
}
</style>
