<template>
  <s-w-dialog :model-value="modelValue" title="备注" @open="handleOpen" @closed="handleClosed">
    <el-form :model="formData" ref="formRef">
      <el-form-item prop="remark">
        <s-textarea :disabled="isCheck" v-model="formData.remark" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleClosed">取消</el-button>
      <el-button v-if="!isCheck" type="primary" @click="handleComfire">确定</el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import sTextarea from '@/components/common/input/s-textarea.vue'
import { FormInstance } from 'element-plus'

const route = useRoute()

const props = defineProps<{
  modelValue: boolean
  remark?: string
  providerGoodsNo: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', v: boolean): void
  (e: 'update:remark', v: string | undefined, providerGoodsNo: string): void
}>()

const formData = reactive<Record<string, string | undefined>>({
  remark: ''
})
const formRef = ref<FormInstance>()

const isCheck = computed(() => route.name === 'SupplierContractCheck')

function handleOpen() {
  formData.remark = props.remark
}

function handleClosed() {
  emit('update:model-value', false)
  formData.remark = ''
  formRef.value?.resetFields()
}

async function handleComfire() {
  await formRef.value?.validate()
  emit('update:remark', formData.remark, props.providerGoodsNo)
  handleClosed()
}
</script>
<style lang="less" scoped></style>
