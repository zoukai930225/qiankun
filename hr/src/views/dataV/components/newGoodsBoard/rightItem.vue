<template>
  <div class="rightItem">
    <div class="top">
      <img class="top-left" src="@/assets/imgs/dataV/newGoodsBoard/arrow_left.png" />
      <div class="top-title">最新数据</div>
      <img class="top-right" src="@/assets/imgs/dataV/newGoodsBoard/arrow_right.png" />
    </div>
    <div class="valueRow">
      <div class="valueRow-item" :style="{ width: data.supplyInfo ? '70px' : '96px' }">
        <div class="row">
          <div class="row-left">
            <img
              class="row-left-icon"
              src="@/assets/imgs/dataV/newGoodsBoard/goods_saleCount.png"
            />
            <div class="row-left-label">销量</div>
          </div>
          <div class="row-value text1">{{ data.salesVolume || '--' }}</div>
        </div>
      </div>

      <div class="valueRow-item" :style="{ width: data.supplyInfo ? '125px' : '85px' }">
        <div class="row">
          <div class="row-left">
            <img
              class="row-left-icon"
              src="@/assets/imgs/dataV/newGoodsBoard/goods_click_rate.png"
            />
            <div class="row-left-label"
              >{{ data.supplyInfo ? `(${data.supplyInfo})` : '' }}点击率</div
            >
          </div>
          <div class="row-value text1">{{ data.clickRate || '--' }}</div>
        </div>
      </div>

      <div class="valueRow-item" style="width: 85px">
        <div class="row">
          <div class="row-left">
            <img
              class="row-left-icon"
              src="@/assets/imgs/dataV/newGoodsBoard/goods_tran_rate.png"
            />
            <div class="row-left-label">转化率</div>
          </div>
          <div class="row-value text1">{{ data.conversionRate || '--' }}</div>
        </div>
      </div>
      <div class="valueRow-item" style="width: 109px">
        <div class="row">
          <div class="row-left">
            <img
              class="row-left-icon"
              src="@/assets/imgs/dataV/newGoodsBoard/goods_search_count.png"
            />
            <div class="row-left-label">自然搜索量</div>
          </div>
          <div class="row-value text1">{{ data.naturalSearchVolume || '--' }}</div>
        </div>
      </div>
      <div class="valueRow-item" style="width: 86px">
        <div class="row">
          <div class="row-left">
            <img
              class="row-left-icon"
              src="@/assets/imgs/dataV/newGoodsBoard/goods_tran_rate.png"
            />
            <div class="row-left-label">退款率</div>
          </div>
          <div class="row-value text1">{{ data.refundRate || '--' }}</div>
        </div>
      </div>
      <div class="valueRow-item" style="width: 101px">
        <div class="row">
          <div class="row-left">
            <img
              class="row-left-icon"
              src="@/assets/imgs/dataV/newGoodsBoard/goods_refund_rate.png"
            />
            <div class="row-left-label">销售金额</div>
          </div>
          <div class="row-value text1">{{ data.salesAmount || '--' }}</div>
        </div>
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
.rightItem {
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 10px;
  width: 573px;
  height: 101px;
  background: #f1f4f0;
  border-radius: 7px;
  border: 1px solid #b7c9ba;
  display: flex;
  flex-direction: column;
  .top {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &-left {
      margin-left: auto;
      width: 17px;
      height: 12px;
    }
    &-title {
      font-weight: bold;
      font-size: 16px;
      color: #246b60;
      line-height: 24px;
      padding-left: 10px;
      padding-right: 10px;
    }
    &-right {
      margin-right: auto;
      width: 17px;
      height: 12px;
    }
  }
  .valueRow {
    margin-top: 11px;
    margin-bottom: 9px;
    display: flex;
    flex-direction: row;
    margin-left: 10px;
    width: calc(100% - 10px);
    &-item {
      display: flex;
      flex-direction: column;
      .row {
        display: flex;
        flex-direction: column;
        margin-bottom: 7px;
        width: calc(100%);
        &-left {
          display: flex;
          flex-direction: row;
          align-items: center;
          &-icon {
            width: 15px;
            height: 15px;
            margin-right: 7px;
          }
          &-label {
            font-size: 15px;
            color: #666666;
            line-height: 21px;
          }
        }
        &-value {
          padding-top: 4px;
          padding-left: 22px;
          font-weight: 600;
          font-size: 19px;
          color: #333333;
          line-height: 27px;
          width: calc(100% - 4px);
        }
      }
    }
  }
}
</style>
