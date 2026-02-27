<script lang="ts" setup>
import bellImage from '@/assets/imgs/home/bell.svg'
import { userMessageStore } from '@/store/modules/userMessage'
const useUserMessageStore = userMessageStore()
import NotificationMessage from './components/NotificationMessage.vue'
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore()
import dayjs from 'dayjs';
import { formatPast } from '@/utils/formatTime'
import { cloneDeep } from 'lodash-es';
const props: any = {
  icon: bellImage,
  duration: 0,
  position: 'bottom-right', // 通知位置
  dangerouslyUseHTMLString: false,
  showClose: false,
  offset: 0,
  zIndex: 2000,
}

const notify = ref<any>()
const router = useRouter() // 路由对象

const showNotification = () => {
  notify.value = ElNotification({
    message: h(NotificationMessage, {
      data: messageData.value,
      onLink: (item: any) => {
        router.push({ path: item.path, query: item.query })
      }
    }),
    duration: props.duration,
    position: props.position, // 通知位置
    customClass: 'custom-user-notification', // 自定义类名，用于覆盖默认样式
    dangerouslyUseHTMLString: props.dangerouslyUseHTMLString,
    showClose: props.showClose,
    offset: props.offset,
    zIndex: props.zIndex,
    onClick: () => {

    },
    onClose: () => {

    }
  })
}

const closeNotification = () => {
  if (notify.value) {
    notify.value?.close()
  }
}

watch(() => useUserMessageStore.getNotifyVisible, (newVal) => {
  if (newVal) {
    closeNotification()
    setTimeout(() => {
      showNotification()
    }, 100)
  } else {
    closeNotification()
  }
})
const messageData = ref<any[]>([])
const getMessage = async () => {
  useUserMessageStore.closeNotify()
  let data: any[] = cloneDeep(await userStore.messagSocket?.getMessageData())

  data.map(item => {
    if (dayjs().subtract(1, 'day').isAfter(dayjs(item.dateTime))) {
      item.showTime = item.dateTime
    } else {
      item.showTime = formatPast(item.dateTime)
    }
  })
  useUserMessageStore.updateMessageCount(data.length)
  messageData.value = data
  console.log("messageData.value ", messageData.value)
  if (messageData.value?.length === 0) {
  } else {
    setTimeout(() => {
      useUserMessageStore.showNotify()
    }, 100)
  }
}


watch(() => useUserMessageStore.getMessageNums, () => {
  getMessage()
})

</script>
<template>
  <!-- <div class="user-notification-message-box">
    <div class="contnent">
      <div>
      </div>
    </div>
  </div> -->
</template>
<style lang="scss" scoped>
.user-notification-message-box {
  overflow: hidden;
  width: 0;
  height: 0;

  .contnent {
    position: fixed;
    z-index: -999;
    display: none;
  }
}
</style>
<style lang="scss">
.custom-user-notification {
  width: 380px;
  border-radius: 10px;
  opacity: 1;
  background: #FFFFFF;
  box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.2);
  padding: 0;
  border: none;

  .el-notification__group {
    margin: 0;
  }
}
</style>