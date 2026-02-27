<template>
  <el-image
    class="image-display"
    :style="{ width: `${width}px`, height: `${height}px` }"
    :src="src || defaultImage"
    :fit="fit"
    :preview-src-list="previewSrcList"
    preview-teleported
    v-bind="$attrs"
  />
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import type { PropType } from 'vue'
import DefaultImage from '@/assets/svgs/defaultImg.svg'
import DefaultBiggerImage from '@/assets/svgs/common/image_default.svg'

defineOptions({
  inheritAttrs: false
})

const defaultImage = computed(() => (props.isBigger ? DefaultBiggerImage : DefaultImage))
const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 158
  },
  height: {
    type: [Number, String] as PropType<number | string>,
    default: 158
  },
  fit: {
    type: String as PropType<'fill' | 'contain' | 'cover' | 'none' | 'scale-down'>,
    default: 'fill'
  },
  isBigger: {
    type: Boolean,
    default: false
  }
})

const previewSrcList = computed(() => (props.src ? [props.src] : []))
</script>
<style scoped lang="scss">
.image-display {
  cursor: pointer;
  :deep(img) {
    background: #f8f8f9;
  }
}
</style>
