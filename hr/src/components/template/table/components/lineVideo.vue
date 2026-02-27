<template>
  <div class="videos" :class="videos.length > 1 ? 'multi' : ''">
    <div @click="openPreview()" class="row-center">
      <slot>
        <el-image :style="{ cursor: videos?.length ? 'pointer' : 'default' }" :src="videos?.length ? videoPlay : defaultImg"
        fit="cover" />
      </slot>
    </div>
    <SWDialog v-if="dialogVisible" v-model="dialogVisible" :title="title" :width=width>
      <el-carousel class="carousel" arrow="always" :autoplay="false" :trigger="'click'" indicator-position="none"
        style="height: 400px;">
        <el-carousel-item v-for="(file, index) in videos" :key="index" class="carouselItem">
          <el-image :src="file.fileUrl" v-if="getFileType(file) === 'isImage'" class="previewFile" fit="contain" />
          <video :src="file.fileUrl" class="previewFile" v-else controls></video>
        </el-carousel-item>
      </el-carousel>
    </SWDialog>
  </div>
</template>

<script lang="tsx">
export default { name: 'LineVideo' };
</script>

<script lang="tsx" setup>
import videoPlay from '@/assets/imgs/customerService/videoPlay.png';
import defaultImg from '@/assets/svgs/defaultImg.svg';

const props = defineProps({
  urls: { type: String, default: '' },
  title: { type: String, default: '发货视频' },
  width: { type: String, default: '800px' },
});

const dialogVisible = ref(false);

const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'];

const getFileType = (file: any) => {
  const fileName = file.fileName
  const type = fileName?.split('.')[1]
  return imageTypes.includes(type)
    ? 'isImage' : 'isVideo'
};

const videos = computed(() => (props.urls ? props.urls.split(',') : []).map((url: string) => {
  const fileUrl = url.split('?name=')[0]
  const fileName = url.split('?name=')[1]
  return {
    fileUrl,
    fileName
  }
}));

const openPreview = () => {
  if (videos.value?.length) {
    dialogVisible.value = true;
  }
};

</script>
<style lang="scss" scoped>
.videos {

  &.multi {
    background-image: url('@/assets/imgs/customerService/videoImg.png');
    background-repeat: no-repeat;
    background-position-x: 20%;
    background-position-y: 20%;
  }
}

.carouselItem {
  height: 400px;

  .previewFile {
    width: 100%;
    height: 100%;
  }
}
</style>
