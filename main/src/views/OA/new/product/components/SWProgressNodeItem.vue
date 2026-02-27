<template>
  <div class="SWProgressNodeItem">
    <!-- <div style="
        display: flex;
        flex-direction: column;
        width: calc(100% + 22px);
        align-items: center;
        position: relative;
      " v-if="
        getPrallelEndNode(parallelHeaderNodeList, 0) &&
        getPrallelEndNode(parallelHeaderNodeList, 0) === params.nodeCode
      ">
      <div style="display: flex; flex-direction: row; width: calc(100%); margin-top: -12px">
        <div style="width: calc(100%); height: 1px" :style="{ background: getNodeLineColor(params) }"></div>
      </div>
      <div style="width: 1px; height: 12px" :style="{ background: getNodeLineColor(params) }"></div>
    </div> -->
    <!-- <div style="
        display: flex;
        flex-direction: column;
        width: calc(100% + 22px);
        align-items: center;
        position: relative;
      " v-if="
        getPrallelEndNode(parallelHeaderNodeList, 2) &&
        getPrallelEndNode(parallelHeaderNodeList, 2) === params.nodeCode
      ">
      <div style="display: flex; flex-direction: row; width: calc(100%); margin-top: -12px">
        <div style="width: calc(100%); height: 1px" :style="{ background: getNodeLineColor(params) }"></div>
      </div>
      <div style="width: 1px; height: 12px" :style="{ background: getNodeLineColor(params) }"></div>
    </div> -->
    <div class="SWProgressNodeItem-item" :style="{
      border:
        params.nodeCode === selectId ? getNodeBorderSelectColor(params) : getNodeBorderColor(params),
      marginLeft: nodeMarginLeft(params),
      opacity: params.nodeCode === 'hideNode' ? 0 : 1,
      background: getNodeBgColor(params),
    }" @click="selectHandle(params.nodeCode, params)">
      <img class="SWProgressNodeItem-statusIcon" v-if="params.preNodeCode !== '0'" :src="getNodeStatusIcon(params)" style="position: absolute;left: 73px;top: -2px;" /> 
      <div class="name">{{ params.nodeName }}</div>
      <div class="row-center">
        <div class="status" :style="{
          color: getAuditStatusColors(Number(params.status) || 0, params.nodeCode)[1],
          background: getAuditStatusColors(Number(params.status) || 0, params.nodeCode)[2]
        }">
          {{ getAuditStatusColors(Number(params.status) || 0, params.nodeCode)[0] }}
        </div>
        <img class="endStatus" v-if="
          (Number(params.status) || 0) === 1 && params.finishStatus && params.finishStatus === '正常'
        " src="@/assets/imgs/oa/node/node_endStatus_blue.png" />
        <img class="endStatus" v-if="
          (Number(params.status) || 0) === 1 && params.finishStatus && params.finishStatus === '延期'
        " src="@/assets/imgs/oa/node/node_endStatus_red.png" />
      </div>
      <img class="node-icon" :src="getNodeIcon(params)" :style="{
        width: `${getNodeIconSize(params).width}px`,
        height: `${getNodeIconSize(params).height}px`,
        color: getAuditStatusColors(Number(params.status) || 0, params.nodeCode)[2]
      }" />
    </div>
    <!-- <div v-if="params.nodeCode === 'hideNode'"
      style="width: 1px; height: 80px; background: red; position: absolute; margin-left: 183px"
      :style="{ background: getNodeLineColor(getNodeByNodeCode(params.nextNodeCode, nodeList)) }"></div> -->
    <!-- <div class="SWProgressNodeItem-line" v-if="index < nodeList.length - 1" :style="{
      marginLeft: nodeMarginLeft(node),
      height: nodeLineHeight(node),
      background: getNodeLineColor(
        node.isEndNode
          ? getNodeByNodeCode(
            getPrallelEndNode(
              parallelHeaderNodeList,
              2 * getCurrentNodePreParlletCount(node, nodeList) - 2
            ),
            nodeList
          )
          : getFirstParallelNode(nodeList).nodeCode === node.nodeCode
            ? node
            : getNextNode(node, nodeList)
      )
    }"></div> -->
    <!-- 第一道线 -->
    <!-- <div style="display: flex; flex-direction: row" v-if="getFirstParallelNode(nodeList, 0).nodeCode === params.nodeCode">
      <div style="width: 86px; height: 1px" :style="{
        background: getNodeLineColor(
          params.childNodes &&
          params.childNodes.length > 0 &&
          getNodeByNodeCode(params.childNodes[0].nodeCode, nodeList)
        )
      }">
      </div>
      <img style="width: 13px; height: 13px; margin-top: -6.5px; z-index: 99" :src="getNodeStatusIcon(params)" />
      <div style="width: 86px; height: 1px" :style="{
        background: getNodeLineColor(
          params.childNodes &&
          params.childNodes.length > 1 &&
          getNodeByNodeCode(params.childNodes[1].nodeCode, nodeList)
        )
      }" v-if="getFirstParallelNode(nodeList, 0).nodeCode === params.nodeCode"></div>
    </div> -->

    <!-- <div style="display: flex; flex-direction: row; width: calc(100%); margin-top: -6.5px"
      v-if="getFirstParallelNode(nodeList).nodeCode === params.nodeCode">
      <div style="width: 1px; height: 12px" :style="{ background: getNodeLineColor(getNextNode(params, nodeList)) }">
      </div>
      <div style="width: 1px; height: 12px; margin-left: auto"
        :style="{ background: getNodeLineColor(getNextNode(params, nodeList)) }"></div>
    </div> -->

    <!-- 第二道线 -->
    <!-- <div style="display: flex; flex-direction: row; width: calc(100%)"
      v-if="getFirstParallelNode(nodeList, 1).nodeCode === params.nodeCode">
      <div style="width: 86px; height: 1px" :style="{
        background: getNodeLineColor(
          params.childNodes &&
          params.childNodes.length > 0 &&
          getNodeByNodeCode(params.childNodes[0].nodeCode, nodeList)
        )
      }">
      </div>
      <img style="width: 13px; height: 13px; margin-top: -6.5px; z-index: 99" :src="getNodeStatusIcon(params)" />
      <div style="width: 86px; height: 1px" :style="{
        background: getNodeLineColor(
          params.childNodes &&
          params.childNodes.length > 1 &&
          getNodeByNodeCode(params.childNodes[1].nodeCode, nodeList)
        )
      }" v-if="getFirstParallelNode(nodeList, 1).nodeCode === params.nodeCode"></div>
    </div> -->
    <!-- <div style="display: flex; flex-direction: row; width: calc(100%); margin-top: -6.5px"
      v-if="getFirstParallelNode(nodeList, 1).nodeCode === params.nodeCode">
      <div style="width: 1px; height: 12px" :style="{ background: getNodeLineColor(getNextNode(params, nodeList)) }">
      </div>
      <div style="width: 1px; height: 12px; margin-left: auto"
        :style="{ background: getNodeLineColor(getNextNode(params, nodeList)) }"></div>
    </div>
    -->
  </div>
