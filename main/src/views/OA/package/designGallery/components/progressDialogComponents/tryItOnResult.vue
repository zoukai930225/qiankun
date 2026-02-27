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
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px">
        <el-form-item label="打样结果" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio value="4">通过</el-radio>
            <el-radio value="5">继续调整</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="调整原因" prop="operateStatus" v-if="form.state && form.state != '4'">
          <el-select v-model="form.operateStatus">
            <el-option label="设计问题" value="2" />
            <el-option label="打样问题" value="1" />
            <el-option label="工厂问题" value="3" v-if="currentDetail?.supplierId != '999'" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <s-text-area v-model="form.remark" />
        </el-form-item>

        <el-form-item label="版师修改意见" prop="attachmentUrl" v-if="form.operateStatus == '1'">
          <SWUploadFile ref="swUploadFileRef" v-model:modelValue="form.attachmentUrl" :width="470" />
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
import { confirmTrialResult } from '@/api/oa/package/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
const dialogVisible = ref(false)
const message = useMessage() // 消息弹窗

const loading = ref(false)

const form = ref({
  remark: '', //备注
  operateStatus: undefined, //1 打烊问题；2 设计稿问题；3 工厂问题；4 审核通过
  state: '', // 自定义状态
  attachmentUrl: '', // 附件地址
  region: ''
})

const currentDetail = ref()
const open = (item) => {
  dialogVisible.value = true
  currentDetail.value = item
}

const emit = defineEmits(['success'])

const rules = {
  state: [{ required: true, message: '请选择打样结果', trigger: 'change' }],
  operateStatus: [{ required: true, message: '请选择调整原因', trigger: 'change' }],
  remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
  attachmentUrl: [{ required: true, message: '请上传附件', trigger: 'change' }]
}

watch(
  () => form.value.operateStatus,
  (newVal) => {
    if (newVal == '1') {
      rules.attachmentUrl = [{ required: true, message: '请上传附件', trigger: 'change' }]
    } else {
      rules.attachmentUrl = []
    }
  }
)

const formRef = ref()
const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  //二次确认提交逻辑
  message
    .confirm(
      `该供应商打样结果为${form.value.state == '4' ? '【通过】' : '【继续调整】'}，是否确认？`,
      '系统提示'
    )
    .then(async () => {
      // 提交逻辑
      const params = {
        id: currentDetail.value.id,
        enterpriseId: currentDetail.value.enterpriseId, //商企规划id
        developmentTaskId: currentDetail.value.developmentTaskId, //开发任务id
        designGalleryId: currentDetail.value.designGalleryId, //设计图库id
        operateStatus: form.value.state == '4' ? 4 : form.value.operateStatus,
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
      await confirmTrialResult(params)
      loading.value = false
      emit('success')
      message.success('提交成功')
      form.value = {
        remark: '',
        operateStatus: undefined,
        state: '', // 默认通过
        attachmentUrl: '',
        region: ''
      }
      currentDetail.value = null
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

.el-form-item__label {
  text-align: right;
}
</style>
