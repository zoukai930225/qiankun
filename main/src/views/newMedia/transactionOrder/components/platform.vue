<template>
  <el-form :label-width="122" ref="formRef" :rules="rules" :model="dataValue" inline class="form_body"
    :disabled="userDisabled">
    <el-form-item label="刷单日期" prop="orderExpectedDate" class="half">
      <el-date-picker v-model="dataValue.orderExpectedDate" type="date" style="width: 100%;" value-format="YYYY-MM-DD"
        :disabled="disabled" @change="valueChange" />
    </el-form-item>
    <el-form-item label="订单编号" prop="orderNo" class="half" v-if="type !== 'grab_20'">
      <el-input v-model="dataValue.orderNo" :disabled="disabled" @change="valueChange" />
    </el-form-item>
    <el-form-item label="实付款" prop="payAmount" class="half" v-if="type !== 'grab_20'">
      <el-input v-model="dataValue.payAmount" :disabled="disabled" @change="valueChange" />
    </el-form-item>
    <el-form-item label="出评情况" prop="commentStatuslist" class="half" v-if="type !== 'grab_20'">
      <el-select v-model="dataValue.commentStatuslist" :disabled="disabled" @change="valueChange" multiple collapse-tags
        collapse-tags-tooltip>
        <el-option label="已主评" :value="1" />
        <el-option label="已追评" :value="2" />
      </el-select>
    </el-form-item>
    <el-form-item label="佣金" prop="commission" class="half" v-if="type !== 'grab_20'">
      <el-input v-model="dataValue.commission" :disabled="disabled" @change="valueChange" />
    </el-form-item>
    <el-form-item label="淘宝账号ID" prop="accountId" class="half" v-if="type !== 'grab_20'">
      <el-input v-model="dataValue.accountId" :maxlength="300" :disabled="disabled" @change="valueChange" />
    </el-form-item>
    <el-form-item label="无效单成本" prop="invalidCost" class="half" v-if="type !== 'grab_20'">
      <el-input :value="`${dataValue.invalidCost}元`" disabled />
    </el-form-item>
    <el-form-item label="无效单运费" prop="invalidFreightCost" class="half" v-if="type !== 'grab_20'">
      <el-input :value="`${dataValue.invalidFreightCost}元`" disabled />
    </el-form-item>
    <el-form-item label="无效单货品编码" prop="invalidGoodsCode" class="half" v-if="type !== 'grab_20'">
      <el-input v-model="dataValue.invalidGoodsCode" disabled />
    </el-form-item>
    <el-form-item label="评论完成截图" prop="commentLinkFiles" class="all" v-if="type !== 'grab_20'">
      <upload-img v-model:modelValue="dataValue.commentLinkFiles" :disabled="disabled" @change="fileChange"
        :bussiness-code="'SUPPLEMENT_ORDER'" :only-upload-img="false" />
    </el-form-item>
  </el-form>
</template>

<script lang="tsx">
export default { name: 'TransactionOrderDetailPlatform' };
</script>

<script lang="tsx" setup>
import uploadImg from '@/components/SWUoloadFile/index.vue';
import { useUserStore } from '@/store/modules/user';
import { DetailProvideType } from './type';
import { setImageInfo } from "@/utils";

const userStore = useUserStore();

const { dataValue, disabled, type, updetaValue } = inject('transaction_order_details') as DetailProvideType;

const rules = computed(() => ({
  orderExpectedDate: [{ required: true, message: '请选择期内容排期', trigger: ['blur', 'change'] }],
  orderNo: [{ required: true, message: '请输入订单编号', trigger: ['blur', 'change'] }],
  payAmount: [{ required: true, message: '请输入实付款', trigger: ['blur', 'change'] }],
  commission: [{ required: true, message: '请输入佣金', trigger: ['blur', 'change'] }],
  commentStatuslist: [{ required: true, message: '请选择评出评情况', trigger: ['blur', 'change'] }],
  accountId: [{ required: true, message: '请输入淘宝账号ID', trigger: ['blur', 'change'] }],
  invalidCost: [{ required: true }],
  invalidFreightCost: [{ required: true }],
  invalidGoodsCode: [{ required: true }],
  commentLinkFiles: [{ required: true, message: '请上传评论完成截图', trigger: ['blur', 'change'] }],
}));

const formRef = ref();

const userDisabled = computed(() => (((userStore.user as any)?.id || '') !== dataValue.value.middlegroundCreatedId) && !!dataValue.value.middlegroundIsCommit);

const validateCheck = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

const valueChange = () => {
  updetaValue({
    ...dataValue.value,
    commentStatus: dataValue.value?.commentStatuslist?.length ? dataValue.value?.commentStatuslist.join(',') : ''
  });
};

const fileChange = () => {
  updetaValue({
    ...dataValue.value,
    commentLinks: setImageInfo(dataValue.value.commentLinkFiles)
  });
};

const clearValidate = () => {
  formRef?.value?.clearValidate();
};

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
