<template>
  <div class="textInfo">
    <div class="title"> {{ title }}</div>
    <div v-if="isTime" class="row-center">
      <img style="width: 12px; height: 12px; margin-right: 6px" src="@/assets/imgs/file_time.png" />
      <div class="name">{{ content || '--' }} </div>
    </div>
    <div v-else>
      <div v-if="content && isLink" class="name text1" style="color: #0064ff; cursor: pointer"
        @click="jumpLink(content)">{{ content }}
      </div>
      <div v-if="content && !isHtml && !isLink" class="name">{{ content }} </div>
      <div v-if="content && isHtml && !isLink" v-html="handleHtmlContent(content)" @click="imageChgange($event)"
        class="name htmlContent">
      </div>
      <div v-if="!content" style="color: #333333; font-size: 14px; font-weight: 500"> -- </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createImageViewer } from '@/components/ImageViewer'
import { isUrl } from '@/utils/is'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  isHtml: {
    type: Boolean,
    default: false
  },
  isLink: {
    type: Boolean,
    default: false
  },
  isTime: {
    type: Boolean,
    default: false
  }
})
const jumpLink = (value) => {
  if (isUrl(value)) {
    window.open(value, '_blank')
  } else {
    ElMessage.warning('非链接无法跳转')
  }
}
const handleHtmlContent = (content) => {
  let str = (content && content.replace(/<br\s*\/?>/g, '')) || ''
  str = str.replace(/<p>卖点<\/p>/g, '')
  return str || content || ''
}

const imageChgange = (e) => {
  console.log('点击图片', e, e.target, e.target.nodeName)
  if (e.target.nodeName == 'IMG' && e.target.currentSrc) {
    createImageViewer({
      zIndex: 9999999,
      urlList: [e.target.currentSrc]
    })
  }
}
</script>

<style lang="scss" scoped>
.textInfo {
  width: calc(209px - 24px);
  border-radius: 10px;
  background: #f8f8f9;
  padding: 12px;
  padding-bottom: 8px;
  margin-bottom: 10px;
  white-space: normal !important;
  word-break: break-all !important;
  line-break: anywhere;

  .title {
    font-size: 14px;
    line-height: 20px;
    color: #999999;
    margin-bottom: 4px;
  }

  .name {
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: normal;
    color: #333333;

    // width: 184px;
  }
}

:deep(p) {
  margin: 0px !important;
  padding: 0px !important;
}
</style>

<style scoped>
.htmlContent {
  :deep(img) {
    max-width: 100%;
    object-fit: contain;
    cursor: pointer;
  }
}
</style>
