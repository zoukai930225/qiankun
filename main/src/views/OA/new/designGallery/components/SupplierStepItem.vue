<template>
  <div class="stepItem">
    <img class="stepItem-icon" :class="{ 'stepItem-icon1': Number(item.flowStatus || '') == 9 }"
      :src="stepLeftIcon(item)" alt="" />
    <div class="stepItem-content" :style="{ borderLeft: borderLeftStyle() }">
      <div class="stepInfo" v-if="stepInfoTitle(item) || stepSubtitleTitle(item)">
        <div v-if="stepInfoTitle(item)" class="stepInfo-title" :class="{
          'stepInfo-title1': isShowRefuseColor(item),
          'stepInfo-title2': Number(item.flowStatus || '') == 9
        }">
          {{ stepInfoTitle(item) }}</div>
        <div v-if="stepSubtitleTitle(item)" class="row-center" style="
            height: 20px;
            border-radius: 2px;
            margin-left: 10px;
            background: rgba(235, 55, 55, 0.1);
            margin-left: auto;
          " :style="{
            background: !isShowRefuseColor(item)
              ? 'rgba(52, 155, 52, 0.1)'
              : 'rgba(235, 55, 55, 0.1)'
          }">
          <div class="stepInfo-subTitle" :class="{ 'stepInfo-subTitle1': !isShowRefuseColor(item) }">{{
            stepSubtitleTitle(item) }}</div>
        </div>
      </div>
      <div v-if="Number(item.flowStatus || '') == 8 && Number(item.operateStatus || '') == 5"
        style="font-size: 12px; color: #eb3737; font-weight: 500; margin-bottom: 10px">
        {{ getQAAuditInfo(item.reSample || '') }}
      </div>
      <!-- 代办节点 -->
      <div v-if="Number(item.flowStatus || '') == 9" class="basicInfo">
        <div v-for="(value, index) in item.todoPersonList" :key="index" class="row-center">
          <img v-if="value.avatarOrigin" :src="value.avatarOrigin" alt=""
            style="width: 16px; height: 16px; border-radius: 8px; margin-right: 4px" />
          <div v-if="value.name" style="color: #333333; margin-right: 10px"> {{ value.name }} </div>
        </div>
        <div v-if="item.submitPersonRole" style="
            background: #fef2d7;
            height: 20px;
            font-size: 10px;
            color: #cd8200;
            padding-left: 6px;
            padding-right: 6px;
            line-height: 20px;
            border-radius: 10px;
            margin-left: -4px;
          ">
          {{ item.submitPersonRole }}</div>
      </div>

      <div v-else class="basicInfo" style="align-items: center">
        <img v-if="item.submitPersonAvatar" class="basicInfo-avatar" :src="item.submitPersonAvatar" alt="" />
        <div v-if="item.submitPersonName" class="basicInfo-name"> {{ item.submitPersonName }} </div>
        <div v-if="item.submitPersonRole" style="
            background: #fef2d7;
            height: 20px;
            font-size: 10px;
            color: #cd8200;
            padding-left: 6px;
            padding-right: 6px;
            line-height: 20px;
            border-radius: 10px;
            margin-left: -4px;
          ">
          {{ item.submitPersonRole }}</div>
        <div v-if="item.flowStatus == '4' || item.flowStatus == '7'" @mouseenter="deleteIconHover = true"
          @mouseleave="deleteIconHover = false" style="margin-left: auto">
          <img v-if="deleteIconHover" src="@/assets/imgs/oa/del-activity.png" alt="" class="del-icon"
            @click="delRemark(item.flowStatus, item.id)" />
          <img v-else src="@/assets/imgs/oa/del-normal.png" class="del-icon" alt=""
            @click="delRemark(item.flowStatus, item.id)" />
        </div>
      </div>
      <div class="basicInfo-time"> {{ item.createdAt }}</div>
      <div class="remark textWrap">{{ item.remark }}</div>
      <div class="attachmentFile">
        <div v-for="(imgItem, imgIndex) in formatImg(item.attachmentUrl)" :key="imgIndex">
          <el-image :src="imgItem.url" class="notice-img" style="width: 64px; height: 64px" :zoom-rate="1.2"
            :max-scale="7" :min-scale="0.2" :preview-src-list="formatImg(item.attachmentUrl).map((img) => img.url)"
            show-progress :initial-index="imgIndex" fit="cover" />
        </div>
        <div v-for="(fileItem, fileIndex) in formatFile(item.attachmentUrl)" :key="fileIndex" style="width: 100%">
          <div class="row-center" style="margin-bottom: 8px" @click="downloadFile(fileItem)">
            <img style="width: 14px; height: 17px" :src="getFileIcon(fileItem.url)" />
            <div class="text1 fileName" style="
                font-size: 12px;
                padding-left: 4px;
                padding-right: 0px;
                width: 200px;
                cursor: pointer;
              ">{{ fileItem.name }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="!isLast" style="
        background: #e5e5e5;
        height: 1px;
        margin-left: 18px;
        margin-right: 9px;
        margin-bottom: 10px;
        margin-top: -10px;
      ">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { deleteRemark, deleteColorCard } from '@/api/oa/new/designGallery/index'
