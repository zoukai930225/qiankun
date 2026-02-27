<template>
  <div>
    <query-scheme :scheme="scheme" v-model="searchData" name="Category" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Category" :column="column"
      ref="tableRef" :table-data="dataList" :list-name="'类目管理列表'" is-selection
      :tableProps="{ selectable: isSelectable }" />
    <log-drawer ref="logDraweRef" />
    <add-single ref="addSingleRef" />
    <add-drawer ref="addDrawerRef" />
    <remove-drawer ref="removeDrawerRef" />
  </div>
</template>

<script lang="tsx">
export default { name: 'Category' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import { cloneDeep } from 'lodash-es';
import LogDrawer from '../components/logDrawer.vue';
import AddSingle from '../components/addSingle.vue';
import { getDictValue, DICT_TYPE } from '@/utils/dict'
import AddDrawer from '../components/addDrawer.vue';
import RemoveDrawer from '../components/removeDrawer.vue';
const logDraweRef = ref<any>(), addSingleRef = ref(), tableRef = ref(), addDrawerRef = ref(), removeDrawerRef = ref();
const channelCode = computed(() => {
  return searchData.value.store?.length > 0 ? [searchData.value.store[0]] : []
})
const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo, defalutStoreValue } = usePage({ userInfo: toRef(userInfo, 'value'), channelCode: toRef(channelCode, 'value') });
const isSelectable = (row: any) => {
  if (tableRef?.value?.selectRows.length === 0) {
    return true
  }
  let channel = tableRef?.value?.selectRows[0].channel
  return row.channel === channel
  return
}
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

  if (queryParams.store?.length > 0) {
    params.store = queryParams.store[queryParams.store.length - 1]
  } else {
    params.store = undefined
  }
  params.validFlag = params.validFlag?.length > 0 ? params.validFlag[0] : 0;
  if (queryParams.directorId?.length > 0) {
    params.directorId = queryParams.directorId.join(',')
  } else {
    delete params.directorId
  }

  if (queryParams?.categroy?.length > 0) {
    params.completeCategoryName = queryParams.categroy.filter((item, index) => index > 0).join('>>')
    params.channel = getDictValue(DICT_TYPE.SYSTEM_PARAM_CHANNEL, queryParams.categroy[0])
  }
  delete params.categroy

  delete params.categroyType
  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}

// 查询
const onSearch = () => {
  loading.value = true;
  request.get({ url: `/api/opDutyAuthorityManage/storeCategory/list`, params: dealParams(cloneDeep(setParamsData())) }).then((res: any) => {
    dataList.value = res.records?.length ? [...res.records] : [];
    page.value = { ...page.value, total: res.total };
  }).finally(() => {
    loading.value = false;
  });
};

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() };
  searchData.value = {
    ...new SearchItem(), ...{ store: defalutStoreValue.value }
  };
  onSearch();
};


// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  switch (btn.fun) {
    case 'log':
      logDraweRef?.value.openView();
      break;
    case 'multipleAdd':
      addDrawerRef?.value.openView(tableRef.value?.selectRows);
      break;
    case 'multipleRemove':
      removeDrawerRef?.value.openView(tableRef.value?.selectRows);
      break;
  }
};

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  if (type === 'set') {
    addSingleRef.value?.openView(item)
  }
};

onMounted(() => {
  dataList.value = [];
});

setRouterInfo();

provide('CategoryForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });
defineExpose({ onSearch })
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
