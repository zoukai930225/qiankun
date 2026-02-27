<template>
  <div @paste="handlePaste">
    <el-upload v-if="enableEdit && !onlyShow && !disabled" ref="uploadRef" style="width: 100%"
      v-model:file-list="fileList" :accept="acceptUploadFileType" :action="importUrl" class="upload"
      :class="uploadClass()" :headers="uploadHeaders" name="files" drag :auto-upload="true" :show-file-list="false"
      :data="{ code: businessCode, businessForeignKey: uuid }" :on-error="uploadError" :on-success="uploadSuccess"
      :on-progress="uploadProgress" :before-upload="beforeUpload"
      :disabled="disabled || (limit > 0 && showUploadFileList.length >= limit)">
      <div v-if="showBtnStyle">
        <el-button type="primary" :icon="Plus">点击上传</el-button>
      </div>
      <div v-else>
        <!-- v-click-outside="handleClickOutside" -->
        <div class="uploadBg" :class="{ uploadBgSelect: bgClick && !disabled }" :style="{ width: width - 2 + 'px' }"
          @click.stop.prevent="uploadBgClick">
          <img src="@/assets/imgs/upload_file.png" alt="" :style="{ opacity: disabled ? 0.5 : 1 }" />
          <div class="uploadBg-tips" :style="{ opacity: disabled ? 0.5 : 1 }">选中复制粘贴(支持图片)或文件拖拽</div>
          <div class="uploadBg-selectFile" @click="selectFile" :style="{ opacity: disabled ? 0.5 : 1 }">选择文件</div>
        </div>
        <div v-if="!hideFileSizeMsg" style="font-size: 10px; color: #666666; margin: 8px 0" @click.stop.prevent="">
          <!-- 只能上传{{ fileType }}文件，且不超过{{ fileSize }}M -->
          {{ onlyUploadImg ? `只能上传图片，且不超过${fileSize}M` : `文件大小不超过${fileSize}M` }}
        </div>
        <div v-else :style="{ height: hideResultSpace ? '0px' : '8px' }"></div>
      </div>
    </el-upload>
    <div class="file-list" v-if="showUploadFileList.length > 0 && !onlyShow && !disabled"
      :class="{ 'file-list11': !enableEdit && !disabled && !onlyShow }" :style="{ width: width + 'px' }">
      <div v-if="!onlyShow && !disabled" style="font-size: 12px; color: #333333; margin-top: -5px"
        :style="{ marginTop: showBtnStyle ? '0px' : '-5px' }">已上传文件</div>
      <div v-for="(item, index) in showUploadFileList" :key="item.url">
        <div class="file-list-item" :class="{
          'file-list-item1': onlyShow,
          'file-list-itemHover': hoverList[index] && !onlyShow && enableEdit && !disabled
        }" @mouseenter="hoverList[index] = true" @mouseleave="hoverList[index] = false">
          <img class="document" style="border-radius: 2px;" :src="getFileIcon(getFileName(item), item)" />

          <div class="name" :class="{
            nameHover: hoverList[index] && (onlyShow || !enableEdit || disabled)
          }" @click="previewHandle(item)">{{ getFileName(item) }}</div>
          <div class="row-center" style="margin-left: auto">
            <div v-if="item?.uploadStatus === 'uploading' && !hoverList[index]" class="progress">{{ item.percent }}%
            </div>
            <div v-if="item?.uploadStatus === 'fail' && !hoverList[index] && !onlyShow && !disabled"
              class="uploadFileFail">
              <div class="uploadFileFail-text">上传失败</div>
              <img class="uploadFileFail-img" src="@/assets/imgs/upload_file_fail.png" />
            </div>

            <img v-if="item?.uploadStatus === 'success' && !hoverList[index] && !onlyShow && !disabled"
              style="width: 16px; height: 16px; margin-right: 8px" src="@/assets/imgs/upload_file_complete.png"
              alt="" />
            <div v-if="enableEdit && !onlyShow && !disabled && hoverList[index]"
              style="width: 16px; height: 16px; margin-right: 8px" @mouseenter="deleteIconHover = true"
              @mouseleave="deleteIconHover = false">
              <img v-if="deleteIconHover" class="close" src="@/assets/imgs/upload_file_delete_hl.png" alt=""
                @click="delHandle(item, index)" />
              <img v-else class="close" src="@/assets/imgs/upload_file_delete.png" alt=""
                @click="delHandle(item, index)" />
            </div>
          </div>
          <div v-if="showDownloadIcon && onlyShow" style="margin-left: auto">
            <div class="row-center">
              <img style="width: 14px; height: 14px; margin-right: 6px" src="@/assets/imgs/fileDownload.png" />
              <div style="color: #0064ff; font-size: 12px; padding-right: 2px">下载</div>
            </div>
          </div>
        </div>

        <el-progress v-if="item?.uploadStatus === 'uploading' && !hoverList[index] && !onlyShow"
          class="file-list-progress" :percentage="item.percent" color="#0567fe" style="height: 4px"
          :show-text="false" />
      </div>
    </div>
    <div class="file-list" v-if="showUploadFileList.length > 0 && (onlyShow || disabled)"
      :style="{ width: width + 'px' }">
      <div style="display: flex; flex-wrap: wrap; width: 100%">
        <div v-for="(item, index) in getImgList(showUploadFileList)" :key="index">
          <el-image style="
              width: 40px;
              height: 40px;
              border-radius: 4px;
              margin-right: 8px;
              margin-bottom: 8px;
              vertical-align: middle;
            " :preview-teleported="true" :src="item.url" :preview-src-list="[item.url ? item.url : '']" fit="cover" />
        </div>
      </div>

      <div v-for="(item, index) in getFileList(showUploadFileList)" :key="item.url">
        <div class="file-list-item" :class="{
          'file-list-item1': onlyShow,
          'file-list-itemHover': hoverList[index] && !onlyShow && enableEdit && !disabled
        }" @mouseenter="hoverList[index] = true" @mouseleave="hoverList[index] = false">
          <img class="document" style="border-radius: 2px;" :src="getFileIcon(getFileName(item), item)" />

          <div class="name" :class="{
            nameHover: hoverList[index]
          }" @click="previewHandle(item)">{{ getFileName(item) }}</div>

          <div v-if="showDownloadIcon" style="margin-left: auto">
            <div class="row-center">
              <img style="width: 14px; height: 14px; margin-right: 6px" src="@/assets/imgs/fileDownload.png" />
              <div style="color: #0064ff; font-size: 12px; padding-right: 2px">下载</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showUploadFileList.length === 0 && (onlyShow || disabled)" style="color: #333333">暂无数据</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { generateUUID, handleUploadFileRequest } from '@/utils'