import { defineEmits, defineProps } from 'vue'
const message = useMessage() // 消息弹窗

import step_gray from '@/assets/imgs/oa/step_gray.png'
import step_green from '@/assets/imgs/oa/step_green.png'
import step_red from '@/assets/imgs/oa/step_red.png'
import step_tips from '@/assets/imgs/oa/more-icon.png'

import fileExcel from '@/assets/imgs/file_excel.png'
import filePdf from '@/assets/imgs/file_pdf.png'
import fileDoc from '@/assets/imgs/file_doc.png'

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

const stepLeftIcon = (item) => {
  if (Number(item.flowStatus || '') == 9) {
    return step_tips
  }
  if (isShowRefuseColor(item)) {
    return step_red
  }
  if (Number(item.operateStatus || '') == 4) {
    return step_green
  }
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
  if (item.flowStatus == '9') {
    if (item.todoNodeCode == 1) {
      return '试穿样审核'
    } else if (item.todoNodeCode == 2) {
      return '齐色样审核'
    } else if (item.todoNodeCode == 3) {
      return '报价核价 '
    } else if (item.todoNodeCode == 8) {
      return 'QA审核'
    } else if (item.todoNodeCode == 10) {
      return '试穿样重新上传'
    } else if (item.todoNodeCode == 11) {
      return '齐色样重新上传'
    } else if (item.todoNodeCode == 12) {
      return '试穿样/齐色样重新上传'
    }
  }
  if (item.flowStatus == '6') {
    return '审核确认'
  }
  if (Number(item.flowStatus || '') == 10) {
    return '试穿样重新上传'
  }
  if (Number(item.flowStatus || '') == 11) {
    return '齐色样重新上传'
  }
  if (Number(item.flowStatus || '') == 12) {
    return '试穿样/齐色样重新上传'
  }
  if (Number(item.flowStatus || '') == 2) {
    return '齐色样审核'
  }
  if (Number(item.flowStatus || '') == 8) {
    return 'QA审核'
  }
  if (
    (item.flowStatus == '1' && [1, 2, 3].includes(item.operateStatus)) ||
    item.flowStatus == '5'
  ) {
    // if (formatTitle(item)) {
    //   return formatTitle(item)
    // }
    if (item.flowStatus != '5') {
      return '试穿结果：继续调整'
    }
  } else if (
    (item.flowStatus == 1 && item.operateStatus == 4) ||
    [2, 3].includes(item.flowStatus)
  ) {
    return formatTitleByStep(item) || ''
  }
  if (item.flowStatus == '4') {
    return '备注'
  }
  if (item.flowStatus == '7') {
    return '色卡'
  }
  if (item.flowStatus == '5') {
    return '供应商已淘汰'
  }
  if (item.flowStatus == '6') {
    return '供应商淘汰已确认'
  }
  return ''
}
const stepSubtitleTitle = (item) => {
  if (item.flowStatus == '6') {
    return ''
  }
  if (Number(item.flowStatus || '') == 2 || Number(item.flowStatus || '') == 8) {
    if (Number(item.operateStatus || '') == 4) {
      return '通过'
    } else if (Number(item.operateStatus || '') == 5) {
      return '拒绝'
    }
  }
  if (
    (item.flowStatus == '1' && [1, 2, 3].includes(item.operateStatus)) ||
    item.flowStatus == '5'
  ) {
    if (formatTitle(item)) {
      return formatTitle(item)
    }
  }
  // else if (
  //   (item.flowStatus == 1 && item.operateStatus == 4) ||
  //   [2, 3].includes(item.flowStatus)
  // ) {
  //   return formatSuccessTitle(item) || ''
  // }
  if (formatTitle(item)) {
    return formatTitle(item)
  }
  return ''
}

