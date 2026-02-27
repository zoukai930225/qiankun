<template>
  <!-- 搜索 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="账户/姓名" prop="userNameAndRealName">
            <el-input
              v-model="queryParams.userNameAndRealName"
              placeholder="请输入账户/姓名"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
              :prefix-icon="Search"
              class="searchFormItemWidth"
            />
          </el-form-item>
          <el-form-item label="部门" prop="dept">
            <el-cascader
              v-model="departmentArr"
              class="searchFormItemWidth"
              filterable
              clearable
              placeholder="请选择部门"
              :props="customProps"
              :options="departmentTreeData"
            />
          </el-form-item>
          <el-form-item label="店铺" prop="store">
            <StoreRangePlus
              v-model="queryParams.store"
              @change="handleQuery"
              placeholder="请选择店铺"
              :showAllChannels="false"
              clearable
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-input
              :model-value="roleName"
              placeholder="请选择角色"
              clearable
              :prefix-icon="Search"
              class="searchFormItemWidth"
              @click.stop="openRoleRange"
              @clear="handleRoleClear"
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
          <!-- <SWFilterAdd
            class="commonAddBtn"
            :list="addList"
            :current-code="currentAddCode"
            @add-btn-click="addBtnClick"
          /> -->
        </div>
      </div>
    </div>
    <div class="form">
      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        row-class-name="commonTableRow"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column label="账户" prop="userName" min-width="120" />
        <el-table-column label="姓名" prop="realName" min-width="90" />
        <el-table-column label="部门" prop="dept" min-width="120" />
        <el-table-column label="企业" prop="company" min-width="120" />
        <el-table-column label="店铺权限" prop="storeCount" min-width="120">
          <template #default="{ row }">
            {{ row.storeCount }}
          </template>
        </el-table-column>
        <el-table-column label="角色权限" prop="roleCount" min-width="120">
          <template #default="{ row }">
            {{ row.roleCount }}
          </template>
        </el-table-column>
        <el-table-column label="账户类型" prop="accountType" min-width="120">
          <template #default="{ row }">
            <span class="tag" :class="row.accountType === '1' ? 'feishu' : 'sys'">
              {{ row.accountType === '1' ? '飞书账户' : '系统账户' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="left" fixed="right" width="120">
          <template #default="scope">
            <div class="row-center">
              <el-button
                class="editBtn"
                link
                type="primary"
                @click="openEditForm('update', scope.row.userId, scope.row.accountType)"
              >
                编辑
              </el-button>
              <el-button class="delBtn" link type="danger" @click="handleDelete(scope.row.userId)">
                删除
              </el-button>
              <!-- <el-dropdown @command="(command) => handleCommand(command, scope.row)">
                <div style="color: #409eff; font-size: 14px; font-weight: 500; cursor: pointer">
                  更多
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="handleDelete">
                      <Icon icon="ep:delete" />删除
                    </el-dropdown-item>
                    <el-dropdown-item command="handleResetPwd">
                      <Icon icon="ep:key" />重置密码
                    </el-dropdown-item>
                    <el-dropdown-item command="handlePermission">
                      <Icon icon="ep:circle-check" />分配权限
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </ContentWrap>

  <!-- 添加或修改用户对话框 -->
  <UserForm ref="formRef" @success="getList" />
  <!-- 分配权限 -->
  <UserAssignPermissionForm ref="assignPermissionFormRef" @success="getList" />

  <!-- 编辑页面 -->
  <editForm ref="editFormRef" @success="getList" />

  <!-- 角色选择 -->
  <RoleRange ref="roleRangeRef" @submit="onRoleRangeUseSubmit" />
</template>
<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
// import { dateFormatter } from '@/utils/formatTime'
// import download from '@/utils/download'
import * as UserApi from '@/api/system/user'
import UserForm from './UserForm.vue'
import UserAssignPermissionForm from './UserAssignPermissionForm.vue'
import editForm from './components/editDrawer.vue'
import * as DeptApi from '@/api/system/dept'
const appStore = useAppStore()
defineOptions({ name: 'SystemUser' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 列表的数
const queryParams = reactive({
  page: 1,
  pageSize: 10,
  userNameAndRealName: '',
  dept: '',
  store: '',
  role: ''
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

// 部门树
const customProps = {
  label: 'name',
  value: 'name',
  children: 'children',
  checkStrictly: true
}
const departmentTreeData = ref<any>([]) // 部门树形数据
const departmentLoading = ref(false)
const departmentArr = ref<any>([])
const getDepartmentTree = async () => {
  departmentLoading.value = true
  try {
    const data = await DeptApi.getAllDeptTree()
    departmentTreeData.value = data || []
  } finally {
    departmentLoading.value = false
  }
}

watch(departmentArr, (val) => {
  if (val && val.length > 0) {
    //  将选择的val的最后一个值赋值给queryParams.dept
    queryParams.dept = val[val.length - 1]
    getList()
  } else {
    // 清空选择
    queryParams.dept = ''
    getList()
  }
})

// 维护权限
const roleRangeRef = ref()
const openRoleRange = () => {
  roleRangeRef.value?.open(roleSelect.value, '', true)
}
const roleName = ref()
const roleSelect = ref([])
const onRoleRangeUseSubmit = async (val) => {
  if (val.checkList.length) {
    console.log(val.checkList)
    roleSelect.value = val.checkList
    queryParams.role = val.checkList[0].id
    roleName.value = `${val.checkList[0].name}-${val.checkList[0].channelName}`
  } else {
    queryParams.role = ''
    roleName.value = ''
    roleSelect.value = []
  }
  getList()
}
const handleRoleClear = () => {
  queryParams.role = ''
  roleName.value = ''
  roleSelect.value = []
  getList()
}
// 编辑页面
const editFormRef = ref()
const openEditForm = (type, id, accountType) => {
  if (type === 'update') {
    editFormRef.value?.open(type, id, accountType)
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getUserList(queryParams)
    list.value = data.records
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
  departmentArr.value = []
  roleName.value = ''
  roleSelect.value = []
  handleQuery()
}
/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

/** 操作分发 */
// const handleCommand = (command: string, row: UserApi.UserVO) => {
//   switch (command) {
//     case 'handleDelete':
//       handleDelete(row.id as string)
//       break
//     case 'handleResetPwd':
//       handleResetPwd(row)
//       break
//     case 'handlePermission':
//       handlePermission(row)
//       break
//     default:
//       break
//   }
// }

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await UserApi.deleteUser(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 重置密码 */
// const handleResetPwd = async (row: UserApi.UserVO) => {
//   try {
//     // 重置的二次确认
//     const result = await message.prompt(
//       '请输入"' + row.userName + '"的新密码',
//       t('common.reminder')
//     )
//     const password = result.value
//     // 发起重置
//     await UserApi.resetUserPwd(row.id as string, password)
//     message.success('修改成功，新密码是：' + password)
//   } catch {}
// }

/** 分配权限 */
// const assignPermissionFormRef = ref()
// const handlePermission = (row: UserApi.UserVO) => {
//   assignPermissionFormRef.value.open(row)
// }

/** 初始化 */
onMounted(() => {
  getList()

  // 部门树
  getDepartmentTree()
})
</script>
<style scoped lang="scss">
.commonTopFilterWrap {
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}
.form {
  padding-top: 20px;
}
.editBtn {
  color: #0064ff;
}
.delBtn {
  color: #ea0000;
}
.tag {
  padding: 4px 16px;
  line-height: 28px;
  border-radius: 158px;
  box-sizing: border-box;
  font-size: 14px;
  &.feishu {
    background: rgba(0, 100, 255, 0.2);
    color: #0256ff;
  }
  &.sys {
    background: rgba(52, 155, 52, 0.2);
    color: #349b34;
  }
}
</style>
