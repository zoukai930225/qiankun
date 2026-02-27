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
  >
    <el-row :gutter="24">
      <el-col :span="6">
        <el-form-item prop="scPurchaseOrderNo" label="采购生产订单:">
          <el-input :model-value="queryParams.scPurchaseOrderNo" disabled />
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item prop="receivingWarehouse" label="收货仓库:">
          <el-select
            v-model="queryParams.receivingWarehouse"
            filterable
            clearable
            @change="handleChangeReceivingWarehouse"
            disabled
            placeholder=""
          >
            <el-option
              v-for="item in receivingWarehouseOps!"
              :key="item.label"
              :value="item.value"
              :label="item.label"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="appointmentDate" label="预约日期:">
          <el-date-picker
            v-model="queryParams.appointmentDate"
            placeholder=""
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            disabled
          />
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
      <el-col :span="24">
        <el-form-item label="仓库地址:">
          <el-input :model-value="queryParams.receivingWarehouseVo?.address" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="备注:" prop="asrRemarks">
          <s-text-area v-model="queryParams.asrRemarks" placeholder="--" :rows="4" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="附件:" prop="asrRemarks">
          <files-upload disabled v-model:modelValue="queryParams.fileUrl" :url="formData.fileUrl" />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { getScWarehouseApi, getScWarehousePageApi } from '@/api/supplier/appoint'
import { FormInstance, FormRules } from 'element-plus'
import FilesUpload from '@/views/supplier/product/components/changePageUpload.vue'

const props = defineProps<{
  formData: Supplier.Product.UpdateParams
}>()

const emit = defineEmits(['update:form-data'])

const formRef = ref<FormInstance>()
const rules = ref<FormRules>()

const queryParams = ref<typeof props.formData>({})
const receivingWarehouseOps = ref<any[]>([])

const orderHandler = computed({
  get: () => queryParams.value.orderHandlerId?.split(',') || [],
  set: (val) => (queryParams.value.orderHandlerId = val.join(','))
})

watch(
  () => props.formData,
  async (val) => {
    queryParams.value = val
    await nextTick()
    rules.value = {
      scPurchaseOrderId: [{ required: true, message: '请选择采购生产订单' }],
      receivingWarehouse: [{ required: true, message: '请选择收货仓库' }],
      appointmentDate: [{ required: true, message: '请选择预约日期' }]
    }
  },
  { once: true }
)

watch(queryParams, (val) => emit('update:form-data', val))

/** 获取仓库列表 */
async function getReceivingWarehouseOps() {
  try {
    const res = await getScWarehouseApi()
    if (res) {
      receivingWarehouseOps.value = res.map((item: Supplier.Product.ReceivingWarehouseVo) => ({
        label: item.name,
        value: item.id
      }))
    }
  } catch (error) {}
}

async function handleChangeReceivingWarehouse(val: string) {
  try {
    const res = await getScWarehousePageApi({
      id: val
    })

    queryParams.value.receivingWarehouseVo = res
  } catch (error) {}
}

async function validate() {
  return await formRef.value?.validate()
}

defineExpose({ validate })

onBeforeMount(async () => {
  await getReceivingWarehouseOps()
})
</script>
<style lang="less" scoped>
:deep(.el-input) {
  flex: 1;
}
</style>
