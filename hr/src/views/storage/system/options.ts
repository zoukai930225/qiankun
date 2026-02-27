/** 员工状态 */
export const employeeStatusOptions = [
  { label: '试用期', value: 1 },
  { label: '在职', value: 2 },
  { label: '离职', value: 3 }
]

/** 薪酬结算方式 */
export const salaryOptions = [
  { label: '计件', value: 1 },
  { label: '计时', value: 2 }
]

/** 性别 */
export const genderOption = {
  1: '男',
  2: '女',
  0: '未知'
}

/** 关联状态 */
export const relationStatusOps = [
  { label: '已关联', value: 1 },
  { label: '未关联', value: 0 }
]

/** 人员管理表格配置 */
export const tableOptions: StorageSystem.TableOption = [
  { prop: 'employeeName', label: '员工姓名', fixed: 'left' },
  { prop: 'rolesMask', label: '工种', width: 400 },
  { prop: 'salarySettlementType', label: '薪酬结算方式' },
  { prop: 'deptName', label: '部门' },
  { prop: 'mobile', label: '手机号' },
  { prop: 'status', label: '员工状态' },
  { prop: 'gender', label: '性别' },
  { prop: 'operation', label: '操作', fixed: 'right', width: 150, align: 'center' }
]
/** 货品分类表格配置 */
export const goodsClassficationTable: StorageSystem.TableOption = [
  { prop: 'classificationName', label: '分类', fixed: 'left' },
  { prop: 'rolesMask', label: '工种', fixed: 'left' },
  { prop: 'dayPricing', label: '白班计价' },
  { prop: 'nightPricing', label: '夜班计价' },
  { prop: 'crossWorkPricing', label: '跨工种价' },
  { prop: 'hotSellPricing', label: '爆款计价' },
  { prop: 'operation', label: '操作', fixed: 'right', align: 'center', width: 200 }
]
/** 关联配置表格/商家编码表格 */
export const optionsTable: StorageSystem.TableOption = [
  { type: 'selection', fixed: 'left' },
  { prop: 'specNo', label: '商家编码' },
  { prop: 'specName', label: '规格名称' },
  { prop: 'specCode', label: '规格码' }
]
/** 商家编码关联表格 */
export const relationTable: StorageSystem.TableOption = [
  { type: 'selection' },
  { prop: 'specNo', label: '商家编码', width: 200 },
  { prop: 'specName', label: '规格名称' },
  { prop: 'specCode', label: '规格码', width: 80 },
  { prop: 'relationStatus', label: '关联状态', width: 80 },
  { prop: 'classificationName', label: '关联分类', width: 200 }
]

/** 转化薪酬结算方式 */
export function transformSalarySettlementType(type: number) {
  return salaryOptions.find((el) => el.value === type)?.label || '--'
}

/** 转化工种 */
export function transformRoles(
  roles: string,
  rolesMasks: StorageSystem.PersonalManagement.RolesMaskItem[]
) {
  return (
    roles
      ?.split(',')
      .map((el) => {
        return rolesMasks.find((ele) => ele.code === el)?.rolesMaskName
      })
      .join(' , ') || '--'
  )
}

/** 转化员工状态 */
export function transformStatus(status: number) {
  return employeeStatusOptions.find((el) => el.value === status)?.label
}

/** 转化关联状态 */
export function transformRelationStatus(status: number) {
  return relationStatusOps.find((el) => el.value === status)?.label
}

/** 新增编辑弹窗标题配置 */
export enum DrawerTitle {
  'add' = '新增',
  'edit' = '编辑',
  'check' = '查看',
  'copy' = '复制'
}
