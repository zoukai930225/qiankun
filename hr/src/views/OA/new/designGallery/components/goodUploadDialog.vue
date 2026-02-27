<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <el-dialog v-model="visible" :width="width" :before-close="handleClose" class="oadialog-background"
    :close-on-click-modal="false">
    <div v-loading="currentUploadStatus" element-loading-text="样衣图上传中，请稍候...">
      <div class="dialog-content"
        style="width: 580px; height: 262px; padding: 20px; box-sizing: border-box; overflow-y: auto">
        <el-form ref="ruleFormRef" :model="form" label-width="auto" style="max-width: 580px" :rules="rules">
          <el-form-item label="产品图" prop="samplePicture">
            <template #label>
              <span class="custom-require">*</span>
              <span>样衣图</span>
            </template>
            <SWuploadImg v-model:modelValue="form.samplePicture" @upload-status="getUploadStatus" />
          </el-form-item>

          <el-form-item label="备注" prop="sampleRemark">
            <s-text-area v-model="form.sampleRemark" class="textarea" style="width: 100%" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #header="{ }">
      <div class="my-header">
        <img src="@/assets/imgs/oa/yangyishangchuan-title.png" class="shenhe-title" />
        <span>{{ title }}</span>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :disabled="currentUploadStatus">取消</el-button>
        <el-button type="primary" @click="confirmDialog" :disabled="currentUploadStatus">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { uploadSample } from '@/api/oa/new/designGallery/index'
import SWuploadImg from './SWuploadImg.vue'
const message = useMessage() // 消息弹窗

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '样衣上传'
  },
  width: {
    type: String,
    default: '620px'
  },

  selectItem: {
    type: Object,
    default: () => ({})
  }
})
const form = reactive({
  sampleRemark: undefined,
  samplePicture: undefined
})

watch(
  () => props.selectItem,
  (newVal) => {
    if (!newVal) return
    form.sampleRemark = newVal.sampleRemark || undefined
    if (newVal.samplePicture) {
      form.samplePicture = newVal.samplePicture.split(',').map((item) => {
        return {
          url: item
        }
      })
    }
  },
  { deep: true, immediate: true }
)

const rules = reactive({
  // examineRemark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const handleClose = () => {
  if (currentUploadStatus.value) return //如果是样衣上传中，则不能关闭弹窗
  form.sampleRemark = undefined
  form.samplePicture = undefined
  emit('update:modelValue', false)
  emit('cancel')
}

const resetForm = () => {
  form.sampleRemark = undefined
  form.samplePicture = undefined
}

const currentUploadStatus = ref(false) // 当前上传状态 true表示当前样衣图在上传中
const getUploadStatus = (status) => {
  currentUploadStatus.value = status
}

const ruleFormRef = ref()
const confirmDialog = async () => {
  const picstr =
    // @ts-ignore
    form.samplePicture &&
    form.samplePicture
      // @ts-ignore
      .map((item) => {
        return (item?.response?.data?.ossPath || item.url) + '?name=' + item.name
      })
      .join(',')
  if (!picstr) {
    message.error('请上传图片')
    return
  }

  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        id: props.selectItem.id,
        developmentPlanId: props.selectItem.developmentPlanId,
        enterprisePlanId: props.selectItem.enterprisePlanId,
        samplePicture: picstr, //样衣图片
        sampleRemark: form.sampleRemark
      }
      await uploadSample(data)
      message.success('操作成功')
      emit('confirm')
      emit('update:modelValue', false)
      handleClose()
    } else {
      return false
    }
  })
}
</script>

<style scoped lang="scss">
:deep(.textarea) {
  .el-textarea__inner {
    resize: none;
  }
}

.dialog-footer {
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;

  .shenhe-title {
    width: 14px;
    height: 16px;
    margin-right: 6px;
    margin-top: 3px;
  }
}

.custom-require {
  color: red;
  margin-right: 3px;
  font-size: 15px;
}

:deep(.el-upload--picture-card) {
  width: 146px;
  height: 146px;
  border: none;
}
</style>

<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>
