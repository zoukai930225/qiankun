<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" :label-width="80">
          <el-form-item label="标签名称" prop="tagName">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.tagName"
              placeholder="请输入标签名称"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="标签类别" prop="tagCategory">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.tagCategory"
              placeholder="请选择标签类别"
              clearable
              @change="handleQuery"
              @clear="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.TAG_CATEGORY_DATA, true)"
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
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
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
    <!-- 列表 -->
    <el-table
      ref="sortTableRef"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :stripe="false"
      row-class-name="commonTableRow"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      show-overflow-tooltip
    >
      <el-table-column label="标签类别" prop="tagCategory">
        <template #default="scope">
          {{ getDictLabel(DICT_TYPE.TAG_CATEGORY_DATA, scope.row.tagCategory) || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="是否显示" prop="isShow">
        <template #default="scope"> {{ Number(scope.row.isShow) === 1 ? '是' : '否' }}</template>
      </el-table-column>
      <el-table-column label="标签名称" prop="tagName">
        <template #default="scope"> {{ scope.row.tagName || '-' }}</template>
      </el-table-column>
      <el-table-column label="标签展示" prop="tagSymbol">
        <template #default="scope">
          <div v-if="scope.row.tagSymbol">
            <div
              v-for="(item, index) in scope.row.tagSymbol.split(',')"
              :key="index"
              class="sizeRangeItem"
              :style="{ backgroundColor: scope.row.tagColor, display: 'inline-block' }"
            >
              {{ item }}
            </div>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>

      <el-table-column label="应用渠道" prop="rangeUse" :show-overflow-tooltip="false" wid>
        <template #default="scope"> {{ scope.row.rangeUse || '-' }}</template>
      </el-table-column>

      <el-table-column fixed="right" width="130" label="操作" align="center">
        <template #default="scope">
          <div class="action-wrap">
            <div class="action-edit" @click="openForm('update', scope.row.id)"
              ><el-icon style="margin-right: 4px; vertical-align: middle"><Edit /></el-icon
              >编辑</div
            >
            <div class="action-delete" @click="handleDelete(scope.row.id)"
              ><el-icon style="margin-right: 4px; vertical-align: middle"><Delete /></el-icon
              >删除</div
            >
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

  <!-- 表单弹窗：添加/修改 -->
  <AddForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import AddForm from './components/addForm.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { Search } from '@element-plus/icons-vue'
import * as TagMngApi from '@/api/tagMng'
import { useAppStore } from '@/store/modules/app'

const emits = defineEmits([])
const message = useMessage()
const appStore = useAppStore()
const { t } = useI18n() // 国际化
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

// 查询参数
const queryParams = ref({
  page: 1,
  size: 10,
  tagName: '',
  tagCategory: ''
})

// 重置
const resetQuery = () => {
  queryParams.value = {
    page: 1,
    size: 10,
    tagName: '',
    tagCategory: ''
  }
  handleQuery()
}

// 查询
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

// 列表数据
const loading = ref(false)
const list = ref([])
const total = ref(0)

const getList = async () => {
  loading.value = true
  try {
    const data = await TagMngApi.getTagList(queryParams.value).catch(() => {})
    if (data) {
      list.value = data.records
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

/** 新增标签 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await TagMngApi.deleteTag(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
