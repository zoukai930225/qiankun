<template>
  <!-- 列表 -->
  <div style="">
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="70px"
        >
          <el-form-item label="店铺名称" prop="storeName">
            <el-input
              v-model="queryParams.storeName"
              class="searchFormItemWidth"
              :prefix-icon="Search"
              clearable
              placeholder="请输入"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="店铺编码" prop="storeCode">
            <el-input
              v-model="queryParams.storeCode"
              class="searchFormItemWidth"
              :prefix-icon="Search"
              clearable
              placeholder="请输入"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="登录账号" prop="account">
            <el-input
              v-model="queryParams.account"
              class="searchFormItemWidth"
              :prefix-icon="Search"
              clearable
              placeholder="请输入"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="节点" prop="loginUserName">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.loginUserName"
              placeholder="请选择"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="dict in nodeList"
                :key="dict.loginUserName"
                :label="dict.loginUserName"
                :value="dict.loginUserName"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.status"
              placeholder="请选择"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_STATUS, true)"
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
          <SWFilterAdd
            class="commonAddBtn"
            :list="addList"
            :current-code="currentAddCode"
            :loading="refreshLoading"
            @add-btn-click="addBtnClick"
          />
        </div>
      </div>
    </div>

    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      class="SWCommonTable"
      style="margin-top: 20px"
      :show-overflow-tooltip="true"
      v-horizontal-scroll="'always'"
      row-class-name="commonTableRow"
    >
      <el-table-column label="店铺名称" prop="storeName" min-width="150" />
      <el-table-column label="店铺编码" prop="storeCode" min-width="150" />
      <el-table-column label="登录平台名称" prop="loginPlatform" min-width="110">
        <template #default="scope">
          {{ getDictLabel(DICT_TYPE.LOGIN_ACCOUNT_PLATFORM, scope.row.loginPlatform) }}
        </template>
      </el-table-column>
      <el-table-column label="登录账号" prop="account" />
      <el-table-column label="节点" prop="loginUserName" min-width="150" />

      <!-- 统一登录应用UUID -->
      <el-table-column label="浏览器" prop="browser">
        <template #default="scope">
          {{ getDictLabel(DICT_TYPE.YINGDAO_BROWSER, scope.row.browser) }}
        </template>
      </el-table-column>
      <el-table-column label="运行环境" prop="runEnvironment" width="90">
        <template #default="scope">
          {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_PROGRAM, scope.row.runEnvironment) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" width="170">
        <template #default="scope">
          {{ formatDate(new Date(scope.row.createdAt)) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status">
        <template #default="scope">
          <div v-if="scope.row.status === 'enable'">
            <img src="@/assets/imgs/rpaManage/status_success.png" alt="" />
            {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_STATUS, scope.row.status) }}
          </div>
          <div v-else-if="scope.row.status === 'disable'">
            <img src="@/assets/imgs/rpaManage/status_disabled.png" alt="" />
            {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_STATUS, scope.row.status) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作按钮"
        :show-overflow-tooltip="false"
        width="150"
        align="center"
        fixed="right"
      >
        <template #default="scope">
          <el-button type="primary" @click="openViewConfig(scope.row)" link> 查看参数 </el-button>
          <el-button type="primary" @click="openAddStore('update', scope.row.id)" link>
            编辑
          </el-button>
          <!-- <el-button type="danger" @click="handleDelete(scope.row.id)" link> 删除 </el-button> -->
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

    <!-- 新增/编辑弹窗 -->
    <AddStore ref="addStoreRef" @success="getList" />
  </div>
  <!-- 查看参数弹窗 -->
  <div v-if="isListVisible" style="margin: 50px 0; padding-top: 20px; width: 100%">
    <viewConfig
      ref="viewConfigRef"
      :id="viewConfigTypeId"
      :storeCode="viewConfigStoreCode"
      :isInline="true"
      v-if="viewConfigTypeId"
    />
  </div>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import AddStore from './addStore.vue'
import viewConfig from '../../../components/viewConfig_inline.vue'
import * as rpaApi from '@/api/rpaManage'
import { ref } from 'vue'
import { formatDate } from '@/utils/formatTime'
import * as NodeManageAccountApi from '@/api/rpaManage/nodeManage'
const appStore = useAppStore()

defineOptions({ name: 'StoreMng' })

const props = defineProps({
  typeId: {
    type: String,
    default: ''
  }
})

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据
const queryParams = reactive({
  page: 1,
  size: 10,
  typeId: props.typeId,
  storeName: '',
  storeCode: '',
  account: '',
  loginUserName: '',
  status: ''
})
const queryFormRef = ref() // 搜索的表单
const addDrawerRef = ref()
const refreshLoading = ref(false)
const addList = ref([
  {
    label: '新增店铺',
    code: 'add'
  }
])
// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = async (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openAddStore('create', undefined)
    }
  }
}

const openForm = (type: string, id?: string) => {
  if (addDrawerRef.value) {
    addDrawerRef.value.open(type, id)
  }
}

// 查看参数
const isListVisible = ref(false)
const viewConfigRef = ref('')
const viewConfigStoreCode = ref('')
const viewConfigTypeId = ref('')
const openViewConfig = (row) => {
  isListVisible.value = true
  viewConfigTypeId.value = row.typeId
  viewConfigStoreCode.value = row.storeCode
  console.log('查看参数log', row)
}

// 监听props.typeId变化
watch(
  () => props.typeId,
  (newVal) => {
    queryParams.typeId = newVal
    handleQuery()
  }
)

// 在每次打开抽屉的时候给viewConfigId赋空值
const clearViewConfigId = () => {
  viewConfigTypeId.value = ''
}

defineExpose({
  clearViewConfigId
})

// 打开新增弹窗
const addStoreRef = ref()
const openAddStore = (type: string, id?: string) => {
  if (addStoreRef.value) {
    isListVisible.value = false
    addStoreRef.value.open(type, props.typeId, id)
  }
}

/** 查询字典类型列表 */
const getList = async () => {
  loading.value = true
  isListVisible.value = false
  try {
    const data = await rpaApi.getSelectedShopList(queryParams).catch(() => {
      loading.value = false
    })
    list.value = data.records || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}
const nodeList = ref([])
const getNodeManageList = async () => {
  const data = await NodeManageAccountApi.getNodeManageList({ page: 1, size: 99999 }).catch(
    () => {}
  )
  nodeList.value = data.data || []
}

/** 初始化 **/
onMounted(() => {
  getList()
  getNodeManageList()
})
</script>

<style lang="scss" scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 10px;
}

// 密码显示隐藏
.icon-view-password {
  cursor: pointer;
  margin-left: 5px;
  vertical-align: middle;
}
</style>
