<template>
  <!-- :class="images.length > 1 ? 'multi' : ''" -->
  <div class="images">
    <el-image :src="images?.length ? images[0] : defaultImg" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
      :preview-teleported="true" :preview-src-list="images || []" fit="cover" :style="imagesStyle" />
    <img v-if="images.length > 1" class="multi" src="@/assets/imgs/customerService/multiBg.png" alt=""
      :style="{ left: left }">
  </div>
</template>

<script lang="tsx">
export default { name: 'LineImage' };
</script>

<script lang="tsx" setup>
import defaultImg from '@/assets/svgs/defaultImg.svg';

const props = defineProps({
  left: { type: String, default: '10px' },
  height: { type: Number, default: 48 },
  width: { type: Number, default: 48 },
  urls: { type: String, default: '' },
});

const images = computed(() => props.urls ? props.urls.split(',') : []);

const imagesStyle = computed(() => ({ width: `${props.width}px`, height: `${props.height}px` }))

</script>
<style lang="scss" scoped>
.images {
  position: relative !important;

  .el-image {
    border-radius: 2px;
    border: 1px solid #fff;
    z-index: 99;
  }

  .multi {
    background-image: url('@/assets/imgs/customerService/multiBg.png');
    background-repeat: no-repeat;
    position: absolute;
    top: 2px;
  }
}
</style>
