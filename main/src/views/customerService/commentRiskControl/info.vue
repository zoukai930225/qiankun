<template>
  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="mb-5px"
            label-width="78px"
            @submit.prevent
          >
            <el-form-item label="关键词" prop="queryParam">
              <el-input
                v-model="queryParams.queryParam"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入关键词"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                class="!w-200px"
                :empty-values="[null, undefined]"
                :value-on-clear="undefined"
                v-model="queryParams.status"
                placeholder="请选择处理状态"
                clearable
                @clear="handleQuery"
                @change="handleQuery"
              >
                <el-option label="全部" value="" />
                <el-option label="待处理" value="0" />
                <el-option label="已处理" value="1" />
              </el-select>
            </el-form-item>
            <el-form-item label="评论日期" prop="dateRange">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                unlink-panels
                range-separator="-"
                start-placeholder="请选择日期"
                end-placeholder="请选择日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
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
            <el-button
              type="primary"
              style="margin-left: 30px"
              @click="batchHandler"
              :disabled="multiSelection.length === 0"
            >
              <Icon class="commonSearchBtnIcon" :size="14" icon="ep:checked" />
              处理完成
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      row-class-name="commonTableRow"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="评论日期" prop="date" min-width="120">
        <template #default="scope">
          {{ scope.row.date }}
        </template>
      </el-table-column>
      <el-table-column label="店铺名称" prop="storeName" min-width="120" align="center">
        <template #default="scope">
          {{ scope.row.storeName }}
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="orderNo" min-width="120" align="center">
        <template #default="scope">
          {{ scope.row.orderNo }}
        </template>
      </el-table-column>
      <el-table-column label="评论内容" prop="commentContent" min-width="300" header-align="center">
        <template #default="scope">
          {{ scope.row.commentContent }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" min-width="80" align="center">
        <template #default="scope">
          <el-tag effect="light" round :type="scope.row.status === 0 ? 'warning' : 'success'">
            <span class="row" style="color: #333">
              {{ scope.row.status ? '已处理' : '待处理' }}
            </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="处理时间" prop="disposeTime" min-width="120" align="center">
        <template #default="scope">
          {{ scope.row.disposeTime || '-' }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>
  </ContentWrap>
</template>

<script lang="ts" setup>

import { useAppStore } from '@/store/modules/app'
import { Search } from '@element-plus/icons-vue'
import * as commentApi from '@/api/customerService/comment'

const route = useRoute()
const appStore = useAppStore()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  store: '' as any,
  userId: '' as any,
  queryParam: '',
  startDate: '',
  endDate: '',
  status: ''
})
const dateRange = ref<any[]>([])
const queryFormRef = ref() // 搜索的表单

/** 时间选择 监听 拆分 */
watch(
  () => dateRange.value,
  (newVal) => {
    console.log('监听数据', newVal)
    if (newVal && newVal.length > 0) {
      queryParams.value.startDate = newVal[0]
      queryParams.value.endDate = newVal[1]
    } else {
      queryParams.value.startDate = ''
      queryParams.value.endDate = ''
    }
    getList()
  }
)

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id)
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value.queryParam = ''
  dateRange.value = []
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await commentApi.queryComments(queryParams.value).catch((err: {}) => {
      console.log(err)
    })
    list.value = data.records.map((item: any) => ({
      commentContent: item.commentContent,
      date: item.date,
      id: item.id,
      orderNo: item.orderNo,
      status: parseInt(item.status),
      storeName: item.storeName,
      disposeTime: item.disposeTime
    }))
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 批量处理 */
const multiSelection = ref<any[]>([])
//处理表格多选
const handleSelectionChange = (val: []) => {
  console.log('val', val)
  multiSelection.value = val
}
const batchHandler = async () => {
  if (multiSelection.value.length === 0) {
    // 未选择
    message.warning('请先选择至少一条数据')
  } else {
    const params = multiSelection.value.map((item: any) => item.id)
    await commentApi.disposeComment(params).catch((err: {}) => {
      console.log(err)
    })
    message.success('评论内容已处理完成')
    getList()
  }
}
//
// const selectable = (row: any) => row.status === 0

/** 初始化 **/
onMounted(() => {
  // 获取路由传参
  queryParams.value.userId = route.query.id
  queryParams.value.store = route.query.store
  getList()
})
</script>

<style lang="less" scoped></style>
