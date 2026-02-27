<template>
  <div>
    <query-scheme :scheme="scheme" v-model="searchData" name="Good" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Good" :column="column"
      :table-data="dataList" :list-name="'商品管理列表'" is-selection ref="tableRef" />
    <add-drawer ref="addDrawerRef" />
    <remove-drawer ref="removeDrawerRef" />
    <log-drawer ref="logDrawerRef" />
  </div>
</template>

<script lang="tsx">
export default { name: 'Good' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import { cloneDeep } from 'lodash-es';
import AddDrawer from '../components/addDrawer.vue';
import { getDictValue, DICT_TYPE } from '@/utils/dict'
import RemoveDrawer from '../components/removeDrawer.vue'
import LogDrawer from '../components/logDrawer.vue';
const addDrawerRef = ref<any>(), tableRef = ref(), removeDrawerRef = ref(), logDrawerRef = ref();
const selectRows = computed(() => tableRef?.value?.selectRows || []);
const userInfo = ref<any>({ isManagement: false, isHrbp: false });
const channelCode = computed(() => {
  return searchData.value.store?.length > 0 ? [...new Set(searchData.value.store.map(item => item[0]))] : ['TaoBao','Tmall','Pdd','Douyin']
})
const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value'), channelCode: toRef(channelCode, 'value') });

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
    params.store = queryParams.store.map(item => item?.length > 1 ? item[1] : '')
    params.store = params.store.join(',')
  } else {
    params.store = undefined
  }
  params.validFlag = params.validFlag?.length > 0 ? params.validFlag[0] : 0;
  if (queryParams.confirmTimes.startTime) {
    params.startTime = queryParams.confirmTimes.startTime;
  }
  if (queryParams.confirmTimes.endTime) {
    params.endTime = queryParams.confirmTimes.endTime;
  }
  delete params.confirmTimes;

  if (queryParams.addTimes.groundingStartTime) {
    params.groundingStartTime = queryParams.addTimes.groundingStartTime;
  }
  if (queryParams.addTimes.groundingEndTime) {
    params.groundingEndTime = queryParams.addTimes.groundingEndTime;
  }
  delete params.addTimes

  if (queryParams?.mix) {
    if (typeof queryParams?.mix === 'object' && queryParams.mix.id) {
      params.mixSearch = queryParams.mix.query;
      params.mixSearchType = queryParams.mix.id;
    } else {
      params.mixSearchType = 1
      params.mixSearch = queryParams.mix.split('\n').filter(item => item.trim() !== '').join(',')
    }
  }
  if (queryParams?.categroy?.length > 0) {
    params.completeCategoryName = queryParams.categroy.filter((val, i) => i > 0).join('>>')
    if (queryParams.store?.length === 0) {
      params.channel = getDictValue(DICT_TYPE.SYSTEM_PARAM_CHANNEL, queryParams.categroy[0])
    }
  }
  delete params.categroy;
  delete params.mix;

  console.log(queryParams, params)

  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}

// 查询
const onSearch = () => {
  loading.value = true;
  request.get({ url: `/api/opDutyAuthorityManage/goods/list`, params: dealParams(cloneDeep(setParamsData())) }).then((res: any) => {
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
      break
    case 'multipleRemove':
      removeDrawerRef?.value?.openView(selectRows.value);
      break
    case 'log':
      logDrawerRef?.value?.openView();
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

provide('GoodForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });
defineExpose({ onSearch })
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
