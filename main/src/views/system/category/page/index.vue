<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Category" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Category" :column="column"
      :table-data="dataList" :list-name="'品类管理列表'" />
    <category-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Category' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import CategoryDetails from "../details/index.vue";
import { usePage, SearchItem, CategoryItem } from "../config/config";
import { useRole } from "@/hooks/common/useRole";
import { getIntDictOptions } from '@/utils/dict';
import request from '@/config/axios';
const message = useMessage()
const categoryTree: Ref<CategoryItem[]> = ref([])
const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref();

const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value'), categoryTree: toRef(categoryTree, 'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, pageSize: page.value.size };
};


// 查询
const onSearch = () => {
  const params: any = setParamsData();
  const category = params['category']
  if(category && category.length > 0) {
    params['categoryCode'] = category[category.length - 1] || undefined
    delete params['category']
  }
  loading.value = true;
  request.get({ url: `/api/sysCategory/list`, params }).then((res: any) => {
    dataList.value = res.records?.length ? [...res.records] : [];
    page.value = { ...page.value, total: res.total };
  }).finally(() => {
    getStateInfo();
    loading.value = false;
  });
};

// 重置
const resetForm = () => {
  page.value = { ...new PageItem() };
  searchData.value = { ...new SearchItem() };
  onSearch();
};

// 状态筛选查询（无状态筛选可删除）
const getStateInfo = () => {
  // const params: any = setParamsData();
  // request.post({ url: `/api/employeeMonthlyAssessment/statistics`, data: params }).then((res: any) => {
  //   res && (stateInfo.value = { ...res });
  // });
};

// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  ['board'].includes(btn.fun) && boardRef?.value?.openView();
  ['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun);
};

// 操作列回调
const viewDetails = async (type: string, item?: any, btn?: any) => {
  // 删除
  if (type === 'customDel') {
    await message.delConfirm('是否确认删除该品类数据？')
    const { id } = item
    await request.post({ url: `/api/sysCategory/delete`, data: [id] })
    message.success('删除成功')
    getCategoryTree()
    onSearch();
    return
  }
  // 编辑
  detailsRef?.value?.openView(item, type);
};


const getCategoryTree = async () => {
  categoryTree.value = await request.get({ url: `/api/sysCategory/queryCategoryTree` })
}

onMounted(() => {
  getCategoryTree()
  dataList.value = [];
  onSearch();
});

setRouterInfo();

provide('CategoryForm', { searchData, dataList, page, loading, stateInfo, statistics, categoryTree, setParamsData, resetForm, onSearch, onButtonClick, viewDetails,  getCategoryTree });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
