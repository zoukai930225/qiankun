<template>
  <el-dialog
    class="commomDialig"
    v-model="dialogVisible"
    title="已关联应用"
    :destroy-on-close="true"
    style="width: 1155px; border-radius: 14px"
    :align-center="true"
    @close="closeDialog"
  >
    <!-- 搜索工作栏 -->
    <div style="padding: 0 20px; box-sizing: border-box">
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        class="-mb-15px"
        :height="400"
      >
        <el-form-item label="业务编码" prop="serviceCode" style="width: 300px">
          <el-input
            class="dialogFormItemWidth"
            v-model="queryParams.serviceCode"
            placeholder="请输入业务编码"
            :suffix-icon="Search"
            clearable
            @clear="handleQuery"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="应用名称:" prop="skName" style="width: 300px">
          <el-input
            class="dialogFormItemWidth"
            v-model="queryParams.skName"
            placeholder="请输入应用名称"
            :suffix-icon="Search"
            clearable
            @clear="handleQuery"
            @keyup.enter="handleQuery"
          />
        </el-form-item>

        <!-- <el-form-item label="运行环境" prop="runEnvironment" style="width: 300px">
          <el-select
            class="dialogFormItemWidth"
            v-model="queryParams.runEnvironment"
            placeholder="请选择运行环境"
            clearable
            @clear="handleQuery"
            @change="handleQuery"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PROGRAM, true)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="正式环境信息" prop="proEnvironmentMessage" style="width: 300px">
          <el-select
            class="dialogFormItemWidth"
            v-model="queryParams.proEnvironmentMessage"
            placeholder="请选择正式环境信息"
            clearable
            @clear="handleQuery"
            @change="handleQuery"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WORKINGNODE, true)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item> -->

        <el-form-item>
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
          <!--  批量取消按钮-->
          <el-button type="danger" plain @click="handleBatchDelete">
            <Icon class="mr-5px" icon="ep:delete" />
            批量取消
          </el-button>
          <!-- 添加应用按钮 -->
          <el-button type="primary" @click="relateNewProgram">
            <Icon class="mr-5px" icon="ep:plus" />
            添加应用
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <ContentWrap :title="dialogTitle">
      <el-table
        :data="list"
        style="width: 100%"
        :border="false"
        :height="400"
        :header-cell-style="{ background: '#f2f6fc' }"
        v-loading="loading"
        key="table1"
        :show-overflow-tooltip="true"
        @selection-change="handleSelectionChange"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column
          label="应用名称"
          prop="typeName"
          align="center"
          :show-overflow-tooltip="false"
        />
        <el-table-column label="业务编码" prop="typeCode" align="center" />
        <!-- <el-table-column label="抓取数据说明" prop="grabText" :show-overflow-tooltip="false" /> -->
        <!-- <el-table-column label="运行环境" align="center">
          <template #default="scope">
            <div class="cell">
              <span
                :style="{
                  color: scope.row.runEnvironment == 'production' ? '#34C056' : '#606266'
                }"
                >{{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_PROGRAM, scope.row.runEnvironment) }}</span
              >
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="节点信息" prop="loginUserName" align="center">
          <template #default="scope">
            {{ scope.row.loginUserName || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          label="备注说明"
          prop="remark"
          align="center"
          :show-overflow-tooltip="false"
        >
          <template #default="scope">
            <span v-if="scope.row.remark" v-html="scope.row.remark"></span>
            <span v-else>--</span>
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
  </el-dialog>

  <!-- 添加应用 -->
  <UnRelatedProgramList ref="UnRelatedProgramListRef" @success="getList" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import UnRelatedProgramList from './unRelatedProgramList.vue'
import { Search } from '@element-plus/icons-vue'
import * as rpaApi from '@/api/rpaManage'
const message = useMessage() // 消息弹窗
import { ElMessageBox } from 'element-plus'
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
defineOptions({ name: 'RelatedProgramList' })

interface ProgramUserInfo {
  id: string // ID
  skName: string // 影刀程序名称
  grabText: string // 抓取数据说明
  devName: string // 开发人员
  runEnvironment: string // 运行环境
  serviceCode: string //业务code
}
const list = ref<ProgramUserInfo[]>([])
const loading = ref(false) // 列表的加载中

/** 打开弹窗 */
const open = async (paramName: string, id?: string, isCommonParam?: string) => {
  dialogVisible.value = true
  dialogTitle.value = paramName
  multipleSelection.value = []
  // 修改时，设置数据
  // console.log('接收到paramName', paramName)
  if (id) {
    formLoading.value = true
    try {
      // console.log('接收到id', id)
      queryParams.value.id = id
      queryParams.value.isCommonParam = isCommonParam
      getList()
    } finally {
      formLoading.value = false
    }
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/**
 * 多选
 */
const multipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val
}
/** 分页 */
const total = ref(10) // 列表的总页数
/** 查询字典类型列表 */
const getList = async () => {
  // console.log('查询参数', queryParams.value)
  loading.value = true
  try {
    queryParams.value.runEnvironment = queryParams.value.runEnvironment
      ? queryParams.value.runEnvironment
      : ''
    queryParams.value.proEnvironmentMessage = queryParams.value.proEnvironmentMessage
      ? queryParams.value.proEnvironmentMessage
      : ''
    const data = await rpaApi.getProgramListByParamId(queryParams.value).catch(() => {
      loading.value = false
    })
    list.value = data.records || []
    // console.log('--',list.value);
    total.value = data.total
  } finally {
    loading.value = false
  }
}
// 添加应用
const UnRelatedProgramListRef = ref()
const relateNewProgram = () => {
  if (UnRelatedProgramListRef.value) {
    UnRelatedProgramListRef.value.open(
      dialogTitle.value,
      queryParams.value.isCommonParam,
      queryParams.value.id
    )
  }
}
// 批量取消
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const handleBatchDelete = async () => {
  // 校验
  if (!multipleSelection.value || multipleSelection.value.length === 0) {
    message.warning('请选择要取消关联的应用！')
    return
  }
  try {
    ElMessageBox.confirm('是否取消关联选中的应用?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(async () => {
        const data = multipleSelection.value.map((item) => ({
          skTabulateId: item.id,
          skDynamicParamId: queryParams.value.id,
          isCommonParam: queryParams.value.isCommonParam
        }))
        // 发起取消
        await rpaApi.configUnbindProgram(data)
        message.success('取消关联成功！')
        // 发送操作成功的事件
        emit('success')
        // 刷新列表
        await getList()
      })
      .catch(() => {})
    // 取消的二次确认
  } catch {}
}

/** 搜索按钮操作 */
const queryFormRef = ref() // 搜索的表单
const queryParams = ref({
  id: '',
  skName: '',
  serviceCode: '',
  runEnvironment: '',
  proEnvironmentMessage: '',
  page: 1,
  size: 10,
  isCommonParam: ''
})
const handleQuery = () => {
  queryParams.value.page = 1
  // console.log('查询参数', queryParams.value)
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

// 在关闭对话框的时候让父组件刷新列表
const closeDialog = () => {
  emit('success')
}

/** 初始化 */
// onMounted(() => {
//   getList()
// })
</script>
