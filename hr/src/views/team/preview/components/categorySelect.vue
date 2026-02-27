<template>
  <div class="categorySelect">
    <div
      class="item"
      v-for="(item, index) in list"
      :key="index"
      @click="itemClick(item.label)"
      :style="{
        backgroundColor: selectCategory === item.label ? '#0064FF' : '#fff'
      }"
    >
      <img
        class="item-icon"
        :src="getItemIcon(item.name)"
        :style="{
          width: `${getItemIconSize(item.name)[0]}px`,
          height: `${getItemIconSize(item.name)[1]}px`
        }"
      />
      <div
        class="item-label"
        :style="{
          color: selectCategory === item.label ? '#fff' : '#333',
          fontWeight: selectCategory === item.label ? '600' : '400'
        }"
        >{{ item.label }}</div
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

import wenxiong from '@/assets/imgs/channelData/paidPromotion/wenxiong.png'
import wenxiong_hl from '@/assets/imgs/channelData/paidPromotion/wenxiong_hl.png'

import diaodaibeixin from '@/assets/imgs/channelData/paidPromotion/diaodaibeixin.png'
import diaodaibeixin_hl from '@/assets/imgs/channelData/paidPromotion/diaodaibeixin_hl.png'

const getItemIcon = (category: string) => {
  if (category === '内衣') {
    // 内衣
    if (props.selectCategory === category) {
      return neiyi_hl
    } else {
      return neiyi
    }
  } else if (category === '季节品') {
    // 季节品
    if (props.selectCategory === category) {
      return jipinji_hl
    } else {
      return jipinji
    }
  } else if (category === '女裤') {
    // 女裤
    if (props.selectCategory === category) {
      return nvku_hl
    } else {
      return nvku
    }
  } else if (category === '袜子') {
    // 袜子
    if (props.selectCategory === category) {
      return wazi_hl
    } else {
      return wazi
    }
  } else if (category === '男裤') {
    // 男裤
    if (props.selectCategory === category) {
      return nanku_hl
    } else {
      return nanku
    }
  } else if (category === '胸贴') {
    // 胸贴
    if (props.selectCategory === category) {
      return xiongtie_hl
    } else {
      return xiongtie
    }
  } else if (category === '文胸') {
    // 文胸
    if (props.selectCategory === category) {
      return wenxiong_hl
    } else {
      return wenxiong
    }
  } else if (category === '吊带背心') {
    // 吊带背心
    if (props.selectCategory === '吊带背心') {
      return diaodaibeixin_hl
    } else {
      return diaodaibeixin
    }
  }
}

const getItemIconSize = (category: string) => {
  if (category === '内衣') {
    return [12, 15]
  } else if (category === '季品季') {
    return [12, 12]
  } else if (category === '女裤') {
    return [14, 11]
  } else if (category === '袜子') {
    return [12, 14]
  } else if (category === '男裤') {
    return [12, 14]
  } else if (category === '胸贴') {
    return [12, 10]
  } else if (category === '文胸') {
    return [12, 12]
  } else if (category === '吊带背心') {
    return [15, 15]
  }
  return [12, 12]
}

const itemClick = (value: any) => {
  console.log(value, 'value')
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
