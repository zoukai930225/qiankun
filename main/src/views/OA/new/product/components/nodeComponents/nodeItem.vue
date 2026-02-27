<template>
  <div class="nodeItem" :class="{
    nodeItemTop:
      isParallelNode(tab, parallelHeaderNodeList) &&
      parallelNodeFirstIndex(tab, parallelHeaderNodeList) % 2 === 0,
    nodeItemTop1: parallelNodeIndex(tab, parallelHeaderNodeList) === 0,
    nodeItemBottom:
      isParallelNode(tab, parallelHeaderNodeList) &&
      parallelNodeFirstIndex(tab, parallelHeaderNodeList) % 2 === 1,
    nodeItemLast: index === nodeList.length - 1
  }" :style="{
    marginTop: isPallelEndNodeNextNode(
      parallelHeaderNodeList,
      tab.nodeCode,
      nodeList,
      2 * getCurrentNodePreParlletCount(tab, nodeList) - 2
    )
      ? '4px'
      : ''
  }">
    <!-- <div
      class="name"
      
      >{{ tab.nodeName || '--' }}</div
    > -->
    <div class="nodeItem-head" style="position: relative;">
      <div class="name" style="position: absolute;top: -30px;left: -75px;width: 200px;text-align: center;">{{
        tab.nodeName || '--' }}</div>
      <!-- <div class="name" style="position: absolute;top: -10px;">{{ tab.nodeCode|| '--'  }}</div> -->
      <!-- <div
        class="step-line"
        :class="{
          'step-line-bottom':
            isParallelNode(tab, parallelHeaderNodeList) &&
            parallelNodeFirstIndex(tab, parallelHeaderNodeList) > 0
        }"
        :style="{
          background: getStepLineBackground(tab),
          width: stepLineWidth(index)
        }"
      ></div> -->
      <div
        style="position: absolute;bottom: -45px;width: 200px;display: flex;align-items: center;justify-content: center;left: -75px;">
        <div style="
        height: 29px;
        border-radius: 14.5px;
        display: flex;
        flex-direction: row;
        align-items: center;
      " :style="{
        background: getNodeBgStatusColor(tab.waitTime),
        opacity: tab.nodeCode === 'hideNode' ? 0 : 1
      }">
          <div style="padding-left: 10px; padding-right: 10px; font-size: 14px; color: #333333">{{
            getStatusLabel(tab.status, tab.nodeCode, nodeList)
          }}</div>
          <div style="padding-right: 10px; font-size: 14px; color: #666666">{{
            formatCustomDate(tab.actualEndTime, 'yyyy-MM-dd HH:mm')
          }}</div>
        </div>
      </div>
      <!-- <div style="
        position: absolute;
        bottom: -45px;
        height: 29px;
        border-radius: 14.5px;
        display: flex;
        flex-direction: row;
        align-items: center;
      " :style="{
        left: tab.actualEndTime ? '-65px' : '-20px',
        width: tab.actualEndTime ? '200px' : 'auto',
        background: getNodeBgStatusColor(tab.waitTime),
        opacity: tab.nodeCode === 'hideNode' ? 0 : 1
      }">
        <div style="padding-left: 10px; padding-right: 10px; font-size: 14px; color: #333333">{{
          getStatusLabel(tab.status, tab.nodeCode, nodeList)
        }}</div>
        <div style="padding-right: 10px; font-size: 14px; color: #666666">{{
          formatCustomDate(tab.actualEndTime, 'yyyy-MM-dd HH:mm')
        }}</div>
      </div> -->
      <div v-if="
        parallelNodeIndex(tab, parallelHeaderNodeList) === 0 &&
        parallelNodeFirstIndex(tab, parallelHeaderNodeList) % 2 === 0
      " style="
          background: #0064ff;
          width: 80px;
          height: 2px;
          position: absolute;
          margin-left: -47px;
          top: 23px;
          border-radius: 2px;
          opacity: 0.6;
        " :style="{
          background:
            Number(
              getNodeByNodeCode(
                getPrallelHeaderNode(
                  parallelHeaderNodeList,
                  2 * getCurrentNodePreParlletCount(tab, nodeList) - 2
                ).preNodeCode,
                nodeList
              ).status || ''
            ) === 0
              ? '#C2C2C2'
              : '#0064ff'
        }"></div>
      <div v-if="
        parallelNodeIndex(tab, parallelHeaderNodeList) === 0 &&
        parallelNodeFirstIndex(tab, parallelHeaderNodeList) % 2 === 1
      " style="
          background: #0064ff;
          width: 80px;
          height: 2px;
          position: absolute;
          margin-left: -47px;
          top: 23px;
          border-radius: 2px;
          opacity: 0.6;
        " :style="{
          background:
            Number(
              getNodeByNodeCode(
                getPrallelHeaderNode(
                  parallelHeaderNodeList,
                  2 * getCurrentNodePreParlletCount(tab, nodeList) - 1
                ).preNodeCode,
                nodeList
              ).status || ''
            ) === 0
              ? '#C2C2C2'
              : '#0064ff'
        }"></div>

      <div v-if="
        parallelNodeIndex(tab, parallelHeaderNodeList) === 0 &&
        parallelNodeFirstIndex(tab, parallelHeaderNodeList) === 1
      " style="
          background: #0064ff;
          height: 2px;
          position: absolute;
          top: 23px;
          border-radius: 2px;
          opacity: 0.6;
        " :style="{
          width: bottomNodeFirstLineWidth(),
          background:
            Number(
              getNodeByNodeCode(
                getPrallelHeaderNode(
                  parallelHeaderNodeList,
                  2 * getCurrentNodePreParlletCount(tab, nodeList) - 1
                ).preNodeCode,
                nodeList
              ).status || ''
            ) === 0
              ? '#C2C2C2'
              : '#0064ff'
        }"></div>
      <div v-if="
        parallelNodeIndex(tab, parallelHeaderNodeList) === 0 &&
        parallelNodeFirstIndex(tab, parallelHeaderNodeList) === 3
      " style="
          background: #0064ff;
          height: 2px;
          position: absolute;
          top: 25px;
          border-radius: 2px;
          opacity: 0.6;
        " :style="{
          width: getBottomLineWidth(),
          background:
            Number(
              getNodeByNodeCode(
                getPrallelEndNode(
                  parallelHeaderNodeList,
                  2 * getCurrentNodePreParlletCount(tab, nodeList) - 2
                ),
                nodeList
              ).status || ''
            ) === 0
              ? '#C2C2C2'
              : '#0064ff'
        }"></div>

      <nodePopover v-if="tab.nodeCode !== 'hideNode'" :nodeList="nodeList" :tab="tab" :index="index" />
      <div v-if="tab.nodeCode === 'hideNode'" style="width: 50px; height: 50px"></div>
      <div v-if="tab.nodeCode === 'hideNode'"
        style="position: absolute; width: 41px; height: 2px; opacity: 0.6; top: 25px; left: 44px" :style="{
          background:
            Number(getNodeByNodeCode(tab.nextNodeCode, nodeList).status || '') === 0
              ? '#C2C2C2'
              : '#0064ff'
        }"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import {
  formatCustomDate,
  getStatusLabel,
  isParallelNode,
  parallelNodeIndex,
  parallelNodeFirstIndex,
  parallelTopNodeCount,
  parallelBottomNodeCount,
  parallelTopNodeCountByIndex,
  parallelBottomNodeCountByIndex,
  getPrallelEndNode,
  getNodeByNodeCode,
  getPrallelHeaderNode,
  isPallelEndNodeNextNode,
  getCurrentNodePreParlletCount
} from '@/views/OA/new/product/utils.js'

