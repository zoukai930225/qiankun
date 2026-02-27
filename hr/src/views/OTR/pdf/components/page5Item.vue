<template>
  <div class="page5ItemBg">
    <img class="page5ItemImg" src="@/assets/imgs/otr/pdf/page5_item_bg.png" />
    <div class="page5Item">
      <div class="title">{{ title }}</div>
      <div class="top-row">
        <div class="blue-bg"></div>
        <img class="blue-arrow" src="@/assets/imgs/otr/pdf/page4_arrow_blue.png" />
        <div class="blue-value">上级分歧度 23%</div>
      </div>

      <div class="center-row">
        <div class="red-value">同事分歧度 -11%</div>
        <img class="red-arrow" src="@/assets/imgs/otr/pdf/page4_arrow_red.png" />
        <div class="red-bg"></div>
      </div>

      <div class="bottom-row">
        <div class="blue-bg"></div>
        <img class="blue-arrow" src="@/assets/imgs/otr/pdf/page4_arrow_blue.png" />
        <div class="blue-value">下属分歧度 0%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineProps({
  title: propTypes.string.def('')
})
onMounted(() => {})
</script>

<style lang="scss" scoped>
.page5ItemBg {
  width: 282px;
  height: 232px;
  position: relative;

  .page5ItemImg {
    position: absolute;
    width: 282px;
    height: 232px;
  }
  .page5Item {
    position: absolute;
    width: 282px;
    height: 232px;
    .title {
      font-weight: 500;
      font-size: 12px;
      color: #004aff;
      margin-left: 19px;
      margin-top: 11px;
    }
    .top-row {
      height: 29px;
      width: 120px;
      margin-left: 141px;
      margin-top: 54px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .blue-bg {
        width: 72px;
        height: 26px;
        background: #004aff;
        border-radius: 13px;
      }
      .blue-arrow {
        width: 6px;
        height: 9px;
        margin-left: 3px;
        margin-right: 3px;
      }
      .blue-value {
        font-weight: 500;
        font-size: 8px;
        color: #232323;
        line-height: 10px;
      }
    }
    .center-row {
      height: 26px;
      width: 141px;
      margin-left: 0px;
      margin-top: 25px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .red-bg {
        width: 38px;
        height: 26px;
        background: #f30303;
        border-radius: 13px;
      }
      .red-arrow {
        width: 6px;
        height: 9px;
        margin-left: 2px;
        margin-right: 3px;
      }
      .red-value {
        margin-left: auto;
        font-weight: 500;
        font-size: 8px;
        color: #232323;
        line-height: 10px;
      }
    }
    .bottom-row {
      height: 29px;
      width: 120px;
      margin-left: 141px;
      margin-top: 28px;
      display: flex;
      flex-direction: row;
      align-items: center;
      .blue-bg {
        width: 1px;
        height: 31px;
        background: #004aff;
        border-radius: 1px;
      }
      .blue-arrow {
        width: 6px;
        height: 9px;
        margin-left: 3px;
        margin-right: 3px;
      }
      .blue-value {
        font-weight: 500;
        font-size: 8px;
        color: #232323;
        line-height: 10px;
      }
    }
  }
}
</style>
