<template>
  <div class="chat-viewer-container">
    <div class="sidebar">
      <div class="sidebar-header">消费者信息</div>

      <div class="list-container">
        <el-scrollbar>
          <div
            v-for="(item, index) in data.records"
            :key="item.userId || index"
            class="user-item"
            :class="{ 'is-active': selectedIndex === index }"
            @click="handleSelect(index)"
            :ref="(el) => (itemRefs[index] = el)"
          >
            <div v-if="selectedIndex === index" class="active-bar"></div>

            <el-avatar :size="40" :src="item.userAvatar || DefaultAvatar" class="user-avatar">
              {{ item.userNick?.charAt(0) }}
            </el-avatar>
            <span class="user-name">
              <overflow-tooltip :content="item.userNick" effect="light"></overflow-tooltip>
            </span>
          </div>

          <div v-if="!data.records || data.records.length === 0" class="empty-text"> 暂无数据 </div>
        </el-scrollbar>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          size="small"
          :pager-count="3"
          background
          layout="prev, pager, next, jumper"
          :total="data.total"
          :page-size="data.size"
          :current-page="data.current"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <div class="main-content">
      <div class="main-header">聊天记录</div>

      <div class="chat-area">
        <el-scrollbar ref="chatScrollbarRef">
          <div v-if="currentRecord" class="chat-list">
            <div
              v-for="(msg, mIndex) in currentRecord.chatDetail"
              :key="mIndex"
              class="message-row"
            >
              <div class="message-header">
                <div class="sender-info">
                  <el-avatar
                    :size="40"
                    class="sender-avatar"
                    :src="getSenderAvatar(msg) || DefaultAvatar"
                    :style="getAvatarStyle(msg.msgType)"
                  >
                    {{ getSenderName(msg)?.charAt(0) }}
                  </el-avatar>
                  <div>
                    <span class="sender-name">{{ getSenderName(msg) }}</span>
                    <div class="message-content">
                      <smart-display :content="msg.msgContent" />
                    </div>
                  </div>
                </div>
                <span class="message-time">{{ msg.msgSendTime }}</span>
              </div>
            </div>

            <div
              v-if="!currentRecord.chatDetail || currentRecord.chatDetail.length === 0"
              class="empty-text"
              style="padding-top: 50px"
            >
              暂无聊天详情
            </div>
          </div>

          <div v-else class="empty-state"> 请选择一个会话查看详情 </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup>
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import SmartDisplay from './smartDisplay.vue'

// --- Props 定义 ---
const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({
      records: [],
      total: 0,
      size: 10,
      current: 1
    })
  }
})

// --- Emits ---
const emit = defineEmits(['page-change', 'select-change'])

// --- State ---
const selectedIndex = ref(0)
const itemRefs = ref([]) // 存储列表项的 DOM 引用
const chatScrollbarRef = ref(null) // 新增：聊天区域滚动条引用

// --- Computed ---
const currentRecord = computed(() => {
  if (props.data.records && props.data.records.length > 0) {
    return props.data.records[selectedIndex.value]
  }
  return null
})

// --- Watchers ---

// 1. 监听选中项变化，滚动到顶部
watch(
  () => selectedIndex.value,
  () => {
    nextTick(() => {
      if (chatScrollbarRef.value) {
        chatScrollbarRef.value.setScrollTop(0)
      }
    })
  }
)

// 2. 监听数据变化（分页或刷新）
watch(
  () => props.data,
  (newVal) => {
    // 数据重置时，清空 ref 并重置选中项
    itemRefs.value = []
    if (newVal && newVal.records && newVal.records.length > 0) {
      selectedIndex.value = 0

      // 数据重置时，也强制滚动到顶部
      // (防止 selectedIndex 从 0 变到 0 不触发上面的 watcher)
      nextTick(() => {
        if (chatScrollbarRef.value) {
          chatScrollbarRef.value.setScrollTop(0)
        }
      })
    }
  },
  { deep: true }
)

// --- Methods ---

