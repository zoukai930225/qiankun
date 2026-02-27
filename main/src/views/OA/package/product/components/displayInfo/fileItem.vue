<!--
 * @Date: 2025-07-28 15:45:28
-->
<template>
  <div class="fileItem">
    <div class="title"> {{ title }}</div>
    <div class="item" v-for="(item, index) in list" :key="index">
      <img style="width: 14px; height: 16px; margin-right: 10px" :src="getFileIcon(item.name)" />
      <div class="name text1" @click="previewHandle(item)">{{ item.name }}</div>
    </div>
    <div v-if="list.length === 0" style="color: #666666; font-size: 12px"> -- </div>
  </div>
</template>

<script setup lang="ts">
import { createImageViewer } from '@/components/ImageViewer'

import fileDoc from '@/assets/imgs/file_doc.png'
import fileExcel from '@/assets/imgs/file_excel.png'
import filePdf from '@/assets/imgs/file_pdf.png'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: () => []
  }
})

const getFileIcon = (fileName) => {
  if (fileName) {
    if (fileName.includes('xlsx') || fileName.includes('xls')) {
      return fileExcel
    } else if (fileName.includes('pdf') || fileName.includes('xls')) {
      return filePdf
    } else {
      return fileDoc
    }
  }
}

// 图片预览
const previewHandle = (file) => {
  const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
  const extension = file.url.toLowerCase()
  const isImg = imageFormats.some((value) => extension.includes(value))
  console.log(isImg)
  if (isImg) {
    createImageViewer({
      zIndex: 9999999,
      urlList: [file.url]
    })
  } else {
    // window.location.href = file.url
    window.open(file.url, '_blank')
  }
}
</script>

<style lang="scss" scoped>
.fileItem {
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
  .item {
    display: flex;
    flex-direction: row;
    margin-bottom: 4px;
    .name {
      font-size: 12px;
      color: #0064ff;
      width: 153px;
      cursor: pointer;
    }
  }
}
</style>
