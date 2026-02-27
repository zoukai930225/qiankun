import { Component, h, render, type VNode, ref } from 'vue'
import { ElDialog, ElButton } from 'element-plus'
import './index.scss'
// 引入ElementPlus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

interface DialogOptions {
  title: string
  width?: string | number
  content?: Component | string,
  props: object,
  cancelText?: string
  confirmText?: string
  onCancel?: () => void
  onConfirm?: (close: () => void) => void // 添加 onConfirm 类型
  successCb?: () => void,
  noConfirmBtn?: boolean,
  top?: string,
  alignCenter?: boolean
}


// 创建应用实例并注册插件
const createAppWithPlugins = () => {
  const app = createApp({})

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  return app
}

export default function createDialog(options: DialogOptions) {
  console.log((options?.props as any)?.type === 2);
  const app = createAppWithPlugins()
  const container = document.createElement('div')
  document.body.appendChild(container)

  const contentRef = ref<any>(null) // 使用 any 类型或更具体的类型

  const loading = ref(false)


  const beforeClose = () => {
    if (!contentRef.value?.isEidit()) {
      ElMessageBox.confirm(
        '当前有未保存的修改，确定要关闭吗？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          closeDialog()
        })
    } else {
      closeDialog()
    }

  }

  const closeDialog = () => {

    setTimeout(() => {
      render(null, container)
      document.body.contains(container) && document.body.removeChild(container)
    }, 300)
  }

  const handleCancel = () => {
    options.onCancel?.()
    beforeClose()
  }

  const confirmCancel = () => {
    options.onCancel?.()
    closeDialog()
    options?.successCb?.()
  }


  const handleLoading = (val) => {
    loading.value = val
  }

  const handleConfirm = () => {
    if (contentRef.value?.submit) {
      contentRef.value.submit(confirmCancel, handleLoading)
    } else if (options.onConfirm) {
      options.onConfirm(closeDialog)
    } else {
      closeDialog()
    }
  }

  // 处理默认插槽内容
  const renderDefaultSlot = () => {
    if (typeof options.content === 'string') {
      return h('div', options.content)
    } else if (options.content) {
      return h(options.content, {
        ...options.props,
        ref: contentRef
      })
    }
    return h('div', '')
  }

  // 确保所有插槽都是函数
  const slots = {
    default: () => renderDefaultSlot(), // 包装成函数
    footer: () => h('div', { class: 'dialog-footer' }, [
      h(ElButton, { onClick: handleCancel }, options.cancelText || '取消'),
      options.noConfirmBtn ? null :
        h(ElButton, {
          type: 'primary',
          loading: loading.value,
          onClick: handleConfirm
        }, options.confirmText || '确定')

    ])
  }

  const vnode = h(
    ElDialog,
    {
      top: options.top || '30vh',
      alignCenter: options.alignCenter || false,
      modelValue: true,
      title: options.title,
      width: options.width || '50%',
      'onUpdate:modelValue': (value: boolean) => !value && handleCancel(),
      onClose: handleCancel,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      class: 'customDialog'
    },
    slots
  )
  vnode.appContext = app._context

  render(vnode, container)

  return {
    unmount: closeDialog,
    update: (newOptions: Partial<DialogOptions>) => {
      Object.assign(options, newOptions)
    }
  }
}