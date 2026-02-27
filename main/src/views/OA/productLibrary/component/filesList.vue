<template>
  <div class="file-list" :class="!list || list.length === 0 ? 'justify-center' : ''">
    <template v-if="list && list.length > 0">
      <div class="file-item flex" v-for="item in list">
        <div class="flex" style="flex: 1; padding-right: 20px">
          <img class="icon" :src="getFileIcon(item.docUrl)" alt="" />
          <div class="right">
            <div class="name">{{ getFileName(item.docUrl) || '-' }}</div>
            <div class="time">{{ getTime(item.docUrl, item.createdAt) || '-' }}</div>
          </div>
        </div>
        <div class="opt" @click="download(item.docUrl)">下载</div>
      </div>
    </template>
    <div v-else>
      <img src="@/assets/svgs/oa/imgEmpty.svg" alt="" />
      <div class="empty">暂无内容</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import excelSvg from '@/assets/svgs/common/file_excel.svg'
import docSvg from '@/assets/svgs/common/file_doc.svg'
import pdfSvg from '@/assets/svgs/common/file_pdf.svg'
import pptSvg from '@/assets/svgs/common/file_ppt.svg'
import txtSvg from '@/assets/svgs/common/file_txt.svg'
import defaultImg from '@/assets/svgs/common/upload_empty.svg'
import videoIcon from '@/assets/svgs/videoIcon.svg'
import zipIcon from '@/assets/svgs/common/zip.svg'
import fileIcon from '@/assets/svgs/common/file.svg'
import dayjs from 'dayjs'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  }
})

// ==================== 常量定义 ====================
const FILE_TYPES = {
  IMAGE: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'svg', 'ico', 'tiff', 'tif'],
  VIDEO: ['mp4', 'avi', 'wmv', 'mov', 'flv', 'mkv', 'webm', 'mpeg', 'mpg', '3gp', 'rmvb'],
  AUDIO: ['mp3', 'wav', 'wma', 'aac', 'flac', 'ogg', 'm4a', 'ape'],
  EXCEL: ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'csv'],
  PPT: ['ppt', 'pptx', 'pptm', 'potx', 'potm', 'ppsx'],
  PDF: ['pdf'],
  DOC: ['doc', 'docx', 'docm', 'dotx', 'dotm'],
  TXT: ['txt', 'log', 'md', 'markdown'],
  ZIP: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
  CODE: [
    'js',
    'ts',
    'jsx',
    'tsx',
    'vue',
    'html',
    'css',
    'scss',
    'sass',
    'less',
    'json',
    'xml',
    'yaml',
    'yml',
    'java',
    'py',
    'php',
    'go',
    'c',
    'cpp',
    'h',
    'cs',
    'rb',
    'swift',
    'kt',
    'rs',
    'sql'
  ]
} satisfies Record<string, string[]>

const FILE_ICON_MAP = {
  pdf: pdfSvg,
  txt: txtSvg,
  excel: excelSvg,
  ppt: pptSvg,
  doc: docSvg
} as const

const getFileExtension = (fileName: string): string =>
  fileName?.split('.').pop()?.toLowerCase() || ''

const getFileName = (url: string) => {
  if (!url || !url.includes('?name=')) return ''
  const [urlPart, queryPart] = url.split('?name=')
  if (!urlPart || !queryPart) return ''
  return queryPart
}

const getCreatedAt = (url: string) => {
  if (!url || !url.includes('&createdAt=')) return ''
  const [urlPart, queryPart] = url.split('&createdAt=')
  if (!urlPart || !queryPart) return ''
  return queryPart?.split('%20')?.shift() || ''
}

const getFileIcon = (url: string) => {
  const ext = getFileExtension(getFileName(url))
  if (FILE_TYPES.PDF.includes(ext)) return FILE_ICON_MAP.pdf
  if (FILE_TYPES.TXT.includes(ext)) return FILE_ICON_MAP.txt
  if (FILE_TYPES.EXCEL.includes(ext)) return FILE_ICON_MAP.excel
  if (FILE_TYPES.PPT.includes(ext)) return FILE_ICON_MAP.ppt
  if (FILE_TYPES.DOC.includes(ext)) return FILE_ICON_MAP.doc
  if (FILE_TYPES.ZIP.includes(ext)) return zipIcon
  return fileIcon
}

const download = (url: string) => {
  if (!url) return
  window.open(url, '_blank')
}

const getTime = (url: string, createdAt: string) => {
  if (!url && !createdAt) return ''
  let time = getCreatedAt(url) || dayjs(createdAt).format('YYYY-MM-DD') || ''
  return time
}
</script>

<style lang="scss" scoped>
.file-list {
  height: 305px;
  margin-top: 16px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  .file-item {
    padding: 13px 20px;
    background: #f9fafc;
    border: 1px solid #e5e5e5;
    box-sizing: border-box;
    border-radius: 6px;
    margin-bottom: 11px;
    cursor: pointer;
    min-height: 68px;
    width: 100%;
    display: flex;
    align-items: center;
    &:hover {
      border: 1px solid #0064ff;
      background: rgba(0, 100, 255, 0.03);
    }
    &:last-child {
      margin: 0;
    }
    .icon {
      width: 36px;
      height: 36px;
      border-radius: 4px;
      margin-right: 14px;
    }
    .right {
      flex: 1;
      .name {
        font-size: 14px;
        color: #333333;
        width: 100%;
        // border: solid red 1px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
        word-break: break-all;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
      .time {
        padding-top: 10px;
        font-size: 12px;
        color: #999999;
      }
    }
    .opt {
      font-size: 14px;
      color: #0064ff;
    }
  }
}

.empty {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #999999;
}
</style>
