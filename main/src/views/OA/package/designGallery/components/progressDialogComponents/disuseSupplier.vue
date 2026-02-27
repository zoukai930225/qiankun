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
      <el-form :model="form" ref="formRef" label-position="right" label-width="60px" :rules="rules">
        <el-form-item label="备注" prop="remark">
          <s-text-area v-model="form.remark" />
        </el-form-item>
        <el-form-item label="附件" prop="attachmentUrl">
          <SWUploadFile ref="swUploadFileRef" v-model:modelValue="form.attachmentUrl" :width="480" />
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
import { eliminateSupplier } from '@/api/oa/package/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'

const dialogVisible = ref(false)
const message = useMessage()

const form = ref({
  remark: '',
  attachmentUrl: ''
})

const loading = ref(false)

const currentDetail = ref()
const open = (item) => {
  dialogVisible.value = true
  currentDetail.value = item
}
const formRef = ref()
const rules = {
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}

const emit = defineEmits(['success'])

const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  message
    .confirm(`淘汰供应商【${currentDetail.value.supplierName}】，是否确认？`, '系统提示')
    .then(async () => {
      const data = {
        id: currentDetail.value.id,
        remark: form.value.remark,
        attachmentUrl:
          (form.value.attachmentUrl &&
            form.value.attachmentUrl
              .map((item) => {
                return `${item.url}?fileName=${item.name}`
              })
              .join(',')) ||
          ''
      }
      loading.value = true
      await eliminateSupplier(data)
      loading.value = false
      message.success('操作成功')
      emit('success')
      form.value.remark = ''
      form.value.attachmentUrl = ''
      dialogVisible.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

defineExpose({ open })
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
</style>
