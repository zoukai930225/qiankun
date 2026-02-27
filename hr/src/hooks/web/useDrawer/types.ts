/*
 * @Author: zw
 * @Date: 2025-08-12 10:56:41
 * @LastEditors: zw
 * @LastEditTime: 2025-08-12 10:58:16
 * @FilePath: \platform-front\src\hooks\web\useDrawer\types.ts
 */
export type DrawerDirection = 'rtl' | 'ltr' | 'ttb' | 'btt'

export interface DrawerProps {
  title?: string
  modelValue?: boolean
  size?: string | number
  direction?: DrawerDirection
  appendToBody?: boolean
  lockScroll?: boolean
  wrapperClosable?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  withHeader?: boolean
  openDelay?: number
  closeDelay?: number
  customClass?: string
  destroyOnClose?: boolean
  modal?: boolean
  modalClass?: string
  zIndex?: number
  bodyStyle?: Record<string, any>
  headerStyle?: Record<string, any>
}

export interface UseDrawerOptions extends DrawerProps {
  content?: string | (() => any) | any
  footer?: boolean | string | (() => any)
  props?: Record<string, any>
  on?: Record<string, (...args: any[]) => void>
  header?: string | (() => any)
  width?: string | number
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
  beforeClose?: (done: () => void) => void
  onSuccess?: () => void
  showConfirmFooter?: boolean
  confirmText?: string
  cancelText?: string
  confirmType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
  loading?: boolean
  wrapperStyle?: Record<string, any>
}

export interface DrawerInstance {
  openDrawer: (options?: UseDrawerOptions) => Promise<any>
  closeAll: () => void
}

export const DEFAULT_DRAWER_OPTIONS: Partial<UseDrawerOptions> = {
  size: 936,
  direction: 'rtl',
  appendToBody: true,
  lockScroll: true,
  wrapperClosable: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: true,
  withHeader: true,
  openDelay: 0,
  closeDelay: 0,
  destroyOnClose: true,
  modal: true,
  footer: true,
  bodyStyle: {},
  headerStyle: {},
  wrapperStyle: {}
}
