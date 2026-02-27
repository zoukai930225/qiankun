<template>
  <special-card ref="cardRef" shadow="never" v-loading="pageLoading">
    <add-form
      ref="formRef"
      v-model:model-value="formData"
      :is-add="isAdd"
      :is-audit="isAudit"
      :is-edit="isEdit"
      @change-pr-code="handleChangePrCode"
    />

    <add-table
      ref="tableRef"
      v-model:model-value="tableData"
      :sc-purchase-request-order-id="scPurchaseRequestOrderId"
      :rules="rules"
      :is-add="isAdd"
      :is-audit="isAudit"
      :is-edit="isEdit"
      :statistic-date="formData.statisticDate || ''"
      :spanMethod="spanMethod"
      @open-upload-dialog="handleOpenUploadDialog"
      @reset-span="spanArr = []"
    />

    <template #footer>
      <span class="font-size-14px mr-auto">
        <span>
          <span class="color-#666 mr-1.5">补单量：</span>
          <span class="fw-600 mr-3">{{
            new Intl.NumberFormat().format(footerSum.goodsQuantity)
          }}</span>
        </span>
        <span>
          <span class="color-#666 mr-1.5">剩余补单量：</span>
          <span class="fw-600 mr-3">{{
            new Intl.NumberFormat().format(footerSum.remainingGoodsQuantity)
          }}</span>
        </span>
        <span>
          <span class="color-#666 mr-1.5">采购数量：</span>
          <span class="fw-600 mr-3">{{
            new Intl.NumberFormat().format(footerSum.purchasedGoodsQuantityTotal)
          }}</span>
        </span>
      </span>
      <el-button @click="handleBack">返回</el-button>
      <component :is="easyBtnGroup(footerBtns)" />
    </template>
  </special-card>
  <upload-dialog
    ref="uploadDialogRef"
    :scPurchaseRequestOrderId="scPurchaseRequestOrderId"
    @success="handleSuccess"
  />
  <remark-dialog ref="remarkDialogRef" v-model:model-value="formData.scPoRemarks!" />

  <!-- 预览 -->
  <preview-dialog
    ref="previewDialogRef"
    :data="previewData"
    :table-option="previewTableOption"
    width="90%"
    :spanMethod="spanMethod"
    @comfire="handleComfire"
  />

  <audit-dialog
    v-bind="auditParams"
    v-model:model-value="auditParams.modelValue"
    @submit="handleAudit"
  />
</template>
<script lang="tsx" setup>
import {
  getPrOrderDetailApi,
  getScPurchaseDetailApi,
  saveOrUpdateScPurchaseOrderApi,
  scPurchaseOrderAuditApi
} from '@/api/supplier/purchase'
import { FormInstance, FormRules, TableColumnCtx } from 'element-plus'
import { useTagsView } from '@/hooks/web/useTagsView'
import { deepEqual } from '@/utils/common'
import { cloneDeep } from 'lodash-es'
import RemarkDialog from './components/remarkDialog.vue'
const UploadDialog = defineAsyncComponent(() => import('./components/uploadDialog.vue'))
import AddForm from './components/addform.vue'
import AddTable from './components/addTable.vue'
import { previewTableOption } from './options'
import previewDialog from '../components/beforeSavePreview.vue'
import specialCard from '../components/specialCard.vue'
import auditDialog from '@/views/supplier/purchaseApplication/components/auditDialog.vue'
import { getPermission } from '@/utils'
import { easyBtnGroup, fullPageLoading } from '../components/twoFourSix'

defineOptions({ name: 'PurchaseProductOrderAdd' })

const router = useRouter()
const route = useRoute()
const message = useMessage()
const tagsViewStore = useTagsView()

const formData = ref<Supplier.Purchase.FormData>({
  scPurchaseRequestOrderNo: ''
})
const tableData = ref<Supplier.Purchase.FormItem[]>([])
const queryFormRef = ref<FormInstance>()
const formRef = ref()
const uploadDialogRef = ref()
const pageLoading = ref(false)
const oldFormData = ref<typeof formData.value>({
  scPurchaseRequestOrderNo: ''
})
const tableRef = ref<InstanceType<typeof AddTable>>()
const currentComfire = ref<() => Promise<any>>()
const previewDialogRef = ref()
const rules: FormRules = {
  purchasedGoodsQuantity: [{ required: false, message: '请输入' }],
  orderArrivalTime: [{ required: false, message: '请选择' }],
  firstBatchTime: []
}
const footerWidth = ref(0)
const auditParams = reactive({
  modelValue: false,
  isApprove: 0 as 0 | 1,
  loading: false
})

