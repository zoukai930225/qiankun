import { getDictOptions, DICT_TYPE, getDictLabel } from '@/utils/dict'
import { formatDate } from '@/utils/formatTime'
import { person, statusDom } from '../../components/twoFourSix'

export const statusOps = getDictOptions(DICT_TYPE.SUPPLIER_STATUS).map((item) => {
  switch (item.value) {
    case '0':
      return { ...item, color: '#666', bg: '#d8d8d8' }
    case '1':
      return { ...item, color: '#db6a0f', bg: '#f7decb' }
    case '2':
      return { ...item, color: '#349b34', bg: '#349b3433' }
    case '3':
      return { ...item, color: '#EB3737', bg: '#FFD9D9' }
    case '4':
      return { ...item, color: '#666', bg: '#d8d8d8' }
    default:
      return {}
  }
})

export const assessmentTypeOption = getDictOptions(DICT_TYPE.SUPPLIER_ASSESSMENT_TYPE)

export const createTypeOption = {
  0: '单次创建',
  1: '重复创建'
}

export const assessmentStatusOps = [
  // { label: '未开始', value: '0', color: '#666', bg: '#d8d8d8' },
  { label: '进行中', value: '1', color: '#0064ff', bg: '#0064ff20' },
  { label: '已截止', value: '2', color: '#EB3737', bg: '#FFD9D9' }
]

export const assessUserNumOps = [
  { label: '未评分', value: false, color: '#666', bg: '#e0e0e0' },
  { label: '已评分', value: true, color: '#349b34', bg: '#349b3433' }
]

export const quizScoreStatus = [
  { label: '未评分', value: '1', color: '#666', bg: '#e0e0e0' },
  { label: '已评分', value: '2', color: '#349b34', bg: '#349b3433' }
]

export const assessTable: TableOption = [
  { label: '供应商简称', prop: 'abbreviationCompany' },
  { label: '公司名称', prop: 'fullCompany' },
  {
    label: '供应商类型',
    prop: 'supplierType',
    transform: (col) => getDictLabel(DICT_TYPE.SUPPLIER_TYPE, col) || '--'
  },
  {
    label: '供应商状态',
    prop: 'supplierStatus',
    transform: (col) => statusOps.find((item) => item.value === col) || '--'
  },
  { label: '操作', slotName: 'options', width: 100, fixed: 'right' }
]

export const assessDetailTable: TableOption = [
  { type: 'selection', width: 60 },
  {
    label: '考核类型',
    prop: 'assessmentType',
    transform: (col) => assessmentTypeOption.find((ele) => ele.value === col)?.label ?? '--'
  },
  { label: '考核期', prop: 'period' },
  {
    label: '考核状态',
    prop: 'assessmentStatus',
    transform: (col) => assessmentStatusOps.find((ele) => ele.value === col)
  },
  { label: '创建类型', prop: 'createType', transform: (col) => createTypeOption[col] },
  { label: '考核人数', prop: 'assessmentUserNum' },
  {
    label: '总得分',
    prop: 'totalScore',
    transform: (col) => col ?? '--',
  },
  {
    label: '考核时间',
    slotName: 'assessTime',
    minWidth: 200,
    transform: (_, row) =>
      row?.startTime && row?.endTime
        ? `${formatDate(row?.startTime, 'YYYY-MM-DD HH:mm:ss')} ~ ${formatDate(row?.endTime)}`
        : '--'
  },
  { label: '操作', fixed: 'right', type: 'options' }
]

export const assessUserNumTable: TableOption = [
  { label: '考核人', prop: 'assessmentUser' },
  { label: '部门', prop: 'assessmentUserDepartment' },
  { label: '考核模块', prop: 'assessmentModuleName' },
  {
    label: '状态',
    prop: 'isAssessment',
    transform: (col) => assessUserNumOps.find((ele) => ele.value === col)
  },
  {
    label: '评分时间',
    prop: 'submitTime',
    transform: (col) => formatDate(col, 'YYYY-MM-DD HH:mm:ss') || '--',
    minWidth: 130
  },
  { label: '操作', prop: 'options', width: 100 }
]

export const scoreTable: TableOption = [
  {
    label: '类型',
    prop: 'type',
    transform: (col) => (col === 1 ? '加分项' : '减分项'),
    minWidth: 80
  },
  { label: '名称', prop: 'name', minWidth: 130 },
  {
    label: '分值',
    prop: 'score',
    // align: 'right',
    minWidth: 60,
    formatter: (row, _, cellValue, ___) => (
      <span
        class={row.type === 1 ? 'color-#EB3737' : 'color-#349B34'}
      >{`${row.type === 1 ? '+' : '-'}${cellValue}`}</span>
    )
  },
  { label: '备注', prop: 'comment', transform: (col) => col || '--' },
  { label: '操作', prop: 'options', minWidth: 100, showOverFlowTooltip: false }
]

export const quizExtraScoreLogTable: TableOption = [
  { label: '操作人', prop: 'creator', width: 100 },
  { label: '操作时间', prop: 'createdAt', transform: (col) => col || '--', minWidth: 90 },
  {
    label: '类型',
    prop: 'type',
    transform: (col) => (col === 1 ? '加分项' : '减分项'),
    width: 80
  },
  { label: '名称', prop: 'name', transform: (col) => col ?? '--' },
  {
    label: '分值',
    prop: 'score',
    // align: 'right',
    width: 60,
    formatter: (row, _, cellValue, ___) => (
      <span
        class={row.type === 1 ? 'color-#EB3737' : 'color-#349B34'}
      >{`${row.type === 1 ? '+' : '-'}${cellValue}`}</span>
    )
  },
  { label: '备注', prop: 'comment', transform: (col) => col || '--' }
]

export const supplierQtyTable: TableOption = [
  { label: '供应商简称', prop: 'abbreviationCompany', fixed: 'left', minWidth: 110 },
  { label: '公司名称', prop: 'fullCompany', minWidth: 150 },
  {
    label: '供应商类型',
    prop: 'supplierType',
    transform: (col) => getDictLabel(DICT_TYPE.SUPPLIER_TYPE, col) || '--',
    minWidth: 110
  },
  {
    label: '考核类型',
    prop: 'assessmentType',
    transform: (col) => getDictLabel(DICT_TYPE.SUPPLIER_ASSESSMENT_TYPE, col) || '--',
    minWidth: 110
  },
  { label: '考核期', prop: 'period', minWidth: 110 },
  {
    label: '考核时间',
    slotName: 'time',
    transform(_, row, __) {
      return `${formatDate(row.startTime, 'YYYY-MM-DD HH:mm:ss')} ~ ${formatDate(row.endTime, 'YYYY-MM-DD HH:mm:ss')}`
    },
    minWidth: 350
  }
]

export const completedQuizQtyTable: TableOption = [
  ...supplierQtyTable,
  { label: '总得分', prop: 'totalScore', minWidth: 110 },
  { label: '考核项', prop: 'assessmentModuleName', minWidth: 110 },
  {
    label: '状态',
    prop: 'quizScoreStatus',
    minWidth: 110,
    formatter: statusDom(quizScoreStatus)
  },
  { label: '考核人', prop: 'assessmentUser', formatter: person, minWidth: 110 },
  { label: '得分', prop: 'assessmentModuleScore', minWidth: 110 },
  { label: '操作', type: 'options', fixed: 'right' }
]
