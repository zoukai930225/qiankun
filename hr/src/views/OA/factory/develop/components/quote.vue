<template>
  <div ref="quoteRef" :style="{ height: `${height}px`, marginTop: '5px' }">
    <el-scrollbar ref="scrollbarRef">
      <div class="card">
        <div class="header">
          <CardTitle :title="row?.productCode || ''" />
          <div class="btn">
            <el-button type="primary" :disabled="!isSku" @click="detailInit">规格明细</el-button>
          </div>
        </div>
        <div class="inner">
          <el-form
            :model="formValue"
            ref="infoRef"
            label-width="85px"
            :rules="formRules"
            :disabled="disabled"
          >
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item
                  label="含税裸货价(元)"
                  prop="productCostIncludingTax"
                  class="longLabel"
                >
                  <el-input-number
                    v-model="formValue.productCostIncludingTax"
                    :precision="3"
                    :controls="false"
                    @change="sum"
                    :max="999999999.999"
                    style="width: 100%"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="包装人工费(元)" prop="packagingManpower" class="longLabel">
                  <el-input-number
                    v-model="formValue.packagingManpower as any"
                    :precision="3"
                    :controls="false"
                    @change="sum"
                    :max="999999999.999"
                    style="width: 100%"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="成品价(元)" prop="finishedProductCost">
                  <el-input-number
                    v-model="formValue.finishedProductCost as any"
                    :precision="3"
                    :controls="false"
                    :max="999999999.999"
                    style="width: 100%"
                  >
                  </el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="总起订量"
                  prop="sumOrderQuantity"
                  style="margin-bottom: 0px !important"
                >
                  <el-input
                    v-model="formValue.sumOrderQuantity as any"
                    disabled
                    style="width: 100%"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="card">
        <div class="header">
          <CardTitle :title="'基本信息'" />
        </div>
        <div class="inner">
          <el-form
            :model="formValue"
            ref="formsRef"
            label-width="80px"
            :rules="formsRules"
            :disabled="disabled"
          >
            <el-row :gutter="10">
              <el-col :span="12">
                <el-form-item label="生产周期" prop="productionCycle">
                  <el-input v-model="formValue.productionCycle" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="包材费用" prop="packagingCost">
                  <el-input-number
                    v-model="formValue.packagingCost as any"
                    :precision="3"
                    :controls="false"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="产品成本补充" prop="productCostRemark" class="longLabel">
                  <s-text-area v-model="formValue.productCostRemark" :rows="4" maxlength="200" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="备注" prop="remark">
                  <s-text-area v-model="formValue.remark" :rows="4" maxlength="200" />
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item
                  label="报价单"
                  prop="quotationSheetFile"
                  style="margin-bottom: 0px !important; width: 100%"
                >
                  <transfer
                    :upload-data="{ code: 'FS_SUPPLIER_PLAN' }"
                    width="100%"
                    v-model="formValue.quotationSheetFile"
                    :limit="20"
                    :tip="'上传大小不超过20M的文件'"
                    accept-type="all"
                    :disabled="disabled"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
    </el-scrollbar>
    <el-dialog
      v-model="visible"
      append-to-body
      :show-close="false"
      align-center
      width="1100px"
      :close-on-click-modal="false"
      style="padding: 0;"
    >
      <template #header>
        <div class="header" style="padding: 16px 20px;border-bottom: solid 1px #E5E5E5;">
          <div>规格明细</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="visible = false" />
        </div>
      </template>
      <div :style="disabled ? 'padding: 4px 20px 20px 20px;' : 'padding: 4px 20px;'">
        <el-form label-width="85">
          <el-form-item label="规格名称">
            <el-input
              v-model="txt"
              :placeholder="`请输入规格名称`"
              clearable
              style="width: 240px; margin-right: 10px"
            />
            <el-button @click="txt = ''">重置</el-button>
            <div style="position: absolute; right: 0" v-if="!disabled">
              <el-button type="danger" @click="delAll" :disabled="!selectData?.length || disabled"
                >批量删除</el-button
              >
              <el-button type="primary" @click="numEdit" :disabled="!selectData?.length || disabled"
                >修改</el-button
              >
              <el-button
                type="primary"
                @click="addTable"
                :disabled="tableData.length === bukData.length || disabled"
                >新增</el-button
              >
            </div>
          </el-form-item>
        </el-form>
        <vxe-table
          :header-cell-style="{
            color: '#666666',
            fontWeight: 400,
            backgroundColor: '#F2F6FC',
            fontFamily: 'pingFang SC'
          }"
          :cell-style="{ fontFamily: 'pingFang SC' }"
          style="width: 100%"
          show-overflow
          :max-height="534"
          :data="listData"
          :column-config="{ resizable: true }"
          :virtual-y-config="{ enabled: true, gt: 0 }"
          v-loading="loading"
          ref="tableRef"
          border="full"
        >
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column type="seq" width="60" align="center" />
          <vxe-column field="productCode" title="货品编码" width="144"/>
          <vxe-column field="color" title="规格名称" min-width="144"/>
          <!-- <vxe-column field="size" title="规格码" width="105" /> -->
          <vxe-column field="productCostIncludingTax" title="含税裸货价" >
            <template #default="scope">
              <vxe-input
                v-model.trim="scope.row.productCostIncludingTax"
                @blur="(value: any) => numChange(scope, value)"
                :disabled="disabled"
              >
                <template #suffix>元</template>
              </vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="packagingManpower" title="包装人工费">
            <template #default="scope">
              <vxe-input
                v-model.trim="scope.row.packagingManpower"
                @blur="(value: any) => numChange(scope, value)"
                :disabled="disabled"
              >
                <template #suffix>元</template>
              </vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="singleColorOrderQuantity" title="起订量">
            <template #default="{ row }">
              <vxe-input v-model.trim="row.singleColorOrderQuantity" :disabled="disabled" />
            </template>
          </vxe-column>
          <vxe-column field="finishedProductCost" title="成品价">
            <template #default="{ row }">
              <vxe-input v-model.trim="row.finishedProductCost" :disabled="disabled">
                <template #suffix>元</template>
              </vxe-input>
            </template>
          </vxe-column>
          <vxe-column field="operate" title="操作" width="75" align="center" v-if="!disabled">
            <template #default="{ row }">
              <el-text type="danger" style="cursor: pointer" @click="deleteData(row)">移除</el-text>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <template #footer v-if="!disabled">
        <div style="padding: 10px 20px;border-top: solid 1px #E5E5E5;">
          <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="save" :disabled="loading">确 定</el-button>
        </div>
      </template>
    </el-dialog>
    <develop-quote-goods ref="goodsRef" :table-data="filterData" @add="addGoods" />
    <develop-quote-edit ref="editRef" @edit="editGoods" />
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'DevelopQuote' })
import STextArea from '@/components/common/input/s-textarea.vue'
import Transfer from '@/components/common/upload/transfer.vue'
import { dataDetection, isNumber } from '@/utils'
import DevelopQuoteGoods from './goods.vue'
import DevelopQuoteEdit from './edit.vue'
import { cloneDeep } from 'lodash-es'
import request from '@/config/axios'
import { fontFamily } from 'html2canvas-plus/dist/types/css/property-descriptors/font-family'

