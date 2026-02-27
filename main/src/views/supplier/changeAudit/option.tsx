import { formatDate } from '@/utils/formatTime'
import { ButtonType } from 'element-plus'
import { copyBtn, goodsNosFormatter, imgUrl, person, statusDom } from '../components/twoFourSix'

export const statusOps = [
  { label: '跟单审核中', value: '10', color: '#0064FF', bg: 'rgba(0, 100, 255, 0.2)' },
  { label: '计划审核中', value: '20', color: '#CD8200', bg: 'rgba(255, 244, 200, 1)' },
  { label: '审核通过', value: '30', color: 'rgba(52, 155, 52, 1)', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '审核不通过', value: '40', color: 'rgba(235, 55, 55, 1)', bg: 'rgba(255, 217, 217, 1)' },
  { label: '废弃', value: '50', color: '#666', bg: '#66666620' }
]

export const mainTableOption: TableOption = [
  { label: '需求单号', prop: 'scPurchaseRequestOrderNo', minWidth: 130, formatter: copyBtn },
  { label: '生产单号', prop: 'scPurchaseOrderNo', minWidth: 130, formatter: copyBtn },
  { label: '供应商', prop: 'supplierName', minWidth: 130 },
  {
    label: '货品编码',
    prop: 'goodsNos',
    minWidth: 110,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '原货品数', prop: 'goodsNumTotal', minWidth: 90, align: 'right' },
  { label: '原采购数', prop: 'purchasedGoodsQuantityTotal', minWidth: 90, align: 'right' },
  { label: '变更后货品数', prop: 'changeGoodsNumTotal', minWidth: 110, align: 'right' },
  {
    label: '变更后采购数',
    prop: 'changePurchasedGoodsQuantityTotal',
    minWidth: 110,
    align: 'right'
  },
  { label: '申请人', prop: 'applicantObj', minWidth: 120, formatter: person },
  { label: '跟单人', prop: 'orderHandler', minWidth: 120, formatter: person },
  {
    label: '申请时间',
    prop: 'createdAt',
    minWidth: 170,
    transform: (col) => formatDate(col, 'YYYY-MM-DD HH:mm:ss'),
    showOverFlowTooltip: false
  },
  {
    label: '状态',
    prop: 'changeStatus',
    minWidth: 120,
    formatter: statusDom(statusOps)
  },
  {
    label: '跟单审核人',
    prop: 'firstApprovePersonObj',
    minWidth: 130,
    formatter: (row, _, cellValue) => {
      if (cellValue) return person(row, _, cellValue)
      else if (row.firstApprovePerson === 'system') return '系统审核'
      else return '--'
    }
  },
  {
    label: '跟单审核时间',
    prop: 'firstApproveTime',
    minWidth: 170,
    transform: (col) => (col ? formatDate(col, 'YYYY-MM-DD HH:mm:ss') : '--'),
    showOverFlowTooltip: false
  },
  {
    label: '计划审核人',
    prop: 'secondApprovePersonObj',
    minWidth: 130,
    formatter: (row, _, cellValue) => {
      if (cellValue) return person(row, _, cellValue)
      else if (row.secondApprovePerson === 'system') return '系统审核'
      else return '--'
    }
  },
  {
    label: '计划审核时间',
    prop: 'secondApproveTime',
    minWidth: 170,
    transform: (col) => (col ? formatDate(col, 'YYYY-MM-DD HH:mm:ss') : '--'),
    showOverFlowTooltip: false
  },
  { label: '操作', type: 'options', fixed: 'right' }
]

