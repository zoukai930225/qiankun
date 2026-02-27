<template>
  <ContentWrap>
    <div class="rule-form">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter" style="width: calc(100% - 70px);">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="66px">
            <el-form-item label="运单号" class="each-form" prop="trackingNumberLike">
              <el-input class="width-220" v-model.trim="queryParams.trackingNumberLike" placeholder="请输入运单号" clearable
                @change="searchInput" @keyup.enter="searchInput" @clear="searchInput" />
            </el-form-item>
            <el-form-item label="扫描时间" class="each-form upload-time">
              <el-date-picker v-model="times" type="daterange" range-separator="-" start-placeholder="开始日期"
                format="YYYY-MM-DD" value-format="YYYY-MM-DD" end-placeholder="结束日期" @change="handleDateChange"
                :clearable="false">
                <template #range-separator><span style="color: #000;">至</span></template>
              </el-date-picker>
            </el-form-item>
            <el-form-item label="目的地省" class="each-form" prop="targetProvince">
              <el-select v-model="queryParams.targetProvince" placeholder="请选择" filterable clearable class="width-220" collapse-tags
                multiple @change="handleQuery">
                <el-option v-for="dict in provinceList" :key="dict" :label="dict" :value="dict" />
              </el-select>
            </el-form-item>
            <el-form-item label="分组名称" class="each-form" prop="groupType">
              <el-select v-model="queryParams.groupType" placeholder="请选择分组" filterable clearable class="width-220"
                @change="handleQuery">
                <el-option v-for="dict in groupList" :key="dict" :label="dict" :value="dict" />
              </el-select>
            </el-form-item>
            <el-form-item label="是否匹配店铺" class="each-form" prop="isMatch">
              <el-select v-model="queryParams.isMatch" placeholder="请选择" clearable class="width-220"
                @change="handleQuery">
                <el-option label="是" value="1" />
                <el-option label="否" value="0" />
              </el-select>
            </el-form-item>
            <template v-if="isExpand">
              <el-form-item label="是否3KG以上" class="each-form" prop="isMoreThreeKg">
                <el-select v-model="queryParams.isMoreThreeKg" placeholder="请选择" clearable class="width-220"
                  @change="handleQuery">
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </el-form-item>
            </template>
          </el-form>
        </div>
        <div class="row-center" style="width: 70px;align-items: flex-start;">
          <el-button class="commonResetBtn" @click="resetQuery" style="width: 60px;">
            重置
          </el-button>
        </div>
      </div>
      <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand">
        <template #expandDown>
          <el-icon style="margin-right: auto;">
            <ArrowDown :size="12" color="#666666" />
          </el-icon>
        </template>
        <template #expandUp>
          <el-icon style="margin-right: auto;">
            <ArrowUp :size="12" color="#666666" />
          </el-icon>
        </template>
      </SWFilterExpandAll>
      <div class="row-center table-top">
        <div>{{ route.meta.title }}</div>
        <div class="row-center">
          <el-button type="primary" @click="openUploadDrawer">
            圆通账单上传
          </el-button>
          <el-button type="primary" @click="openMatchDrawer">
            匹配电子面单
          </el-button>
          <el-button type="primary" @click="exportData" :loading="exportLoading">
            导出
          </el-button>
          <el-button type="primary" @click="openDownloadDrawer">
            结果下载
          </el-button>
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <el-table :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list" border stripe
      :show-overflow-tooltip="true" row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'"
      :tooltip-options="{ popperClass: 'refund-tips' }">
      <el-table-column label="分组" prop="groupType" min-width="120"
        :formatter="(row: any) => formatterValue(row, 'groupType', '-')" fixed="left" />
      <el-table-column label="店铺" prop="store" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'store', '-')" />
      <el-table-column label="匹配月份" prop="matchMonth" min-width="120"
        :formatter="(row: any) => formatTime(row.matchMonth, 'yyyy-MM') || '-'" />
      <el-table-column label="匹配源数据" prop="matchDataSource" min-width="120"
        :formatter="(row: any) => formatterValue(row, 'matchDataSource', '-')" />
      <el-table-column label="单号状态" prop="orderStatus" min-width="120"
        :formatter="(row: any) => formatterValue(row, 'orderStatus', '-')" />
      <el-table-column label="运单号码" prop="trackingNumber" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'trackingNumber', '-')" />
      <el-table-column label="账单结算对象编码" prop="billSettlementCode" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'billSettlementCode', '-')" />
      <el-table-column label="物料结算名称" prop="materialSettlementName" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'materialSettlementName', '-')" />
      <el-table-column label="账单结算对象名称" prop="billSettlementName" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'billSettlementName', '-')" />
      <el-table-column label="分表格" prop="subTable" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'subTable', '-')" />
      <el-table-column label="计费重量(kg)" prop="feeWeight" min-width="120" align="right"
        :formatter="(row: any) => numberFormateShow(row.feeWeight) || '-'" />
      <el-table-column label="体积参数" prop="volumeParameter" min-width="150"
        :formatter="(row: any) => formatterValue(row, 'volumeParameter', '-')" />
      <el-table-column label="计费省份" prop="feeProvince" min-width="120"
        :formatter="(row: any) => formatterValue(row, 'feeProvince', '-')" />
      <el-table-column label="计费目的地名称" prop="feeDestinationName" min-width="180"
        :formatter="(row: any) => formatterValue(row, 'feeDestinationName', '-')" />
      <el-table-column label="扫描时间" prop="scanTime" min-width="120"
        :formatter="(row: any) => formatTime(row.scanTime, 'yyyy-MM-dd') || '-'" />
      <el-table-column label="新西费用" prop="xinXi" min-width="120" align="right"
        :formatter="(row: any) => numberFormateShow(row.xinXi) || '-'" />
      <el-table-column label="3KG以上费用" prop="cost" min-width="120" align="right"
        :formatter="(row: any) => numberFormateShow(row.cost) || '-'" />
      <el-table-column label="上海加收费用" prop="shSurcharge" min-width="120" align="right"
        :formatter="(row: any) => numberFormateShow(row.shSurcharge) || '-'" />
      <el-table-column label="单价" prop="price" min-width="120" align="right"
        :formatter="(row: any) => numberFormateShow(row.price) || '-'" />
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
    <!--下载-->
    <downloadDrawer ref="downloadDrawerRef" biz-type="yt_order" border stripe />
    <!--账单上传-->
    <uploadDrawer ref="uploadDrawerRef" @openUploadDrawer="openImportDialog" />
    <!--账单文件上传-->
    <uploadDailog ref="uploadDailogRef" @success="handleRefreshUploadDrawer" />
    <!--匹配抽屉-->
    <matchDrawer ref="matchDrawerRef" @openAddDialog="openMatchDialog" />
    <!--新建匹配弹框-->
    <matchDialog ref="matchDialogRef" @success="refreshMatch" />
  </ContentWrap>
