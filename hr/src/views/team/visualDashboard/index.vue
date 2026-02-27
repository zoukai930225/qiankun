<template>
  <div class="visual-dashboard">
    <div class="top-wapper">
      <SearchForm
        ref="searchForm"
        :currentTab="currentTab"
        @handle-query="handleSearch"
        @handle-reset="handleReset"
        @handle-export="handleExport"
        :btnLoading="loading"
        :startTime="startTime"
        :endTime="endTime"
      />
      <div class="tabs-wapper flex-row"> </div>
    </div>

    <div
      v-if="
        cusQueryParams?.cycle && cusQueryParams?.queryProcessNodes?.length && allSourceList.length
      "
      ref="tableWapper"
      v-loading="loading"
      class="table-wapper"
    >
      <div
        v-for="item in allSourceList"
        :key="item?.processNode"
        class="table-top-wapper"
        v-loading="item.loading"
      >
        <TopListBar :topList="item?.unTasks" @handle-edit="handleEdit" :processNode="item?.id" />
        <TableItem
          @handle-edit="handleEdit"
          :imgSrc="jingwupaishe"
          :processNode="item?.id"
          :dates="dates"
          :tableData="item?.tableData"
          :title="item?.processNodeName"
          @drag-change="handleTableDragChange"
          @cus-db-click="dbClick"
        />
      </div>
    </div>
    <div v-else class="no-data-wapper">
      <div class="desc-wapper">
        <img src="@/assets/imgs/team/riliempty.png" alt="" class="no-data-img" />
        <div class="no-data-text">请选择流程节点与上架周期查看数据</div>
      </div>
    </div>

    <Assignment
      ref="assignment"
      @cancle="handleDropCancel"
      @success="handleDropSuccess"
      :isSend="cusQueryParams?.isSend || false"
    />

    <!-- <div v-loading="loading || btnLoading">
      <TabSwitcher :tabs="tabs" :currentIndex="currentIndex" @change="tabChange" />

      <div style="background: white">
        <ListContainer :unassignedTaskList="unassignedTaskList" :demandTypeOne="demandTypeOne" />

        <TableContainer
          ref="tableContainer"
          :dates="dates"
          :tableData="tableData"
          @table-change="tabListDrop"
          :demandTypeOne="demandTypeOne"
          @table-data-change="handleTableDataChange"
          @table-data-change-all="handleTableDataChangeAll"
          :currentIndex="currentIndex"
          @export-success="exportSuccess"
          @cus-db-click="dbClick"
        />
      </div>
    </div> -->

    <Remark ref="remark" @cancle="handleRemarkCancel" @add-remark-success="addRemarkSuccess" />

    <el-dialog v-model="centerDialogVisible" title="编辑" width="800" @close="handleEditClose">
      <Editor
        class="leadEditor"
        :key="editTaskInfo.id || 'default'"
        v-model:modelValue="formData.leadContent"
        height="400px"
      />

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit"> 提交 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import {
  checkDateValidity,
  createRecordNew,
  getAssignedTasks,
  getCalendarRemarks,
  getOperatorRosterNew,
  getUnassignedTasks,
  updateCalendarRemark
} from '@/api/team/index'
import dayjs from 'dayjs'
import { ref } from 'vue'
// import ListContainer from './components/ListContainer.vue'
import Remark from './components/Remark.vue'
// import TabSwitcher from './components/TabSwitcher.vue'
// import TableContainer from './components/TableContainer.vue'
import { Editor } from '@/components/Editor'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import Assignment from './components/assignment.vue'
import SearchForm from './components/searchForm.vue'
import TableItem from './components/TableItem.vue'
import TopListBar from './components/topListBar.vue'
import { generateDates } from './utils'
const jingwuxiutu = new URL('@/assets/imgs/team/jingwuxiutu.png', import.meta.url).href
const jingwupaishe = new URL('@/assets/imgs/team/jingwupaishezu.png', import.meta.url).href
const motexiutu = new URL('@/assets/imgs/team/motexiutu.png', import.meta.url).href
const message = useMessage() // 消息弹窗
const formData = ref({
  leadContent: ''
})

const centerDialogVisible = ref(false)

defineOptions({ name: 'VisualDashboard' })
const currentTab = ref('newProduct') //tab切换code // demandType
// const currentIndex = ref(0) //第几个按钮
const loading = ref(false) //加载状态

