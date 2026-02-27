import { handleCopyCode } from '@/utils/copyText'
import { formatDate } from '@/utils/formatTime'
import { ElButton } from 'element-plus'
import {
  copyBtn,
  finishGoodsQuantityTotalDom,
  goodsNosFormatter,
  imgUrl,
  person,
  statusDom
} from '../components/twoFourSix'

export function copyCell(__, _, cellValue) {
  return (
    <ElButton link onClick={() => handleCopyCode(cellValue)} class={'copy-btn'}>
      {cellValue}
    </ElButton>
  )
}

export const statusOps = [
  { label: '待排产', value: '10', color: '#9737ebff', bg: 'rgba(242, 227, 255, 1)' },
  { label: '已确认', value: '13', color: '#05a2adff', bg: '#05a2ad20' },
  { label: '待签约', value: '14', color: '#0064ff', bg: '#0064ff20' },
  { label: '产前样审核中', value: '16', color: '#ae00ffff', bg: '#ae00ff20' },
  { label: '产前样审核通过', value: '18', color: '#349b34', bg: '#349b3420' },
  { label: '待质检', value: '19', color: '#05a2adff', bg: '#05a2ad20' },
  { label: '免检审核', value: '191', color: '#0064ff', bg: '#0064ff20' },
  { label: '免检驳回', value: '192', color: '#eb3737', bg: '#eb373720' },
  { label: '质检通过', value: '193', color: '#349b34', bg: '#349b3420' },
  { label: '已发货', value: '20', color: '#349B34', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '部分到货', value: '30', color: 'rgba(230, 55, 130, 1)', bg: 'rgba(230, 55, 130, 0.2)' },
  { label: '已清单', value: '40', color: '#349B34', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '手动结单', value: '50', color: '#0064FF', bg: 'rgba(0, 100, 255, 0.2)' },
  { label: '变更中', value: '99', color: '#3E47FA', bg: '#E6E8FF' }
]

export const auditStatusOps = [
  { label: '未提交', value: '0', color: 'rgba(51, 51, 51, 1)', bg: 'rgba(232, 232, 232, 1)' },
  { label: '待审核', value: '10', color: 'rgba(219, 106, 15, 1)', bg: 'rgba(247, 222, 203, 1)' },
  { label: '审核通过', value: '20', color: 'rgba(52, 155, 52, 1)', bg: 'rgba(52, 155, 52, 0.2)' },
  {
    label: '已打印',
    value: '30',
    color: 'rgba(0, 100, 255, 1)',
    bg: 'rgba(0, 100, 255, 0.2)'
  },
  {
    label: '已入库',
    value: '35',
    color: 'rgba(230, 55, 130, 1)',
    bg: 'rgba(230, 55, 130, 0.2)'
  },
  { label: '审核不通过', value: '40', color: 'rgba(235, 55, 55, 1)', bg: 'rgba(255, 217, 217, 1)' },
  { label: '手动结单', value: '50', color: '#9737EB', bg: '#F2E3FF' }
]

/** 审核状态-预约审核使用 */
export const auditStatusOps2 = [
  { label: '待审核', value: '10', color: 'rgba(219, 106, 15, 1)', bg: 'rgba(247, 222, 203, 1)' },
  { label: '审核通过', value: '20', color: 'rgba(52, 155, 52, 1)', bg: 'rgba(52, 155, 52, 0.2)' },
  {
    label: '已打印',
    value: '30',
    color: 'rgba(0, 100, 255, 1)',
    bg: 'rgba(0, 100, 255, 0.2)'
  },
  { label: '审核不通过', value: '40', color: 'rgba(235, 55, 55, 1)', bg: 'rgba(255, 217, 217, 1)' },
  {
    label: '已入库',
    value: '35',
    color: 'rgba(230, 55, 130, 1)',
    bg: 'rgba(230, 55, 130, 0.2)'
  },
  { label: '手动结单', value: '50', color: '#9737EB', bg: '#F2E3FF' }
]

