<template>
  <ex-screen>
    <el-tabs v-model="activityName" @tab-change="handleTabChange">
      <el-tab-pane v-for="{ label, name, icon, activedIcon } in tabsOps" :key="name" :name="name">
        <template #label>
          <img class="mr8px" :src="name === activityName ? activedIcon : icon" alt="" />
          <span>{{ label }}</span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <!--- 渠道 --->
    <ChannelPage v-show="activityName === 0" ref="channelRef" @set="handleSet" />
    <!--- 店铺 --->
    <StorePage v-show="activityName === 1" ref="storeRef" @set="handleSet" />
    <!--- 类目 --->
    <CategoryPage v-show="activityName === 2" ref="categoryRef" @set="handleSet" />
    <!--- 商品 --->
    <GoodPage v-show="activityName === 3" ref="goodRef" @set="handleSet" />
    <duty-right-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Dutyright' };
</script>

<script lang="tsx" setup>
import { PageItem, BtnItem } from '@/components/template/config/type';
import DutyRightDetails from "../details/index.vue";
import { usePage, SearchItem } from "./config";
import ChannelIcon from '@/assets/svgs/rights/channel.svg'
import ChannelIconActived from '@/assets/svgs/rights/channel-actived.svg'
import StoreIcon from '@/assets/svgs/rights/store.svg'
import StoreIconActived from '@/assets/svgs/rights/store-actived.svg'
import CategoryIcon from '@/assets/svgs/rights/category.svg'
import CategoryIconActived from '@/assets/svgs/rights/category-actived.svg'
import GoodsIcon from '@/assets/svgs/rights/goods.svg'
import GoodsIconActived from '@/assets/svgs/rights/goods-actived.svg'
import request from '@/config/axios';
import ChannelPage from "../channel/page/index.vue"
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import StorePage from '../store/page/index.vue'
import CategoryPage from '../category/page/index.vue'
import GoodPage from '../good/page/index.vue'
const detailsRef = ref<any>(), plateRef = ref(), boardRef = ref();


const activityName = ref<0 | 1 | 2 | 3>(0)
const { dataList, page, loading, scheme, btns, searchData, column, screen, stateInfo, statistics, handleColumn, setRouterInfo } = usePage({ activityName: toRef(activityName, 'value') });

const tabsOps = [
  { label: '渠道', name: 0, icon: ChannelIcon, activedIcon: ChannelIconActived },
  { label: '店铺', name: 1, icon: StoreIcon, activedIcon: StoreIconActived },
  { label: '类目', name: 2, icon: CategoryIcon, activedIcon: CategoryIconActived },
  { label: '商品', name: 3, icon: GoodsIcon, activedIcon: GoodsIconActived }
]
// const { getPermissionInfo, grabCheck } = useRole('人力行政');

// 处理请求数据
const setParamsData = (noPage: boolean = false) => {
  return noPage ? { ...searchData.value } : { ...searchData.value, page: page.value.page, size: page.value.size };
};


const channelRef = ref<any>();
const storeRef = ref<any>();
const categoryRef = ref<any>();
const goodRef = ref<any>();
// 查询
const onSearch = () => {
  switch (activityName.value) {
    case 0:
      channelRef.value?.onSearch()
      break
    case 1:
      storeRef.value?.onSearch()
      break
    case 2:
      categoryRef.value?.onSearch()
      break
    case 3:
      goodRef.value?.onSearch()
      break
  }
};
const handleTabChange = () => {
  nextTick(() => {
    onSearch()
  })
}
// 重置
const resetForm = () => {
  page.value = { ...new PageItem() };
  searchData.value = { ...new SearchItem() };
  onSearch();
};



// 按钮回调
const onButtonClick = (btn: BtnItem) => {
  ['board'].includes(btn.fun) && boardRef?.value?.openView();
  ['solution', 'seal'].includes(btn.fun) && plateRef?.value?.openDialog(btn.fun);
};

const departmentAllList = ref<any[]>([]);
const getAllDepartment = () => {
  request.get({ url: `/api/department/queryFlatDepartmentUsers`, params: { ignorePermission: true } }).then((res: any) => {
    const dataList = [] as any[]
    res?.map(item => {
      if (item.sysDepartment) {
        item.sysDepartment.status = 'none'
        item.sysDepartment.show = true
        dataList.push(item)
      }
    })
    departmentAllList.value = dataList
    console.log(departmentAllList.value)
  })
}
const menuList = ref<any[]>([])

const initMenu = async () => {
  try {
    const data = await request.get({
      url: '/api/department/getAllDeptTree', params: {
        ignorePermission: true
      }
    })
    menuList.value = data
  } catch (error) { }
}

onMounted(() => {
  dataList.value = [];
  onSearch();
  getAllDepartment()
  initMenu()
});

setRouterInfo();

const handleSet = (data: any) => {
  let params: any = {}
  switch (activityName.value) {
    case 0:
      params = {
        bizId: data.channelCode,
        bizType: activityName.value,
        title: getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, data.channelCode)
      }
      break
    case 1:
      params = {
        bizId: data.storeCode,
        bizType: activityName.value,
        title: data.storeName
      }
      break
    case 3:
      params = {
        bizId: data.goodsId,
        bizType: activityName.value,
        title: data.goodsName
      }
      break
  }
  detailsRef?.value?.openView(params);
}
const getTabsName = computed(() => tabsOps.find(item => item.name === activityName.value)?.label)
provide('DutyrightForm', { searchData, dataList, page, loading, stateInfo, statistics, setParamsData, resetForm, onSearch, onButtonClick, tabsName: getTabsName, departmentAllList, menuList });

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
