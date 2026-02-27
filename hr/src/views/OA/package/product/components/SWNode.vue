<template>
  <div v-if="nodeList && nodeList.length > 0">
    <div class="node">
      <div class="node-progress">
        <div ref="setpScrollRef" style="display: flex; overflow: auto">
          <div
            style="
              margin-left: 40px;
              padding-bottom: 10px;
              position: relative;
              height: 270px;
              display: flex;
              flex-direction: row;
              align-items: center;
            "
            :style="{ width: nodeBgWidth() }"
          >
            <div
              v-for="(tab, index) in nodeList"
              :key="tab.id"
              style="position: relative"
              :style="{
                left:
                  isParallelNode(tab, parallelHeaderNodeList) &&
                  parallelNodeFirstIndex(tab, parallelHeaderNodeList) % 2 === 1
                    ? bottomNodeFirstLeft(tab)
                    : getPrallelEndNode(
                          parallelHeaderNodeList,
                          2 * getCurrentNodePreParlletCount(tab, nodeList) - 2
                        ) === tab.nodeCode
                      ? prallelEndNodeLeft(tab)
                      : otherNodeLeft(tab)
              }"
            >
              <img
                style="position: absolute; margin-left: 45px; width: 108px; height: 84px"
                :style="{
                  opacity: Number(tab.status || '') === 0 ? 0.6 : 1,
                  top: getCurrentNodePreParlletCount(tab, nodeList) > 0 ? '-9px' : '-11px'
                }"
                v-if="tab.childNodes && tab.childNodes.length > 0"
                :src="Number(tab.status || '') === 0 ? left_top_gray : left_top_blue"
              />
              <img
                style="position: absolute; margin-left: 45px; top: 49px; width: 108px; height: 84px"
                :style="{
                  opacity: Number(tab.status || '') === 0 ? 0.6 : 1,
                  top: getCurrentNodePreParlletCount(tab, nodeList) > 0 ? '51px' : '49px'
                }"
                v-if="tab.childNodes && tab.childNodes.length > 0"
                :src="Number(tab.status || '') === 0 ? left_bottom_gray : left_bottom_blue"
              />

              <img
                style="
                  position: absolute;
                  top: -7px;
                  margin-left: -31px;
                  width: 103px;
                  height: 80px;
                "
                :style="{ opacity: Number(tab.status || '') === 0 ? 0.6 : 1 }"
                v-if="
                  getPrallelEndNode(
                    parallelHeaderNodeList,
                    2 * getCurrentNodePreParlletCount(tab, nodeList) - 2
                  ) === tab.nodeCode
                "
                :src="Number(tab.status || '') === 0 ? right_top_gray : right_top_blue"
              />
              <img
                style="
                  position: absolute;
                  top: 57px;
                  margin-left: -31px;
                  width: 103px;
                  height: 80px;
                "
                :style="{ opacity: Number(tab.status || '') === 0 ? 0.6 : 1 }"
                v-if="
                  getPrallelEndNode(
                    parallelHeaderNodeList,
                    2 * getCurrentNodePreParlletCount(tab, nodeList) - 2
                  ) === tab.nodeCode
                "
                :src="Number(tab.status || '') === 0 ? right_bottom_gray : right_bottom_blue"
              />
              <nodeItem
                :nodeList="nodeList"
                :parallelHeaderNodeList="parallelHeaderNodeList"
                :tab="tab"
                :index="index"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getCurrentNodePreParlletCount,
  getPrallelEndNode,
  isPallelEndNodeNextNode,
  isParallelNode,
  parallelBottomNodeCount,
  parallelBottomNodeCountByIndex,
  parallelNodeFirstIndex,
  parallelTopNodeCount,
  parallelTopNodeCountByIndex
} from '@/views/OA/package/product/utils.js'
import nodeItem from './nodeComponents/nodeItem.vue'

import left_bottom_blue from '@/assets/imgs/oa/node/left_bottom_blue.png'
import left_top_blue from '@/assets/imgs/oa/node/left_top_blue.png'
import right_bottom_blue from '@/assets/imgs/oa/node/right_bottom_blue.png'
import right_top_blue from '@/assets/imgs/oa/node/right_top_blue.png'

