<template>
  <div class="box">
    <div style="height: 2.20713073vh"></div>
    <div class="top">
      <div class="top-iocn"></div>
      采购在途提醒
    </div>
    <div>
      <div style="display: flex; padding-bottom: 1.041667vw">
        <div class="shangjiabianma">商家编码</div>
        <div class="yujiTime">预计到货时间</div>
      </div>
    </div>
    <div class="box-center" ref="rankScrollRef">
      <div class="scroll-content" :style="scrollStyle">
        <div class="item" v-for="(item, index) in list" :key="index">
          <div class="item-name">{{ item.merchantCode }}</div>
          <div class="item-time"><img src="@/assets/imgs/dataV/time.png" alt="" /></div>
          <div class="item-date">{{ item.expectedDeliveryTime }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as warehouseLargeScreen from '@/api/dataV/warehouseLargeScreen'

const list = ref([])
const rankScrollRef = ref(null)
const scrollStyle = computed(() => ({
  transform: `translateY(-${scrollPosition.value}px)`
}))
let scrollPosition = ref(0)
let animationFrameId: number | null = null
const pixelsPerSecond = 50 // 滚动速度（像素/秒）
let lastTime = 0
const isPaused = ref(true) // 初始暂停状态
const pauseUntil = ref(0) // 暂停结束时间
const scrollStep = (timestamp: number) => {
  if (!lastTime) lastTime = timestamp

  // 处理暂停状态
  if (isPaused.value) {
    if (timestamp >= pauseUntil.value) {
      isPaused.value = false
      const container = rankScrollRef.value
      if (container) {
        const contentHeight = container.scrollHeight
        const containerHeight = container.clientHeight
        // 底部暂停结束后跳转到顶部并再次暂停
        if (scrollPosition.value >= contentHeight - containerHeight) {
          scrollPosition.value = 0
          isPaused.value = true
          pauseUntil.value = timestamp + 2000
        }
      }
      lastTime = timestamp // 重置时间基准
    }
    animationFrameId = requestAnimationFrame(scrollStep)
    return
  }

  // 正常滚动逻辑
  const deltaTime = timestamp - lastTime
  scrollPosition.value += (pixelsPerSecond * deltaTime) / 1000

  const container = rankScrollRef.value
  if (container) {
    const contentHeight = container.scrollHeight
    const containerHeight = container.clientHeight

    // 检测边界
    if (scrollPosition.value >= contentHeight - containerHeight) {
      scrollPosition.value = contentHeight - containerHeight
      isPaused.value = true
      pauseUntil.value = timestamp + 2000
    } else if (scrollPosition.value <= 0) {
      scrollPosition.value = 0
      isPaused.value = true
      pauseUntil.value = timestamp + 2000
    }
  }

  lastTime = timestamp
  animationFrameId = requestAnimationFrame(scrollStep)
}
const startScroll = () => {
  const container = rankScrollRef.value
  if (!container) return

  // 初始暂停2秒
  isPaused.value = true
  pauseUntil.value = performance.now() + 2000
  lastTime = 0
  animationFrameId = requestAnimationFrame(scrollStep)
}
const init = async () => {
  // 停止当前滚动
  stopScroll()
  const params = {
    warehouse: 'BYSW'
  }
  const res = await warehouseLargeScreen.purchaseOnWayReminde(params)
  list.value = res
  if (list.value.length >= 5) {
    list.value = [...list.value, {}]
  }
  // 等待DOM更新
  await nextTick()

  // 重置滚动位置
  scrollPosition.value = 0

  // 重新开始滚动
  startScroll()
}
// 添加停止滚动方法
const stopScroll = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  isPaused.value = true
  scrollPosition.value = 0
}
// 每隔10分钟请求一次接口
const timeInterval = 1000 * 60 * 10
window.setInterval(() => {
  setTimeout(() => {
    init()
  }, 0)
}, timeInterval)

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
})
</script>
<style lang="scss" scoped>
.box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family:
    PingFangSC,
    PingFang SC;
  font-weight: 500;
  font-size: 1.041667vw;
  color: #ffd7a4;
  .top {
    // padding-top: 2.20713073vh;
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
  .box-center {
    margin-left: 1vw;
    // margin-top: 1vh;
    width: 29.22vw;
    height: 33.28vh;
    overflow: hidden;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.9375vw;
    color: #c6c2bd;
  }
  .shangjiabianma {
    padding-left: 2.7vw;
    padding-top: 2.4617vh;
    margin-right: 13.07vw;

    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.9375vw;
    color: #c6c2bd;
    padding-bottom: 0.2vh;
  }
  .yujiTime {
    padding-top: 2.4617vh;
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 0.9375vw;
    color: #c6c2bd;
    padding-bottom: 0.2vh;
  }
  .scroll-content {
    width: 100%;
  }
  .item {
    width: 29.17vw;
    height: 4.84vh;
    background: #212320;
    border-radius: 5px;
    margin-top: 1.528vh;
    margin-bottom: 1.528vh;
    line-height: 4.84vh;
    display: flex;
    .item-name {
      margin-right: 0.5vw;
      width: 13.66667vw;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 600;
      font-size: 0.833333vw;
      color: #ffd7a4;
      margin-left: 1.875vw;
      white-space: nowrap; /* 禁止文本换行 */
      overflow: hidden; /* 隐藏溢出内容 */
      text-overflow: ellipsis; /* 溢出时显示省略号 */
    }
    .item-time {
      img {
        width: 0.84vw;
        height: 0.84vw;
        vertical-align: middle;
      }
      margin-right: 0.729167vw;
    }
    .item-date {
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 500;
      font-size: 0.9375vw;
      color: #fff5e9;
    }
    .item-date2 {
      margin-left: 0.52083vw;
      font-family:
        PingFangSC,
        PingFang SC;
      font-weight: 500;
      font-size: 0.9375vw;
      color: #fff5e9;
    }
  }
}
.scroll-content {
  will-change: transform;
}
</style>
