/*
 * @Date: 2025-04-28 16:36:20
 */

export const popItem = ref([
  {
    name: '早班',
    value: 'MORNING'
  },
  {
    name: '中班',
    value: 'NOON'
  },
  {
    name: '晚班',
    value: 'EVENING'
  },
  {
    name: '假期',
    value: 'VOCATION'
  },
  {
    name: '培训',
    value: 'TRAIN'
  },
  {
    name: '休息',
    value: 'REST'
  }
])

export const stateMap = ref({
  MORNING: '早',
  EVENING: '晚',
  REST: '休',
  NOON: '中',
  VOCATION: '假',
  TRAIN: '培',
  NULL: '未安排'
})
