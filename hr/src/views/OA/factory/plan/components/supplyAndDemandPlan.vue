<template>
  <SWDrawer v-model="visible" title="供需计划" :width="936" @close="visible = false">
    <div ref="cardRef" style="height: 100%">
      <el-scrollbar>
        <div class="card" style="width: 99%;">
          <div class="header">
            <CardTitle :title="'基本信息'" />
          </div>
          <div class="inner">
            <div class="form">
              <el-form :model="dataItem" ref="infoRef" label-width="100px" disabled inline>
                <!-- <el-form-item label="裸货价(不含税)" prop="productCostExcludingTax" style="width: calc(50% - 20px);"
                  class="half">
                  <el-input-number v-model="(dataItem.productCostExcludingTax as any)" :precision="2" :controls="false"
                    :max="999999999.99" style="width: 100%;">
                    <template #suffix>元</template>
</el-input-number>
</el-form-item> -->
                <el-form-item label="裸货价(含税)" prop="productCostIncludingTax" style="width: calc(50% - 20px);">
                  <el-input-number v-model="(dataItem.productCostIncludingTax as any)" :precision="2" :controls="false"
                    :max="999999999.99" style="width: 100%;">
                    <template #suffix>元</template>
                  </el-input-number>
                </el-form-item>
                <el-form-item label="包装人工费" prop="packagingManpower" style="width: calc(50% - 20px);">
                  <el-input-number v-model="(dataItem.packagingManpower as any)" :precision="2" :controls="false"
                    :max="999999999.99" style="width: 100%;">
                    <template #suffix>元</template>
                  </el-input-number>
                </el-form-item>
                <el-form-item label="成品价" prop="finishedProductCost" style="width: calc(50% - 20px);" class="half">
                  <el-input v-model="(dataItem.finishedProductCost as any)" style="width: 100%;">
                    <template #suffix>元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="总起订量" prop="sumOrderQuantity" style="width: calc(50% - 20px);">
                  <el-input v-model="(dataItem.sumOrderQuantity as any)" style="width: 100%;" />
                </el-form-item>
                <el-form-item label="生产周期" prop="productionCycle" style="width: calc(50% - 20px);">
                  <el-input v-model="dataItem.productionCycle" />
                </el-form-item>
                <el-form-item label="包材费用" prop="packagingCost" style="width: calc(50% - 20px);">
                  <el-input-number v-model="(dataItem.packagingCost as any)" :precision="2" :controls="false"
                    style="width: 100%;" />
                </el-form-item>
                <el-form-item label="产品成本补充" prop="productCostRemark" style="width: calc(100% - 20px)">
                  <s-text-area v-model="dataItem.productCostRemark" :rows="4" maxlength="200" />
                </el-form-item>
                <el-form-item label="备注" prop="remark" style=" width:   calc(100% - 20px)">
                  <s-text-area v-model="dataItem.remark" :rows="4" maxlength="200" />
                </el-form-item>
                <el-form-item label="报价单" prop="quotationSheetFile"
                  style="margin-bottom: 0px !important;width: calc(100% - 20px)">
                  <transfer :upload-data="{ code: 'FS_SUPPLIER_PLAN' }" :width="500" disabled
                    v-model="dataItem.quotationSheetFile" :limit="20" :tip="'上传大小不超过20M的文件'" accept-type="all" />
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="header">
            <CardTitle :title="'SKU明细'" />
          </div>
          <div class="inner">
            <div style="width: 100%;">
              <el-form label-width="85">
                <el-form-item label="SKU编码">
                  <el-input v-model="txt" :placeholder="`请输入SKU编码`" clearable style="width: 240px;" />
                </el-form-item>
              </el-form>
              <vxe-table :header-cell-style="{ color: '#333', fontweight: 500, backgroundColor: '#F2F6FC' }"
                style="width: 100%;" show-overflow :max-height="height" :data="listData"
                :column-config="{ resizable: true }" :virtual-y-config="{ enabled: true, gt: 0 }" ref="tableRef">
                <vxe-column type="seq" width="60" align="center" />
                <vxe-column field="sku" title="SKU编码" min-width="105" show-overflow />
                <vxe-column field="color" title="规格名称" min-width="40" show-overflow />
                <vxe-column field="size" title="规格码" min-width="30" show-overflow />
                <!-- <vxe-column field="productCostExcludingTax" title="裸货价(不含税)" align="right" show-overflow
                  :formatter="(row: any) => `${row?.row?.productCostExcludingTax || 0} 元`" min-width="85" /> -->
                <vxe-column field="packagingManpower" title="包装人工费" align="right" min-width="65" show-overflow
                  :formatter="(row: any) => `${row?.row?.packagingManpower || 0} 元`" />
                <vxe-column field="singleColorOrderQuantity" title="起订量" align="right" min-width="75" show-overflow />
                <vxe-column field="finishedProductCost" title="成品价" align="right" show-overflow
                  :formatter="(row: any) => `${row?.row?.finishedProductCost || 0} 元`" min-width="145" />
              </vxe-table>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
    </template>
  </SWDrawer>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import Transfer from "@/components/common/upload/transfer.vue";
import request from '@/config/axios';

const props = defineProps({
  info: {
    type: Object,
    default: () => { }
  }
});

const visible = ref<boolean>(false), dataItem = ref<any>({}), dataList = ref<any>([]), txt = ref<string>('');

const listData = computed(() => dataList.value.filter((ts: any) => (ts?.sku || '').toLowerCase().includes((txt.value || '').toLowerCase())));

const height = computed(() => listData?.value?.length ? ((listData.value.length + 1) * 52) : 300);

const open = async () => {
  request.get({ url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/queryWaitQuotePriceList/${props.info.fsTaskId}/${props.info.supplierId}` }).then((res: any) => {
    dataList.value = res?.records?.length ? res.records : [];
    visible.value = true;
    dataItem.value = { ...props.info.supplierInfo };
  });
}
defineExpose({ open });

</script>
<style lang="scss" scoped>
@use '@/views/OA/factory/style/card.scss';

:deep() {
  .vxe-cell--col-resizable {
    &::before {
      background-color: transparent !important;
    }
  }
}

.half {
  :deep() {
    .el-form-item__label {
      line-height: 16px !important;
      text-align: right;
    }
  }
}

:deep() {
  .el-form--inline .el-form-item {
    margin: 0 20px 20px 0;
  }

  .el-input-number .el-input__inner {
    text-align: left;
  }
}
</style>
