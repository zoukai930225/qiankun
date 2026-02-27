<!--
 * @Date: 2024-06-06 10:13:37
-->
<template>
  <div>
    <ContentWrap>
      <el-form
        class="-mb-15px"
        :model="queryParams"
        ref="queryFormRef"
        :inline="true"
        label-width="78px"
        @submit.prevent
      >
        <el-form-item label="常用姓名:" prop="name">
          <el-input
            class="dialogFormItemWidth"
            style="width: 200px"
            v-model="queryParams.name"
            @clear="handleQuery"
            @keyup.enter="handleQuery"
            placeholder="请输入常用姓名"
            clearable
          />
        </el-form-item>

        <el-form-item label="部门" prop="departmentId">
          <el-tree-select
            v-model="queryParams.departmentId"
            :data="departmentTreeData"
            check-strictly
            node-key="id"
            :props="defaultProps"
            :render-after-expand="false"
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="是否转正:" prop="probationStu">
          <el-select
            style="width: 200px"
            v-model="queryParams.probationStu"
            placeholder="请选择是否转正"
            clearable
          >
            <el-option
              v-for="dict in zzOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态:" prop="jobFlag">
          <el-select
            style="width: 200px"
            v-model="queryParams.jobFlag"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="dict in employeeStatusDictionary"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
          <!-- <el-button @click="handleQuery" type="primary"
            ><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button
          >
          <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button> -->
        </el-form-item>
      </el-form>
    </ContentWrap>
    <!--  -->
    <!-- 列表 -->
    <ContentWrap>
      <div class="topStatics">
        <el-button type="primary" @click="handleAdd">新增</el-button>
        <el-button type="primary" @click="handleMassResignation">批量离职</el-button>
        <el-button type="primary" @click="handleExport" :loading="exportLoading"
          >导出花名册</el-button
        >
      </div>
      <!--  -->
      <el-table
        :border="true"
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :stripe="true"
        @selection-change="handleSelectionChange"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column type="selection" width="55" :selectable="isColumnDisabled" />
        <el-table-column label="常用姓名" prop="name" />
        <el-table-column label="工号" prop="employeeId" />
        <el-table-column label="性别" prop="gender">
          <template #default="scope">
            {{ scope.row.gender == 0 ? '女' : scope.row.gender == 1 ? '男' : '' }}
          </template>
        </el-table-column>
        <el-table-column label="所属公司" prop="companyName" />
        <el-table-column label="一级部门" prop="departmentStName" />
        <el-table-column label="二级部门" prop="departmentNdName" />
        <el-table-column label="职务" prop="job" />
        <el-table-column label="入职日期" prop="price">
          <template #default="scope">
            {{
              scope.row.joinYear
                ? `${scope.row.joinYear || ''}/${scope.row.joinMonth || ''}/${scope.row.joinDay || ''}`
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="jobFlag">
          <template #default="scope">
            {{ formatjobFlag(scope.row.jobFlag) }}
          </template>
        </el-table-column>
        <el-table-column label="是否转正" prop="probationStu">
          <template #default="scope">
            {{ scope.row.probationStu == 0 ? '未转正' : scope.row.probationStu == 1 ? '转正' : '' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button class="operate-btn-space" link type="primary" @click="handleAdd(scope.row)">
              查看
            </el-button>
            <el-button class="operate-btn-space" link type="primary" @click="handleDel(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </ContentWrap>
  </div>
  <!-- 新增 -->
  <DialogAddInfo
    ref="addInfo"
    :reload="handleReload"
    :type="type"
    :departmentTreeData="departmentTreeData"
  />
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import DialogAddInfo from './components/DialogAddInfo.vue'
import {
  getTableSource,
  updateTable,
  selectByJobFlag,
  exportExcel
} from '@/api/hrAdmin/peopleManagement/index'
import { employeeStatusDictionary } from '@/utils/common'
import { getDeptPage } from '@/api/hrAdmin/asset'
import download from '@/utils/download'
import { setDefaultAutoSelectFamily } from 'net'
const message = useMessage() // 消息弹窗
const appStore = useAppStore()

defineOptions({ name: 'Infor' })
const type = ref('add')

const defaultProps = ref({
  children: 'children',
  label: 'name'
})

// //点击树
// const handleNodeClick = (data) => {
//   console.log(data)
// }

// 搜索 form
const queryParams = reactive({
  page: 1,
  size: 10,
  name: undefined, //姓名
  departmentId: undefined, //部门id
  jobFlag: undefined, //在职状态 0:在职 1:离职
  probationStu: undefined //是否转正 0 未转正 1转正
})

const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据

onMounted(() => {
  getDepartmentTree()
  getList()
})

const formatjobFlag = (value) => {
  switch (value) {
    case 0:
      return '在职'
    case 1:
      return '离职'
    case 2:
      return '未转正'
    default:
      return ''
  }
}

// 下拉-部门树形
const departmentTreeData = ref([])
const getDepartmentTree = async () => {
  const data = await getDeptPage()
  departmentTreeData.value = data || []
}

// 导出
const exportLoading = ref(false)
const handleExport = async () => {
  try {
    exportLoading.value = true
    const res = await exportExcel({ ...queryParams, page: undefined, size: undefined })
    if (res) {
      download.excel(res, `花名册.xls`)
      message.success('导出成功')
    }
  } catch (error) {
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

// 初始化
const getList = async () => {
  loading.value = true
  try {
    const res = await getTableSource(queryParams)
    total.value = res.total
    list.value = res.records || []
  } finally {
    loading.value = false
  }
}

// 不可选择
const isColumnDisabled = (row, rowIndex) => {
  // console.log(row, rowIndex, 'isColumnDisabled')
  return row.jobFlag != 1
}

// 添加成功之后刷新
const handleReload = () => {
  getList()
}

// select配置
const zzOptions = reactive([
  {
    label: '未转正',
    value: 0
  },
  {
    label: '转正',
    value: 1
  },
  {
    label: '无试用期',
    value: 2
  }
])

// table 选中批量离职
const multipleSelection = ref()
const handleSelectionChange = (val: any[]) => {
  console.log(val, 'valvalval')
  multipleSelection.value = val
}

// 添加
const addInfo = ref()
const handleAdd = (row: any) => {
  type.value = row.id ? 'edit' : 'add'
  addInfo.value.open(row.id)
}

const loading = ref(false) //table loading

// 搜索
const handleQuery = () => {
  getList()
}

// 批量离职确认弹出框
const handleMassResignation = async () => {
  if (!multipleSelection.value.length) return
  let content = `员工是否确定离职`
  let statusT = '请谨慎操作，该操作不可逆'
  await message.delConfirm(content, statusT)
  const arr = multipleSelection.value.map((item) => {
    return item.employeeId
  })
  const res = await updateTable(arr)
  message.success(res)
  getList()
}

// 删除
const handleDel = async (row: any) => {
  let content = `确定要删除？`
  let statusT = '删除'
  await message.delConfirm(content, statusT)
  const res = await selectByJobFlag({ employeeId: row.employeeId })
  message.success('操作成功')
  getList()
}

// 重置按钮操作
const queryFormRef = ref()
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}
</script>

<style scoped>
.topStatics {
  margin-bottom: 16px;
}
</style>
