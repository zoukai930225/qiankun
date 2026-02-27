<template>
  <el-form ref="formRef" :model="form" :rules="formRules" label-width="80">
    <template v-if="type === 'view'">
      <el-form-item prop="terminateReason" label="终止人">
        <line-staffs v-model="info.terminatedUserList" disabled showDisabledBg></line-staffs>
      </el-form-item>
      <el-form-item prop="terminateReason" label="终止时间">
        <el-input v-model="info.terminatedDate" disabled></el-input>
      </el-form-item>
    </template>
    <el-form-item prop="terminateReason" label="终止原因">
      <template v-if="type === 'view'">
        <s-text-area
          v-model="info.terminatedReason"
          :autosize="{ minRows: 4, maxRows: 7 }"
          style="width: 100%"
          disabled
        />
      </template>
      <template v-else>
        <s-text-area
          v-model="form.terminateReason"
          :autosize="{ minRows: 4, maxRows: 7 }"
          style="width: 100%"
          maxlength="200"
          show-word-limit
        />
      </template>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import request from '@/config/axios'
import STextArea from '@/components/common/input/s-textarea.vue'
const message = useMessage()
const props = defineProps({
  baseInfoId: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  info: {
    type: Object,
    default: () => {}
  }
})
const formRules = ref({
  terminateReason: [{ required: true, message: '请输入终止原因', trigger: 'blur' }]
})

const form = ref<any>({
  terminateReason: ''
})

const formRef = ref(),
  loading = ref(false)
const submit = async () => {
  if (loading.value) return
  const valid = await formRef.value.validate()
  if (valid) {
    await message.confirm('是否提前终止该流程？结束后，该流程将提前终止')
    try {
      loading.value = true
      const data = {
        baseInfoId: props?.baseInfoId || '',
        ...form.value
      }
      await request.post({ url: `/api/offline/np/base/terminate`, data })
    } finally {
      loading.value = false
    }
  }
}

defineExpose({ submit })
</script>
