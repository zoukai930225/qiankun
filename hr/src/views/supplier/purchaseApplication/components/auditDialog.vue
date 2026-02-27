<template>
  <s-w-dialog :title="title" :model-value="modelValue" :close-on-click-modal="false" @closed="handleClosed"
    @open="handleOpen">
    <el-form :model="auditQuery" ref="formRef" :rules="rules">
      <el-form-item label="审核意见" prop="reviewOpinion">
        <s-text-area v-model="auditQuery.reviewOpinion" :rows="5" :maxlength="200" show-word-limit />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClosed">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleComfire">确定</el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { FormInstance, FormRules } from 'element-plus'

const route = useRoute()

const props = defineProps<{
  modelValue: boolean
  isApprove: any
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:model-value', v: boolean): void
  (
    e: 'submit',
    params: {
      isApprove: boolean
      id: string
      reviewOpinion: string
    }
  ): void
}>()

const auditQuery = reactive({
  reviewOpinion: '',
  id: route.params.id as string
})
const formRef = ref<FormInstance>()
const rules = computed<FormRules>(() => ({
  reviewOpinion: { required: !props.isApprove, message: '请输入审核意见' }
}))

const title = computed(() => (props.isApprove ? '审核通过' : '审核不通过'))

function handleOpen() {
  formRef.value?.resetFields()
}

function handleClosed() {
  emit('update:model-value', false)
}

async function handleComfire() {
  await formRef.value?.validate()
  emit('submit', { ...auditQuery, isApprove: props.isApprove })
}
</script>
<style lang="less" scoped></style>
