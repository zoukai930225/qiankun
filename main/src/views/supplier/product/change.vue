<template>
  <special-card shadow="never" ref="cardRef">
    <div class="title"> 变更申请 </div>
    <el-divider />

    <el-form :model="formData" label-width="90" scroll-to-error :rules="rules">
      <el-row>
        <el-col v-if="!isAudit" :span="6">
          <el-form-item label="需求单名称">
            <el-input :model-value="formData.scPurchaseRequestOrderName" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="需求单号">
            <el-input :model-value="formData.scPurchaseRequestOrderNo" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="生产单号">
            <el-input :model-value="formData.scPurchaseOrderNo" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item ref="queryFormRef" prop="changeReason" label="变更原因">
            <s-text-area
              v-model="formData.changeReason"
              maxlength="200"
              :rows="5"
              :disabled="isAudit"
              placeholder="请输入变更原因"
              show-word-limit
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="附件" class="form-item-files">
        <files-upload v-model:modelValue="formData.url" :disabled="isAudit" :url="formData.url" />
      </el-form-item>
    </el-form>

    <div class="title">
      变更申请明细
      <component :is="easyBtnGroup(topBtns)" class="ml-auto" />
    </div>
    <el-divider />

    <sw-table
      ref="tableRef"
      :data="tableData"
      :options="tableOption ?? changeProductTable"
      :loading="loading"
      :min-height="620"
      :show-overflow-tooltop="true"
      :rules="rules"
      :btns-options="btnsOptions"
      v-model:filters="filters"
    >
      <template #changeGoodsQuantity="{ row }">
        <div v-if="!isAudit" class="changeGoodsQuantity">
          <el-input
            v-model.trim="row.changeGoodsQuantity"
            placeholder="请输入"
            clearable
            :maxlength="10"
            @input="(val) => handleInput(val, row)"
            @change="(val) => handleInput(val, row)"
          >
            <template #prepend>
              <el-select v-model="row.isReduce" placeholder="">
                <el-option :value="false" label="增加">增加</el-option>
                <el-option :value="true" label="减少">减少</el-option>
              </el-select>
            </template>
          </el-input>
        </div>
      </template>

      <template #sku="{ row, index, col }">
        <el-select
          v-if="!isAudit && !row.id"
          v-model="row.sku"
          filterable
          remote
          :id="`form_sku_${index}`"
          :remote-method="remoteMethod"
          placeholder="请输入"
          popper-class="scroll-select"
          @blur="handleBlur(index)"
          @change="(val) => handleChangeSku(val, index)"
          @popup-scroll="handleSkuSelectScroll"
        >
          <el-option v-for="item in skuOptions" :key="item.value" :value="item.value" />
        </el-select>
        <component v-else :is="() => copyBtn(row, undefined, col)" />
      </template>

      <template
        v-for="slotName in ['firstBatchTime', 'orderArrivalTime']"
        :key="slotName"
        #[slotName]="{ row, col }"
      >
        <el-date-picker
          v-if="!row.id"
          type="date"
          v-model="row[slotName]"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
          placeholder="请选择"
          clearable
        />
        <div v-else>{{ col }}</div>
      </template>
    </sw-table>

    <template #footer>
      <slot name="footer" :formData="formData" :tableData="tableData">
        <div class="flex justify-between w100% items-center font-size-14px">
          <div>
            <span class="mr-12px">
              增加<b class="ml-6px">{{ addNum }}</b>
            </span>
            <span class="mr-12px">
              减少<b class="ml-6px">{{ reduceNum }}</b>
            </span>
            <span class="mr-12px">
              合计<b class="ml-6px">{{ sum }}</b>
            </span>
          </div>
          <div class="flex">
            <el-button @click="handleBack">返回</el-button>
            <component :is="easyBtnGroup(footerBtns)" class="ml-12px" />
          </div>
        </div>
      </slot>
    </template>
  </special-card>
  <upload-dialog
    ref="uploadDialogRef"
    :scPurchaseRequestOrderId="scPurchaseRequestOrderId"
    @success="handleSuccess"
  />
  <remark-dialog ref="remarkDialogRef" v-model:model-value="formData.scPoRemarks!" />
