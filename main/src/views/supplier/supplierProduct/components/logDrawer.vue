<template>
  <s-w-drawer
    :model-value="modelValue"
    width="800"
    title="变更日志"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <el-card shadow="never" class="!border-0">
      <sw-table
        :data="tableData"
        :options="logListTable"
        :show-overflow-tooltip="true"
        :max-height="672"
      />

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </el-card>

    <template #footer>
      <el-button class="mlauto" @click="handleClosed">取消</el-button>
    </template>
  </s-w-drawer>
</template>
<script setup lang="tsx">
import { getDetailChangeHisLogApi } from '@/api/supplier/supplierProduct'
import SwTable from '../../components/table.vue'
import { logListTable } from '../options'

const props = defineProps<{
  modelValue: boolean
  supplierGoodsId: string
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean): void
}>()

const loading = ref(false)
const tableData = ref([])
const queryParams = reactive({
  page: 1,
  size: 10
})
const total = ref(0)

/** 获取详情 */
async function getList() {
  try {
    loading.value = true
    const res = await getDetailChangeHisLogApi({
      ...queryParams,
      supplierGoodsId: props.supplierGoodsId
    })

    tableData.value = res.records
    total.value = res.total
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

async function handleOpen() {
  getList()
}

function handleClosed() {
  emit('update:model-value', false)
  tableData.value = []
  queryParams.page = 1
}
</script>

<style lang="less" scoped>
@import url(../../index.scss);
</style>