</template>

<script lang="ts" setup>
import {
  getFirstParallelNode,
  isParallelNode,
  parallelNodeFirstIndex,
  getNodeByNodeCode,
  getPrallelEndNode,
  getNextNode,
  parallelTopNodeCountByIndex,
  parallelBottomNodeCountByIndex,
  getCurrentNodePreParlletCount
} from '@/views/OA/new/product/utils.js'

import node_fenpei_yellow from '@/assets/imgs/oa/product/node/node_fenpei_yellow.svg'
import node_fenpei_red from '@/assets/imgs/oa/product/node/node_fenpei_red.svg'
import node_fenpei_blue from '@/assets/imgs/oa/product/node/node_fenpei_blue.svg'
import node_fenpei_balck from '@/assets/imgs/oa/product/node/node_fenpei_balck.svg'

import node_upload_yellow from '@/assets/imgs/oa/product/node/node_upload_yellow.svg'
import node_upload_red from '@/assets/imgs/oa/product/node/node_upload_red.svg'
import node_upload_blue from '@/assets/imgs/oa/product/node/node_upload_blue.svg'
import node_upload_black from '@/assets/imgs/oa/product/node/node_upload_black.svg'

import node_audit_yellow from '@/assets/imgs/oa/product/node/node_audit_yellow.svg'
import node_audit_red from '@/assets/imgs/oa/product/node/node_audit_red.svg'
import node_audit_blue from '@/assets/imgs/oa/product/node/node_audit_blue.svg'
import node_audit_black from '@/assets/imgs/oa/product/node/node_audit_black.svg'

