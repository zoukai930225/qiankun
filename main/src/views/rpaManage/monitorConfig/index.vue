<template>
  <content-wrap>
    <s-w-search-form
      :schema="schema"
      @search="onSearch"
      @reset="onReset"
      auto-search-on-change
      :show-expand="false"
    >
      <el-button class="ml-32px" type="primary" :icon="Plus" @click="() => handleEditOrCreate()"
        >新增</el-button
      >
    </s-w-search-form>
    <s-table ref="tableRef" :columns="columns" :fetch="getPage" :fetch-params="fetchParams" />
  </content-wrap>
</template>
<script lang="tsx" setup>
import { FormSchema } from '@/types/form'
import { TableColumn } from '@/components/SWTable/src/table'
import { ref, onMounted, nextTick, defineAsyncComponent } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getPage, del, getSeven } from '@/api/rpaManage/dataMonitor'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { getProgramTypeList } from '@/api/rpaManage/programType' // 类型
import { getApplicationListNew } from '@/api/rpaManage' // 实例
import { useMessage } from '@/hooks/web/useMessage'
import { useDrawer } from '@/hooks/web/useDrawer'
import LineChart from './components/lineChart.vue'
import { useRpaDashboardStore } from '@/store/modules/rpaDashboard'
import { useUserStore } from '@/store/modules/user'
import * as rpaApi from '@/api/rpaManage'

defineOptions({ name: 'rpaManageMonitorConfig' })
const message = useMessage()

const rpaDashboardData = useRpaDashboardStore()
const userStore = useUserStore()

function formatXAxisLabel(value: string | number): string {
  const text = String(value)
  if (/^\d{4}[-\/]/.test(text)) {
    return text.replace(/^\d{4}[-\/]?/, '')
  }
  if (/^\d{8,}$/.test(text)) {
    return text.slice(4)
  }
  return text
}
// 定义查询参数接口
interface FetchParams {
  name?: string | number
  eg?: string | number
  dataName?: string
  userId?: string | number
  typeCategory?: string // 新增类型类别参数
  [key: string]: any
}
const tableRef = ref()

const schema = ref<FormSchema[]>([
  {
    field: 'userId',
    component: 'Select',
    label: '负责人',
    value: userStore.user.id,
    componentProps: {
      filterable: true,
      clearable: true,
      options: rpaDashboardData.resUserList.map((dict: any) => ({
        label: dict.realName,
        value: dict.id
      }))
    }
  },
  {
    field: 'dataName',
    component: 'Input',
    label: '监控数据名称'
  },
  {
    field: 'name',
    component: 'Select',
    label: '应用类型',
    componentProps: {
      filterable: true,
      options: [],
      onChange: (value: any) => {
        // 当选择了应用类型时，禁用应用实例
        if (value) {
          schema.value[3].componentProps!.disabled = true
        } else {
          schema.value[3].componentProps!.disabled = false
        }
      }
    }
  },
  {
    field: 'eg',
    component: 'Select',
    label: '应用实例',
    componentProps: {
      filterable: true,
      options: [],
      onChange: (value: any) => {
        // 当选择了应用实例时，禁用应用类型
        if (value) {
          schema.value[2].componentProps!.disabled = true
        } else {
          schema.value[2].componentProps!.disabled = false
        }
      }
    }
  }
])

