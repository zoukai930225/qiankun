<template>
  <div class="moduleTop">
    <img class="moduleTop-icon" :src="moduleDict[type].icon" />
    <div class="moduleTop-text">{{ moduleDict[type].name }}</div>
  </div>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

import evluation_icon_dept from '@/assets/imgs/otr/evluation/evluation_icon_dept.png'
import evluation_icon_member from '@/assets/imgs/otr/evluation/evluation_icon_member.png'
import evluation_icon_evluation from '@/assets/imgs/otr/evluation/evluation_icon_evluation.png'

defineProps({
  type: propTypes.string.def('dept') //dept:部门 user:人员 releation: 评价关系
})

const moduleDict = ref({
  dept: {
    icon: evluation_icon_dept,
    name: '部门'
  },
  user: {
    icon: evluation_icon_member,
    name: '人员'
  },
  releation: {
    icon: evluation_icon_evluation,
    name: '评价关系'
  }
})
</script>
<style lang="scss" scoped>
.moduleTop {
  display: flex;
  flex-direction: row;
  align-items: center;
  &-icon {
    margin-left: 20px;
    margin-right: 10px;
    width: 14px;
    height: 13px;
  }
  &-text {
    font-size: 14px;
    color: #333333;
    line-height: 22px;
  }
}
</style>