</template>
<script lang="tsx" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import SwTable from '../components/table.vue'
import { changeProductTable } from './options'
import { getInfoBySku, getScPurchaseDetailApi, scPoChangeRequestApi } from '@/api/supplier/purchase'
import { FormInstance, FormRules } from 'element-plus'
import { useTagsView } from '@/hooks/web/useTagsView'
import { deepEqual } from '@/utils/common'
import { cloneDeep } from 'lodash-es'
import RemarkDialog from './components/remarkDialog.vue'
import FilesUpload from './components/changePageUpload.vue'
import { scPoChangeRequestDetailApi } from '@/api/supplier/changeAudit'
import specialCard from '../components/specialCard.vue'
import { AuditBtn } from '../changeAudit/option'
import { toReactive } from '@vueuse/core'
import { copyBtn, easyBtnGroup } from '../components/twoFourSix'
import { getPermission } from '@/utils'
const UploadDialog = defineAsyncComponent(() => import('./components/uploadDialog.vue'))
import { Icon } from '@/components/Icon'

defineOptions({ name: 'PurchaseProductOrderChange' })

defineProps<{
  tableOption?: TableOption
}>()

const router = useRouter()
const route = useRoute()
const message = useMessage()
const tagsViewStore = useTagsView()

const formData = ref<Supplier.Purchase.FormData>({
  scPurchaseRequestOrderNo: '',
  url: ''
})
const tableData = ref<Supplier.Purchase.FormItem[]>([])
const queryFormRef = ref<FormInstance>()
const rules: FormRules = reactive({
  supplier: [{ required: true, message: '请选择供应商' }],
  // orderArrivalTime: [{ required: true, message: '请选择' }],
  firstBatchTime: [{ required: false }],
  sku: [
    {
      required: true,
      validator: (_, value, callback) => {
        const skuList = tableData.value.filter((row) => row.sku === value)
        if (!value) return callback(new Error('请选择SKU编码'))
        if (skuList.length > 1) return callback(new Error('重复的SKU编码'))
        callback()
      }
    }
  ],
  changeGoodsQuantity: [],
  changeReason: { required: true, message: '请输入变更原因' }
})
const tableRef = ref()

const loading = ref(false)
const oldFormData = ref<typeof formData.value>({
  scPurchaseRequestOrderNo: ''
})
const supplierId = ref('')
const filters = ref({ sku: [], formName: [], formCode: [] })
const permissionSet = new Set(getPermission())

const topBtns = computed(() => {
  const btns = [
    {
      label: '新增',
      type: 'primary',
      icon: <Icon icon="ep:plus"></Icon>,
      onClick: handleAdd,
      page: isChange.value,
      permission: 'SupplierProduct:MyOrder:Change:Add'
    }
  ]

  return btns.filter((ele) => ele.page && permissionSet.has(ele.permission))
})

const footerBtns = computed(() => {
  const btns = [
    {
      label: '提交',
      type: 'primary',
      onClick: handleSave,
      page: isChange.value,
      permission: 'SupplierProduct:MyOrder:Change:Submit',
      loading: saveLoading.value
    }
  ]

  return btns.filter((ele) => ele.page && permissionSet.has(ele.permission))
})

