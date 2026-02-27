<template>
  <div class="row-center flex-space-between box">
    <el-image style="width: 18px; height: 18px" :src="notifyIcon" fit="fill" />
    <div style="width: 316px;">
      <div class="row-center flex-space-between">
        <div class="message-title" @click="openDetailDrawer">{{ getDictLabel(DICT_TYPE.MESSAGE_NOTICE_TYPE,
          detail.noticeType) }}</div>
        <div class="message-time">{{ detail.showTime }}</div>
        <el-image class="close-icon" :src="closeIcon" fit="fill" @click="close" />
      </div>
      <div class="sub-title text1" @click="openDetailDrawer">{{ detail.messageTheme }}</div>
      <div class="content" @click="openDetailDrawer">
        {{ detail.messageBriefContent }}
      </div>
      <div class="row-center flex-space-between mt20px">
        <el-button round class="btn-box" v-show="!!detail.jumpLink"
          @click="toList(detail)">查看详情</el-button>
        <div class="row-center">
          <el-image class="arrow-icon" :src="activeIndex === 0 ? lArrowOff : lArrowOn" fit="fill"
            :class="{ 'arrow-icon-on': activeIndex !== 0 }" @click="changePage('prev')" />
          <span class="arrow-text"><span class="arrow-text-on">{{ activeIndex + 1 }}</span>/{{ messageData.length
          }}</span>
          <el-image class="arrow-icon" :src="activeIndex === (messageData.length - 1) ? rArrowOff : rArrowOn" fit="fill"
            :class="{ 'arrow-icon-on': activeIndex !== (messageData.length - 1) }" @click="changePage('next')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import notifyIcon from '@/assets/imgs/home/notify.svg'
import closeIcon from '@/assets/svgs/close.svg'
import rArrowOn from '@/assets/svgs/rarrow_on.svg'
import rArrowOff from '@/assets/svgs/rarrow_off.svg'
import lArrowOn from '@/assets/svgs/larrow_on.svg'
import lArrowOff from '@/assets/svgs/larrow_off.svg'
import { userMessageStore } from '@/store/modules/userMessage'
const useUserMessageStore = userMessageStore()
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { updateMessage } from '@/api/system/notice/index'
import { useUserStore } from '@/store/modules/user';
const userStore = useUserStore()
const props = defineProps({
  data: {
    type: Array<any>,
    required: true
  },
  initIndex: {
    type: Number,
    default: 0
  }
})
const messageData = ref<any[]>([])
const activeIndex = ref(0)
const emits = defineEmits(['link'])
const detail = ref<any>({})
const changePage = (type: 'next' | 'prev') => {
  if (type === 'next') {
    if (activeIndex.value < messageData.value.length - 1) {
      activeIndex.value++
    }
  } else {
    if (activeIndex.value > 0) {
      activeIndex.value--
    }
  }
}

const close = () => {
  activeIndex.value = 0
  useUserMessageStore.closeNotify()
}

//查看详情
const openDetailDrawer = () => {
  useUserMessageStore.upDateDrawerParams({
    id: detail.value.id,
    size: activeIndex.value + 1,
  })

  useUserMessageStore.openVisible();
  useUserMessageStore.updateTabActiveName('wait');
  deleteReadMessage()
}

//读单条消息
const readSingle = async (id: any) => {
  try {
    await updateMessage({
      id, isHandle: 1
    })
    await useUserMessageStore.getMessageCount()
  } catch (err) { }
}

//跳转到对应页面
const toList = async (item: any) => {
  try {
    const url = item.jumpLink
    //处理query
    // 找到问号 (?) 的位置，它之前是基础路径，之后是查询参数
    const questionMarkIndex = url.indexOf('?')
    let basePath = url
    const paramsObject: { [key: string]: string } = {}

    // 如果找到了问号，说明有查询参数
    if (questionMarkIndex !== -1) {
      // 获取 basePath
      basePath = url.substring(0, questionMarkIndex)

      // 从 URL 中获取查询字符串部分
      const queryString = url.substring(questionMarkIndex + 1)

      // 使用 URLSearchParams 遍历参数
      const searchParams = new URLSearchParams(queryString)
      searchParams.forEach((value, key) => {
        // 封装进 paramsObject 对象
        paramsObject[key] = value
      })
    }
    if (item.isHandle === null || Number(item.isHandle) === 0) {
      await readSingle(item.id)
    }

    useUserMessageStore.updateMessageCount(messageData.value.length - 1)
    emits('link', { path: basePath, query: paramsObject })
    deleteReadMessage()
  } catch (err) {

  }

}

//删除已读消息
const deleteReadMessage = () => {
  userStore.messagSocket?.deleteReadedData(detail.value.id)
  console.log('old', messageData.value)
  messageData.value = messageData.value.filter(item => item.id !== detail.value.id)
  console.log('detail', detail.value)
  console.log('new', messageData.value)
  if (activeIndex.value === 0) {
    detail.value = messageData.value[0]
  } else {
    activeIndex.value = 0
  }

  if (messageData.value.length === 0) {
    close()
  }
}


watch(activeIndex, (val) => {
  if (val < messageData.value.length) {
    detail.value = messageData.value[val]
  }
})

watch(() => props.data, (val) => {
  if (val?.length === 0 || activeIndex.value > val.length - 1) return
  messageData.value = val
  detail.value = messageData.value[activeIndex.value]
}, { immediate: true })
</script>
<style lang="scss" scoped>
.box {
  padding: 20px;
  align-items: flex-start;
  position: relative;
  background: url('@/assets/svgs/message-bg.svg');
  background-repeat: no-repeat;
  background-size: 260px 236px;
  background-position: 150px 50px;
}


.flex-space-between {
  justify-content: space-between;
}

.message-title {
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  color: #333333;
  cursor: pointer;
}

.close-icon {
  position: absolute;
  width: 18px;
  height: 18px;
  cursor: pointer;
  right: 20px;
  top: 20px;
}

.message-time {
  margin-right: 28px;
  font-size: 12px;
  line-height: 1;
  color: #999999;
}

.sub-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  color: #333333;
  margin-top: 10px;
  margin-bottom: 6px;
  max-width: 276px;
  cursor: pointer;
}

.content {
  font-size: 14px;
  line-height: 18px;
  color: #666666;
  cursor: pointer;
  // height: 126px;
}

.btn-box {
  background: rgba(0, 100, 255, 0.1) !important;
  color: #0064FF !important;
  border: none;
}

.arrow-icon {
  width: 6px;
  height: 12px;
  padding: 0 3px;

  &-on {
    cursor: pointer;
  }

}

.arrow-text {
  font-size: 12px;
  padding: 0 10px;
  color: #666666;

  &-on {
    color: #0064FF;
  }
}
</style>