/** 采购生产订单列表 */
export const purchaseTable: TableOption = [
  // { type: 'selection', fixed: 'left' },
  {
    label: '生产订单号',
    prop: 'scPurchaseOrderNo',
    fixed: 'left',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '货品编码',
    prop: 'goodsNos',
    minWidth: 130,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '供应商', prop: 'supplierName', minWidth: 110, transform: (col) => col || '--' },
  {
    label: '供应商款号',
    prop: 'supplierGoodsNos',
    minWidth: 130,
    transform: (col) => col.join(',') || '--'
  },
  { label: '货品数', prop: 'goodsNumTotal', minWidth: 80 },
  { label: '采购数量', prop: 'purchasedGoodsQuantityTotal', minWidth: 90 },
  { label: '已发货', prop: 'goodsDeliveryQuantityTotal', minWidth: 80 },
  {
    label: '已退货',
    prop: 'goodsStockOutQuantityTotal',

    transform: (col) => col ?? 0
  },
  { label: '待发货', prop: 'goodsUnDeliveryQuantityTotal', minWidth: 80 },
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
  {
    label: '状态',
    prop: 'status',
    formatter: statusDom(statusOps),
    width: 140
  },
  { label: '跟单人', prop: 'orderHandler', width: 130, formatter: person },
  { label: '下单时间', prop: 'submitTime', width: 120 },
  { label: '操作', type: 'options', fixed: 'right' }
]

/** 预约发货列表 */
export const allOrderTable: TableOption = [
  // { type: 'selection', fixed: 'left' },
  {
    label: '预约发货单号',
    prop: 'advancedShippingRequestOrderNo',
    width: 130,
    fixed: 'left',
    formatter: copyBtn
  },
  {
    label: '生产订单号',
    prop: 'scPurchaseOrderNo',
    width: 140,
    showOverFlowTooltip: false,
    formatter: goodsNosFormatter
  },
  { label: 'ERP采购单号', prop: 'wdtPurchaseNo', width: 160, formatter: copyBtn },
  {
    label: '货品编码',
    prop: 'goodsNos',
    minWidth: 130,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '供应商', prop: 'supplierName', minWidth: 110, transform: (col) => col || '--' },
  {
    label: '供应商款号',
    prop: 'supplierGoodsNos',
    minWidth: 130,
    transform: (col) => col.join(',') || '--'
  },
  { label: '货品数', prop: 'goodsNumTotal' },
  { label: '发货数', prop: 'deliveryGoodsQuantityTotal' },
  { label: '入库量', prop: 'stockIn' },
  {
    label: '发货日期',
    prop: 'auditTime',
    transform: (col) => formatDate(col, 'YYYY-MM-DD') || '--',
    minWidth: 110
  },
  { label: '预约到货日期', prop: 'appointmentDate', width: 110 },
  {
    label: '审核状态',
    prop: 'auditStatus',
    formatter: statusDom(auditStatusOps),
    width: 130
  },
  {
    label: '审核人',
    prop: 'auditPerson',
    width: 110,
    formatter: (row, _, cellValue) => {
      if (cellValue) return person(row, _, cellValue)
      else if (row.auditPersonId === 'system') return '系统审核'
      else return '--'
    }
  },
  { label: '审核时间', prop: 'auditTime', width: 180 },
  { label: '创建人', prop: 'createUser', width: 110, formatter: person },
  { label: '创建时间', prop: 'createdAt', width: 180 },
  { label: '操作', type: 'options', fixed: 'right' }
]

