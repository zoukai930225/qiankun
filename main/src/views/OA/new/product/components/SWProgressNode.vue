<template>
  <ElScrollbar ref="formRef">
    <div class="SWPorgressNodeBg">
      <div
        style="
          padding-left: 2px;
          width: calc(100% - 2px);
          display: flex;
          flex-direction: column;
          align-items: center;
          overflow: hidden;
        "
        :style="{
          height: SWPorgressNodeBgHeight(),
          maxHeight: `${maxHeight}px`
        }"
      >
        <!-- <div style="height: 20px; width: calc(100%); opacity: 0">1</div>
        <div class="SWPorgressNodeBg-item" v-for="(node, idx) in nodeList" :key="node.nodeCode" :style="{
          top: nodePositionTop(node, idx)
        }" :ref="(el) => (componentRefs[node.nodeCode] = el)">
          <SWProgressNodeItem :index="idx" :node="node" :parallelHeaderNodeList="parallelHeaderNodeList"
            :node-list="nodeList" :selectId="selectId" @select-handle="selectHandle" />
        </div>
        <div v-if="
          nodeList &&
          nodeList.length > 0 &&
          getCurrentNodePreParlletCount(nodeList[nodeList.length - 1], nodeList) === 0
        " style="height: 20px; width: calc(100%); opacity: 0">1</div> -->
        <el-scrollbar ref="scrollRef">
          <div ref="chartsRef" :style="{ height: `${cardHeight}px !important`, width: '100%' }" />
          <!-- <teleport-progress-container /> -->
        </el-scrollbar>
      </div>
    </div>
  </ElScrollbar>
</template>

<script lang="ts" setup>
import {
  isParallelNode,
  parallelNodeFirstIndex,
  isPallelEndNodeNextNode,
  parallelTopNodeCountByIndex,
  parallelBottomNodeCountByIndex,
  getCurrentNodePreParlletCount,
  getNodeByNodeCode
} from '@/views/OA/new/product/utils.js'
import SWProgressNodeItem from './SWProgressNodeItem.vue'
import { register } from '@antv/x6-vue-shape'
import { Graph } from '@antv/x6'

// const TeleportProgressContainer = getTeleport()

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
  },
  maxHeight: {
    type: Number,
    default: 390
  },
  id: { type: String, default: 'nodeCode' },
  child: { type: String, default: 'children' },
  parentId: { type: String, default: 'preNodeCode' },
  remove: { type: String, default: '0' },
  height: { type: Number, default: 0 },
  width: { type: Number, default: 0 }
})

const componentRefs = ref({})

const selectHandle = (id: string, node: any) => {
  emit('selectHandle', id, node)
}

const formRef = ref()

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

        const isNewCode = !!getNodeByNodeCode('DesignWorkmanship', props.nodeList)?.id
        marginTop = isNewCode ? 858 : marginTop
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

const chartsRef = ref(),
  graphValue = ref(),
  scrollRef = ref()

const getEdgesInfo = (edges: any) => {
  let lines: any[] = []
  edges
    .filter((es: any) => es[props.parentId] !== props.remove)
    .forEach((rs: any) => {
      const parents: any = rs[props.parentId].split(',')
      parents.forEach((ps: string) => {
        lines.push({ source: { cell: ps }, target: { cell: rs[props.id] } })
      })
    })
  return lines.reduce((unique: any, item: any) => {
    const ids: string = unique.map((us: any) => `${us.source.cell}-${us.target.cell}`).join(',')
    return !item?.source?.cell || ids.includes(`${item.source.cell}-${item.target.cell}`)
      ? unique
      : [...unique, item]
  }, [])
}

const findMedian = (num: number) => {
  return num % 4 === 0 ? num / 4 + 0.5 : Math.floor(num / 4)
}

const difference = (num: number) => {
  let res: number = 0
  if (num > 0) {
    res = Math.ceil(num)
  } else {
    res = Math.ceil(Math.abs(num)) * -1
  }
  return res
}

