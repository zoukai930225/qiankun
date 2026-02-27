<template>
  <div class="line-body">
    <div ref="txtRef" :class="'line-txt'" :style="style" @mouseenter="onOpen" @mouseleave="onHide">
      <span @click="clickItem">{{ txt }}</span>
      <img v-if="isClick && isCopy" class="copy_tips" :src="icon || copyIcon" alt="" @click="copy" />
    </div>
    <el-popover :placement="(placement as any)" ref="popoverRef" :virtual-ref="txtRef" :width="width" virtual-triggering
      :visible="visible" :effect="effect" :content="txt" />
  </div>
</template>

<script lang="ts">
export default { name: 'LineTxt' };
</script>

<script setup lang="ts">
import { FromProvideType } from '../../config/type';
import { handleCopyCode } from '@/utils/copyText';
import copyIcon from '@/assets/imgs/common/copy.png'

const txtRef = ref(), width = ref<number>(150), visible = ref<boolean>(false);

const props = defineProps({
  txt: { type: String, default: '' },
  info: { type: Object, default: () => ({ scope: {}, col: {} }) },
  placement: { type: String, default: 'top' },
  effect: { type: String, default: 'dark' },
  height: { type: Number, default: 16 },
  lineHeight: { type: Number, default: 16 },
  isCopy: { type: Boolean, default: false },
  isClick: { type: Boolean, default: false },
  name: { type: String, default: '' },
  style: { type: Object, default: () => { } },
  icon: { default: null },
});

const { customTrigger } = inject(`${props.name}Form`, { customTrigger: (scope: any, col: any) => { } }) as FromProvideType

const clickItem = () => {
  if (props.isClick) {
    customTrigger(props.info.scope, props.info.col);
  }
  if (!props.isClick && props.isCopy) {
    copy();
  }
};

const onOpen = () => {
  visible.value = (txtRef?.value?.offsetWidth || 0) < (txtRef?.value?.scrollWidth || 0);
  width.value = txtRef?.value?.offsetWidth || 150;
};

const onHide = () => {
  visible.value = false;
};

const copy = () => {
  props.isCopy && handleCopyCode(props.txt);
};

</script>

<style scoped lang="scss">
.line-body {
  display: inline-block;
  width: 100%;



  .line-txt {
    vertical-align: bottom;
    color: #333;
    height: 100%;
    cursor: pointer;
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    min-height: 15px;

    .copy_tips {
      margin: 2px 0 0 5px;
      width: 12px;
      height: 12px;
      display: inline-block;
      cursor: pointer;
    }
  }
}
</style>
