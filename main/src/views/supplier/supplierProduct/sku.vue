<template>
  <special-card>
    <el-row>
      <el-col :span="20" class="!flex-1">
        <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
          <el-row :gutter="24" :style="{ maxWidth: '1340px' }">
            <el-col :span="6">
              <el-form-item label="SKU编码:" prop="sku">
                <scroll-select
                  class-name="!w-100%"
                  v-model:model-value="queryParams.sku"
                  :api="getInfoBySku2"
                  item-label-key="sku"
                  item-value-key="sku"
                  selectKey="sku"
                  :multiple="true"
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
            <el-col :span="6">
              <el-form-item label="启用状态" prop="enable">
                <el-select
                  v-model="queryParams.enable"
                  placeholder="请选择启用状态"
                  clearable
                  @change="handleQuery"
                >
                  <el-option
                    v-for="{ label, value } in enableOptions"
                    :key="value"
                    :value="value"
                    :label="label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="是否含税" prop="hasTax">
                <el-select
                  v-model="queryParams.hasTax"
                  placeholder="请选择是否含税"
                  clearable
                  @change="handleQuery"
                >
                  <el-option
                    v-for="{ label, value } in hasTaxOptions"
                    :key="label"
                    :value="value"
                    :label="label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>

      <el-col :span="4" class="!flex !min-w-350px">
        <el-button @click="handleQuery" class="commonSearchBtn ml-auto">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
          重置
        </el-button>
        <special-dropdown :btns="btnOps" :loading-btns="['导出']" :show-default="false" />
      </el-col>
    </el-row>

    <sw-tabel
      :options="SKUDetailTable"
      :data="tableData"
      :loading="loading"
      :btns-options="btnsOptions"
      :loading-btns="['保存', '停用', '启用', '变更趋势']"
      ref="swTableRef"
      :rules="rules"
      :copyable-cells="['sku', 'goodsNo']"
      @select="handleTableSelected"
    >
      <template #enable="{ col }">
        <div class="status" :style="{ color: col?.color, background: col?.bg }">{{
          col?.label
        }}</div>
      </template>

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

      <template
        v-for="slotName in ['baseProdCost', 'fgCost', 'whPackCost']"
        :key="slotName"
        #[slotName]="{ row }"
      >
        <sw-input-number
          v-if="row.editable"
          v-model="row[slotName]"
          placeholder="请输入"
          :clearable="true"
          :min="0"
          :precision="4"
          :controls="false"
        />

        <span v-else class="ml-auto"> {{ row[slotName] }}</span>
      </template>

      <template #hasTax="{ row }">
        <el-select v-if="row.editable" v-model="row.hasTax" placeholder="请选择" clearable>
          <el-option
            v-for="{ label, value } in hasTaxOptions"
            :key="label"
            :value="value"
            :label="label"
          />
        </el-select>

        <div v-else>
          <component :is="() => statusDom(hasTaxOptions)(row, undefined, row.hasTax)" />
        </div>
      </template>

      <template #minPurchaseQty="{ row }">
        <sw-input-number
          v-if="row.editable"
          v-model="row.minPurchaseQty"
          placeholder="请输入"
          :precision="0"
          :clearable="true"
          :min="0"
          :controls="false"
        />

        <span v-else class="ml-auto"> {{ row.minPurchaseQty }}</span>
      </template>

      <template
        v-for="slotName in ['taxRate', 'discountRate']"
        :key="slotName"
        #[slotName]="{ row }"
      >
        <sw-input-number
          v-if="row.editable"
          :style="{ width: '90px' }"
          v-model="row[slotName]"
          placeholder="请输入"
          :precision="2"
          :clearable="true"
          :min="0"
          :max="1"
          :controls="false"
        />

        <span v-else class="ml-auto"> {{ row[slotName] }}</span>
      </template>
    </sw-tabel>
    <!-- 分页 -->
    <div class="flex justify-end">
      <el-pagination
        v-show="total > 0"
        v-model:current-page="queryParams.pageNum"
        v-model:page-size="queryParams.pageSize"
        :background="true"
        :page-sizes="[10, 20, 25, 30, 50, 100]"
        :total="total"
        class="!mt-15px ml-auto"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleQuery"
        @current-change="getList"
      />
    </div>

    <template #footer>
      <div class="flex flex-justify-end">
        <el-button @click="handleBack">关闭</el-button>
      </div>
    </template>
  </special-card>

  <!-- 修改价格弹窗 -->
  <tax-rate-dialog
    ref="taxRateRef"
    :supplier-goods-detail-ids="supplierGoodsDetailIds"
    :tip="taxRateDialogOption.tip"
    :title="taxRateDialogOption.title"
    :api="modifySkuTaxRateOrPriceApi"
    @refresh="handleQuery"
  />

  <tendency-dialog ref="tendencyRef" v-bind="tendencyProps" v-model="tendencyProps.modelValue" />
