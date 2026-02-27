<template>
  <!-- <div>{{ queryParams }}</div> -->
  <s-w-search-form :schema="searchSchema" :expand-threshold="4" show-expand expand-text="展开" collapse-text="收起"
    @search="onSearch" @reset="reSetData" ref="searchFormRef">
    <el-button icon="plus" type="primary" @click="() => emit('handleAdd')" v-if="fabricProcessInitiator">新增</el-button>
  </s-w-search-form>
</template>


<script lang="tsx" setup>
import { TabsProvideType, SearchItem, statusOptions } from './Type';
import { FormSchema } from '@/types/form';
import { cloneDeep, debounce } from 'lodash-es';
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict';
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'
import {
  getFabricClassSelectlist
} from '@/api/supplier/fabricManagement/center'

import asyncWrapper from '@/utils/asyncWrapper';
const message = useMessage() // 消息弹窗

// const { roleList } = inject('QIProblemRegistration') as TabsProvideType;

type propsType = {
  supplyChainDepartment: boolean,
  rDDepartment: boolean,
  planningDepartment: boolean,
  fabricProcessInitiator: boolean
}
const props = defineProps<propsType>()

const queryParams = ref<SearchItem>({ ...new SearchItem() }), searchFormRef = ref(), timeSelectRef = ref();

const fabricClassOptions = ref([])
const emit = defineEmits(['getList', 'handleAdd', 'reset'])
const searchSchema = ref<Array<FormSchema>>([
   {
    field: 'fabricName',
    label: '面料名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入面料名称',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'fabricName'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, fabricName: searchFormRef.value?.formModel?.fabricName };
          await nextTick()
          onSearch();
        }
      }
    }
  },
  {
    field: 'category',
    label: '品类',
    // component: 'Select',
    // componentProps: {
    //   placeholder: '请选择品类',
    //   clearable: true,
    //   options: getIntDictOptions(
    //     DICT_TYPE.FABRIC_CATEGORY,
    //     true
    //   ),
    //   onChange: (val: any) => valueChange(val, 'category')
    // }
    customRender: (_item) => (<CategorySelect v-model={queryParams.value.categorys} onChange={() => onSearch()} multiple></CategorySelect>)
  },
  {
    field: 'applicableType',
    label: '适用类型',
    component: 'Input',
    componentProps: {
      placeholder: '请输入适用类型',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'applicableType'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, applicableType: searchFormRef.value?.formModel?.applicableType };
          await nextTick()
          onSearch();
        }
      }
    }
  },
  {
    field: 'planTime',
    label: '企划时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'planTime'),
    }
  },
  {
    field: 'createTime',
    label: '流程发起时间',
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
    field: 'fabricClassification',
    label: '面料分类',
    component: 'Select',
    componentProps: {
      placeholder: '请选择面料分类',
      clearable: true,
      options: (fabricClassOptions as any),
      onChange: (val: any) => valueChange(val, 'fabricClassification')
    }
  },
]);


const timeChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value });
  obj[`${name}Start`] = val?.length ? val[0] : null;
  obj[`${name}End`] = val?.length ? val[1] : null;
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

const handleAdd = () => {

}

const commandChange = (com: string) => com === 'detailsView' ? handleAdd() : handleAdd();

const reSetData = () => {
  timeSelectRef?.value?.resetDate();
  queryParams.value = { ...new SearchItem() };
  emit('reset')
};

const initOptions = async () => {
  const [data, error] = await asyncWrapper(getFabricClassSelectlist({ name: '' }))
  if (!error) {
    fabricClassOptions.value = data.map(x => {
      return {
        label: x.name,
        value: x.id
      }
    })
  }
}

initOptions()


defineExpose({ onSearch, queryParams })
</script>
<style lang="scss" scoped></style>
