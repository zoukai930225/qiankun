<template>
  <div>
    <el-form inline :model="searchData" style="margin-top: 20px;" label-width="54px">
      <el-form-item label="供应商">
        <el-select-v2 filterable clearable v-model="searchData.supplier" :options="suppliers" style="width: 220px;"
          @change="onSearch" multiple collapse-tags collapse-tags-tooltip />
      </el-form-item>
      <el-form-item label="填报人">
        <SelectUser v-model="searchData.fillPerson" :multiple="true" :showAvatarLable="true" style="width: 220px;"
          :role="role" @change="onSearch" />
      </el-form-item>
    </el-form>
    <vxe-grid ref="tableRef" v-bind="gridOptions" class="vxe_grid_table">
      <template #user="{ row }">
        <line-avatar :user="{ name: row.fillPerson, avatarOrigin: row.avatarOrigin }" />
      </template>
      <template #empty>
        <img style="margin-top: 10px;" src="@/assets/imgs/empty/empty1.png" alt="" />
        <div>暂无相关内容</div>
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="tsx">
export default { name: 'QcBoardProgress' }
</script>

<script lang="tsx" setup>
import lineAvatar from "@/components/template/table/components/lineAvatar.vue";

class Item {
  supplier: Array<string> = [];
  fillPerson: Array<string> = [];
}

const emit = defineEmits(['onSearch'])

const searchData = ref<Item>({ ...new Item() }), tableRef = ref();

const props = defineProps({
  suppliers: { type: Array<any>, default: () => [] },
  info: { type: Object, default: () => { } },
  height: { type: Number, default: 500 },
  role: { type: String, default: '' },
});

const gridOptions = computed(() => ({
  border: true,
  showFooter: false,
  size: 'small',
  autoResize: true,
  cellConfig: { height: 40 },
  headerCellStyle: { backgroundColor: '#F2F6FC', color: '#666', fontWeight: '500', fontSize: '14px' },
  height: props.height - 45,
  virtualYConfig: { enabled: true, gt: 0, oSize: 0, mode: 'scroll', immediate: true, scrollToTopOnChange: true },
  virtualXConfig: { enabled: true, gt: 0, oSize: 10, mode: 'scroll', immediate: true, scrollToLeftOnChange: true },
  data: props.info.progress,
  expandConfig: { mode: 'inside' },
  columns: [
    { field: 'date', title: '日期', fixed: "left", minWidth: 135 },
    { field: 'fillPerson', title: '填报人', minWidth: 135, slots: { default: 'user' } },
    { field: 'supplier', title: '供应商', minWidth: 225, showOverflow: true, formatter: ({ cellValue }) => cellValue || '-' },
    { field: 'problemDescription', title: '具体问题描述', minWidth: 565, showOverflow: true, formatter: ({ cellValue }) => cellValue || '-' },
  ]
}));

const onSearch = () => {
  emit('onSearch', searchData.value);
};

const reset = () => {
  searchData.value = { ...new Item() };
};

defineExpose({ reset });

</script>
<style lang="scss" scoped>
@use './styles.scss';
@use '@/styles/index.scss';
</style>