const props = defineProps({
  // formValue: {type: Object, default: () => {}},
  height: { type: Number, default: 300 },
  row: { type: Object, default: () => {} },
  supplier: { type: Object, default: () => {} },
  disabled: { type: Boolean, default: false }
})
//
const formValue: any = defineModel()

const scrollbarRef = ref(),
  infoRef = ref(),
  formsRef = ref(),
  visible = ref(),
  tableRef = ref(),
  goodsRef = ref(),
  editRef = ref()

const loading = ref<boolean>(false),
  txt = ref<string>(''),
  tableData = ref<Array<any>>([]),
  bukData = ref<Array<any>>([])

const selectData = computed(() => tableRef?.value?.getCheckboxRecords())

const filterData = computed(() => {
  const skus: any = tableData.value.map((tbs: any) => tbs.color)
  return bukData.value.filter((bus: any) => !skus.includes(bus.color))
})

// formValue.value.productCostExcludingTax !== null &&
const isSku = computed(() => formValue.value.packagingManpower !== null)

const formRules = ref({
  productCostIncludingTax: [
    { required: true, message: '请输入含税裸货价', trigger: ['blur', 'change'] }
  ],
  packagingManpower: [{ required: true, message: '请输入包装人工费', trigger: 'blur' }],
  finishedProductCost: [{ required: true, message: '请输入成品价', trigger: 'blur' }]
})

