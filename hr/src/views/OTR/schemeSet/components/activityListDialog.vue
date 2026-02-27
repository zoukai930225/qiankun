<template>
  <div>
    <Dialog class="activityDialog" v-model="dialogVisible" :title="dialogTitle">
      <div>
        <div class="commonTopFilterWrap">
          <div class="commonTopFilterWrap-filter">
            <el-form
              ref="queryFormRef"
              :inline="true"
              :model="queryParams"
              label-width="78px"
              @submit.prevent
            >
              <el-form-item label="活动名称" prop="keyWord">
                <el-input
                  v-model="queryParams.keyWord"
                  class="searchFormItemWidth"
                  :prefix-icon="Search"
                  clearable
                  placeholder="请输入活动名称"
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
        <!-- 列表 -->
        <el-table
          :header-cell-style="appStore.headerCellStyle"
          v-loading="loading"
          :data="list"
          :show-overflow-tooltip="true"
          row-class-name="commonTableRow"
          class="SWCommonTable"
          v-horizontal-scroll="'always'"
        >
          <el-table-column label="活动名称" prop="actName" min-width="200">
            <template #default="scope">
              {{ scope.row.actName }}
            </template>
          </el-table-column>
          <el-table-column label="活动状态" prop="status" min-width="200">
            <template #default="scope">
              {{ getStatusName(scope.row.status) }}
            </template>
          </el-table-column>
          <el-table-column label="所属年度" prop="actYear" min-width="200">
            <template #default="scope">
              {{ scope.row.actYear }}
            </template>
          </el-table-column>
          <el-table-column label="活动时间" prop="beginTime" min-width="200">
            <template #default="scope">
              {{ scope.row.beginTime }}至{{ scope.row.endTime }}
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <Pagination
          v-model:limit="queryParams.size"
          v-model:page="queryParams.page"
          :total="total"
          @pagination="getList"
        />
      </div>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import * as OtrSchemeSetApi from '@/api/otr/schemeSet/index'

const appStore = useAppStore()

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0)
const queryParams = ref({
  size: 10,
  page: 1,
  keyWord: ''
})
const queryFormRef = ref() // 搜索的表单

//状态
// 1-绿色 初始化
// 2-蓝色 评价中
// 3-黄色 问卷关闭
// 4-紫色 校准中
// 5-灰色 活动结束
const getStatusName = (type) => {
  switch (type) {
    case 1: //'初始化'
      return '初始化'
    case 2: //'评价中'
      return '评价中'
    case 3: //'问卷关闭'
      return '问卷关闭'
    case 4: //'校准中'
      return '校准中'
    case 5: //'活动结束'
      return '活动结束'
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await OtrSchemeSetApi.getActivelyById(planId.value, queryParams.value).catch(
      (err: {}) => {
        console.log(err)
      }
    )
    list.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
dialogTitle.value = '已关联活动'
const planId = ref('')

/** 打开弹窗 */
const open = async (id: string) => {
  planId.value = id
  dialogVisible.value = true
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
:deep(.el-dialog.activityDialog) {
  width: 880px !important;
  width: 880px !important;
  margin: 0 auto;
  margin-top: 15vh;
  position: relative;
  top: auto;
  left: auto;
  transform: none;
}
:deep(.com-dialog .el-dialog__body) {
  padding: 15px !important;
}
</style>
