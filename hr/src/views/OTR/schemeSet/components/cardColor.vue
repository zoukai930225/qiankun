<template>
  <div class="cardColor">
    <div v-for="(item, index) in list" :key="index">
      <div class="item">
        <div class="item-color" :style="{ background: `${item.color}` }"></div>
        <div class="item-title">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const list = ref([
  {
    name: '已使用',
    color: '#06C21B'
  },
  {
    name: '未使用',
    color: '#E99D40'
  }
])
</script>

<style lang="scss" scoped>
.cardColor {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-right: 16px;
  .item {
    margin-left: 30px;
    display: flex;
    flex-direction: row;
    align-items: center;
    &-color {
      width: 28px;
      height: 10px;
      border-radius: 1px;
    }
    &-title {
      padding-left: 14px;
      font-weight: 400;
      font-size: 12px;
      color: #333333;
      line-height: 17px;
    }
  }
}
</style>
