<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Biclear" :show-expand="false" />
    <div class="card-list mb15px mt5px">
      <card :data="value" v-for="(value, index) in menuList" :key="value.title" @click="() => clikCard(index)"
        :loading="cardLoading"></card>
    </div>
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Biclear" :column="column"
      :table-data="dataList" :is-operate="false" />
    <biclear-details ref="detailsRef" />
    <re-execute-dailog ref="reExecuteDailogRef" @success="onSearch" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Biclear' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import BiclearDetails from "../details/index.vue";
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import { cloneDeep } from "lodash-es";
import reExecuteDailog from '../components/reExecuteDailog.vue';
import card from '../components/card.vue'
const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref();
const userInfo = ref<any>({ isManagement: false, isHrbp: false });
const selectStatus = ref<any>('');
const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value'), selectStatus: toRef(selectStatus, 'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, size: page.value.size };
};
const menuList = ref<any[]>([
  {
    title: '总任务数',
    iconType: 1,
    value: 0,
    selected: false
  },
  {
    title: '涉及店铺',
    iconType: 2,
    value: 0,
    selected: false
  },
  {
    title: '成功任务',
    iconType: 3,
    value: 0,
    selected: false
  }, {
    title: '失败任务',
    iconType: 4,
    value: 0,
    selected: false
  }
])


const clikCard = (index: number) => {
  let status = ''
  switch (index) {
    //成功
    case 2:
      status = !menuList.value[index].selected ? '成功' : ''
      break;
    //失败
    case 3:
      status = !menuList.value[index].selected ? '失败' : ''
      break;
  }
  searchData.value.statusList = status;
  onSearch()
}
const dealParams = (queryParams: any, needPage: boolean = true) => {
  const params: any = cloneDeep(queryParams)
  Object.keys(params).forEach(key => {
    if (params[key] === '' || params[key] === null) {
      delete params[key]
    }
    if (params.stores?.length > 0) {
      params.stores = queryParams.stores.map(item => item?.length > 1 ? item[1] : '')
      params.stores = params.stores.join(',')
    } else {
      params.stores = undefined
    }

  })

  if (!needPage) {
    delete params.page
    delete params.size
  }
  return params
}
const oldSearch = ref<any>()
// 查询
const onSearch = () => {
  const params: any = dealParams(setParamsData());
  if (oldSearch.value && (oldSearch.value.dataDate !== params.dataDate || oldSearch.value.stores !== params.stores)) {
    getTotalData()
  }
  oldSearch.value = cloneDeep(params)

  loading.value = true;
  request.get({ url: `/api/cleanDashboard/list`, params }).then((res: any) => {
    dataList.value = res.records?.length ? [...res.records] : [];
    page.value = { ...page.value, total: res.total };
  }).finally(() => {

    loading.value = false;
  });
};
const cardLoading = ref(false)
const getTotalData = () => {
  const params: any = dealParams(setParamsData(), false);
  delete params.statusList
  cardLoading.value = true;
  request.get({ url: `/api/cleanDashboard/statistics`, params }).then((res: any) => {
    menuList.value[0].value = res.totalTask || 0
    menuList.value[1].value = res.totalStore || 0
    menuList.value[2].value = res.successTask || 0
    menuList.value[3].value = res.failTask || 0
  }).finally(() => {
    cardLoading.value = false;
  });
}
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
const reExecuteDailogRef = ref<any>()
// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  if (type === 'reCall') {
    reExecuteDailogRef.value?.open(item)
    return
  }
  detailsRef?.value?.openView(item, type);
};

onMounted(() => {
  dataList.value = [];
  onSearch();
  getTotalData()
});


setRouterInfo();

watch(() => searchData.value.statusList, (val) => {
  if (val === '' || val === undefined) {
    menuList.value.map(item => item.selected = false)
  } else if (val === '成功') {
    menuList.value.map((item, index) => {
      if (index === 2) {
        item.selected = true
      } else {
        item.selected = false
      }
    })
  } else {
    menuList.value.map((item, index) => {
      if (index === 3) {
        item.selected = true
      } else {
        item.selected = false
      }
    })
  }

})


provide('BiclearForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
