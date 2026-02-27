<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter rule-form">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="66px">
          <el-form-item label="日期" class="each-form upload-time">
            <el-date-picker v-model="times" type="daterange" start-placeholder="开始日期" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" end-placeholder="结束日期" :clearable="false" @change="handleQuery">
              <template #range-separator><span style="color: #000;">至</span></template>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="仓库" prop="wareHouse" class="each-form">
            <el-select v-model="queryParams.wareHouse" placeholder="请选择仓库" clearable filterable
              class="width-220 collapse-select" collapse-tags-tooltip multiple collapse-tags ref="wareSelectRef"
              @clear="handleQuery">
              <el-option v-for="dict in warehouseList" :key="dict.code" :label="dict.name" :value="dict.name" />
              <template #footer>
                <div class="row-center" style="justify-content: flex-end;">
                  <el-button type="primary" size="small" @click="selectQuery">
                    确定
                  </el-button>
                </div>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="店铺选择" prop="store" class="each-form">
            <store-cascader v-model="queryParams.store" :cascaderProps="{
              multiple: true,
            }" @change="handleStoreChange" />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button class="commonResetBtn" style="margin-left: 0px" @click="resetQuery">
            重置
          </el-button>
          <el-button type="primary" @click="toShipOrder">
            <el-icon>
              <Link :size="12" style="margin-right: 3px;" />
            </el-icon>
            明细数据
          </el-button>
          <el-button type="primary" :loading="exportLoading" @click="handleExport">
            导出
          </el-button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
      :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'"
      border :tooltip-options="{ popperClass: 'refund-tips' }">
      <el-table-column label="日期范围" prop="month" min-width="200"
        :formatter="(row: any) => formatterValue(row, 'month', '-')" fixed="left" />
      <el-table-column label="渠道" prop="channelName" min-width="100"
        :formatter="(row: any) => formatterValue(row, 'channelName', '-')" />
      <el-table-column label="店铺" prop="storeName" min-width="180" :show-overflow-tooltip="false">
        <template #default="{ row }">
          <StoreCell channelName="channel" :row="row" />
        </template>
      </el-table-column>
      <el-table-column label="仓库" prop="wareHouse" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'wareHouse', '-')" />
      <el-table-column label="内包装费用" prop="innerPackage" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'innerPackage')" />
      <el-table-column label="外包装费用" prop="outPackage" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'outPackage')" />
      <el-table-column label="包装总费用" prop="totalPackage" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'totalPackage')" />
      <el-table-column label="义乌仓库人工" prop="ywWarehouseManual" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'ywWarehouseManual')" />
      <el-table-column label="包装人工" prop="packageManual" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'packageManual')" />
      <el-table-column label="总人工费" prop="totalManual" min-width="150" align="right"
        :formatter="(row: any) => formatValue(row, 'totalManual')" />
      <template #empty>
        <div class="flex-column" style="align-items: center;">
          <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" object-fit="contain" />
          <span>暂无数据</span>
        </div>
      </template>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList" />
    </div>
  </ContentWrap>
