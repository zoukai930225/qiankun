<!--
 * @Date: 2024-10-22 14:15:32
-->
<template>
  <div>
    <div class="table-header">
      <div class="header-item" style="width: 18%">评价人</div>
      <div class="header-item" style="width: 18%">需评价问卷数</div>
      <div class="header-item" style="width: 18%">已评价问卷数</div>
      <div class="header-item" style="width: 18%">未评价问卷数</div>
      <div class="header-item" style="width: 15%">评价状态</div>
      <div class="header-item" style="width: 17%; text-align: center">操作</div>
    </div>
    <div class="content-table">
      <div class="content-wapper" v-for="(item, index) in list" :key="index">
        <div class="table-item" style="width: 18%">{{ item.evaluator }}</div>
        <div class="table-item" style="width: 18%">{{ item.needEvaluateCount }}</div>
        <div class="table-item" style="width: 18%">{{ item.evaluatedCount }}</div>
        <div class="table-item" style="width: 18%">{{ item.notEvaluateCount }}</div>
        <div class="table-item" style="width: 15%"
          ><div class="status">
            <img
              src="@/assets/imgs/otr/reviewInvitation/finish.png"
              v-if="formatStatus(item) == '已完成'"
              class="icon"
            />
            <img
              src="@/assets/imgs/otr/reviewInvitation/ing.png"
              v-if="formatStatus(item) == '进行中'"
              class="icon"
            />
            <img
              src="@/assets/imgs/otr/reviewInvitation/nostart.png"
              v-if="formatStatus(item) == '未开始'"
              class="icon"
            />
            <div class="desc">{{ formatStatus(item) }}</div></div
          ></div
        >
        <div class="table-item" style="width: 17%">
          <div class="btn-wapper flex-row">
            <div class="btn flex-row" @click="goDetail(item)"
              ><img src="@/assets/imgs/otr/reviewInvitation/btn-detail.png" class="btn-icon" /><span
                class="btn-desc"
                >评价详情</span
              ></div
            >
            <div class="btn flex-row" @click="sendInvite(item)" v-if="showBtn"
              ><img src="@/assets/imgs/otr/reviewInvitation/btn-people.png" class="btn-icon" /><span
                class="btn-desc"
                >发送邀请</span
              ></div
            >
          </div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['goDetail'])
import { invitationInvite } from '@/api/otr/reviewInvitation/index'
const message = useMessage() // 消息弹窗

const props = defineProps({
  inventoryId: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: () => []
  },
  showBtn: {
    type: Boolean,
    default: false
  }
})

const formatStatus = (item) => {
  // 未开始 => 未评价问卷数 = 需评价问卷数
  if (item.needEvaluateCount == item.notEvaluateCount) return '未开始'
  if (item.needEvaluateCount == item.evaluatedCount) return '已完成'
  return '进行中'
}

const goDetail = (item) => {
  emit('goDetail', item.evaluatorId)
}

const sendInvite = async (item) => {
  // 状态的二次确认
  await message.confirm('是否发送邀请?', '提示')
  await invitationInvite(props.inventoryId, item.evaluatorId)
  message.success('邀请成功')
}
</script>

<style lang="scss" scoped>
.table-header {
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
  .header-item {
    font-weight: 400;
    font-size: 14px;
    color: #666666;
  }
}
.content-wapper {
  display: flex;
  flex-direction: row;
  .table-item {
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    border-bottom: 1px solid #f0f0f0;
    padding: 15px 0;
    box-sizing: border-box;
    .btn-wapper {
      justify-content: center;
      .btn {
        cursor: pointer;
        margin-left: 15px;
        align-items: center;
        .btn-icon {
          width: 14px;
          height: 13px;
          margin-right: 4px;
        }
        .btn-desc {
          font-weight: 400;
          font-size: 14px;
          color: #0064ff;
        }
      }
    }

    .status {
      width: 80px;
      height: 22px;
      background: #f7f7f7;
      border-radius: 12px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;

      .icon {
        width: 12px;
        height: 12px;
        margin-right: 4px;
      }

      .desc {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
      }
    }
  }
}
.flex-row {
  display: flex;
  flex-direction: row;
}
.content-table {
  background: white;
  padding: 0 15px;
  box-sizing: border-box;
  border-radius: 8p x s;
}
</style>
