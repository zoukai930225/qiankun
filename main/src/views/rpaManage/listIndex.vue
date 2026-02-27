<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="88px"
          @submit.prevent
        >
          <el-form-item label="应用关键词" prop="keyword">
            <el-input
              v-model="queryParams.keyword"
              clearable
              placeholder="模糊匹配应用名称/编码"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
              style="width: 200px"
            />
          </el-form-item>

          <el-form-item label="应用类型" prop="type" label-width="110px">
            <el-select
              class="dialogFormItemWidth"
              v-model="queryParams.type"
              placeholder="请选择"
              clearable
              filterable
              style="width: 200px"
              value-on-clear=""
              @change="handleQuery"
            >
              <el-option
                v-for="dict in typeList"
                :key="dict.id"
                :label="dict.typeName"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="店铺" prop="store">
            <el-select
              class="dialogFormItemWidth"
              v-model="queryParams.store"
              placeholder="请选择"
              clearable
              filterable
              value-on-clear=""
              style="width: 200px"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in storeList"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.status"
              placeholder="请选择"
              clearable
              value-on-clear=""
              style="width: 200px"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_STATUS, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <!-- 节点 -->
          <el-form-item v-show="isExpand" label="节点" prop="loginUserName">
            <el-select
              class="dialogFormItemWidth"
              style="width: 200px"
              v-model="queryParams.loginUserName"
              placeholder="请选择"
              clearable
              filterable
              value-on-clear=""
              @change="handleQuery"
            >
              <el-option
                v-for="dict in nodeList"
                :key="dict.id"
                :label="dict.loginUserName"
                :value="dict.loginUserName"
              />
            </el-select>
          </el-form-item>

          <el-form-item
            label="是否配置子程序"
            prop="isConfigure"
            label-width="110px"
            v-show="isExpand"
          >
            <el-select
              v-model="queryParams.isConfigure"
              placeholder="请选择"
              clearable
              value-on-clear=""
              style="width: 200px"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in configureList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
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
  </ContentWrap>

  <ContentWrap>
    <!-- <ElScrollbar> -->
    <div class="tableWrap">
      <el-table
        :data="list"
        ref="tableRef"
        class="SWCommonTable"
        header-row-class-name="headerRowClassName"
        header-cell-class-name="headerCellClassName"
        row-class-name="rowClassName"
        v-loading="loading"
        :show-overflow-tooltip="true"
        v-horizontal-scroll="'always'"
      >
        <el-table-column prop="name" label="应用名称" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip placement="top">
              {{ scope.row.name || '--' }}
              <template #content>
                {{ scope.row.code || '--' }}
              </template>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="code" label="应用编码" /> -->
        <el-table-column prop="typeName" label="应用类型名称" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip placement="top">
              {{ scope.row.typeName || '--' }}
              <template #content>
                {{ scope.row.typeCode || '--' }}
              </template>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="typeCode" label="应用类型编码" /> -->

        <el-table-column prop="storeName" label="店铺名称" :show-overflow-tooltip="false">
          <template #default="scope">
            <el-tooltip placement="top">
              {{ scope.row.storeName || '--' }}
              <template #content>
                {{ scope.row.storeCode || '--' }}
              </template>
            </el-tooltip>
          </template>
        </el-table-column>

        <!-- <el-table-column prop="storeCode" label="店铺编码" /> -->
        <el-table-column prop="executionTime" label="执行时间">
          <template #default="scope">
            {{ scope.row.executionTime || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="loginUserName" label="影刀登录账户">
          <template #default="scope">
            {{ scope.row.loginUserName || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_STATUS, scope.row.status) || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="isConfigure" label="是否配置子程序">
          <template #default="scope">
            <div class="checkOrClose-wrap">
              <img
                v-if="scope.row.isConfigure === '1'"
                src="@/assets/imgs/programGroup/circleCheckFilled.png"
                alt=""
              />
              <img
                v-else-if="scope.row.isConfigure === '0'"
                src="@/assets/imgs/programGroup/circleCloseFilled.png"
                alt=""
              />

              {{
                scope.row.isConfigure === '1' ? '是' : scope.row.isConfigure === '0' ? '否' : '--'
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="100"
          align="center"
          fixed="right"
          :show-overflow-tooltip="false"
        >
          <template #default="scope">
            <div class="content-item action-wrap" style="width: 80px; text-align: center">
              <span class="action-edit" @click="handleExecute(scope.row)">执行</span>

              <el-popover
                placement="bottom"
                trigger="click"
                :width="165"
                :popper-style="{ padding: 0 }"
              >
                <template #reference>
                  <img src="@/assets/imgs/common/more.png" alt="" class="more" />
                </template>
                <div class="more-btn">
                  <span class="action-edit more-btn-item" @click="openForm('update', scope.row.id)"
                    >编辑</span
                  >
                  <span class="action-edit more-btn-item" @click="openRelatedConfig(scope.row)"
                    >查看参数</span
                  >
                  <span class="action-edit more-btn-item" @click="chooseSecondTeamReRun(scope.row)"
                    >选择重跑二级梯队</span
                  >
                  <!-- <span class="action-delete more-btn-item" @click="handleDelete(item.id)">删除</span> -->
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
  <!-- 执行弹窗 -->
  <el-dialog class="commomDialig executeDialog" v-model="executeDialogVisible" destroy-on-close>
    <el-form
      ref="executeFormRef"
      :model="executePostData"
      :rules="executeFormRules"
      v-loading="formLoading"
      label-width="100px"
    >
      <el-form-item label="执行类型" prop="executeType">
        <el-select
          v-model="executePostData.executeType"
          placeholder="请选择"
          value-on-clear=""
          style="width: 240px"
          @change="executeTypeChange"
        >
          <el-option
            v-for="dict in getRpaTypeOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行时间" prop="restockTime" v-if="executePostData.executeType !== '1'">
        <!-- <el-date-picker
          v-model="executePostData.restockTime"
          type="date"
          :disabled="isDatePickerDisabled"
          :disabled-date="disabledDate"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          style="width: 240px"
        /> -->
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          value-format="YYYY-MM-DD"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width: 210px"
        />
      </el-form-item>
      <el-form-item label="影刀登录账户" prop="loginUserName" v-if="isRPA">
        <el-select
          v-model="executePostData.loginUserName"
          placeholder="请选择"
          value-on-clear=""
          style="width: 240px"
        >
          <el-option
            v-for="dict in nodeList"
            :key="dict.id"
            :label="dict.loginUserName"
            :value="dict.loginUserName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="运行环境" prop="runEnvironment" v-if="isRPA">
        <el-select
          class="searchFormItemWidth"
          v-model="executePostData.runEnvironment"
          placeholder="请选择"
          clearable
          @clear="handleQuery"
          @change="handleQuery"
          style="width: 240px"
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM, true)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="executeDialogVisible = false">取 消</el-button>
      <el-button type="primary" :disabled="formLoading" @click="submitExecuteForm">执 行</el-button>
    </template>
  </el-dialog>

  <!-- 表单弹窗：添加/修改 -->
  <ListForm ref="formRef" @success="getList" />
  <!-- 弹窗：查看参数 -->
  <viewConfig ref="viewConfigRef" />
  <!-- 弹窗：选择重跑二级梯队 -->
  <ChooseSecondTeamReRun ref="chooseSecondTeamReRunRef" @success="getList" />
  <!-- <RelatedConfigList ref="RelatedConfigRef" /> -->
</template>

<script lang="ts" setup>
import * as rpaApi from '@/api/rpaManage'
import * as rpaProgramTypeApi from '@/api/rpaManage/programType'
import { formatDate } from '@/utils/formatTime'
import { debounce } from 'lodash-es'
import { onMounted, ref } from 'vue'
import ChooseSecondTeamReRun from './components/ChooseSecondTeamReRun.vue'
import ListForm from './components/ListForm.vue'
// import RelatedConfigList from './components/relatedConfigList.vue'
import * as NodeManageAccountApi from '@/api/rpaManage/nodeManage'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import viewConfig from './components/viewConfig_listIndex.vue'
const isExpand = ref(false) // 是否展开
const message = useMessage()
const { t } = useI18n() // 国际化
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const dateRange = ref([])

// 查询参数
const queryParams = ref({
  keyword: '', // 应用关键词
  page: 1,
  pageSize: 10,
  typeId: '', // 应用类型
  status: '', // 状态
  loginUserName: '', // 节点
  isConfigure: '', // 是否配置子程序
  store: '', // 店铺名称
  type: '' // 应用类型编码
})

// 重置
const resetQuery = () => {
  queryParams.value = {
    keyword: '',
    page: 1,
    pageSize: 10,
    typeId: '',
    status: '',
    loginUserName: '',
    isConfigure: '',
    store: '',
    type: ''
  }
  handleQuery()
}

// 执行 - 执行类型下拉选项
const getRpaTypeOptions = computed(() => {
  const options = getIntDictOptions(DICT_TYPE.RPA_UNIFIED_TYPE, true)
  return options.filter((item) => item.value !== '3')
})

const configureList = [
  {
    label: '是',
    value: '1'
  },
  {
    label: '否',
    value: '0'
  }
]

// 搜索
const handleQuery = debounce(async () => {
  queryParams.value.page = 1
  await getList()
}, 200)

// 列表数据
const loading = ref(false)
const list = ref([])
const total = ref(0)

const getList = async () => {
  loading.value = true
  try {
    const data = await rpaApi.getApplicationListNew(queryParams.value).catch(() => {})
    if (data) {
      list.value = data.records || []
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

/** 新增程序 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id)
  }
}

// 选择重跑二级梯队
const chooseSecondTeamReRunRef = ref()
const chooseSecondTeamReRun = (item: any) => {
  console.log('选择重跑二级梯队', item)
  if (chooseSecondTeamReRunRef.value) {
    chooseSecondTeamReRunRef.value.open(item.id)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await rpaApi.deleteApplication({ id: id })
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 执行按钮操作 -打开弹窗 */
const executeFormRules = {
  executeType: [
    {
      required: true,
      message: '请选择执行类型',
      trigger: ['change']
    }
  ]
}

// 执行 判断当前应用的类型是否为rpa 否则没有这个字段
const isRPA = ref(false)

// 执行表单 提交数据
const executePostData = ref({
  executeType: '1', // 执行类型(1:自动, 2:数据补录, 3:重新执行)
  restockTime: '',
  restockEndTime: '',
  name: '',
  code: '',
  typeCode: '',
  storeCode: '',
  yingdaoParams: '',
  typeId: '',
  nodeId: '',
  typeName: '',
  storeName: '',
  typeCategory: '',
  id: '',
  loginUserName: '',
  runEnvironment: '',
  status: ''
})

// 重置执行表单
const resetExecuteForm = () => {
  console.log('重置执行表单')
  executePostData.value = {
    executeType: '1', // 执行类型(1:自动, 2:数据补录, 3:重新执行)
    restockTime: '',
    restockEndTime: '',
    name: '',
    code: '',
    typeCode: '',
    storeCode: '',
    yingdaoParams: '',
    typeId: '',
    nodeId: '',
    typeName: '',
    storeName: '',
    typeCategory: '',
    id: '',
    loginUserName: '',
    runEnvironment: '',
    status: ''
  }
  dateRange.value = []
  console.log('执行了', executePostData.value)
  isDatePickerDisabled.value = false
}

// 执行表单 弹窗是否可见
const executeDialogVisible = ref(false)
// 执行按钮点击
const handleExecute = async (data: any) => {
  // if (data.typeCategory !== 'RPA') {
  //   message.warning('该应用非RPA类应用，无法执行')
  //   return
  // }
  isRPA.value = data.typeCategory === 'RPA'
  executeDialogVisible.value = true
  resetExecuteForm()
  // 如果有绑定 默认回显
  if (isRPA.value) {
    executePostData.value.loginUserName = data.loginUserName
    executePostData.value.runEnvironment = data.runEnvironment
  }
  const {
    name,
    code,
    typeCode,
    storeCode,
    typeId,
    nodeId,
    typeName,
    storeName,
    id,
    typeCategory,
    status
  } = data
  executePostData.value = {
    ...executePostData.value,
    name,
    code,
    typeCode,
    storeCode,
    typeId,
    nodeId,
    typeName,
    storeName,
    id,
    typeCategory,
    status
  }

  // executePostData.value = Object.assign(data)
  console.log('执行数据', executePostData.value)
}

const disabledDate = (date) => {
  // 当选择的执行类型为数据补录时，禁用今天及之后的日期
  return executePostData.value.executeType !== '1'
    ? date && date.getTime() > Date.now() - 8.64e7
    : null
}

const isDatePickerDisabled = ref(false) // 是否禁用日期选择器 当选择的执行类型为重新执行时，禁用日期选择器
// 切换执行类型
const executeTypeChange = (value) => {
  dateRange.value = []
}

// 确认执行
const executeFormRef = ref() // 表单 Ref
const submitExecuteForm = async () => {
  // 校验表单
  if (!executeFormRef.value) return
  const valid = await executeFormRef.value.validate()
  if (!valid) return
  console.log('执行表单提交数据：', executePostData.value)
  // 提交请求
  formLoading.value = true
  try {
    console.log('00', dateRange.value)
    if (dateRange.value && dateRange.value.length > 0) {
      executePostData.value.restockTime = dateRange.value[0]
      executePostData.value.restockEndTime = dateRange.value[1]
    }
    const {
      name, // 应用名称
      code, // 应用编码
      typeCode, // 应用类型编码
      storeCode, // 店铺编码
      executeType, // 执行类型(1:自动, 2:数据补录, 3:重新执行)
      restockTime, // 开始时间
      restockEndTime, // 结束时间
      yingdaoParams, // 影刀参数
      typeId, // 应用类型id
      nodeId, // 节点id
      typeName, // 应用类型名称
      storeName, // 店铺名称
      typeCategory,
      id,
      loginUserName, //影刀登录账户
      status,
      runEnvironment //运行环境
    } = executePostData.value

    let postData = {
      name, // 应用名称
      code, // 应用编码
      typeCode, // 应用类型编码
      storeId: storeCode, // 店铺编码
      executeType, // 执行类型
      restockTime: restockTime, // 开始时间
      restockEndTime: restockEndTime, // 结束时间
      yingdaoParams: executeType !== '3' ? '' : yingdaoParams, //影刀参数
      typeId, // 应用类型id
      nodeId, // 节点id
      typeName, // 应用类型名称
      storeName, // 店铺名称
      id,
      typeCategory,
      loginUserName, //影刀登录账户
      status,
      runEnvironment //运行环境
    }

    // 如果不是rpa类应用 删掉 loginUserName,runEnvironment 这个字段 提交时不传给后端
    if (!isRPA.value) {
      delete postData.loginUserName
      delete postData.runEnvironment
    }

    console.log('执行postData：', postData)
    await rpaApi.executeRpa(postData)
    message.success('执行成功')
    executeDialogVisible.value = false
    await getList()
  } finally {
    formLoading.value = false
  }
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
      openForm('create')
    }
  }
}

// 查看参数操作

const viewConfigRef = ref()
const dialogVisible = ref(false)
const openRelatedConfig = (data: any) => {
  console.log('应用列表-查看参数：', data)
  dialogVisible.value = true
  if (viewConfigRef.value) {
    viewConfigRef.value.open(data.typeId, data.storeCode)
  }
}

// 获取节点列表
const nodeList = ref<any[]>([])
const getNodeList = async () => {
  const data = await NodeManageAccountApi.getNodeManageList({ page: 1, size: 99999 })
  nodeList.value = data.data
}

// 查询应用类型
const typeList = ref<any[]>([])
const getTypeList = async () => {
  let data = await rpaProgramTypeApi.getProgramTypeList({ page: 1, pageSize: 99999 })
  // console.log('应用类型：', data)
  typeList.value = data.records
  // console.log('应用类型列表：', typeList.value)
}

// 获取店铺列表
const storeList = ref([])
const getStoreList = async () => {
  const data = await rpaApi.getStoreList({ page: 1, size: 99999 })
  storeList.value = data.data
}

onMounted(() => {
  // getUserList()
  getNodeList()
  getList()
  getTypeList()
  getStoreList()
})
</script>

<style lang="scss">
.executeDialog {
  width: 420px;
  // height: 536px;
  background: linear-gradient(
    226deg,
    #f2f3ff 0%,
    #ffffff 39%,
    #ffffff 88%,
    #e8f6fd 95%,
    #f0f8ff 100%
  );
  border-radius: 14px;
  box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07);
}
</style>
<style lang="scss" scoped>
// @use './index.scss';

@use '@/styles/eltable.scss';
.el-form--inline .el-form-item {
  margin-right: 32px !important;
}

.checkOrClose-wrap {
  width: 56px;
  height: 22px;
  line-height: 22px;
  background: #f7f7f7;
  border-radius: 12px;
  font-size: 14px;
  color: #333333;
  text-align: center;
  img {
    vertical-align: middle;
    width: 12px;
    height: 12px;
  }
}

.action-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.action-edit {
  color: #007eff;
}
.action-delete {
  color: #ff4d4f;
}

.more-btn {
  display: flex;
  flex-direction: column;
  cursor: pointer;
  .more-btn-item {
    line-height: 28px;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
    padding: 0 8px;
    box-sizing: border-box;
  }
  .more-btn-item:hover {
    width: 100%;
    height: 28px;
    background: #f3f4f7;
    line-height: 28px;
    font-weight: 400;
    font-size: 14px;
    color: #0078ff;
  }
}
</style>
