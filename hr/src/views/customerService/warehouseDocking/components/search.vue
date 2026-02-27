<template>
  <s-w-search-form :schema="searchSchema" :expand-threshold="4" show-expand expand-text="展开" collapse-text="收起"
    @search="onSearch" @reset="reSetData" ref="searchFormRef" label-width="71px">
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
export default { name: 'WarehouseDockeSearch' }
</script>

<script lang="tsx" setup>
import GoodCode from "@/components/template/query/components/goodCode.vue";
import SelectUser from '@/components/common/user/selectUser.vue';
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict';
import { TabsProvideType, SearchItem } from '../type';
import { hasPermissionsJs } from '@/utils/index';
import { urlValue, tabsOptions } from "./utils";
import { FormSchema } from '@/types/form';
import download from '@/utils/download';
import { debounce } from 'lodash-es';
import request from '@/config/axios';

const { permissionList, tabValue, getRole, getDataList, detailsView } = inject('warehouse_docke_handle') as TabsProvideType;

const isAdd = computed(() => {
  if(tabValue.value === '3'){
    return roles.value.includes('客服仓库') && !roles.value.includes('退货退款换货处理人') 
  }else{
    return roles.value.includes('客服仓库')
  }
});

const roles = computed(() => permissionList.value.map((ps: any) => ps.name).join(','));

const queryParams = ref<SearchItem>({ ...new SearchItem() }), searchFormRef = ref();

const searchSchema = computed(() => {
  const warehouse: FormSchema = {
    field: 'warehouse',
    label: '所属仓库',
    component: 'Select',
    componentProps: {
      multiple: true,
      placeholder: '请选择所属仓库',
      clearable: true,
      collapseTags: true,
      collapseTagsTooltip: true,
      options: getIntDictOptions(DICT_TYPE.CS_WAREHOUSE_DOCKING_WAREHOUSE, true),
      onChange: (val: any) => valueChange(val, 'warehouse'),
    }
  };
  const orderNo: FormSchema = {
    field: 'orderNo',
    label: '订单编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入订单编号',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'orderNo'),
      onkeydown: async (event: any) => (event as any)?.key === 'Enter' && valueChange(searchFormRef.value?.formModel?.orderNo, 'orderNo')
    }
  };
  const issueType: FormSchema = {
    field: 'issueType',
    label: '问题类型',
    component: 'Select',
    componentProps: {
      multiple: true,
      placeholder: '请选择问题类型',
      clearable: true,
      collapseTags: true,
      collapseTagsTooltip: true,
      options: getIntDictOptions(DICT_TYPE[tabValue.value === '1' ? 'CS_WAREHOUSE_DOCKING_ISSUE_TYPE' : 'CS_WAREHOUSE_DOCKING_REFUND_ISSUE_TYPE'], true),
      onChange: (val: any) => valueChange(val, 'issueType'),
    }
  };
  const productCode: FormSchema = {
    field: tabValue.value === '4' ? 'sendLessProductCode' : 'productCode',
    label: `${tabValue.value === '4' ? '少/错发' : ''}产品编码`,
    customRender: (_item, _model) =>
      <GoodCode url={'/api/wdtSpec/listSpecNo'} v-model={queryParams.value[tabValue.value === '4' ? 'sendLessProductCode' : 'productCode']} onChange={onSearch} placeholder={`请选择${`${tabValue.value === '4' ? '少/错发' : ''}产品编码`}`} />
  };
  const logisticsOrderNo: FormSchema = {
    field: 'logisticsOrderNo',
    label: '物流单号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入物流单号',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'logisticsOrderNo'),
      onkeydown: async (event: any) => (event as any)?.key === 'Enter' && valueChange(searchFormRef.value?.formModel?.logisticsOrderNo, 'logisticsOrderNo')
    }
  };
  const registrar: FormSchema = {
    field: 'registrar',
    label: '登记人',
    customRender: (_item, _model) =>
      <SelectUser v-model={queryParams.value.registrar} role={getRole('客服仓库')} onChange={onSearch}
      />
  };
  const handler: FormSchema = {
    field: 'handler',
    label: '处理人',
    component: 'Input',
    componentProps: {
      placeholder: '请输入处理人',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'handler'),
      onkeydown: async (event: any) => (event as any)?.key === 'Enter' && valueChange(searchFormRef.value?.formModel?.handler, 'handler')
    }
  };
  const handlerNew: FormSchema = {
    field: 'handler',
    label: '处理人',
    customRender: (_item, _model) =>
      <SelectUser v-model={queryParams.value.handler} role={getRole('退货退款换货处理人')} onChange={onSearch}
      />
  };
  const warehouseIssueExistence: FormSchema = {
    field: 'warehouseIssueExistence',
    label: '问题是否存在',
    component: 'Select',
    componentProps: {
      placeholder: '请选择问题是否存在',
      onChange: (val: any) => valueChange(val, 'warehouseIssueExistence'),
      clearable: true,
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '2'},
        { label: '客服填写信息需完善', value: '0' }
      ]
    }
  };
  const isHandle: FormSchema = {
    field: 'isHandle',
    label: '问题是否处理',
    component: 'Select',
    componentProps: {
      placeholder: '请选择问题是否处理',
      onChange: (val: any) => valueChange(val, 'isHandle'),
      clearable: true,
      options: [
        { label: '已处理', value: 1 },
        { label: '未处理', value: 0 }
      ]
    }
  };
  const registrationTime: FormSchema = {
    field: 'registrationTime',
    label: '登记时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => valueChange(val, 'registrationTime'),
    }
  };
  const isPay: FormSchema = {
    field: ' isPay',
    label: '转寄运费',
    component: 'Select',
    componentProps: {
      placeholder: '请选择转寄运费',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'isPay'),
      options: [
        { label: '已支付', value: 1 },
        { label: '未支付', value: 0 }
      ]
    }
  };
  const issuedProductCode: FormSchema = {
    field: ' productCode',
    label: '应发产品编码',
    customRender: (_item, _model) =>
      <GoodCode url={'/api/wdtSpec/listSpecNo'} v-model={queryParams.value.productCode} onChange={onSearch} placeholder={'请选择应发产品编码'} />
  };
  const rejectOrderNumber: FormSchema = {
    field: ' rejectOrderNumber',
    label: '驳回出库单号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入驳回出库单号',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'rejectOrderNumber'),
      onkeydown: async (event: any) => (event as any)?.key === 'Enter' && valueChange(searchFormRef.value?.formModel?.rejectOrderNumber, 'rejectOrderNumber')
    }
  };
  let arr: Array<FormSchema> = [];
  switch (tabValue.value) {
    case '1': arr = hasPermissionsJs(['warehouseDocking:add']) ? [warehouse, orderNo, issueType, productCode, logisticsOrderNo, registrar, handler, registrationTime, warehouseIssueExistence, isHandle] :
      [orderNo, issueType, productCode, logisticsOrderNo, registrar, handler, registrationTime, warehouseIssueExistence, isHandle]; break;
    case '2': arr = hasPermissionsJs(['warehouseDocking:add']) ? [warehouse, orderNo, logisticsOrderNo, registrationTime, isPay, registrar, handler, isHandle] :
      [orderNo, logisticsOrderNo, registrationTime, isPay, registrar, handler, isHandle]; break;
    case '3': arr = hasPermissionsJs(['warehouseDocking:add']) ? [warehouse, orderNo, logisticsOrderNo, registrationTime, issueType, registrar, handlerNew, isHandle] :
      [orderNo, logisticsOrderNo, registrationTime, issueType, registrar, handlerNew, isHandle]; break;
    case '4': arr = [warehouse, orderNo, issuedProductCode, productCode, registrationTime, registrar]; break;
    case '5': arr = [orderNo, rejectOrderNumber, registrar, registrationTime, isHandle]; break;
    default: break;
  }
  return arr.map((ar: any) => ({ ...ar, itemWidth: 316 }));
});

