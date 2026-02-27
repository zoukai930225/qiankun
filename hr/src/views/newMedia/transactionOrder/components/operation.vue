<template>
  <el-form :label-width="110" ref="formRef" :rules="rules" :model="dataValue" inline class="form_body">
    <el-form-item label="商品ID" prop="goodsId" class="half">
      <good-select v-model="dataValue.goodsId" :show-params="{ label: 'value' }" :disabled="!isStorage || disabled"
        @change="goodChange" />
    </el-form-item>
    <el-form-item label="商品编码" prop="goodsCode" class="half">
      <el-input v-model="dataValue.goodsCode" disabled />
    </el-form-item>
    <el-form-item label="类目" prop="categoryName" class="half">
      <el-tooltip :content="dataValue.categoryName" :disabled="!dataValue.categoryName" placement="top" effect="light">
        <el-input v-model="dataValue.categoryName" disabled />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="链接" prop="link" class="half">
      <el-tooltip :content="dataValue.link" placement="top" :disabled="!dataValue.link" effect="light">
        <el-input v-model="dataValue.link" disabled />
      </el-tooltip>
    </el-form-item>
    <el-form-item label="商品名称" prop="goodsName" class="all">
      <el-input v-model="dataValue.goodsName" disabled />
    </el-form-item>
    <el-form-item label="店铺" prop="storeName" class="half">
      <el-input v-model="dataValue.storeName" disabled />
    </el-form-item>
    <el-form-item label="下单SKU" prop="orderSku" class="half">
      <el-input v-model="dataValue.orderSku" :maxlength="100"
        :disabled="!(isStorage || (!isStorage && type === 'edit' && dataValue.status === 10))" @change="valueChange" />
    </el-form-item>
    <el-form-item label="主卖点" prop="salePoint" class="all">
      <s-text-area v-model="dataValue.salePoint" :rows="3" :maxlength="200" :disabled="!isStorage || disabled"
        @change="valueChange" />
    </el-form-item>
    <el-form-item label="补单日期" prop="expectedDate" class="half">
      <el-date-picker v-model="dataValue.expectedDate" type="date" :disabled="!isStorage || disabled"
        style="width: 100%;" @change="valueChange" value-format="YYYY-MM-DD" />
    </el-form-item>
    <el-form-item label="补单数量" prop="orderCount" class="half">
      <el-input-number v-model="(dataValue.orderCount as any)" :disabled="!isStorage || disabled" :max="20"
        :controls="false" style="width: 100%;" @change="valueChange" />
    </el-form-item>
  </el-form>
</template>

<script lang="tsx">
export default { name: 'TransactionOrderDetailOperation' };
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import GoodSelect from "@/components/common/goods/goods.vue";
import { getUrlByTypeAndId } from "@/utils";
import { DetailProvideType } from './type';

const { dataValue, type, disabled, isStorage, updetaValue } = inject('transaction_order_details') as DetailProvideType;

const rules = computed(() => ({
  goodsId: [{ required: true, message: '请选择商品', trigger: ['blur', 'change'] }],
  expectedDate: [{ required: true, message: '请选择期望补单日期', trigger: ['blur', 'change'] }],
  orderCount: [{ required: true, message: '请输入补单数量', trigger: ['blur', 'change'] }],
  salePoint: [{ required: true, message: '请输入主卖点', trigger: ['blur', 'change'] }],
  orderSku: [{ required: true, message: '请输入下单SKU', trigger: 'change' }],
  goodsCode: [{ required: true, message: '请选择商品', trigger: 'blur' }],
  categoryName: [{ required: true, message: '请选择商品', trigger: 'blur' }],
  link: [{ required: true, message: '请选择商品', trigger: 'blur' }],
  goodsName: [{ required: true, message: '请选择商品', trigger: 'blur' }],
  storeName: [{ required: true, message: '请选择商品', trigger: 'blur' }],
}));

const formRef = ref();

const validateCheck = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

const clearValidate = () => {
  formRef?.value?.clearValidate();
};

const goodChange = (val: any, tar: any) => {
  formRef?.value?.clearValidate();
  updetaValue({
    ...dataValue.value,
    goodsCode: tar?.data?.goodsCode || '',
    categoryName: tar?.data?.categoryName || '',
    categoryId: tar?.data?.categoryId || '',
    link: tar?.data?.goodsCode ? getUrlByTypeAndId(tar?.data?.channel || 'TaoBao', tar.data.goodsId, true) : '',
    goodsName: tar?.data?.goodsName || '',
    storeName: tar?.data?.storeName || '',
    store: tar?.data?.store || ''
  });
  nextTick(() => {
    formRef.value.clearValidate('goodsCode');
    formRef.value.clearValidate('categoryName');
    formRef.value.clearValidate('link');
    formRef.value.clearValidate('goodsName');
    formRef.value.clearValidate('storeName');
  });
};

const valueChange = () => updetaValue({ ...dataValue.value });

defineExpose({ clearValidate, validateCheck });
</script>
<style lang="scss" scoped>
.form_body {
  margin-top: 10px;

  .half {
    width: calc(50% - 50px);
  }

  .all {
    width: calc(100% - 50px);
  }
}

:deep(.el-input-number .el-input__inner) {
  text-align: left !important;
}
</style>
