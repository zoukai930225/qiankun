import { copyCell } from '../appointment/options'
import { imgUrl, person, statusDom } from '../components/twoFourSix'

/**类目级联配置 */
export const customProps = {
  label: 'categoryName',
  value: 'categoryCode',
  children: 'subCategories',
  multiple: true
}

export const outOfStockOps = [
  { label: '上架款', value: 0, color: '#349B34', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '下架款', value: 1, color: 'rgba(235, 55, 55, 1)', bg: 'rgba(255, 217, 217, 1)' }
]

export const enableOptions = [
  { label: '启用', value: 1, color: '#349B34', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '停用', value: 0, color: 'rgba(235, 55, 55, 1)', bg: 'rgba(255, 217, 217, 1)' }
]

export const hasTaxOptions = [
  { label: '含税', value: true, color: '#349B34', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '不含税', value: false, color: 'rgba(235, 55, 55, 1)', bg: 'rgba(255, 217, 217, 1)' }
]

export const tableOption: TableOption = [
  { type: 'selection', width: 40, fixed: 'left' },
  {
    label: '类目',
    prop: 'category',
    fixed: 'left',
    transform: (col) => col || '--',
    minWidth: 150
  },
  { label: '货品名称', prop: 'goodsName', fixed: 'left', width: 120 },
  { label: '货品编号', prop: 'goodsNo', fixed: 'left', width: 120 },
  { label: '供应商货号', prop: 'supplierGoodsNo', width: 120, transform: (col) => col || '--' },
  {
    label: '下架状态',
    prop: 'outOfStock',
    width: 120,
    formatter: statusDom(outOfStockOps)
  },
  {
    label: '供应商',
    prop: 'supplierBasicInfoBO',
    width: 120,
    transform: (col) => col.supplierName
  },
  { label: '平均采购价格', prop: 'avgPurchasePrice', width: 110 },
  {
    label: '最后采购价格',
    prop: 'lastPurchasePrice',

    width: 110,
    transform: (col) => col || '--'
  },
  {
    label: '最后采购时间',
    prop: 'lastPurchaseTime',
    width: 170,
    transform: (col) => col || '--'
  },
  { label: '更新时间', prop: 'updatedAt', width: 170, showOverFlowTooltip: false },
  {
    label: '更新人',
    prop: 'updator',
    width: 130,
    formatter: person
  },
  { label: '操作', type: 'options', fixed: 'right' }
]

/**新增/编辑 只读表单配置 */
export const readonlyFormOptions = [
  { label: 'ERP货品分类', key: 'className' },
  { label: '货品别名', key: 'alias' },
  { label: '成分', key: 'composition' },
  { label: '货品创建时间', key: 'createTime' },
  { label: '执行标准', key: 'executionStandards' },
  { label: '安全技术类别', key: 'securityTechnologyCategory' },
  { label: '类目', key: 'categoryDisplay' },
  { label: '商品等级', key: 'level' },
  { label: '生产周期', key: 'productionCycleDisplay' },
  { label: '性别', key: 'sexDisplay' },
  { label: '季节', key: 'seasonDisplay' },
  { label: '年份', key: 'year' }
]

/**新增/编辑 未选择的SKU列表 */
export const unselectedSkuTable: TableOption = [
  { type: 'selection', width: 40 },
  { label: '图片', prop: 'imgUrl', minWidth: 60, formatter: imgUrl },
  { label: 'SKU编码', prop: 'sku', minWidth: 130 },
  { label: '货品编码', prop: 'goodsNo', minWidth: 130 },
  { label: '规格名称', prop: 'specName', minWidth: 130 },
  { label: '规格码', prop: 'specCode', transform: (col) => col ?? '--' }
]

