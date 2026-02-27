<template>
  <div class="desc-file-content">
    <div class="image-list-content">
      <el-image
        v-for="item in formatSalesTargetDismantlingImg(url, 'img')"
        class="img"
        :src="getUrl(item)"
        :preview-src-list="[item]"
        show-progress
        :initial-index="4"
        fit="contain"
        preview-teleported
      />
    </div>
    <div class="file-list-content">
      <div
        class="file-item"
        v-for="(item, index) in formatSalesTargetDismantlingImg(url, 'file')"
        :key="index"
        @click="openLink(item, formatName(item))"
      >
        <img class="file-icon" :src="getFileIcon(item)" alt="" />
        <div class="file-name">{{ formatName(item) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import fileDoc from '@/assets/imgs/file_doc.png'
import fileExcel from '@/assets/imgs/file_excel.png'
import filePdf from '@/assets/imgs/file_pdf.png'
import { downloadByUrl2 } from '@/utils/download'
const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  defaultFileName: {
    type: String,
    default: ''
  }
})

const formatSalesTargetDismantlingImg = (text, type) => {
  if (!text) return []
  const list = text.split(',')
  if (type == 'img') {
    return list.filter((item) => {
      const extension = item.trim().toLowerCase()
      return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].some((ext) => extension.includes(ext))
    })
  } else if (type == 'file') {
    return list.filter((item) => {
      const extension = item.trim().toLowerCase()
      return !['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].some((ext) => extension.includes(ext))
    })
  }
}

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

const openLink = (url, name) => {
  downloadByUrl2(url, name)
}

const formatName = (url) => {
  // 如果有默认文件名称
  const fileName = url.split('?')[0].split('/')[url.split('/').length - 1]
  const fileType = fileName.split('.')[1]
  if (url) {
    if (props.defaultFileName) {
      return `${props.defaultFileName}.${fileType}`
    } else if (url.indexOf('?') > -1) {
      return url.split('?')[1].split('&')[0].split('=')[1]
    } else {
      return fileName
    }
  }
  return ''
}

// oss图片链接压缩
const getUrl = (url: string) => {
  if (!url) return ''
  return `${url}${url.indexOf('?') > -1 ? '&' : '?'}x-oss-process=image/resize,p_40`
}

// const
</script>

<style lang="scss" scoped>
.desc-file-content {
  width: 100%;
  .image-list-content {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    .img {
      width: 98px;
      height: 98px;
      border-radius: 10px;
      margin: 0 10px 10px 0;
      background: #f7f7f7;
    }
  }
  .file-list-content {
    width: 100%;
    .file-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 10px;
      &:last-child {
        margin-bottom: 0;
      }
      .file-icon {
        width: 14px;
        height: 17px;
      }
      .file-name {
        font-size: 14px;
        color: #333333;
        padding-left: 4px;
        flex: 1;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
