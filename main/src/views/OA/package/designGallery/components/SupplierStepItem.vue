<!-- package -->
<template>
  <div class="stepItem">
    <img class="stepItem-icon" :src="stepLeftIcon(item)" alt="" />
    <div class="stepItem-content" :style="{ borderLeft: borderLeftStyle() }">
      <div class="stepInfo" v-if="stepInfoTitle(item) || stepSubtitleTitle(item)">
        <div
          v-if="stepInfoTitle(item)"
          class="stepInfo-title"
          :class="{ 'stepInfo-title1': stepSubtitleTitle(item) }"
          >{{ stepInfoTitle(item) }}</div
        >
        <div
          v-if="stepSubtitleTitle(item)"
          class="row-center"
          style="
            height: 20px;
            border-radius: 2px;
            margin-left: 10px;
            background: rgba(235, 55, 55, 0.1);
          "
        >
          <div class="stepInfo-subTitle">{{ stepSubtitleTitle(item) }}</div>
        </div>
      </div>
      <div class="basicInfo">
        <img
          v-if="item.submitPersonAvatar"
          class="basicInfo-avatar"
          :src="item.submitPersonAvatar"
          alt=""
        />
        <div v-if="item.submitPersonName" class="basicInfo-name"> {{ item.submitPersonName }} </div>
        <div class="basicInfo-time"> {{ item.createdAt }}</div>
        <div
          v-if="item.flowStatus == '5' || item.flowStatus == '7'"
          @mouseenter="deleteIconHover = true"
          @mouseleave="deleteIconHover = false"
          style="margin-left: auto"
        >
          <img
            v-if="deleteIconHover"
            src="@/assets/imgs/oa/del-activity.png"
            alt=""
            class="del-icon"
            @click="delRemark(item.flowStatus, item.id)"
          />
          <img
            v-else
            src="@/assets/imgs/oa/del-normal.png"
            class="del-icon"
            alt=""
            @click="delRemark(item.flowStatus, item.id)"
          />
        </div>
      </div>
      <div class="remark textWrap">{{ item.remark }}</div>
      <div class="attachmentFile">
        <div
          v-for="(imgItem, imgIndex) in formatImg(item.attachmentUrl || item.quotationSheetFile)"
          :key="imgIndex"
        >
          <el-image
            :src="imgItem.url"
            class="notice-img"
            style="width: 64px; height: 64px"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="
              formatImg(item.attachmentUrl || item.quotationSheetFile).map((img) => img.url)
            "
            show-progress
            :initial-index="imgIndex"
            fit="cover"
          />
        </div>
        <div
          v-for="(fileItem, fileIndex) in formatFile(item.attachmentUrl || item.quotationSheetFile)"
          :key="fileIndex"
          style="width: 100%"
        >
          <div class="row-center" style="margin-bottom: 8px" @click="downloadFile(fileItem)">
            <img style="width: 14px; height: 17px" :src="getFileIcon(fileItem.url)" />
            <div
              class="text1 fileName"
              style="
                font-size: 12px;

                padding-left: 4px;
                padding-right: 0px;
                width: 200px;
                cursor: pointer;
              "
              >{{ fileItem.name }}</div
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { deleteRemark } from '@/api/oa/package/designGallery/index'
import { defineEmits, defineProps } from 'vue'
const message = useMessage() // 消息弹窗

import step_gray from '@/assets/imgs/oa/step_gray.png'
import step_green from '@/assets/imgs/oa/step_green.png'
import step_red from '@/assets/imgs/oa/step_red.png'

import fileDoc from '@/assets/imgs/file_doc.png'
import fileExcel from '@/assets/imgs/file_excel.png'
import filePdf from '@/assets/imgs/file_pdf.png'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  showClose: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: () => ({})
  },
  pictureId: {
    type: Number
  },
  count: {
    type: Number,
    default: 0
  },
  isLast: {
    type: Boolean,
    default: false
  }
})

const borderLeftStyle = () => {
  if (props.count > 1 && !props.isLast) {
    return '1px dashed #e5e5e5'
  }
  return ''
}

const stepSubtitleTitle = (item) => {
  if (item.flowStatus == '6') {
    return ''
  }
  if (
    (item.flowStatus == '1' && [1, 2, 3].includes(item.operateStatus)) ||
    item.flowStatus == '5'
  ) {
    if (formatTitle(item)) {
      return formatTitle(item)
    }
  }

  if (formatTitle(item)) {
    return formatTitle(item)
  }
  return ''
}

const stepLeftIcon = (item) => {
  if (stepInfoTitle(item) && stepSubtitleTitle(item)) {
    return step_red
  }
  if (stepInfoTitle(item)) {
    return step_green
  }
  return step_gray
}
const deleteIconHover = ref(false)

