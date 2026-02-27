<template>
  <div
    class="planType"
    style="width: 60px; height: 28px; border-radius: 14px; line-height: 28px; text-align: center"
    :style="{
      background: getBackgroundColor,
      color: getPlanColor
    }"
  >
    {{ getPlayTypeName() }}
  </div>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getDictLabel } from '@/utils/dict'

const props = defineProps({
  planType: {
    type: String,
    default: ''
  },
  fieldCode: {
    type: String,
    default: 'planType'
  },
  planName: {
    type: String,
    default: ''
  }
})

const getBackgroundColor = computed(() => {
  if (props.fieldCode === 'productType') {
    if (Number(props.planType || '') === 1) {
      return '#FFF4C8'
    }
  }
  if (Number(props.planType || '') === 0) {
    return '#B7EEF6'
  } else if (Number(props.planType || '') === 1) {
    return '#FFDCF0'
  } else if (Number(props.planType || '') === 2) {
    return '#D6EBD6'
  } else if (Number(props.planType || '') === 3) {
    return '#CCE0FF'
  }
  return '#B7EEF6'
})

const getPlanColor = computed(() => {
  if (props.fieldCode === 'productType') {
    if (Number(props.planType || '') === 1) {
      return '#CD8200'
    }
  }

  if (Number(props.planType || '') === 0) {
    return '#03A3B6'
  } else if (Number(props.planType || '') === 1) {
    return '#F35CAA'
  } else if (Number(props.planType || '') === 2) {
    return '#349B34'
  } else if (Number(props.planType || '') === 3) {
    return '#0064FF'
  }
  return '#03A3B6'
})

const getPlayTypeName = () => {
  if (props.fieldCode === 'productType') {
    return getDictLabel(DICT_TYPE.NP_CATEGORY_PRODUCT_TYPE, Number(props.planType || '')) || '--'
  }
  if (props.fieldCode === 'planProductType') {
    return getDictLabel(DICT_TYPE.NP_ENTERPRISE_PRODUCTTYPE, Number(props.planType || '')) || '--'
  }

  return getDictLabel(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, Number(props.planType || '')) || '--'
}
</script>

<style lang="less" scoped>
.planType {
}
</style>