const valueChange = (val: any, name: string) => {
  if (queryParams.value[name] !== val) {
    queryParams.value[name] = val;
    onSearch();
  }
};

const onSearch = debounce(() => getDataList(), 500);

const commandChange = (com: string) => com === 'detailsView' ? detailsView({}, 'add') : exportData();

const reSetData = () => {
  queryParams.value = { ...new SearchItem() };
  searchFormRef?.value?.resetFields();
};

const handleExpandClick = () => {
  searchFormRef?.value?.handleExpandClick(false);
};

const exportData = async () => {
  const loadingInstance = ElLoading.service({ lock: true });
  request.downloadPost({
    url: `/api/${urlValue(tabValue.value as string, 'export')}/export`, data: {
      ...queryParams.value,
      warehouse: queryParams.value.warehouse?.join(','),
      issueType: queryParams.value.issueType?.join(','),
      registrar: queryParams.value.registrar?.map((item: any) => item.userId).join(','),
      handler:tabValue.value === '3' ? (queryParams.value.handler.length>0?(queryParams.value.handler as any)?.join(',') :'') : queryParams.value.handler,
      registerTimeBegin: queryParams.value?.registrationTime?.length ? queryParams.value.registrationTime[0] : null,
      registerTimeEnd: queryParams.value?.registrationTime?.length ? queryParams.value.registrationTime[1] : null,
    }
  }).then((res: any) => {
    res && download.excel(res, `客服仓库对接问题汇总表-${tabsOptions(roles.value, tabValue.value as string).label}统计表.xlsx`)
  }).finally(() => {
    loadingInstance.close();
  });
}

defineExpose({ onSearch, queryParams, reSetData, handleExpandClick })
</script>
<style lang="scss" scoped></style>
