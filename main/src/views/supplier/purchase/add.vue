<template>
  <special-card shadow="never">
    <div class="title"> 采购需求单信息 </div>
    <el-divider />
    <el-form
      :model="formData"
      ref="queryFormRef"
      :rules="nameRule"
      label-width="100"
      scroll-to-error
    >
      <el-row :gutter="24">
        <el-col :span="6" v-if="isEdit || isAudit">
          <el-form-item label="需求单号:" prop="scPurchaseRequestOrderNo">
            <el-input
              v-model="formData.scPurchaseRequestOrderNo"
              clearable
              :placeholder="isAudit ? '--' : '请输入需求单号'"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="需求单名称:" prop="scPurchaseRequestOrderName">
            <el-input
              v-model="formData.scPurchaseRequestOrderName"
              clearable
              :disabled="isAudit"
              :placeholder="isAudit ? '--' : '请输入需求单名称'"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="需求来源:" prop="requestSource">
            <el-select
              v-model="formData.requestSource"
              :disabled="isAudit || isEdit"
              :placeholder="isAudit ? '--' : '请选择需求来源'"
            >
              <el-option
                v-for="{ value, label } in requestSourceOption"
                :key="value"
                :value="value"
                :label="label"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" v-if="isAudit">
        <el-col :span="6">
          <el-form-item label="申请人:">
            <el-input
              :model-value="formData.requestApprovalUser?.name || '--'"
              :disabled="isAudit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="申请时间:">
            <el-input :model-value="formData.requestApprovalTime || '--'" :disabled="isAudit" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="18">
          <el-form-item label="备注:" prop="remarks">
            <s-text-area
              v-model="formData.remarks"
              :placeholder="isAudit ? '--' : '请输入'"
              :maxlength="500"
              :rows="5"
              show-word-limit
              :disabled="isAudit"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="18">
          <el-form-item label="附件:" prop="fileUrl">
            <files-upload
              :disabled="isAudit"
              v-model:modelValue="formData.fileUrl"
              :url="formData.fileUrl"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="title">
      <span>采购需求单明细</span>
      <div v-if="!isAudit" class="ml-auto">
        <component :is="() => easyBtnGroup(AddTopBtnOptions)" />
      </div>
    </div>
    <el-divider :class="{ 'mt-12px': !isAudit }" />

    <el-row :gutter="24" v-if="isAudit">
      <el-col :span="20">
        <el-form :model="queryParams" ref="formRef" :label-width="90">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item prop="skuQuery" label="SKU编码">
                <scroll-select
                  class-name="!w-100%"
                  v-model:model-value="queryParams.skuQuery"
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
          </el-row>
        </el-form>
      </el-col>

      <el-col :span="4" class="!flex justify-end">
        <el-button class="commonSearchBtn" @click="handleQuery">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button class="commonResetBtn" @click="resetQuery"> 重置 </el-button>
        <component :is="() => easyBtnGroup(AuditTopBtns)" />
      </el-col>
    </el-row>

    <sw-table
      ref="tableRef"
      class="form-table"
      :data="tableData"
      :options="tableOptions"
      :loading="loading"
      :show-overflow-tooltop="true"
      :rules="rules"
      :show-summary="isAudit"
      :summary-method="summaryMethod"
      :max-height="550"
    >
      <!-- 商家编码 -->
      <template v-if="!isAudit" #sku="{ index, row }">
        <scroll-select
          v-model:model-value="row.sku"
          :api="getInfoBySku"
          item-label-key="sku"
          item-value-key="sku"
          selectKey="sku"
          page-key="pageNum"
          size-key="pageSize"
          :multiple="false"
          :disabled="isAudit"
          :other-params="{
            productTypeCode: formData.productTypeCode,
            userId: orderHandlerId
          }"
          @change="(_, selectItem) => handleChangeSku(selectItem, index)"
        />
      </template>

      <!-- 补单量 -->
      <template v-if="!isAudit" #goodsQuantity="{ row, index }">
        <sw-input-number
          v-model="row.goodsQuantity"
          placeholder="请输入"
          :clearable="true"
          :min="0"
          :controls="false"
          :disabled="isAudit"
          @blur="handleBlur('goodsQuantity', index)"
        />
      </template>

      <!-- 清单时间 -->
      <template v-if="!isAudit" #orderItemTime="{ row, index }">
        <el-date-picker
          :id="`form_orderItemTime_${index}`"
          v-model="row.orderItemTime"
          placeholder="请选择"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          :disabled="isAudit"
          @change="handleChangeDate('orderItemTime', index)"
        />
        <el-tooltip
          v-if="row.orderItemTime && !isAudit"
          :content="`将${row.orderItemTime}应用到此后所有货品的需求清单时间`"
        >
          <el-button class="ml-4px" type="primary" link @click="handleCopy('orderItemTime', index)">
            <copy-icon :size="16" />
          </el-button>
        </el-tooltip>
      </template>

      <!-- 首单时间 -->
      <template v-if="!isAudit" #firstOrderTime="{ row, index }">
        <el-date-picker
          :id="`form_firstOrderTime_${index}`"
          :disabled="isAudit"
          v-model="row.firstOrderTime"
          :placeholder="isAudit ? '--' : '请选择'"
          type="date"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          @change="handleChangeDate('firstOrderTime', index)"
        />
        <el-tooltip
          v-if="row.firstOrderTime && !isAudit"
          :content="`将${row.firstOrderTime}应用到此后所有货品的首单时间`"
        >
          <el-button
            type="primary"
            class="ml-4px"
            link
            @click="handleCopy('firstOrderTime', index)"
          >
            <copy-icon :size="16" />
          </el-button>
        </el-tooltip>
      </template>

      <!-- 操作 -->
      <template #options="{ index }">
        <el-button link type="danger" @click="handleDelete(index)">删除</el-button>
      </template>
    </sw-table>

    <template #footer>
      <span class="flex items-center font-size-14px flex-1">
        <span v-for="item in sumDescriptionsOptions" :key="item.prop">
          <span class="color-#666 mr-1.5">{{ item.label }}</span>
          <span class="fw-600 mr-3">{{
            new Intl.NumberFormat().format(footerSum[item.prop])
          }}</span>
        </span>
      </span>
      <el-button @click="handleBack">返回</el-button>
      <component :is="() => easyBtnGroup(AddFooterBtns)" />
    </template>
  </special-card>

  <batch-add-dialog
    ref="batchAddDialogRef"
    :is-already="tableData"
    :user-id="orderHandlerId"
    @batch-add="handleBatchAddItem"
  />

  <upload-dialog ref="uploadDialogRef" @success="handleSuccess" />

  <audit-dialog
    v-bind="auditParams"
    v-model:model-value="auditParams.modelValue"
    @submit="handleAudit"
  />
