<template>
  <s-w-drawer
    ref="drawerRef"
    v-model="isShow"
    :with-header="false"
    :wrapper-closable="true"
    body-class="drawer-body"
    footer-class="drawer-footer"
    width="80%"
    append-to-body
    :title="`填写装箱单 (${rowData.advancedShippingRequestOrderNo})`"
    @closed="handleClosed"
  >
    <div class="drawerContent">
      <el-card shadow="never">
        <el-scrollbar>
          <div class="content userInfo">
            <sw-table
              ref="tableRef"
              class="form-table"
              :data="tableData"
              :options="pickingListOps"
              :loading="loading"
              :min-height="620"
              :show-overflow-tooltop="true"
              :rules="rules"
              v-model:filters="filters"
            >
              <template #boxNumber="{ index, row }">
                <el-form
                  :model="row"
                  :rules="rules"
                  :ref="(el) => (el && (formRefs[index] = el as FormInstance))"
                  :show-message="false"
                >
                  <el-form-item
                    prop="boxNumber"
                    :ref="
                    (ele: FormItemInstance) => {
                      if (!formItemRefs[index]) {
                        formItemRefs[index] = {} as FormItemInstance
                      }
                      formItemRefs[index] =ele as FormItemInstance
                    }
                  "
                    :rules="{
                      required: true,
                      validator: (_, __, callback) => {
                        switch (true) {
                          case !index:
                            return callback()
                          case !row.startBoxNumber:
                            return callback(new Error('请输入开始箱号'))
                          case !row.endBoxNumber:
                            return callback(new Error('请输入结束箱号'))
                          default:
                            return callback()
                        }
                      }
                    }"
                  >
                    <el-popover
                      :disabled="formItemRefs[index]?.validateState !== 'error'"
                      :show-arrow="false"
                      :offset="4"
                      :popper-style="{
                        padding: '6px',
                        minWidth: '0',
                        width: '195px'
                      }"
                      :hide-after="0"
                    >
                      <template #reference>
                        <div class="flex mb--13px items-center">
                          <el-input-number
                            v-if="index"
                            v-model="row.startBoxNumber"
                            clearable
                            @change="computeTotalQuantity(index)"
                            controls-position="right"
                          />
                          <div v-if="index" class="mx-4px">~</div>
                          <el-input-number
                            v-if="index"
                            v-model="row.endBoxNumber"
                            clearable
                            @change="computeTotalQuantity(index)"
                            controls-position="right"
                          />
                        </div>
                      </template>

                      <span class="color-[--el-color-danger] font-size-12px">{{
                        formItemRefs[index]?.validateMessage
                      }}</span>
                    </el-popover>
                  </el-form-item>
                </el-form>
              </template>
              <template #options="{ index, row }">
                <SWTableBtns
                  ref="swTableBtnsRef"
                  :row="row"
                  :options="btnsOptions[index] || []"
                  :row-index="index"
                />
              </template>
              <template #sku="{ row, index }">
                <el-select
                  v-if="index"
                  v-model="row.sku"
                  popper-style="min-width: min-content"
                  class="!w-100%"
                  @change="(val) => handleChangeSku(val, index)"
                >
                  <el-option
                    v-for="item in skuOps.filter(ele => row.sku !== ele.value ? pendingPickNum.get(ele.value)! > 0 : true)"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  >
                    <div class="flex">
                      <span>{{ item.label }}</span>
                      <span class="!ml-4px color-#999">
                        ({{ pendingPickNum.get(item.value) }})
                      </span>
                    </div>
                  </el-option>
                </el-select>
              </template>

              <template #boxQuantity="{ index, row }">
                <el-tooltip :visible="row.showNotInBox" trigger="focus" placement="top">
                  <template #content>
                    <span v-if="row.endBoxNumber && row.startBoxNumber">
                      待装箱数：{{ notInBoxNumber[index] }}件
                    </span>
                    <span v-else>请输入箱号</span>
                  </template>

                  <div>
                    <sw-input-number
                      v-if="index"
                      v-model="row.boxQuantity"
                      clearable
                      @change="computeTotalQuantity(index)"
                      @focus="row.showNotInBox = true"
                      @blur="row.showNotInBox = false"
                    />
                  </div>
                </el-tooltip>
              </template>
            </sw-table>
          </div>
        </el-scrollbar>
      </el-card>
    </div>

    <template #footer>
      <el-button @click="(isShow = false), handleClosed()">取消</el-button>
      <el-button
        :loading="exportLoading"
        :disabled="exportLoading"
        type="primary"
        class="mlauto"
        @click="handleExport"
      >
        导出
      </el-button>
      <el-button
        type="primary"
        :loading="saveLoading"
        :disabled="saveLoading"
        @click="handleSave()"
      >
        保存
      </el-button>
      <el-button
        type="primary"
        :loading="printLoading"
        :disabled="printLoading"
        @click="handleSaveAndPrint"
      >
        保存并打印
      </el-button>
    </template>
  </s-w-drawer>

  <preview-dialog
    ref="previewRef"
    v-model:model-value="previewDialogOps.modelValue"
    :id="rowData.id || ''"
  />
