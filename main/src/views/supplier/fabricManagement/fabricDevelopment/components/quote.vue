<template>
  <div ref="cardRef" :style="{ height: `${height}px`, marginTop: '5px' }">
    <el-scrollbar ref="scrollbarRef">
      <div class="card">
        <div class="header">
          <CardTitle :title="row?.productCode || ''" />
          <div class="btn">
            <el-button plain :disabled="!isSku" @click="detailInit">SKU明细</el-button>
          </div>
        </div>
        <div class="inner">
          <el-form :model="formValue" ref="infoRef" label-width="180px" :rules="formRules"
            :validate-on-rule-change="false">
            <el-form-item label="裸货价(不含税)" prop="productCostExcludingTax">
              <el-input-number v-model="(formValue.productCostExcludingTax as any)" :precision="2" :controls="false"
                :max="999999999.99" style="width: 100%;" @change="sum">
                <template #suffix>元</template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="裸货价(含税)" prop="productCostIncludingTax">
              <el-input-number v-model="(formValue.productCostIncludingTax as any)" :precision="2" :controls="false"
                :max="999999999.99" style="width: 100%;">
                <template #suffix>元</template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="包装人工费" prop="packagingManpower">
              <el-input-number v-model="(formValue.packagingManpower as any)" :precision="2" :controls="false"
                :max="999999999.99" style="width: 100%;" @change="sum">
                <template #suffix>元</template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="成品价" prop="finishedProductCost">
              <el-input-number v-model="(formValue.finishedProductCost as any)" :precision="2" :controls="false"
                :max="999999999.99" style="width: 100%;">
                <template #suffix>元</template>
              </el-input-number>
            </el-form-item>
            <el-form-item label="总起订量" prop="sumOrderQuantity" style="margin-bottom: 0px !important ">
              <el-input v-model="(formValue.sumOrderQuantity as any)" disabled style="width: 100%;" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="card">
        <div class="header">
          <CardTitle :title="'基本信息'" />
        </div>
        <div class="inner">
          <el-form :model="formValue" ref="formsRef" label-width="100px" :inline="true" :rules="formsRules">
            <el-form-item label="生产周期" prop="productionCycle" style="width: 48%;">
              <el-input v-model="formValue.productionCycle" />
            </el-form-item>
            <el-form-item label="包材费用" prop="packagingCost" style="width: 48%;">
              <el-input-number v-model="(formValue.packagingCost as any)" :precision="2" :controls="false"
                style="width: 100%;" />
            </el-form-item>
            <el-form-item label="产品成本补充" prop="productCostRemark" style="width: 97.5%">
              <s-text-area v-model="formValue.productCostRemark" :rows="4" maxlength="200" />
            </el-form-item>
            <el-form-item label="备注" prop="remark" style=" width: 97.5%">
              <s-text-area v-model="formValue.remark" :rows="4" maxlength="200" />
            </el-form-item>
            <el-form-item label="报价单" prop="quotationSheetFile" style="margin-bottom: 0px !important;width: 97.5%">
              <transfer :upload-data="{ code: 'FS_SUPPLIER_PLAN' }" :width="473" v-model="formValue.quotationSheetFile"
                :limit="20" :tip="'上传大小不超过20M的文件'" is-all />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-scrollbar>
    <el-dialog v-model="visible" append-to-body :show-close="false" :top="'50px'" width="calc(90vw + 32px)"
      style="border-radius: 14px;transform: none;position: static;margin-top: var(--el-dialog-margin-top) !important;"
      :close-on-click-modal="false">
      <template #header>
        <div class="header">
          <div>SKU明细</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="visible = false" />
        </div>
      </template>
      <div style="width: 100%;">
        <el-form label-width="85">
          <el-form-item label="SKU编码">
            <el-input v-model="txt" :placeholder="`请输入SKU编码`" clearable style="width: 240px;" />
            <div style="position: absolute;right: 0;">
              <el-button type="primary" @click="numEdit" icon="EditPen" :disabled="!selectData?.length">修改</el-button>
              <el-button type="primary" @click="addTable" icon="Plus"
                :disabled="tableData.length === bukData.length">新增</el-button>
              <el-button type="danger" @click="delAll" icon="CloseBold" :disabled="!selectData?.length">批量删除</el-button>
            </div>
          </el-form-item>
        </el-form>
        <vxe-table :header-cell-style="{ color: '#333', fontweight: 500, backgroundColor: '#F2F6FC' }"
          style="width: 90vw;" show-overflow :max-height="500" :data="listData" :column-config="{ resizable: true }"
          :virtual-y-config="{ enabled: true, gt: 0 }" v-loading="loading" ref="tableRef">
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column type="seq" width="60" align="center" />
          <vxe-column field="sku" title="SKU编码" />
          <vxe-column field="color" title="规格名称" />
          <vxe-column field="size" title="规格码" width="105" />
          <vxe-column field="productCostExcludingTax" title="裸货价(不含税)">
            <template #default="scope">
              <vxe-input v-model.trim="scope.row.productCostExcludingTax"
                @change="(value: any) => numChange(scope, value)">
                <template #suffix>元</template>
              </vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="packagingManpower" title="包装人工费">
            <template #default="scope">
              <vxe-input v-model.trim="scope.row.packagingManpower" @change="(value: any) => numChange(scope, value)">
                <template #suffix>元</template>
              </vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="singleColorOrderQuantity" title="起订量">
            <template #default="{ row }">
              <vxe-input v-model.trim="row.singleColorOrderQuantity" />
            </template>
          </vxe-column>
          <vxe-column field="finishedProductCost" title="成品价">
            <template #default="{ row }">
              <vxe-input v-model.trim="row.finishedProductCost">
                <template #suffix>元</template>
              </vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="operate" title="操作" width="75" align="center">
            <template #default="{ row }">
              <el-text type="danger" style="cursor: pointer;" @click="deleteData(row)">移除</el-text>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <template #footer>
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="save" :disabled="loading">确 定</el-button>
      </template>
    </el-dialog>
    <develop-quote-goods ref="goodsRef" :table-data="filterData" @add="addGoods" />
    <develop-quote-edit ref="editRef" @edit="editGoods" />
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
defineOptions({ name: 'DevelopQuote' });

