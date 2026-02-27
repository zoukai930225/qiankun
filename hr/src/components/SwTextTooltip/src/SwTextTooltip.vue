<template>
  <el-tooltip
    ref="tooltipRef"
    v-bind="{ ...defaultOptions }"
    :disabled="dynamicDisabled"
    :popper-class="popperClassName"
    show-arrow
  >
    <template #default>
      <div
        ref="textRef"
        class="text1 w-[min-content]"
        :class="{ ..._className }"
        :style="{ maxWidth: `${_maxWidth}px` }"
      >
        <slot name="default" ></slot>
      </div>
    </template>

    <template #content>
      <slot name="content"></slot>
    </template>
  </el-tooltip>
</template>

<script lang="ts" setup>
import { ElTooltip, ElTooltipProps } from 'element-plus'

type CustomTooltipProps = Partial<ElTooltipProps> & {
  textClassName?: string
}

const props = withDefaults(defineProps<CustomTooltipProps>(), {
  textClassName: ''
})

const tooltipRef = ref<InstanceType<typeof ElTooltip>>()
const textRef = ref<HTMLDivElement>()
const _maxWidth = ref(0)
const dynamicDisabled = ref(false)

const defaultOptions = computed(() => {
  const _attrs = tooltipRef.value?.$attrs
  return Object.fromEntries(Object.keys(props).map((key) => [key, props[key] || _attrs?.[key]]))
})

const popperClassName = computed(() => {
  if (typeof props.popperClass === 'string') {
    const classNames = props.popperClass.split(' ')
    classNames.unshift('sw-text-tooltip')
    return classNames.join(' ')
  } else {
    return { 'sw-text-tooltip': true, ...props.popperClass }
  }
})

const checkTooltipDisabled = () => {
  nextTick(() => {
    if (!textRef.value) return // 避免DOM未挂载导致的错误
    const textWidth = textRef.value.offsetWidth
    const parentWidth = (textRef.value.parentNode as any)?.offsetWidth || 0
    dynamicDisabled.value =
      defaultOptions.value.disabled === undefined ? textWidth < parentWidth : props.disabled
    _maxWidth.value = parentWidth
  })
}

onMounted(() => {
  checkTooltipDisabled()
})

onUpdated(() => {
  checkTooltipDisabled()
})

const _className = computed(() => {
  if (!props.textClassName) return {}
  return Object.fromEntries(
    props.textClassName
      .split(' ')
      .filter(Boolean)
      .map((ele) => [ele, true])
  )
})

defineExpose({
  tooltipRef,
  hide: () => tooltipRef.value?.hide(),
  updatePopper: () => tooltipRef.value?.updatePopper()
})
</script>
<style lang="less" scoped></style>
<style lang="less">
.sw-text-tooltip {
  max-height: 500px;
  &::-webkit-scrollbar-thumb {
    background-color: #ffffff50;
  }

  &::-webkit-scrollbar {
    width: 5px;
  }

  .btn-in-table__light {
    color: #ddd;
  }
}
</style>