</template>
<script lang="tsx" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import SwTable from '../components/table.vue'
import { addPurchaseTable, AddTableItem, auditPurchaseTable } from './options'
import {
  exportapprovalDetail,
  getEditInfo,
  getInfoBySku,
  getInfoBySku2,
  savePurchase,
  scPurchaseRequestOrderQueryOneByIdApi,
  scPurchaseRequestOrderReviewApi
} from '@/api/supplier/purchase'
import { ElButton, FormInstance, FormRules } from 'element-plus'
import batchAddDialog from '../components/batchAddDialog.vue'
import UploadDialog from './components/uploadDialog.vue'
import { useTagsView } from '@/hooks/web/useTagsView'
import { deepEqual, splitArrayToChunksBySlice } from '@/utils/common'
import { cloneDeep } from 'lodash-es'
import { getDictOptions } from '@/utils/dict'
import specialCard from '../components/specialCard.vue'
import CopyIcon from '@/assets/svgs/supplier/copy.vue'
import auditDialog from '@/views/supplier/purchaseApplication/components/auditDialog.vue'
import { formatDate } from '@/utils/formatTime'
import download from '@/utils/download'
import { Icon } from '@/components/Icon'
import BatchAddIcon from '@/assets/svgs/plus.svg'
import { easyBtnGroup, fullPageLoading } from '../components/twoFourSix'
import FilesUpload from '@/views/supplier/product/components/changePageUpload.vue'

defineOptions({ name: 'PurchaseAdd' })

