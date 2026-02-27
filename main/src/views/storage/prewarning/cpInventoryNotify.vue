<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="78px">
            <el-form-item label="商品编码:" prop="skuCode">
              <el-input
                v-model.trim="queryParams.skuCode"
                placeholder="请输入商品编码"
                clearable
                @keydown="($event) => handleKeydown('skuCode', $event)"
              />
            </el-form-item>
            <el-form-item label="商品名称:" prop="productName">
              <el-input
                v-model.trim="queryParams.productName"
                placeholder="请输入商品名称"
                clearable
                @keydown="($event) => handleKeydown('productName', $event)"
              />
            </el-form-item>
            <el-form-item label="告警日期:" prop="dataDate">
              <el-date-picker
                v-model="queryParams.dataDate"
                placeholder="请选择告警日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                :default-value="new Date()"
                @keydown="($event) => handleKeydown('dataDate', $event)"
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
            <set-options-dialog-btn /><!-- 预警配置按钮 -->
            <el-button
              type="primary"
              :disabled="btnSwitch"
              :loading="btnSwitch"
              @click="exportFile"
            >
              导出
            </el-button>
          </div>
        </div>
      </div>

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
        <el-table-column label="商品编码" width="220%" prop="skuCode" fixed="left" />
        <el-table-column label="商品名称" width="220%" prop="productName" fixed="left" />
        <el-table-column label="规格" width="220%" prop="specificationName" fixed="left" />
        <el-table-column label="库存" prop="stock" />
        <el-table-column label="待补货" prop="toBeReplenished" />
        <el-table-column label="成品区" prop="cpqInventory" />
        <el-table-column label="拣货区" prop="swjInventory" />
        <el-table-column label="半成品" prop="bcpInventory" />
        <el-table-column label="3天销量" prop="salesThreeDays" />
        <el-table-column label="7天销量" prop="salesSevenDays" />
        <el-table-column label="告警日期" :formatter="dateFormatter2" width="120" prop="dataDate" />
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
</template>
<script lang="ts" setup>
import { exportCPInventoryNotifyList, getGoodsInventoryNotifyList } from '@/api/storage/prewarning'
import { useAppStore } from '@/store/modules/app'
import download from '@/utils/download'
import { dateFormatter2, formatDate } from '@/utils/formatTime'
import { cloneDeep } from 'lodash-es'
import SetOptionsDialogBtn from './components/setOptionsDialog.vue'

defineOptions({ name: 'CpInventoryNotify' })

const appStore = useAppStore()
const loading = ref(false)
const records = ref<StoragePrewarningType.GoodsInventoryNotifyListItem[]>([])
const total = ref(0)
const queryFormRef = ref()
const message = useMessage()
const btnSwitch = ref(false)
const oldParams = ref<any>()

// 搜索参数
const queryParams = ref<StoragePrewarningType.GetGoodsInventoryNotifyListParams>({
  pageNo: 1,
  pageSize: 10
})

// 搜索
async function handleQuery() {
  queryParams.value.pageNo = 1
  getList()
}

// 重置
async function resetQuery() {
  queryFormRef.value.resetFields()
  getList()
}

// 获取列表
async function getList() {
  loading.value = true
  try {
    oldParams.value = cloneDeep(queryParams.value)
    const res = await getGoodsInventoryNotifyList(queryParams.value)
    if (res) {
      records.value = res.records
      total.value = res.total
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// 导出
async function exportFile() {
  await getList()
  // 无数据阻止
  if (!records.value.length) {
    message.warning('当前条件下无数据')
    return
  }

  // 设置防抖
  if (btnSwitch.value) return
  btnSwitch.value = true
  setTimeout(() => {
    btnSwitch.value = false
  }, 2000)

  const fileName = `${queryParams.value.dataDate ? `${queryParams.value.dataDate} ` : ''}成品库存预警.xlsx`
  const params: Partial<StoragePrewarningType.GetGoodsInventoryNotifyListParams> = cloneDeep(
    oldParams.value
  )
  delete params.pageNo
  delete params.pageSize
  try {
    const res = await exportCPInventoryNotifyList(params)
    if (res) {
      download.excel(res, fileName)
      message.success('导出成功')
    }
  } catch (error) {}
}

function handleKeydown(key: string, e) {
  if (e.key !== 'Enter') return
  if (queryParams.value[key]) {
    getList()
  }
}

onMounted(() => {
  queryParams.value.dataDate = formatDate(new Date(), 'YYYY-MM-DD')
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
:deep(.el-button--default) {
  font-size: 12px;
}
.sendFail {
  display: flex;
  align-items: center;
  :deep(.el-icon) {
    margin-left: 4px;
  }
}
</style>