/** 装箱单 */
export const pickingListOps: TableOption = [
  {
    type: 'index',
    label: '序号',
    width: 60,
    fixed: 'left',
    indexMethod: (index) => index || '合计'
  },
  {
    label: '箱号',
    slotName: 'boxNumber',
    minWidth: 220,
    required: true,
    showOverFlowTooltip: false
  },
  { label: '货品名称', prop: 'goodsName', showOverFlowTooltip: true, minWidth: 150 },
  { label: '货品编码', prop: 'goodsCode', showOverFlowTooltip: true, minWidth: 100 },
  { label: 'SKU编码', prop: 'sku', minWidth: 200, isForm: true },
  { prop: 'imgUrl', label: '图片', minWidth: 60, formatter: imgUrl },
  { label: '规格名称', prop: 'formName', showOverFlowTooltip: true, minWidth: 120 },
  {
    label: '规格码',
    prop: 'formCode',
    showOverFlowTooltip: true,
    transform: (col, _, index) => (index ? col || '--' : '')
  },
  {
    label: '预约发货数量',
    prop: 'deliveryGoodsQuantity',
    minWidth: 120,

    fixed: 'right'
  },
  {
    label: '每箱数',
    prop: 'boxQuantity',
    minWidth: 100,
    fixed: 'right',
    required: true,
    isForm: true,
    rules: (row, _, data) => ({
      required: true,
      validator: (_, __, callback) => {
        const sameSkuTotal = data
          ?.filter((ele) => ele.sku === row.sku)
          .reduce(
            (arr, cur) =>
              arr +
              (cur.boxQuantity || 0) * ((cur.endBoxNumber || 0) - (cur.startBoxNumber || 0) + 1),
            0
          )
        if (sameSkuTotal > row.deliveryGoodsQuantity) return callback(new Error('不可超发'))
        callback()
      }
    })
  },
  {
    label: '箱数',
    prop: 'boxNum',
    minWidth: 100,

    fixed: 'right',
    transform: (col, row, index) => {
      if (row.endBoxNumber && row.startBoxNumber && index)
        return Math.abs((row.endBoxNumber ?? 0) - (row.startBoxNumber ?? 0)) + 1
      else if (!index) return col
      else return 0
    }
  },
  {
    label: '装箱数量',
    prop: 'totalQuantity',
    showOverFlowTooltip: true,
    minWidth: 100,

    fixed: 'right'
  },
  { label: '操作', type: 'options', fixed: 'right' }
]

/**打印表格配置 */
export const printTable: TableOption = [
  { label: '货品编码', prop: 'goodsCode', width: 90 },
  { label: '货品名称', prop: 'goodsName' },
  { label: '商品编码', prop: 'sku' },
  { label: '规格名称', prop: 'formName' },
  { label: '规格码', prop: 'formCode' },
  { label: '箱号', slotName: 'boxNumber', width: 90 },
  { label: '每箱数', prop: 'boxQuantity', width: 90 },
  { label: '总数', prop: 'total', width: 90 },
  { label: '收货数量', slotName: 'consig', width: 90 }
]

/** 新增/编辑 */
export const addPurchaseTable: TableOption = [
  {
    type: 'index',
    label: '序号',
    width: 60,
    fixed: 'left',
    indexMethod: (index) => (index ? index : '合计')
  },
  {
    prop: 'imgUrl',
    label: '图片',
    minWidth: 50,
    formatter: (_, __, cellValue, index) => (index ? imgUrl(_, __, cellValue) : '')
  },
  { label: '货品名称', prop: 'goodsName', showOverFlowTooltip: true, minWidth: 130 },
  {
    label: '货品编码',
    prop: 'goodsCode',
    showOverFlowTooltip: true,
    minWidth: 130,
    formatter: copyBtn
  },
  { label: 'SKU编码', prop: 'sku', showOverFlowTooltip: true, minWidth: 130, formatter: copyBtn },
  { prop: 'providerGoodsNo', label: '供应商货号', minWidth: 120 },
  { label: '规格名称', prop: 'formName', showOverFlowTooltip: true, minWidth: 120 },
  { label: '规格码', prop: 'formCode', showOverFlowTooltip: true, minWidth: 120 },
  { label: '采购数量', prop: 'purchasedGoodsQuantity', minWidth: 100 },
  { label: '待发货', prop: 'remainingDeliveryQuantity', minWidth: 100 },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 120,
    transform: (col, { key }) => (key === 'sumRow' ? '' : formatDate(new Date(col), 'YYYY-MM-DD'))
  },
  {
    label: '发货数量',
    prop: 'deliveryGoodsQuantity',
    minWidth: 155,
    required: true,
    fixed: 'right',
    showOverFlowTooltip: false,
    isForm: true,
    rules: (row) => ({
      required: true,
      validator: (_, val, callback) => {
        if (val === null || val === undefined) return callback()
        else if (row.remainingDeliveryQuantity < 0) return callback(new Error('不能超过待发货量'))
        callback()
      }
    })
  },
  {
    label: '单价',
    prop: 'supplierGoodsPrice',
    minWidth: 80,

    fixed: 'right',
    transform: (col, _, index) => (index ? col ?? '--' : null)
  },
  {
    label: '金额',
    prop: 'price',
    minWidth: 80,

    fixed: 'right',
    transform: (col, row, index) =>
      index
        ? Math.round(
            Number(row.deliveryGoodsQuantity ?? 0) * Number(row.supplierGoodsPrice ?? 0) * 100
          ) / 100
        : col
  }
]

