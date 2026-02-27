<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <el-dialog
    v-model="visible"
    :width="width"
    :before-close="handleClose"
    class="oadialog-background"
    :append-to-body="true"
  >
    <div>
      <div
        class="dialog-content"
        style="width: 580px; height: 202px; padding: 20px; box-sizing: border-box"
      >
        <el-form
          ref="ruleFormRef"
          :model="form"
          label-width="auto"
          style="max-width: 580px"
          :rules="rules"
        >
          <el-form-item label="产前样图" prop="beforeProduceSample">
            <template #label>
              <span class="custom-require">*</span>
              <span>产前样图</span>
            </template>
            <SWuploadImg
              v-model:modelValue="form.beforeProduceSample"
              :uploadDisabled="forbidEdit"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #header="{}">
      <div class="my-header">
        <img src="@/assets/imgs/oa/yangyishangchuan-title.png" class="shenhe-title" />
        <span>{{ dialogTitle }}</span>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import SWuploadImg from '@/views/OA/new/designGallery/components/SWuploadImg.vue'

import { getDesignDetailById, updateDesign } from '@/api/oa/new/designGallery/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  forbidEdit: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    required: true
  },

  width: {
    type: String,
    default: '620px'
  }
})
const dialogTitle = ref('')
const form = reactive({
  npDesignPictureGodownId: undefined,
  beforeProduceSample: undefined
})

const selectItem = ref()
const open = async (data: any) => {
  dialogTitle.value = data.nodeName || ''
  selectItem.value = data || {}
  form.npDesignPictureGodownId = data.npDesignPictureGodownId || ''
  form.beforeProduceSample = undefined
  designData.value = {}
  visible.value = true
  getDesignDetail()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const designData = ref()
const getDesignDetail = async () => {
  if (!form.npDesignPictureGodownId) {
    return
  }
  const res = await getDesignDetailById(form.npDesignPictureGodownId)
  designData.value = res || {}
  if (designData.value.beforeProduceSample) {
    form.beforeProduceSample = designData.value.beforeProduceSample.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

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
  form.npDesignPictureGodownId = undefined
  form.beforeProduceSample = undefined

  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}

const ruleFormRef = ref()
const confirmDialog = async () => {
  const picstr =
    // @ts-ignore
    form.beforeProduceSample &&
    form.beforeProduceSample
      // @ts-ignore
      .map((item) => {
        return item?.response?.data?.ossPath || item.url
      })
      .join(',')
  if (!picstr) {
    message.error('请上传图片')
    return
  }

  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        ...designData.value,
        beforeProduceSample: picstr //产前样样衣图片
      }
      await updateDesign(data)
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
  width: 110px;
  height: 110px;
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
