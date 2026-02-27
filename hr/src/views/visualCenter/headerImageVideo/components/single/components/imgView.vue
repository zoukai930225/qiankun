<template>
  <el-popover placement="right" :width="326" trigger="hover" :show-arrow="false" :offset="20">
    <template #reference>
      <div>
        <img class="w-14 h-16 border-radius-4px img_small" :src="url" />
      </div>
    </template>
    <img class="w-300px h-360px border-radius-4px object-fit-contain object-position-center" :src="url" />
  </el-popover>
</template>
<script lang='ts' setup>
const props = defineProps({
  url: String
})
</script>
<style scoped lang='scss'></style>