<template>
  <div class="evaluationMembers">
    <img class="evaluationMembers-icon" src="@/assets/imgs/otr/evluation/evaluation_bg.png" />
    <div class="evaluationMembers-text">需评价人</div>
    <ElScrollbar class="evaluationMembers-scroll">
      <div class="evaluationMembers-bg">
        <div class="evaluationMembers-bg-item" v-for="(item, index) in list" :key="index">
          <img class="evaluationMembers-bg-item-icon" :src="item.avatarOrigin" />
          <div class="evaluationMembers-bg-item-text">{{ item.name }}</div>
        </div>
      </div>
    </ElScrollbar>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineProps({
  list: propTypes.array.def([])
})
</script>
<style lang="scss" scoped>
.evaluationMembers {
  position: relative;
  margin: -15px;
  cursor: pointer;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 2px 7px 2px rgba(0, 14, 53, 0.28);
  &-icon {
    width: calc(100%);
    height: 30px;
  }
  &-text {
    position: absolute;
    font-weight: 500;
    font-size: 14px;
    color: #255c8c;
    line-height: 30px;
    height: 30px;
    padding-left: 15px;
    margin-top: -35px;
  }
  &-scroll {
    margin-bottom: 0px;
    padding-bottom: 10px;
  }
  &-bg {
    margin-top: 2px;
    margin-bottom: -4px;
    margin-left: 11px;
    margin-right: 5px;
    max-height: 300px;

    min-height: 32px;
    display: flex;
    flex-wrap: wrap;
    &-item {
      margin-top: 6px;
      margin-bottom: 7px;
      margin-left: 5px;
      margin-right: 5px;
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 22px;
      background: #e6ecff;
      border-radius: 11px;
      width: auto;
      &-icon {
        margin-left: 4px;
        margin-right: 4px;
        width: 15px;
        height: 15px;
        border-radius: 7.5px;
      }
      &-text {
        margin-right: 6px;
        font-size: 12px;
        color: #333333;
        line-height: 20px;
      }
    }
  }
}
</style>
