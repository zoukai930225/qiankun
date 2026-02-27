/*
 * @Date: 2025-01-03 18:26:34
 */

import { format } from 'date-fns'

// 0 文本 1 数字 2 单选 3 多选 4 日期 5 日期时间 6 开关
export const componentMap = {
  0: 'el-input',
  1: 'el-input-number',
  2: 'el-select',
  3: 'el-select',
  4: 'el-date-picker',
  5: 'el-date-picker',
  6: 'el-switch'
}

export const componentTypeMap = {
  0: 'text',
  1: 'undefined',
  2: 'single',
  3: 'undefined',
  4: 'date',
  5: 'datetime',
  6: 'undefined'
}

/**
 * @description: 时间格式化函数
 * @param {*} dateString 时间字符串
 * @param {*} formatString 格式化字符串
 * @return {*}
 */
export const formatCustomDate = (dateString, formatString = 'yyyy-MM-dd') => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return format(date, formatString)
}


// 打样进度
export const stepInfoTitle = (item) => {
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
    if (Number(item.operateStatus || '') == 4) {
      return '齐色样审核：通过'
    } else if (Number(item.operateStatus || '') == 5) {
      return '齐色样审核：拒绝'
    }
    // return '齐色样审核'
  }
  if (Number(item.flowStatus || '') == 8) {
    if (Number(item.operateStatus || '') == 4) {
      return 'QA审核：通过'
    } else if (Number(item.operateStatus || '') == 5) {
      return 'QA审核：拒绝'
    }
    // return 'QA审核'
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

import fileExcel from '@/assets/imgs/file_excel.png'
import filePdf from '@/assets/imgs/file_pdf.png'
import fileDoc from '@/assets/imgs/file_doc.png'
export const getFileIcon = (fileName) => {
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

export const formatImg = (attachmentUrl) => {
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

export const formatFile = (attachmentUrl) => {
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

export const downloadFile = (fileItem) => {
  window.open(fileItem.url, '_blank')
}