const queryParams = reactive({
  page: 1,
  size: 10,
  start: undefined, //开始时间
  end: undefined //结束时间
})

const editTaskInfo = ref<any>({}) // 编辑任务信息
const handleEdit = (task: any) => {
  editTaskInfo.value = task
  nextTick(() => {
    formData.value.leadContent = task[task?.beizhu] || ''
    centerDialogVisible.value = true
  })
}

const handleEditClose = () => {
  formData.value.leadContent = ''
  editTaskInfo.value = {}
  centerDialogVisible.value = false
}

const saveEdit = async () => {
  const params = {
    id: editTaskInfo.value.id,
    remark: formData.value.leadContent,
    assigned: editTaskInfo.value.beizhu == 'tag' ? 0 : 1
  }
  await updateCalendarRemark(params)

  //如果是上面的找到对应的id 直接修改字段
  if (editTaskInfo.value.beizhu == 'tag') {
    allSourceList.value.forEach((sourceItem) => {
      const unTasks = sourceItem.unTasks || []
      unTasks.forEach((task) => {
        if (task.id == editTaskInfo.value.id) {
          task.tag = formData.value.leadContent
        }
      })
    })
  } else {
    allSourceList.value.forEach((sourceItem) => {
      //找到 sourceItem 的ID 和 editTaskInfo.value.processNode 相等的
      if (sourceItem.id == editTaskInfo.value.processNode) {
        const tableData = sourceItem.tableData || []
        tableData.forEach((person) => {
          //找到 person 的ID 和 editTaskInfo.value.operatorId 相等的
          if (editTaskInfo.value.operatorId.split(',').includes(person.id)) {
            //找到对应的日期字段 修改备注
            const dateProp = editTaskInfo.value.expectedCompletionTime.split(' ')[0]
            const tasks = person[dateProp] || []
            tasks.forEach((task) => {
              if (task.id == editTaskInfo.value.id) {
                task.recordRemark = formData.value.leadContent
              }
            })
          }
        })
      }
    })
  }

  console.log('更新备注参数:', allSourceList.value)
  //如果是表格里面的找到对应的id 直接修改字段
  handleEditClose()
}

const allSourceList = ref<any[]>([
  // {
  //   // 模拟数据
  //   id: '1', // 唯一id processNode
  //   processNode: '1', //节点id
  //   processNodeName: '平面方案', //节点名称
  //   unTasks: [], //未分配
  //   tasks: [], //已分配
  //   operators: [], //人员
  //   remarks: [], //备注
  //   tableData: [] //表格数据
  // }
])

// 日期列表 table header 公用
const dates = ref<any>([
  // { label: '06-30 周一', prop: '2024-06-30' },
])

// 找到之前保存的add的数据删除掉
const delNew = () => {
  allSourceList.value.forEach((sourceItem) => {
    const tableData = sourceItem.tableData || []
    if (newDetail.value.dragType == 'add') {
      // 删除添加的数据
      const dateProp = newDetail.value.targetDate
      const personId = newDetail.value.targetInfo?.userId
      if (sourceItem.id == newDetail.value.targetInfo?.processNode) {
        const personIndex = tableData.findIndex((person) => person.id == personId)
        if (personIndex != -1) {
          const taskIndex = tableData[personIndex][dateProp].findIndex(
            (task) => task.id == newDetail.value.taskData.id
          )
          if (taskIndex != -1) {
            tableData[personIndex][dateProp].splice(taskIndex, 1)
          }
        }
      }
    }
  })
}
//根据remove的数据把数据加回去
const addBefore = () => {
  if (oldDetail.value.dragType == 'remove') {
    allSourceList.value.forEach((sourceItem) => {
      const tableData = sourceItem.tableData || []
      const dateProp = oldDetail.value.targetDate
      const personId = oldDetail.value.sourceInfo?.userId
      if (sourceItem.id == oldDetail.value.sourceInfo?.processNode) {
        const personIndex = tableData.findIndex((person) => person.id == personId)
        if (personIndex != -1) {
          tableData[personIndex][dateProp].push(oldDetail.value.taskData)
        }
      }
    })
  }
}

// 内部拖动直接指派
const handleDirectDrop = () => {
  // 已经完成的不能指派
  if (newDetail.value?.taskData.calendarState == 3) {
    delNew()
    addBefore()
    message.error('已完成的任务不能在次指派')
    return
  }
  // 有指派id 二次指派
  if (newDetail.value?.taskData.operatorId) {
    // 特殊处理 人像后期 静物后期
    onSubmit(newDetail.value?.taskData)
  }
}

