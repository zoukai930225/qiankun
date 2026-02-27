<template>
  <ex-screen>
    <query-scheme
      :scheme="scheme"
      v-model="searchData"
      name="Customerservicechathistory"
      :show-expand="false"
      @search="onSearch"
      @reset="resetForm"
    />
    <chat-message
      v-loading="loading"
      ref="chatMessageRef"
      :data="chatData"
      @page-change="handlePageChange"
    />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Customerservicechathistory' }
</script>

<script lang="tsx" setup>
import { ref, toRef, onMounted, provide, computed } from 'vue'
import ChatMessage from '../components/chatMessage.vue' // 确保这是上一轮写的 ChatViewer 组件
import { usePage, SearchItem, PageItem } from './config'
import { getCustomerServiceChatHistory } from '@/api/operationCenter/pdd'

const detailsRef = ref<any>()
const chatMessageRef = ref()
const userInfo = ref<any>({ isManagement: false, isHrbp: false })

// 引入 hook
const { page, loading, scheme, searchData, setRouterInfo } = usePage({
  userInfo: toRef(userInfo, 'value')
})

// --- 核心数据封装 ---
// 将 hook 中的状态转换为 ChatMessage 组件需要的 props 格式
const chatData = computed(() => ({
  records: rawRecords.value,
  total: page.value.total,
  size: page.value.size,
  current: page.value.page // 注意：PageItem 默认属性可能是 page 或 current，根据你的框架调整
}))

const rawRecords = ref<any[]>([]) // 存储接口返回的原始列表

// --- 处理 API 参数 ---
const getApiParams = () => {
  const { date, goodsId, orderId } = searchData.value

  return {
    pageNum: page.value.page,
    pageSize: page.value.size,
    userId: '', // 这里的 userId 如果是查询条件需添加到 searchData，如果不是则留空
    goodsId: goodsId || '',
    orderId: orderId || '',
    // 处理时间范围数组
    queryStartTime: date && date[0] ? date[0] : '',
    queryEndTime: date && date[1] ? date[1] : ''
  }
}

// --- 查询逻辑 ---
const onSearch = async () => {
  loading.value = true
  const params = getApiParams()

  try {
    const res = await getCustomerServiceChatHistory(params)

    // 假设 res 结构为 { records: [], total: 100 }
    if (res) {
      rawRecords.value = res.records || []
      page.value.total = Number(res.total) || 0
    } else {
      rawRecords.value = []
      page.value.total = 0
    }
  } catch (error) {
    console.error('获取聊天记录失败', error)
    rawRecords.value = []
  } finally {
    loading.value = false
  }
}

// --- 重置逻辑 ---
const resetForm = () => {
  // 重置分页和搜索条件
  page.value.page = 1
  searchData.value = new SearchItem()
  onSearch()
}

// --- 翻页回调 (由 ChatMessage 组件触发) ---
const handlePageChange = (newPage: number) => {
  page.value.page = newPage
  onSearch()
}

const generateMockData = (page) => {
  const records: any[] = []
  for (let i = 0; i < 5; i++) {
    const id = (page - 1) * 5 + i
    records.push({
      // --- 外层用户信息 ---
      userId: `user_${id}`,
      userNick: `茹***${id} aerararaasdfasdfasdfasdfasdfaaadsfasd`,
      userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',

      // --- 内层聊天详情 ---
      chatDetail: [
        // 1. 客户消息 (msgType: 1)
        {
          userId: `user_${id}`,
          userNick: `茹***${id}`,
          userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          csName: null,
          msgContent: '这内裤好不好穿啊好不好穿啊好不好穿啊...（客户消息）',
          msgSendTime: '2025-11-20 10:02:41',
          mallId: 'mall_01',
          mallName: '某某内衣店',
          mallLogo: null,
          msgType: 1
        },
        // 2. 客服消息 (msgType: 0)
        {
          userId: `user_${id}`,
          userNick: `茹***${id}`,
          userAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          csName: '含笑',
          msgContent: '亲亲，这款内裤非常好穿呢~非常舒适~（客服消息）',
          msgSendTime: '2025-11-20 10:03:10',
          mallId: 'mall_01',
          mallName: '某某内衣店',
          mallLogo: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png', // 模拟店铺Logo
          msgType: 0
        }
      ]
    })
  }

  return {
    records: records,
    total: 50,
    size: 5,
    current: page
  }
}

// --- 初始化 ---
onMounted(() => {
  onSearch()
  // rawRecords.value = generateMockData(page.value.page).records;
})

setRouterInfo()

// Provide 给子组件（如果有需要）
provide('CustomerservicechathistoryForm', {
  searchData,
  page,
  loading,
  onSearch,
  resetForm
})
</script>

<style lang="scss" scoped>
@use './styles.scss';
</style>
