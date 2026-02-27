<template>
  <s-w-dialog
    :model-value="modelValue"
    title="添加货品"
    width="70%"
    @opened="handleOpen"
    @closed="handleClosed"
  >
    <el-row :gutter="24">
      <el-col :span="20" class="!flex-1">
        <el-form :model="queryParams" ref="formRef">
          <el-row>
            <el-col :span="8">
              <el-form-item :prop="codeType">
                <el-input
                  v-model.trim="queryParams[codeType]"
                  clearable
                  :placeholder="codeTypes[codeType].placeholder"
                  @keydown.enter="handleQuery"
                  @clear="handleQuery"
                >
                  <template #prepend>
                    <el-select v-model="codeType" @change="handleChangeCodeType">
                      <el-option
                        v-for="(value, key) in codeTypes"
                        :key="key"
                        :value="key"
                        :label="value.label"
                      />
                    </el-select>
                  </template>
                </el-input>
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

    <special-table
      ref="tableRef"
      :options="addProductTable"
      :data="tableData"
      :height="440"
      :loading="loading"
      @select="handleTableSelected"
    >
      <template #poCount="{ col, row }">
        <el-button type="primary" link @click="handleOpenDetail(row)">{{ col }}</el-button>
      </template>
    </special-table>

    <div class="flex justify-end">
      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>

    <template #footer>
      <el-button @click="handleClosed">取消</el-button>
      <el-button type="primary" :disabled="!selectedRows.length" @click="handleComfire">
        确定
      </el-button>
    </template>
  </s-w-dialog>

  <add-product-detail-dialog
    v-bind="PoDetailProps"
    v-model:model-value="PoDetailProps.modelValue"
  />
</template>
<script lang="ts" setup>
import { pageSupplierPoDetailSummaryApi } from '@/api/supplier/appoint'
import specialTable from '../../components/table.vue'
import { addProductTable } from '../options'
import addProductDetailDialog from './addProductDetailDialog.vue'
import { FormInstance } from 'element-plus'

interface Props {
  modelValue: boolean
  supplierId?: string
  isAlready?: any
}

interface Emit {
  (e: 'update:model-value', value: boolean): void
  (e: 'batchAdd', value: Supplier.Appoint.SupplierPoDetailSummaryDTO[]): void
}

const props = defineProps<Props>()

const emit = defineEmits<Emit>()

const queryParams = reactive<Supplier.Appoint.AddProductListParams>({
  pageNum: 1,
  size: 10
})
const codeType = ref('sku')
const codeTypes = {
  sku: { label: 'SKU编码', placeholder: '请输入SKU编码' },
  goodsCode: { label: '货品编码', placeholder: '请输入货品编码' },
  providerGoodsNo: { label: '供应商货号', placeholder: '请输入供应商货号' }
}
const tableData = ref<Supplier.Appoint.SupplierPoDetailSummaryDTO[]>([])
const total = ref(0)
const loading = ref(false)
const selectedRows = ref<typeof tableData.value>([])
const PoDetailProps = reactive({
  modelValue: false,
  poDetailIds: ''
})
const tableRef = ref()
const formRef = ref<FormInstance>()
const oldSelectedRows = computed(() => props.isAlready || [])

watch(tableData, (val) => {
  const valMap = new Map(val.map((ele) => [ele.sku, ele]))
  selectedRows.value = Array.from(
    new Map(
      [...selectedRows.value, ...props.isAlready.map((ele) => valMap.get(ele.sku))]
        .filter((ele) => ele?.sku)
        .map((ele) => [ele.sku, ele])
    ).values()
  )

  const selectedMap = new Map(selectedRows.value.map((row) => [row.sku, row]))

  val.forEach((row) => {
    tableRef.value?.toggleRowSelection(row, selectedMap.has(row.sku))
  })
})

function handleOpen() {
  getList()
}

function handleClosed() {
  emit('update:model-value', false)
  formRef.value?.resetFields()
  selectedRows.value = []
  tableData.value = []
  tableData.value.forEach((ele) => {
    tableRef.value?.toggleRowSelection(ele, false)
  })
}

function handleChangeCodeType() {
  let val = ''
  Object.keys(codeTypes).forEach((key) => {
    queryParams[key] && (val = queryParams[key])
    queryParams[key] = ''
  })
  val && getList()
}

async function getList() {
  try {
    loading.value = true
    const res = await pageSupplierPoDetailSummaryApi({
      ...queryParams,
      supplierId: props.supplierId
    })

    const oldMap = new Map(oldSelectedRows.value.map((row) => [row.sku, true]))

    tableData.value = res.records.map((item) => {
      Object.keys(item).forEach((key) => {
        item[key] =
          item[key] === null || item[key] === '' || item[key] === undefined ? '--' : item[key]
      })
      item.isSelected = oldMap.has(item.sku)

      return item
    })
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleQuery() {
  queryParams.pageNum = 1
  getList()
}
async function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, ''])),
    { pageNum: 1, size: 10 }
  )
  getList()
}

function handleTableSelected(val: typeof selectedRows.value, item: Supplier.Purchase.ListItem) {
  const selectedMap = new Map(selectedRows.value.map((row) => [row.sku, row]))
  const currentMap = new Map(val.map((row) => [row.sku, row]))
  if (item) {
    if (!selectedMap.has(item.sku) && currentMap.has(item.sku)) selectedRows.value.push(item)
    else if (selectedMap.has(item.sku) && !currentMap.has(item.sku))
      selectedRows.value = selectedRows.value.filter((row) => row.sku !== item.sku)
  } else {
    if (val.some((row) => !selectedMap.has(row.sku))) selectedRows.value.push(...val)
    if (val.every((row) => selectedMap.has(row.sku))) {
      const removeItems = tableData.value.filter((row) => !currentMap.has(row.sku))
      const removeItemsMap = new Map(removeItems.map((row) => [row.sku, row]))
      selectedRows.value = selectedRows.value.filter((row) => !removeItemsMap.has(row.sku))
    }
  }

  selectedRows.value = Array.from(new Map(selectedRows.value.map((row) => [row.sku, row])).values())
}

function handleOpenDetail(row: Supplier.Appoint.SupplierPoDetailSummaryDTO) {
  PoDetailProps.poDetailIds = row.poDetailIds || ''
  PoDetailProps.modelValue = true
}

async function handleComfire() {
  emit('batchAdd', selectedRows.value)
  handleClosed()
}
</script>
<style lang="less" scoped>
@import url(../../index.scss);

.errorRow {
  display: none;
}
</style>
