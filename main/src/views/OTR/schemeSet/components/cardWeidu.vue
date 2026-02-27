<template>
  <div class="cardWeidu">
    <div v-for="(item, index) in list" :key="index">
      <div class="item">
        <img class="item-icon" :src="icon(item)" />
        <div class="item-title">{{ getDictLabel(DICT_TYPE.OTR_PROGRAM_DIMENSION, item) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'

import weidu_suzhi_icon from '@/assets/imgs/otr/schemeSet/weidu_suzhi.png'
import weidu_yeji_icon from '@/assets/imgs/otr/schemeSet/weidu_yeji.png'
import weidu_qianli_icon from '@/assets/imgs/otr/schemeSet/weidu_qianli.png'
import weidu_jineng_icon from '@/assets/imgs/otr/schemeSet/weidu_jineng.png'

defineProps({
  list: propTypes.array.def([])
})

const icon = (dimension) => {
  if (dimension === 'dimension_skill') {
    //技能
    return weidu_jineng_icon
  } else if (dimension === 'dimension_potential') {
    //潜力
    return weidu_qianli_icon
  } else if (dimension === 'dimension_performance') {
    //业绩
    return weidu_yeji_icon
  } else if (dimension === 'dimension_quality') {
    //素质
    return weidu_suzhi_icon
  }
  return weidu_suzhi_icon
}
</script>

<style lang="scss" scoped>
.cardWeidu {
  margin-top: 4px;
  margin-bottom: 4px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  .item {
    margin-left: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 25px;
    background: #eef5ff;
    border-radius: 10px;
    &-icon {
      margin-left: 7px;
      width: 10px;
      height: 11px;
    }
    &-title {
      padding-left: 8px;
      padding-right: 7px;
      font-size: 12px;
      color: #0064ff;
      line-height: 17px;
    }
  }
}
</style>
