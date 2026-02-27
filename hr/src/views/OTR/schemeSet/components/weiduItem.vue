<template>
  <div class="weiduItem" @click="weiduEditAction">
    <img class="weiduItem-icon" :src="icon" />
    <div class="weiduItem-title">{{
      getDictLabel(DICT_TYPE.OTR_PROGRAM_DIMENSION, props.data.dimension)
    }}</div>
    <el-icon
      v-if="!disabled"
      class="weiduItem-close"
      color="#0064ff"
      :size="12"
      @click.stop="deleteAction"
      ><CloseBold
    /></el-icon>
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'

import weidu_suzhi_icon from '@/assets/imgs/otr/schemeSet/weidu_suzhi.png'
import weidu_yeji_icon from '@/assets/imgs/otr/schemeSet/weidu_yeji.png'
import weidu_qianli_icon from '@/assets/imgs/otr/schemeSet/weidu_qianli.png'
import weidu_jineng_icon from '@/assets/imgs/otr/schemeSet/weidu_jineng.png'

const props = defineProps({
  disabled: propTypes.bool.def(false),
  objectIndex: propTypes.number.def(0),
  index: propTypes.number.def(0),
  data: propTypes.object.def({})
})

const icon = computed(() => {
  if (props.data.dimension === 'dimension_skill') {
    //技能
    return weidu_jineng_icon
  } else if (props.data.dimension === 'dimension_potential') {
    //潜力
    return weidu_qianli_icon
  } else if (props.data.dimension === 'dimension_performance') {
    //业绩
    return weidu_yeji_icon
  } else if (props.data.dimension === 'dimension_quality') {
    //素质
    return weidu_suzhi_icon
  }
  return weidu_suzhi_icon
})

const deleteAction = () => {
  if (props.disabled) {
    return
  }
  emit('deleteDimension', props.objectIndex, props.index)
}

const weiduEditAction = () => {
  // if (props.disabled) {
  //   return
  // }
  emit('weiduEditAction', props.objectIndex, props.index)
}

const emit = defineEmits(['deleteDimension', 'weiduEditAction'])
</script>

<style lang="scss" scoped>
.weiduItem {
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 25px;
  background: #eef5ff;
  border-radius: 2px;
  cursor: pointer;
  &-icon {
    margin-left: 7px;
    width: 10px;
    height: 11px;
  }
  &-title {
    padding-left: 8px;
    padding-right: 6px;
    font-size: 12px;
    color: #0064ff;
    line-height: 17px;
  }
  &-close {
    margin-right: 7px;
    cursor: pointer;
  }
}
</style>
