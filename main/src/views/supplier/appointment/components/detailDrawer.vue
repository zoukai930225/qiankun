<template>
  <div class="drawer-wrapper">
    <s-w-drawer
      ref="drawerRef"
      v-model="isShow"
      width="90%"
      append-to-body
      :title="rowData?.scPurchaseOrderNo"
      @closed="handleClosed"
    >
      <div class="drawerContent">
        <el-card shadow="never">
          <add-form ref="formRef" v-model:model-value="formData" :is-check="true" />

          <div class="title"> 采购生产单明细 </div>
          <el-divider />
          <el-row>
            <el-col :span="20">
              <el-form :model="queryParams" ref="queryParamsRef">
                <el-row :gutter="14">
                  <el-col :span="6">
                    <el-form-item label="SKU编码" prop="skuQuery">
                      <scroll-select
                        class-name="!w-100%"
                        v-model:model-value="queryParams.skuQuery"
                        :api="getInfoBySku2"
                        item-label-key="sku"
                        item-value-key="sku"
                        selectKey="sku"
                        clearable
                        @change="handleQuery"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
            <el-col :span="4" class="!flex justify-end">
              <el-button @click="handleQuery" class="commonSearchBtn">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                搜索
              </el-button>
              <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: 0 }">
                重置
              </el-button>
            </el-col>
          </el-row>
          <div class="content userInfo">
            <sw-table
              :data="tableData"
              :options="orderDetailTableOps"
              :show-overflow-tooltip="true"
              :max-height="670"
              :row-class-name="rowClassName"
              :row-style="rowStyle"
              @scroll="handleScrollTable"
            />
          </div>
        </el-card>
      </div>

      <template #footer>
        <el-button class="mlauto" @click="handleClosed">取消</el-button>
      </template>
    </s-w-drawer>
  </div>
</template>
<script setup lang="tsx">
import type { FormInstance } from 'element-plus'
import { orderDetailTableOps } from '../options'
import { queryBySupplierIdAndIdApi } from '@/api/supplier/appoint'
import { useUserStore } from '@/store/modules/user'
import SwTable from '../../components/table.vue'
import addForm from '@/views/supplier/product/components/addform.vue'
import { getInfoBySku2 } from '@/api/supplier/purchase'

const props = defineProps<{
  rowData: Supplier.Purchase.ListItem
  type: 1 | 2
}>()

const userInfo = useUserStore()

const loading = ref(false)
const isShow = ref(false)
const tableData = computed(() => allData.value.slice(0, maxRowNum.value))
const allData = ref<Supplier.Purchase.ListItem[]>([])
const maxRowNum = ref(100)
const queryParams = ref({
  skuQuery: ''
})
const queryParamsRef = ref<FormInstance>()
const formRef = ref()

const formData = ref<any>()