// 大数组设置loading状态
const setAllLoading = (flag) => {
  allSourceList.value.forEach((sourceItem) => {
    if (sourceItem.id == newDetail.value?.targetInfo?.processNode) {
      sourceItem.loading = flag
    }
  })
}

// 直接指派
const onSubmit = async (item) => {
  // 公用参数
  const params = {
    parentId: item?.id,
    type: 1, //指派时上传 type == 1
    operatorIds: newDetail.value?.targetUser?.id, //操作
    auditorIds: item?.auditorIds, //审核
    expectedCompletionTime: newDetail.value?.targetDate, // 计划完成时间
    node: newDetail.value?.targetInfo?.processNode.split(',')[0], // 流程节点
    id: item?.recordId || undefined,
    subNode: newDetail.value?.targetInfo?.processNode.split(',')[1],
    remark: item.remark
  }
  // 循环大数组设置loading
  setAllLoading(true)
  // 新增二次表单校验
  const res = await checkDateValidity(params)
  console.log(res, '!!!')
  if (res?.data) {
    // true 二次确认
    await sendMeg(params)
  } else {
    // false 二次确认
    //@ts-ignore
    ElMessageBox.confirm(res?.message, '系统提醒', {
      confirmButtonText: '继续指派',
      cancelButtonText: '取消指派',
      type: 'warning'
    })
      .then(async () => {
        await sendMeg(params)
      })
      .catch(() => {
        console.log('取消执行')
      })
  }
}

// 调用接口 返回的数据自己替换
const sendMeg = async (params) => {
  const res = await createRecordNew({
    ...params,
    isSend: cusQueryParams.value?.isSend ? 1 : 0
  })
  console.log(res, '指派结果', newDetail.value, allSourceList.value)
  setAllLoading(false)
  replaceItem(res)
  message.success('操作成功')
}

// 拿到接口返回数据替换
const replaceItem = (res) => {
  //循环大数组 res[0].processNode 和 大数组id相等的 找到res[0].tasks[0].id 和 大数组里面 tableData里面的task.id相等的 日期为 newDetail.value.targetDate 里面任务相同id的用接口返回的替换
  allSourceList.value.forEach((sourceItem) => {
    if (sourceItem.id == res[0].processNode) {
      const tableData = sourceItem.tableData || []
      tableData.forEach((person) => {
        //找到 person 的ID 和 newDetail.value.targetUser.id 相等的
        if (person.id == newDetail.value?.targetUser?.id) {
          const dateProp = newDetail.value?.targetDate
          const tasks = person[dateProp] || []
          tasks.forEach((task, index) => {
            if (task.id == res[0].tasks[0].id) {
              // 替换数据
              person[dateProp][index] = res[0].tasks[0]
            }
          })
        }
      })
    }
  })
}

const assignment = ref()
const dragDataItem = ref<any>({})
const newDetail = ref<any>({})
const oldDetail = ref<any>({})
// 处理表格拖拽事件
const handleTableDragChange = (dragInfo: any) => {
  console.log('详细拖拽信息:', dragInfo)
  oldDetail.value = {}
  const { dragType, sourceInfo, targetInfo, taskData, event, targetDate, reset } = dragInfo

  // 如果reset 为true 需要还原数据
  if (reset) {
    console.log('还原数据')
    // 还原数据逻辑
    switch (dragType) {
      case 'add':
        newDetail.value = {}
        newDetail.value = dragInfo
        break
      case 'remove':
        oldDetail.value = dragInfo
        break
    }
    delNew()
    addBefore()
    return
  }

  switch (dragType) {
    case 'add':
      console.log('添加任务:')
      console.log('- 任务:', taskData)
      console.log('- 来源:', sourceInfo.type === 'topList' ? '顶部任务池' : '其他表格')
      console.log('- 目标:', targetInfo)
      console.log(allSourceList.value, '大数组')
      // 清楚之前成功的标记
      dragDataItem.value.success = false
      // 记录操作的元素（用于添加） 弹出指派弹窗
      newDetail.value = {}
      newDetail.value = dragInfo

      // 如果表格内部拖动就不需要弹出指派弹窗
      if (sourceInfo.type !== 'topList') {
        console.log('表格内部拖动不弹出指派弹窗')
        handleDirectDrop()
        return
      } else {
        console.log('从顶部任务池拖动需要弹出指派弹窗')
        assignment.value.open(taskData, {
          node: targetInfo?.processNode.split(',')[0],
          time: targetDate,
          subnode: targetInfo?.processNode.split(',')[1],
          people: targetInfo?.userId,
          auditorIds: taskData?.auditorIds
        })
      }

      break

    case 'remove':
      console.log('移除任务:')
      console.log('- 任务:', taskData)
      console.log('- 来源:', sourceInfo)
      oldDetail.value = dragInfo
      // 记录删除的数据用来删除table里面的数据
      break
  }
}

