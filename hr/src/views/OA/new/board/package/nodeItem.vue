<template>
  <div class="nodeItem" @click="clickNode">
    <div class="nodeItem-right">
      <div class="nodeItem-right-left">
        <preview-image v-if="data.designPictureUrl" :url="data.designPictureUrl" class="nodeItem-right-left-cover" />
        <!-- <img v-if="data.designPictureUrl" class="nodeItem-right-left-cover" :src="data.designPictureUrl" /> -->
        <div v-else class="nodeItem-right-left-noCover">
          <img class="nodeItem-right-left-noCover-cover" src="@/assets/imgs/oa/board/empty_cover.png" />
          <div class="nodeItem-right-left-noCover-empty">暂无图片</div>
        </div>
        <div class="nodeItem-right-left-planType" :style="{
          background: getPlanTypeColors(data.planType)[0],
          color: getPlanTypeColors(data.planType)[1]
        }">
          {{ getDictLabel(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, Number(data.planType || '')) }}</div>
        <PlanInfo v-if="getPersonalInfo().avatarOrigin || getPersonalInfo().name" :data="data" />
      </div>
      <div class="nodeItem-right-right">
        <div class="nodeItem-right-right-top">
          <img v-if="getImageUrl(data.channelCode || '')" style="width: 14px; height: 14px; margin-right: 6px"
            :src="getImageUrl(data.channelCode || '')" />
          <div class="text1" style="font-size: 12px; font-weight: bold; color: #333333"
            :style="{ maxWidth: getImageUrl(data.channelCode || '') ? '100px' : '120px' }">{{ data.planName }}</div>
          <img style="width: 9px; height: 9px; margin-left: auto; margin-right: 2px"
            src="@/assets/imgs/oa/board/time.png" />
          <div class="text1" style="font-size: 10px; font-weight: 500; padding-left: 4px; padding-right: 4px"
            :style="{ color: timeColor(getNodeWaitTimeUnit(data.waitTime)) }">{{ getNodeWaitTime(data.waitTime) }}{{
              getNodeWaitTimeUnit(data.waitTime) }}</div>
        </div>

        <div class="nodeItem-right-right-center" style="display: flex; flex-direction: column">
          <div class="row-center" style="height: 19px">
            <div class="nodePinleiTitle">品类</div>
            <div style="width: calc(100% - 36px)" class="row-center">
              <div class="nodePinleiValue text1">包装</div>
              <NodePerson style="margin-left: auto; margin-right: 10px" :data="data" />
            </div>
          </div>
          <div class="row-center" style="margin-top: 7px">
            <div class="nodePinleiTitle">系列</div>
            <div class="seriesValue">{{ data.series || '--' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PreviewImage from "@/components/common/image/preview.vue";
import { getImageUrl } from '@/utils'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { propTypes } from '@/utils/propTypes'

import {
  getNodeWaitTime,
  getNodeWaitTimeUnit,
  handleJSONParse
} from '@/views/OA/new/product/utils.js'

import NodePerson from './nodePerson.vue'
import PlanInfo from './planInfo.vue'

const props = defineProps({
  nodeCode: propTypes.string.def(''),
  data: propTypes.object.def({})
})
const timeColor = (unit) => {
  return '#333333'
}

const getPlanTypeColors = (planType) => {
  if (Number(planType || '') === 0) {
    return ['#defbff', '#01bed4']
  } else if (Number(planType || '') === 1) {
    return ['#fdeff7', '#f35caa']
  } else if (Number(planType || '') === 2) {
    return ['#defbff', '#01bed4']
  } else if (Number(planType || '') === 3) {
    return ['#fdeff7', '#f35caa']
  }
  return ['#defbff', '#01bed4']
}

const getPersonalInfo = () => {
  let personalInfo = {
    avatarOrigin: '',
    name: ''
  }
  if (props.data.businessEnterpriseCreateList) {
    let businessEnterpriseCreateList = handleJSONParse(props.data.businessEnterpriseCreateList)
    if (businessEnterpriseCreateList && businessEnterpriseCreateList.length > 0) {
      personalInfo.avatarOrigin = businessEnterpriseCreateList[0].userAvatarOrigin || ''
      personalInfo.name = businessEnterpriseCreateList[0].userName || ''
      if (businessEnterpriseCreateList.length > 1) {
        personalInfo.name = `${personalInfo.name}`
      }
    }
  }
  return personalInfo
}

const clickNode = () => {
  emit('clickNode', props.nodeCode, props.data)
}
const emit = defineEmits(['clickNode'])
</script>
<style lang="scss" scoped>
.nodeItem {
  margin-bottom: 10px;
  margin-left: 10px;
  width: 283px;
  height: 148px;
  display: flex;
  flex-direction: row;
  border-radius: 4px;
  background: #f4f7fe;
  box-sizing: border-box;
  border: 1px solid #cfdcfd;
  cursor: pointer;
  overflow-x: hidden;
  position: relative;

  &-right {
    display: flex;
    flex-direction: row;
    width: calc(283px - 0px);

    &-left {
      margin-left: 6px;
      margin-right: 8px;
      margin-top: 15px;
      width: 87px;
      position: relative;

      &-cover {
        margin-top: 3px;
        width: 87px;
        height: 87px;
        border-radius: 4px;
        background: #ebebeb;
        margin-bottom: 3px;
        object-fit: cover;
        // object-fit: contain;

        display: flex;
        flex-direction: column;
        align-items: center;
      }

      &-noCover {
        margin-top: 3px;
        width: 87px;
        height: 87px;
        border-radius: 4px;
        margin-bottom: 3px;
        background: #ebebeb;
        display: flex;

        flex-direction: column;
        align-items: center;

        &-cover {
          margin-top: 15px;
          width: 58px;
          height: 37px;
        }

        &-empty {
          padding-top: 3px;
          font-size: 10px;
          color: #999999;
          line-height: 14px;
        }
      }

      &-planType {
        position: absolute;
        top: -15px;
        left: -6px;
        width: 28px;
        height: 15px;
        border-radius: 0px 4px 0px 4px;
        background: #defbff;
        box-sizing: border-box;
        font-size: 10px;
        color: #01bed4;
        line-height: 15px;
        z-index: 9;
        text-align: center;
      }

      &-planType1 {
        position: absolute;
        top: -15px;
        left: -6px;
        width: 28px;
        height: 15px;
        border-radius: 0px 4px 0px 4px;
        background: #defbff;
        box-sizing: border-box;
        font-size: 10px;
        color: #01bed4;
        line-height: 15px;
        z-index: 9;
        text-align: center;
      }

      &-planType2 {
        position: absolute;
        top: -15px;
        left: -6px;
        width: 27px;
        height: 15px;
        border-radius: 0px 4px 0px 4px;
        background: #fdeff7;
        box-sizing: border-box;
        font-size: 10px;
        color: #f35caa;
        line-height: 15px;
        text-align: center;
      }
    }

    &-right {
      display: flex;
      flex-direction: column;

      &-top {
        margin-top: 18px;
        display: flex;
        flex-direction: row;
        width: calc(283px - 26px - 78px);
        align-items: center;
      }

      &-center {
        display: flex;
        flex-direction: row;
        width: calc(283px - 22px - 76px);
        // align-items: center;
        margin-top: 7px;
      }
    }
  }

  .nodePinleiTitle {
    font-size: 12px;
    color: #666666;
    padding-right: 7px;
  }

  .nodePinleiValue {
    font-size: 12px;
    color: #333333;
  }

  .seriesValue {
    width: calc(100% - 36px);
    font-size: 12px;
    color: #333333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nodePersonalBg {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 20px;
    border-radius: 4px;
    background: #e6ecff;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.18);
    margin-right: 18px;

    &-avatar {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-left: 6px;
      margin-right: 4px;
    }

    &-name {
      font-size: 11px;
      color: #333333;
      line-height: 16px;
      padding-right: 6px;
    }
  }

  .nodeTask {
    margin-top: 7px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 10px;
    color: #666666;

    &-value {
      padding-left: 5px;
      margin-right: 16px;
      font-size: 11px;
      font-weight: normal;
      line-height: 16px;
      color: #333333;
      max-width: 135px;
    }
  }

  .nodeProduct {
    margin-top: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 10px;
    color: #666666;

    &-value {
      padding-left: 5px;
      margin-right: 2px;
      font-size: 11px;
      font-weight: normal;
      line-height: 16px;
      color: #333333;
      max-width: 152px;
    }
  }

  .produceSalePoint {
    margin-top: 8px;
    width: 174px;
    height: 51px;
    max-height: 51px;
    /* 自动布局 */
    display: flex;
    justify-content: space-between;
    padding: 4px 4px;

    border-radius: 4px;
    background: #ffffff;
    box-sizing: border-box;
    /* 应用/边框 */
    // border: 1px solid #e5e5e5;

    font-family: PingFang SC;
    font-size: 10px;
    line-height: 15px;

    /* 文字/一级 */
    color: #333333;

    white-space: normal;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden; //溢出内容隐藏
    text-overflow: ellipsis; //文本溢出部分用省略号表示
    display: -webkit-box; //特别显示模式
    -webkit-line-clamp: 3; //行数
    line-clamp: 3;
    -webkit-box-orient: vertical; //盒子中内容竖直排列
  }
}
</style>
