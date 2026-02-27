<template>
  <!-- 列表 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="100px"
        >
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
        prop="todeskPassWord"
        min-width="180"
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
      <!-- 统一登录应用UUID -->
      <el-table-column label="统一登录应用UUID" prop="yingyongUuid" min-width="180" />
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
import AddDrawer from './components/addDrawer.vue'

import * as NodeManageAccountApi from '@/api/rpaManage/nodeManage'
import { ref } from 'vue'

const appStore = useAppStore()

defineOptions({ name: 'RpaNodeManage' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据
const queryParams = reactive({
  page: 1,
  size: 10,
  type: '',
  loginUserName: '',
  nickName: ''
})
const queryFormRef = ref() // 搜索的表单
const addDrawerRef = ref()
const refreshLoading = ref(false)
const addList = ref([
  {
    label: '新增',
    code: 'add'
  },
  {
    label: '同步企业节点',
    code: 'syncData'
  }
])
// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = async (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openForm('create', '')
    } else if (currentAddCode.value === 'syncData') {
      // 同步企业节点
      refreshLoading.value = true
      await NodeManageAccountApi.refreshNodeManage().catch(() => {
        refreshLoading.value = false
      })
      getList()
      refreshLoading.value = false
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
    const data = await NodeManageAccountApi.getNodeManageList(queryParams).catch(() => {
      loading.value = false
    })
    if (data.data) {
      // 给每一项添加一个showPassword属性
      list.value = (data.data || []).map((item) => {
        return {
          ...item,
          showPassword: false
        }
      })
      total.value = data.total
    }
  } finally {
    loading.value = false
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
    await NodeManageAccountApi.deleteNodeManage(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
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
