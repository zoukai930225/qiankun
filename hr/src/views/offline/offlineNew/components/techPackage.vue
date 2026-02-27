<template>
  <el-form ref="formRef" :model="form" :rules="formRules" label-width="80">
    <template v-if="displayPaper">
      <el-form-item prop="paperAttachmentUrl" label="纸样">
        <transfer
          multiple
          acceptType="all"
          style="width: 100%"
          v-model="form.paperAttachmentUrl"
          :limit="5"
          tip="文件大小不超过5M"
        ></transfer>
      </el-form-item>
      <el-form-item prop="paperRemark" label="纸样备注">
        <s-text-area
          v-model="form.paperRemark"
          :autosize="{ minRows: 4, maxRows: 7 }"
          style="width: 100%"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </template>
    <template v-if="displayTechnical">
      <el-form-item prop="technicalAttachmentUrl" label="工艺单">
        <transfer
          multiple
          acceptType="all"
          style="width: 100%"
          v-model="form.technicalAttachmentUrl"
          :limit="5"
          tip="文件大小不超过5M"
        ></transfer>
      </el-form-item>
      <el-form-item prop="technicalRemark" label="工艺单备注" class="longLabel">
        <template #label>
          <div>
            <div>工艺单</div>
            <div>备注</div>
          </div>
        </template>
        <s-text-area
          v-model="form.technicalRemark"
          :autosize="{ minRows: 4, maxRows: 7 }"
          style="width: 100%"
          maxlength="200"
          show-word-limit
        />
      </el-form-item>
    </template>
  </el-form>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import request from '@/config/axios'
const message = useMessage()
const props = defineProps({
  baseInfoId: {
    type: String,
    default: ''
  },
  currentNodeCode: {
    type: String,
    default: ''
  },
  paperAttachmentUrl: {
    type: String,
    default: ''
  },
  paperRemark: {
    type: String,
    default: ''
  },
  technicalAttachmentUrl: {
    type: String,
    default: ''
  },
  technicalRemark: {
    type: String,
    default: ''
  },
  displayPaper: {
    type: Boolean,
    default: false
  },
  displayTechnical: {
    type: Boolean,
    default: false
  }
})
const formRef = ref()
const form = ref({
  paperAttachmentUrl: props.paperAttachmentUrl || '',
  paperRemark: props.paperRemark || '',
  technicalAttachmentUrl: props.technicalAttachmentUrl || '',
  technicalRemark: props.technicalRemark || ''
})

const formRules = ref({
  paperAttachmentUrl: [{ required: true, message: '请上传纸样', trigger: 'change' }],
  technicalAttachmentUrl: [{ required: true, message: '请上传工艺单', trigger: 'change' }]
})

const loading = ref(false)
const submit = async () => {
  if (loading.value) return
  const valid = await formRef.value.validate()
  if (valid) {
    await message.confirm('是否确定保存，保存后数据将流转至下一节点？')
    try {
      loading.value = true
      const { paperAttachmentUrl, paperRemark, technicalAttachmentUrl, technicalRemark } =
        form.value
      const offlineNpTechPackageDTO: any = {}
      if (props.displayPaper) {
        offlineNpTechPackageDTO['paperAttachmentUrl'] = paperAttachmentUrl
        offlineNpTechPackageDTO['paperRemark'] = paperRemark
      }
      if (props.displayTechnical) {
        offlineNpTechPackageDTO['technicalAttachmentUrl'] = technicalAttachmentUrl
        offlineNpTechPackageDTO['technicalRemark'] = technicalRemark
      }
      const data = {
        nodeCode: props?.currentNodeCode || '',
        baseInfoId: props?.baseInfoId || '',
        offlineNpTechPackageDTO
      }
      await request.post({ url: '/api/offline/np/process/submitNode', data })
    } finally {
      loading.value = false
    }
  }
}

defineExpose({ submit })
</script>

<style lang="scss" scoped>
.longLabel {
  :deep(.el-form-item__label) {
    line-height: 16px;
  }
}
</style>