const props = withDefaults(
  defineProps<{
    api?: (params: any) => Promise<any>
  }>(),
  {
    api: getEditInfo
  }
)

const router = useRouter()
const route = useRoute()
const message = useMessage()
const tagsViewStore = useTagsView()

const formData = ref<Supplier.Purchase.FormData>({
  scPurchaseRequestOrderName: '',
  operationFlag: 1,
  requestSource: '1'
})
const tableData = ref<Supplier.Purchase.FormItem[]>([])
const queryFormRef = ref<FormInstance>()
const rules: FormRules = {
  sku: [
    {
      required: true,
      validator: (_, val: string, callback) => {
        if (!val) return callback(new Error('请选择'))
        else if (tableData.value.filter((row) => row.sku === val).length > 1)
          return callback(new Error('当前商家编码已存在'))
        callback()
      },
      trigger: 'blur'
    }
  ],
  goodsQuantity: [{ required: true, message: '请输入', trigger: 'blur' }],
  orderItemTime: [], // 不要删
  firstOrderTime: [] // 不要删
}
const skuOptions = ref<{ value: any; label: string }[]>([])
const selectPage = ref(1)
const selectSize = ref(10)
const batchAddDialogRef = ref()
const uploadDialogRef = ref()
const loading = ref(false)
const oldFormData = ref<typeof formData.value>({})
const saveLoading = ref(false)
const tableRef = ref()
const exportLoading = ref(false)

const auditParams = reactive({
  modelValue: false,
  isApprove: false,
  loading: false
})
const queryParams = reactive({
  id: route.params.id as string,
  skuQuery: ''
})

const isAdd = computed(() => route.name === 'PurchaseAdd')
const isEdit = computed(() => route.name === 'PurchaseEdit')
const isAudit = computed(() => route.name === 'PurchaseAudit')

const sumDescriptionsOptions = [
  { label: '总补单量：', prop: 'goodsQuantity' },
  { label: '预估总价：', prop: 'estimatePrice' }
]

const requestSourceOption = computed(() => {
  return getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE).filter((ele) =>
    isAdd.value ? ['计划补单', '特殊补单'].includes(ele.label) : true
  )
})

const nameRule = computed<FormRules>(() => ({
  scPurchaseRequestOrderName: [{ required: !isAudit.value, message: '请输入需求单名称' }],
  requestSource: [{ required: !isAudit.value, message: '请选择需求来源' }]
}))

const tableOptions = computed(() => {
  return isAudit.value ? auditPurchaseTable : addPurchaseTable
})

const footerSum = computed(() => {
  function setResult(key: string) {
    return (
      Array.from(new Map(tableData.value.map((row) => [row.sku, row])).values()).reduce(
        (arr, cur) => arr + Math.round((cur[key] ?? 0) * 100),
        0
      ) / 100
    )
  }

  return {
    goodsQuantity: setResult('goodsQuantity'),
    estimatePrice:
      Array.from(new Map(tableData.value.map((row) => [row.sku, row])).values()).reduce(
        (arr, cur) => arr + Math.round((cur.estimatePrice || 0) * (cur.goodsQuantity || 0) * 100),
        0
      ) / 100
  }
})

const AddTopBtnOptions = computed(() => {
  if (!isAdd.value && !isEdit.value) return []

  const node = isAdd.value ? 'Add' : 'Edit'

  const btns = [
    {
      label: '新增',
      icon: <Icon icon="ep:plus"></Icon>,
      onClick: addTableItem,
      type: 'primary',
      permission: `SupplierPurchase:Index:${node}:Add`
    },
    {
      label: '批量新增',
      icon: <img class="mr4px" src={BatchAddIcon} alt="" />,
      onClick: handleBatchAdd,
      type: 'primary',
      permission: `SupplierPurchase:Index:${node}:BatchAdd`
    },
    {
      label: '导入',
      icon: <Icon icon="ep:upload"></Icon>,
      onClick: handleOpenUploadDialog,
      permission: `SupplierPurchase:Index:${node}:Import`
    }
  ]
  return btns
})

