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
    <div class="container" style="margin-top: 15px;">
      <el-form :model="form" label-width="86px" ref="formRef" :rules="rules">
        <el-form-item label="审核结果" prop="operateStatus" required>
          <el-radio-group v-model="form.operateStatus">
            <el-radio label="4">通过</el-radio>
            <el-radio label="5">不通过</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="重新打样" prop="reSample" v-if="form.operateStatus == '5'">
          <el-checkbox-group v-model="form.reSample">
            <el-checkbox label="试穿样"></el-checkbox>
            <el-checkbox v-if="productType !== '0'" label="齐色样"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
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
import { confirmQAAuditSample } from '@/api/oa/new/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
const dialogVisible = ref(false)
const message = useMessage() // 消息弹窗

const form = ref({
  operateStatus: '4',
  remark: '',
  attachmentUrl: '',
  reSample: []
})
const props = defineProps({
  productType: {
    type: String,
    default: 0
  }
})

const loading = ref(false)

const rules = {
  reSample: [{ required: true, message: '请选择重新打样选项', trigger: 'change' }],
}
const currentDetail = ref()


const open = (item) => {
  dialogVisible.value = true
  currentDetail.value = item
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
    operateStatus: form.value.operateStatus,
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
  console.log("地方建设路口", form.value.reSample)
  if (Number(form.value.operateStatus) == 5) {
    var reSampleArr = []
    if (form.value.reSample.includes('试穿样')) {
      reSampleArr.push(1)
    }
    if (form.value.reSample.includes('齐色样')) {
      reSampleArr.push(2)
    }
    data['reSample'] = reSampleArr.join(',') || ''
  }
  try {
    loading.value = true
    await confirmQAAuditSample(data)
    loading.value = false
    message.success('审核成功')
    emit('success') // 提交成功后触发 success 事件
    dialogVisible.value = false
    form.value = {
      operateStatus: '4',
      remark: '',
      attachmentUrl: '',
      reSample: []
    }
  } finally {
    loading.value = false

  }
}

const handleClose = () => {
  dialogVisible.value = false
  form.value = {
    operateStatus: '4',
    remark: '',
    attachmentUrl: '',
    reSample: []
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
