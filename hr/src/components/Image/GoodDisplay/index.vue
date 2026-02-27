<template>
  <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20">
    <template #reference>
      <el-image
        :class="`w-${width}px h-${height}px`"
        :src="item.goodsImage || getImgUrlById(item.goodsId)"
        fit="fill"
      />
    </template>
    <good-card
      :good="{
        materialName: item.goodsName,
        materialId: item.goodsId,
        channel: item.channel || getChannelByStore(item.store || '')
      }"
    />
  </el-popover>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'
import GoodCard from '@/components/common/goods/goodCard.vue'
import { getImgUrlById, getChannelByStore } from '@/utils'

defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  width: {
    type: [Number, String] as PropType<number | string>,
    default: 158
  },
  height: {
    type: [Number, String] as PropType<number | string>,
    default: 158
  }
})
</script>
<style scoped lang="scss"></style>