const AddFooterBtns = computed(() => {
  const node = isAdd.value ? 'Add' : 'Edit'

  const origin = [
    {
      label: '审核不通过',
      onClick: () => handleClickAudit(false),
      type: 'danger',
      permission: 'SupplierPurchase:audit:Audit:NoPass'
    },
    {
      label: '审核通过',
      onClick: () => handleClickAudit(true),
      type: 'primary',
      permission: 'SupplierPurchase:audit:Audit:Pass'
    },
    {
      label: '保存',
      onClick: handleSave,
      type: 'primary',
      permission: `SupplierPurchase:Index:${node}:Save`
    },
    {
      label: '保存并提交',
      component: (
        <el-tooltip content="当前需求单未添加商品" disabled={tableData.value.length !== 0}>
          <el-button
            type="primary"
            disabled={tableData.value.length === 0}
            onClick={handleSaveAndSubmit}
          >
            保存并提交
          </el-button>
        </el-tooltip>
      ),
      permission: `SupplierPurchase:Index:${node}:Save&Submit`
    }
  ]

  const btnMap = new Map(origin.map((ele) => [ele.label, ele]))
  const btnLabels =
    isAdd.value || isEdit.value ? ['保存并提交', '保存'] : ['审核不通过', '审核通过']
  return btnLabels.map((ele) => btnMap.get(ele))
})

const AuditTopBtns = computed(() => [
  {
    label: '导出',
    icon: <Icon icon="ep:download"></Icon>,
    onClick: handleExport,
    type: 'primary',
    permission: 'SupplierPurchase:audit:Audit:Export',
    loading: exportLoading.value
  }
])

watch(
  tableData,
  (data) =>
    (formData.value.scpurchaseRequestOrderDetailList = data?.map((ele) => ({
      ...ele,
      formCode: ele.specCode || ele.formCode,
      formName: ele.specName || ele.formName
    }))),
  { deep: true }
)

function addTableItem() {
  const tableItem = new AddTableItem()
  tableData.value.unshift(tableItem)
}

async function handleBlur(key: string, index: number) {
  await tableRef.value?.validateFileds([key], index)
  skuOptions.value = []
  selectPage.value = 1
  selectSize.value = 10
}

function handleChangeDate(key: string, index) {
  handleBlur(key, index)

  let otherKey = key === 'orderItemTime' ? 'firstOrderTime' : 'orderItemTime'
  tableRef.value?.validateFileds([otherKey], index)
}

async function handleDelete(index: number) {
  await message.confirm(`确定删除该需求吗？`)
  // 这样是为了在删除之后不影响下一条数据的校验显示
  const arr = [...tableData.value]
  arr.splice(index, 1)
  tableData.value = arr

  tableData.value.forEach((item, index) => {
    Object.keys(rules).forEach(async (key) => {
      if (item[key] !== null && item[key] !== undefined && item[key] !== '') {
        nextTick(() => {
          tableRef.value?.validateFileds([key], index)
        })
      } else {
        nextTick(() => {
          tableRef.value?.validateFileds([key], index)
        })
      }
    })
  })
}

async function handleChangeSku(selectItem: any, index: number) {
  try {
    Object.assign(tableData.value?.[index] || {}, selectItem, {
      goodsCode: selectItem.goodsNo,
      formName: selectItem.specName,
      formCode: selectItem.specCode
    })
  } catch (error) {}
}

async function handleBack() {
  const res = !deepEqual(oldFormData.value, {
    ...formData.value,
    scpurchaseRequestOrderDetailList: tableData.value
  })

  if (res && !isAudit.value)
    await message.confirm('确定要离开当前页面吗？离开后当前未保存数据会丢失')

  tagsViewStore.closeCurrent()
  router.push({ name: 'SupplierPurchaseIndex', query: { tab: isAudit.value ? '2' : '1' } })
}

async function handleSaveAndSubmit() {
  await Promise.all([queryFormRef.value?.validate(), tableRef.value?.validateFileds()])

  const loading = fullPageLoading('数据保存并提交中...')

  if (tableData.value.every((item) => item.goodsQuantity === 0))
    return message.error('当前需求单没有设置补单量')

  try {
    const res1 = await savePurchase({
      ...formData.value,
      id: route.params.id as string,
      operationFlag: 2
    })
    if (res1.success) {
      message.success('保存并提交成功')
      tagsViewStore.closeCurrent()
      router.push({ name: 'SupplierPurchaseIndex' })
    }
  } catch (error) {
  } finally {
    loading.close()
  }
}

