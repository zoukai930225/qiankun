<template>
  <flux-wrap>
    <!-- 搜索表单 -->
    <template #header>
      <s-w-search-form
        :expand-threshold="3"
        :schema="scheme"
        @search="handleSearch"
        @reset="handleReset"
        auto-search-on-change
      >
        <el-button type="primary" @click="handleZtoUpload">
          <el-icon>
            <Upload />
          </el-icon>
          中通账单上传
        </el-button>
        <el-button type="primary" @click="handleExport"> 导出 </el-button>
        <el-button type="primary" @click="handleResultDownload"> 结果下载 </el-button>
      </s-w-search-form>
    </template>

    <!-- 数据表格 -->
    <s-table
      :fetch-params="searchParams"
      :columns="tableColumns"
      :fetch="getZtoPageList"
      ref="tableRef"
      pagination-teleport="#zto-logistics-bill-footer"
    />
    <template #footer>
      <div id="zto-logistics-bill-footer"></div>
    </template>
  </flux-wrap>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick, defineAsyncComponent } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { FormSchema } from '@/types/form'
import { TableColumn } from '@/components/SWTable/src/table'
import { useDrawer } from '@/hooks/web/useDrawer'
import ImportDataList from './components/importDataList.vue'
import {
  getTargetProvinceAllList,
  getGroupTypeAllList,
  getZtoPageList,
  exportList
} from '@/api/finance/zto'
import download from '@/utils/download'
import dayjs from 'dayjs'
import { useMessage } from '@/hooks/web/useMessage'

const message = useMessage()

// 搜索表单 schema（使用 SWSearchForm 的 FormSchema 定义）
const lastMonthStart = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')
const lastMonthEnd = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD')
const scheme = ref<FormSchema[]>([
  {
    field: 'waybillNumber',
    label: '运单号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入运单号'
    }
  },
  {
    field: 'scanTime',
    label: '扫描时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期'
    },
    value: [lastMonthStart, lastMonthEnd]
  },
  {
    field: 'groupName',
    label: '分组名称',
    component: 'Select',
    componentProps: { placeholder: '请选择分组', options: [], filterable: true }
  },
  {
    field: 'destinationProvince',
    label: '目的地省',
    component: 'Select',
    componentProps: {
      placeholder: '请选择省份',
      options: [],
      multiple: true,
      collapseTags: true,
      filterable: true
    }
  },
  {
    field: 'isMatch',
    label: '是否匹配到店铺',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: [
        { id: 0, label: '否 ', value: '0' },
        { id: 1, label: '是 ', value: '1' }
      ]
    }
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'groupType', label: '分组', minWidth: 100 },
  { prop: 'store', label: '店铺', minWidth: 150 },
  { prop: 'matchMonth', label: '匹配月份', minWidth: 120 },
  { prop: 'matchDataSource', label: '匹配数据源', minWidth: 120 },
  { prop: 'orderStatus', label: '单号状态', minWidth: 120 },
  { prop: 'trackingNumber', label: '运单号', minWidth: 150 },
  { prop: 'packageNo', label: '包号', minWidth: 120 },
  { prop: 'scanTime', label: '扫描时间', minWidth: 180 },
  { prop: 'salesperson', label: '业务员', minWidth: 150 },
  { prop: 'targetProvince', label: '目标地省', minWidth: 120 },
  { prop: 'targetCity', label: '目标地市', minWidth: 120 },
  { prop: 'settlementWeight', label: '结算重量', minWidth: 100 },
  { prop: 'weight', label: '重量', minWidth: 100 },
  { prop: 'waybillIssuance', label: '运单发放', minWidth: 200 },
  { prop: 'mainStore', label: '主店铺', width: 200 },
  { prop: 'waybillDistributionOutlet', label: '运单发放网点', minWidth: 150 },
  { prop: 'zone', label: '分区', minWidth: 100 },
  { prop: 'xinZang', label: '新疆西藏', minWidth: 100 },
  { prop: 'cost', label: '3KG以上费用', minWidth: 120 },
  { prop: 'price', label: '价单', minWidth: 120 }
]

