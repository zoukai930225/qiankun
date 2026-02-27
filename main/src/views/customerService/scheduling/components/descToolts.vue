<!--
 * @Date: 2025-04-24 10:27:01
 早/中/晚班的时间段描述
-->
<template>
  <div class="desc-content">
    <div class="shift-item morning tooltips" v-if="showTooltips">
      <span class="midmorning midtoops"></span>
      <img src="@/assets/imgs/customerService/scheduling/info1.png" class="info" alt="" />
      <span class="shift-divider dividermorning midInfo"></span>
      <span class="shift-detail">如若来不及及时反馈，让组长或者主管一起接待</span>
    </div>

    <div class="shift-item morning">
      <span class="midstart midmorning"></span>
      <span class="shift-name">早班</span>
      <span class="shift-divider dividermorning"></span>
      <span class="shift-detail">线上接待早班时间 {{ morningTime }}</span>
    </div>

    <div class="shift-item middle">
      <span class="midstart midmiddle"></span>
      <span class="shift-name">中班</span>
      <span class="shift-divider dividermiddle"> </span>
      <span class="shift-detail">线上接待午班时间 {{ middleTime }}</span>
    </div>

    <div class="shift-item evening">
      <span class="midstart midevening"></span>
      <span class="shift-name">晚班</span>
      <span class="shift-divider dividerevening"> </span>
      <span class="shift-detail">线上接待晚班时间 {{ eveningTime }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const morningTime = '8:00-16:30'
const middleTime = '12:00-21:00'
const eveningTime = '15:30-24:00'

const props = defineProps({
  showTooltips: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="less" scoped>
.desc-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.shift-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  border-radius: 2px;
  height: 36px;
  padding: 0 10px 0 10px;
  box-sizing: border-box;
  margin-right: 20px;
  border-radius: 0px 8px 8px 0px;
  font-size: 14px;
  margin-bottom: 2px;
  // min-width: 300px;
}

.morning {
  background-color: #cef6e0;
}

.middle {
  background-color: #fff7e6;
}

.evening {
  background-color: #f6f1ff;
}
.midstart {
  width: 2px;
  height: 28px;
}
.info {
  width: 12px;
  height: 12px;
}
.midmorning {
  background-color: #00a500;
}

.midtoops {
  background-color: #b2d5fa;
}

.midmiddle {
  background-color: #ffa000;
}
.midevening {
  background: #7063d0;
}

.shift-name {
  font-size: 14px;
  color: #3d3d3d;
  margin: 0 10px 0 6px;
}

.shift-divider {
  width: 16.5px;
  height: 0px;
  transform: rotate(90deg);
}
.dividermorning {
  border: 1px solid #a7d0ba;
}
.midInfo {
  border: 1px solid #b2d5fa;
}
.dividermiddle {
  border: 1px solid #e8c895;
}
.dividerevening {
  border: 1px solid #c4c0e1;
}

.shift-detail {
  font-size: 14px;
  color: #555;
}
.tooltips {
  background-color: #f3f8ff;
  min-width: 350px;
}
</style>
