import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { statusDom } from '../components/twoFourSix'
import {
  assessmentTypeOption,
  quizScoreStatus
} from '../supplierAssess/assess/option'

export const quizListOptions: TableOption = [
  { label: '供应商简称', prop: 'abbreviationCompany', fixed: 'left', minWidth: 110 },
  { label: '公司名称', prop: 'fullCompany', minWidth: 150 },
  {
    label: '供应商类型',
    prop: 'supplierType',
    transform: (col) => getDictLabel(DICT_TYPE.SUPPLIER_TYPE, col) || '--',
    minWidth: 110
  },
  {
    label: '状态',
    prop: 'status',
    minWidth: 110,
    formatter: statusDom(quizScoreStatus)
  },
  {
    label: '考核类型',
    prop: 'assessmentType',
    transform: (col) => assessmentTypeOption.find((ele) => ele.value === col)?.label ?? '--'
  },
  { label: '考核模块', prop: 'assessmentModuleName' },
  { type: 'options', label: '操作' }
]