const createNode = (
  code: any,
  ipx: number,
  index: number,
  length: number,
  allNodes: any,
  list: Array<any>,
  position: any
) => {
  const nodeData: any = list.find((ci: any) => ci[props.id] === code)
  const cell: any = graphValue.value.getCellById(`detail_${code}`)
  if (!cell?.id) {
    const size: any = position.size || { width: 180, height: 132 }
    const degreeList: any = allNodes.filter((ns: string) => ns === code)
    let site: any = position.site || { x: 100, y: 20 }
    if (degreeList.length === length) {
      site = {
        x: position.site.x + (position.mode === 'horizontal' ? position.space.x * ipx : 0),
        y: position.site.y + (position.mode === 'horizontal' ? 0 : position.space.y * ipx)
      }
    } else if (degreeList.length === 2) {
      const offset: any = {
        x:
          position.mode === 'horizontal'
            ? 0
            : position.space.x * difference((index > 2 ? 2 : index) - findMedian(length)),
        y:
          position.mode === 'horizontal'
            ? position.space.y * difference((index > 2 ? 2 : index) - findMedian(length))
            : 0
      }
      site = {
        x:
          position.site.x +
          (position.mode === 'horizontal' ? position.space.x * ipx : 0) +
          offset.x,
        y:
          position.site.y + (position.mode === 'horizontal' ? 0 : position.space.y * ipx) + offset.y
      }
    } else {
      // 待处理
    }
    register({
      shape: `detail_custom_node_${code}`,
      ...size,
      component: {
        render: () =>
          h(SWProgressNodeItem, {
            params: nodeData,
            nodeList: props.nodeList,
            selectedId: props.selectId,
            onSelectHandle: selectHandle
          })
      }
    })
    graphValue.value.addNode({
      shape: `detail_custom_node_${code}`,
      id: 'detail_' + code,
      ...site
    })
  }
}

const createEdge = (nodeData: any, edges: any, position: any) => {
  const target: any = nodeData.find((ns: any) => ns[props.id] === edges.target.cell)
  const sourceInfo: any = graphValue.value.getCellById(`detail_${edges.source.cell}`)?.store?.data
    ?.position || { x: 0, y: 0 }
  const targetInfo: any = graphValue.value.getCellById(`detail_${edges.target.cell}`)?.store?.data
    ?.position || { x: 0, y: 0 }
  let vertices: any[] = []
  if (targetInfo.x !== sourceInfo.x) {
    if (targetInfo.x > sourceInfo.x) {
      if (sourceInfo.x === position.site.x) {
        vertices = [
          { x: targetInfo.x, y: sourceInfo.y + position.corner.right.addY },
          {
            x: targetInfo.x + position.corner.right.addX,
            y: sourceInfo.y + position.corner.right.addY
          }
        ]
      } else {
        vertices = [
          { x: targetInfo.x, y: sourceInfo.y + position.corner.left.addY },
          {
            x: targetInfo.x + position.corner.left.addX,
            y: sourceInfo.y + position.corner.left.addY
          }
        ]
      }
    }
    if (targetInfo.x < sourceInfo.x) {
      if (sourceInfo.x === position.site.x) {
        vertices = [
          {
            x: sourceInfo.x + position.corner.left.addX,
            y: sourceInfo.y + position.corner.left.addY
          },
          {
            x: targetInfo.x + position.corner.left.addX,
            y: sourceInfo.y + position.corner.left.addY
          }
        ]
      } else {
        vertices = [
          {
            x: sourceInfo.x + position.corner.right.addX,
            y: targetInfo.y - position.corner.right.reduceY
          },
          { x: sourceInfo.x, y: targetInfo.y - position.corner.right.reduceY }
        ]
      }
    }
  }
  // stroke: statusMap[getNodeData(target).status]?.borderColor || '#0064ff94',
  const attrs: any = {
    attrs: {
      line: {
        targetMarker: '',
        stroke: getNodeLineColor(nodeData, edges.source.cell) || '#0064ff94',
        strokeWidth: 2
      }
    }
  }
  graphValue.value.addEdge({
    ...attrs,
    connectionPoint: 'anchor',
    ...{
      ...edges,
      source: { cell: `detail_${edges.source.cell}` },
      target: {
        cell: `detail_${edges.target.cell}`,
        anchor: {
          name: 'top',
          args: {
            dy: -6
          }
        }
      }
    },
    vertices
  })
}

