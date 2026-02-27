export type TableColumn = {
  prop: string
  label?: string
  width?: number | string
  fixed?: 'left' | 'right'
  children?: TableColumn[]
  // 默认排序方向：'ascending' 升序，'descending' 降序（不配置则为正常）
  defaultSort?: 'asc' | 'desc'
} & Recordable

export type VxeTableColumn = {
  prop: string
  title?: string
  children?: TableColumn[]
} & Recordable

export type TableSlotDefault = {
  row: Recordable
  column: TableColumn
  $index: number
} & Recordable

export interface Pagination {
  small?: boolean
  background?: boolean
  pageSize?: number
  defaultPageSize?: number
  total?: number
  pageCount?: number
  pagerCount?: number
  currentPage?: number
  defaultCurrentPage?: number
  layout?: string
  pageSizes?: number[]
  popperClass?: string
  prevText?: string
  nextText?: string
  disabled?: boolean
  hideOnSinglePage?: boolean
}

export interface TableSetPropsType {
  prop: string
  path: string
  value: any
}
