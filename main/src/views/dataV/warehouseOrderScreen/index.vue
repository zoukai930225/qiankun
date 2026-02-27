<template>
  <div class="bg">
    <div class="bg-top-text">仓储订单大屏</div>
    <div class="bg-top">
      <!-- 每日订单量 -->
      <div class="order-section">
        <img src="@/assets/imgs/dataV/warehouseOrderScreen/daily.png" class="daily" alt="" />
        <div class="section-content">
          <div class="left-card">
            <div class="card-title">每日订单量</div>
            <div class="card-value">
              <img
                src="@/assets/imgs/dataV/warehouseOrderScreen/meiridingdan.png"
                class="left-icon"
                alt="icon"
              />
              <span class="left-text">{{ details?.todayOrderNum || '0' }}</span>
            </div>
          </div>
          <div class="right-cards">
            <div class="right-card">
              <img
                src="@/assets/imgs/dataV/warehouseOrderScreen/yifahuo.png"
                class="right-icon"
                alt="icon"
              />
              <div class="card-info">
                <div class="info-title">已发货订单量</div>
                <div class="info-value">{{ details?.todayDeliveryNum || '0' }}</div>
              </div>
            </div>
            <div class="right-card">
              <img
                src="@/assets/imgs/dataV/warehouseOrderScreen/weifahuo.png"
                class="right-icon"
                alt="icon"
              />
              <div class="card-info">
                <div class="info-title">未发货订单量</div>
                <div class="info-value weifahuo">{{ details?.todayNoDeliveryNum || '0' }}</div>
              </div>
            </div>
            <div class="right-card">
              <img
                src="@/assets/imgs/dataV/warehouseOrderScreen/tongzhi.png"
                class="right-icon"
                alt="icon"
              />
              <div class="card-info">
                <div class="info-title">发货超时订单量</div>
                <div class="info-value chaoshi">{{ details?.todayTimeOutNum || '0' }}</div>
              </div>
            </div>
            <div class="right-card">
              <img
                src="@/assets/imgs/dataV/warehouseOrderScreen/chaoshi.png"
                class="right-icon"
                alt="icon"
              />
              <div class="card-info">
                <div class="info-title">发货即将超时订单量</div>
                <div class="info-value naozhong">{{
                  details?.todayApproachingTimeoutNum || '0'
                }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 总计订单量 -->
      <div class="order-section">
        <img src="@/assets/imgs/dataV/warehouseOrderScreen/total.png" class="daily" alt="" />
        <div class="section-content">
          <div class="left-card">
            <div class="card-title all-title">总计订单量</div>
            <div class="card-value">
              <img
                src="@/assets/imgs/dataV/warehouseOrderScreen/zongjidingdan.png"
                class="left-icon"
                alt="icon"
              />
              <span class="left-text">{{ details?.allOrderNum || '0' }}</span>
            </div>
          </div>
          <div class="right-cards">
            <div class="right-card">
              <img
                src="@/assets/imgs/dataV/warehouseOrderScreen/yifahuo.png"
                class="right-icon"
                alt="icon"
              />
              <div class="card-info">
                <div class="info-title">已发货订单量</div>
                <div class="info-value">{{ details?.allDeliveryNum || '0' }}</div>
              </div>
            </div>
            <div class="right-card">
              <img
                src="@/assets/imgs/dataV/warehouseOrderScreen/weifahuo.png"
                class="right-icon"
                alt="icon"
              />
              <div class="card-info">
                <div class="info-title">未发货订单量</div>
                <div class="info-value weifahuo">{{ details?.allNoDeliveryNum || '0' }}</div>
              </div>
            </div>
            <div class="right-card">
              <img
                src="@/assets/imgs/dataV/warehouseOrderScreen/tongzhi.png"
                class="right-icon"
                alt="icon"
              />
              <div class="card-info">
                <div class="info-title">发货超时订单量</div>
                <div class="info-value chaoshi">{{ details?.allTimeOutNum || '0' }}</div>
              </div>
            </div>
            <div class="right-card">
              <img
                src="@/assets/imgs/dataV/warehouseOrderScreen/chaoshi.png"
                class="right-icon"
                alt="icon"
              />
              <div class="card-info">
                <div class="info-title">发货即将超时订单量</div>
                <div class="info-value naozhong">{{
                  details?.allApproachingTimeoutNum || '0'
                }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'WarehouseOrderScreen' })

