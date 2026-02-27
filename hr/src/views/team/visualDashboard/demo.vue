<template>
  <div class="visual-dashboard">
    <div class="list-container">
      <draggable v-model="listItems" class="list" @end="onListDrop">
        <template #item="{ element }">
          <div class="list-item">{{ element.name }}</div>
        </template>
      </draggable>
    </div>
    <div class="table-container">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="名字" fixed="left" width="100">
          <template #default="{ row }">
            <div>{{ row.name }}</div>
          </template>
        </el-table-column>

        <el-table-column
          v-for="(date, index) in dates"
          :key="index"
          :label="date.label"
          :prop="date.prop"
          width="120"
        >
          <template #default="{ row }">
            <draggable
              v-model="row[date.prop]"
              :group="{ name: 'table', put: true }"
              @end="tabListDrop"
            >
              <template #item="{ element }">
                <div class="table-cell">{{ element.name }}</div>
              </template>
            </draggable>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'
import { ElMessageBox } from 'element-plus'

defineOptions({ name: 'VisualDashboard' })

const listItems = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' }
])

const listItemsCopy = ref([...listItems.value])

const getWeekDates = () => {
  const now = new Date()
  const startOfWeek = now.getDate() - now.getDay() + 1 // 获取本周一的日期
  const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const dates = []

  for (let i = 0; i < 7; i++) {
    const date = new Date(now.setDate(startOfWeek + i))
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const dayOfWeek = daysOfWeek[date.getDay()]
    //@ts-ignore
    dates.push({ label: `${month}-${day} ${dayOfWeek}`, prop: `day${i + 1}` })
  }

  return dates
}

const dates = ref(getWeekDates())

const tableData = ref([
  {
    id: '111',
    name: 'Person 1',
    day1: [],
    day2: [],
    day3: [],
    day4: [],
    day5: [],
    day6: [],
    day7: []
  },
  {
    id: '222',
    name: 'Person 2',
    day1: [],
    day2: [],
    day3: [],
    day4: [],
    day5: [],
    day6: [],
    day7: []
  },
  {
    id: '333',
    name: 'Person 3',
    day1: [],
    day2: [],
    day3: [],
    day4: [],
    day5: [],
    day6: [],
    day7: []
  }
])

const befrorDragTableData = ref<any>([])

const onListDrop = async (event) => {
  // 处理从列表拖动到表格的逻辑
  // const { item, newIndex, oldIndex } = event
  // if (newIndex !== oldIndex) {
  //   // 移除列表中的项
  //   listItems.value.splice(oldIndex, 1)
  // }
  try {
    await ElMessageBox.confirm('确定要移动这个项目吗？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        console.log('电视剧付了款lk')
        listItemsCopy.value = [...listItems.value]
      })
      .catch(() => {
        // 取消
        const { item, oldDraggableIndex, oldIndex } = event
        console.log('江东父老撒可富', event, item.element, dates.value, tableData.value)
        const cancelItem =
          oldDraggableIndex < listItemsCopy.value.length
            ? listItemsCopy.value[oldDraggableIndex]
            : {}
        if (oldDraggableIndex < listItemsCopy.value.length) {
          listItems.value.splice(oldDraggableIndex, 0, listItemsCopy.value[oldDraggableIndex])
        }
        console.log('取消移动', cancelItem)
        tableData.value.forEach((row) => {
          for (let i = 1; i < 8; i++) {
            if (row[`day${i}`] && row[`day${i}`].length > 0) {
              let dayArr = []
              row[`day${i}`].forEach((item) => {
                if (cancelItem.id && item.id !== cancelItem.id) {
                  dayArr.push(item)
                }
              })
              row[`day${i}`] = dayArr
            }
          }
        })
      })
    copyTableData()
  } catch (error) {
    event.preventDefault()
  }
}

const copyTableData = () => {
  let list = [] as any
  tableData.value.forEach((item) => {
    const newItem = createNewTableItem(item)

    list.push(newItem)
  })
  befrorDragTableData.value = list || []
}

const resetTableData = () => {
  let list = [] as any
  befrorDragTableData.value.forEach((item) => {
    const newItem = createNewTableItem(item)
    list.push(newItem)
  })
  tableData.value = list || []
}

const createNewTableItem = (item: any) => {
  return {
    id: item.id,
    name: item.name,
    day1: item.day1 || [],
    day2: item.day2 || [],
    day3: item.day3 || [],
    day4: item.day4 || [],
    day5: item.day5 || [],
    day6: item.day6 || [],
    day7: item.day7 || []
  }
}

const dragDataIsSame = () => {
  let isSame = true
  befrorDragTableData.value.forEach((item, index) => {
    if (index < tableData.value.length) {
      for (let i = 1; i < 8; i++) {
        item[`day${i}`].forEach((item1, index1) => {
          if (index1 < tableData.value[index][`day${i}`].length) {
            const tableDayItem = tableData.value[index][`day${i}`][index1] as any
            if (item1.id !== tableDayItem.id || item1.name !== tableDayItem.name) {
              isSame = false
            }
          } else {
            isSame = false
          }
        })
      }
    } else {
      isSame = false
    }
  })
  return isSame
}
const tabListDrop = async (event) => {
  console.log('就打发了康师傅记录卡1111', dragDataIsSame())
  // return
  if (dragDataIsSame()) {
    return
  }
  try {
    await ElMessageBox.confirm('确定要移动这个项目吗？', '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        copyTableData()
      })
      .catch(() => {
        // 取消
        resetTableData()
      })
  } catch (error) {
    event.preventDefault()
  }
}

// const onTableDrop = async (event) => {
//   console.log('就打发了康师傅记录卡6666', dragDataIsSame())
//   const { added, removed } = event
//   console.log('简单来说附件', event, removed.element.dataset, added.element.dataset)
//   if (!added || !removed) return

//   const fromRowIndex = removed.element.dataset.index
//   const toRowIndex = added.element.dataset.index
//   const fromProp = removed.element.dataset.prop
//   const toProp = added.element.dataset.prop

//   if (fromRowIndex !== undefined && toRowIndex !== undefined && fromProp && toProp) {
//     const fromRow = tableData.value[fromRowIndex]
//     const toRow = tableData.value[toRowIndex]

//     if (fromRow && toRow) {
//       try {
//         await ElMessageBox.confirm('确定要移动这个项目吗？', '确认', {
//           confirmButtonText: '确定',
//           cancelButtonText: '取消',
//           type: 'warning'
//         })

//         const movedItem = fromRow[fromProp].splice(removed.oldIndex, 1)[0]
//         toRow[toProp] = [movedItem]

//         // 删除 fromRow 中的所有数据
//         fromRow[fromProp] = []
//       } catch (error) {
//         // 用户取消了确认对话框，不进行任何操作
//         // 重新将元素放回原位置
//         fromRow[fromProp].splice(removed.oldIndex, 0, removed.element)
//         event.preventDefault()
//       }
//     }
//   }

//   console.log('tableData', tableData.value)
// }
</script>

<style lang="scss" scoped>
.visual-dashboard {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.list-container {
  display: flex;
  overflow-x: auto;
  padding: 10px;
  background-color: #f5f5f5;
}

.list {
  display: flex;
  gap: 10px;
}

.list-item {
  padding: 10px;
  background-color: #409eff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.table-container {
  overflow-x: auto;
}

.table-cell {
  padding: 10px;
  background-color: #e6f7ff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}
</style>
