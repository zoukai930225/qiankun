<template>
  <ContentWrap class="abutment_card">
    <el-tabs v-model="tabValue" @tab-change="tabChange">
      <el-tab-pane v-for="tab in tabsOptions(roles)" :name="tab.value">
        <template #label>
          <span>{{ tab.label }}
            <span class="nums" v-if="tab.value !== '4'">{{ `(${count[tab.nums]})` }}</span>
          </span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <warehouse-docke-search ref="searchRef" />
    <list-table :list="dataList" :loading="loading" />
    <div class="pagination-wrapper">
      <Pagination :total="page.total" v-model:page="page.page" v-model:limit="page.size" @pagination="getDataList()" />
    </div>
    <warehouse-docking-details ref="detailsRef" />
  </ContentWrap>
</template>

<script lang="ts">
export default { name: 'WarehouseDocking' };
</script>

<script lang="ts" setup>
import WarehouseDockingDetails from "./components/details.vue";
import WarehouseDockeSearch from "./components/search.vue";
import listTable from './components/listTable.vue';
import { tabsOptions, urlValue } from "./components/utils";
import { useRole } from "@/hooks/common/useRole";
import request from '@/config/axios';
import { cloneDeep } from "lodash-es";
import { Page, Count } from "./type";

const route = useRoute();

const { permissionList, roleList, getPermissionInfo, getRole, grabChecks } = useRole('客服');

const page = ref<Page>({ ...new Page() }), detailsRef = ref();

const tabValue = ref<string>('1'), searchRef = ref(), loading = ref<boolean>(false), dataList = ref<Array<any>>([]);

const count = ref<Count>({ ...new Count() });

const roles = computed(() => permissionList.value.map((ps: any) => ps.name).join(','));

const tabChange = () => {
  page.value = { ...new Page() };
  searchRef?.value?.reSetData();
  searchRef?.value?.handleExpandClick();
  getDataList();
};

const statistics = () => {
  request.get({ url: `/api/csWarehouseDockingReturnSent/selectCountList` }).then((res: any) => {
    res && (count.value = { ...res });
  })
};

const getDataList = (id: string = '') => {
  statistics();
  loading.value = true;
  let params: any = {
    ...searchRef?.value?.queryParams,
    warehouse: searchRef?.value?.queryParams.warehouse?.join(','),
    issueType: searchRef?.value?.queryParams.issueType?.join(','),
    registrar: searchRef?.value?.queryParams.registrar?.join(','),
    handler:tabValue.value === '3' ? (searchRef?.value?.queryParams.handler.length>0?searchRef?.value?.queryParams.handler?.join(',') :'') : searchRef?.value?.queryParams.handler,
    registerTimeBegin: searchRef?.value?.queryParams?.registrationTime?.length ? searchRef.value.queryParams.registrationTime[0] : null,
    registerTimeEnd: searchRef?.value?.queryParams?.registrationTime?.length ? searchRef.value.queryParams.registrationTime[1] : null,
    ...page.value
  };
  const data: any = cloneDeep(id ? { ...params, id } : { ...params });
  delete data.registrationTime;
  request.postOriginal({ url: `/api/csWarehouse${urlValue(tabValue.value)}/page`, data }).then((res: any) => {
    if (res.code === 200) {
      dataList.value = (res?.data?.records || []);
      page.value = { ...page.value, total: res?.data?.total || 0 };
    }
  }).finally(() => {
    loading.value = false;
  });
};

const detailsView = (row: any, type: string) => {
  detailsRef?.value?.open(row, type);
};


onMounted(() => {
  count.value = { ...new Count() };
  getPermissionInfo(() => {
    if (route.query?.id) {
      tabValue.value = (route.query.questionType as string);
      getDataList(route.query.id as string);
    } else {
      getDataList()
    }
  });
});

if (route.query?.id) {
  const newUrl = window.location.href.replace(/\?.*$/, '')
  history.replaceState({}, '', newUrl)
};

provide('warehouse_docke_handle', { permissionList, roleList, tabValue, detailsView, getRole, getDataList, grabChecks });

</script>

<style lang="scss" scoped>
@use './components/style.scss';
</style>
