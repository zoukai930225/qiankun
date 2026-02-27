<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="List" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="List"
      :column="column" :table-data="dataList" :list-name="'SKU明细列表'"/>
    <list-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'List' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import ListDetails from "../details/index.vue";
import { useRole } from "@/hooks/common/useRole";
import { getIntDictOptions } from '@/utils/dict';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import * as productInfoApi from '@/api/supplier/productInfo'
import { productInfoStore } from '@/store/modules/productInfo'
const  message = useMessage()
const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref();
const productInfoData = productInfoStore()
const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, pageNum: page.value.page, pageSize: page.value.size };
};


// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  request.post({ url: `/api/sc/goods/sku/page`, data: params }).then((res: any) => {
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
// 单个上架
const handlePublishProduct = async (goodsId: string) => {
  await handleUpdateProductStatus(goodsId, true)
}

// 单个下架
const handleUnpublishProduct = async (goodsId: string) => {
  await handleUpdateProductStatus(goodsId, false)
}

// 统一处理单个商品上下架
const handleUpdateProductStatus = async (goodsId: string, isPublish: boolean) => {
  try {
    const actionText = isPublish ? '上架' : '下架'
    const params = {
      outOfStock: isPublish ? 0 : 1,
      goodsIds: [goodsId]
    }

    await message.confirm(`是否确定${actionText}选中的商品?`)

    await productInfoApi.updateProductStatus(params)
    message.success(`${actionText}成功!`)

    // 刷新列表
    onSearch()
  } catch (error) {}
}
// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  if(type === 'publish'){
    handlePublishProduct(item.goodsId)
    return
  }
  if(type === 'unpublish'){
    handleUnpublishProduct(item.goodsId)
    return
  }
  if(type === 'edit'){
    detailsRef?.value?.openView(item, type);
    return
  }
};

// 获取供应商列表
const getSupplierList = async () => {
  const res = await productInfoApi.getApprovedSuppliers()
  productInfoData.supplierList = res || [] // 更新到store中
}

onMounted(() => {
  dataList.value = [];
  onSearch();
  productInfoData.getCategoryOptions()
  getSupplierList()
});

setRouterInfo();

provide('ListForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
