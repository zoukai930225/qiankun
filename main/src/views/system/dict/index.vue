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
          <el-form-item label="字典名称:" prop="name">
            <el-input
              v-model="queryParams.name"
              clearable
              placeholder="请输入字典名称"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
              :prefix-icon="Search"
              class="searchFormItemWidth"
            />
          </el-form-item>
          <el-form-item label="字典编码:" prop="code">
            <el-input
              v-model="queryParams.code"
              clearable
              placeholder="请输入字典编码"
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
      <el-table-column label="字典名称" prop="name" min-width="120" show-overflow-tooltip />
      <el-table-column label="字典编码" prop="code" min-width="120" show-overflow-tooltip />
      <el-table-column label="简称" prop="shortName" min-width="120" show-overflow-tooltip />

      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column align="left" fixed="right" :width="isShowAddBtn ? 150 : 70" label="操作">
        <template #default="scope">
          <el-button
            v-if="isShowAddBtn"
            class="operate-btn-space"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            修改
          </el-button>
          <router-link :to="'/dict/type/data/' + scope.row.code">
            <el-button class="operate-btn-space" link type="primary">数据</el-button>
          </router-link>
          <el-button v-if="isShowAddBtn" link type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
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

  <!-- 表单弹窗：添加/修改 -->
  <DictTypeForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { dateFormatter } from '@/utils/formatTime'
import { Search } from '@element-plus/icons-vue'
import * as DictTypeApi from '@/api/system/dict/dict.type'
import DictTypeForm from './DictTypeForm.vue'
const appStore = useAppStore()
const userStore = useUserStore()

defineOptions({ name: 'SystemDictType' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 字典表格数据
const queryParams = reactive({
  page: 1,
  size: 10,
  type: 1,
  name: '',
  code: undefined
})
// createTime: []
const queryFormRef = ref() // 搜索的表单

// 是否显示新增按钮
// company_id = 'ALL' && is_admin = 1
const isShowAddBtn = computed(() => {
  return userStore.user.company === 'ALL' && userStore.user.isAdmin === 1 ? true : false
})

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

/** 查询字典类型列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DictTypeApi.getDictTypePage(queryParams)
    list.value = data.data || []
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
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await DictTypeApi.deleteDictType(id)
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
