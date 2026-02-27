<template>
  <div class="SWProgressLabel">
    <div
      class="SWProgressLabel-progress"
      :style="{
        width: progressLabelWidth(),
        background: backgroundColor,
        opacity: backgroundOpacity
      }"
    ></div>
    <div
      ref="valueRef"
      class="SWProgressLabel-text"
      :style="{
        color: textColor,
        fontSize: fontSize + 'px',
        fontWeight: 600
      }"
      >{{ value }}</div
    >
  </div>
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  value: propTypes.string.def(''),
  progress: propTypes.number.def(0),
  fontSize: propTypes.number.def(14),
  textColor: propTypes.string.def(''),
  backgroundColor: propTypes.string.def(''),
  backgroundOpacity: propTypes.number.def(0.2),
  columnWidth: propTypes.number.def(0),
  showProgress: propTypes.bool.def(false)
})

const valueRef = ref()

const progressLabelWidth = () => {
  let progress = props.progress > 1 ? 1 : props.progress
  if (props.progress < 0) {
    progress = 0
  }

  if (valueRef.value) {
    if (progress === 0) {
      return '0px'
    }
    if (props.showProgress) {
      const labelWidth = valueRef.value.offsetWidth
      return `${labelWidth}px`
    }
    if (props.columnWidth) {
      return `${(props.columnWidth - 20) * progress}px`
    }
  }
  return '0px'
}
</script>

<style lang="scss" scoped>
.SWProgressLabel {
  display: flex;
  flex-direction: row;
  align-items: center;
  &-progress {
    position: absolute;
    height: 28px;
    border-radius: 3px;
  }
  &-progressValue {
    position: absolute;
    height: 28px;
    border-radius: 3px 0px 0px 3px;
  }
  &-text {
    font-weight: 600;
    line-height: 20px;
    z-index: 99;
    padding-left: 9px;
    padding-right: 9px;
  }
}
</style>
