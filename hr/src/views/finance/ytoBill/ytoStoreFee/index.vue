<template>
  <ContentWrap>
    <div class="rule-form">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter" style="width: calc(100% - 140px);">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="66px">
            <el-form-item label="分组" class="each-form" prop="groupType">
              <el-select v-model="queryParams.groupType" placeholder="请选择分组" filterable clearable class="width-220"
                @change="handleQuery">
                <el-option v-for="dict in groupList" :key="dict" :label="dict" :value="dict" />
              </el-select>
            </el-form-item>
            <el-form-item label="店铺" class="each-form" prop="store">
              <el-select v-model="queryParams.store" placeholder="请选择店铺" filterable clearable class="width-220"
                @change="handleQuery">
                <el-option v-for="dict in storeList" :key="dict" :label="dict" :value="dict" />
              </el-select>
            </el-form-item>
            <el-form-item label="月份" class="each-form" prop="dataBelong">
              <el-date-picker v-model="queryParams.dataBelong" type="month" format="YYYY-MM" value-format="YYYY-MM"
                @change="handleQuery" :clearable="false" />
            </el-form-item>
            <el-form-item label="目的地省" class="each-form" prop="targetProvince">
              <el-select v-model="queryParams.targetProvince" placeholder="请选择" filterable clearable class="width-220" collapse-tags
                multiple @change="handleQuery">
                <el-option v-for="dict in provinceList" :key="dict" :label="dict" :value="dict" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="row-center" style="width: 150px;align-items: flex-start;justify-content: flex-end;">
          <el-button @click="resetQuery" style="width: 60px;">
            重置
          </el-button>
          <el-button type="primary" @click="exportData" :loading="exportLoading">
            导出
          </el-button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list" border stripe
      :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'"
      :tooltip-options="{ popperClass: 'refund-tips' }">
      <el-table-column label="分组" prop="groupType" min-width="120" fixed="left">
        <template v-slot="{ row }">
          <tableColumnTotal v-if="row.isSumline" @dataExchange="totalDataExchange" :default-index="totalSelectIndex" />
          <span v-else>{{ formatterValue(row, 'groupType', '-') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="匹配店铺" prop="store" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'store', '-')" />
      <el-table-column label="月份" prop="dataBelong" min-width="120"
        :formatter="(row: any) => formatTime(row.dataBelong, 'yyyy-MM') || '-'" />
      <el-table-column label="总运单数" prop="countTracking" min-width="120" align="right"
        :formatter="(row: any) => numberFormateShow(row.countTracking) || '-'" />
      <el-table-column label="总费用" prop="sumPrice" min-width="120" align="right"
        :formatter="(row: any) => numberFormateShow(row.sumPrice) || '-'" />
      <el-table-column label="3KG以上运单" prop="countTrackingAboveThreeKg" min-width="180"
        :formatter="(row: any) => numberFormateShow(row.countTrackingAboveThreeKg) || '-'" align="right" />
      <el-table-column label="3KG以上运费" prop="sumPriceAboveThreeKg" min-width="180"
        :formatter="(row: any) => numberFormateShow(row.sumPriceAboveThreeKg) || '-'" align="right" />
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
defineOptions({
  name: 'YtoStoreFeePage'
})
import download from '@/utils/download'
import { numberFormateShow } from '@/utils/formatter'
import { formatterValue, formatTime } from "@/utils";
import { cloneDeep, debounce } from "lodash-es";
import dayjs from 'dayjs';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
import * as ytBillApi from "@/api/finance/ytoBill/ytBill";
import tableColumnTotal from './components/tableColumnTotal.vue';

const list = ref<any[]>([])
const loading = ref(false)
const message = useMessage();


//目的地省
const provinceList = ref<any[]>([]);
//分组
const groupList = ref<any[]>([]);
const storeList = ref<any[]>([]);

const getProvinceList = async () => {
  try {
    const res = await ytBillApi.targetProvinceAllList();
    provinceList.value = res || []
  } catch (e) { }
}

const getGroupList = async () => {
  try {
    const res = await ytBillApi.groupTypeAllList();
    groupList.value = res || []
  } catch (e) { }
}

const getStoreList = async () => {
  try {
    const res = await ytBillApi.storeAllList();
    storeList.value = res || []
  } catch (e) { }
}

const queryParams = ref<any>({
  page: 1,
  size: 10,
  targetProvince: undefined,//目的地省
  groupType: undefined,//分组名称
  store: undefined,//店铺
  dataBelong: dayjs().subtract(1, 'month').format('YYYY-MM'),//月份
})


const total = ref(0);
const queryFormRef = ref()

const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

const dealParams = (needPage: boolean = false) => {
  const params: any = cloneDeep(queryParams.value)
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }
  })

  if (queryParams.value.targetProvince?.length > 0) {
    params.targetProvince = queryParams.value.targetProvince.join(',')
  }

  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}

let all = null
let current = null
const getList = async () => {
  loading.value = true
  try {
    all = null
    current = null
    const data = await ytBillApi.settlementPageList(dealParams(true))
    if (data?.records?.length) {
      let dataList: any = []
      data.records.map((item: any) => {
        if (item.dataBelong.includes('总计')) {
          item.isSumline = true
          const val = cloneDeep(item)
          val.dataBelong = ''
          if (item.dataBelong === '总计：全部页') {
            all = val
          } else {
            current = val
          }
        } else {
          dataList.push(item)
        }
      })
      list.value = dataList
      total.value = data.total
      if (totalSelectIndex.value === 0 && all) {
        list.value.push(all)
      }
      if (totalSelectIndex.value === 1 && current) {
        list.value.push(current)
      }
    } else {
      list.value = []
      total.value = 0
    }
  } finally {
    loading.value = false
  }
}
const totalSelectIndex = ref(0)
const totalDataExchange = (index) => {
  totalSelectIndex.value = index
  if (list.value.length > 0) {
    if (index === 0 && all) {
      // 全部汇总
      list.value[list.value.length - 1] = all
    } else if (index === 1 && current) {
      // 当前页汇总
      list.value[list.value.length - 1] = current
    }
  }
}

onMounted(() => {
  getProvinceList()
  getGroupList()
  getStoreList()
  handleQuery()
})

const exportLoading = ref(false)

const exportData = debounce(
  async () => {
    try {
      exportLoading.value = true
      const data = await ytBillApi.exportSettlementList(dealParams(false))
      let title = '圆通_店铺运费汇算_'
      if (queryParams.value.groupType) {
        title = `${title}${queryParams.value.groupType}_`
      } else {
        title = `${title}_`
      }
      if (queryParams.value.dataBelong) {
        title = `${title}${queryParams.value.dataBelong}_`
      } else {
        title = `${title}_`
      }
      if (data) {
        download.excel(data, `${title}${dayjs().format('YYYYMMDDHHmmss')}.xlsx`)
        message.success('导出成功')
      } else {
        message.error('导出失败')
      }
    } catch (e) { } finally {
      exportLoading.value = false
    }
  }, 1000
)


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
    display: flex;
    align-items: center;
    height: auto;
    line-height: 17px;
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

.table-top {
  justify-content: space-between;
  font-size: 16px;
  color: #333333;
  font-weight: 500;
  margin-bottom: 12px;
  width: 100%;
}

:deep(.refund-tips) {
  max-width: 335px;
}
</style>