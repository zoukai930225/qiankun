<template>
  <div class="clickRateInfo">
    <div class="infoBg">
      <div
        class="item"
        v-for="(value, index) in list()"
        :key="index"
        :class="{
          item1: index % 2 === 0,
          item2: index % 2 === 1
        }"
      >
        <div class="item-bg">
          <div class="row-center" style="margin-top: 6px">
            <img class="icon" :src="value.icon" />
            <div class="item-bg-title">{{ value.name }}</div>
            <img class="item-bg-arrow" src="@/assets/imgs/visualGallery/rate_arrow.png" />
          </div>
          <div class="item-bg-value" :style="{ color: value.valueColor }">{{ value.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'

import rate_clickImg from '@/assets/imgs/visualGallery/rate_click.png'
import rate_click15Img from '@/assets/imgs/visualGallery/rate_click15.png'
import rate_zhImg from '@/assets/imgs/visualGallery/rate_zh.png'
import rate_zh15Img from '@/assets/imgs/visualGallery/rate_zh15.png'

const props = defineProps({
  data: propTypes.object.def({})
})

const list = () => {
  return [
    {
      name: '7天付费点击率',
      value: props.data.clickRateSeven || '--',
      valueColor: '#D2E2FF',
      icon: rate_clickImg
    },
    {
      name: '7天付费转换率',
      value: props.data.clickConversionRateSeven || '--',
      valueColor: '#D2E2FF',
      icon: rate_zhImg
    },
    {
      name: '15天点击率',
      value: props.data.clickRateFifteen || '--',
      valueColor: '#FFB092',
      icon: rate_click15Img
    },
    {
      name: '15天转换率',
      value: props.data.clickConversionRateFifteen || '--',
      valueColor: '#FFB092',
      icon: rate_zh15Img
    }
  ]
}
</script>

<style lang="scss" scoped>
.clickRateInfo {
  margin-left: 25px;
  margin-right: 25px;

  .infoBg {
    margin-top: 12px;

    display: flex;
    flex-wrap: wrap;
    .item {
      width: 148px;
      height: 62px;
      display: flex;
      flex-direction: column;
      margin-bottom: 12px;
      margin-right: 19px;

      &-bg {
        width: 148px;
        height: 62px;
        background: #1a1c26;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        .icon {
          width: 20px;
          height: 19px;
          margin-left: 17px;
          margin-right: 10px;
        }
        &-title {
          font-size: 12px;
          color: #dadada;
          line-height: 17px;
          padding-right: 8px;
        }
        &-arrow {
          width: 5px;
          height: 7px;
        }

        &-value {
          padding-top: 6px;
          font-weight: bold;
          font-size: 18px;
          color: #d2e2ff;
          line-height: 24px;
          text-align: center;
        }
      }
    }
    .item2 {
      margin-right: 0px;
    }
  }
}
</style>
