<template>
  <div>
    <el-carousel ref="carouselRef" :height="height" indicator-position="none" arrow="never" :autoplay="false" :loop="false">
      <el-carousel-item name="first">
        <slot name="first"></slot>
      </el-carousel-item>
      <el-carousel-item name="second">
        <slot name="second"></slot>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="tsx">
export default { name: 'Advance' }
</script>

<script lang="tsx" setup>
const props = defineProps({ height: { type: String, default: '180px' } })

const carouselRef = ref()

const setActiveItem = (active: string) => carouselRef?.value?.setActiveItem(active)

const prev = () => carouselRef?.value?.prev()

const next = () => carouselRef?.value?.next()

defineExpose({ prev, next, setActiveItem })
</script>
<style lang="scss" scoped></style>