import { getAccessToken } from '@/utils/auth'
import { createImageViewer } from '@/components/ImageViewer'
import { Plus } from '@element-plus/icons-vue'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadLoading = ref(false) //上传loading
const fileList = ref([]) // 上传文件列表

const uuid = generateUUID() // 生成唯一标识符

import fileExcel from '@/assets/imgs/file_excel.png'
import filePdf from '@/assets/imgs/file_pdf.png'
import fileDoc from '@/assets/imgs/file_doc.png'

const uploadRef = ref(null)
const handleUpload = (file) => {
  uploadRef.value?.handleStart(file)
  uploadRef.value?.submit()
}

const uploadClass = () => {
  return `upload${uuid}`
}

const selectFile = (e) => {
  const input = document.querySelector(`.${uploadClass()} .el-upload input[type=file]`) // 获取 input 文件元素
  if (input) {
    input.click() // 触发点击事件，模拟文件选择框的打开
  }
}

const props = defineProps({
  businessCode: {
    type: String,
    default: 'NEW_PRODUCT'
  },
  showBtnStyle: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  hideFileSizeMsg: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 0
  },
  enableEdit: {
    type: Boolean,
    default: true
  },
  onlyShow: {
    type: Boolean,
    default: false
  },
  showDownloadIcon: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  uoloadFileList: {
    type: Array,
    default: () => []
  },
  onlyUploadImg: {
    type: Boolean,
    default: false
  },
  fileType: {
    type: String,
    default: 'xlsx/pdf/jpg/png'
  },
  /**
   * 允许上传的文件类型，逗号分隔的字符串（如 "png,jpg,jpeg"）。
   * 校验时会根据文件扩展名（不区分大小写）进行判断。
   * 例如：fileTypes="png,jpg,jpeg" 只允许上传 png、jpg、jpeg 格式的文件。
   */
  fileTypes: {
    type: String,
    default: ''
  },
  fileSize: {
    type: Number,
    default: 5 // M
  },
  width: {
    type: Number,
    default: 513 // M
  },
  hideResultSpace: {
    type: Boolean,
    default: false // M
  }
})

const acceptUploadFileType = computed(() => {
  if (props.onlyUploadImg) {
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].join(',')
  }
  return '*'
})