/**计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(({ id }) =>
    toReactive(id ? [] : [new AuditBtn('删除', handleDeleteRow, { type: 'danger' })])
  )
)

const scPurchaseRequestOrderId = computed(
  () => (route.query?.purchaseId as string) || formData.value.scPurchaseRequestOrderId
)

const isAudit = computed(() => route.name === 'PurchaseProductOrderChangeAudit')
const isChange = computed(() => route.name === 'PurchaseProductOrderChange')

const addNum = computed(() =>
  new Intl.NumberFormat().format(
    tableData.value.reduce(
      (arr, cur) => arr + (!cur.isReduce ? cur.changeGoodsQuantity ?? 0 : 0),
      0
    ) || 0
  )
)
const reduceNum = computed(() =>
  new Intl.NumberFormat().format(
    tableData.value.reduce(
      (arr, cur) => arr + (cur.isReduce ? cur.changeGoodsQuantity ?? 0 : 0),
      0
    ) || 0
  )
)
const sum = computed(() => {
  const number = tableData.value.reduce(
    (arr, cur) =>
      cur.isReduce ? arr - (cur.changeGoodsQuantity ?? 0) : arr + (cur.changeGoodsQuantity ?? 0),
    0
  )

  if (!number) {
    return 0
  } else {
    return `${number > 0 ? '增加' : '减少'} ${new Intl.NumberFormat().format(Math.abs(number))}`
  }
})

const pageOption = computed(() => {
  const api = isAudit.value ? scPoChangeRequestDetailApi : getScPurchaseDetailApi
  const params = isAudit.value ? route.params.id : { scPurchaseOrderId: route.params.id }
  return { api, params }
})

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

const saveLoading = ref(false)
async function handleSave() {
  const [_, allReady] = await Promise.all([
    queryFormRef.value?.validate(),
    tableRef.value?.validateFileds()
  ])
  if (allReady !== true) return

  if (tableData.value.every((row) => !row.changeGoodsQuantity))
    return message.error('当前变更单没有变更数量')

  try {
    saveLoading.value = true
    if (route.params.id) formData.value.id = route.params.id as string
    const params = {
      ...formData.value,
      scPurchaseOrderId: route.params.id as string,
      changeRequestDetails: tableData.value.map((row) => ({
        ...row,
        scPurchaseRequestOrderDetailId: row.id,
        changeGoodsQuantity: row.isReduce
          ? '-' + row.changeGoodsQuantity
          : row.changeGoodsQuantity ?? 0
      }))
    }
    const res = await scPoChangeRequestApi(params)
    if (res.success) {
      message.success('变更成功')
      tagsViewStore.closeCurrent()
      router.push({ name: 'SupplierProductIndex', query: { tab: route.query.tab } })
    }
  } catch (error) {
  } finally {
    saveLoading.value = false
  }
}

async function getDetail() {
  loading.value = true
  try {
    const res = await pageOption.value.api(pageOption.value.params as any)
    const { scPurchaseOrderDetailList: tableTempt, changeRequestDetails } = res
    renderTableMethod(tableTempt ?? changeRequestDetails)
    formData.value = res
    supplierId.value = res.supplierList?.[0].supplierId
    orderHandlerId.value = res.orderHandlerId
  } catch (error) {
    console.error('获取订单详情失败', error)
  } finally {
    loading.value = false
    nextTick(() => {
      oldFormData.value = cloneDeep(formData.value)
    })
  }
}

function renderTableMethod(tableTempt) {
  if (!tableTempt) return (tableData.value = [])
  const skuMap = new Map()
  tableTempt.forEach((row) => {
    if (!skuMap.has(row.sku)) {
      skuMap.set(row.sku, [])
    }
    skuMap.get(row.sku)!.push(row)
  })

  isAudit.value ||
    skuMap.forEach((rows) => {
      rows.forEach((row) => {
        row.scPurchaseOrderDetailId = row.id
      })
    })

  tableData.value = tableTempt.flatMap(
    (row) =>
      row.supplierList?.map((supplier) => ({
        ...row,
        supplier: supplier.supplierId,
        supplierName: supplier.supplierName,
        isReduce: false
      })) || row
  )
  rules.purchasedGoodsQuantity = [
    {
      required: true,
      validator: (_, __, callback) => {
        callback()
      },
      trigger: 'blur'
    }
  ]
}

const skuOptions = ref<{ value: any; label: string }[]>([])
const selectSku = ref('')
const selectPage = ref(1)
const selectSize = ref(10)
const selectTotal = ref(0)
const orderHandlerId = ref<string>('')
async function remoteMethod(sku: string = '') {
  selectSku.value = sku
  selectPage.value = 1
  selectSize.value = 10
  try {
    const res = await getInfoBySku({
      sku,
      pageNum: selectPage.value,
      pageSize: selectSize.value,
      userId: orderHandlerId.value,
      supplierId: supplierId.value
    })
    skuOptions.value = res.records.map((item) => ({
      label: item.sku || '',
      value: item.sku || ''
    }))
    skuOptions.value = Array.from(
      new Map(skuOptions.value.map((item) => [item.value, item])).values()
    )
    selectTotal.value = res.total
  } catch (error) {
    skuOptions.value = []
  }
}

async function handleBlur(index: number) {
  await tableRef.value?.validateFileds(['sku'], index)

  skuOptions.value = []
  selectPage.value = 1
  selectSize.value = 10
}

async function handleChangeSku(val: string, index: number) {
  try {
    const res = await getInfoBySku({
      sku: val,
      pageNum: 1,
      pageSize: 1,
      userId: orderHandlerId.value,
      supplierId: supplierId.value
    })

    const fieldMappings = [
      { tableField: 'goodsCode', apiField: 'goodsNo' },
      { tableField: 'goodsName', apiField: 'goodsName' },
      { tableField: 'formName', apiField: 'specName' },
      { tableField: 'formCode', apiField: 'specCode' },
      { tableField: 'iterateCode', apiField: 'iterateCode' },
      { tableField: 'imgUrl', apiField: 'imgUrl' }
    ]

    fieldMappings.forEach(({ tableField, apiField }) => {
      tableData.value[index][tableField] = res.records[0][apiField]
    })

    tableData.value[index].supplier = supplierId.value
    tableData.value[index].orderHandlerId = orderHandlerId.value
    tableData.value[index].index = ''
  } catch (error) {}
}

async function handleSkuSelectScroll(val: { scrollTop: number }) {
  if (val.scrollTop % 340 === 78 && selectTotal.value > skuOptions.value.length) {
    ++selectPage.value
    try {
      const res = await getInfoBySku({
        sku: selectSku.value,
        pageNum: selectPage.value,
        pageSize: selectSize.value,
        userId: orderHandlerId.value,
        supplierId: supplierId.value
      })
      if (res.total === skuOptions.value.length) return
      selectTotal.value = res.total

      skuOptions.value.push(
        ...res.records.map((item) => ({
          label: item.sku || '',
          value: item.sku || ''
        }))
      )
      skuOptions.value = Array.from(
        new Map(skuOptions.value.map((item) => [item.value, item])).values()
      )
    } catch (error) {
      skuOptions.value = []
    }
  }
}

function handleSuccess(rows: typeof tableData.value) {
  renderTableMethod(rows)
}

function handleDeleteRow(_, index: number) {
  tableData.value.splice(index, 1)
}

async function handleAdd() {
  tableData.value.unshift({
    isReduce: false
  })
}

function handleInput(val: string, row: any) {
  let value: string
  value = val.replace(/\s+/g, '')
  value = value.replace(/[^\d]/g, '').replace(/^0+/, '') || ''
  row.changeGoodsQuantity = Number(value)
}

defineExpose({ getDetail })

onBeforeMount(async () => {
  await getDetail()
})

onActivated(async () => {
  await getDetail()
})

const footerWidth = ref(0)
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-table) {
  .el-input {
    --el-input-width: 150px;
    --el-date-editor-width: 150px;
  }
}

:deep(.el-input-group__prepend) {
  min-width: 80px !important;
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
}

.flex1 {
  flex: 1;
}

:deep(.el-divider) {
  width: calc(100% + 40px);
  margin: 20px -20px;

  &.mt-12px {
    margin-top: 12px;
  }
}

.form-item-files {
  :deep(.el-form-item__content) > div {
    flex: 0;
  }

  :deep(.el-form-item__content) {
    flex-direction: column;
    justify-content: flex-start;
    align-items: start;
  }
}

.changeGoodsQuantity {
  width: 100%;
  display: flex;

  :deep(.el-button) {
    div {
      width: 14px;
    }
  }
}

.fixed {
  width: calc(100% - 310px);
  background-color: #fff;
  box-shadow: 0 0px 20px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
  right: 20px;
  z-index: 999;
}

b {
  font-weight: bold;
}
</style>
