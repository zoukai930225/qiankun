<template>
  <div class="nodeItem" @click="clickNode">
    <div class="nodeItem-info" style="display: flex; flex-direction: column">
      <div class="detail">
        <div class="label">编码</div>
        <div class="value">{{ data?.productCode }}</div>
        <div class="time">
          <img src="@/assets/svgs/clock.svg" />
          <div>{{ getNodeWaitTime(data.waitTime) }}{{ getNodeWaitTimeUnit(data.waitTime) }}</div>
        </div>
      </div>
      <div class="detail">
        <div class="label">品类</div>
        <div class="value text1">
          <el-tooltip
          :popper-style="{maxWidth:'200px'}"
            effect="dark"
            :content="data?.categoryName"
            placement="bottom"
            :disabled="!data.categoryName"
          >
            {{ data?.categoryName  || '-'}}
          </el-tooltip>
        </div>
        <NodePerson :data="data" />
      </div>
      <div class="detail">
        <div class="label">系列</div>
        <div class="value text1">
          <el-tooltip
          :popper-style="{maxWidth:'200px'}"
            effect="dark"
            :content="data?.series"
            placement="bottom"
            :disabled="!data.series"
          >
            {{ data?.series || '-'}}
          </el-tooltip>
        </div>
      </div>
      <div class="detail">
        <div class="label">二开原因</div>
        <div class="value text1">
          <el-tooltip
          :popper-style="{maxWidth:'200px'}"
            effect="dark"
            :content="data?.secondaryDevReason"
            placement="bottom"
            :disabled="!data.secondaryDevReason"
          >
            {{ data?.secondaryDevReason || '-'}}
          </el-tooltip>
        </div>
      </div>
      <div class="reason">
        <el-tooltip
            :popper-style="{maxWidth:'200px'}"
            effect="dark"
            :content="data?.remark"
            placement="bottom"
            :disabled="!data.remark"
          >
            {{ data?.remark || '-' }}
          </el-tooltip>
      </div>
    </div>
    
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import {
  getNodeWaitTime,
  getNodeWaitTimeUnit,
} from '@/views/OA/new/product/utils.js'

import NodePerson from './nodePerson.vue'


const props = defineProps({
  nodeCode: propTypes.string.def(''),
  data: propTypes.object.def({})
})

const clickNode = () => {
  emit('clickNode', props.nodeCode, props.data)
}
const emit = defineEmits(['clickNode'])
</script>
<style lang="scss" scoped>
.nodeItem {
  margin: auto;
  margin-bottom: 10px;
  width: 283px;
  height: 185px;
  border-radius: 4px;
  background: #f4f7fe;
  box-sizing: border-box;
  border: 1px solid #cfdcfd;
  cursor: pointer;
  overflow-x: hidden;
  position: relative;
  padding:10px 14px;
  &-info{
    width: 100%;
    .detail{
      margin-bottom: 10px;
      font-size: 12px;
      display: flex;
      align-items: center;
      line-height: 1.2;
      .label{
        color: #666;
        margin-right: 6px;
      }
      .value{
         flex:1;
        color: #333;
      }
      .time{
        display: flex;
        align-items: center;
        img{
          width: 11px;
          height: 11px;
          margin-right: 6px;
        }
        div{
          font-weight: 600;
        }
      }
    }
    .reason{
      color: #333;
      font-size: 12px;
      height: 52px;
      line-height: 1.1;
      border-radius: 4px;
      padding: 4px;
      background: #FFF;
      word-wrap: break-word;
      white-space: normal;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden; //溢出内容隐藏
      text-overflow: ellipsis; //文本溢出部分用省略号表示
      display: -webkit-box; //特别显示模式
      -webkit-line-clamp: 4; //行数
      line-clamp: 4;
      -webkit-box-orient: vertical; //盒子中内容竖直排列
    }
  }

}
</style>