const fetchParams = ref<FetchParams>({
  typeCategory: 'RPA', // 添加固定参数
  userId: userStore.user.id
})
const columns = ref<TableColumn[]>([
  // 应用名称和应用编码，展示就展示应用名称，鼠标悬停 有个气泡提示，提示里把名称和编码 一起展示，两行
  // 文本左对齐 数字右对齐
  {
    prop: 'typeName',
    label: '应用名称',
    minWidth: 350,
    fixed: 'left',
    headerAlign: 'left',
    align: 'left',
    showOverflowTooltip: false,
    customRender: ({ row }) => {
      return (
        <el-tooltip placement="top">
          {{
            default: () => {
              return <span class="text1">{row.typeName || row.serviceCode}</span>
            },
            content: () => {
              return (
                <div>
                  <div>{row.serviceCode}</div>
                  <div>{row.typeName}</div>
                </div>
              )
            }
          }}
        </el-tooltip>
      )
    }
  },
  // {
  //   prop: 'serviceCode',
  //   label: '应用编码',
  //   minWidth: 350
  // },
  {
    prop: 'queryStoreField',
    label: '查询店铺列',
    minWidth: 200,
    fixed: 'left',
    headerAlign: 'left',
    align: 'left'
  },
  {
    prop: 'indicatorsFiled',
    label: '指标列',
    minWidth: 120,
    fixed: 'left',
    headerAlign: 'left',
    align: 'left'
  },
  {
    prop: 'indicators',
    label: '阈值',
    minWidth: 120,
    fixed: 'left',
    headerAlign: 'right',
    align: 'right',
    customRender: ({ row }) => {
      return (
        <el-tooltip placement="bottom">
          {{
            default: () => {
              return <span>{row.indicators}</span>
            },
            content: () => {
              const raw = row?.data
              let dataObj: Record<string, any> = {}
              if (raw) {
                if (typeof raw === 'string') {
                  try {
                    dataObj = JSON.parse(raw)
                  } catch (e) {
                    dataObj = {}
                  }
                } else {
                  dataObj = raw as Record<string, any>
                }
              }
              const xDataRaw = Object.keys(dataObj).sort()
              const yData = xDataRaw.map((k) => Number(dataObj[k] ?? 0))
              const xData = xDataRaw.map((k) => formatXAxisLabel(k))
              return <LineChart xData={xData} yData={yData} />
            }
          }}
        </el-tooltip>
      )
    }
  },
  {
    prop: 'cron',
    label: 'CRON表达式',
    minWidth: 130,
    headerAlign: 'left',
    align: 'left',
    customRender: ({ row }) => {
      return (
        <div>
          <div>{row.executionTime}</div>
          <div>{row.executionTimeStr}</div>
        </div>
      )
    }
  },
  {
    prop: 'dataName',
    label: '监控数据名称',
    minWidth: 250,
    headerAlign: 'left',
    align: 'left'
  },
  {
    prop: 'serviceType',
    label: '服务类型',
    minWidth: 120,
    customRender: ({ value }) => {
      return getDictLabel(DICT_TYPE.DATA_CHECK_SERVICE_TYPE, value)
    },
    headerAlign: 'left',
    align: 'left'
  },

  {
    prop: 'queryDateField',
    label: '查询时间列（字符串）',
    minWidth: 180,
    headerAlign: 'left',
    align: 'left'
  },
  {
    prop: 'queryDateTimeField',
    label: '查询时间列（时间类型）',
    minWidth: 180,
    headerAlign: 'left',
    align: 'left'
  },

  {
    prop: 'extWhereFiled',
    label: '查询扩展列',
    minWidth: 120,
    headerAlign: 'left',
    align: 'left'
  },

  {
    prop: 'businessTable',
    label: '业务表',
    minWidth: 220,
    headerAlign: 'left',
    align: 'left'
  },
  {
    prop: 'type',
    label: '统计类型',
    minWidth: 120,
    customRender: ({ value }) => {
      return getDictLabel(DICT_TYPE.DATA_CHECK_TYPE, value)
    },
    headerAlign: 'left',
    align: 'left'
  },
  {
    prop: 'dataBaseType',
    label: '数据库类型',
    minWidth: 120,
    customRender: ({ value }) => {
      return getDictLabel(DICT_TYPE.CHECK_DATA_BASE_TYPE, value)
    },
    headerAlign: 'left',
    align: 'left'
  },
  {
    prop: 'checkYesterdayOrToday',
    label: '查询时间',
    minWidth: 120,
    customRender: ({ value }) => {
      return getDictLabel(DICT_TYPE.CHECK_DATA_DATE, value)
    },
    headerAlign: 'left',
    align: 'left'
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: 260,
    showOverflowTooltip: false,
    customRender: ({ row }) => {
      return (
        <div>
          <el-button type="primary" link onClick={() => handleCopy(row)}>
            复制
          </el-button>
          <el-button type="primary" link onClick={() => handleEditOrCreate(row)}>
            编辑
          </el-button>
          <el-button type="primary" link onClick={() => handleGenerate7DayData(row)}>
            生成7日数据
          </el-button>
          <el-button type="danger" link onClick={() => handleDelete(row)}>
            删除
          </el-button>
        </div>
      )
    }
  }
])