</template>
<script setup lang="tsx">
import { pickingListOps } from '../options'
import {
  exportPackingListApi,
  getScAdvancedShippingRequestOrderDetailListApi,
  getScPackingListApi,
  saveOrUpdateScPackingListApi
} from '@/api/supplier/appoint'
import SwTable from '../../components/table.vue'
import { FormInstance, FormItemInstance, FormRules } from 'element-plus'
import { cloneDeep } from 'lodash-es'
import previewDialog from './previewdialog.vue'
import { AuditBtn } from '../../changeAudit/option'
import { toReactive } from '@vueuse/core'
import download from '@/utils/download'
import { formatDate } from '@/utils/formatTime'

const props = defineProps<{
  rowData: Supplier.Purchase.ListItem
}>()

const message = useMessage()

const loading = ref(false)
const drawerRef = ref()
const isShow = ref(false)
const tableData = ref<Supplier.Appoint.ScPackingListVo[]>([])
const rules: FormRules = {
  boxQuantity: { required: true, message: '请输入' },
  sku: { required: true, message: '请选择' }
}
const saveLoading = ref(false)
const printLoading = ref(false)
const skuOps = ref<{ label: string; value: string; deliveryGoodsQuantity: number }[]>([])
const tableRef = ref()
const formRefs = ref<FormInstance[]>([])
const formItemRefs = ref<FormItemInstance[]>([])

const previewDialogOps = reactive<{
  modelValue: boolean
  params?: any
}>({
  modelValue: false
})

const filters = reactive({
  sku: [] as string[],
  goodsCode: [] as string[]
})

