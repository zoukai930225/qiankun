<template>
  <div>
    <SWDialog
      v-if="visible"
      v-model="visible"
      :title="dialogTitle"
      :width="width"
      :showTitleLine="true"
      :show-bottom-line="true"
      :title-warn-icon="dialog_title_warn"
      title-warn="数据回收后流程将暂停，数据不再显示"
    >
      <div
        class="dialog-content"
        style="
          width: 600px;
          height: auto;
          padding: 20px;
          padding-bottom: 0px;
          padding-left: 0px;
          box-sizing: border-box;
        "
      >
        <el-form
          ref="ruleFormRef"
          :model="form"
          label-width="auto"
          :rules="rules"
          @click="formBgClick"
        >
          <el-form-item label="回收原因" prop="recycleReason">
            <s-text-area
              v-model="form.recycleReason"
              placeholder="请上输入回收原因"
              style="width: 480px; color: #333333"
              :rows="5"
            />
          </el-form-item>
          <el-form-item label="附件" prop="recycleAttachmentUrl">
            <SWUploadFile
              style="width: 258px"
              ref="fileDataUploadFileRef"
              v-model:modelValue="form.recycleAttachmentUrl"
              :width="258"
              :hideFileSizeMsg="true"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button v-if="!forbidEdit" type="primary" :loading="loading" @click="confirmDialog"
            >提交</el-button
          >
        </div>
      </template>
    </SWDialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'

import { businessRecycleSubmit } from '@/api/oa/new/develop'

import dialog_title_warn from '@/assets/imgs/common/dialog_title_warn.png'

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
    default: '600px'
  }
})
const dialogTitle = ref('商企回收')
const form = reactive({
  recycleReason: undefined,
  recycleAttachmentUrl: undefined
})

const recycleType = ref(0) // 回收类型: (1-企划,2-开发任务,3-产品计划)
const selectItem = ref()
const open = async (data: any) => {
  selectItem.value = data || {}
  recycleType.value = data.recycleType
  form.recycleAttachmentUrl = undefined
  form.recycleReason = undefined
  visible.value = true
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const rules = reactive({
  recycleReason: [{ required: true, message: '请上输入回收原因', trigger: 'blur' }]
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const fileDataUploadFileRef = ref()

const formBgClick = () => {
  fileDataUploadFileRef.value?.cancelUploadSelect()
}

const handleClose = () => {
  form.recycleAttachmentUrl = undefined
  form.recycleReason = undefined

  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}
const loading = ref(false)
const ruleFormRef = ref()
const confirmDialog = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        ...form,
        recycleType: recycleType.value
      }
      if (recycleType.value === 1) {
        data.npBusinessEnterpriseId = selectItem.value.id
      } else if (recycleType.value === 2) {
        data.npBusinessEnterpriseId = selectItem.value.npBusinessEnterprisePlanId
        data.npDevelopmentPlanId = selectItem.value.id
      } else if (recycleType.value === 3) {
        data.npBusinessEnterpriseId = selectItem.value.enterprisePlanId
        data.npDevelopmentPlanId = selectItem.value.developmentPlanId
        data.npDesignPictureId = selectItem.value.id
      }
      if (
        data.recycleAttachmentUrl &&
        Array.isArray(data.recycleAttachmentUrl) &&
        data.recycleAttachmentUrl.length > 0
      ) {
        data.recycleAttachmentUrl = data.recycleAttachmentUrl
          .map((item) => {
            return item.url && item.url + '?name=' + item.name
          })
          .join(',')
      }
      // try {
      // 二次确认删除逻辑
      message.confirm('数据回收后流程将暂停，数据不再显示', '系统提示').then(async (res: any) => {
        if (res === 'confirm') {
          loading.value = true
          try {
            await businessRecycleSubmit(data)
            message.success('操作成功')
            emit('confirm', data)
            emit('update:modelValue', false)
            handleClose()
          } finally {
            loading.value = false
          }
        }
      })
      // } finally {
      //   loading.value = false
      // }
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
