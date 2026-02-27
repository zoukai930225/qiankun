<template>
  <div class="">
    <el-dialog
      class="commomDialig chooseTeam"
      v-model="dialogVisible"
      destroy-on-close
      :close-on-click-modal="!submitLoading"
    >
      <template #header>
        <div class="chooseTeam-title"> 选择应用 </div>
      </template>
      <div style="padding: 0 20px">
        <div class="commonTopFilterWrap mt-1">
          <div class="commonTopFilterWrap-filter">
            <el-form
              ref="queryFormRef"
              :inline="true"
              :model="queryParams"
              class="-mb-15px"
              @submit.prevent
            >
              <el-form-item label="关键词" prop="keyword">
                <el-input
                  v-model="queryParams.keyword"
                  clearable
                  placeholder="请输入应用名称/编码"
                  style="width: 220px"
                />
              </el-form-item>
              <!-- <el-form-item label="应用类型编码" prop="typeCode">
            <el-input
              v-model="queryParams.typeCode"
              clearable
              placeholder="请输入"
              @clear="getList"
              @keyup.enter="getList"
              style="width: 160px"
            />
          </el-form-item> -->
              <el-form-item label="数据库表名" prop="typeDbName">
                <el-input
                  v-model="queryParams.typeDbName"
                  clearable
                  placeholder="请输入"
                  style="width: 220px"
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
            </div>
          </div>
        </div>
        <el-table
          :data="tableData"
          height="348px"
          :header-cell-style="{ background: '#F2F6FC' }"
          @selection-change="handleSelectionChange"
          class="table-style SWCommonTable"
          v-horizontal-scroll="'always'"
          v-loading="loading"
          element-loading-text="数据加载中..."
          show-overflow-tooltip
        >
          <el-table-column type="selection" width="55" />
          <el-table-column label="应用名称" prop="name" />
          <!-- <el-table-column label="应用编码" prop="code" /> -->
          <el-table-column label="店铺" prop="storeCode">
            <template #default="scope">
              {{ scope.row.storeCode || '--' }}
            </template>
          </el-table-column>
          <el-table-column label="数据库表名" prop="typeDbName">
            <template #default="scope">
              {{ scope.row.typeDbName || '--' }}
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template #footer>
        <el-button :disabled="submitLoading" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSave">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import * as rpaApi from '@/api/rpaManage'
const dialogVisible = ref(false)
const emits = defineEmits(['close'])
const formLoading = ref(false)

const tableData = ref([])
const searchValue = ref('')
const echelon = ref('')

const typeDbName = ref('')

const queryParams = ref({
  // name: '',
  // typeCode: '',
  page: 1,
  pageSize: 99999,
  typeDbName: '',
  keyword: ''
})

/** 表单搜索 */
const queryFormRef = ref()
const handleQuery = () => {
  getList()
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 打开弹窗 */
const open = async (type) => {
  dialogVisible.value = true
  echelon.value = type
  await getList()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 获取数据
const loading = ref(false)
const getList = async () => {
  loading.value = true
  tableData.value = []
  try {
    const data = await rpaApi.getApplicationListNew(queryParams.value)
    tableData.value = data.records
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

// 选中信息
const emitData = ref<any>([])
const selectedData = ref([])
const handleSelectionChange = (val: any) => {
  selectedData.value = val
}

// 保存选中信息
const submitLoading = ref(false)
const handleSave = async () => {
  emitData.value = []
  // 请求新的接口去获得状态等信息 并更新到emitData中
  try {
    submitLoading.value = true
    const data = await rpaApi.getGroupListInfo(selectedData.value)

    data.map((item) => {
      emitData.value.push({
        ...item,
        echelon: echelon.value
      })
    })
    // console.log('emitData', emitData.value)
    emits('close', emitData.value)

    dialogVisible.value = false
  } finally {
    submitLoading.value = false
  }
}
</script>
<style lang="scss">
.chooseTeam {
  width: 960px;
  height: 536px;
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
.chooseTeam-title {
  color: #333333;
  font-weight: 600;
  margin-bottom: 7px;
}
// 搜索框
.search-box {
  .search-label {
    font-family: AlibabaPuHuiTi_2_55_Regular;
    font-size: 14px;
    color: #666666;
    margin-right: 10px;
  }
}
// 表格
.table-style {
  width: 100%;
  background: transparent;
  margin-top: 20px;
}
// 表格变成透明背景
:deep(.el-table tr) {
  background: transparent;
}
/* 去掉table 最底部的线 */
:deep(.table-style .el-table__inner-wrapper::before) {
  background-color: transparent;
}
</style>
