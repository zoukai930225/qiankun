<!--
 * @Date: 2025-07-22 08:46:34
-->
<template>
  <el-dialog title="应用范围" v-model="dialogVisible" :show-close="false" style="
      width: 570px;
      background: linear-gradient(226deg, #ffffff 0%, #ffffff 88%, #e8f6fd 95%, #f0f8ff 100%);
      border-radius: 14px;
    ">
    <template #header>
      <div class="header">
        <div>{{ currentDetail?.supplierName }}</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
      </div>
    </template>
    <div class="container">
      <el-form :model="form" label-width="53px" :rules="rules" ref="formRef">
        <el-form-item label="备注" prop="remark">
          <s-text-area v-model="form.remark" />
        </el-form-item>
        <el-form-item label="附件" prop="desc">
          <SWUploadFile ref="swUploadFileRef" v-model:modelValue="form.prenatalSamplePictureUrl" :width="473" />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="loading">提 交</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { addRemark } from '@/api/oa/package/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
const dialogVisible = ref(false)
const message = useMessage() // 消息弹窗

const form = ref({
  remark: '',
  prenatalSamplePictureUrl: undefined
})
const loading = ref(false) // 提交按钮加载状态

// 当前操作的详情
const currentDetail = ref()
const open = (item) => {
  dialogVisible.value = true
  currentDetail.value = item
}

const rules = {
  remark: [{ required: true, message: '请输入备注信息', trigger: 'blur' }]
}

const emit = defineEmits(['success'])

const formRef = ref()

const submitForm = async () => {
  // 验证表单
  const res = await formRef.value.validate()
  if (!res) return

  if (form.value.prenatalSamplePictureUrl && form.value.prenatalSamplePictureUrl.length > 0) {
    let isExistUploading = false
    form.value.prenatalSamplePictureUrl.forEach((element) => {
      if (element.uploadStatus && element.uploadStatus === 'uploading') {
        isExistUploading = true
      }
    })
    if (isExistUploading) {
      message.warning('文件上传中，请稍等')
      return
    }
  }
  //二次确认提交逻辑
  message
    .confirm('请仔细核对备注信息，确认提交？', '系统提示')
    .then(async () => {
      // 提交逻辑
      console.log('提交表单', form.value)
      const params = {
        id: currentDetail.value.id,
        // supplierId: currentDetail.value.supplierId,
        remark: form.value.remark,
        attachmentUrl:
          form.value.prenatalSamplePictureUrl &&
          form.value.prenatalSamplePictureUrl
            .map((item) => {
              if (
                item.name.includes('.jpg') ||
                item.name.includes('.png') ||
                item.name.includes('.jpeg')
              ) {
                return item.url
              } else {
                return item.url + '?fileName=' + item.name
              }
            })
            .join()
      }
      loading.value = true // 开始加载
      await addRemark(params)
      loading.value = false // 停止加载
      message.success('提交成功')
      // 关闭弹窗
      form.value.remark = ''
      form.value.prenatalSamplePictureUrl = undefined
      currentDetail.value = null
      dialogVisible.value = false
      emit('success')
    })
    .catch(() => {
      loading.value = false // 停止加载
      console.log('取消提交')
    })
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
/* 隐藏滚动条，但保持滚动功能 */
::-webkit-scrollbar {
  display: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  img {
    width: 14px;
    cursor: pointer;
  }
}

.container {
  padding-right: 12px;
  box-sizing: border-box;
}
</style>
