<template>
  <div>
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Channel" :column="column"
      :table-data="dataList" :list-name="'渠道管理列表'" />
    <log-drawer ref="logDraweRef" />
  </div>
</template>

<script lang="tsx">
export default { name: 'Channel' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import { cloneDeep } from 'lodash-es';
import LogDrawer from '../components/logDrawer.vue';
const logDraweRef = ref<any>();

const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, size: page.value.size };
};

const emits = defineEmits(['set']);
// 查询
const onSearch = () => {
  const params: any = cloneDeep(setParamsData());
  params.validFlag = params.validFlag?.length > 0 ? params.validFlag[0] : 0;
  loading.value = true;
  request.get({ url: `/api/opDutyAuthorityManage/channel/list`, params: params }).then((res: any) => {
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
const onButtonClick = (btn: BtnItem) => {
  switch (btn.fun) {
    case 'log':
      logDraweRef.value?.openView();
      break
  }
};

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  if (type === 'set') {
    emits('set', item)
  }
};

onMounted(() => {
  dataList.value = [];
});

setRouterInfo();

provide('ChannelForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });
defineExpose({ onSearch })
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