const treeToPaths = (nodes: any): any[][] => {
  const result: any[][] = []

  const traverse = (node: any, currentPath: any[]) => {
    const newPath = [...currentPath, node[props.id]]
    if (!node[props.child] || !node[props.child]?.length) {
      result.push(newPath)
      return
    }
    node[props.child].forEach((child: any) => {
      traverse(child, newPath)
    })
  }
  nodes.forEach((node: any) => {
    traverse(node, [])
  })

  return result.sort((a: any, b: any) => b.length - a.length)
}

const destroyGraph = () => {
  if (graphValue?.value) {
    graphValue?.value?.dispose()
    graphValue.value = null
  }
}

// 节点状态 status(0-未开始,1-已结束,2- 淘汰)
const getNodeLineColor = (nodeData: any, nodeCode: string) => {
  const node = nodeData.find((item: any) => item.nodeCode === nodeCode)
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

let cardHeight = 2400
const initCharts = async (nodes: any, list: Array<any>, position: any) => {
  destroyGraph()
  const lineList: any = treeToPaths(nodes)
  cardHeight = lineList[0].length * 120
  const allNodes = lineList.flat(Infinity)
  const edges: any = getEdgesInfo(list)
  nextTick(() => {
    graphValue.value = new Graph({
      container: chartsRef?.value,
      width: props.width || chartsRef?.value?.offsetWidth || 410,
      height: cardHeight,
      panning: true,
      interacting: {
        nodeMovable: false,
        edgeMovable: false
      },
      background: { color: '#fff' },
      connecting: {
        sourceAnchor: {
          name: 'bottom'
        },
        targetAnchor: { name: 'top' },
        connectionPoint: 'anchor'
      }
    })
    lineList.forEach((line: any, index: number) => {
      line.forEach((code: string, ipx: number) => {
        const nodeData: any = list.find((ci: any) => ci[props.id] === code)
        // nodeData.status === 'active' && handleSelectNode(nodeData);
        createNode(code, ipx, index + 1, lineList.length, allNodes, list, position)
      })
    })
    edges.forEach((egs: any) => {
      createEdge(list, egs, position)
    })
    setTimeout(() => {
      if (!props.selectId) return
      const positions: any = graphValue.value.getCellById(`detail_${props.selectId}`)?.store?.data
        ?.position || { x: 0, y: 0 }
      scrollRef?.value?.setScrollTop(positions.y - 50)
    }, 500)
  })
}

const scrollCurrentNode = (currentIndex) => {
  // let currentIndex = -1
  // nodeList.value.forEach((item, index) => {
  //   if (Number(item.status || 0) === 1) {
  //     if (index + 1 < nodeList.value.length) {
  //       if (Number(nodeList.value[index + 1].status || 0) !== 1) {
  //         currentIndex = index + 1
  //       }
  //     }
  //   }
  // })
  // if (currentIndex > 0) {
  //   nextTick(() => {
  //     // swProgressNodeRef.value?.scrollCurrentNode(currentIndex)
  //   })
  // } else if (currentIndex === -1) {
  //   selectId.value = ''
  //   formInline.value = {}
  // }
  // if (currentIndex < props.nodeList.length) {
  //   let node = props.nodeList[currentIndex]
  //   const nodeRef = componentRefs.value[node.nodeCode]
  //   if (nodeRef) {
  //     nextTick(() => {
  //       if (currentIndex > 3) {
  //         formRef.value.scrollTo(0, nodeRef.offsetTop - 98 * 2)
  //       }
  //     })
  //   }
  // }
}

defineExpose({
  scrollCurrentNode,
  initCharts
})

const emit = defineEmits(['selectHandle'])
</script>

<style lang="scss" scoped>
.SWPorgressNodeBg {
  // overflow-y: auto;
  // max-height: 390px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;

  //background: #f2f6fc;
  &-item {
    position: relative;
  }
}
</style>
