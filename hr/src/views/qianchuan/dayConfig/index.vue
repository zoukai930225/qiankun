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
            label-width="auto"
          >
            <el-form-item label="渠道" prop="channel" style="margin-right: 20px">
              <el-select
                style="width: 200px"
                v-model="queryParams.channel"
                placeholder="请选择"
                clearable
                value-on-clear=""
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
            <el-form-item label="账号归属店铺" prop="store" style="margin-right: 20px">
              <el-select
                v-model="queryParams.store"
                style="width: 200px"
                clearable
                filterable
                value-on-clear=""
                @change="handleStoreChange"
              >
                <el-option
                  v-for="item in storeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="千川账号" prop="account" style="margin-right: 20px">
              <el-input
                style="width: 200px"
                value-on-clear=""
                v-model.trim="queryParams.account"
                placeholder="请输入"
                clearable
                @keydown.enter="searchInput"
                @clear="searchInput"
                @change="searchInput"
              />
            </el-form-item>
            <div v-if="isExpand">
              <el-form-item label="类型" prop="type" style="margin-right: 20px">
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
              <el-form-item label="日期" prop="day" style="margin-right: 20px">
                <el-date-picker v-model="queryParams.deadline" type="date" :clearable="true" style="width: 200px"  @change="handleQuery" placeholder="请选择"/>
              </el-form-item>
              <el-form-item label="来源平台" prop="orgType">
                <el-select style="width: 200px" v-model="queryParams.orgType" placeholder="请选择"
                  value-on-clear="" filterable @change="handleQuery">
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
            <el-button type="primary" @click="openForm('add')">
              <el-icon> <Plus :size="12" style="margin-right: 3px" /> </el-icon>新增
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" :isExpand="isExpand"
              @expand-click="isExpand = !isExpand">
              重置
            </el-button>
            <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
          </div>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <div>
      <el-table
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :show-overflow-tooltip="true"
        row-class-name="commonTableRow"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column label="渠道" prop="channel" width="120" fixed="left" />
        <el-table-column label="店铺" prop="store" min-width="180" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.store || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="千川账号" prop="account" width="180" align="right">
          <template #default="scope">
            <div class="underLine" @click="showDetail(scope.row)" v-if="scope.row.account">{{
              scope.row.account
            }}</div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="typeName" min-width="120">
          <template #default="scope">
            {{ scope.row.typeName || '-' }}
          </template>
        </el-table-column>
        <el-table-column prop="orgType" label="来源平台" width="120" show-overflow-tooltip :formatter="(row) => getDictLabel(DICT_TYPE.ORG_TYPE,row.orgType)||'-'"/>
        <el-table-column label="消耗" prop="cost" min-width="120" align="right">
          <template #default="scope">
            {{
              scope.row.cost
                ? scope.row.countType == 1
                  ? '+' + numberFormateShow(scope.row.cost)
                  : '-' + numberFormateShow(scope.row.cost)
                : '-'
            }}
          </template>
        </el-table-column>
        <el-table-column label="开始日期" prop="beginDate" width="120" />
        <el-table-column label="截止日期" prop="endDate" width="120" />
        <el-table-column label="备注" prop="remark" min-width="150" show-overflow-tooltip>
          <template #default="scope">
            {{ scope.row.remark || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <div v-if="scope.row.id">
              <el-button type="primary" link @click="openForm('edit', scope.row.id)"
                >修改</el-button
              >
              <el-button type="danger" link @click="handleDelete(scope.row.id)">删除</el-button>
            </div>
            <span v-else>-</span>
            <!-- <el-button type="primary" link @click="setExpire(scope.row.id)" :disabled="isExpeired(scope.row)">{{
              isExpeired(scope.row) ?'已过期':'过期' }}</el-button> -->
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty">
            <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
            <span>暂无数据</span>
          </div>
        </template>
      </el-table>
    </div>
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
  <!-- 新增编辑 -->
  <formDrawer ref="formRef" @success="getList" />
  <!-- 详情展示 -->
  <AccountDetail ref="accountDetailRef" />
</template>

<script lang="ts" setup>
defineOptions({ name: 'QianchuanDayConfig' })
import formDrawer from './components/formDrawer.vue'
import { useAppStore } from '@/store/modules/app'
import dayjs from 'dayjs'

import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { numberFormateShow } from '@/utils/formatter'
import * as QcApi from '@/api/qianchuan'
import * as QcDayApi from '@/api/qianchuanDay/index'
import { debounce } from 'lodash-es'
import AccountDetail from '@/views/qianchuan/costAllocation/components/detailDialog.vue'
const appStore = useAppStore()

const message = useMessage() // 消息弹窗
const isExpand = ref(true)

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const queryParams = ref({
  type: '',
  channel: 'Douyin', // 渠道
  store: '', // 店铺
  account: '', // 千川账号
  deadline: dayjs().subtract(1, 'day').format('YYYY-MM-DD'), // 日期
  page: 1,
  size: 10,
  orgType: "0"
})

const total = ref(0) // 列表的总页数
const queryFormRef = ref() // 搜索的表单

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  queryParams.value.deadline = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  handleChangeChannel()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    if (queryParams.value.deadline) {
      queryParams.value.deadline = dayjs(queryParams.value.deadline).format('YYYY-MM-DD')
    }
    const data = await QcDayApi.getList(queryParams.value)
    if (data) {
      list.value = data.records
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

// 店铺变化时的处理
const handleStoreChange = () => {
  queryParams.value.account = '' // 清空千川账号
  accountsList.value = [] // 清空千川账号列表

  const selectedStore = queryParams.value.store
  handleQuery()
  if (!selectedStore) return

  // 找到选中店铺对应的账号列表
  const selectedStoreData = storeList.value.find((item) => item.store === selectedStore)
  if (selectedStoreData && selectedStoreData.accounts && selectedStoreData.accounts.length > 0) {
    accountsList.value = selectedStoreData.accounts.map((account) => ({
      label: account,
      value: account
    }))
  }
}

// 根据渠道获取店铺列表
const storeList = ref<any[]>([]) // 店铺列表
const accountsList = ref<any[]>([]) // 千川账号列表
// 根据渠道查询账单店铺和账单账号
const getQcAccountByChannel = async (channel) => {
  const res = await QcApi.getQcAccountStoreByChannel({ channelCode: channel })
  storeList.value = res || []
}
// 渠道变化时的处理
const handleChangeChannel = () => {
  queryParams.value.store = '' // 清空店铺
  storeList.value = [] // 清空店铺列表

  accountsList.value = [] // 清空千川账号列表
  queryParams.value.account = '' // 清空千川账号

  // 如果没有选择渠道，则不进行后续操作
  const channel = queryParams.value.channel
  handleQuery()
  if (!channel) return
  // 根据渠道获取账单店铺和千川账号
  getQcAccountByChannel(channel)
}

const accountDetailRef = ref()
//展示详情页面
function showDetail(row: any) {
  nextTick(() => {
    accountDetailRef.value.open(row?.account, row?.type)
  })
}
/** 编辑/新增操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value?.open(type, id)
}
//过期设置
const setExpire = async (id: string) => {
  try {
    await message.confirm('确认将该条数据设为过期状态吗？')
    await QcDayApi.setExpiry({ id: id })
    message.success('过期设置成功')
    getList()
  } catch (err) {}
}

const handleDelete = async (id: string) => {
  try {
    await message.confirm('确认删除该条数据吗？')
    await QcDayApi.deleteById(id)
    message.success('删除成功')
    getList()
  } catch (err) {}
}
//判断是否到期
function isExpeired(row: any) {
  return dayjs(row.endDate).isBefore(dayjs(new Date()))
}
/** 初始化 **/
onMounted(async () => {
  getList()
  handleChangeChannel()
})

const searchInput = debounce(async () => {
    handleQuery()
}, 1000)
</script>

<style lang="scss" scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.underLine {
  cursor: pointer;
  color: #0064ff;

  &:hover {
    opacity: 0.8;
  }
}
</style>