import node_status_yellow from '@/assets/imgs/oa/product/node/node_status_yellow.png'
import node_status_red from '@/assets/imgs/oa/product/node/node_status_red.svg'
import node_status_black from '@/assets/imgs/oa/product/node/node_status_black.svg'
import node_status_blue from '@/assets/imgs/oa/product/node/node_status_blue.svg'

const props = defineProps({
  params: {
     type: Object as PropType<any>,
    default: () => ({})
  },
  node: {
    type: Object as PropType<any>,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  },
  nodeList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  parallelHeaderNodeList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  selectId: {
    type: String,
    default: ''
  }
})

// 节点的左侧位置
const nodeMarginLeft = (node) => {
  if (
    isParallelNode(node, props.parallelHeaderNodeList) &&
    parallelNodeFirstIndex(node, props.parallelHeaderNodeList) % 2 === 0
  ) {
    return '-183px'
  } else if (
    isParallelNode(node, props.parallelHeaderNodeList) &&
    parallelNodeFirstIndex(node, props.parallelHeaderNodeList) % 2 === 1
  ) {
    return '183px'
  }
}

const nodeLineHeight = (node) => {
  if (
    isParallelNode(node, props.parallelHeaderNodeList) &&
    parallelNodeFirstIndex(node, props.parallelHeaderNodeList) % 2 === 1 &&
    node.isEndNode
  ) {
    let prePalleCount = getCurrentNodePreParlletCount(node, props.nodeList)

    let absCount = Math.abs(
      parallelTopNodeCountByIndex(props.parallelHeaderNodeList, prePalleCount * 2 - 2) -
      parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, prePalleCount * 2 - 1)
    )
    return `${absCount * 98 + 16}px`
  }
  return '16px'
}

const selectHandle = (id: string, node: any) => {
  if (node.nodeCode === 'hideNode') {
    return
  }
  emit('selectHandle', id, node)
}

const formRef = ref()
const scrollCurrentNode = (currentIndex) => {
  nextTick(() => {
    if (currentIndex > 3) {
      formRef.value.scrollTo(0, (currentIndex - 1) * 52)
    }
  })
}
defineExpose({
  scrollCurrentNode
})
// 产前样审核是否有被拒的子节点
const isRefundPreProductionSampleAudit = () => {
  const node = props.nodeList.find((item) => item.nodeCode === 'PreProductionSampleAudit')
  let isExistRefund = false
  if (node) {
    node.examineInfo = handleJSONParse(node.examineInfo) || []
    node.examineInfo.forEach((item) => {
      if (Number(item.examineStatus || 0) === 2) {
        // 被拒绝
        isExistRefund = true
      }
    })
  }
  return isExistRefund
}

const handleJSONParse = (str) => {
  try {
    if (Array.isArray(str)) {
      return str
    }
    if (str !== '') {
      return JSON.parse(str)
    }
  } catch (error) {
    return []
  }
}

// 节点状态 status(0-未开始,1-已结束,2- 淘汰)
const getNodeLineColor = (node) => {
  if (node) {
    if (node && node.status && Number(node.status || 0) === 0) {
      return '#CECECE'
    }
    if (!node.status) {
      return '#CECECE'
    }
  }
  return '#9CC3FF'
}
// 节点状态 status(0-未开始,1-已结束,2- 淘汰)

const getNodeBgColor = (node) => {
  if (Number(node.status || 0) === 0) {
    return '#F9F9F9'
  } else if (Number(node.status || 0) === 1) {
    return "#F6FDF7"
  } else if (Number(node.status || 0) === 2) {
    return '#FFF6F6'
  }
  return '#FFFAF5'
}