</template>
<script lang="ts" setup>
import { getwdtWarehouseListByParams } from '@/api/supplier/warehouseInfo'
import { formatterValue } from "@/utils";
import { formatValue } from '@/views/biControl/orderQuery/common'
import * as  packageConsumableStatisticApi from '@/api/biControl/packageConsumableStatistic/index'
import { cloneDeep, debounce } from "lodash-es";
import download from '@/utils/download'
import dayjs from 'dayjs';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
const message = useMessage();
import { useExportParams } from "@/store/modules/BI"
import { useRouteInfo } from '@/hooks/common/useRouteInfo';
import StoreCell from "@/views/dutyRight/store/components/storeCell.vue"
const ExportParams = useExportParams()
const router = useRouter()
const times = ref<any[]>([dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')])
const queryParams = ref<any>({
  page: 1,
  size: 10,
  wareHouse: undefined,//仓库
  store: undefined,//店铺
})
const total = ref(0);
const list = ref<any[]>([])
const loading = ref(false);
const maxDate = ref<string>('');
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}
const queryFormRef = ref<any>(null)
const resetQuery = () => {
  times.value = [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().subtract(1, 'day').format('YYYY-MM-DD')]
  queryFormRef.value.resetFields()
  handleQuery()
}

const dealParams = (needPage: boolean = false) => {
  const params: any = cloneDeep(queryParams.value)
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }
  })
  if (params.wareHouse?.length > 0) {
    params.wareHouse = params.wareHouse.join(',')
  } else {
    params.wareHouse = undefined
  }
  if (params.store?.length > 0) {
    params.store = params.store.map(item => item?.length > 1 ? item[1] : '')
    params.store = params.store.join(',')
  } else {
    params.store = undefined
  }

  if (times.value.length === 2) {
    params.dataDateStart = times.value[0]
    params.dataDateEnd = times.value[1]
  }
  if (!needPage) {
    delete params.page
    delete params.size
  }

  return params
}
const getList = async () => {
  loading.value = true
  try {
    const data = await packageConsumableStatisticApi.getList(dealParams(true))
    if (data?.records?.length) {
      list.value = data.records
      total.value = data.total
    } else {
      list.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}
//获取仓库

const warehouseList = ref<any[]>([])

const getWareList = async () => {
  try {
    const res = await getwdtWarehouseListByParams({
      warehouse: ''
    })
    warehouseList.value = res
  } catch (error) { }
}
getWareList()
//当前选择的店铺节点名称-用于下载显示第一个名称
let selectStoresNode = [] as any[]
const exportLoading = ref(false)
const handleExport = debounce(async () => {
  if (exportLoading.value) return
  try {
    exportLoading.value = true
    const res = await packageConsumableStatisticApi.exportList(dealParams(false))
    if (res.success) message.success('导出成功')
    let title = `包装耗材费用_`
    if (times.value.length === 2) {
      title = `${title}${times.value[0]}~${times.value[1]}`
    } 
    if (queryParams.value.wareHouse?.length > 0) {
      title = `${title}_${warehouseList.value.find(item => item.name === queryParams.value.wareHouse[0])?.name || ''}`
    } else {
      title = `${title}_`
    }
    if (queryParams.value.store?.length > 0) {
      const stores = queryParams.value.store.map(item => item?.length > 1 ? item[1] : '')
      if (stores?.length > 0) {
        title = `${title}_${selectStoresNode.find(item => item.value === stores[0])?.label || ''}`
      } else {
        title = `${title}_`
      }
    } else {
      title = `${title}_`
    }

    download.excel(res, `${title}.xlsx`)

  } catch (error) {

  } finally {
    exportLoading.value = false
  }
}, 1000)

const queryMaxData = async () => {
  try {
    loading.value = true
    await ExportParams.getGoodsOverviewMaxDate()
    maxDate.value = dayjs(ExportParams.getMaxMonth).format('YYYY-MM')
    handleQuery()
  } catch (error) {
    console.log(error)
    handleQuery()
  } finally {

  }
}
const wareSelectRef = ref<any>(null)
const selectQuery = () => {
  wareSelectRef.value?.blur()
  handleQuery()
}

const handleStoreChange = (value: any, node: any) => {
  selectStoresNode = node
  handleQuery()
}
//去发货订单
const toShipOrder = () => {
  router.push({
    name: 'BiShipmentOrder'
  })
}

onMounted(() => {
  queryMaxData()
})
</script>
<style lang="scss" scoped>
.upload-time {
  :deep(.el-range-editor.el-input__wrapper) {
    padding: 0;
  }

  :deep(.el-date-editor) {
    width: 220px;
  }
}

.rule-form {
  & {
    --el-input-inner-height: 30px;
  }

  :deep(.el-form-item__label) {
    padding: 0 10px 0 0;
  }

  .each-form {
    margin-right: 20px;
    margin-bottom: 20px;
  }

  :deep(.SWFilterExpandAll-middle-text) {
    color: #666666;
  }

  :deep(.SWFilterExpandAll) {
    margin-bottom: 15px;
  }

  :deep(.el-input) {

    width: 220px !important;
  }


  :deep(.el-input__wrapper) {
    height: 30px;
    padding: 0 11px;
    box-shadow: none;
    border: 1px solid #e5e5e5;

    &:hover {
      box-shadow: none;
      border-color: #0064ff;
    }

    .is-focus {
      box-shadow: none;
      border-color: #0064ff;
    }
  }

  :deep(.el-input__inner) {
    height: 30px;
    line-height: 30px;
  }
}

.right-20 {
  margin-right: 20px !important;
}

.width-220 {
  width: 220px !important;
}

:deep(.refund-tips) {
  max-width: 335px;
}

.collapse-select {
  :deep(.el-tag.is-closable) {
    max-width: 105px !important;
  }
}
</style>