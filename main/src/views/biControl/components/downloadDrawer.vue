<template>
  <SWDrawer v-model="drawerVisible" title="结果下载" @close="reset">
    <div class="content">
      <div class="btn-box">
        <el-button type="primary" @click="getList">
          刷新
        </el-button>
      </div>
      <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
        :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable"
        v-horizontal-scroll="'always'" :border="border" :stripe="stripe">
        <el-table-column label="文件名" prop="fileName" min-width="250"
          :formatter="(row: any) => formatterValue(row, 'fileName', '-')" />
        <el-table-column label="生成时间" prop="createdAt" min-width="180"
          :formatter="(row: any) => formatTime(row.createdAt, 'yyyy-MM-dd HH:mm:ss')" />
        <el-table-column label="状态" prop="status" min-width="150">
          <template v-slot="{ row }">
            <div class="row-center">
              <el-tooltip :content="row.remark" :disabled="[1, 2].includes(Number(row.status)) || !row.remark"
                popper-style="max-width:300px;word-break:break-all">
                <div class="status-tag" :class="'status-tag-' + row.status">{{ Number(row.status) === 1 ?
                  '生成中' : Number(row.status) === 2 ? '已生成' : '生成失败' }}
                </div>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleDownload(row)" v-if="Number(row.status) === 2" :loading="row.loading">下载</el-button>
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
import { downloadByUrl2 } from "@/utils/download";
import { getSysExportDownloadList } from "@/api/biControl/orderQuery/index";
import { debounce } from "lodash-es";
import { useAppStore } from '@/store/modules/app'
const appStore = useAppStore()
const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据

const props = defineProps({
  //.bizType - 字典值
  bizType: {
    type: String,
    required: true
  },
  border: {
    type: Boolean,
    default: false
  },
  stripe: {
    type: Boolean,
    default: false
  }
})
const queryParams = ref({
  page: 1,
  size: 10,
  bizType: ''
})
let timer: any = 0
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

const open = async () => {
  drawerVisible.value = true
  getList()
  timerFunc()
}

/** 查询列表 */
const getList = async (e: any = { showLoading: true }) => {
  if (!(e.showLoading === false)) {
    loading.value = true
  }
  try {
    queryParams.value.bizType = props.bizType
    const data = await getSysExportDownloadList(queryParams.value)
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
const handleDownload = debounce(async (row: any) => {
  try {
    row.loading = true
    await downloadByUrl2(row.url, row.fileName)
  } catch (e) { } finally {
    row.loading = false
  }
}, 1000)

const timerFunc = () => {
  if (timer) {
    clearInterval(timer)
    timer = 0
  }
  timer = setInterval(() => {
    console.log("循环请求")
    getList({ showLoading: false })
  }, 10000)
}

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
    timer = 0
  }
})

defineExpose({
  open
})
</script>
<style lang="scss" scoped>
.content {
  background-color: #fff;
  width: 100%;
  height: calc(100vh - 152px);
  border-radius: 20px;
  padding: 20px;
}

.btn-box {
  margin-bottom: 15px;
  float: right;
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

  &-1 {
    background-color: rgba(0, 100, 255, 0.2);
    color: #0064FF;
  }

  &-2 {
    background-color: rgba(52, 155, 52, 0.2);
    color: #349B34;
  }

  &-3 {
    background-color: #E5E5E5;
    color: #666666;
  }

}
</style>