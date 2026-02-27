<template>
  <div class="box">
    <div class="key">{{ title }}</div>
    <div class="value">
      <transition-txt :txt="value" :type="type" :isFloor="false"></transition-txt>
    </div>
  </div>
</template>

<script setup lang="ts">
import transitionTxt from '@/views/OA/new/productListDashboard/category/components/transitionTxt.vue';
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    default: 'none',
    validator: (val: string) => ['none', 'number', 'amount', 'percent', 'integer'].includes(val)
  },
  isFloor: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.box {
  padding: 20px;
  background: #f4f6fa;
  border-radius: 8px;
  min-width: 216px;
  box-sizing: border-box;
  flex: 1;
  margin-right: 14px;
  color: #333333;
  &:last-child {
    margin: 0;
  }
  .key {
    font-size: 14px;
    color: #666666;
    margin-bottom: 8px;
    height: 20px;
    line-height: 20px;
  }
  .value {
    font-family: OPPOSans;
    font-size: 24px;
    font-weight: 700;
    // color: #333333;
    height: 32px;
    line-height: 32px;
  }
}
</style>
