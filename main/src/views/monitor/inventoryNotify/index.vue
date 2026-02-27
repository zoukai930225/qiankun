<!--
 * @Date: 2024-06-06 10:13:37
-->
<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="78px">
            <el-form-item label="商家编码:" prop="skuCode">
              <el-input v-model.trim="queryParams.skuCode" placeholder="请输入商家编码" />
            </el-form-item>
            <el-form-item label="商品名称:" prop="productName">
              <el-input v-model.trim="queryParams.productName" placeholder="请输入商品名称" />
            </el-form-item>
            <el-form-item label="处理状态:" prop="processStatus">
              <el-select
                v-model="queryParams.processStatus"
                placeholder="请选择处理状态:"
                clearable
              >
                <el-option
                  v-for="item in [
                    { value: 1, label: '已处理', tag: 'success' as 'success' },
                    { value: 0, label: '未处理', tag: 'danger' as 'danger' }
                  ]"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                  <el-tag :type="item.tag" round>{{ item.label }}</el-tag>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="alarmTimeStr" label="告警日期">
              <el-date-picker
                v-model="queryParams.alarmTimeStr"
                type="date"
                value-format="YYYY-MM-DD"
                placeholder="请选择告警日期"
                :default-value="new Date()"
              />
            </el-form-item>
            <el-form-item v-if="isExpand" label="发送结果:" prop="sendResult">
              <el-select v-model="queryParams.sendResult" placeholder="请选择发送结果:">
                <el-option
                  v-for="item in [
                    { value: 1, label: '成功', tag: 'success' as 'success' },
                    { value: 0, label: '失败', tag: 'danger' as 'danger' }
                  ]"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                >
                  <el-tag :type="item.tag" round>{{ item.label }}</el-tag>
                </el-option>
              </el-select>
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
            <el-button type="primary" @click="handle()"> 批量处理 </el-button>
          </div>
        </div>
      </div>
      <SWFilterExpandAll
        :isExpand="isExpand"
        @expand-click="isExpand = !isExpand"
        class="SWFilterExpandAll"
      />
      <el-table
        :border="true"
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="records"
        :stripe="true"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
        show-overflow-tooltip
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55" :selectable="selectable" fixed="left" />
        <el-table-column label="商家编码" prop="skuCode" fixed="left" width="150" />
        <el-table-column label="商品名称" prop="productName" fixed="left" />
        <el-table-column label="规格" width="150">
          <template #default="{ row }">
            <span>{{ row.category }}-{{ row.specificationCode }}-{{ row.specificationName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存周转周期" prop="fastestDeliveryDays" />
        <el-table-column label="生产周期" prop="productionCycle" />
        <el-table-column label="七天销量" width="90" prop="salesSevenDays" min-width="150" />
        <el-table-column label="库存" width="80" prop="stock" />
        <el-table-column
          label="告警日期"
          :formatter="dateFormatter2"
          width="120"
          prop="alarmTime"
        />
        <el-table-column label="运营人员" prop="responsibilityPersonName" width="120" />
        <el-table-column label="发送结果" width="90">
          <template #default="{ row }">
            <el-tag v-if="row.sendResult === '1'" type="success" round>成功</el-tag>
            <div v-else class="sendFail">
              <el-tag type="danger" round>{{ row.sendResult === '1' ? '成功' : '失败' }}</el-tag>
              <el-tooltip :content="row.failReason" placement="right">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="处理人" prop="processorName" width="100" />
        <el-table-column
          label="处理时间"
          :formatter="dateFormatter"
          width="180"
          prop="processCompletionTime"
        />
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="{ row }">
            <el-button v-if="row.sendResult === '0'" link type="primary" @click="reSubmit(row.id)"
              >重发</el-button
            >
            <el-button
              v-if="row.processStatus === '1'"
              link
              type="primary"
              @click="checkDetail(row)"
              >查看</el-button
            >
            <el-button v-if="row.processStatus === '0'" link type="primary" @click="handle(row.id)"
              >处理</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        @pagination="getList"
      />
    </ContentWrap>
  </div>
  <Dialog
    :visible="isShowHandleDialog"
    :ids="ids"
    @handle-close="() => (isShowHandleDialog = false)"
    @refresh="handleQuery"
  />
  <Drawer
    :visible="isShowHDetail"
    :detail="detailData"
    @handle-close="() => (isShowHDetail = false)"
  />
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { ElForm, ElFormItem, ElInput, ElButton, ElTable, ElTableColumn } from 'element-plus'
import * as MonitorApi from '@/api/monitor/index'
import Dialog from './components/InventoryDialog.vue'
import Drawer from './components/InventoryDrawer.vue'
import { dateFormatter, dateFormatter2, formatDate } from '@/utils/formatTime'

defineOptions({ name: 'MonitorNotifyInventoryNotify' })

const appStore = useAppStore()
const queryParams = ref<MonitorApi.wdtInventoryListParams>({
  pageNo: 1,
  pageSize: 10,
  alarmTimeStr: formatDate(new Date(), 'YYYY-MM-DD')
})
const records = ref<MonitorApi.wdtInventoryDealsSaveInBatchRes[]>([])
const loading = ref(false)
const total = ref(0)
const message = useMessage()
const isShowHandleDialog = ref(false)
const isShowHDetail = ref(false)
const detailData = ref({})
const ids = ref<string[]>([])
const isExpand = ref(false)

function selectable(row: any) {
  return row.processStatus === '0'
}

// 搜索
function handleQuery() {
  queryParams.value.pageNo = 1
  getList()
}

// 重置
function resetQuery() {
  queryParams.value = { pageNo: 1, pageSize: 10 }

  getList()
}

// 选择
function selectionChange(rows: MonitorApi.wdtInventoryDealsSaveInBatchRes[]) {
  ids.value = rows.map((el) => el.id) as string[]
}

// 获取表格
async function getList() {
  loading.value = true
  try {
    const data = await MonitorApi.wdtInventoryPageList(queryParams.value)
    total.value = data.total
    records.value = data.records
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// 重发
async function reSubmit(id: string) {
  loading.value = true
  try {
    await message.confirm('确认重发飞书告警吗？', '系统提示')
    const data = await MonitorApi.wdtInventoryResend({ id })
    if (data.success) {
      message.success('重发成功')
      handleQuery()
    } else {
      message.error(data.message)
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// 查看
async function checkDetail(row: any) {
  try {
    isShowHDetail.value = true
    detailData.value = row
    const res = await MonitorApi.wdtInventoryDetail({ id: row.id })
    Object.keys(detailData.value).forEach((el) => {
      detailData.value[el] = res[el] || detailData.value[el]
    })
  } catch (error) {}
}

// 处理
async function handle(id?: string) {
  // 行内单个处理
  if (id) ids.value = [id]

  if (ids.value.length > 0) isShowHandleDialog.value = true
}

onMounted(() => {
  getList()
})
</script>
<style scoped lang="less">
.SWFilterExpandAll {
  margin-bottom: 20px;
}
:deep(.el-form) {
  .el-input,
  .el-select {
    width: 200px;
    box-sizing: border-box;
    .el-input__wrapper {
      padding: 0 11px;
      .el-input__inner {
        height: 32px;
      }
    }
  }
}
.sendFail {
  display: flex;
  align-items: center;
  :deep(.el-icon) {
    margin-left: 4px;
  }
}
</style>
