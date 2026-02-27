import { createApp, ref, nextTick, getCurrentInstance, computed, onBeforeUnmount } from 'vue'
import { ElDrawer, ElButton, ElIcon, ElConfigProvider } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { useLocaleStoreWithOut } from '@/store/modules/locale'
import { useDesign } from '@/hooks/web/useDesign'
import type { UseDrawerOptions, DrawerInstance } from './types'
import debounce from 'lodash-es/debounce'
import type { Pinia } from 'pinia'
import { getActivePinia, setActivePinia } from 'pinia'
import { measurePerformance, optimizeDOMOperation, ContextInheritancePlugin } from './utils'
import './index.scss'

export interface DrawerOptions extends UseDrawerOptions {
  // Element Plus Drawer 原生属性
  title?: string
  size?: string | number
  width?: string | number // 兼容旧版本
  direction?: 'rtl' | 'ltr' | 'ttb' | 'btt'
  appendToBody?: boolean
  lockScroll?: boolean
  closeOnClickModal?: boolean
  closeOnPressEscape?: boolean
  showClose?: boolean
  withHeader?: boolean
  destroyOnClose?: boolean
  modal?: boolean
  modalClass?: string
  zIndex?: number

  // Element Plus Drawer 事件
  beforeClose?: (done: () => void) => void
  onOpen?: () => void
  onOpened?: () => void
  onClose?: () => void
  onClosed?: () => void

  // 自定义扩展属性
  content?: string | (() => any) | any // 支持字符串或组件 或者 defineAsyncComponent
  footer?: boolean | string | (() => any)
  props?: Record<string, any> // 传递给内容组件的props
  on?: Record<string, (...args: any[]) => void>

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
  wrapperStyle?: Record<string, any>
}

/**
 * useDrawer 统一以编程方式创建并控制 Element Plus Drawer 的 Hook。
 *
 * - 提供 `openDrawer` 用于打开抽屉，支持传入内容组件、确认/取消行为、国际化上下文继承等
 * - 提供 `closeAll` 关闭当前通过本 Hook 打开的所有抽屉实例
 *
 * @returns DrawerInstance 返回包含 `openDrawer` 与 `closeAll` 的实例
 *
 * @example
 * const { openDrawer, closeAll } = useDrawer()
 * await openDrawer({
 *   title: '示例',
 *   content: MyComponent,
 *   props: { id: 1 },
 *   onSuccess: () => console.log('confirmed')
 * })
 */
