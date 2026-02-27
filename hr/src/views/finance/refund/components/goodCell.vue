<template>
  <div class="row-center">
    <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="20"
      :disabled="!row.goodsId && !row.goods_id">
      <template #reference>
        <el-image class="goods-image" :src="row.goodsImg || getImgUrlById(row.goodsId)" fit="fill"
          v-if="row.goodsImg || row.goodsId">
          <template #error>
            <div class="image-slot">
              <el-icon :size="30"><icon-picture /></el-icon>
            </div>
          </template>
        </el-image>
        <el-avatar shape="square" :size="48" icon="Picture" v-else style="cursor: pointer;background-color: #E5E5E5;" />
      </template>
      <GoodCard :good="{
        materialName: row.goodsName || row.goods_name,
        materialId: row.goodsId || row.goods_id,
        channel: row.channel
      }" />
    </el-popover>
    <div class="goods-title text2">{{ row.goodsName || row.goods_name || '--' }}</div>
  </div>
</template>

<script lang="ts" setup>
import GoodCard from '@/components/common/goods/goodCard.vue'
import { getImgUrlById } from '@/utils/index'

defineProps({
  row: {
    type: Object as PropType<any>,
    requried: true
  }
})
</script>
<style lang="scss" scoped>
.goods-image {
  width: 48px;
  height: 48px;
  border-radius: 3px;
  cursor: pointer;
}

.goods-title {
  margin-left: 10px;
  width: 127px;
  color: #0064FF;
}
</style>
