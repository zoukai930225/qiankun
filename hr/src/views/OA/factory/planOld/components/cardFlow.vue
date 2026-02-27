<template>
  <div class="nodeWrapper" ref="resizeHandle" style="
      margin-top: 20px;
      padding-bottom: 10px;
      border: solid 1px rgb(229, 229, 229);
      box-sizing: border-box;
      border-bottom: 0;
      border-radius: 8px 8px 0 0;
      overflow: hidden;
    " :style="{
      height: `${nodeShowHeight}px`
    }">
    <el-scrollbar ref="scrollRef">
      <div ref="chartsRef" :style="{ height: `${cardHeight}px !important`, width: '100%' }" />
      <teleport-container />
    </el-scrollbar>
  </div>
</template>

<script lang="tsx">
export default { name: 'CardFlow' }
</script>

<script lang="tsx" setup>
import { getNodeData, statusMap } from './node/nodeOptions'
import { register, getTeleport } from '@antv/x6-vue-shape'
import NodeCard from './node/nodeCard.vue'
import { Graph } from '@antv/x6'

const selectedNode = ref<any>();

const TeleportContainer = getTeleport()

const props = defineProps({
  id: { type: String, default: 'taskDefinitionKey' },
  child: { type: String, default: 'nextProgress' },
  parentId: { type: String, default: 'preCode' },
  remove: { type: String, default: '' },
  height: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
})

const chartsRef = ref(), graphValue = ref(), scrollRef = ref(), cardHeight = ref(500);

const emit = defineEmits(['changeSelectedNode', 'setNodeShowHeight'])

const destroyGraph = () => {
  if (graphValue?.value) {
    graphValue?.value?.dispose()
    graphValue.value = null
  }
}

const getEdgesInfo = (edges: any) => {
  let lines: any[] = [];
  edges.filter((es: any) => es[props.parentId] !== props.remove).forEach((rs: any) => {
    const parents: any = rs[props.parentId].split(',');
    parents.forEach((ps: string) => {
      lines.push({ source: { cell: ps }, target: { cell: rs[props.id] } })
    });
  });
  return lines.reduce((unique: any, item: any) => {
    const ids: string = unique.map((us: any) => `${us.source.cell}-${us.target.cell}`).join(',');
    return !item?.source?.cell || ids.includes(`${item.source.cell}-${item.target.cell}`) ? unique : [...unique, item]
  }, []);
};

const findMedian = (num: number) => {
  return num % 2 === 0 ? ((num / 2) + 0.5) : Math.floor(num / 2);
};

const difference = (num: number) => {
  let res: number = 0;
  if (num > 0) {
    res = Math.ceil(num);
  } else {
    res = Math.ceil(Math.abs(num)) * -1;
  }
  return res;
};

const handleSelectNode = (node: any) => {
  selectedNode.value = node
  emit('changeSelectedNode', node)
}

const createNode = (code: any, ipx: number, index: number, length: number, allNodes: any, list: Array<any>, position: any) => {
  const nodeData: any = list.find((ci: any) => ci[props.id] === code);
  const cell: any = graphValue.value.getCellById(code);
  if (!cell?.id) {
    const size: any = position.size || { width: 180, height: 132 };
    const degreeList: any = allNodes.filter((ns: string) => ns === code);
    let site: any = position.site || { x: 100, y: 20 };
    if (degreeList.length === length) {
      site = {
        x: position.site.x + (position.mode === 'horizontal' ? (position.space.x * ipx) : 0),
        y: position.site.y + (position.mode === 'horizontal' ? 0 : (position.space.y * ipx))
      };
    } else if (degreeList.length === 1) {
      const offset: any = {
        x: position.mode === 'horizontal' ? 0 : (position.space.x * (difference(index - findMedian(length)))),
        y: position.mode === 'horizontal' ? (position.space.y * (difference(index - findMedian(length)))) : 0
      };
      site = {
        x: position.site.x + (position.mode === 'horizontal' ? (position.space.x * ipx) : 0) + offset.x,
        y: position.site.y + (position.mode === 'horizontal' ? 0 : (position.space.y * ipx)) + offset.y
      };
    } else {
      // 待处理
    }
    register({
      shape: `custom_node_${nodeData.id}`,
      ...size,
      component: {
        render: () =>
          h(NodeCard, {
            params: nodeData,
            selectedNode: selectedNode.value,
            onNodeClick: handleSelectNode
          })
      }
    })
    graphValue.value.addNode({
      shape: `custom_node_${nodeData.id}`,
      id: nodeData.id,
      ...site
    })
  }
}

