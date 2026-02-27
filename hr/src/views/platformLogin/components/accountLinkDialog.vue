<template>
  <div>
    <Dialog
      v-model="dialogVisible"
      :modal-append-to-body="false"
      :title="dialogTitle"
      width="1155px"
    >
      <div>
        <div class="commonTopFilterWrap">
          <div class="commonTopFilterWrap-filter">
            <el-form
              ref="queryFormRef"
              :inline="true"
              :model="queryParams"
              class="-mb-15px"
              label-width="68px"
            >
              <el-form-item label="账号" prop="account">
                <el-input
                  v-model="queryParams.account"
                  class="searchFormItemWidth"
                  :prefix-icon="Search"
                  clearable
                  placeholder="请输入账号"
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
                />
              </el-form-item>
              <el-form-item label="手机号" prop="phone">
                <el-input
                  v-model="queryParams.phone"
                  class="searchFormItemWidth"
                  :prefix-icon="Search"
                  clearable
                  placeholder="请输入手机号"
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
                />
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="queryParams.email"
                  class="searchFormItemWidth"
                  :prefix-icon="Search"
                  clearable
                  placeholder="请输入邮箱"
                  @keyup.enter="handleQuery"
                  @clear="handleQuery"
                />
              </el-form-item>
              <el-form-item label="店铺" prop="store">
                <el-select
                  class="searchFormItemWidth"
                  v-model="queryParams.store"
                  placeholder="请选择店铺"
                  clearable
                  @change="handleQuery"
                >
                  <el-option
                    v-for="dict in storeList"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-show="isExpand" label="渠道" prop="channel">
                <el-select
                  class="searchFormItemWidth"
                  v-model="queryParams.channel"
                  placeholder="请选择渠道"
                  clearable
                  @change="handleQuery"
                >
                  <el-option
                    v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
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
        <div style="height: 15px"></div>
        <!-- <SWFilterExpandAll :isExpand="isExpand" @expandClick="isExpand = !isExpand" /> -->
      </div>
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
        <el-table-column label="账号" prop="account" min-width="144" />
        <el-table-column label="密码" prop="password" min-width="100" />
        <el-table-column label="手机号" prop="phone" min-width="144" />
        <el-table-column label="邮箱" prop="email" min-width="220" />
        <el-table-column label="邮箱授权码" prop="emailAuthCode" min-width="200" />
        <el-table-column label="店铺名称" prop="name" min-width="220" />
        <el-table-column label="店铺Code" prop="code" min-width="180" />
        <el-table-column label="公司" prop="company" min-width="100">
          <template #default="scope">
            <div>{{ getCompanyName(scope.row.company) || '' }}</div>
          </template>
        </el-table-column>
        <el-table-column label="渠道" prop="channel" min-width="100">
          <template #default="scope">
            <div>{{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, scope.row.channel) || '' }}</div>
          </template>
        </el-table-column>
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
import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { getCompanyName } from '@/utils/index'
// import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件

import * as LoginAccountApi from '@/api/platformLogin/loginAccount'
import * as StoreApi from '@/api/system/store'

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
  account: '',
  phone: '',
  email: '',
  store: '',
  channel: ''
})

const queryFormRef = ref()
const isExpand = ref(true)
/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = '登录账号管理'
  list.value = []
  getList()
  getStoreList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

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
  try {
    queryParams.value.channel = queryParams.value.channel ? queryParams.value.channel : ''
    queryParams.value.store = queryParams.value.store ? queryParams.value.store : ''
    const data = await LoginAccountApi.getLoginAccountList(queryParams.value).catch(() => {
      loading.value = false
    })
    list.value = data.data || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const storeList = ref<any[]>([])
const getStoreList = async () => {
  storeList.value = []
  const data = await StoreApi.getStorePage({ page: 1, size: 99999 }).catch(() => {})
  if (data) {
    storeList.value = []
    data.data.forEach((item) => {
      storeList.value.push({ value: item.code, label: item.name })
    })
  }
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
  /* min-height: 50vh; */
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
