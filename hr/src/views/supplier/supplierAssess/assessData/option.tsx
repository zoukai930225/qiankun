import { formatDate } from '@/utils/formatTime'
import { assessmentTypeOption, statusOps } from '../assess/option'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'

export const assessDataTable: TableOption = [
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
    transform: (col) => statusOps.find((item) => item.value === col)
  },
  {
    label: '考核类型',
    prop: 'assessmentType',
    transform: (col) => assessmentTypeOption.find((ele) => ele.value === col)?.label ?? '--'
  },
  { label: '考核期', prop: 'period' },
  {
    label: '总得分',
    prop: 'totalScore',
    transform: (col) => col ?? '--',
  },
  { label: '等级', prop: 'grade' },
  {
    label: '同步时间',
    prop: 'syncTime',
    width: 180,
    transform: (col) => formatDate(col, 'YYYY-MM-DD HH:mm:ss')
  },
  { label: '操作', slotName: 'options', width: 160, fixed: 'right' }
]

export const assessDataDetailTable: TableOption = [
  {
    label: '考核类型',
    prop: 'assessmentType',
    transform: (col) => assessmentTypeOption.find((ele) => ele.value === col)?.label ?? '--'
  },
  { label: '考核期', prop: 'period', transform: (col) => col || '--' },
  {
    label: '总得分',
    prop: 'totalScore',
    transform: (col) => col || '--',
    align: 'right'
  },
  { label: '等级', prop: 'grade', transform: (col) => col || '--' },
  {
    label: '同步时间',
    prop: 'syncTime',
    minWidth: 180,
    transform: (col) => formatDate(col, 'YYYY-MM-DD HH:mm:ss') || '--'
  },
  { label: '操作', fixed: 'right', slotName: 'options', width: 100, showOverFlowTooltip: false }
]
