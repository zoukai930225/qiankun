import { allOrderStatusOps } from '../product/options'
import { handleCopyCode } from '@/utils/copyText'
import { auditStatusOps } from '../appointment/options'
import {
  copyBtn,
  finishGoodsQuantityTotalDom,
  goodsNosFormatter,
  imgUrl,
  person,
  persons,
  statusDom
} from '../components/twoFourSix'
import { getDictOptions, DICT_TYPE, getDictLabel } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { ElButton } from 'element-plus/es'
import { COLUMN_1, inTableSort } from '../purchaseApplication/options'

export const SC_PR_REQUEST_SOURCE = getDictOptions(DICT_TYPE.SC_PR_REQUEST_SOURCE)

export const statusOps = [
  { label: '编辑中', value: '0', color: '#DB6A0F', bg: '#F7DECB' },
  { label: '审核中', value: '4', color: '#ae00ffff', bg: '#ae00ff20' },
  { label: '审核不通过', value: '7', color: '#eb3737', bg: '#eb373720' },
  { label: '未开始', value: '10', color: '#333333', bg: '#E8E8E8' },
  { label: '生产中', value: '20', color: '#CD8200', bg: '#FFF4C8' },
  { label: '已清单', value: '30', color: '#349B34', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '手动结单', value: '40', color: '#0064FF', bg: 'rgba(0, 100, 255, 0.2)' },
  { label: '变更中', value: '99', color: '#3E47FA', bg: '#E6E8FF' }
]

export const auditSelectStatusOps = (function () {
  const statusMap = new Map(allOrderStatusOps.map((ele) => [ele.label, ele]))
  statusMap.delete('未提交')
  statusMap.delete('编辑中')
  return Array.from(statusMap.values())
})()

export const PENDING_STATUS = [
  { label: '待分配', value: '0', color: '#333333', bg: '#E8E8E8' },
  { label: '已分配', value: '10', color: '#0064FF', bg: '#0064ff20' }
]

export const AUDIT_STATUS = [
  { label: '待审核', value: '0', sumKey: 'pendingApprovalTotal' },
  { label: '已审核', value: '1', sumKey: 'approvedTotal' },
  { label: '全部', value: '2', sumKey: 'all' }
]

