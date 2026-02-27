<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Comment" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Comment" :column="column"
      :table-data="dataList" :is-operate="false" />
    <comment-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Comment' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import CommentDetails from "../details/index.vue";
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import dayjs from 'dayjs';

const route = useRoute();
const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref();

//最新入库日期
const maxDate = ref<any>('');
const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ maxDate: toRef(maxDate, 'value') });

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, size: page.value.size };
};


// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  params.store = route.name === 'ChannelTabaoCommentPage' ? 'swTaobao' : 'swTmall';
  request.get({ url: `/api/odsTaoProductDetailComments/list`, params }).then((res: any) => {
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
  searchData.value.dataDate = maxDate.value;
  onSearch();
};


// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  ['board'].includes(btn.fun) && boardRef?.value?.openView();
  ['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun);
};

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  console.log("viewDetails", type, item, btn)
  if (btn.txt.includes('评论')) {
    item.detailType = 'comment'
  } else {
    item.detailType = 'ask'
  }
  item.store = route.name === 'ChannelTabaoCommentPage' ? 'swTaobao' : 'swTmall';
  detailsRef?.value?.openView(item, type);
};

const queryMaxData = async () => {
  try {
    loading.value = true
    let store = route.name === 'ChannelTabaoCommentPage' ? 'swTaobao' : 'swTmall';
    const res = await request.get({ url: `/api/odsTaoProductDetailComments/getMaxDate/${store}` })
    maxDate.value = dayjs(res?.dataDate ?? '').isValid() ? dayjs(res.dataDate).format('YYYY-MM-DD') : dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    searchData.value.dataDate = maxDate.value;
    onSearch()
  } catch (error) {
    console.log(error)
    maxDate.value = dayjs().subtract(1, 'day').format('YYYY-MM-DD')
    searchData.value.dataDate = maxDate.value;
    onSearch()
  } finally {

  }
}

onMounted(() => {
  dataList.value = [];
  queryMaxData();
});

setRouterInfo();

provide('CommentForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