// 响应式数据
interface ZtoBillRow {
  groupType: string
  store: string
  matchMonth: string
  matchDataSource: string
  orderStatus: string
  trackingNumber: string
  packageNo: string
  scanTime: string
  salesperson: string
  targetProvince: string
  targetCity: string
  settlementWeight: number
  weight: number
  waybillIssuance: string
  mainStore: string
  waybillDistributionOutlet: string
  zone: string
  xinZang?: number | string
  cost: number
}
const tableRef = ref()
const searchParams = ref<Record<string, any>>({
  scanTimeStart: lastMonthStart,
  scanTimeEnd: lastMonthEnd
})

// 选项初始化
const initSelectOptions = async () => {
  try {
    const [provinceRes, groupRes] = await Promise.all([
      getTargetProvinceAllList(),
      getGroupTypeAllList()
    ])

    const toOptions = (arr: string[]) =>
      (Array.isArray(arr) ? arr : []).map((s) => ({ label: s, value: s }))

    const provinceOptions = toOptions(provinceRes as unknown as string[])
    const groupOptions = toOptions(groupRes as unknown as string[])

    const provinceSchema = scheme.value.find((s) => s.field === 'destinationProvince')
    if (provinceSchema) {
      provinceSchema.componentProps = {
        ...(provinceSchema.componentProps || {}),
        options: provinceOptions
      }
    }
    const groupSchema = scheme.value.find((s) => s.field === 'groupName')
    if (groupSchema) {
      groupSchema.componentProps = {
        ...(groupSchema.componentProps || {}),
        options: groupOptions
      }
    }
  } catch (error) {
    console.error('初始化下拉选项失败', error)
  }
}

const { openDrawer } = useDrawer()

// 方法
const handleSearch = async (formData: any) => {
  const params: Record<string, any> = { ...formData }
  // 日期范围 -> scanTimeStart/scanTimeEnd
  if (Array.isArray(params.scanTime) && params.scanTime.length === 2) {
    const [start, end] = params.scanTime
    params.scanTimeStart = start
    params.scanTimeEnd = end
    delete params.scanTime
  }
  // 字段映射为后端入参
  if (params.waybillNumber !== undefined) {
    params.trackingNumberLike = params.waybillNumber
    delete params.waybillNumber
  }
  if (params.groupName !== undefined) {
    params.groupType = params.groupName
    delete params.groupName
  }
  if (params.destinationProvince !== undefined) {
    const dest = params.destinationProvince
    params.targetProvince = Array.isArray(dest) ? dest.join(',') : dest
    delete params.destinationProvince
  }
  if (params.isMatch !== undefined) {
    params.isMatch = params.isMatch
  }
  searchParams.value = params
  await nextTick()
  tableRef.value?.refresh?.(true)
}

const handleReset = async () => {
  searchParams.value = {}
  // await nextTick()
  // tableRef.value?.refresh?.(true)
}

const handleZtoUpload = async () => {
  await openDrawer({
    title: '导入中通数据',
    content: ImportDataList,
    showConfirmFooter: false,
    width: 1080
  })
}

const handleResultDownload = async () => {
  openDrawer({
    title: '结果下载',
    content: defineAsyncComponent(() => import('./components/resultDownload.vue')),
    showConfirmFooter: false,
    width: 1000
  })
}

const handleExport = async () => {
  try {
    await exportList({ ...(searchParams.value || {}) })
    message.success('数据下载任务已提交，稍后到「结果下载」列表页下载')
    setTimeout(() => {
      handleResultDownload()
    }, 100)
  } catch (error) {
    // message.error('导出失败')
  }
}

// 使用 SWTable 内置分页，无需手动处理

// 初始化
onMounted(async () => {
  await initSelectOptions()
})
</script>

<style scoped lang="scss">
.content-wrap {
  padding: 20px;
}
</style>
