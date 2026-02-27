<template>
  <div class="home_page_card">
    <span class="home_page_title">业务日历</span>
    <span class="home_page_txt">功能开发中！</span>
    <div class="home_page_line">
      <span class="rest">休息</span>
      <span class="exigency right">紧急</span>
      <span class="urgent right">急</span>
      <span class="common right">普通</span>
    </div>
    <el-date-picker-panel v-model="dateValue" :border="false" />
  </div>
</template>

<script lang="ts">
export default { name: 'HomePageCalendar' }
</script>

<script lang="ts" setup>
const dateValue = ref<Date>(new Date())
</script>

<style lang="scss" scoped>
@use '../style.scss';

.home_page_line {
  margin: 20px 0 35px 0;
  font-size: 14px;

  .right {
    float: right;
    padding-left: 20px;
  }

  .rest::before {
    position: relative;
    top: 1px;
    display: inline-block;
    margin-right: 6px;
    width: 6px;
    height: 6px;
    background: #999999;
    border-radius: 50%;
    content: '';
    transform: translateY(-50%);
  }

  .common::before {
    position: relative;
    top: -3px;
    display: inline-block;
    margin-right: 6px;
    width: 10px;
    height: 2px;
    background: #0064ff;
    border-radius: 5px;
    content: '';
  }

  .urgent::before {
    position: relative;
    top: -3px;
    display: inline-block;
    margin-right: 6px;
    width: 10px;
    height: 2px;
    background: #ffad25;
    border-radius: 5px;
    content: '';
  }

  .exigency::before {
    position: relative;
    top: -3px;
    display: inline-block;
    margin-right: 6px;
    width: 10px;
    height: 2px;
    background: #eb3737;
    border-radius: 5px;
    content: '';
  }
}

.el-date-picker {
  margin-top: 10px;
  width: 100%;

  :deep() {
    .el-date-table-cell {
      height: 34px !important;
    }

    .el-date-table-cell__text {
      font-size: 14px;
      width: 28px !important;
      height: 28px !important;
      line-height: 28px !important;
    }

    .el-date-picker__header {
      padding: 0;
    }

    .el-picker-panel__content {
      margin: 0px;
      width: 100%;
    }
  }
}
</style>
