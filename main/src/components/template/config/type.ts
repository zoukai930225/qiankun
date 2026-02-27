import { ComponentProps, ComponentName } from '@/types/components'
import { TableColumnCtx } from 'element-plus'

export class PageItem {
  total: number = 0
  sizes: Array<number> = [10, 20, 25, 30, 50, 100]
  page: number = 1
  size: number = 10
}

export class Scheme {
  // 唯一值
  field: string
  // 渲染的组件
  component: ComponentName
  // 每个查询项内容区宽度（px）。若不配置，默认 240
  width: number
  // label宽度
  labelWidth: number;
  // 标题
  label: string | Array<string>
  // 样式
  style: Object
  // 表单组件属性，slots对应的是表单组件的插槽，规则：${field}-xxx，具体可以查看element-plus文档
  componentProps: { slots?: any } & ComponentProps
  // 是否自定义
  isCustom: boolean
  // 自定义渲染函数
  customRender: (item: Scheme) => VNode
  // 选项
  options?: Array<any>

  constructor(params: any = {}) {
    this.field = params?.field || '';
    this.labelWidth = params?.labelWidth || 70;
    this.options = params?.options || [];
    this.label = params?.label || '';
    this.width = params?.width || 230;
    this.style = params?.style || {};
    this.component = params?.component || 'Input';
    this.componentProps = params?.componentProps || { clearable: true };
    this.isCustom = params?.isCustom ? params.isCustom : false;
    this.customRender = params?.customRender ? params.customRender : (item: Scheme) => { };
  }
}

export class Screen {
  // 唯一值
  field: string
  // 标题
  label: string
  // 选项
  options: Array<any>
  // 表单组件属性，slots对应的是表单组件的插槽，规则：${field}-xxx，具体可以查看element-plus文档
  props: { slots?: any } & ComponentProps;

  constructor(params: any = {}) {
    this.field = params?.field || '';
    this.label = params?.label || '';
    this.options = params?.options || [];
    this.props = params?.props || { clearable: true };
  }
}

export class BtnItem {
  // 类型
  type: string
  // 标题
  txt: string
  // 方法名
  fun: string
  // 朴素
  plain: boolean
  // 禁用
  disabled: (item?: any) => boolean
  // 隐藏
  display: (item?: any) => boolean
  // 自定义权限
  reveal: (item: any) => boolean
  // 方法
  method?: string
  // 入参方式
  inputMethod?: string
  // 接口
  api?: string
  // 是否精简
  isStreamline?: boolean
  // 精简字段
  material?: string
  // 导出名称
  exportName?: string
  // 提示词
  tips?: string
  // icon
  icon?: string
  // 是否自定义
  isCustom: boolean
  // 自定义渲染函数
  customRender: (btn: BtnItem) => VNode

  constructor(params: any = {}) {
    this.type = params?.type || ''
    this.txt = params?.txt || ''
    this.fun = params?.fun || ''
    this.api = params?.api || ''
    this.icon = params?.icon || ''
    this.method = params?.method || 'get'
    this.inputMethod = params?.inputMethod || 'data'
    this.tips = params?.tips || ''
    this.exportName = params?.exportName || ''
    this.isStreamline = params?.isStreamline || false
    this.material = params?.material || 'id'
    this.plain = params?.plain ? params.plain : false
    this.reveal = params?.reveal ? params.reveal : (item: any) => true
    this.disabled = params?.disabled ? params.disabled : (item?: any) => false
    this.display = params?.display ? params.display : (item?: any) => false
    this.isCustom = params?.isCustom ? params.isCustom : false
    this.customRender = params?.customRender ? params.customRender : (btn: BtnItem) => { }
  }
}

export class Column {
  // 唯一值
  field: string
  // 标题
  title: string
  // 位置
  align: string
  // 悬浮
  fixed: string
  // 最小宽度
  minWidth: number | null
  // 宽度
  width: number | null
  // 排序
  sort: boolean | string
  // 行组件属性
  componentProps: { slots?: any }
  // 子集
  children: Array<Column>
  // 提示
  tips: string
  // 提示宽度
  tipsWidth: number
  // 是否可复制
  isCopy: boolean
  // 表头自定义
  isHeaderCustom: boolean
  // 是否自定义
  isCustom: boolean
  // 是否格式化
  isFormatter: boolean
  // 可点击
  isClick: boolean
  // 样式
  style: Object
  // icon
  icon: any
  // 格式化
  formatter: (item: any, column: TableColumnCtx<any>, cellValue: any, index: number) => string
  // 自定义渲染函数
  customRender: (item: Column, scope: any) => VNode
  // 自定义表头渲染函数
  customHeaderRender: (item: Column) => VNode

  constructor(params: any = {}) {
    this.field = params?.field || ''
    this.title = params?.title || ''
    this.align = params?.align || 'left'
    this.fixed = params?.fixed || ''
    this.width = params?.width || 120
    this.isClick = params?.isClick ? params.isClick : false
    this.style = params?.style || {}
    this.sort = params?.sort ? params.sort : false
    this.icon = params?.icon || null
    this.tips = params?.tips || ''
    this.tipsWidth = params?.tipsWidth || 150
    this.children = params?.children || []
    this.minWidth = params?.minWidth || null
    this.isCopy = params?.isCopy ? params.isCopy : false
    this.componentProps = params?.componentProps || {}
    this.isCustom = params?.isCustom ? params.isCustom : false
    this.isFormatter = params?.isFormatter ? params.isFormatter : false
    this.isHeaderCustom = params?.isHeaderCustom ? params.isHeaderCustom : false
    this.customRender = params?.customRender ? params.customRender : (item: Column, scope: any) => { }
    this.formatter = params?.formatter ? params.formatter : (item: any, column: TableColumnCtx<any>, cellValue: any, index: number) => ''
    this.customHeaderRender = params?.customHeaderRender ? params.customHeaderRender : (item: Column) => { }
  }
}

export interface FromProvideType {
  // 查询参数
  searchData: Ref<any>
  // 分页
  page: Ref<PageItem>
  // loading
  loading: Ref<Boolean>
  // 状态信息
  stateInfo: Ref<any>
  // 列表数据
  dataList: Ref<Array<any>>
  // 已选项
  selectRows: Ref<Array<any>>
  // 格式化查询
  setParamsData: (bol: boolean) => void
  // 查询
  onSearch: () => void
  // 重置
  resetForm: () => void
  // 弹窗
  viewDetails: (type: string, item?: any, btn?: any) => void
  // 按钮回调
  onButtonClick: (btn: BtnItem) => void
  // 单选行
  onCurrentChange: (row: any) => void
  // 自定义触发
  customTrigger: (scope: any, col: any) => void
  // 自定义排序
  customSort: (item: any) => void
}

export interface DetailProvideType {
  // 数据源
  dataValue: Ref<any>
  // 数据备份
  bukValue: Ref<any>
  // loading
  loading: Ref<Boolean>
  // 操作信息
  viewType: Ref<any>
  // 详情文案
  title: Ref<String>
  // // 格式化查询
  // setParamsData: (bol: boolean) => void;
  // // 查询
  // onSearch: () => void;
  // // 重置
  // resetForm: () => void;
  // // 弹窗
  // viewDetails: (type: string, item?: any, btn?: any) => void;
  // // 按钮回调
  // onButtonClick: (btn: BtnItem) => void;
}
