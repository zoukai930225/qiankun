<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="78px"
          @submit.prevent
        >
          <el-form-item label="字段名称:" prop="filedName">
            <el-input
              v-model="queryParams.filedName"
              clearable
              placeholder="请输入字段名称"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
              :prefix-icon="Search"
              class="searchFormItemWidth"
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

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      :border="true"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="字段名" prop="filedName" show-overflow-tooltip />
      <el-table-column label="字段" prop="filed" show-overflow-tooltip />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        :formatter="dateFormatter"
      />
      <el-table-column align="left" fixed="right" width="180" label="操作">
        <template #default="scope">
          <el-button class="operate-btn-space" link type="primary" @click="editForm(scope.row)">
            编辑
          </el-button>

          <el-button class="operate-btn-space" link type="primary" @click="openForm(scope.row.id)">
            公式
          </el-button>

          <el-button link type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
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
  </ContentWrap>

  <!--添加/编辑字段 -->
  <el-dialog v-model="formVisible" title="新增" width="500" @close="handleCloseAdd">
    <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="80px">
      <el-form-item label="字段名" prop="filedName">
        <el-input v-model="addForm.filedName" placeholder="请输入字段名" />
      </el-form-item>
      <el-form-item label="字段" prop="filed">
        <el-input v-model="addForm.filed" :disabled="type == 'edit'" placeholder="请输入字段" />
      </el-form-item>
      <el-form-item label="描述" prop="filedDescribe">
        <el-input v-model="addForm.filedDescribe" placeholder="请输入字段描述" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCloseAdd">取消</el-button>
        <el-button type="primary" @click="handleAddTableItem"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- 公式编辑 -->
  <EditForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { dateFormatter } from '@/utils/formatTime'
import {
  sysExpressionList,
  sysExpressionDelete,
  sysExpressionCreate,
  sysExpressionUpdate
} from '@/api/system/dynamicTableDic/index'
import EditForm from './EditForm.vue'
import { Search } from '@element-plus/icons-vue'
const appStore = useAppStore()
defineOptions({ name: 'SystemDynamicTableDic' })
const message = useMessage() // 消息弹窗

const loading = ref(false) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([{ name: '字典', code: 'dic' }]) // 字典表格数据
const queryParams = reactive({
  page: 1,
  size: 10,
  filedName: undefined
})
const queryFormRef = ref() // 搜索的表单
const tableName = 'sys_expression' //默认写死（第一期做单表数据）
const type = ref('add')
const currentId = ref('')

// 添加表单
const addForm = ref({
  filedName: undefined,
  filed: undefined,
  filedDescribe: undefined
})

const addRules = reactive({
  filedName: [{ required: true, message: '请输入字段名', trigger: 'blur' }],
  filed: [{ required: true, message: '请输入字段', trigger: 'blur' }],
  filedDescribe: [
    {
      required: true,
      message: '请输入字段描述',
      trigger: 'blur'
    }
  ]
})

const formVisible = ref(false)
const addFormRef = ref()
// 添加表字段
const addTableItem = () => {
  type.value = 'add'
  formVisible.value = true
}

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
      addTableItem()
    }
  }
}

const handleAddTableItem = async () => {
  // 校验表单
  try {
    if (!formRef) return

    const valid = await addFormRef.value.validate()
    if (!valid) return

    const updatePromise = currentId.value
      ? sysExpressionUpdate({ ...addForm.value, id: currentId.value })
      : sysExpressionCreate(addForm.value)
    await updatePromise
    await getList()

    message.success('添加成功')
    formVisible.value = false
    resetForm()
  } catch (error) {
    console.log(error)
  }
}

// 重制表单
const resetForm = () => {
  addForm.value = {
    filedName: undefined,
    filed: undefined,
    filedDescribe: undefined
  }
}

/** 查询字典类型列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await sysExpressionList(queryParams)
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (id?: string) => {
  formRef.value.open(tableName, id)
}

const handleCloseAdd = () => {
  formVisible.value = false
  addForm.value = {
    filedName: undefined,
    filed: undefined,
    filedDescribe: undefined
  }
  currentId.value = ''
}

const editForm = (row) => {
  type.value = 'edit'
  currentId.value = row.id
  addForm.value = {
    filedName: row.filedName,
    filed: row.filed,
    filedDescribe: row.filedDescribe
  }
  formVisible.value = true
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await sysExpressionDelete(id)
    // 发起删除
    message.success('删除成功')
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
