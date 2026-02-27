<template>
  <s-w-search-form :schema="searchSchema" :expand-threshold="4" show-expand expand-text="展开" collapse-text="收起"
    @search="onSearch" @reset="reSetData" ref="searchFormRef">
    <el-dropdown @command="commandChange" v-if="isAdd">
      <el-button type="primary" icon="Plus">新增</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="detailsView">新增</el-dropdown-item>
          <el-dropdown-item command="exportData">导出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button v-else type="primary" @click="exportData">导出</el-button>
  </s-w-search-form>
</template>

<script lang="tsx">
export default { name: 'TransactionSearch' }
</script>

<script lang="tsx" setup>
import StoreSelect from '@/components/common/store/storeSelect.vue';
import { TabsProvideType, SearchItem, statusOptions } from './type';
import SelectUser from '@/components/common/user/selectUser.vue';
import { exportDataInfo } from "@/api/transactionOrder";
import { cloneDeep, debounce } from 'lodash-es';
import { FormSchema } from '@/types/form';
import download from '@/utils/download';

const { permissionList, roleList, activeValue, detailsView, getDataList } = inject('transaction_order_handle') as TabsProvideType;

const queryParams = ref<SearchItem>({ ...new SearchItem() }), searchFormRef = ref(), timeSelectRef = ref();

const searchSchema: Array<FormSchema> = [
  {
    field: 'keyword',
    label: '商品主键',
    component: 'Input',
    componentProps: {
      placeholder: '请输入商品编码/ID',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'keyword'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, keyword: searchFormRef.value?.formModel?.keyword };
          await nextTick()
          onSearch();
        }
      }
    }
  },
  {
    field: 'categoryName',
    label: '类目',
    component: 'Input',
    componentProps: {
      placeholder: '请输入商品类目',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'categoryName'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, categoryName: searchFormRef.value?.formModel?.categoryName };
          await nextTick()
          onSearch();
        }
      }
    }
  },
  {
    field: 'stores',
    label: '店铺',
    customRender: (_item, _model) => <StoreSelect v-model={queryParams.value.stores} onChange={storeChange} />
  },
  {
    field: 'salePoint',
    label: '主卖点',
    component: 'Input',
    componentProps: {
      placeholder: '请输入主卖点',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'salePoint'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, salePoint: searchFormRef.value?.formModel?.salePoint };
          await nextTick()
          onSearch();
        }
      }
    }
  },
  {
    field: 'created',
    label: '填报日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'created'),
    }
  },
  {
    field: 'expected',
    label: '补单日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'expected'),
    }
  },
  {
    field: 'contentExpected',
    label: '内容排期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'contentExpected'),
    }
  },
  {
    field: 'orderExpected',
    label: '刷单日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'orderExpected'),
    }
  },
  {
    field: 'createdUser',
    label: '填报人员',
    customRender: (_item, _model) =>
      <SelectUser v-model={queryParams.value.created} role={getRole('运营')}
        onChange={(val: any) => userChange(val, 'createdUser')} />
  },
  {
    field: 'commentCreatedUser',
    label: '评论人员',
    customRender: (_item, _model) =>
      <SelectUser v-model={queryParams.value.commentCreated} role={getRole('评论')}
        onChange={(val: any) => userChange(val, 'commentCreatedUser')} />
  },
  {
    field: 'middlegroundCreatedUser',
    label: '中台人员',
    customRender: (_item, _model) =>
      <SelectUser v-model={queryParams.value.middlegroundCreated} role={getRole('中台')}
        onChange={(val: any) => userChange(val, 'middlegroundCreatedUser')} />
  },
  {
    field: 'statuses',
    label: '状态',
    component: 'Select',
    componentProps: {
      placeholder: '请选择状态',
      options: statusOptions,
      collapseTags: true,
      collapseTagsTooltip: true,
      multiple: true,
      clearable: true,
      onChange: (val: any) => valueChange(val, 'statuses')
    }
  },
];

const isAdd = computed(() => permissionList.value.map((ps: any) => ps.name).join(',').includes('运营'));

const getRole = (name: string) => {
  const tar: any = roleList.value.find((rs: any) => rs.name.includes(name));
  return tar?.id || '';
};

const timeChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value });
  obj[`${name}StartDate`] = val?.length ? val[0] : null;
  obj[`${name}EndDate`] = val?.length ? val[1] : null;
  queryParams.value = { ...obj };
  onSearch();
};

const userChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value });
  obj[name] = val?.length ? val.join(',') : '';
  queryParams.value = { ...obj };
  onSearch();
};

const storeChange = (val: any) => {
  let obj: any = cloneDeep({ ...queryParams.value });
  obj.store = val?.length ? val[1] : '';
  queryParams.value = { ...obj };
  onSearch();
};

const valueChange = (val: any, name: string) => {
  if (queryParams.value[name] !== val) {
    queryParams.value[name] = val;
    onSearch();
  }
};

const onSearch = debounce(() => getDataList(), 500);

const commandChange = (com: string) => com === 'detailsView' ? detailsView({}, 'add') : exportData();

const reSetData = () => {
  timeSelectRef?.value?.resetDate();
  queryParams.value = { ...new SearchItem() };
};

const exportData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true
  });
  exportDataInfo({ ...queryParams.value, self: activeValue.value !== 'all' }).then((res: any) => {
    res && download.excel(res, `${activeValue.value === 'all' ? '全部' : '我的'}运营补单统计表.xlsx`)
  }).finally(() => {
    loadingInstance.close();
  });
}

defineExpose({ onSearch, queryParams })
</script>
<style lang="scss" scoped></style>
