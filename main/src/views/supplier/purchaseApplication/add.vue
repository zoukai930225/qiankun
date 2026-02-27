<template>
  <special-card shadow="never">
    <div class="title"> 采购申请信息 </div>
    <el-divider />
    <!-------------------------------------------------------------------------- 表单 ------------------------------------------------------------------------------>
    <el-form
      :model="formData"
      ref="queryFormRef"
      :rules="nameRule"
      label-width="100"
      scroll-to-error
    >
      <el-row :gutter="17">
        <el-col :span="6">
          <el-form-item label="售卖渠道:" prop="salesChannelCode">
            <select-channels
              class="w-100%"
              v-model="formData.salesChannelCode"
              :disabled="isCheck || isAudit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="调整原因:" prop="adjustmentTypeCode">
            <el-select
              v-model="formData.adjustmentTypeCode"
              clearable
              :disabled="isCheck || isAudit"
              placeholder="请选择调整原因"
            >
              <el-option
                v-for="item in OPS_REPLENISHMENT_ADJUSTMENT_REASON"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="产品类型" prop="productTypeCode">
            <div class="flex w-full items-center">
              <el-select
                v-model="formData.productTypeCode"
                placeholder="请选择产品类型"
                :disabled="isCheck || isAudit"
                clearable
                @change="handleChangeProductType"
              >
                <el-option
                  v-for="item in OPS_REPLENISHMENT_PRODUCT_TYPE"
                  :key="item.value"
                  v-bind="item"
                />
              </el-select>
              <el-tooltip v-if="!isCheck && !isAudit" content="切换产品类型会清空明细列表">
                <Icon icon="ep:warning" :size="16" class="ml-4px" color="#999" />
              </el-tooltip>
            </div>
          </el-form-item>
        </el-col>
        <el-col v-if="isCheck || isAudit" :span="6">
          <el-form-item label="申请人">
            <el-input :model-value="formData?.requester?.name || '--'" disabled />
          </el-form-item>
        </el-col>
        <el-col v-if="isCheck || isAudit" :span="6">
          <el-form-item label="申请时间">
            <el-input
              :model-value="formatDate(formData?.createdAt, 'YYYY-MM-DD HH:mm:ss')"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="调整说明:" prop="adjustmentReason">
            <s-text-area
              v-model="formData.adjustmentReason"
              placeholder="请输入调整说明"
              :disabled="isCheck || isAudit"
              :maxlength="200"
              :rows="4"
              show-word-limit
            />
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="附件" class="form-item-files">
            <files-upload
              :disabled="isCheck || isAudit"
              v-model:modelValue="formData.fileUrl"
              :url="formData.fileUrl"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="title">
      <span>采购申请明细</span>
      <span
        v-if="route.query.status !== '0' && formData.statisticDate"
        class="color-#DB6A0F !flex items-center ml-16px"
      >
        <Icon icon="ep:warning-filled" class="mr-4px" :size="14" />
        <span class="font-400">数据统计日期：{{ formData.statisticDate }}</span>
      </span>

      <component :is="easyBtnGroup(AddTopBtnOptions)" class="ml-auto" />
    </div>
    <el-divider />

    <!--------------------------------------------------------------------- 查看/审核搜索行 ----------------------------------------------------------------------------->
    <el-row :gutter="24" v-if="isAudit || isCheck">
      <el-col :span="20">
        <el-form :model="queryParams" ref="formRef" :label-width="90">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item prop="sku" label="SKU编码">
                <scroll-select
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
          </el-row>
        </el-form>
      </el-col>

      <el-col :span="4" class="!flex justify-end">
        <el-button class="commonSearchBtn" @click="handleQuery">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button class="commonResetBtn" @click="resetQuery"> 重置 </el-button>
      </el-col>
    </el-row>

    <!----------------------------------------------------------------------------- 列表 ------------------------------------------------------------------------------------->
    <special-table
      ref="tableRef"
      :data="tableData"
      :options="tableOption"
      :rules="rules"
      :show-summary="isAudit || isCheck"
      :summary-method="summaryMethod"
      :max-height="550"
    >
      <!-- 商家编码 -->
      <template #sku="{ row, index }" v-if="isAdd || isEdit">
        <scroll-select
          v-model:model-value="row.sku"
          :api="getInfoBySku"
          item-label-key="sku"
          item-value-key="sku"
          selectKey="sku"
          page-key="pageNum"
          size-key="pageSize"
          :multiple="false"
          :disabled="isCheck || isAudit"
          :other-params="{ productTypeCode: formData.productTypeCode }"
          @change="(_, selectItem) => handleChangeSku(selectItem, index)"
        />
      </template>

      <!-- 申请数 -->
      <template #requestQuantity="{ row }" v-if="isAdd || isEdit">
        <sw-input-number
          v-model="row.requestQuantity"
          clearabled
          :disabled="isCheck || isAudit"
          placeholder="请输入"
        />
      </template>

      <!-- 期望到货日期 -->
      <template #expectedArrivalTime="{ row, index }" v-if="isAdd || isEdit">
        <div class="flex">
          <el-date-picker
            v-model="row.expectedArrivalTime"
            placeholder="请选择"
            type="date"
            format="YYYY-MM-DD"
            :disabled="isCheck || isAudit"
            value-format="YYYY-MM-DD"
          />
          <el-tooltip
            v-if="!isCheck && !isAudit"
            :disabled="!row.expectedArrivalTime"
            :content="`将${row.expectedArrivalTime}应用到此后所有货品`"
          >
            <el-button
              class="ml-4px"
              type="primary"
              link
              @click="handleCopy('expectedArrivalTime', index)"
            >
              <copy-icon :size="16" />
            </el-button>
          </el-tooltip>
        </div>
      </template>

      <template #options="{ index }" v-if="isAdd || isEdit">
        <el-button link type="danger" @click="handleDelete(index)">删除</el-button>
      </template>

      <template v-if="isAudit" #goodsName="{ row }">
        <goods-name-popper :row="row" />
      </template>
    </special-table>

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
      <component :is="easyBtnGroup(AddFooterBtns)" />
    </template>
  </special-card>

  <batch-add-dialog
    ref="batchAddDialogRef"
    :is-already="tableData"
    :user-id="orderHandlerId"
    :type="formData.productTypeCode"
    @batch-add="handleBatchAddItem"
  />

  <upload-dialog
    ref="uploadDialogRef"
    @success="handleSuccess"
    :productTypeCode="formData.productTypeCode"
  />

  <audit-dialog
    v-bind="auditDialogProps"
    v-model:model-value="auditDialogProps.modelvalue"
    @submit="handleAudit"
  />