// 是否显示拒绝红色
const isShowRefuseColor = (item) => {
  if (Number(item.flowStatus || '') == 1) {
    if (Number(item.operateStatus || '') != 4) {
      return true
    }
  }

  if (Number(item.flowStatus || '') == 2) {
    if (Number(item.operateStatus || '') == 5) {
      return true
    }
  }
  if (Number(item.flowStatus || '') == 8) {
    if (Number(item.operateStatus || '') == 5) {
      return true
    }
  }
  if (Number(item.flowStatus || '') == 5 || Number(item.flowStatus || '') == 6) {
    return true
  }
  return false
}

const formatTitle = (item) => {
  const state = item.operateStatus

  if (item.flowStatus == '5') {
    return '已淘汰'
  }

  const titles = {
    1: '打样问题',
    2: '设计稿问题',
    3: '工厂问题'
  }
  return titles[state]
}

const getQAAuditInfo = (reSample) => {
  if (reSample) {
    let reSampleArr = reSample.split(',')
    if (reSampleArr.length === 1) {
      if (Number(reSampleArr[0]) == 1) {
        return '重新打样 试穿样'
      } else if (Number(reSampleArr[0]) == 2) {
        return '重新打样 齐色样'
      }
    } else if (reSampleArr.length > 1) {
      let str = '重新打样 '
      reSampleArr.forEach((item, index) => {
        if (Number(item) == 1) {
          if (index > 0) {
            str = str + '/试穿样'
          } else {
            str = str + '试穿样'
          }
        } else if (Number(item) == 2) {
          if (index > 0) {
            str = str + '/齐色样'
          } else {
            str = str + '齐色样'
          }
        }
      })
      return str
    }
  }
  return ''
}

const formatImg = (attachmentUrl) => {
  if (!attachmentUrl) return []

  return attachmentUrl
    .split(',')
    .map((item) => {
      if (item?.split('?').length === 1) {
        const arr = item?.split('/') || []
        let name = ""
        if (arr.length > 0) {
          name = arr[arr.length - 1]
        }
        return { url: item, name: name }
      }
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
      if (item?.split('?').length === 1) {
        const arr = item?.split('/') || []
        let name = ""
        if (arr.length > 0) {
          name = arr[arr.length - 1]
        }
        return { url: item, name: name }
      }
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

const formatSuccessTitle = (step) => {
  if (step.flowStatus == '1' && step.operateStatus == 4) {
    return '审核通过'
  } else if (step.flowStatus == '2') {
    return '齐色样上传'
  } else if (step.flowStatus == '3') {
    return '报价核价'
  } else if (step.flowStatus == '5') {
    return '已淘汰'
  }
  return ''
}

const formatTitleByStep = (step) => {
  if (step.flowStatus == '1' && step.operateStatus == 4) {
    return '试穿结果：通过'
  } else if (step.flowStatus == '2') {
    return '齐色样上传'
  } else if (step.flowStatus == '3') {
    return `报价核实：成本价为 ${step?.finishedProductPrice || ''} 元`
  } else if (step.flowStatus == '5') {
    return '已淘汰'
  }
  return ''
}

const emit = defineEmits(['close', 'success'])

const delRemark = async (flowStatus, id) => {
  if (flowStatus == '4') {
    try {
      // 二次确认删除逻辑
      await message.confirm('是否确认删除该备注？', '系统提示')
      // 调用删除接口
      await deleteRemark(id)
      emit('success')
    } catch (error) {
      console.error('删除备注失败', error)
    }
  } else if (flowStatus == '7') {
    try {
      // 二次确认删除逻辑
      await message.confirm('是否确认删除该色卡？', '系统提示')
      // 调用删除接口
      await deleteColorCard(id)
      emit('success')
    } catch (error) {
      console.error('删除色卡失败', error)
    }
  }
}
</script>

<style lang="scss" scoped>
.stepItem {
  // display: flex;
  // flex-direction: row;
  width: calc(100%);
  margin-left: 8px;
  position: relative;

  &-content {
    padding-left: 18px;
    overflow-x: hidden;

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

      &-title2 {
        color: #999999;
      }

      &-subTitle {
        padding-left: 6px;
        padding-right: 6px;
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        color: #eb3737;
      }

      &-subTitle1 {
        padding-left: 6px;
        padding-right: 6px;
        height: 20px;
        line-height: 20px;
        font-size: 10px;
        color: #349b34;
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

    .basicInfo-time {
      margin-top: 6px;
      font-size: 12px;
      color: #999999;
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
    top: 2px;
    left: -8px;
  }

  &-icon1 {
    position: absolute;
    width: 12px;
    height: 12px;
    top: 4px;
    left: -6px;
  }
}
</style>
