import { formatDate } from '@/utils/formatTime'
import {
  copyBtn,
  finishGoodsQuantityTotalDom,
  goodsNosFormatter,
  imgUrl,
  person,
  persons,
  statusDom
} from '../components/twoFourSix'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { hasTaxOptions } from '../supplierProduct/options'

const isPoAdd = /\/admin\/SC\/supplier\/product\/add/.test(window.location.href)

export const SORT_COLUMN = ['latestArrivalTime']

export const AUDIT_STATUS = [
  { label: '待审核', value: '0', sumKey: 'waitAudit' },
  { label: '已审核', value: '1', sumKey: 'alreadyAudit' },
  { label: '全部', value: '2', sumKey: 'all' }
]

export const statusOps = [
  { label: '审核中', value: '4', color: '#ae00ffff', bg: '#ae00ff20' },
  { label: '审核不通过', value: '7', color: '#eb3737', bg: '#eb373720' },
  { label: '未开始', value: '10', color: '#333333', bg: '#E8E8E8' },
  { label: '生产中', value: '20', color: '#CD8200', bg: '#FFF4C8' },
  { label: '已清单', value: '30', color: '#349B34', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '手动结单', value: '40', color: '#0064FF', bg: 'rgba(0, 100, 255, 0.2)' },
  { label: '变更中', value: '99', color: '#3E47FA', bg: '#E6E8FF' }
]

export const allOrderStatusOps = [
  { label: '未提交', value: '0', color: '#606266', bg: '#60626620' },
  { label: '审核中', value: '4', color: '#ae00ffff', bg: '#ae00ff20' },
  { label: '审核不通过', value: '7', color: '#eb3737', bg: '#eb373720' },
  { label: '待排产', value: '10', color: '#9737ebff', bg: 'rgba(242, 227, 255, 1)' },
  { label: '工厂确认', value: '13', color: '#05a2adff', bg: '#05a2ad20' },
  { label: '待签约', value: '14', color: '#0064ff', bg: '#0064ff20' },
  { label: '产前样审核中', value: '16', color: '#ae00ffff', bg: '#ae00ff20' },
  { label: '产前样审核通过', value: '18', color: '#349b34', bg: '#349b3420' },
  { label: '待质检', value: '19', color: '#05a2adff', bg: '#05a2ad20' },
  { label: '免检审核', value: '191', color: '#0064ff', bg: '#0064ff20' },
  { label: '免检驳回', value: '192', color: '#eb3737', bg: '#eb373720' },
  { label: '质检通过', value: '193', color: '#349b34', bg: '#349b3420' },
  { label: '已发货', value: '20', color: 'rgba(241, 80, 16, 1)', bg: 'rgba(255, 203, 182, 1)' },
  { label: '部分到货', value: '30', color: 'rgba(235, 55, 130, 1)', bg: 'rgba(255, 219, 219, 1)' },
  { label: '已清单', value: '40', color: '#349b34', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '手动结单', value: '50', color: 'rgba(0, 100, 255, 1)', bg: 'rgba(0, 100, 255, 0.2)' },
  { label: '变更中', value: '99', color: '#3E47FA', bg: '#E6E8FF' }
]

export const auditSelectStatusOps = (function () {
  const statusMap = new Map(allOrderStatusOps.map((ele) => [ele.label, ele]))
  statusMap.delete('未提交')
  statusMap.delete('编辑中')
  return Array.from(statusMap.values())
})()

/** 我的订单列表 */
export const purchaseTable: TableOption = [
  { type: 'selection', fixed: 'left', showOverFlowTooltip: false },
  {
    label: '订单编码',
    prop: 'scPurchaseRequestOrderNo',
    fixed: 'left',
    minWidth: 120,
    formatter: copyBtn
  },
  {
    label: '需求来源',
    prop: 'requestSource',
    transform: (col) => getDictLabel(DICT_TYPE.SC_PR_REQUEST_SOURCE, col),
    minWidth: 85
  },
  { label: '需求名称', prop: 'scPurchaseRequestOrderName', fixed: 'left', minWidth: 150 },
  {
    label: '货品编码',
    prop: 'goodsNos',
    minWidth: 100,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '货品数', prop: 'goodsNumTotal', minWidth: 80 },
  { label: '补单量', prop: 'goodsQuantityTotal', minWidth: 100 },
  {
    label: '已下单',
    prop: 'goodsPlaceQuantityTotal',

    transform: (col) => col ?? 0,
    minWidth: 100
  },
  {
    label: '已发货',
    prop: 'goodsDeliveryQuantityTotal',

    transform: (col) => col ?? 0,
    minWidth: 100
  },
  {
    label: '已入库',
    slotName: 'finishGoodsQuantityTotalNum',
    prop: 'finishGoodsQuantityTotal',

    transform: (col) => col ?? 0,
    minWidth: 100
  },
  {
    label: '已退货',
    prop: 'goodsStockOutQuantityTotal',

    transform: (col) => col ?? 0
  },
  {
    label: '完成进度',
    prop: 'finishGoodsQuantityTotal',
    minWidth: 200,
    showOverFlowTooltip: false,
    formatter: finishGoodsQuantityTotalDom('goodsQuantityTotal')
  },
  { label: '最晚清单时间', prop: 'latestTime', minWidth: 110 },
  { label: '状态', prop: 'status', formatter: statusDom(statusOps), minWidth: 100 },
  { label: '跟单人', prop: 'orderHandlerList', minWidth: 140, formatter: persons },
  { label: '创建人', prop: 'createUser', minWidth: 130, formatter: person },
  { label: '创建时间', prop: 'createdAt', minWidth: 170 },
  { label: '审核人', prop: 'reviewer', minWidth: 150, formatter: persons },
  { label: '操作', type: 'options', fixed: 'right' }
]

