<template>
  <div class="change-tag row-center" :class="`change-tag_${changeType}`">
    {{ Number(changeType) === 0 ? '是' : '否' }}
  </div>
</template>
<script lang="ts" setup>
defineProps({
  changeType: {
    type: [String, Number],
    default: ''
  }
})
</script>
<style lang="scss" scoped>
.change-tag {
  font-family: PingFang SC;
  font-size: 14px;
  line-height: 1;
  height: 28px;
  padding: 0 16px;
  border-radius: 50px;

  &_1 {
    color: #666666;
    background: rgba(102, 102, 102, 0.1);
  }

  &_0 {
    color: #EB3737;
    background: rgba(235, 55, 55, 0.1);
  }
}
</style>