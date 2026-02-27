<template>
  <div @paste="handlePaste">
    <el-upload
      ref="uploadRef"
      style="width: 100%"
      :action="uploadImgUrl"
      :headers="uploadHeaders"
      v-model:file-list="imgFileList"
      name="files"
      :class="uploadClass()"
      drag
      :before-upload="beforeUploadImg"
      :on-success="handleSuccessImg"
      :on-error="handleUploadImgError"
      :disabled="uploadDisabled"
      :data="{ code: 'CUSTOMER_WAREWARE_DOCKET' }"
      @click.stop.prevent=""
    >
      <template #default>
        <div class="uploadBg" @click.stop.prevent="">
          <img src="@/assets/svgs/uploadIcon.svg" />
          <div>选中复制粘贴(仅支持图片)或文件拖拽</div>
          <div class="uploadBtn" @click="selectFile">选择文件</div>
        </div>
      </template>
      <template #tip>
        <div class="upload_tip">
          文件大小不超过20M
        </div>
      </template>

      <template #file="{ file, index }">
        <div class="upload_list">
          <el-image
            class="img"
            v-if="getFileType(file) === 'isImage'"
            :src="file.url"
            :preview-src-list="[file.url ? file.url : '']"
            fit="cover"
          />
          <img :src="videoIcon" class="img" v-else @click="openVideo(file.url)"/>
          <div class="fileName">{{ file.fileName || file.name }}</div>
          <div class="status">
            <el-icon  @click="handleRemove(index)"><Delete /></el-icon>
          </div>
        </div>
      </template>
    </el-upload>
  </div>
  
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import {   ElLoading } from 'element-plus'
import { getAccessToken } from '@/utils/auth'
import { generateUUID } from '@/utils'

import videoIcon from '@/assets/svgs/videoIcon.svg';

const message = useMessage() // 消息弹窗
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
const uploadImgUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'

const uuid = generateUUID() // 生成唯一标识符
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
  modelValue: {
    type: Array as () => any[],
    default: () => {
      return []
    }
  },
  uploadDisabled: {
    type: Boolean,
    default: false
  },
  canUploadVideo:{
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'uploadStatus', 'validate'])
// 文件列表
const imgFileList: Ref<any[]> = computed({
  get: () => {
    const fileList = props.modelValue
      ? props.modelValue.map((file) => ({
          ...file,
          url: file.fileUrl
        }))
      : []
    return fileList
  },
  set: (val: []) => {
    // console.log('val',val)
    // emit('update:modelValue', val)
  }
})

const loadingInstance = ref()

const closePageLoading = () => {
  if (loadingInstance.value) {
    loadingInstance.value.close()
  }
}

const imageTypes = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
const getFileType = (file:any) => {
  console.log(file)
  const fileName = file.fileName || file.name
  const type = fileName?.split('.')[1]
  return imageTypes.includes(type)
  ? 'isImage':'isVideo'
}
const uploadImg = ref(false)
// 图片上传前格式校验
const beforeUploadImg = (file:any) => {
  // 文件大小限制
  const fileSize = file.size / 1024 / 1024
  if(fileSize > 20){
    message.error('上传文件的大小不能超过20M')
    return false // 阻止文件上传
  }
  const isImage = file.type.startsWith('image/')
  const isVideo = file.type.startsWith('video/')
  if(props.canUploadVideo){
    if( !isImage && !isVideo){
      message.error('只能上传图片或者视频文件')
      return false // 阻止文件上传
    }
  }else{
    if(!isImage){
      message.error('只能上传图片文件')
      return false // 阻止文件上传
    }
  }
  uploadImg.value = true
  emit('uploadStatus', true)
  loadingInstance.value = ElLoading.service({ fullscreen: true, text: '上传中......' })

  return true // 允许文件上传
}

// 上传成功
const handleSuccessImg = (res: any) => {
  imgFileList.value.push(res.data[0])
  // uploadImg.value = false
  // emit('uploadStatus', false)
  emit('update:modelValue', imgFileList.value)
  // emit('validate')
  closePageLoading()
}
// 上传失败
const handleUploadImgError = () => {
  uploadImg.value = false
  emit('uploadStatus', false)
  closePageLoading()
}

const uploadRef = ref()
const handleUpload = (file) => {
  uploadRef.value?.handleStart(file)
  uploadRef.value?.submit()
}
// 监听paste事件
const handlePaste = (evt) => {

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

// 预览视频
const openVideo = (url: any) => {
  window.open(url, '_blank')
}

// 删除
const handleRemove = (index: number) => {
  imgFileList.value.splice(index, 1)
  emit('update:modelValue', imgFileList.value)
  emit('validate')
}


onMounted(() => {})

onUnmounted(() => {
  imgFileList.value = []
})
</script>

<style scoped lang="scss">
.uploadBg{
  width: 686px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #3d3d3d;
  
  .uploadBtn{
    margin-top: 10px;
    width: 88px;
    height: 32px;
    border-radius: 4px;
    background: #e5e5e5;
    font-size: 14px;
    text-align: center;
  }
}
.upload_tip{
  font-size: 12px;
  color: #666;
}
.upload_list{
  display: flex;
  align-items: center;
  .img{
    width: 18px;
    height: 18px;
    margin-right: 8px;
  }
  .status{
    margin-left: auto;
    margin-right: 8px;
    display: flex;
    align-items: center;
  }
}

:deep(.el-upload-dragger) {
  padding: 0px !important;
  // border: none !important;
  text-align: left;
}
:deep(.el-upload.is-disabled .el-upload-dragger) {
  background: transparent !important;
}
</style>