/** 我的采购生产订单列表 */
export const myOrderTable: TableOption = [
  {
    label: '生产订单号',
    prop: 'scPurchaseOrderNo',
    fixed: 'left',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '需求来源',
    prop: 'requestSource',
    transform: (col) => getDictLabel(DICT_TYPE.SC_PR_REQUEST_SOURCE, col),
    minWidth: 85
  },
  {
    label: '采购需求单',
    prop: 'scPurchaseRequestOrderNo',
    fixed: 'left',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '供应商',
    prop: 'supplier',
    minWidth: 110,
    tooltipFormatter({ row }) {
      return h('div', null, ...(row.supplier as string).split(',').map((item) => <div>{item}</div>))
    }
  },
  {
    label: '货品编码',
    prop: 'goodsNos',
    minWidth: 110,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '货品数', prop: 'goodsNumTotal' },
  { label: '采购数量', prop: 'purchasedGoodsQuantityTotal', minWidth: 100 },
  { label: '已发货', prop: 'goodsDeliveryQuantityTotal' },
  {
    label: '已入库',
    slotName: 'finishGoodsQuantityTotalNum',
    prop: 'finishGoodsQuantityTotal',
    transform: (col) => col ?? 0
  },
  { label: '已退货', prop: 'goodsStockOutQuantityTotal' },
  { label: '未发货', prop: 'goodsUnDeliveryQuantityTotal' },
  {
    label: '完成进度',
    prop: 'finishGoodsQuantityTotal',
    minWidth: 200,
    showOverFlowTooltip: false,
    formatter: finishGoodsQuantityTotalDom('purchasedGoodsQuantityTotal')
  },
  {
    label: '产前样日期',
    prop: 'productBeforeDate',
    minWidth: 160,
    transform: (col) => formatDate(col, 'YYYY-MM-DD') ?? '--'
  },
  { label: '合同首批日期', prop: 'firstBatchTime', minWidth: 120, transform: (col) => col ?? '--' },
  { label: '合同清单日期', prop: 'latestArrivalTime', minWidth: 130 },
  { label: '最晚交货时间', prop: 'latestTime', minWidth: 120 },
  {
    label: '状态',
    prop: 'status',
    formatter: statusDom(allOrderStatusOps),
    minWidth: 140
  },
  { label: '跟单人', prop: 'orderHandler', minWidth: 100, formatter: person },
  { label: '创建人', prop: 'createUser', minWidth: 130, formatter: person },
  { label: '创建时间', prop: 'createdAt', minWidth: 180 },
  { label: '审核人', prop: 'pendingReviewers', minWidth: 150, formatter: persons },
  { label: '操作', type: 'options', fixed: 'right' }
]

