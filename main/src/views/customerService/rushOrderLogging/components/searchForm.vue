<template>
  <!-- <div>{{ queryParams }}</div> -->
  <s-w-search-form :schema="searchSchema" :expand-threshold="4" show-expand expand-text="展开" collapse-text="收起"
    @search="onSearch" @reset="reSetData" ref="searchFormRef">
   <el-button icon="plus" type="primary" @click="() => emit('handleAdd')">新增</el-button>
  </s-w-search-form>
</template>


<script lang="tsx" setup>
import { TabsProvideType, SearchItem, statusOptions } from './Type';
import SelectUser from '@/components/common/user/selectUser.vue';
import { FormSchema } from '@/types/form';
import { cloneDeep, debounce } from 'lodash-es';
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict';
const message = useMessage() // 消息弹窗

// const { roleList } = inject('QIProblemRegistration') as TabsProvideType;

const queryParams = ref<SearchItem>({ ...new SearchItem() }), searchFormRef = ref(), timeSelectRef = ref();

const emit = defineEmits(['getList','handleAdd'])
const searchSchema: Array<FormSchema> = [
  {
    field: 'store',
    label: '店铺',
    component: 'Input',
    componentProps: {
      placeholder: '请输入店铺',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'store'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, store: searchFormRef.value?.formModel?.store };
          await nextTick()
          onSearch();
        }
      }
    }
  },{
    field: 'createTime',
    label: '登记日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'createTime'),
    }
  },
  {
    field: 'orderNoLike',
    label: '订单号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入订单号',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'orderNoLike'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, orderNoLike: searchFormRef.value?.formModel?.orderNoLike };
          await nextTick()
          onSearch();
        }
      }
    }
  },
   {
    field: 'examResult',
    label: '审核结果',
    component: 'Select',
    componentProps: {
      placeholder: '请选择审核结果',
      clearable: true,
      options:getIntDictOptions(
                        DICT_TYPE.EXAM_RESULT,
                        true
                      ),
      onChange: (val: any) => valueChange(val, 'examResult')
    }
  },
  {
    field: 'createdNameLike',
    label: '登记人',
    component: 'Input',
    componentProps: {
      placeholder: '请输入登记人',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'createdNameLike'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, createdNameLike: searchFormRef.value?.formModel?.createdNameLike };
          await nextTick()
          onSearch();
        }
      }
    }
  },
  {
    field: 'handleUserName',
    label: '处理人',
    component: 'Input',
    componentProps: {
      placeholder: '请输入处理人',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'handleUserName'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, handleUserName: searchFormRef.value?.formModel?.handleUserName };
          await nextTick()
          onSearch();
        }
      }
    }
  },
  {
    field: 'handleResult',
    label: '处理结果',
    component: 'Select',
    componentProps: {
      placeholder: '请选择处理结果',
      clearable: true,
      options:[{
        label:'已处理',
        value:'已处理'
      },{
        label:'未处理',
        value:'未处理'
      }],
      onChange: (val: any) => valueChange(val, 'handleResult')
    }
  },
 
];


const timeChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value });
  obj[`${name}Start`] = val?.length ? val[0] : null;
  obj[`${name}End`] = val?.length ? val[1] : null;
  queryParams.value = { ...obj };
  onSearch();
};

const userChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value });
  console.log("name",val,name)
  obj[name] = val
  queryParams.value = { ...obj };
  onSearch();
};

const valueChange = (val: any, name: string) => {
  if (queryParams.value[name] !== val) {
    queryParams.value[name] = val;
    onSearch();
  }
};

const onSearch = debounce(() => emit('getList'), 500);

const handleAdd =() =>{

}

const commandChange = (com: string) => com === 'detailsView' ? handleAdd() : handleAdd();

const reSetData = () => {
  timeSelectRef?.value?.resetDate();
  queryParams.value = { ...new SearchItem() };
};



defineExpose({ onSearch, queryParams })
</script>
<style lang="scss" scoped></style>
