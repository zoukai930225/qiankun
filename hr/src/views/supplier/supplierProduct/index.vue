<template>
  <ContentWrap is-auto-height ref="contentWrapRef">
    <table-box v-bind="{ maxViewHeight: innerHeight, thresholdValue: 0 }">
      <template #prePart>
        <el-row :gutter="24">
          <el-col :span="20" class="!flex-1">
            <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
              <el-row :gutter="0">
                <el-col :span="6">
                  <el-form-item label="货品编码:" prop="goodsNo">
                    <scroll-select
                      class-name="!w-100%"
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
                <el-col :span="6">
                  <el-form-item label="供应商:" prop="supplierIds">
                    <el-select-v2
                      v-model="queryParams.supplierIds"
                      multiple
                      clearable
                      collapse-tags
                      collapse-tags-tooltip
                      filterable
                      popper-class="w-[min-content]"
                      placeholder="请选择供应商"
                      :options="supplierProduct.supplierList"
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="类目" prop="categories">
                    <el-cascader
                      v-model="categoryCode"
                      :options="productInfoData.categoryOptions"
                      :props="customProps"
                      placeholder="请选择货品类目"
                      collapse-tags
                      collapse-tags-tooltip
                      clearable
                      @change="handleQuery"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="下架状态" prop="outOfStock">
                    <el-select
                      v-model="queryParams.outOfStock"
                      placeholder="请选择下架状态"
                      clearable
                      @change="handleQuery"
                    >
                      <el-option
                        v-for="{ label, value } in outOfStockOps"
                        :key="value"
                        :value="value"
                        :label="label"
                      />
                    </el-select>
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
            <special-dropdown :btns="btnOps" :loading-btns="['导出']" />
          </el-col>
        </el-row>
      </template>

      <sw-tabel
        :options="tableOption"
        :data="tableData"
        :loading="loading"
        :copyable-cells="['sku', 'goodsNo']"
        :btns-options="btnsOptions"
        ref="swTableRef"
        @select="handleTableSelected"
      >
        <template #category="{ col }">
          {{ productInfoData.flattenCategory[col] || col }}
        </template>

        <template #updatedName="{ col }">
          <div class="orderHandler">
            <div class="orderHandler-item">
              <el-avatar class="mr8px" :size="18" :src="col?.avatarOrigin ?? defaultAvatar" />
              <div class="name">{{ col?.name }}</div>
            </div>
          </div>
        </template>
      </sw-tabel>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </table-box>
  </ContentWrap>

  <!-- 修改价格弹窗 -->
  <tax-rate-dialog
    ref="taxRateRef"
    :supplier-goods-ids="supplierGoodsIds"
    :tip="taxRateDialogOption.tip"
    :title="taxRateDialogOption.title"
    @refresh="handleQuery"
  />

  <!-- 日志抽屉 -->
  <log-drawer v-bind="logDrawerProps" v-model="logDrawerProps.modelValue" />
</template>
<script lang="ts" setup>
import { useSupplierProduct } from '@/store/modules/supplier'
import { productInfoStore } from '@/store/modules/productInfo'
import { customProps, outOfStockOps, tableOption } from './options'
import SwTabel from '../components/table.vue'
import { supplierGoodsExportApi, supplierGoodsPageApi } from '@/api/supplier/supplierProduct'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'
import { AuditBtn } from '../changeAudit/option'
import { toReactive } from '@vueuse/core'
const taxRateDialog = defineAsyncComponent(() => import('./components/taxRateDialog.vue'))
import logDrawer from './components/logDrawer.vue'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { getInfoByGoodsCode } from '@/api/supplier/purchase'
import specialDropdown from '../components/specialDropdown.vue'
import { Icon } from '@/components/Icon'
import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import tableBox from '@/views/supplier/components/tableBox.vue'

defineOptions({ name: 'SupplierSupplierProductIndex' })

const supplierProduct = useSupplierProduct()
const productInfoData = productInfoStore()
const message = useMessage()
const router = useRouter()

const queryParams = reactive<Supplier.SupplierProduct.GetPageParams>({
  pageNum: 1,
  pageSize: 10,
  goodsNoType: '1'
})
const loading = ref(false)
const total = ref(0)
const tableData = ref<Supplier.SupplierProduct.PageItem[]>([])
const selectedRows = ref<typeof tableData.value>([])
const swTableRef = ref<InstanceType<typeof SwTabel>>()
const btnOps = [
  {
    label: '新增',
    option: handleAdd,
    icon: h(Icon, { icon: 'ep:plus' }),
    permission: 'SupplierSupplierProductIndex:Add'
  },
  {
    label: '修改税率',
    option: handleEditTaxRate,
    permission: 'SupplierSupplierProductIndex:ChangeTaxRate'
  },
  {
    label: '修改价格',
    option: handleEditPrice,
    permission: 'SupplierSupplierProductIndex:ChangePrice'
  },
  {
    label: '导出',
    option: handleExport,
    icon: h(Icon, { icon: 'ep:download' }),
    permission: 'SupplierSupplierProductIndex:Export'
  }
]
const taxRateRef = ref<{ open: () => void }>()
const categoryCode = ref<string[][] | undefined>([])
const taxRateDialogOption = reactive({
  tip: '',
  title: ''
})
const logDrawerProps = reactive({
  modelValue: false,
  supplierGoodsId: ''
})
const defaultAvatar = DefaultAvatar
const contentWrapRef = ref()

