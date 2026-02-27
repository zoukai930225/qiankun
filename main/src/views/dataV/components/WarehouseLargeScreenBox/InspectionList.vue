<!-- 验货排行榜 毛天 2025年3月11日10:40:39 -->
<template>
  <div class="box">
    <div class="top">
      <!-- <div class="top-iocn"></div>
      验货排行榜 -->
      <img src="@/assets/imgs/dataV/yhListTitle.png" alt="" />
    </div>
    <div class="topName">
      <div class="topName-zhan"></div>
      <div class="topName-text"></div>
      <div class="one">{{ No1 }}</div>
      <div class="two">{{ No2 }}</div>
      <div class="three">{{ No3 }}</div>
    </div>
    <div class="guding">
      <div class="bottom-top">
        <div class="bottom-top-one">排名</div>
        <div class="bottom-top-two">验货员</div>
        <div class="bottom-top-three">订单数</div>
        <div>货品数</div>
      </div>
    </div>
    <div class="bottom" ref="rankScrollRef">
      <div class="scroll-content">
        <div class="list-item" v-for="(item, index) in list" :key="index">
          <div class="list-item-one">
            <img v-if="index === 0" src="@/assets/imgs/dataV/Goldmedal.png" />
            <img v-else-if="index === 1" src="@/assets/imgs/dataV/Silvermedal.png" />
            <img v-else-if="index === 2" src="@/assets/imgs/dataV/Bronzemedal.png" />
            <div v-else class="paiming">{{ index + 1 }}</div>
          </div>
          <div class="list-item-two">{{ item.inspector }}</div>
          <div class="list-item-three">{{ item.orderNumber }}</div>
          <div>{{ item.goodsNumber }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as warehouseLargeScreen from '@/api/dataV/warehouseLargeScreen'

const list = ref([])

const No1 = ref('')
const No2 = ref('')
const No3 = ref('')
const rankScrollRef = ref(null)
const boxRef = ref(null)
let scrollTimer = null // 定时器

let currentAnimation = null

const smoothScrollTo = (element, target, duration) => {
  if (currentAnimation) {
    cancelAnimationFrame(currentAnimation)
    currentAnimation = null
  }

  const start = element.scrollTop
  const distance = target - start
  let startTime = null

  const animation = (currentTime) => {
    if (!startTime) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const run = easeInOutQuad(timeElapsed, start, distance, duration)

    element.scrollTop = run

    if (timeElapsed < duration) {
      currentAnimation = requestAnimationFrame(animation)
    } else {
      currentAnimation = null
    }
  }
  currentAnimation = requestAnimationFrame(animation)
}

const rankContentScroll = async () => {
  const container = rankScrollRef.value
  if (!container) return

  // 滚动到底部（保持6秒动画）
  await new Promise((resolve) => {
    const target = container.scrollHeight - container.clientHeight
    smoothScrollTo(container, target, 6000)
    setTimeout(resolve, 8000)
  })

  // 直接瞬间回到顶部（无动画）
  container.scrollTop = 0

  // 可选的停留时间（例如1秒）
  await new Promise((resolve) => setTimeout(resolve, 100))
}

const startScroll = () => {
  // 创建循环滚动
  const loop = () => {
    rankContentScroll().then(() => {
      scrollTimer = setTimeout(loop, 2000) // 立即开始下一次循环
    })
  }

  loop() // 启动首次滚动
}

const stopScroll = () => {
  clearTimeout(scrollTimer)
  if (currentAnimation) {
    cancelAnimationFrame(currentAnimation)
  }
}

// 缓动函数保持原样
const easeInOutQuad = (t, b, c, d) => {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t + b
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

const init = async () => {
  const params = {
    warehouse: 'BYSW'
  }
  const res = await warehouseLargeScreen.inspectionRank(params)
  list.value = res
  if (list.value.length >= 5) {
    list.value = [...list.value, {}]
  }
  No1.value = res[0].inspector || ''
  No2.value = res[1].inspector || ''
  No3.value = res[2].inspector || ''
}
// 每隔10分钟请求一次接口
const timeInterval = 1000 * 60 * 10
window.setInterval(() => {
  setTimeout(() => {
    init()
  }, 0)
}, timeInterval)
onMounted(() => {
  startScroll()
  init()
})

onUnmounted(() => {
  stopScroll()
})
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .top {
    height: 4.74vh;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    font-size: 1.041667vw;
    color: #ffd7a4;
    line-height: 22px;
    text-align: left;
    font-style: normal;
    margin-bottom: 0.95246vh;
    text-align: center;
    img {
      width: 17.24vw;
      height: 100%;
    }
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
  .topName {
    margin-bottom: 1.1vh;
    position: relative;
    width: 28.13vw;
    height: 11.04vh;
    margin-left: 1.718vw;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 500;
    font-size: 1.458333vw;
    color: #fff5e9;
    .topName-zhan {
      height: 3.73vh;
    }
    .topName-text {
      height: 7.31vh;
      background-image: url('@/assets/imgs/dataV/store_Ranking.png');
      background-size: 100% 100%;
    }
    .one {
      width: 7.29167vw;
      position: absolute;
      top: 0;
      left: 10.39vw;
      text-align: center;
      font-size: 1.25vw;
    }
    .two {
      width: 7.29167vw;
      position: absolute;
      top: 2vh;
      left: 1.22vw;
      font-size: 1.041667vw;
      text-align: center;
    }
    .three {
      width: 7.29167vw;
      position: absolute;
      top: 3.677vh;
      right: 1.1vw;
      font-size: 1.041667vw;
      text-align: center;
    }
  }
  .bottom-top {
    display: flex;
    width: 100%;
    height: 4.08vh;
    background: #212320;
    border-radius: 10px 10px 0px 0px;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.9375vw;
    color: #afafaf;
    line-height: 4.08vh;
    .bottom-top-one {
      margin-left: 1.041667vw;
      margin-right: 5.46875vw;
    }
    .bottom-top-two {
      margin-right: 5.46875vw;
    }
    .bottom-top-three {
      margin-right: 5.46875vw;
    }
  }
  .guding {
    border: 1px solid #434343;
    border-bottom: none;
    border-radius: 15px 15px 0 0;
    width: 29.17vw;
    margin-left: 1.1979vw;
    overflow: hidden; // 确保内容超出部分隐藏
  }

  .bottom {
    border: 1px solid #434343;
    border-top: none;
    width: 29.17vw;
    height: 23.34vh;
    margin-left: 1.1979vw;
    overflow: hidden; // 确保内容超出部分隐藏
    position: relative;
    .scroll-content {
      width: 100%;
    }

    .list-item {
      display: flex;
      width: 100%;
      height: 4.26vh;
      background: #303030;
      line-height: 4.26vh;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 500;
      font-size: 0.9375vw;
      color: #fff5e9;
      img {
        margin-top: 0.1vh;
        margin-left: 1.1583vw;
        vertical-align: middle;
      }
      .list-item-one {
        margin-right: 5.88541vw;
      }
      .list-item-two {
        width: 7.99vw;
        margin-right: 0.46875vw;
      }
      .list-item-three {
        width: 7.92vw;
        margin-right: 0.4vw;
      }
    }
  }
  .list-item:nth-child(2n) {
    background-color: #212320;
  }
}
.paiming {
  width: 1.18vw;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 0.9375vw;
  color: #fff5e9;
  margin-left: 1.1583vw;
  text-align: center;
}
</style>
