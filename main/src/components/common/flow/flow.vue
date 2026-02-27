<template>
  <div ref="chartsRef" />
</template>

<script lang="tsx">
export default { name: 'FlowCharts' };
</script>

<script lang="tsx" setup>
import { Graph, treeToGraphData } from '@antv/g6';

const props = defineProps({
  width: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  behaviors: { type: Array<any>, default: ['drag-canvas', 'zoom-canvas'] },
  lineColor: { type: String, default: '#0064ff' },
  nodeSize: { type: Array<any>, default: [240, 80] },
  node: { type: Function, default: () => (value: any) => `<span>123</span>` },
});

const chartsRef = ref(), graphValue = ref();

const destroyGraph = () => {
  if (graphValue?.value) {
    graphValue.value.destroy();
    graphValue.value = null;
  }
};

const htmlToDOM = (str: any) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str || `<span>123</span>`, 'text/html');
  return doc.body.firstChild;
}

// const htmlString = '<div>Hello, world!</div>';
// const domNode = htmlToDOM(htmlString);
// console.log(domNode); // 输出: <div>Hello, world!</div>

const initCharts = (data: any) => {
  const nodeInfo: any = treeToGraphData(data);
  destroyGraph();
  graphValue.value = new Graph({
    container: chartsRef?.value,
    autoFit: 'view',
    padding: 20,
    autoResize: true,
    layout: {
      type: 'antv-dagre', rankdir: 'LR', align: 'DL', nodesep: 50, ranksep: 70, controlPoints: true
    },
    width: props.width || chartsRef?.value?.scrollWidth || 500,
    height: props.height || chartsRef?.value?.scrollHeight || 500,
    data: {
      nodes: nodeInfo.nodes.reduce((unique: any, item: any) => {
        const ids: string = unique.map((us: any) => us.id).join(',');
        return ids.includes(item.id) ? unique : [...unique, item]
      }, []),
      edges: nodeInfo.edges.reduce((unique: any, item: any) => {
        const ids: string = unique.map((us: any) => `${us.source}-${us.target}`).join(',');
        return ids.includes(`${item.source}-${item.target}`) ? unique : [...unique, item]
      }, []),
    },
    node: {
      type: 'html',
      style: {
        // size: props.nodeSize as any,
        // dx: -120,
        // dy: -40,
        innerHTML: (d: any) => htmlToDOM(`<span>123</span>`)
      },
    },
    edge: {
      type: 'cubic-vertical',
      style: {
        lineWidth: 2,
        stroke: props.lineColor,
        shadowColor: 'rgba(114, 46, 209, 0.3)',
        shadowBlur: 8,
        labelBackground: true,
      },
    },
    behaviors: props.behaviors
  });
  graphValue.value.render();
};

defineExpose({ initCharts });
</script>

<style lang="scss" scoped></style>
