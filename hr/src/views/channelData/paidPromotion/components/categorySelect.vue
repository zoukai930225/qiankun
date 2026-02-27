<template>
  <div class="categorySelect">
    <div
      class="item"
      v-for="(value, index) in list"
      :key="index"
      @click="itemClick(value)"
      :style="{
        backgroundColor: selectCategory === value.code ? '#0064FF' : '#fff'
      }"
    >
      <img
        class="item-icon"
        :src="getItemIcon(value.code)"
        :style="{
          width: `${getItemIconSize(value.code)[0]}px`,
          height: `${getItemIconSize(value.code)[1]}px`
        }"
      />
      <div
        class="item-label"
        :style="{
          color: selectCategory === value.code ? '#fff' : '#333',
          fontWeight: selectCategory === value.code ? '600' : '400'
        }"
        >{{ value.name }}</div
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  selectCategory: propTypes.string.def(''),
  list: propTypes.array.def([])
})

import nvku from '@/assets/imgs/channelData/paidPromotion/nvku.png'
import nvku_hl from '@/assets/imgs/channelData/paidPromotion/nvku_hl.png'

import nanku from '@/assets/imgs/channelData/paidPromotion/nanku.png'
import nanku_hl from '@/assets/imgs/channelData/paidPromotion/nanku_hl.png'

import neiyi from '@/assets/imgs/channelData/paidPromotion/neiyi.png'
import neiyi_hl from '@/assets/imgs/channelData/paidPromotion/neiyi_hl.png'

import wazi from '@/assets/imgs/channelData/paidPromotion/wazi.png'
import wazi_hl from '@/assets/imgs/channelData/paidPromotion/wazi_hl.png'

import xiongtie from '@/assets/imgs/channelData/paidPromotion/xiongtie.png'
import xiongtie_hl from '@/assets/imgs/channelData/paidPromotion/xiongtie_hl.png'

import jipinji from '@/assets/imgs/channelData/paidPromotion/jipinji.png'
import jipinji_hl from '@/assets/imgs/channelData/paidPromotion/jipinji_hl.png'

const getItemIcon = (category: string) => {
  if (category === 'UNDERWEAR_CATEGORY_GROUP') {
    // 内衣
    if (props.selectCategory === category) {
      return neiyi_hl
    } else {
      return neiyi
    }
  } else if (category === 'SEASONAL_CATEGORY_GROUP') {
    // 季品季
    if (props.selectCategory === category) {
      return jipinji_hl
    } else {
      return jipinji
    }
  } else if (category === 'WOMANPANTS_CATEGORY_GROUP') {
    // 女士内裤
    if (props.selectCategory === category) {
      return nvku_hl
    } else {
      return nvku
    }
  } else if (category === 'SOCKS_CATEGORY_GROUP') {
    // 袜子
    if (props.selectCategory === category) {
      return wazi_hl
    } else {
      return wazi
    }
  } else if (category === 'MANPANTS_CATEGORY_GROUP') {
    // 男士内裤
    if (props.selectCategory === category) {
      return nanku_hl
    } else {
      return nanku
    }
  } else if (category === 'PASTIES_CATEGORY_GROUP') {
    // 胸贴
    if (props.selectCategory === category) {
      return xiongtie_hl
    } else {
      return xiongtie
    }
  }
}

const getItemIconSize = (category: string) => {
  if (category === 'UNDERWEAR_CATEGORY_GROUP') {
    // 内衣

    return [12, 15]
  } else if (category === 'SEASONAL_CATEGORY_GROUP') {
    // 季品季
    return [12, 12]
  } else if (category === 'WOMANPANTS_CATEGORY_GROUP') {
    // 女士内裤
    return [14, 11]
  } else if (category === 'SOCKS_CATEGORY_GROUP') {
    // 袜子
    return [12, 14]
  } else if (category === 'MANPANTS_CATEGORY_GROUP') {
    // 男士内裤
    return [12, 14]
  } else if (category === 'PASTIES_CATEGORY_GROUP') {
    // 胸贴
    return [12, 10]
  }
  return [12, 12]
}

const itemClick = (value: any) => {
  emit('categorySelect', value)
}

const emit = defineEmits(['categorySelect', 'layoutModeChange'])
</script>

<style lang="scss">
.categorySelect {
  display: flex;
  flex-direction: row;
  .item {
    width: 116px;
    height: 40px;
    background: #ffffff;
    border-radius: 6px 6px 0px 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 20px;
    cursor: pointer;
    &-icon {
      margin-left: auto;
    }
    &-label {
      padding-left: 15px;
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      text-align: left;
      margin-right: auto;
    }
  }
}
</style>
