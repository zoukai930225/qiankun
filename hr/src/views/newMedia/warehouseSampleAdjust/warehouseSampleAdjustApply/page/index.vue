<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Warehousesampleadjustapply" :show-expand="true" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Warehousesampleadjustapply"
      :column="column" :table-data="dataList" :list-name="'仓库调样列表'"/>
    <WarehousesampleadjustapplyDetails ref="detailsRef" />
  </ex-screen>
  <skuDetails ref="skuDetailsRef" @success="onSearch"/>
</template>

<script lang="tsx">
export default { name: 'Warehousesampleadjustapply' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import WarehousesampleadjustapplyDetails from "../details/index.vue";
import { useRole } from "@/hooks/common/useRole";
import { getIntDictOptions } from '@/utils/dict';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import skuDetails from "../components/skuDetails.vue";
const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref(), skuDetailsRef = ref<any>();

const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { getPermissionInfo, grabCheck } = useRole('新媒体');
const isManagement = computed(() => grabCheck('样品管理员'))

const personList = ref([])
const personalRequest = ref(false)
const remoteMethod = async () => {
  if (personalRequest.value) {
    return []
  }
  if (personList.value && personList.value.length > 0) {
    return personList.value
  }
  personalRequest.value = true
  const data = await PersonRosterApi.getPersonRosterAvatarOriginList({
    status: '2'
  }).catch(() => {
    personalRequest.value = false
  })
  personList.value = data || []
  personalRequest.value = false
  return personList.value
}

const deptList = ref([])
const getDeptList = ()=>{
  request.get({ url: `/api/employeeMonthlyAssessment/getAllOneDepartment` }).then((res: any) => {
    deptList.value = (res || []).map((rs: any) => ({
      name: rs.name,
      id: rs.id,
      value: rs.id,
      label: rs.name,
      children: rs.children
    }))
  })
}

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value') ,deptList: toRef(deptList,'value')});

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  const params = { ...searchData.value }
  params.createdId = params?.createdIds?.length ? params.createdIds.join() : ''
  params.sampleItemCode = params?.sampleItemCodeList?.length ? params.sampleItemCodeList.join() : ''
  params.applyPurpose = params.applyPurposeList?.length? params.applyPurposeList.join(',') : ''
  params.status = params.statusList?.length? params.statusList.join(',') : ''
  if(params.createdTime && params.createdTime.length) {
    params.createdTimeBegin = params.createdTime[0]
     params.createdTimeEnd = params.createdTime[1]
  }
  params.applyUserOneDepId = params.applyUserOneDepIds?.length? params.applyUserOneDepIds.join(',') : ''
  delete params.createdIds
  delete params.applyPurposeList
  delete params.statusList
  delete params.sampleItemCodeList
  delete params.createdTime
  delete params.applyUserOneDepIds
  return noPage ? { ...params } : { ...params, page: page.value.page, size: page.value.size };
};


// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  request.post({ url: `/api/warehouseSampleAdjustApply/page`, data: params }).then((res: any) => {
    dataList.value = res.records?.length ? [...res.records] : [];
    page.value = { ...page.value, total: res.total };
  }).finally(() => {
    getStateInfo();
    loading.value = false;
  });
};

// 重置
const resetForm = () => {
  page.value = { ...new PageItem(),size:30 };
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
const viewDetails = (type: string, item?: any, btn?: any) => {
  if (type === 'skuDetails') {
    skuDetailsRef?.value?.openDrawer(item, isManagement.value);
    return
  }
  detailsRef?.value?.openView(item, type);
};


onMounted(() => {
  getPermissionInfo().then(() => {
    dataList.value = [];
    onSearch();
    getDeptList()
  })
});

setRouterInfo();

provide('WarehousesampleadjustapplyForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
.status-tag {
  border: solid red 1px;
  padding: 4px 16px;
  font-size: 14px;
  border-radius: 158px;
  text-align: center;
}
</style>
