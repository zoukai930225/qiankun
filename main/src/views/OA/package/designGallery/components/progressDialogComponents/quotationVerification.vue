<!--
 * @Date: 2025-07-22 08:46:34
 报价核价
-->
<template>
  <el-dialog v-model="dialogVisible" :show-close="false" style="
      background: linear-gradient(226deg, #ffffff 0%, #ffffff 88%, #e8f6fd 95%, #f0f8ff 100%);
      border-radius: 14px;
      width: 720px;
    ">
    <template #header>
      <div class="header">
        <div>{{ currentDetail?.supplierName }}</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
      </div>
    </template>
    <div class="container">
      <el-form :model="form" label-width="120px" ref="formRef" :rules="rules" label-position="right">
        <el-form-item label="实物报价（单价不含税）" prop="physicalQuotePrice">
          <!-- 输入框 更改为数字框，最多保留小数点3位 -->
          <el-input-number v-model="form.physicalQuotePrice" :precision="3" :min="0" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <s-text-area v-model="form.remark" />
        </el-form-item>
        <el-form-item label="报价补充" prop="supplementaryQuotation">
          <s-text-area v-model="form.supplementaryQuotation" :rows="3" />
        </el-form-item>
        <el-form-item label="报价单" prop="quotationSheetFile">
          <SWUploadFile ref="swUploadFileRef" v-model:modelValue="form.quotationSheetFile" :width="568" />
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
import { confirmQuotePrice } from '@/api/oa/package/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
import { ref } from 'vue'
const dialogVisible = ref(false)
const message = useMessage() // 消息弹窗

const form = ref({
  physicalQuotePrice: undefined,
  remark: undefined,
  packagingCost: undefined,
  quotationSheetFile: '',
  supplementaryQuotation: undefined
})
const rules = {
  physicalQuotePrice: [
    { required: true, message: '请输入实物报价（单价不含税）', trigger: 'blur' }
  ],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
  quotationSheetFile: [{ required: true, message: '请上传报价单', trigger: 'change' }],
  supplementaryQuotation: [{ required: true, message: '请输入报价补充', trigger: 'blur' }]
}

const currentDetail = ref()
const open = (item) => {
  dialogVisible.value = true
  currentDetail.value = item
}
const loading = ref(false) // 提交按钮加载状态
const emit = defineEmits(['success']) // 定义 success 事件

const formRef = ref()
const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  //二次确认提交逻辑
  await message.confirm('是否确认提交【报价核价】？', '系统提示')
  // 提交逻辑
  console.log('提交表单', form.value)
  try {
    const data = {
      id: currentDetail.value.id,
      physicalQuotePrice: form.value.physicalQuotePrice,
      remark: form.value.remark,
      supplementaryQuotation: form.value.supplementaryQuotation,
      quotationSheetFile:
        (form.value.quotationSheetFile &&
          form.value.quotationSheetFile
            .map((item) => {
              console.log('附件地址', item)
              return `${item.url}?fileName=${item.name}`
            })
            .join(',')) ||
        ''
    }
    loading.value = true
    await confirmQuotePrice(data)
    loading.value = false
    message.success('提交成功')
    form.value = {
      physicalQuotePrice: undefined,
      remark: undefined,
      quotationSheetFile: '',
      packagingCost: undefined,
      supplementaryQuotation: undefined
    }
    currentDetail.value = null
    emit('success')
    dialogVisible.value = false
  } catch (error) {
    loading.value = false
  }
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

:deep(.el-form-item__label) {
  display: flex;
  align-items: center;
  padding-left: 0px;
  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-align: right;
  letter-spacing: normal;
  color: #666666;
}
</style>
