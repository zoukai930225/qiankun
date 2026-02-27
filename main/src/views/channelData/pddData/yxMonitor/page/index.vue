<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Yxmonitor" :show-expand="false" />
    <el-tabs v-model="activeName" @tab-change="handleChange">
      <el-tab-pane label="活动掉活监控" name="lost"></el-tab-pane>
      <el-tab-pane label="活动删除监控" name="delete"></el-tab-pane>
    </el-tabs>
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Yxmonitor" :column="column"
      :table-data="dataList" :is-operate="false" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Yxmonitor' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import { cloneDeep } from 'lodash-es'
defineOptions({
  name: 'PddDataYxMonitorPage',
})
const activeName = ref('lost')
const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref();

const userInfo = ref<any>({ isManagement: false, isHrbp: false });
const tab = ref(1);
const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value'), tab: toRef(tab, 'value') });
const route = useRoute();
// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, size: page.value.size };
};

const dealParams = (queryParams: any, needPage: boolean = true) => {
  const params: any = cloneDeep(queryParams)
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }

    if (params.store?.length > 0) {
      params.store = queryParams.store[queryParams.store.length - 1]
    } else {
      params.store = undefined
    }
  })
  params.tab = tab.value
  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}
// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;

  request.get({ url: `/api/liveDropMonitor/pageQuery`, params: dealParams(params) }).then((res: any) => {
    dataList.value = res.records?.length ? [...res.records] : [];
    page.value = { ...page.value, total: res.total };
  }).finally(() => {
    loading.value = false;
  });
};

// 重置
const resetForm = () => {
  page.value = { ...new PageItem(), size: 50 };
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
  detailsRef?.value?.openView(item, type);
};
//
const handleChange = (tabName: string) => {
  tab.value = tabName === 'lost' ? 1 : 2
  page.value.page = 1;
  onSearch();
}
onMounted(() => {
  dataList.value = [];
  tab.value = 1;
  activeName.value = 'lost';
  onSearch();
});

setRouterInfo();

provide('YxmonitorForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
