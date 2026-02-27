<template>
  <div>
    <!-- 单个图片时直接显示 -->
    <div v-if="carImageUrls.length === 1" class="single-car-image" @click="handlePreview">
      <img class="w-46px h-46px rounded-2px cursor-pointer" :src="carImageUrls[0]" />
    </div>

    <!-- 多个图片时显示带背景的预览 -->
    <div v-else-if="carImageUrls.length > 1" class="multiple-car-images relative cursor-pointer" @click="handlePreview">
      <div class="car-bg-wrapper">
        <img src="@/assets/imgs/visualCenter/car-img-bg.png" class="car-bg-image absolute" alt="车图背景" />
        <img class="w-46px h-46px rounded-1px car-front-image absolute top-0 left-0" :src="carImageUrls[0]"
          alt="车图预览" />
      </div>
    </div>

    <!-- 无图片时显示占位 -->
    <span v-else class="text-gray-400">-</span>
  </div>

  <!-- Element Plus 图片预览器 -->
  <teleport to="body">
    <el-image-viewer v-if="showViewer" :url-list="carImageUrls" :initial-index="0" @close="showViewer = false" />
  </teleport>
</template>

<script lang="ts" setup>
import { ref, PropType } from 'vue'
import { ElImageViewer } from 'element-plus'

defineProps({
  carImageUrls: {
    type: Array as PropType<string[]>,
    default: () => []
  }
})

const showViewer = ref(false)

const handlePreview = () => {
  showViewer.value = true
}


</script>

<style scoped lang="scss">
.single-car-image {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    &:hover {
      opacity: 0.8;
      transform: scale(1.05);
      transition: all 0.2s ease;
    }
  }
}

.multiple-car-images {
  display: flex;
  align-items: center;
  justify-content: center;

  .car-bg-wrapper {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 46px;

    .car-bg-image {
      top: 50%;
      left: calc(50% + 14px);
      transform: translate(-50%, -50%);
      width: auto;
      height: auto;
      object-fit: none;
    }

    .car-front-image {
      object-fit: cover;
    }

    &:hover {
      opacity: 0.8;
      transform: scale(1.05);
      transition: all 0.2s ease;
    }
  }
}
</style>