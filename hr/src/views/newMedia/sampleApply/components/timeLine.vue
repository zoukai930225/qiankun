<template>
  <div>
    <div class="audit-content" v-if="getLoadList.length">
      <div class="audit-content-item" v-for="(value, index) in getLoadList" :key="index">
        <div class="row">
          <div class="audit-time">{{ value.createdAt || value.approvalTime }}</div>
          <div
            class="audit-timeLine"
            :class="{ 'audit-timeLineLast': index === getLoadList.length - 1 }"
          >
            <img
              class="audit-icon"
              :src="getStyleByStatus(value.approveStatus)?.icon"
              alt=""
            />
          </div>

          <div
            style="
              display: flex;
              flex-direction: column;
              width: calc(100% - 200px);
              margin-bottom: 24px;
            "
          >
            <div class="title">
              <div class="audit-person">{{ value.operator  }}</div>
              <div
                class="audit-status"
                :style="{
                  color:getStyleByStatus(value.approveStatus)?.color}"
              >
                {{
                  getStyleByStatus(value.approveStatus)?.text
                }}
              </div>
            </div>
            <div
              class="audit-remark"
            
            >
              {{value.approveMsg || '无' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import timeLine_submit from '@/assets/imgs/supplier/timeLine_submit.svg'
import timeLine_pass from '@/assets/imgs/supplier/timeLine_pass.svg'
import timeLine_nopass from '@/assets/imgs/supplier/timeLine_nopass.svg'
// import arrowUp from '@/assets/imgs/supplier/arrowUp.svg'
// import arrowDown from '@/assets/imgs/supplier/arrowDown.svg'

const props = defineProps({
  auditLogs: {
    type: Array as any,
    default: () => []
  }
})
const getLoadList = ref<any>([])
watch(
  () => props.auditLogs,
  (val) => {
    getLoadList.value =
      val.map((item) => ({
        ...item,
        isExpand: true
      })) || []
  }
)

const toggleExpand = (index) => {
  getLoadList.value[index].isExpand = !getLoadList.value[index].isExpand
}
// 审批状态：0=已提交; 1=上级审核通过; 2=上级审核拒绝; 3=样品管理员审核通过; 4=样品管理员审核拒绝
const getStyleByStatus = (status) => {
    let icon,color,text
    switch(String(status)){
        case '0':
            icon = timeLine_submit
            color = '#666'
            text = '已提交'
            break;
        case '1':
            icon = timeLine_pass
            color = '#349B34'
            text = '上级审核通过'
            break;
        case '2':
            icon = timeLine_nopass
            color = '#EB3737'
            text ='上级审核拒绝'
            break;
        case '3':
            icon = timeLine_pass
            color = '#349B34'
            text = '样品管理员审核通过'
            break;
        case '4':
            icon = timeLine_nopass
            color = '#EB3737'
            text ='样品管理员审核拒绝'
            break;
    }
    return{
        icon,
        color,
        text
    }
}
</script>

<style scoped lang="scss">
.audit-content {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  .audit-time {
    font-size: 14px;
    width: 180px;
    color: #8c8e90;
  }
  .audit-timeLine {
    display: flex;
    width: 1px;
    height: auto;
    margin-right: 30px;
    background: #d8dce5;
    .audit-icon {
      margin-left: -10px;
      width: 22px;
      height: 22px;
    }
  }
  .audit-timeLineLast {
    background: transparent;
  }

  .title {
    display: flex;
    .audit-person {
      color: #333;
      font-size: 14px;
      font-weight: 600;
      min-width: 100px;
    }
    .audit-status {
      font-size: 14px;
      margin-left: 20px;
    }
    .expandBtn {
      margin-left: 20px;
      display: flex;
      align-items: center;
      .line {
        width: 1px;
        height: 10px;
        background: #e5e5e5;
      }
      .expand {
        margin-left: 14px;
        color: #0064ff;
        font-size: 14px;
        display: flex;
        align-items: center;
        cursor: pointer;
        &:hover {
          opacity: 0.8;
        }
        img {
          margin-left: 6px;
        }
      }
    }
  }

  .audit-remark {
    font-size: 12px;
    color: #242527;
    margin-top: 10px;
    // width: 100%;
    padding: 10px;
    border-radius: 4px;
    background: #f4f4f4;
  }
}
</style>
