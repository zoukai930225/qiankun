<template>
  <div class="nodeDotWrapper" style="">
    <div style="position: relative;">
      <div class="nodeName" style="position: absolute;top: -20px;">{{ params.taskName }}</div>
      <nodePopover :params="params">
        <div :class="['nodeDot', getNodeData(params).status]">
          <div v-if="splitNum(params.duration).number && getNodeData(params).status !== 'pause'" class="duration">
            <span class="num">{{ splitNum(params.duration).number }}</span>
            <span class="timeType">{{ splitNum(params.duration).string }}</span>
          </div>
        </div>
      </nodePopover>
      <div class="nodeStatus" :style="nodeStyle">
        <span class="time">{{ `${getNodeData(params).label} ${params.tentativeOrderTime ? formatDateTime(params.tentativeOrderTime ) : formatDateTime(params.actualEndTime)}` }} </span>
      </div> 
    </div>
  </div>
</template>

<script lang="ts" setup>
// import left_top_line from '@/assets/svgs/newProduct/left_top.svg'
// import left_bottom_line from '@/assets/svgs/newProduct/left_bottom.svg'
// import right_top_line from '@/assets/svgs/newProduct/right_top.svg'
// import right_bottom_line from '@/assets/svgs/newProduct/right_bottom.svg'
// import nodeDot from "@/views/OA/factory/plan/components/node/nodeDot.vue"
import { dotStatusMap, splitNum, formatDateTime, getNodeData } from './nodeOptions'
import nodePopover from "./nodePopover.vue"

const props = defineProps({
  params: {
    type: Object as any,
    default: () => { }
  },
  node: {
    type: Object as any,
    default: () => { }
  }
})

const nodeStyle = computed(() => ({
  backgroundColor: getNodeStyle(getNodeData(props.params))?.backgroundColor,
  width: props?.params?.actualEndTime || props?.params?.tentativeOrderTime ? '160px !important' : '60px !important',
  left: props?.params?.actualEndTime || props?.params?.tentativeOrderTime ? '-50px' : '0',
}));

// 根据节点状态 获取 对应样式
const getNodeStyle = (node: any) => {
  return dotStatusMap[node.status]
};

</script>

<style lang="scss" scoped>
.nodeDotWrapper {
  position: relative;

  .nodeDot {
    width: 65px;
    height: 65px;
    border-radius: 50%;
    background-repeat: no-repeat;
    background-size: cover;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid rgb(221, 221, 221);

    &.init, &.pause {
      background-image: url(@/assets/svgs/newProduct/node_dotBg_gray.svg);
    }

    &.inprogress {
      background-image: url(@/assets/svgs/newProduct/node_dotBg_orange.svg);
    }

    &.pass {
      background-image: url(@/assets/svgs/newProduct/node_dotBg_green.svg);
    }

    &.fail {
      background-image: url(@/assets/svgs/newProduct/node_dotBg_red.svg);
    }

    .duration {
      margin: auto;
      margin-top: 17px;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-around;


      .num {
        font-size: 14px;
      }

      .timeType {
        font-size: 12px;
      }
    }
  }

  .nodeName {
    top: -25px;
    right: -15px;
    text-align: center;
    width: 100px;
    position: absolute;
    font-size: 14px;
    color: #333;
    font-weight: 600;
  }

  .nodeStatus {
    bottom: -45px;
    padding: 10px;
    display: inline-block;
    position: absolute;
    border-radius: 4px;
    text-align: center;
    font-size: 12px;
    color: #333;

    .time {
      display: inline-block;
      width: 100%;
      color: #666;
    }
  }
}
</style>