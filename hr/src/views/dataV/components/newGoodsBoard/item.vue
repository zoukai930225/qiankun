<template>
  <div class="newGoodsBoardBg">
    <div class="topBg">
      <div class="topBg-title text1">{{ data.goodsName }}</div>
    </div>
    <div class="goodsInfo">
      <LeftItem :data="data" />
      <RightItem :data="data" />
    </div>
    <GoodChart
      ref="naturalSearchVolumeRef"
      class="goodChart"
      title="自然搜索量"
      :list="data.naturalSearchVolumeList"
    />
    <GoodChart ref="saleCountRef" class="goodChart" title="销量" :list="data.salesVolumeList" />
    <GoodChart
      ref="saleAmountRef"
      class="goodChart"
      title="销售金额"
      :list="data.salesAmountList"
    />

    <GoodChart
      ref="paymentProportionRef"
      class="goodChart"
      title="付费占比(去退)"
      :list="data.paymentProportionList"
      :is-percent="true"
    />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import LeftItem from './leftItem.vue'
import RightItem from './rightItem.vue'
import GoodChart from './chart.vue'

const props = defineProps({
  data: propTypes.object.def({})
})

const saleCountRef = ref()
const saleAmountRef = ref()
const naturalSearchVolumeRef = ref()
const paymentProportionRef = ref()

const updateChartData = () => {
  saleCountRef.value?.updateLineOptions()
  saleAmountRef.value?.updateLineOptions()
  naturalSearchVolumeRef.value?.updateLineOptions()
  paymentProportionRef.value?.updateLineOptions()
}

// onMounted(() => {
//   updateChartData()
// })
defineExpose({
  updateChartData
})
</script>

<style lang="scss" scoped>
.newGoodsBoardBg {
  width: 594px;
  height: 1017px;
  background: #fbfcfb;
  border-radius: 10px;
  .topBg {
    background-image: url('@/assets/imgs/dataV/newGoodsBoard/item_top_bg.png');
    background-size: 100% 100%;
    width: 607px;
    height: 79px;
    margin-top: 23px;
    margin-left: -19px;
    display: flex;
    flex-direction: row;
    &-title {
      font-weight: bold;
      font-size: 20px;
      color: #ffffff;
      line-height: 30px;
      padding-left: 14px;
      padding-top: 18px;
      width: calc(100% - 28px);
    }
  }
  .goodsInfo {
    margin-top: -8px;
    height: 276px;
    width: calc(100%);
    display: flex;
    flex-direction: column;
  }
  .goodChart {
    margin-top: 10px;
    width: 573px;
    height: 148px;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #9ac08e;
  }
}
</style>
