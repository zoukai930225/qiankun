import { getDictLabel, getIntDictOptions } from '@/utils/dict'

export const hasDirectorOptions = [
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]

export const statusOps = [
  { label: '售卖中', value: '1' },
  { label: '已下架', value: '2' },
  { label: '未开始', value: '' }
]

/** 渠道抽屉表格配置 */
export const channelTableOps: RightsManage.TableOption = [
  { label: '负责人', slotName: 'director', width: '250px' },
  {
    label: '责权角色',
    prop: 'role',
    transform: (col) => getDictLabel(DICT_TYPE.DUTY_AUTHORITY_ROLE, col),
    width: 100
  },
  { label: '负责时间', slotName: 'date' },
  { label: '操作', slotName: 'option', width: '150px' }
]

/** 类目抽屉表格配置 */
export const categoryTableOps: RightsManage.TableOption = [
  { label: '店铺', prop: 'store', slotName: 'store', width: 180, showOverFlowTooltip: true },
  { label: '负责人', slotName: 'director', width: 180 },
  {
    label: '责权角色',
    prop: 'role',
    transform: (col) => getDictLabel(DICT_TYPE.DUTY_AUTHORITY_ROLE, col),
    width: 100
  },
  { label: '负责时间', slotName: 'date' },
  { label: '操作', slotName: 'option', width: '120px' }
]

/** 商品抽屉表格配置 */
export const goodsTableOps: RightsManage.TableOption = [
  { label: '负责人', slotName: 'director', width: 200 },
  {
    label: '责权角色',
    prop: 'role',
    transform: (col) => getDictLabel(DICT_TYPE.DUTY_AUTHORITY_ROLE, col),
    width: 100
  },
  { label: '负责时间', slotName: 'date' },
  { label: '操作', slotName: 'option', width: 120 }
]

/** 店铺抽屉表格配置 */
export const storeTableOps: RightsManage.TableOption = [
  { label: '负责人', slotName: 'director', width: 200 },
  {
    label: '责权角色',
    prop: 'role',
    transform: (col) => getDictLabel(DICT_TYPE.DUTY_AUTHORITY_ROLE, col),
    width: 100
  },
  { label: '负责时间', slotName: 'date' },
  { label: '操作', slotName: 'option', width: '120px' }
]

/** 责权角色下拉列表 */
export const roles = getIntDictOptions(DICT_TYPE.DUTY_AUTHORITY_ROLE, true)

export const storeProps = { multiple: true }
