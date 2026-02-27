<template>
  <ex-screen ref="contentWrapRef">
    <!-- <table-box v-bind="{ maxViewHeight: innerHeight, thresholdValue: 0 }">
      <template #prePart>
        <query-scheme :scheme="scheme" v-model="searchData" name="List" :show-expand="true" />
      </template>
      <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="List"
      :column="column" :table-data="dataList" :list-name="'货品信息列表'"/>
    </table-box> -->
    <query-scheme :scheme="scheme" v-model="searchData" name="List" :show-expand="true" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="List"
      :column="column" :table-data="dataList" :list-name="'货品信息列表'" isSelection ref="tableRef"/>
    <list-details ref="detailsRef" />
  </ex-screen>

  <!-- 选择供应商弹窗 -->
  <choose-supplier ref="chooseSupplierRef" @success="onSearch"/>
</template>

<script lang="tsx">
export default { name: 'List' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import ListDetails from "../details/index.vue";
import ChooseSupplier from '@/views/supplier/productInfo/components/chooseSupplier.vue'
// import { useRole } from "@/hooks/common/useRole";
// import { getIntDictOptions } from '@/utils/dict';
// import tableBox from '../../../components/tableBox.vue'
// import ContentWrap from '@/components/ContentWrap/src/ContentWrap.vue'
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import * as productInfoApi from '@/api/supplier/productInfo'
import { productInfoStore } from '@/store/modules/productInfo'
import { useSupplierProduct } from '@/store/modules/supplier'
const supplierProduct = useSupplierProduct()
const productInfoData = productInfoStore()
const getProductCategoryList = async () => {
  const res = await productInfoApi.getProductCategoryList()
  // options.value = res || []
  productInfoData.categoryOptions = res || [] // 更新到store中
}
// 获取供应商列表
const getSupplierList = async () => {
  const res = await productInfoApi.getApprovedSuppliers()
  productInfoData.supplierList = res|| [] // 更新到store中
}
// 获取跟单人员列表
const selectLoading = ref(false)
const getPeopleList = async () => {
  try {
    selectLoading.value = true
    const data = await productInfoApi.getSupplyChainCenterList()
    productInfoData.peopleList = data || [] // 更新到store中
  } catch (error) {
    console.error('请求失败:', error)
  } finally {
    selectLoading.value = false
  }
}

const contentWrapRef = ref() , message = useMessage() ,router = useRouter()

const innerHeight = computed(() => contentWrapRef.value?.height || 0)

const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref(),tableRef = ref<any>();

const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value'),productInfoData,supplierProduct });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  const categories = Array.from(new Set(searchData.value?.categories.flat() || []).values())
    const params = { ...searchData.value,categories }
  return noPage ? { ...params } : { ...params, pageNum: page.value.page, pageSize: page.value.size };
};


// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  request.post({ url: `/api/sc/goods/pageQuery`, data: params }).then((res: any) => {
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
  // ['board'].includes(btn.fun) && boardRef?.value?.openView();
  // ['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun);
  ['chooseSupplier'].includes(btn.fun) && openChooseSupplierDialog();
  ['publish', 'unpublish'].includes(btn.fun) && handlePublish(btn.fun);
  ['syncERP'].includes(btn.fun) && handleSyncERP();
};
const selectRows = computed(() => tableRef?.value?.selectRows || []);

// 打开选择供应商弹窗
const chooseSupplierRef = ref<{ open: (selectedProducts) => void } | null>(null)
function openChooseSupplierDialog() {
  if (selectRows.value.length === 0) {
    message.warning('请先选择货品')
    return
  }
  chooseSupplierRef.value?.open(selectRows.value)
}

// 上架/下架操作
const handlePublish = async (keyValue: string) => {
  if (selectRows.value.length === 0) {
    message.warning('请先选择货品')
    return
  }
  try {
    const params = {
      outOfStock: keyValue === 'publish' ? 0 : 1, // 上架为0，下架为1
      goodsIds: selectRows.value.map((item) => item.goodsId) // 选中的商品ID
    }
    await message.confirm(`是否确定${keyValue === 'publish' ? '上架' : '下架'}选中的商品?`)

    await productInfoApi.updateProductStatus(params)
    message.success(`${keyValue === 'publish' ? '上架' : '下架'}成功!`)
    // 刷新列表
    onSearch()
    tableRef?.value?.clearSelection()
  } catch {}
}

// 同步ERP操作
const handleSyncERP = async () => {
  try {
    await message.confirm('是否确定同步商品到ERP?')
    const res = await productInfoApi.syncProductsToERP()
    if (!res.success) {
      message.error(res.message)
      return
    }
    message.success('同步成功!')
    // 刷新列表
    onSearch()
    tableRef?.value?.clearSelection()
  } catch {}
}

// 查看SKU明细逻辑
const handleViewSkuDetails = (goodsId: string) => {
  // 处理打开新页面
  router.push({ name: 'ProductInfoSKUList', query: { goodsId } })
}
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
  console.log(type, item, btn)
  if(type === 'SKU'){
    handleViewSkuDetails(item.goodsId)
    return
  }
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

onMounted(() => {
  supplierProduct.getSupplierList()
  productInfoData.getCategoryOptions()
  getPeopleList()
  getSupplierList()
  getProductCategoryList()
  dataList.value = [];
  onSearch();
});

setRouterInfo();

provide('ListForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