const permissionSet = new Set(getPermission())
const footerBtns = computed(() => {
  const node = isAdd.value ? 'Add' : isEdit.value ? 'Edit' : 'Audit'
  const btns = [
    {
      label: '审核不通过',
      type: 'danger',
      onClick: () => handleClickAudit(0),
      permission: 'SupplierProduct:audit:Audit:NoPass',
      page: isAudit.value
    },
    {
      label: '审核通过',
      type: 'primary',
      onClick: () => handleClickAudit(1),
      permission: 'SupplierProduct:audit:Audit:Pass',
      page: isAudit.value
    },
    {
      component: (
        <el-tooltip content="当前需求单未添加商品" disabled={tableData.value.length !== 0}>
          <el-button
            type="primary"
            disabled={tableData.value.length === 0}
            onClick={() => handleClickSave(handleSaveAndSubmit)}
          >
            保存并提交
          </el-button>
        </el-tooltip>
      ),
      permission: `SupplierProduct:MyOrder:${node}:Save&Submit`,
      page: isAdd.value || isEdit.value
    },
    {
      label: '保存',
      type: 'primary',
      onClick: () => handleClickSave(handleSave),
      permission: `SupplierProduct:MyOrder:${node}:Save`,
      page: isAdd.value || isEdit.value
    }
  ]

  return btns.filter((ele) => ele.page && permissionSet.has(ele.permission))
})

const isAudit = computed(() => route.name === 'PurchaseProductOrderAudit')
const isAdd = computed(() => route.name === 'PurchaseProductOrderAdd')
const isEdit = computed(() => route.name === 'PurchaseProductOrderEdit')

const scPurchaseRequestOrderId = computed(
  () => (route.query?.purchaseId as string) || formData.value.scPurchaseRequestOrderId
)

const footerSum = computed(() => {
  const keys = ['goodsQuantity', 'remainingGoodsQuantity', 'purchasedGoodsQuantityTotal']

  function setResult(key: string) {
    return (
      Array.from(new Map(tableData.value.map((row) => [row.sku, row])).values()).reduce(
        (arr, cur) => arr + Math.round((cur[key] ?? 0) * 100),
        0
      ) / 100
    )
  }

  return Object.fromEntries(keys.map((key) => [key, setResult(key)]))
})

const previewData = ref<any[]>([])

watch(
  tableData,
  (data) => {
    formData.value.scPurchaseOrderDetailList = data.map((ele) => {
      return cloneDeep(ele)
    })
  },
  {
    deep: true
  }
)

async function handleComfire() {
  currentComfire.value?.()
}

async function handleClickSave(api) {
  await formRef?.value?.checkValue()
  try {
    if (tableData.value.every((item) => !item.purchasedGoodsQuantity))
      return message.warning('当前生产单没有采购数量')
    await tableRef.value?.validateFileds()
    previewData.value = tableData.value.filter((row) => row.purchasedGoodsQuantity) || []
    currentComfire.value = api
    previewDialogRef.value?.open()
  } catch (error) {
    previewDialogRef.value?.handleClosed()
  }
}

async function handleBack() {
  const res = !deepEqual(oldFormData.value, {
    ...formData.value
  })

  if (res) {
    await message.confirm('确定要离开当前页面吗？离开后当前未保存数据会丢失')
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierProductIndex', query: { tab: route.query.tab } })
  } else {
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierProductIndex', query: { tab: route.query.tab } })
  }
}

async function handleSaveAndSubmit() {
  if (tableData.value.every((item) => !item.purchasedGoodsQuantity))
    return message.error('当前生产单没有采购数量')

  await Promise.all([queryFormRef.value?.validate(), tableRef.value?.validateFileds()])

  const loading = fullPageLoading('数据保存并提交中...')
  try {
    const params = {
      ...formData.value,
      scPurchaseRequestOrderId:
        formData.value.scPurchaseRequestOrderId || (route.query.purchaseId as string),
      operationFlag: 2
    }
    const res1 = await saveOrUpdateScPurchaseOrderApi(params)
    if (res1.success) {
      message.success('保存并提交成功！')
      tagsViewStore.closeCurrent()
      router.push({ name: 'SupplierProductIndex', query: { tab: route.query.tab } })
    }
  } catch (error) {
  } finally {
    loading.close()
  }
}

async function handleSave() {
  if (tableData.value.every((item) => !item.purchasedGoodsQuantity))
    return message.error('当前生产单没有采购数量')

  await Promise.all([queryFormRef.value?.validate(), tableRef.value?.validateFileds()])

  const loading = fullPageLoading('数据保存中...')

  try {
    if (route.params.id) formData.value.id = route.params.id as string
    const params = {
      ...formData.value,
      scPurchaseRequestOrderId:
        formData.value.scPurchaseRequestOrderId || (route.query.purchaseId as string),
      operationFlag: 1
    }
    const res = await saveOrUpdateScPurchaseOrderApi(params)
    if (res.success) {
      message.success('保存成功')
      tagsViewStore.closeCurrent()
      router.push({ name: 'SupplierProductIndex', query: { tab: route.query.tab } })
    }
  } catch (error) {
  } finally {
    loading.close()
  }
}

