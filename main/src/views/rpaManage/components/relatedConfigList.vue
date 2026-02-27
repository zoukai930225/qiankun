<template>
  <el-dialog
    class="commomDialig realatedConfigList"
    v-model="dialogVisible"
    title="已关联参数"
    :destroy-on-close="true"
    :align-center="true"
    style="width: 1155px; border-radius: 14px"
  >
    <!-- 搜索工作栏 -->
    <div>
      <el-form
        ref="queryFormRef"
        :inline="true"
        :model="queryParams"
        class="-mb-15px"
        label-width="100px"
      >
        <el-form-item label="参数名称:" prop="paramName" style="width: 300px">
          <el-input
            class="dialogFormItemWidth"
            v-model="queryParams.paramName"
            placeholder="请输入参数名称"
            :suffix-icon="Search"
            clearable
            @clear="handleQuery"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="参数编码:" prop="paramKey" style="width: 300px">
          <el-input
            class="dialogFormItemWidth"
            v-model="queryParams.paramKey"
            placeholder="请输入参数编码"
            :suffix-icon="Search"
            clearable
            @clear="handleQuery"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="参数值:" prop="paramValue" style="width: 300px">
          <el-input
            class="dialogFormItemWidth"
            v-model="queryParams.paramValue"
            :suffix-icon="Search"
            placeholder="请输入参数值"
            clearable
            @clear="handleQuery"
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="运行环境" prop="paramsEnvironment" style="width: 300px">
          <el-select
            class="dialogFormItemWidth"
            v-model="queryParams.paramsEnvironment"
            placeholder="请选择"
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
        </el-form-item>
        <el-form-item label="是否公共参数" prop="isCommonParam" style="width: 300px">
          <el-select
            class="dialogFormItemWidth"
            v-model="queryParams.isCommonParam"
            placeholder="请选择"
            clearable
            @clear="handleQuery"
            @change="handleQuery"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <!-- 操作按钮的部分保持不变 -->
        <el-form-item>
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
          <!-- <el-button @click="handleQuery" class="mr-10px" type="primary">
            <Icon class="mr-5px" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="mr-10px">
            <Icon class="mr-5px" icon="ep:refresh" />
            重置
          </el-button> -->
          <el-button type="danger" plain @click="handleBatchDelete">
            <Icon class="mr-5px" icon="ep:delete" />
            批量取消
          </el-button>
          <el-button class="mr-10px" type="primary" @click="openForm('create')">
            新增参数
          </el-button>
          <el-button class="mr-10px" type="primary" @click="openChooseCommonParam">
            选择公共参数
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <ContentWrap :title="dialogTitle">
      <el-table
        :data="list"
        style="width: 100%"
        :header-cell-style="{ background: '#f2f6fc' }"
        :border="false"
        :height="400"
        v-loading="loading"
        :show-overflow-tooltip="true"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="selectable" />
        <el-table-column
          label="参数名称"
          prop="paramName"
          align="center"
          :show-overflow-tooltip="false"
        />
        <el-table-column label="参数编码" prop="paramKey" align="center" />
        <el-table-column label="参数值" prop="paramValue" align="center" />

        <el-table-column label="运行环境" align="center">
          <template #default="scope">
            <div class="cell">
              <span
                :style="{
                  color: scope.row.paramsEnvironment == 'production' ? '#34C056' : '#606266'
                }"
                >{{
                  getDictLabel(DICT_TYPE.SYSTEM_PARAM_PROGRAM, scope.row.paramsEnvironment)
                }}</span
              >
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否公共参数" align="center">
          <template #default="scope">
            {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_WHETHER, scope.row.isCommonParam) }}
          </template>
        </el-table-column>
        <el-table-column label="应用数量" prop="skCount" width="90px" align="center" />
        <el-table-column label="备注说明" :show-overflow-tooltip="false">
          <template #default="scope">
            {{ scope.row.explanation || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150px" align="center">
          <template #default="scope">
            <div v-if="scope.row.isCommonParam !== '1'">
              <el-button text type="primary" @click="removePrivateParam(scope.row.id)"
                >移除</el-button
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
  </el-dialog>

  <!-- 新增参数弹窗 -->
  <ConfigForm ref="configFormRef" @success="getList" />
  <!-- 选择公共参数弹窗 -->
  <ChooseCommonParam ref="chooseCommonParamRef" @choose-common-param="chooseCommonParam" />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { Search } from '@element-plus/icons-vue'
import ConfigForm from './ConfigForm.vue'
import ChooseCommonParam from './chooseCommonParam.vue'
import * as rpaApi from '@/api/rpaManage'
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
defineOptions({ name: 'RelatedConfigList' })
const message = useMessage() // 消息弹窗
const queryParams = ref({
  page: 1,
  size: 10,
  serviceCode: '',
  paramsEnvironment: '',
  paramName: '',
  paramKey: '',
  paramValue: '',
  isCommonParam: '',
  typeId: ''
})

const selectable = (row) => row.isCommonParam === '1'

const multipleSelection = ref([]) // 多选的列表
const handleSelectionChange = (val: any) => {
  multipleSelection.value = val
}

/** 打开弹窗 */
const open = async (skName: string, serviceCode?: string, typeId?: string) => {
  // console.log('serviceCode', serviceCode)
  dialogVisible.value = true
  dialogTitle.value = skName
  // formType.value = type
  // 修改时，设置数据

  loading.value = true
  try {
    queryParams.value.serviceCode = serviceCode || ''
    queryParams.value.typeId = typeId || ''
    getList()
  } finally {
    loading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const list = ref<any[]>([])
/** 查询字典类型列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await rpaApi.getProgramConfigList(queryParams.value).catch(() => {
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

const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

const loading = ref(false) // 列表的加载中
const total = ref(10) // 列表的总页数

const queryFormRef = ref() // 搜索的表单
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

// 新增参数
const configFormRef = ref()
const openForm = (type: string) => {
  if (configFormRef.value) {
    configFormRef.value.open(type, undefined, true, queryParams.value.typeId)
  }
}

// 选择公共参数
const chooseCommonParamRef = ref()
const openChooseCommonParam = () => {
  if (chooseCommonParamRef.value) {
    console.log('打开前的请求参数', queryParams.value)
    chooseCommonParamRef.value.open(queryParams.value.typeId)
  }
}

/** 选择公共参数 */
const chooseCommonParam = (commonParam: any) => {
  console.log('选择公共参数', commonParam)
  console.log('此时的请求参数', queryParams.value)

  getList()
}

const handleBatchDelete = async () => {
  console.log('批量取消关联的公共参数', multipleSelection.value)
  // 校验
  if (!multipleSelection.value || multipleSelection.value.length === 0) {
    message.warning('请选择要取消关联的公共参数！')
    return
  }
  try {
    ElMessageBox.confirm('是否取消关联选中的公共参数?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(async () => {
        // 发起取消
        console.log('取消关联的公共参数', multipleSelection.value)

        let data = []
        data = multipleSelection.value.map((item: any) => {
          return {
            isCommonParam: item.isCommonParam,
            skDynamicParamId: item.id,
            skTabulateId: queryParams.value.typeId
          }
        })

        await rpaApi.unbindApplicationType(data)
        message.success('取消关联成功！')
        // 刷新列表
        await getList()
        // 发送操作成功的事件
        // emit('success')
      })
      .catch(() => {})
    // 取消的二次确认
  } catch {}
}

const removePrivateParam = async (id: string) => {
  console.log('移除私有参数', id)
  try {
    ElMessageBox.confirm('是否移除该私有参数?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        // 发起移除
        console.log('移除私有参数', id)
        await rpaApi.removePrivateParam(id)
        message.success('移除成功！')
        // 刷新列表
        await getList()
      })
      .catch(() => {})
    // 移除的二次确认
  } catch {}
}

/** 初始化 */
// onMounted(() => {
//   getList()
// })
</script>
