<template>
  <SWDrawer v-model="drawerVisible" title="账单上传" @close="reset" :width="1080">
    <div class="content">
      <div class="rule-form">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="66px">
          <el-form-item label="文件名" class="each-form" prop="fileNameLike">
            <el-input class="width-220" v-model.trim="queryParams.fileNameLike" placeholder="请输入文件名" clearable
              @change="searchInput" @keyup.enter="searchInput" @clear="searchInput" />
          </el-form-item>
          <el-form-item label="上传时间" class="each-form" prop="uploadTime">
            <el-date-picker v-model="queryParams.uploadTime" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
              @change="handleQuery" clearable placeholder="请选择" />
            <el-button @click="handleQuery" type="primary" class="ml10px">
              <Icon :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery">
              重置
            </el-button>
            <el-button type="primary" @click="() => getList()">
              刷新
            </el-button>
            <el-button type="primary" @click="openImportDrawer">
              导入圆通数据
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
        row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'" border stripe>
        <el-table-column label="文件名" prop="fileName" min-width="250"
          :formatter="(row: any) => formatterValue(row, 'fileName', '-')" />
        <el-table-column label="上传时间" prop="uploadTime" width="180"
          :formatter="(row: any) => formatTime(row.uploadTime, 'yyyy-MM-dd HH:mm:ss')" />
        <el-table-column label="状态" prop="uploadStatus" width="180">
          <template v-slot="{ row }">
            <div class="row-center">
              <el-tooltip :content="row.remark" :disabled="[1, 2].includes(Number(row.uploadStatus)) || !row.remark"
                popper-style="max-width:300px;word-break:break-all">
                <div class="status-tag"
                  :class="'status-tag-' + getStatusTagType(Number(row.uploadStatus) as ImportStatus)">{{
                    getStatusText(Number(row.uploadStatus) as
                      ImportStatus) }}
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="{ row }">
            <el-button link type="danger" @click="handleDelete(row)" v-if="Number(row.uploadStatus) === 1">删除</el-button
              :loading="row.loading">
            <span v-else>-</span>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex-column" style="align-items: center;">
            <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" />
            <span>暂无数据</span>
          </div>
        </template>
      </el-table>
      <!-- 分页 -->
      <div class="pagination-wrapper">
        <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
          @pagination="getList" />
      </div>
    </div>
    <template #footer>
      <el-button @click="reset" class="mr20px">关闭</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import { formatterValue, formatTime } from "@/utils";
import { recordPageList, deletById } from "@/api/finance/ytoBill/ytBill";
import { debounce } from "lodash-es";
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const queryFormRef = ref<any>() // 查询表单
const message = useMessage()
const queryParams = ref<any>({
  page: 1,
  size: 10,
  fileNameLike: undefined,
  uploadTime: undefined,
})

const emit = defineEmits<{
  (e: 'openUploadDrawer'): void
}>()
const total = ref(0) // 列表的总页数
const drawerVisible = ref(false)
const reset = () => {
  drawerVisible.value = false
  queryParams.value.page = 1
  list.value = []
  total.value = 0
  if (timer) {
    clearInterval(timer)
    timer = 0
  }
}
let timer: any = 0
const open = async () => {
  drawerVisible.value = true
  getList()
  // timerFunc()
}

/** 查询列表 */
const getList = async (showLoading: boolean = true) => {
  if (showLoading) {
    loading.value = true
  }
  try {

    const data = await recordPageList(queryParams.value)
    if (data?.records?.length) {
      list.value = data.records
      total.value = data.total
    } else {
      list.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}
//下载
const handleDelete = debounce(async (row: any) => {
  try {
    await message.delConfirm('将要删除该文件对应的数据，确定要删除？')
  } catch (e) {
    return
  }
  row.loading = true;
  try {
    await deletById(row.id)
    message.success('删除成功')
    getList()
  } catch (error) {
    message.error('删除失败')
  } finally {
    row.loading = false;
  }
}, 1000)

const timerFunc = () => {
  if (timer) {
    clearInterval(timer)
    timer = 0
  }
  timer = setInterval(() => {
    getList(false)
  }, 10000)
}
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

const searchInput = debounce(async () => {
  handleQuery()
}, 1000)

type ImportStatus = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

const getStatusTagType = (status: ImportStatus) => {
  if ([1, 5].includes(status)) return `${status}`;
  if ([2, 4, 7].includes(status)) return `progress`
  return 'err'
}

const getStatusText = (status: ImportStatus) => {
  if (status === 1) return '上传成功'
  if (status === 2) return '数据解析中'
  if (status === 3) return '上传失败'
  if (status === 4) return '匹配中'
  if (status === 5) return '匹配完成'
  if (status === 6) return '匹配失败'
  if (status === 7) return '删除中'
  if (status === 8) return '已删除'
  return '上传失败'
}

const openImportDrawer = () => {
  emit('openUploadDrawer')
}

defineExpose({
  open, getList
})
</script>
<style lang="scss" scoped>
.rule-form {
  & {
    --el-input-inner-height: 30px;
  }

  :deep(.el-form-item__label) {
    padding: 0 10px 0 0;
    display: flex;
    align-items: center;
    height: auto;
    line-height: 17px;
  }

  .each-form {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  :deep(.SWFilterExpandAll-middle-text) {
    color: #666666;
  }

  :deep(.SWFilterExpandAll) {
    margin-bottom: 15px;
  }

  :deep(.el-input) {

    width: 220px !important;
  }


  :deep(.el-input__wrapper) {
    height: 30px;
    padding: 0 11px;
    box-shadow: none;
    border: 1px solid #e5e5e5;

    &:hover {
      box-shadow: none;
      border-color: #0064ff;
    }

    .is-focus {
      box-shadow: none;
      border-color: #0064ff;
    }
  }

  :deep(.el-input__inner) {
    height: 30px;
    line-height: 30px;
  }
}


.content {
  background-color: #fff;
  width: 100%;
  height: calc(100vh - 152px);
  border-radius: 20px;
  padding: 20px;
}

.status-tag {
  display: flex;
  height: 28px;
  border-radius: 100px;
  /* 自动布局 */
  padding: 0 16px;
  font-size: 14px;
  justify-content: center;
  align-items: center;

  &-progress {
    background-color: rgba(0, 100, 255, 0.2);
    color: #0064FF;
  }

  &-1 {
    background-color: rgba(52, 155, 52, 0.2);
    color: #349B34;
  }

  &-err {
    background-color: rgba(235, 55, 55, 0.2);
    color: #EB3737;
  }

  &-5 {
    background-color: rgba(219, 106, 15, 0.2);
    color: #DB6A0F;
  }

  &-8 {
    background-color: #E5E5E5;
    color: #666666;
  }

}
</style>