const formsRules = computed(() => ({
  productionCycle: [{ required: true, message: '请输入生产周期', trigger: 'blur' }],
  // packagingCost: [{ required: true, message: '请输入包材费用', trigger: 'blur' }],
  quotationSheetFile: [{ required: true, message: '请上传报价单', trigger: 'blur' }]
}))

const listData = computed(() =>
  tableData.value.filter((ts: any) => ts.color.toLowerCase().includes(txt.value.toLowerCase()))
)

const sum = () => {
  formValue.value = {
    ...formValue.value,
    finishedProductCost: Number(formValue.value.finishedProductCost || 0).toFixed(3) as any
  }
}

const detailInit = () => {
  txt.value = ''
  request
    .get({
      url: `/workflow-api/api/workflow/business/factorySecondary/supplierInfo/queryWdtSpec`,
      params: { fsTaskId: props.row.id, supplierId: props.supplier.supplierId }
    })
    .then((res: any) => {
      if (formValue.value?.colorSizeGroups?.length) {
        tableData.value = [...formValue.value.colorSizeGroups].map((item: any) => ({
          ...item,
          packagingManpower: Number(item.packagingManpower || 0).toFixed(3),
          productCostExcludingTax: Number(item.productCostExcludingTax || 0).toFixed(3),
          productCostIncludingTax: Number(item.productCostIncludingTax || 0).toFixed(3),
          finishedProductCost: Number(item.finishedProductCost || 0).toFixed(3)
        }))
      } else {
        tableData.value = (res || []).map((rs: any) => ({
          ...rs,
          packagingManpower: Number(formValue.value.packagingManpower || 0).toFixed(3),
          productCostExcludingTax: Number(formValue.value.productCostExcludingTax || 0).toFixed(3),
          productCostIncludingTax: Number(formValue.value.productCostIncludingTax || 0).toFixed(3),
          finishedProductCost: Number(
            Number(formValue.value.packagingManpower || 0) +
              Number(formValue.value.productCostIncludingTax || 0)
          ).toFixed(3)
        }))
      }
      visible.value = true
      tableRef?.value?.clearCheckboxRow()
      bukData.value = cloneDeep([...(res || [])])
    })
}

const deleteData = (item: any) => {
  tableData.value = tableData.value.filter((tbs: any) => tbs.color !== item.color)
}

const delAll = () => {
  const skus: any = selectData.value.map((si: any) => si.color)
  tableData.value = tableData.value.filter((tbs: any) => !skus.includes(tbs.color))
}

const checkValue = () => {
  let backList: Array<boolean> = [
    dataDetection(tableData.value, 'productCostIncludingTax', ``, (item: any) => {
      !isNumber(item.productCostIncludingTax, 3) &&
        ElMessage({
          type: 'warning',
          message: `${item.color}的“裸货价(含税)”只能是三位数字!`
        })
      return !isNumber(item.productCostIncludingTax, 3)
    }),
    dataDetection(tableData.value, 'packagingManpower', ``, (item: any) => {
      !isNumber(item.packagingManpower, 3) &&
        ElMessage({
          type: 'warning',
          message: `${item.color}的“包装人工费”只能是三位数字!`
        })
      return !isNumber(item.packagingManpower, 3)
    }),
    dataDetection(tableData.value, 'singleColorOrderQuantity', ``, (item: any) => {
      !item.singleColorOrderQuantity &&
        ElMessage({
          type: 'warning',
          message: `起订量尚未填完，请补全后再点击“确定”!`
        })
      !isNumber(item.singleColorOrderQuantity, 0) &&
        ElMessage({
          type: 'warning',
          message: `起订量必须为正整数, 请调整后再点击“确定”!`
        })
      return !isNumber(item.singleColorOrderQuantity, 0)
    }),
    dataDetection(tableData.value, 'finishedProductCost', ``, (item: any) => {
      !isNumber(item.finishedProductCost, 3) &&
        ElMessage({
          type: 'warning',
          message: `${item.color}的“成品价”只能是三位数字!`
        })
      return !isNumber(item.finishedProductCost, 3)
    })
  ]
  return !backList.includes(false)
}

