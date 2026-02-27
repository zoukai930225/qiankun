<template>
  <ContentWrap>
    <div class="rule-form">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="66px">
            <el-form-item label="统计日期" class="each-form" prop="dataDate">
              <el-date-picker v-model="queryParams.dataDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
                @change="handleQuery" :clearable="false" />
            </el-form-item>
            <el-form-item label="店铺" prop="store" class="each-form">
              <store-cascader v-model="queryParams.store" @change="handleQuery" :filterChannel="filterChannel"
                :cascaderProps="{
                  multiple: true,
                }" />
            </el-form-item>
            <el-form-item label="商品" prop="compoundCondition" class="each-form">
              <el-input v-model.trim="queryParams.compoundCondition" placeholder="请输入商品ID/名称" @change="searchInput"
                @keydown.enter="searchInput" @clear="searchInput" clearable class="width-220" />
            </el-form-item>
            <el-form-item label="推广类型" prop="promotionType" class="each-form">
              <el-select v-model="queryParams.promotionType" placeholder="请选择推广类型" @change="handleQuery" clearable
                class="width-220">
                <el-option v-for="item in promotionTypeList" :label="item.label" :value="item.value"
                  :key="item.value" />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <el-button class="commonResetBtn" @click="resetQuery" style="width: 60px;font-size: 14px;">
            重置
          </el-button>
        </div>
      </div>
    </div>
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list" border
      :show-overflow-tooltip="false" row-class-name="commonTableRow1" class="SWCommonTable"
      cell-class-name="self-table-cell" v-horizontal-scroll="'always'" ref="tableRef"
      :tooltip-options="{ popperClass: 'refund-tips' }">
      <el-table-column label="商品信息" prop="storeName" min-width="440" fixed align="center">
        <template v-slot="{ row }">
          <div class="row-center" style="justify-content: center;">
            <shopCard :row="row" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="推广类型" prop="storeName" min-width="130" align="center">
        <template v-slot="{ row }">
          <span class="status-tag" :class="{ ['status-tag-' + row.promotionType]: row.promotionType }">{{
            getLableName(row.promotionType) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消费能力等级" prop="consumptionAnalyzePopulation" min-width="562" align="center">
        <template #header>
          <div class="row-center" style="justify-content: center;">
            <div class="mr4px">消费能力等级</div>
            <el-tooltip placement="bottom" popper-style="max-width: 255px;word-break: break-all;">
              <template #content>
                <span>消费能力等级：以下两项任何一个满足就算偏离</span><br />
                <span>1.分析人群「购买力L1」，按降序排序，排名跑进前二，就算偏离</span><br />
                <span>2.对比人群「购买力L1」，按降序排序，排名跑进前二，就算偏离</span>
              </template>
              <el-icon :size="14" color="#999" style="cursor: pointer;">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <template v-slot="{ row }">
          <div class="row-center" style="justify-content: center;">
            <lineChart :data="row" />
            <div class="flex-column">
              <div class="row-center">
                <div class="legend blue-legend"></div>
                <div class="legend-text">分析人群占比</div>
              </div>
              <div class="row-center mt10px">
                <div class="legend orange-legend"></div>
                <div class="legend-text">对比人群占比</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="用户年龄" prop="ageAnalyzePopulation" min-width="562" align="center">
        <template #header>
          <div class="row-center" style="justify-content: center;">
            <div class="mr4px">用户年龄</div>
            <el-tooltip placement="bottom" popper-style="max-width: 255px;word-break: break-all;">
              <template #content>
                <span>用户年龄：以下任何一个满足就算偏离</span><br />
                <span>1.分析人群「40-49岁」或「50岁以上」，按降序排序，排名跑进前三，就算偏离</span><br />
                <span>2.对比人群「40-49岁」或「50岁以上」，按降序排序，排名跑进前三，就算偏离</span>
              </template>
              <el-icon :size="14" color="#999" style="cursor: pointer;">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
        </template>
        <template v-slot="{ row }">
          <div class="row-center" style="justify-content: center;">
            <lineChart :data="row" type="age" />
            <div class="flex-column">
              <div class="row-center">
                <div class="legend blue-legend"></div>
                <div class="legend-text">分析人群占比</div>
              </div>
              <div class="row-center mt10px">
                <div class="legend orange-legend"></div>
                <div class="legend-text">对比人群占比</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <div class="flex-column" style="align-items: center;">
          <img class="empty-table" src="@/assets/imgs/promotion/empty.png" alt="" />
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
import { cloneDeep, debounce } from "lodash-es";
import dayjs from "dayjs";
import shopCard from './components/shopCard.vue';
import * as offsetApi from "@/api/daMoPan/offset/index"
import lineChart from "./components/lineChart.vue";
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
defineOptions({ name: 'daMoPanPeopleMonitorPage' })
const queryParams = ref<any>({
  page: 1,
  size: 10,
  dataDate: '',//统计日期
  store: undefined,//店铺
  compoundCondition: undefined,//关键词
  promotionType: undefined,//推广类型
})
const promotionTypeList = [{
  id: 1, label: '关键词推广', value: 1
}, {
  id: 2, label: '全站推广', value: 2
}]
const maxDate = ref<string>('');
const filterChannel = ['Tmall', 'TaoBao']
const total = ref(0);
const list = ref<any[]>([])
const loading = ref(false)
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}
const queryFormRef = ref<any>(null)
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getDateDefault()
  handleQuery()
}
const dealParams = (needPage: boolean = false) => {
  const params: any = cloneDeep(queryParams.value)
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }
    if (params.store?.length > 0) {
      params.store = queryParams.value.store.map(item => item?.length > 1 ? item[1] : '')
      params.store = params.store.join(',')
    } else {
      params.store = undefined
    }
  })

  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}

const getList = async () => {
  loading.value = true
  try {
    const data = await offsetApi.getPageList(dealParams(true))
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

const getDateDefault = () => {
  if (maxDate.value) {
    queryParams.value.dataDate = maxDate.value
  } else {
    queryParams.value.dataDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
  }
}

const getMaxDate = async () => {
  try {
    loading.value = true
    const data = await offsetApi.getMaxDate()
    maxDate.value = data?.maxDate || ''
    getDateDefault()
    getList()
  } catch (e) {
    loading.value = false
  } finally {

  }
}

const searchInput = debounce(async () => {
  handleQuery()
}, 1000)

const getLableName = (type: number | string) => {
  return promotionTypeList.find(item => item.value === Number(type))?.label || '-'
}

onMounted(() => {
  getMaxDate()
})
</script>

<style lang="scss" scoped>
.rule-form {
  & {
    --el-input-inner-height: 30px;
  }

  :deep(.el-form-item__label) {
    padding: 0 10px 0 0;
    height: auto;
    line-height: 17px;
    display: flex;
    align-items: center;
  }

  .each-form {
    margin-right: 20px;
    margin-bottom: 20px;
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
  word-break: break-all;
}

.legend {
  width: 8px;
  height: 8px;
  margin-right: 4px;
  margin-left: 15px;

  &-text {
    font-size: 14px;
    color: #666666;
    line-height: 20px;
  }
}

.orange-legend {
  background-color: #FFA500;
}

.blue-legend {
  background: #0064FF;
}

.status-tag {
  display: flex;
  height: 28px;
  border-radius: 100px;
  /* 自动布局 */
  padding: 0 16px;
  font-size: 14px;
  justify-content: center;
  align-items: center;

  &-1 {
    background-color: rgba(0, 100, 255, 0.2);
    color: #0064FF;
  }

  &-2 {
    background-color: rgba(52, 155, 52, 0.2);
    color: #349B34;
  }
}
</style>
