<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Journal" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Journal" :column="column"
      :table-data="dataList" :list-name="'操作日志列表'" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Journal' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage();

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? {
    ...searchData.value,
    userId: searchData.value.userId.join(','),
    startTime: searchData.value.dateTime?.length ? searchData.value.dateTime[0] : null,
    endTime: searchData.value.dateTime?.length ? searchData.value.dateTime[1] : null,
  } : {
    ...searchData.value,
    userId: searchData.value.userId.join(','),
    startTime: searchData.value.dateTime?.length ? searchData.value.dateTime[0] : null,
    endTime: searchData.value.dateTime?.length ? searchData.value.dateTime[1] : null,
    page: page.value.page,
    size: page.value.size
  };
};

// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  request.get({ url: `/api/sysLogRecord/pageList`, params: params }).then((res: any) => {
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
const viewDetails = (type: string, item?: any, btn?: any) => { };

onMounted(() => {
  dataList.value = [];
  onSearch();
});

setRouterInfo();

provide('JournalForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
