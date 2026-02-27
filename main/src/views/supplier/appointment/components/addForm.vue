<template>
  <div class="title">
    发货预约单信息
    <slot name="gotoAuditLogBtn"></slot>
  </div>
  <el-divider />
  <el-form
    ref="formRef"
    :model="queryParams"
    :label-width="110"
    :rules="rules"
    :validate-on-rule-change="false"
    scroll-to-error
  >
    <el-row :gutter="24">
      <el-col v-if="userInfo.user.supplierFlag !== 1" :span="6">
        <el-form-item prop="supplierId" label="供应商:">
          <el-input v-if="!!route.query.supplierId" v-model="queryParams.supplierName" disabled />
          <el-select-v2
            v-else
            v-model="queryParams.supplierId"
            :options="supplierAppointment.supplierIdOptions"
            filterable
            :disabled="!!route.params.id"
            placeholder="请选择供应商"
            @update:model-value="emit('update:form-data', queryParams)"
            @change="getPoList(), (queryParams.scPurchaseOrderId = undefined)"
          />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label="预约方式" prop="appointmentType">
          <el-select
            v-model="queryParams.appointmentType"
            :disabled="isEdit || isCheck"
            @change="handleChangeAppointmentType"
          >
            <el-option
              v-for="item in getDictOptions(DICT_TYPE.SC_ASR_APPOINTMENT_TYPE)"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="6" v-if="formData.appointmentType !== '1'">
        <el-form-item prop="scPurchaseOrderId" label="采购生产单号:">
          <el-tooltip content="请先选择供应商" :disabled="!!queryParams.supplierId">
            <el-select-v2
              v-model="scPurchaseOrderId"
              :options="PoList"
              filterable
              :disabled="isCheck || !queryParams.supplierId || formData.appointmentType === '1'"
              placeholder="请选择生产单"
              multiple
              collapse-tags
              collapse-tags-tooltip
              clearable
            />
          </el-tooltip>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item prop="receivingWarehouse" label="收货仓库:">
          <el-select
            v-model="queryParams.receivingWarehouse"
            filterable
            clearable
            :disabled="isCheck"
            @change="handleChangeReceivingWarehouse"
          >
            <el-option
              v-for="item in supplierAppointment.receivingWarehouseOps"
              :key="item.label"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="appointmentDate" label="预约日期:" class="appointmentDate">
          <el-tooltip :disabled="!!queryParams.receivingWarehouse" content="请先选择收货仓库">
            <DatePicker
              placeholder="请选择预约日期"
              v-model:model-value="queryParams.appointmentDate"
              :receivingWarehouse="queryParams.receivingWarehouse"
              :disabled="isCheck || !queryParams.receivingWarehouse"
            />
          </el-tooltip>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item label="联系人:">
          <el-input :model-value="queryParams.receivingWarehouseVo?.contacts" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="联系电话:">
          <el-input :model-value="queryParams.receivingWarehouseVo?.contactNumber" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="跟单人:">
          <el-select v-model="orderHandler" remote filterable disabled multiple>
            <el-option
              v-for="item in queryParams.orderHandler"
              :key="item.userId"
              :value="item.userId || ''"
              :label="item?.name"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="仓库地址:">
          <el-input :model-value="queryParams.receivingWarehouseVo?.address" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注:" prop="asrRemarks">
          <s-text-area
            v-model="queryParams.asrRemarks"
            placeholder="请输入备注"
            :disabled="isCheck"
            :rows="4"
            :maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件:" prop="fileUrl">
          <files-upload
            :disabled="isCheck"
            v-model:modelValue="queryParams.fileUrl"
            :url="formData.fileUrl"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import {
  getPurchaseOrderListApi,
  getScWarehousePageApi,
  scAdvancedShippingRequestOrderCheckPriceApi
} from '@/api/supplier/appoint'
import { FormInstance, FormItemRule, FormRules } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import DatePicker from '@/views/supplier/components/calendar.vue'
import { useSupplierAppointment } from '@/store/modules/supplier'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
import FilesUpload from '@/views/supplier/product/components/changePageUpload.vue'

const props = defineProps<{
  formData: Supplier.Product.UpdateParams
}>()

const userInfo = useUserStore()
const route = useRoute()
const supplierAppointment = useSupplierAppointment()

const emit = defineEmits(['update:form-data', 'changePo', 'changeType'])

const formRef = ref<FormInstance>()
const rules = ref<FormRules>()
const queryParams = ref<typeof props.formData>({})
const PoList = ref<{ label: string; value: string }[]>([])

const orderHandler = computed({
  get: () => queryParams.value.orderHandlerId?.split(',') || [],
  set: (val) => (queryParams.value.orderHandlerId = val.join(','))
})

const isCheck = computed(() => /check/.test(route.fullPath))
const isEdit = computed(() => /edit/.test(route.fullPath))

