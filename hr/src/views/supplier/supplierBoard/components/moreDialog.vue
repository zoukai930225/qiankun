<template>
  <s-w-dialog
    :model-value="modelValue"
    :title="config?.label"
    width="800px"
    @closed="handleClosed"
    @open="handleQuery"
  >
    <el-form :model="queryParams" ref="formRef">
      <el-row justify="space-between">
        <el-col :span="6">
          <el-form-item label="货品编码" prop="goodsNo">
            <scroll-select
              class-name="!w-220px"
              v-model:model-value="queryParams.goodsNo"
              :api="getInfoByGoodsCode"
              item-label-key="goodsCode"
              item-value-key="goodsCode"
              selectKey="goodsCode"
              :multiple="true"
              clearable
              @change="handleQuery"
            />
          </el-form-item>
        </el-col>

        <el-col :span="4" class="!flex justify-end">
          <el-form-item>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <special-table
      :options="config.detailTableOptions!"
      :data="tableData"
      :loading="loading"
      :height="400"
    />

    <template #footer>
      <div class="flex justify-end">
        <Pagination
          :total="total"
          v-model:page="queryParams.pageNum"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import { getInfoByGoodsCode } from '@/api/supplier/purchase'
import { chartsBars } from '../options'
import { FormInstance } from 'element-plus'
import specialTable from '@/views/supplier/components/table.vue'

const props = defineProps<{
  modelValue: boolean
  type: string
  config?: {
    detailApi?: (...arg: any[]) => Promise<any>
    detailTableOptions?: TableOption
    label?: string
  }
  otherParams?: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean): any
}>()

const queryParams = reactive({
  goodsNo: '',
  pageNum: 1,
  pageSize: 10
})
const formRef = ref<FormInstance>()
const tableData = ref<Record<string, any>[]>([])
const total = ref(0)
const loading = ref(false)

const config = computed(() => (chartsBars.find((ele) => ele.type === props.type) || props.config)!)

function handleClosed() {
  emit('update:model-value', false)
  queryParams.pageNum = 1
  queryParams.pageSize = 10
  formRef.value?.resetFields()
  tableData.value = []
  total.value = 0
}

async function getList() {
  try {
    loading.value = true
    const res = await config.value?.detailApi?.({
      ...queryParams,
      ...props.otherParams,
      goodsNos: queryParams.goodsNo ? queryParams.goodsNo.split(',') : undefined
    })

    if (res && res.records) {
      tableData.value = res.records
      total.value = res.total
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}

function resetQuery() {
  formRef.value?.resetFields()
  getList()
}
</script>
<style lang="less" scoped>
:deep(.el-pagination) {
  margin: 0;
  float: none;
}
</style>