</template>
<script lang="ts" setup>
defineOptions({
  name: 'YtoBillDataPage'
})
import { numberFormateShow } from '@/utils/formatter'
import { formatterValue, formatTime } from "@/utils";
import { cloneDeep, debounce } from "lodash-es";
import dayjs from 'dayjs';
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
import * as ytBillApi from "@/api/finance/ytoBill/ytBill";
const isExpand = ref(false);
const list = ref<any[]>([])
const loading = ref(false)
const message = useMessage();
import downloadDrawer from "@/views/biControl/components/downloadDrawer.vue";
import uploadDrawer from './components/uploadDrawer.vue';
import uploadDailog from './components/uploadDailog.vue';
import matchDialog from './components/matchDialog.vue';
import matchDrawer from './components/matchDrawer.vue';

//目的地省
const provinceList = ref<any[]>([]);
//分组
const groupList = ref<any[]>([]);
const uploadDrawerRef = ref();
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

//扫描时间
const times = ref<any[]>([]);
const queryParams = ref<any>({
  page: 1,
  size: 10,
  trackingNumberLike: undefined,//运单号
  targetProvince: undefined,//目的地省
  groupType: undefined,//分组名称
  isMatch: undefined,//是否匹配
  isMoreThreeKg: undefined,//是否大于3kg 1是 0否
})


const total = ref(0);
const queryFormRef = ref()
const getDateDefault = () => {
  times.value = [dayjs().startOf('month').subtract(1, 'day').startOf('month').format('YYYY-MM-DD'), dayjs().startOf('month').subtract(1, 'day').endOf('month').format('YYYY-MM-DD')]
}
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getDateDefault();
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
  if (times.value?.length === 2 && times.value[0] && times.value[1]) {
    params.scanTimeStart = dayjs(times.value[0]).format('YYYY-MM-DD')
    params.scanTimeEnd = dayjs(times.value[1]).format('YYYY-MM-DD')

  }
  if (queryParams.value.targetProvince?.length > 0) {
    params.targetProvince = queryParams.value.targetProvince.join(',')
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
    const data = await ytBillApi.pageList(dealParams(true))
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

const openUploadDrawer = () => {
  uploadDrawerRef.value?.open()
}

onMounted(() => {
  getDateDefault()
  getProvinceList()
  getGroupList()
  handleQuery()
})

const route = useRoute()

const exportLoading = ref(false)
const downloadDrawerRef = ref()
const exportData = async () => {
  try {
    exportLoading.value = true
    await ytBillApi.exportList(dealParams(false))
    message.success('添加导出数据成功')
    downloadDrawerRef.value?.open()
  } catch (e) { } finally {
    exportLoading.value = false
  }

}

const openDownloadDrawer = () => {
  downloadDrawerRef.value?.open()
}
const uploadDailogRef = ref()
const openImportDialog = () => {
  uploadDailogRef.value?.open()
}
const searchInput = debounce(async () => {
  handleQuery()
}, 1000)

const handleRefreshUploadDrawer = () => {
  uploadDrawerRef.value?.getList()
}
const matchDrawerRef = ref();
const openMatchDrawer = () => {
  matchDrawerRef.value?.open()
}
const matchDialogRef = ref();
const openMatchDialog = () => {
  matchDialogRef.value?.open()
}

const refreshMatch = () => {
  matchDrawerRef.value?.getList()
}

//- 日期最多可选择62天
function handleDateChange() {
  if (!Array.isArray(times.value) || times.value.length !== 2) return
  const start = dayjs(times.value[0])
  const end = dayjs(times.value[1])
  const diff = Math.abs(end.diff(start, 'day')) + 1 //包含终止日

  if (diff > 62) {
    message.error('选择时间段不能超过62天')
    getDateDefault()
  }
  handleQuery()
}
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