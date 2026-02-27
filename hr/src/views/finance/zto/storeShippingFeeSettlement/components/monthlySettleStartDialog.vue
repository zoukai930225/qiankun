<template>
  <div class="monthly-settle-start-dialog">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="86px">
      <el-form-item label="汇算月份" prop="month" required>
        <el-date-picker
          v-model="form.month"
          type="month"
          value-format="YYYY-MM"
          format="YYYY-MM"
          placeholder="请选择月份"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { matchZtoPriceConfig } from '@/api/finance/zto'
import { useMessage } from '@/hooks/web/useMessage'

const emit = defineEmits(['success', 'close'])
const formRef = ref()
const form = ref({ month: '' })
const rules = { month: [{ required: true, message: '请选择月份', trigger: 'change' }] }
const message = useMessage()

const submit = async () => {
  await formRef.value?.validate()
  try {
    await matchZtoPriceConfig({ month: form.value.month })
    message.success('已发起汇算')
    emit('success', { ...form.value })
  } catch (error) {
    // message.error('汇算失败')
  } finally {
  }
}

defineExpose({ submit })
</script>

<style scoped lang="scss">
.monthly-settle-start-dialog {
  .footer {
    display: flex;
    justify-content: center;
    margin-top: 12px;
  }
}
</style>