/** 全部采购生产订单列表 */
export const allOrderTable: TableOption = [
  // { type: 'selection', fixed: 'left' },
  {
    label: '生产订单号',
    prop: 'scPurchaseOrderNo',
    fixed: 'left',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '采购需求单',
    prop: 'scPurchaseRequestOrderNo',
    fixed: 'left',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '需求来源',
    prop: 'requestSource',
    transform: (col) => getDictLabel(DICT_TYPE.SC_PR_REQUEST_SOURCE, col),
    minWidth: 85
  },
  {
    label: '供应商',
    prop: 'supplier',
    minWidth: 110,
    tooltipFormatter({ row }) {
      return h('div', null, ...(row.supplier as string).split(',').map((item) => <div>{item}</div>))
    }
  },
  {
    label: '货品编码',
    prop: 'goodsNos',
    minWidth: 110,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '货品数', prop: 'goodsNumTotal', transform: (col) => col ?? 0 },
  {
    label: '采购数量',
    prop: 'purchasedGoodsQuantityTotal',
    transform: (col) => col ?? 0,
    minWidth: 90
  },
  {
    label: '已发货',
    prop: 'goodsDeliveryQuantityTotal',

    transform: (col) => col ?? 0
  },
  {
    label: '已入库',
    slotName: 'finishGoodsQuantityTotalNum',
    prop: 'finishGoodsQuantityTotal',

    transform: (col) => col ?? 0
  },
  {
    label: '已退货',
    prop: 'goodsStockOutQuantityTotal',

    transform: (col) => col ?? 0
  },
  {
    label: '未发货',
    prop: 'goodsUnDeliveryQuantityTotal',

    transform: (col) => col ?? 0
  },
  {
    label: '完成进度',
    prop: 'finishGoodsQuantityTotal',
    minWidth: 200,
    showOverFlowTooltip: false,
    formatter: finishGoodsQuantityTotalDom('purchasedGoodsQuantityTotal')
  },
  {
    label: '产前样日期',
    prop: 'productBeforeDate',
    minWidth: 160,
    transform: (col) => formatDate(col, 'YYYY-MM-DD') ?? '--'
  },
  { label: '合同首批日期', prop: 'firstBatchTime', minWidth: 120, transform: (col) => col ?? '--' },
  { label: '合同清单日期', prop: 'latestArrivalTime', minWidth: 130 },
  { label: '最晚交货时间', prop: 'latestTime', minWidth: 120 },
  {
    label: '状态',
    prop: 'status',
    formatter: statusDom(allOrderStatusOps),
    minWidth: 140
  },
  { label: '跟单人', prop: 'orderHandler', minWidth: 100, formatter: person },
  { label: '创建人', prop: 'createUser', minWidth: 130, formatter: person },
  { label: '创建时间', prop: 'createdAt', minWidth: 180 },
  { label: '审核人', prop: 'pendingReviewers', minWidth: 150, formatter: persons },
  { label: '操作', type: 'options', fixed: 'right' }
]

export const auditTable: TableOption = [
  {
    label: '生产订单号',
    prop: 'scPurchaseOrderNo',
    fixed: 'left',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '采购需求单',
    prop: 'scPurchaseRequestOrderNo',
    fixed: 'left',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '需求来源',
    prop: 'requestSource',
    transform: (col) => getDictLabel(DICT_TYPE.SC_PR_REQUEST_SOURCE, col),
    minWidth: 85
  },
  {
    label: '供应商',
    prop: 'supplier',
    minWidth: 110,
    tooltipFormatter({ row }) {
      return h('div', null, ...(row.supplier as string).split(',').map((item) => <div>{item}</div>))
    }
  },
  {
    label: '货品编码',
    prop: 'goodsNos',
    minWidth: 110,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '货品数', prop: 'goodsNumTotal' },
  { label: '采购数量', prop: 'purchasedGoodsQuantityTotal', minWidth: 90 },
  { label: '最晚交货时间', prop: 'latestArrivalTime', minWidth: 110 },
  {
    label: '待审核人',
    prop: 'pendingReviewers',
    width: 150,
    formatter: persons
  },
  {
    label: '状态',
    prop: 'auditStatus',
    transform: (col) => {
      switch (col) {
        case 0:
          return '待审核'
        case 1:
          return '已审核'
      }
    }
  },
  { label: '创建人', prop: 'createUser', formatter: person, minWidth: 110 },
  { label: '创建时间', prop: 'createdAt', minWidth: 170 },
  { label: '操作', type: 'options', fixed: 'right' }
]

export const allAuditTable: TableOption = (function () {
  const tableMap = new Map(auditTable.map((ele) => [ele.label, ele]))

  tableMap.set('状态', {
    ...tableMap.get('状态'),
    formatter: statusDom(allOrderStatusOps),
    prop: 'status',
    width: 130
  })

  // tableMap.delete('待审核人')

  return Array.from(tableMap.values())
})()

