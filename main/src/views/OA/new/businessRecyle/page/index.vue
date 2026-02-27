<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Businessrecyle" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Businessrecyle" :column="column"
      :table-data="dataList" :list-name="'回收产品列表'" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Businessrecyle' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';

const detailsRef = ref<any>();

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage();

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, size: page.value.size };
};

// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  request.post({ url: `/api/np/plan/recyclePageList`, data: params }).then((res: any) => {
    dataList.value = res.records?.length ? [...res.records] : [];
    page.value = { ...page.value, total: res.total };
  }).finally(() => {
    loading.value = false;
  });
};

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() };
  searchData.value = { ...new SearchItem() };
  onSearch();
};

// 按钮回调
const onButtonClick = (btn: BtnItem) => { };

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  detailsRef?.value?.openView(item, type);
};

onMounted(() => {
  dataList.value = [];
  onSearch();
});

setRouterInfo();

provide('BusinessrecyleForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