const createEdge = (nodeData: any, edges: any, position: any) => {
  const target: any = nodeData.find((ns: any) => ns[props.id] === edges.target.cell);
  const sourceInfo: any = graphValue.value.getCellById(edges.source.cell)?.store?.data?.position || { x: 0, y: 0 };
  const targetInfo: any = graphValue.value.getCellById(edges.target.cell)?.store?.data?.position || { x: 0, y: 0 };
  let vertices: any[] = [];
  if (targetInfo.x !== sourceInfo.x) {
    if (targetInfo.x > sourceInfo.x) {
      if (sourceInfo.x === position.site.x) {
        vertices = [
          { x: targetInfo.x, y: sourceInfo.y + position.corner.right.addY },
          { x: targetInfo.x + position.corner.right.addX, y: sourceInfo.y + position.corner.right.addY }
        ];

      } else {
        vertices = [
          { x: targetInfo.x, y: sourceInfo.y + position.corner.left.addY },
          { x: targetInfo.x + position.corner.left.addX, y: sourceInfo.y + position.corner.left.addY }
        ];
      }
    }
    if (targetInfo.x < sourceInfo.x) {
      if (sourceInfo.x === position.site.x) {
        vertices = [
          { x: sourceInfo.x + position.corner.left.addX, y: sourceInfo.y + position.corner.left.addY },
          { x: targetInfo.x + position.corner.left.addX, y: sourceInfo.y + position.corner.left.addY }
        ];
      } else {
        vertices = [
          { x: sourceInfo.x + position.corner.right.addX, y: targetInfo.y - position.corner.right.reduceY },
          { x: sourceInfo.x, y: targetInfo.y - position.corner.right.reduceY }
        ];
      }
    }
  }
  const attrs: any = {
    attrs: {
      line: {
        targetMarker: '',
        stroke: statusMap[getNodeData(target).status]?.borderColor || '#0064ff94',
        strokeWidth: 2
      }
    }
  }
  graphValue.value.addEdge({
    ...attrs,
    connectionPoint: 'anchor',
    ...{
      ...edges,
      target: {
        cell: edges.target.cell,
        anchor: {
          name: 'top',
          args: {
            dy: -6,
          },
        },

      }
    },
    vertices,
  });
}

const treeToPaths = (nodes: any): any[][] => {
  const result: any[][] = [];

  const traverse = (node: any, currentPath: any[]) => {
    const newPath = [...currentPath, node[props.id]];
    if (!node[props.child] || !node[props.child]?.length) {
      result.push(newPath);
      return;
    }
    node[props.child].forEach((child: any) => {
      traverse(child, newPath);
    });
  }
  nodes.forEach((node: any) => {
    traverse(node, []);
  });

  return result.sort((a: any, b: any) => b.length - a.length);
};

const initCharts = async (nodes: any, list: Array<any>, position: any) => {
  destroyGraph()
  const lineList: any = treeToPaths(nodes);
  cardHeight.value = lineList[0].length * 120;
  const allNodes = lineList.flat(Infinity);
  const edges: any = getEdgesInfo(list);
  graphValue.value = new Graph({
    container: chartsRef?.value,
    width: props.width || chartsRef?.value?.offsetWidth || 500,
    height: 1200,
    panning: false,
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
      const nodeData: any = list.find((ci: any) => ci[props.id] === code);
      nodeData.status === 'active' && handleSelectNode(nodeData);
      createNode(code, ipx, index + 1, lineList.length, allNodes, list, position);
    });
  });
  edges.forEach((egs: any) => {
    createEdge(list, egs, position);
  });
  setTimeout(() => {
    if (!selectedNode.value?.id) {
      const tar: any = list.find((ns: any) => ns.taskName === '产前样审核')
      handleSelectNode(tar)
    }
    const positions: any = graphValue.value.getCellById(selectedNode.value[props.id])?.store?.data?.position || { x: 0, y: 0 };
    scrollRef?.value?.setScrollTop(positions.y - 50)
  }, 500);
}

const resize = (width?: number, height?: number) => {
  graphValue.value.resize(width, height)
  graphValue.value.translate((chartsRef?.value?.offsetWidth - 360) / 2, height)
}

const nodeShowHeight = ref(400)
const resizeHandle = ref()
const startResize = (event) => {
  const rect = resizeHandle.value?.getBoundingClientRect() // 获取控制点的位置和尺寸

  const startX = event.clientX // 鼠标按下的X坐标
  const startY = event.clientY // 鼠标按下的Y坐标
  const startHeight = rect.height + 8 // 控制点初始高度
  const resizable = document.querySelector('.nodeWrapper') // 获取可调整大小的元素
  const onMouseMove = (moveEvent) => {
    const dy = moveEvent.clientY - startY // 鼠标移动的Y距离
    if (startHeight + dy >= 400) {
      nodeShowHeight.value = startHeight + dy
      // resizable.style.height = `${startHeight + dy}px` // 更新高度
    } else {
      nodeShowHeight.value = 400
    }
    emit('setNodeShowHeight', nodeShowHeight.value)
  }
  const onMouseUp = () => {
    document.removeEventListener('mousemove', onMouseMove) // 移除鼠标移动事件监听器
    document.removeEventListener('mouseup', onMouseUp) // 移除鼠标松开事件监听器
  }
  setTimeout(() => {
    document.addEventListener('mousemove', onMouseMove) // 添加鼠标移动事件监听器
    document.addEventListener('mouseup', onMouseUp) // 添加鼠标松开事件监听器
  }, 0)
}

defineExpose({ initCharts, resize, startResize })
</script>

<style lang="scss" scoped>
.nodeWrapper {
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  // background: rgb(244, 247, 254);
  // margin-bottom: 20px;
  // border-radius: 8px;
  // border: 1px solid rgb(229,229, 229);
  padding: 0;
  position: relative;
}
</style>