</template>
<script lang="ts" setup>
import { FormRules } from 'element-plus'
import { useSupplierProduct } from '@/store/modules/supplier'
import { productInfoStore } from '@/store/modules/productInfo'
import { enableOptions, hasTaxOptions, outOfStockOps, SKUDetailTable } from './options'
import SwTabel from '../components/table.vue'
import {
  enableSupplierApi,
  getDetailByIdApi,
  getDetailChangeHis,
  getPurchasePriceHis,
  modifySkuTaxRateOrPriceApi,
  updateDetailApi
} from '@/api/supplier/supplierProduct'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'
import { cloneDeep } from 'lodash-es'
import { AuditBtn } from '../changeAudit/option'
const taxRateDialog = defineAsyncComponent(() => import('./components/taxRateDialog.vue'))
import tendencyDialog from './components/tendencyDialog.vue'
import { toReactive } from '@vueuse/core'
import specialCard from '../components/specialCard.vue'
import { deepEqual } from '@/utils/common'
import { useTagsView } from '@/hooks/web/useTagsView'
import { statusDom } from '../components/twoFourSix'
import { getInfoBySku2 } from '@/api/supplier/purchase'
import specialDropdown from '../components/specialDropdown.vue'
import { Icon } from '@/components/Icon'

defineOptions({ name: 'SupplierProductSku' })

const supplierProduct = useSupplierProduct()
const productInfoData = productInfoStore()
const message = useMessage()
const router = useRouter()
const route = useRoute()
const tagsViewStore = useTagsView()

const defaultAvatar = DefaultAvatar
const queryParams = reactive<Supplier.SupplierProduct.GetSkuPageParams>({
  pageNum: 1,
  pageSize: 10
})
const loading = ref(false)
const total = ref(0)
const tableData = ref<Supplier.SupplierProduct.SupplierGoodsDetailVO[]>([])
const selectedRows = ref<typeof tableData.value>([])
const swTableRef = ref<InstanceType<typeof SwTabel>>()

const btnOps = [
  {
    label: '修改税率',
    option: handleEditTaxRate,
    permission: 'SupplierSupplierProductIndex:SKU:ChangeTaxRate'
  },
  {
    label: '修改价格',
    option: handleEditPrice,
    permission: 'SupplierSupplierProductIndex:SKU:ChangePrice'
  }
]

const oldData = reactive<any>({})
const tendencyProps = reactive({
  title: '',
  data: [],
  type: 0,
  supplierGoodsDetailId: '',
  sku: '',
  modelValue: false
})
const taxRateRef = ref<{ open: () => void }>()
const taxRateDialogOption = reactive({
  tip: '',
  title: ''
})
const oldFormData = ref()

const btnsOptions = computed(() => {
  return tableData.value.map(({ editable, enable }) => {
    const activeBtns: AuditBtn[] = []
    if (!editable && enable)
      activeBtns.push(
        new AuditBtn('编辑', handleEdit, { permission: 'SupplierSupplierProductIndex:SKU:Edit' })
      )
    if (editable)
      activeBtns.push(
        new AuditBtn('保存', handleSave, { permission: 'SupplierSupplierProductIndex:SKU:Edit' }),
        new AuditBtn('取消', handleCancle, { permission: 'SupplierSupplierProductIndex:SKU:Edit' })
      )
    if (!editable)
      activeBtns.push(
        new AuditBtn('变更趋势', handleCheckChangeTendency, {
          permission: 'SupplierSupplierProductIndex:SKU:ChangeTendency'
        }),
        new AuditBtn('采购价格趋势', handleCheckChangePurchasePriceTendency, {
          permission: 'SupplierSupplierProductIndex:SKU:ChangePurchaseTendency'
        })
      )
    if (enable === 0 && !editable)
      activeBtns.push(
        new AuditBtn('启用', handleEnable, { permission: 'SupplierSupplierProductIndex:SKU:Purse' })
      )
    if (enable === 1 && !editable)
      activeBtns.push(
        new AuditBtn('停用', handleEnable, {
          type: 'danger',
          permission: 'SupplierSupplierProductIndex:SKU:Run'
        })
      )

    return toReactive(activeBtns)
  })
})

