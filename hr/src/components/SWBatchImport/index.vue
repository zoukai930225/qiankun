<template>
  <Dialog v-model="dialogVisible" :title="tittle" class="commomDialig">
    <RedBookImport
      ref="redBookImportRef"
      v-if="importType === SWBatchImportType.redBook"
      @handle-query="handleQuery"
    />
    <FixedAssetImport
      ref="fixedAssetImportRef"
      v-if="importType === SWBatchImportType.fixedAsset"
      @handle-query="handleQuery"
    />

    <el-upload
      ref="uploadRef"
      class="CommonFileUpload"
      v-model:file-list="fileList"
      :action="importUrl"
      :auto-upload="false"
      v-loading="formLoading"
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
import { handleUploadFileRequest } from '@/utils'

import { SWBatchImportType } from './index'
import RedBookImport from './components/redBook.vue'
import FixedAssetImport from './components/fixedAsset.vue'
import { ref, computed } from 'vue'
const props = withDefaults(
  defineProps<{
    importType: SWBatchImportType
    id: string
  }>(),
  {
    importType: SWBatchImportType.redBook,
    id: ''
  }
)

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中
const uploadRef = ref()
const uploadHeaders = ref() // 上传 Header 头
const fileList = ref([]) // 文件列表

// 弹窗标题
const tittle = computed(() => {
  switch (props.importType) {
    case SWBatchImportType.redBook:
      return '文章批量导入'
    case SWBatchImportType.fixedAsset:
      return '固定资产导入'
    case SWBatchImportType.otrEvluation:
      return '评价关系导入'
    default:
      return ''
  }
})

// 导入接口URL
const importUrl = computed(() => {
  switch (props.importType) {
    case SWBatchImportType.redBook:
      return import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/xhs/import'
    case SWBatchImportType.fixedAsset:
      return import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/fixedAsset/import'
    case SWBatchImportType.otrEvluation:
      return import.meta.env.VITE_BASE_URL_OTR + '/api/otr/evaluation/record/uploadFile'
    default:
      return ''
  }
})
const formData = ref<any>({})

/** 筛选条件完成搜索 */
const handleQuery = (data: any) => {
  formData.value = data
}

const delFile = (index) => {
  fileList.value.splice(index, 1)
}

/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
  fileList.value = []
  resetForm()
  // 人才盘点评价关系 导入 id 改为 活动id
  if (props.importType === SWBatchImportType.otrEvluation) {
    formData.value.inventoryId = props.id
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const redBookImportRef = ref()
const fixedAssetImportRef = ref()

/** 提交表单 */
const submitForm = async () => {
  if (props.importType === SWBatchImportType.redBook) {
    // 小红书文章导入
    if (!redBookImportRef.value.validorParams()) return
  } else if (props.importType === SWBatchImportType.fixedAsset) {
    // 固定资产导入
    if (!fixedAssetImportRef.value.validorParams()) return
  }

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
  formLoading.value = true
}

/** 文件上传成功 */
const emits = defineEmits(['success', 'fail'])
const submitFormSuccess = async (response: any, file, fileList) => {
  if (!handleUploadFileRequest(response)) return
  // 固定资产上传后如果有固定资产编号重复数据，则下载后端返回的重复数据
  // if (response.code === 200 && props.importType === SWBatchImportType.fixedAsset) {
  //   if (response.data.startsWith('https')) {
  //     const link = document.createElement('a')
  //     link.href = response.data
  //     link.download = '批量导入编号重复数据.xlsx'
  //     document.body.appendChild(link)
  //     link.click()
  //     document.body.removeChild(link)
  //   }
  // }
  if (response.code !== 200) {
    fileList[0].status = 'ready' //失败之后更改状态重新才可以上传
    formLoading.value = false
    message.error(response.msg || response.message)
    emits('fail', response)
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
