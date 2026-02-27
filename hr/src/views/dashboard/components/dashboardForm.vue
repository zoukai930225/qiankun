<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      @close="handleDrawerClose"
      :size="968"
    >
      <div class="drawerTitle"
        ><div>看板</div
        ><div @click="drawerVisible = false"
          ><el-icon><CloseBold /></el-icon
        ></div>
      </div>
      <div class="drawerContent">
        <div style="display: flex; justify-content: flex-end">
          <!-- <el-select
            v-model="queryParams.dateRange"
            placeholder="日期选择"
            @change="getList"
            style="width: 200px; margin-bottom: 10px"
          >
            <el-option
              v-for="dict in dateOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select> -->
          <el-form-item label="日期:" prop="timeRange">
            <el-date-picker
              v-model="timeRange"
              style="width: 200px; margin-bottom: 10px"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :clearable="true"
            />
          </el-form-item>
        </div>

        <el-table
          ref="tableRef"
          :data="dataList"
          height="420"
          :header-cell-style="{ background: '#f2f6fc' }"
          class="SWCommonTable"
          v-horizontal-scroll="'always'"
        >
          <el-table-column prop="skName" label="程序">
            <template #header>
              <el-popover placement="bottom-start" :width="200" trigger="hover" :show-arrow="false">
                <template #reference>
                  <span class="cursor-pointer">
                    程序
                    <img
                      style="vertical-align: middle; width: 12px; height: 12px"
                      src="@/assets/imgs/dashboard/filter_icon1.png"
                      alt=""
                  /></span>
                </template>
                <div class="filter">
                  <div class="filter-title">
                    <img src="@/assets/imgs/dashboard/filter_icon2.png" alt="" />
                    <span>筛选</span>
                  </div>
                  <div class="filter-content">
                    <el-input
                      v-model="queryParams.skName"
                      placeholder="请输入"
                      @keyup.enter="getList"
                    />
                  </div>

                  <div class="filter-btn">
                    <el-button class="filter-btn-item" @click="clearskNameFilter">清除</el-button>
                    <el-button class="filter-btn-item" type="primary" @click="getList"
                      >确定</el-button
                    >
                  </div>
                </div>
              </el-popover>
            </template>
            <template #default="scope">
              <div>{{ scope.row.skName }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="programType" label="程序类型">
            <template #header>
              <el-popover placement="bottom-start" :width="200" trigger="hover" :show-arrow="false">
                <template #reference>
                  <span class="cursor-pointer">
                    程序类型
                    <img
                      style="vertical-align: middle; width: 12px; height: 12px"
                      src="@/assets/imgs/dashboard/filter_icon1.png"
                      alt=""
                  /></span>
                </template>
                <div class="filter">
                  <div class="filter-title">
                    <img src="@/assets/imgs/dashboard/filter_icon2.png" alt="" />
                    <span>筛选</span>
                  </div>
                  <div class="filter-content">
                    <el-checkbox-group v-model="programTypeOptions" :max="1">
                      <el-checkbox
                        :label="item.label"
                        :value="item.value"
                        v-for="item in getIntDictOptions(DICT_TYPE.APPLICATION_TYPE, true)"
                        :key="item.value"
                      />
                    </el-checkbox-group>
                  </div>

                  <div class="filter-btn">
                    <el-button class="filter-btn-item" @click="clearProgramTypeFilter"
                      >清除</el-button
                    >
                    <el-button
                      class="filter-btn-item"
                      type="primary"
                      @click="handleProgramTypeFilter"
                      >确定</el-button
                    >
                  </div>
                </div>
              </el-popover>
            </template>
            <template #default="scope">
              {{ scope.row.programType || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="startTime" label="执行开始时间">
            <template #default="scope">
              {{ formatDate(scope.row.startTime) || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="endTime" label="执行结束时间">
            <template #default="scope">
              {{ formatDate(scope.row.endTime) || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="superintendent" label="负责人">
            <template #default="scope">
              {{ getUserRealName(scope.row.superintendent) || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="executeResult">
            <template #header>
              <div class="executeResult">
                <el-select
                  v-model="queryParams.executeResult"
                  placeholder="执行结果"
                  @change="getList"
                  clearable
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                    <template #default>
                      <i
                        class="options-icon"
                        :style="{
                          background:
                            item.label === '失败' || item.label === '告警' ? '#EB3737' : '#06C21B'
                        }"
                      ></i>
                      {{ item.label }}
                    </template>
                  </el-option>
                </el-select>
              </div>
            </template>
            <template #default="scope">
              <img
                :src="
                  scope.row.executeResult === '成功' || scope.row.executeResult === '失败已处理'
                    ? IconSuccess
                    : scope.row.executeResult === '进行中'
                      ? IconWait
                      : IconFail
                "
                alt=""
              />

              {{ scope.row.executeResult || '--' }}
            </template>
          </el-table-column>

          <el-table-column prop="requestParams" label="接口信息">
            <template #default="scope">
              <span v-if="scope.row.programType === 'DB'">
                {{ scope.row.requestParams || '--' }}</span
              >

              <img
                class="cursor-pointer"
                style="width: 20px"
                @click="handleInterfaceInfoClick(scope.row)"
                src="@/assets/imgs/dashboard/paramsIcon.png"
                alt=""
                v-else
              />
            </template>
          </el-table-column>

          <el-table-column label="操作">
            <template #default="scope">
              <el-button
                type="primary"
                link
                @click="openHandleForm(scope.row)"
                v-if="scope.row.executeResult !== '成功'"
                >处理</el-button
              >
              <span v-if="false">{{ scope.row.program }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="drawerContent" v-if="list.length > 0">
        <flow-chart :list="list" />
      </div>
    </el-drawer>
    <!-- 处理表单 -->
    <HandleForm ref="HandleFormRef" @success="getList" />

    <!-- 表单弹窗：添加/修改 -->
    <ListForm ref="listFormRef" @success="getList" />

    <!-- 接口信息 -->
    <InterfaceInfo ref="interfaceInfoRef" />
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'DashboardForm' })

import * as DashboardApi from '@/api/dashboard'
import IconSuccess from '@/assets/imgs/dashboard/check-circle-fill_success.png'
import IconWait from '@/assets/imgs/dashboard/check-circle-fill_wait.png'
import IconFail from '@/assets/imgs/dashboard/check-circle-fill_fail.png'
import HandleForm from './handleForm.vue'
import ListForm from '@/views/rpaManage/components/ListForm.vue'
import InterfaceInfo from './InterfaceInfo.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

import flowChart from './flowChart.vue'
import * as rpaApi from '@/api/rpaManage'
import { formatDate } from '@/utils/formatTime'
const drawerVisible = ref(false) // 抽屉的是否展示
const timeRange = ref([]) // 时间段
const defaultTimeRange = ref([]) // 默认时间段
const getDefaultDate = () => {
  const today = new Date()
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0) // 今天的 00:00:00
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59) // 今天的 23:59:59
  timeRange.value = [startOfDay, endOfDay]
}

console.log('  timeRange.value', timeRange.value)
/** 筛选条件 */
const queryParams = ref({
  executeResult: undefined,
  skName: undefined,
  groupId: undefined,
  startTime: undefined, //开始时间
  endTime: undefined, //结束时间
  programType: undefined // 程序类型
})

/**重置筛选条件 */
const resetFilter = () => {
  queryParams.value = {
    executeResult: undefined,
    skName: undefined,
    groupId: undefined,
    startTime: undefined, //开始时间
    endTime: undefined, //结束时间
    programType: undefined // 程序类型
  }
}

/** 日期选项 */
const dateOptions = [
  {
    label: '今日',
    value: 'today'
  },
  {
    label: '全部',
    value: 'all'
  }
]

/**筛选执行结果- 选项 */
const options = [
  {
    value: '成功',
    label: '成功'
  },
  {
    value: '失败',
    label: '失败'
  },
  {
    value: '失败已处理',
    label: '失败已处理'
  },
  {
    value: '告警',
    label: '告警'
  }
]

/** 筛选程序- 清空按钮操作 */
const clearskNameFilter = () => {
  queryParams.value.skName = undefined
  getList()
}

/** 打开弹窗 */
const formLoading = ref(false) // 表单的加载中
const open = async (groupId) => {
  // console.log('打开抽屉')
  drawerVisible.value = true
  resetFilter()

  if (groupId) {
    formLoading.value = true
    try {
      queryParams.value.groupId = groupId
      getDefaultDate()
      // await getList()
      await getProgramList(groupId)
      getUserList()
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 流程图数据
const list = ref<any>([])
const getProgramList = async (groupId) => {
  let data = await DashboardApi.getProgramByGroup({ groupId: groupId })
  list.value = data || []
}

// 获取程序执行记录列表数据
const dataList = ref([])
const getList = async () => {
  const data = await DashboardApi.getProgramExecuteRecord(queryParams.value).catch(() => {})
  if (data) {
    dataList.value = data || []
  }
}

/** 处理操作 */
const HandleFormRef = ref()
const openHandleForm = (data) => {
  HandleFormRef.value.open(data)
}

const emit = defineEmits(['close']) // 定义 close 事件，用于关闭弹窗
// 关闭弹窗
const handleDrawerClose = () => {
  drawerVisible.value = false
  emit('close')
}

/** 打开程序编辑面板操作 */
const listFormRef = ref()
const handleProgramClick = (type, row) => {
  console.log('row', row)
  listFormRef.value.open(type, row.programId)
}

// 打开接口信息面板
const interfaceInfoRef = ref()
const handleInterfaceInfoClick = (row) => {
  console.log('row', row)
  const realNames = getUserRealName(row.superintendent)
  console.log('realNames', typeof realNames, realNames)
  interfaceInfoRef.value.open(row, realNames)
}

/** 显示负责人真实姓名 */
const resUserList = ref([])
// 获取用户列表
const getUserList = async () => {
  let data = await rpaApi.getUserList({ page: 1, size: 99999 })
  resUserList.value = data.data
}

// 获取用户真实姓名-数组
const getUserRealName = (superintendents) => {
  if (!superintendents) return '--'
  const superintendentArray = superintendents.split(',')
  return superintendentArray
    .map((superintendent) => {
      const user = resUserList.value.find((item) => item.id === superintendent.trim())
      return user ? user.realName : superintendent
    })
    .join(',')
}

// 监听timeRange
watch(
  () => timeRange.value,
  (newVal) => {
    // console.log('监听数据', newVal)
    if (newVal && newVal.length > 0) {
      const endDate = new Date(newVal[1])
      // 结束时间始终在 23:59:59 结束
      endDate.setHours(23, 59, 59, 0)
      queryParams.value.startTime = formatDate(new Date(newVal[0]))
      queryParams.value.endTime = formatDate(endDate)
    } else {
      queryParams.value.startTime = undefined
      queryParams.value.endTime = undefined
    }
    getList()
  }
)

// 已经选择的程序类型
const programTypeOptions = ref<any>([])

// 程序类型 清空搜索条件
const clearProgramTypeFilter = () => {
  programTypeOptions.value = []
  queryParams.value.programType = undefined
  getList()
}
// 程序类型 筛选条件
const handleProgramTypeFilter = () => {
  queryParams.value.programType = programTypeOptions.value.join(',')
  getList()
}
</script>
<style lang="scss" scoped>
@use '@/styles/eldrawer1.scss';

:deep(.executeResult .el-select__wrapper) {
  background-color: #fff !important;
}
.options-icon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

// 筛选
.filter {
  &-title {
    img {
      vertical-align: middle;
      width: 12px;
      height: 12px;
      margin-right: 5px;
    }
    span {
      vertical-align: middle;
    }
  }
  &-content {
    margin-top: 10px;
    margin-bottom: 10px;
  }
  &-btn {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-item {
      width: 74px;
      height: 32px;
      border-radius: 4px;
    }
  }
}
</style>
