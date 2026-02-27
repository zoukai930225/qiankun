<template>
  <div class="wrapper">
    <div
      v-for="item in data"
      :key="item.id"
      class="box"
      :style="getStyle(item.id)"
      @click="handleClick(item)"
    >
      <!-- 结果 -->
      <div style="margin-bottom: 4px; font-weight: bold; font-size: 16px">{{ item.result }}</div>
      <!-- 定位 -->
      <div style="margin-bottom: 4px">{{ item.location }}</div>
      <div style="font-size: 14px">实际占比：{{ item.score.toFixed(0) }}%</div>
      <!-- {{ item.name }} -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import * as sudokuSetApi from '@/api/otr/sudokuSet'
import * as InventoryCalibrationApi from '@/api/otr/InventoryCalibration'
const scoreObjSave = ref({})
const props = defineProps({
  id: {
    type: String,
    required: true
  },
  queryParams: {
    type: Object,
    required: true
  },
  nineGridPosition: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['click-item'])
const handleClick = (item) => {
  emit('click-item', item)
}

// 根据id获取数据
const data = ref([])

const getData = async (id: string, scoreObj) => {
  console.log('接受到的id: ', id)
  const res = await sudokuSetApi.getSudokuSetDetailList([id])
  data.value = res[id] || []
  data.value.forEach((item) => {
    item.id = item.number
    item.name = item.number
    item.vname = item.result
    item.location = item.position
    item.color = item.backgroundColor
    // item.score = scoreObj[item.location] * 100 || 0

    // const scoreItem = scoreObj.find((item1) => item1.id === item.id)
    // if (scoreItem) {
    //   item.score = scoreItem.score * 100
    // } else {
    //   item.score = 0
    // }
    item.score = (scoreObj[item.id] || 0) * 100
  })
  // console.log('data: ', data.value)
}

// nineGridPosition变化的时候重新获取数据
watch(
  () => props.nineGridPosition,
  (newPosition, oldPosition) => {
    if (newPosition !== oldPosition) {
      getData(props.id, scoreObjSave.value)
    }
  }
)
watch(
  () => props.queryParams,
  (newVal) => {
    if (newVal) {
      freshData(newVal)
    }
  },
  {
    deep: true
  }
)
const grid = ref([
  ['E', 'C', 'A'],
  ['F', 'D', 'B'],
  ['G', 'H', 'I']
])

// const data = ref([
//   {
//     id: 'E',
//     name: 'E',
//     vname: 1,
//     location: '核心4',
//     color: 'blue'
//   },
//   {
//     id: 'C',
//     name: 'C',
//     vname: 1,
//     location: '核心5',
//     color: 'blue'
//   },
//   {
//     id: 'A',
//     name: 'A',
//     vname: 1,
//     location: '核心0',
//     color: 'orange'
//   },
//   {
//     id: 'F',
//     name: 'F',
//     vname: 1,
//     location: '核心',
//     color: 'blue'
//   },
//   {
//     id: 'D',
//     name: 'D',
//     vname: 1,
//     location: '核心1',
//     color: 'red'
//   },
//   {
//     id: 'B',
//     name: 'B',
//     vname: 1,
//     location: '核心',
//     color: 'orange'
//   },
//   {
//     id: 'G',
//     name: 'G',
//     vname: 7,
//     location: '核心',
//     color: 'red'
//   },
//   {
//     id: 'H',
//     name: 'H',
//     vname: 8,
//     location: '核心',
//     color: 'bule'
//   },
//   {
//     id: 'I',
//     name: 'I',
//     vname: 8,
//     location: '核心7',
//     color: 'bule'
//   }
// ])

const styles = ref<{ [key: string]: any }>({}) //存好的样式

const initializeStyles = () => {
  data.value.forEach((item) => {
    let row = 0
    let col = 0

    for (let i = 0; i < grid.value.length; i++) {
      for (let j = 0; j < grid.value[i].length; j++) {
        if (grid.value[i][j] === item.id) {
          row = i + 1
          col = j + 1
          break
        }
      }
    }

    styles.value[item.id] = {
      gridColumnStart: col * 2 - 1,
      gridColumnEnd: col * 2,
      gridRowStart: row * 2 - 1,
      gridRowEnd: row * 2,
      backgroundColor: item.color,
      isShow: true
    }
  })
}

/**
 * @description: 计算样式
 * @param {*} id 根据后端给的id来计算样式(vcode)
 * @return {*}
 */
const getStyle = (id: string) => {
  // console.log('styles.value: ', styles.value)

  const style = styles.value[id]
  return {
    gridColumn: `${style.gridColumnStart} / ${style.gridColumnEnd}`,
    gridRow: `${style.gridRowStart} / ${style.gridRowEnd}`,
    backgroundColor: style.backgroundColor,
    // visibility: style.isShow ? 'visible' : 'hidden', // 使用 visibility 控制显示
    color: style.isShow ? '#FFF' : 'transparent',
    zIndex: style.isShow ? 2 : 1
  }
}

//判断有几个重复的如果重复的就添加到repeatData里面 按照数值不同push到不同的数组里面
const repeatData = ref<{ [key: string]: string[] }>({})

/**
 * @description: 验证数据是否重复
 * @return {*}
 */
const findDuplicates = () => {
  const seen = new Map<string, Set<string>>()
  data.value.forEach((item) => {
    const key = `${item.vname}-${item.location}-${item.color}`
    if (!seen.has(key)) {
      seen.set(key, new Set())
    }
    seen.get(key)!.add(item.id)
  })

  seen.forEach((ids, key) => {
    if (ids.size > 1) {
      const location = key.split('-')[1]
      if (!repeatData.value[location]) {
        repeatData.value[location] = []
      }
      repeatData.value[location].push(...Array.from(ids))
    }
  })
}

/**
 * @description: 验证两个id是否相邻
 * @param {*} id1 //id1的位置
 * @param {*} id2 //id2的位置
 * @return {*} boolean //返回是否相邻
 */
const isAdjacent = (id1: string, id2: string) => {
  let pos1: [number, number] | null = null
  let pos2: [number, number] | null = null

  for (let i = 0; i < grid.value.length; i++) {
    for (let j = 0; j < grid.value[i].length; j++) {
      if (grid.value[i][j] === id1) pos1 = [i, j] // 找到id1的位置
      if (grid.value[i][j] === id2) pos2 = [i, j]
    }
  }

  if (pos1 && pos2) {
    const [x1, y1] = pos1
    const [x2, y2] = pos2
    return (
      (x1 === x2 && Math.abs(y1 - y2) === 1) || // 左右相邻
      (y1 === y2 && Math.abs(x1 - x2) === 1) // 上下相邻
    )
  }

  return false
}

// 相邻的数据
const adjacentPairs = ref<{ [key: string]: string[] }>({})

/**
 * @description: 查找相邻的数据
 * @return {*}
 */
const findAdjacentPairs = () => {
  Object.keys(repeatData.value).forEach((location) => {
    const ids = repeatData.value[location]
    adjacentPairs.value[location] = []

    /*     const checked = new Set<string>(); //如果数组超过4个,这个方法快,否则下面的快.用空间换时间,如果数据量大,这个方法快,考虑到多数情况是2个,所以采用下面的方法
    
        for (let i = 0; i < ids.length; i++) {
          if (checked.has(ids[i])) continue;
    
          for (let j = i + 1; j < ids.length; j++) {
            if (isAdjacent(ids[i], ids[j])) {
              adjacentPairs.value[location].push(ids[i], ids[j]);
              checked.add(ids[i]);
              checked.add(ids[j]);
            }
          }
        } */

    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        //降低时间复杂度
        if (isAdjacent(ids[i], ids[j])) {
          adjacentPairs.value[location].push(ids[i], ids[j])
        }
      }
    }
  })
  // console.log('adjacentPairs: ', adjacentPairs.value)

  // 给adjacentPairs.value里面的数据去重
  Object.keys(adjacentPairs.value).forEach((location) => {
    adjacentPairs.value[location] = Array.from(new Set(adjacentPairs.value[location]))
  })
  // console.log('adjacentPairs11: ', adjacentPairs.value)
}

