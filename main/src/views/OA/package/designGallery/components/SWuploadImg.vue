<!--
 * @Date: 2024-09-13 15:25:17
  上传图片
-->
<template>
  <div class="upload-img-wapper">
    <el-upload
      v-model:file-list="imgFileList"
      :action="importUrl"
      list-type="picture-card"
      :headers="uploadHeaders"
      ref="uploadRef"
      :before-upload="beforeUploadImg"
      :on-success="handleSuccessImg"
      :on-error="handleUploadImgError"
      :disabled="false"
    >
      <template #default>
        <div class="upload-cus" v-loading="uploadImg">
          <img src="@/assets/imgs/team/add-default-img.png" class="add-default-img" />
          <span class="upload-cus-title">添加图片</span></div
        ></template
      >

      <template #file="{ file, index }">
        <div>
          <el-image
            class="el-upload-list__item-thumbnail"
            :src="file.url"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="[file.url ? file.url : '']"
            show-progress
            :initial-index="4"
            fit="cover"
          />
          <span class="el-upload-list__item-actions" v-if="!uploadDisabled">
            <span class="el-upload-list__item-delete" @click="handleRemoveImg(file, index)">
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { getAccessToken } from '@/utils/auth'
import type { UploadUserFile } from 'element-plus'

const message = useMessage() // 消息弹窗
defineOptions({ name: 'SWuploadImg' })
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/visualApproval/uploadAnnex'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头

const uploadImg = ref(false)

const props = defineProps({
  modelValue: {
    type: Array as () => UploadUserFile[],
    default: () => {
      return []
    }
  },
  uploadDisabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'uploadStatus'])
// 文件列表
const imgFileList: Ref<UploadUserFile[]> = computed({
  get: () => {
    return props.modelValue || []
  },
  set: (val: []) => {
    emit('update:modelValue', val)
  }
})

// 图片上传前格式校验
const beforeUploadImg = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
    return false // 阻止文件上传
  }
  uploadImg.value = true
  emit('uploadStatus', true)
  return true // 允许文件上传
}

const handleSuccessImg = () => {
  uploadImg.value = false
  emit('uploadStatus', false)
}

const handleUploadImgError = () => {
  uploadImg.value = false
  emit('uploadStatus', false)
}

const handleRemoveImg = (file, index) => {
  imgFileList.value.splice(index, 1)
}

onMounted(() => {})

onUnmounted(() => {
  imgFileList.value = []
})
</script>

<style scoped lang="scss">
.upload-img-wapper {
  width: 100%;
  .upload-cus {
    width: 146px;
    height: 146px;
    font-size: 12px;
    color: #999999;
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
      font-size: 12px;
      color: #999999;
      line-height: 20px;
    }
  }
  .upload-cus:hover {
    border: 1px dashed #0064ff;
  }
}
</style>

<style lang="scss" scoped>
.is-error {
  .upload {
    :deep(.el-upload),
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;

      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}

:deep(.disabled) {
  .el-upload,
  .el-upload-dragger {
    cursor: not-allowed !important;
    background: var(--el-disabled-bg-color);
    border: 1px dashed var(--el-border-color-darker) !important;

    &:hover {
      border: 1px dashed var(--el-border-color-darker) !important;
    }
  }
}

.upload-box {
  .no-border {
    :deep(.el-upload) {
      border: none !important;
    }
  }

  :deep(.upload) {
    .el-upload {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 146px;
      height: 146px;
      overflow: hidden;
      border: 1px dashed var(--el-border-color-darker);
      transition: var(--el-transition-duration-fast);

      &:hover {
        border-color: var(--el-color-primary);

        .upload-handle {
          opacity: 1;
        }
      }

      .el-upload-dragger {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        padding: 0;
        overflow: hidden;
        // background-color: transparent;
        border: 1px dashed var(--el-border-color-darker);

        &:hover {
          border: 1px dashed var(--el-color-primary);
        }
      }

      .el-upload-dragger.is-dragover {
        background-color: var(--el-color-primary-light-9);
        border: 2px dashed var(--el-color-primary) !important;
      }

      .upload-image {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .upload-handle {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        width: 100%;
        height: 100%;
        cursor: pointer;
        background: rgb(0 0 0 / 60%);
        opacity: 0;
        box-sizing: border-box;
        transition: var(--el-transition-duration-fast);
        align-items: center;
        justify-content: center;

        .handle-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 6%;
          color: aliceblue;

          .el-icon {
            margin-bottom: 40%;
            font-size: 130%;
            line-height: 130%;
          }

          span {
            font-size: 85%;
            line-height: 85%;
          }
        }
      }
    }
  }

  .el-upload__tip {
    line-height: 18px;
    text-align: center;
  }
}

.upload-empty {
  width: 100%;
  height: 100%;
  background: red;

  .upload-cus {
    width: 100%;
    height: 100%;
    font-size: 12px;
    color: #999999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    // border: 1px dashed #b8b8b8;
    background: white;

    .add-default-img {
      width: 30px;
      height: 26px;
      margin-bottom: 8px;
    }
    .upload-cus-title {
      height: 20px;
      font-size: 12px;
      color: #999999;
      line-height: 20px;
    }
  }
}
</style>
