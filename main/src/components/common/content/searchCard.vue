<template>
  <el-card shadow="never" class="search-body" ref="bodyRef">
    <div ref="searchRef">
      <slot name="search"></slot>
    </div>
    <div :style="{ height: `${dataHeight}px` }">
      <slot name="list" :height="dataHeight"></slot>
    </div>
  </el-card>
</template>

<script lang="ts">
export default { name: 'SearchCard' }
</script>

<script lang="ts" setup>
let observer: ResizeObserver | null = null;

const searchRef = ref(), bodyRef = ref(), dataHeight = ref<number>(500);

const setDataHeight = (height: number = 0) => {
  nextTick(() => {
    dataHeight.value = (bodyRef.value.$el.offsetHeight - 40) - height;
  });
};

const handleResize = (entries: any) => {
  for (const entry of entries) {
    const { height } = entry.contentRect;
    setDataHeight(height);
  }
};

const onResize = () => {
  setTimeout(() => {
    if (searchRef?.value?.offsetHeight && bodyRef?.value?.$el?.offsetHeight) {
      dataHeight.value = (bodyRef.value.$el.offsetHeight - 40) - searchRef.value.offsetHeight;
    }
  }, 500);
};

watchEffect(() => {
  onResize();
});

onMounted(() => {
  onResize();
  window.addEventListener('resize', onResize);
  observer = new ResizeObserver(handleResize);
  searchRef?.value && observer.observe(searchRef.value);
});

onUnmounted(() => {
  observer && observer.disconnect();
  window.removeEventListener('resize', onResize);
});

</script>
<style lang="scss" scoped>
.search-body {
  height: calc(100vh - var(--tags-view-item-height) - var(--top-tool-height) - var(--app-content-padding) - 2px);
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
  border-radius: 10px;

  :deep(.el-card__body) {
    height: calc(100% - 40px);
  }
}
</style>
