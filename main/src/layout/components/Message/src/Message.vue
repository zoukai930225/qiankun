<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import * as NotifyMessageApi from '@/api/system/notify/message'
import { Notification } from '@/layout/components/Notification'
defineOptions({ name: 'Message' })

const { push } = useRouter()
const activeName = ref('notice')
const unreadCount = ref(0) // 未读消息数量
const list = ref<any[]>([]) // 消息列表

// 测试消息提醒
// 创建一个ref来引用Notify组件
const notification = ref(null)

const showNotification = () => {
  notification.value?.showNotification()
}

// 获得消息列表
const getList = async () => {
  list.value = [
    {
      id: 1,
      templateNickname: '系统消息',
      templateContent:
        '标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称',
      createTime: new Date()
    },
    {
      id: 2,
      templateNickname: '系统消息',
      templateContent: '标题名称标题名称标题名称标题名称标题名称标题名称',
      createTime: new Date()
    },
    {
      id: 3,
      templateNickname: '系统消息',
      templateContent: '标题名称标题名称标题名称标题名',
      createTime: new Date()
    },
    {
      id: 4,
      templateNickname: '系统消息',
      templateContent: '标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称',
      createTime: new Date()
    },
    {
      id: 5,
      templateNickname: '系统消息',
      templateContent: '标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称',
      createTime: new Date()
    },
    {
      id: 6,
      templateNickname: '系统消息',
      templateContent: '标题名称标题名称标题名称标题名称标题名称标题名称标题名称标题名称',
      createTime: new Date()
    }
  ]
  // list.value = await NotifyMessageApi.getUnreadNotifyMessageList()
  // 强制设置 unreadCount 为 0，避免小红点因为轮询太慢，不消除
  unreadCount.value = 0
}

// 获得未读消息数
const getUnreadCount = async () => {
  // NotifyMessageApi.getUnreadNotifyMessageCount().then((data) => {
  //   unreadCount.value = data
  // })
}

// 跳转我的站内信
// const goMyList = () => {
//   push({
//     name: 'MyNotifyMessage'
//   })
// }

const handleClick = () => {
  console.log('---', '点击了通知消息')
}
// ========== 初始化 =========
onMounted(() => {
  // 首次加载小红点
  getUnreadCount()
  // 轮询刷新小红点
  setInterval(
    () => {
      getUnreadCount()
    },
    1000 * 60 * 2
  )
})
</script>
<template>
  <div class="message">
    <ElPopover
      :width="342"
      placement="bottom-end"
      :show-arrow="false"
      trigger="click"
      :popper-style="{ borderRadius: '10px' }"
    >
      <template #reference>
        <ElBadge :value="unreadCount" class="item" :hidden="unreadCount == 0">
          <Icon :size="18" class="cursor-pointer" icon="ep:bell" @click="getList" />
        </ElBadge>
      </template>
      <div class="message-container">
        <div class="message-header">
          <div class="message-header-title">通知公告({{ unreadCount }})</div>
          <div class="message-header-action" @click="showNotification">全部已读</div>
        </div>
        <div class="message-list" v-if="list.length > 0">
          <template v-for="item in list" :key="item.id">
            <div class="message-item">
              <img
                alt=""
                class="message-icon"
                src="@/assets/imgs/system/notify_message/icon1.png"
              />
              <div class="message-content">
                <span class="message-title">
                  {{ item.templateContent }}
                </span>
                <span class="message-date">
                  <img
                    src="@/assets/imgs/system/notify_message/icon_date.png"
                    alt=""
                    style="width: 10px; margin-right: 5px"
                  />
                  {{ formatDate(item.createTime) }}
                </span>
              </div>
            </div>
          </template>
        </div>
        <div class="message-empty" v-else>暂无消息</div>
      </div>
    </ElPopover>
    <Notification
      ref="notification"
      :title="'系统消息'"
      :content="`这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息这是一条系统消息`"
      :position="'bottom-right'"
      :dangerouslyUseHTMLString="true"
      :time="new Date()"
    />
  </div>
</template>

<style lang="scss">
.notification {
  // 底部显示时间
  .notification-time {
    font-size: 12px;
    color: #999999;
    .icon-date {
      width: 10px;
      margin-right: 5px;
    }
  }
  // 内容显示
  .notification-content {
    font-size: 14px;
    color: #666666;
    width: 320px;
    height: 75px;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  // 头部显示
  .notification-icon {
    margin-bottom: 10px;
    .icon-img {
      vertical-align: middle;
      width: 18px;
    }
    .notification-title {
      font-size: 16px;
      color: #333333;
      font-weight: bold;
    }
  }
}
</style>
<style lang="scss" scoped>
.message-container {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-title {
    font-weight: bold;
    font-size: 14px;
    color: #333333;
  }
  &-action {
    font-size: 12px;
    color: #0064ff;
    cursor: pointer;
    // margin-right: 10px;
  }
}

.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}
::-webkit-scrollbar {
  display: none;
}
.message-list {
  display: flex;
  height: 457px;
  flex-direction: column;
  overflow: scroll;
  // 隐藏滚动条

  .message-item {
    display: flex;
    padding: 15px 0;
    border-bottom: 1px solid var(--el-border-color-light);

    &:last-child {
      // border: none;
    }

    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }

    .message-content {
      display: flex;
      flex-direction: column;

      .message-title {
        margin-bottom: 6px;
        font-size: 14px;
        color: #333333;
        display: -webkit-box;
        -webkit-line-clamp: 2; //  限制在两行
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
      }

      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
