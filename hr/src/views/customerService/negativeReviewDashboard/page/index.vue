<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Negativereviewdashboard" :show-expand="true" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Negativereviewdashboard"
      :column="column" :table-data="dataList" :list-name="'中差评数据看板列表'"/>
    <!-- <negativeReviewDashboard-details ref="detailsRef" /> -->
  </ex-screen>
  <editCategoryDialog ref="editCategoryDialogRef" @success="onSearch"/>
  <DashBoardDrawer ref="dashboardDrawerRef" />
</template>

<script lang="tsx">
export default { name: 'Negativereviewdashboard' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import NegativeReviewDashboardDetails from "../details/index.vue";
import { useRole } from "@/hooks/common/useRole";
// import { getIntDictOptions } from '@/utils/dict';
import DashBoardDrawer from '../components/dashboardDrawer.vue';
import EditCategoryDialog from "../components/editCategoryDialog.vue";
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import * as negativeReviewDashboardApi from '@/api/negativeReviewDashboard'
import { onNegativeReviewDashboardStore } from '@/store/modules/negativeReviewDashboard'

const negativeReviewDashboardStore = onNegativeReviewDashboardStore()

const router = useRouter()

class StoreItem {
  storeCode: string = ''
  storeName: string = ''
}
class DictItem {
  label: string = ''
  value: string = ''
}
const storeList = ref<StoreItem[]>([])
const getStoreList = async () => {
  const res = await negativeReviewDashboardApi.getNegativeReviewShopList()
  storeList.value = res || []
  // storeList.value.unshift({ storeCode: 'ALL', storeName: '全部' })
  negativeReviewDashboardStore.storeList = storeList.value
}

// 一级分类/二级分类列表
const oneLevelList = ref<DictItem[]>([])
// const twoLevelList = ref<DictItem[]>([])
const dataMap = ref({})

// 获取查询条件 一级分类/二级分类的下拉列表
const getEvaluation = async () => {
  const res = await negativeReviewDashboardApi.getEvaluationList({})
  oneLevelList.value = []
  if (res) {
    dataMap.value = res
    const subKeys = Object.keys(res.中差评)
    // 赋值给 一级分类列表
    if (subKeys.length == 0) return
    oneLevelList.value = subKeys.map((key) => ({
      label: key,
      value: key,
      children: res['中差评'][key].map((item) => ({
        label: item.levelThreeLabel,
        value: item.levelThreeLabel
      }))
    }))
    console.log('一级分类', oneLevelList.value)
  }
}

const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref(), editCategoryDialogRef = ref<any>(), dashboardDrawerRef = ref<any>();

const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value'), negativeReviewDashboardStore, storeList: toRef(storeList, 'value'), oneLevelList: toRef(oneLevelList, 'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  const { dateRange,classification, stores, ...rest } = searchData.value;
  if (dateRange) {
    rest.startTime = dateRange[0];
    rest.endTime = dateRange[1];
  }
  if (Array.isArray(classification) && classification.length > 0) {
    const primaryClassification = new Set(classification.map((item: any) => item[0]))
    const secondaryClassification = classification.map((item: any) => item[1])
    rest.primaryClassification = [...primaryClassification]
    rest.secondaryClassification = secondaryClassification
  }
  rest.store = []
  const storeMapping = stores?.map((item: any) => ({ storeCode: item.storeCode,mappingNames: item.mapping.map((mapping: any) => mapping.mappingName) }))
  storeMapping?.forEach((item: any) => {
    rest.store.push(item.storeCode,...item.mappingNames)
  })
  return noPage ? { ...rest } : { ...rest, page: page.value.page, size: page.value.size };
};


// 查询
const onSearch = () => {
  const data: any = setParamsData();
  loading.value = true;
  request.post({ url: `/api/evaluationBoard/pageList`, data }).then((res: any) => {
    dataList.value = res.records?.length ? [...res.records] : [];
    page.value = { ...page.value, total: res.total };
  }).finally(() => {
    getStateInfo();
    loading.value = false;
  });
};

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() };
  searchData.value = { ...new SearchItem() };
  onSearch();
};

// 状态筛选查询（无状态筛选可删除）
const getStateInfo = () => {
  // const params: any = setParamsData();
  // request.post({ url: `/api/employeeMonthlyAssessment/statistics`, data: params }).then((res: any) => {
  //   res && (stateInfo.value = { ...res });
  // });
};

// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  // ['board'].includes(btn.fun) && boardRef?.value?.openView();
  // ['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun);
  if (btn.fun === 'number') {
    router.push({ name: 'NegativeReviewStatistics',} )
    return
  }
  if (btn.fun === 'reason') {
    dashboardDrawerRef?.value?.open()
    return
  }
};

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  // detailsRef?.value?.openView(item, type);
  if (btn.fun === 'editClassification') {
    editCategoryDialogRef?.value?.open(item.id)
  }
};



onMounted(() => {
  dataList.value = [];
  getStoreList()
  getEvaluation()
  onSearch();
});

setRouterInfo();

provide('NegativereviewdashboardForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
