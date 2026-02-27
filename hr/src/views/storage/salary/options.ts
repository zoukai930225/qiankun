// import { getDictLabel } from '@/utils/dict'

/** 薪资汇总表格 */
export const tableOptions: TableOption = [
  { label: '姓名', prop: 'userName' },
  { label: '部门', prop: 'departmentName' },
  { label: '月份', prop: 'dataMonth' },
  { label: '总计产量（件）', prop: 'totalQuantity' },
  { label: '实际出勤（h）', prop: 'actAttendance' },
  { label: '平均时薪', prop: 'averageHourSalary' },
  { label: '合计薪资', prop: 'totalSalary' }
]

/** 验货-抽屉-本组数据-分类数据表格 */
export const currentTableOps: TableOption = [
  // {
  //   label: '工种',
  //   prop: 'rolesMask',
  //   transform: (val) => getDictLabel(DICT_TYPE.ROLES_MASK, val),
  //   width: 70
  // },
  { label: '分类名称', prop: 'classificationName' },
  { label: '产量（件）', prop: 'quantity', width: 95 },
  { label: '操作', slotName: 'options', width: 110 }
]

/** 验货-产品明细弹窗表格 */
export const infoDialogTableOps: TableOption = [
  { label: '商家编码', prop: 'specNo' },
  { label: '货品编码', prop: 'productCode' },
  { label: '货品名称', prop: 'productName', width: 300 },
  { label: '数量', prop: 'quantity' }
]
