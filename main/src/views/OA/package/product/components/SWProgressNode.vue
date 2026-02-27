<template>
  <div class="SWPorgressNodeBg" ref="formRef">
    <div
      style="
        padding-left: 2px;
        width: calc(100% - 2px);
        display: flex;
        flex-direction: column;
        align-items: center;
      "
      :style="{
        height: SWPorgressNodeBgHeight()
      }"
    >
      <div style="height: 20px; width: calc(100%); opacity: 0">1</div>
      <div
        class="SWPorgressNodeBg-item"
        v-for="(node, idx) in nodeList"
        :key="node.nodeCode"
        :style="{
          top: nodePositionTop(node, idx)
        }"
        :ref="(el) => (componentRefs[node.nodeCode] = el)"
      >
        <SWProgressNodeItem
          :index="idx"
          :node="node"
          :parallelHeaderNodeList="parallelHeaderNodeList"
          :node-list="nodeList"
          :selectId="selectId"
          @select-handle="selectHandle"
        />
      </div>
      <div
        v-if="
          nodeList &&
          nodeList.length > 0 &&
          getCurrentNodePreParlletCount(nodeList[nodeList.length - 1], nodeList) === 0
        "
        style="height: 20px; width: calc(100%); opacity: 0"
        >1</div
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  getCurrentNodePreParlletCount,
  isPallelEndNodeNextNode,
  isParallelNode,
  parallelBottomNodeCountByIndex,
  parallelNodeFirstIndex,
  parallelTopNodeCountByIndex
} from '@/views/OA/new/product/utils.js'
import SWProgressNodeItem from './SWProgressNodeItem.vue'

const props = defineProps({
  nodeList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  parallelHeaderNodeList: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  index: {
    type: Number,
    default: 0
  },
  selectId: {
    type: String,
    default: ''
  }
})

const componentRefs = ref({})

const selectHandle = (id: string, node: any) => {
  emit('selectHandle', id, node)
}

const formRef = ref()
const scrollCurrentNode = (currentIndex) => {
  if (currentIndex < props.nodeList.length) {
    let node = props.nodeList[currentIndex]
    const nodeRef = componentRefs.value[node.nodeCode]
    if (nodeRef) {
      nextTick(() => {
        if (currentIndex > 3) {
          formRef.value.scrollTo(0, nodeRef.offsetTop - 98 * 2)
        }
      })
    }
  }
}

const SWPorgressNodeBgHeight = () => {
  let prePalleCount = getCurrentNodePreParlletCount(
    props.nodeList && props.nodeList[props.nodeList.length - 1],
    props.nodeList
  )
  let count = 0
  for (var i = 0; i < prePalleCount; i++) {
    count += parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, i * 2 + 1)
  }
  return `${(props.nodeList.length - count) * 98 + 16 + 30 + 30 * (prePalleCount > 1 ? prePalleCount - 1 : 0)}px`
}
const nodePositionTop = (node, index) => {
  if (
    isParallelNode(node, props.parallelHeaderNodeList) &&
    parallelNodeFirstIndex(node, props.parallelHeaderNodeList) % 2 === 1
  ) {
    let paralleCount = 0
    let nodeFirstIndex = parallelNodeFirstIndex(node, props.parallelHeaderNodeList)

    let preIndex = nodeFirstIndex - 2
    let preIndex1 = preIndex - 2
    let preIndex2 = preIndex1 - 2
    let preParalleCount = 0
    if (preIndex2 > 0) {
      preParalleCount += 1
      paralleCount += Math.max(
        parallelTopNodeCountByIndex(props.parallelHeaderNodeList, preIndex2 - 1),
        parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, preIndex2)
      )
    }
    if (preIndex1 > 0) {
      preParalleCount += 1
      paralleCount += Math.max(
        parallelTopNodeCountByIndex(props.parallelHeaderNodeList, preIndex1 - 1),
        parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, preIndex1)
      )
    }
    if (preIndex > 0) {
      preParalleCount += 1
      paralleCount += Math.max(
        parallelTopNodeCountByIndex(props.parallelHeaderNodeList, preIndex - 1),
        parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, preIndex)
      )
    }

    if (nodeFirstIndex > 0) {
      paralleCount += Math.max(
        parallelTopNodeCountByIndex(props.parallelHeaderNodeList, nodeFirstIndex - 1),
        parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, nodeFirstIndex)
      )
    }
    let marginTop = (80 + 18) * paralleCount
    marginTop = marginTop - preParalleCount * 12
    return `-${marginTop}px`
  } else {
    let prePalleCount = getCurrentNodePreParlletCount(node, props.nodeList)
    if (
      prePalleCount > 0 &&
      isPallelEndNodeNextNode(
        props.parallelHeaderNodeList,
        node.nodeCode,
        props.nodeList,
        prePalleCount * 2 - 2
      ) &&
      parallelNodeFirstIndex(node, props.parallelHeaderNodeList) === -1
    ) {
      let paralleCount = Math.max(
        parallelTopNodeCountByIndex(props.parallelHeaderNodeList, prePalleCount * 2 - 2),
        parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, prePalleCount * 2 - 1)
      )
      let marginTop = (80 + 18) * paralleCount
      marginTop -= 12
      if (prePalleCount > 1) {
        paralleCount = Math.max(
          parallelTopNodeCountByIndex(props.parallelHeaderNodeList, prePalleCount * 2 - 2),
          parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, prePalleCount * 2 - 1)
        )
        marginTop = (80 + 18) * paralleCount
        marginTop -= 24
        marginTop +=
          (80 + 18) *
          (parallelTopNodeCountByIndex(props.parallelHeaderNodeList, prePalleCount * 2 - 1) + 1)
      }
      return `-${marginTop}px`
    } else if (
      prePalleCount > 0 &&
      parallelNodeFirstIndex(node, props.parallelHeaderNodeList) % 2 === 0 &&
      parallelNodeFirstIndex(node, props.parallelHeaderNodeList) > 1
    ) {
      let paralleCount = Math.max(
        parallelTopNodeCountByIndex(props.parallelHeaderNodeList, prePalleCount - 2),
        parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, prePalleCount - 1)
      )
      let marginTop = (80 + 18) * paralleCount
      marginTop -= 12
      return `-${marginTop}px`
    }
  }
  return ''
}

defineExpose({
  scrollCurrentNode
})

const emit = defineEmits(['selectHandle'])
</script>

<style lang="scss" scoped>
.SWPorgressNodeBg {
  overflow-y: auto;
  max-height: 390px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f2f6fc;
  &-item {
    position: relative;
  }
}
</style>
