<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="searchData" name="Todocenter" :show-expand="false" />
    <scheme-table :btn-list="btns" :handle-column="handleColumn" :screen="screen" name="Todocenter" :column="column"
      :table-data="dataList" :list-name="route.meta.title" />
    <todo-center-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Todocenter' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import TodoCenterDetails from "../details/index.vue";
import { treeToArray, redrawTree } from '@/utils';
import { cloneDeep } from 'lodash-es';
import { usePage, SearchItem } from "./config";
import request from '@/config/axios';
defineOptions({
  name: 'SystemTodoCenterPage'
})
const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref();
const route = useRoute();
const userInfo = ref<any>({ isManagement: false, isHrbp: false });
const message = useMessage()
const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ userInfo: toRef(userInfo, 'value') });

// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, size: page.value.size };
};


// 查询
const onSearch = () => {
  const params: any = setParamsData();
  loading.value = true;
  request.get({ url: `/api/todoConfig/list`, params }).then((res: any) => {
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
  onSearch();
};


// 按钮回调
const onButtonClick = (btn: BtnItem) => {
};

// 操作列回调
const viewDetails = (type: string, item?: any, btn?: any) => {
  if (['edit', 'add'].includes(type)) {
    detailsRef?.value?.openView(item, type);
  } else if (type === 'delete') {
    handleDelete(item)
  }

};
/** 删除按钮操作 */
const handleDelete = async (row: any) => {
  try {
    // 删除的二次确认
    await message.confirm(`确认要删除[待办事项]：${row.todoText}吗？`)
    row.loading = true;
    // 发起删除
    await request.get({ url: `/api/todoConfig/delete/${row.id}` })
    message.success('删除成功')
    // 刷新列表
    await onSearch()
  } catch { } finally {

  }
}
const outMenuList = ref<any[]>([])
provide('outMenuList', outMenuList)
onMounted(() => {
  dataList.value = [];
  onSearch();
  getMenuList()
});
const getMenuList = () => {
  request.get({ url: '/api/menu/list' }).then((res: any) => {
    outMenuList.value = redrawTree(treeToArray([...res]).filter((rs: any) => [1, 2].includes(rs.type)).map((rs: any) => {
      let obj: any = cloneDeep(rs);
      delete obj.children;
      return obj
    }), '');
    console.log(outMenuList.value)
  })
};
setRouterInfo();

provide('TodocenterForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, viewDetails });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
