<!--
 * @Date: 2025-07-12 10:59:18
-->
<template>
  <div>
    <el-dialog v-model="visible" :show-close="false" width="614px" style="padding: 0; box-sizing: border-box">
      <template #header="{ close: closeDialog }">
        <div class="my-header">
          <div>审核</div>
          <img src="@/assets/imgs/common/close-new.png" alt="" @click="closeDialog" class="close" />
        </div>
      </template>
      <div class="content">
        <el-form ref="formRef" style="max-width: 600px" :model="form" label-width="auto">
          <el-form-item label="是否通过审核" prop="examineResult">
            <el-radio-group v-model="form.examineResult">
              <el-radio value="1">通过</el-radio>
              <el-radio value="2">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="examineRemark">
            <s-text-area v-model="form.examineRemark" />
          </el-form-item>
          <el-form-item label="附件" style="width: 100%">
            <div style="width: 100%">
              <div style="display: flex">
                <el-upload style="width: 60%" v-model:file-list="fileList" :action="importUrl" class="upload"
                  :headers="uploadHeaders" name="files" :show-file-list="false"
                  :data="{ code: 'NEW_PRODUCT', businessForeignKey: selectId }" :on-error="uploadError"
                  :on-success="uploadSuccess" :before-upload="beforeUpload" :disabled="false">
                  <el-button type="primary" :loading="auditUploadLoading">点击上传</el-button>
                </el-upload>
                <!-- <div v-if="uploadList.length === 0" style="color: #666666">暂无附件</div> -->
              </div>
              <ul class="file-list" :class="{ 'file-list1': true }" v-if="uploadList.length > 0">
                <li v-for="(item, index) in uploadList" :key="item.url">
                  <el-icon class="document">
                    <Document />
                  </el-icon>
                  <div class="name text1" style="max-width: 250px" @click="previewHandle(item)">{{
                    item.name
                  }}</div>
                  <!-- 删除按钮会在提交人未提交，或者审核人拒绝的情况下展示 -->
                  <el-icon class="close" @click="delHandle(item, index)">
                    <Close />
                  </el-icon>
                </li>
              </ul>
            </div>
          </el-form-item>
        </el-form>
      </div>

      <template #footer="{ }">
        <div class="my-footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="audit" :loading="auditLoading">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { prenatalSampleExamine } from '@/api/oa/new/develop'
import { createImageViewer } from '@/components/ImageViewer'
import { getAccessToken } from '@/utils/auth'
import { emit } from 'process'

const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/ossInfo/upload'
const uploadHeaders = ref({ token: getAccessToken() }) // 上传 Header 头
const selectId = ref('')
const message = useMessage() // 消息弹窗
const auditLoading = ref(false) // 审核按钮 loading

const fileList = ref([])
const visible = ref(false)

const props = defineProps({
  selectedItems: {
    type: Array,
    default: () => []
  },
  designPictureGodownId: {
    type: String,
    default: ''
  }
})

const close = () => {
  visible.value = false
  form.value = {
    examineResult: '',
    examineRemark: ''
  }
  fileList.value = []
  uploadList.value = []
}

const formRef = ref(null)
const form = ref({
  examineResult: '',
  examineRemark: ''
})

const open = (arr) => {
  visible.value = true
  console.log('打开审核弹窗', arr)
}
const uploadList = ref<any[]>([])
const emit = defineEmits(['success'])

// 图片上传成功提示
const uploadSuccess = (res: any): void => {
  uploadList.value.push({ url: res.data[0].fileUrl, name: res.data[0].fileName })
  uploadLoading.value = false
  auditUploadLoading.value = false
}
const uploadLoading = ref(false) //上传loading
const auditUploadLoading = ref(false) //上传loading

const delHandle = (item, index) => {
  uploadList.value.splice(index, 1)
}

const audit = () => {
  if (!form.value.examineResult) {
    message.error('请选择审核结果')
    return
  }
  message
    .confirm('是否确认审核？', '系统提示')
    .then(async () => {
      // 审核逻辑
      console.log('审核通过', form.value, fileList.value)
      const data = {
        ...form.value,
        ids: props.selectedItems.map((item) => item.id),
        designPictureGodownId: props.designPictureGodownId,
        examineAttachmentUrl: fileList.value
          .map((item) => {
            return `${item.response?.data[0]?.fileUrl}?fileName=${item.response?.data[0]?.fileName}`
          })
          .join(',')
      }
      auditLoading.value = true
      await prenatalSampleExamine(data)
      message.notifySuccess('审核成功')
      emit('success')
      auditLoading.value = false
      close()
    })
    .catch(() => {
      auditLoading.value = false
    })
}

const previewHandle = (file) => {
  const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp']
  const extension = file.url.toLowerCase()
  const isImg = imageFormats.some((value) => extension.includes(value))
  console.log(isImg)
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

// 图片上传错误提示
const uploadError = () => {
  uploadLoading.value = false
  auditUploadLoading.value = false
  message.notifyError('图片上传失败，请您重新上传！')
}

const beforeUpload = (file) => {
  uploadLoading.value = true
  auditUploadLoading.value = true
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.my-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;

  .close {
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  .title {
    font-family: PingFang SC;
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0px;
    color: #333333;
  }
}

.my-footer {
  padding: 10px 20px;
  box-sizing: border-box;
  border-top: 1px solid #eceaea;
}

.content {
  min-height: 372px;
  padding: 0 20px 20px;
  box-sizing: border-box;
}

.file-list1 {
  margin-top: 3px;
}

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
</style>
