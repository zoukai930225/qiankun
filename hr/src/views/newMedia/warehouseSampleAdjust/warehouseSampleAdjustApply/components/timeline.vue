<template>
  <div :class="['audit-content', auditLogs && auditLogs.length > showNum ? 'noPadding' : '']">
    <div class="audit-content-item" style="padding-left: 15px;" v-for="(value, index) in getLoadList()" :key="index">
      <div class="row">
        <div class="audit-time">{{ value.createdAt || value.approvalTime }}</div>
        <div class="audit-timeLine" :class="{ 'audit-timeLineLast': index === getLoadList().length - 1 }">
          <img class="audit-icon" :src="getStyleByStatus(value)?.icon" alt="" />
        </div>

        <div style="
          display: flex;
          flex-direction: column;
          margin-bottom: 20px;
          width: 100%;
        ">
          <div class="audit-title">
            <div class="audit-person">
              <el-avatar :src="value.applyUserAvatarOrigin || getSampleManagerInfo(value)?.avatar" :size="16" />
              <span class="name">{{ value.approverName || getSampleManagerInfo(value)?.name}}</span>
            </div>
            <div class="audit-status" :style="{
              color: getStyleByStatus(value)?.color
            }">
              {{
                getStyleByStatus(value)?.text
              }}
            </div>
          </div>
          <div class="audit-remark">
            {{ value.approvalOpinion }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="auditLogs && auditLogs.length > showNum" class="expandMore">
      <div class="expandMore-btn" @click="isExpand = !isExpand">
        <div class="expandMore-btn-text">{{ isExpand ? '收起' : '展开' }}</div>
        <img v-if="isExpand" class="expandMore-btn-arrow" :src="arrowUp" alt="" />
        <img v-if="!isExpand" class="expandMore-btn-arrow" :src="arrowDown" alt="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import { defineProps } from 'vue'
import timeLine_submit from '@/assets/imgs/supplier/timeLine_submit.svg'
import timeLine_pass from '@/assets/imgs/supplier/timeLine_pass.svg'
import timeLine_nopass from '@/assets/imgs/supplier/timeLine_nopass.svg'
import arrowUp from '@/assets/imgs/supplier/arrowUp.svg'
import arrowDown from '@/assets/imgs/supplier/arrowDown.svg'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'


const props = defineProps({
  auditLogs: {
    type: Array as any,
    default: () => []
  },
  showNum: {
    type: Number,
    default: 3
  },
})
const isExpand = ref(false)
const getLoadList = () => {
  if (isExpand.value) {
    return props.auditLogs
  } else {
    if (props.auditLogs && props.auditLogs.length > props.showNum) {
      return props.auditLogs.slice(0, props.showNum)
    } else {
      return props.auditLogs
    }
  }
}

// 样品管理员待审核状态(上级审核通过) 默认取第一个头像名字
const getSampleManagerInfo = (node:any)=>{
  if(String(node.approvalNode) === '20'){
    if(node.personRosterList){
      return {
        avatar:node.personRosterList[0].avatarOrigin,
        name:node.personRosterList[0].name
      }
    }else{
      return{
        avatar:DefaultAvatar,
        name:''
      }
    }
  }else{
    return{
        avatar:DefaultAvatar,
        name:''
      }
  }
}


// 审批状态
const getStyleByStatus = (item) => {
  let icon, color, text, result
  switch (String(item.approvalResult)) {
    case '2':
      icon = timeLine_nopass
      color = '#EB3737'
      result = '审核拒绝'
      break;
    case '1':
      icon = timeLine_pass
      color = '#349B34'
      result = '审核通过'
      break;
    case '3':
      icon = timeLine_submit
      color = '#666'
      result = '待审核'
      break;
  }
  switch (String(item.approvalNode)) {
    case '0':
      icon = timeLine_pass
      color = '#349B34'
      text = '已提交'
      break;
    case '10':
      text = `上级${result}`
      break;
    case '20':
      text = `样品管理员${result}`
      break;
  }

  return {
    icon,
    color,
    text
  }
}
</script>

<style scoped lang="scss">
.audit-content {
  height: 100%;
  padding: 20px;
  border-radius: 4px;
  background: #f8f8f9;
  box-sizing: border-box;

  &.noPadding {
    padding-bottom: 0;
  }

  .audit-time {
    font-size: 12px;
    width: 181px;
    color: #8c8e90;
  }

  .audit-timeLine {
    display: flex;
    width: 1px;
    height: auto;
    margin-right: 20px;
    background: #d8dce5;

    .audit-icon {
      margin-left: -7.5px;
      margin-top: -3px;
      width: 19px;
      height: 19px;
    }
  }

  .audit-timeLineLast {
    background: transparent;
  }

  .audit-title {
    margin-top: -1px;
    padding-bottom: 3px;
    display: flex;
    align-items: center;

    .audit-person {
      display: flex;
      align-items: center;
      margin-right: 10px;

      .name {
        font-size: 14px;
        margin-left: 8px;
        color: #333;
      }
    }
  }

  .audit-status {
    font-size: 14px;
    color: #349b34;
  }

  .audit-remark {
    margin-top: 6px;
    font-size: 12px;
    color: #242527;
    font-weight: 400;
    word-break: break-all;

    .img {
      width: 54px;
      height: 54px;
    }
  }
}

.expandMore {
  border-top: 1px solid #e5e5e5;
  height: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: -20px;
  width: calc(100% + 40px);

  &-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    height: 38px;

    &-text {
      margin-left: auto;
      font-size: 14px;
      line-height: 22px;
      text-align: center;
      color: #0059e8;
    }

    &-arrow {
      margin-left: 5px;
      margin-right: auto;
      width: 14px;
      height: 14px;
    }
  }
}
</style>
