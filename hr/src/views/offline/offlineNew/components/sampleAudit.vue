<template>
  <el-form ref="formRef" :model="form" :rules="formRules" label-width="80">
    <el-form-item prop="auditResult" label="审核结果">
      <el-radio-group v-model="form.auditResult">
        <el-radio label="审核通过" value="1"></el-radio>
        <el-radio label="审核拒绝" value="2"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="rollbackNodeCode" label="回退节点" v-if="form.auditResult === '2'">
      <el-radio-group v-model="form.rollbackNodeCode">
        <el-radio label="打版确认" value="patternConfirm"></el-radio>
        <el-radio label="样衣确认" value="sampleConfirm"></el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="remark" label="备注">
      <s-text-area
        v-model="form.remark"
        :autosize="{ minRows: 4, maxRows: 7 }"
        style="width: 100%"
        maxlength="200"
        show-word-limit
      />
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import request from '@/config/axios'
const message = useMessage()
const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  baseInfoId: {
    type: String,
    default: ''
  },
  currentNodeCode: {
    type: String,
    default: ''
  }
})

const form = ref({
    auditResult: '',
    rollbackNodeCode: '',
    remark: ''
  }),
  formRef = ref()

const formRules = computed(() => {
  return {
    auditResult: [{ required: true, message: `请选择审核结果`, trigger: 'change' }],
    rollbackNodeCode: [
      { required: form.value.auditResult === '2', message: `请选择回退节点`, trigger: 'change' }
    ],
    remark: [
      {
        required: form.value.auditResult === '2',
        message: `请输入备注`,
        trigger: ['change', 'blur']
      }
    ]
  }
})

const loading = ref(false)
const submit = async () => {
  if (loading.value) return
  const valid = await formRef.value.validate()
  if (valid) {
    await message.confirm(
      form.value.auditResult === '2'
        ? `是否确定保存，保存后数据将回退至${form.value.rollbackNodeCode === 'patternConfirm' ? '打版确认' : '样衣确认'}节点？`
        : '是否确定保存，保存后数据将流转至下一节点？'
    )
    try {
      loading.value = true
      const offlineNpSampleAuditResultDTO = { ...form.value }
      const data = {
        nodeCode: props?.currentNodeCode || '',
        baseInfoId: props?.baseInfoId || '',
        offlineNpSampleAuditResultDTO
      }
      await request.post({ url: '/api/offline/np/process/submitNode', data })
    } finally {
      loading.value = false
    }
  }
}

defineExpose({ submit })
</script>

<style></style>
