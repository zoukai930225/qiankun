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
      <template #status="{ row }">
        <line-tages :txt="row.isQualified" :color="row.isQualified === '不合格' ? '#EB3737' : '#349B34'"
          :background="row.isQualified === '不合格' ? 'rgba(235, 55, 55, 0.2)' : 'rgba(52, 155, 52, 0.2)'" />
      </template>
      <template #img="{ row }">
        <line-image :urls="row.imageUrl"  />
      </template>
      <template #empty>
        <img style="margin-top: 10px;" src="@/assets/imgs/empty/empty1.png" alt="" />
        <div>暂无相关内容</div>
      </template>
    </vxe-grid>
  </div>
</template>

<script lang="tsx">
export default { name: 'QcBoardContent' }
</script>

<script lang="tsx" setup>
import LineTages from "@/components/template/table/components/lineTage.vue";
import lineAvatar from "@/components/template/table/components/lineAvatar.vue";
import LineImage from "@/components/template/table/components/lineImage.vue";
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
  // cellConfig: { height: 40 },
  headerCellStyle: { backgroundColor: '#F2F6FC', color: '#666', fontWeight: '500', fontSize: '14px' },
  height: props.height - 45,
  virtualYConfig: { enabled: true, gt: 0, mode: 'scroll', immediate: true, scrollToTopOnChange: true },
  virtualXConfig: { enabled: true, gt: 0, mode: 'scroll', immediate: true, scrollToLeftOnChange: true },
  data: props.info.content,
  expandConfig: { mode: 'inside' },
  columns: [
    { field: 'date', title: '日期', fixed: "left", width: 115 },
    { field: 'fillPerson', title: '填报人', width: 110, slots: { default: 'user' } },
    { field: 'supplier', title: '供应商', minWidth: 115, showOverflow: true },
    { field: 'productCode', title: '商品款号', minWidth: 105, showOverflow: true, formatter: ({ cellValue }) => cellValue || '-' },
    { field: 'specificMatters', title: '具体事项', width: 125, showOverflow: true, formatter: ({ cellValue }) => cellValue || '-' },
    { field: 'isQualified', title: '是否合格', width: 105, slots: { default: 'status' } },
    { field: 'problemDescription', title: '具体问题描述', minWidth: 125, showOverflow: true, formatter: ({ cellValue }) => cellValue || '-' },
    { field: 'imageUrl', title: '图片', minWidth: 125, slots: { default: 'img' },},
    { field: 'remark', title: '备注', minWidth: 105, showOverflow: true, formatter: ({ cellValue }) => cellValue || '-' }
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