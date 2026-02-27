import { Pagination, TableColumn } from './table'

export type TableProps = {
  pageSize?: number
  currentPage?: number
  // 是否多选
  selection?: boolean
  // 是否所有的超出隐藏，优先级低于schema中的showOverflowTooltip,
  showOverflowTooltip?: boolean
  // 表头
  columns?: TableColumn[]
  // 是否展示分页
  pagination?: Pagination | undefined
  // 仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
  reserveSelection?: boolean
  // 加载状态
  loading?: boolean
  // 是否叠加索引
  reserveIndex?: boolean
  // 对齐方式
  align?: 'left' | 'center' | 'right'
  // 表头对齐方式
  headerAlign?: 'left' | 'center' | 'right'
  data?: Recordable
  expand?: boolean
  fetch?: Function
  fetchParams?: object
  showPagination?: boolean
  paginationOptions?: object
  // 分页参数名称配置
  paginationParams?: {
    page: string
    pageSize: string
  }
  // 是否启用多列排序（启用后使用自定义表头排序）
  sortMultiple?: boolean
  // 排序是否具有排他性（仅允许一个字段处于排序状态）
  sortExclusive?: boolean
  // 排序变化回调
  sortChange?: Function
} & Recordable
