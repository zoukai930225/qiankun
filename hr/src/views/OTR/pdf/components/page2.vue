<template>
  <div class="PdfPage2">
    <div class="row">
      <img class="topIcon" src="@/assets/imgs/otr/pdf/page2_top.png" />
      <div class="column">
        <div class="descTitle">素质项介绍</div>
        <div class="descSubTitle">INTRODUCTION TO QUAL</div>
        <div class="otherTitle">对您的评价围绕以下各素质项展开</div>
        <div class="allTitle"></div>

        <div v-if="data.tms">
          <div v-for="(value, index) in data.tms" :key="index">
            <div
              v-if="value && value.programName"
              class="item"
              :class="{ item1: data.tms && data.tms.length >= 8 }"
            >
              <div class="item-left" :class="{ 'item-left1': data.tms && data.tms.length >= 8 }">{{
                value.programName
              }}</div>
              <div class="item-right">{{ value.definition }}</div>
            </div>
          </div></div
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineProps({
  data: propTypes.object.def({})
})
</script>

<style lang="scss" scoped>
.PdfPage2 {
  background-image: url('@/assets/imgs/otr/pdf/page2_bg.png');
  width: 595px;
  height: 842px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  background: #e9f2fb;

  .row {
    display: flex;
    flex-direction: row;
    .topIcon {
      margin-top: 32px;
      margin-left: 14px;
      width: 23px;
      height: 27px;
    }
    .column {
      margin-left: 13px;
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      .descTitle {
        font-weight: 500;
        font-size: 30px;
        color: #232323;
      }
      .descSubTitle {
        font-weight: 400;
        font-size: 12px;
        color: #666666;
        line-height: 18px;
      }
      .otherTitle {
        margin-top: 24px;
        font-weight: 400;
        font-size: 17px;
        color: #232323;
      }
      .allTitle {
        padding-top: 24px;
        // font-weight: bold;
        // font-size: 17px;
        // color: #232323;
        // margin-bottom: 24px;
      }
      .item {
        display: flex;
        flex-direction: row;
        margin-bottom: 24px;
        width: 519px;
        height: 68px;
        background: #ffffff;
        border-radius: 12px 10px 10px 0px;
        &-left {
          width: 92px;
          height: 68px;
          background: linear-gradient(124deg, #2946ed 0%, #408dfd 100%);
          border-radius: 12px 0px 12px 0px;
          font-weight: 500;
          font-size: 15px;
          color: #ffffff;
          line-height: 68px;
          text-align: center;
        }
        &-left1 {
          height: 62px;
        }
        &-right {
          width: calc(100% - 92px);
          height: 68px;
          font-weight: 400;
          font-size: 13px;
          color: #232323;
          line-height: 18px;
          padding-left: 11px;
          padding-right: 8px;
          padding-top: 4px;
          padding-bottom: 4px;
        }
      }

      .item1 {
        height: 62px;
        margin-bottom: 14px;
      }
    }
  }
}
</style>