/** 采购生产订单查看 */
export const orderDetailTableOps: TableOption = [
  {
    type: 'index',
    label: '序号',
    width: 60,
    fixed: 'left',
    indexMethod: (index) => (index ? index : '合计')
  },
  { prop: 'imgUrl', label: '图片', width: 60, formatter: imgUrl },
  {
    prop: 'goodsCode',
    label: '货品编码',
    width: 120,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { prop: 'goodsName', label: '货品名称', width: 116 },
  {
    prop: 'sku',
    label: 'SKU编码',
    width: 120,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { prop: 'formName', label: '规格名称', width: 150 },
  { prop: 'formCode', label: '规格码', width: 120 },
  { prop: 'iterateCode', label: '迭代码', width: 150 },
  { prop: 'purchasedGoodsQuantity', label: '采购数量', width: 90, fixed: 'right' },
  {
    prop: 'goodsDeliveryQuantity',
    label: '已发货',
    width: 80,

    fixed: 'right'
  },
  {
    prop: 'remainingDeliveryQuantity',
    label: '未发货',
    width: 80,

    fixed: 'right'
  },
  {
    label: '合同首批日期',
    prop: 'firstBatchTime',
    width: 120,
    transform: (col, { key }) => (key === 'sumRow' ? '' : col ?? '--')
  },
  { prop: 'orderArrivalTime', label: '合同清单日期', width: 120 },
  { label: '裸货价', fixed: 'right', prop: 'baseProdCost', minWidth: 80 },
  { label: '成品价', fixed: 'right', prop: 'fgCost', minWidth: 80 }
]

export const previewTable: TableOption = [
  { type: 'index', width: 60, label: '序号' },
  { prop: 'sku', label: 'SKU编码', minWidth: 150 },
  { prop: 'deliveryGoodsQuantity', label: '发货数量', minWidth: 100 }
]

export const addProductTable: TableOption = [
  { type: 'selection', selectable: (row) => !row.isSelected },
  { prop: 'imgUrl', label: '图片', width: 60, formatter: imgUrl },
  { prop: 'goodsName', label: '货品名称', width: 116 },
  {
    prop: 'goodsCode',
    label: '货品编码',
    width: 120,
    formatter: goodsNosFormatter
  },
  {
    prop: 'sku',
    label: 'SKU编码',
    width: 120,
    formatter: (__, _, cellValue) => {
      return (
        <ElButton link onClick={() => handleCopyCode(cellValue)} class={'copy-btn'}>
          {cellValue}
        </ElButton>
      )
    }
  },
  { prop: 'providerGoodsNo', label: '供应商货号', minWidth: 120 },
  { prop: 'formName', label: '规格名称', width: 150 },
  { prop: 'formCode', label: '规格码', width: 120 },
  { label: '待发货', prop: 'remainingDeliveryQuantity', minWidth: 80 },
  { label: '合同首批日期', prop: 'firstBatchTime', width: 120, transform: (col) => col ?? '--' },
  { prop: 'orderArrivalTime', label: '合同清单日期', width: 120 },
  { prop: 'poCount', label: '采购订单', width: 90 }
]

export const PoDetailTable: TableOption = [
  {
    prop: 'poNo',
    label: '生产单号',
    minWidth: 110,
    formatter: copyCell
  },
  {
    prop: 'sku',
    label: 'SKU编码',
    minWidth: 110,
    formatter: copyCell
  },
  { prop: 'providerGoodsNo', label: '供应商货号', minWidth: 110 },
  { prop: 'purchasedGoodsQuantity', label: '采购量', width: 80 },
  { prop: 'formCode', label: '规格码', width: 120 },
  { label: '裸货价', prop: 'baseProdCost', minWidth: 80 },
  { label: '成品价', prop: 'fgCost', minWidth: 80 },
  { label: '待发货', prop: 'remainingDeliveryQuantity', minWidth: 80 },
  { label: '合同首批日期', prop: 'firstBatchTime', width: 120, transform: (col) => col ?? '--' },
  { prop: 'orderArrivalTime', label: '合同清单日期', width: 120 }
]
