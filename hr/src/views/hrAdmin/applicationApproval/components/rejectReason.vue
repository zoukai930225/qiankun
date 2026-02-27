<template>
  <div class="reject-reason-dialog">
    <s-text-area v-model="reason" :rows="8" maxlength="300" show-word-limit placeholder="请输入原因" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import { shApplicationApproval } from '@/api/hrAdmin/applicationApproval'
import STextArea from "@/components/common/input/s-textarea.vue";

const props = withDefaults(
  defineProps<{
    mode?: 'single' | 'batch'
    records?: any[]
    defaultReason?: string
  }>(),
  {
    mode: 'single',
    defaultReason: ''
  }
)

const message = useMessage()

const reason = ref<string>(props.defaultReason || '')

const submit = async () => {
  const val = (reason.value || '').trim()
  if (!val) {
    message.warning('请输入拒绝原因')
    throw new Error('EMPTY_REASON')
  }
  const records = Array.isArray(props.records) ? props.records : []
  const payload = records.map((r: any) => ({
    ...r,
    status: 2,
    shyj: val
  }))
  await shApplicationApproval(payload)
}

defineExpose({ submit })
</script>

<style scoped>
.reject-reason-dialog {
  padding: 4px;
}

.title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}
</style>