const save = () => {
  if (checkValue()) {
    formValue.value = {
      ...formValue.value,
      colorSizeGroups: tableData.value,
      sumOrderQuantity: tableData.value.reduce((sum: number, item: any) => {
        sum = sum + Number(item.singleColorOrderQuantity || 0)
        return sum
      }, 0)
    }
    visible.value = false
  }
}

const numChange = (scope: any, value: any) => {
  const tar: any = cloneDeep({ ...scope.row })
  const index: number = tableData.value.findIndex((tbs: any) => tbs.color === tar.color)
  tableData.value.splice(index, 1, {
    ...tar,
    finishedProductCost: Number(
      Number(tar?.packagingManpower || 0) + Number(tar?.productCostIncludingTax || 0)
    ).toFixed(3) as any
  })
}

const valueCheck = async () => {
  const validate1: any = infoRef?.value
    ? await infoRef?.value?.validate((valid: boolean) => {
        return valid
      })
    : true
  const validate2: any = formsRef?.value
    ? await formsRef?.value?.validate((valid: boolean) => {
        return valid
      })
    : true
  console.log(validate1, validate2)
  return validate1 && validate2
}

const addTable = () => {
  goodsRef?.value?.open()
}

const addGoods = (list: any) => {
  tableData.value = [
    ...tableData.value,
    ...list.map((rs: any) => ({
      ...rs,
      packagingManpower: Number(formValue.value.packagingManpower || 0).toFixed(3),
      productCostExcludingTax: Number(formValue.value.productCostExcludingTax || 0).toFixed(3),
      productCostIncludingTax: Number(formValue.value.productCostIncludingTax || 0).toFixed(3),
      finishedProductCost: Number(
        Number(formValue.value.packagingManpower || 0) +
          Number(formValue.value.productCostIncludingTax || 0)
      ).toFixed(3)
    }))
  ]
}

const numEdit = () => {
  editRef?.value?.open()
}

const editGoods = (info: any) => {
  const selects: any = selectData.value.map((si: any) => si.color)
  tableData.value = tableData.value.map((tbs: any) => {
    let obj: any = cloneDeep({ ...tbs })
    if (selects.includes(tbs.color)) {
      obj = {
        ...obj,
        packagingManpower: Number(info?.packagingManpower || obj.packagingManpower || 0).toFixed(3),
        productCostExcludingTax: Number(
          info?.productCostExcludingTax || obj.productCostExcludingTax || 0
        ).toFixed(3),
        singleColorOrderQuantity: info?.singleColorOrderQuantity || obj.singleColorOrderQuantity,
        productCostIncludingTax: Number(
          info?.productCostIncludingTax || obj.productCostIncludingTax || 0
        ).toFixed(3)
      }
      obj = {
        ...obj,
        finishedProductCost: Number(
          Number(obj.productCostIncludingTax || 0) + Number(obj.packagingManpower || 0)
        ).toFixed(3)
      }
    }
    return obj
  })
}

const reset = () => {
  nextTick(() => {
    infoRef?.value?.clearValidate()
    formsRef?.value?.clearValidate()
  })
}

defineExpose({ valueCheck, reset })
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

:deep() {
  .longLabel {
    &.el-form-item {
      .el-form-item__label {
        line-height: 16px;
      }
    }
  }
  .el-form-item__label {
    &::before {
      margin-right: 0 !important;
    }
  }
}

.el-form-item {
  margin: 0 0px 20px 0 !important;
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
  font-weight: 500;
  font-size: 16px;

  img {
    width: 14px;
    cursor: pointer;
  }
}
</style>
