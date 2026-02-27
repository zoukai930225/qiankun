<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      @close="handleDrawerClose"
      :size="968"
    >
      <div>
        <div class="drawerTitle">
          <div>
            任务组合
            <el-popover placement="top-start" title="颜色说明" :width="390" trigger="hover">
              <template #reference>
                <el-icon><QuestionFilled /></el-icon>
              </template>
              <div>
                <div class="d-flex">
                  <p class="color-explain color-red-icon mr-2"></p>
                  红色：表示有执行失败任务
                </div>
                <div class="d-flex">
                  <p class="color-explain color-yellow-icon mr-2"></p>
                  黄色：表示任务状态为告警
                </div>
                <div class="d-flex">
                  <p class="color-explain color-green-icon mr-2"></p>
                  绿色：表示任务执行抓取数据成功，且数据校验通过
                </div>
                <div class="d-flex">
                  <p class="color-explain color-blue-icon mr-2"></p>
                  蓝色：表示任务执行抓取数据成功，但数据校验未通过
                </div>
                <div class="d-flex">
                  <p class="color-explain color-gray-icon mr-2"></p>
                  灰色：表示任务未执行
                </div>
              </div>
            </el-popover>
          </div>

          <img
            src="@/assets/imgs/dashboard/programGroup/close1.png"
            alt=""
            @click="handleDrawerClose"
          />
        </div>
      </div>
      <div v-if="loading" class="loading-placeholder">
        <el-icon class="is-loading"><Loading /></el-icon>
        加载中...
      </div>
      <div v-else-if="Object.keys(categorizedList).length > 0">
        <div class="drawerContent" v-for="(items, type) in categorizedList" :key="type">
          <div class="drawerContent-title">
            <div>
              <span class="mr-30px" style="color: #333; font-weight: 600">梯队{{ type }}</span>
              <el-form ref="form" :model="teamForm" v-if="type !== '1'" style="height: 32px" inline>
                <el-form-item label="触发类型" prop="echelonExecuteType">
                  <el-select
                    class="searchFormItemWidth"
                    v-model="teamForm[type].echelonExecuteType"
                    placeholder="请选择"
                    clearable
                    value-on-clear=""
                    style="width: 200px"
                    disabled
                  >
                    <el-option
                      v-for="dict in getIntDictOptions(
                        DICT_TYPE.TASK_PROGRAM_TWOECHELON_EXECUTE_TYPE,
                        true
                      )"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="执行时间"
                  prop="echelonExecuteCron"
                  v-if="teamForm[type].echelonExecuteType === '1'"
                >
                  <el-input
                    v-model="teamForm[type].echelonExecuteCron"
                    clearable
                    placeholder="请输入执行时间"
                    style="width: 200px"
                    disabled
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="team-table-wrapper">
            <s-table
              class="team-table"
              :columns="teamTableColumns"
              :data="items"
              :show-pagination="false"
              :loading="loading"
              header-align="center"
              align="center"
              :cell-style="tableCellStyle"
            />
          </div>
        </div>
      </div>

      <el-empty v-else description="暂无数据" />
    </el-drawer>
    <DashboardForm class="Dashboard-form" ref="DashboardFormRef" />
  </div>
</template>