const innerHeight = computed(() => contentWrapRef.value?.cardInnerHeigh || 0)

const supplierGoodsIds = computed(() => selectedRows.value.map((row) => row.id || ''))

const btnsOptions = computed(() =>
  tableData.value.map(() =>
    toReactive([
      new AuditBtn('SKU明细', handleCheckSku, { permission: 'SupplierSupplierProductIndex:SKU' }),
      new AuditBtn('编辑', handleEdit, { permission: 'SupplierSupplierProductIndex:Edit' }),
      new AuditBtn('变更日志', handleOpenLog, { permission: 'SupplierSupplierProductIndex:Log' })
    ])
  )
)

const optionLoading = ref(false)
async function handleExport() {
  optionLoading.value = true
  try {
    const res = await supplierGoodsExportApi(queryParams)
    if (res) {
      const fileName = `供应商货品导出-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`
      download.excel(res, fileName)
      message.success('导出成功！')
    }
  } catch (error) {
    console.log(error)
  } finally {
    optionLoading.value = false
  }
}

function handleOpenLog(row: Supplier.SupplierProduct.PageItem) {
  logDrawerProps.supplierGoodsId = row.id!
  logDrawerProps.modelValue = true
}

/**批量修改税务 */
function handleEditTaxRate() {
  if (selectedRows.value.length === 0)
    return message.warning('当前未选择任何供应商货品！请先选择供应商货品')

  Object.assign(taxRateDialogOption, {
    tip: '输入的价格将应用到所有选中的供应商货品及SKU',
    title: '修改税率'
  })

  taxRateRef.value?.open()
}
/**批量修改价格 */
function handleEditPrice() {
  if (selectedRows.value.length === 0)
    return message.warning('当前未选择任何供应商货品！请先选择供应商货品')

  Object.assign(taxRateDialogOption, {
    tip: '未填写的价格不做变更，输入的价格将应用到所有选中的供应商货品及SKU',
    title: '修改价格'
  })

  taxRateRef.value?.open()
}
/**新增 */
function handleAdd() {
  router.push({ name: 'SupplierProductAdd' })
}

/**编辑 */
function handleEdit(row: Supplier.SupplierProduct.PageItem) {
  router.push({
    name: 'SupplierProductEdit',
    params: {
      id: row.id
    }
  })
}

/**SKU明细 */
function handleCheckSku(row: Supplier.SupplierProduct.PageItem) {
  router.push({
    name: 'SupplierProductSku',
    params: {
      id: row.id
    }
  })
}

function handleTableSelected(
  selection: typeof tableData.value,
  item?: Supplier.SupplierProduct.PageItem
) {
  if (item) {
    const currentSelection = swTableRef.value?.getSelectionRows()
    const isRowSelected = currentSelection.some((row) => row.id === item.id)
    if (isRowSelected) {
      selectedRows.value.push(item)
    } else {
      selectedRows.value = selectedRows.value.filter((row) => row.id !== item.id)
    }
  } else {
    if (selection.length) {
      tableData.value.forEach(
        (tableRow) =>
          !selectedRows.value.some((selectredRow) => selectredRow.id === tableRow.id) &&
          selectedRows.value.push(tableRow)
      )
    } else {
      selectedRows.value = selectedRows.value.filter(
        (selectedRow) => !tableData.value.some((tableRow) => tableRow.id === selectedRow.id)
      )
    }
  }
}

async function getList() {
  selectedRows.value = []
  try {
    loading.value = true
    queryParams.categoryCode = Array.from(new Set(categoryCode.value?.flat() || []).values())
    const res = await supplierGoodsPageApi(queryParams)
    tableData.value = res.records.map((ele) => ({
      ...ele,
      outOfStock: Number(ele.outOfStock),
      updator: { name: ele.updatedName, avatarOrigin: ele.updatedAvatarOrigin }
    }))
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
    await nextTick()
    tableData.value.forEach((row) => {
      if (selectedRows.value.some((selectedRow) => selectedRow.id === row.id)) {
        swTableRef.value?.toggleRowSelection(row, true)
      }
    })
  }
}
async function handleQuery() {
  queryParams.pageNum = 1
  getList()
}
async function resetQuery() {
  categoryCode.value = undefined
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { pageNum: 1, pageSize: 10, goodsNoType: '1' }
  )
  getList()
}

onBeforeMount(() => {
  getList()
  supplierProduct.getSupplierList()
  productInfoData.getCategoryOptions()
})

onActivated(() => {
  getList()
})
</script>
<style lang="less" scoped>
@import url(../index.scss);
* {
  --el-color-primary: #0064ff;
  --el-input-width: 220px;
}

.commonTopFilterWrap-filter {
  flex: 1;
}

.commonTopFilterWrap-search {
  padding-left: 24px;
  justify-content: flex-end;
}

.options {
  display: flex;
  align-items: center;
}

.goodsNoQuery {
  :deep(.el-input-group__prepend) {
    min-width: auto;
    width: 40%;
  }
}
</style>
