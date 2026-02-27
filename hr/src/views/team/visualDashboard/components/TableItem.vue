<!-- filepath: /Users/yachaozhang/Desktop/淘宝&learn/platform-front/src/views/team/visualDashboard/components/TableItem.vue -->
<template>
  <div class="table-wapper" ref="tableWrapper">
    <!-- 标题 -->
    <div class="table-title" :style="{ width: dates.length * cellWidth + 86 + 'px' }">
      <img :src="imgSrc" alt="" class="img" />
      <span class="title">{{ title }}</span>
    </div>

    <!-- 表格表头 -->
    <div class="table-header" :style="{ width: dates.length * cellWidth + 86 + 'px' }">
      <div class="header-cell" style="width: 86px">人员</div>
      <div
        v-for="date in dates"
        :key="date.prop"
        class="header-cell"
        :style="{ width: cellWidth + 'px' }"
      >
        {{ date.label }}
      </div>
    </div>

    <!-- 下面表格 -->
    <div class="table" :ref="handleTableWapperRef">
      <div v-for="(row, rowIndex) in tableData" :key="row.id" class="table-row">
        <div class="row-title" :style="{ width: '86px' }">
          <div class="flex-row person-wapper">
            <img :src="row?.avatarOrigin" alt="" class="avatar" />
            <span class="name"> {{ row.name }}</span>
          </div>
          <div class="flex-row number">({{ getRowTaskCount(row) }})</div>
        </div>
        <div class="row-cells">
          <div
            v-for="(date, colIndex) in dates"
            :key="date.prop"
            class="table-cell"
            :style="{
              width: cellWidth + 'px',
              marginBottom: rowHasMultiLine(rowIndex) ? '33px' : '0'
            }"
            @dblclick="handleDoubleClick(date, row[date.prop], rowIndex)"
          >
            <!-- v-if="formatShowRemark(tableData?.[rowIndex]?.[date.prop])" -->
            <div
              style="
                padding: 6px;
                padding-bottom: 0;
                box-sizing: border-box;
                width: 100%;
                cursor: pointer;
              "
              v-if="formatShowRemark(tableData?.[rowIndex]?.[date.prop])"
              ><div
                style="
                  width: 100%;
                  color: #333333;
                  font-size: 12px;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  word-break: break-word;
                "
              >
                <el-tooltip
                  :content="formatShowRemark(tableData?.[rowIndex]?.[date.prop])"
                  raw-content
                >
                  <span v-html="formatShowRemark(tableData?.[rowIndex]?.[date.prop])"></span>
                </el-tooltip> </div
            ></div>
            <!--   v-else -->
            <draggable
              v-model="row[date.prop]"
              :group="{
                name: `tasks-${processNode?.split(',').join('-') || 'default'}`,
                pull: true,
                put: (to, from) => {
                  // 只允许相同 processNode 的组之间拖拽
                  return from.options.group.name === to.options.group.name
                }
              }"
              draggable=".draggable-item:not(.task-completed)"
              item-key="id"
              class="cell-draggable"
              :class="getCellDragoverClass(rowIndex, date.prop)"
              @dragover="dragOverCell = getCellKey(rowIndex, date.prop)"
              @dragleave="dragOverCell = ''"
              @drop="dragOverCell = ''"
              @change="handleDragChange($event, rowIndex, colIndex, row, date)"
              @end="handleDragEnd($event)"
            >
              <template #item="{ element, index }">
                <div
                  :class="['draggable-item', { 'task-completed': element?.calendarState == 3 }]"
                  v-if="element?.calendarState"
                >
                  <template v-if="element">
                    <el-popover placement="right" :width="370" trigger="click">
                      <template #reference>
                        <ListItem
                          :task="element"
                          v-if="row.openFlag || index < getFirstRowCount(cellWidth)"
                        />
                      </template>
                      <ItemHover
                        :task="element"
                        @handle-edit="handleEdit"
                        beizhu="recordRemark"
                        :processNode="processNode"
                      />
                    </el-popover>
                  </template>
                </div>
              </template>
            </draggable>
            <!-- 没有备注的时候 && 没有内容的时候 单个任务块 -->
            <!-- <div
              v-if="
                !formatShowRemark(tableData?.[rowIndex]?.[date.prop]) &&
                (!row[date.prop] || row[date.prop]?.length === 0)
              "
              class="empty-desc"
            >
              <span class="top-text">可输入文字任务或拖拽任务</span>
              <span class="bottom-text">文字任务和卡片任务不可共同存在</span>
            </div> -->
            <!-- 没有备注的时候 并且没有内容的时候 -->
          </div>
          <!-- 展开/收起按钮（只在任务数超过2的行显示） -->
          <div v-if="rowHasMultiLine(rowIndex)" class="toggle-btn" @click="toggleRow(row)">
            <span class="desc">共{{ getRowTaskCount(row) }}个任务</span>
            <img src="@/assets/imgs/supplier/arrowDown.svg" v-if="!row.openFlag" alt="" />
            <img src="@/assets/imgs/supplier/arrowUp.svg" v-else alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import ListItem from './item.vue'
