<template>
  <ex-screen>
    <el-tabs v-model="tabValue" @tab-change="onSearch">
      <el-tab-pane v-for="tab in tabsOptions(roles)" :name="tab.value">
        <template #label>
          <span>{{ tab.label }}
            <span class="nums" v-if="tab.value !== '4'">{{ `(${count[tab.nums]})` }}</span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <query-scheme :scheme="scheme" v-model="searchData" name="List" :show-expand="true" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="List"
      :column="column" :table-data="dataList" :list-name="'客服仓库对接列表'"/>
    <list-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'List' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import ListDetails from "../details/index.vue";
import { tabsOptions, urlValue } from "../../components/utils";
import { useRole } from "@/hooks/common/useRole";
import { getIntDictOptions } from '@/utils/dict';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
import { Page, Count } from "../../type";

const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref();
const tabValue = ref<string>('1')
const userInfo = ref<any>({ isManagement: false, isHrbp: false });
const count = ref<Count>({ ...new Count() });
const { permissionList, roleList, getPermissionInfo, getRole, grabChecks } = useRole('客服');
const roles = computed(() => permissionList.value.map((ps: any) => ps.name).join(','));

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value'),tabValue:toRef(tabValue,'value'),roles:toRef(roles,'value'),getRole,grabChecks });
provide('tabValue',{tabValue,roles})
// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  getCount()
  let params: any = {
    ...searchData?.value,
    warehouse: searchData?.value?.warehouse?.join(','),
    issueType: searchData?.value?.issueType?.join(','),
    registrar: searchData?.value?.registrar?.join(','),
    handler:tabValue.value === '3' ? (searchData?.value?.handler?.length>0?searchData?.value?.handler?.join(',') :'') : searchData?.value?.handler,
    registerTimeBegin: searchData?.value?.registrationTime?.length ? searchData.value.registrationTime[0] : null,
    registerTimeEnd: searchData?.value?.registrationTime?.length ? searchData.value.registrationTime[1] : null,
  };
  delete params.registrationTime
  return noPage ? { ...params } : { ...params, page: page.value.page, size: page.value.size };
};

const getCount = () => {
  request.get({ url: `/api/csWarehouseDockingReturnSent/selectCountList` }).then((res: any) => {
    res && (count.value = { ...res });
  })
};
// 查询
const onSearch = () => {
  const data: any = setParamsData();
  loading.value = true;
   request.post({ url: `/api/csWarehouse${urlValue(tabValue.value)}/page`, data }).then((res: any) => {
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
const viewDetails = (type: string, item?: any, btn?: any) => {
  detailsRef?.value?.openView(item, type);
};

onMounted(() => {
  count.value = { ...new Count() };
  getPermissionInfo(()=>{
    dataList.value = [];
    onSearch();
  })
});

setRouterInfo();

provide('ListForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
