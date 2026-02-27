<template>
  <!--- 特殊样式-店铺 渠道图标+店铺名称 --->
  <div class="row-left">
    <img v-if="row.store && getStoreIcon(row.store)" class="goodImg" :src="getStoreIcon(row.store)"
      object-fit="contain" />
    <el-tooltip effect="light" :content="row.storeName || row.store_name || row.store"
      :disabled="(!row.storeName && !row.store_name && !row.store) || row.storeName.length < 14">
      <div class="single-line">{{ row.storeName || row.store_name || row.store || '--' }}
      </div>
    </el-tooltip>
  </div>
</template>
<script lang="ts" setup>
import { getStoreIcon } from '@/utils/index';
defineProps({
  row: {
    type: Object,
    required: true
  }
})
</script>
<style scoped lang="scss">
@mixin common-flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.single-line {
  font-size: 14px;
  color: #333333;
  font-family: PingFangSC-Regular;
  width: 124px;
}

.row-left {
  @include common-flex-row;
  justify-content: flex-start;
}

.goodImg {
  width: 18px;
  margin-right: 4px
}
</style>