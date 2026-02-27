<template>
  <SWDrawer
    :model-value="modelValue"
    :width="width"
    :title="title"
    body-class="!overflow-x-hidden"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-row :gutter="20" class="content" :class="{ isShowDetail: isShowDetail }">
      <el-col :span="12">
        <el-card shadow="never">
          <sw-table
            :options="tableOptions"
            :data="tableData"
            :loading="loading"
            :cell-class-name="cellClassName"
            :show-overflow-tooltip="true"
            :btns-options="btnsOptions"
            :loading-btns="['导出']"
            @cell-click="handleCellClick"
          />

          <div class="w100% mt20px flex justify-between">
            <div v-if="isShowTotal" class="flex items-center font-size-14px">
              <span v-for="item in summaryItems" :key="item.prop">
                <span class="color-#666 mr-1.5">{{ item.label }}</span>
                <span class="fw-600 mr-3">{{
                  new Intl.NumberFormat().format(summary?.[item.prop] ?? 0)
                }}</span>
              </span>
            </div>
            <!-- 分页 -->
            <Pagination
              :total="total"
              v-model:page="queryParams.pageNum"
              v-model:limit="queryParams.size"
              @pagination="getList"
            />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <el-button
            v-if="fromClick"
            link
            type="primary"
            class="mb20px"
            @click="isShowDetail = false"
          >
            <img src="@/assets/svgs/supplier/arrow-left.svg" alt="" />
            返回
          </el-button>
          <PoDetail
            ref="detailRef"
            :rowData="rowData"
            :api="detailTableOptions.api"
            :table-options="detailTableOptions.option"
            :params="detailTableOptions.params"
            :is-not-page="!!isNotPage"
          />
        </el-card>
      </el-col>
    </el-row>

    <template #footer>
      <el-button class="mr20px" @click="emit('update:model-value', false)">关闭</el-button>
    </template>
  </SWDrawer>

  <!-- 物流信息 -->
  <logistics-dialog
    v-model:is-show="logisticDialogOption.isShow"
    :asr-code="logisticDialogOption.rowData.advancedShippingRequestOrderNo"
    :asr-id="logisticDialogOption.rowData.id"
    :logisticsRecordFlag="logisticDialogOption.rowData.logisticsRecordFlag"
    read-only
  />
</template>
<script lang="ts" setup>
const SwTable = defineAsyncComponent(() => import('@/views/supplier/components/table.vue'))
import PoDetail from './PoDetail.vue'
import { ASRTableDetail, detailTable, PoTableDetail, RKTableDetail } from '../purchase/options'
import {
  getCheckInfo,
  getScASRPageDetail,
  getScPoPageDetail,
  getScStockInPageDetail
} from '@/api/supplier/purchase'
import { toReactive } from '@vueuse/core'
import { getAdvancedShippingRequestOrderById } from '@/api/supplier/appointAudit'
import { addPurchaseTable } from '../appointmentAudit/options'
import { AuditBtn } from '../changeAudit/option'
const LogisticsDialog = defineAsyncComponent(() => import('./logisticDialog.vue'))

const props = withDefaults(
  defineProps<{
    prId?: string
    poId?: string
    prName?: string
    modelValue: boolean
    tableOptions: TableOption
    api: (params: any) => Promise<any>
    title: string
    type: '1' | '2' | '3' | '4' | '5'
    openType?: 'click' | 'popover'
    asrId?: string
    width?: number | string
    isNotPage?: string | boolean
    params?: any
  }>(),
  {
    openType: 'click',
    width: 1085
  }
)

const emit = defineEmits(['update:model-value'])

const queryParams = reactive({
  pageNum: 1,
  size: 10
})
const tableData = ref<Supplier.Purchase.ListItem[]>([])
const total = ref(0)
const loading = ref(false)
const currentPoDrawerType = ref('')
const isShowDetail = ref(false)
const rowData = ref<any>()
const canClickColumn = ['货品数量', '采购数量', '发货数量', '入库数量']
const detailRef = ref()
const fromClick = computed(() => props.openType === 'click')
const logisticDialogOption = reactive({
  isShow: false,
  rowData: {} as Supplier.Purchase.ListItem
})
const summary = ref({
  purchasedGoodsQuantityTotal: 0,
  goodKindsTotal: 0,
  deliveryGoodsQuantityTotal: 0,
  inboundGoodsQuantityTotal: 0,
  stockInTotal: 0
})
const summaryLabel = {
  purchasedGoodsQuantityTotal: '总采购量',
  goodKindsTotal: '款数',
  deliveryGoodsQuantityTotal: '总发货量',
  inboundGoodsQuantityTotal: '总入库量',
  stockInTotal: '总货品数',
  goodsDeliveryQuantityTotal: '总已发货数量',
  goodsUnDeliveryQuantityTotal: '总未发货数'
}
const summaryItems = computed(() => {
  return Object.keys(summary.value)
    .map((key) => ({
      prop: key,
      label: summaryLabel[key]
    }))
    .filter((ele) => ele.label)
})
const isShowTotal = ref(false)

