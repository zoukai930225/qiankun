<template>
  <SWDialog v-model="dialogVisible" :title="title" :width="width">
    <el-carousel class="carousel" arrow="always" :autoplay="false" :trigger="'click'" indicator-position="none"
      style="height: 400px;">
      <el-carousel-item v-for="(url, index) in videos" :key="index" class="carouselItem">
        <video :src="url" class="previewFile" controls></video>
      </el-carousel-item>
    </el-carousel>
  </SWDialog>
</template>
<script lang="tsx" setup>
const props = defineProps({
  urls: { type: String, default: '' },
  title: { type: String, default: '视频' },
  width: { type: String, default: '800px' },
});
const videos = computed(() => props.urls?.toString().includes('[') ? JSON.parse(props.urls) : props.urls.split(',').map(url => url.trim()));
const dialogVisible = ref(false);
const openPreview = () => {
  dialogVisible.value = true;
};

defineExpose({
  openPreview
})
</script>
<style lang="scss" scoped>
.carouselItem {
  height: 400px;

  .previewFile {
    width: 100%;
    height: 100%;
  }
}
</style>