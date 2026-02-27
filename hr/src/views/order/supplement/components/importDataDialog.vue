<template>
  <Dialog v-model="dialogVisible" title="补单数据导入" class="commomDialig">
    <div style="margin-bottom: 20px">
      <div class="tips"
        ><img src="@/assets/imgs/common/tips2.png" alt="" />
        下载最新模板进行数据导入，否则可能出现导入失败的情况
        <div style="padding-left: 20px">导入的补单数据按照当前选择【店铺】【刷单日期】进行保存</div>
      </div>
      <el-button type="primary" @click="templateFileDownload">
        <el-icon><Document /></el-icon>导入模板下载</el-button
      >
    </div>
    <div class="topFilter row-center" style="margin-bottom: 18px">
      <div class="topFilter-title">店铺:</div>
      <StoreRangePlus v-model="formData.storeId" placeholder="请选择店铺" width="100%" />
    </div>
    <div class="topFilter row-center">
      <div class="topFilter-title">刷单日期:</div>
      <el-date-picker
        style="width: 100%"
        v-model="formData.date"
        value-format="YYYY-MM-DD"
        type="date"
        placeholder="请选择刷单日期"
      />
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
import * as OrderApi from '@/api/order'
import download from '@/utils/download'
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const uploadRef = ref()
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/makeup/orders/import'
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表

const formData = ref({
  storeId: '',
  storeName: '',
  date: ''
})

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
  fileList.value = []
  // getStoreList()
  resetForm()
  // let today = new Date();
  // formData.value.date = today.getFullYear() + '-' + today.getMonth() + 1 + '-' + today.getDate();
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// const storeList = ref<any[]>([])
// const getStoreList = async () => {
//   storeList.value = []
//   const data = await StoreApi.getStorePage({ page: 1, size: 99999 }).catch(() => {})
//   if (data) {
//     storeList.value = []
//     data.data.forEach((item) => {
//       storeList.value.push({ value: item.code, label: item.name })
//     })
//   }
// }

/** 提交表单 */
const submitForm = async () => {
  if (!formData.value.storeId) {
    message.error('请选择店铺')
    return
  }
  if (!formData.value.date) {
    message.error('请选择刷单日期')
    return
  }
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
  formData.value = {
    storeId: '',
    storeName: '',
    date: ''
  }
  uploadRef.value?.clearFiles()
}

/** 文件数超出提示 */
const handleExceed = (): void => {
  message.error('最多只能上传一个文件！')
}

/** 补单数据模版下载 */
const exporting = ref(false)
const templateFileDownload = async () => {
  exporting.value = true
  const data = await OrderApi.supplementOrdersTemplateExport().catch(() => {
    exporting.value = false
  })
  exporting.value = false
  if (data) {
    download.excel(data, '补单数据导入模板.xls')
  }
}
</script>

<style lang="scss" scoped>
.tips {
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
  img {
    width: 14px;
    vertical-align: middle;
  }
}
.topFilter {
  margin-bottom: 30px;
  cursor: pointer;
  &-title {
    display: inline-block;
    width: 70px;
    font-size: 14px;
    color: #606266;
    line-height: 22px;
    padding-right: 10px;
    text-align: right;
  }
  &-select {
    width: 320px;
    margin-right: 46px;
  }
}
.OrderUpload {
  margin-bottom: 15px;
}
</style>