/**新增/编辑 货品明细列表 */
export const goodsDetailTable: TableOption = [
  { type: 'index', label: '序号', width: 60, fixed: 'left' },
  { label: '图片', prop: 'imgUrl', width: 60, formatter: imgUrl },
  { label: '货品名称', prop: 'goodsName', minWidth: 120 },
  { label: 'SKU编码', prop: 'sku', minWidth: 120 },
  { label: '规格名称', prop: 'specName', width: 120 },
  { label: '规格码', prop: 'specCode', transform: (col) => col ?? '--', width: 80 },
  {
    label: '成品价',
    prop: 'fgCost',
    fixed: 'right',
    width: 130,

    required: true,
    showOverFlowTooltip: false,
    isForm: true
  },
  {
    label: '裸货价',
    prop: 'baseProdCost',
    fixed: 'right',
    width: 130,

    required: true,
    showOverFlowTooltip: false,
    isForm: true
  },
  {
    label: '包材价格',
    prop: 'whPackCost',
    fixed: 'right',
    width: 130,

    required: true,
    showOverFlowTooltip: false,
    isForm: true
  },
  {
    label: '是否含税',
    prop: 'hasTax',
    width: 120,
    required: true,
    showOverFlowTooltip: false,
    fixed: 'right',
    isForm: true
  },
  {
    label: '最小采购量',
    prop: 'minPurchaseQty',
    fixed: 'right',
    width: 130,

    required: true,
    showOverFlowTooltip: false,
    isForm: true
  },
  {
    label: '税率',
    prop: 'taxRate',
    fixed: 'right',
    width: 130,

    required: true,
    showOverFlowTooltip: false,
    isForm: true
  },
  {
    label: '折扣',
    prop: 'discountRate',
    fixed: 'right',
    width: 130,

    required: true,
    showOverFlowTooltip: false,
    isForm: true
  },
  { label: '操作', type: 'options', fixed: 'right' }
]

/**SKU明细 */
export const SKUDetailTable: TableOption = [
  { type: 'selection', width: 40, fixed: 'left' },
  { label: '图片', prop: 'imgUrl', fixed: 'left', width: 60, formatter: imgUrl },
  {
    label: '类目',
    prop: 'category',
    fixed: 'left',
    minWidth: 150,
    transform: (col) => col || '--'
  },
  { label: '货品名称', prop: 'goodsName', fixed: 'left', minWidth: 120 },
  { label: 'SKU编码', prop: 'sku', minWidth: 150 },
  { label: '规格名称', prop: 'specName', minWidth: 120 },
  { label: '规格码', prop: 'specCode', transform: (col) => col || '--', minWidth: 80 },
  {
    label: '下架状态',
    prop: 'outOfStock',
    minWidth: 120,
    formatter: statusDom(outOfStockOps)
  },
  { label: '成品采购价', prop: 'fgCost', minWidth: 120, required: true, isForm: true },
  { label: '裸货采购价', prop: 'baseProdCost', minWidth: 120, required: true, isForm: true },
  { label: '包材价格', prop: 'whPackCost', minWidth: 120, isForm: true, required: true },
  { label: '是否含税', prop: 'hasTax', minWidth: 120, required: true, isForm: true },
  { label: '最小采购量', prop: 'minPurchaseQty', minWidth: 120, required: true, isForm: true },
  { label: '税率', prop: 'taxRate', minWidth: 120, required: true, isForm: true },
  { label: '折扣', prop: 'discountRate', minWidth: 120, required: true, isForm: true },
  { label: '平均采购价格', prop: 'avgPrice', minWidth: 110, transform: (col) => col || '--' },
  {
    label: '最后采购价格',
    prop: 'lastPurchasePrice',
    minWidth: 110,
    transform: (col) => col || '--'
  },
  {
    label: '最后采购时间',
    prop: 'latestPurchaseTime',
    minWidth: 170,
    transform: (col) => col || '--'
  },
  { label: '启用状态', prop: 'enable', minWidth: 90, formatter: statusDom(enableOptions) },
  { label: '更新时间', prop: 'updatedAt', minWidth: 170 },
  {
    label: '更新人',
    prop: 'updatedName',
    transform: (col, row) => ({ name: col, avatarOrigin: row.updatedAvatarOrigin }),
    minWidth: 120
  },
  { label: '操作', type: 'options', fixed: 'right' }
]

/**变更日志列表 */
export const logListTable: TableOption = [
  { label: '图片', prop: 'imgUrl', fixed: 'left', width: 60, formatter: imgUrl },
  { label: 'SKU编码', prop: 'sku', minWidth: 110, formatter: copyCell },
  { label: '成品价', prop: 'fgCost', minWidth: 80 },
  { label: '裸货价', prop: 'baseProdCost', minWidth: 80 },
  { label: '变更人', prop: 'updatedUser', minWidth: 110, formatter: person },
  { label: '变更时间', prop: 'updatedAt', minWidth: 150 }
]

export const skuLogListTable: TableOption = [
  { label: '变更人', prop: 'updatedUser', formatter: person },
  { label: '变更时间', prop: 'updatedAt' },
  { label: '成品价', prop: 'fgCost', minWidth: 80 },
  { label: '裸货价', prop: 'baseProdCost', minWidth: 80 }
]
