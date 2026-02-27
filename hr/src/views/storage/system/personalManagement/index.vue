<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true">
          <el-form-item label="员工编号/姓名:" prop="employee">
            <el-input
              v-model.trim="queryParams.employee"
              placeholder="请输入员工编号/姓名"
              clearable
              @clear="getList"
              @keydown.enter="getList"
            />
          </el-form-item>
          <el-form-item label="员工状态:" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择员工状态"
              clearable
              @change="getList"
            >
              <el-option
                v-for="item in employeeStatusOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="薪酬结算方式:" prop="salarySettlementType">
            <el-select
              v-model="queryParams.salarySettlementType"
              placeholder="请选择薪酬结算方式"
              clearable
              @change="getList"
            >
              <el-option
                v-for="item in salaryOptions"
                :key="item.value"
                :value="item.value"
                :label="item.label"
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
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: 0 }">
            重置
          </el-button>
        </div>
      </div>
    </div>

    <main-table
      :table-data="tableData"
      :options="tableOptions"
      :loading="loading"
      max-height="640px"
      border
    >
      <template #salarySettlementType="{ row }">
        {{ transformSalarySettlementType(row.salarySettlementType) }}
      </template>
      <template #status="{ row }">{{ transformStatus(row.status) }}</template>
      <template #rolesMask="{ row }">{{ transformRoles(row.rolesMask, rolesMasks) }}</template>
      <template #gender="{ row }">{{ genderOption[row.gender] }}</template>
      <template #operation="{ row }">
        <el-button type="primary" link @click="onCheck(row.userId)">查看</el-button>
        <el-button type="primary" link @click="onEdit(row.userId)">修改</el-button>
      </template>
    </main-table>

    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <Drawer
    ref="drawerRef"
    v-model:is-show="isShowDrawer"
    :id="rowId"
    :title="drawerTitle"
    :type="drawerType"
    :roles-masks="rolesMasks"
    @refresh="getList"
  />
</template>
<script setup lang="ts">
import { getPersonalManagementList, getRolesMasks } from '@/api/storage/system'
import Drawer from './components/drawer.vue'
import MainTable from '../components/table.vue'
import {
  employeeStatusOptions,
  genderOption,
  salaryOptions,
  tableOptions,
  transformRoles,
  transformSalarySettlementType,
  transformStatus
} from '../options'

defineOptions({ name: 'StorageSystemPersonalManagement' })

const queryParams = reactive<StorageSystem.PersonalManagement.GetListParams>({
  page: 1,
  pageSize: 10,
  status: 2
})
const loading = ref(false)
const tableData = ref<StorageSystem.PersonalManagement.ListItem[]>([])
const total = ref(1)
const isShowDrawer = ref(false)
const rowId = ref<string>('')
const drawerTitle = ref('')
const drawerType = ref()
const drawerRef = ref()
const queryFormRef = ref()
const rolesMasks = ref<StorageSystem.PersonalManagement.RolesMaskItem[]>([])

/**
 * 搜索
 */
function handleQuery() {
  queryParams.page = 1
  getList()
}

/**
 * 重置
 */
function resetQuery() {
  queryFormRef.value.resetFields()
  getList()
}

/**
 * 获取列表数据
 */
async function getList() {
  loading.value = true
  try {
    const res = await getPersonalManagementList(queryParams)
    tableData.value = res.records.map((item) => {
      Object.keys(item).forEach(
        (key) => (item[key] = item[key] === null || item[key] === '' ? '--' : item[key])
      )
      return item
    })
    total.value = res.total
  } catch (error) {
  } finally {
    loading.value = false
  }
}

/** 打开抽屉
 * @param row
 * @param type 1-查看 | 2-填写
 */
function openDrawer(id: string = '', type?: 1 | 2) {
  drawerType.value = type
  switch (type) {
    case 1:
      rowId.value = id
      drawerTitle.value = '查看'
      break
    case 2:
      rowId.value = id
      drawerTitle.value = '修改'
      break
  }
  nextTick(() => {
    drawerRef.value.open()
  })
}

/** 获取工种列表 */
async function getRoles() {
  try {
    const res = await getRolesMasks()
    rolesMasks.value = res
  } catch (error) {}
}

function onEdit(id: string) {
  openDrawer(id, 2)
}

function onCheck(id: string) {
  openDrawer(id, 1)
}

onBeforeMount(async () => {
  await getRoles()
  await getList()
})
</script>

<style lang="less" scoped>
:deep(.el-form) {
  .el-input__wrapper,
  .el-select__wrapper {
    width: 200px;
    box-sizing: border-box;
  }
}
</style>
