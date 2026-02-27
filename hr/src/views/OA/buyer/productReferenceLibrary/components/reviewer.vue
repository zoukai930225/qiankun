<template>
  <ul class="reviewer-list">
    <li v-for="(item, index) in reviewer" :key="index">
      <div class="status-icon flex items-center gap-4px">
        <el-image :src="item.status === 'success' ? SuccessIcon : DotIcon" :size="12" />
        <div class="status-text" :class="{ 'text-success': item.status === 'success' }">{{
          item.status === 'success' ? '已审核' : '待审核'
        }}</div>
      </div>
      <div class="flex items-center mt-4px gap-2px">
        <div class="reviewer-item-title">{{ item.title }}</div>
        <avatar-display :size="16" :name-size="12" :avatars="item.children" />
      </div>
    </li>
  </ul>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue'
import SuccessIcon from '@/assets/svgs/oa/buyer/success.svg'
import DotIcon from '@/assets/svgs/oa/buyer/dot.svg'

defineProps({
  reviewer: {
    type: Array as PropType<any[]>,
    default: () => [
      {
        title: '版师',
        status: 'success',
        children: [
          {
            name: '张三',
            src: 'https://picsum.photos/200/300'
          },
          {
            name: '李四',
            src: 'https://picsum.photos/200/300'
          },
          {
            name: '王五',
            src: 'https://picsum.photos/200/300'
          }
        ]
      },
      {
        title: '供应链',
        avatar: 'https://picsum.photos/200/300',
        status: 'warning'
      },
      {
        title: 'QA',
        avatar: 'https://picsum.photos/200/300',
        status: 'error'
      }
    ]
  }
})
</script>
<style scoped lang="scss">
.reviewer-list {
  display: grid;
  grid-template-columns: 1fr auto 1fr; // 左边自适应,中间内容宽度,右边自适应
  align-items: center;
  li {
    // width: 122px;
    // max-width: 124px;
    // flex: 1;
    &:nth-child(1) {
      justify-self: start; // 第一个居左
    }

    &:nth-child(2) {
      justify-self: center; // 第二个居中
    }

    &:nth-child(3) {
      justify-self: end; // 第三个居右
    }
  }
}
.status-icon {
  :deep(.el-image) {
    display: flex;
  }
}
.status-text {
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: 0px;

  font-variation-settings: 'opsz' auto;
  /* 主题色/橙色 */
  color: #db6a0f;
  &.text-success {
    color: #349b34;
  }
}

.reviewer-item-title {
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
  letter-spacing: 0px;
  white-space: nowrap;
  font-variation-settings: 'opsz' auto;
  /* 文字/一级 */
  color: #333333;
}
</style>