import Transfer from "@/components/common/upload/transfer.vue";
import { dataDetection, isNumber } from "@/utils";
import DevelopQuoteGoods from "./goods.vue";
import DevelopQuoteEdit from "./edit.vue";
import { cloneDeep } from "lodash-es";
import request from '@/config/axios';

const props = defineProps({
  height: { type: Number, default: 300 },
  row: { type: Object, default: () => { } },
  supplier: { type: Object, default: () => { } },
});

const formValue: any = defineModel();

const scrollbarRef = ref(), infoRef = ref(), formsRef = ref(), visible = ref(), tableRef = ref(), goodsRef = ref(), editRef = ref();

const loading = ref<boolean>(false), txt = ref<string>(''), tableData = ref<Array<any>>([]), bukData = ref<Array<any>>([]);

const selectData = computed(() => tableRef?.value?.getCheckboxRecords());

const filterData = computed(() => {
  const skus: any = tableData.value.map((tbs: any) => tbs.sku);
  return bukData.value.filter((bus: any) => !skus.includes(bus.sku));
});

const isSku = computed(() => (formValue.value.productCostExcludingTax !== null && formValue.value.packagingManpower !== null));

const formRules = computed(() => ({
  productCostExcludingTax: [{ required: true, message: '请输入裸货价(不含税)', trigger: ['blur', 'change'] }],
  packagingManpower: [{ required: true, message: '请输入包装人工费', trigger: 'blur' }],
}));

const formsRules = computed(() => ({
  productionCycle: [{ required: true, message: '请输入生产周期', trigger: 'blur' }],
  packagingCost: [{ required: true, message: '请输入包材费用', trigger: 'blur' }],
  quotationSheetFile: [{ required: true, message: '请上传报价单', trigger: 'blur' }],
}));

const listData = computed(() => tableData.value.filter((ts: any) => ts.sku.toLowerCase().includes(txt.value.toLowerCase())));

const sum = () => {
  formValue.value = { ...formValue.value, finishedProductCost: Number((formValue.value.productCostExcludingTax || 0) + (formValue.value.packagingManpower || 0)).toFixed(2) as any }
};

