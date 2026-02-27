<template>
  <ex-screen>
    <el-tabs  class="demo-tabs" v-model="activeTab" @tab-change="onSearch">
      <el-tab-pane :label="dict.label" :name="dict.value" v-for="dict in processList" :key="dict.value"/>
    </el-tabs>
    <query-scheme :scheme="scheme" v-model="searchData" name="CategoryManager" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="CategoryManager"
      :column="column" :table-data="dataList" :list-name="activeTabName"/>
    <categoryManager-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'CategoryManager' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import CategoryManagerDetails from "../details/index.vue";
import { usePage, SearchItem } from "../config/config";
// import { useRole } from "@/hooks/common/useRole";
import { getIntDictOptions,DICT_TYPE,getDictLabel } from '@/utils/dict';
import { getSysCategoryManagerList,deleteSysCategoryManager } from '@/api/system/categoryManager';
import { queryCategoryTree } from '@/api/system/categoryManager'

const message = useMessage()
const processList = computed(()=>getIntDictOptions(DICT_TYPE.SYS_CATEGORY_MANAGER_PROCESS))
const activeTabName = computed(()=>getDictLabel(DICT_TYPE.SYS_CATEGORY_MANAGER_PROCESS,activeTab.value))

const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref(), activeTab = ref('product'), categoryList = ref([]);

const userInfo = ref<any>({ isManagement: false, isHrbp: false });

const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value'),categoryList: toRef(categoryList,'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  const params = { ...searchData.value } 
  if(params?.category?.length){
    params.categoryCode = params.category[params?.category?.length - 1] 
  }
  // console.log(params?.managers)
  // if(params?.managers?.length){
  //   params.managerId = params?.managers.map((user:any)=>user.userId).join(',')
  // }
  params.process = activeTab.value
  delete params.category
  delete params.managers
  return noPage ? params : { ...params, page: page.value.page, pageSize: page.value.size };
};


// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  getSysCategoryManagerList(params).then((res: any) => {
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
  if( type === 'delete'){
    await message.confirm('是否确认删除该品类负责人数据?')
    const id = item.id
    deleteSysCategoryManager([id]).then(()=>{
      message.success('删除成功')
      onSearch();
    })
  }else{
    detailsRef?.value?.openView(item, type);
  }
  
};

// 获取品类树
const getCategoryTree = async()=>{
  queryCategoryTree().then((res:any)=>{
    categoryList.value = res || []
  })
}

onMounted(() => {
  getCategoryTree()
  dataList.value = [];
  onSearch();
});

setRouterInfo();

provide('CategoryManagerForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails , });
provide('categoryList',{categoryList})

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