/** 新增/编辑 */
export const addPurchaseTable: TableOption = [
  {
    prop: 'index',
    fixed: 'left',
    label: '序号',
    minWidth: 60,
    indexMethod: (index) => index || '合计'
  },
  { prop: 'imgUrl', label: '图片', minWidth: 60, formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', showOverFlowTooltip: true, minWidth: 150 },
  {
    label: '货品编码',
    prop: 'goodsCode',
    showOverFlowTooltip: true,
    minWidth: 110,
    filterKey: 'goodsCode',
    formatter: copyBtn
  },
  {
    label: 'SKU编码',
    prop: 'sku',
    minWidth: 150,
    showOverFlowTooltip: true,
    filterKey: 'sku',
    formatter: copyBtn
  },
  { label: '规格名称', prop: 'formName', showOverFlowTooltip: true, minWidth: 150 },
  { label: '规格码', prop: 'formCode', showOverFlowTooltip: true, minWidth: 120 },
  { label: '迭代码', prop: 'iterateCode', showOverFlowTooltip: true, minWidth: 150 },
  { label: '补单量', prop: 'goodsQuantity', minWidth: 70 },
  { label: '剩余补单量', prop: 'remainingGoodsQuantity', minWidth: 100 },
  {
    label: '采购数量',
    prop: 'purchasedGoodsQuantityTotal',
    minWidth: 90
  },
  {
    label: '供应商',
    prop: 'purchasedGoodsQuantity',
    minWidth: 200,
    fixed: 'right',
    required: true,
    isForm: true,
    rules: (row, _, data) => ({
      required: true,
      validator: (_, value, callback) => {
        const sameSkuRows = data?.filter((ele) => row.sku === ele.sku)
        const purchasedGoodsQuantityTotal = sameSkuRows?.reduce(
          (arr, cur) => arr + (+cur.purchasedGoodsQuantity || 0),
          0
        )
        if (!value) return callback()
        if (Number(value) > Number(row.remainingGoodsQuantity) && isPoAdd)
          return callback(new Error('不能超过剩余补单量'))
        else if (purchasedGoodsQuantityTotal > row.remainingGoodsQuantity && isPoAdd)
          return callback(new Error('同款总和不能超过剩余补单量'))
        else if (row.goodsQuantity < value) return callback(new Error('采购数量不能超过补单量'))
        else return callback()
      }
    }),
    formLabel: (row: any) => row.supplierName,
    formLabelWidth: 150,
    showOverFlowTooltip: false,
    filterKey: 'supplierName'
  },
  {
    label: '裸货价',
    fixed: 'right',
    prop: 'baseProdCost',
    minWidth: 130,
    isForm: true,
    required: true
  },
  { label: '成品价', fixed: 'right', prop: 'fgCost', minWidth: 130, isForm: true, required: true },
  {
    label: '是否含税',
    fixed: 'right',
    prop: 'hasTax',
    minWidth: 110,
    formatter: statusDom(hasTaxOptions)
  },
  {
    label: '合同首批日期',
    prop: 'firstBatchTime',
    minWidth: 150,
    fixed: 'right',
    isForm: true,
    showOverFlowTooltip: false,
    rules: (row) => [
      {
        required: true,
        validator: (_, val, callback) => {
          let error: undefined | Error = undefined
          const orderArrivalTime = new Date(row.orderArrivalTime)
          const firstBatchTime = new Date(val)

          if (!val && !row.purchasedGoodsQuantity) error = undefined
          else if (row.orderArrivalTime && val && orderArrivalTime < firstBatchTime)
            error = new Error('首批日期需早于清单日期')

          callback(error)
        }
      }
    ]
  },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    fixed: 'right',
    minWidth: 150,
    required: true,
    isForm: true,
    showOverFlowTooltip: false,
    rules: (row) => ({
      required: true,
      validator: (_, value: string, callback) => {
        let error: undefined | Error = undefined
        const firstBatchTime = new Date(row.firstBatchTime)
        const orderArrivalTime = new Date(value)

        if (!row.purchasedGoodsQuantity) error = undefined
        else if (!value) error = new Error('请选择')
        else if (row.firstBatchTime && value && orderArrivalTime < firstBatchTime)
          error = new Error('首批日期需早于清单日期')

        callback(error)
      }
    })
  },
  { label: '需求清单时间', prop: 'orderItemTime', minWidth: 150 },
  { label: '首单时间', prop: 'firstOrderTime', minWidth: 150, transform: (col) => col ?? '--' }
]

/**预览 */
export const previewTableOption: TableOption = [
  { type: 'index', fixed: 'left', label: '序号', minWidth: 60 },
  { prop: 'imgUrl', label: '图片', minWidth: 60, formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', showOverFlowTooltip: true, minWidth: 150 },
  {
    label: '货品编码',
    prop: 'goodsCode',
    showOverFlowTooltip: true,
    minWidth: 110,
    formatter: copyBtn
  },
  {
    label: 'SKU编码',
    prop: 'sku',
    minWidth: 150,
    showOverFlowTooltip: true,
    formatter: copyBtn
  },
  { label: '规格名称', prop: 'formName', showOverFlowTooltip: true, minWidth: 150 },
  { label: '规格码', prop: 'formCode', showOverFlowTooltip: true, minWidth: 120 },
  { label: '迭代码', prop: 'iterateCode', showOverFlowTooltip: true, minWidth: 150 },
  { label: '补单量', prop: 'goodsQuantity', minWidth: 100 },
  {
    label: '剩余补单量',
    prop: 'remainingGoodsQuantity',
    minWidth: 100,

    transform: (col) => col || '--'
  },
  {
    label: '供应商',
    prop: 'supplierName',
    minWidth: 120,
    showOverFlowTooltip: false,
    fixed: 'right'
  },
  {
    label: '采购数量',
    prop: 'purchasedGoodsQuantity',
    minWidth: 90,
    fixed: 'right'
  },
  { label: '裸货价', fixed: 'right', prop: 'baseProdCost', minWidth: 80 },
  { label: '成品价', fixed: 'right', prop: 'fgCost', minWidth: 80 },

  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 120,
    showOverFlowTooltip: false,
    transform: (col) => (col ? formatDate(new Date(col), 'YYYY-MM-DD') : '--'),
    fixed: 'right'
  },
  {
    label: '需求清单时间',
    prop: 'orderItemTime',
    minWidth: 120,
    transform: (col) => (col ? formatDate(new Date(col), 'YYYY-MM-DD') : '--')
  },
  {
    label: '合同首批日期',
    prop: 'firstBatchTime',
    minWidth: 120,
    showOverFlowTooltip: false,
    transform: (col) => (col ? formatDate(new Date(col), 'YYYY-MM-DD') : '--'),
    fixed: 'right'
  },
  {
    label: '首单时间',
    prop: 'firstOrderTime',
    minWidth: 120,
    transform: (col) => (col ? formatDate(new Date(col), 'YYYY-MM-DD') : '--')
  }
]

