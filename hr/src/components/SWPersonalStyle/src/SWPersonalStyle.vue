<template>
  <div class="swPersonalStyle">
    <div class="valueBg">
      <div
        class="valueBg-item"
        :style="{ cursor: props.canClick ? 'pointer' : '' }"
        v-for="(item, index2) in list"
        :key="index2"
        @click="itemClick(item)"
      >
        <img class="valueBg-item-icon" :src="item.avatarOrigin" />
        <div class="valueBg-item-text">{{
          item.name || item.enName || item.nickName || item.userName
        }}</div>

        <div style="margin-left: 6px"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  canClick: propTypes.bool.def(false),
  data: propTypes.object,
  list: propTypes.array.def([])
})

const itemClick = (item: any) => {
  emit('itemClick', item, props.data)
}

const emit = defineEmits(['itemClick'])
</script>

<style lang="scss" scoped>
.swPersonalStyle {
  .valueBg {
    min-height: 32px;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    &-item {
      margin-top: 6px;
      margin-bottom: 7px;
      margin-left: 8px;
      margin-left: 8px;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 22px;
      background: #e6ecff;
      border-radius: 11px;
      width: auto;
      &-icon {
        margin-left: 6px;
        margin-right: 6px;
        width: 15px;
        height: 15px;
        border-radius: 7.5px;
      }
      &-text {
        font-size: 12px;
        color: #333333;
        line-height: 20px;
      }
      &-delete {
        cursor: pointer;
        margin-left: 4px;
        width: 15px;
        height: 15px;
        margin-right: 6px;
      }
    }
  }
}
</style>