const handleSelect = (index) => {
  selectedIndex.value = index
  emit('select-change', props.data.records[index])
}

const handlePageChange = (page) => {
  emit('page-change', page)
}

// --- 键盘事件处理核心逻辑 ---
const handleKeydown = (e) => {
  // 如果没有数据，不处理
  if (!props.data.records || props.data.records.length === 0) return

  // ↑ 上箭头：切换到上一个用户
  if (e.key === 'ArrowUp') {
    e.preventDefault() // 防止页面滚动
    if (selectedIndex.value > 0) {
      const newIndex = selectedIndex.value - 1
      handleSelect(newIndex)
      scrollToItem(newIndex)
    }
  }
  // ↓ 下箭头：切换到下一个用户
  else if (e.key === 'ArrowDown') {
    e.preventDefault() // 防止页面滚动
    if (selectedIndex.value < props.data.records.length - 1) {
      const newIndex = selectedIndex.value + 1
      handleSelect(newIndex)
      scrollToItem(newIndex)
    }
  }
}

// 辅助函数：确保选中的列表项滚动到可视区域
const scrollToItem = (index) => {
  nextTick(() => {
    const el = itemRefs.value[index]
    // block: 'nearest' 只有在元素不可见时才滚动，体验最好
    if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  })
}

// --- 生命周期钩子 ---
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

// --- 辅助函数 ---
const getSenderName = (msg) => {
  if (msg.msgType === 0) {
    return msg.csName || msg.mallName || '客服'
  } else if (msg.msgType === 1) {
    return msg.userNick || '匿名用户'
  } else {
    return '系统消息'
  }
}

const getSenderAvatar = (msg) => {
  if (msg.msgType === 0) {
    return msg.mallLogo
  } else {
    return msg.userAvatar
  }
}

const getAvatarStyle = (msgType) => {
  if (msgType === 0) {
    return { backgroundColor: '#8BC34A', color: '#fff' }
  }
  return {}
}
</script>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
}

.chat-viewer-container {
  display: flex;
  width: 100%;
  height: calc(100% - 57px);
  border: 1px solid #e4e7ed;
  background-color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

.sidebar {
  width: 390px;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

.sidebar-header {
  height: 40px;
  line-height: 40px;
  padding-left: 16px;
  background: #f2f6fc;
  font-size: 14px;
  color: #666666;
  border-bottom: 1px solid #e5e5e5;
}

.list-container {
  flex: 1;
  overflow: hidden;
}

.user-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 15.5px 20px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #e5e5e5;
}

.user-item:hover {
  background-color: #f5f7fa;
}

.user-item.is-active {
  background-color: #ecf5ff;
}

/* 偶数行背景色 */
.user-item:nth-child(even) {
  background: #fbfcfd;
}

.active-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background-color: var(--el-color-primary);
}

.user-avatar {
  margin-right: 12px;
  flex-shrink: 0;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pagination-wrapper {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  border-top: 1px solid #e4e7ed;
  background-color: #fff;
  padding: 0 20px;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.main-header {
  height: 40px;
  line-height: 40px;
  padding-left: 16px;
  font-size: 14px;
  background: #f2f6fc;
  color: #666666;
  border-bottom: 1px solid #e4e7ed;
}

.chat-area {
  flex: 1;
  overflow: hidden;
  background-color: #fff;
}

.chat-list {
  padding: 0;
}

.message-row {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

/* 偶数行背景色 */
.message-row:nth-child(even) {
  background: #fbfcfd;
}

.message-header {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.sender-avatar {
  flex-shrink: 0;
}

.sender-info {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.sender-name {
  font-weight: 500;
  color: #666666;
  font-size: 14px;
}

.message-time {
  font-size: 14px;
  color: #999999;
  flex-shrink: 0;
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
  color: #333333;
  margin-top: 4px;
  word-break: break-all;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #909399;
}

:deep(.el-pagination) {
  .el-input {
    .el-input__wrapper {
      height: 24px;
    }
  }
}

.empty-text {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