export const useDrawer = (): DrawerInstance => {
  // 存储当前打开的drawer实例（含销毁方法和容器）
  const drawerInstances = new Map<any, { dispose: () => void; container: HTMLElement }>()
  // 继承父级应用上下文（例如 i18n、router、store 等）
  const rootInstance = getCurrentInstance()
  const parentAppContext = rootInstance?.appContext

  /**
   * 打开一个 Drawer。
   *
   * @param options DrawerOptions 配置项
   * @returns Promise<any> 关闭时 resolve 的值（默认 null）
   */
  const openDrawerImpl = (options: DrawerOptions = {}): Promise<any> => {
    return new Promise((resolve) => {
      measurePerformance('Drawer Creation', () => {
        const {
          title = '',
          content = '',
          width = 936,
          size = width,
          direction = 'rtl',
          appendToBody = true,
          lockScroll = true,
          closeOnClickModal = true,
          closeOnPressEscape = true,
          showClose = false,
          withHeader = true,
          destroyOnClose = true,
          modal = true,
          modalClass = '',
          zIndex,
          beforeClose,
          onOpen,
          onOpened,
          onClose,
          onClosed,
          footer = true,
          props = {},
          header,
          bodyStyle = {},
          headerStyle = {},
          // 确认取消 footer 相关参数
          showConfirmFooter = true,
          confirmText = '确定',
          cancelText = '取消',
          confirmType = 'primary',
          onCancel,
          loading = false,
          wrapperStyle = {},
          on: onListeners = {}
        } = options

        // 创建drawer的响应式状态
        const visible = ref(false) // 初始设为false，避免闪烁

        // 创建一个容器div
        const container = document.createElement('div')
        document.body.appendChild(container)
        let restorePinia: (() => void) | undefined

        let disposed = false
        const safeDispose = () => {
          if (disposed) return
          disposed = true
          // 先隐藏，避免卸载时的视觉闪烁
          visible.value = false
          nextTick(() => {
            try {
              app.unmount()
            } catch { }
            try {
              if (container && container.parentNode === document.body) {
                document.body.removeChild(container)
              }
            } catch { }
            drawerInstances.delete(app)
            onClose?.()
            resolve(null)
          })
        }

        // 创建drawer应用实例
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

            // HMR 清理：组件卸载前清理实例
            onBeforeUnmount(() => {
              if (import.meta.hot) {
                console.log('[Drawer HMR] Cleaning up drawer instance')
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
              // 优先调用内容组件暴露的 submit 方法
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

            const handleCancel = () => {
              requestClose(onCancel)
            }

            return {
              visible,
              handleClose,
              handleBeforeClose,
              handleOpen,
              handleOpened,
              handleClosed,
              handleConfirm,
              handleCancel,
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
              currentLocale,
              variables,
              wrapperStyle,
              onListeners
            }
          },
          render() {
            const providerProps = {
              locale: (this as any).currentLocale?.elLocale,
              namespace: (this as any).variables?.elNamespace
            }

            // 构建 content 事件监听属性，将 on.key 转换为 onXxx
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

            const drawerProps = {
              modelValue: this.visible,
              'onUpdate:modelValue': (val: boolean) => {
                this.visible = val
                if (!val) {
                  this.handleClose()
                }
              },
              title,
              size,
              direction,
              appendToBody,
              lockScroll,
              closeOnClickModal,
              closeOnPressEscape,
              showClose,
              withHeader,
              destroyOnClose,
              modal,
              modalClass,
              zIndex,
              beforeClose: this.handleBeforeClose,
              onOpen: this.handleOpen,
              onOpened: this.handleOpened,
              onClose: this.handleClose,
              onClosed: this.handleClosed,
              style: {
                ...this.bodyStyle
              }
            }

            const renderHeader = () => {
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
                const Component = content()
                return (
                  <div class="sw-drawer-content-wrapper" style={this.wrapperStyle}>
                    <Component
                      {...this.props}
                      {...eventListenerProps}
                      onConfirmClose={() => this.requestClose()}
                      onClose={() => this.closeImmediately()}
                      ref={this.setContentRef}
                    />
                  </div>
                )
              } else if (content) {
                const Component = content as any
                return (
                  <div class="sw-drawer-content-wrapper" style={this.wrapperStyle}>
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
                return (
                  <div class="sw-drawer-footer">
                    {this.contentRef.renderFooter({
                      onConfirmClose: () => this.requestClose(),
                      onClose: () => this.closeImmediately()
                    })}
                  </div>
                )
              }

              if (typeof footer === 'string') return footer
              if (typeof footer === 'function') {
                const FooterComponent = footer()
                return (
                  <div class="sw-drawer-footer">
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
                  <div class="sw-drawer-footer">
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
                <div class="sw-drawer-footer">
                  <ElButton onClick={() => this.requestClose()}>取消</ElButton>
                </div>
              )
            }

            return (
              <ElConfigProvider {...providerProps}>
                <ElDrawer class="sw-drawer-background" {...drawerProps}>
                  {{
                    header: withHeader
                      ? () => (
                        <div class="flex justify-between items-center">
                          <div
                            class="color-#333 font-500 text-16px lh-20px"
                            style={this.headerStyle}
                          >
                            {renderHeader()}
                          </div>
                          <div class="cursor-pointer" onClick={() => this.requestClose(onCancel)}>
                            <ElIcon size={20} color="#333">
                              <Close />
                            </ElIcon>
                          </div>
                        </div>
                      )
                      : undefined,
                    default: () => <div class="sw-drawer-content">{renderContent()}</div>,
                    footer: renderFooter
                  }}
                </ElDrawer>
              </ElConfigProvider>
            )
          }
        })

        // 让新建的应用继承父应用上下文（确保国际化/路由/状态管理等生效）
        if (parentAppContext) {
          app.use(new ContextInheritancePlugin(parentAppContext))
        }

        // 继承当前组件级 provides（确保 provide/inject 在内容组件可用）
        if (rootInstance) {
          const parentProvidesChain = (rootInstance as any).provides
          const appContext = (app as any)._context as any
          const inheritedProvides = Object.create(parentProvidesChain || null)
          Reflect.ownKeys(appContext.provides).forEach((key: any) => {
            ; (inheritedProvides as any)[key] = (appContext.provides as any)[key]
          })
          appContext.provides = inheritedProvides
        }

        const activePinia = getActivePinia() as Pinia | undefined
        const parentPinia =
          ((parentAppContext as any)?.app?._context?.pinia as Pinia | undefined) ||
          ((parentAppContext as any)?.provides?.pinia as Pinia | undefined) ||
          ((rootInstance as any)?.appContext?.app?._context?.pinia as Pinia | undefined) ||
          activePinia

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

        // 挂载应用
        app.mount(container)
        drawerInstances.set(app, { dispose: safeDispose, container })

        // 延迟显示，避免闪烁和卡顿
        optimizeDOMOperation(() => {
          nextTick(() => {
            visible.value = true
          })
        })
      })
    })
  }

  // 开发环境使用直接调用，生产环境使用防抖
  const openDrawer = import.meta.env.DEV
    ? openDrawerImpl
    : (() => {
      let lastOptions: DrawerOptions | undefined
      let pendingResolvers: Array<(value: any) => void> = []

      const runner = debounce(async () => {
        try {
          const result = await openDrawerImpl(lastOptions)
          pendingResolvers.forEach((resolve) => resolve(result))
        } finally {
          pendingResolvers = []
          lastOptions = undefined
        }
      }, 100)

      return (options?: DrawerOptions): Promise<any> => {
        lastOptions = options
        return new Promise((resolve) => {
          pendingResolvers.push(resolve)
          runner()
        })
      }
    })()

  /**
   * 关闭所有通过 useDrawer 打开的 Drawer 实例。
   */
  const closeAll = () => {
    drawerInstances.forEach(({ dispose, container }) => {
      // 先移除 DOM，阻止进一步的响应式更新
      if (container && container.parentNode === document.body) {
        document.body.removeChild(container)
      }
      // 再执行 dispose
      dispose()
    })
    drawerInstances.clear()
  }

  // 在开发环境下，HMR 时自动清理所有实例
  if (import.meta.hot) {
    // 监听模块更新前事件
    // import.meta.hot.on('vite:beforeUpdate', () => {
    //   console.log('[Drawer HMR] Before update, pre-cleaning drawers')
    //   closeAll()
    // })
    // import.meta.hot.dispose(() => {
    //   console.log('[Drawer HMR] Disposing all drawer instances')
    //   closeAll()
    // })
  }

  // 组件卸载时清理
  if (rootInstance) {
    onBeforeUnmount(() => {
      closeAll()
    })
  }

  return {
    openDrawer: openDrawer as (options?: UseDrawerOptions) => Promise<any>,
    closeAll
  }
}

// 默认导出
export default useDrawer
