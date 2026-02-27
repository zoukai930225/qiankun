<template>
  <Dialog v-model="dialogVisible" title="问卷导入" class="commomDialig">
    <el-upload
      ref="uploadRef"
      class="CommonFileUpload"
      v-model:file-list="fileList"
      :action="importUrl"
      :auto-upload="false"
      :disabled="formLoading"
      :headers="uploadHeaders"
      :data="formData"
      :limit="1"
      :on-error="submitFormError"
      :on-exceed="handleExceed"
      :on-success="submitFormSuccess"
      :before-upload="beforeUpload"
      accept=".xlsx, .xls"
      drag
    >
      <Icon icon="ep:upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <template #tip>
        <div class="el-upload__tip text-center">
          <span>仅允许导入 xls、xlsx 格式文件。</span>
        </div>
      </template>

      <template #file>
        <div v-for="(item, index) in fileList" :key="index" class="flie-item">
          <!-- @ts-ignore -->
          <div>{{ item?.name }}</div>
          <img
            src="@/assets/imgs/common/close-icon.png"
            alt=""
            class="close-icon"
            @click="delFile(index)"
          /> </div
      ></template>
    </el-upload>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
defineOptions({ name: 'ImportDataDialog' })
import { getAccessToken } from '@/utils/auth'
import { ref } from 'vue'
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const uploadRef = ref()
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表

// 导入接口URL
const importUrl = `${import.meta.env.VITE_BASE_URL_OTR}/api/otr/survey/import`
// import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/otr/survey/import'
const formData = ref({
  surveyId: ''
})

const delFile = (index) => {
  fileList.value.splice(index, 1)
}

/** 打开弹窗 */
const open = (id) => {
  formData.value.surveyId = id
  dialogVisible.value = true
  fileList.value = []
  resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  if (fileList.value.length == 0) {
    message.error('请上传文件')
    return
  }
  uploadHeaders.value = {
    token: getAccessToken()
  }
  // formLoading.value = true
  uploadRef.value!.submit()
}

const beforeUpload = () => {
  console.log(importUrl, 'importUrl')
  formLoading.value = true
}

/** 文件上传成功 */
const emits = defineEmits(['success'])
const submitFormSuccess = async (response: any, file, fileList) => {
  dialogVisible.value = false
  message.success('导入成功')
  // 发送操作成功的事件
  emits('success')
}

/** 上传错误提示 */
const submitFormError = (): void => {
  message.error('上传失败，请您重新上传！')
  formLoading.value = false
}

/** 重置表单 */
const resetForm = () => {
  // 重置上传状态和文件
  formLoading.value = false
  uploadRef.value?.clearFiles()
}

/** 文件数超出提示 */
const handleExceed = (): void => {
  message.error('最多只能上传一个文件！')
}
</script>

<style lang="scss" scoped>
.CommonFileUpload {
  margin-bottom: 15px;
}

.topFilter {
  margin-bottom: 30px;

  &-title {
    font-size: 14px;
    color: #606266;
    line-height: 22px;
    padding-right: 10px;
  }

  &-select {
    width: 180px;
    margin-right: 46px;
  }
}
.flie-item {
  display: flex;
  flex-direction: row;
  // justify-content: space-between;
  align-items: center;
}
.close-icon {
  width: 16px;
  height: 14px;
  margin-left: 20px;
}
</style>
