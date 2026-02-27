<script lang="ts" setup>
const props = defineProps<{
  height?: string | number
}>()
defineSlots<{
  default?: () => any
  footer?: () => any
  header?: () => any
}>()
</script>

<template>
  <div class="dialog-flux-wrap" :style="{ height: props.height || '60vh' }">
    <section v-if="$slots.header" class="dialog-flux-header">
      <slot name="header"></slot>
    </section>
    <section class="dialog-flux-body" :class="{ 'mb-20px': $slots.footer }">
      <slot></slot>
    </section>
    <template v-if="$slots.footer">
      <div class="dialog-flux-footer">
        <slot name="footer"></slot>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.dialog-flux-wrap {
  position: relative;
  display: flex;
  flex-direction: column;
  .dialog-flux-body {
    flex: 1 0 auto;
    height: 0;
    background: #ffffff;
  }
  .dialog-flux-footer {
    background: #ffffff;
  }
}
</style>
