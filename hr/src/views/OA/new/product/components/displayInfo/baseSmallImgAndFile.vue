<!--
 * @Date: 2025-07-31 15:51:07
-->
<template>
  <div>
    <div class="img-wapper">
      <el-image
        v-for="(item, index) in formatSalesTargetDismantlingImg(stringValue, 'img')"
        class="img"
        :key="index"
        :src="item"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="formatSalesTargetDismantlingImg(stringValue, 'img')"
        show-progress
        :initial-index="4"
        fit="cover"
      />
    </div>

    <!-- 文件区域 -->
    <div class="file-wapper">
      <div
        class="item"
        v-for="(item, index) in formatSalesTargetDismantlingImg(stringValue, 'file')"
        :key="index"
        @click="openLink(item, formatName(item))"
      >
        <img class="icon" :src="getFileIcon(item)" />
        <div class="name">{{ formatName(item) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import fileDoc from '@/assets/imgs/file_doc.png'
import fileExcel from '@/assets/imgs/file_excel.png'
import filePdf from '@/assets/imgs/file_pdf.png'
import { downloadByUrl2 } from '@/utils/download'

const props = defineProps({
  stringValue: {
    type: String,
    default: ''
  },
  defaultFileName:{
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
    if(props.defaultFileName){
      return `${props.defaultFileName}.${fileType}`
    }else if (url.indexOf('?') > -1) {
      return url.split('?')[1].split('&')[0].split('=')[1]
    } else {
      return fileName
    }
  }
  return ''
}
</script>

<style lang="scss" scoped>
.img-wapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .img {
    width: 68px;
    height: 68px;
    border-radius: 4px;
    margin-right: 4px;
  }
}
.file-wapper {
  .icon {
    width: 14px;
    height: 17px;
    margin-right: 3px;
  }
  .name {
    color: #333333;
    font-size: 14px;
  }
  .item {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
