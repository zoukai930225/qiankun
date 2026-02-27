<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle" custom-class="custom-drawer" width="73.3%">
    <el-card shadow="never" class="!border-0">
      <div class="title"> 采购生产单信息 </div>
      <el-divider />
      <el-form :model="formData" ref="queryFormRef" label-width="110">
        <el-row :gutter="6">
          <el-col :span="6">
            <el-form-item label="需求单编码：" prop="scPurchaseRequestOrderId">
              <el-input :model-value="formData?.scPurchaseOrderNo" disabled placeholder="--" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="需求单名称:" prop="scPurchaseRequestOrderName">
              <el-input
                :model-value="formData?.scPurchaseRequestOrderName"
                disabled
                placeholder="--"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="需求来源:" prop="requestSource">
              <el-select :model-value="formData?.requestSource" clearable placeholder="--" disabled>
                <el-option
                  v-for="{ value, label } in requestSourceOption"
                  :key="value"
                  :value="value"
                  :label="label"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="产前样时间:" prop="productBeforeDate">
              <el-date-picker
                :model-value="formData?.productBeforeDate"
                type="datetime"
                placeholder="--"
                value-format="YYYY-MM-DD HH:mm:ss"
                disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="需求单备注：">
              <s-text-area
                :model-value="formData?.scPrRemarks || '--'"
                :maxlength="500"
                :rows="5"
                show-word-limit
                disabled
                placeholder="--"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item label="生产单备注：">
              <s-text-area
                :model-value="formData?.scPoRemarks"
                :maxlength="500"
                :rows="5"
                show-word-limit
                disabled
                placeholder="--"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div class="title"> 采购需求单明细 </div>
      <el-divider />
      <div class="search-wapper">
        <el-form>
          <el-form-item label="SKU编码">
            <scroll-select
              class-name="!w-100%"
              v-model:model-value="sku"
              :api="getInfoBySku2"
              item-label-key="sku"
              item-value-key="sku"
              selectKey="sku"
              :multiple="true"
              clearable
              @change="onSearch"
            />
          </el-form-item>
        </el-form>
        <div class="action-wapper">
          <el-button class="commonSearchBtn" @click="onSearch">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button class="commonResetBtn" @click="resetBtn">重置</el-button>
        </div>
      </div>

      <!-- 添加表格引用 -->
      <el-table
        ref="tableRef"
        class="SWCommonTable"
        :data="dataList"
        v-loading="loading"
        row-class-name="commonTableRow"
        :header-cell-style="appStore.headerCellStyle"
        :max-height="tableMaxHeight"
        :tooltip-options="{ popperClass: 'cust_width' }"
      >
        <el-table-column type="index" width="80">
          <template #default="{ $index }">
            <div>{{ $index === 0 ? '合计' : $index }}</div>
          </template>
        </el-table-column>

        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.minWidth"
          :show-overflow-tooltip="true"
          :formatter="(row: any) => formatterValue(row, column.prop!, '-')"
          :fixed="column?.fixed ? 'right' : false"
        >
          <template v-if="column.prop === 'sku'" #default="{ row }">
            <el-button link class="copy-btn" @click="handleCopyCode(row.sku)">
              <span>{{ row.sku }}</span>
            </el-button>
          </template>

          <template v-else-if="column.prop === 'goodsCode'" #default="{ row }">
            <el-button link class="copy-btn" @click="handleCopyCode(row.goodsCode)">
              <span>{{ row.goodsCode }}</span>
            </el-button>
          </template>

          <template v-else-if="column.prop === 'imageUrl'" #default="{ row, $index }">
            <div class="picture" v-if="$index">
              <el-image
                fit="contain"
                :src="row.imageUrl"
                :style="{ height: '60px' }"
                :preview-src-list="[row.imageUrl]"
                preview-teleported
                lazy
                hide-on-click-modal
              >
                <template #error>
                  <img src="@/assets/imgs/supplier/defaultImg.svg" :style="{ width: '60px' }" />
                </template>
              </el-image>
            </div>
            <div v-else class="pt4 pb4">-</div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper">
        <Pagination
          :total="page.total"
          v-model:page="page.page"
          v-model:limit="page.size"
          @pagination="getTableData"
        />
      </div>
    </el-card>

    <template #footer>
      <el-button @click="reset">关闭</el-button>
    </template>
  </SWDrawer>
</template>

<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import * as shippingVerificationApi from '@/api/supplier/shippingVerification'
import { PageItem } from './Type'
import { formatterValue } from '@/utils'
import { useAppStore } from '@/store/modules/app'
import { nextTick } from 'vue'
import { getDictOptions, DICT_TYPE } from '@/utils/dict'
import { getInfoBySku2 } from '@/api/supplier/purchase'

const appStore = useAppStore()

const props = defineProps<{
  scPurchaseOrderId: string
  titleNo: string
}>()
const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
const sku = ref('')
const dataList = ref<any[]>([])
const loading = ref(false)
const page = ref<PageItem>({ ...new PageItem() })
const tableRef = ref() // 表格引用
const tableMaxHeight = ref(400) // 动态高度
const requestSourceOption = computed(() => getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE))

