<script lang="ts" setup>
import { ElNotification } from 'element-plus'
import { defineProps, withDefaults } from 'vue'
import defaultIcon from '@/assets/imgs/system/notify_message/bell.png'
import icon_date from '@/assets/imgs/system/notify_message/icon_date.png'
import { formatDate } from '@/utils/formatTime'
defineOptions({ name: 'Notification' })
// 定义默认的props
interface Props {
  content: string
  title: string
  time?: string | (() => Date)
  type?: 'success' | 'warning' | 'info' | 'error'
  duration?: number
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  dangerouslyUseHTMLString?: boolean
  showClose?: boolean // 是否显示关闭按钮
  offset?: number // 通知距离顶部的距离
  zIndex?: number // 通知的层级
  icon?: string // 自定义通知图标
  onClick?: () => void // 点击通知时触发的回调函数
  onClose?: () => void // 关闭通知时触发的回调函数
}

const props = withDefaults(defineProps<Props>(), {
  icon: defaultIcon,
  title: '通知',
  content: '',
  time: () => new Date('2024-05-01'),
  duration: 3000,
  position: 'top-right', // 通知位置
  dangerouslyUseHTMLString: false,
  showClose: true,
  offset: 0,
  zIndex: 2000,
  onClick: () => {},
  onClose: () => {}
})

// 封装后的通知函数
const showNotification = () => {
  // 确保 time 是一个 Date 对象
  const time = typeof props.time === 'function' ? props.time() : new Date(props.time)
  ElNotification({
    message: `
    <div class="notification">
<div class="notification-title">
<div class="notification-icon">
  <img src="${defaultIcon}" alt="" class="icon-img" /> <span class="notification-title">${props.title}</span> 
</div>
 
</div>
  <div class="notification-content">
  ${props.content}
  </div>
  <div class="notification-time">
     <img class="icon-date" src="${icon_date}" alt="">
    ${formatDate(time)}
  </div>
  </div>
`,
    duration: props.duration,
    position: props.position, // 通知位置
    customClass: 'custom-notification', // 自定义类名，用于覆盖默认样式
    dangerouslyUseHTMLString: props.dangerouslyUseHTMLString,
    showClose: props.showClose,
    offset: props.offset,
    zIndex: props.zIndex,
    onClick: props.onClick,
    onClose: props.onClose
  })
}

// 暴露封装后的通知函数，以便外部调用
defineExpose({
  showNotification
})
</script>

<template>
  <div></div>
  <!-- 组件模板为空，所有通知都通过封装后的函数来显示 -->
</template>

<style lang="scss">
.custom-notification {
  width: 400px;
  height: 163px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 114px;
    height: 83px;
    background-image: url(@/assets/imgs/system/notify_message/left_top.png);
    background-position: left top;
    background-repeat: no-repeat;
    background-size: contain;
  }
  &::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    width: 117px;
    height: 61px;
    background-image: url(@/assets/imgs/system/notify_message/right_bottom.png);
    background-position: right bottom;
    background-repeat: no-repeat;
    background-size: contain;
  }
}
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
