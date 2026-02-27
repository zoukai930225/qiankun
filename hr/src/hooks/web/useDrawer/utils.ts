/**
 * 抽屉组件性能优化工具函数
 */
import { h } from 'vue'

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null
  return ((...args: any[]) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout | null = null
  let previous = 0
  return ((...args: any[]) => {
    const now = Date.now()
    const remaining = wait - (now - previous)

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
      previous = now
      func(...args)
    } else if (!timeout) {
      timeout = setTimeout(() => {
        previous = Date.now()
        timeout = null
        func(...args)
      }, remaining)
    }
  }) as T
}

// 性能监控
export function measurePerformance<T>(name: string, fn: () => Promise<T> | T): Promise<T> | T {
  const start = performance.now()

  try {
    const result = fn()

    if (result && typeof (result as PromiseLike<T>).then === 'function') {
      return (result as Promise<T>).finally(() => {
        const end = performance.now()
        console.log(`${name} took ${end - start}ms`)
      })
    }

    const end = performance.now()
    console.log(`${name} took ${end - start}ms`)
    return result
  } catch (error) {
    const end = performance.now()
    console.log(`${name} failed after ${end - start}ms`)
    throw error
  }
}

// 异步组件包装器，用于懒加载
export function createAsyncComponent(loader: () => Promise<any>) {
  return {
    setup() {
      return () => h('div', { class: 'loading-placeholder' }, '加载中...')
    }
  }
}

// 优化DOM操作
export function optimizeDOMOperation(operation: () => void) {
  // 使用 requestAnimationFrame 确保在下一帧执行
  requestAnimationFrame(() => {
    operation()
  })
}

// 清理事件监听器
export function cleanupEventListeners(element: HTMLElement) {
  const clone = element.cloneNode(true) as HTMLElement
  element.parentNode?.replaceChild(clone, element)
}

// 检查元素是否在视口中
export function isElementInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// 延迟执行函数
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 批量DOM更新
export function batchDOMUpdate(updates: (() => void)[]) {
  // 使用 requestAnimationFrame 批量更新
  requestAnimationFrame(() => {
    updates.forEach((update) => update())
  })
}

export class ContextInheritancePlugin {
  private parentAppContext: any
  private options: any

  constructor(parentAppContext: any, options: any = {}) {
    this.parentAppContext = parentAppContext
    this.options = options
  }

  install(app) {
    // 继承应用 config（错误处理、性能标志、编译选项等）
    this.inheritConfig(app)

    // 继承全局属性
    this.inheritGlobalProperties(app)

    // 继承全局组件
    this.inheritComponents(app)

    // 继承全局指令
    this.inheritDirectives(app)

    // 继承 provides
    this.inheritProvides(app)

    // 继承特定服务
    this.inheritServices(app)

    // 继承全局 mixins
    this.inheritMixins(app)
  }

  inheritGlobalProperties(app) {
    if (!this.parentAppContext?.config?.globalProperties) return

    const parentProps = this.parentAppContext.config.globalProperties
    const allowList = this.options.globalProperties

    // 只继承白名单中的属性
    if (Array.isArray(allowList) && allowList.length > 0) {
      allowList.forEach((key: string) => {
        if (key in parentProps) {
          app.config.globalProperties[key] = parentProps[key]
        }
      })
      return
    }

    // 默认继承所有全局属性（包含以 $ 开头的属性）
    Object.keys(parentProps).forEach((key) => {
      app.config.globalProperties[key] = parentProps[key]
    })
  }

  inheritComponents(app) {
    if (!this.parentAppContext?.components) return

    const parentComponents = this.parentAppContext.components
    const allowList = this.options.components || []

    if (Array.isArray(allowList) && allowList.length > 0) {
      allowList.forEach((name: string) => {
        const comp = parentComponents[name]
        if (comp) {
          app.component(name, comp)
        }
      })
    } else {
      Object.keys(parentComponents).forEach((name) => {
        if (!app.component(name)) {
          app.component(name, parentComponents[name])
        }
      })
    }
  }

  inheritDirectives(app) {
    const parentDirectives = this.parentAppContext?.directives
    if (!parentDirectives) return

    const allowList = this.options.directives || []

    if (Array.isArray(allowList) && allowList.length > 0) {
      allowList.forEach((name: string) => {
        const dir = parentDirectives[name]
        if (dir) {
          app.directive(name, dir)
        }
      })
      return
    }

    Object.keys(parentDirectives).forEach((name) => {
      if (!app.directive(name)) {
        app.directive(name, parentDirectives[name])
      }
    })
  }

  inheritProvides(app) {
    const parentProvides = this.parentAppContext?.provides || this.parentAppContext?._provides
    if (!parentProvides) return

    const providesList = this.options.provides || []

    if (Array.isArray(providesList) && providesList.length > 0) {
      // 只继承指定的 provides
      providesList.forEach((key: any) => {
        if (key in parentProvides) {
          app.provide(key, parentProvides[key])
        }
      })
    } else {
      // 继承所有 provides（包含 Symbol key）
      Reflect.ownKeys(parentProvides).forEach((key: any) => {
        app.provide(key, (parentProvides as any)[key])
      })
    }
  }

  inheritServices(app) {
    const services = this.options.services || {}

    Object.keys(services).forEach((serviceName) => {
      const serviceKey = services[serviceName]
      const service = this.getServiceFromParent(serviceKey)

      if (service) {
        app.provide(serviceName, service)
        app.config.globalProperties[`$${serviceName}`] = service
      }
    })
  }

  inheritMixins(app) {
    const parentMixins = this.parentAppContext?.mixins
    if (!Array.isArray(parentMixins) || parentMixins.length === 0) return

    const allowList = this.options.mixins || []

    if (Array.isArray(allowList) && allowList.length > 0) {
      parentMixins.forEach((m: any) => {
        if (allowList.includes(m)) {
          app.mixin(m)
        }
      })
      return
    }

    parentMixins.forEach((m: any) => app.mixin(m))
  }

  inheritConfig(app) {
    const parentConfig = this.parentAppContext?.config
    if (!parentConfig) return

    app.config.errorHandler = parentConfig.errorHandler
    app.config.warnHandler = parentConfig.warnHandler
    app.config.performance = parentConfig.performance

    if (parentConfig.compilerOptions) {
      app.config.compilerOptions = {
        ...app.config.compilerOptions,
        ...parentConfig.compilerOptions
      }
    }
  }

  getServiceFromParent(key) {
    return (
      this.parentAppContext?.provides?.[key] ||
      this.parentAppContext?._provides?.[key] ||
      this.parentAppContext?.config?.globalProperties?.[key]
    )
  }
}
