<template>
  <div class="listImgs">
    <el-image
      v-for="(item, index) in imgs"
      :key="index"
      class="logImg"
      :src="item"
      :preview-teleported="true"
      :preview-src-list="imgs"
    />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineProps({
  imgs: propTypes.array.def([]) // 图片
})
</script>

<style lang="scss" scoped>
.listImgs {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-end;
  .logImg {
    margin-right: 10px;
    margin-bottom: 10px;
    width: 60px;
    height: 35px;
    z-index: 99;
  }
}
</style>
