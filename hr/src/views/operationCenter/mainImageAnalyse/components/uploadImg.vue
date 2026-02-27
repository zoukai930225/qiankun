<template>
  <el-upload
    :action="uploadImgUrl"
    :headers="uploadHeaders"
    v-model:file-list="imgFileList"
    list-type="picture-card"
    name="files"
    :limit="limit"
    :on-exceed="handleExceed"
    :before-upload="beforeUploadImg"
    :on-success="handleSuccessImg"
    :on-error="handleUploadImgError"
    :disabled="uploadDisabled"
    :data="{ code: 'OPERATION' }"
    :class="{ hide: isHideUpload }"
  >
    <template #default>
      <div class="upload-cus">
        <img src="@/assets/imgs/team/add-default-img.png" class="add-default-img" />
        <span class="upload-cus-title">添加图片</span>
      </div>
    </template>

    <template #file="{ file, index }">
      <div>
        <el-image
          ref="imageRef"
          class="el-upload-list__item-thumbnail"
          :src="file.url"
          :preview-src-list="[file.url ? file.url : '']"
          fit="cover"
        />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview">
            <el-icon><zoom-in /></el-icon>
          </span>
          <span
            v-if="!uploadDisabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(index)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Delete, ZoomIn } from '@element-plus/icons-vue'
import type { UploadFile, ImageInstance } from 'element-plus'
import { getAccessToken } from '@/utils/auth'

const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
const uploadImgUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'

const message = useMessage() // 消息弹窗

const imageRef = ref<ImageInstance>()

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
  limit: {
    type: Number,
    default: 1
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
const isHideUpload = computed(() => imgFileList.value.length === props.limit)
const loadingInstance = ref()

const closePageLoading = () => {
  if (loadingInstance.value) {
    loadingInstance.value.close()
  }
}
const uploadImg = ref(false)
// 图片上传前格式校验
const beforeUploadImg = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
    return false // 阻止文件上传
  }
  uploadImg.value = true
  emit('uploadStatus', true)
  loadingInstance.value = ElLoading.service({ fullscreen: true, text: '图片上传中......' })

  return true // 允许文件上传
}
// 上传成功
const handleSuccessImg = (res: any) => {
  uploadImg.value = false
  emit('uploadStatus', false)
  emit('update:modelValue', res.data)
  emit('validate')
  closePageLoading()
  
}
// 上传失败
const handleUploadImgError = () => {
  uploadImg.value = false
  emit('uploadStatus', false)
  closePageLoading()
}

// 删除
const handleRemove = (index: number) => {
  imgFileList.value.splice(index, 1)
  emit('update:modelValue', imgFileList.value)
  emit('validate')
}

// 预览
const handlePictureCardPreview = () => {
  imageRef.value!.showPreview()
}

// 限制上传文件个数
const handleExceed = (): void => {
  message.error(`最多只能上传${props.limit}个文件！`)
}

onMounted(() => {})

onUnmounted(() => {
  imgFileList.value = []
})
</script>

<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}

.hide {
  :deep(.el-upload--picture-card) {
    display: none;
  }
}

:deep(.el-upload-list--picture-card) {
  .el-upload-list__item {
    width: 110px;
    height: 110px;
  }
}
.upload-cus {
  width: 110px;
  height: 110px;
  box-sizing: border-box;
  font-size: 12px;
  color: #999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px dashed #b8b8b8;
  background: white;

  .add-default-img {
    width: 30px;
    height: 26px;
    margin-bottom: 8px;
  }
  .upload-cus-title {
    height: 20px;
    line-height: 20px;
  }
  &:hover {
    border: 1px dashed #0064ff;
  }
}
</style>
