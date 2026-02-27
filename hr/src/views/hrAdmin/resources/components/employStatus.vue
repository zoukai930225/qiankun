<template>
  <div class="employStatus">
    <div class="employStatusBg" :style="{ background: bgBackgroundColor, border: bgBorderColor }">
      <div class="employStatusBg-text" :style="{ color: textColor }">
        {{ getDictLabel(DICT_TYPE.FEISHU_STATUS, status) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { propTypes } from '@/utils/propTypes'
// 员工状态 1：待入职 2：在职 3：已取消入职 4：待离职 5：已离职
const props = defineProps({
  status: propTypes.string.def('')
})

const bgBackgroundColor = computed(() => {
  if (props.status === '1') {
    return '#EFF1FF'
  } else if (props.status === '2') {
    return '#E4F9EB'
  } else if (props.status === '3') {
    return '#FFE4E6'
  } else if (props.status === '4') {
    return '#FFEBDE'
  } else if (props.status === '5') {
    return '#ECE3F2'
  }
  return '#ECE3F2'
})

const bgBorderColor = computed(() => {
  if (props.status === '1') {
    return '1px solid #0064FF'
  } else if (props.status === '2') {
    return '1px solid #2CAF02'
  } else if (props.status === '3') {
    return '1px solid #F11622'
  } else if (props.status === '4') {
    return '1px solid #E88F33'
  } else if (props.status === '5') {
    return '1px solid #8326BA'
  }
  return '1px solid #8326BA'
})

const textColor = computed(() => {
  if (props.status === '1') {
    return '#0064FF'
  } else if (props.status === '2') {
    return '#2CAF02'
  } else if (props.status === '3') {
    return '#F11622'
  } else if (props.status === '4') {
    return '#E88F33'
  } else if (props.status === '5') {
    return '#8326BA'
  }
  return '#8326BA'
})

computed
</script>

<style lang="scss" scoped>
.employStatus {
  display: flex;
  flex-direction: row;
  .employStatusBg {
    height: 30px;
    border-radius: 6px;
    &-text {
      padding-left: 20px;
      padding-right: 20px;
      font-weight: 400;
      font-size: 14px;
      line-height: 30px;
    }
  }
}
</style>
