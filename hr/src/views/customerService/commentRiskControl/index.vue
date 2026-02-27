<template>
  <ContentWrap>
    <div class="mb-5px">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="mb-5px"
            label-width="78px"
          >
            <el-form-item label="店铺" prop="storeCode">
              <StoreRangePlus
                v-model="queryParams.storeCode"
                @change="getList"
                placeholder="请选择店铺"
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
      <el-table-column label="店铺" prop="storeName" min-width="220">
        <template #default="scope">
          <div class="row flex">
            <span style="align-self: center">{{ scope.row.storeName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="中差评总数" prop="totalCount" min-width="180" align="center">
        <template #default="scope">
          <el-tag effect="light" round type="danger">
            <span class="row" style="color: #333">
              {{ scope.row.totalCount }}
            </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="待处理" prop="pendingCount" min-width="180" align="center">
        <template #default="scope">
          <el-tag effect="light" round type="warning">
            <span class="row" style="color: #333">
              {{ scope.row.pendingCount }}
            </span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="已处理" prop="processedCount" min-width="180" align="center">
        <template #default="scope">
          <el-tag effect="light" round type="success">
            <span class="row" style="color: #333">
              {{ scope.row.processedCount }}
            </span>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        :show-overflow-tooltip="false"
        fixed="right"
        width="300"
        align="center"
      >
        <template #default="scope">
          <el-button type="primary" @click="openForm('detail', scope.row.store)" link>
            查看详情
          </el-button>
          <el-button type="primary" @click="openForm('update', scope.row.store)" link>
            编辑
          </el-button>
          <el-button type="danger" @click="handleDelete(scope.row.store)" link> 删除 </el-button>
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
  <!-- 表单抽屉 -->
  <editInfoDrawer ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import * as commentApi from '@/api/customerService/comment'

import editInfoDrawer from './components/editInfoDrawer.vue'
const router = useRouter()

const appStore = useAppStore()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  storeCode: ''
})

const addList = ref([
  {
    label: '新增',
    code: 'add'
  }
])
// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = (value: any) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openForm('create', '')
    }
  }
}

/** 操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (type === 'detail') {
    router.push({ name: 'commentDetail', query: { id } })
  } else {
    if (formRef.value) {
      formRef.value.open(type, id)
    }
  }
}

const queryFormRef = ref() // 搜索的表单
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value.storeCode = ''
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await commentApi.getCommentList(queryParams.value).catch((err: {}) => {
      console.log(err)
    })
    list.value = data.records
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 删除按钮操作 */
const handleDelete = async (store: string) => {
  try {
    // 删除的二次确认
    await message.confirm('删除店铺将清除当前店铺下分配的数据，是否确定删除？')
    // 发起删除
    await commentApi.deleteComment({ store })
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

<style lang="less" scoped></style>
