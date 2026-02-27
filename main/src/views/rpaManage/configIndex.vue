<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <div style="margin-bottom: -20px">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="80px">
            <el-form-item label="参数名称:" prop="paramName">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.paramName"
                placeholder="请输入参数名称"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="参数编码:" prop="paramKey">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.paramKey"
                placeholder="请输入参数编码"
                clearable
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="参数值:" prop="paramValue">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.paramValue"
                placeholder="请输入参数值"
                clearable
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="运行环境" prop="paramsEnvironment">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.paramsEnvironment"
                placeholder="请选择"
                clearable
                @clear="handleQuery"
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in filteredDictOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              v-show="isExpand"
              label="是否公共参数"
              prop="isCommonParam"
              label-width="100px"
            >
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.isCommonParam"
                placeholder="请选择"
                clearable
                @clear="handleQuery"
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in isPublicDictOptions"
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
      <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
    </div>
  </ContentWrap>
  <ContentWrap>
    <el-table
      :data="list"
      style="width: 100%"
      :border="false"
      v-loading="loading"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      :header-cell-style="{ background: '#f2f6fc' }"
    >
      <el-table-column
        label="参数名称"
        prop="paramName"
        align="center"
        :show-overflow-tooltip="false"
      />

      <el-table-column label="参数编码" prop="paramKey" align="center">
        <template #default="scope">
          <div style="cursor: pointer" @click="handleCopy(scope.row.paramKey)">
            {{ scope.row.paramKey }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="参数值" prop="paramValue" align="center" />

      <el-table-column label="运行环境" align="center">
        <template #default="scope">
          <div class="cell">
            <span
              :style="{
                color: scope.row.paramsEnvironment == 'production' ? '#34C056' : '#606266'
              }"
              >{{ translateEnvironment(scope.row) }}</span
            >
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="是否公共参数"
        :formatter="translateisCommonParam"
        width="90px"
        align="center"
      />
      <el-table-column label="应用数量" prop="skCount" width="90px" align="center" />
      <el-table-column
        label="备注说明"
        :formatter="formatNotes"
        :show-overflow-tooltip="false"
        align="center"
      />

      <el-table-column label="操作按钮" align="center" :show-overflow-tooltip="false">
        <template #default="scope">
          <div>
            <el-button
              type="primary"
              @click="openForm('update', scope.row.id)"
              class="mr-6px"
              :icon="Edit"
              link
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.isCommonParam !== '1'"
              type="primary"
              @click="handleDelete(scope.row.id)"
              link
            >
              删除
            </el-button>
            <el-button type="primary" @click="openRelatedProgram(scope.row)" link>
              应用配置
            </el-button>
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
  <!-- 表单弹窗：查看/编辑 -->
  <ConfigForm ref="formRef" editType="self" @success="getList" />
  <!-- 弹窗：已关联应用列表-可取消关联/添加应用 -->
  <RelatedProgramList ref="RelatedProgramRef" @success="getList" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import ConfigForm from './components/ConfigForm.vue'
import RelatedProgramList from './components/relatedProgramList.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { Edit, Search } from '@element-plus/icons-vue'
import { copyText } from '@/utils/copyText'
import * as rpaApi from '@/api/rpaManage'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
defineOptions({ name: 'RpaListIndex' })

const list = ref<any[]>([])

const isExpand = ref(false) // 是否展开

const addList = ref([
  {
    label: '新建',
    code: 'add'
  }
])
// 当前新增按钮code码
const currentAddCode = ref('add')

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
    const data = await rpaApi.getConfigList(queryParams.value).catch(() => {
      loading.value = false
    })
    list.value = data.records || []
    // console.log('请求参数', queryParams.value)
    // console.log('列表数据', list.value)
    total.value = data.total
  } finally {
    loading.value = false
  }
}
/** 搜索查询 */
// 执行环境--获取字典数据并过滤掉 '全部' 选项
const getFilteredDictOptions = (dictType) => {
  return getIntDictOptions(dictType).filter((dict) => dict.label !== '全部')
}
// 执行环境--正式环境/测试环境
const filteredDictOptions = computed(() => getFilteredDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM))
// 是否公共参数--是/否
const isPublicDictOptions = computed(() => getFilteredDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER))

/** 通用格式化函数，用于检查属性是否为空字符串，如果为空则显示 '暂无' */
const createFormatter = (propName) => (row) => {
  return row[propName] === '' ? '--' : row[propName]
}
const formatNotes = createFormatter('explanation') //备注

const handleQuery = () => {
  queryParams.value.page = 1
  // console.log('查询参数', queryParams.value)
  getList()
}

/** 列表数据--根据字典显示运行环境 */
const translateEnvironment = (row) => {
  const environment = getFilteredDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM).find(
    (option) => option.value === row.paramsEnvironment
  )
  return environment ? environment.label : row.paramsEnvironment
}
/** 列表数据--根据字典显示翻译是否公共参数 */
const translateisCommonParam = (row) => {
  const CommonParam = getFilteredDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER).find(
    (option) => option.value === row.isCommonParam
  )
  return CommonParam ? CommonParam.label : row.isCommonParam
}

const queryParams = ref({
  isCommonParam: '', // 是否公共参数
  paramsEnvironment: '', // 参数环境
  paramName: '', // 参数名称
  paramKey: '', // 参数key
  paramValue: '', // 参数value
  page: 1, // 分页参数：当前页码
  size: 10 // 分页参数：每页显示的条目数
})

const loading = ref(false) // 列表的加载中
const total = ref(10) // 列表的总页数

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id)
  }
}

// 应用配置操作
const RelatedProgramRef = ref()
const openRelatedProgram = (data?: any) => {
  if (RelatedProgramRef.value) {
    RelatedProgramRef.value.open(data.paramName, data.id, data.isCommonParam)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await rpaApi.deleteConfig(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}
const queryFormRef = ref() // 搜索的表单
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

// 复制文本到剪贴板的函数
const handleCopy = async (text) => {
  await copyText(text)
}

/** 初始化 */
onMounted(() => {
  getList()
})
</script>
