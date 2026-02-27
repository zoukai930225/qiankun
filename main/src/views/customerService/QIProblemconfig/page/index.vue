<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Qiproblemconfig" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Qiproblemconfig"
      :column="column" :table-data="dataList" :list-name="'人员组别配置列表'"/>
    <QiproblemconfigDetails ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Qiproblemconfig' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import QiproblemconfigDetails from "../details/index.vue";
import { useRole } from "@/hooks/common/useRole";
import { getIntDictOptions } from '@/utils/dict';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';

const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref(),message = useMessage();

const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { getPermissionInfo, grabCheck } = useRole('客服');

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value'),grabCheck });



// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, pageNum: page.value.page, pageSize: page.value.size };
};


// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  request.post({ url: `/api/personnelGroup/list`, data: params }).then((res: any) => {
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
};

// 操作列回调
const viewDetails = async(type: string, item?: any, btn?: any) => {
  if(type === 'delete'){
    await message.confirm('请确认是否删除该条数据？')
    request.get({ url:`/api/personnelGroup/del?id=${item.id}`}).then(()=>{
      message.success('删除成功')
      onSearch();
    })
  }else{
    detailsRef?.value?.openView(item, type);
  }
  
};

onMounted(() => {
  getPermissionInfo(()=>{
    dataList.value = [];
    onSearch();
  })
  
});

setRouterInfo();

provide('QiproblemconfigForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
