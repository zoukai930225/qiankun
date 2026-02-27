<template>
  <div class="batch-import">
    <div class="top">
      <el-button type="primary" :icon="Download" @click="onDownload">导入模板下载</el-button>
    </div>

    <el-upload
      ref="uploadRef"
      class="upload"
      drag
      :auto-upload="true"
      :show-file-list="false"
      :multiple="false"
      :limit="1"
      :on-exceed="handleExceed"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :http-request="doUpload"
      accept=".xls,.xlsx"
    >
      <div class="el-upload-dragger-inner">
        <el-icon class="upload-icon"><UploadFilled /></el-icon>
        <div class="el-upload__text mt-12px">将文件拖到此处，或点击上传</div>
        <el-button class="mt-20px">选择文件</el-button>
      </div>
    </el-upload>
    <div class="ext-tip">仅允许导入xls、xlsx格式文件</div>

    <div class="files" v-if="files.length">
      <div class="title">已上传文件：</div>
      <div class="file" v-for="(f, idx) in files" :key="idx">
        <div class="file-row">
          <img :src="FileIcon" class="file-icon" alt="file" />
          <a class="name" @click.prevent>{{ f.name }}</a>
          <el-icon size="14" :color="f.status === 'success' ? '#30a46c' : '#c0c4cc'" class="status">
            <CircleCheckFilled />
          </el-icon>
          <el-button
            link
            type="danger"
            class="remove"
            size="small"
            :disabled="f.status === 'uploading'"
            @click="removeFile(idx)"
            aria-label="移除"
            title="移除"
          >
            <el-icon>
              <img :src="DelIcon" alt="delete" />
            </el-icon>
          </el-button>
        </div>
        <el-progress
          v-if="f.status !== 'success'"
          class="progress"
          :percentage="f.progress"
          :show-text="false"
          :stroke-width="4"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import dayjs from 'dayjs'
import type { UploadFile, UploadFiles, UploadRequestOptions, UploadInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { CircleCheckFilled, UploadFilled, Download, Delete } from '@element-plus/icons-vue'
import { importFabricClassification } from '@/api/supplier/fabricManagement/classification'
import FileIcon from '@/assets/svgs/file_gray.svg'
import DelIcon from '@/assets/svgs/delete.svg'
import { downloadByUrl2 } from '@/utils/download'

defineOptions({ name: 'BatchImport' })

const props = withDefaults(
  defineProps<{
    onImported?: () => void
    onConfirmClose?: () => void
    onClose?: () => void
  }>(),
  {}
)

interface ListedFile {
  name: string
  status: 'ready' | 'uploading' | 'success' | 'error'
  progress: number
}

const files = ref<ListedFile[]>([])
const uploadRef = ref<UploadInstance>()

const checkFileType = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase()
  const allowedExtensions = ['xls', 'xlsx']
  return Boolean(extension && allowedExtensions.includes(extension))
}

const beforeUpload = (file: File) => {
  const fileName = file?.name || ''
  if (!checkFileType(fileName)) {
    ElMessage.error('仅允许导入 xls、xlsx 格式文件')
    return false
  }
  return true
}

const handleExceed = () => {
  ElMessage.warning('一次仅能上传 1 个文件，如需更换请重新选择')
}

const handleChange = (file: UploadFile, _files: UploadFiles) => {
  // 仅在初次选择文件时初始化，避免上传完成触发 on-change 将进度重置为 0
  if (file.status !== 'ready') return
  const fileName = file.name || ''
  files.value = []
  files.value.push({ name: fileName, status: 'ready', progress: 0 })
}

const removeFile = (index: number) => {
  if (files.value[index]?.status === 'uploading') return
  files.value.splice(index, 1)
  // 重置内部上传状态，允许再次选择相同文件
  uploadRef.value?.clearFiles()
}

const doUpload = async (options: UploadRequestOptions) => {
  const { file, onProgress, onSuccess, onError } = options
  files.value = [{ name: (file as File).name, status: 'uploading', progress: 0 }]
  try {
    const fd = new FormData()
    fd.append('file', file as File)
    const resp = await importFabricClassification(fd, {
      onUploadProgress: (e: any) => {
        const total = (e?.total as number) || (file as File)?.size || 0
        if (!total) return
        const percent = Math.min(99, Math.round((e.loaded / total) * 100))
        if (files.value[0]) files.value[0].progress = percent
        onProgress && onProgress({ percent } as any)
      },
      showLoading: false
    })
    if (files.value[0]) {
      files.value[0].status = 'success'
      files.value[0].progress = 100
    }
    // 通知父级刷新并关闭弹窗
    props.onImported && props.onImported()
    // props.onConfirmClose && props.onConfirmClose()
    onSuccess && onSuccess(resp as any)
  } catch (err) {
    if (files.value[0]) files.value[0].status = 'error'
    onError && onError(err as any)
  }
}

const onDownload = () => {
  // TODO: 模板下载（待接入具体接口）
  downloadByUrl2(
    'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/template/%E9%9D%A2%E6%96%99%E5%BA%93%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx',
    '面料库导入模版.xlsx'
  )
}

const submit = async () => {
  if (!files.value.length) throw new Error('请先选择文件')
  const status = files.value[0].status
  if (status === 'uploading') throw new Error('文件正在上传，请稍候')
  if (status !== 'success') throw new Error('上传失败，请重新选择文件并上传')
  return true
}

defineExpose({
  submit
})
</script>

<style scoped lang="scss">
.batch-import {
  .top {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    .tip {
      color: #999;
      font-size: 12px;
      display: inline-flex;
      align-items: center;
      .dot {
        width: 6px;
        height: 6px;
        background: #f59e0b;
        border-radius: 50%;
        display: inline-block;
        margin-right: 6px;
      }
    }
  }
  .upload {
    // border: 1px dashed #dcdfe6;
    // border-radius: 4px;
    // background: #fafafa;
    // padding: 24px;
    // text-align: center;
    // min-height: 160px;
    // display: flex;
    // align-items: center;
    // justify-content: center;
  }
  .el-upload-dragger-inner {
    // display: inline-flex;
    // flex-direction: column;
    // align-items: center;
    // gap: 8px;
    :deep(.el-button) {
      background-color: #e5e5e5;
      transition: background-color 0.2s ease;
    }
    :deep(.el-button:hover),
    :deep(.el-button:focus),
    :deep(.el-button:active) {
      background-color: #fff;
    }
  }
  .upload-icon {
    font-size: 30px;
    color: #0064ff;
    line-height: 1;
  }
  .ext-tip {
    color: #999;
    font-size: 12px;
    margin-top: 8px;
  }
  .mt-10px {
    margin-top: 10px;
  }
  .files {
    margin-top: 12px;
    .title {
      font-weight: 500;
      margin-bottom: 12px;
    }
    .file {
      font-size: 13px;
      color: #333;
    }
    .file-row {
      display: flex;
      align-items: center;
      gap: 6px;
      line-height: 22px;
      position: relative;
    }
    .file-icon {
      width: 18px;
      height: 18px;
    }
    .name {
      color: #0064ff;
      cursor: pointer;
      line-height: 19px;
    }
    .progress {
      width: 100%;
      margin-top: 6px;
    }
    .status {
      margin-left: auto;
    }
    .remove {
      position: absolute;
      right: -3px;
      top: 50%;
      transform: translateY(-50%);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.1s ease;
      z-index: 1;
    }
    .file-row:hover .remove {
      opacity: 1;
      pointer-events: auto;
    }
    .file-row:hover .status {
      opacity: 0;
      pointer-events: none;
    }
  }
}
</style>
