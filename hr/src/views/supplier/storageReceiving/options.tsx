import { formatDate } from '@/utils/formatTime'
import { copyBtn, imgUrl } from '../components/twoFourSix'

export const addPurchaseTable: TableOption = [
  { type: 'index', label: '序号', width: 60, indexMethod: (index) => index || '合计' },
  { prop: 'imgUrl', label: '图片', minWidth: 60, formatter: imgUrl },
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
  { label: '采购数量', prop: 'purchasedGoodsQuantity', minWidth: 90,  },
  { label: '采购价格', prop: 'supplierGoodsPrice', minWidth: 80,  },
  {
    label: '金额',
    prop: 'price',
    minWidth: 80,
    
    transform: (col, row) =>
      row.key !== 'sumRow'
        ? Math.round((row?.deliveryGoodsQuantity ?? 0) * (row?.supplierGoodsPrice ?? 0) * 100) /
          100
        : col
  },
  { label: '待发货', prop: 'remainingDeliveryQuantity', minWidth: 80,  },
  {
    label: '合同清单日期',
    prop: 'orderArrivalTime',
    minWidth: 120,
    transform: (col, { key }) => (key !== 'sumRow' ? formatDate(col, 'YYYY-MM-DD') : '')
  },
  { label: '发货数量', prop: 'deliveryGoodsQuantity', minWidth: 80,  },
  { label: '入库量', prop: 'stockIn', minWidth: 80,  }
]