</template>
<script lang="tsx" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import specialTable from '../components/table.vue'
import { getInfoBySku, getInfoBySku2 } from '@/api/supplier/purchase'
import { FormInstance, FormRules } from 'element-plus'
import BatchAddDialog from '../components/batchAddDialog.vue'
import { useTagsView } from '@/hooks/web/useTagsView'
import { deepEqual } from '@/utils/common'
import { cloneDeep } from 'lodash-es'
import { getDictOptions } from '@/utils/dict'
import specialCard from '../components/specialCard.vue'
import CopyIcon from '@/assets/svgs/supplier/copy.vue'
import FilesUpload from '../product/components/changePageUpload.vue'
import { addTable, COLUMN_1, detailTable, inTableSort } from './options'
import {
  addOpsReplenishmentRequestApi,
  opsReplenishmentRequestDetailApi,
  opsReplenishmentRequestQuerySnapshotById,
  reviewOpsReplenishmentRequestApi,
  updateOpsReplenishmentRequestApi
} from '@/api/supplier/purchaseApplication'
import { formatDate } from '@/utils/formatTime'
import UploadDialog from './components/uploadDialog.vue'
import auditDialog from './components/auditDialog.vue'
import goodsNamePopper from './components/goodsNamePopper.vue'
import { Icon } from '@/components/Icon'
import BatchAddIcon from '@/assets/svgs/plus.svg'
import { easyBtnGroup } from '../components/twoFourSix'
import { SwTextTooltip } from '@/components/SwTextTooltip'

defineOptions({ name: 'SupplierPurchaseApplicationAdd' })
const router = useRouter()
const route = useRoute()
const message = useMessage()
const tagsViewStore = useTagsView()

