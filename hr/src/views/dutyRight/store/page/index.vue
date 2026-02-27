<template>
  <div>
    <query-scheme :scheme="scheme" v-model="searchData" name="Store" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Store" :column="column"
      :table-data="dataList" :list-name="'店铺管理列表'" is-selection ref="tableRef" />
    <add-drawer ref="addDrawerRef" />
    <remove-drawer ref="removeDrawerRef" />
    <store-log ref="logDrawerRef" />
  </div>
</template>

<script lang="tsx">
export default { name: 'Store' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import { cloneDeep } from 'lodash-es';
import AddDrawer from '../components/addDrawer.vue';
import RemoveDrawer from '../components/removeDrwer.vue'
import StoreLog from '../components/logDrawer.vue'

const addDrawerRef = ref<any>(), removeDrawerRef = ref(), logDrawerRef = ref(), tableRef = ref();

const userInfo = ref<any>({ isManagement: false, isHrbp: false });
const selectRows = computed(() => tableRef?.value?.selectRows || []);

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, size: page.value.size };
};

const emits = defineEmits(['set']);

const dealParams = (queryParams: any, needPage: boolean = true) => {
  const params: any = cloneDeep(queryParams)
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }
  })
  if (queryParams.storeCode?.length > 0) {
    params.storeCode = queryParams.storeCode.map(item => item?.length > 1 ? item[1] : '')
    params.storeCode = params.storeCode.join(',')
  } else {
    params.storeCode = undefined
  }
  params.validFlag = params.validFlag?.length > 0 ? params.validFlag[0] : 0;
  if (queryParams.directorId?.length > 0) {
    params.directorId = queryParams.directorId.join(',')
  } else {
    delete params.directorId
  }

  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}

// 查询
const onSearch = () => {
  loading.value = true;
  request.get({ url: `/api/opDutyAuthorityManage/store/list`, params: dealParams(cloneDeep(setParamsData())) }).then((res: any) => {
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
    case 'multipleAdd':
      addDrawerRef?.value?.openView(selectRows.value);
      break;
    case 'multipleRemove':
      removeDrawerRef.value?.openView(selectRows.value)
      break;
    case 'log':
      logDrawerRef.value?.openView()
      break;
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

provide('StoreForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });
defineExpose({ onSearch })
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
