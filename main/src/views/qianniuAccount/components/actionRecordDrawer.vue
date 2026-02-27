<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="968"
    >
      <!-- <div>
        <div class="drawerTitle">
          <div>{{ currentRow.account }}</div>
          <div @click="drawerVisible = false"
            ><el-icon> <CloseBold /> </el-icon
          ></div>
        </div>
      </div> -->

      <el-tabs v-model="activeName">
        <el-tab-pane label="操作记录" name="1">
          <div class="commonTopFilterWrap packageCostMaintenanceTopFilter actionRecordTopFilter">
            <div class="commonTopFilterWrap-filter">
              <el-form ref="queryFormRef" inline :model="queryParams" @submit.prevent="handleQuery">
                <el-form-item label="操作时间" prop="timeRange">
                  <el-date-picker
                    v-model="timeRange"
                    type="datetimerange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="YYYY-MM-DD HH:mm"
                    value-format="YYYY-MM-DD HH:mm"
                    clearable
                    @change="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="操作权限点" prop="permissionName">
                  <el-input
                    style="width: 200px"
                    :prefix-icon="Search"
                    v-model="queryParams.permissionName"
                    placeholder="请输入操作权限点"
                    clearable
                    @clear="handleQuery"
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
              </el-form>
            </div>
          </div>
          <el-table
            class="SWCommonTable"
            :header-cell-style="{
              backgroundColor: '#F2F6FC',
              fontWeight: '500',
              height: '44px'
            }"
            :data="list"
            width="100%"
            :show-overflow-tooltip="false"
            v-loading="loading"
            v-horizontal-scroll="'always'"
          >
            <el-table-column prop="operatorUserNick" label="操作账户" align="center" />
            <el-table-column prop="logTime" label="操作时间" align="center" />
            <el-table-column prop="permissionName" label="操作权限点" align="center" />
            <el-table-column prop="context" label="操作内容" align="center" />
          </el-table>
          <Pagination
            v-model:limit="queryParams.size"
            v-model:page="queryParams.page"
            :total="total"
            @pagination="getList"
          />
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'ActionRecordDrawer' })
import { Search } from '@element-plus/icons-vue'
const drawerVisible = ref(false) // 弹窗的是否展示
import { formatDate } from '@/utils/formatTime'
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
import * as qianniuAccountApi from '@/api/qianniuAccount'
const loading = ref(false) // 列表的加载中
const timeRange = ref([]) // 操作时间
const currentRow = ref<any>({}) // 当前行数据
const queryFormRef = ref() // 查询表单
const queryParams = ref({
  page: 1,
  size: 10,
  nick: '',
  startTime: '',
  endTime: '',
  permissionName: ''
})

const resetQuery = () => {
  queryParams.value = {
    page: 1,
    size: 10,
    nick: '',
    startTime: '',
    endTime: '',
    permissionName: ''
  }
  timeRange.value = []
  queryFormRef.value?.resetFields()
}
const total = ref(0) // 总条数

const activeName = ref('1')
/** 打开弹窗 */
const open = async (row: any) => {
  drawerVisible.value = true
  formLoading.value = true
  resetQuery()
  try {
    // currentRow.value = row
    queryParams.value.nick = row.nick || ''
    getList()
  } finally {
    formLoading.value = false
  }
}

const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 查询列表 */
const list = ref<any[]>([])
const getList = async () => {
  loading.value = true

  try {
    let params = JSON.parse(JSON.stringify(queryParams.value))
    if (timeRange.value && timeRange.value.length > 0) {
      params.startTime = formatDate(timeRange.value[0], 'YYYY-MM-DD HH:mm')
      params.endTime = formatDate(timeRange.value[1], 'YYYY-MM-DD HH:mm')
    }

    const data = await qianniuAccountApi.getHighRiskLog(params).catch(() => {})
    if (data) {
      list.value = data.records || []
      total.value = data.total || 0
    }
  } finally {
    loading.value = false
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
// 隐藏el-tabs的底部线
:deep(.el-tabs__nav-wrap:after) {
  display: none;
}
:deep(.el-input__wrapper) {
  // box-shadow: 0px 0px 0px 1px #e5e5e5 ;
}
:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}
.actionRecordTopFilter {
  background-color: #fff;
  padding: 20px 20px 0 20px;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

// 背景颜色
:deep(.el-drawer__body){
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
  // margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px 20px 20px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