/**
 * @description: 分类相邻数据,找出同行同列的数据
 * @return {*}result
 */
const findRowsAndColumns = () => {
  const result: { [key: string]: { [key: string]: string[] } } = {}

  Object.keys(adjacentPairs.value).forEach((location) => {
    const ids = adjacentPairs.value[location]
    result[location] = {}

    const rowMap: { [key: number]: string[] } = {}
    const colMap: { [key: number]: string[] } = {}

    ids.forEach((id) => {
      let pos: [number, number] | null = null

      for (let i = 0; i < grid.value.length; i++) {
        for (let j = 0; j < grid.value[i].length; j++) {
          if (grid.value[i][j] === id) {
            pos = [i, j]
            break
          }
        }
        if (pos) break
      }

      if (pos) {
        const [x, y] = pos
        if (!rowMap[x]) rowMap[x] = []
        if (!colMap[y]) colMap[y] = []
        rowMap[x].push(id)
        colMap[y].push(id)
      }
    })

    let rowIndex = 0
    Object.values(rowMap).forEach((row) => {
      if (row.length > 1) {
        result[location][`同行${rowIndex}`] = row
        rowIndex++
      }
    })

    let colIndex = 0
    Object.values(colMap).forEach((col) => {
      if (col.length > 1) {
        result[location][`同列${colIndex}`] = col
        colIndex++
      }
    })
  })

  const sortedResult = sortRowsAndColumns(result)
  // console.log('sortedResult: ', sortedResult)
  return sortedResult
}