import ItemHover from './ItemHover.vue'

const tableWrapper = ref<HTMLElement>()
const tableContentWrapper = ref<Map<string, HTMLElement>>(new Map())
const cellWidth = ref(180)

const handleEdit = (id: string) => {
  emit('handleEdit', id)
}

const props = withDefaults(
  defineProps<{
    imgSrc?: string
    dates: { label: string; prop: string }[]
    tableData: any[]
    title?: string
    processNode?: string
  }>(),
  {
    imgSrc: new URL('@/assets/imgs/team/jingwuxiutu.png', import.meta.url).href,
    dates: () => [],
    tableData: () => [],
    title: ''
  }
)

// 使用 watch 监听关键数据变化
watch(
  [() => props.dates.length, () => props.tableData.length],
  () => {
    // 当数据准备就绪时，延迟计算宽度
    nextTick(() => {
      setTimeout(() => {
        updateCellWidth()
      }, 50)
    })
  },
  { immediate: true }
)

// 记录一个状态，当移除表格区域后，禁止 change 事件执行
const isOutsideTable = ref(false)
// 记录每一个表格的 ref
const handleTableWapperRef = (el: HTMLElement) => {
  tableContentWrapper.value.set(props.processNode!, el)
}
// 处理拖拽结束事件
const handleDragEnd = (env) => {
  console.log('拖拽结束事件:', env)

  // 获取鼠标位置
  const { originalEvent, to, from } = env
  const x = originalEvent.clientX
  const y = originalEvent.clientY

  // 获取表格区域位置
  const wrapper = tableContentWrapper.value.get(props.processNode!)
  if (!wrapper) return
  const rect = wrapper.getBoundingClientRect()

  if ((x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) && to !== from) {
    // 离开表格区域，执行相应操作
    console.log('任务被拖出表格区域，可以在这里处理删除逻辑')
    isOutsideTable.value = true
    // 例如，可以触发一个事件通知父组件删除该任务
    // emit('taskRemovedOutside', env.item)
  } else {
    isOutsideTable.value = false
  }
}

const formatShowRemark = (arr) => {
  if (!arr) return ''
  // 找到数据中 含有calendarDate字段的数据 并且含有remark字段的数据 返回remark字段
  const remark = arr.find((item) => {
    return item?.calendarDate && item?.remark
  })
  return remark ? remark?.remark : ''
}

// 计算某一行（某个人）的任务总数  // 要过滤掉备注的不算任务个数
const getRowTaskCount = (row: any) => {
  let totalCount = 0
  props.dates.forEach((date) => {
    const tasks = row[date.prop].filter((item) => !item?.calendarDate)
    if (Array.isArray(tasks)) {
      totalCount += tasks.length
    }
  })

  return totalCount
}

// 任务块宽度（含间距），根据你的样式调整
const itemWidth = 120
const dragOverCell = ref<string>('')

// 在 table-cell 上加唯一 key
const getCellKey = (rowIndex: number, dateProp: string) => {
  return `${rowIndex}-${dateProp}`
}

// 获取单元格拖拽悬浮样式
const getCellDragoverClass = (rowIndex: number, dateProp: string) => {
  return { 'cell-dragover': dragOverCell.value === getCellKey(rowIndex, dateProp) }
}

const emit = defineEmits<{
  (e: 'handleEdit', id: string): void
  (
    e: 'dragChange',
    data: {
      event: any
      rowIndex: number
      colIndex: number
      row: any
      date: any
      targetDate: string
      targetUser: any
    }
  ): void
  (e: 'cusDbClick', data: any, row: any): void
}>()

