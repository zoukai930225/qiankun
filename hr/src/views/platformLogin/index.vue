<template>
  <div class="wrapper"> </div>
  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="mb-5px"
            label-width="78px"
          >
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="queryParams.name"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入名称"
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
            <el-form-item v-show="isExpand" label="平台" prop="platform">
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
            <el-form-item v-show="isExpand" label="运行环境" prop="environment">
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
            <SWFilterAdd
              class="commonAddBtn"
              :list="addList"
              :current-code="currentAddCode"
              @add-btn-click="addBtnClick"
            />
          </div>
        </div>
      </div>
      <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
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
      <el-table-column label="名称" prop="name" min-width="210">
        <template #default="scope">
          <div class="row">
            {{ scope.row.name || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="平台" prop="platform" show-overflow-tooltip min-width="80">
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

      <el-table-column label="密码" prop="password" min-width="180" :show-overflow-tooltip="false">
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
      <el-table-column label="操作按钮" :show-overflow-tooltip="false" fixed="right" width="150">
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
    <div class="pagination-wrapper">
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>
  </ContentWrap>
  <!-- 表单抽屉 -->
  <DrawerAddInfo ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
defineOptions({ name: 'PlatformLogin' })
import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import DrawerAddInfo from './components/DrawerAddInfo.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { getCompanyName } from '@/utils/index'
import * as platformLoginApi from '@/api/platformLogin'

const appStore = useAppStore()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  name: '',
  phone: '',
  email: '',
  storeName: '',
  platform: '',
  environment: ''
})
const queryFormRef = ref() // 搜索的表单
const isExpand = ref(false) // 是否展开

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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id)
  }
}

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
    queryParams.value.environment = queryParams.value.environment
      ? queryParams.value.environment
      : ''
    queryParams.value.platform = queryParams.value.platform ? queryParams.value.platform : ''
    const data = await platformLoginApi.getPlatformList(queryParams.value).catch(() => {})
    // 给每一项添加一个showPassword属性
    list.value = (data.data || []).map((item) => {
      return {
        ...item,
        showPassword: false
      }
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 显示与隐藏密码 */
const togglePassword = (row) => {
  row.showPassword = !row.showPassword
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await platformLoginApi.deletePlatform(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 列表数据--根据字典显示运行环境 */
const translateEnvironment = (environment) => {
  const option = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM).find(
    (option) => option.value === environment
  )
  return option ? option.label : environment
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.test-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  width: 100%;
  height: 100%;
  // padding: 11px;
  box-sizing: border-box;
  // background-color: #f2f6fc;
  background-color: #fff;
}
.header-wrapper {
  background-color: #fff;
  padding: 16px 20px;
  box-sizing: border-box;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  &-title {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 0 0 16px 0;
  }
}
// 密码显示隐藏
.icon-view-password {
  cursor: pointer;
  margin-left: 5px;
  vertical-align: middle;
}
.pagination-wrapper {
  width: 100%;
  padding: 0 12px;
  box-sizing: border-box;
  height: 60px;
  background-color: #fff;
  // position: fixed;
  // bottom: 0;
  // padding:0 11px;
}
.topStatics {
  padding-left: 16px;
  height: 48px;
  margin-bottom: 16px;
  background: #ecf5ff;
  &-title {
    font-size: 14px;
    color: #333;
    padding-right: 16px;
  }
  &-value {
    font-size: 16px;
    font-weight: 600;
    pointer-events: none;
    color: #126efe;
  }
  &-space {
    width: 44px;
  }
}
</style>
