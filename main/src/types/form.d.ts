/*
 * @Author: zw
 * @Date: 2025-08-07 21:56:00
 * @LastEditTime: 2025-08-16 10:54:01
 * @LastEditors: zw
 * @Description:
 * @FilePath: \platform-front\src\types\form.d.ts
 */
import type { CSSProperties } from 'vue'
import { ColProps, ComponentProps, ComponentName } from '@/types/components'
import type { AxiosPromise } from 'axios'

export type FormSetPropsType = {
  field: string
  path: string
  value: any
}

export type FormValueType = string | number | string[] | number[] | boolean | undefined | null

export type FormItemProps = {
  labelWidth?: string | number
  required?: boolean
  rules?: Recordable
  error?: string
  showMessage?: boolean
  inlineMessage?: boolean
  style?: CSSProperties
}

export type FormSchema = {
  // 唯一值
  field: string
  // 标题
  label?: string
  // 单项标签宽度（优先于表单级 labelWidth）
  labelWidth?: string | number
  // 兼容小写写法
  labelwidth?: string | number
  // 为该表单项追加到 ElFormItem 的 class
  class?: string | string[] | Record<string, boolean>
  // 提示
  labelMessage?: string
  // 自定义渲染标签内容（将通过 label 插槽渲染）
  renderLabel?: (item: FormSchema, model: Recordable) => any
  // col组件属性
  colProps?: ColProps
  // 表单组件属性，slots对应的是表单组件的插槽，规则：${field}-xxx，具体可以查看element-plus文档
  componentProps?: { slots?: Recordable } & ComponentProps
  // formItem组件属性
  formItemProps?: FormItemProps
  // 渲染的组件
  component?: ComponentName
  // 初始值
  value?: FormValueType
  // 是否隐藏
  hidden?: boolean
  // 是否折行
  isNoHalf?: boolean
  // 远程加载下拉项
  api?: <T = any>() => AxiosPromise<T>
  // 自定义渲染函数，返回VNode或JSX元素
  customRender?: (item: FormSchema, model: Recordable) => any
  // 每个查询项内容区宽度（px）。若不配置，默认 240
  itemWidth?: number
}
