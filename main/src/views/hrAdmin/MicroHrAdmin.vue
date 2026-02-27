<template>
  <div class="micro-hr-admin-wrapper">
    <div id="micro-hr-admin-container"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { loadMicroApp } from 'qiankun'
import type { MicroApp } from 'qiankun'

let microApp: MicroApp | null = null

onMounted(() => {
  microApp = loadMicroApp({
    name: 'hrAdmin',
    entry: import.meta.env.VITE_MICRO_HRADMIN_ENTRY || 'http://localhost:90',
    container: '#micro-hr-admin-container',
    props: { isQiankunChild: true }
  })
})

onUnmounted(() => {
  if (microApp) {
    microApp.unmount()
    microApp = null
  }
})
</script>

<style scoped>
.micro-hr-admin-wrapper {
  width: 100%;
  height: calc(100vh - var(--top-tool-height) - var(--tags-view-item-height));
  overflow: auto;
  position: relative;
}
</style>

<style>
#micro-hr-admin-container {
  width: 100%;
  height: 100%;
}
#micro-hr-admin-container > div {
  width: 100%;
  height: 100%;
}
</style>

