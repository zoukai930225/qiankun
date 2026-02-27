<!--
 * @Date: 2024-09-12 13:12:09
-->
<!--圆形进度条-->
<template>
  <div class="wapper">
    <el-progress
      type="circle"
      :percentage="percentage"
      :width="43"
      color="#0567fe"
      :stroke-width="5"
    >
      <template #default>
        <span class="percentage-noStart"></span>
        <span class="percentage-finish"></span>
      </template> </el-progress
  ></div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'Progress' })

const props = defineProps({
  percentage: {
    type: Number,
    default: 0
  }
})
</script>

<style scoped lang="scss">
.wapper {
  background: white;
  border-radius: 50%;
  width: 43px;
  height: 43px;
}

.percentage-noStart {
  display: block;
  width: 22px;
  height: 4px;
  background: #ccd1da;
  transform: translateX(50%);
}
</style>
