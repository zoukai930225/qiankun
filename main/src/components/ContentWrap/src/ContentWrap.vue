<script lang="ts" setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { CardInstance, ElCard, ElTooltip } from 'element-plus'
import { Icon } from '@/components/Icon' // 假设Icon组件路径正确

defineOptions({ name: 'ContentWrap' })

const props = withDefaults(
  defineProps<{
    title?: string
    message?: string
    borderRadius?: number
    isAutoHeight?: boolean
  }>(),
  {
    borderRadius: 10,
    isAutoHeight: false
  }
)

const cardMaxHeight = ref<string>('auto')

let resizeTimer: NodeJS.Timeout
const getAutoHeight = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(async () => {
    cardMaxHeight.value = `${window.innerHeight - 115}px`

    await nextTick()
    if (cardRef.value?.$el) {
      const dom = cardRef.value?.$el.querySelector('.el-card__body') as HTMLElement

      cardInnerHeigh.value =
        parseInt(cardMaxHeight.value) -
        parseInt(window.getComputedStyle(dom).paddingTop) -
        parseInt(window.getComputedStyle(dom).paddingBottom)
    }
  }, 0)
}

const cardRef = ref<CardInstance>()
const cardInnerHeigh = ref(0)

const cardStyle = computed(() => ({
  borderRadius: `${props.borderRadius}px`,
  maxHeight: cardMaxHeight.value
}))

onMounted(() => {
  if (props.isAutoHeight) {
    window.addEventListener('resize', getAutoHeight)
    getAutoHeight()
  }
})

onUnmounted(() => {
  if (props.isAutoHeight) {
    window.removeEventListener('resize', getAutoHeight)
    clearTimeout(resizeTimer)
  }
})

defineExpose({ cardInnerHeigh })
</script>

<template>
  <ElCard class="content-wrap ContentWrap" shadow="never" ref="cardRef" :style="cardStyle">
    <template #header v-if="title">
      <div class="flex items-center">
        <span class="text-16px font-700">{{ title }}</span>

        <ElTooltip v-if="message" placement="right" :content="message" class="ml-5px">
          <Icon :size="14" icon="ep:question-filled" />
        </ElTooltip>

        <slot name="header" class="flex flex-grow pl-20px"></slot>
      </div>
    </template>
    <div class="content-wrap-body">
      <slot></slot>
    </div>
  </ElCard>
</template>

<style lang="scss" scoped>
.ContentWrap {
  margin-bottom: 15px;
  background: #ffffff;
  border-color: #ffffff;
  box-shadow: 0px 2px 6px 0px rgba(52, 52, 52, 0.03);
}
</style>