async function handleOpen() {
  fromClick.value && getList()
  await nextTick()
  !fromClick.value && detailRef.value?.getList()
}

const detailTableOptions = computed(() => {
  let option: TableOption = []
  let api: (params: any) => Promise<any> | any = () => {}
  let params: any
  switch (props.type) {
    case '1':
      option = PoTableDetail
      api = getScPoPageDetail
      params = { poId: props.poId ?? rowData.value?.id, prId: props.prId }
      !fromClick.value && delete params.poId
      break
    case '2':
      option = ASRTableDetail
      api = getScASRPageDetail
      params = { asrId: props.asrId ?? rowData.value?.id, prId: props.prId, poId: props.poId }
      !fromClick.value && delete params.asrId
      break
    case '3':
      option = RKTableDetail
      api = getScStockInPageDetail
      params = {
        prId: props.prId,
        id: rowData.value?.id,
        type: rowData.value?.type,
        poId: props.poId,
        asrId: props.asrId
      }
      break
    case '4':
      option = detailTable
      api = getCheckInfo
      params = {
        scPurchaseRequestOrderId: props.prId
      }
      break
    case '5':
      option = addPurchaseTable.map((item, index) => {
        if (!index) {
          item.indexMethod = undefined
        }
        return item
      })
      api = getAdvancedShippingRequestOrderById
      params = props.asrId
      break
  }
  return { option, api, params }
})

const btnsOptions = computed(() =>
  tableData.value.map(({ logisticsRecordFlag }) => {
    const btns: AuditBtn[] = []

    btns.push(new AuditBtn('物流信息', handleLogistics))

    if (!logisticsRecordFlag) {
      const target = btns.find((ele) => ele.label === '物流信息')
      if (target) {
        target.disabled = true
        target.disabledDesc = '当前预约发货单未填写物流信息'
      }
    }
    return toReactive(btns)
  })
)

function handleLogistics(row) {
  logisticDialogOption.isShow = true
  logisticDialogOption.rowData = { ...row }
}

async function getList() {
  try {
    loading.value = true
    isShowTotal.value = false
    const params = props.isNotPage
      ? props[props.isNotPage as string]
      : {
          ...queryParams,
          ...props.params,
          prId: props.prId,
          poId: props.poId,
          asrId: props.asrId
        }

    const res = await props.api(params)
    tableData.value = res.records
    total.value = res.total
    summary.value = res.extras.summary
    isShowTotal.value = true
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleClose() {
  emit('update:model-value', false)
  isShowDetail.value = false
  tableData.value = []
  Object.assign(summary.value, {})
}

async function handleCellClick(row: Supplier.Purchase.ListItem, column: any) {
  if (!row[column.rawColumnKey]) return
  if (![...canClickColumn].includes(column.label)) return

  if (canClickColumn.includes(column.label)) {
    currentPoDrawerType.value = column.label
    isShowDetail.value = true
    rowData.value = toReactive(row)
    await nextTick()
    detailRef.value.getList()
  }
}

/** 自动打开detail */
function autoOpenDetail() {
  isShowDetail.value = true
}

function cellClassName({ column, row }) {
  if (
    row[column.rawColumnKey] &&
    !/\,/.test(row[column.rawColumnKey]) &&
    canClickColumn.includes(column.label)
  )
    return 'can-click-cell'
  else return ''
}

defineExpose({ autoOpenDetail })
</script>
<style lang="less" scoped>
@import url('../index.scss');

.content {
  width: calc(200% + 40px);
  transition: all 0.3s;

  &.isShowDetail {
    transform: translateX(-50%);
  }
}

:deep(.el-card) {
  border: 0;
}

:deep(.el-pagination) {
  margin: 0;
  // margin-bottom: 0;
  float: none;
}
</style>