<script lang="tsx" setup>
defineOptions({ name: 'AddTask' })
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as rpaApi from '@/api/rpaManage'
import DashboardForm from './dashboardForm.vue'
import type { TableColumn } from '@/components/SWTable/src/table'
import { CSSProperties, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawerVisible = ref(false) // 弹窗的是否展示

const formLoading = ref(false) // 表单的加载中
type TeamFormItem = {
  echelonExecuteType: string
  echelonExecuteCron: string
}
type TeamFormMap = Record<string, TeamFormItem>
const teamForm = ref<TeamFormMap>({}) // 弹窗的表单数据
const createEmptyTeamFormItem = (): TeamFormItem => ({
  echelonExecuteType: '',
  echelonExecuteCron: ''
})

const ensureTeamFormKey = (key: string) => {
  if (!teamForm.value[key]) {
    teamForm.value[key] = createEmptyTeamFormItem()
  }
}

const toEchelonKey = (value: string | number | undefined | null) => {
  if (value === undefined || value === null || value === '') return ''
  return String(value)
}

// 初始化teamForm的结构
const initializeTeamForm = (echelons: Array<string | number | undefined>) => {
  echelons.forEach((echelon) => {
    const key = toEchelonKey(echelon)
    if (key) {
      ensureTeamFormKey(key)
    }
  })
}

type ProgramRow = {
  id?: string | number
  echelon?: string | number
  statusColor?: string
} & Record<string, any>
const DEFAULT_DISPLAY = '-'
const statusColorTextMap: Record<string, string> = {
  红色: '失败',
  绿色: '成功',
  黄色: '告警',
  灰色: '未执行',
  蓝色: '校验未过'
}

const resolveAppStatus = (row: ProgramRow) => {
  if (row.executionStatus === 'enable') return '启用'
  if (row.executionStatus === 'disable') return '禁用'
  return DEFAULT_DISPLAY
}

/** 打开程序执行记录 */
const DashboardFormRef = ref()
const openDashboard = (item: ProgramRow) => {
  if (DashboardFormRef.value) {
    DashboardFormRef.value.open(item.id)
  }
}

/** 跳转到监控数据页面 */
const handleJumpToMonitor = (row: ProgramRow) => {
  router.push({
    path: '/admin/mc/admin/dashboard/dataMonitor',
    query: {
      serviceName: row.name, // 传递应用名称
      serviceType: '0' // 固定传递服务类型 0
    }
  })
}

// 颜色映射配置 (纯文案)
const statusColorMap: Record<string, { text: string }> = {
  红色: { text: '失败' },
  绿色: { text: '成功' },
  蓝色: { text: '数据校验未过' },
  黄色: { text: '告警' },
  灰色: { text: '未执行' }
}

// ------------------- 背景色逻辑 START -------------------
// 背景色值映射
const bgColorMap: Record<string, string> = {
  蓝色: '#cce0ff',
  绿色: '#d6ebd6',
  红色: '#e15a51',
  黄色: 'rgba(218, 158, 36, 0.19)',
  灰色: 'rgb(222, 223, 224)'
}

// el-table 的 cell-style 回调
// 注意：s-table 透传时，row 和 column 是核心参数
const tableCellStyle = ({ row, column }: { row: ProgramRow; column: any }): CSSProperties => {
  // 1. 如果没有状态颜色，或者状态颜色不在我们的定义中，直接返回
  if (!row.statusColor || !bgColorMap[row.statusColor]) {
    return {}
  }

  // 2. 判断是否是目标列
  // 这里使用 column.property 来匹配列的 prop 字段
  // 需要匹配的列是 'latestExecuteStatus' (最新执行状态) 和 'dataCheck' (数据校验)
  if (column.property === 'latestExecuteStatus' || column.property === 'dataCheck') {
    return {
      backgroundColor: bgColorMap[row.statusColor]
      // 如果需要文字颜色变动，也可以在这里加 color: 'xxx'
    }
  }

  return {}
}
// ------------------- 背景色逻辑 END -------------------

const teamTableColumns = ref<TableColumn[]>([
  {
    prop: 'name',
    label: '应用名称',
    minWidth: 220,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'executionTime',
    label: '执行时间',
    minWidth: 160
  },
  {
    prop: 'appStatus',
    label: '应用状态',
    minWidth: 100,
    customRender: ({ row }) => <span>{resolveAppStatus(row)}</span>
  },
  {
    prop: 'latestExecuteStatus',
    label: '最新执行状态',
    minWidth: 140,
    // 修改：这里只负责显示文字，背景色由 cell-style 接管
    customRender: ({ row }) => {
      if (!row.statusColor) return DEFAULT_DISPLAY
      const colorConfig = statusColorMap[row.statusColor]
      const text = colorConfig ? colorConfig.text : row.statusColor
      return <span>{text}</span>
    }
  },
  {
    prop: 'dataCheck',
    label: '数据校验',
    minWidth: 120,
    // 修改：这里只负责显示文字，背景色由 cell-style 接管
    customRender: ({ row }) => {
      if (row.checkFlag === 1) {
        return <span>通过</span>
      } else {
        // 校验未通过，显示链接
        return (
          <el-link type="danger" underline={false} onClick={() => handleJumpToMonitor(row)}>
            未通过
          </el-link>
        )
      }
    }
  },
  {
    prop: 'operation',
    label: '操作',
    width: 100,
    fixed: 'right',
    customRender: ({ row }) => {
      return (
        <el-button type="primary" link onClick={() => openDashboard(row)}>
          执行详情
        </el-button>
      )
    }
  }
])

const taskIdSave = ref('') // 任务ID

// 查询数据
const loading = ref(false) // 加载中
const list = ref<ProgramRow[]>([]) // 数据
const categorizedList = ref<Record<string, ProgramRow[]>>({}) // 按照 梯队序号 分类的数据

const getList = async () => {
  loading.value = true
  try {
    const data = await rpaApi.getProgramGroupListByTaskId({ taskId: taskIdSave.value })
    list.value = data || []

    // 获取所有echelon值，用于初始化teamForm
    const echelons = [...new Set(list.value.map((item) => item.echelon))]
    initializeTeamForm(echelons)

    // 按照 梯队序号 分类
    categorizedList.value = list.value.reduce<Record<string, ProgramRow[]>>((acc, item) => {
      const key = toEchelonKey(item.echelon)
      if (!key) {
        return acc
      }
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push({ ...item })

      ensureTeamFormKey(key)
      if (key !== '1') {
        teamForm.value[key].echelonExecuteType = item.echelonExecuteType || ''
        teamForm.value[key].echelonExecuteCron = item.echelonExecuteCron || ''
      }

      return acc
    }, {})
  } finally {
    loading.value = false
  }
}
const yPositionSave = ref(0) // 卡片位置
/** 打开弹窗 */
const open = async (taskId?: string, yPosition: number = 0) => {
  drawerVisible.value = true
  yPositionSave.value = yPosition
  // 清空数据
  list.value = []
  taskIdSave.value = ''
  categorizedList.value = {}
  teamForm.value = {}

  if (taskId) {
    taskIdSave.value = taskId
    formLoading.value = true
    try {
      await getList()
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success'])

// 关闭弹窗
const handleDrawerClose = () => {
  drawerVisible.value = false
  emit('success', yPositionSave.value)
}
</script>

<style lang="scss" scoped>
// 加载中的效果
.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 422px;
}
:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}
// 背景
:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}
.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
  &-title {
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
}
.team-table-wrapper {
  width: 100%;
}
.team-table {
  :deep(.el-table__header th) {
    background-color: #f7f1dc;
    color: #8b6a12;
    font-weight: 600;
  }
}

.d-flex {
  display: flex;
  align-items: center;
}
.color-explain {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.color-red-icon {
  background: #e15a51;
}
.color-yellow-icon {
  background: #edb135;
}
.color-green-icon {
  background: #1aac2e;
}
.color-gray-icon {
  background: #999f9e;
}
.color-blue-icon {
  background: var(--el-color-primary);
}
</style>