// 拖拽成功手动调整数据不依赖接口
const handleDropSuccess = (res) => {
  dragDataItem.value.success = true
  console.log('拖拽指派成功，调整表格数据')
  console.log(oldDetail.value, 'oldDetail.value')
  console.log(newDetail.value, 'newDetail.value')
  console.log(allSourceList.value, 'allSourceList.value')
  //1、请求接口查询最新的刚才操作的数据 根据之前记录的数据去替换最新的
  // 2、如果是从上面列表移动过来的需要删除之前的数据
  if (oldDetail.value.dragType == 'remove') {
    // 互相推拽 拿到接口返回的数据去替换
    replaceItem(res)
  } else if (oldDetail.value.dragType == undefined) {
    // 从上面列表移动过来的 找到任务id 从topList删除这一项
    allSourceList.value.forEach((sourceItem) => {
      const unTasks = sourceItem.unTasks || []
      const taskIndex = unTasks.findIndex((task) => task.id == newDetail.value.taskData.id)
      if (taskIndex != -1) {
        unTasks.splice(taskIndex, 1)
      }
    })
    // 拿接口最新数据替换新的数据
    replaceItem(res)
  }
}
// 拖拽取消不调整数据
const handleDropCancel = () => {
  // 如果没有操作成功要还原数据
  if (dragDataItem.value.success) return
  console.log('拖拽指派取消，不调整表格数据')
  console.log(oldDetail.value, 'oldDetail.value')
  console.log(newDetail.value, 'newDetail.value')
  //1、找到之前保存的add的数据删除掉
  delNew()
  //2、根据remove的数据把数据加回去
  addBefore()
  // 3、如果没有remove的数据说明是从上面列表移动过来的 只需要删除add的数据即可 然后把这个元素添加到之前的列表中
}

const searchForm = ref()
// 搜索条件
const cusQueryParams = computed(() => {
  return searchForm.value?.cusQueryParams
})

// 搜索重置
const handleReset = () => {
  allSourceList.value = []
  dates.value = []
  startTime.value = undefined
  endTime.value = undefined
}

//是否要清楚时间在搜索
const handleSearch = (value) => {
  // 校验必传 上架周期和流程节点
  if (!value?.cycle) {
    message.error('请先选择上架周期')
    return
  }

  if (!value?.queryProcessNodes?.length) {
    message.error('请先选择流程节点')
    return
  }

  // 通过queryProcessNodes构造 allSourceList 数据

  // 构建大数组
  allSourceList.value = value?.queryProcessNodes.map((node) => {
    return {
      id: node,
      processNodeName: findNodeNameByCode(node),
      processNode: node, //节点id
      unTasks: [], //未分配
      tasks: [], //已分配
      operators: [], //人员
      remarks: [], //备注
      tableData: [] //表格数据
    }
  })

  console.log('搜索条件', value)
  startTime.value = value.date[0]
  endTime.value = value.date[1]
  queryParams.page = 1
  refresh()
}

// 找名字code 和数组code相等的 返回label
const findNodeNameByCode = (code) => {
  const node = getIntDictOptions(DICT_TYPE.VISUAL_PROCESS_NODE, true).find(
    (item) => item.code == code
  )
  return node ? node.label : ''
}

const tableContainer = ref()
const btnLoading = ref(false) // 导出按钮加载状态
// 导出图片
const handleExport = (value) => {
  startTime.value = value.date[0]
  endTime.value = value.date[1]
  // nextTick(() => {
  //   tableContainer.value?.tableExport({
  //     filename: `视觉日历-${dayjs(startTime.value).format('YYYY-MM-DD')}-${dayjs(endTime.value).format('YYYY-MM-DD')}`
  //   })
  // })
  exportTableImage()
}

