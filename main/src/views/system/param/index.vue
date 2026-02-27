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
        >
          <el-form-item label="店铺" prop="storeId">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.storeId"
              placeholder="请选择店铺"
              clearable
              @clear="handleQuery"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_STORE)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="参数类型" prop="typeKey">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.typeKey"
              placeholder="请选择参数类型"
              clearable
              @clear="handleQuery"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_PARAMS)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="生效日期:" prop="queryDate">
            <el-date-picker
              v-model="queryParams.queryDate"
              class="!w-200px"
              placeholder="生效日期"
              type="date"
              value-format="YYYY-MM-DD"
              @change="handleQuery"
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
      <el-table-column label="类型名称" prop="typeName" min-width="180" show-overflow-tooltip />
      <el-table-column label="值" prop="typeValue" width="120" show-overflow-tooltip>
        <template #default="scope">
          {{ typeValue(scope.row.typeValue, scope.row.serialNumber) }}
        </template>
      </el-table-column>
      <el-table-column label="店铺" prop="storeName" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.storeName || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description" min-width="200" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.description || '-' }}
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter2"
        label="生效开始日期"
        prop="startDate"
        width="140"
      />
      <el-table-column
        :formatter="dateFormatter2"
        label="生效结束日期"
        prop="endDate"
        width="140"
      />
      <el-table-column :formatter="dateFormatter" label="更新日期" prop="updatedAt" width="180" />
      <el-table-column fixed="right" width="150" label="操作">
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
      v-model:limit="queryParams.size"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ParamTypeForm ref="formRef" @success="getList" />
  <!-- 复制弹窗 -->
  <CopyParamTypeForm ref="copyFormRef" @success="getList" />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as DynamicParamsApi from '@/api/system/param'
import ParamTypeForm from './ParamTypeForm.vue'
import CopyParamTypeForm from './CopyParamTypeForm.vue'

const appStore = useAppStore()

defineOptions({ name: 'SystemParamType' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据
const queryParams = reactive({
  page: 1,
  size: 10,
  storeId: '',
  typeKey: '',
  queryDate: ''
})
const queryFormRef = ref() // 搜索的表单

const addList = ref([
  {
    label: '新增',
    code: 'add'
  },
  {
    label: '复制',
    code: 'copy'
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
    } else if (currentAddCode.value === 'copy') {
      openCopyForm()
    }
  }
}

/** 查询字典类型列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await DynamicParamsApi.getDynamicParamTypePage(queryParams).catch(() => {
      loading.value = false
    })
    list.value = data.data || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 类型值
const typeValue = (typeValue, serialNumber) => {
  if (serialNumber === '1' && typeValue) {
    return `${typeValue}(生效)`
  } else {
    return typeValue || '-'
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

/** 复制操作 */
const copyFormRef = ref()
const openCopyForm = () => {
  copyFormRef.value.open()
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await DynamicParamsApi.deleteDynamicParamType(id)
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
