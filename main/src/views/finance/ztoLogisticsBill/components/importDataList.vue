<template>
  <div>
    <s-w-search-form
      :show-search-button="false"
      auto-search-on-change
      :schema="scheme"
      @search="handleSearch"
      @reset="handleReset"
    >
      <el-button type="primary" @click="refresh">
        刷新
      </el-button>
      <el-button type="primary" @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入中通数据
      </el-button>
    </s-w-search-form>

    <!-- 数据表格 -->
    <s-table
      :fetch-params="searchParams"
      :columns="tableColumns"
      :fetch="getZtoImportRecordList"
      ref="tableRef"
    >
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(row.uploadStatus)" effect="plain">
          {{ getStatusText(row.uploadStatus) }}
        </el-tag>
      </template>
      <template #operation="{ row }">
        <el-button v-if="row.uploadStatus === 5" type="text" @click="handleMatch(row)"
          >重新匹配</el-button
        >
      </template>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { FormSchema } from '@/types/form'
import { TableColumn } from '@/components/SWTable/src/table'
import { useDialog } from '@/hooks/web/useDialog'
import { getZtoImportRecordList, dataMatch } from '@/api/finance/zto'
import dayjs from 'dayjs'
import { formatToDateTime } from '@/utils/dateUtil'
import { useMessage } from '@/hooks/web/useMessage'

const { openDialog } = useDialog()

defineOptions({ name: 'ZtoImportDataList' })

const message = useMessage()

const searchParams = ref({})
// 搜索表单配置
const scheme = ref<FormSchema[]>([
  {
    field: 'fileNameLike',
    label: '文件名',
    component: 'Input',
    componentProps: { placeholder: '请输入文件名' }
  },
  {
    field: 'uploadTime',
    label: '上传时间',
    component: 'DatePicker',
    componentProps: {
      type: 'date',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      placeholder: '请选择日期'
    }
  }
])

// 表格列配置
const tableColumns: TableColumn[] = [
  { prop: 'fileName', label: '文件名', minWidth: 180, align: 'left', headerAlign: 'left' },
  {
    prop: 'uploadTime',
    label: '上传时间',
    minWidth: 180,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ value }) => (dayjs(value).isValid() ? formatToDateTime(value) : '-')
  },
  { prop: 'status', label: '状态', width: 120, align: 'left', headerAlign: 'left' },
  { prop: 'operation', label: '操作', width: 120 }
]

type ImportStatus = 1 | 2 | 3 | 4 | 5
interface ImportDataRow {
  id: number
  fileName: string
  uploadTime: string
  status: ImportStatus
}

// 示例数据
const mockData: ImportDataRow[] = [
  {
    id: 1,
    fileName: '总secretworld官方旗舰店6月账单79519.99元.xlsx',
    uploadTime: '2025-06-07 10:10:10',
    status: 1
  },
  {
    id: 2,
    fileName: '店铺账单_2025-06-07.xlsx',
    uploadTime: '2025-06-07 10:10:12',
    status: 2
  },
  {
    id: 3,
    fileName: '店铺账单_2025-06-07_错误示例.xlsx',
    uploadTime: '2025-06-07 10:10:15',
    status: 3
  }
]

const tableData = ref<ImportDataRow[]>([])
const tableRef = ref()
const handleSearch = async (form: any) => {
  // 使用浅拷贝断开与表单内部 formModel 的引用，避免相互影响导致重复触发
  searchParams.value = { ...form }
  await nextTick()
  tableRef.value.refresh(true)
}

const handleReset = async () => {
  // 仅重置查询参数，SWSearchForm 在 reset 后会自动触发一次 search
  searchParams.value = {}
}

const handleImport = () => {
  openDialog({
    title: '中通数据上传',
    content: defineAsyncComponent(() => import('./upload.vue')),
    width: '600px',
    closeOnClickModal: false,
    props: {
      onUploaded: () => {
        tableRef.value?.refresh?.(true)
      }
    }
  })
}

const handleMatch = async (row: ImportDataRow) => {
  try {
    await message.confirm(`确认对 ${row.fileName} 发起数据匹配？`, '数据匹配确认')
  } catch (e) {
    return
  }
  try {
    await dataMatch({ id: row.id })
    ElMessage.success('已发起数据匹配')
    tableRef.value?.refresh?.(true)
  } catch (error) {
    ElMessage.error('数据匹配失败')
  }
}

const getStatusTagType = (status: ImportStatus) => {
  if (status === 1) return 'success'
  if (status === 2) return 'info'
  if (status === 4) return 'warning'
  if (status === 5) return 'success'
  return 'danger'
}

const getStatusText = (status: ImportStatus) => {
  if (status === 1) return '上传成功'
  if (status === 2) return '数据解析中'
  if (status === 3) return '上传失败'
  if (status === 4) return '匹配中'
  if (status === 5) return '匹配完成'
  if (status === 6) return '匹配失败'
  return '上传失败'
}

const refresh = ()=>{
  tableRef.value?.refresh?.(false)
}

onMounted(() => {
  tableData.value = mockData
})
</script>

<style scoped lang="scss"></style>
