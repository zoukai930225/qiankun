<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="OaNewTemplete" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="OaNewTemplete" :column="column"
      :table-data="dataList" :list-name="'进度模板列表'" sort-remote />
    <oa-new-templete-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'OaNewTemplete' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import OaNewTempleteDetails from "../details/index.vue";
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import router from '@/router';

const detailsRef = ref<any>(), sortValue = ref<any>(), message = useMessage();

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage();

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return { ...searchData.value };
};

const setSortData = () => {
  return { createdAt: sortValue.value?.order ? (sortValue.value?.order === 'descending' ? '2' : '1') : null };
};

// 查询
const onSearch = () => {
  const params: any = setParamsData();
  const order: any = setSortData();
  loading.value = true;
  request.formPost({
    url: `/api/np/progress/list?page=${page.value.page}&size=${page.value.size}`, data: {
      queryParam: JSON.stringify(params?.templateName ? params : {}),
      orderParam: JSON.stringify(order?.createdAt ? order : {}),
    }
  }).then((res: any) => {
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

// 自定义触发
const customTrigger = (scope: any, col: any) => {
  router.push({ name: 'TempleteNode', params: { templeteId: scope.row.id }, query: { templeteName: scope.row.templateName } });
};

// 自定义排序
const customSort = (item: any) => {
  sortValue.value = item;
  page.value = { ...new PageItem() };
  onSearch();
};

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  ['edit', 'add'].includes(type) && detailsRef?.value?.openView(item, type);
  ['link'].includes(type) && router.push({ name: 'TempleteNode', params: { templeteId: item.id }, query: { templeteName: item.templateName } });
  ['delete'].includes(type) && delItem(item.id);
};

const delItem = (id: string) => {
  message.confirm('请确认是否删除？').then((res: any) => {
    if (res === 'confirm') {
      const loadingInstance = ElLoading.service({ lock: true, text: '数据删除中,请稍等...' })
      request.get({ url: `/api/np/progress/delete/${id}` }).then(() => {
        message.success('删除成功');
        onSearch()
      }).finally(() => loadingInstance.close());
    }
  }).catch(() => { })
};

onMounted(() => {
  dataList.value = [];
  onSearch();
});

setRouterInfo();

provide('OaNewTempleteForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, customTrigger, customSort, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