import left_bottom_gray from '@/assets/imgs/oa/node/left_bottom_gray.png'
import left_top_gray from '@/assets/imgs/oa/node/left_top_gray.png'
import right_bottom_gray from '@/assets/imgs/oa/node/right_bottom_gray.png'
import right_top_gray from '@/assets/imgs/oa/node/right_top_gray.png'

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
  }
})

const bottomNodeFirstLeft = (tab) => {
  let nodeIndex = 2 * getCurrentNodePreParlletCount(tab, props.nodeList) - 2
  if (nodeIndex < 0) {
    return ''
  }
  let spaceCount =
    parallelTopNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex) -
    parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex + 1)
  let space = 0
  if (parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex + 1) > 0) {
    space =
      (260 * spaceCount) /
      parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex + 1)
  }
  if (nodeIndex === 0) {
    return `-${(parallelTopNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex) - 1) * 366 - 7 - space}px`
  } else {
    let preNodexCount =
      parallelTopNodeCountByIndex(props.parallelHeaderNodeList, 0) -
      1 +
      (parallelTopNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex) - 1)
    return `-${preNodexCount * 366 - 21 - space}px`
  }
}
const prallelEndNodeLeft = (tab) => {
  let nodeIndex = 2 * getCurrentNodePreParlletCount(tab, props.nodeList) - 2
  if (nodeIndex < 0) {
    return ''
  }
  let count = parallelTopNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex)
  if (parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex + 1) > count) {
    count = parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex + 1)
  }
  console.log('count1111', count, nodeIndex)
  if (nodeIndex === 0) {
    return `-${(count - 1) * 260}px`
  } else {
    let preNodexCount =
      parallelTopNodeCountByIndex(props.parallelHeaderNodeList, 0) -
      1 +
      parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex + 1)
    return `-${(preNodexCount - 1) * 260 + 125}px`
  }
}

const otherNodeLeft = (tab) => {
  let nodeIndex = 2 * getCurrentNodePreParlletCount(tab, props.nodeList) - 2
  if (nodeIndex < 0) {
    return ''
  }
  if (isPallelEndNodeNextNode(props.parallelHeaderNodeList, tab && tab.nodeCode, props.nodeList)) {
    if (
      isPallelEndNodeNextNode(
        props.parallelHeaderNodeList,
        tab && tab.nodeCode,
        props.nodeList,
        nodeIndex
      ) &&
      nodeIndex > 0
    ) {
      let count = parallelTopNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex)
      if (parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex + 1) < count) {
        count = parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex + 1)
      }
      let preCount = parallelTopNodeCountByIndex(props.parallelHeaderNodeList, 0)
      if (parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, 1) < count) {
        preCount = parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, 1)
      }
      return `-${(count + preCount - 2) * 260 + 116}px`
    }
    let count = parallelTopNodeCount(props.parallelHeaderNodeList)
    if (parallelBottomNodeCount(props.parallelHeaderNodeList) > count) {
      count = parallelBottomNodeCount(props.parallelHeaderNodeList)
    }
    return `-${(count - 1) * 260}px`
  } else {
    return '0px'
  }
}
const setpScrollRef = ref()
const nodeBgWidth = () => {
  if (props.parallelHeaderNodeList && props.parallelHeaderNodeList.length > 0) {
    let prePalleCount = getCurrentNodePreParlletCount(
      props.nodeList && props.nodeList[props.nodeList.length - 1],
      props.nodeList
    )
    let count = 0
    for (var i = 0; i < prePalleCount; i++) {
      count += parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, i * 2 + 1)
    }
    return `${(props.nodeList.length - count - 1) * 260}px`
  } else {
    return `${props.nodeList.length * 260}px`
  }
}

const emit = defineEmits([''])
</script>

<style scoped lang="scss">
.node {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 6px;
}
</style>
