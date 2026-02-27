<template>
  <s-w-drawer
    :model-value="modelValue"
    :title="rowData.scPurchaseOrderNo"
    width="60%"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <el-card shadow="never" class="!border-0 rounded-8px">
      <el-row :gutter="24">
        <el-col :span="20" class="!flex-1">
          <el-form :model="queryParams" ref="formRef">
            <el-row :gutter="12">
              <el-col :span="12">
                <el-form-item label="SKU编码" prop="sku">
                  <scroll-select
                    class-name="!w-100%"
                    v-model:model-value="queryParams.sku"
                    :api="getInfoBySku2"
                    item-label-key="sku"
                    item-value-key="sku"
                    selectKey="sku"
                    clearable
                    @change="handleQuery"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-col>

        <el-col :span="4" class="!flex justify-end min-w-350px">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
            重置
          </el-button>
        </el-col>
      </el-row>

      <special-table :data="tableData" :options="PoDetailTable" :loading="loading" />
    </el-card>
    <template #footer>
      <el-button @click="handleClosed">关闭</el-button>
    </template>
  </s-w-drawer>
</template>
<script lang="ts" setup>
import { getInfoBySku2, getScPurchaseDetailApi } from '@/api/supplier/purchase'
import { FormInstance } from 'element-plus'
import specialTable from '../../components/table.vue'
import { PoDetailTable } from '../options'

interface Props {
  modelValue: boolean
  rowData: any
}
interface Emit {
  (e: 'update:model-value', value: boolean): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const queryParams = reactive({
  sku: '',
  scPurchaseOrderId: ''
})
const tableData = ref<any[]>([])
const formRef = ref<FormInstance>()

const timer = ref<NodeJS.Timeout>()
const loading = ref(false)
async function getList() {
  loading.value = true
  if (timer.value) {
    clearTimeout(timer.value)
  }

  timer.value = setTimeout(async () => {
    try {
      queryParams.scPurchaseOrderId = props.rowData.scPurchaseOrderId
      const res = await getScPurchaseDetailApi(queryParams)

      const data = res.scPurchaseOrderDetailList

      function getSum(key: string) {
        return data.reduce((arr, cur) => arr + (cur[key] ?? 0), 0)
      }

      tableData.value = [
        {
          purchasedGoodsQuantity: getSum('purchasedGoodsQuantity'),
          goodsDeliveryQuantity: getSum('goodsDeliveryQuantity')
        },
        ...data
      ]
    } catch (error) {
    } finally {
      loading.value = false
      clearTimeout(timer.value)
    }
  }, 1000)
}

function handleQuery() {
  getList()
}
function resetQuery() {
  formRef.value?.resetFields()
  getList()
}

function handleOpen() {
  getList()
}
function handleClosed() {
  emit('update:model-value', false)
  formRef.value?.resetFields()
  tableData.value = []
}
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