const detailInit = () => {
  txt.value = '';
  request.get({ url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/queryWdtSpec`, params: { fsTaskId: props.row.id } }).then((res: any) => {
    if (formValue.value?.colorSizeGroups?.length) {
      tableData.value = [...formValue.value.colorSizeGroups];
    } else {
      tableData.value = (res || []).map((rs: any) => ({
        ...rs,
        packagingManpower: String(formValue.value.packagingManpower || ''),
        productCostExcludingTax: String(formValue.value.productCostExcludingTax || ''),
        finishedProductCost: Number((formValue.value.productCostExcludingTax || 0) + (formValue.value.packagingManpower || 0)).toFixed(2),
      }));
    }
    bukData.value = cloneDeep([...(res || [])]);
    visible.value = true;
    tableRef?.value?.clearCheckboxRow();
  });
};

const deleteData = (item: any) => {
  tableData.value = tableData.value.filter((tbs: any) => tbs.sku !== item.sku);
};

const delAll = () => {
  const skus: any = selectData.value.map((si: any) => si.sku);
  tableData.value = tableData.value.filter((tbs: any) => !skus.includes(tbs.sku));
};

const checkValue = () => {
  let backList: Array<boolean> = [
    dataDetection(
      tableData.value,
      'productCostExcludingTax',
      ``,
      (item: any) => {
        !isNumber(item.productCostExcludingTax, 2) && ElMessage({
          type: 'warning',
          message: `${item.sku}的裸货价(不含税)只能是两位数字!`
        });
        return !isNumber(item.productCostExcludingTax, 2)
      }
    ),
    dataDetection(
      tableData.value,
      'packagingManpower',
      ``,
      (item: any) => {
        !isNumber(item.packagingManpower, 2) && ElMessage({
          type: 'warning',
          message: `${item.sku}包装人工费只能是两位数字!`
        });
        return !isNumber(item.packagingManpower, 2)
      }
    ),
    dataDetection(
      tableData.value,
      'singleColorOrderQuantity',
      ``,
      (item: any) => {
        !isNumber(item.singleColorOrderQuantity, 2) && ElMessage({
          type: 'warning',
          message: `${item.sku}的起订量只能是两位数字!`
        });
        return !isNumber(item.singleColorOrderQuantity, 2)
      }
    ),
    dataDetection(
      tableData.value,
      'finishedProductCost',
      ``,
      (item: any) => {
        !isNumber(item.finishedProductCost, 2) && ElMessage({
          type: 'warning',
          message: `${item.sku}的成品价只能是两位数字!`
        });
        return !isNumber(item.finishedProductCost, 2)
      }
    )];
  return !backList.includes(false);
};

const save = () => {
  if (checkValue()) {
    formValue.value = {
      ...formValue.value, colorSizeGroups: tableData.value, sumOrderQuantity:
        tableData.value.reduce((sum: number, item: any) => {
          sum = sum + Number(item.singleColorOrderQuantity || 0);
          return sum
        }, 0)
    };
    visible.value = false;
  }
};

const numChange = (scope: any, value: any) => {
  const tar: any = cloneDeep({ ...scope.row });
  const index: number = tableData.value.findIndex((tbs: any) => tbs.sku === tar.sku);
  tableData.value.splice(index, 1, {
    ...tar,
    finishedProductCost: Number(Number(tar?.productCostExcludingTax || 0) + Number(tar?.packagingManpower || 0)).toFixed(2) as any
  })
};

const valueCheck = async () => {
  const validate1: any = infoRef?.value ? await infoRef?.value?.validate((valid: boolean) => { return valid }) : true;
  const validate2: any = formsRef?.value ? await formsRef?.value?.validate((valid: boolean) => { return valid }) : true;
  return validate1 && validate2;
};

const addTable = () => {
  goodsRef?.value?.open();
};

const addGoods = (list: any) => {
  tableData.value = [...tableData.value, ...list.map((rs: any) => ({
    ...rs,
    packagingManpower: formValue.value.packagingManpower,
    productCostExcludingTax: formValue.value.productCostExcludingTax,
    finishedProductCost: Number((formValue.value.productCostExcludingTax || 0) + (formValue.value.packagingManpower || 0)).toFixed(2),
  }))]
};

const numEdit = () => {
  editRef?.value?.open();
};

const editGoods = (info: any) => {
  const selects: any = selectData.value.map((si: any) => si.sku);
  tableData.value = tableData.value.map((tbs: any) => {
    let obj: any = cloneDeep({ ...tbs });
    if (selects.includes(tbs.sku)) {
      obj = {
        ...obj,
        packagingManpower: info?.packagingManpower || obj.packagingManpower,
        productCostExcludingTax: info?.productCostExcludingTax || obj.productCostExcludingTax,
        singleColorOrderQuantity: info?.singleColorOrderQuantity || obj.singleColorOrderQuantity
      };
      obj = {
        ...obj,
        finishedProductCost: Number(Number((obj.productCostExcludingTax || 0)) + Number((obj.packagingManpower || 0))).toFixed(2),
      }
    }
    return obj;
  });
};

defineExpose({ valueCheck });

</script>

<style scoped lang="scss">
@use '@/views/OA/factory/style/card.scss';

:deep() {
  .vxe-cell--col-resizable {
    &::before {
      background-color: transparent !important;
    }
  }
}

.el-form-item {
  margin: 0 10px 20px 0 !important;
}

:deep() {
  .el-input-number .el-input__inner {
    text-align: left;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  img {
    width: 14px;
    cursor: pointer;
  }
}
</style>
