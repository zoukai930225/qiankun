<template>
  <!-- 列表 -->
  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="-mb-15px"
            label-width="78px"
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
            <SWFilterAdd
              class="commonAddBtn"
              :list="addList"
              :current-code="currentAddCode"
              @add-btn-click="addBtnClick"
            />
          </div>
        </div>
      </div>
      <div style="height: 15px"></div>
      <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
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
      <el-table-column label="账号" prop="account" min-width="144" />
      <el-table-column label="密码" prop="password" min-width="144" :show-overflow-tooltip="false">
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
      <el-table-column label="手机号" prop="phone" min-width="144" />
      <el-table-column label="邮箱" prop="email" min-width="220">
        <template #default="scope">
          <div style="color: #0064ff">{{ scope.row.email }}</div>
        </template>
      </el-table-column>
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
      <el-table-column label="备注" prop="remark" min-width="240" />

      <el-table-column
        label="操作按钮"
        :show-overflow-tooltip="false"
        width="150"
        align="center"
        fixed="right"
      >
        <template #default="scope">
          <el-button type="primary" @click="openForm('view', scope.row.id)" link> 查看 </el-button>
          <el-button type="primary" @click="openForm('update', scope.row.id)" link>
            编辑
          </el-button>
          <el-button type="danger" @click="handleDelete(scope.row.id)" link> 删除 </el-button>
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

    <AddDrawer ref="addDrawerRef" @success="getList" />
  </ContentWrap>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { getCompanyName } from '@/utils/index'
import AddDrawer from './components/addDrawer.vue'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件

import * as LoginAccountApi from '@/api/platformLogin/loginAccount'
import * as StoreApi from '@/api/system/store'

const appStore = useAppStore()

defineOptions({ name: 'LoginAccountManager' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据
const queryParams = reactive({
  page: 1,
  size: 10,
  account: '',
  phone: '',
  email: '',
  store: '',
  channel: ''
})
const isExpand = ref(false) // 是否展开
const queryFormRef = ref() // 搜索的表单
const addDrawerRef = ref()
const addList = ref([
  {
    label: '新增',
    code: 'add'
  }
])
// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openForm('create', '')
    }
  }
}

const openForm = (type: string, id?: string) => {
  if (addDrawerRef.value) {
    addDrawerRef.value.open(type, id)
  }
}

/** 查询字典类型列表 */
const getList = async () => {
  loading.value = true
  try {
    queryParams.channel = queryParams.channel ? queryParams.channel : ''
    queryParams.store = queryParams.store ? queryParams.store : ''

    const data = await LoginAccountApi.getLoginAccountList(queryParams).catch(() => {
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

/** 显示与隐藏密码 */
const togglePassword = (row) => {
  row.showPassword = !row.showPassword
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
/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await LoginAccountApi.deleteLoginAccount(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
  getStoreList()
})
</script>

<style lang="scss" scoped>
// 密码显示隐藏
.icon-view-password {
  cursor: pointer;
  margin-left: 5px;
  vertical-align: middle;
}
</style>
