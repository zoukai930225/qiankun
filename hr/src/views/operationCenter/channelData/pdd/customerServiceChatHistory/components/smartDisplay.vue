<template>
  <div class="smart-text-wrapper">
    <template v-for="(segment, index) in segments" :key="index">
      <el-image
        v-if="segment.type === 'image'"
        class="chat-image"
        :src="segment.content"
        :preview-src-list="[segment.content]"
        :initial-index="0"
        fit="contain"
        loading="lazy"
        hide-on-click-modal
      >
        <template #error>
          <div class="image-slot-error">
            <el-icon><icon-picture /></el-icon>
          </div>
        </template>
      </el-image>

      <el-link
        v-else-if="segment.type === 'link'"
        type="primary"
        :href="segment.content"
        target="_blank"
        :underline="false"
        class="chat-link"
      >
        {{ segment.content }}
      </el-link>

      <span v-else class="chat-text-span">{{ segment.content }}</span>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Picture as IconPicture } from '@element-plus/icons-vue' // 确保安装了图标库

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

// --- 核心解析逻辑 ---

// 判断是否为图片 URL
const isImageUrl = (url) => {
  const imageRegex = /\.(jpeg|jpg|png|gif|webp|svg|ico|bmp|tiff?|avif|heic|heif|apng|jxl)($|\?|#)/i
  return imageRegex.test(url)
}

// 解析文本为片段数组
const segments = computed(() => {
  if (!props.content) return []

  // 匹配 http/https 链接
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const rawParts = props.content.split(urlRegex)

  return rawParts.map((part) => {
    if (!part) return { type: 'text', content: '' }

    if (urlRegex.test(part)) {
      // 是 URL，进一步判断是图片还是普通链接
      if (isImageUrl(part)) {
        return { type: 'image', content: part }
      } else {
        return { type: 'link', content: part }
      }
    }
    // 普通文本
    return { type: 'text', content: part }
  })
})
</script>

<style lang="scss" scoped>
.smart-text-wrapper {
  /* 保留换行和空格 */
  white-space: normal;
  word-break: break-word;
}

.chat-image {
  width: 98px;
  height: 98px;
  border-radius: 10px;
  margin: 5px 0;
  display: block;
  background-color: #f5f7fa;
}

:deep(.chat-link) {
  vertical-align: baseline;
  font-size: inherit;
  display: inline; /* 保持在行内 */
  .el-link__inner {
    word-break: break-all;
  }
}

.chat-text-span {
  /* 继承父级字体样式 */
}

.image-slot-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #f5f7fa;
  color: #909399;
}
</style>
