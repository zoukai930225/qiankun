<template>
  <s-w-search-form :schema="searchSchema" :expand-threshold="6" show-expand expand-text="展开" collapse-text="收起"
    @search="onSearch" @reset="reSetData" ref="searchFormRef" class="flex just">
      <el-button type="primary" icon="plus" @click="() => emit('handleAdd')" >新增</el-button>
  </s-w-search-form>
</template>


<script lang="tsx" setup>
import { SearchItem } from './Type';
import { FormSchema } from '@/types/form';
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict';
import { cloneDeep, debounce } from 'lodash-es';

const queryParams = ref<SearchItem>({ ...new SearchItem() })
const searchFormRef =ref('')
const emit =defineEmits(['getList','handleAdd'])
const searchSchema: Array<FormSchema> = [
  {
    field: 'name',
    label: '名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入名称',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'name'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = { ...queryParams.value, name: searchFormRef.value?.formModel?.name };
          await nextTick()
          onSearch();
        }
      }
    }
  },
  {
    field: 'modelType',
    label: '模特类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: getIntDictOptions(DICT_TYPE.VC_MODEL_LIB_MODEl_TYPE,true),
      collapseTags: true,
      collapseTagsTooltip: true,
      multiple: false,
      clearable: true,
      onChange: (val: any) => valueChange(val, 'modelType')
    }
  },
  {
    field: 'productType',
    label: '产品类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: getIntDictOptions(DICT_TYPE.VC_MODEL_LIB_PRODUCT_TYPE,true),
      collapseTags: true,
      collapseTagsTooltip: true,
      multiple: false,
      clearable: true,
      onChange: (val: any) => valueChange(val, 'productType')
    }
  },
];

const onSearch = debounce(() => emit('getList'), 500);
const valueChange = (val: any, name: string) => {
  if (queryParams.value[name] !== val) {
    queryParams.value[name] = val;
    onSearch();
  }
};

const reSetData =() =>{
  queryParams.value = { ...new SearchItem() };
}


defineExpose({ onSearch, queryParams })
</script>
<style lang="scss" scoped>
</style>
