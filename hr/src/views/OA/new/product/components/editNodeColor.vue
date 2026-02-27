<template>
  <div class="editNodeColor">
    <div class="item" v-for="(item, index) in colorList" :key="index">
      <img v-if="item.url" class="item-img" :src="item.url" />
      <img v-else class="item-img" src="@/assets/imgs/oa/board/empty_cover.png" />
      <div class="item-color">{{ item.name }}</div>
      <img
        v-if="!forbidEdit"
        class="item-close"
        src="@/assets/imgs/oa/close-circle-fill.png"
        @click="deleteColor(index)"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  colorList: {
    type: Array,
    default: () => []
  },
  forbidEdit: {
    type: Boolean,
    default: false
  }
})

const deleteColor = (index: number) => {
  emit('deleteColor', index)
}
const emit = defineEmits(['deleteColor'])
</script>

<style scoped lang="scss">
.editNodeColor {
  display: flex;
  flex-wrap: wrap;
  .item {
    position: relative;
    border-radius: 10px;
    background: #f7f7f7;
    box-sizing: border-box;
    border: 1px solid #e5e5e5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 98px;
    height: 98px;
    margin-right: 10px;
    margin-bottom: 10px;
    &-img {
      width: 82px;
      height: 64px;
      margin-top: 5px;
      object-fit: cover;
    }
    &-color {
      margin-top: 3px;
      border-radius: 10px;
      background: #ffffff;
      font-size: 10px;
      font-weight: normal;
      line-height: normal;
      text-align: right;
      letter-spacing: normal;
      color: #333333;
      height: 16px;
      line-height: 16px;
      padding-left: 10px;
      padding-right: 10px;
    }
    &-close {
      position: absolute;
      width: 12px;
      height: 12px;
      right: 4px;
      bottom: 4px;
      cursor: pointer;
    }
  }
}
</style>
