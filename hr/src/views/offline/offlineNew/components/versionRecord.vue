<template>
  <div
    class="record-item"
    :class="[!item?.serialNumber ? 'empty' : '', index === active ? 'is-active' : '']"
    v-for="(item, index) in list"
    @click.stop="chooseVersion(index)"
  >
    <div class="top">
      <span class="version">{{ index + 1 }}版</span>
      <span class="time">{{ item?.offlineNpSampleAuditRecord?.auditDate || '' }}</span>
    </div>
    <div class="bottom">
      <template v-if="item?.serialNumber">
        <div class="record-status">
          <lineAvatar :user="item?.offlineNpSampleAuditRecord?.auditUser" :size="16"></lineAvatar>
          <span class="status">{{
            item?.offlineNpSampleAuditRecord?.auditResult === 2 ? '审核拒绝' : ''
          }}</span>
        </div>
        <div class="remark">{{ item?.offlineNpSampleAuditRecord?.remark || '-' }}</div>
      </template>
      <template v-else>
        <div class="empty"> 当前提交 </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import lineAvatar from '@/components/template/table/components/lineAvatar.vue'
type User = {
  avatarOrigin: string
  name: string
  userId: string
}
type Record = {
  auditDate: string
  auditResult: number
  remark: string
  patternSerialNumber: number
  sampleSerialNumber: number
  auditUser: User
}

type ListItem = {
  serialNumber: number
  createAt: string
  avatarOrigin: string
  name: string
  remark: string
  status: string
  offlineNpSampleAuditRecord: Record
}
const props = defineProps({
  list: {
    type: Array<ListItem>,
    default: () => []
  },
  active: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(['choose'])

const chooseVersion = (index: number) => {
  emits('choose', index)
}
</script>

<style lang="scss" scoped>
.record-item {
  border: solid #e5e5e5 1px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 10px;
  box-sizing: border-box;
  overflow: hidden;
  height: 116px;
  position: relative;
  &:hover,
  &.is-active {
    border: 1px solid rgba(104, 127, 243, 0.2) !important;
    background: linear-gradient(179deg, #ffffff 1%, #f4f5fc 98%);
    &::after {
      position: absolute;
      content: '';
      width: 24px;
      height: 3px;
      border-radius: 10px;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(104, 127, 243, 0.4) 25%,
        rgba(104, 127, 243, 0.4) 78%,
        rgba(255, 255, 255, 0) 100%
      );
      bottom: 4px;
      left: calc(50% - 12px);
      z-index: 1;
    }
  }
  &:hover {
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
  }
  &.is-active {
    border: 1px solid #687FF3 !important;
  }
  &.empty {
    border: 1px dashed #e5e5e5;
    .top {
      background: transparent;
    }
  }
  .top {
    padding: 5px 9px;
    background: linear-gradient(90deg, #e6ecfd 0%, rgba(230, 236, 253, 0) 99%);
    line-height: 20px;
    .version {
      font-size: 14px;
      color: #333333;
      font-weight: 500;
    }
    .time {
      padding-left: 10px;
      font-size: 12px;
      color: #99a1c8;
    }
  }
  .bottom {
    padding: 10px 9px;
    .empty {
      width: 100%;
      display: flex;
      justify-content: center;
      min-height: 66px;
      font-size: 14px;
      color: #9e9e9e;
      word-break: break-all;
      padding-top: 10px;
    }
    .record-status {
      display: flex;
      align-items: center;
      font-size: 14px;
      .status {
        color: #e43636;
        padding-left: 10px;
      }
    }
    .remark {
      color: #333333;
      font-size: 14px;
      width: 100%;
      word-break: break-all;
      padding-top: 6px;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2; /* 限制显示的行数 */
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>
