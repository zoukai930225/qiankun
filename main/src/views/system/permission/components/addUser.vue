<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" style="width: 800px">
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="50px"
    >
      <el-form-item label="账号" prop="userName">
        <el-input
          v-model="queryParams.userName"
          placeholder="请输入账号"
          clearable
          @keyup.enter="handleQuery"
          @clear="handleQuery"
          class="!w-200px"
        />
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input
          v-model="queryParams.realName"
          placeholder="请输入姓名"
          clearable
          @keyup.enter="handleQuery"
          @clear="handleQuery"
          class="!w-200px"
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
      </el-form-item>
    </el-form>
    <div style="height: 30px"></div>
    <el-table
      ref="multipleTableRef"
      :border="true"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column type="selection" width="55" fixed="left" />
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
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
    <template #footer>
      <el-button
        :disabled="formLoading || multipleSelection.length === 0"
        type="primary"
        @click="submitForm"
        >确 定</el-button
      >
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" setup>
import { CommonYesOrNoName, UserSexName } from '@/types/enumOptions'
import { dateFormatter } from '@/utils/formatTime'
import { ElTable } from 'element-plus'

import * as UserApi from '@/api/system/user'
import * as PermissionApi from '@/api/system/permission'

defineOptions({ name: 'PermissionAddUser' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const multipleSelection = ref<string[]>([])
const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const permissionId = ref('') //权限ID
const list = ref<UserApi.UserVO[]>([]) // 列表的数
const queryParams = reactive({
  page: 1,
  size: 10,
  permissionId: '',
  userName: undefined,
  realName: undefined
})

/** 打开弹窗 */
const open = async (id?: string) => {
  dialogVisible.value = true
  permissionId.value = id || ''
  queryParams.permissionId = id || ''
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await UserApi.getUserPermissionPage(queryParams)
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
  handleQuery()
}

/**
 * 选择用户
 */
const handleSelectionChange = (val: UserApi.UserVO[]) => {
  multipleSelection.value = []
  val.forEach((item) => {
    multipleSelection.value.push(item.id as string)
  })
}

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('选择用户') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      id: permissionId.value,
      ids: multipleSelection.value || []
    }
    await PermissionApi.permissonSaveUser(data)
    message.success(t('common.createSuccess'))
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>
