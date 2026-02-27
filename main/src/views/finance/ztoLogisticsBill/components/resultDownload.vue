<template>
  <div>
    <!-- <s-w-search-form
      :show-search-button="false"
      auto-search-on-change
      :schema="scheme"
      @search="handleSearch"
      @reset="handleReset"
    >
      <el-button type="primary" @click="handleImport">
        <el-icon><Upload /></el-icon>
        导入中通数据
      </el-button>
    </s-w-search-form> -->
    <div class="mb20px row-center" style="justify-content: flex-end;">
      <el-button type="primary" @click="handleSearch">
        刷新
      </el-button>
    </div>
    <!-- 数据表格 -->
    <s-table
      :fetch-params="searchParams"
      :columns="tableColumns"
      :fetch="getZtoExportPageList"
      ref="tableRef"
    >
      <template #status="{ row }">
        <el-tag :type="getStatusTagType(getExportStatus(row))" effect="plain">
          {{ getStatusText(getExportStatus(row)) }}
        </el-tag>
      </template>
      <template #operation="{ row }">
        <el-button v-if="getExportStatus(row) === 2" type="text" @click="handleDownload(row)">
          下载
        </el-button>
      </template>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { FormSchema } from '@/types/form'
import { TableColumn } from '@/components/SWTable/src/table'
import { getZtoExportPageList } from '@/api/finance/zto'
import dayjs from 'dayjs'
import { formatToDateTime } from '@/utils/dateUtil'
import { downloadByUrl as downloadByUrlUtil } from '@/utils/download'

defineOptions({ name: 'ZtoImportDataList' })

const searchParams = ref({
  bizType: 1
})
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
    prop: 'exportTime',
    label: '生成时间',
    minWidth: 180,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ value }) => (dayjs(value).isValid() ? formatToDateTime(value) : '-')
  },
  { prop: 'status', label: '状态', width: 120, align: 'left', headerAlign: 'left' },
  { prop: 'operation', label: '操作', width: 120 }
]

const tableRef = ref()
const handleSearch = async (form: any) => {
  // 使用浅拷贝断开与表单内部 formModel 的引用，避免相互影响导致重复触发
  // searchParams.value = { ...form }
  await nextTick()
  tableRef.value.refresh(false)
}

const handleReset = async () => {
  // 仅重置查询参数，SWSearchForm 在 reset 后会自动触发一次 search
  searchParams.value = {}
}

// 兼容后端字段命名，导出状态：1-生成中 2-生成完成
const getExportStatus = (row: any): number => {
  const status = row?.exportStatus ?? row?.export_status ?? row?.status
  return Number(status) || 0
}

const getStatusTagType = (status: number) => {
  if (status === 2) return 'success'
  if (status === 1) return 'warning'
  return 'info'
}

const getStatusText = (status: number) => {
  if (status === 1) return '生成中'
  if (status === 2) return '生成完成'
  if (status === 3) return '生成失败'
  return '-'
}

const handleDownload = (row: any) => {
  const url = row.fileOssUrl
  if (!url) {
    ElMessage.error('暂无可下载文件')
    return
  }
  const fileName = row?.fileName || '导出结果.xlsx'
  downloadByUrlUtil(url, fileName)
}
</script>

<style scoped lang="scss"></style>
