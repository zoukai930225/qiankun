<template>
  <!--  :visible = "true" -->
  <el-popover :width="240" :offset="-4" :popper-style="popStyle" :disabled="getNodeData(params).status === 'init'">
    <template #reference>
      <slot></slot>
    </template>
    <div class="wrapper">
      <div :class="['status',getNodeData(params).status]">
        <!-- <img :src="getEndStatusIcon(params)" v-if="getEndStatusIcon(params)" /> -->
        {{ getNodeData(params).label }}
      </div>
      <div class="top">
        <div class="nodeName">{{ params.taskName }}</div>
        <commonUser :data="submitUserInfo()" v-if="submitUserInfo()?.userId" :showBgColor="true" />
      </div>
      <!-- 时间 -->
      <div class="nodeTime">
        <div class="dot">
          <img :src="startSvg" />
          <div class="line"></div>
          <img :src="endSvg" />
        </div>
        <div class="timeRight">
          <div class=" times mb30px">
            <span class="title">{{ "开始" }}</span>
            <div class="time start">
              <div class="real">
                <span class="label">{{ '实际' }}</span>
                <span class="value">{{ formatDateTime(params.startTime) }}</span>
              </div>
            </div>
          </div>
          <div class=" times">
            <span class="title">{{ "结束" }}</span>
            <div class="time end">
              <div class="real">
                <span class="label">{{ '实际' }}</span>
                <span class="value">{{ formatDateTime(params.actualEndTime) }}</span>
              </div>
              <div class="plan">
                <span class="label">{{ '计划' }}</span>
                <span class="value">{{ formatDateTime(params.planEndTime) }}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!-- 记录 -->
      <div class="records">
        <el-scrollbar max-height="178">
          <div class="record" >
            <commonUser :data="submitUserInfo()" v-if="submitUserInfo()?.userId" :showBgColor="true" />
            <div class="remark">{{ params.comment }}</div>
            <template v-if="params.tentativeOrderReason">
              <div class="reason">暂定下单原因</div>
              <div class="remark">{{ params.tentativeOrderReason }}</div>
            </template>
            <div class="fileList" v-if="attachFileUrls">
              <div class="fileLink" v-for="(file,index) in attachFileUrls" :key="index" @click="downloadAttachFile(file)">
                <img :src="linkSvg" />
                <span class="fileName text1">{{ file.fileName }}</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </el-popover>
</template>

<script lang="ts" setup>
import endSvg from '@/assets/imgs/oa/product/node/node_status_yellow.svg'
import startSvg from '@/assets/imgs/oa/product/node/node_status_blue.svg'
import linkSvg from '@/assets/svgs/newProduct/link.svg'
import commonUser from '@/views/OA/factory/components/commonUser.vue'
import { dotStatusMap, formatDateTime,getNodeData,getEndStatusIcon } from './nodeOptions'
import { splitImgOrFile,downloadAttachFile } from "@/views/OA/factory/hooks"

const props = defineProps({
  params: {
    type: Object as any,
    default: () => { }
  },
})

const submitUserInfo = () => {
  if (props.params.submitUserList) {
    return {
      ...props.params.submitUserList[0]
    }
  } else {
    return {
      name: "",
      userId: "",
      avatarOrigin: ""
    }
  }

}

const attachFileUrls = computed(()=>{
  return props.params?.attachmentUrl?splitImgOrFile(props.params?.attachmentUrl)?.fileUrlList : null
})

// 根据节点状态 获取 对应样式
const getNodeStyle = (node: any) => {
  return dotStatusMap[node.status]
}

const popStyle = {
  'border-radius': '10px',
  'box-shadow': '0px 0px 14px 2px rgba(0, 31, 72, 0.11)',
  padding: '0'
}
</script>

<style lang="scss" scoped>
.wrapper {
  width: 240px;
  border-radius: 10px;
  padding: 9px;
  box-sizing: border-box;
  position: relative;
  .status {
    position: absolute;
    top: 0;
    right: 0;
    background-repeat: no-repeat;
    width: 70px;
    height: 27px;
    text-align: center;
    line-height: 27px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    img{
      margin-left:6px
    }
    &.init, &.pause{
        color:#666;
        background-image: url(@/assets/svgs/newProduct/node_tooltip_gray.svg);
      }
      &.inprogress{
        color:#EA8100;
        background-image: url(@/assets/svgs/newProduct/node_tooltip_orange.svg);
      }
      &.pass{
        color:#05975B;
        background-image: url(@/assets/svgs/newProduct/node_tooltip_green.svg);
      }
      &.fail{
        color:#FF0000;
        background-image: url(@/assets/svgs/newProduct/node_tooltip_red.svg);
      }
  }
  .top {
    display: flex;
    align-items: center;
    .nodeName {
      font-size: 13px;
      font-weight: 600;
      color: #333;
      margin-right: 4px;
    }
  }
  .nodeTime {
    display: flex;
    align-items: center;
    height: 100%;
    .dot {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      img {
        display: inline-block;
      }
      .line {
        width: 1px;
        background: #D5DEE4;
        height: 60px;
      }
    }
    .timeRight {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      // height: 110px;
      .times {
        display: flex;
        align-items: center;
        font-size: 12px;
        .title {
          margin-left: 10px;
          margin-right: 7px;
          color: #333;
        }
        .time {
          padding: 6px 10px;
          border-radius: 4px;
          color: #666;
          // width: 132px;
          .plan {
            margin-top: 10px;
          }
          .label {
            margin-right: 6px;
          }
          &.start {
            background: #F2FCF8;
          }
          &.end {
            background: #FEF7EB;
          }
        }
      }
    }
  }
  .records {
    box-sizing: border-box;
    margin-top: 10px;
    width: 100%;
    min-height: 100px;
    max-height: 200px;
    border: 1px solid #E7ECF0;
    border-radius: 6px;
    padding: 10px;
    font-size: 12px;
    .record {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .remark {
        margin: 6px 0;
      }
      .reason {
        width: 100%;
        padding-top: 10px;
        border-top: 1px solid #E5E5E5;
        font-size: 12px;
        color: #333333;
        font-weight: 500;
      }
      .fileList {
        width: 100%;
        .fileLink {
          margin-bottom: 6px;
          padding: 5px;
          border-radius: 4px;
          background: #E9EEFA;
          display: flex;
          align-items: center;
          cursor: pointer;
          &:hover {
            .fileName {
              color: #0064ff;
            }
          }
          .fileName {
            margin-left: 5px;
          }
        }
      }
    }
  }
}
</style>