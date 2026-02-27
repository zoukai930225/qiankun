<template>
  <ex-screen>
    <query-scheme :scheme="scheme" v-model="dataValue" name="ComOptimize" />
  </ex-screen>
  <!-- <search-card>
    <template #list="listProps">
      <vxe-table border show-overflow :max-height="`${listProps?.height || 500}px`" :data="tableData"
        :column-config="{ resizable: true }" :virtual-y-config="{ enabled: true, gt: 0 }"
        :edit-config="{ trigger: 'click', mode: 'cell' }" v-loding="loading">
        <vxe-column type="seq" width="60" />
        <vxe-column field="name" title="Name"
          :edit-render="{ autofocus: '.vxe-input--inner', placeholder: '请点击输入...' }">
          <template #default="{ row }">
            <span class="border">{{ row.name ? row.name : "请输入" }}</span>
          </template>
<template #edit="{ row }">
            <vxe-input v-model="row.name" type="text" />
          </template>
</vxe-column>
<vxe-column field="nickname" title="Role" :edit-render="{ placeholder: '请输入昵称' }">
  <template #edit="{ row }">
            <vxe-input v-model="row.nickname" type="text" placeholder="请输入昵称" />
          </template>
</vxe-column>
<vxe-column field="sex" title="Sex" :edit-render="{ placeholder: '请选择' }">
  <template #default="{ row }">
            <span class="border">{{ row.sex ? formatSex(row.sex) : "请选择" }}</span>
          </template>
  <template #edit="{ row }">
            <vxe-select v-model="row.sex" transfer>
              <vxe-option v-for="item in sexOptions" :key="item.value" :value="item.value" :label="item.label" />
            </vxe-select>
          </template>
</vxe-column>
<vxe-column field="sex2" title="多选下拉" :edit-render="{ placeholder: '请选择' }">
  <template #default="{ row }">
            <span class="border">{{ row?.sex2?.length ? formatMultiSex(row.sex2) : '请选择' }}</span>
          </template>
  <template #edit="{ row }">
            <vxe-select v-model="row.sex2" placeholder="请选择" multiple transfer>
              <vxe-option v-for="item in sexOptions" :key="item.value" :value="item.value" :label="item.label" />
            </vxe-select>
          </template>
</vxe-column>
<vxe-column field="num1" title="Amount" :edit-render="{ placeholder: '请输入数值' }">
  <template #edit="{ row }">
            <vxe-number-input v-model="row.num1" type="float" :digits="2" placeholder="请输入数值" />
          </template>
</vxe-column>
<vxe-column field="date12" title="Date" :edit-render="{ placeholder: '请选择日期' }">
  <template #edit="{ row }">
            <vxe-date-picker v-model="row.date12" type="date" placeholder="请选择日期" transfer />
          </template>
</vxe-column>
<vxe-column field="date13" title="Week">
  <template #edit="{ row }">
            <vxe-input v-model="row.date13" type="week" placeholder="请选择日期" transfer />
          </template>
</vxe-column>
</vxe-table>
</template>
</search-card> -->
</template>

<script lang="tsx">
export default { name: 'ComOptimize' };
</script>

<script lang="tsx" setup>
import GoodCode from "@/components/template/query/components/goodCode.vue";
import { Scheme } from '@/components/template/config/type';
import { debounce } from 'lodash-es';

const dataValue = ref<any>({ warehouse: '' });