// 获取节点图标
const getNodeIcon = (node: any) => {
  if (node.nodeName && node.nodeName.endsWith('审核')) {
    if (Number(node.status || 0) === 0) {
      return node_audit_black
    } else if (Number(node.status || 0) === 1) {
      return node_audit_blue
    } else if (Number(node.status || 0) === 2) {
      return node_audit_red
    }
    return node_audit_yellow
  } else if (node.nodeName && (node.nodeName.endsWith('分配') || node.nodeName === '匹配供应商')) {
    if (Number(node.status || 0) === 0) {
      return node_fenpei_balck
    } else if (Number(node.status || 0) === 1) {
      return node_fenpei_blue
    } else if (Number(node.status || 0) === 2) {
      return node_fenpei_red
    }
    return node_fenpei_yellow
  }
  if (Number(node.status || 0) === 0) {
    return node_upload_black
  } else if (Number(node.status || 0) === 1) {
    return node_upload_blue
  } else if (Number(node.status || 0) === 2) {
    return node_upload_red
  }
  return node_upload_yellow
}

const getNodeStatusIcon = (node: any) => {
  if (Number(node.status || 0) === 0) {
    return node_status_black
  } else if (Number(node.status || 0) === 1) {
    return node_status_blue
  } else if (Number(node.status || 0) === 2) {
    return node_status_red
  }
  return node_status_yellow
}

const getNodeIconSize = (node: any) => {
  if (node.nodeName && node.nodeName.endsWith('审核')) {
    return { width: 36, height: 33, border: `1px solid #FFECD4` }
  } else if (node.nodeName && (node.nodeName.endsWith('分配') || node.nodeName === '匹配供应商')) {
    return { width: 36, height: 27 }
  }
  return { width: 36, height: 36 }
}

// 获取节点边框颜色
const getNodeBorderColor = (node: any) => {
  if (node.nodeCode === 'hideNode') {
    return 'none'
  }
  if (Number(node.status || 0) === 0) {
    return `1px solid #CECECE`
  } else if (Number(node.status || 0) === 1) {
    return `1px solid #D0EED2`
  }
  return `1px solid #FFECD4`
}

const getNodeBorderSelectColor = (node: any) => {
  if (Number(node.status || 0) === 0) {
    return `1px solid #666666`
  } else if (Number(node.status || 0) === 1) {
    return `1px solid #24BC29`
  } else if (Number(node.status || 0) === 2) {
    return `1px solid #FF2020`
  }

  return `1px solid #FF8C00`
}

// 获取审核状态颜色和背景
const getAuditStatusColors = (status: Number, nodeCode: string) => {
  if (nodeCode && nodeCode === 'PreProductionSampleAudit' && isRefundPreProductionSampleAudit()) {
    return ['拒绝', '#FF2020', `rgba(255,32,32,0.1)`]
  }
  //status 0:未开始 节点完成 节点废弃
  if (status === 0) {
    return ['未开始', '#666666', `rgba(112, 112, 112, 0.1)`]
  } else if (status === 1) {
    return ['已结束', '#24BC29', `rgba(36,188,41,0.1)`]
  } else if (status === 2) {
    return ['淘汰', '#FF2020', `rgba(255,32,32,0.1)`]
  } else if (status === 3) {
    return ['进行中', '#FF8C00', `rgba(255,140,0,0.1)`]
  }
  return ['未开始', '#666666', `rgba(112, 112, 112, 0.1)`]
}

const emit = defineEmits(['selectHandle'])
</script>

<style lang="scss" scoped>
.SWProgressNodeItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  &-item {
    width: 160px;
    height: 80px;
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid #ffecd4;
    position: relative;
    cursor: pointer;
    z-index: 999;
    box-sizing: border-box;

    &:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .name {
      padding-left: 13px;
      padding-top: 16px;
      font-size: 14px;
      line-height: 20px;

      color: #333333;
    }

    .status {
      margin-left: 13px;
      margin-top: 8px;
      height: 21px;
      border-radius: 12px;
      font-size: 12px;
      line-height: 21px;
      padding-left: 10px;
      padding-right: 10px;
    }

    .endStatus {
      margin-left: 8px;
      margin-top: 4.5px;
      width: 12px;
      height: 12px;
    }

    .node-icon {
      width: 36px;
      height: 36px;
      position: absolute;
      right: 0px;
      bottom: 0px;
    }
  }

  &-line {
    position: relative;
    height: 16px;
    width: 1px;
    background: #9cc3ff;
  }

  &-statusIcon {
    position: absolute;
    width: 13px;
    height: 13px;
    top: 0px;
    z-index: 999;
    margin-top: -5px;
  }
}
</style>
