<template>
  <div v-loading="loading" style="height: 300px;">
    <div ref="planChartsRef" style="height: 100%;"/>
    <!-- <teleport-plan-container /> -->
    <!-- <div class="node">
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
    </div> -->
  </div>
</template>

<script lang="ts" setup>
import { register, getTeleport } from '@antv/x6-vue-shape';
import { Graph } from '@antv/x6';

import {
  isParallelNode,
  parallelNodeFirstIndex,
  isPallelEndNodeNextNode,
  getPrallelEndNode,
  parallelTopNodeCount,
  parallelBottomNodeCount,
  getCurrentNodePreParlletCount,
  parallelTopNodeCountByIndex,
  parallelBottomNodeCountByIndex
} from '@/views/OA/new/product/utils.js'
import nodeItem from './nodeComponents/nodeItem.vue'

import left_top_blue from '@/assets/imgs/oa/node/left_top_blue.png'
import left_bottom_blue from '@/assets/imgs/oa/node/left_bottom_blue.png'
import right_top_blue from '@/assets/imgs/oa/node/right_top_blue.png'
import right_bottom_blue from '@/assets/imgs/oa/node/right_bottom_blue.png'

import left_top_gray from '@/assets/imgs/oa/node/left_top_gray.png'
import left_bottom_gray from '@/assets/imgs/oa/node/left_bottom_gray.png'
import right_top_gray from '@/assets/imgs/oa/node/right_top_gray.png'
import right_bottom_gray from '@/assets/imgs/oa/node/right_bottom_gray.png'
const loading=ref(false)
// const TeleportPlanContainer = getTeleport();

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
  id: { type: String, default: 'nodeCode' },
  child: { type: String, default: 'children' },
  parentId: { type: String, default: 'preNodeCode' },
  remove: { type: String, default: '' },
  height: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
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
    const topNodeCount = parallelTopNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex)
    return topNodeCount>3? `-660px`:`-${(topNodeCount - 1) * 366 - 7 - space}px`
  } else {
    let preNodexCount =
      parallelTopNodeCountByIndex(props.parallelHeaderNodeList, 0) -
      1 +
      (parallelTopNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex) - 1)
    if (props.nodeList.find((item) => item.nodeCode === 'hideNode')) {
      if(preNodexCount > 6) return `-${preNodexCount * 314 - space + 17}px`
      if(preNodexCount<7)return `-${preNodexCount * 358 - 21 - space + 23}px`;
      return `-${preNodexCount * 366 - 21 - space + 23}px`
    }
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
  if (nodeIndex === 0) {
    return count>3? `-585px`: `-${(count - 1) * 260}px`
  } else {
    let preNodexCount =
      parallelTopNodeCountByIndex(props.parallelHeaderNodeList, 0) -
      1 +
      parallelBottomNodeCountByIndex(props.parallelHeaderNodeList, nodeIndex + 1)
    return  preNodexCount>4? `-970px`:`-${(preNodexCount - 1) * 260 + 125}px`
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
      return preCount >3? `-970px`:`-${(count + preCount - 2) * 260 + 116}px`
    }
    let count = parallelTopNodeCount(props.parallelHeaderNodeList)
    if (parallelBottomNodeCount(props.parallelHeaderNodeList) > count) {
      count = parallelBottomNodeCount(props.parallelHeaderNodeList)
    }
    return count>3? `-585px`: `-${(count - 1) * 260}px`
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


const treeToPaths = (nodes: any): any[][] => {
  const result: any[][] = [];

  const traverse = (node: any, currentPath: any[]) => {
    const newPath = [...currentPath, node['nodeCode']];
    if (!node['children'] || !node['children']?.length) {
      result.push(newPath);
      return;
    }
    node['children'].forEach((child: any) => {
      traverse(child, newPath);
    });
  }
  nodes.forEach((node: any) => {
    traverse(node, []);
  });

  return result.sort((a: any, b: any) => b.length - a.length);
};

const destroyGraph = () => {
  if (graphValuePlan?.value) {
    graphValuePlan?.value?.dispose()
    graphValuePlan.value = null
  }
}

const planChartsRef = ref()
const graphValuePlan = ref()
const initCharts = (nodes: any, list: Array<any>, position: any) => {
  try {
    loading.value = true
    destroyGraph()
    const lineList: any = treeToPaths(nodes);
    const allNodes = lineList.flat(Infinity);
    const edges: any = getEdgesInfo(list);
    graphValuePlan.value = new Graph({
      container: planChartsRef?.value,
      width: props.width || planChartsRef?.value?.offsetWidth || 500,
      height: props.height || planChartsRef?.value?.offsetHeight || 500,
      panning: true,
      interacting: {
        nodeMovable: false,
        edgeMovable: false
      },
      background: { color: '#fff', },
      autoResize: true,
      connecting: {
        sourceAnchor: { name: 'right' },
        targetAnchor: { name: 'left' },
        connectionPoint: 'boundary',
      }
    });
    lineList.forEach((line: any, index: number) => {
      line.forEach((code: string, ipx: number) => {
        createNode(code, ipx, index + 1, lineList.length, allNodes, list, position);
      });
    });
    edges.forEach((egs: any) => {
      createEdge(list, egs, position);
    });
  } finally {
    loading.value = false
  }
};

