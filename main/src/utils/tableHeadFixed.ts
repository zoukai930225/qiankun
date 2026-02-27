
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { getBoundingClientRect, getScrollContainer, setStyle } from '@/utils/domUtils'
import { useAppStore } from '@/store/modules/app';

const tableHeadFixed = (top: number, className = 'SWCommonTable') => {

  interface TableStyle {
    bottom: number
    height: number
    left: number
    right: number
    top: number
    width: number
    x: number
    y: number
  }
  //margin-top: calc(var(--top-tool-height) + var(--tags-view-item-height) + 10px);
  const topHeight = 50 + 35 + 10//菜单栏包括顶部高度
  const cellHeight = 40
  //表格不包含左侧菜单栏其他宽度
  let tableOtherWidth = 0
  let table
  const getTableStyle = (type: 'scroll' | 'resize') => {

    const tableStyle = getBoundingClientRect(table) as TableStyle

    const changleDom = table.querySelector('.el-table__header-wrapper') as Element
    if (!tableOtherWidth || type === 'resize') {
      tableOtherWidth = document.body.clientWidth - tableStyle.width
      tableOtherWidth = appStore.getCollapse == "1" ? tableOtherWidth - 230 : tableOtherWidth - 60
    }
    if (tableStyle?.top - topHeight < top && !(Math.abs(tableStyle?.top) + topHeight + cellHeight > tableStyle?.height)) {
      setStyle(changleDom, 'position', 'fixed')
      setStyle(changleDom, 'top', `calc(var(--top-tool-height) + var(--tags-view-item-height) + ${top}px)`)
      setStyle(changleDom, 'width', `calc(100vw - ${appStore.getCollapse == "1" ? 230 : 60}px - ${tableOtherWidth}px)`)
      setStyle(changleDom, 'z-index', `calc(var(--el-table-index) + 2)`)
    } else {
      setStyle(changleDom, 'position', 'relative')
      setStyle(changleDom, 'width', '100%')
      setStyle(changleDom, 'top', `auto`)
      setStyle(changleDom, 'z-index', `var(--el-table-index)`)
    }

  }

  const appStore = useAppStore()
  const scrollContaine = ref()
  onMounted(() => {
    table = document.querySelector(`.${className}`) as Element
    getTableStyle('scroll')
    scrollContaine.value = getScrollContainer(table, true)
    useEventListener(scrollContaine, 'scroll', () => getTableStyle('scroll'))
    useEventListener('resize', () => getTableStyle('resize'))
  })
  const stopWatchEvent = watch(() => appStore.getCollapse, (val) => {
    if (table) {
      setTimeout(() => {
        getTableStyle('scroll')
      }, 10);
    }
  })
  onBeforeUnmount(() => {
    stopWatchEvent()
  })

}


export { tableHeadFixed }