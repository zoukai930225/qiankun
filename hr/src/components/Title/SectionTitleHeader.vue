<template>
  <div class="section-title-header-wrap flex justify-between items-center w-full">
    <div class="flex items-center">
      <h3 class="section-title-header">
        <overflow-tooltip v-if="title" :content="title" />
        <template v-else>
          <slot></slot>
        </template>
      </h3>
      <slot name="left"></slot>
    </div>
    <slot name="right"></slot>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  hasDot: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: ''
  },
  titleSize: {
    type: String,
    default: ''
  }
})
</script>
<style scoped lang="scss">
.section-title-header {
  font-size: v-bind("titleSize || (hasDot ? '14px' : '16px')");
  font-weight: 500;
  color: #333333;
  width: 100%;
  line-height: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  &:before {
    display: v-bind("hasDot ? 'block' : 'none'");
    content: '';
    width: 3px;
    height: 10px;
    background-color: var(--el-color-primary);
    flex-shrink: 0;
  }
}
</style>
