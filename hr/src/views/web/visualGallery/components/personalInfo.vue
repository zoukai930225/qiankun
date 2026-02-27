<template>
  <div class="personalInfo">
    <div class="row-center" v-if="list().length > 0"> <div class="title">人员</div> </div>

    <div class="infoBg" v-if="list().length > 0">
      <div class="item" v-for="(value, index) in list()" :key="index">
        <img class="item-icon" :src="value.icon" />
        <div class="item-value">{{ value.name }}</div>
        <div class="item-personBg">
          <div
            class="item-personBg-person"
            v-for="(value1, index1) in value.value"
            :key="index1"
            :style="{ background: value.background }"
            >{{ value1.name }}</div
          >
        </div>
      </div>
    </div>
    <div class="row-center">
      <img class="testTimeIcon" src="@/assets/imgs/visualGallery/icon_testTime.png" />
      <div class="testTimeLbl">测图时间</div>
      <div class="testTimeValue">{{ data.mappingTime || '' }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'

import personal_yyImg from '@/assets/imgs/visualGallery/personal_yy.png'
import personal_cfImg from '@/assets/imgs/visualGallery/personal_cf.png'
import personal_psImg from '@/assets/imgs/visualGallery/personal_ps.png'
import personal_hqImg from '@/assets/imgs/visualGallery/personal_hq.png'
import personal_sjImg from '@/assets/imgs/visualGallery/personal_sj.png'

const props = defineProps({
  data: propTypes.object.def({})
})

const list = () => {
  let arr = []
  if (props.data.operationPersonnels && props.data.operationPersonnels.length > 0) {
    arr.push({
      name: '运营',
      value: props.data.operationPersonnels || [],
      icon: personal_yyImg,
      background: '#C8C8CB'
    })
  }

  if (props.data.planningPersonnels && props.data.planningPersonnels.length > 0) {
    arr.push({
      name: '策划',
      value: props.data.planningPersonnels || [],
      icon: personal_cfImg,
      background: '#AFD1B5'
    })
  }

  if (props.data.cameraCrews && props.data.cameraCrews.length > 0) {
    arr.push({
      name: '拍摄',
      value: props.data.cameraCrews || [],
      icon: personal_psImg,
      background: '#FBEADA'
    })
  }

  if (props.data.latePersonnels && props.data.latePersonnels.length > 0) {
    arr.push({
      name: '后期',
      value: props.data.latePersonnels || [],
      icon: personal_hqImg,
      background: '#BFE9F2'
    })
  }

  if (props.data.designers && props.data.designers.length > 0) {
    arr.push({
      name: '设计',
      value: props.data.designers || [],
      icon: personal_sjImg,
      background: '#C5DBFE'
    })
  }
  return arr
}
</script>

<style lang="scss" scoped>
.personalInfo {
  margin-top: 17px;
  margin-left: 25px;
  margin-right: 15px;
  margin-bottom: 13px;

  .title {
    font-weight: 500;
    font-size: 12px;
    color: #acc1ff;
    line-height: 17px;
  }
  &-icon {
    margin-left: 7px;
    width: 4px;
    height: 9px;
  }
  .infoBg {
    margin-top: 13px;
    margin-bottom: 17px;
    background: #1a1c26;
    border-radius: 5px;
    padding: 8px 0px 9px 25px;
    .item {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-height: 42px;
      width: calc(100%);
      &-icon {
        width: 12px;
        height: 12px;
      }
      &-value {
        padding-left: 11px;
        margin-right: auto;
        font-size: 12px;
        color: #dadada;
        line-height: 17px;
        // width: 30px;
      }
      &-personBg {
        margin-left: 44px;
        margin-right: 15px;
        display: flex;
        flex-wrap: wrap;
        width: calc(100% - 110px);
        &-person {
          height: 24px;
          width: 66px;
          border-radius: 3px;
          font-weight: 500;
          font-size: 10px;
          color: #333333;
          line-height: 24px;
          text-align: center;
          margin-right: 6px;
          margin-bottom: 6px;
          // margin-top: 6px;
        }
      }
    }
    .item1 {
      width: 84px;
    }
    .item2 {
      width: 81px;
    }
    .item3 {
      width: 48px;
    }
  }
  .testTimeIcon {
    width: 10px;
    height: 9px;
  }
  .testTimeLbl {
    padding-left: 7px;
    padding-right: 17px;
    font-size: 12px;
    color: #ddcc55;
    line-height: 17px;
  }
  .testTimeValue {
    font-weight: 500;
    font-size: 12px;
    color: #ffffff;
    line-height: 17px;
  }
}
</style>
