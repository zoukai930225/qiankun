<template>
  <div class="top-content">
    <div class="title">SKU库存分布（TOP3）</div>
    <div class="list-content">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="name">{{ item.productCode || '-' }}</div>
        <div style="flex: 1">
          <el-progress :percentage="item.percent || 0" :stroke-width="10" :show-text="false"></el-progress>
        </div>
        <div class="value">{{ item.goodsStock || 0 }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})
</script>

<style lang="scss" scoped>
.top-content {
  padding: 20px 0 6px 0;
  height: 142px;
  box-sizing: border-box;
  .title {
    font-size: 14px;
    font-weight: 500;
    color: #666666;
  }
  .list-content {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // padding: 10px 0;
      height: 40px;
      font-size: 14px;
      color: #333333;
      .progress {
        flex: 1;
      }
      .name {
        line-height: 1.1;
        width: 120px;
        word-break: break-all;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .value {
        width: 110px;
        text-align: right;
      }
    }
  }
}
</style>
