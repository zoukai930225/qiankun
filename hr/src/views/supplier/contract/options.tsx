import { copyBtn, goodsNosFormatter, person, statusDom } from '../components/twoFourSix'
import { Icon } from '@/components/Icon'
import draft_icon from '@/assets/svgs/supplier/contract/draft.svg'
import { formatDate } from '@/utils/formatTime'

/** 合同状态枚举 */
export enum CONTRACT_STATUS {
  /** 草稿 */ DRAFT = '0',
  /** 待签约 */ PENDING = '10',
  /** 签约成功 */ SUCCESS = '20',
  /** 签约失败 */ ERROR = '30'
}

/** 合同状态 */
export const statusOps = [
  {
    label: '草稿',
    value: CONTRACT_STATUS.DRAFT,
    color: '#CD8200',
    bg: '#CD820020',
    icon: <img src={draft_icon} alt="" />
  },
  {
    label: '待签约',
    value: CONTRACT_STATUS.PENDING,
    color: '#0064ff',
    bg: '#0064ff20',
    icon: <Icon icon="ep:loading"></Icon>
  },
  {
    label: '签约成功',
    value: CONTRACT_STATUS.SUCCESS,
    color: '#349B34',
    bg: '#349B3420',
    icon: <Icon icon="ep:success-filled"></Icon>
  },
  {
    label: '签约失败',
    value: CONTRACT_STATUS.ERROR,
    color: '#eb3737',
    bg: '#eb373720',
    icon: <Icon icon="ep:circle-close-filled"></Icon>
  }
]

/** 合同列表列表 */
export const mainTable: TableOption = [
  {
    label: '合同编码',
    prop: 'contractNo',
    fixed: 'left',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '生产订单号',
    prop: 'poNo',
    fixed: 'left',
    minWidth: 130,
    formatter: copyBtn
  },
  {
    label: '货品编码',
    prop: 'goodsCodes',
    minWidth: 130,
    formatter: goodsNosFormatter,
    showOverFlowTooltip: false
  },
  { label: '供应商', prop: 'supplierName', minWidth: 130 },
  { label: '跟单人', prop: 'orderHandler', minWidth: 100, formatter: person },
  { label: '签约人', prop: 'secondName', minWidth: 130, formatter: person },
  { label: '手机号', prop: 'secondPhone', minWidth: 130, formatter: copyBtn },
  { label: '状态', prop: 'status', minWidth: 130, formatter: statusDom(statusOps) },
  {
    label: '产前样日期',
    prop: 'productBeforeDate',
    minWidth: 130,
    transform: (col) => (col ? formatDate(new Date(col), 'YYYY-MM-DD') : '--')
  },
  { label: '合同首批日期', prop: 'firstBatchTime', minWidth: 120, transform: (col) => col ?? '--' },
  { label: '合同清单日期', prop: 'latestArrivalTime', minWidth: 130 },
  { label: '签约时间', prop: 'signDate', minWidth: 180, transform: (col) => col ?? '--' },
  { label: '等待时长', prop: 'waitDate', minWidth: 180, transform: (col) => col ?? '--' },
  { label: '创建时间', prop: 'createdAt', minWidth: 180, transform: (col) => col ?? '--' },
  { label: '操作', type: 'options', fixed: 'right' }
]
