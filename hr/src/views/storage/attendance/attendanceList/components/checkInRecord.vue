<template>
  <div
    class="caseTag night"
    :class="{
      late: attendanceStatus === '0' || attendanceStatus === 0,
      early: attendanceStatus === '1' || attendanceStatus === 1,
      lack: attendanceStatus === '2' || attendanceStatus === 2,
      leave: attendanceStatus === '3' || attendanceStatus === 3 || leaveType === '请假',
      vacation: attendanceStatus === '4' || attendanceStatus === 4 || leaveType === '休假',
      normal: attendanceStatus === '5' || attendanceStatus === 5,
      line: line
    }"
  >
    {{
      attendanceStatus !== undefined
        ? AttendanceStatusText[attendanceStatus === undefined ? '6' : attendanceStatus]
        : leaveType
    }}
  </div>
</template>
<script lang="ts" setup>
defineProps<{
  attendanceStatus?: string | number
  leaveType?: string
  line?: boolean
}>()

const AttendanceStatusText = {
  '0': '迟到',
  '1': '早退',
  '2': '缺卡',
  '3': '请假',
  '4': '休假',
  '5': '正常',
  '6': '夜班'
}
</script>
<style lang="less" scoped>
.night {
  background-color: #fff5e3;
  color: #db6a0f;
}

.caseTag {
  width: 40px;
  height: 20px;
  border-radius: 2px;
  font-size: 12px;
  line-height: 19px;
  text-align: center;
  position: relative;
  margin-left: 10px;

  &.late {
    background-color: rgba(242, 105, 46, 0.1) !important;
    color: #f37844 !important;
  }
  &.early {
    background-color: rgba(255, 171, 3, 0.1) !important;
    color: #ffa903 !important;
  }
  &.lack {
    background-color: rgba(235, 55, 55, 0.1) !important;
    color: #eb3737 !important;
  }

  &.vacation {
    background-color: #e3fffb !important;
    color: #359b97 !important;
  }

  &.leave {
    background-color: #e6f3ff !important;
    color: #0064ff !important;
  }

  &.normal {
    background-color: rgba(52, 155, 52, 0.1) !important;
    color: #349b34 !important;
  }

  &.line {
    margin-right: 20px;
  }

  &.line::before {
    content: '';
    display: block;
    height: 12px;
    margin-top: 4px;
    border-left: 1px solid #f0f0f0;
    position: absolute;
    left: -11px;
  }
}
</style>
