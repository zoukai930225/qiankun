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
        >
          <el-form-item label="字典名称" prop="name">
            <el-input
              v-model="queryParams.name"
              :prefix-icon="Search"
              class="searchFormItemWidth"
              clearable
              placeholder="请输入字典名称"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="企业" prop="company">
            <el-select
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.company"
              placeholder="请选择企业"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY)"
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
      <el-table-column label="简称" prop="shortName" min-width="120" show-overflow-tooltip />
      <el-table-column label="企业" prop="companyName" width="160" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.companyName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="字典编码" prop="code" min-width="120" show-overflow-tooltip />
      <el-table-column label="排序" prop="sort" width="80" show-overflow-tooltip />
      <el-table-column label="字典父编码" prop="pCode" min-width="120" show-overflow-tooltip />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" fixed="right" width="120">
        <template #default="scope">
          <el-button
            class="operate-btn-space"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            修改
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
  <DictDataForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { dateFormatter } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { Search } from '@element-plus/icons-vue'
import * as DictDataApi from '@/api/system/dict/dict.data'
import DictDataForm from './DictDataForm.vue'
const appStore = useAppStore()

defineOptions({ name: 'SystemDictData' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute() // 路由

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 列表的数据
const queryParams = reactive({
  page: 1,
  size: 10,
  name: '',
  type: 2, //字典类型 1-字典项 2-字典子项
  pCode: route.params.dictType,
  company: ''
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
    const data = await DictDataApi.getDictDataPage(queryParams)
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
  formRef.value.open(type, id, queryParams.pCode)
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await DictDataApi.deleteDictData(id)
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
