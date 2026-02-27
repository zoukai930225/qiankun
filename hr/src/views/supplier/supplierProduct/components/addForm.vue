<template>
  <div class="title"> 货品基本信息 </div>
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
      <el-col :span="6">
        <el-form-item label="供应商" prop="supplierId">
          <el-select-v2
            v-if="!isEdit"
            v-model="queryParams.supplierId"
            filterable
            popper-class="w-[min-content]"
            placeholder="请选择供应商"
            :options="supplierProduct.supplierList"
            :disabled="isEdit"
            @change="goodsNoScrollSelectRef?.refresh()"
          />

          <el-input v-else v-model="queryParams.supplierName" disabled />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="货品编码" prop="goodsId">
          <el-tooltip content="请先选择供应商" :disabled="!!queryParams.supplierId">
            <el-input v-if="isEdit" v-model="queryParams.goodsNo" disabled />
            <scroll-select
              v-else
              ref="goodsNoScrollSelectRef"
              v-model="queryParams.goodsId"
              item-label-key="goodsNo"
              item-value-key="goodsId"
              select-key="goodsNo"
              :api="getUnboundGoodsApi"
              :multiple="false"
              :otherParams="{
                supplierId: queryParams.supplierId
              }"
              :style="{width: '100%'}"
              :disabled="!queryParams.supplierId"
              placeholder="请选择货品编码"
              @change="handleChangeGoodsNo"
            />
          </el-tooltip>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="供应商货号">
          <el-input
            v-model="queryParams.supplierGoodsNo"
            placeholder="请输入供应商货号"
            clearable
            :maxlength="20"
            show-word-limit
          />
        </el-form-item>
      </el-col>
      <el-col :span="6" v-for="{ label, key } in readonlyFormOptions" :key="key">
        <el-form-item :label="label">
          <el-tooltip content="请先选择货品编码" :disabled="!!queryParams.goodsId">
            <el-input v-model="queryParams[key]" disabled />
          </el-tooltip>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script lang="ts" setup>
import { FormInstance, FormRules } from 'element-plus'
import { useSupplierProduct } from '@/store/modules/supplier'
import { getUnboundGoodsApi } from '@/api/supplier/supplierProduct'
import { readonlyFormOptions } from '../options'
const props = defineProps<{
  formData: Supplier.SupplierProduct.SaveOrUpdateSupplierGoodsParam
}>()

const supplierProduct = useSupplierProduct()
const route = useRoute()

const emit = defineEmits(['update:form-data', 'changePo'])

const formRef = ref<FormInstance>()
const rules = ref<FormRules>({
  supplierId: [{ required: true, message: '请选择供应商' }],
  goodsId: [{ required: true, message: '请选择货品编码' }]
})
const queryParams = ref<typeof props.formData>({})
const goodsNoScrollSelectRef = ref<{ refresh: () => void }>()

const isEdit = computed(() => !!route.params.id)

watch(
  () => props.formData,
  async (val) => {
    queryParams.value = val
  }
)

watch(queryParams, (val) => emit('update:form-data', val))

async function validate() {
  return await formRef.value?.validate()
}

function handleChangeGoodsNo(_: any, selectItem: typeof queryParams.value) {
  queryParams.value = { ...queryParams.value, ...selectItem }
  queryParams.value.details = []
}
onBeforeMount(() => {
  supplierProduct.getSupplierList()
})

defineExpose({ validate })
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
