<template>
  <div class="row-center">
    <img v-if="getImageUrl(row[channelName])" class="channel-img" :src="getImageUrl(row[channelName])"
      object-fit="contain" />
    <el-tooltip effect="dark" :content="row.storeName" placement="top-start" :disabled="disabledTooltip">
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
  },
  width: {
    type: Number,
    default: 180
  },
  channelName: {
    type: String,
    default: 'channelCode'
  }
})
const disabledTooltip = computed(() => {
  return getLength(props.row.storeName || '') <= (props.width - 27)
})

function getLength(str: string, size = 15) {
  let length = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i].charCodeAt(0) > 255) {//字符编码大于255，说明是双字节字符
      length += 2;
    } else {
      length = length + 1.2;
    }
  }
  return length * (size / 2);
}
</script>
<style lang="scss" scoped>
.channel-img {
  width: 22px;
  margin-right: 5px;
}
</style>