const refresh = async () => {
  try {
    loading.value = true

    await initPeopleList()
    await initData() // 初始化日期
    await generateTableData() // 初始化表格数据时间选项
    await getAssignedTasksList() // 获取已分配任务列表
    await getUnassignedTasksList() // 获取未分配任务列表
    await initRemarks() //获取备注列表
    loading.value = false
  } catch (error) {
    loading.value = false
  }
}

// 获取备注列表 之前逻辑整个页面只获取一次备注
const initRemarks = async () => {
  console.log('222', cusQueryParams.value)
  try {
    const params = {
      start: dayjs(startTime.value).format('YYYY-MM-DD'),
      end: dayjs(endTime.value).format('YYYY-MM-DD'),
      queryProcessNodes: cusQueryParams.value.queryProcessNodes.join(';'),
      group: cusQueryParams.value.group?.length ? cusQueryParams.value.group.join() : undefined
    }
    const res = await getCalendarRemarks(params)
    console.log(res, '获取备注列表结果')
    formatAllSourceArrByRemarks(res || [])
  } catch (error) {
    loading.value = false
  }
}

// 通过备注格式化大数组 循环大数组找到id 和 备注数组中processNode相同的时候 把 remarks字段给大数组
const formatAllSourceArrByRemarks = (arr) => {
  if (!arr) return
  //循环大数组 找到大数据每一项的ID 和 arr中的processNode相等的时候 循环 res.remarks 把userId等于 大数组 tableData中人员id 找到res.remarks中的calendarDate 和大数组某个人的日期字段相等的时候 把remark赋值给对应的任务
  allSourceList.value.forEach((sourceItem) => {
    arr.forEach((item) => {
      if (item.processNode == sourceItem.id) {
        const tableData = sourceItem.tableData || []

        item.remarks.forEach((remark) => {
          tableData.forEach((person) => {
            //找到 person 的ID 和 remark.userId 相等的
            if (person.id == remark.userId) {
              const dateProp = remark.calendarDate
              const tasks = person[dateProp] || []
              tasks.push(remark)
            }
          })
        })
      }
    })
  })
}

// 格式化大数组 表格数据 tableData
const generateTableData = () => {
  allSourceList.value.forEach((sourceItem) => {
    const peopleArr = sourceItem.operators || []
    let obj = {}
    const midArr = peopleArr.map((person) => {
      if (obj[person?.dept]) {
        obj[person?.dept] = obj[person?.dept] + 1
      } else {
        obj[person?.dept] = 1
      }

      const data = {
        id: person?.operatorId,
        name: person?.operatorRealname,
        avatarOrigin: person?.avatarOrigin,
        dept: `${person?.dept}-${obj[person?.dept]}`,
        deptRank: Object.keys(obj)?.length,
        processNode: sourceItem.id
      }
      for (let i = 0; i <= dates.value.length; i++) {
        data[`${dates.value[i]?.prop}`] = []
      }
      return data
    })
    sourceItem.tableData = midArr
  })
}

const startTime = ref() //查询开始时间
const endTime = ref() //结束时间

// 根据开始时间和结束时间生成日期数组
const initData = () => {
  dates.value = generateDates(startTime.value, endTime.value)
  console.log(dates.value, '生成的日期')
}

// 获取已分配任务列表
const getAssignedTasksList = async () => {
  try {
    const params = {
      page: 1,
      size: 1000,
      ...cusQueryParams.value,
      group: undefined,
      date: undefined,
      queryProcessNodes: cusQueryParams.value.queryProcessNodes.join(';'),
      start: dayjs(startTime.value).format('YYYY-MM-DD'),
      end: dayjs(endTime.value).format('YYYY-MM-DD')
    }
    const res = await getAssignedTasks(params)
    otherData.value = []
    console.log(res, '获取已分配任务列表结果')
    formatAllSourceListByAssignedTasks(res || [])
  } catch (error) {
    loading.value = false
  }
}

const otherData: any = ref([]) // 其他数据

