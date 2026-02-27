export type BeforeCloseHook =
  | ((done: () => void) => void)
  | (() => void | boolean | Promise<void | boolean>)

export interface DialogProps {
  title?: string
  modelValue?: boolean
  width?: string | number
  fullscreen?: boolean
  top?: string
  modal?: boolean
  modalClass?: string
  appendToBody?: boolean
  lockScroll?: boolean
  customClass?: string
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  beforeClose?: BeforeCloseHook
  draggable?: boolean
  overflow?: boolean
  center?: boolean
  alignCenter?: boolean
  destroyOnClose?: boolean
  zIndex?: number
  bodyStyle?: Record<string, any>
  headerStyle?: Record<string, any>
  footerStyle?: Record<string, any>
}

export interface UseDialogOptions extends DialogProps {
  content?: string | (() => any) | any
  footer?: boolean | string | (() => any)
  props?: Record<string, any>
  on?: Record<string, (...args: any[]) => void>
  header?: string | (() => any)
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void
  onSuccess?: () => void
  showConfirmFooter?: boolean
  confirmText?: string
  cancelText?: string
  confirmType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  onConfirm?: () => Promise<void> | void
  onCancel?: () => void
  loading?: boolean
  // 新增：是否在内容组件挂载前延迟渲染 footer（避免默认底部闪现）
  deferFooterUntilContent?: boolean
}

export interface DialogInstance {
  openDialog: (options?: UseDialogOptions) => Promise<any>
  closeAll: () => void
}

export const DEFAULT_DIALOG_OPTIONS: Partial<UseDialogOptions> = {
  width: '50%',
  fullscreen: false,
  top: '15vh',
  modal: true,
  appendToBody: true,
  lockScroll: true,
  customClass: '',
  closeOnClickModal: true,
  closeOnPressEscape: true,
  showClose: false,
  draggable: false,
  overflow: false,
  center: false,
  alignCenter: false,
  destroyOnClose: true,
  footer: true,
  bodyStyle: {},
  headerStyle: {},
  footerStyle: {}
}