/**变更申请 */
export const changeProductTable: TableOption = [
  { type: 'index', fixed: 'left', label: '序号', minWidth: 60 },
  { prop: 'imgUrl', label: '图片', minWidth: 60, formatter: imgUrl },
  {
    label: '货品名称',
    prop: 'goodsName',
    showOverFlowTooltip: true,
    minWidth: 150,
    transform: (col) => col || '--'
  },
  {
    label: '货品编码',
    prop: 'goodsCode',
    showOverFlowTooltip: false,
    minWidth: 100,
    formatter: goodsNosFormatter
  },

  {
    label: 'SKU编码',
    prop: 'sku',
    minWidth: 180,
    showOverFlowTooltip: true,
    required: true,
    isForm: true
  },
  {
    label: '规格名称',
    prop: 'formName',
    showOverFlowTooltip: true,
    minWidth: 150,
    transform: (col) => col || '--'
  },
  {
    label: '规格码',
    prop: 'formCode',
    showOverFlowTooltip: true,
    minWidth: 120,
    transform: (col) => col || '--'
  },
  {
    label: '迭代码',
    prop: 'iterateCode',
    showOverFlowTooltip: true,
    minWidth: 120,
    transform: (col) => col || '--'
  },
  {
    label: '采购数量',
    prop: 'purchasedGoodsQuantity',
    minWidth: 90,
    transform: (col) => col || 0
  },
  {
    label: '未发货',
    prop: 'remainingDeliveryQuantity',
    minWidth: 80,

    transform: (col) => col || 0
  },
  {
    label: '已发货',
    prop: 'goodsDeliveryQuantity',
    minWidth: 80,

    transform: (col) => col || 0
  },
  {
    label: '已入库',
    prop: 'goodsInboundQuantity',
    minWidth: 80,

    transform: (col) => col || 0
  },
  { label: '裸货价', prop: 'baseProdCost', minWidth: 80 },
  { label: '成品价', prop: 'fgCost', minWidth: 80 },
  {
    label: '合同首批日期',
    prop: 'firstBatchTime',
    minWidth: 180,
    transform: (col) => (col ? formatDate(col, 'YYYY-MM-DD') : '--'),
    isForm: true
  },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 180,
    transform: (col) => (col ? formatDate(col, 'YYYY-MM-DD') : '--'),
    isForm: true,
    required: true,
    fixed: 'right'
  },
  {
    label: '变更数量',
    prop: 'changeGoodsQuantity',
    minWidth: 200,
    fixed: 'right',
    required: true,
    isForm: true,
    rules: (row: any) => ({
      required: true,
      validator: (_, value, callback) => {
        if (Number(value) > Number(row.remainingDeliveryQuantity ?? 0) && row.isReduce)
          return callback(new Error('减少数量不能超过未发货数量'))
        if (!row.id && (value === undefined || value === null)) return callback(new Error('请输入'))
        callback()
      }
    })
  },
  { label: '操作', type: 'options', fixed: 'right' }
]

export const batchAddTableOps: TableOption = [
  { type: 'selection', fixed: 'left', showOverFlowTooltip: false },
  { prop: 'imgUrl', label: '图片', minWidth: 50 },
  { label: '货品名称', prop: 'goodsName' },
  { label: 'SKU编码', prop: 'sku', minWidth: 170 },
  { label: '规格名称', prop: 'specName' },
  { label: '规格码', prop: 'specCode' },
  { label: '迭代码', prop: 'iterateCode' }
]