const formData = ref<Supplier.PurchaseApplication.AddRequest>({
  detail: [],
  productTypeCode: 'product'
})
const tableData = ref<Supplier.PurchaseApplication.Detail[]>([])
const queryFormRef = ref<FormInstance>()
const formRef = ref<FormInstance>()
const rules: FormRules = {
  sku: {
    required: true,
    validator: (_, val: string, callback) => {
      if (!val) return callback(new Error('请输入'))
      else if (tableData.value.filter((row) => row.sku === val).length > 1)
        return callback(new Error('当前商家编码已存在'))
      callback()
    },
    trigger: 'blur'
  },
  expectedArrivalTime: [],
  requestQuantity: []
}
const batchAddDialogRef = ref()
const uploadDialogRef = ref()
const loading = ref(false)
const oldFormData = ref<typeof formData.value>({})
const saveLoading = ref(false)
const saveType = ref(0)
const tableRef = ref()
const queryParams = reactive({
  sku: ''
})
const auditDialogProps = reactive({
  modelvalue: false,
  isApprove: false,
  loading: false
})

const sumDescriptionsOptions = [
  { label: '总申请量：', prop: 'requestQuantity' },
  { label: '预估总价：', prop: 'estimatePrice' }
]

const AddTopBtnOptions = computed(() => {
  const node = {
    [String(isAdd.value)]: 'SupplierPurchaseApplication:Add',
    [String(isEdit.value)]: 'SupplierPurchaseApplication:Edit'
  }.true

  const btns = [
    {
      label: '新增',
      icon: <Icon icon="ep:plus"></Icon>,
      onClick: handleAddItem,
      type: 'primary',
      permission: `${node}:Add`,
      page: isAdd.value || isEdit.value
    },
    {
      label: '批量新增',
      icon: <img class="mr4px" src={BatchAddIcon} alt="" />,
      onClick: handleBatchAdd,
      type: 'primary',
      permission: `${node}:BatchAdd`,
      page: isAdd.value || isEdit.value
    },
    {
      label: '导入',
      icon: <Icon icon="ep:upload"></Icon>,
      onClick: handleOpenUploadDialog,
      permission: `${node}:Import`,
      page: isAdd.value || isEdit.value
    }
  ]
  return btns
})

const AddFooterBtns = computed(() => {
  const node = {
    [String(isAdd.value)]: 'Add',
    [String(isEdit.value)]: 'Edit',
    [String(isAudit.value)]: 'Audit'
  }.true
  return [
    {
      label: '审核不通过',
      onClick: () => {
        auditDialogProps.isApprove = false
        auditDialogProps.modelvalue = true
      },
      type: 'danger',
      permission: 'SupplierPurchaseApplication:Audit:NoPass',
      page: isAudit.value
    },
    {
      label: '审核通过',
      onClick: () => {
        auditDialogProps.isApprove = true
        auditDialogProps.modelvalue = true
      },
      type: 'primary',
      permission: 'SupplierPurchaseApplication:Audit:Pass',
      page: isAudit.value
    },
    {
      label: '保存并提交',
      component: (
        <el-tooltip content="当前需求单未添加商品" disabled={tableData.value.length !== 0}>
          <el-button
            type="primary"
            disabled={tableData.value.length === 0 || saveLoading.value}
            loading={saveLoading.value && saveType.value === 1}
            onClick={() => handleSave(1)}
          >
            保存并提交
          </el-button>
        </el-tooltip>
      ),
      permission: `SupplierPurchaseApplication:${node}:Save&Submit`,
      page: isAdd.value || isEdit.value,
      loading: saveLoading.value
    },
    {
      label: '保存',
      onClick: () => handleSave(0),
      type: 'primary',
      permission: `SupplierPurchaseApplication:${node}:Save`,
      page: isAdd.value || isEdit.value,
      loading: saveLoading.value
    }
  ]
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
    requestQuantity: setResult('requestQuantity'),
    estimatePrice:
      Array.from(new Map(tableData.value.map((row) => [row.sku, row])).values()).reduce(
        (arr, cur) => arr + Math.round((cur.estimatePrice || 0) * (cur.requestQuantity || 0) * 100),
        0
      ) / 100
  }
})

const OPS_REPLENISHMENT_ADJUSTMENT_REASON = computed(() =>
  getDictOptions(DICT_TYPE.OPS_REPLENISHMENT_ADJUSTMENT_REASON)
)
const OPS_REPLENISHMENT_PRODUCT_TYPE = computed(() =>
  getDictOptions(DICT_TYPE.OPS_REPLENISHMENT_PRODUCT_TYPE)
)

