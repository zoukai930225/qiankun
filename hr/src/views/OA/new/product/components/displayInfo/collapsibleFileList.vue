<!--
 * @Date: 2025-07-29 10:49:42
-->
<template>
  <div class="collapsible-container">
    <div
      class="collapsible-header"
      @click="toggleExpand"
      :style="{ borderBottom: isExpanded ? '1px solid #E5E5E5' : 'none' }"
    >
      <span class="collapsible-title">{{ title }}</span>
      <img src="@/assets/imgs/common/xiangshang.png" v-if="isExpanded" class="expend-icon" alt="" />
      <img src="@/assets/imgs/common/xiangxia.png" v-else class="expend-icon" alt="" />
    </div>

    <div v-show="isExpanded" class="collapsible-content">
      <!-- 图片 -->
      <div class="img-wapper">
        <!-- <img v-for="(item, index) in imageList" :key="index" :src="item.url" alt="" class="img" /> -->
        <el-image
          v-for="(item, index) in imageList"
          class="img"
          :key="index"
          :src="item.url"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="imageList && imageList.map((img) => img.url)"
          show-progress
          :initial-index="4"
          fit="cover"
        />
      </div>

      <!-- 文件区域 -->
      <div class="file-wapper">
        <div
          class="item"
          v-for="(item, index) in fileList"
          :key="index"
          @click="openLink(item.url, item.name)"
        >
          <img class="icon" :src="getFileIcon(item.name)" v-if="getFileIcon(item.name)" alt="" />
          <div class="name" v-if="item.name">{{ item.name }}</div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import fileDoc from '@/assets/imgs/file_doc.png'
import fileExcel from '@/assets/imgs/file_excel.png'
import filePdf from '@/assets/imgs/file_pdf.png'
import { downloadByUrl2 } from '@/utils/download'
import { ref } from 'vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: '销售目标拆解'
  },
  list: {
    type: Array,
    default: () => []
  }
})

const isExpanded = ref(true)

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

const imageList = computed(() => {
  return props.list
    .filter((item) => {
      const extension = item.url.toLowerCase()
      return ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].some((ext) => extension.includes(ext))
    })
    .map((item) => {
      return { url: item.url }
    })
})

const fileList = computed(() => {
  console.log('2222222', props.list)
  return props.list
    .filter((item) => {
      const extension = item.url.toLowerCase()
      return !['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'].some((ext) => extension.includes(ext))
    })
    .map((item) => {
      if (item.name) {
        return { url: item.url, name: item.name }
      } else {
        return { url: item.url, name: item.url?.split('?')[1]?.split('=')[1] }
      }
    })
})

onMounted(() => {
  // 初始化时可以根据需要设置是否展开
  console.log('CollapsibleFileList mounted', props.list)
})

function toggleExpand() {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.collapsible-container {
  width: 100%;
  border: 1px solid #e5e5e5;
}
.collapsible-container:not(:first-child) {
  border-top: none;
}

.collapsible-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  box-sizing: border-box;
  cursor: pointer;
  user-select: none;
  background: #f4f6fa;
  border-bottom: 1px solid #e5e5e5;
}

.collapsible-title {
  font-size: 14px;
  color: #666666;
}
.expend-icon {
  width: 8px;
  height: 4px;
}

.collapsible-content {
  padding: 13px 16px;
  box-sizing: border-box;
  background: #ffffff;
  .img-wapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    .img {
      width: 40px;
      height: 40px;
      border-radius: 4px;
      margin-bottom: 10px;
    }
  }
  .file-wapper {
    .item {
      cursor: pointer;
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      .icon {
        width: 14px;
        height: 15px;
        margin-right: 10px;
      }
      .name {
        font-size: 12px;
        color: #333333;
        width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
      }
    }
  }
}
</style>
