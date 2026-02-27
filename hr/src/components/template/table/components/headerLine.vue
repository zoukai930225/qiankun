<template>
  <div class="header_line">
    <div v-if="!info?.isHeaderCustom">
      <span class="header_txt"> {{ info.title }}</span>
      <img v-if="!!info?.tips" :src="tips" alt="" class="tips" ref="txtRef" @mouseenter="onOpen" @mouseleave="onHide" />
      <el-popover :placement="(placement as any)" ref="popoverRef" :virtual-ref="txtRef" :width="width"
        virtual-triggering :visible="visible" :effect="effect">
        <div v-html="info.tips" />
      </el-popover>
    </div>
    <component v-else :is="info.customHeaderRender(info)" />
  </div>
</template>

<script lang="ts">
export default { name: 'HeaderLine' };
</script>

<script setup lang="ts">
import tips from "@/assets/svgs/common/tips.svg";

const txtRef = ref(), width = ref<number>(150), visible = ref<boolean>(false);

const props = defineProps({
  info: { type: Object, default: () => { } },
  placement: { type: String, default: 'top' },
  effect: { type: String, default: 'dark' },
});

const onOpen = () => {
  visible.value = true;
  width.value = props.info.tipsWidth || 150;
};

const onHide = () => {
  visible.value = false;
};

</script>

<style scoped lang="scss">
.header_line {
  display: inline-flex;

  .header_txt {}

  .tips {
    cursor: pointer;
    display: inline-block;
    margin-left: 5px;
  }
}
</style>
