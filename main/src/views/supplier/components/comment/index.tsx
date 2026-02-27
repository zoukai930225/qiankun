import { createVNode, render } from 'vue'
import MyCustomDrawer from './index.vue'

const drawerContainer = document.createElement('div')
document.body.appendChild(drawerContainer)

let currentDrawerInstance: any = null

const openCustomDrawer = (options) => {
  if (currentDrawerInstance) {
    destroyDrawer()
  }
  const vnode = createVNode(MyCustomDrawer, { ...options, onClosed: destroyDrawer })
  render(vnode, drawerContainer)
  currentDrawerInstance = vnode.component
  return {
    instance: currentDrawerInstance
  }
}

const destroyDrawer = () => {
  const timer = setTimeout(() => {
    if (currentDrawerInstance) {
      render(null, drawerContainer)
      currentDrawerInstance = null
    }
    clearTimeout(timer)
  }, 500)
}

const CommentDrawer = {
  open: openCustomDrawer
}

export default CommentDrawer