export const myPurchaseDetailTableOps: TableOption = [
  {
    type: 'index',
    label: '序号',
    minWidth: 60,
    fixed: 'left'
  },
  {
    prop: 'imgUrl',
    label: '图片',
    minWidth: 50,
    formatter: (_, __, index) => (index ? imgUrl(_, __, index) : '')
  },
  { prop: 'goodsName', label: '货品名称', minWidth: 130 },
  {
    prop: 'goodsCode',
    label: '货品编码',
    minWidth: 100,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { prop: 'sku', label: 'SKU编码', minWidth: 130, formatter: copyBtn },
  { prop: 'formName', label: '规格名称', minWidth: 130 },
  { prop: 'formCode', label: '规格码', minWidth: 100 },
  { prop: 'iterateCode', label: '迭代码', minWidth: 130 },
  { prop: 'goodsQuantity', label: '补单量', minWidth: 80, fixed: 'right' },
  { prop: 'goodsPlaceQuantity', label: '已下单', minWidth: 80, fixed: 'right' },
  {
    prop: 'goodsDeliveryQuantity',
    label: '已发货',
    minWidth: 80,

    fixed: 'right'
  },
  { prop: 'goodsInboundQuantity', label: '已入库', minWidth: 80, fixed: 'right' },
  { label: '合同首批日期', prop: 'firstBatchTime', minWidth: 120, transform: (col) => col ?? '--' },
  { prop: 'orderItemTime', label: '需求清单时间', minWidth: 120 },
  { prop: 'firstOrderTime', label: '首单时间', minWidth: 120 }
]

export const allOrderDetailTableOps: TableOption = [
  { type: 'index', label: '序号', minWidth: 60, fixed: 'left' },
  { prop: 'imgUrl', label: '图片', minWidth: 60, formatter: imgUrl },
  { prop: 'goodsName', label: '货品名称', minWidth: 130 },
  {
    prop: 'goodsCode',
    label: '货品编码',
    minWidth: 100,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { prop: 'sku', label: 'SKU编码', minWidth: 130, formatter: copyBtn },
  { prop: 'formName', label: '规格名称', minWidth: 130 },
  { prop: 'formCode', label: '规格码', minWidth: 100 },
  { prop: 'iterateCode', label: '迭代码', minWidth: 130 },
  { label: '裸货价', fixed: 'right', prop: 'baseProdCost', minWidth: 80 },
  { label: '成品价', fixed: 'right', prop: 'fgCost', minWidth: 80 },
  {
    prop: 'purchasedGoodsQuantity',
    label: '采购数量',
    minWidth: 90,
    fixed: 'right'
  },
  {
    prop: 'goodsDeliveryQuantity',
    label: '已发货',
    minWidth: 80,

    fixed: 'right'
  },
  {
    prop: 'remainingDeliveryQuantity',
    label: '未发货',
    minWidth: 80,

    fixed: 'right'
  },
  { prop: 'goodsInboundQuantity', label: '已入库', minWidth: 80, fixed: 'right' },
  { prop: 'firstBatchTime', label: '合同首批日期', minWidth: 120 },
  { prop: 'realOrderArrivalTime', label: '实际到货时间', minWidth: 120 },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 120,
    transform: (col, { key }) => (key === 'sumRow' ? '' : col ?? '--')
  },
  { prop: 'orderItemTime', label: '需求清单时间', minWidth: 120 },
  { prop: 'firstOrderTime', label: '首单时间', minWidth: 120 }
]

export const changeTable: TableOption = [
  {
    type: 'index',
    label: '序号',
    indexMethod: (index) => index || '合计',
    minWidth: 60,
    fixed: 'left'
  },
  { prop: 'imgUrl', label: '图片', minWidth: 50, fixed: 'left' },
  { prop: 'goodsName', label: '货品名称', minWidth: 130, fixed: 'left' },
  { prop: 'goodsCode', label: '货品编码', minWidth: 100, fixed: 'left' },
  { prop: 'sku', label: 'SKU编码', minWidth: 130, fixed: 'left' },
  { prop: 'formName', label: '规格名称', minWidth: 130 },
  { prop: 'formCode', label: '规格码', minWidth: 100 },
  { prop: 'purchasedGoodsQuantity', label: '采购数量', minWidth: 90 },
  { prop: '', label: '未发货数量', minWidth: 80, fixed: 'right' },
  {
    prop: 'goodsDeliveryQuantity',
    label: '已发货',
    minWidth: 80,

    fixed: 'right'
  },
  { prop: 'goodsInboundQuantity', label: '已入库', minWidth: 80, fixed: 'right' },
  { prop: 'orderArrivalTime', label: '合同清单日期', minWidth: 200 },
  { prop: 'firstOrderTime', label: '期望首批到货时间', minWidth: 200 },
  { prop: '', label: '变更数量', minWidth: 200 }
]

const beforeProductStatusOps = [
  { label: '未提交', value: '1', color: '#666', bg: '#66666620' },
  { label: '审核中', value: '2', color: '#0064ff', bg: '#0064ff20' },
  { label: '审核通过', value: '3', color: '#349b34', bg: '#349b3420' },
  { label: '审核不通过', value: '4', color: '#eb3737', bg: '#eb373720' }
]

export const beforeProductList: TableOption = [
  { type: 'index', label: '序号', width: 60, showOverFlowTooltip: false, fixed: 'left' },
  { label: '图片', prop: 'imgUrl', formatter: imgUrl, minWidth: 60, fixed: 'left' },
  { label: 'SKU编码', prop: 'sku', isForm: true, minWidth: 200, fixed: 'left' },
  { label: '颜色', prop: 'formName', minWidth: 130 },
  { label: '规格码', prop: 'formCode', minWidth: 130 },
  {
    label: '审核状态',
    prop: 'auditStatus',
    minWidth: 130,
    formatter: statusDom(beforeProductStatusOps)
  },
  { label: '登记人', prop: 'updatedUser', minWidth: 130, formatter: person },
  { label: '登记时间', prop: 'updatedAt', minWidth: 180 },
  { label: '操作', type: 'options', minWidth: 150 }
]

export const contractPreviewTableOptions: TableOption = [
  { label: '商品名称', prop: 'goodsName', width: 270 },
  { label: '供应商货号', prop: 'providerGoodsNo' },
  { label: '商品编码', prop: 'sku', width: 170 },
  { label: '颜色', prop: 'formName' },
  { label: '尺寸', prop: 'formCode', width: 60 },
  { label: '数量', prop: 'purchasedGoodsQuantity', width: 100 },
  { label: '含税单价（元）', prop: 'price', width: 140, isForm: true },
  { label: '含税金额（元）', prop: 'amount', width: 130 },
  { label: '备注', prop: 'remark', showOverFlowTooltip: false }
]

export const RESPONSIBILITY = [
  {
    message:
      '乙方不能按时交货，延期2天以内，甲方按照原价收货，甲方会在供应商绩效考核中按实际延期天数计算。延期3-7天，乙方向甲方缴纳500元罚金，延期8~10天，按照逾期货物订单总额的97%支付货款，延期10天以上的按照逾期货物订单总额的95%支付货款，未经协商延期超过15天以上的，甲方有权单方面解除本协议，乙方应在收到甲方的解除通知之日起3日内将已付货款全额退还甲方。如甲方仍选择接受逾期货品，甲方按照逾期订单总金额90%收货。（延期7天及以上，甲方有权视销售情况实行减单）。特殊品：季节末或重点主推品，甲方在确定订单时将向乙方约定不得延期，此类订单延期，甲方有权直接取消订单。'
  },
  {
    message:
      '乙方所提供的产品，达不到验收标准的或在保质期内出现质量问题，乙方应无条件退换货，并承担相关质检费用以及因退换货所产生的所有物流费用。同时还要承担甲方客户存在的取消订单的风险损失。'
  },
  {
    message:
      '乙方提供的质检报告不得虚假或者隐瞒真实性，如上架售卖后平台方抽查查出成分或检测指标不合格，甲方有权将货品退回乙方，并要求乙方据实赔偿损失，另乙方还须承担相当于订单总金额3倍的违约金。'
  },
  {
    message:
      '乙方提供不符合国家规定的质量标准，甲方有权将货品退回乙方，并要求乙方据实赔偿损失，另乙方还须承担相当于订单总金额3倍的违约金并保留追加因退款退货等给品牌带来的隐性损失。'
  },
  {
    message:
      '若发现产品质量、标识等与约定不符，甲方可要求退换或者退款，乙方在7日内负责调换、补齐货退款。如若出现严重次品问题，第一次警告，后续再次出现每次收取全检费用按照工时26元每小时进行收费（具体根据市场行情实时调整）。'
  },
  {
    message:
      '乙方到货时甲方对到货数量进行抽验，抽验合格按数签收；抽验一次不合格仓库进行二抽，对两次抽验结果进行综合计算少货比例，乙方按等数比例整批进行补货或从货款中抵扣；如工厂对抽验存疑甲方收取全检费用按照工时26元每小时进行收费（具体根据市场行情实时调整）进行全验，如有少货乙方则按少货数量三倍补货或从货款中抵扣；如乙方连续三次以上（含）出现少数除按以上规定处理外，乙方对甲方进行违约补偿，补偿金额为整批货品货值2%。',
    important: true
  },
  {
    message:
      '销售和验收过程中发现产品存在血迹，异物，金属等可能造成顾客人身安全的质量问题的按照每件5W元的费用作为违约赔偿，除违约赔偿外，甲方有权将货品退回乙方，涉及订单不做结算，乙方对此承担全部责任并赔偿因此对甲方造成的一切损失(运输费、诉讼费、罚款等)'
  },
  {
    message:
      '如发现乙方把带有其他品牌标识或者logo的大货发给甲方，按照每件1000元的费用作为违约赔偿。'
  },
  {
    message:
      '补单要求：工厂不同批次产品工艺、面料、颜色、克重、成分等要和第一批一致，如有任何改变，工厂必须要提前通知，并寄出样品给对接采购人员确定，经采购人员对比确定后才能出货。若乙方未通知直接修改发出大货，甲方有权拒收，物流费用乙方承担，并按照1次500元进行处罚。'
  },
  {
    message:
      '乙方交货产品数量需符合尺码配比，不满足配比的货品部分，甲方有权拒收。如乙方交付货物数量低于合同数量规定的下限时，需要与甲方协商沟通确认，如需补足，乙方应在7天内返还甲方短缺部分。超出偏差允许数量此范围以外的合格品，需征得甲方同意后方可送仓。对于超出范围以外的未经甲方允许送仓的合格品，乙方在收到通知后7天内安排提货。'
  },
  {
    message:
      '甲乙双方可能的合作关系有试用关系、合作伙伴关系、核心合作伙伴关系、战略合作伙伴关系。甲方根据乙方的合作绩效，结合乙方合作过程中的诚信记录，定期对乙方进行合作级别评定。绩效考核项目含品质、货期、成本、配合度等，绩效结果将对双方合作产生影响。'
  },
  {
    message: '本合同必须经双方盖合同专用章或公章即可生效，并具有同等法律效力。'
  }
]

export const BASE_INFO_OP = [
  { label: '合同编号', field: 'contractNo' },
  { label: '下单日期', field: 'date' },
  { label: '甲方', field: 'firstFullCompany' },
  { label: '乙方', field: 'secondFullCompany' },
  { label: '地址', field: 'firstAddress' },
  { label: '地址', field: 'secondAddress' },
  { label: '联系人', field: 'firstName' },
  { label: '联系人', field: 'secondName' },
  { label: '电话', field: 'firstPhone' },
  { label: '电话', field: 'secondPhone' }
]

export const CONTRACT_REQUIREMENT = [
  {
    label: '要求交货时间',
    message:
      '交期于2025.7.8完成出裸货5万，2025.7.15日出含包装12万，2025.7.22出12万，2025.7.29日出15万，2025.7.30日完成清单。',
    important: true
  },
  { label: '付款方式', message: '货品到仓入库2个月结。' },
  {
    label: '运输方式',
    message: '乙方自行安排将货物运至甲方指定地点并送货上门。运输费用乙方承担。'
  },
  {
    label: '包装要求',
    message: '乙方包装成品出货（包装袋和中包装由甲方提供，合格证乙方自行安排）。',
    important: true
  },
  {
    label: '装箱要求',
    message:
      '具体要求根据甲方实际情况安排 。乙方对产品的包装应当符合甲方要求，能达到防压、防潮、防震、防尘等基本要求，保证长途运输不变质、不毁损。因包装、运输不当引起或锈蚀、损坏等情况的，由乙方负责退换、赔偿。'
  },
  {
    label: '质量要求',
    message: '乙方交付的产品必须符合国家规定的质量标准或同行业标准进行检测验收，否则不予接收。'
  },
  { label: '质保时间', message: '乙方的产品质量保质期为12个自然月。' },
  {
    label: '货品标准',
    message:
      '不得有色差，污渍，异物残留，异味，发霉，发黄等陈旧现象,不能有烫黄、烫印等现象。不能有破损变形，漏针，开线，破洞和针眼，不能留其他残次唛标，勾丝，线头不能过多过长。洗唛应至少包含号型、尺码、面料成分、洗涤标准，同款同批次产品不能有不同成分的洗唛，必须与质检报告一致。'
  },
  {
    label: '检验标准',
    message:
      '甲方检验标准为AQL1.5 / 2.5，或抽样标准为Level II、甲方确认的正确样；(AQL1.5：文胸、内裤、胸贴  AQL2.5：袜类、成衣类、家居类等其他产品）。'
  },
  {
    label: '交货数量误差范围',
    message:
      '每笔采购订单每个SKU的交货数量偏差的允许范围为±3%。如果有超出需要提前联系甲方沟通确认。'
  },
  {
    label: '检测要求',
    message:
      '乙方须在大货送仓前，按照甲方要求提供甲方指定的第三方检测机构出具的成品检测合格报告，报告包含商品信息。商品洗水标和吊牌等辅料上的成分于检测报告上面的成分是一致的，检测费用乙方承担。'
  }
]

/** 产前样上传批量新增 */
export const beforeProduct_batchAddTableOps: TableOption = [
  {
    type: 'selection',
    fixed: 'left',
    selectable: (row) => !row.isSelected,
    showOverFlowTooltip: false
  },
  { prop: 'imgUrl', label: '图片', minWidth: 60, formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  { label: 'SKU编码', prop: 'sku', minWidth: 130, formatter: copyBtn },
  { label: '规格名称', prop: 'formName', minWidth: 130 },
  { label: '规格码', prop: 'formCode', minWidth: 130 },
  { label: '迭代码', prop: 'iterateCode', minWidth: 130 },
  { label: '预估单价', prop: 'estimatePrice', minWidth: 130 }
]
