<template>
  <el-button type="primary" plain :disabled="isDisabled" @click="handleRevoke">
    撤销同步{{ countdown }}
  </el-button>
</template>

<script lang="tsx">
export default { name: 'SynchronizedRevokeBtn' }
</script>

<script lang="tsx" setup>
const STORAGE_KEY = 'synchronized_last_sync_time'
const MAX_REVOKE_TIME = 10 * 60 * 1000 // 10分钟（毫秒）

const countdown = ref('')
const isDisabled = ref(true)
let timer: any = null
let lastSyncTime = 0 // 缓存同步时间，避免频繁读取 localStorage

const { revokeState, handleRevokeSync } = inject('SynchronizedForm') as any

// 点击撤销按钮
const handleRevoke = () => {
  if (handleRevokeSync) {
    handleRevokeSync()
  }
}

// 格式化倒计时显示 (MM:SS)
const formatCountdown = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `(${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')})`
}

// 更新倒计时显示
const updateCountdown = () => {
  if (!lastSyncTime) {
    stopCountdown()
    return
  }

  const now = Date.now()
  const elapsed = now - lastSyncTime
  const remaining = MAX_REVOKE_TIME - elapsed

  if (remaining <= 0) {
    // 倒计时结束
    stopCountdown()
    localStorage.removeItem(STORAGE_KEY)
  } else {
    // 更新倒计时显示
    countdown.value = formatCountdown(remaining)
    isDisabled.value = false
  }
}

// 启动倒计时
const startTimer = () => {
  // 清除旧定时器
  stopCountdown()

  // 验证同步时间是否有效
  if (!lastSyncTime) return

  const now = Date.now()
  const elapsed = now - lastSyncTime

  // 如果已经超时，直接返回
  if (elapsed >= MAX_REVOKE_TIME) {
    stopCountdown()
    localStorage.removeItem(STORAGE_KEY)
    return
  }

  // 立即更新一次
  updateCountdown()

  // 启动定时器，每秒更新
  timer = setInterval(updateCountdown, 1000)
}

// 停止倒计时
const stopCountdown = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  countdown.value = ''
  isDisabled.value = true
}

// 监听父组件的同步状态变化
watch(
  () => revokeState.value,
  (newVal) => {
    if (newVal?.shouldStart && newVal?.lastSyncTime) {
      // 新的同步操作，启动倒计时
      lastSyncTime = newVal.lastSyncTime
      localStorage.setItem(STORAGE_KEY, lastSyncTime.toString())
      startTimer()
    } else if (!newVal?.lastSyncTime) {
      stopCountdown()
    }
  },
  { deep: true }
)

// 组件挂载时，恢复倒计时状态
onMounted(() => {
  const storedTime = localStorage.getItem(STORAGE_KEY)
  if (storedTime) {
    lastSyncTime = Number(storedTime)
    startTimer()
  }
})

// 组件卸载时清理定时器
onBeforeUnmount(() => {
  stopCountdown()
})
</script>
<style lang="scss" scoped></style>