const columns: TableOption = [
  { label: '图片', prop: 'imageUrl', minWidth: 100 },
  { label: '货品编码', prop: 'goodsCode', minWidth: 80 },
  { label: '货品名称', prop: 'goodsName', minWidth: 120 },
  { label: 'SKU编码', prop: 'sku', minWidth: 120 },
  { label: '规格名称', prop: 'formName', minWidth: 120 },
  { label: '规格码', prop: 'formCode', minWidth: 120 },
  { label: '合同首批日期', prop: 'firstOrderTime', minWidth: 140 },
  { label: '合同清单日期', prop: 'orderArrivalTime', minWidth: 140 },
  { label: '采购数量', prop: 'purchasedGoodsQuantity', minWidth: 120, fixed: 'right' },
  { label: '已发货数量', prop: 'goodsDeliveryQuantity', minWidth: 120, fixed: 'right' },
  { label: '已入库数量', prop: 'goodsInboundQuantity', minWidth: 120, fixed: 'right' }
]

// 计算表格高度
const calculateTableHeight = () => {
  nextTick(() => {
    const windowHeight = window.innerHeight
    const drawerHeader = 60 // 抽屉头部高度
    const searchArea = 100 // 搜索区域高度
    const pagination = 80 // 分页高度
    const padding = 40 // 内边距

    tableMaxHeight.value = windowHeight - drawerHeader - searchArea - pagination - padding
  })
}

const getTableData = async () => {
  loading.value = true
  try {
    const { total, ...restPage } = page.value
    const requestParam = {
      sku: sku.value,
      scPurchaseOrderId: props.scPurchaseOrderId,
      ...restPage
    }
    const data = await shippingVerificationApi.paginQueryDetail(requestParam)
    dataList.value = (data.records || []).map((item: any) => ({
      ...item
    }))

    if (data.extras?.summary) {
      dataList.value.unshift(data.extras.summary)
    }

    page.value = { ...new PageItem(data) }

    // 数据更新后重新计算表格布局
    nextTick(() => {
      if (tableRef.value) {
        tableRef.value.doLayout()
      }
    })
  } finally {
    loading.value = false
  }
}

async function getInfo() {
  try {
    const res = await shippingVerificationApi.shipmentInspectionRequestDetail(
      props.scPurchaseOrderId
    )

    formData.value = res
  } catch (error) {}
}

const formData = ref<any>()

// 监听窗口大小变化
onMounted(() => {
  calculateTableHeight()
  window.addEventListener('resize', calculateTableHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateTableHeight)
})

function handleCopyCode(val: string) {
  const textarea = document.createElement('textarea')
  textarea.value = val
  document.body.appendChild(textarea)
  textarea.select()
  textarea.setSelectionRange(0, textarea.value.length)
  document.execCommand('copy')
  document.body.removeChild(textarea)
  message.success('复制成功')
}

const formRef = ref()
const open = async (type, id) => {
  console.log('id', id)
  reset()
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = props.titleNo

  if (id) {
    try {
      drawerLoading.value = true
      await getTableData()
      await getInfo()
    } finally {
      drawerLoading.value = false
    }
  }

  // 打开抽屉后重新计算表格高度
  nextTick(() => {
    calculateTableHeight()
  })
}

const onSearch = () => {
  page.value.page = 1 // 搜索时重置到第一页
  getTableData()
  getInfo()
}

const resetBtn = () => {
  sku.value = ''
  onSearch() // 重置后重新搜索
}

const reset = () => {
  formRef.value?.resetFields()
  drawerVisible.value = false
}

const emits = defineEmits(['success', 'handleRefresh', 'getRole'])
defineExpose({ open })
</script>

<style lang="less" scoped>
@import url(../../index.scss);

.search-wapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 0px;
  margin-bottom: 16px;
}

:deep(.el-drawer__footer) {
  display: none !important;
}

:deep(.el-card) {
  border: none;
  border-radius: 8px;
}

:deep(.upload_info .file_list .file_card .file_icon .img) {
  box-shadow: 0 0 0 0 !important;
}

.card-content {
  width: calc(100% - 0px);
  padding-right: 0px;
}

.textWapper {
  :deep(.el-form-item__label) {
    width: 80px;
    line-height: 16px !important;
    text-align: right;
  }
}

.content {
  height: 100%;
  display: flex;
  flex-direction: column;
}

// 修复表格滚动条样式
:deep(.SWCommonTable) {
  flex: 1;

  .el-table__body-wrapper {
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;

      &:hover {
        background: #a8a8a8;
      }
    }
  }

  // 修复固定列样式
  .el-table__fixed-right {
    height: 100% !important;
    box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  }

  // 确保固定列与主体对齐
  .el-table__fixed-body-wrapper {
    height: auto !important;
  }
}

.pagination-wrapper {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.handle-content {
  margin-top: 10px;
  margin-bottom: 10px;
}

.title-wapper {
  width: calc(100% - 20px);
  height: 52px;
  border-bottom: 1px #f0f0f0 solid;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  padding-left: 20px;

  span {
    font-size: 14px;
    font-weight: 600;
    position: relative;
    margin-left: 25px;
  }

  span::before {
    content: '';
    width: 3px;
    height: 13px;
    background-color: #0064ff;
    position: absolute;
    left: -20px;
    top: 1px;
  }
}

.expand-body {
  cursor: pointer;
  color: var(--el-color-primary);
  display: inline-block;
  position: absolute;
  right: 50px;
  top: 25px;
  font-size: 14px;

  .expand-icon {
    position: absolute;
    right: -20px;
    top: -2px;
  }
}

// 图片样式调整
.picture {
  display: flex;
  justify-content: center;
  align-items: center;

  :deep(.el-image) {
    border-radius: 4px;
    overflow: hidden;
  }
}

.pt4 {
  padding-top: 4px;
}

.pb4 {
  padding-bottom: 4px;
}

:deep(.el-divider) {
  width: calc(100% + 40px);
  margin: 20px -20px;
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
</style>
