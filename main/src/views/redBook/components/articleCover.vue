<template>
  <div class="articleCover">
    <el-image
      class="coverImg"
      :src="cover"
      :preview-teleported="true"
      :preview-src-list="[cover]"
    />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineProps({
  cover: propTypes.string.def('') // 封面
})
</script>

<style lang="scss" scoped>
.articleCover {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-end;
  .coverImg {
    margin-right: 10px;
    width: 50px;
    height: 50px;
    z-index: 99;
  }
}
</style>
