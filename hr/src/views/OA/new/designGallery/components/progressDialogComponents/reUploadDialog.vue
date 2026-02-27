<template>
  <el-dialog v-model="dialogVisible" :show-close="false" @close="handleClose" style="
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
    <div style="height: 1px; background: #f0f0f0"></div>
    <div class="container">
      <div class="row-center" style="margin-bottom: 20px;margin-top: 15px;">
        <div style="background: #0064FF;width: 3px;height: 10px;margin-right: 6px;"></div>
        <div style="font-weight: 600; color: #333333; ">审核信息</div>

      </div>
      <el-form :model="form" label-width="80px" ref="formRef" :rules="rules">
        <el-form-item label="节点状态">
          <div class="row-center">
            <img src="@/assets/imgs/oa/oa_qa_fail.png" style="width: 16px;height: 16px;margin-right: 2px" />
            <div style="color:#E43636 ;font-size:14px;">QA审核拒绝</div>
          </div>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <s-text-area style="width: 450px;" v-model="refuseInfo.remark" :disabled="true" />
        </el-form-item>
        <el-form-item label="附件" prop="attachmentUrl1">
          <SWUploadFile style="margin-left: -10px;" ref="swUploadFileRef" v-model:modelValue="refuseInfo.attachmentUrl"
            :width="450" :only-show="true" />
        </el-form-item>
      </el-form>
    </div>
    <div class="container" style="margin-top: 15px;">
      <div class="row-center" style="margin-bottom: 20px;margin-top: 15px;">
        <div style="background: #0064FF;width: 3px;height: 10px;margin-right: 6px;"></div>
        <div style="font-weight: 600; color: #333333; ">重新上传</div>

      </div>
      <el-form :model="form" label-width="80px" ref="formRef" :rules="rules">
        <el-form-item label="备注" prop="remark">
          <s-text-area style="width: 450px;" v-model="form.remark" />
        </el-form-item>
        <el-form-item label="附件" prop="attachmentUrl">
          <SWUploadFile ref="swUploadFileRef" v-model:modelValue="form.attachmentUrl" :width="450" />
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
import { confirmReUpload } from '@/api/oa/new/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
const dialogVisible = ref(false)
const message = useMessage() // 消息弹窗

const form = ref({
  remark: '',
  attachmentUrl: '',
})
const props = defineProps({
})

const loading = ref(false)

const rules = {
  attachmentUrl: [{ required: true, message: '请上传附件', trigger: 'change' }],
}
const currentDetail = ref()
const refuseInfo = ref({
  remark: '',
  attachmentUrl: "",
})

const open = (item) => {
  dialogVisible.value = true
  currentDetail.value = item
  if (item.npSupplierAuditRecordList && item.npSupplierAuditRecordList.length > 0) {
    item.npSupplierAuditRecordList.forEach((item1) => {
      if (Number(item1.flowStatus) == 8 && Number(item1.operateStatus) === 5) {
        refuseInfo.value.remark = item1.remark || ""
        refuseInfo.value.attachmentUrl = item1.attachmentUrl
          ? item1.attachmentUrl.split(',').map((item) => {
            return {
              url: item,
            }
          })
          : []
        console.log("dsfkjl ", refuseInfo.value)
      }
    })
  }
  console.log("大姐夫撒颗粒剂", currentDetail.value)
}

const emit = defineEmits(['success']) // 定义 success 事件
const formRef = ref()
const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  //二次确认提交逻辑
  // 提交逻辑
  console.log('提交表单', form.value)
  const data = {
    id: currentDetail.value.id,
    remark: form.value.remark,
    attachmentUrl:
      (form.value.attachmentUrl &&
        form.value.attachmentUrl
          .map((item) => {
            console.log('附件地址', item)
            return `${item.url}?fileName=${item.name}`
          })
          .join(',')) ||
      ''
  }
  try {
    loading.value = true
    await confirmReUpload(data)
    loading.value = false
    message.success('重新上传成功')
    emit('success') // 提交成功后触发 success 事件
    dialogVisible.value = false
    form.value = {
      remark: '',
      attachmentUrl: '',
    }
  } finally {
    loading.value = false

  }
}

const handleClose = () => {
  dialogVisible.value = false
  form.value = {
    remark: '',
    attachmentUrl: '',
  }
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
  .el-form-item__label {
    text-align: right;
  }
}
</style>
