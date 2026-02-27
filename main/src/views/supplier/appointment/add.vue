<template>
  <SpecialCard shadow="never" v-loading="loading">
    <add-form
      ref="queryFormRef"
      v-model:form-data="formData"
      @change-po="handleChangePo"
      @change-type="handleChangeAppointmentType"
    >
      <template #gotoAuditLogBtn>
        <!-- 查看审核记录 -->
        <div class="auditLog" v-if="isHaveAuditLog">
          <component :is="easyBtnGroup(topBtns)" />
        </div>
      </template>
    </add-form>
    <add-table
      ref="addTableRef"
      :data="tableData"
      :loading="loading"
      :supplierId="formData.supplierId"
      v-model:po-ids="formData.scPurchaseOrderId"
      v-model:selectedSkus="formData.selectedSkus"
      :is-import="!!importRecordId"
      :appointmentType="formData.appointmentType"
      @open-upload-dialog="uploadDialogRef?.open()"
      @update:data="handleUpdateData"
    />

    <template #footer>
      <el-button @click="handleBack">返回</el-button>
      <component :is="easyBtnGroup(footerBtns)" />
    </template>
  </SpecialCard>

  <!-- 审核记录 -->
  <auditLogDrawer
    ref="auditLogDrawerRef"
    time-key="auditTime"
    status-key="auditType"
    person-key="auditUserName"
    comment-key="auditComment"
    descKey="auditTypeTxt"
    :is-no-pass="(status) => status === 3"
    :is-pass="(status) => status === 2"
    :is-recall="(status) => status === 4"
    :is-submit="(status) => status === 1"
  />

  <!-- 导入 -->
  <upload-dialog
    ref="uploadDialogRef"
    :poId="formData.scPurchaseOrderId || ''"
    @success="handleUploadSuccess"
  />
</template>
<script lang="tsx" setup>
import { useTagsView } from '@/hooks/web/useTagsView'
import { deepEqual } from '@/utils/common'
import AddTable from './components/addTable.vue'
import AddForm from './components/addForm.vue'
import {
  saveOrUpdateApi,
  scAdvancedShippingRequestOrderGetPoDetailApi,
  submitScAdvancedShippingRequestOrderApi
} from '@/api/supplier/appoint'
import { cloneDeep } from 'lodash-es'
import { useUserStore } from '@/store/modules/user'
import auditLogDrawer from './components/auditLogDrawer.vue'
import { getAdvancedShippingRequestOrderById } from '@/api/supplier/appointAudit'
import SpecialCard from '../components/specialCard.vue'
import { easyBtnGroup, fullPageLoading } from '../components/twoFourSix'
const UploadDialog = defineAsyncComponent(() => import('./components/uploadDialog.vue'))

defineOptions({ name: 'PurchaseAppointmentOrderAdd' })

const router = useRouter()
const route = useRoute()
const message = useMessage()
const tagsViewStore = useTagsView()
const userInfo = useUserStore()
const previewDialogRef = ref()
const formData = ref<Supplier.Product.UpdateParams>({})
const tableData = ref<Supplier.Appoint.ScAdvancedShippingRequestOrderDetail[]>([])
const queryFormRef = ref<InstanceType<typeof AddForm>>()
const loading = ref(false)
const oldFormData = ref<typeof formData.value>({})
const addTableRef = ref()
const stockType = ref<string>('')
const uploadDialogRef = ref<{ open: () => void }>()
const importRecordId = ref<string>()

const isCheck = computed(() => route.name === 'PurchaseAppointmentOrderCheck')
const isAdd = computed(() => route.name === 'PurchaseAppointmentOrderAdd')
const isEdit = computed(() => route.name === 'PurchaseAppointmentOrderEdit')

const topBtns = computed(() => {
  const node = {
    [String(isAdd.value)]: 'Add',
    [String(isCheck.value)]: 'Check',
    [String(isEdit.value)]: 'Edit'
  }['true']

  return [
    {
      label: '查看审核记录',
      type: 'primary',
      onClick: gotoAuditLog,
      page: isCheck.value,
      permission: `SupplierAppointmentIndex:Appoint:${node}:AuditLog`
    }
  ]
})

