<template>
  <div class="linkAccountDialog">
    <Dialog
      v-model="dialogVisible"
      :modal-append-to-body="false"
      :title="dialogTitle"
      width="1155px"
      style="
        background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
      "
    >
      <div class="commonTopFilterWrap mt-10px">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="mb-5px"
            label-width="70px"
          >
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="queryParams.name"
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
            <el-form-item label="店铺名称" prop="storeName">
              <el-input
                v-model="queryParams.storeName"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入店铺名称"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="平台" prop="platform">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.platform"
                placeholder="请选择平台"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.LOGIN_ACCOUNT_PLATFORM, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="运行环境" prop="environment">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.environment"
                placeholder="请选择渠道"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM, true)"
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
        <el-table-column label="名称" prop="name" min-width="210">
          <template #default="scope">
            <div class="row">
              {{ scope.row.name || '-' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="平台" prop="platform" show-overflow-tooltip min-width="70">
          <template #default="scope">
            {{ getDictLabel(DICT_TYPE.LOGIN_ACCOUNT_PLATFORM, scope.row.platform) || '' }}
          </template>
        </el-table-column>
        <el-table-column label="环境" prop="environment" width="90">
          <template #default="scope">
            {{ translateEnvironment(scope.row.environment) || '-' }}</template
          >
        </el-table-column>

        <el-table-column
          label="登录地址"
          prop="loginAddress"
          min-width="228"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <a
              :href="scope.row.loginAddress"
              target="_blank"
              class="single-line linkText noUnderlineText"
            >
              {{ scope.row.loginAddress || '-' }}
            </a>
          </template>
        </el-table-column>
        <el-table-column
          label="业务地址"
          prop="serviceAddress"
          min-width="228"
          :show-overflow-tooltip="true"
        >
          <template #default="scope">
            <a
              :href="scope.row.serviceAddress"
              target="_blank"
              class="single-line linkText noUnderlineText"
            >
              {{ scope.row.serviceAddress || '-' }}
            </a>
          </template>
        </el-table-column>
        <el-table-column label="账号" prop="account" show-overflow-tooltip min-width="180">
          <template #default="scope"> {{ scope.row.account || '-' }}</template>
        </el-table-column>

        <el-table-column
          label="密码"
          prop="password"
          min-width="180"
          :show-overflow-tooltip="false"
        >
          <template #default="scope">
            <div v-if="scope.row.password">
              <span v-if="scope.row.showPassword">{{ scope.row.password || '-' }}</span>
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

        <el-table-column label="手机号" prop="phone" min-width="130" />
        <el-table-column label="邮箱" prop="email" min-width="220" />
        <el-table-column label="邮箱授权码" prop="emailAuthCode" min-width="220" />
        <el-table-column label="店铺名称" prop="storeName" min-width="220" />
        <el-table-column label="店铺Code" prop="storeCode" min-width="180" />
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
        <el-table-column label="备注" prop="remark" min-width="80">
          <template #default="scope">
            {{ scope.row.remark || '-' }}
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
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { getCompanyName } from '@/utils/index'
import { Search } from '@element-plus/icons-vue'

import * as platformLoginApi from '@/api/platformLogin'

const appStore = useAppStore()

defineOptions({ name: 'SystemDictTypeForm' })

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const loading = ref(false) // 数据加载是否中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref()
const queryParams = ref({
  typeId: '',
  page: 1,
  size: 10,
  name: '',
  phone: '',
  email: '',
  storeName: '',
  platform: '',
  environment: ''
})

/** 打开弹窗 */
const open = async (typeId?: string) => {
  dialogVisible.value = true
  dialogTitle.value = '关联账号'
  list.value = []
  // console.log('--typeId', typeId);
  queryParams.value.typeId = typeId || ''
  getList()
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

/** 显示与隐藏密码 */
const togglePassword = (row) => {
  row.showPassword = !row.showPassword
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.value.environment = queryParams.value.environment
      ? queryParams.value.environment
      : ''
    queryParams.value.platform = queryParams.value.platform ? queryParams.value.platform : ''
    const data = await platformLoginApi.getPlatformList(queryParams.value).catch(() => {
      loading.value = false
    })
    list.value = data.data || []
    // 给每一项添加一个showPassword属性
    list.value = (data.data || []).map((item) => {
      return {
        ...item,
        showPassword: false
      }
    })
    // console.log('--', list.value)
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

/** 列表数据--根据字典显示运行环境 */
const translateEnvironment = (environment) => {
  const option = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM).find(
    (option) => option.value === environment
  )
  return option ? option.label : environment
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
:deep(.linkAccountDialog .el-dialog) {
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