export const purchaseTable: TableOption = [
  // { type: 'selection', fixed: 'left', width: 60, showOverFlowTooltip: false },
  {
    label: '需求编码',
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
  { label: '需求名称', prop: 'scPurchaseRequestOrderName', fixed: 'left', minWidth: 120 },
  {
    label: '货品编码',
    prop: 'goodsNos',
    minWidth: 110,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '货品数', prop: 'goodsNumTotal',  minWidth: 100 },
  { label: '补单量', prop: 'goodsQuantityTotal',  minWidth: 100 },
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
  { label: '预估金额', prop: 'estimatePriceTotal',  minWidth: 110 },
  {
    label: '完成进度',
    prop: 'finishGoodsQuantityTotal',
    minWidth: 200,
    showOverFlowTooltip: false,
    formatter: finishGoodsQuantityTotalDom('goodsQuantityTotal')
  },
  { label: '最晚清单时间', prop: 'latestTime', minWidth: 110 },
  { label: '状态', prop: 'status', formatter: statusDom(statusOps), minWidth: 100 },
  { label: '创建人', prop: 'createUser', minWidth: 130, formatter: person },
  { label: '创建时间', prop: 'createdAt', minWidth: 170 },
  { label: '审核人', prop: 'reviewer', minWidth: 150, formatter: persons },
  { label: '操作', type: 'options', fixed: 'right' }
]

export const pendingPurchaseTable: TableOption = [
  { type: 'selection', width: 60, showOverFlowTooltip: false },
  {
    label: '货品编码',
    prop: 'goodsNos',
    minWidth: 110,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '货品数', prop: 'goodsNumTotal',  minWidth: 90 },
  { label: '补单量', prop: 'goodsQuantityTotal',  },
  {
    label: '期望到货时间',
    prop: 'latestTime',
    minWidth: 130,
    transform: (col) => formatDate(col, 'YYYY-MM-DD')
  },
  {
    label: '需求来源',
    prop: 'requestSource',
    transform: (col) => getDictLabel(DICT_TYPE.SC_PR_REQUEST_SOURCE, col),
    minWidth: 85
  },
  {
    label: '状态',
    prop: 'status',
    formatter: statusDom(PENDING_STATUS),
    minWidth: 120
  },
  { label: '企划负责人', prop: 'enterprisePlanManagerObjs', formatter: persons, minWidth: 150 },
  { label: '运营负责人', prop: 'operationManagerObjs', formatter: persons, minWidth: 150 },
  { label: '申请人', prop: 'createdUser', formatter: person, minWidth: 130 },
  {
    label: '需求单号',
    prop: 'requestNos',
    minWidth: 120,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  {
    label: '创建时间',
    prop: 'createdAt',
    minWidth: 170,
    transform: (col) => formatDate(col, 'YYYY-MM-DD HH:mm:ss')
  },
  { label: '操作', type: 'options' }
]

export const peddingDetailTable: TableOption = [
  { label: '序号', type: 'index', width: 60, indexMethod: (index) => (index ? index : '合计') },
  {
    label: '图片',
    prop: 'imgUrl',
    minWidth: 50,
    formatter: (row, __, cellValue, index) => (index && row.sku ? imgUrl(row, __, cellValue) : '')
  },
  { label: '货品编码', prop: 'goodsCode', formatter: copyBtn, minWidth: 110 },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  {
    label: 'SKU编码',
    prop: 'sku',
    minWidth: 150,
    formatter: copyBtn
  },
  {
    label: '规格名称',
    prop: 'formName',
    minWidth: 130,
    transform: (col, row, index) => col || row.specName || (index ? '--' : '')
  },
  {
    label: '规格码',
    prop: 'formCode',
    minWidth: 130,
    transform: (col, row, index) => col || row.specCode || (index ? '--' : '')
  },
  {
    label: '申请量',
    prop: 'applicationQty',
    minWidth: 130,
    
  },
  { label: '预估单价', prop: 'estimatePrice', minWidth: 110,  },
  {
    label: '期望到货日期',
    prop: 'orderItemTime',
    minWidth: 150,
    transform: (col, _, index) => (index ? formatDate(col, 'YYYY-MM-DD') : '')
  }
]

export const auditTable: TableOption = [
  {
    label: '需求编码',
    prop: 'scPurchaseRequestOrderNo',
    fixed: 'left',
    width: 120,
    formatter: copyBtn
  },
  { label: '需求名称', prop: 'scPurchaseRequestOrderName', fixed: 'left', minWidth: 120 },
  {
    label: '货品编码',
    prop: 'goodsNos',
    width: 110,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '货品数', prop: 'goodsNumTotal',  width: 100 },
  { label: '补单量', prop: 'goodsQuantityTotal',  width: 100 },
  { label: '预估金额', prop: 'estimatePriceTotal',  width: 100 },
  { label: '最晚清单时间', prop: 'latestTime', width: 110 },
  {
    label: '需求来源',
    prop: 'requestSource',
    transform: (col) => getDictLabel(DICT_TYPE.SC_PR_REQUEST_SOURCE, col),
    width: 85
  },
  {
    label: '状态',
    prop: 'auditStatusDesc',
    width: 110,
    transform: (col) => AUDIT_STATUS.find((ele) => ele.value === col)?.label
  },
  { label: '申请人', prop: 'creator', formatter: person, width: 130 },
  { label: '审核人', prop: 'reviewer', width: 150, formatter: persons },
  { label: '创建时间', prop: 'createdAt', width: 170 },
  { label: '操作', type: 'options' }
]

export const allAuditTable: TableOption = (function () {
  const tableMap = new Map(auditTable.map((ele) => [ele.label, ele]))

  tableMap.set('状态', {
    ...tableMap.get('状态'),
    prop: 'status',
    formatter: statusDom(allOrderStatusOps),
    width: 130
  })

  tableMap.set('申请人', { ...tableMap.get('申请人'), prop: 'createUser' })

  // tableMap.delete('审核人')

  return Array.from(tableMap.values())
})()

export const addPurchaseTable: TableOption = [
  { type: 'index', fixed: 'left', label: '序号', minWidth: 60 },
  { prop: 'imgUrl', label: '图片', minWidth: 60, fixed: 'left', formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', showOverFlowTooltip: true, minWidth: 120 },
  {
    label: '货品编码',
    prop: 'goodsCode',
    showOverFlowTooltip: true,
    minWidth: 120,
    formatter: copyBtn
  },
  {
    label: 'SKU编码',
    prop: 'sku',
    minWidth: 200,
    showOverFlowTooltip: true,
    required: true,
    isForm: true
  },
  { label: '规格名称', prop: 'formName', showOverFlowTooltip: true, minWidth: 120 },
  { label: '规格码', prop: 'formCode', showOverFlowTooltip: true, minWidth: 80 },
  { label: '迭代码', prop: 'iterateCode', showOverFlowTooltip: true, minWidth: 120 },
  { label: '补单量', prop: 'goodsQuantity', minWidth: 130, required: true, isForm: true },
  { label: '预估单价', prop: 'estimatePrice', minWidth: 100,  },
  {
    label: '需求清单时间',
    prop: 'orderItemTime',
    minWidth: 200,
    required: true,
    isForm: true,
    rules: (row) => ({
      required: true,
      validator: (_, value, callback) => {
        let error: undefined | Error = undefined
        const orderItemTime = new Date(value)
        const firstOrderTime = new Date(row.firstOrderTime)

        if (!value) error = new Error('请选择')
        else if (row.firstOrderTime && orderItemTime < firstOrderTime)
          error = new Error('首单时间需早于需求清单时间')

        callback(error)
      }
    })
  },
  {
    label: '首单时间',
    prop: 'firstOrderTime',
    minWidth: 200,
    isForm: true,
    rules: (row) => [
      {
        required: true,
        validator: (_, val, callback) => {
          if (!row.orderItemTime) return callback()
          if (!val) return callback()
          const orderItemTime = new Date(row.orderItemTime)
          const firstOrderTime = new Date(val)
          if (orderItemTime < firstOrderTime) {
            return callback(new Error('首单时间需早于需求清单时间'))
          } else {
            callback()
          }
        }
      }
    ]
  },
  { label: '操作', type: 'options' }
]

export const auditPurchaseTable: TableOption = [
  { type: 'index', fixed: 'left', label: '序号', minWidth: 60 },
  { prop: 'imgUrl', label: '图片', minWidth: 60, fixed: 'left', formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', showOverFlowTooltip: true, minWidth: 120 },
  {
    label: '货品编码',
    prop: 'goodsCode',
    showOverFlowTooltip: true,
    minWidth: 120,
    formatter: copyBtn
  },
  {
    label: 'SKU编码',
    prop: 'sku',
    minWidth: 150,
    formatter: copyBtn
  },
  { label: '规格名称', prop: 'formName', showOverFlowTooltip: true, minWidth: 120 },
  { label: '规格码', prop: 'formCode', showOverFlowTooltip: true, minWidth: 80 },
  { label: '迭代码', prop: 'iterateCode', showOverFlowTooltip: true, minWidth: 130 },
  { label: '补单量', prop: 'goodsQuantity', minWidth: 100,  },
  { label: '预估单价', prop: 'estimatePrice', minWidth: 100,  },
  {
    label: '需求清单时间',
    prop: 'orderItemTime',
    minWidth: 150,
    transform: (col) => (col ? formatDate(new Date(col), 'YYYY-MM-DD') : '--')
  },
  {
    label: '首单时间',
    prop: 'firstOrderTime',
    minWidth: 150,
    transform: (col) => (col ? formatDate(new Date(col), 'YYYY-MM-DD') : '--')
  },
  ...COLUMN_1.filter((item) => !!item.prop).sort(
    (a, b) => Number(inTableSort[a.prop!]) - Number(inTableSort[b.prop!])
  )
]

export const batchAddTableOps: TableOption = [
  {
    type: 'selection',
    fixed: 'left',
    selectable: (row) => !row.isSelected,
    showOverFlowTooltip: false
  },
  { prop: 'imgUrl', label: '图片', minWidth: 60, formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  { label: 'SKU编码', prop: 'sku', minWidth: 130 },
  { label: '规格名称', prop: 'specName', minWidth: 130 },
  { label: '规格码', prop: 'specCode', minWidth: 130 },
  { label: '迭代码', prop: 'iterateCode', minWidth: 130 },
  { label: '预估单价', prop: 'estimatePrice', minWidth: 130,  }
]

export const PoTable: TableOption = [
  { label: '订单编码', prop: 'scPurchaseOrderNo' },
  { label: '供应商', prop: 'supplier', transform: (col) => col?.supplierName || col },
  { label: '货品数量', prop: 'goodsNumTotal',  minWidth: 90 },
  { label: '采购数量', prop: 'purchasedGoodsQuantityTotal',  minWidth: 80 },
  { label: '最晚交货时间', prop: 'latestTime' },
  {
    label: '状态',
    prop: 'status',
    formatter: statusDom(allOrderStatusOps)
  },
  { label: '跟单人', prop: 'orderHandler', minWidth: 130, formatter: person },
  { label: '创建时间', prop: 'createdAt', showOverFlowTooltip: false, minWidth: 130 }
]

export const ASRTable: TableOption = [
  {
    label: '预约发货单号',
    prop: 'advancedShippingRequestOrderNo',
    fixed: 'left',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '采购生产单号',
    prop: 'scPurchaseOrderNo',
    fixed: 'left',
    minWidth: 130,
    showOverFlowTooltip: true,
    tooltipFormatter({ row }) {
      return h(
        'div',
        null,
        ...(row.scPurchaseOrderNo as string).split(',').map((item) => (
          <div>
            <ElButton class={'copy-btn light'} link onClick={() => handleCopyCode(item)}>
              {item}
            </ElButton>
          </div>
        ))
      )
    }
  },
  {
    label: 'ERP采购单号',
    prop: 'wdtPurchaseNo',
    fixed: 'left',
    minWidth: 160,
    formatter: copyBtn
  },
  { label: '货品数量', prop: 'goodsNumTotal',  minWidth: 80, fixed: 'right' },
  {
    label: '发货数量',
    prop: 'deliveryGoodsQuantityTotal',
    
    minWidth: 80,
    fixed: 'right'
  },
  {
    label: '入库数量',
    prop: 'inboundGoodsQuantityTotal',
    
    minWidth: 80,
    fixed: 'right'
  },
  { label: '预计到货日期', prop: 'appointmentDate', minWidth: 120 },
  {
    label: '供应商',
    prop: 'supplier',
    transform: (col) => col?.supplierName || col,
    showOverFlowTooltip: true,
    minWidth: 130
  },
  {
    label: '审核状态',
    prop: 'auditStatus',
    minWidth: 130,
    formatter: statusDom(auditStatusOps)
  },
  {
    label: '审核人',
    prop: 'auditPerson',
    minWidth: 100,
    formatter: (_, __, value) => (value ? persons(_, __, value) : '系统审核')
  },
  { label: '审核时间', prop: 'auditTime', minWidth: 170 },
  { label: '创建时间', prop: 'createAt', minWidth: 170 },
  { label: '操作', type: 'options', fixed: 'right', minWidth: 100 }
]

export const RKTable: TableOption = [
  { label: '单号', prop: 'orderNo', minWidth: 150, fixed: 'left', formatter: copyBtn },
  { label: 'ERP采购单号', prop: 'purchaseNo', minWidth: 160, fixed: 'left', formatter: copyBtn },
  {
    label: '类型',
    prop: 'type',
    transform: (col) => (col === 1 ? '采购入库' : '采购退货'),
    minWidth: 100
  },
  { label: '货品种类', prop: 'goodsKinds', minWidth: 80,  },
  { label: '货品数量', prop: 'goodsCount', minWidth: 80,  fixed: 'right' },
  { label: '仓库', prop: 'warehouseName', minWidth: 130 },
  { label: '供应商', prop: 'providerName', minWidth: 110 },
  { label: '备注', prop: 'remark', minWidth: 150 },
  { label: '跟单员', prop: 'orderHandler', minWidth: 100, formatter: person },
  { label: '创建时间', prop: 'createdTime', minWidth: 170, showOverFlowTooltip: false }
]

export const PoTableDetail: TableOption = [
  { prop: 'imgUrl', label: '图片', minWidth: 60, fixed: 'left', formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', fixed: 'left', minWidth: 130 },
  { label: '货品编码', prop: 'goodsCode', fixed: 'left', minWidth: 130, formatter: copyBtn },
  { label: 'SKU编码', prop: 'sku', fixed: 'left', minWidth: 130, formatter: copyBtn },

  { label: '规格名称', prop: 'formName', minWidth: 130 },
  { label: '规格码', prop: 'formCode', minWidth: 100 },
  { label: '迭代码', prop: 'iterateCode', minWidth: 130 },

  { label: '合同清单日期', prop: 'orderArrivalTime', minWidth: 120 },
  { label: '需求清单时间', prop: 'orderItemTime', minWidth: 120 },
  {
    label: '首单时间',
    prop: 'firstOrderTime',
    minWidth: 120
  },
  {
    label: '采购数量',
    prop: 'purchasedGoodsQuantity',
    minWidth: 90,
    fixed: 'right'
  },
  { label: '裸货价', fixed: 'right', prop: 'baseProdCost', minWidth: 80,  },
  { label: '成品价', fixed: 'right', prop: 'fgCost', minWidth: 80,  }
]

export const ASRTableDetail: TableOption = [
  { prop: 'imgUrl', label: '图片', minWidth: 60, fixed: 'left', formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', fixed: 'left', minWidth: 120 },
  { label: '货品编码', prop: 'goodsCode', fixed: 'left', minWidth: 120, formatter: copyBtn },
  { label: 'SKU编码', prop: 'sku', fixed: 'left', minWidth: 120, formatter: copyBtn },
  { label: '规格名称', prop: 'formName', minWidth: 120 },
  { label: '规格码', prop: 'formCode', minWidth: 80 },
  { label: '迭代码', prop: 'iterateCode', minWidth: 120 },
  {
    label: '发货数量',
    prop: 'deliveryGoodsQuantity',
    fixed: 'right',
    minWidth: 80,
    
  },
  {
    label: '单价',
    prop: 'supplierGoodsPrice',
    minWidth: 80,
    
    fixed: 'right'
  },
  {
    label: '金额',
    prop: 'price',
    minWidth: 80,
    
    fixed: 'right',
    transform: (col, row) =>
      Math.round(
        Number(row.deliveryGoodsQuantity ?? 0) * Number(row.supplierGoodsPrice ?? 0) * 100
      ) / 100 || col
  }
]
export const RKTableDetail: TableOption = [
  { prop: 'imgUrl', label: '图片', minWidth: 60, formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', minWidth: 120 },
  { label: '货品编码', prop: 'goodsNo', minWidth: 120, formatter: copyBtn },
  { label: 'SKU编码', prop: 'specNo', minWidth: 120, formatter: copyBtn },
  { label: '规格名称', prop: 'specName', minWidth: 120 },
  { label: '规格码', prop: 'specCode', minWidth: 80 },
  { label: '入库数量', prop: 'num', fixed: 'right', minWidth: 80,  }
]

export const detailTable: TableOption = [
  { type: 'index', fixed: 'left', label: '序号', minWidth: 60 },
  { prop: 'imgUrl', label: '图片', minWidth: 60, fixed: 'left', formatter: imgUrl },
  { prop: 'goodsName', label: '货品名称', minWidth: 130, fixed: 'left' },
  { prop: 'goodsCode', label: '货品编码', minWidth: 100, fixed: 'left', formatter: copyBtn },
  { prop: 'sku', label: 'SKU编码', minWidth: 130, fixed: 'left', formatter: copyBtn },
  { prop: 'formName', label: '规格名称', minWidth: 130 },
  { prop: 'formCode', label: '规格码', minWidth: 80 },
  { prop: 'iterateCode', label: '迭代码', minWidth: 130 },
  { prop: 'goodsQuantity', label: '补单量', minWidth: 70,  fixed: 'right' },
  { prop: 'goodsPlaceQuantity', label: '已下单', minWidth: 70,  fixed: 'right' },
  { prop: 'goodsDeliveryQuantity', label: '已发货', minWidth: 70,  fixed: 'right' },
  { prop: 'goodsInboundQuantity', label: '已入库', minWidth: 70,  fixed: 'right' },
  { prop: 'orderItemTime', label: '需求清单时间', minWidth: 110 },
  { prop: 'firstOrderTime', label: '首单时间', minWidth: 110 }
]

export const mergeProductTable: TableOption = [
  {
    label: '编码',
    prop: 'code',
    minWidth: 110,
    formatter: copyBtn
  },
  { prop: 'name', label: '货品名称', minWidth: 130, fixed: 'left' },
  { label: '创建人', prop: 'createdUser', minWidth: 130, formatter: person },
  { label: '创建时间', prop: 'createdAt', minWidth: 170 },
  {
    label: '更新人',
    prop: 'updatedUser',
    minWidth: 130,
    formatter: person
  },
  { label: '更新时间', prop: 'updatedAt', minWidth: 170 },
  { label: '操作', type: 'options' }
]

export const popoverTable: TableOption = [
  { prop: 'sku', formatter: copyBtn },
  { prop: 'purchasedGoodsQuantity', align: 'right' }
]
export const goodsQuantityTotalTable: TableOption = [
  { prop: 'sku', formatter: copyBtn },
  { prop: 'goodsQuantity', align: 'right' }
]
export const ASRPopoverTable: TableOption = [
  { prop: 'sku', formatter: copyBtn },
  { prop: 'deliveryGoodsQuantity', align: 'right' }
]
export const StockinPopoverTable: TableOption = [
  { prop: 'specNo', formatter: copyBtn },
  { prop: 'num', align: 'right' }
]
export const purchasedGoodsQuantityTotalTable: TableOption = [
  { prop: 'sku', formatter: copyBtn },
  { prop: 'purchasedGoodsQuantity', align: 'right' }
]
export const inboundGoodsQuantityTotalTable: TableOption = [
  { prop: 'specNo', formatter: copyBtn },
  { prop: 'num', align: 'right' }
]
export const goodsDeliveryQuantityTable: TableOption = [
  { prop: 'sku', formatter: copyBtn },
  { prop: 'deliveryGoodsQuantity', align: 'right' }
]
export const opsReplenishmentTable: TableOption = [
  { prop: 'sku', formatter: copyBtn },
  { prop: 'requestQuantity', align: 'right' }
]
export const applicationQtyTable: TableOption = [
  { prop: 'sku', formatter: copyBtn },
  { prop: 'applicationQty', align: 'right' }
]

export const mergeDetailTable: TableOption = [
  { type: 'index', width: 60, label: '序号' },
  { label: '图片', width: 60, prop: 'imgUrl', formatter: imgUrl },
  { label: '货品编码', prop: 'goodsCode', minWidth: 110, formatter: copyBtn },
  {
    label: '货品名称',
    prop: 'goodsName',
    minWidth: 400,
    formatter: (_, __, value) => <span class="text2">{value}</span>
  }
]

export class AddTableItem {
  /**
   * 企业(字典code)
   */
  company?: string
  /**
   * 企业名称
   */
  companyName?: string
  /**
   * 创建时间
   */
  createdAt?: string
  /**
   * 创建人
   */
  createdId?: string
  /**
   * 首单时间
   */
  firstOrderTime?: string
  /**
   * 规格码
   */
  formCode?: string
  /**
   * 规格名称
   */
  formName?: string
  /**
   * 货品编码
   */
  goodsCode?: string
  /**
   * 已发货数量
   */
  goodsDeliveryQuantity?: number
  /**
   * 已入库数量
   */
  goodsInboundQuantity?: number
  /**
   * 货品名称
   */
  goodsName?: string
  /**
   * 已下单数量
   */
  goodsPlaceQuantity?: number
  /**
   * 补单量
   */
  goodsQuantity?: number
  id?: string
  /**
   * 是否删除 1-是 0-否
   */
  isDeleted?: number
  /**
   * 迭代码
   */
  iterateCode?: string
  /**
   * 迭代款
   */
  iterateStyle?: string
  /**
   * 跟单人员;关联sys_person_roster的user_id,会有多个
   */
  orderHandlerId?: string
  /**
   * 需求清单时间
   */
  orderItemTime: string = ''
  /**
   * 实际首单时间
   */
  realFirstOrderTime?: string
  /**
   * 实际清单时间
   */
  realOrderItemTime?: string
  /**
   * 是否记录修改数据
   */
  recordChangeDataFlag?: boolean
  /**
   * 需求单id
   */
  scPurchaseRequestOrderId: string = ''
  /**
   * 需求单ids
   */
  scPurchaseRequestOrderIdList?: string[]
  /**
   * SKU编码
   */
  sku: string = ''
  /**
   * 供应商
   */
  supplier?: string
  /**
   * 修改时间
   */
  updatedAt?: string
  /**
   * 修改人
   */
  updatedId?: string;
  [property: string]: any
}
