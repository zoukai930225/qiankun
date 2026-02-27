<template>
  <s-w-dialog
    title="查看采购订单"
    :model-value="modelValue"
    width="70%"
    :modal="false"
    :show-close="false"
    @closed="handleClosed"
    @open="handleOpen"
  >
    <special-table :options="PoDetailTable" :data="tableData" :height="550" :loading="loading" />

    <template #footer>
      <el-button @click="handleClosed">返回</el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import { querySupplierPoDetailByIds } from '@/api/supplier/appoint'
import specialTable from '../../components/table.vue'
import { PoDetailTable } from '../options'

interface Props {
  modelValue: boolean
  poDetailIds: string
}
interface Emit {
  (e: 'update:model-value', value: boolean): void
  (e: 'back')
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const tableData = ref([])
const loading = ref(false)

async function handleOpen() {
  try {
    loading.value = true
    const res = await querySupplierPoDetailByIds({ poDetailIds: props.poDetailIds })
    tableData.value = res
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleClosed() {
  emit('update:model-value', false)
}
</script>
<style lang="less" scoped></style>
