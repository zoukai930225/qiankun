import { formatDate } from '@/utils/formatTime'
import { copyBtn, goodsNosFormatter, person, persons, statusDom } from '../components/twoFourSix'
import { allOrderStatusOps } from '../product/options'
import { ElScrollbar } from 'element-plus'

const originStatusOptions = [...allOrderStatusOps]

export const statusOps = function () {
  const TARGET_ORDER_STATUS_VALUES = ['13', '16', '18', '19', '191', '192', '193', '20', '30']
  if (!Array.isArray(originStatusOptions)) return []

  const statusMap = new Map(originStatusOptions.map((ele) => [ele.value, ele]))

  return TARGET_ORDER_STATUS_VALUES.map((value) => statusMap.get(value)).filter(
    (status) => status !== undefined
  )
}

/** 免检审核流程状态 */
export const QCStatusOptions = [
  { label: '审核中', value: '10', color: '#0064ff', bg: '#0064ff20' },
  { label: '审核通过', value: '11', color: '#349B34', bg: '#349B3420' },
  { label: '审核驳回', value: '12', color: '#eb3737', bg: '#eb373720' },
  { label: '已撤回', value: '20', color: '#333333', bg: '#E8E8E8' }
]

export const mainTable: TableOption = [
  { type: 'selection', minWidth: 40, fixed: 'left', showOverFlowTooltip: false },
  {
    label: '生产订单号',
    prop: 'scPurchaseOrderNo',
    minWidth: 130,
    formatter: copyBtn,
    fixed: 'left'
  },
  { label: '供应商', prop: 'supplierName', minWidth: 130 },
  {
    label: '货品编码',
    prop: 'goodsCode',
    minWidth: 110,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '货品数', prop: 'goodsQuantity', minWidth: 80 },
  { label: '采购数量', prop: 'purchasedGoodsQuantityTotal', minWidth: 90 },
  { label: '已发货', prop: 'goodsDeliveryQuantityTotal', minWidth: 80 },
  {
    label: '已退货',
    prop: 'goodsStockOutQuantityTotal',

    transform: (col) => col ?? 0
  },
  { label: '未发货', prop: 'unshippedQuantityTotal', minWidth: 80 },
  {
    label: '产前样日期',
    prop: 'productBeforeDate',
    minWidth: 130,
    transform: (col) => (col ? formatDate(col, 'YYYY-MM-DD') : '--')
  },
  {
    label: '合同首批日期',
    prop: 'firstBatchTime',
    minWidth: 130,
    transform: (col) => (col ? formatDate(col, 'YYYY-MM-DD') : '--')
  },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 130,
    transform: (col) => (col ? formatDate(col, 'YYYY-MM-DD') : '--')
  },
  { label: '状态', prop: 'status', minWidth: 150, formatter: statusDom(statusOps()) },
  { label: '跟单人', prop: 'orderHandlerList', minWidth: 130, formatter: persons },
  { label: '创建人', prop: 'createUser', minWidth: 130, formatter: person },
  {
    label: 'QC质检员',
    prop: 'qcInspector',
    minWidth: 130,
    formatter: (_, __, cellValue) => (cellValue ? person(_, __, cellValue) : '--')
  },
  {
    label: '创建时间',
    prop: 'createAt',
    minWidth: 180,
    transform: (col) => formatDate(col, 'YYYY-MM-DD HH:mm:ss')
  },
  { label: '操作', type: 'options', fixed: 'right' }
]

/** 免检审核列表 */
export const exemptionTable: TableOption = [
  { label: '序号', type: 'index', width: 60, fixed: 'left' },
  { label: '申请人', prop: 'creatorInfo', minWidth: 130, formatter: person },
  { label: '申请时间', prop: 'createdAt', minWidth: 180 },
  {
    label: '申请原因',
    prop: 'reason',
    minWidth: 180,
    tooltipFormatter: ({ cellValue }) => {
      return (
        <ElScrollbar max-height="120px">
          <div class="w-200px whitespace-pre-wrap">{cellValue}</div>
        </ElScrollbar>
      )
    }
  },
  {
    label: '审核状态',
    prop: 'status',
    minWidth: 130,
    formatter: statusDom(QCStatusOptions),
    filterKey: 'statusLabel'
  },
  {
    label: '审核人',
    prop: 'reviewer',
    minWidth: 130,
    formatter: (_, __, cellValue) => (cellValue ? person(_, __, cellValue) : '--')
  },
  { label: '审核时间', prop: 'reviewTime', minWidth: 180, transform: (col) => col || '--' },
  { label: '操作', type: 'options' }
]
