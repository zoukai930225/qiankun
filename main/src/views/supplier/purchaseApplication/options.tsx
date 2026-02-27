import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import {
  copyBtn,
  goodsNosFormatter,
  imgUrl,
  person,
  persons,
  statusDom,
  channel
} from '../components/twoFourSix'

export const statusOps = [
  { label: '编辑中', value: '0', color: '#DB6A0F', bg: '#F7DECB' },
  { label: '审核中', value: '1', color: '#0064FF', bg: 'rgba(0, 100, 255, 0.2)' },
  { label: '审核通过', value: '2', color: 'rgba(52, 155, 52, 1)', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '审核不通过', value: '3', color: 'rgba(235, 55, 55, 1)', bg: 'rgba(255, 217, 217, 1)' }
]

export enum inTableSort {
  'totalInventory',
  'inTransitNum',
  'inFactoryNum',
  'inventory',
  'unscheduledNum',
  'salesNumYesterday',
  'salesNumSeven',
  'salesNumFourteen',
  'salesNumThirty',
  'productionCycle',
  'turnoverDays',
  'sevenTurnover',
  'fourteenTurnover',
  'thirtyTurnover',
  'inventoryAfterRestocking',
  'turnoverDaysAfterRestocking'
}

export const COLUMN_1: TableOption = [
  {
    label: '总库存',
    prop: 'totalInventory',

    minWidth: 120,
    headertip: '在途+在厂+在仓'
  },
  { label: '昨日销量', prop: 'salesNumYesterday', minWidth: 120 },
  {
    label: '补货后库存',
    prop: 'inventoryAfterRestocking',

    minWidth: 120,
    headertip: '总库存 + 申请量'
  },

  {
    label: '在途',
    prop: 'inTransitNum',

    minWidth: 120,
    headertip: '供应商已发货，实际未入库的数量（已预约未入库数量），预约总数 - 入库总数'
  },
  { label: '7天销量', prop: 'salesNumSeven', minWidth: 120 },
  {
    label: '补货后周转天数',
    prop: 'turnoverDaysAfterRestocking',

    minWidth: 150,
    headertip: '补货后库存 / 昨日销量'
  },

  {
    label: '在厂',
    prop: 'inFactoryNum',

    minWidth: 120,
    headertip: '已下单未发货数量，采购数量 - 实际入库总数 - 在途数'
  },
  { label: '14天销量', prop: 'salesNumFourteen', minWidth: 120 },
  {
    label: '7天销量周转',
    prop: 'sevenTurnover',
    minWidth: 130,
    headertip: '总库存 / 7天销量 * 7'
  },

  {
    label: '在仓',
    prop: 'inventory',

    minWidth: 120,
    headertip: '仓库库存（目前每日更新一次库存数据）'
  },
  { label: '30天销量', prop: 'salesNumThirty', minWidth: 120 },
  {
    label: '14天销量周转',
    prop: 'fourteenTurnover',

    minWidth: 130,
    headertip: '总库存 / 14天销量 * 14'
  },

  {
    label: '待分配',
    prop: 'unscheduledNum',

    minWidth: 120,
    headertip: '已计划未下单，计划补单量 - 已下单数量'
  },
  { label: '生产周期', prop: 'productionCycle', minWidth: 120 },
  {
    label: '30天销量周转',
    prop: 'thirtyTurnover',

    minWidth: 130,
    headertip: '总库存 / 30天销量 * 30'
  },

  {},
  {
    label: '预估周转天数',
    prop: 'turnoverDays',

    minWidth: 130,
    headertip: '总库存 / 昨日销量'
  },
  {}
]