const uploadList = ref([]) // 初始化 uploadList
const hoverList = ref([])
const deleteIconHover = ref(false)

// uploadStatus :
// uploading success fail
const showUploadFileList = computed(() => {
  let list = props.enableEdit
    ? uploadList.value
    : props.uoloadFileList.length > 0
      ? props.uoloadFileList
      : uploadList.value

  if (list && Array.isArray(list)) {
    list.forEach((item) => {
      if (!item?.uploadStatus) {
        item.uploadStatus = 'success'
        item.percent = 100
      }
    })
    // console.log('点击舒服了看看了j', list)
    hoverList.value = []
    list.forEach((item) => {
      hoverList.value.push(false)
    })
    return list
  } else {
    return []
  }
})

watch(
  () => props.modelValue,
  (newVal) => {
    // console.log('watch props.modelValue:', newVal)
    if (newVal && newVal.length > 0) {
      uploadList.value = newVal
    } else {
      uploadList.value = []
    }
  },
  {
    immediate: true, // 立即执行一次
    deep: true // 深度监听
  }
)

// 监听paste事件
const handlePaste = (evt) => {
  if (
    (props.limit > 0 && showUploadFileList.value.length >= props.limit) ||
    props.disabled ||
    !props.enableEdit
  ) {
    return
  }
  const txt = evt.clipboardData.getData('Text')
  if (typeof txt == 'string' && txt !== '') {
    //检测到是文字，过滤
    return
  }
  let file = null
  const items = (evt.clipboardData || window.clipboardData).items
  if (!items.length) return
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      file = items[i].getAsFile()
      break
    }
  }
  if (file) {
    handleUpload(file)
  }
}

const emit = defineEmits(['update:modelValue', 'uploadBgClick', 'change'])
onMounted(() => {
  nextTick(() => {
    // console.log('props.modelValue:', props.modelValue)
  })
})

onUnmounted(() => {
  // console.log('unmounted')
})
const bgClick = ref(false)
const uploadBgClick = () => {
  bgClick.value = true
  emit('uploadBgClick')
}

const cancelUploadSelect = () => {
  bgClick.value = false
}
defineExpose({ cancelUploadSelect })

const getFileName = (file) => {
  if (file) {
    if (file.name) {
      return file.name || ''
    }
    if (file.url) {
      let array = file.url.split('?name=') || []
      if (array.length > 1) {
        return array[array.length - 1] ? array[array.length - 1] : array[1]
      }
      let array1 = file.url.split('?fileName=') || []
      if (array1.length > 1) {
        return array1[array1.length - 1] ? array1[array1.length - 1] : array1[1]
      }
      const arr = file.url.split('/') || []
      if (arr.length > 0) {
        return arr[arr.length - 1]
      }
      return ''
    }
  } else {
    return ''
  }
}
const getFileIcon = (fileName, item) => {
  if (fileName) {
    const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'jfif']
    const extension = fileName.toLowerCase()
    const isImg = imageFormats.some((value) => extension.includes(value))
    if (fileName.includes('xlsx') || fileName.includes('xls')) {
      return fileExcel
    } else if (fileName.includes('pdf')) {
      return filePdf
    } else if (isImg) {
      return item.url
    } else {
      return fileDoc
    }
  }
}

const getImgList = (list) => {
  let arr = []
  list.forEach((element) => {
    const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'jfif']
    const extension = element.url.toLowerCase()
    const isImg = imageFormats.some((value) => extension.includes(value))
    if (isImg) {
      arr.push(element)
    }
  })
  return arr
}

const getFileList = (list) => {
  let arr = []
  list.forEach((element) => {
    const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'jfif']
    const extension = element.url.toLowerCase()
    const isImg = imageFormats.some((value) => extension.includes(value))
    if (!isImg) {
      arr.push(element)
    }
  })
  return arr
}

// 图片上传成功提示
const uploadSuccess = (res: any): void => {
  if (!handleUploadFileRequest(res)) return
  if (uploadList.value.length > 0 && res && res.data && res.data.length > 0) {
    let lastObj = uploadList.value[uploadList.value.length - 1]
    lastObj.url = res.data[0].fileUrl
    lastObj.name = res.data[0].fileName
    lastObj.uploadStatus = 'success'
    lastObj.percent = 100
    uploadList.value[uploadList.value.length - 1] = lastObj
  }
  uploadLoading.value = false
  emit('update:modelValue', uploadList.value)
  emit('change', uploadList.value)
}