async function onSearch(val: FetchParams) {
  const { name, eg, dataName, userId } = val
  fetchParams.value = {
    dataName,
    serviceCode: eg || name,
    userId,
    typeCategory: 'RPA' // 确保搜索时也保留该固定参数
  }
  await nextTick()
  tableRef.value?.refresh(true)
}

function onReset() {
  if (schema.value[2]?.componentProps) {
    schema.value[2].componentProps.disabled = false
  }
  if (schema.value[3]?.componentProps) {
    schema.value[3].componentProps.disabled = false
  }
  fetchParams.value = {
    typeCategory: 'RPA',
    userId: userStore.user.id
  }
}

// 处理编辑成功事件
function handleEditSuccess() {
  // 刷新表格数据
  tableRef.value?.refresh()
}

// 通用打开抽屉函数
function openMonitorDrawer(mode: 'create' | 'edit' | 'copy', row?: any) {
  const { openDrawer } = useDrawer()
  const title = mode === 'copy' ? '复制' : row ? '编辑' : '新增'
  const props: Record<string, any> = {}
  if (row?.id) props.id = row.id
  if (mode === 'copy') props.mode = 'copy'

  openDrawer({
    title,
    content: defineAsyncComponent(() => import('./components/edit.vue')),
    confirmText: '提交',
    cancelText: '取消',
    showConfirmFooter: true,
    props,
    onSuccess: () => {
      handleEditSuccess()
    }
  })
}

// 处理编辑/新增操作
function handleEditOrCreate(row?: any) {
  openMonitorDrawer(row ? 'edit' : 'create', row)
}

// 处理复制操作
function handleCopy(row: any) {
  openMonitorDrawer('copy', row)
}

async function handleGenerate7DayData(row: any) {
  try {
    const res = await getSeven(row.id)
    message.success('生成7日数据成功')
    await nextTick()
    tableRef.value?.refresh()
  } catch (error) {
    console.error('生成7日数据失败:', error)
    // message.error('生成7日数据失败')
  }
}

// 处理删除操作
function handleDelete(row: any) {
  message
    .confirm('确认删除该监控配置吗？', '警告')
    .then(async () => {
      try {
        await del(row.id)
        message.success('删除成功')
        // 刷新表格数据
        tableRef.value?.refresh()
      } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败')
      }
    })
    .catch(() => {
      // 用户取消删除操作
    })
}

async function getSearchOptions() {
  try {
    const typeResult = await getProgramTypeList({ page: 1, pageSize: 99999 })
    const appResult = await getApplicationListNew({ page: 1, pageSize: 99999 })

    const typeList = typeResult?.records || []
    const appList = appResult?.records || []

    schema.value[2].componentProps!.options = typeList.map((item: any) => ({
      label: item.typeName || '',
      value: item.typeCode || ''
    }))

    schema.value[3].componentProps!.options = appList.map((item: any) => ({
      label: item.name || '',
      value: item.code || ''
    }))
  } catch (error) {
    console.error('Error fetching options:', error)
    message.error('获取下拉选项失败')
    schema.value[2].componentProps!.options = []
    schema.value[3].componentProps!.options = []
  }
}

// 获取负责人列表并设置下拉
async function getUserList() {
  try {
    const data = await rpaApi.getUserList({ page: 1, size: 99999 })
    rpaDashboardData.resUserList = data.data || []
    schema.value[0].componentProps!.options = rpaDashboardData.resUserList.map((dict: any) => ({
      label: dict.realName,
      value: dict.id
    }))
  } catch (error) {
    console.error('获取负责人失败:', error)
    schema.value[0].componentProps!.options = []
  }
}

onMounted(() => {
  getSearchOptions()
  getUserList()
})
</script>
<style scoped lang="scss"></style>