const findMedian = (num: number) => {
  return num % 4 === 0 ? ((num / 4) + 0.5) : Math.floor(num / 4);
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

const createNode = (code: any, ipx: number, index: number, length: number, allNodes: any, list: Array<any>, position: any) => {
  const nodeData: any = list.find((ci: any) => ci[props.id] === code);
  const cell: any = graphValuePlan.value.getCellById(code);
  if (!cell?.id) {
    const size: any = position.size || { width: 180, height: 132 };
    const degreeList: any = allNodes.filter((ns: string) => ns === code);
    let site: any = position.site || { x: 100, y: 20 };
    if (degreeList.length === length) {
      site = {
        x: position.site.x + (position.mode === 'horizontal' ? (position.space.x * ipx) : 0),
        y: position.site.y + (position.mode === 'horizontal' ? 0 : (position.space.y * ipx))
      };
     
    } else if (degreeList.length === 2) {
      // index > 2时取2
      const offset: any = {
        x: position.mode === 'horizontal' ? 0 : (position.space.x * (difference((index > degreeList.length ? degreeList.length : index)  - findMedian(length)))),
        y: position.mode === 'horizontal' ? (position.space.y * (difference((index > degreeList.length ? degreeList.length : index) - findMedian(length)))) : 0
      };
      site = {
        x: position.site.x + (position.mode === 'horizontal' ? (position.space.x * ipx) : 0) + offset.x,
        y: position.site.y + (position.mode === 'horizontal' ? 0 : (position.space.y * ipx)) + offset.y
      };
    } else {
      // 待处理
    }
    register({
      shape: `custom_node_${code}`,
      ...size,
      component: { render: () => h(nodeItem, { tab: nodeData }) }
    });
    graphValuePlan.value.addNode({
      shape: `custom_node_${code}`,
      id: code, ...site,
      attrs: {
        line: {
          targetMarker: '',
          stroke: '#0064ff',
          strokeWidth: 2,
        }
      },
    });
  }
};

const createEdge = (nodeData: any, edges: any, position: any) => {
  const target: any = nodeData.find((ns: any) => ns[props.id] === edges.target.cell);
  const sourceInfo: any = graphValuePlan.value.getCellById(edges.source.cell)?.store?.data?.position || { x: 0, y: 0 };
  const targetInfo: any = graphValuePlan.value.getCellById(edges.target.cell)?.store?.data?.position || { x: 0, y: 0 };
  let vertices: any[] = [];
  if (targetInfo.y !== sourceInfo.y) {
    if (targetInfo.y > sourceInfo.y) {
      if (sourceInfo.y === position.site.y) {
        vertices = [{ x: sourceInfo.x + position.corner.bottom.addX, y: targetInfo.y + position.corner.bottom.addY }];
        edges = {
          ...edges,
          source: {
            cell: edges.source.cell,
            anchor: {
              name: 'right',
              args: {
                dx: -1 * position.args.dx,
                dy: position.args.dy,
              },
            },
            connectionPoint: 'anchor',
          }
        };
      } else {
        vertices = [{ x: sourceInfo.x + position.corner.top.addX, y: targetInfo.y - position.corner.top.reduceY }];
        edges = {
          ...edges,
          target: {
            cell: edges.target.cell,
            anchor: {
              name: 'left',
              args: {
                dx: position.args.dx,
                dy: -1 * position.args.dy,
              },
            },
            connectionPoint: 'anchor',
          }
        }
      }
    }
    if (targetInfo.y < sourceInfo.y) {
      if (sourceInfo.y === position.site.y) {
        vertices = [{ x: sourceInfo.x + position.corner.bottom.addX, y: targetInfo.y + position.corner.bottom.addY }];
        edges = {
          ...edges,
          source: {
            cell: edges.source.cell,
            anchor: {
              name: 'right',
              args: {
                dx: -1 * position.args.dx,
                dy: -1 * position.args.dy,
              },
            },
            connectionPoint: 'anchor',
          }
        }
      } else {
        vertices = [{ x: targetInfo.x - position.corner.top.reduceX, y: sourceInfo.y + position.corner.top.addY }];
        edges = {
          ...edges,
          target: {
            cell: edges.target.cell,
            anchor: {
              name: 'left',
              args: {
                dx: position.args.dx,
                dy: position.args.dy,
              },
            },
            connectionPoint: 'anchor',
          }
        }
      }
    }
  }
  graphValuePlan.value.addEdge({
    connector: {
      name: position.mode === 'horizontal' && targetInfo.y !== sourceInfo.y ? 'rounded' : 'smooth',
      args: {
        radius: 20,
      },
    },
    attrs: {
      line: {
        targetMarker: '',
        stroke: Number(target.status || '') === 0 ? '#CECECE' : '#0064ff94',
        strokeWidth: 2,
      }
    },
    connectionPoint: 'boundary',
    ...edges,
    vertices
  });
};

const getEdgesInfo = (edges: any) => {
  let lines: any[] = [];
  edges.filter((es: any) => es['preNodeCode'] !== '0').forEach((rs: any) => {
    const parents: any = rs['preNodeCode'].split(',');
    parents.forEach((ps: string) => {
      lines.push({ source: { cell: ps }, target: { cell: rs['nodeCode'] } })
    });
  });
  return lines.reduce((unique: any, item: any) => {
    const ids: string = unique.map((us: any) => `${us.source.cell}-${us.target.cell}`).join(',');
    return !item?.source?.cell || ids.includes(`${item.source.cell}-${item.target.cell}`) ? unique : [...unique, item]
  }, [])
};


defineExpose({ initCharts });

const emit = defineEmits([''])
</script>

<style scoped lang="scss">
.node {
  padding: 16px;
  margin-bottom: 16px;
  border-radius: 6px;
}
</style>
