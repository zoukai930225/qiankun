<template>
  <div class="statistics-panel" v-loading="loading">
    <div
      v-for="(item, index) in displayedItems"
      :key="item.key || index"
      class="statistics-card"
      @click="handleClick(item, index)"
    >
      <div class="statistics-card__label">{{ item.label }}</div>
      <div class="statistics-card__value">{{ item.display }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { numberFormatter } from '@/utils/formatter'

interface StatisticItem {
  key?: string | number
  label: string
  value?: number | string | null
}

const props = withDefaults(
  defineProps<{
    items: StatisticItem[]
    loading?: boolean
  }>(),
  {
    items: () => [],
    loading: false
  }
)

const emit = defineEmits<{
  (e: 'item-click', item: StatisticItem, index: number): void
}>()

const handleClick = (item: StatisticItem, index: number) => {
  emit('item-click', item, index)
}

const displayedItems = computed(() =>
  props.items.map((item) => {
    if (item.value === null || item.value === undefined || item.value === '') {
      return { ...item, display: '-' }
    }
    const num = Number(item.value)
    if (Number.isFinite(num)) {
      return {
        ...item,
        display: numberFormatter(num, { maximumFractionDigits: 0, minimumFractionDigits: 0 })
      }
    }
    return { ...item, display: String(item.value) }
  })
)
</script>

<style scoped lang="scss">
.statistics-panel {
  display: flex;
  background: #f8f8f9;
  border-radius: 4px;
  border: 1px solid #dde2e9;
}

.statistics-card {
  flex: 1 0 auto;
  width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 30px;
  position: relative;
  cursor: pointer;
  border-radius: 8px;

  &:hover {
    background: #f4f8ff;

    .statistics-card__value {
      color: #0064ff;
    }
  }

  &__label {
    font-size: 14px;
    color: #666666;
    margin-bottom: 20px;
  }

  &__value {
    font-size: 28px;
    font-weight: normal;
    color: #000716;
  }

  &:not(:last-child):after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0;
    width: 1px;
    height: 78%;
    background: #dde2e9;
  }
}
</style>