import { getbigScreenDelivery } from '@/api/dataV/index'

const details = ref<any>({})
let refreshInterval: ReturnType<typeof setInterval> | undefined = undefined // 定时器 ID

const initData = async () => {
  try {
    const res = await getbigScreenDelivery()
    console.log('大屏数据', res)
    details.value = res
  } catch (error) {
    console.error('获取大屏数据失败', error)
  }
}
// 设置定时器，每隔一小时刷新一次数据
const startAutoRefresh = () => {
  refreshInterval = setInterval(
    () => {
      initData()
    },
    60 * 60 * 1000
  ) // 每隔 1 小时（60 分钟 * 60 秒 * 1000 毫秒）
}

// 清除定时器
const stopAutoRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
    refreshInterval = undefined
  }
}

onMounted(() => {
  initData()
  startAutoRefresh()
})

// 页面卸载时清除定时器
onBeforeUnmount(() => {
  stopAutoRefresh()
})
</script>
<style lang="scss" scoped>
.bg {
  width: 100vw;
  min-width: 1200px;
  height: 100vh;
  min-height: 900px;
  overflow: scroll;
  background-image: url('@/assets/imgs/dataV/store_bg.png');
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
}

.bg-top-text {
  height: 88px;
  text-align: center;
  margin-top: 2%;
  line-height: 88px;
  font-style: normal;
  margin-bottom: 1%;
  // color: transparent;
  font-family: 阿里巴巴普惠体;
  font-size: 64px;
  font-weight: bold;
  line-height: normal;
  letter-spacing: normal;
  background: linear-gradient(235deg, #ffd7a4 -13%, #feb99f 81%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.bg-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.order-section {
  width: 94%;
  min-width: 1000px;
  // padding: 2%;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  flex: 1;
  border-radius: 10px;
  background: #303030;
  box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
  position: relative;
  padding: 100px 30px 30px 30px;
  box-sizing: border-box;
}

.daily {
  width: 512px;
  height: 70px;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.section-content {
  display: flex;
  flex-direction: row;
  // gap: 2%;
  flex: 1;
}

.left-card {
  min-width: 30%;
  flex: 1;
  background: url('@/assets/imgs/dataV/warehouseOrderScreen/left-top.png') no-repeat;
  background-size: 100% 100%;
  background-position: center;
  border-radius: 1%;
  padding: 2% 2% 2% 0;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  gap: 1%;
  margin-right: 15px;
  box-sizing: border-box;
}

.card-title {
  display: inline-block;
  font-family: PingFang SC;
  font-size: 24px;
  font-weight: 500;
  line-height: normal;
  letter-spacing: normal;
  color: #f7cd9b;
  border-radius: 329.6px;
  background: #8b817c;
  padding: 11px 25px;
  box-sizing: border-box;
  width: 172px;
  margin-left: 12%;
}
.all-title {
  color: #405984;
  background: #d8dfff;
}

.card-value {
  font-weight: bold;
  display: flex;
  margin-left: 12%;
  align-items: center;
  gap: 1%;
  .left-icon {
    width: 66px;
    height: 66px;
    margin-right: 15px;
  }
  .left-text {
    font-family: PingFang SC;
    font-size: 60px;
    font-weight: 600;
    line-height: 46px;
    color: #fee0d1;
  }
}

.right-cards {
  flex: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.right-card {
  background: #3c3c3c;
  border-radius: 1%;
  padding: 24px 40px;
  box-sizing: border-box;
  display: flex;
  align-items: center;

  .right-icon {
    width: 76px;
    height: 76px;
    margin-right: 58px;
  }
}
.right-card:nth-child(2n) {
  margin-left: 17px;
}
.right-card:last-child {
  margin-top: 15px;
}
.right-card:nth-child(3) {
  margin-top: 15px;
}

.card-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  justify-content: space-between;
  padding: 2px 0;
  box-sizing: border-box;
}

.info-title {
  font-family: PingFang SC;
  font-size: 22px;
  font-weight: normal;
  line-height: normal;
  min-width: 240px;
  color: rgba(255, 255, 255, 0.6);
}

.info-value {
  font-size: 44px;
  font-weight: bold;
  color: #ffd7a4;
}
.weifahuo {
  color: #ffb092;
}
.chaoshi {
  color: #d2e2ff;
}
.naozhong {
  color: #af8eff;
}
</style>