export const tableOptions: TableOption = [
  { label: '图片', prop: 'imgUrl', width: 60, formatter: imgUrl },
  {
    label: '货品编码',
    prop: 'goodsCode',
    formatter: goodsNosFormatter,
    width: 130,
    showOverFlowTooltip: false
  },
  {
    label: '售卖渠道',
    prop: 'salesChannel',
    formatter: channel
  },
  {
    label: '产品类型',
    prop: 'productType',
    transform: (col) => getDictLabel(DICT_TYPE.OPS_REPLENISHMENT_PRODUCT_TYPE, col) || '--'
  },
  {
    label: '调整原因',
    prop: 'adjustmentType',
    transform: (col) => getDictLabel(DICT_TYPE.OPS_REPLENISHMENT_ADJUSTMENT_REASON, col) || '--'
  },
  { label: '货品数', prop: 'goodsQuantity', minWidth: 80 },
  { label: '申请量', prop: 'requestQuantity', minWidth: 110 },
  { label: '期望到货日期', prop: 'expectedArrivalTime', minWidth: 130 },
  { label: '状态', prop: 'status', minWidth: 110, formatter: statusDom(statusOps) },
  { label: '申请人', prop: 'requester', minWidth: 110, formatter: person },
  { label: '申请时间', prop: 'createdTime', minWidth: 180 },
  { label: '待审核人', prop: 'pendingReviewerPerson', minWidth: 150, formatter: persons },
  { label: '操作', type: 'options' }
]

export const addTable: TableOption = [
  { label: '序号', type: 'index', width: 60 },
  { label: '图片', prop: 'imgUrl', minWidth: 60, formatter: imgUrl },
  { label: '货品编码', prop: 'goodsCode', formatter: copyBtn, minWidth: 110 },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  { label: 'SKU编码', prop: 'sku', minWidth: 150, isForm: true, required: true },
  {
    label: '规格名称',
    prop: 'formName',
    minWidth: 130,
    transform: (col, row) => col || row.specName
  },
  {
    label: '规格码',
    prop: 'formCode',
    minWidth: 130,
    transform: (col, row) => col || row.specCode
  },
  {
    label: '申请量',
    prop: 'requestQuantity',
    minWidth: 130,
    isForm: true,
    required: true,
    rules: (row) => ({
      required: true,
      validator: (_, value, callback) => {
        if (row.expectedArrivalTime && !value) return callback(new Error('请输入'))
        else return callback()
      }
    })
  },
  { label: '预估单价', prop: 'estimatePrice', minWidth: 110 },
  {
    label: '期望到货日期',
    prop: 'expectedArrivalTime',
    minWidth: 180,
    isForm: true,
    required: true,
    rules: (row) => ({
      required: true,
      validator: (_, value, callback) => {
        if (row.requestQuantity && !value) return callback(new Error('请选择'))
        else return callback()
      }
    })
  },
  { label: '库存', prop: 'totalInventory', minWidth: 110 },
  { label: '7天周转', prop: 'sevenTurnover', minWidth: 110 },
  { label: '操作', slotName: 'options', minWidth: 80 }
]

export const detailTable: TableOption = [
  {
    label: '序号',
    type: 'index',
    width: 60,
    fixed: 'left'
  },
  { label: '图片', prop: 'imgUrl', minWidth: 60, formatter: imgUrl, fixed: 'left' },
  { label: '货品编码', prop: 'goodsCode', formatter: copyBtn, minWidth: 110 },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  { label: 'SKU编码', prop: 'sku', minWidth: 150, formatter: copyBtn },
  {
    label: '规格名称',
    prop: 'formName',
    minWidth: 130,
    transform: (col, row) => col || row.specName
  },
  {
    label: '规格码',
    prop: 'formCode',
    minWidth: 130,
    transform: (col, row) => col || row.specCode
  },
  {
    label: '申请量',
    prop: 'requestQuantity',
    minWidth: 130
  },
  { label: '预估单价', prop: 'estimatePrice', minWidth: 130 },
  {
    label: '期望到货日期',
    prop: 'expectedArrivalTime',
    minWidth: 150
  },
  { label: '库存', prop: 'totalInventory', minWidth: 110 },
  { label: '7天周转', prop: 'sevenTurnover', minWidth: 110 }
]

export const batchAddTableOps: TableOption = [
  { type: 'selection', fixed: 'left', selectable: (row) => !row.isSelected },
  { prop: 'imgUrl', label: '图片', minWidth: 60, formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', minWidth: 130 },
  { label: 'SKU编码', prop: 'sku', minWidth: 130 },
  { label: '规格名称', prop: 'specName', minWidth: 130 },
  { label: '规格码', prop: 'specCode', minWidth: 130 },
  { label: '迭代码', prop: 'iterateCode', minWidth: 130 }
]
