<template>
  <Dialog v-model="dialogVisible" title="批量导入" class="uploadDialog">
    <div style="margin-bottom: 20px">
      <div class="tips">
        <img src="@/assets/imgs/common/tips2.png" alt="" />
        <span>下载最新模板进行数据导入，否则可能出现导入失败的情况</span>
      </div>
      <el-button type="primary" @click="templateFileDownload">
        <el-icon><Document /></el-icon>导入模板下载</el-button
      >
    </div>

    <el-upload
      ref="uploadRef"
      class="OrderUpload"
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
    </el-upload>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>

  <!-- 店铺选择 -->
</template>
<script lang="ts" setup>
defineOptions({ name: 'ImportDataDialog' })
import { getAccessToken } from '@/utils/auth'
// import * as StoreApi from '@/api/system/store'
import { downloadByUrl2 } from '@/utils/download'
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const uploadRef = ref()
const importUrl =
  import.meta.env.VITE_BASE_URL +
  import.meta.env.VITE_API_URL +
  '/api/sample-management-inventory-add/uploadExcel'
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表

const formData = ref({})

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
  fileList.value = []
  resetForm()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const loadingInstance = ref()

const closePageLoading = () => {
  if (loadingInstance.value) {
    loadingInstance.value.close()
  }
}

/** 提交表单 */
const submitForm = async () => {
  if (fileList.value.length == 0) {
    message.error('请上传文件')
    return
  }

  uploadHeaders.value = {
    token: getAccessToken()
  }
  formLoading.value = true
  uploadRef.value!.submit()
}

/** 文件上传成功 */
const emits = defineEmits(['success'])
const submitFormSuccess = (response: any) => {
  if (response.code !== 200) {
    message.error(response.message)
    formLoading.value = false
    uploadRef.value?.clearFiles()
    return
  }
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

/** 模版下载 */
const templateFileDownload = () => {
  loadingInstance.value = ElLoading.service({ fullscreen: true, text: '模板下载中......' })
  const fileUrl = `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/excel/template/sample_inventory_batch_import_template.xlsx`
  downloadByUrl2(fileUrl, '样品批量导入模板.xlsx')
  closePageLoading()
}
</script>

<style lang="scss" scoped>
.tips {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  margin-top: -10px;
  display: flex;
  align-items: center;
  img {
    width: 14px;
    vertical-align: middle;
  }
}
.OrderUpload {
  margin-bottom: 15px;
}
</style>
