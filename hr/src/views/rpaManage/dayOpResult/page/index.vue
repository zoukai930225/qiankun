<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Dayopresult" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Dayopresult" :column="column"
      :table-data="dataList" :list-name="route.meta.title">
      <template #statistics>
        <div style="width: 50vw;">总任务数：{{ totalNums }}，日需运行任务数：{{ todayNums }}</div>
      </template>
    </scheme-table>
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Dayopresult' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import { usePage, SearchItem } from "../config/config";
import { getDaySum, getDaySumRecords } from '@/api/dashboard/index'
import { useRouteInfo } from "@/hooks/common/useRouteInfo";
defineOptions({ name: 'RpaDayOpResultPage' })
const route = useRoute()
const router = useRouter()
const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref();

const { getRouteInfo } = useRouteInfo();
const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = true) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, pageSize: page.value.size };
};

const totalNums = ref(0)
const todayNums = ref(0)
// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  getDaySumRecords(params).then((res: any) => {
    dataList.value = res.length ? [...res] : [];
  }).finally(() => {
    loading.value = false;
  });
  getTotal(params)
};

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() };
  searchData.value = { ...new SearchItem() };
  onSearch();
};

// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  ['board'].includes(btn.fun) && boardRef?.value?.openView();
  ['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun);
};

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  if (btn.fun === "jumpDetail") {
    router.push({
      path: getRouteInfo('Dashboard'),
      query: {
        activeName: 'fifth',
        executeStatus: item.status,
        triggerStartTime: searchData.value.dataDate,
        triggerEndTime: searchData.value.dataDate,
      }
    })
  }
};

const getTotal = (params: any) => {
  totalNums.value = 0
  todayNums.value = 0
  getDaySum(params).then((res: any) => {
    totalNums.value = res?.allCount || 0
    todayNums.value = res?.todayCount || 0
  })
}

onMounted(() => {
  dataList.value = [];
  onSearch();
});

setRouterInfo();

provide('DayopresultForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
