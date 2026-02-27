<template>
  <div class="linkNodeDialog">
    <Dialog
      v-model="dialogVisible"
      :modal-append-to-body="false"
      :title="dialogTitle"
      width="1155px"
    >
      <div class="commonTopFilterWrap-filter mt-10px" style="margin-bottom: 20px">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px">
            <el-form-item label="节点简称" prop="nickName">
              <el-input
                v-model="queryParams.nickName"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入节点简称"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="影刀登录账号" prop="loginUserName">
              <el-input
                v-model="queryParams.loginUserName"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入影刀登录账号"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="节点类型" prop="type">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.type"
                placeholder="请选择节点类型"
                clearable
                @clear="handleQuery"
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.YINGDAO_NOTE_TYPE, true)"
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
        <el-table-column label="节点简称" prop="nickName" min-width="180" />
        <el-table-column label="影刀登录账户" prop="loginUserName" min-width="220" />
        <el-table-column label="服务器IP" prop="clientIp" min-width="220" />
        <el-table-column label="节点类型" prop="type" min-width="120">
          <template #default="scope">
            {{ getDictLabel(DICT_TYPE.YINGDAO_NOTE_TYPE, scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column label="todesk账号" prop="todeskUserName" min-width="180" />
        <el-table-column
          label="todesk密码"
          prop="todeskPassword"
          min-width="144"
          :show-overflow-tooltip="false"
        >
          <template #default="scope">
            <div v-if="scope.row.todeskPassWord">
              <span v-if="scope.row.showPassword">{{ scope.row.todeskPassWord || '-' }}</span>
              <span v-else>******</span>
              <img
                v-if="scope.row.showPassword"
                src="@/assets/imgs/common/pwd_view.png"
                alt="隐藏密码"
                @click="togglePassword(scope.row)"
                class="icon-view-password"
              />
              <img
                v-else
                src="@/assets/imgs/common/pwd_hide.png"
                alt="显示密码"
                class="icon-view-password"
                @click="togglePassword(scope.row)"
              />
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="240" />
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
import * as NodeManageAccountApi from '@/api/rpaManage/nodeManage'

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
  nickName: '',
  loginUserName: '',
  type: ''
})

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const queryFormRef = ref()
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  dialogTitle.value = '关联节点'
  list.value = []
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await NodeManageAccountApi.getNodeManageList(queryParams.value).catch(() => {
      loading.value = false
    })
    list.value = data.data || []
    total.value = data.total
  } finally {
    loading.value = false
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

/** 显示与隐藏密码 */
const togglePassword = (row) => {
  row.showPassword = !row.showPassword
}

const submitForm = () => {
  emit('select-link-object', selectedRows.value.length > 0 ? selectedRows.value[0] : '')
  dialogVisible.value = false
}

const emit = defineEmits(['select-link-object'])
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
:deep(.linkNodeDialog .el-dialog) {
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
