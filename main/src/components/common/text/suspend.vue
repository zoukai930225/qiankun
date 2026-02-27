<template>
  <div class="suspend-body">
    <div ref="txtRef" :class="[clamp === 1 ? 'suspend-txt' : 'suspend-txt-clamp']" @mouseenter="onOpen"
      @mouseleave="onHide" :style="clamp !== 1 ? { '-webkit-line-clamp': clamp, ...style } : { ...style }">
      {{ txt }}</div>
    <el-popover :placement="(placement as any)" ref="popoverRef" :virtual-ref="txtRef" :width="width" virtual-triggering
      :visible="visible" :effect="effect" :content="txt" />
  </div>
</template>

<script setup lang="ts" name="SuspendTxt">

const txtRef = ref(), width = ref<number>(150), visible = ref<boolean>(false);

const props = defineProps({
  txt: { type: String, default: '' },
  placement: { type: String, default: 'top' },
  effect: { type: String, default: 'dark' },
  clamp: { type: Number, default: 1 },
  style: { type: Object, default: () => { } },
});

const onOpen = () => {
  if (props.clamp === 1) {
    visible.value = (txtRef?.value?.offsetWidth || 0) < (txtRef?.value?.scrollWidth || 0);
  } else {
    visible.value = ((txtRef?.value?.offsetHeight || 0) + 3) < (txtRef?.value?.scrollHeight || 0);
  }
  width.value = txtRef?.value?.offsetWidth || 150;
};

const onHide = () => {
  visible.value = false;
};

</script>

<style scoped lang="scss">
.suspend-body {
  display: inline-block;

  .suspend-txt {
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .suspend-txt-clamp {
    cursor: pointer;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    width: 100%;
  }
}
</style>