const handleDoubleClick = (data, row, rowIndex) => {
  // 调用接口
  console.log('双击事件', data, row, rowIndex, props.tableData[rowIndex])
  emit(
    'cusDbClick',
    {
      calendarDate: data.prop,
      userId: props.tableData[rowIndex]?.id,
      processNode: props.processNode,
      name: props.tableData[rowIndex]?.name,
      dept: props.tableData[rowIndex]?.dept.split('-')[0]
    },
    row
  )
}

// 处理拖拽变化事件
const handleDragChange = (event: any, rowIndex: number, colIndex: number, row: any, date: any) => {
  setTimeout(() => {
    console.log('拖拽事件:', event)
    let dragInfo: any = {
      event,
      rowIndex,
      colIndex,
      row,
      date,
      reset: isOutsideTable.value,
      targetDate: date.prop,
      targetUser: row,
      dragType: '', // 拖拽类型
      sourceInfo: {
        processNode: props.processNode
      }, // 来源信息
      targetInfo: {
        processNode: props.processNode
      }, // 目标信息
      taskData: null // 任务数据
    }

    // 判断拖拽类型和获取详细信息
    if (event.added) {
      // 从外部拖拽进来
      dragInfo.dragType = 'add'
      dragInfo.taskData = event.added.element
      dragInfo.targetInfo = {
        type: 'table',
        userId: row.id,
        userName: row.name,
        date: date.prop,
        dateLabel: date.label,
        rowIndex,
        colIndex,
        processNode: props.processNode
      }

      // 判断来源：从顶部任务池还是其他表格
      if (event.added.element.fromTopList) {
        dragInfo.sourceInfo = {
          type: 'topList',
          processNode: event.added.element.processNode
        }
      } else {
        dragInfo.sourceInfo = {
          type: 'table',
          userId: event.added.element.sourceUserId,
          date: event.added.element.sourceDate
        }
      }

      console.log('任务添加到表格:', dragInfo)
      emit('dragChange', dragInfo)
    }

    if (event.removed) {
      // 从当前位置拖拽出去
      dragInfo.dragType = 'remove'
      dragInfo.taskData = event.removed.element
      dragInfo.sourceInfo = {
        type: 'table',
        userId: row.id,
        userName: row.name,
        date: date.prop,
        dateLabel: date.label,
        rowIndex,
        colIndex,
        processNode: props.processNode
      }

      console.log('任务从表格移除:', dragInfo)
      // 只有当确实有目标接收时才触发事件
      // 这里可以延迟触发，等待可能的 added 事件
      setTimeout(() => {
        emit('dragChange', dragInfo)
      }, 100)
    }
  }, 200)
}

onMounted(() => {
  setTimeout(() => {
    updateCellWidth()
  }, 100)
  window.addEventListener('resize', updateCellWidth)
})

const toggleRow = (row: any) => {
  row.openFlag = !row.openFlag
}

//下面是样式代码
const updateCellWidth = () => {
  nextTick(() => {
    const wrapper = tableWrapper.value
    if (!wrapper) return
    const totalCols = props.dates.length
    const minWidth = 180
    const personColWidth = 86
    const available = wrapper.clientWidth - personColWidth - 20
    const avg = Math.floor(available / totalCols)
    cellWidth.value = Math.max(minWidth, avg)
  })
}

// 判断该行是否有单元格超过一行
const rowHasMultiLine = (rowIndex: number) => {
  const cells = document.querySelectorAll(`.table-row:nth-child(${rowIndex + 1}) .table-cell`)
  const row = props.tableData[rowIndex]
  if (!row || !props.dates?.length) return false
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i] as HTMLElement
    const date = props.dates[i]
    if (!date) continue
    const itemList = row[date.prop]
    const itemCount = Array.isArray(itemList) ? itemList.length : 0
    if (getCellRows(cell, itemCount) > 1) return true
  }
  return false
}

// 计算单元格实际行数
const getCellRows = (cell: HTMLElement, itemCount: number) => {
  if (!cell) return 1
  // 任务块宽度（假设为90px，含间距）
  const itemWidth = 120
  const cellPadding = 22 // padding + gap
  const cellW = cell.offsetWidth - cellPadding
  const perRow = Math.max(1, Math.floor(cellW / itemWidth))
  return Math.ceil(itemCount / perRow)
}