import nodePopover from './nodePopover.vue'

const props = defineProps({
  nodeList: {
    type: Array as PropType<any[]>,
    default: () => {
      return []
    }
  },
  parallelHeaderNodeList: {
    type: Array as PropType<any[]>,
    default: () => {
      return []
    }
  },
  tab: propTypes.object.def({}),
  index: propTypes.number.def(0),
})

const secondNodeBottomLineMarginLeft = () => {
  if (props.nodeList.find((item) => item.nodeCode === 'hideNode')) {
    return `${parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, 3) * 366 - 170 - 108}px`
  }
  return `${parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, 3) * 366 - 170}px`
}
const stepLineWidth = (index) => {
  if (
    index === props.nodeList.length - 1 ||
    (props.tab.childNodes && props.tab.childNodes.length > 0)
  ) {
    return '0px'
  }
  if (
    isParallelNode(props.tab, props.parallelHeaderNodeList) &&
    parallelNodeFirstIndex(props.tab, props.parallelHeaderNodeList) === 0 &&
    props.tab &&
    props.tab.isEndNode
  ) {
    let spaceCount =
      parallelTopNodeCount(props.parallelHeaderNodeList) -
      parallelBottomNodeCount(props.parallelHeaderNodeList)
    let space = 0
    if (parallelBottomNodeCount(props.parallelHeaderNodeList) > 0) {
      space = (260 * spaceCount) / parallelBottomNodeCount(props.parallelHeaderNodeList)
    }
    return `${170 - space / 2.0 - 20}px`
  }
  return ''
}
const getStepLineBackground = (tab) => {
  let nodeIndex = 2 * getCurrentNodePreParlletCount(tab, props.nodeList) - 2
  if (nodeIndex < 0) {
    return ''
  }

  if (tab && tab.isEndNode) {
    let endNode = getNodeByNodeCode(
      getPrallelEndNode(props.parallelHeaderNodeList, nodeIndex) || '',
      props.nodeList
    )
    if (endNode && Number(endNode.status || '') === 0) {
      return '#C2C2C2'
    } else {
      return '#0064ff'
    }
  } else {
    if (Number(tab.status || '') === 0) {
      return '#C2C2C2'
    } else {
      return '#0064ff'
    }
  }
}

