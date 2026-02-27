<template>
  <div class="row-center" v-if="type !== 'default'">
    <span v-if="type === 'circle'" class="status-icon" :style="{ '--icon-color': (echo as OptionItem).color }"></span>
    <span :class="type === 'tag' ? 'tag' : ''"
      :style="type === 'tag' ? { '--echo-color': (echo as OptionItem).color, '--echo-bg-color': getRGBA((echo as OptionItem).color) } : ''">
      {{ (echo as OptionItem).label || '-' }}
    </span>
  </div>
  <span v-else class="custom_color" :style="{ '--echo-color': (echo as OptionItem).color }">
    {{ (echo as OptionItem).label || '-' }}
  </span>
</template>

<script lang="ts" setup>

interface OptionItem {
  label: string,
  value: string,
  disabled: boolean,
  color: string
}

const props = defineProps({
  // 字典值
  value: {
    type: String,
    default: '',
  },
  // 接口获取字典Options
  options: {
    type: Array,
    default: (): OptionItem[] => []
  },
  // 额外options信息
  echoOptions: {
    type: Array,
    default: (): OptionItem[] => []
  },
  // 展示类型
  type: {
    type: String,
    default: 'default',
    validator: (val: string) => ['default', 'circle', 'tag'].includes(val)
  }
})

const mergeOptions = computed(() => {
  return props.options.map((item: OptionItem) => {
    const { label, value } = item
    const echoOption = props.echoOptions.find((echo: OptionItem) => echo.label === label || echo.value === value)
    if (echoOption) return { ...item, ...echoOption }
    return { ...item }
  })
})

const echo = computed(() => {
  if (mergeOptions.value.length > 0) {
    const optionItem = mergeOptions.value.find((item: OptionItem) => item.value === props.value)
    return optionItem
  }
  return {}
})

const getRGBA = (color: string) => {
  if (!color) return 'rgba(255, 255, 255, 0)'
  const red = parseInt(color.slice(1, 3), 16)
  const green = parseInt(color.slice(3, 5), 16)
  const blue = parseInt(color.slice(5, 7), 16)
  return `rgba(${red}, ${green}, ${blue}, .2)`
}

</script>

<style lang="scss" scoped>
.custom_color {
  color: var(--echo-color, #333333);
}

.status-icon {
  width: 8px;
  height: 8px;
  border-radius: 10px;
  margin-right: 10px;
  background-color: var(--icon-color, #E5E5E5);
}

.tag {
  width: 74px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  border-radius: 28px;
  font-size: 14px;
  color: var(--echo-color, #666666);
  background-color: var(--echo-bg-color, #E5E5E5);
}
</style>