const scPurchaseOrderId = computed({
  get: () => queryParams.value.scPurchaseOrderId?.split(',') || undefined,
  set: (val) => {
    queryParams.value.scPurchaseOrderId = val?.join(',') || undefined
    if (val) {
      emit('changePo', val?.join(',') || '')
    }
  }
})

watch(
  () => props.formData,
  async (val) => {
    queryParams.value = val
  },
  { immediate: true }
)

watch(
  () => props.formData,
  async (val) => {
    await nextTick()
    rules.value = {
      receivingWarehouse: [{ required: true, message: '请选择收货仓库' }],
      appointmentDate: [{ required: true, message: '请选择预约日期' }],
      supplierId: [{ required: true, message: '请选择供应商' }],
      appointmentType: { required: true, message: '请选择预约发货方式' },
      scPurchaseOrderId: { required: val.appointmentType === '2', message: '请选择生产单号' }
    }
  },
  { once: true, immediate: true }
)

watch(
  () => queryParams.value,
  (val) => {
    emit('update:form-data', val)
  },
  { deep: true }
)

// 校验价格
const splitIds = (ids?: string): string[] => {
  if (!ids) return []
  return ids.split(',').filter(Boolean)
}
const areIdArraysEqual = (newIds: string[], oldIds: string[]): boolean => {
  return newIds.length === oldIds.length && newIds.every((id) => oldIds.includes(id))
}

watch(
  () => [queryParams.value.scPurchaseOrderId, queryParams.value.receivingWarehouse],
  async (
    [scPurchaseOrderId, receivingWarehouse],
    [oldScPurchaseOrderId, oldReceivingWarehouse]
  ) => {
    if (!scPurchaseOrderId || !receivingWarehouse || isCheck.value) return

    const newIds = splitIds(scPurchaseOrderId)
    const oldIds = splitIds(oldScPurchaseOrderId)

    const isSameIds = areIdArraysEqual(newIds, oldIds)
    const isSameWarehouse = receivingWarehouse === oldReceivingWarehouse

    if (isSameIds && isSameWarehouse) return

    try {
      await scAdvancedShippingRequestOrderCheckPriceApi({
        scPurchaseOrderId,
        receivingWarehouse
      })
    } catch (error) {
      console.error('检查价格失败:', error)
    }
  }
)

watch(
  () => queryParams.value.scPurchaseOrderId,
  (val) => {
    if (isCheck.value) {
      const ids = val?.split(',')
      PoList.value =
        queryParams.value.scPurchaseOrderNo?.split(',').map((item, i) => ({
          value: ids?.[i] ?? '',
          label: item
        })) || []
    }
  }
)

async function handleChangeReceivingWarehouse(val: string) {
  if (!val) return
  try {
    const res = await getScWarehousePageApi({
      id: val
    })

    queryParams.value.receivingWarehouseVo = res
  } catch (error) {
  } finally {
    queryParams.value.appointmentDate = ''
  }
}

async function validate() {
  return await formRef.value?.validate()
}

async function getgetSupplierList() {
  if (!route.query.supplierId) {
    supplierAppointment.getSupplierIdOptions()
  }
}
async function getPoList() {
  if (!queryParams.value.supplierId) return
  try {
    PoList.value = []
    scPurchaseOrderId.value = []
    const res = await getPurchaseOrderListApi(queryParams.value.supplierId)
    PoList.value = res.map((ele) => ({
      value: ele.id,
      label: ele.scPurchaseOrderNo
    }))
  } catch (error) {}
}

async function handleChangeAppointmentType(val) {
  const scPurchaseOrderId: FormItemRule = {
    required: val === '2',
    validator: (_, value, callback) => {
      switch (true) {
        case val === '2' && !value:
          return callback(new Error('请选择生产单号'))
        default:
          callback()
      }
    }
  }
  if (rules.value) rules.value.scPurchaseOrderId = scPurchaseOrderId
  else {
    rules.value = {
      receivingWarehouse: [{ required: true, message: '请选择收货仓库' }],
      appointmentDate: [{ required: true, message: '请选择预约日期' }],
      supplierId: [{ required: true, message: '请选择供应商' }],
      appointmentType: { required: true, message: '请选择预约发货方式' },
      scPurchaseOrderId
    }
  }

  formRef.value?.clearValidate('scPurchaseOrderId')

  emit('changeType')
}

defineExpose({ validate })

onBeforeMount(async () => {
  supplierAppointment.getReceivingWarehouseOps()
  queryParams.value.supplierId =
    (route.query.supplierId as string) ??
    (userInfo.user.supplierFlag === 1 ? userInfo.user.departmentId : undefined)

  Promise.all([getgetSupplierList(), isCheck.value || getPoList()])
})
</script>
<style lang="less" scoped>
:deep(.el-input) {
  flex: 1;
}

.appointmentDate {
  :deep(.el-tooltip__trigger) {
    flex: 1;
  }
}

:deep(.el-form-item) {
  align-items: center;
}

:deep(.el-form-item__label) {
  align-items: center;
  line-height: 1.1;
}
</style>
