import { getDictOptions, DICT_TYPE, getDictLabel } from '@/utils/dict'

export const handlingSchemeTable: TableOption = [
  { prop: 'label', width: 135 },
  { type: 'selection', width: 275 }
]

export const scoreTypeOptions = [
  { label: '加分项', value: '1' },
  { label: '减分项', value: '2' }
]

/**供应商状态 */
export const supplierStatusOps = {
  1: { label: '合作中', color: '#DB6A0F', bg: 'rgba(219, 106, 15, 0.2)' },
  2: { label: '已拉黑', color: '#333', bg: '#E8E8E8' }
}

/** 等级标准 */
export const levelTable: TableOption = [
  { label: '供应商等级', prop: 'grade', minWidth: 130 },
  {
    label: '分数规则',
    prop: 'scoreRule',
    minWidth: 130,
    transform: (col) =>
      col
        .split(' ')
        .map((ele) => getDictLabel(DICT_TYPE.SUPPLIER_GRADE_SCORE_RULE, ele) || ele)
        .join(' ')
  },
  { label: '后续计划', prop: 'followUpPlan', minWidth: 130, transform: (col) => col || '--' },
  ...getDictOptions(DICT_TYPE.SUPPLIER_GRADE_HANDLING_SCHEME).map((item: any) => ({
    label: item.label,
    prop: item.label,
    minWidth: 100
  })),
  { label: '操作', prop: 'options', fixed: 'right', width: 130 }
]

/** 加减分项 */
export const scoreTable: TableOption = [
  {
    label: '类型',
    prop: 'type',
    minWidth: 130,
    transform: (col) => scoreTypeOptions.find((ele) => ele.value === col)?.label
  },
  { label: '名称', prop: 'name', minWidth: 130 },
  {
    label: '分数范围',
    prop: 'score',
    minWidth: 130,
    transform: (_, row) => `${row.startScore} ~ ${row.endScore}`
  },
  {
    label: '规则',
    prop: 'rule',
    minWidth: 130,
    tooltipFormatter: ({ cellValue }) => {
      return <div class="max-w-300px">{cellValue}</div>
    }
  },
  { label: '操作', slotName: 'options', width: 130, fixed: 'right' }
]