const footerBtns = computed(() => {
  const node = {
    [String(isAdd.value)]: 'Add',
    [String(isCheck.value)]: 'Check',
    [String(isEdit.value)]: 'Edit'
  }['true']

  const btns = [
    {
      label: '保存并提交',
      type: 'primary',
      onClick: () => handleClickSave(handleSaveAndSubmit),
      permission: `SupplierAppointmentIndex:Appoint:${node}:Save&Submit`,
      page: isAdd.value || isEdit.value
    },
    {
      label: '保存',
      type: 'primary',
      onClick: () => handleClickSave(handleSave),
      permission: `SupplierAppointmentIndex:Appoint:${node}:Save`,
      page: isAdd.value || isEdit.value
    }
  ]

  return btns
})

watch(
  () => formData.value.receivingWarehouseVo,
  (val) => {
    if (isCheck.value) return
    const type = val?.stockType
    tableData.value.forEach(
      (row) => (row.supplierGoodsPrice = row[type === '1' ? 'fgCost' : 'baseProdCost'])
    )
    stockType.value = type
  }
)

const isHaveAuditLog = ref(false)

async function handleBack() {
  const res = !deepEqual(oldFormData.value, {
    ...formData.value
  })

  if (res) {
    await message.confirm('确定要离开当前页面吗？离开后当前未保存数据会丢失')
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierAppointmentIndex', query: { tab: route.query.tab } })
  } else {
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierAppointmentIndex', query: { tab: route.query.tab } })
  }
}

async function handleClickSave(api) {
  try {
    if (
      tableData.value.every(
        (item) => item.deliveryGoodsQuantity === 0 || !item.deliveryGoodsQuantity
      )
    )
      return message.error('当前预约发货单没有发货数量')
    await Promise.all([queryFormRef.value?.validate(), addTableRef.value?.validateAll()])

    api()
  } catch (error) {
    console.log(error)
  }
}

async function handleSaveAndSubmit() {
  const saveLoading = fullPageLoading('数据保存中...')
  try {
    const params = cloneDeep({
      ...formData.value,
      scAdvancedShippingRequestOrderDetailList: addTableRef.value
        ?.filterData()
        .filter((row) => row.key !== 'sumRow')
        .map((row) => {
          row.deliveryGoodsQuantity = row.deliveryGoodsQuantity ?? 0
          return row
        }),
      importRecordId: importRecordId.value
    })
    delete params.orderHandler
    const saveRes = await saveOrUpdateApi(params)
    if (!saveRes.data.id) return

    const submitRes = await submitScAdvancedShippingRequestOrderApi(saveRes.data.id)
    if (!submitRes.success) return

    message.success('保存并提交成功')
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierAppointmentIndex' })
  } catch (error: any) {
    await getDetail()
    tableData.value.forEach((row) => {
      row.checkStatus = error.data?.scAdvancedShippingRequestOrderDetailList.find(
        (ele) => ele.id === row.id
      ).checkStatus
    })
  } finally {
    previewDialogRef.value?.handleClosed()
    saveLoading.close()
  }
}

async function handleSave() {
  const saveLoading = fullPageLoading('数据保存中...')
  try {
    const params = cloneDeep({
      ...formData.value,
      scAdvancedShippingRequestOrderDetailList: addTableRef.value
        ?.filterData()
        .filter((row) => row.key !== 'sumRow')
        .map((row) => {
          row.deliveryGoodsQuantity = row.deliveryGoodsQuantity ?? 0
          return row
        }),
      importRecordId: importRecordId.value
    })
    delete params.orderHandler
    const res = await saveOrUpdateApi(params)
    if (res.success) {
      message.success('保存成功')
      tagsViewStore.closeCurrent()
      router.push({ name: 'SupplierAppointmentIndex' })
    }
  } catch (error: any) {
    await getDetail()
    tableData.value.forEach((row) => {
      row.checkStatus = error.data.scAdvancedShippingRequestOrderDetailList.find(
        (ele) => ele.id === row.id
      ).checkStatus
    })
  } finally {
    previewDialogRef.value?.handleClosed()
    saveLoading.close()
  }
}