const isEdit = computed(() => route.name === 'SupplierPurchaseApplicationEdit')
const isCheck = computed(() => route.name === 'SupplierPurchaseApplicationDetail')
const isAudit = computed(() => route.name === 'SupplierPurchaseApplicationAudit')
const isAdd = computed(() => route.name === 'SupplierPurchaseApplicationAdd')

const tableOption = computed(() => {
  const optionMap = new Map(
    (isCheck.value || isAudit.value ? detailTable : addTable).map((ele) => [ele.label, ele])
  )
  if (isCheck.value || isAudit.value) {
    optionMap.delete('操作')
  }

  // 审核列表增加库存信息列
  if (isAudit.value || isCheck.value) {
    optionMap.set('货品名称', {
      ...optionMap.get('货品名称'),
      showOverFlowTooltip: false
    })
    COLUMN_1.filter((item) => !!item.prop)
      .sort((a, b) => inTableSort[a.prop!] - inTableSort[b.prop!])
      .forEach((item) => {
        optionMap.set(item.label, item)
      })
  }

  if (isAdd.value || isAudit.value) {
    optionMap.delete('库存')
    optionMap.delete('7天周转')
  }
  return Array.from(optionMap.values())
})

const nameRule = computed<FormRules>(() => ({
  adjustmentTypeCode: { required: true, message: '请选择调整原因' },
  salesChannelCode: { required: true, message: '请选择售卖渠道' },
  productTypeCode: { required: true, message: '请选择产品类型' }
}))

watch(
  tableData,
  (data) => {
    formData.value.detail = data
      ?.filter((ele) => ele.sku)
      ?.map((ele) => {
        return { ...ele, goodsCode: ele.goodsCode || ele.goodsNo }
      })
  },
  {
    deep: true
  }
)

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
          tableRef.value?.clearValidate([key], index, [0])
        })
      } else {
        nextTick(() => {
          tableRef.value?.clearValidate([key], index, [0])
        })
      }
    })
  })
}

async function handleChangeSku(selectItem: any, index: number) {
  try {
    Object.assign(tableData.value?.[index] || {}, selectItem, {
      goodsCode: selectItem.goodsNo
    })
  } catch (error) {}
}

async function handleBack() {
  const res =
    isAudit.value ||
    isCheck.value ||
    deepEqual(oldFormData.value, {
      ...formData.value,
      detail: tableData.value
    })

  if (!res) {
    await message.confirm('确定要离开当前页面吗？离开后当前未保存数据会丢失')
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierPurchaseApplication' })
  } else {
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierPurchaseApplication' })
  }
}

async function handleSave(type: 0 | 1) {
  await Promise.all([
    queryFormRef.value?.validate(),
    tableRef.value?.validateFileds(undefined, undefined, [0])
  ])

  if (tableData.value.every((item) => !item.requestQuantity))
    return message.error('当前需求单没有设置申请量')

  saveLoading.value = true
  saveType.value = type
  try {
    formData.value.isAutoSub = type
    if (isEdit.value) formData.value.id = route.params.id as string

    const api = isEdit.value ? updateOpsReplenishmentRequestApi : addOpsReplenishmentRequestApi

    const res = await api(formData.value)
    if (res.success) {
      message.success(type === 0 ? '保存成功' : '保存并提交成功！')
      tagsViewStore.closeCurrent()
      router.push({ name: 'SupplierPurchaseApplication' })
    }
  } catch (error) {
  } finally {
    saveLoading.value = false
  }
}

function handleBatchAdd() {
  batchAddDialogRef.value?.open()
}

function handleBatchAddItem(rows: typeof tableData.value) {
  tableData.value.unshift(...rows)
  tableData.value = Array.from(
    new Map(
      tableData.value.map((row) => [row.sku, { ...row, goodsCode: row.goodsNo || row.goodsCode }])
    ).values()
  )
}

