<template>
  <div class="container" :style="{ width: `${width}px`, height: `${height}px` }">
    <div class="x-axis-text">
      <div>低</div>
      <div>中</div>
      <div>
        <span>高</span>
        <span class="axis-name" style="margin: 0 0 0 5px">{{ xAxisName }}</span>
      </div>
    </div>
    <div class="y-axis-text">
      <div>
        <div class="axis-name" style="margin: 0 0 5px 0">{{ yAxisName }}</div>
        <div>高</div>
      </div>
      <div>中</div>
      <div>低</div>
    </div>
  </div>
</template>
<script setup lang="ts">
const emits = defineEmits([])
// 接受参数，横坐标X轴的名称,纵坐标Y轴的名称，并设置默认值；传入宽度和高度，并设置默认值
const props = defineProps({
  xAxisName: {
    type: String,
    default: 'X轴'
  },
  yAxisName: {
    type: String,
    default: 'Y轴'
  },
  width: {
    type: Number,
    default: 442
  },
  height: {
    type: Number,
    default: 423
  }
})
onMounted(() => {})
</script>
<style lang="scss" scoped>
.container {
  // width: 442px;
  // height: 423px;
  border: 1px solid #d2cece;
  border-right: none;
  border-top: none;
  position: relative;
  .x-axis-text {
    width: 100%;
    position: absolute;
    bottom: -25px;
    right: 0;
    display: flex;
    justify-content: space-between;
  }
  .y-axis-text {
    top: 0;
    width: 45px;
    height: 100%;
    text-align: right;
    position: absolute;
    left: -55px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .axis-name {
    color: #333;
  }
}
</style>
