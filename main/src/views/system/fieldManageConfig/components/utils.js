/*
 * @Date: 2024-12-03 17:48:04
 */
import { onMounted, onUnmounted } from 'vue'
import Sortable from 'sortablejs'
import Message from '@/layout/components/Message/src/Message.vue'
const message = useMessage() // 消息弹窗

// 阻止指定calss元素的右键
export const useContextMenu = (className, callback) => {
  const handleContextMenu = (event) => {
    event.preventDefault() // 阻止默认右键菜单
    callback(event)
  }

  onMounted(() => {
    const headerCells = document.querySelectorAll(className)
    if (headerCells.length > 0) {
      headerCells[0].addEventListener('contextmenu', handleContextMenu)
    }
  })

  onUnmounted(() => {
    const headerCells = document.querySelectorAll(className)
    if (headerCells.length > 0) {
      headerCells[0].removeEventListener('contextmenu', handleContextMenu)
    }
  })
}

// table 拖拽排序
export const useDragTableRows = (tableClassName, btnClassName) => {
  const disabled = ref(true)
  const stopDrop = (value) => {
    disabled.value = value
  }
  const getRowByDom = (dom) => {
    const className = dom.className
    let id
    className.replace(/id_([a-zA-Z0-9]+)/, (...p) => {
      id = p[1]
    })
    return { id }
  }
  const rowDrop = async (cb) => {
    const el = document.querySelector(`${tableClassName}`)
    const sortableInstance = new Sortable(el, {
      animation: 150,
      handle: btnClassName,
      onStart: function (evt) {
        if (disabled.value) {
          message.error('名称/编码必须为空，所属模块必须有值才能拖拽')
          sortableInstance.option('disabled', disabled) // 禁止继续拖拽
        }
      },
      // 结束拖拽
      onEnd: function (/**Event*/ evt) {
        sortableInstance.option('disabled', false) // 禁止继续拖拽
        const moveDate = getRowByDom(evt.item)
        if (evt.oldIndex != evt.newIndex) {
          const param = {
            oldIndex: evt.oldIndex,
            newIndex: evt.newIndex,
            ...moveDate
          }

          cb && cb(param)
        }
      }
    })
    console.log(sortableInstance)
    // 解决在火狐浏览器拖拽打开新页面的问题，阻止事件冒泡
    document.body.ondrop = function (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return {
    rowDrop,
    stopDrop
  }
}

export const addList = ref([
  {
    label: '新建',
    code: 'add'
  },
  {
    label: '复制',
    code: 'copy'
  },
  {
    label: '启用',
    code: 'open'
  },
  {
    label: '禁用',
    code: 'stop'
  },
  {
    label: '删除',
    code: 'del'
  }
])

export const fieldList = ref([
  {
    label: '文本',
    value: 0
  },
  {
    label: '数字',
    value: 1
  },
  {
    label: '单选',
    value: 2
  },
  {
    label: '多选',
    value: 3
  },
  {
    label: '日期',
    value: 4
  },
  {
    label: '日期时间',
    value: 5
  },
  {
    label: '开关',
    value: 6
  },
  {
    label: '其他',
    value: 7
  },
  {
    label: '人员',
    value: 8
  },
  {
    label: '店铺',
    value: 9
  }
])
