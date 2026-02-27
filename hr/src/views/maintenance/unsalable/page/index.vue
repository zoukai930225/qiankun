<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Unsalable" />
    <scheme-table ref="tableRef" :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Unsalable"
      :column="column" :table-data="dataList" :list-name="'滞销滞卖货品列表'" is-selection :is-index="false" />
    <unsalable-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Unsalable' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import { deleteData } from '@/api/productManage/deadStock';
import UnsalableDetails from "../details/index.vue";
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';

const detailsRef = ref<any>(), tableRef = ref(), message = useMessage();

const selectRows = computed(() => tableRef?.value?.selectRows || []);

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ selectRows: toRef(selectRows, 'value') });

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, size: page.value.size };
};

// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  request.get({ url: `/api/opUnsalableGoods/list`, params: params }).then((res: any) => {
    dataList.value = res?.records?.length ? [...res.records] : [];
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
  if (btn.fun === 'batchDeletion') {
    handleDelete(selectRows.value.map((si: any) => si.id).join(','));
  }
};

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  if (type !== 'delData') {
    detailsRef?.value?.openView(item, type);
  } else {
    handleDelete(item.id);
  }
};

const handleDelete = async (id: string) => {
  await message.confirm('删除当前内容可能造成数据丢失，是否确定删除？')
  let res: any = await deleteData(id)
  if (res.success) {
    message.success('删除成功')
    onSearch()
  }
}

onMounted(() => {
  dataList.value = [];
  onSearch();
});

setRouterInfo();

provide('UnsalableForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