// 图片预览
const previewHandle = (file) => {
  const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
  const extension = file.url.toLowerCase()
  const isImg = imageFormats.some((value) => extension.includes(value))
  // console.log(isImg)
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
const delHandle = (item, index) => {
  uploadList.value.splice(index, 1)
  emit('change', uploadList.value)
}
// 图片上传错误提示
const uploadError = () => {
  uploadLoading.value = false
  if (uploadList.value.length > 0) {
    uploadList.value[uploadList.value.length - 1].uploadStatus = 'fail'
  }
}

const beforeUpload = (file) => {
  if (props.fileTypes) {
    const types = props.fileTypes.split(',').map((t) => t.trim().toLowerCase())
    const ext = file.name.split('.').pop().toLowerCase()
    if (!types.includes(ext)) {
      uploadLoading.value = false
      ElMessage.error('上传文件类型仅支持: ' + types.join(', '))
      return false // 阻止上传
    }
  }
  uploadLoading.value = true
  uploadList.value.push({ url: '', name: file.name, uploadStatus: 'uploading', percent: 0 })
  hoverList.value.push(false)
  // console.log('上传文件进度', file)
}

const uploadProgress = (event) => {
  const percent = event.percent
  if (uploadList.value.length > 0) {
    uploadList.value[uploadList.value.length - 1].percent = percent
  }
  // console.log('上传进度', event)
}
</script>

<style lang="scss" scoped>
:deep(.el-button) {
  padding: 8px 10px;
}

.uploadBg {
  // width: 513px;
  // height: 192px;
  // margin-top: 10px;
  border-radius: 10px;
  background: #ffffff;
  // box-sizing: border-box;
  border: 1px dashed #cdcdcd;
  display: flex;
  flex-direction: column;
  align-items: center;

  img {
    margin-top: 34px;
    width: 46px;
    height: 34px;
  }

  &-tips {
    padding-top: 20px;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: normal;
    color: #3d3d3d;
    width: calc(100% - 20px);
    text-align: center;
  }

  &-selectFile {
    margin-top: 20px;
    width: 88px;
    height: 32px;
    margin-bottom: 26px;
    /* 自动布局 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // padding: 0px 16px;
    gap: 8px;

    border-radius: 4px;
    background: #e5e5e5;
    font-size: 14px;
    font-weight: normal;
    line-height: 22px;
    text-transform: capitalize;
    letter-spacing: normal;
    color: #333333;
  }
}

.uploadBgSelect {
  background: #f3f9ff;
  border: 1px dashed #0064ff;
}

.file-list1 {
  margin-top: 3px;
}

.file-list {
  width: 513px;
  position: relative;

  &-item {
    // position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;

    cursor: pointer;
    height: 34px;
    margin-bottom: 3px;

    .name {
      padding: 1px 0 0 6px;
      box-sizing: border-box;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .nameHover {
      color: #0064ff;
    }

    .document {
      width: 14px;
      height: 17px;
      color: #909399;
      margin-left: 10px;
      margin-right: 4px;
    }

    .close {
      // margin-left: auto;
      width: 16px;
      height: 16px;
      // margin-right: 8px;
    }

    .progress {
      font-weight: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #0064ff;
      margin-right: 8px;
    }

    .uploadFileFail {
      display: flex;
      flex-direction: row;
      align-items: center;

      &-text {
        font-size: 14px;
        font-weight: normal;
        line-height: normal;
        letter-spacing: normal;
        /* 主题色/红色 */
        color: #eb3737;
      }

      &-img {
        margin-left: 14px;
        width: 16px;
        height: 16px;
        margin-right: 8px;
      }
    }

    // &:hover {
    //   border-radius: 4px;
    //   background: #ecf2ff;
    //   .name {
    //     color: #0064ff;
    //   }

    //   .close {
    //     display: block;
    //   }
    // }
  }

  &-item1 {
    height: 30px;
    margin-bottom: 0px;
  }

  &-itemHover {
    border-radius: 4px;
    background: #ecf2ff;

    .name {
      color: #0064ff;
    }

    .close {
      display: block;
    }
  }

  &-progress {
    width: calc(100% - 20px);
    position: absolute;
    margin-left: 10px;
    margin-top: -6px;
    // bottom: 0px;
  }
}

.defaultInput {
  position: absolute;
  // z-index: 999;
  // top: 99999px;
}

:deep(.el-progress-bar__outer) {
  height: 4px !important;
}

:deep(.el-upload-dragger) {
  padding: 0px !important;
  border: none !important;
  text-align: left;
}

:deep(.el-upload.is-disabled .el-upload-dragger) {
  background: transparent !important;
}
</style>
