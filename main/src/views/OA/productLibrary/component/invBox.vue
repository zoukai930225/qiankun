<template>
  <div class="box" :style="`color: ${color};background: ${bg};`">
    <div class="value">
      <transition-txt :txt="value" type="integer"></transition-txt>
    </div>
    <div class="key">{{ title }}</div>
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
  color: {
    type: String,
    default: '#349b34'
  },
  bg: {
    type: String,
    default: 'rgba(52, 155, 52, 0.1)'
  }
})
</script>

<style lang="scss" scoped>
.box {
  padding: 20px 10px;
  border-radius: 6px;
  box-sizing: border-box;
  flex: 1;
  text-align: center;
  margin-right: 20px;
  .value {
    font-family: OPPOSans;
    font-size: 28px;
    font-weight: bold;
  }
  .key {
    font-size: 14px;
    padding-top: 11px;
  }
}
</style>
