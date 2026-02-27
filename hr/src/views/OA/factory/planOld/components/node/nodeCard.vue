<template>
  <div class="wrapper" :id="params?.taskDefinitionKey">
    <img class="topStatusIcon" :src="getStatusIcon(getNodeData(params))?.statusIcon" v-if="params?.preCode" />
    <div @click="handleClick"
      :style="{ borderColor: isSelected ? getStatusIcon(getNodeData(params))?.color : getStatusIcon(getNodeData(params))?.borderColor, backgroundColor: getStatusIcon(getNodeData(params))?.bgColor }"
      :class="['nodeCard', !params?.preCode ? 'firstNode' : '']">
      <div class="nodeName">{{ params?.taskName }}</div>
      <div class="nodeStatus">
        <div class="status"
          :style="{ color: getStatusIcon(getNodeData(params))?.color, backgroundColor: getStatusIcon(getNodeData(params))?.backgroundColor }">
          {{ getNodeData(params).label }}</div>
        <img :src="getEndStatusIcon(params)" v-if="getEndStatusIcon(params)" />
      </div>
      <img class="nodeIcon" :src="getNodeIcon(getNodeData(params))" />
    </div>
    <!-- <div v-if="params?.taskDefinitionKey === 'FactorySecondaryDevelopment'" style="width: 185px;">
      <div class="SWProgressNodeItem-line"
        :style="{ background: getStatusIcon(getNodeData(params))?.borderColor, height: '16px' }" />
      <div style="display: flex; flex-direction: row;">
        <div :style="{ width: '86px', height: '1px', background: getStatusIcon(getNodeData(params))?.borderColor }">
        </div><img :src="node_status_pass"
          :style="{ width: '13px', height: '13px', marginTop: '-6.5px', zIndex: 99 }" />
        <div :style="{ width: '86px', height: '1px', background: getStatusIcon(getNodeData(params))?.borderColor }">
        </div>
      </div>
      <div style="display: flex; flex-direction: row; width: calc(100%); margin-top: -6.5px;">
        <div :style="{ width: '1px', height: '12px', background: getStatusIcon(getNodeData(params))?.borderColor }">
        </div>
        <div
          :style="{ width: '1px', height: '12px', marginLeft: 'auto', background: getStatusIcon(getNodeData(params))?.borderColor }">
        </div>
      </div>
    </div>
    <div v-if="params?.taskDefinitionKey === 'FSSupplierChainSpecialistMatch'"
      style="width: 185px; position: absolute; bottom: -28px; right: -15px;">
      <div style="display: flex; flex-direction: row; width: 100%;position: absolute; top: -16px; right: -92px;">
        <div :style="{ width: '1px', height: '16px', background: getStatusIcon(getNodeData(params))?.borderColor }">
        </div>
        <div :style="{
          top: '-96px', right: '0px', position: 'absolute', width: '1px', height: '112px', marginLeft: 'auto', background: getStatusIcon(getNodeData(params))?.borderColor
        }">
        </div>
      </div>
      <div style="display: flex; flex-direction: row;position: absolute;right: -92px;">
        <div :style="{ width: '86px', height: '1px', background: getStatusIcon(getNodeData(params))?.borderColor }">
        </div><img :src="node_status_pass"
          :style="{ width: '13px', height: '13px', marginTop: '-6.5px', zIndex: 99 }" />
        <div :style="{ width: '86px', height: '1px', background: getStatusIcon(getNodeData(params))?.borderColor }">
        </div>
      </div>
      <div
        :style="{ width: '1px', height: '12px', marginLeft: 'auto', background: getStatusIcon(getNodeData(params))?.borderColor }">
      </div>
    </div>
    <div class="bottomLine" :style="{ background: getStatusIcon(getNodeData(params))?.borderColor }"
      v-if="params?.nextCode && !['FactorySecondaryDevelopment', 'FsDevelopManagerDistribution', 'FSSupplierChainSpecialistMatch'].includes(params?.taskDefinitionKey)" /> -->
  </div>

  <!-- <div v-if="params?.nextProgress" style="position: relative;">
    <nodeCard @nodeClick="(item) => emit('nodeClick', item)" :selectedNode="selectedNode" :params="node"
      v-for="node in params.nextProgress" :key="node.taskDefinitionKey" />
  </div> -->
</template>

<script lang="ts" setup>
import nodeCard from '@/views/OA/factory/plan/components/node/nodeCard.vue'
import { iconMap, statusMap, getNodeData, getEndStatusIcon } from './nodeOptions'
import node_status_pass from '@/assets/imgs/oa/product/node/node_status_blue.svg'

const props = defineProps({
  params: {
    type: Object as any,
    default: () => { }
  },
  selectedNode: {
    type: Object as any,
    default: () => { }
  }
})

const isSelected = computed(() => {
  return props.params?.taskDefinitionKey === props.selectedNode?.taskDefinitionKey
})

const bottomStyle = computed(() => ['FsSupplierChainDistribution', 'FSSupplierChainSpecialistMatch'].includes(props.params?.taskDefinitionKey) ? {
  position: 'absolute',
  left: '7px',
  top: props.params?.taskDefinitionKey === 'FSSupplierChainSpecialistMatch' ? '96px' : '0'
} : (
  ['FsDevelopManagerDistribution'].includes(props.params?.taskDefinitionKey) ? {
    position: 'absolute',
    right: '7px',
    top: 0
  } : (['FsSamplingProgress', 'FSSupplyAndDemandPlan', 'FSPurchaseManagerDistribution', 'FSProcurementNotice', 'FSPPSampleUpload'].includes(props.params?.taskDefinitionKey) ? {
    position: 'absolute',
    right: '96px',
    top: props.params?.taskDefinitionKey === 'FsSamplingProgress' ? '210px' : (
      props.params?.taskDefinitionKey === 'FSSupplyAndDemandPlan' ? '314px' : (
        props.params?.taskDefinitionKey === 'FSPurchaseManagerDistribution' ? '416px' : (
          props.params?.taskDefinitionKey === 'FSProcurementNotice' ? '516px' : '616px'
        )
      )
    )
  } : {})
));

// 触发点击
const emit = defineEmits(['nodeClick',])
const handleClick = () => {
  // 未开始的节点无法点击
  if (getNodeData(props.params)?.status === 'init') {
    return
    // emit('nodeClick', props.params)
  } else {
    emit('nodeClick', props.params)
  }
}


// 根据节点类型和状态 获取 节点图标
const getNodeIcon = (node: any) => {
  return iconMap[`node_${node.type}_${node.status}`]
}

// 根据节点状态获取节点样式
const getStatusIcon = (node: any) => {
  return statusMap[node.status]
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .nodeCard {
    box-sizing: border-box;
    width: 160px;
    height: 80px;
    padding: 16px 13px;
    border-radius: 6px;
    position: relative;
    background: #fff;
    cursor: pointer;
    border: 1px solid #cecece;

    &.firstNode {
      margin-top: 0;
    }

    &:hover {
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .nodeName {
      font-size: 14px;
      color: #333;
      margin-bottom: 10px;
    }

    .nodeStatus {
      display: flex;
      align-items: center;

      .status {
        width: fit-content;
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 12px;
        background: rgb(112, 112, 112, .2);
        color: #666;
        margin-right: 6px;
      }
    }

    .nodeIcon {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }

  .bottomLine {
    width: 1px;
    height: 16px;
    background: #cecece;
  }

  .topStatusIcon {
    position: absolute;
    top: -6.5px;
    z-index: 100;
  }
}

.SWProgressNodeItem-line {
  margin: 0 auto;
  width: 1px;
}
</style>