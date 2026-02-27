<template>
  <div>
    <div ref="chartsRef" style="height: 300px;" />
    <!-- <teleport-container /> -->
  </div>
</template>

<script lang="tsx">
export default { name: 'FlowCharts' };
</script>

<script lang="tsx" setup>
import { register } from '@antv/x6-vue-shape';
import NodeDot from "./node/nodeDot.vue";
import { Graph } from '@antv/x6';

const props = defineProps({
  id: { type: String, default: 'taskDefinitionKey' },
  child: { type: String, default: 'nextProgress' },
  parentId: { type: String, default: 'preCode' },
  remove: { type: String, default: '' },
  height: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
});

const chartsRef = ref(), graphValue = ref();

const destroyGraph = () => {
  if (graphValue?.value) {
    graphValue?.value?.dispose();
    graphValue.value = null;
  }
};

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
  }, [])
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
      shape: `custom_node_${code}`,
      ...size,
      component: { render: () => h(NodeDot, { params: nodeData }) }
    });
    graphValue.value.addNode({
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
  const sourceInfo: any = graphValue.value.getCellById(edges.source.cell)?.store?.data?.position || { x: 0, y: 0 };
  const targetInfo: any = graphValue.value.getCellById(edges.target.cell)?.store?.data?.position || { x: 0, y: 0 };
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
  graphValue.value.addEdge({
    connector: {
      name: position.mode === 'horizontal' && targetInfo.y !== sourceInfo.y ? 'rounded' : 'smooth',
      args: {
        radius: 20,
      },
    },
    attrs: {
      line: {
        targetMarker: '',
        stroke: target.status === 'future' ? '#CECECE' : '#0064ff94',
        strokeWidth: 2,
      }
    },
    connectionPoint: 'boundary',
    ...edges,
    vertices
  });
};


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

const initCharts = (nodes: any, list: Array<any>, position: any) => {
  destroyGraph();
  const lineList: any = treeToPaths(nodes);
  const allNodes = lineList.flat(Infinity);
  const edges: any = getEdgesInfo(list);
  graphValue.value = new Graph({
    container: chartsRef?.value,
    width: props.width || chartsRef?.value?.offsetWidth || 500,
    height: props.height || chartsRef?.value?.offsetHeight || 500,
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
};

defineExpose({ initCharts, destroyGraph });
</script>

<style lang="scss" scoped></style>