const bottomNodeFirstLineLeft = () => {
  let spaceCount =
    parallelTopNodeCount(props.parallelHeaderNodeList) -
    parallelBottomNodeCount(props.parallelHeaderNodeList)
  let space = 0
  if (parallelBottomNodeCount(props.parallelHeaderNodeList) > 0) {
    space = (260 * spaceCount) / parallelBottomNodeCount(props.parallelHeaderNodeList)
  }
  return spaceCount > 1 ? `-${107.5 + space}px` : `-${42.5 + space}px`
}

const bottomNodeFirstLineWidth = () => {
  let spaceCount =
    parallelTopNodeCount(props.parallelHeaderNodeList) -
    parallelBottomNodeCount(props.parallelHeaderNodeList)
  let space = 0
  if (parallelBottomNodeCount(props.parallelHeaderNodeList) > 0) {
    space = (260 * spaceCount) / parallelBottomNodeCount(props.parallelHeaderNodeList)
  }
  return spaceCount > 1 ? `${space + 60}px` : `${space - 4}px`
}

//获取节点状态背景颜色
const getNodeBgStatusColor = (waitTime) => {
  const arr = getNodeWaitTimeArr(waitTime) || []
  const unit = arr.length > 0 ? arr[arr.length - 1] : ''
  if (unit === '分钟') {
    return 'rgba(36, 188, 41, 0.1)'
  } else if (unit === '小时') {
    return 'rgba(255, 163, 0, 0.1)'
  } else if (unit === '天') {
    return 'rgba(255, 79, 79, 0.1)'
  }
  return '#F7F7F7'
}

const getNodeWaitTimeArr = (waitTime) => {
  return waitTime && waitTime.split(' ')
}

const getBottomLineWidth = () => {
  const nums = parallelTopNodeCountByIndex(props.parallelHeaderNodeList, 2) - parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, 3) - 1;
  return nums < 4 ? `${nums * 472 - 54}px` : `${nums * 366 - 54}px`
}
onMounted(() => { })
</script>

<style lang="scss" scoped>
.download-text {
  width: calc(100% - 20px);

  &:hover {
    color: #0064ff;
    cursor: pointer;
  }
}

.nodeItem {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // width: 260px;
  // width: 125px;

  .name {
    // margin-left: 40px;
    padding-bottom: 8px;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
  }

  // .step-line {
  //   width: 220px;
  // }
  &:last-child {
    .step-item-head {
      .step-line {
        width: 170px;
      }
    }
  }

  &:first-child {
    // flex-basis: 60%;
    // flex-grow: 0;
    // flex-shrink: 0;
  }

  &-head {
    position: relative;
    width: 100%;
    display: flex;

    .icon {
      width: 50px;
      height: 50px;
      position: relative;
      // margin-left: 20%;
      // margin-left: 35px;
      z-index: 99;
    }

    .step-line {
      position: absolute;
      left: 84px;
      right: -35px;
      height: 2px;
      top: 25px;
      z-index: 0;
      background-color: #0064ff;
      border-radius: 2px;
      opacity: 0.6;
    }

    .step-line-last {
      width: 60px;
      background: red;
    }
  }

  .text {
    display: flex;
    margin-left: -240px;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    margin-top: 10px;

    .dot {
      margin-right: 4px;
      padding-top: 2px;
    }
  }

  .time {
    margin-left: -240px;

    margin-top: 2px;
    padding-left: 12px;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
  }
}

.nodeItemTop {
  margin-bottom: 120px;
}

.nodeItemBottom {
  margin-top: 154px;
}

.nodeItemTop1 {
  margin-left: -60px;
}

.nodeItemLast {
  width: 140px;
}
</style>