const rules: FormRules = {
  fgCost: [{ required: true, message: '请输入' }],
  baseProdCost: [{ required: true, message: '请输入' }],
  whPackCost: [{ required: true, message: '请输入' }],
  minPurchaseQty: [{ required: true, message: '请输入' }],
  taxRate: [{ required: true, message: '请输入' }],
  discountRate: [{ required: true, message: '请输入' }],
  hasTax: [{ required: true, message: '请选择' }]
}

async function handleSave(row, index) {
  const re = await swTableRef.value?.validateFileds(undefined, index)
  if (!re) return

  const paramsKeys = [
    'taxRate',
    'discountRate',
    'baseProdCost',
    'fgCost',
    'minPurchaseQty',
    'whPackCost',
    'hasTax'
  ]

  const params = Object.fromEntries(Object.entries(row).filter(([key]) => paramsKeys.includes(key)))

  try {
    const res = await updateDetailApi({ supplierGoodsDetailId: row.id, ...params })
    if (res.success) {
      message.success('保存成功')
      delete row.editable
    }
  } catch (error) {
    console.log(error)
  } finally {
    delete row.saveLoading
    oldFormData.value = cloneDeep(tableData.value)
  }
}

function handleCancle(row, index) {
  Object.assign(row, oldData[index])
  swTableRef.value?.validateFileds(undefined, index)
  delete row.editable
}

function handleEdit(row, index) {
  oldData[index] = cloneDeep(row)

  row.editable = true
}

const supplierGoodsDetailIds = computed(() => selectedRows.value.map((row) => row.id || ''))

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

async function handleCheckChangeTendency(row: Supplier.SupplierProduct.SupplierGoodsDetailVO) {
  try {
    const res = await getDetailChangeHis({
      endTime: '2100-12-31',
      startTime: '2015-01-01',
      supplierGoodsDetailId: row.id || ''
    })

    if (!res) return
    if (!res.length) return message.warning('暂未查到变更数据')
    else {
      Object.assign(tendencyProps, {
        data: res,
        type: 0,
        supplierGoodsDetailId: row.id,
        sku: row.sku,
        title: '变更趋势',
        modelValue: true
      })
    }
  } catch (error) {}
}

async function handleCheckChangePurchasePriceTendency(
  row: Supplier.SupplierProduct.SupplierGoodsDetailVO
) {
  try {
    const res = await getPurchasePriceHis({
      endTime: '2100-12-31',
      startTime: '2015-01-01',
      supplierGoodsDetailId: row.id || ''
    })

    if (!res) return
    if (!res.length) message.warning('暂未查到变更数据')
    Object.assign(tendencyProps, {
      data: res,
      type: 1,
      supplierGoodsDetailId: row.id,
      sku: row.sku,
      title: '采购价格变更趋势',
      modelValue: true
    })
  } catch (error) {}
}

async function handleEnable(row) {
  const enable = row.enable === 0 ? 1 : 0
  const keyword = enable === 0 ? '停用' : '启用'
  await message.confirm(`确定${keyword}${row.sku}吗？`)

  try {
    row.enableLoading = true
    const res = await enableSupplierApi({ supplierGoodsDetailId: row.id, enable })
    if (res.success) {
      message.success(`${keyword}成功`)
      row.enable = enable
      if (enable === 0) row.editable = false
    }
  } catch (error) {
  } finally {
    delete row.enableLoading
  }
}

function handleTableSelected(
  selection: typeof tableData.value,
  item?: Supplier.SupplierProduct.SupplierGoodsDetailVO
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
  loading.value = true
  selectedRows.value = []
  try {
    const res = await getDetailByIdApi({
      ...queryParams,
      supplierGoodsId: route.params.id as string
    })
    tableData.value = res.records
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

    oldFormData.value = cloneDeep(tableData.value)
  }
}
async function handleQuery() {
  queryParams.pageNum = 1
  getList()
}
async function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, ''])),
    { pageNum: 1, pageSize: 10 }
  )
  getList()
}

async function handleBack() {
  const res = !deepEqual(oldFormData.value, [...tableData.value])

  if (res) {
    await message.confirm('确定要离开当前页面吗？离开后当前未保存数据会丢失')
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierSupplierProductIndex' })
  } else {
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierSupplierProductIndex' })
  }
}

onBeforeMount(async () => {
  await getList()
  supplierProduct.getSupplierList()
  productInfoData.getCategoryOptions()
})

onActivated(() => {
  getList()
})
</script>
<style lang="less" scoped>
@import url(../index.scss);
</style>
