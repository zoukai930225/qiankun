<template>
  <div class="row-center">
    <img v-if="getImageUrl(row.channel)" class="channel-img" :src="getImageUrl(row.channel)" object-fit="contain" />
    <el-tooltip effect="dark" :content="row.storeName" placement="top-start" :disabled="row.storeName?.length < 17">
      <div class="text1">
        {{ row.storeName }}
      </div>
    </el-tooltip>
  </div>
</template>
<script lang="ts" setup>
import { getImageUrl } from '@/utils/index'
const props = defineProps({
  row: {
    type: Object,
    default: () => ({})
  }
})
</script>
<style lang="scss" scoped>
.channel-img {
  width: 22px;
  margin-right: 5px;
}
</style>