async function getDetail() {
  loading.value = true
  try {
    let res: any
    if (isCheck.value) {
      res = await getAdvancedShippingRequestOrderById(route.params.id)
    } else {
      const params: any = {
        ...formData.value,
        scPurchaseOrderId: formData.value.scPurchaseOrderId || (route.query.PoId as string) || '',
        advancedShippingRequestOrderId: (route.params.id as string) || '',
        supplierId: formData.value.supplierId,
        importRecordId: importRecordId.value,
        selectedSkus: formData.value.selectedSkus || route.query.selectedSkus,
        key: 'sumRow'
      }
      res = await scAdvancedShippingRequestOrderGetPoDetailApi(params)
    }
    if (res) transformForm(res)
  } catch (error) {
    importRecordId.value = ''
  } finally {
    oldFormData.value = cloneDeep(formData.value)
    loading.value = false
  }
}

async function handleChangePo(val: string) {
  if (!val) return (tableData.value = []), (formData.value.orderHandlerId = undefined)
  loading.value = true
  try {
    addTableRef.value.clearAll()
    const res = await scAdvancedShippingRequestOrderGetPoDetailApi({
      scPurchaseOrderId: val,
      advancedShippingRequestOrderId: (route.params.id as string) || '',
      supplierId: formData.value.supplierId!,
      appointmentType: formData.value.appointmentType
    })
    const type = formData.value.appointmentType
    if (res) transformForm(res)
    formData.value.appointmentType = type
  } catch (error) {
  } finally {
    oldFormData.value = cloneDeep(formData.value)
    loading.value = false
  }
}

function transformForm(res: Supplier.Product.UpdateParams) {
  formData.value = {
    ...formData.value,
    ...Object.fromEntries(Object.entries(res).filter(([_, value]) => value)),
    orderHandlerId: res.orderHandlerId
  }

  tableData.value = (res.scAdvancedShippingRequestOrderDetailList || []).map((row) => ({
    ...row,
    originalRemainingDeliveryQuantity:
      row.remainingDeliveryQuantity +
      (/edit/.test(route.fullPath) ? row.deliveryGoodsQuantity ?? 0 : 0),
    supplierGoodsPrice: isCheck.value
      ? row.supplierGoodsPrice
      : row[stockType.value === '1' ? 'fgCost' : stockType.value === '2' ? 'baseProdCost' : '']
  }))
  isHaveAuditLog.value = res.auditLogFlag === 1
}

// 查看审核记录
const auditLogDrawerRef = ref()
const gotoAuditLog = () => {
  auditLogDrawerRef.value?.open(route.params.id)
}

function handleUploadSuccess({ id }: any) {
  importRecordId.value = id
  getDetail()
}

function handleChangeAppointmentType() {
  tableData.value = []
  formData.value.scPurchaseOrderId = undefined
}

function handleUpdateData() {
  getDetail()
}

defineExpose({ getDetail })

onBeforeMount(async () => {
  formData.value.supplierId =
    (route.query.supplierId as string) ??
    (userInfo.user.supplierFlag === 1 ? userInfo.user.departmentId : undefined)

  formData.value.appointmentType =
    /* (route.query.appointmentType as string)
    ? (route.query.appointmentType as string)
    : (route.query.PoId as string)
      ? '2'
      : '1' */ '2'
  ;(route.params.id || route.query.PoId) && (await getDetail())
})
</script>
<style lang="less" scoped>
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

:deep(.cell) {
  // display: flex;
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

.auditLog {
  margin-left: auto;
}

:deep(.el-select__selection) {
  flex-wrap: nowrap;
}
</style>
