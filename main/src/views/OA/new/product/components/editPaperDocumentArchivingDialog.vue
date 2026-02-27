<template>
  <SWDialog v-if="visible" v-model="visible" :title="dialogTitle" :width="width" :showTitleLine="true"
    :show-bottom-line="true">
    <div class="dialog-content"
      style="width: 580px; height: auto; padding: 20px; padding-bottom: 0px; box-sizing: border-box">
      <el-form ref="ruleFormRef" :model="form" label-width="auto" style="max-width: 580px" :rules="rules"
        @click="formBgClick">
        <el-form-item label="工艺资料包" prop="workmanshipData">
          <SWUploadFile style="width: 298px" ref="workmanshipDataUploadFileRef"
            v-model:modelValue="form.workmanshipData" :width="298" :hideFileSizeMsg="true" :disabled="forbidEdit" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog">提交</el-button>
      </div>
    </template>
  </SWDialog>
</template>

<script lang="ts" setup>
import SWUploadFile from '@/components/SWUoloadFile/index.vue'

import { getDesignDetailById, updateSaveReport } from '@/api/oa/new/designGallery/index'

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
  workmanshipData: undefined
})

const selectItem = ref()
const open = async (data: any) => {
  dialogTitle.value = data.nodeName || ''
  selectItem.value = data || {}
  designData.value = {}
  form.workmanshipData = undefined
  visible.value = true
  getDesignDetail()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const designData = ref()

const getDesignDetail = async () => {
  if (!selectItem.value.npDesignPictureGodownId) {
    return
  }
  const res = await getDesignDetailById(selectItem.value.npDesignPictureGodownId)
  designData.value = res || {}
  if (res) {
    form.workmanshipData = res.workmanshipData.split(',').map((item) => {
      let array = item.split('?name=') || []
      return {
        name: array.length > 1 ? array[1] : '',
        url: array.length > 0 ? array[0] : ''
      }
    })
  }
}

const rules = reactive({
  workmanshipData: [{ required: true, message: '请上传工艺资料包', trigger: 'blur' }]
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const workmanshipDataUploadFileRef = ref()

const formBgClick = () => {
  workmanshipDataUploadFileRef.value?.cancelUploadSelect()
}

const handleClose = () => {
  form.workmanshipData = undefined

  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}
const ruleFormRef = ref()
const confirmDialog = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        ...designData.value,
        ...form
      }
      if (
        data.workmanshipData &&
        Array.isArray(data.workmanshipData) &&
        data.workmanshipData.length > 0
      ) {
        data.workmanshipData = data.workmanshipData
          .map((item) => {
            return item.url && item.url + '?name=' + item.name
          })
          .join(',')
      }
      await updateSaveReport(data)
      message.success('操作成功')
      emit('confirm', data)
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
  margin-top: 10px;
  margin-right: 20px;
}
</style>
