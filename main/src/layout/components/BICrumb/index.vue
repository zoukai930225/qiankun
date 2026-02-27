<template>
  <div class="BICrumb">
    <div class="system" @click="backSWPlatform">工作台 > </div>
    <div class="biRoute">{{ currentRoute.meta?.title || '' }}</div>
  </div>
</template>
<script lang="ts" setup>
const router = useRouter() // 路由对象

defineOptions({ name: 'BICrumb' })

const currentRoute = ref()

// 监听路由信息变化
watch(
  () => router.currentRoute.value.path,
  () => {
    currentRoute.value = router.currentRoute.value
  },
  { immediate: true }
)

// 返回SW平台
const backSWPlatform = () => {
  router.go(-1)
}
</script>

<style scoped lang="scss">
.BICrumb {
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 16px;
  color: #666666;
  line-height: 22px;
  .system {
    cursor: pointer !important;
  }
  .arrow {
    padding-left: 5px;
    font-weight: 500;
  }
  .biRoute {
    padding-left: 5px;
    color: #333;
  }
}
</style>
