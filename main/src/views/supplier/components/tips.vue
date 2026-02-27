<template>
  <div class="tips">
    <div class="before"></div>
    <slot></slot>
    <slot name="link"></slot>
  </div>
</template>
<script lang="tsx" setup>
defineOptions({ name: 'Tips' })
</script>
<style lang="scss" scoped>
.tips {
  display: inline-block;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  text-align: left;
  font-style: normal;
  .before {
    display: inline-block;
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }
}
</style>
