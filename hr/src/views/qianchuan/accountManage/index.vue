<template>
  <div class="commonTopFilterWrap accountManageWrap">
    <div class="commonTopFilterWrap-filter">
      <el-form ref="queryFormRef" inline :model="queryParams">
        <el-form-item label="渠道:" prop="channel">
          <el-select
            class="queryFormItemWidth"
            style="width: 220px"
            v-model="queryParams.channel"
            placeholder="请选择"
            clearable
            filterable
            value-on-clear=""
            @change="handleChangeChannel"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="店铺:" prop="store">
          <el-select
            v-model="queryParams.store"
            clearable
            filterable
            value-on-clear=""
            class="searchFormItemWidth"
          >
            <el-option
              v-for="item in storeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="千川账号:" prop="account">
          <el-input
            value-on-clear=""
            class="searchFormItemWidth"
            v-model="queryParams.account"
            placeholder="请输入"
            clearable
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
        <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
          重置
        </el-button>
        <el-button @click="openDrawer('create', undefined)" type="primary">
          <el-icon style="margin-right: 5px"><Plus /></el-icon>
          新增
        </el-button>
        <!-- <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" /> -->
      </div>
    </div>
  </div>

  <div class="table-wrapper">
    <list-table
      :list="list"
      :total="total"
      :loading="loading"
      @update="handleUpdate"
      @delete="handleDelete"
    />
    <div class="pagination">
      <!-- 分页 -->
      <Pagination
        v-model:limit="queryParams.size"
        v-model:page="queryParams.page"
        :total="total"
        @pagination="getList"
      />
    </div>
    <!-- 新增编辑抽屉 -->
    <AddDrawer ref="addDrawerRef" @success="getList" />
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'AccountManage' })
import AddDrawer from './components/addDrawer.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as QcApi from '@/api/qianchuan'
import listTable from './components/listTable.vue'
import { ref } from 'vue'
const { t } = useI18n()
const message = useMessage() // 消息弹窗

// 查询参数
const queryFormRef = ref()
const queryParams = ref<any>({
  size: 10,
  page: 1,
  channel: '',
  store: '',
  account: ''
})

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

// 列表数据
const loading = ref(false) // 加载状态
const total = ref(0)
const list = ref<any>([])
const getList = async () => {
  try {
    loading.value = true

    // console.log('查询条件', queryParams.value)
    const params = { ...queryParams.value }
    const res = await QcApi.getQcAccountList(params)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

// 打开新增编辑抽屉
const addDrawerRef = ref()
const openDrawer = (type, id) => {
  addDrawerRef.value?.open(type, id)
}

// 编辑事件
const handleUpdate = (id: any) => {
  openDrawer('update', id)
}
// 删除事件
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await QcApi.deleteQcAccount(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

// 渠道变化时的处理
const handleChangeChannel = () => {
  queryParams.value.store = '' // 清空店铺
  storeList.value = [] // 清空店铺列表
  const channel = queryParams.value.channel
  if (!channel) return
  // 根据渠道获取店铺列表
  getStoreList(channel)
}

// 根据渠道获取店铺列表
const storeList = ref<any[]>([]) // 店铺列表
const getStoreList = async (channel) => {
  const res = await QcApi.getQcAccountStoreByChannel({ channelCode: channel })
  storeList.value = res || []
}
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
// 查询条件
.accountManageWrap {
  background-color: #fff;
  padding: 20px 20px 0 20px;
  border-radius: 12px 12px 0 0;
  min-width: 1000px;
  .dropdown-button {
    height: 32px;
    line-height: 32px;
    border: 1px solid #dcdfe6;
    border-right: none;
    padding: 0 10px;
    border-radius: 4px 0 0 4px;
    .compare-icon {
      cursor: pointer;
      vertical-align: middle;
    }
  }
}
:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
}

:deep(.longlabel .el-form-item--default .el-form-item__label) {
  // line-height: 1.5;
}

:deep(.el-form--inline .el-form-item) {
  // margin-right: 16px;
}

// 表格样式
.table-wrapper {
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
  border-radius: 0 0 12px 12px;
}

// 分页
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>
