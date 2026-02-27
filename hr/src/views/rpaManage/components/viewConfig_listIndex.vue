<template>
  <el-dialog
    v-model="dialogVisible"
    title="查看参数"
    :destroy-on-close="true"
    style="
      width: 1270px;
      border-radius: 14px;
      background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 39%, #ffffff 87%, #f0f8ff 100%);
    "
  >
    <div class="commonTopFilterWrap mt-1">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="96px">
          <el-form-item label="参数名称" prop="name">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.name"
              placeholder="请输入参数名称"
              clearable
            />
          </el-form-item>
          <el-form-item label="参数编码" prop="key">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.key"
              placeholder="请输入参数编码"
              clearable
            />
          </el-form-item>
          <el-form-item label="参数值" prop="value">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.value"
              placeholder="请输入参数值"
              clearable
            />
          </el-form-item>

          <el-form-item label="运行环境" prop="paramsEnvironment">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.paramsEnvironment"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否公共参数" prop="isCommonParam">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.isCommonParam"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)"
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
        </div>
      </div>
    </div>
    <el-table
      ref="selectTableRef"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      row-key="id"
      height="420px"
    >
      <el-table-column label="参数名称" prop="paramName" :show-overflow-tooltip="false" />

      <el-table-column label="参数编码" prop="paramKey">
        <template #default="scope">
          {{ scope.row.paramKey }}
        </template>
      </el-table-column>
      <el-table-column label="参数值" prop="paramValue" />
      <el-table-column label="是否自定义" prop="isCustomize">
        <template #default="scope">
          <div v-if="scope.row.isCustomize === '是'">
            <img src="@/assets/imgs/rpaManage/status_success.png" alt="" />
            {{ scope.row.isCustomize }}
          </div>
          <div v-else-if="scope.row.isCustomize === '否'">
            <img src="@/assets/imgs/rpaManage/status_disabled.png" alt="" />
            {{ scope.row.isCustomize }}
          </div>
          <div v-else> -- </div>
        </template>
      </el-table-column>
      <el-table-column label="运行环境" prop="paramsEnvironment" width="120">
        <template #default="scope">
          <span
            :style="{
              color: scope.row.paramsEnvironment == 'production' ? '#00B067' : '#606266'
            }"
          >
            {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_PROGRAM, scope.row.paramsEnvironment) }}</span
          >
        </template>
      </el-table-column>
      <el-table-column label="是否公共参数" prop="isCommonParam">
        <template #default="scope">
          <div v-if="scope.row.isCommonParam === '1'">
            <img src="@/assets/imgs/rpaManage/status_success.png" alt="" />
            是
          </div>
          <div v-else-if="scope.row.isCommonParam === '0'">
            <img src="@/assets/imgs/rpaManage/status_disabled.png" alt="" />
            否
          </div>
          <div v-else> -- </div>
        </template>
      </el-table-column>
      <el-table-column label="备注说明" prop="explanation">
        <template #default="scope">
          {{ scope.row.explanation || '--' }}
        </template>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column label="操作" width="160" align="center">
        <template #default="scope">
          <!-- 是公共参数，即isCommonParam为1，不显示操作按钮 -->
          <div v-if="scope.row.isCommonParam === '0'">
            <el-button
              text
              type="primary"
              @click="openConfigForm('edit', scope.row.id, scope.row.isCustomize)"
              >编辑</el-button
            >
            <!-- 是自定义的时候才显示重置按钮 -->
            <el-button
              v-if="scope.row.isCustomize === '是'"
              text
              type="primary"
              @click="openConfirmDialog(scope.row)"
              >重置</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      style="margin-right: 20px"
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </el-dialog>
  <!-- 表单弹窗：查看/编辑 -->
  <ConfigForm ref="configFormRef" @success="getList" />

  <ConfirmDialog
    ref="confirmDialogRef"
    @confirm="handleConfirmComplete"
    :title="'重置'"
    :content="'重复操作将恢复自定义设置，是否确认操作！'"
  />
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

import { Search } from '@element-plus/icons-vue'
import * as rpaApi from '@/api/rpaManage'
import * as rpaProgramTypeApi from '@/api/rpaManage/programType'

import ConfigForm from './ConfigForm.vue'
import ConfirmDialog from './confirmDialog.vue'

const appStore = useAppStore()
defineOptions({ name: 'ViewConfigListIndex' })
const message = useMessage()
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const loading = ref(false) // 数据加载是否中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryFormRef = ref()
const queryParams = ref({
  page: 1,
  pageSize: 10,
  name: '',
  key: '',
  value: '',
  paramsEnvironment: '',
  isCommonParam: '',
  typeId: '',
  storeCode: ''
})

const isChooseOptions = [
  { label: '是', value: '是' },
  { label: '否', value: '否' }
]

onMounted(() => {})

/** 打开弹窗 */
const open = async (typeId: string, storeCode: string) => {
  dialogVisible.value = true
  dialogTitle.value = '查看参数'
  // 初始化查询条件
  queryParams.value = {
    page: 1,
    pageSize: 10,
    name: '',
    key: '',
    value: '',
    paramsEnvironment: '',
    isCommonParam: '',
    typeId,
    storeCode
  }
  // queryParams.value.typeId = typeId
  // queryParams.value.storeCode = storeCode
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
    const data = await rpaApi.getApplicationParamList(queryParams.value)
    list.value = data.records || []
    // console.log('列表数据', list.value)
    total.value = data.total
  } catch (error) {
    console.error('获取列表数据失败', error)
  } finally {
    loading.value = false
  }
}

/** 添加/修改操作 */
const configFormRef = ref()
const openConfigForm = (type: string, id?: string, isCustomize?: string) => {
  if (configFormRef.value) {
    configFormRef.value.open(type, id, false, queryParams.value.typeId, {
      isCustomize: isCustomize,
      storeCode: queryParams.value.storeCode
    })
  }
}

// 重置确认弹窗
const confirmContent = ref('')
const confirmDialogRef = ref()
const openConfirmDialog = (data) => {
  if (!confirmDialogRef.value) return // 如果弹窗引用不存在，直接返回

  confirmContent.value = '重复操作将恢复自定义设置，是否确认操作！'
  confirmDialogRef.value.open(data) // 打开确认对话框
}

// 确认重置
const handleConfirmComplete = async (item) => {
  // console.log('确认完成', item);
  try {
    await rpaProgramTypeApi.resetShopParams(item)
    message.success('重置成功')
    await getList()
  } catch (error) {
    console.error('重置失败:', error)
  }
}
</script>

<style lang="scss" scoped>
.el-pagination {
  height: 60px;
  background: #fff;
  width: calc(100%);
  // position: absolute;
  // right: 0;
  // bottom: 0px;
  border-radius: 14px;
  float: none !important;
  justify-content: flex-end;
}
</style>