async function getDetail() {
  spanArr.value = []

  try {
    const scPurchaseRequestOrderId =
      (route.query?.purchaseId as string) || formData.value.scPurchaseRequestOrderId
    const scPurchaseOrderId = route.params.id as string
    const api = isAdd.value ? getPrOrderDetailApi : getScPurchaseDetailApi
    const requestParams = isAdd.value ? { scPurchaseRequestOrderId } : { scPurchaseOrderId }
    const res = await api(requestParams as any)
    const { scPurchaseOrderDetailList: tableTempt = [] } = res
    tableRef.value?.renderTableMethod(tableTempt)
    formData.value = res
  } catch (error) {
    console.error('获取订单详情失败', error)
  } finally {
    nextTick(() => {
      oldFormData.value = cloneDeep(formData.value)
      formRef.value?.clearValidate()
    })
  }
}

function handleOpenUploadDialog() {
  uploadDialogRef.value?.open()
}

function handleSuccess(rows: typeof tableData.value) {
  tableRef.value?.renderTableMethod(rows)
}

function handleChangePrCode() {
  getDetail()
}

interface SpanMethodProps {
  row: Supplier.Purchase.FormItem
  column: TableColumnCtx<Supplier.Purchase.FormItem>
  rowIndex: number
  columnIndex: number
}
/** 列表合并规则 */
function spanMethod({ rowIndex, column }: SpanMethodProps): [number, number] {
  if (spanArr.value.length === 0) spanArr.value = calculateSpan()
  if (
    [...Object.keys(rules), 'supplierName', 'fgCost', 'baseProdCost', 'hasTax'].includes(
      column.rawColumnKey
    )
  )
    return [1, 1]
  return spanArr.value[rowIndex]
}
// 预处理合并所需的跨度数据，按“商家编码”分组
const spanArr = ref<[number, number][]>([]) // 通过清空spanArr可以重置合并规则
function calculateSpan(): typeof spanArr.value {
  const result: typeof spanArr.value = []
  let count = 1,
    index = 1

  tableRef.value?.filterData()!.forEach((row, i) => {
    if (
      i < (tableRef.value?.filterData()!.length || 1) - 1 &&
      tableRef.value?.filterData()?.[i].sku === tableRef.value?.filterData()?.[i + 1].sku
    ) {
      count++
      row.index = index
    } else {
      result.push([count, 1])
      for (let index = 1; index < count; index++) {
        result.push([0, 0])
      }
      row.index = index
      index++
      count = 1
    }
  })
  return result
}

async function handleAudit(params) {
  try {
    auditParams.loading = true
    const res = await scPurchaseOrderAuditApi({
      poId: route.params.id as string,
      status: auditParams.isApprove,
      remark: params.reviewOpinion
    })
    if (res.success) {
      message.success('审核成功！')
      handleBack()
    }
  } catch (error) {
  } finally {
    auditParams.loading = false
    auditParams.modelValue = false
  }
}

function handleClickAudit(isApprove: 0 | 1) {
  auditParams.modelValue = true
  auditParams.isApprove = isApprove
}

defineExpose({ getDetail })

onBeforeMount(async () => {
  if (route.params.id || route.query.purchaseId) {
    pageLoading.value = true
    await getDetail()
    pageLoading.value = false
  }
})

let resizeObserver: ResizeObserver | null
onMounted(() => {
  const cardBody = document.querySelector('.el-card__body')
  resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      footerWidth.value = entry.contentRect.width
    }
  })
  resizeObserver.observe(cardBody!)
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
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
  padding-left: 115px;
  justify-content: flex-end;
}

.el-form {
  flex: 1;

  :deep(.el-input__wrapper) {
    height: 32px;
    box-sizing: border-box;
  }
}

:deep(.cell) {
  // display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-table__cell) {
  padding: 4px 0;
}

:deep(.el-table) {
  .el-input {
    --el-input-width: 80px;
    --el-date-editor-width: 110px;
  }
}

.header {
  display: flex;
  align-items: center;

  .title {
    margin-right: 20px;
    font-size: 16px;
    line-height: 32px;
    color: #3d3d3d;
    font-weight: 500;
  }

  .sub-title {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;
    margin-left: 16px;

    &:first-of-type {
      margin-left: 0;
    }

    .scPurchaseRequestOrderName {
      color: #333;
    }

    .scPurchaseRequestOrderNo {
      color: #666;
    }
  }
}

.fixed {
  // width: calc(100% - 310px);
  background-color: #fff;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  right: 20px;
  z-index: 999;
}

:deep(.el-card__body) {
  height: 100%;
}

.supplierName {
  width: 7em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.flex1 {
  flex: 1;
}

:deep(.title) {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  font-weight: 600;

  &::before {
    content: '';
    display: block;
    margin-right: 6px;
    width: 3px;
    height: 10px;
    background-color: #0064ff;
  }
}

:deep(.el-divider) {
  width: calc(100% + 40px);
  margin: 20px -20px;
}
</style>
