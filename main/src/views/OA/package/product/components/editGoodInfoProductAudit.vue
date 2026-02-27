<template>
  <div>
    <div class="form-wapper1">
      <div class="form-wapper1-header">
        <div class="form-wapper1-header-line"></div>
        <div class="form-wapper1-header-title">审核意见</div>
      </div>
    </div>
    <div class="audit-content">
      <div class="audit-content-item" v-for="(value, index) in getLoadList()" :key="index">
        <div class="row">
          <div class="audit-time">{{ value.examineTime }}</div>
          <div
            class="audit-timeLine"
            :class="{ 'audit-timeLineLast': index === getLoadList().length - 1 }"
          >
            <img
              class="audit-icon"
              v-if="value.examineStatus === '1'"
              src="@/assets/imgs/oa/audit_fali.png"
              alt=""
            />
            <img
              class="audit-icon"
              v-if="value.examineStatus === '2'"
              src="@/assets/imgs/oa/audit_pass.png"
              alt=""
            />
          </div>

          <div
            style="
              display: flex;
              flex-direction: column;
              width: calc(100% - 168px);
              margin-bottom: 20px;
            "
          >
            <div
              class="audit-status"
              :style="{ color: value.examineStatus === '2' ? '#349B34' : '#EB3737' }"
              >{{
                value.examineStatus === '2'
                  ? '审核通过'
                  : value.examineStatus === '1'
                    ? '审核拒绝'
                    : ''
              }}</div
            >
            <div class="audit-remark">{{ value.examineRemark }}</div>
          </div>
        </div>
      </div>
      <div v-if="examineRecords && examineRecords.length > 5" class="exandMore">
        <div class="exandMore-btn" @click="isExpand = !isExpand">
          <div class="exandMore-btn-text">{{ isExpand ? '收起' : '展开' }}</div>
          <img
            v-if="isExpand"
            class="exandMore-btn-arrow"
            src="@/assets/imgs/oa/arrow_up_blue.png"
            alt=""
          />
          <img
            v-if="!isExpand"
            class="exandMore-btn-arrow"
            src="@/assets/imgs/oa/arrow_down_blue.png"
            alt=""
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps({
  onShow: {
    type: Boolean,
    default: false
  },
  examineRecords: {
    type: Array,
    default: () => []
  }
})
const isExpand = ref(false)

const getLoadList = () => {
  if (isExpand.value) {
    return props.examineRecords || []
  } else {
    if (props.examineRecords && props.examineRecords.length > 5) {
      return props.examineRecords.slice(0, 5)
    } else {
      return props.examineRecords || []
    }
  }
}
</script>

<style scoped lang="scss">
.form-wapper1 {
  width: calc(100%);
  display: flex;
  &-header {
    height: 52px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 20px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 16px;
    width: 100%;
    &-line {
      width: 3px;
      height: 10px;
      background: #0064ff;
    }
    &-title {
      padding-left: 6px;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      letter-spacing: normal;
      color: #333333;
    }
  }
  &-form {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
  }
}
.audit-content {
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 4px;
  background: #f8f8f9;
  box-sizing: border-box;

  /* 应用/边框 */
  border: 1px solid #e5e5e5;

  padding-left: 30px;
  padding-right: 20px;
  padding-top: 20px;
  .audit-time {
    font-size: 12px;
    width: 141px;

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
      width: 16px;
      height: 16px;
    }
  }
  .audit-timeLineLast {
    background: transparent;
  }

  .audit-status {
    font-size: 14px;
    margin-top: -1px;
    padding-bottom: 3px;

    color: #349b34;
  }
  .audit-remark {
    font-size: 12px;

    color: #242527;
  }
}

.exandMore {
  border-top: 1px solid #e5e5e5;
  height: 38px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: -30px;
  width: calc(100% + 52px);
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
