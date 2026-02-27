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
            <el-form-item label="商品名称:" prop="goodsName">
              <el-input v-model.trim="queryParams.goodsName" placeholder="请输入商品名称" />
            </el-form-item>
            <el-form-item label="计划名称:" prop="planName">
              <el-input v-model.trim="queryParams.planName" placeholder="请输入计划名称" />
            </el-form-item>
            <el-form-item label="发送结果:" prop="sendResult">
              <el-select v-model="queryParams.sendResult" placeholder="请选择发送结果:" clearable>
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
            <el-form-item label="处理状态:" prop="handleStatus">
              <el-select
                v-model="queryParams.operationState"
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
            <el-form-item v-if="isExpand" label="计划ID:" prop="channel">
              <el-input v-model.trim="queryParams.planId" placeholder="请输入计划ID" />
            </el-form-item>
            <el-form-item v-if="isExpand" label="运营人员:" prop="operationsPersonnelName">
              <select-people
                :multiple="false"
                v-model:modelValue="updatedId"
                @update:operator-name="changeOperatorName"
              />
            </el-form-item>
            <el-form-item v-if="isExpand" label="店铺:" prop="store">
              <StoreRangePlus v-model="queryParams.storeName" placeholder="请选择店铺" />
            </el-form-item>
            <el-form-item v-if="isExpand" label="商品ID:" prop="goodsId">
              <el-input v-model.trim="queryParams.goodsId" placeholder="请输入商品ID" />
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
      >
        <el-table-column label="渠道" width="100" fixed="left">
          <template #default="{ row }">
            <div class="channel-icon">
              <img class="icon-pic" :src="getImgUrlByChannel(row.channelName)" alt="" />
              <span>{{ row.channelName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="店铺" prop="storeName" fixed="left" width="150" />
        <el-table-column label="商品ID" prop="goodsId" fixed="left" width="130" />
        <el-table-column label="商品名称" prop="goodsName" fixed="left" width="300" />
        <el-table-column
          label="告警日期"
          :formatter="dateFormatter2"
          width="120"
          prop="notifyDate"
        />
        <el-table-column label="计划名称" prop="planName" width="100" />
        <el-table-column label="营销场景" prop="marketingScene" width="100" />
        <el-table-column label="运营人员" prop="operateName" width="100" />
        <el-table-column label="责任人" prop="directorName" />
        <el-table-column label="发送结果" prop="sendResult" width="100">
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
        <el-table-column label="处理人" prop="processPerson" width="130" />
        <el-table-column label="处理时间" :formatter="dateFormatter" width="180" prop="updatedAt" />
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="{ row }">
            <el-button v-if="!+row.sendResult" link type="primary" @click="reSubmit(row.id)"
              >重发</el-button
            >
            <el-button v-if="+row.operationState" link type="primary" @click="checkDetail(row)"
              >查看</el-button
            >
            <el-button v-if="!+row.operationState" link type="primary" @click="handle(row.id)"
              >处理</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </ContentWrap>
  </div>
  <Dialog
    :visible="isShowHandleDialog"
    :id="rowId"
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
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElTable,
  ElTableColumn,
  ElSelect,
  ElOption
} from 'element-plus'
import * as MonitorApi from '@/api/monitor/index'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
import SelectPeople from '../components/selectPeople.vue'
import Dialog from './components/newProductorDialog.vue'
import Drawer from './components/newProductorDrawer.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { dateFormatter, dateFormatter2 } from '@/utils/formatTime'
import { getImageUrl, getImgUrlByChannel } from '@/utils'

defineOptions({ name: 'MonitorNotifyNewProductorPaymentNotyfy' })

const appStore = useAppStore()
const queryParams = ref<MonitorApi.newProductPayNotifyListParams>({
  page: 1,
  size: 10
})
const isExpand = ref(false)
const records = ref<any>([])
const loading = ref(false)
const total = ref(0)
const message = useMessage()
const isShowHandleDialog = ref(false)
const isShowHDetail = ref(false)
const updatedId = ref<string[]>([])
const detailData = ref({})
const rowId = ref('')

// 搜索
function handleQuery() {
  queryParams.value.page = 1
  getList()
}

// 重置
function resetQuery() {
  queryParams.value = { page: 1, size: 10 }
  updatedId.value = []
  handleQuery()
}

// 获取表格
async function getList() {
  loading.value = true
  try {
    const data = await MonitorApi.newProductPayNotifyList(queryParams.value)
    total.value = data.total
    records.value = data.records
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function changeOperatorName(val: string) {
  queryParams.value.operateName = val
}

// 重发
async function reSubmit(id: string) {
  try {
    await message.confirm('确认重发飞书告警吗？', '系统提示')
    const data = await MonitorApi.newProductPayNotifyRetransmission({ id })
    if (data.success) {
      message.success('重发成功')
      handleQuery()
    } else {
      message.error(data.message || '重发失败')
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
    const res = await MonitorApi.newProductPayNotifyDetail(row.id)
    Object.keys(res).forEach((key: string) => {
      detailData.value[key] = res[key]
    })
  } catch (error) {}
}

// 处理
async function handle(id: string) {
  rowId.value = id
  isShowHandleDialog.value = true
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
  .el-input__wrapper,
  .el-select__wrapper {
    width: 200px;
    box-sizing: border-box;
  }
}
.sendFail {
  display: flex;
  align-items: center;
  :deep(.el-icon) {
    margin-left: 4px;
  }
}

.channel-icon {
  display: flex;
  align-items: center;
  .icon-pic {
    width: 14px;
    margin-right: 8px;
  }
}
</style>