/**
 * @description: 对分类过的结果进行排序
 * @param {*} result
 * @return {*} sortedResult
 */
const sortRowsAndColumns = (result: { [key: string]: { [key: string]: string[] } }) => {
  const sortedResult: { [key: string]: { [key: string]: string[] } } = {}

  Object.keys(result).forEach((location) => {
    sortedResult[location] = {}

    Object.keys(result[location]).forEach((key) => {
      const ids = result[location][key]
      const positions = ids.map((id) => {
        for (let i = 0; i < grid.value.length; i++) {
          for (let j = 0; j < grid.value[i].length; j++) {
            if (grid.value[i][j] === id) {
              return { id, pos: [i, j] }
            }
          }
        }
        return { id, pos: [-1, -1] } // 默认值，防止找不到位置
      })

      if (key.startsWith('同行')) {
        positions.sort((a, b) => a.pos[1] - b.pos[1]) // 按列排序，从左到右
      } else if (key.startsWith('同列')) {
        positions.sort((a, b) => b.pos[0] - a.pos[0]) // 按行排序，从下到上
      }

      sortedResult[location][key] = positions.map((p) => p.id)
    })
  })

  //判断sortedResult的数据,判断里面的每一个同行,每一个同列的数组里面的元素 是不是相邻,如果不相邻就删除

  Object.keys(sortedResult).forEach((location) => {
    Object.keys(sortedResult[location]).forEach((key) => {
      const ids = sortedResult[location][key]
      for (let i = 0; i < ids.length - 1; i++) {
        if (!isAdjacent(ids[i], ids[i + 1])) {
          ids.splice(i, 1)
          i--
        }
      }
    })
  }) // 如果数组的length<=1,就删除,

  Object.keys(sortedResult).forEach((location) => {
    Object.keys(sortedResult[location]).forEach((key) => {
      if (sortedResult[location][key].length <= 1) {
        delete sortedResult[location][key]
      }
    })
  })

  // 删除同列中已经存在的同行数据
  Object.keys(sortedResult).forEach((location) => {
    const columns = sortedResult[location]
    const rowKeys = Object.keys(columns).filter((key) => key.startsWith('同行'))
    const colKeys = Object.keys(columns).filter((key) => key.startsWith('同列'))

    colKeys.forEach((colKey) => {
      const colIds = columns[colKey]
      rowKeys.forEach((rowKey) => {
        const rowIds = columns[rowKey]
        colIds.forEach((id) => {
          if (rowIds.includes(id)) {
            const index = colIds.indexOf(id)
            if (index > -1) {
              colIds.splice(index, 1)
            }
          }
        })
      })
    })
  })

  // console.log('这里是做什么的呀', sortedResult)
  return sortedResult
}

/**
 * @description: 根据分类好的结果调整样式
 * @param {*} result
 * @return {*}
 */
// const adjustStyles = (result: { [key: string]: { [key: string]: string[] } }) => {
//   console.log('result: ', result);
//   Object.keys(result).forEach(location => {
//     Object.keys(result[location]).forEach(key => {
//       const ids = result[location][key];
//       const length = ids.length;