async function handleSave() {
  await Promise.all([queryFormRef.value?.validate(), tableRef.value?.validateFileds()])

  const loading = fullPageLoading('数据保存中...')

  if (tableData.value.every((item) => item.goodsQuantity === 0))
    return message.error('当前需求单没有设置补单量')
  saveLoading.value = true
  try {
    if (isEdit.value) formData.value.id = route.params.id as string
    const res = await savePurchase(formData.value)
    if (res.success) {
      message.success('保存成功')
      tagsViewStore.closeCurrent()
      router.push({ name: 'SupplierPurchaseIndex' })
    }
  } catch (error) {
  } finally {
    loading.close()
  }
}

function handleBatchAdd() {
  batchAddDialogRef.value?.open()
}

function handleBatchAddItem(rows: Supplier.Purchase.ScGoodsInfoVO[]) {
  loading.value = true
  const splitRows = splitArrayToChunksBySlice(rows, 10)
  splitRows.sort(() => -1)

  splitRows.forEach((ele, index) => {
    const timer = setTimeout(() => {
      tableData.value.unshift(
        ...ele.map((row) => ({
          ...row,
          goodsCode: row.goodsNo || '',
          formName: row.specName || '',
          formCode: row.specCode || '',
          orderItemTime: '',
          scPurchaseRequestOrderId: '',
          sku: row.sku || ''
        }))
      )

      tableData.value = Array.from(new Map(tableData.value.map((row) => [row.sku, row])).values())
      if (index === splitRows.length - 1) loading.value = false
      clearTimeout(timer)
    }, 100)
  })
}

const orderHandlerId = ref<string>('')
async function getDetail() {
  loading.value = true
  try {
    const res = await props.api({ id: route.params.id as string })
    tableData.value = res.scpurchaseRequestOrderDetailList

    const keys = [
      'remarks',
      'scPurchaseRequestOrderName',
      'requestSource',
      'requestApprovalUser',
      'requestApprovalTime'
    ]
    keys.forEach((key) => (formData.value[key] = res[key]))

    formData.value.scPurchaseRequestOrderNo =
      (route.query.PrNo as string) || res.scPurchaseRequestOrderNo
    orderHandlerId.value = res.orderHandlerList[0].userId
  } catch (error) {
  } finally {
    loading.value = false
    await nextTick()
    oldFormData.value = cloneDeep({
      ...formData.value,
      scpurchaseRequestOrderDetailList: tableData.value
    })
  }
}

async function handleCopy(key: string, index: number) {
  const date = tableData.value[index][key]
  await message.confirm(
    `确定将${date}应用到此后所有货品的${key === 'orderItemTime' ? '需求清单时间' : '首单时间'}吗？`
  )
  tableData.value.forEach((row, i) => {
    if (i >= index) {
      row[key] = date
    }
  })

  tableRef.value?.validateFileds(['firstOrderTime'])
}

function handleOpenUploadDialog() {
  uploadDialogRef.value.open()
}

function handleSuccess(rows: Supplier.Purchase.FormItem[], type: 1 | 2 | 3) {
  if (type === 1) {
    rows.forEach((row) => {
      const index = tableData.value.findIndex((ele) => ele.sku === row.sku)
      if (index >= 0 && tableData.value[index]) {
        row.goodsQuantity =
          Number(row.goodsQuantity || 0) + Number(tableData.value[index].goodsQuantity || 0)
      }
    })
    tableData.value.unshift(...rows)
  } else if (type === 2) {
    tableData.value = rows
  }
  tableData.value = tableData.value.filter((row, index) => {
    return tableData.value.findIndex((ele) => ele.sku === row.sku) === index
  })
}

