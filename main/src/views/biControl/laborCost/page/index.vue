<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Laborcost" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Laborcost" :column="column"
      :table-data="dataList" :list-name="route.meta.title" />
    <labor-cost-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Laborcost' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import LaborCostDetails from "../details/index.vue";
import { usePage, SearchItem } from "./config";
import { ElMessageBox } from 'element-plus'
import request from '@/config/axios';
import dayjs from 'dayjs';
import { useExportParams } from '@/store/modules/BI'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
const ExportParams = useExportParams()
defineOptions({ name: 'biPackageConsumeLaborCost' })
const route = useRoute()
const detailsRef = ref<any>();

const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, pageNum: page.value.page, pageSize: page.value.size };
};

const message = useMessage();
// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  request.get({ url: `/api/customFee/queryList`, params: params }).then((res: any) => {
    dataList.value = res.list?.length ? [...res.list] : [];
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

};

const handleDelete = (row: any) => {
  let start = '-', end = '-'
  if (dayjs(row.effectiveStartDate).isValid()) {
    start = dayjs(row.effectiveStartDate).format('YYYY-MM-DD')
  }
  if (dayjs(row.effectiveEndDate).isValid()) {
    end = dayjs(row.effectiveEndDate).format('YYYY-MM-DD')
  }
  ElMessageBox.confirm(`<div>费用名称：${row.feeName}</div><div>生效日期：${start} ~ ${end}</div>`, '删除确认', {
    dangerouslyUseHTMLString: true,
    type: 'error',
    center: true,
    cancelButtonClass: 'cancelbth',
    confirmButtonClass: 'yepbth',
    customClass: 'custom_class_confirm'
  }).then(() => {
    request.get({ url: '/api/customFee/deleteById', params: { id: row.id } }).then(res => {
      message.success('删除成功')
      onSearch()
    })
  }).catch(() => { })
}

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  console.log("onButtonClick", type, item, btn)
  switch (type) {
    case 'add':
      detailsRef?.value?.openView({}, 'add')
      break;
    case 'delete':
      handleDelete(item)
      break;
    default:
      detailsRef?.value?.openView(item, type)
      break;
  }
};

onMounted(() => {
  dataList.value = [];
  onSearch();
  getWarehouseList()
  getCategoryList()
  getStandCategoryList()
  getOldCategoryList()
});

const warehouseList = ref([])
function getWarehouseList() {
  request.get({ url: `/api/wdtWarehouseDetail/getWarehouse`, params: { warehouse: '' } }).then(res => {
    warehouseList.value = res
  })
}
//电商类目
const categoryListData = ref<any[]>([])
const getCategoryList = async () => {
  categoryListData.value = await ExportParams.getCategoryAllList()
}
//SW标准类目
const standCategoryListData = ref<any[]>([])
const getStandCategoryList = async () => {
  standCategoryListData.value = await request.get({ url: `/api/sysCategory/queryCategoryTree` })
}
//sw旧类目
const oldCategoryListData = ref<any[]>([])
const getOldCategoryList = async () => {
  const data: any[] = getIntDictOptions(DICT_TYPE.STANDARD_CATEGORY, true)
  data.map(item => {
    const categoryKey = `standard_category_${item.code.toLowerCase()}`;
    item.children = getIntDictOptions(categoryKey, true)
  })
  oldCategoryListData.value = data
  console.log(oldCategoryListData.value)
}

setRouterInfo();

provide('LaborcostForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails, warehouseList, categoryListData, standCategoryListData, oldCategoryListData });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
