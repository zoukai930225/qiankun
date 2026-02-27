<template>
  <div class="header">
    <div class="header-row">
      <img class="header-row-left" src="@/assets/imgs/channelData/header_left.png" />
      <span class="header-row-title">
        <span v-if="['rank', 'total'].includes(tabType)" style="margin-left: 12px">{{ date }}</span>
        <span style="margin-left: 16px">{{ storeName }}</span>
        <span v-if="tabType === 'rank'">付费</span>
        <span v-if="tabType === 'rank'" style="color: #0064ff">前10名</span>
        <span v-if="tabType === 'rank'" style="margin-right: 17px">产品</span>
        <span v-if="tabType === 'total'">{{ totalName }}</span>
        <span v-if="tabType === 'category'">-各品类</span>
        <span v-if="tabType === 'category'" style="color: #0064ff">搜索流量</span>
        <span v-if="tabType === 'category'">对比</span>
      </span>
      <img class="header-row-right" src="@/assets/imgs/channelData/header_right.png" />
    </div>
    <img class="header-star" src="@/assets/imgs/channelData/header_star.png" />
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

defineOptions({ name: 'ChannelHeader' })

const props = defineProps({
  date: propTypes.string.def(''), // 日期
  store: propTypes.string.def(''), // 店铺
  tabType: propTypes.string.def('rank') // tab类型 rank 付费前10 total 付费总和 category
})

const storeName = computed(() => {
  if (props.store === 'Tmall') return 'SW天猫店'
  if (props.store === 'PDD' && props.tabType === 'rank') return 'SW拼多多店'
  if (props.store === 'PDD' && props.tabType === 'total') return 'SW拼多多'
  else return 'SW淘宝店'
})

const totalName = computed(() => {
  if (props.store === 'PDD') return '各店铺付费总和'
  else return '各品类付费总和'
})
</script>

<style lang="scss" scoped>
.header {
  height: 85px;
  background-repeat: no-repeat;
  background-image: url('@/assets/imgs/channelData/header_bg.png');
  background-size: cover;
  width: calc(100% + 6px);
  margin-left: -6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 6px;
  &-row {
    height: 32x;
    display: flex;
    flex-direction: row;
    align-items: center;
    &-left {
      width: 20px;
      height: 32px;
    }
    &-title {
      font-size: 20px;
      color: #333333;
      line-height: 20px;
      font-weight: 500;
    }
    &-right {
      width: 20px;
      height: 32px;
    }
  }
  &-star {
    width: 89px;
    height: 20px;
  }
}
</style>
