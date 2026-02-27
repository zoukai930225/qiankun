<template>
  <div
    :class="['audit-content', examineRecords && examineRecords.length > showNum ? 'noPadding' : '']"
  >
    <div class="audit-content-item" v-for="(value, index) in getLoadList()" :key="index">
      <div class="row">
        <div class="audit-time">{{ value.updatedAt }}</div>
        <div
          class="audit-timeLine"
          :class="{ 'audit-timeLineLast': index === getLoadList().length - 1 }"
        >
          <!-- <img
            class="audit-icon"
            v-if="value.examineStatus === '1'"
            src="@/assets/svgs/failed.svg"
            alt=""
          /> -->
          <img class="audit-icon" src="@/assets/svgs/done.svg" alt="" />
        </div>

        <div style="display: flex; flex-direction: column; margin-bottom: 20px; width: 100%">
          <div class="audit-title">
            <div class="audit-person">
              <el-avatar :src="value.tx || DefaultAvatar" :size="20" />
              <span class="name">{{ value.userName }}</span>
            </div>
            <div class="audit-status" :style="{ color: '#349B34' }">
              {{ value.type === 1 ? '视觉提交' : '运营确认' }}
            </div>
          </div>
          <div class="audit-remark" v-if="value.imgUrl">
            <el-image
              :src="value.imgUrl"
              :preview-teleported="true"
              :preview-src-list="[value.imgUrl]"
              style="width: 54px; height: 54px; z-index: 999"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="examineRecords && examineRecords.length > showNum" class="expandMore">
      <div class="expandMore-btn" @click="isExpand = !isExpand">
        <div class="expandMore-btn-text">{{ isExpand ? '收起' : '展开' }}</div>
        <img
          v-if="isExpand"
          class="expandMore-btn-arrow"
          src="@/assets/imgs/oa/arrow_up_blue.png"
          alt=""
        />
        <img
          v-if="!isExpand"
          class="expandMore-btn-arrow"
          src="@/assets/imgs/oa/arrow_down_blue.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import { defineProps } from 'vue'

const props = defineProps({
  onShow: {
    type: Boolean,
    default: false
  },
  examineRecords: {
    type: Array as any,
    default: () => []
  },
  recordLoading: {
    type: Boolean,
    default: false
  },
  showNum: {
    type: Number,
    default: 3
  }
})
const isExpand = ref(false)

const getLoadList = () => {
  if (isExpand.value) {
    return props.examineRecords || []
  } else {
    if (props.examineRecords && props.examineRecords.length > props.showNum) {
      return props.examineRecords.slice(0, props.showNum)
    } else {
      return props.examineRecords || []
    }
  }
}
</script>

<style scoped lang="scss">
.audit-content {
  padding: 20px;
  border-radius: 4px;
  background: #f8f8f9;
  box-sizing: border-box;
  &.noPadding {
    padding-bottom: 0;
  }
  .audit-time {
    font-size: 12px;
    width: 170px;
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
        margin-left: 4px;
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
    font-size: 14px;
    color: #333;
    word-break: break-all;

    .img {
      width: 54px;
      height: 54px;
    }
  }
}

.expandMore {
  border-top: 1px solid #e5e5e5;
  height: 38px;
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
