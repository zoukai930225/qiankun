import { handleCopyCode } from '@/utils/copyText'
import { formatDate } from '@/utils/formatTime'
import { ElButton } from 'element-plus'
import {
  copyBtn,
  goodsNosFormatter,
  imgUrl,
  person,
  persons,
  statusDom
} from '../components/twoFourSix'
import { auditStatusOps2 } from '../appointment/options'

export const mainTable: TableOption = [
  // { type: 'selection' },
  {
    label: '预约发货号',
    prop: 'advancedShippingRequestOrderNo',
    minWidth: 130,
    fixed: 'left',
    formatter: copyBtn
  },
  {
    label: '采购生产单号',
    prop: 'scPurchaseOrderNo',
    minWidth: 130,
    tooltipFormatter: ({ cellValue }) => (
      <div>
        {(cellValue as string).split(',').map((ele) => (
          <div>
            <ElButton class="copy-btn light" link onClick={() => handleCopyCode(ele)}>
              {ele}
            </ElButton>
          </div>
        ))}
      </div>
    )
  },
  { label: 'ERP采购单号', prop: 'wdtPurchaseNo', minWidth: 160, formatter: copyBtn },
  {
    label: '货品编码',
    prop: 'goodsNos',
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false,
    minWidth: 100
  },
  { label: '货品数', prop: 'goodsNumTotal', minWidth: 80 },
  { label: '发货量', prop: 'deliveryGoodsQuantityTotal', minWidth: 100 },
  { label: '入库量', prop: 'inboundGoodsQuantityTotal', minWidth: 100 },
  {
    label: '发货日期',
    prop: 'auditTime',
    transform: (col) => formatDate(col, 'YYYY-MM-DD') || '--',
    minWidth: 110
  },
  {
    label: '预约到货日期',
    prop: 'appointmentDate',
    minWidth: 110,
    transform: (col) => (col ? formatDate(col, 'YYYY-MM-DD') : '--')
  },
  { label: '审核状态', prop: 'auditStatus', minWidth: 120, formatter: statusDom(auditStatusOps2) },
  { label: '供应商', prop: 'supplierName', minWidth: 120, transform: (col) => col || '--' },
  { label: '跟单人', prop: 'orderHandler', minWidth: 140, formatter: persons },
  {
    label: '审核人',
    prop: 'auditPerson',
    minWidth: 130,
    formatter: (row, __, cellValue) => {
      if (cellValue) {
        return person(row, __, cellValue)
      } else if (row.auditPersonId === 'system') {
        return '系统审核'
      } else {
        return '--'
      }
    }
  },
  { label: '审核时间', prop: 'auditTime', minWidth: 170, transform: (col) => col || '--' },
  { label: '创建时间', prop: 'createdAt', minWidth: 170, transform: (col) => col || '--' },
  { label: '操作', type: 'options', fixed: 'right' }
]

/** 新增/编辑 */
export const addPurchaseTable: TableOption = [
  { type: 'index', label: '序号', width: 60, indexMethod: (index) => index || '合计' },
  { prop: 'imgUrl', label: '图片', width: 60, formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', minWidth: 110 },
  {
    label: '货品编码',
    prop: 'goodsCode',
    showOverFlowTooltip: true,
    formatter: copyBtn,
    minWidth: 110
  },
  {
    label: 'SKU编码',
    prop: 'sku',
    showOverFlowTooltip: true,
    formatter: copyBtn,
    minWidth: 110
  },
  {
    prop: 'providerGoodsNo',
    label: '供应商货号',
    transform: (col, { key }) => (key !== 'sumRow' ? col || '--' : ''),
    minWidth: 110
  },
  { label: '规格名称', prop: 'formName', showOverFlowTooltip: true },
  { label: '规格码', prop: 'formCode', showOverFlowTooltip: true, minWidth: 80 },
  { label: '采购数量', prop: 'purchasedGoodsQuantity', minWidth: 90 },
  { label: '采购价格', prop: 'supplierGoodsPrice', minWidth: 80 },
  {
    label: '金额',
    prop: 'price',
    minWidth: 80,

    transform: (col, row) =>
      row.key !== 'sumRow'
        ? Math.round((row?.deliveryGoodsQuantity ?? 0) * (row?.supplierGoodsPrice ?? 0) * 100) / 100
        : col
  },
  { label: '待发货', prop: 'remainingDeliveryQuantity', minWidth: 80 },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 120,
    transform: (col, { key }) => (key !== 'sumRow' ? formatDate(col, 'YYYY-MM-DD') : '')
  },
  { label: '发货数量', prop: 'deliveryGoodsQuantity', minWidth: 80 }
]

export const PoDetailTable: TableOption = [
  { type: 'index', label: '序号', width: 60, indexMethod: (index) => index || '合计' },
  {
    prop: 'imgUrl',
    label: '图片',
    minWidth: 50,
    formatter: (_, __, cellValue, index) => (index ? imgUrl(_, __, cellValue) : '')
  },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  {
    label: '货品编码',
    prop: 'goodsCode',
    showOverFlowTooltip: true,
    formatter: copyBtn
  },
  {
    label: 'SKU编码',
    prop: 'sku',
    showOverFlowTooltip: true,
    formatter: copyBtn,
    tooltipFormatter: ({ row }) => (
      <ElButton
        class="light"
        style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"
        link={true}
        onClick={() => handleCopyCode(row.sku)}
      >
        {row.sku}
      </ElButton>
    ),
    minWidth: 130
  },
  { label: '规格名称', prop: 'formName', showOverFlowTooltip: true },
  { label: '规格码', prop: 'formCode', showOverFlowTooltip: true, minWidth: 80 },
  { label: '采购数量', prop: 'purchasedGoodsQuantity', minWidth: 90 },
  { label: '已发货数', prop: 'goodsDeliveryQuantity', minWidth: 80 },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 120,
    transform: (col, _, index) => (index ? formatDate(col, 'YYYY-MM-DD') : '')
  }
]