const scheme = computed(() => ([
  {
    field: 'warehouse',
    label: '所属仓库',
  },
  {
    field: 'time',
    label: ['时间', '(xixixi)'],
    component: 'DatePicker',
    width: 210,
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
    }
  },
  {
    field: 'warehouses',
    label: '所属仓库',
    component: 'Select',
    componentProps: {
      multiple: true,
      clearable: true,
      collapseTags: true,
      collapseTagsTooltip: true,
    }
  },
  {
    field: 'warehousess',
    label: '所属仓库',
    isCustom: true,
    customRender: (_item, _model) => <GoodCode placeholder="请选择" value={{ label: 'goodsName', value: 'goodsNo' }} />
  },
  {
    field: 'warehousessss',
    label: '所属仓库',
    // componentProps: {
    //   multiple: true,
    //   placeholder: '请选择所属仓库',
    //   clearable: true,
    //   collapseTags: true,
    //   collapseTagsTooltip: true,
    //   options: getIntDictOptions(DICT_TYPE.CS_WAREHOUSE_DOCKING_WAREHOUSE, true),
    //   onChange: (val: any) => valueChange(val, 'warehouse'),
    // }
  },
  {
    field: 'times',
    label: '时间',
    component: 'DatePicker',
    width: 548,
    componentProps: {
      type: 'datetimerange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      format: 'YYYY-MM-DD HH:mm:ss',
    }
  },

  {
    field: 'timess',
    label: '时间',
    component: 'DatePicker',
    width: 210,
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
    }
  },
  {
    field: 'timesss',
    label: '时间',
    component: 'DatePicker',
    width: 548,
    componentProps: {
      type: 'datetimerange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      format: 'YYYY-MM-DD HH:mm:ss',
    }
  },
  {
    field: 'warehousesss',
    label: '所属仓库',
    component: 'Select',
    componentProps: {
      multiple: true,
      clearable: true,
      collapseTags: true,
      collapseTagsTooltip: true,
    }
  },
]));

// import dayjs from 'dayjs';
// import { v4 as uuidv4 } from 'uuid';

// class RowVO {
//   id: number
//   name: string
//   nickname: string
//   role: string
//   sex: string
//   sex2: string[]
//   age: number
//   num1: number
//   address: string
//   date12: string
//   date13: string
//   constructor(data: any = {}) {
//     this.id = data?.id || uuidv4();
//     this.name = data?.name || `name_${ data.index }`;
//     this.nickname = data?.nickname || `nickname_${ data.index }`;
//     this.role = data?.role || '';
//     this.sex = data?.sex || '';
//     this.sex2 = data?.sex2 || [];
//     this.age = data?.age || 10;
//     this.num1 = data?.num1 || 100;
//     this.address = data?.address || '';
//     this.date12 = data?.date12 || '';
//     this.date13 = data?.date13 || dayjs().add(data.index, 'day').format('YYYY-MM-DD');
//   }
// }

// const loading = ref<boolean>(false);

// const tableData = ref<RowVO[]>([])

// const sexOptions = ref([
//   { label: '', value: '' },
//   { label: '男', value: '1' },
//   { label: '女', value: '0' }
// ])

// const formatSex = (value: any) => {
//   if (value === '1') {
//     return '男'
//   }
//   if (value === '0') {
//     return '女'
//   }
//   return ''
// }

// const formatMultiSex = (values: any[]) => {
//   if (values) {
//     return values.map(val => formatSex(val)).join(',')
//   }
//   return ''
// }

const setParamsData = () => {
  return { ...dataValue.value }
};

const onSearch = () => {
  const params: any = setParamsData();
  console.log(params);
};

const resetForm = () => {
  dataValue.value = {};
  onSearch();
};

provide('ComOptimizeForm', { setParamsData, resetForm, onSearch })

// const getDataList = () => {
//   loading.value = true;
//   setTimeout(() => {
//     tableData.value = Array.from({ length: 2000 }, (_, i) => {
//       return { ...new RowVO({ index: i }) }
//     });
//     console.log(tableData.value);
//     loading.value = false
//   }, 500)
// };

// onMounted(() => {
//   getDataList();
// });

</script>
<style lang="scss" scoped>
// .border {
//   display: inline-block;
//   width: calc(100% - 16px);
//   border-radius: 2px;
//   padding: 0 7px;
//   line-height: 32px;
//   height: 32px;
//   border: 1px solid #eee;
//   color: var(--vxe-ui-font-color);
//   border-radius: var(--vxe-ui-base-border-radius);
//   box-shadow: none;
// }</style>
