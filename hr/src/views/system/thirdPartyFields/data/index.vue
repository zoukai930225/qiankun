<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          class="-mb-15px"
          :model="queryParams"
          ref="queryFormRef"
          :inline="true"
          label-width="68px"
          @submit.prevent
        >
          <el-form-item label="字段:" prop="fieldName">
            <el-input
              v-model="queryParams.fieldName"
              :prefix-icon="Search"
              class="searchFormItemWidth"
              clearable
              placeholder="请输入字段名或者字段编码查找"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
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
      <el-table-column label="字段名" prop="fieldName" show-overflow-tooltip />
      <el-table-column label="字段编码" prop="fieldCode" show-overflow-tooltip />
      <el-table-column label="字段描述" prop="fieldDesc" show-overflow-tooltip />

      <el-table-column label="操作" fixed="right" width="120">
        <template #default="scope">
          <el-button
            class="operate-btn-space"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
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

  <!-- 表单弹窗：添加/修改 -->
  <DataForm ref="formRef" @success="getList" />
  <!-- 快速录入弹窗 -->
  <AddJsonForm ref="addJsonFormRef" @success="getList" />
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import * as ThirdPartyFieldsApi from '@/api/system/thirdPartyFields'
import DataForm from './DataForm.vue'
import AddJsonForm from './AddJsonForm.vue'
import { Search } from '@element-plus/icons-vue'
const appStore = useAppStore()

defineOptions({ name: 'SystemData' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute() // 路由

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 列表的数据
const queryParams = ref({
  page: 1,
  size: 10,
  businessId: route.params.businessId,
  fieldName: ''
})

const queryFormRef = ref() // 搜索的表单

const addList = ref([
  {
    label: '新增',
    code: 'add'
  },
  {
    label: '快速录入',
    code: 'addOther'
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
    } else if (currentAddCode.value === 'addOther') {
      openAddJsonForm()
    }
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    // console.log('000', queryParams.value)
    const data = await ThirdPartyFieldsApi.getThirdPartyFieldsApiList(queryParams.value)
    list.value = data.data || []
    total.value = data.total
    // console.log('list',list.value);
  } finally {
    loading.value = false
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type?: string, id?: string) => {
  formRef.value.open(type, id, queryParams.value.businessId)
}

/** 快速录入 */
const addJsonFormRef = ref()
const openAddJsonForm = () => {
  addJsonFormRef.value.open(queryParams.value.businessId)
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ThirdPartyFieldsApi.deleteThirdPartyFieldsApi(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(async () => {
  await getList()
})
</script>
