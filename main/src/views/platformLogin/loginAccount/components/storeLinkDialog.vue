<template>
  <div>
    <Dialog
      v-model="dialogVisible"
      :modal-append-to-body="false"
      :title="dialogTitle"
      width="1155px"
    >
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="-mb-15px"
            label-width="78px"
          >
            <el-form-item label="店铺名称:" prop="name">
              <el-input
                v-model="queryParams.name"
                :prefix-icon="Search"
                class="searchFormItemWidth"
                clearable
                placeholder="请输入店铺名称"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="渠道:" prop="channel">
              <SelectChannels
                v-model="queryParams.channel"
                @clear="handleQuery"
                @change="handleQuery"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
          </div>
        </div>
      </div>
      <div style="height: 10px"></div>
      <el-table
        ref="selectTableRef"
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column label="店铺名称" prop="name" min-width="180" />
        <el-table-column label="店铺Code" prop="code" min-width="180" />
        <el-table-column label="公司" prop="companyName" min-width="120" />
        <el-table-column label="渠道" prop="channelName" min-width="120" />
        <el-table-column
          label="创建时间"
          prop="createdAt"
          min-width="170"
          :formatter="dateFormatter"
        />
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <Pagination
          style="margin-right: 20px"
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.size"
          @pagination="getList"
      /></div>
      <template #footer>
        <div style="margin-right: 33px; padding-bottom: 20px">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button></div
        >
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { dateFormatter } from '@/utils/formatTime'
import { useAppStore } from '@/store/modules/app'
import * as StoreApi from '@/api/system/store/index'
import { SelectChannels } from '@/components/SelectChannels/index'

const appStore = useAppStore()

defineOptions({ name: 'SystemDictTypeForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const loading = ref(false) // 数据加载是否中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  name: '',
  channel: ''
})

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = '店铺管理'
  list.value = []
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const queryFormRef = ref()
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  // 各公司在职人员数
  const data = await StoreApi.getStorePage(queryParams.value).catch(() => {
    loading.value = false
  })
  loading.value = false
  list.value = data.data || []
  total.value = data.total
}

const selectTableRef = ref()
const selectedRows = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  if (val.length > 1) {
    // 只保留最新选择的项
    selectTableRef.value.clearSelection()
    selectTableRef.value.toggleRowSelection(val[val.length - 1])
    selectedRows.value = [val[val.length - 1]]
  } else {
    selectedRows.value = val
  }
}
const submitForm = () => {
  emit('selectLinkObject', selectedRows.value.length > 0 ? selectedRows.value[0] : '')
  dialogVisible.value = false
}

const emit = defineEmits(['selectLinkObject'])
</script>

<style lang="scss" scoped>
.pagination {
  height: 60px;
  background: #fff;
  width: calc(100%);
  // position: absolute;
  // right: 0;
  // bottom: 0px;
  z-index: 99;
  border-radius: 14px;
}
</style>

<style scoped>
:deep(.el-dialog) {
  padding: 0px;
  background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}
:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  max-height: 70vh;
}
:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
:deep(.CommonSearchForm) {
  border-bottom: none;
}
</style>
