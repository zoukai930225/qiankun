import { handleCopyCode } from '@/utils/copyText'
import { ElAvatar, ElButton, ElImage, ElPopover } from 'element-plus'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'
import CopyIcon from '@/assets/svgs/supplier/copy.vue'
import defaultImg from '@/assets/imgs/supplier/defaultImg.svg'
import { formatDate } from '@/utils/formatTime'

function person(cellValue: any) {
  return (
    <div class="orderHandler">
      <div class="orderHandler-item flex items-center">
        {h(ElAvatar, { class: 'mr8px', size: 18, src: cellValue?.avatarOrigin || DefaultAvatar })}
        <div class="name">{cellValue?.name}</div>
      </div>
    </div>
  )
}

function goodsName(row: any) {
  return h(
    ElPopover,
    {
      placement: 'right-start',
      'show-arrow': false,
      'popper-style': { width: '352px', padding: '16px', 'border-radius': '8px' },
      showAfter: 200
    },
    {
      default: () => [
        <div class="color-#0064ff lh-20px mb-10px">{row.goodsName || '--'}</div>,
        <div class="w-320px h-320px bg-#E7E8EB flex items-center justify-center">
          {h(
            ElImage,
            {
              src: row.imgUrl,
              fit: 'contain',
              class: row.imgUrl ? 'w-320px h-320px' : 'w-120px h120px'
            },
            {
              error: () => h('img', { src: defaultImg, class: 'w-120px' })
            }
          )}
        </div>,
        <div class="flex items-center color-#415A88 lh-17px mt-18px font-size-12px fill-#415A88">
          <span>SKU编码：</span>
          <span>{row.sku}</span>
          <CopyIcon size={12} class="ml-4px" onClick={() => handleCopyCode(row.sku)} />
        </div>
      ],

      reference: () => (
        <div class="flex items-center !max-w-100%" style="width:fit-content">
          {h(
            ElImage,
            { src: row.imgUrl, fit: 'contain', class: 'w-36px h36px mr-14px' },
            {
              error: () => h('img', { src: defaultImg, class: 'h-36px' })
            }
          )}
          <div class="text-ellipsis-single flex-1">{row.goodsName || '--'}</div>
        </div>
      )
    }
  )
}

function goodsNoAndSku(_, __, value, index) {
  return index ? (
    <ElButton
      link
      class="copy-btn max-w-100% !font-400"
      style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap;"
      onClick={() => handleCopyCode(value)}
    >
      {value}
    </ElButton>
  ) : (
    ''
  )
}

/** 供应商台账列表 */
export const ledgerTable: TableOption = [
  {
    label: '供应商名称',
    prop: 'supplierName',
    minWidth: 130,
    fixed: 'left',
    transform: (col, __, index) => (index ? col : '合计')
  },
  {
    label: '货品名称',
    prop: 'goodsName',
    minWidth: 240,
    formatter: (row, _, __, index) => (index ? goodsName(row) : ''),
    fixed: 'left'
  },
  {
    label: '货品编码',
    prop: 'goodsNo',
    minWidth: 100,
    formatter: goodsNoAndSku
  },
  {
    label: 'sku编码',
    prop: 'sku',
    minWidth: 130,
    formatter: goodsNoAndSku
  },
  { label: '规格名称', prop: 'specName', minWidth: 120 },
  { label: '规格码', prop: 'specCode', minWidth: 80 },
  {
    label: '采购数量',
    prop: 'purchaseNum',
    minWidth: 130,
    transform: (col, row, index) =>
      new Intl.NumberFormat().format(index ? col : row.totalPurchaseNum)
  },
  {
    label: '未发货',
    prop: 'unDeliveryNum',
    minWidth: 130,

    transform: (col, row, index) =>
      new Intl.NumberFormat().format(index ? col : row.totalUnDeliveryNum)
  },
  {
    label: '在途数',
    prop: 'inboundNum',
    minWidth: 130,

    transform: (col, row, index) =>
      new Intl.NumberFormat().format(index ? col : row.totalInboundNum)
  },
  {
    label: '实际入库',
    prop: 'actualInboundNum',
    minWidth: 130,

    transform: (col, row, index) =>
      new Intl.NumberFormat().format(index ? col : row.totalActualInboundNum)
  },
  {
    label: '实际入库金额（元）',
    prop: 'actualInboundAmount',
    minWidth: 160,

    transform: (col, row, index) =>
      new Intl.NumberFormat().format(index ? col : row.totalActualInboundAmount)
  }
]

/** 跟单台账列表 */
export const orderHandlerTable: TableOption = [
  {
    label: '跟单员',
    prop: 'orderHandler',
    formatter: (__, _, cellValue, index) => (index ? person(cellValue) : '合计'),
    minWidth: 130,
    fixed: 'left'
  },
  {
    label: '货品名称',
    prop: 'goodsName',
    minWidth: 240,
    showOverFlowTooltip: false,
    formatter: (row, _, __, index) => (index ? goodsName(row) : ''),
    fixed: 'left'
  },
  { label: '货品编码', prop: 'goodsNo', minWidth: 130, formatter: goodsNoAndSku },
  { label: 'sku编码', prop: 'sku', minWidth: 130, formatter: goodsNoAndSku },
  { label: '规格名称', prop: 'specName', minWidth: 120 },
  { label: '规格码', prop: 'specCode', minWidth: 80 },
  {
    label: '采购数量',
    prop: 'purchaseTotal',
    minWidth: 130,
    transform: (col) => new Intl.NumberFormat().format(col)
  },
  {
    label: '在厂数量',
    prop: 'inFactoryTotal',
    minWidth: 130,

    transform: (col) => new Intl.NumberFormat().format(col)
  },
  {
    label: '在途数量',
    prop: 'inboundTotal',
    minWidth: 130,

    transform: (col) => new Intl.NumberFormat().format(col)
  },
  {
    label: '入库裸货数',
    prop: 'baseGoodsInboundTotal',
    minWidth: 130,

    transform: (col) => new Intl.NumberFormat().format(col)
  },
  {
    label: '入库成品数',
    prop: 'inboundFgGoodsTotal',
    minWidth: 130,

    transform: (col) => new Intl.NumberFormat().format(col)
  },
  {
    label: '实际入库总数',
    prop: 'actualInboundTotal',
    minWidth: 130,

    transform: (col) => new Intl.NumberFormat().format(col)
  },
  {
    label: '实际入库金额',
    prop: 'actualInboundAmountTotal',
    minWidth: 130,

    transform: (col) => new Intl.NumberFormat().format(col)
  },
  { label: '采购完成率', prop: 'purchaseCompletionRate', minWidth: 130 }
]

export const defaultDate = [
  formatDate(
    (() => {
      const today = new Date()
      const day = today.getDate()
      today.setDate(day - 30)
      return today
    })(),
    'YYYY-MM-DD'
  ),
  formatDate(new Date(), 'YYYY-MM-DD')
]
