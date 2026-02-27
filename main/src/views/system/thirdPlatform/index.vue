<template>
  <!-- 搜索 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="88px"
        >
          <el-form-item label="三方平台：" prop="platform">
            <el-select
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.platform"
              placeholder="请选择三方平台"
              clearable
              @clear="handleQuery"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_THIRD_PLATFORM)"
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
  </ContentWrap>
  <ContentWrap>
    <el-table
      :border="true"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="三方平台" prop="platformName" min-width="120" />
      <el-table-column label="应用ID" prop="appId" width="150">
        <template #default="scope">
          <div v-if="scope.row.platform === 'wdt'">
            {{ (scope.row.configInfo && scope.row.configInfo['sid']) || '-' }}
          </div>
          <div v-else>
            {{ scope.row.appId || '-' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="应用秘钥" prop="appSecret" min-width="150" />
      <el-table-column label="服务请求地址" prop="serverUrl" min-width="200" />
      <el-table-column label="授权回调地址" prop="redirectUri" min-width="200" />
      <el-table-column label="授权码" prop="authCode" min-width="200" />
      <el-table-column label="访问令牌" prop="accessToken" min-width="200" />
      <el-table-column label="访问令牌失效时长s" prop="expiresIn" min-width="150" />
      <el-table-column
        label="访问令牌失效时间"
        prop="expiresInTime"
        :formatter="dateFormatter"
        min-width="180"
      />
      <el-table-column label="刷新令牌" prop="refreshToken" min-width="200" />
      <el-table-column label="刷新令牌失效时长s" prop="reExpiresIn" min-width="150" />
      <el-table-column
        label="刷新令牌失效时间"
        prop="reExpiresInTime"
        :formatter="dateFormatter"
        min-width="180"
      />
      <el-table-column label="状态" align="center" key="status" width="100">
        <template #default="scope">
          <div class="row-center">
            <SWSwitch
              style="margin-left: auto; margin-right: auto"
              v-model="scope.row.status"
              active-text="启用"
              inactive-text="禁用"
              :active-value="1"
              :inactive-value="0"
              @change="switchChange(scope.row.id, scope.row.status)"
          /></div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="scope">
          <div class="row-center">
            <el-button
              v-if="scope.row.platform === 'alipay'"
              link
              type="primary"
              @click="openSeller(scope.row.platform)"
            >
              商户
            </el-button>
            <el-button v-else link type="primary" style="opacity: 0"> 商户 </el-button>
            <el-button link type="primary" @click="openForm('update', scope.row.id)">
              修改
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 添加或修改对话框 -->
  <AddOrUpdateForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import { dateFormatter } from '@/utils/formatTime'
import SWSwitch from '@/components/SWBaseComponent/SWSwitch/index.vue'
import * as ThirdPlatformApi from '@/api/system/thirdPlatform'
import AddOrUpdateForm from './addOrUpdateForm.vue'
import { Search } from '@element-plus/icons-vue'

defineOptions({ name: 'SystemThirdPlatform' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const router = useRouter()

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<ThirdPlatformApi.ThirdPlatformConfigVO[]>([]) // 列表的数
const queryParams = reactive({
  page: 1,
  size: 10,
  platform: ''
})
const queryFormRef = ref() // 搜索的表单
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
      openForm('create')
    }
  }
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ThirdPlatformApi.getThirdPlatformConfigPage(queryParams)
    list.value = data.data
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
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

/**
 * 添加商户信息
 */
const openSeller = (platform: string) => {
  router.push({
    name: 'ThirdPlatformSeller',
    params: {
      platform
    }
  })
}

/**
 * 状态发生变化
 */
const switchChange = async (id, status) => {
  const statusText = status === 1 ? '禁用' : '启用'
  const content = `是否${statusText}该数据？`
  const successText = `${statusText}成功`
  try {
    // 状态的二次确认
    await message.confirm(content)
    const updateStatus = status === 1 ? 0 : 1
    await ThirdPlatformApi.updateThirdPlatformConfigStatus(id, updateStatus)
    message.success(successText)
    // 刷新列表
    await getList()
  } catch {}
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ThirdPlatformApi.deleteThirdPlatformConfig(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
