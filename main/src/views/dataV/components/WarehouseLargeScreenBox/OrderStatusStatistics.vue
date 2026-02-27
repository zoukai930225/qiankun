<!-- 订单状态统计 毛天 2025年3月11日15:16:27 -->
<template>
  <div class="box">
    <div class="top">
      <div class="top-iocn"></div>
      订单状态统计
    </div>
    <div class="center">
      <img class="loudou" src="@/assets/imgs/dataV/loudou.png" alt="" />
      <span>排队中</span>
      <img class="jiantou" src="@/assets/imgs/dataV/jiantou.png" alt="" />
      <img class="book" src="@/assets/imgs/dataV/book.png" alt="" />
      <span>待补货</span>
      <img class="jiantou" src="@/assets/imgs/dataV/jiantou.png" alt="" />
      <img class="hot" src="@/assets/imgs/dataV/hot.png" alt="" />
      <span>爆款锁定</span>
      <img class="jiantou" src="@/assets/imgs/dataV/jiantou.png" alt="" />
    </div>
    <div class="buttom">
      <div class="one">{{ queuingNumber }}</div>
      <div class="two">{{ toBeRestocked }}</div>
      <div class="three">{{ hotSellingLockNumber }}</div>
    </div>
  </div>
  <div class="box-box">
    <div class="top">
      <div class="top-iocn"></div>
      采购未上架信息
    </div>
    <div class="botton">
      <div class="botton-left">
        <div class="sku">SKU</div>
        <div style="display: flex; margin-top: 2vh">
          <div class="skuImg">
            <img src="@/assets/imgs/dataV/sku.png" alt="" />
          </div>
          <div class="spanSku">{{ skuNumber }}</div>
        </div>
      </div>
      <div class="botton-right">
        <div class="dingdanbox">订单数</div>
        <div style="display: flex; margin-top: 2vh">
          <div class="skuImg">
            <img src="@/assets/imgs/dataV/bookRight.png" alt="" />
          </div>
          <div class="spanSku">{{ orderNumber }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as warehouseLargeScreen from '@/api/dataV/warehouseLargeScreen'

const queuingNumber = ref() // 订单状态信息-排队中数量
const toBeRestocked = ref() // 订单状态信息-待补货数量
const hotSellingLockNumber = ref() // 订单状态信息-爆款锁定数量
const skuNumber = ref() // 采购未上架信息-sku数量
const orderNumber = ref() // 采购未上架信息-订单数量

// 数字的千分位格式化
function formatNumberWithCommas(num) {
  // 处理非数字类型（如果输入可能是字符串）
  const parsedNumber = typeof num === 'string' ? parseInt(num, 10) : num

  // 异常处理
  if (isNaN(parsedNumber)) return '0' // 或根据需求返回默认值

  // 使用国际化API（自动处理千分位）
  return new Intl.NumberFormat('en-US').format(parsedNumber)
}

// 初始化
const init = async () => {
  const params = {
    warehouse: 'BYSW'
  }
  const res = await warehouseLargeScreen.orderStatus(params)
  queuingNumber.value = res.queuingNumber
  toBeRestocked.value = res.toBeRestocked
  hotSellingLockNumber.value = res.hotSellingLockNumber
}
const init2 = async () => {
  const params = {
    warehouse: 'BYSW'
  }
  const res2 = await warehouseLargeScreen.purchaseUnList(params)
  skuNumber.value = formatNumberWithCommas(res2.skuNumber)
  orderNumber.value = formatNumberWithCommas(res2.orderNumber)
}
// 每隔10分钟请求一次接口
const timeInterval = 1000 * 60 * 10
// 每隔2分钟请求一次接口
const timeInterval2 = 200 * 60 * 10

window.setInterval(() => {
  setTimeout(() => {
    init2()
  }, 0)
}, timeInterval)

window.setInterval(() => {
  setTimeout(() => {
    init()
  }, 0)
}, timeInterval2)

onMounted(() => {
  init()
  init2()
})
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 18.78vh;
  background-color: #303030;
  overflow: hidden;
  // box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
  border-radius: 10px 10px 2px 2px;
  // border: 2px solid;
  margin-bottom: 2.03735vh;
  .top {
    padding-top: 2.2vh;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    font-size: 1.041667vw;
    color: #ffd7a4;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    margin-bottom: 2.95246vh;
  }
  .top-iocn {
    display: inline-block;
    width: 0.29vw;
    height: 1.58vh;
    background: #ffd7a4;
    border-radius: 3px;
    margin-left: 1.2vw;
    margin-right: 0.729vw;
  }
  .center {
    margin-left: 1.77083vw;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    font-size: 1.041667vw;
    color: #c6c2bd;
    .loudou {
      width: 1.35vw;
      height: 1.35vw;
      margin-right: 0.9375vw;
      vertical-align: middle;
    }
    .jiantou {
      margin-left: 0.520833333vw;
    }
    .book {
      width: 1.35vw;
      height: 1.35vw;
      margin-right: 0.9375vw;
      vertical-align: middle;
      margin-left: 4.0104166vw;
    }
    .hot {
      width: 1.35vw;
      height: 1.35vw;
      margin-right: 0.9375vw;
      vertical-align: middle;
      margin-left: 4.0104166vw;
    }
  }
  .buttom {
    display: flex;
    padding-top: 1.5vh;
    .one {
      flex: 1;
      // padding-left: 3.01041vw;
      font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: bold;
      font-size: 2.1875vw;
      color: #ffb092;
      text-align: center;
      padding-left: 0.520833vw;
    }
    .two {
      // padding-left: 1vw;
      flex: 1;
      font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: bold;
      font-size: 2.1875vw;
      color: #d2e2ff;
      text-align: center;
    }
    .three {
      flex: 1;
      // padding-left: 2vw;
      font-family: MicrosoftYaHei, MicrosoftYaHei;
      font-weight: bold;
      font-size: 2.1875vw;
      color: #ffe9ab;
      text-align: center;
    }
  }
}
.box-box {
  height: 19.26vh;
  background: #303030;
  box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
  border-radius: 10px 10px 2px 2px;
  // border: 2px solid;
  overflow: hidden;
  .top {
    padding-top: 1.2vh;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    font-size: 1.041667vw;
    color: #ffd7a4;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    margin-bottom: 1.95246vh;
  }
  .top-iocn {
    display: inline-block;
    width: 0.29vw;
    height: 1.58vh;
    background: #ffd7a4;
    border-radius: 3px;
    margin-left: 1.2vw;
    margin-right: 0.729vw;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    font-size: 1.041667vw;
    color: #ffd7a4;
  }
  .botton {
    display: flex;
    .botton-left {
      width: 14.3vw;
      height: 11.38vh;
      background-image: url('@/assets/imgs/dataV/leftBg.png');
      background-size: 100% 100%;
      margin-left: 1.09375vw;
      padding-top: 1.35823vh;
      .sku {
        // margin-top: 1.35823vh;
        margin-left: 1.3020833vw;
        width: 7.29vw;
        height: 3.31vh;
        background: #8f837d;
        color: #f7cd9b;
        border-radius: 20px;
        font-weight: 600;
        font-size: 1.041667vw;
        text-align: center;
        line-height: 3.31vh;
      }
      .skuImg {
        width: 2.03vw;
        height: 2.03vw;
        margin-left: 1.302083vw;
        display: inline-block;
        vertical-align: middle;
        margin-right: 1.77083vw;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .spanSku {
        display: inline-block;
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: bold;
        font-size: 1.5625vw;
        color: #fff5e9;
        font-style: normal;
        // line-height:;
      }
    }
    .botton-right {
      width: 13.77vw;
      height: 11.38vh;
      background-image: url('@/assets/imgs/dataV/rightBg.png');
      background-size: 100% 100%;
      padding-top: 1.35823vh;
      margin-left: 1.25vw;
      .dingdanbox {
        width: 7.29vw;
        height: 3.34vh;
        background: #825f5d;
        border-radius: 20px;
        font-family:
          PingFangSC,
          PingFang SC;
        font-weight: 600;
        font-size: 1.041667vw;
        color: #f78c62;
        margin-left: 1.197916vw;
        text-align: center;
        line-height: 3.34vh;
      }
      .skuImg {
        width: 2.03vw;
        height: 2.03vw;
        margin-left: 1.302083vw;
        display: inline-block;
        vertical-align: middle;
        margin-right: 1.77083vw;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .spanSku {
        display: inline-block;
        font-family: MicrosoftYaHei, MicrosoftYaHei;
        font-weight: bold;
        font-size: 1.5625vw;
        color: #fff5e9;
        font-style: normal;
        // line-height:;
      }
    }
  }
}
</style>