/**计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map((_, index) => {
    if (index) {
      const hideBtns: AuditBtn[] = [
        new AuditBtn('新增', handleAddItem),
        new AuditBtn('删除', handleRemove, { type: 'danger' })
      ]
      return toReactive(hideBtns)
    } else {
      return []
    }
  })
)

const notInBoxNumber = computed(() =>
  skuOps.value.map((row) => {
    const sameSkuRows = tableData.value.filter((ele) => ele.sku === row.value)
    const inBoxNumber =
      sameSkuRows.reduce(
        (arr, cur) =>
          arr + (cur.boxQuantity ?? 0) * ((cur.endBoxNumber ?? 0) - (cur.startBoxNumber ?? 0) + 1),
        0
      ) || 0

    return row.deliveryGoodsQuantity - inBoxNumber
  })
)

const pendingPickNum = computed(
  () => new Map(notInBoxNumber.value.map((ele, index) => [skuOps.value[index].value, ele]))
)

/** 获取详情 */
async function getDetail() {
  loading.value = true

  function computedTableData(list: any[]) {
    const sum = {
      totalQuantity: list.reduce((arr, cur) => arr + (cur.totalQuantity ?? 0), 0) || 0,
      key: 'sumRow',
      boxNum:
        list.reduce(
          (arr, cur) => arr + Math.abs((cur.endBoxNumber ?? 0) - (cur.startBoxNumber ?? 0)) + 1,
          0
        ) || 0
    }
    list.unshift(sum)

    tableData.value = list
  }

  try {
    const res1 = await getScPackingListApi({
      advancedShippingRequestOrderId: props.rowData.id!
    })
    const res2 = await getScAdvancedShippingRequestOrderDetailListApi({
      advancedShippingRequestOrderId: props.rowData.id!
    })
    const list = res1?.scPackingListVos || []
    computedTableData(cloneDeep(list.length ? list : res2))
    list.length ||
      tableData.value.forEach((row) => (row.advancedShippingRequestOrderDetailId = row.id))
    if (res2) skuOps.value = res2.map((item) => ({ ...item, label: item.sku, value: item.sku }))
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

async function open() {
  isShow.value = true
  await nextTick()
  getDetail()
}

async function validateAll() {
  const results = await Promise.all(
    formRefs.value.map(async (ele) => {
      if (!ele) return Promise.reject(false)
      try {
        await ele.validate()
        return true
      } catch (error) {
        return Promise.reject(false)
      }
    })
  )
  return results.every((res) => res)
}

async function handleSave(isMessage: boolean = true) {
  const validateRes = await Promise.all([
    tableRef.value?.validateFileds(undefined, undefined, [0]),
    validateAll()
  ])

  if (!validateRes[0] && !validateRes[1]) return false
  isMessage && (saveLoading.value = true)
  try {
    const params = [...tableData.value]
    params.shift()
    const res = await saveOrUpdateScPackingListApi({
      advancedShippingRequestOrderId: props.rowData.id,
      printFlag: 0,
      scPackingListVos: params
    })

    if (res.success) {
      isMessage && message.success('保存成功')
      drawerRef.value.handleClose()
    }
  } catch (error) {
    return false
  } finally {
    saveLoading.value = false
  }
}

const exportLoading = ref(false)
async function handleExport() {
  exportLoading.value = true
  try {
    await handleSave(false)
    const res = await exportPackingListApi(props.rowData.id!)
    download.excel(res, `装箱单导出-${formatDate(new Date(), 'YYYYMMDDHHmmss')}.xlsx`)
    message.success('导出成功')
  } catch (error) {
  } finally {
    exportLoading.value = false
  }
}

async function handleSaveAndPrint() {
  try {
    const validateRes = await Promise.all([
      tableRef.value?.validateFileds(undefined, undefined, [0]),
      validateAll()
    ])

    if (!validateRes[0] && !validateRes[1]) return false
    printLoading.value = true
    const params = [...tableData.value]
    params.shift()
    const res = await saveOrUpdateScPackingListApi({
      advancedShippingRequestOrderId: props.rowData.id,
      printFlag: 1,
      scPackingListVos: params
    })
    if (res.success) {
      previewDialogOps.modelValue = true
    }
  } catch (error) {
    console.log(error)
  } finally {
    printLoading.value = false
  }
}

function handleClosed() {
  tableData.value = []
  isShow.value = false
}

function handleAddItem(_, index: number) {
  const data = [...tableData.value]
  data.splice(index + 1, 0, {})
  tableData.value = [...data]
}

function handleRemove(_, index: number) {
  tableData.value.splice(index, 1)
}

function computeTotalQuantity(index: number) {
  const target = tableData.value[index]
  if (tableData.value[0].totalQuantity)
    tableData.value[0].totalQuantity -= target.totalQuantity || 0
  if (!target.startBoxNumber || !target.endBoxNumber || !target.boxQuantity)
    target.totalQuantity = 0
  else
    target.totalQuantity =
      ((+target.endBoxNumber || 0) - (+target.startBoxNumber || 0) + 1) * (+target.boxQuantity || 0)
  tableData.value[0].totalQuantity = tableData.value
    .filter((_, index) => index !== 0)
    .reduce((arr, cur) => arr + (cur.totalQuantity || 0), 0)
}

async function handleChangeSku(val: string, index: number) {
  if (!val) return

  const res = await getScAdvancedShippingRequestOrderDetailListApi({
    advancedShippingRequestOrderId: props.rowData.id!,
    sku: val
  })

  if (!res) return

  tableData.value[index] = Object.assign(tableData.value[index], res[0], {
    advancedShippingRequestOrderDetailId: res[0].id
  })
}

defineExpose({ open })
</script>

<style lang="less" scoped>
@import url('../../index.scss');

.drawer-wrapper {
  flex: 1;
  overflow: hidden;
  border-radius: 8px;
}

:deep(.el-drawer) {
  min-width: 500px;
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
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

:deep(.cell) {
  // display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-table) {
  .el-input-number {
    width: auto;
  }
  .el-input {
    --el-input-width: 80;
    --el-date-editor-width: 150px;
  }
}

.el-divider {
  width: calc(100% + 40px);
  margin: 20px -20px;
}

.boxNumber {
  display: flex;
  align-items: center;
}

:deep(.cell) {
  overflow: visible !important;
}
</style>

<style lang="less">
.drawer-body {
  display: flex;
  flex-direction: column;
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
  padding-bottom: 0 !important;

  .el-form {
    .el-form-item__content {
      .el-input__wrapper,
      .el-select__wrapper {
        width: auto;
      }
    }
  }
}

.drawer-footer {
  padding-bottom: 10px;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
  z-index: 999;
}
</style>