const orderHandlerId = ref<string>('')
async function getDetail() {
  loading.value = true
  const api = {
    [String(isCheck.value && route.query.status !== '0')]: opsReplenishmentRequestQuerySnapshotById,
    [String(isAudit.value || isEdit.value || route.query.status === '0')]:
      opsReplenishmentRequestDetailApi
  }['true']
  try {
    const res = await api({ id: route.params.id as string, skuQuery: queryParams.sku })
    formData.value = Object.assign(res, {
      salesChannelCode: res.salesChannelCode || res.salesChannel,
      adjustmentTypeCode: String(res.adjustmentTypeCode || res.adjustmentType),
      productTypeCode: res.productTypeCode || res.productType
    })
    tableData.value = (res.detail || res.detailSnapshotVos || []).map((row) => {
      return {
        ...row
      }
    })
  } catch (error) {
  } finally {
    loading.value = false
    await nextTick()
    oldFormData.value = cloneDeep({
      ...formData.value,
      detail: tableData.value
    })
  }
}

async function handleCopy(key: string, index: number) {
  const date = tableData.value[index][key]
  await message.confirm(`确定将${date}应用到此后所有货品的期望到货时间吗？`)
  tableData.value.forEach((row, i) => {
    if (i >= index) {
      row[key] = date
    }
  })

  tableRef.value?.validateFileds([key], undefined, [0])
}

function handleOpenUploadDialog() {
  uploadDialogRef.value.open()
}

function handleAddItem() {
  tableData.value.unshift({})
}

function handleQuery() {
  if (Object.values(queryParams).every((value) => !value)) {
    return resetQuery()
  }
  const data = [
    ...(oldFormData.value.detail?.filter((ele) => {
      return Object.keys(queryParams).every((key) => queryParams[key].includes(ele[key]))
    }) || [])
  ]

  tableData.value = data.length === 0 ? [] : [...data]
}

function resetQuery() {
  formRef.value?.resetFields()
  const data = [...(oldFormData.value.detail || [])]
  tableData.value = data
}

async function handleChangeProductType() {
  tableData.value = []
}

function handleSuccess(rows: typeof tableData.value, type: 1 | 2 | 3) {
  if (type === 1) {
    rows.forEach((row) => {
      const index = tableData.value.findIndex((ele) => ele.sku === row.sku)
      if (index >= 0 && tableData.value[index]) {
        row.requestQuantity =
          Number(row.requestQuantity || 0) + Number(tableData.value[index].requestQuantity || 0)
      }
    })

    handleBatchAddItem(rows)
  } else if (type === 2) {
    tableData.value = [{ key: 'sumRow' }, ...rows]
  }
  tableData.value = tableData.value.filter((row, index) => {
    return tableData.value.findIndex((ele) => ele.sku === row.sku) === index
  })
}

async function handleAudit(params: any) {
  try {
    auditDialogProps.loading = true
    const res = await reviewOpsReplenishmentRequestApi(params)

    if (res.success) {
      message.success('审核成功！')
      handleBack()
    }
  } catch (error) {
  } finally {
    auditDialogProps.loading = false
    auditDialogProps.modelvalue = false
  }
}

function summaryMethod(param) {
  const noShowSummaryColumns = [
    'imgUrl',
    'goodsCode',
    'goodsName',
    'sku',
    'formName',
    'formCode',
    'estimatePrice',
    'expectedArrivalTime'
  ]

  const averageColumns = [
    'sevenTurnover',
    'turnoverDays',
    'fourteenTurnover',
    'thirtyTurnover',
    'turnoverDaysAfterRestocking'
  ]

  const { columns } = param
  const sums: (string | VNode)[] = []
  columns.forEach((column, index) => {
    if (index === 0) return (sums[index] = '合计')
    else if (noShowSummaryColumns.includes(column.rawColumnKey)) {
      return (sums[index] = '')
    } else {
      const values = tableData.value.reduce(
        (pre, cur) => pre + (Number(cur[column.rawColumnKey]) || 0),
        0
      )

      const result = averageColumns.includes(column.rawColumnKey)
        ? Math.floor(values / tableData.value.length)
        : Math.floor(values)
      return (sums[index] = <SwTextTooltip content={String(result)}>{result}</SwTextTooltip>)
    }
  })
  return sums
}

onBeforeMount(async () => {
  ;(isEdit.value || isCheck.value || isAudit.value) && (await getDetail())
})
</script>
<style lang="less" scoped>
@import url(../index.scss);

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

.title {
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

:deep(.el-table__cell) {
  padding: 4px 0;
}

:deep(.searchFormItemWidth) {
  width: 100%;
}
</style>