/** 获取详情 */
async function getDetail() {
  loading.value = true
  try {
    const res1 = await queryBySupplierIdAndIdApi({
      supplierId:
        props.rowData.supplier ??
        (userInfo.user.supplierFlag === 1 ? userInfo.user.departmentId : undefined),
      id: props.rowData.id!,
      ...queryParams.value
    })

    const list = res1.scPurchaseOrderDetailList

    formData.value = res1

    if (list.length) {
      const sum = {
        goodsQuantity: list.reduce((arr, cur) => arr + cur.goodsQuantity, 0),
        goodsPlaceQuantity: list.reduce((arr, cur) => arr + cur.goodsPlaceQuantity, 0),
        goodsDeliveryQuantity: list.reduce((arr, cur) => arr + cur.goodsDeliveryQuantity, 0),
        goodsInboundQuantity: list.reduce((arr, cur) => arr + cur.goodsInboundQuantity, 0),
        purchasedGoodsQuantity: list.reduce((arr, cur) => arr + cur.purchasedGoodsQuantity, 0),
        remainingDeliveryQuantity: list.reduce(
          (arr, cur) => arr + (cur.remainingDeliveryQuantity || 0),
          0
        ),
        key: 'sumRow'
      }
      list.unshift(sum)

      allData.value = list.map((row) =>
        Object.fromEntries(
          Object.entries(row).map(([key, value]) => [
            key,
            value === null || value === '' ? '--' : value
          ])
        )
      )
    } else {
      allData.value = []
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    formRef.value?.remoteMethod()
  }
}

async function open() {
  isShow.value = true
  formData.value = props.rowData
  await nextTick()
  getDetail()
}

function handleScrollTable({ scrollTop }) {
  tableData.value.length < allData.value.length &&
    scrollTop % 5600 === 4984 &&
    (maxRowNum.value += 100)
}

function handleClosed() {
  allData.value = []
  maxRowNum.value = 100
  isShow.value = false
}

function handleQuery() {
  getDetail()
}

function resetQuery() {
  queryParamsRef.value?.resetFields()
  getDetail()
}

function rowClassName({ row }) {
  return row.detailStatus === '0' ? '' : 'isStop'
}

function rowStyle({ row, rowIndex }) {
  return row.detailStatus === '0' || !rowIndex || props.type === 1
    ? { backgroundColor: '#fff' }
    : {
        backgroundColor: '#f4f4f4'
      }
}

defineExpose({ open })
</script>

<style lang="less" scoped>
* {
  --el-input-width: 220px;
  --el-table-header-text-color: #666;
  --el-text-color-regular: #333;
}

.drawer-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  flex: 1;
  overflow: scroll;
  border: 0;
  font-size: 14px;

  &::-webkit-scrollbar {
    display: none;
  }
}

:deep(.el-card) {
  margin-bottom: 24px;
  padding: 20px;
  border-radius: 8px;
  overflow: scroll;
  border: 0;

  &::-webkit-scrollbar {
    display: none;
  }

  .el-card__body {
    box-sizing: border-box;
    padding: 0;
  }

  .el-card__header {
    padding: 16px 20px;
  }

  .title {
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 20px;

    &::before {
      content: '';
      display: block;
      width: 3px;
      height: 10px;
      margin-right: 6px;
      background-color: rgb(0, 100, 255);
    }
  }

  .content {
    margin-bottom: 20px;

    .item {
      display: flex;

      .el-form-item {
        flex: 1;
        margin: 0;
        padding: 16px 20px;

        .el-form-item__label {
          margin-bottom: 10px;
          line-height: 20px;
        }

        .isDisabled {
          cursor: text;

          .el-input__wrapper {
            border: none !important;
            box-shadow: none !important;
            background: #e8e9ed8c;

            .el-input__inner {
              color: #333333 !important;

              &::placeholder {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}

.baseInfo {
  min-height: 288px;
}

.postInfo {
  min-height: 211px;
}

.btns {
  :deep(.el-form-item__content) {
    flex-direction: row-reverse;

    .el-button {
      margin-left: 16px;
    }
  }
}

:deep(.el-form-item) {
  margin: 2px 0 14px 0;

  .el-form-item__content {
    flex-wrap: nowrap;
  }

  .el-input__suffix {
    width: 20px;
  }
}

.endTimePicker {
  margin-left: 4px;

  :deep(label) {
    display: none;
  }
}

.store {
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.is-disabled),
.disabled {
  color: #cdcdcd !important;
}

.datePickers {
  :deep(.el-input__inner) {
    width: 70px;
  }
}

.footer {
  display: flex;
}

.userInfo {
  background: #f2f6fc;
}

:deep(.el-table-v2__header-cell) {
  --el-table-header-bg-color: #f2f6fc;
  height: '40px';
  padding-left: 15px;
  color: '#666';

  .el-table-v2__header-cell-text {
    font-size: 14px;
    font-weight: 400;
  }

  &:last-of-type {
    width: 125px !important;
  }
}

:deep(.el-table-v2__row-cell) {
  padding-left: 15px;
  div {
    max-width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: keep-all;
    word-wrap: normal;
  }
}

:deep(.el-table-v2__empty) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

:deep(.el-divider) {
  margin: 20px 0;
}
</style>
