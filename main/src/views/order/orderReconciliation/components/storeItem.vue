<!--
 * @Date: 2025-02-18 15:02:09
-->
<template>
  <div class="stop-wapper flex-row" @click="handleClick">
    <div :class="{ activity: selectedStore.includes(storeItem.store) }"></div>
    <div class="item-left">
      <div class="title">{{ storeItem?.storeName }}</div>
      <div class="item item1">
        <span class="item-title">差额</span>
        <span class="item-value">{{ storeItem?.difference }}</span>
        <img src="@/assets/imgs/order/deng.png" class="icon deng" />
      </div>
      <div class="item">
        <span class="item-title">账单(聚合)</span>
        <span class="item-value">{{ storeItem?.wechatActualPayment }}</span>
        <img src="@/assets/imgs/order/add.png" class="icon add" />
      </div>
      <div class="item">
        <span class="item-title">账单(支付宝)</span>
        <span class="item-value">{{ storeItem?.alipayActualPayment }}</span>
        <img src="@/assets/imgs/order/jian.png" class="icon jian" />
      </div>
      <div class="item">
        <span class="item-title">订单</span>
        <span class="item-value">{{ storeItem?.remittanceAmount }}</span>
      </div>
    </div>
    <div class="item-right"> <BarChartInfo :item="storeItem" ref="barChartInfo" /></div>
  </div>
</template>
<script lang="ts" setup>
import BarChartInfo from './barChartInfo.vue'
interface StoreItem {
  store: string
  difference: string
  alipayActualPayment: string
  wechatActualPayment: string
  remittanceAmount: string
  storeName: string
}

const props = defineProps<{
  storeItem: StoreItem
  selectedStore: String[]
}>()

const emit = defineEmits(['itemClick'])

const handleClick = () => {
  emit('itemClick', props.storeItem.store)
}

const barChartInfo = ref()
watch(
  () => props.storeItem,
  (val) => {
    console.log('valhahaah', val)
    // storeItem.store
    if (val) {
      if (barChartInfo.value) {
        barChartInfo.value.initChart()
      }
    }
  },
  { deep: true, immediate: true }
)
</script>

<style lang="scss" scoped>
.stop-wapper {
  width: 100%;
  height: 332px;
  background: #f8fbff;
  position: relative;
  cursor: pointer;

  .activity {
    width: 100%;
    height: 6px;
    background: #3270ff;
    border-radius: 5px;
    position: absolute;
    left: 0;
    top: 0;
  }

  .title {
    font-weight: 500;
    font-size: 16px;
    color: #333333;
    text-align: left;
    font-style: normal;
    padding: 20px 0 15px 20px;
    box-sizing: border-box;
  }

  .item-left {
    width: 45%;
    padding-left: 20px;
    box-sizing: border-box;
    .item {
      width: 293px;
      height: 50px;
      line-height: 50px;
      background: #ffffff;
      border-radius: 4px;
      margin-bottom: 12px;
      position: relative;
      .icon {
        width: 30px;
        height: 30px;
        position: absolute;
        left: 45%;
        bottom: -20px;
        z-index: 999 !important;
      }
      .deng {
      }
      .add {
      }
      .jian {
      }
      .item-title {
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        text-align: left;
        font-style: normal;
        padding-left: 40px;
        box-sizing: border-box;
        width: 140px;
        display: inline-block;
      }
      .item-value {
        font-weight: 500;
        font-size: 16px;
        color: #333333;
        text-align: left;
        font-style: normal;
      }
    }
    .item1 {
      background: linear-gradient(180deg, #e6edff 0%, #ffffff 100%);
    }
  }
  .item-right {
    width: 55%;
    height: 100%;
  }
}
</style>