// TODO: 通过已分配任务格式化大数组
const formatAllSourceListByAssignedTasks = (res) => {
  if (res.length == 0) return
  // 循环大数组  res中的processNode 和大数组id相等的时候 把任务分配到对应人员和日期中
  console.log(allSourceList.value, ' 222格式化大数组已分配任务列表')
  allSourceList.value.forEach((sourceItem) => {
    const tableData = sourceItem.tableData || []
    res.forEach((item) => {
      if (item.processNode == sourceItem.id) {
        // for循环  res.tasks
        for (let i = 0; i < item.tasks.length; i++) {
          const task = item.tasks[i]
          const date = task?.expectedCompletionTime?.split(' ')[0]
          const index = dates.value.findIndex((dateItem) => dateItem.prop == date)
          if (index != -1) {
            // if (!task?.operatorIds) return
            const arr = [...new Set((task?.operatorIds || '')?.split(','))]
            console.log(arr, 'arr')
            arr &&
              arr.forEach((it) => {
                // @ts-ignore
                const personIndex = tableData.findIndex((person) => it?.includes(person?.id))
                if (personIndex != -1) {
                  tableData[personIndex][`${dates.value[index]?.prop}`].push(task)
                }
              })
          } else {
            if (cusQueryParams.value.cycle) {
              console.log('没有找到对应的日期')
              console.log(date, 'task的日期')
              if (task?.calendarState == 1 || task?.calendarState == 2) {
                if (sourceItem?.unTasks) {
                  //前面插入
                  sourceItem?.unTasks.unshift(task)
                } else {
                  sourceItem.unTasks = [task]
                }
                console.log(allSourceList.value, '格式化大数组已分配任务列表')
              } else {
                const date = task?.expectedCompletionTime?.split(' ')[0]
                let index1 = ref(0)
                //日期 2025-10-20
                // 数组 ['2025-10-27', '2025-10-28', '2025-10-29', '2025-10-30', '2025-10-31']
                // 怎么判断日期 在数据中是小于最小日期还是大于最大日期
                const minDate = dates.value[0]?.prop
                const maxDate = dates.value[dates.value.length - 1]?.prop
                if (dayjs(date).isBefore(minDate)) {
                  index1.value = 0
                } else if (dayjs(date).isAfter(maxDate)) {
                  console.log(date, '任务在最大日期之后')
                  index1.value = dates.value.length - 1
                }
                const arr = [...new Set((task?.operatorIds || '')?.split(','))]
                console.log(arr, 'arr111')
                arr &&
                  arr.forEach((it) => {
                    // @ts-ignore
                    const personIndex = tableData.findIndex((person) => it?.includes(person?.id))
                    if (personIndex != -1) {
                      tableData[personIndex][`${dates.value[index1.value]?.prop}`].push(task)
                    }
                  })
              }
            }
          }
        }
      }
    })
  })
}

// 获取未分配任务列表
const getUnassignedTasksList = async () => {
  try {
    const params = {
      page: 1,
      size: 1000,
      ...cusQueryParams.value,
      group: undefined,
      date: undefined,
      queryProcessNodes: cusQueryParams.value.queryProcessNodes.join(';'),
      start: dayjs(startTime.value).format('YYYY-MM-DD'),
      end: dayjs(endTime.value).format('YYYY-MM-DD')
    }
    const res = await getUnassignedTasks(params)
    formatAllSourceListByUnassignedTasks(res || [])
  } catch (error) {
    loading.value = false
  }
}

// 通过未分配任务格式化大数组
const formatAllSourceListByUnassignedTasks = (arr) => {
  if (!arr || !arr.length) return
  allSourceList.value.forEach((sourceItem) => {
    const matchedTasks = arr.filter((task) => task.processNode == sourceItem.id)
    if (matchedTasks && matchedTasks.length) {
      sourceItem.unTasks = sourceItem.unTasks.concat(matchedTasks[0].tasks || [])
    }
  })

  console.log(allSourceList.value, '格式化大数组未分配任务')
}

// 查询对应节点的人员
const initPeopleList = async () => {
  try {
    const params = {
      group: cusQueryParams.value.group?.length ? cusQueryParams.value.group.join() : undefined,
      queryProcessNodes: cusQueryParams.value.queryProcessNodes.join(';')
    }
    const res = await getOperatorRosterNew(params)
    console.log(res, '获取人员')
    formatAllSourceListByPeopleArr(res || [])
  } catch (error) {
    loading.value = false
  }
}

// 通过人员列表构建大数组
const formatAllSourceListByPeopleArr = (arr) => {
  if (!arr || !arr.length) return
  allSourceList.value.forEach((sourceItem) => {
    const matchedPeople = arr.find((people) => people.processNode == sourceItem.id)
    if (matchedPeople) {
      sourceItem.operators = formatPeopleArr(matchedPeople?.operators) || []
    }
  })
}

