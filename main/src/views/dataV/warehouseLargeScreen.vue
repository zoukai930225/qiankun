<!-- 仓储大屏 毛天 2025年3月10日15:52:49 -->
<template>
  <div class="bg">
    <div class="bg-top-text">仓储大屏</div>
    <div class="bg-top">
      <div class="bg-top-one">
        <PickGoods />
      </div>
      <div class="bg-top-two">
        <InspectionList />
      </div>
      <div class="bg-top-three">
        <PackingList />
      </div>
    </div>
    <div class="bg-button">
      <div class="bg-button-one">
        <ReplenishmentList />
      </div>
      <div class="bg-button-two">
        <OrderStatusStatistics />
      </div>
      <div class="bg-button-three">
        <Purchases />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import InspectionList from './components/WarehouseLargeScreenBox/InspectionList.vue'
import OrderStatusStatistics from './components/WarehouseLargeScreenBox/OrderStatusStatistics.vue'
import PackingList from './components/WarehouseLargeScreenBox/PackingList.vue'
import PickGoods from './components/WarehouseLargeScreenBox/pickGoods.vue'
import Purchases from './components/WarehouseLargeScreenBox/purchases.vue'
import ReplenishmentList from './components/WarehouseLargeScreenBox/ReplenishmentList.vue'
</script>
<style lang="scss" scoped>
.bg {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url('@/assets/imgs/dataV/store_bg.png');
  background-size: 100% 100%;
}
.bg-top-text {
  height: 7.47vh;
  text-align: center;
  margin-top: 3.14vw;
  line-height: 7.47vh;
  font-family: AlibabaPuHuiTiB;
  font-size: 64px;
  font-style: normal;
  margin-bottom: 2.72vh;
  background: linear-gradient(90deg, #ffd7a4, #ffd7a4);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.bg-top {
  display: flex;
  .bg-top-one {
    width: 31.52vw;
    height: 40vh;
    background-color: #303030;
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 10px 10px 2px 2px;
    margin-left: 1.56vw;
  }
  .bg-top-two {
    width: 31.52vw;
    height: 40vh;
    background-color: #303030;
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 10px 10px 2px 2px;
    margin-left: 1.2vw;
  }
  .bg-top-three {
    width: 31.52vw;
    height: 40vh;
    background-color: #303030;
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 10px 10px 2px 2px;
    margin-left: 1.09vw;
  }
}

.bg-button {
  display: flex;
  margin-top: 1.78vh;
  .bg-button-one {
    width: 31.52vw;
    height: 40vh;
    background-color: #303030;
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 10px 10px 2px 2px;
    margin-left: 1.56vw;
  }
  .bg-button-two {
    width: 31.52vw;
    height: 40vh;
    // background-color: #303030;
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 10px 10px 2px 2px;
    margin-left: 1.2vw;
  }
  .bg-button-three {
    width: 31.52vw;
    height: 40vh;
    background-color: #303030;
    box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
    border-radius: 10px 10px 2px 2px;
    margin-left: 1.09vw;
  }
}
</style>