//       if (key.startsWith('同行') && length > 1) {
//         const firstId = ids[0];
//         styles.value[firstId].gridColumnEnd += (length - 1) * 2;
//         ids.slice(1).forEach(id => {
//           styles.value[id].isShow = false;
//         });
//       } else if (key.startsWith('同列') && length > 1) {
//         const firstId = ids[0];
//         styles.value[firstId].gridRowStart -= (length - 1) * 2;
//         ids.slice(1).forEach(id => {
//           styles.value[id].isShow = false;
//         });
//       }
//     });
//   });
// };

//上面的方法大概率不会有问题,但是为了保险起见,还是用下面的方法
const adjustStyles = (result: { [key: string]: { [key: string]: string[] } }, scoreObj: any) => {
  // console.log('result: ', result)

  // 遍历 result 对象，并设置对应的 score 值
  for (const key in result) {
    const group = result[key]
    for (const arrayKey in group) {
      const ids = group[arrayKey]
      // 计算数组中所有元素的 score 值之和
      const totalScore = ids.reduce((sum, id) => sum + scoreObj[id], 0)
      const formattedTotalScore = parseFloat(totalScore)
      // console.log('总和原始', totalScore)
      // console.log('总和格式化', formattedTotalScore)
      // 遍历 data.value 并设置 score 值
      data.value.forEach((item) => {
        if (ids.includes(item.id)) {
          item.score = Math.round(formattedTotalScore * 100)
          // console.log('item.score', item.score)
        }
      })
      // console.log('data: ', data.value)
    }
  }

  const showElements = new Set<string>()

  // 收集需要显示的元素，显示每个数组的第一个元素
  Object.keys(result).forEach((location) => {
    Object.keys(result[location]).forEach((key) => {
      const ids = result[location][key]
      showElements.add(ids[0])
    })
  })

  // console.log('___1', result)
  // 遍历传递进来的 result，设置 isShow 属性
  Object.keys(result).forEach((location) => {
    Object.keys(result[location]).forEach((key) => {
      const ids = result[location][key]

      ids.forEach((id) => {
        // console.log('id', id)
        if (showElements.has(id)) {
          // console.log('show', styles.value[id])
          styles.value[id].isShow = true
        } else {
          styles.value[id].isShow = false
        }
      })
    })
  })

  // 调整行列的大小
  Object.keys(result).forEach((location) => {
    Object.keys(result[location]).forEach((key) => {
      const ids = result[location][key]
      const length = ids.length

      if (key.startsWith('同行') && length > 1) {
        const firstId = ids[0]
        styles.value[firstId].gridColumnEnd += (length - 1) * 2
      } else if (key.startsWith('同列') && length > 1) {
        const firstId = ids[0]
        styles.value[firstId].gridRowStart -= (length - 1) * 2
      }
    })
  })

  // console.log('styles.value: -=', styles.value)
}

const freshData = async (params) => {
  const scoreObj = await InventoryCalibrationApi.getNineGridScore(params)

  scoreObjSave.value = scoreObj
  await getData(props.id, scoreObjSave.value)
  initializeStyles()

  findDuplicates() // 查找重复数据

  findAdjacentPairs() // 查找相邻数据

  const result = findRowsAndColumns() // 分类相邻数据

  adjustStyles(result, scoreObjSave.value) // 调整样式
}

freshData(props.queryParams)

defineExpose({ freshData })
</script>

<style scoped>
.wrapper {
  width: 410px;
  display: grid;
  grid-template-columns: 136px 10px 136px 10px 136px;
  grid-template-rows: 126px 10px 126px 10px 126px;
  position: absolute;
  top: 13px;
  left: 13px;
}

.box {
  background-color: #444;
  color: #fff;
  font-size: 14px;
  padding: 15px;
  box-sizing: border-box;
  text-align: center;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/* .e {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.c {
  grid-column: 3 / 4;
  grid-row: 1 / 2;
}

.a {
  grid-column: 5 / 6;
  grid-row: 1 / 2;
}

.f {
  grid-column: 1 / 2;
  grid-row: 3 / 4;
}

.d {
  grid-column: 3 / 4;
  grid-row: 3 / 4;
}

.b {
  grid-column: 5 / 6;
  grid-row: 3 / 4;
}

.g {
  grid-column: 1 / 2;
  grid-row: 5 / 6;
}

.h {
  grid-column: 3 / 4;
  grid-row: 5 / 6;
}

.i {
  grid-column: 5 / 6;
  grid-row: 5 / 6;
} */
</style>
