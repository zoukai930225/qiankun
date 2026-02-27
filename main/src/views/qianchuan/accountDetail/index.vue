<template>
  <div class="commonTopFilterWrap accountDetailWrap">
    <div class="commonTopFilterWrap-filter">
      <el-form ref="queryFormRef" inline :model="queryParams" label-width="100">
        <el-form-item label="渠道" prop="channel">
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
        <el-form-item label="实际消耗店铺" prop="actualConsumStore">
          <el-select
            v-model="queryParams.actualConsumStore"
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
        <el-form-item label="千川账号" prop="account">
          <!-- <el-select
            class="searchFormItemWidth"
            v-model="queryParams.account"
            placeholder="请选择"
            clearable
            multiple
            filterable
            value-on-clear=""
          >
            <el-option
              v-for="dict in accountsList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select> -->
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

        <el-form-item label="来源" prop="type">
          <el-select
            style="width: 200px"
            v-model="queryParams.source"
            placeholder="请选择"
            value-on-clear=""
            @change="handleQuery"
          >
            <el-option
              v-for="(key, value) in originOption"
              :key="key"
              :label="key"
              :value="+value"
            />
          </el-select>
        </el-form-item>
        <div v-if="isExpand">
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
          <el-form-item label="开始日期" prop="beginDate">
            <el-date-picker
              style="width: 200px"
              v-model="queryParams.beginDate"
              value-format="YYYY-MM-DD"
              type="date"
              placeholder="请选择开始时间"
              :clearable="false"
              @change="handleChangeStartDate"
            />
          </el-form-item>
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
              style="width: 200px"
              v-model="queryParams.endDate"
              value-format="YYYY-MM-DD"
              type="date"
              :clearable="false"
              placeholder="请选择结束时间"
              @change="handleChangeEndDate"
            />
          </el-form-item>
          <el-form-item label="业务类型" prop="businessType">
              <el-select  style="width: 200px;" v-model="queryParams.businessType" placeholder="请选择" clearable @change="handleQuery">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.DOUYIN_PROMOTION_BUSINESS_TYPE, true)"
                  :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
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

        <el-button @click="handleExport" :loading="exportLoading" type="primary"> 导出 </el-button>
        <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
      </div>
    </div>
  </div>

  <div class="table-wrapper">
    <list-table
      :list="list"
      :total="total"
      :loading="loading"
      @view="handleView"
      @cost-view="handleCostView"
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
    <!-- 消耗详情 -->
    <!-- <ViewDialog ref="viewDialogRef" /> -->

    <!-- 千川花费列表查看 -->
    <costDialog ref="costDialogRef" />
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'AccountDetail' })
import dayjs from 'dayjs'
// import ViewDialog from './components/viewDialog.vue'
import costDialog from './components/costDialog.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as QcApi from '@/api/qianchuan'
import listTable from './components/listTable.vue'
import download from '@/utils/download'
import { ref } from 'vue'
import { cloneDeep, debounce} from 'lodash-es'
const message = useMessage() // 消息弹窗
const isExpand = ref(true)

// 设置默认日期范围为昨天
const yesterday = dayjs().subtract(1, 'day')
const startOfYesterday = yesterday.startOf('day').format('YYYY-MM-DD')
const endOfYesterday = yesterday.endOf('day').format('YYYY-MM-DD')
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

// 查询参数
const queryFormRef = ref()
const queryParams = ref<any>({
  size: 10,
  page: 1,
  type: '',
  channel: 'Douyin', // 渠道
  actualConsumStore: '', // 店铺
  account: '', // 千川账号
  beginDate: startOfYesterday, // 开始日期
  endDate: endOfYesterday, // 结束日期
  source: 1,
  businessType: '',
  orgType: '0'
})

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 来源下拉选项 */
const originOption = ref({
  1: '全部',
  2: '系统抓取',
  3: '人工配置'
})

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
    const params = cloneDeep(queryParams.value)
  
      // 将账号列表转换为逗号分隔的字符串
    if (params.account && Array.isArray(params.account)) {
      params.account = params.account.join(',')
    }

    const res = await QcApi.getQcAccountDetailList(params)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    await nextTick()
    loading.value = false
  }
}

// 查看详情
const viewDialogRef = ref()
const handleView = (id, type) => {
  viewDialogRef.value?.open(id, type)
}

//
const costDialogRef = ref()
const handleCostView = (account, type) => {
  costDialogRef.value?.open(account, type)
}
//导出
const exportLoading = ref(false) // 导出状态
const handleExport = async () => {
  try {
    exportLoading.value = true
    const params = cloneDeep(queryParams.value)

    const res = await QcApi.exportQcAccountDetail(params)
    if (res) {
      download.excel(res, `千川账号明细.xls`)
      message.success('导出成功')
    }
  } catch {
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
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
  // 根据渠道获取账单店铺和千川账号
  getQcAccountByChannel(channel)
}

// 店铺变化时的处理
const handleStoreChange = (val) => {
  queryParams.value.account = '' // 清空千川账号
  accountsList.value = [] // 清空千川账号列表

  // 找到选中店铺对应的账号列表
  const selectedStoreData = storeList.value.find((item) => item.store === val)
  if (selectedStoreData && selectedStoreData.accounts && selectedStoreData.accounts.length > 0) {
    accountsList.value = selectedStoreData.accounts.map((account) => ({
      label: account,
      value: account
    }))
  }

  handleQuery()
}

// 根据渠道获取店铺列表
const storeList = ref<any[]>([]) // 店铺列表
const accountsList = ref<any[]>([]) // 千川账号列表
// 根据渠道查询账单店铺和账单账号
const getQcAccountByChannel = async (channel) => {
  const res = await QcApi.getQcAccountStoreByChannel({ channelCode: channel })
  storeList.value = res || []
}

onMounted(() => {
  // 设置默认时间
  queryParams.value.beginDate = startOfYesterday
  queryParams.value.endDate = endOfYesterday

  handleChangeChannel()

  getList()
})

const searchInput = debounce(async () => {
    handleQuery()
}, 1000)
</script>

<style lang="scss" scoped>
// 查询条件
.accountDetailWrap {
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

// :deep(.el-input__wrapper) {
//   box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
// }

:deep(.longlabel .el-form-item--default .el-form-item__label) {
  // line-height: 1.5;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 10px;
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
