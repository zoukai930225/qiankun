import { createApp, ref, nextTick, getCurrentInstance, computed, onBeforeUnmount } from 'vue'
import { ElDialog, ElButton, ElIcon, ElConfigProvider } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { useLocaleStoreWithOut } from '@/store/modules/locale'
import { useDesign } from '@/hooks/web/useDesign'
import type { UseDialogOptions, DialogInstance } from './types'
import type { Pinia } from 'pinia'
import { getActivePinia, setActivePinia } from 'pinia'
import {
  measurePerformance,
  optimizeDOMOperation,
  ContextInheritancePlugin
} from '../useDrawer/utils'
import './index.scss'

export interface DialogOptions extends UseDialogOptions {
  // Element Plus Dialog 原生属性
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
  openDelay?: number
  closeDelay?: number
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  beforeClose?: (done: () => void) => void
  draggable?: boolean
  overflow?: boolean
  center?: boolean
  alignCenter?: boolean
  destroyOnClose?: boolean
  zIndex?: number

  // Element Plus Dialog 事件
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void

  // 自定义扩展属性
  content?: string | (() => any) | any // 支持字符串或组件 或者 defineAsyncComponent
  footer?: boolean | string | (() => any)
  props?: Record<string, any> // 传递给内容组件的props

  // 确认取消 footer 配置
  showConfirmFooter?: boolean // 是否显示确认取消底部
  confirmText?: string // 确认按钮文本
  cancelText?: string // 取消按钮文本
  confirmType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' // 确认按钮类型
  onCancel?: () => void // 取消回调函数
  loading?: boolean // 确认按钮loading状态

  // 插槽内容
  header?: string | (() => any)
  default?: string | (() => any)

  // 额外的样式和类名
  bodyStyle?: Record<string, any>
  headerStyle?: Record<string, any>
  footerStyle?: Record<string, any>
}

/**
 * useDialog 统一以编程方式创建并控制 Element Plus Dialog 的 Hook。
 *
 * - 提供 `openDialog` 用于打开对话框,支持传入内容组件、确认/取消行为、国际化上下文继承等
 * - 提供 `closeAll` 关闭当前通过本 Hook 打开的所有对话框实例
 *
 * @returns DialogInstance 返回包含 `openDialog` 与 `closeAll` 的实例
 *
 * @example
 * const { openDialog, closeAll } = useDialog()
 * await openDialog({
 *   title: '示例',
 *   content: MyComponent,
 *   props: { id: 1 },
 *   onSuccess: () => console.log('confirmed')
 * })
 */
