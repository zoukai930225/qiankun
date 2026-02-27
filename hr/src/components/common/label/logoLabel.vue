<template>
  <div class="title_body">
    <span :class="['title', isLogo ? 'title_before' : '']" :style="styleWdith">{{ txt || '' }}</span>
    <el-icon v-if="isEdit" class="edit" @click="onClick">
      <component :is="props.icon" />
    </el-icon>
  </div>

</template>

<script lang="tsx">
export default { name: 'LogoLabel' };
</script>

<script lang="tsx" setup>

const emit = defineEmits(['click']);

const props = defineProps({
  txt: { type: String, default: '' },
  width: { type: Number, default: 180 },
  isLogo: { type: Boolean, default: true },
  isEdit: { type: Boolean, default: true },
  icon: { type: String, default: 'EditPen' },
});

const styleWdith = computed(() => ({ maxWidth: `${props?.width || 180}px` }));

const onClick = () => {
  emit('click')
};

</script>
<style lang="scss" scoped>
.title_body {
  display: inline-block;

  .edit {
    margin-left: 10px;
    cursor: pointer;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .title_before {
    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 10px;
      position: absolute;
      background-color: #0064ff;
      left: 0px;
      top: 6px;
    }
  }

  .title {
    display: inline-block;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    text-align: left;
    font-style: normal;
    padding-left: 8px;
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
