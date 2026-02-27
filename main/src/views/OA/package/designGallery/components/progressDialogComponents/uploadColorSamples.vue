<!--
 * @Date: 2025-07-22 08:46:34
-->
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
    <div class="container">
      <el-form :model="form" label-width="80px" ref="formRef" :rules="rules">
        <el-form-item label="供应商" prop="supplierId" v-if="currentDetail?.supplierId == '999'">
          <el-select v-model="form.supplierId" placeholder="请选择供应商">
            <el-option v-for="item in supplierList" :key="item.supplierId" :label="item.supplierName"
              :value="item.supplierId" />
          </el-select>
        </el-form-item>

        <el-form-item label="齐色正确样" prop="attachmentUrl">
          <SWUploadFile ref="swUploadFileRef" v-model:modelValue="form.attachmentUrl" :width="465" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <s-text-area v-model="form.remark" />
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
import { confirmColorSample } from '@/api/oa/new/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
const dialogVisible = ref(false)
const message = useMessage() // 消息弹窗

const form = ref({
  remark: '',
  attachmentUrl: '',
  supplierId: ''
})
defineProps({
  supplierList: {
    type: Array,
    default: () => []
  } // 供应商列表
})

const loading = ref(false)

const rules = {
  supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  attachmentUrl: [{ required: true, message: '请上传齐色正确样', trigger: 'change' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}
const currentDetail = ref()

watch(
  () => currentDetail.value?.supplierId,
  (newVal) => {
    if (newVal === '999') {
      rules.supplierId = [{ required: true, message: '请选择供应商', trigger: 'change' }]
    } else {
      rules.supplierId = []
    }
  }
)

const open = (item) => {
  console.log('打开齐色样上传弹窗', item)
  dialogVisible.value = true
  currentDetail.value = item
}

const emit = defineEmits(['success'])
const formRef = ref()
const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  message
    .confirm(
      `是否确认提交【齐色样上传】？${currentDetail.value.supplierId == '999' ? '' : '提交后打样进度流程结束！进入【选品阶段】？'}`,
      '系统提示'
    )
    .then(async () => {
      const data = {
        id: currentDetail.value.id,
        supplierId:
          currentDetail.value.supplierId == '999'
            ? form.value.supplierId
            : currentDetail.value.supplierId,
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
      loading.value = true
      await confirmColorSample(data)
      loading.value = false
      message.success('提交成功')
      emit('success')
      form.value = {
        remark: '',
        attachmentUrl: '',
        supplierId: ''
      }
      dialogVisible.value = false
    })
    .finally(() => {
      loading.value = false
      handleClose()
    })
    .catch(() => {
      loading.value = false
      console.log('取消提交')
    })
}

const handleClose = () => {
  dialogVisible.value = false
  form.value = {
    remark: '',
    attachmentUrl: '',
    supplierId: ''
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

.container {
  .el-form-item__label {
    text-align: right;
  }
}
</style>
