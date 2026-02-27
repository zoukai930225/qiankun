<template>
  <el-form ref="formRef" :model="form" :rules="formRules" label-width="80">
    <el-form-item prop="remark" label="备注">
      <s-text-area
        v-model="form.remark"
        :autosize="{ minRows: 4, maxRows: 7 }"
        style="width: 100%"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
    <el-form-item prop="attachmentUrl" label="附件上传">
      <transfer
        multiple
        acceptType="all"
        style="width: 100%"
        v-model="form.attachmentUrl"
        :limit="5"
        tip="文件大小不超过5M"
      ></transfer>
    </el-form-item>
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
  type: {
    type: String,
    default: ''
  }
})

// const typeMap = {
//   colorSampleConfirm: '齐色样确认',
//   preProductionConfirm: '产前样确认',
//   firstEightConfirm: '首八件确认'
// }

const form = ref({
  remark: '',
  attachmentUrl: ''
})

const formRules = computed(() => {
  return {
    remark: [
      {
        required: ['preProductionConfirm', 'firstEightConfirm'].includes(props.type),
        message: '请输入备注',
        trigger: 'blur'
      }
    ]
  }
})
const formRef = ref(),
  loading = ref(false)

const submit = async () => {
  if (loading.value) return
  const valid = await formRef.value.validate()
  if (valid) {
    let dto
    if (props.type === 'colorSampleConfirm') {
      // 齐色样确认
      const offlineNpColorSampleConfirmDTO = { ...form.value }
      dto = { offlineNpColorSampleConfirmDTO }
      await message.confirm('是否确定保存，保存后数据将流转至下一节点？')
    } else if (props.type === 'preProductionConfirm') {
      // 产前样确认
      const offlineNpPreProductionConfirmDTO = { ...form.value }
      dto = { offlineNpPreProductionConfirmDTO }
      await message.confirm('是否确定保存，保存后数据将流转至下一节点？')
    } else {
      // 首八件确认
      const offlineNpFirstEightConfirmDTO = { ...form.value }
      dto = { offlineNpFirstEightConfirmDTO }
      await message.confirm('是否确定保存，保存后该流程将结束！')
    }
    try {
      loading.value = true
      const data = {
        nodeCode: props?.currentNodeCode || '',
        baseInfoId: props?.baseInfoId || '',
        ...dto
      }
      await request.post({ url: '/api/offline/np/process/submitNode', data })
    } finally {
      loading.value = false
    }
  }
}

defineExpose({ submit })
</script>

<style lang="scss"></style>
