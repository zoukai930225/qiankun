<template>
  <div class="micro-hr-admin-wrapper">
    <!-- qiankun 将把 hrAdmin 微应用渲染到这个容器中 -->
    <div id="micro-hr-admin-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { registerMicroApps, start } from 'qiankun'

onMounted(() => {
  if ((window as any).__MICRO_APP_QIANKUN_STARTED__) {
    return
  }

  ;(window as any).__MICRO_APP_QIANKUN_STARTED__ = true

  registerMicroApps([
    {
      name: 'hrAdmin',
      entry: import.meta.env.VITE_MICRO_HRADMIN_ENTRY || 'http://localhost:90',
      container: '#micro-hr-admin-container',
      activeRule: '/admin/hrAdmin'
    }
  ])

  start()
})
</script>

<style scoped>
.micro-hr-admin-wrapper {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>