const getFileIcon = (fileName) => {
  if (fileName) {
    if (fileName.includes('xlsx') || fileName.includes('xls')) {
      return fileExcel
    } else if (fileName.includes('pdf')) {
      return filePdf
    } else {
      return fileDoc
    }
  }
}

const downloadFile = (fileItem) => {
  window.open(fileItem.url, '_blank')
}

const stepInfoTitle = (item) => {
  if (item.flowStatus == '6') {
    return '审核确认'
  }
  if (item.flowStatus == '1' && [1, 2, 3].includes(item.operateStatus)) {
    return '试穿结果：继续调整'
  } else if (
    (item.flowStatus == 1 && item.operateStatus == 4) ||
    [2, 3, 4].includes(item.flowStatus)
  ) {
    return formatTitleByStep(item) || ''
  }
  if (item.flowStatus == '5') {
    return '备注'
  }

  return ''
}

const formatTitle = (item) => {
  const state = item.operateStatus

  if (item.flowStatus == '4' || item.flowStatus == '3') {
    return `已淘汰${item.flowStatus == '4' ? '确认' : ''}`
  }

  const titles = {
    1: '打样问题',
    2: '设计稿问题',
    3: '工厂问题'
  }
  return titles[state]
}

const formatImg = (attachmentUrl) => {
  if (!attachmentUrl) return []

  return attachmentUrl
    .split(',')
    .map((item) => {
      return {
        url: item,
        name: item.split('?')[1] // 获取文件名
      }
    })
    .filter((item) => {
      return (
        (item.name &&
          (item.name.endsWith('.jpg') ||
            item.name.endsWith('.png') ||
            item.name.endsWith('.jpeg'))) ||
        (item.url &&
          (item.url.endsWith('.jpg') || item.url.endsWith('.png') || item.url.endsWith('.jpeg')))
      )
    })
}

const formatFile = (attachmentUrl) => {
  if (!attachmentUrl) return []

  // 只要文件不要图片
  return attachmentUrl
    .split(',')
    .map((item) => {
      return {
        url: item,
        name: item?.split('?')[1]?.split('=')[1] // 获取文件名
      }
    })
    .filter((item) => {
      return (
        item.name &&
        !(item.name.endsWith('.jpg') || item.name.endsWith('.png') || item.name.endsWith('.jpeg'))
      )
    })
}

const formatTitleByStep = (step) => {
  if (step.flowStatus == '1' && step.operateStatus == 4) {
    return '打样结果：通过'
  } else if (step.flowStatus == '2') {
    return `报价核价：报价为 ${step.physicalQuotePrice} 元`
  } else if (step.flowStatus == '3') {
    return `已淘汰`
  } else if (step.flowStatus == '4') {
    return '已淘汰确认'
  }
  return ''
}

const emit = defineEmits(['close', 'success'])

const delRemark = async (flowStatus, id) => {
  if (flowStatus == '5') {
    try {
      // 二次确认删除逻辑
      await message.confirm('是否确认删除该备注？', '系统提示')
      // 调用删除接口
      await deleteRemark(id)
      emit('success')
    } catch (error) {
      console.error('删除备注失败', error)
    }
  }
}
</script>

<style lang="scss" scoped>
.stepItem {
  width: calc(100%);
  margin-left: 8px;
  position: relative;
  &-content {
    padding-left: 18px;
    .stepInfo {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 8px;
      &-title {
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        letter-spacing: 0px;
        color: #349b34;
      }
      &-title1 {
        color: #eb3737;
      }
      &-subTitle {
        padding-left: 6px;
        padding-right: 6px;
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        color: #eb3737;
      }
    }
    .basicInfo {
      display: flex;
      flex-direction: row;
      font-size: 12px;
      font-weight: normal;
      line-height: normal;
      letter-spacing: 0px;
      &-avatar {
        width: 16px;
        height: 16px;
        border-radius: 8px;
        margin-right: 4px;
      }
      &-name {
        color: #333333;
        margin-right: 10px;
      }
      &-time {
        color: #999999;
        // padding-left: 10px;
      }
      .del-icon {
        width: 14px;
        height: 14px;
        cursor: pointer;
      }
    }
    .remark {
      padding-top: 8px;
      padding-bottom: 8px;

      font-size: 14px;
      font-weight: normal;
      line-height: 20px;

      color: #333333;
    }
    .attachmentFile {
      width: calc(100%);
      padding-bottom: 16px;
      .fileName {
        color: #333333;
      }
      .fileName:hover {
        color: #0064ff;
      }
    }
  }
  &-icon {
    position: absolute;
    width: 16px;
    height: 16px;
    top: 0px;
    left: -8px;
  }
}
</style>
