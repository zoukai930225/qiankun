<template>
  <div class="leftItem">
    <div class="top">
      <img class="top-left" src="@/assets/imgs/dataV/newGoodsBoard/arrow_left.png" />
      <div class="top-title">基础信息</div>
      <img class="top-right" src="@/assets/imgs/dataV/newGoodsBoard/arrow_right.png" />
    </div>

    <div class="row">
      <img class="goodsImg" :src="data.goodsImage" />
      <div class="right">
        <div class="right-item" style="width: 163px">
          <div class="right-item-row">
            <img
              class="right-item-row-icon"
              src="@/assets/imgs/dataV/newGoodsBoard/goods_store.png"
            />
            <div class="right-item-row-label">店铺</div>
          </div>
          <div class="right-item-store">
            <img class="right-item-store-icon" :src="getStoreIcon(data.store)" />
            <div class="right-item-store-name text1"> {{ data.storeName || '--' }}</div>
          </div>
        </div>

        <div class="right-item" style="width: 163px">
          <div class="right-item-row">
            <img
              class="right-item-row-icon"
              src="@/assets/imgs/dataV/newGoodsBoard/goods_code.png"
            />
            <div class="right-item-row-label">产品编码</div>
          </div>
          <div class="right-item-value text1">
            {{ data.goodsCode || '--' }}
          </div>
        </div>

        <div class="right-item" style="width: 100px">
          <div class="right-item-row">
            <img
              class="right-item-row-icon"
              src="@/assets/imgs/dataV/newGoodsBoard/goods_category.png"
            />
            <div class="right-item-row-label">类目</div>
          </div>
          <div class="right-item-value text1">
            {{ data.category || '--' }}
          </div>
        </div>

        <div class="right-item" style="width: 163px">
          <div class="right-item-row">
            <img
              class="right-item-row-icon"
              src="@/assets/imgs/dataV/newGoodsBoard/goods_online_time.png"
            />
            <div class="right-item-row-label">上架时间</div>
          </div>
          <div class="right-item-value text1">
            {{ data.shelfTime || '--' }}
          </div>
        </div>

        <div class="right-item" style="width: 163px">
          <div class="right-item-row">
            <img class="right-item-row-icon" src="@/assets/imgs/dataV/newGoodsBoard/goods_id.png" />
            <div class="right-item-row-label">商品ID</div>
          </div>
          <div class="right-item-value text1">
            {{ data.goodsId || '--' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getStoreIcon } from '@/utils/index'

import { propTypes } from '@/utils/propTypes'

defineProps({
  data: propTypes.object.def({})
})
</script>

<style lang="scss" scoped>
.leftItem {
  margin-left: 10px;
  margin-right: 10px;
  width: 573px;
  height: 163px;
  background: #f1f4f0;
  border-radius: 7px;
  border: 1px solid #b7c9ba;
  .bottomBg {
    position: absolute;
    bottom: 0px;
    left: 0px;
    width: 242px;
    height: 123px;
  }
  .top {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 16px;
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
  .goodsId {
    position: absolute;
    top: 34px;
    left: 7px;
    margin-left: 0px;
    font-weight: 500;
    font-size: 16px;
    color: #333333;
    line-height: 20px;
    margin-top: 6px;
    width: 120px;
  }
  .goodsImg {
    width: 118px;
    height: 114px;
    border-radius: 7px;
    margin-left: 10px;
    margin-right: 15px;
  }
  .row {
    margin-top: 12px;
    display: flex;
    flex-direction: row;
    &-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: calc(100%);
      &-icon {
        width: 16px;
        height: 15px;
        margin-right: 10px;
      }
      &-label {
        font-size: 15px;
        color: #666666;
        line-height: 21px;
      }
    }
    &-value {
      margin-left: 0px;
      font-weight: 500;
      font-size: 18px;
      color: #333333;
      line-height: 24px;
      margin-top: 6px;
      width: 125px;
    }
  }
  .right {
    display: flex;
    flex-wrap: wrap;
    width: calc(100% - 143px - 4px);
    &-item {
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      &-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        margin-bottom: 9px;
        &-icon {
          width: 15px;
          height: 15px;
          margin-right: 10px;
        }
        &-label {
          font-size: 15px;
          color: #666666;
          line-height: 21px;
        }
      }
      &-value {
        font-weight: 500;
        font-size: 15px;
        color: #333333;
        line-height: 21px;
        margin-left: 25px;
        width: calc(100% - 25px - 2px);
      }
      &-store {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: calc(100% - 25px - 6px);
        margin-left: 25px;

        &-icon {
          width: 17px;
          height: 17px;
          margin-right: 4px;
        }
        &-name {
          font-weight: 500;
          font-size: 15px;
          color: #333333;
          line-height: 21px;
          width: calc(100% - 21px);
        }
      }
    }
    .row {
      display: flex;
      flex-direction: column;
      // align-items: center;
      margin-top: 6px;
      margin-bottom: 4px;
      &-left {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: calc(100%);
        &-icon {
          width: 16px;
          height: 15px;
          margin-right: 10px;
        }
        &-label {
          font-size: 15px;
          color: #666666;
          line-height: 21px;
        }
      }
      &-value {
        padding-top: 4px;
        margin-left: 27px;
        font-weight: 800;
        font-size: 21px;
        color: #333333;
        line-height: 26px;
        width: calc(100% - 30px);
      }
    }
  }
}
</style>
