<template>
  <!-- 搜索 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="账号" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入账号"
          clearable
          @keyup.enter="handleQuery"
          @clear="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
          @clear="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
          重置
        </el-button>
        <!-- <el-button @click="handleQuery"><Icon icon="ep:search" />搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button> -->
        <el-button type="primary" @click="openForm()"> <Icon icon="ep:plus" /> 添加用户 </el-button>
      </el-form-item>
    </el-form>
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
      <el-table-column label="账号" prop="username" min-width="120" />
      <el-table-column label="姓名" prop="realName" min-width="90" />
      <el-table-column label="手机号码" prop="phone" min-width="120" />
      <el-table-column label="性别" align="center" key="sex" width="100">
        <template #default="scope">
          <span style="color: #126efe"> {{ UserSexName(scope.row.sex) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="邮箱" prop="email" min-width="180" />
      <el-table-column label="企业" prop="companyName" min-width="120" />
      <el-table-column label="岗位" prop="postName" min-width="120" />
      <el-table-column label="部门" prop="departmentName" min-width="120" />
      <el-table-column label="是否负责人" align="center" key="isLeader" width="100">
        <template #default="scope">
          <span style="color: #126efe"> {{ CommonYesOrNoName(scope.row.isLeader) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="createTime"
        :formatter="dateFormatter"
        min-width="180"
      />
      <el-table-column label="操作" align="center" fixed="right" width="90">
        <template #default="scope">
          <div class="row-center">
            <el-button link type="primary" @click="cancelAuthorize(scope.row)">
              取消授权
            </el-button>
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

  <!-- 添加用户对话框 -->
  <AddUserForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { CommonYesOrNoName, UserSexName } from '@/types/enumOptions'
import { dateFormatter } from '@/utils/formatTime'
import * as UserApi from '@/api/system/user'
import AddUserForm from './components/addUser.vue'

defineOptions({ name: 'PermissionUsers' })

const message = useMessage() // 消息弹窗
const route = useRoute() // 路由

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<UserApi.UserVO[]>([]) // 列表的数
const queryParams = reactive({
  page: 1,
  size: 10,
  permissionId: route.params.id as string,
  userName: undefined,
  realName: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getUserPage(queryParams)
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
const openForm = () => {
  formRef.value.open(queryParams.permissionId)
}

/** 取消授权按钮操作 */
const cancelAuthorize = async (row: UserApi.UserVO) => {
  try {
    // 删除的二次确认
    await message.delConfirm(`确认要取消该用户${row.username}的权限吗？`, '系统提示')
    // 发起删除
    await UserApi.userPermissionRemove(row.id as string, queryParams.permissionId)
    message.success('取消授权成功')
    // 刷新列表
    await getList()
  } catch {}
}
/** 初始化 */
onMounted(() => {
  getList()
})
</script>