async function handleAudit(params) {
  try {
    auditParams.loading = true
    const res = await scPurchaseRequestOrderReviewApi({
      ...params,
      scPurchaseRequestId: route.params.id
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

async function handleQuery() {
  try {
    const res = await scPurchaseRequestOrderQueryOneByIdApi(queryParams)

    tableData.value = res.scpurchaseRequestOrderDetailList
  } catch (error) {}
}
function resetQuery() {
  Object.assign(
    queryParams,
    Object.fromEntries(Object.entries(queryParams).map(([key]) => [key, undefined])),
    { id: route.params.id }
  )
  handleQuery()
}

function handleClickAudit(isApprove: boolean) {
  auditParams.modelValue = true
  auditParams.isApprove = isApprove
}

async function handleExport() {
  exportLoading.value = true
  try {
    const res = await exportapprovalDetail({ id: route.params.id as string })
    if (res) {
      message.success('导出成功！')

      const fileName = `采购需求单审核明细_${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`
      download.excel(res, fileName)
    }
  } catch (error) {
  } finally {
    exportLoading.value = false
  }
}

function summaryMethod(param) {
  const NO_SHOW_SUMMARY_COLUMNS = new Set([
    'imgUrl',
    'goodsCode',
    'goodsName',
    'sku',
    'formName',
    'formCode',
    'estimatePrice',
    'iterateCode',
    'orderItemTime',
    'firstOrderTime',
    'expectedArrivalTime'
  ])
  const AVERAGE_COLUMNS = new Set([
    'sevenTurnover',
    'turnoverDays',
    'fourteenTurnover',
    'thirtyTurnover',
    'turnoverDaysAfterRestocking'
  ])
  const { columns } = param
  const sums: (string | VNode)[] = []
  const dataLength = tableData.value.length
  columns.forEach((column, index) => {
    if (index === 0) return (sums[index] = '合计')
    const columnKey = column.rawColumnKey
    if (NO_SHOW_SUMMARY_COLUMNS.has(columnKey)) return (sums[index] = '')
    // if (columnKey === 'turnoverDaysAfterRestocking') {
    //   const totalInventory = tableData.value.reduce(
    //     (sum, cur) => sum + (cur.inventoryAfterRestocking || 0),
    //     0
    //   )
    //   const totalSales = tableData.value.reduce((sum, cur) => sum + (cur.salesNumYesterday || 0), 0)
    //   const result = totalSales > 0 ? Math.floor(totalInventory / totalSales) : 0
    //   return (sums[index] = String(result))
    // }
    const total = tableData.value.reduce((sum, row) => {
      const value = Number(row[columnKey]) || 0
      return sum + value
    }, 0)
    let result: number | string = total
    if (AVERAGE_COLUMNS.has(columnKey) && dataLength > 0) result = Math.floor(total / dataLength)
    sums[index] = String(result)
  })
  return sums
}

onBeforeMount(async () => {
  ;(isEdit.value || isAudit.value) && (await getDetail())
})

onMounted(() => {
  oldFormData.value = cloneDeep({
    ...formData.value,
    scpurchaseRequestOrderDetailList: tableData.value
  })
})
</script>
<style lang="less" scoped>
@import url(../index.scss);

* {
  --el-color-primary: #0064ff;
}

.commonTopFilterWrap-filter {
  flex: 1;
}

.commonTopFilterWrap-search {
  padding-left: 115px;
  justify-content: flex-end;
}

:deep(.cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.canEdit {
  display: flex;
  align-items: center;
  width: 100%;
  height: 64px;
  font-size: 14px;
  color: #333;
  line-height: 20px;

  :deep(.el-form-item) {
    transform: translateY(9px);
  }
}

:deep(.el-table) {
  .el-input {
    --el-input-width: 100px;
    --el-date-editor-width: 150px;
  }

  .el-select {
    --el-select-width: 150px;
  }
}

.el-card {
  border: 0;
  border-radius: 8px;

  :deep(.el-card__body) {
    padding-bottom: 0;
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
}

:deep(.el-card__body) {
  height: 100%;
}

:deep(.el-input-number) {
  .el-input__inner {
    text-align: left;
  }
}

:deep(.el-divider) {
  width: calc(100% + 40px);
  margin: 20px -20px;
}

:deep(.el-table__cell) {
  padding: 4px 0;
}
</style>
