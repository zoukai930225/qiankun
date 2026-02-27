<template>
  <div class="commonTopFilterWrap costAllocationWrap">
    <div class="commonTopFilterWrap-filter">
      <el-form ref="queryFormRef" inline :model="queryParams" label-width="100">
        <el-form-item label="渠道" prop="channel">
          <el-select
            style="width: 200px"
            v-model="queryParams.channel"
            placeholder="请选择"
            value-on-clear=""
            clearable
            filterable
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
        <el-form-item label="账号归属店铺" prop="store">
          <el-select
            v-model="queryParams.store"
            clearable
            filterable
            value-on-clear=""
            style="width: 200px"
            @change="handleQuery"
          >
            <el-option
              v-for="item in storeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <!-- <StoreRangePlus v-model="queryParams.store" @change="getList" placeholder="请选择店铺" /> -->
        </el-form-item>
        <el-form-item label="千川账号" prop="account">
          <el-input
            value-on-clear=""
            style="width: 200px"
            v-model="queryParams.account"
            placeholder="请输入"
            clearable
            @keydown.enter="searchInput"
            @clear="searchInput"
            @change="searchInput"
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select
            style="width: 200px"
            v-model="queryParams.type"
            placeholder="请选择"
            clearable
            value-on-clear=""
            @change="handleQuery"
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.DOUYIN_PROMOTION_TYPE, true)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <div v-if="isExpand">
          <el-form-item label="开始日期" prop="beginDate">
            <el-date-picker
              style="width: 200px"
              v-model="queryParams.beginDate"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择开始时间"
              @change="handleChangeStartDate"
            />
          </el-form-item>
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
              style="width: 200px"
              v-model="queryParams.endDate"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择结束时间"
              @change="handleChangeEndDate"
            />
          </el-form-item>
          <el-form-item label="来源平台" prop="orgType">
            <el-select style="width: 200px" v-model="queryParams.orgType" placeholder="请选择" value-on-clear=""
              filterable @change="handleQuery">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.ORG_TYPE, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </div>
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
        <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
      </div>
    </div>
  </div>
  <div class="table-wrapper">
    <div>
      <el-checkbox
        v-model="queryParams.onlyEffective"
        @change="getList"
        :true-value="'1'"
        :false-value="'0'"
        label="只看有效"
        size="large"
        color="#0064ff"
      />
    </div>
    <list-table
      :list="list"
      :total="total"
      :loading="loading"
      @update="handleUpdate"
      @delete="handleDelete"
      @expire="handleExpire"
      @detail-view="handleDetailDialog"
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

    <!-- 明细查看 -->
    <detailDialog ref="detailDialogRef" />
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'CostAllocation' })
import AddDrawer from './components/addDrawer.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as QcApi from '@/api/qianchuan'
import listTable from './components/listTable.vue'
import detailDialog from './components/detailDialog.vue'
import { ref } from 'vue'
import dayjs from 'dayjs'
import { debounce } from 'lodash-es'
const message = useMessage() // 消息弹窗
const { t } = useI18n()
// 查询参数
const queryFormRef = ref()
const queryParams = ref<any>({
  size: 10,
  page: 1,
  onlyEffective: '1',
  channel: '',
  store: '',
  account: '',
  type: '',
  beginDate: '', // 开始日期
  endDate: '', // 结束日期
  orgType: '0' ,// 来源平台
})
const isExpand = ref(false)
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

// 设置默认日期范围为昨天
// const yesterday = dayjs().subtract(1, 'day')
// const startOfYesterday = yesterday.startOf('day').format('YYYY-MM-DD')
// const endOfYesterday = yesterday.endOf('day').format('YYYY-MM-DD')
const handleChangeStartDate = (val) => {
  if (!val) {
    handleQuery()
    return
  }
  const endDate = queryParams.value.endDate
  if (new Date(endDate).getTime() <= new Date(val).getTime() - 8.64e7) {
    queryParams.value.beginDate = ''
    return message.confirm('开始时间不能大于结束时间')
  } else {
    handleQuery()
  }
}
const handleChangeEndDate = (val) => {
  if (!val) {
    handleQuery()
    return
  }
  const startDate = queryParams.value.beginDate
  if (new Date(val).getTime() <= new Date(startDate).getTime() - 8.64e7) {
    queryParams.value.endDate = ''
    return message.confirm('结束时间不能小于开始时间')
  } else {
    handleQuery()
  }
}

// 列表数据
const loading = ref(false) // 加载状态
const total = ref(0)
const list = ref<any>([])
const getList = async () => {
  try {
    loading.value = true

    const params = { ...queryParams.value }
    const res = await QcApi.getQcAccountAssignList(params)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

// 查看详情
const detailDialogRef = ref()
const handleDetailDialog = (account, type) => {
  detailDialogRef.value?.open(account, type)
}

// 新购
const addDrawerRef = ref()
const openDrawer = (type, id) => {
  addDrawerRef.value?.open(type, id)
}

// 编辑
const handleUpdate = (id: any) => {
  openDrawer('update', id)
}
// 删除
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await QcApi.deleteQcAccountAssign(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

// 到期事件
const handleExpire = async (id: any) => {
  try {
    // 发起到期
    await QcApi.setExpireQcAccountAssign(id)
    message.success('设置到期成功')
    // 刷新列表
    await getList()
  } catch {}
}

const handleChangeChannel = () => {
  queryParams.value.store = '' // 清空店铺
  storeList.value = [] // 清空店铺列表
  const channel = queryParams.value.channel
  handleQuery()
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

const searchInput = debounce(async () => {
    handleQuery()
}, 1000)
</script>

<style lang="scss" scoped>
// 查询条件
.costAllocationWrap {
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
:deep(.el-form--inline .el-form-item) {
  margin-right: 10px;
}

// 表格样式
.table-wrapper {
  background: #fff;
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
  border-radius: 0 0 12px 12px;
}

// 分页
.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background: #0064ff !important;
  border: 1px solid #0064ff !important;
}
:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #0064ff !important;
}
</style>
