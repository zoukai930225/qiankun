<template>
  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    :destroy-on-close="true"
    style="width: 1155px; border-radius: 14px"
  >
    <div class="commonTopFilterWrap mt-1">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="70px">
          <el-form-item label="参数名称" prop="paramName">
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
          <el-form-item label="参数编码" prop="paramKey">
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
          <el-form-item label="参数值" prop="paramValue">
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
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="是否选择" prop="isChoose">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.isChoose"
              placeholder="请选择"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="dict in isChooseOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item> -->
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
        </div>
      </div>
    </div>
    <el-table
      ref="selectTableRef"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      height="440px"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      @selection-change="handleSelectionChange"
      row-key="id"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="参数名称" prop="paramName" :show-overflow-tooltip="false" />

      <el-table-column label="参数编码" prop="paramKey">
        <template #default="scope">
          <div>
            {{ scope.row.paramKey }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="参数值" prop="paramValue" />

      <el-table-column label="运行环境" prop="paramsEnvironment" width="120">
        <template #default="scope">
          <span
            :style="{
              color: scope.row.paramsEnvironment == 'production' ? '#34C056' : '#606266'
            }"
          >
            {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_PROGRAM, scope.row.paramsEnvironment) }}</span
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <Pagination
        style="margin-right: 20px"
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
    /></div>
    <template #footer>
      <div style="margin-right: 33px; padding-bottom: 20px">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button></div
      >
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { getCompanyName } from '@/utils/index'
import { Search } from '@element-plus/icons-vue'
import * as rpaApi from '@/api/rpaManage'
import * as platformLoginApi from '@/api/platformLogin'

const appStore = useAppStore()

defineOptions({ name: 'SystemDictTypeForm' })
const message = useMessage()
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const loading = ref(false) // 数据加载是否中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref()
const queryParams = ref({
  page: 1,
  size: 10,
  paramName: '',
  paramKey: '',
  paramValue: '',
  paramsEnvironment: '',
  isChoose: '',
  typeId: ''
})

const isChooseOptions = [
  { label: '是', value: '是' },
  { label: '否', value: '否' }
]

/** 打开弹窗 */
const open = async (id: string) => {
  dialogVisible.value = true

  dialogTitle.value = '公共参数'
  queryParams.value.page = 1
  queryParams.value.typeId = id
  getList()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

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

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await rpaApi.getCommonParamList(queryParams.value)
    list.value = data.records || []
    console.log('列表数据', list.value)
    total.value = data.total

    // nextTick(() => {
    //   list.value
    //     .filter((item) => item.isChoose === '是')
    //     .forEach((item) => {
    //       selectTableRef.value.toggleRowSelection(item, true)
    //     })
    // })
  } catch (error) {
    console.error('获取列表数据失败', error)
  } finally {
    loading.value = false
  }
}

const selectTableRef = ref()
const selectedRows = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  selectedRows.value = val
}
const data = {
  skTabulateGroupId: '',
  list: []
}

const formLoading = ref(false)
const submitForm = async () => {
  // 提交请求
  formLoading.value = true
  try {
    selectedRows.value.forEach((item: any) => {
      item.typeId = queryParams.value.typeId
    })

    let submitData = {
      dataList: selectedRows.value.length > 0 ? selectedRows.value : [],
      typeId: queryParams.value.typeId
    }

    await rpaApi.bindCommonParam(submitData)
    message.success('公共参数绑定成功')

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('chooseCommonParam', selectedRows.value)
  } finally {
    formLoading.value = false
  }
}

const emit = defineEmits(['chooseCommonParam'])
</script>

<style lang="scss" scoped>
.pagination {
  height: 60px;
  background: #fff;
  width: calc(100%);
  // position: absolute;
  // right: 0;
  // bottom: 0px;
  z-index: 99;
  border-radius: 14px;
}
</style>

<style scoped>
/* :deep(.linkAccountDialog .el-dialog) {
  padding: 0px;
  background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
} */
/* :deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  max-height: 70vh;
}
:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
:deep(.CommonSearchForm) {
  border-bottom: none;
} */
</style>