// 组内人员聚合
const formatPeopleArr = (arr) => {
  if (!arr) return []
  let obj = {}
  const preMidArr = arr.map((item) => {
    if (item?.dept == '天猫设计组' || item?.dept == '天猫推广设计组') {
      return {
        ...item,
        dept: '天猫设计组'
      }
    }
    return item
  })

  let midArr = preMidArr.map((item) => {
    if (obj[item.dept]) {
      obj[item.dept].push(item)
    } else {
      obj[item.dept] = [item]
    }
  })
  midArr = Object.values(obj).flat()

  console.log(midArr, '格式化好的数据')

  return midArr.sort((a, b) => {
    return a.sort - b.sort
  })
}

const remark = ref()
const dbClick = async (item, row) => {
  console.log(item, row, 'row')
  // 要兼容 备注 和 任务 同时存在的逻辑
  // if (row?.length != 0 && !row?.[0]?.calendarDate) return
  remark.value.open({
    ...item,
    start: dayjs(startTime.value).format('YYYY-MM-DD'),
    end: dayjs(endTime.value).format('YYYY-MM-DD')
  })
}

const handleRemarkCancel = () => {}

const addRemarkSuccess = (item) => {
  console.log('添加备注成功', item)
  //调用接口成功需要手动更新数据
  allSourceList.value.forEach((sourceItem) => {
    if (sourceItem.id == item.processNode) {
      const tableData = sourceItem.tableData || []
      tableData.forEach((person) => {
        //找到 person 的ID 和 item.userId 相等的
        if (person.id == item.userId) {
          const dateProp = item.calendarDate
          const tasks = person[dateProp] || []
          // item.newItem是最新的备注信息
          // tasks.unshift(item.newItem)
          // 如果tasks中存在id和item.newItem.id相等的 则替换
          const index = tasks.findIndex((task) => task.id == item.newItem.id)
          if (index != -1) {
            tasks[index] = item.newItem
          } else {
            tasks.unshift(item.newItem)
          }
        }
      })
    }
  })
}

// 新增：模板 ref
const tableWapper = ref<HTMLElement | null>(null)
// 新增：将 table-wapper 区域导出为图片
const exportTableImage = async () => {
  try {
    if (!tableWapper.value) {
      message.error('无可导出区域')
      return
    }
    // btnLoading.value = true
    // 动态导入，避免打包报错
    const html2canvas = (await import('html2canvas')).default
    // 可选：显示 loading / 禁用交互
    message.info('开始生成图片，请稍候...')
    // 使用较高的 scale 保证清晰度
    const scale = window.devicePixelRatio || 1
    const canvas = await html2canvas(tableWapper.value, {
      useCORS: true,
      scale: Math.max(1, scale),
      backgroundColor: '#ffffff' // 需要透明则设为 null
    })
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = `视觉日历-${dayjs(startTime.value).format('YYYY-MM-DD')}-${dayjs(endTime.value).format('YYYY-MM-DD')}.png`
    document.body.appendChild(link)
    link.click()
    link.remove()
    message.success('导出成功')
    // btnLoading.value = false
  } catch (err) {
    // btnLoading.value = false
    console.error('导出失败', err)
    message.error('导出失败，请重试')
  }
}
</script>

<style lang="scss" scoped>
.visual-dashboard {
  display: flex;
  flex-direction: column;
  min-width: 1280px;
  overflow-x: auto;
}

.tabs-wapper {
  .tab-item {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-right: 16px;
    width: 116px;
    height: 40px;
    background: #ffffff;
    border-radius: 6px 6px 0px 0px;

    .tab-icon {
      width: 12px;
      height: 13px;
      margin-right: 4px;
    }

    .tab-title {
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }

    .activity {
      color: #0064ff;
    }
  }

  .activityItem {
    background: #ebf2ff;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.table-top-wapper {
  background: #ffffff;
  border-radius: 8px;
  padding: 0px 20px 20px 20px;
  padding-top: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}

.no-data-wapper {
  padding: 20px;
  box-sizing: border-box;
  height: calc(100vh - 400px);
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  .desc-wapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .no-data-img {
      width: 300px;
      height: 300px;
    }
    .no-data-text {
      color: #999999;
      font-size: 14px;
    }
  }
}
.top-wapper {
  background: white;
  padding: 20px 20px 0 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
</style>
