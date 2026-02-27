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
            <el-form-item label="评论专员" prop="userName">
              <el-input
                v-model="queryParams.userName"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入评论专员"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
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
    </div>

    <!-- 列表 -->
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      row-class-name="commonTableRow"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="评论专员" prop="userName" min-width="200">
        <template #default="scope">
          <div class="row-center" v-if="scope.row.userName">
            <CustomerServicePeople
              :data="{ name: scope.row.userName, avatarOrigin: scope.row.avatarOrigin }"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="待处理" prop="pendingCount" min-width="120" align="center">
        <template #default="scope">
          <el-tag effect="light" round type="warning">
            <span class="row" style="color: #333">
              {{ scope.row.pendingCount }}
            </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="已处理" prop="processedCount" min-width="120" align="center">
        <template #default="scope">
          <el-tag effect="light" round type="success">
            <span class="row" style="color: #333">
              {{ scope.row.processedCount }}
            </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="完成率" prop="completionRate" min-width="120" align="center">
        <template #default="scope">
          <el-tag effect="light" round type="primary">
            <span class="row" style="color: #333">
              {{ scope.row.completionRate }}
            </span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        :show-overflow-tooltip="false"
        fixed="right"
        width="150"
        align="center"
      >
        <template #default="scope">
          <el-button type="primary" @click="openForm('info', scope.row.userId)" link>
            评论信息
          </el-button>
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
import CustomerServicePeople from '@/views/customerService/components/people.vue'
import * as commentApi from '@/api/customerService/comment'
const router = useRouter()
const appStore = useAppStore()
const route = useRoute()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  store: '' as any,
  userName: ''
})
const queryFormRef = ref() // 搜索的表单

/** 操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (type === 'info') {
    router.push({ name: 'commentInfo', query: { id, store: queryParams.value.store } })
  }
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
  queryParams.value.userName = ''
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await commentApi.queryDetailsComment(queryParams.value).catch((err: {}) => {
      console.log(err)
    })
    list.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  // 获取路由传参
  let store = route.query.id
  queryParams.value.store = store
  getList()
})
</script>

<style lang="less" scoped></style>
