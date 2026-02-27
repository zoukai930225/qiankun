<template>
  <div class="advance-switch">
    <Transition :name="transitionName">
      <div v-show="active === 'first'" ref="firstEl" class="advance-content">
        <slot name="first"></slot>
      </div>
    </Transition>
    <Transition :name="transitionName">
      <div v-show="active === 'second'" ref="secondEl" class="advance-content">
        <slot name="second"></slot>
      </div>
    </Transition>
  </div>
</template>

<script lang="tsx">
export default { name: 'Advance' }
</script>

<script lang="tsx" setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['change'])

const active = ref<'first' | 'second'>('first')
const direction = ref<'forward' | 'backward'>('forward')
const transitionName = computed(() =>
  direction.value === 'forward' ? 'slide-left' : 'slide-right'
)

const firstEl = ref<HTMLElement | null>(null)
const secondEl = ref<HTMLElement | null>(null)

const setActiveItem = (name: string) => {
  if (name !== 'first' && name !== 'second') return
  if (name === active.value) return
  const old = active.value
  direction.value = old === 'first' && name === 'second' ? 'forward' : 'backward'
  active.value = name
  emit('change', name, old)
}

const prev = () => setActiveItem(active.value === 'first' ? 'second' : 'first')
const next = () => setActiveItem(active.value === 'second' ? 'first' : 'second')

defineExpose({ prev, next, setActiveItem })
</script>

<style lang="scss" scoped>
.advance-switch {
  position: relative;
  display: grid;
  overflow: hidden;
  width: 100%;
}
.advance-content {
  width: 100%;
  grid-area: 1 / 1;
  will-change: transform, opacity;
  backface-visibility: hidden;
}

/* Slide Left (forward) */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition:
    transform 0.45s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-left-leave-active,
.slide-right-leave-active {
  position: absolute;
  inset: 0;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
.slide-left-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

/* Slide Right (backward) */
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-enter-to {
  transform: translateX(0%);
  opacity: 1;
}
.slide-right-leave-from {
  transform: translateX(0%);
  opacity: 1;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
