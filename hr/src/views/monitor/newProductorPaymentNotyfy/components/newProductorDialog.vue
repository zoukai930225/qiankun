<template>
  <div>
    <el-dialog v-model="visible" title="预警处理" @close="closeDialog" width="600">
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" label-width="110px"
        :rules="rules">
        <el-form-item label="处理说明" prop="operationRemark">
          <s-text-area v-model="formData.operationRemark" placeholder="请输入处理说明" :autosize="{ minRows: 5 }"
            :maxlength="200" />
        </el-form-item>
        <el-form-item label="附件" prop="attachmentUrl">
          <div class="upload">
            <el-upload v-model:file-list="fileList" :action="importUrl" class="upload" :headers="uploadHeaders"
              name="files" :show-file-list="false" :data="{ code: 'NEW_PRODUCT', businessForeignKey: id }"
              :on-error="uploadError" :on-success="uploadSuccess" :before-upload="beforeUpload">
              <el-button type="primary" :loading="uploadLoading">点击上传</el-button>
            </el-upload>
            <ul class="file-list" v-if="uploadList.length > 0">
              <li v-for="item in uploadList" :key="item.url">
                <el-icon class="document">
                  <Document />
                </el-icon>
                <span class="name" @click="previewHandle(item)">{{ item.name }}</span>
                <!-- 删除按钮会在提交人未提交，或者审核人拒绝的情况下展示 -->
                <el-icon class="close" @click="delHandle()">
                  <Close />
                </el-icon>
              </li>
            </ul>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { ElForm, ElFormItem, ElInput, ElDialog } from 'element-plus'
import * as MonitorApi from '@/api/monitor/index'
import { getAccessToken } from '@/utils/auth'
import { createImageViewer } from '@/components/ImageViewer'
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const message = useMessage()
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头

const props = defineProps<{
  visible?: boolean
  id: string
}>()
const emit = defineEmits(['handleClose', 'refresh'])

const visible = computed({
  get: () => props.visible,
  set: () => { }
})
const formLoading = ref(false)
const formData = reactive({
  id: '',
  operationRemark: '',
  attachmentUrl: ''
})
const formRef = ref()
const fileList = ref([])
const uploadLoading = ref(false)
const uploadList = ref<any[]>([])

const uploadError = () => {
  uploadLoading.value = false
  message.notifyError('文件上传失败，请您重新上传！')
}

// 图片上传成功提示
const uploadSuccess = (res: any): void => {
  uploadList.value = [{ url: res.data[0].fileUrl, name: res.data[0].fileName }]
  formData.attachmentUrl = `${res.data[0].fileUrl}?attname=${res.data[0].fileName}`
  uploadLoading.value = false
}

const delHandle = () => {
  uploadList.value = []
}

const previewHandle = (file) => {
  const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
  const extension = file.url.toLowerCase()
  const isImg = imageFormats.some((value) => extension.includes(value))
  if (isImg) {
    createImageViewer({
      zIndex: 9999999,
      urlList: [file.url]
    })
  } else {
    window.open(file.url, '_blank')
  }
}

const beforeUpload = () => {
  uploadLoading.value = true
}

// 关闭弹窗
function closeDialog() {
  emit('handleClose')
  formRef.value.resetFields()
  formData.attachmentUrl = ''
  uploadList.value = []
}

// 提交
async function submitForm() {
  formData.id = props.id
  try {
    await formRef.value.validate()
    const data = await MonitorApi.newProductPayNotifyUpdate(formData)
    if (data.success) {
      message.success('提交成功')
      emit('handleClose')
      emit('refresh')
    } else {
      message.error(data.message)
    }
  } catch (error) { }
}

const rules = ref({
  operationRemark: [
    {
      required: true,
      message: '请输入处理说明，最大长度200'
    }
  ]
})
</script>

<style scoped lang="less">
.file-list {
  margin: 0;
  margin-top: 8px;
  padding-left: 0;

  li {
    list-style: none;
    padding: 0;
    margin: 0;
    position: relative;
    display: flex;
    line-height: 26px;
    margin-bottom: 5px;

    .name {
      padding-left: 6px;
      font-size: 14px;
      cursor: pointer;
    }

    .document {
      width: 14px;
      height: 14px;
      color: #909399;
      padding-left: 6px;
      padding-top: 6px;
    }

    .close {
      display: none;
      position: absolute;
      right: 10px;
      top: 5px;
      color: #606266;
      cursor: pointer;
    }

    &:hover {
      background-color: #f5f7fa;

      .name {
        color: #0064ff;
      }

      .close {
        display: block;
      }
    }
  }
}

:deep(.el-dialog__body) {
  padding-right: 32px !important;
}

:deep(.el-dialog__footer) {
  padding-right: 32px;
  padding-top: 0;
  padding-bottom: 16px;
}

.upload {
  :deep(.el-upload) {
    flex-direction: column;
    align-items: start;
  }
}
</style>