// 计算当前单元格第一行能放几个任务块
const getFirstRowCount = (cellWidth: number) => {
  const cellPadding = 22 // padding + gap
  return Math.max(1, Math.floor((cellWidth - cellPadding) / itemWidth))
}
</script>

<style scoped lang="scss">
.table-wapper {
  background: #ffffff;
  border-radius: 8px;
  padding: 0px 2px 0px 0;
  box-sizing: border-box;
  // margin-bottom: 20px;
}

.table {
  border-top: 1px solid #dde2e9;
  border-left: 1px solid #dde2e9;
  border-right: 1px solid #dde2e9;
  .table-row {
    display: flex;
    align-items: stretch;
    .row-title {
      width: 80px;
      font-weight: bold;
      font-size: 14px;
      border-bottom: 1px solid #dde2e9;
      border-right: 1px solid #dde2e9;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
      box-sizing: border-box;
      .person-wapper {
        display: flex;
        align-items: center;
        .name {
          font-size: 14px;
          font-weight: normal;
          color: #333333;
        }
        .avatar {
          width: 23px;
          height: 23px;
          margin-right: 2px;
          border-radius: 50%;
        }
      }

      .number {
        margin-top: 5px;
        color: #666666;
        font-size: 10px;
        font-weight: normal;
      }
    }
    .row-cells {
      display: flex;
      position: relative;

      .table-cell {
        min-width: 180px;
        position: relative;
        border-bottom: 1px solid #dde2e9;
        border-right: 1px solid #dde2e9;

        .cell-draggable {
          position: relative;
          min-height: 40px;
          height: 100%;
          width: 100%;
          flex-wrap: wrap;
          display: flex;
          align-content: flex-start;
          justify-content: space-between;
          cursor: pointer;
        }
      }
      .table-cell:nth-child(6n) {
        border-right: none;
      }

      .toggle-btn {
        border-top: 1px solid #dde2e9;
        border-bottom: 1px solid #dde2e9;
        background: white;
        position: absolute;
        width: 100%;
        height: 32px;
        left: 0;
        right: 0;
        bottom: 1px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .desc {
          font-size: 10px;
          color: #666666;
          margin-right: 5px;
        }
      }
    }
  }
}
.table-title {
  padding-bottom: 10px;
  padding-top: 12px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #dde2e9;
  border-left: 1px solid #dde2e9;
  border-right: 1px solid #dde2e9;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: 100%;
  .img {
    width: 22px;
    margin-right: 7px;
  }
  .title {
    font-size: 18px;
    color: #333333;
    text-align: center;
  }
}
.table-header {
  display: flex;
  align-items: center;
  background: #f8f8f9;
  font-weight: bold;
  font-size: 14px;
  border-left: 1px solid #dde2e9;
  border-right: 1px solid #dde2e9;
}
.header-cell {
  background: #f2f6fc;
  text-align: center;
  padding: 8px 0;
  border-right: 1px solid #dde2e9;
  box-sizing: border-box;
  border-top: 1px solid #dde2e9;
}
.header-cell:last-child {
  border-right: none;
}

.table-header,
.table-row {
  display: flex;
}
.header-cell,
.row-title,
.table-cell {
  box-sizing: border-box;
}

.cell-hover-ghost {
  opacity: 0.3;
}

.cell-dragover {
  background: #f7f7f7;
}
.empty-desc {
  cursor: pointer;
  width: 100%;
  height: 100%;
  z-index: 111;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  /* 禁止用户选中复制 */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-touch-callout: none; /* iOS 长按菜单禁用 */
  .top-text {
    color: #999999;
    font-size: 12px;
    margin-bottom: 10px;
  }
  align-items: center;
  justify-content: center;
  .bottom-text {
    color: #cdcdcd;
    font-size: 10px;
  }
}

/* 已完成项样式提示（同时不影响 popover 点击） */
.task-completed {
  // opacity: 0.7;
  cursor: not-allowed;
  -webkit-user-drag: none; /* 阻止浏览器原生拖动行为 */
  user-select: none; /* 禁止选中辅助避免误操作 */
  /* 不使用 pointer-events: none，否则会阻断点击弹出详情 */
}
</style>