export const changeAuditTable: TableOption = [
  { prop: 'index', fixed: 'left', label: '序号', minWidth: 60 },
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
    showOverFlowTooltip: true,
    minWidth: 100,
    transform: (col) => col || '--'
  },
  {
    label: 'SKU编码',
    prop: 'sku',
    minWidth: 130,
    showOverFlowTooltip: true,
    required: true
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
  // { label: '裸货价', prop: 'baseProdCost', minWidth: 80, align: 'right' },
  // { label: '成品价', prop: 'fgCost', minWidth: 80, align: 'right' },
  {
    label: '采购数量',
    prop: 'purchasedGoodsQuantity',
    minWidth: 80,
    align: 'right',
    transform: (col) => col || 0
  },
  {
    label: '未发货',
    slotName: 'goodsNoDeliveryQuantity',
    minWidth: 80,
    align: 'right',
    transform: (col) => col || 0
  },
  {
    label: '已发货',
    prop: 'goodsDeliveryQuantity',
    minWidth: 80,
    align: 'right',
    transform: (col) => col || 0
  },
  {
    label: '已入库',
    prop: 'goodsInboundQuantity',
    minWidth: 80,
    align: 'right',
    transform: (col) => col || 0
  },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 120,
    fixed: 'right',
    transform: (col) => (col ? formatDate(col, 'YYYY-MM-DD') : '--')
  },
  {
    label: '合同首批日期',
    prop: 'firstBatchTime',
    minWidth: 120,
    transform: (col) => (col ? formatDate(col, 'YYYY-MM-DD') : '--'),
    required: true
  },
  {
    label: '变更数量',
    prop: 'changeGoodsQuantity',
    minWidth: 100,
    fixed: 'right',
    align: 'right',
    required: true
  }
]
export const changeAuditTable2: TableOption = [
  { type: 'index', label: '序号', minWidth: 60, indexMethod: (index) => index || '合计' },
  {
    prop: 'imgUrl',
    label: '图片',
    minWidth: 60,
    formatter: (row, column, index) => (index ? imgUrl(row, column, index) : '')
  },
  {
    label: '货品名称',
    prop: 'goodsName',
    showOverFlowTooltip: true,
    minWidth: 150,
    transform: (col, _, index) => (index ? col || '--' : '')
  },
  {
    label: '货品编码',
    prop: 'goodsCode',
    showOverFlowTooltip: true,
    minWidth: 100,
    transform: (col, _, index) => (index ? col || '--' : '')
  },
  {
    label: 'SKU编码',
    prop: 'sku',
    minWidth: 130,
    showOverFlowTooltip: true,
    required: true
  },
  {
    label: '规格名称',
    prop: 'formName',
    showOverFlowTooltip: true,
    minWidth: 150,
    transform: (col, _, index) => (index ? col || '--' : '')
  },
  {
    label: '规格码',
    prop: 'formCode',
    showOverFlowTooltip: true,
    minWidth: 120,
    transform: (col, _, index) => (index ? col || '--' : '')
  },
  {
    label: '迭代码',
    prop: 'iterateCode',
    showOverFlowTooltip: true,
    minWidth: 120,
    transform: (col, _, index) => (index ? col || '--' : '')
  },
  {
    label: '采购数量',
    prop: 'purchasedGoodsQuantity',
    minWidth: 80,
    align: 'right',
    transform: (col) => col || 0
  },
  {
    label: '未发货',
    slotName: 'goodsNoDeliveryQuantity',
    minWidth: 80,
    align: 'right',
    transform: (col) => col || 0
  },
  {
    label: '已发货',
    prop: 'goodsDeliveryQuantity',
    minWidth: 80,
    align: 'right',
    transform: (col) => col || 0
  },
  {
    label: '已入库',
    prop: 'goodsInboundQuantity',
    minWidth: 80,
    align: 'right',
    transform: (col) => col || 0
  },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 120,
    fixed: 'right',
    transform: (col, _, index) =>
      index ? (col ? formatDate(new Date(col), 'YYYY-MM-DD') : '--') : ''
  },
  {
    label: '合同首批日期',
    prop: 'firstBatchTime',
    minWidth: 120,
    transform: (col, _, index) =>
      index ? (col ? formatDate(new Date(col), 'YYYY-MM-DD') : '--') : ''
  },
  {
    label: '变更数量',
    prop: 'changeGoodsQuantity',
    minWidth: 100,
    fixed: 'right',
    align: 'right'
  }
]
export class AuditBtn {
  label: string
  method: (row: Supplier.ChangeAudit.ListItem, index?: number) => void = () => {}
  type?: ButtonType
  disabled?: boolean
  disabledDesc?: string
  icon?: string
  permission?: string
  constructor(
    ..._arg: [
      string,
      typeof this.method | undefined,
      (
        | Partial<{
            type: string
            disabled: boolean
            disabledDesc: string
            icon: string
            permission: string
          }>
        | undefined
      )?
    ]
  ) {
    const [label, method, options] = _arg
    this.label = label
    if (method) this.method = method
    if (options) {
      const _this = { ...this, ...options }
      Object.keys(_this).forEach((key) => (this[key] = _this[key]))
    }

    this.type = this.type || 'primary'
  }
}
