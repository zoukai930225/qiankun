<template>
  <s-w-dialog width="400" :title="title" v-model:model-value="isShow" @closed="handleClosed">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="110px">
      <template v-if="title === '修改价格'">
        <el-form-item label="成品采购价" prop="fgCost">
          <sw-input-number
            v-model="formData.fgCost"
            clearable
            :precision="4"
            placeholder="请输入成品采购价"
          />
        </el-form-item>
        <el-form-item label="裸货采购价" prop="baseProdCost">
          <sw-input-number
            v-model.trim="formData.baseProdCost"
            clearable
            :precision="4"
            placeholder="请输入裸货采购价"
          />
        </el-form-item>
        <el-form-item label="包材价格" prop="whPackCost">
          <sw-input-number
            v-model.trim="formData.whPackCost"
            clearable
            :precision="4"
            placeholder="请输入包材价格"
          />
        </el-form-item>
        <el-form-item label="是否含税" prop="hasTax">
          <el-select v-model="formData.hasTax" placeholder="请选择是否含税" clearable>
            <el-option
              v-for="{ label, value } in hasTaxOptions"
              :key="label"
              :value="value"
              :label="label"
            />
          </el-select>
        </el-form-item>
      </template>

      <template v-else>
        <el-form-item label="税率" prop="taxRate">
          <sw-input-number
            v-model="formData.taxRate"
            :min="0"
            :precision="2"
            clearable
            placeholder="请输入税率"
          />
        </el-form-item>
      </template>
    </el-form>

    <div class="tip"> {{ tip }} </div>

    <template #footer>
      <el-button type="primary" :loading="loading" :disabled="loading" @click="handleConfirm">
        确定
      </el-button>
      <el-button @click="isShow = false">取消</el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import { modifyTaxRateOrPriceApi } from '@/api/supplier/supplierProduct'
import { FormInstance, FormRules } from 'element-plus'
import { hasTaxOptions } from '../options'

const message = useMessage()

const props = withDefaults(
  defineProps<{
    supplierGoodsIds?: string[]
    tip: string
    supplierGoodsDetailIds?: string[]
    api?: (params: any) => Promise<any>
    title: string
  }>(),
  {
    api: modifyTaxRateOrPriceApi
  }
)

const emit = defineEmits<{
  (e: 'refresh'): void
}>()

const isShow = ref(false)
const formData = reactive<Supplier.SupplierProduct.ModifyTaxRateOrPriceParams>({})
const formRef = ref<FormInstance>()
const rules = ref<FormRules>({
  taxRate: [{ required: true, message: '请输入' }]
  // baseProdCost: [{ required: true, message: '请输入' }],
  // fgCost: [{ required: true, message: '请输入' }],
  // whPackCost: [{ required: true, message: '请输入' }]
})

function open() {
  isShow.value = true
}

function handleClosed() {
  isShow.value = false
  formRef.value?.resetFields()
}

const loading = ref(false)
async function handleConfirm() {
  loading.value = true
  try {
    await formRef.value?.validate()
    const res = await props.api({
      ...formData,
      supplierGoodsIds: props.supplierGoodsIds,
      supplierGoodsDetailIds: props.supplierGoodsDetailIds
    })
    if (res.success) {
      message.success('修改成功')
      isShow.value = false
      emit('refresh')
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>
<style lang="less" scoped>
.tip {
  display: flex;
  justify-content: center;
  color: #999;
}
</style>
