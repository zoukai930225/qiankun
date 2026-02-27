<!--
 * @Date: 2025-08-12 08:48:37
-->
<template>
  <div class="content">
    <!-- <button @click="num = (num + 1) % 10">+1</button> -->
    <!-- <button @click="handleConfetti">放烟花！</button> -->
    <img src="@/assets/imgs/countDown/logo.png" alt="" class="logo" />
    <img src="@/assets/imgs/countDown/title.png" alt="" class="title" />
    <div class="desc-bg">1 0 亿 解 锁 休 假 升 级</div>
    <div class="main-bg">
      <div class="num-wapper">
        <div v-for="(item, index) in listNum" :key="index">
          <SingleNum :value="item" />
        </div>
        <div class="yuan-wapper">
          <div class="yuan">元</div>
        </div>
      </div>
      <div class="desc-text">距 离 目 标 仅 剩</div>
    </div>
    <div class="bottom-wrapper">
      <img src="@/assets/imgs/countDown/bottom-left.png" alt="" class="bottom-icon" />
      <div class="desc">全力以赴冲刺10亿，2030年成为中国高性价比贴身衣物第一品牌</div>
      <img src="@/assets/imgs/countDown/bottom-right.png" alt="" class="bottom-icon" />
    </div>
  </div>
</template>

<script setup>
import { getBillionObtainVarianceComment } from '@/api/dataV'
import confetti from 'canvas-confetti'
import SingleNum from './components/singleNum.vue'
const num = ref(9)

var heart = confetti.shapeFromPath({
  path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z',
  matrix: [0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666, -5.533333333333333]
})

var defaults = {
  scalar: 2,
  spread: 180,
  particleCount: 30,
  origin: { y: -0.1 },
  startVelocity: -35
}

const handleConfetti = () => {
  confetti({
    ...defaults,
    shapes: [heart],
    colors: ['#ff9a00', '#ff7400', '#ff4d00']
  })
}
const listNum = ref([9, 9, 9, 9, 9, 9, 9, 9, 9]) // 初始化9位数字
const numArray = ref([])
const currentIndex = ref(0)
let timer = null
let confettiTimer = null
let stopped = false

const fetchAndStart = async () => {
  try {
    const res = await getBillionObtainVarianceComment()
    numArray.value = (res || []).map((n) => n.toString().padStart(9, '0'))
    // mock数据
    // numArray.value = ['322', '233', '122', '-100'].map((n) => n.padStart(9, '0'))
    currentIndex.value = 0
    stopped = false
    if (numArray.value.length > 0) {
      listNum.value = numArray.value[0].split('').map((n) => parseInt(n, 10))
    }
    startTimer()
  } catch (error) {
    // 接口报错或无数据，2秒后重试
    setTimeout(() => {
      fetchAndStart()
    }, 2000)
  }
}

const startTimer = () => {
  clearTimer()
  timer = setInterval(() => {
    if (stopped) return
    currentIndex.value++
    if (currentIndex.value >= numArray.value.length) {
      // 展示完最后一项，重新请求接口
      fetchAndStart()
    } else {
      const currentStr = numArray.value[currentIndex.value]
      listNum.value = currentStr.split('').map((n) => parseInt(n, 10))
      if (parseInt(currentStr, 10) <= 0) {
        // 停止所有操作，只每秒播放烟花
        stopped = true
        clearTimer()
        listNum.value = '000000000'.split('').map((n) => parseInt(n, 10))
        startConfettiLoop()
      }
    }
  }, 1000)
}

const startConfettiLoop = () => {
  clearConfettiTimer()
  confettiTimer = setInterval(() => {
    handleConfetti()
  }, 1000)
}

const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
const clearConfettiTimer = () => {
  if (confettiTimer) {
    clearInterval(confettiTimer)
    confettiTimer = null
  }
}

onMounted(() => {
  fetchAndStart()
})

onUnmounted(() => {
  clearTimer()
  clearConfettiTimer()
})
</script>

<style lang="scss" scoped>
.content {
  width: 100vw;
  height: 100vh;
  background: url('@/assets/imgs/countDown/red-bg.png') no-repeat center center;
  background-size: 100% 100%;
  position: relative;
  min-width: 1600px;
  overflow: auto;

  .logo {
    position: absolute;
    left: 56px;
    top: 49px;
    width: 8.91%;
    height: 2.18%;
    opacity: 1;
    min-width: 171px;
    min-height: 24px;
  }

  // 十亿标题
  .title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 7%;
    width: 942px;
    height: 215px;
    opacity: 1;
  }

  // 10亿解锁休假升级
  .desc-bg {
    background: url('@/assets/imgs/countDown/desc-bg.png') no-repeat center center;
    background-size: 100% 100%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(7% + 235px);
    width: 540px;
    height: 65px;
    line-height: 65px;
    text-align: center;
    font-size: 38px;
    color: #ffca95;
  }

  // 主背景
  .main-bg {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(7% + 300px);
    // width: 100%;
    width: 1650px;
    height: 400px;
    background: url('@/assets/imgs/countDown/main-bg.png') no-repeat center center;
    background-size: 100% 100%;
    position: relative;

    // 数字容器
    .num-wapper {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 80px;

      .yuan-wapper {
        width: 80px;
        height: 201px;
        display: flex;
        flex-direction: column;
        align-items: start;
        justify-content: end;

        .yuan {
          width: 80px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          background: white;
          border-radius: 50%;
          font-weight: 600;
          color: #9e2933;
          font-size: 38px;
        }
      }
    }

    // 倒计时描述
    .desc-text {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 27px;
      width: 353px;
      height: 72px;
      line-height: 72px;
      text-align: center;
      font-size: 24px;
      color: #fff;
      background: url('@/assets/imgs/countDown/desc-text.png') no-repeat center center;
      background-size: 100% 100%;
    }
  }

  // 底部描述
  .bottom-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(7% + 700px);
    width: 95%;
    height: 100px;

    .bottom-icon {
      width: 220px;
      height: 38px;
      line-height: 38px;
    }

    .desc {
      font-size: 20px;
      letter-spacing: 0.1em;
      font-variation-settings: 'opsz' auto;
      color: #ffd4a1;
      margin: 0 10px;
    }
  }
}
</style>
