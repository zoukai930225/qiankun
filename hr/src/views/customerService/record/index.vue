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
          >
            <el-form-item label="店铺" prop="store">
              <StoreRangePlus
                v-model="queryParams.store"
                @change="getList"
                placeholder="请选择店铺"
              />
            </el-form-item>
            <el-form-item label="名称" prop="groupName">
              <el-input
                v-model="queryParams.groupName"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入名称"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
            <el-form-item label="类别" prop="groupCategory">
              <el-select
                class="!w-200px"
                v-model="queryParams.groupCategory"
                placeholder="请选择类别"
                clearable
                @clear="handleQuery"
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.CUSTOMER_CATEGORY, true)"
                  :key="dict.code"
                  :label="dict.label"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="客服名称" prop="name">
              <el-input
                v-model="queryParams.name"
                class="searchFormItemWidth"
                :prefix-icon="Search"
                clearable
                placeholder="请输入客服名称"
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
      <el-table-column label="店铺" prop="storeName" min-width="250">
        <template #default="scope">
          <div class="row text1">
            {{ scope.row.storeName || '全渠道' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="名称" prop="groupName" min-width="210">
        <template #default="scope">
          <div class="row">
            {{ scope.row.groupName || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="类别" prop="groupCategory" min-width="120">
        <template #default="scope">
          {{ getDictLabel(DICT_TYPE.CUSTOMER_CATEGORY, scope.row.groupCategory) || '--' }}
        </template>
      </el-table-column>
      <el-table-column label="是否二线" prop="isSecond" min-width="100">
        <template #default="scope">
          <div class="row">
            {{ scope.row.isSecond === '1' ? '是' : '否' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="组长" prop="name" min-width="200">
        <template #default="scope">
          <div class="row-center" v-if="scope.row.name">
            <CustomerServicePeople
              :data="{ name: scope.row.name, avatarOrigin: scope.row.avatarOrigin }"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="人数" prop="teamDetailCount" min-width="100" />

      <el-table-column label="操作按钮" :show-overflow-tooltip="false" fixed="right" width="150">
        <template #default="scope">
          <el-button type="primary" :icon="Edit" @click="openForm('update', scope.row.id)" link>
            编辑
          </el-button>
          <el-button type="danger" :icon="Delete" @click="handleDelete(scope.row.id)" link>
            删除
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
  <!-- 表单抽屉 -->
  <DrawerAddInfo ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
// defineOptions({ name: 'PlatformLogin' })
import { useAppStore } from '@/store/modules/app'
import { Search, Delete, Edit } from '@element-plus/icons-vue'
import CustomerServicePeople from '@/views/customerService/components/people.vue'
import DrawerAddInfo from './components/DrawerAddInfo.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import * as CustomerServiceRecordApi from '@/api/customerService/record'

const appStore = useAppStore()

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref({
  page: 1,
  size: 10,
  store: '',
  groupName: '',
  groupCategory: '',
  name: ''
})
const queryFormRef = ref() // 搜索的表单

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
      openForm('create', '')
    }
  }
}

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
  queryParams.value.store = ''
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await CustomerServiceRecordApi.getList(queryParams.value).catch(() => {})
    // 给每一项添加一个showPassword属性
    list.value = (data.records || []).map((item) => {
      return {
        ...item
      }
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await CustomerServiceRecordApi.deleteById(id)
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

<style lang="less" scoped>
.test-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  width: 100%;
  height: 100%;
  // padding: 11px;
  box-sizing: border-box;
  // background-color: #f2f6fc;
  background-color: #fff;
}
.header-wrapper {
  background-color: #fff;
  padding: 16px 20px;
  box-sizing: border-box;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  &-title {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 0 0 16px 0;
  }
}
</style>
