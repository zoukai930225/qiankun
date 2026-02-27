<template>
  <s-w-drawer
    ref="drawerRef"
    v-model="isShow"
    :with-header="false"
    :wrapper-closable="true"
    class="drawer"
    :title="title"
    width="88%"
    @closed="handleClosed"
  >
    <div class="drawerContent">
      <el-card shadow="never" v-loading="loading">
        <div class="mb-12px">
          <div class="title"> 采购需求单信息 </div>
          <el-divider />
          <el-form ref="queryFormRef" label-width="100" scroll-to-error>
            <el-row :gutter="40">
              <el-col :span="6">
                <el-form-item label="需求单号:" prop="scPurchaseRequestOrderNo">
                  <el-input
                    :model-value="rowData.scPurchaseRequestOrderNo"
                    clearable
                    placeholder="请输入需求单名称"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="需求单名称:" prop="scPurchaseRequestOrderName">
                  <el-input
                    :model-value="rowData.scPurchaseRequestOrderName"
                    clearable
                    placeholder="请输入需求单名称"
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="需求来源:" prop="requestSource">
                  <el-select
                    :model-value="rowData.requestSource"
                    clearable
                    placeholder="请选择需求来源"
                    disabled
                  >
                    <el-option
                      v-for="{ value, label } in requestSourceOption"
                      :key="value"
                      :value="value"
                      :label="label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="备注:" prop="remarks">
                  <s-text-area
                    :model-value="rowData.remarks"
                    :maxlength="500"
                    :rows="5"
                    show-word-limit
                    disabled
                  />
                </el-form-item>
              </el-col>
              <el-col :span="18">
                <el-form-item label="附件:" prop="fileUrl">
                  <files-upload
                    disabled
                    v-model:modelValue="rowData.fileUrl"
                    :url="rowData.fileUrl"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div class="title">
          <span>采购需求单明细</span>
          <span
            v-if="type === 2 && rowData.statisticDate"
            class="color-#DB6A0F !flex items-center ml-16px"
          >
            <Icon icon="ep:warning-filled" class="mr-4px" :size="14" />
            <span class="font-400">数据统计日期：{{ rowData.statisticDate }}</span>
          </span>
        </div>
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
            :options="type === 2 ? auditPurchaseTable : detailTable"
            :show-overflow-tooltip="true"
            :max-height="672"
            :loading="loading"
            show-summary
            :summary-method="summaryMethod"
            @scroll="handleScrollTable"
          />
        </div>
      </el-card>
    </div>

    <template #footer>
      <el-button class="mlauto" @click="drawerRef.handleClose()">取消</el-button>
    </template>
  </s-w-drawer>
</template>
<script setup lang="tsx">
import STextArea from '@/components/common/input/s-textarea.vue'
import {
  getInfoBySku2,
  scPurchaseRequestOrderQueryOneByIdApi,
  scPurchaseRequestOrderQuerySnapshotByIdApi
} from '@/api/supplier/purchase'
import type { FormInstance } from 'element-plus'
import SwTable from '../../components/table.vue'
import { auditPurchaseTable, detailTable } from '../options'
import { getDictOptions } from '@/utils/dict'
import FilesUpload from '@/views/supplier/product/components/changePageUpload.vue'

const props = defineProps<{
  id?: string
  type?: number
}>()

const loading = ref(false)
const drawerRef = ref()
const isShow = ref(false)
const queryParams = ref({
  skuQuery: '' as any
})
const queryParamsRef = ref<FormInstance>()
const allData = ref<Supplier.Purchase.ListItem[]>([])
const maxRowNum = ref(100)
const rowData = ref<Supplier.Purchase.ListItem>({})

const tableData = computed(() => allData.value.slice(0, maxRowNum.value))

const title = computed(() => {
  if (rowData.value.scPurchaseRequestOrderName && rowData.value.scPurchaseRequestOrderNo)
    return `${rowData.value.scPurchaseRequestOrderName}（${rowData.value.scPurchaseRequestOrderNo}）`
})

const requestSourceOption = computed(() => getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE))

/** 获取详情 */
async function getDetail() {
  loading.value = true
  const api =
    props.type === 2
      ? scPurchaseRequestOrderQuerySnapshotByIdApi
      : scPurchaseRequestOrderQueryOneByIdApi

  try {
    const res = await api({
      ...queryParams.value,
      id: props.id || ''
    })
    const { scpurchaseRequestOrderDetailList, detailSnapshotVos } = res
    const processedData = (scpurchaseRequestOrderDetailList || detailSnapshotVos).map((row) =>
      fillEmptyValues(row)
    )
    allData.value = [...processedData]
    rowData.value = res
  } catch (error) {
    console.error('获取详情失败:', error)
  } finally {
    await nextTick()
    loading.value = false
  }
}

/**
 * 将对象中的所有空值替换为'--'
 * @param {Object} obj - 要处理的对象
 * @returns {Object} 处理后的对象
 */
function fillEmptyValues(obj: object): object {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === null || value === undefined || value === '' ? '--' : value
    ])
  )
}

function handleScrollTable({ scrollTop }) {
  tableData.value.length <= allData.value.length &&
    scrollTop % 5600 === 4986 &&
    (maxRowNum.value += 100)
}

async function open() {
  if (isShow.value) return
  isShow.value = true
  await nextTick()
  getDetail()
}

function handleClosed() {
  allData.value = []
  maxRowNum.value = 100
  queryParamsRef.value?.resetFields()
  rowData.value.fileUrl = ''
  delete queryParams.value.skuQuery
}

function handleQuery() {
  getDetail()
}

function resetQuery() {
  queryParamsRef.value?.resetFields()
  getDetail()
}

function summaryMethod(param) {
  const noShowSummaryColumns = [
    'imgUrl',
    'goodsCode',
    'goodsName',
    'sku',
    'formName',
    'formCode',
    'estimatePrice',
    'iterateCode',
    'orderItemTime',
    'firstOrderTime',
    'expectedArrivalTime'
  ]

  const averageColumns = [
    'sevenTurnover',
    'turnoverDays',
    'fourteenTurnover',
    'thirtyTurnover',
    'turnoverDaysAfterRestocking'
  ]

  const { columns } = param
  const sums: (string | VNode)[] = []
  columns.forEach((column, index) => {
    if (index === 0) return (sums[index] = '合计')
    else if (noShowSummaryColumns.includes(column.rawColumnKey)) {
      return (sums[index] = '')
    } else {
      const values = tableData.value.map((row) => Number(row[column.rawColumnKey]))

      const num = values.reduce((pre, cur) => pre + (cur || 0), 0)
      const result = String(
        (averageColumns.includes(column.rawColumnKey)
          ? Math.floor(num / tableData.value.length)
          : num) || ''
      )

      return (sums[index] = result)
    }
  })
  return sums
}

defineExpose({ open })
</script>

<style lang="less" scoped>
@import url(../../index.scss);

:deep(.el-drawer__body) {
  .el-form {
    .el-form-item__content {
      .el-input__wrapper,
      .el-select__wrapper {
        width: auto;
      }
    }
  }
}

:deep(.el-drawer) {
  min-width: 500px;
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body) {
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
  padding-bottom: 0 !important;
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

:deep(.el-drawer__footer) {
  padding-bottom: 10px;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
  z-index: 999;
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

:deep(.el-divider) {
  width: calc(100% + 40px);
  margin: 20px -20px;
}
</style>