export const useDialog = (): DialogInstance => {
  // 存储当前打开的dialog实例及其销毁信息
  const dialogInstances = new Set<{ dispose: () => void; container: HTMLElement }>()
  // 继承父级应用上下文(例如 i18n、router、store 等)
  const rootInstance = getCurrentInstance()
  const parentAppContext = rootInstance?.appContext

  /**
   * 打开一个 Dialog。
   *
   * @param options DialogOptions 配置项
   * @returns Promise<any> 关闭时 resolve 的值(默认 null)
   */
  const openDialogImpl = (options: DialogOptions = {}): Promise<any> => {
    return new Promise((resolve) => {
      const {
        title = '',
        content = '',
        width = '50%',
        fullscreen = false,
        top = '15vh',
        modal = true,
        modalClass = '',
        appendToBody = true,
        lockScroll = true,
        customClass = '',
        // openDelay/closeDelay 已废弃,不再使用
        closeOnClickModal = true,
        closeOnPressEscape = true,
        showClose = false,
        beforeClose,
        draggable = false,
        overflow = false,
        center = false,
        alignCenter = false,
        destroyOnClose = true,
        zIndex,
        onOpen,
        onOpened,
        onClose,
        onClosed,
        footer = true,
        props = {},
        header,
        bodyStyle = {},
        headerStyle = {},
        footerStyle={},
        // 确认取消 footer 相关参数
        showConfirmFooter = true,
        confirmText = '确定',
        cancelText = '取消',
        confirmType = 'primary',
        onCancel,
        loading = false,
        deferFooterUntilContent = false,
        on: onListeners = {}
      } = options

      // 创建dialog的响应式状态(先隐藏,挂载后再显示,避免闪烁)
      const visible = ref(false)

      measurePerformance('Dialog Creation', () => {
        // 创建一个容器div
        const container = document.createElement('div')
        document.body.appendChild(container)
        // 为当前实例准备销毁信息占位符
        let instanceRecord: { dispose: () => void; container: HTMLElement } | null = null
        let restorePinia: (() => void) | undefined

        // **关键修复1**: 先获取 Pinia 实例
        const activePinia = getActivePinia() as Pinia | undefined
        const parentPinia =
          ((parentAppContext as any)?.app?._context?.pinia as Pinia | undefined) ||
          ((parentAppContext as any)?.provides?.pinia as Pinia | undefined) ||
          ((rootInstance as any)?.appContext?.app?._context?.pinia as Pinia | undefined) ||
          activePinia

        // 创建dialog应用实例
        const app = createApp({
          setup() {
            const localeStore = useLocaleStoreWithOut()
            const currentLocale = computed(() => localeStore.currentLocale)
            const { variables } = useDesign()
            const confirmLoading = ref(loading)
            const contentRef = ref<any>(null)
            const setContentRef = (el: any) => {
              contentRef.value = el
            }
            const headerRerenderKey = ref(0)
            let disposed = false

            const safeDispose = () => {
              if (disposed) return
              disposed = true
              try {
                app.unmount()
              } catch { }
              try {
                if (container && container.parentNode === document.body) {
                  document.body.removeChild(container)
                }
              } catch { }
              if (instanceRecord) {
                dialogInstances.delete(instanceRecord)
                instanceRecord = null
              }
              onClose?.()
              resolve(null)
            }
            // 将安全销毁函数暴露到外层集合
            instanceRecord = { dispose: safeDispose, container }

            // HMR 清理:组件卸载前清理实例
            onBeforeUnmount(() => {
              if (import.meta.hot) {
                console.log('[Dialog HMR] Cleaning up dialog instance')
                safeDispose()
              }
              // 确保资源被释放
              contentRef.value = null
              if (restorePinia) {
                restorePinia()
                restorePinia = undefined
              }
            })

            const handleClose = () => {
              visible.value = false
              nextTick(() => {
                safeDispose()
              })
            }

            const handleBeforeClose = (done: () => void) => {
              const bc = (contentRef.value as any)?.beforeClose || beforeClose
              if (typeof bc === 'function') bc(done)
              else done()
            }

            const handleOpen = () => {
              onOpen?.()
            }

            const handleOpened = () => {
              onOpened?.()
            }

            const handleClosed = () => {
              onClosed?.()
            }

            const handleConfirm = async () => {
              // 优先调用内容组件暴露的 beforeSubmit 方法
              const beforeSubmitMethod = contentRef.value && (contentRef.value as any).beforeSubmit
              if (typeof beforeSubmitMethod === 'function') {
                try {
                  const result = await beforeSubmitMethod()
                  // 如果 beforeSubmit 返回 false，则阻止后续提交
                  if (result === false) {
                    return
                  }
                } catch (error) {
                  console.error('提交前操作失败:', error)
                  return
                }
              }

              // 调用内容组件暴露的 submit 方法
              const submitMethod = contentRef.value && (contentRef.value as any).submit
              if (typeof submitMethod === 'function') {
                try {
                  confirmLoading.value = true
                  await submitMethod()
                  options.onSuccess?.()
                  requestClose()
                } catch (error) {
                  console.error('提交操作失败:', error)
                } finally {
                  confirmLoading.value = false
                }
              } else {
                requestClose()
              }
            }

            const closeImmediately = (after?: () => void) => {
              try {
                after?.()
              } finally {
                visible.value = false
              }
            }

            const requestClose = (after?: () => void) => {
              handleBeforeClose(() => {
                try {
                  after?.()
                } finally {
                  visible.value = false
                }
              })
            }

            const contentReady = computed(() => !!contentRef.value)

            return {
              visible,
              handleClose,
              handleBeforeClose,
              handleOpen,
              handleOpened,
              handleClosed,
              handleConfirm,
              requestClose,
              closeImmediately,
              contentRef,
              setContentRef,
              confirmLoading,
              content,
              props,
              header,
              bodyStyle,
              headerStyle,
              footerStyle,
              currentLocale,
              variables,
              contentReady,
              headerRerenderKey,
              onListeners
            }
          },
          render() {
            const providerProps = {
              locale: (this as any).currentLocale?.elLocale,
              namespace: (this as any).variables?.elNamespace
            }

            // 构建 content 事件监听属性,将 on.key 转换为 onXxx
            const eventListenerProps: Record<string, any> = {}
            if (this.onListeners && typeof this.onListeners === 'object') {
              const camelize = (s: string) =>
                s.replace(/[-_:](\w)/g, (_: any, c: string) => (c ? c.toUpperCase() : ''))
              Object.keys(this.onListeners).forEach((evt) => {
                const handler = (this.onListeners as any)[evt]
                if (typeof handler === 'function') {
                  const base = 'on' + evt.charAt(0).toUpperCase() + evt.slice(1)
                  const cc = camelize(evt)
                  const baseCamel = cc ? 'on' + cc.charAt(0).toUpperCase() + cc.slice(1) : base
                  eventListenerProps[base] = handler
                  if (baseCamel && baseCamel !== base) {
                    eventListenerProps[baseCamel] = handler
                  }
                }
              })
            }

            const dialogProps = {
              modelValue: this.visible,
              'onUpdate:modelValue': (val: boolean) => {
                this.visible = val
                if (!val) {
                  this.handleClose()
                }
              },
              title,
              width,
              fullscreen,
              top,
              modal,
              modalClass,
              appendToBody,
              lockScroll,
              customClass,
              // openDelay/closeDelay 已废弃,不再传递
              closeOnClickModal,
              closeOnPressEscape,
              showClose,
              beforeClose: this.handleBeforeClose,
              draggable,
              overflow,
              center,
              alignCenter,
              destroyOnClose,
              zIndex,
              onOpen: this.handleOpen,
              onOpened: this.handleOpened,
              onClose: this.handleClose,
              onClosed: this.handleClosed,
              style: {
                ...this.bodyStyle
              }
            }

            const renderHeader = () => {
              // 检查 content 组件是否有 renderHeader 函数
              if (this.contentRef && typeof this.contentRef.renderHeader === 'function') {
                const header = this.contentRef.renderHeader({
                  onConfirmClose: () => this.requestClose(),
                  onClose: () => this.closeImmediately(),
                  rerender: () => {
                    this.headerRerenderKey++
                  }
                })
                return header || null
              }
              if (this.header) {
                if (typeof this.header === 'string') {
                  return this.header
                } else if (typeof this.header === 'function') {
                  const HeaderComponent = this.header()
                  return (
                    <HeaderComponent
                      onConfirmClose={() => this.requestClose()}
                      onClose={() => this.closeImmediately()}
                    />
                  )
                }
              }
              return title
            }

            const renderContent = () => {
              if (typeof content === 'string') {
                return content
              } else if (typeof content === 'function') {
                try {
                  const Component = content()
                  return (
                    <div class="sw-dialog-content-wrapper">
                      <Component
                        {...this.props}
                        {...eventListenerProps}
                        onConfirmClose={() => this.requestClose()}
                        onClose={() => this.closeImmediately()}
                        ref={this.setContentRef}
                      />
                    </div>
                  )
                } catch {
                  const Component = content as any
                  return (
                    <div class="sw-dialog-content-wrapper">
                      <Component
                        {...this.props}
                        {...eventListenerProps}
                        onConfirmClose={() => this.requestClose()}
                        onClose={() => this.closeImmediately()}
                        ref={this.setContentRef}
                      />
                    </div>
                  )
                }
              } else if (content) {
                const Component = content as any
                return (
                  <div class="sw-dialog-content-wrapper">
                    <Component
                      {...this.props}
                      {...eventListenerProps}
                      onConfirmClose={() => this.requestClose()}
                      onClose={() => this.closeImmediately()}
                      ref={this.setContentRef}
                    />
                  </div>
                )
              }
              return null
            }

            const renderFooter = () => {
              if (footer === false) return null

              // 检查 content 组件是否有 renderFooter 函数
              if (this.contentRef && typeof this.contentRef.renderFooter === 'function') {
                const footer = this.contentRef.renderFooter({
                  onConfirmClose: () => this.requestClose(),
                  onClose: () => this.closeImmediately()
                })
                return footer ? <div class="sw-dialog-footer" style={this.footerStyle}>{footer}</div> : null
              }

              // 若要求等待内容挂载再渲染 footer,则在 content 未就绪前不渲染
              if (deferFooterUntilContent && !this.contentReady) return null

              if (typeof footer === 'string') return footer
              if (typeof footer === 'function') {
                const FooterComponent = footer()
                return (
                  <div class="sw-dialog-footer" style={this.footerStyle}>
                    <FooterComponent
                      onConfirmClose={() => this.requestClose()}
                      onClose={() => this.closeImmediately()}
                    />
                  </div>
                )
              }

              // 确认取消footer
              if (showConfirmFooter) {
                return (
                  <div class="sw-dialog-footer" style={this.footerStyle}>
                    <ElButton onClick={() => this.requestClose(onCancel)}>{cancelText}</ElButton>
                    <ElButton
                      type={confirmType}
                      onClick={this.handleConfirm}
                      loading={this.confirmLoading}
                    >
                      {confirmText}
                    </ElButton>
                  </div>
                )
              }

              // 默认footer
              return (
                <div class="sw-dialog-footer" style={this.footerStyle}>
                  <ElButton onClick={() => this.requestClose()}>{cancelText}</ElButton>
                </div>
              )
            }

            return (
              <ElConfigProvider {...providerProps}>
                <ElDialog class="sw-dialog-background" {...dialogProps}>
                  {{
                    header: () => (
                      <div class="flex justify-between items-center">
                        <div
                          class="color-#333 font-500 text-16px lh-20px"
                          style={this.headerStyle}
                          key={`hdr-${this.headerRerenderKey}`}
                        >
                          {renderHeader()}
                        </div>
                        <div class="cursor-pointer" onClick={() => this.requestClose(onCancel)}>
                          <ElIcon size={20} color="#333">
                            <Close />
                          </ElIcon>
                        </div>
                      </div>
                    ),
                    default: () => <div class="sw-dialog-content">{renderContent()}</div>,
                    footer: renderFooter
                  }}
                </ElDialog>
              </ElConfigProvider>
            )
          }
        })

        // **关键修复2**: 在 mount 之前先设置 Pinia
        if (parentPinia) {
          const appContext = (app as any)._context
          if (appContext) {
            appContext.pinia = parentPinia
            if (appContext.provides) {
              appContext.provides.pinia = parentPinia
            }
          }
          app.config.globalProperties.$pinia = parentPinia

          if (activePinia !== parentPinia) {
            setActivePinia(parentPinia)
            restorePinia = () => {
              if (activePinia) {
                setActivePinia(activePinia)
              }
            }
          }
        }

        // 让新建的应用继承父应用上下文(确保国际化/路由/状态管理等生效)
        if (parentAppContext) {
          app.use(new ContextInheritancePlugin(parentAppContext))
        }

        // **关键修复3**: 继承当前组件级 provides(确保 provide/inject 在内容组件可用)
        if (rootInstance) {
          const parentProvidesChain = (rootInstance as any).provides
          const appContext = (app as any)._context as any
          const inheritedProvides = Object.create(parentProvidesChain || null)

          // 再次确保 pinia 在 provides 链中
          if (parentPinia && !inheritedProvides.pinia) {
            inheritedProvides.pinia = parentPinia
          }

          Reflect.ownKeys(appContext.provides).forEach((key: any) => {
            ; (inheritedProvides as any)[key] = (appContext.provides as any)[key]
          })
          appContext.provides = inheritedProvides
        }

        // 挂载应用
        app.mount(container)
        if (instanceRecord) {
          dialogInstances.add(instanceRecord)
        }

        // 延迟显示,避免闪烁和卡顿
        optimizeDOMOperation(() => {
          nextTick(() => {
            visible.value = true
          })
        })
      })
    })
  }

  // 直接调用实现函数,保持 Promise 返回
  const openDialog = (options?: DialogOptions): Promise<any> => {
    return openDialogImpl(options)
  }

  /**
   * 关闭所有通过 useDialog 打开的 Dialog 实例。
   */
  const closeAll = () => {
    dialogInstances.forEach(({ dispose, container }) => {
      // 先移除 DOM,阻止进一步的响应式更新
      if (container && container.parentNode === document.body) {
        document.body.removeChild(container)
      }
      // 再执行 dispose
      dispose()
    })
    dialogInstances.clear()
  }

  // 在开发环境下,HMR 时自动清理所有实例
  if (import.meta.hot) {
    // 监听模块更新前事件
    import.meta.hot.on('vite:beforeUpdate', () => {
      console.log('[Dialog HMR] Before update, pre-cleaning dialogs')
      closeAll()
    })
    import.meta.hot.dispose(() => {
      console.log('[Dialog HMR] Disposing all dialog instances')
      closeAll()
    })
  }


  return {
    openDialog: openDialog as (options?: UseDialogOptions) => Promise<any>,
    closeAll
  }
}

// 默认导出
export default useDialog
