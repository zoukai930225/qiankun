<template>
  <div>
    <el-dialog v-model="visible" append-to-body :show-close="false" :top="'65px'" width="700"
      style="border-radius: 14px;transform: none;position: static;margin-top: var(--el-dialog-margin-top) !important;"
      :close-on-click-modal="false">
      <template #header>
        <div class="header">
          <div>选择商品</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="visible = false" />
        </div>
      </template>
      <div style="width: 100%;">
        <el-form label-width="85">
          <el-form-item label="SKU编码">
            <el-input v-model="txt" :placeholder="`请输入SKU编码`" clearable style="width: 240px;" />
          </el-form-item>
        </el-form>
        <vxe-table :header-cell-style="{ color: '#333', fontweight: 500, backgroundColor: '#F2F6FC' }"
          style="width: 100%;" show-overflow :max-height="400" :data="listData" :column-config="{ resizable: true }"
          :virtual-y-config="{ enabled: true, gt: 0 }" ref="tableRef">
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column type="seq" width="60" align="center" />
          <vxe-column field="sku" title="SKU编码" />
          <vxe-column field="color" title="规格名称" />
          <vxe-column field="size" title="规格码" width="105" />
        </vxe-table>
      </div>
      <template #footer>
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="add" :disabled="!selectData?.length">确 定</el-button>
      </template>
    </el-dialog>

  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'DevelopQuoteGoods' });

const emit = defineEmits(['add']);

const props = defineProps({
  tableData: { type: Array<any>, default: () => [] },
});

const visible = ref<boolean>(false), txt = ref<string>(''), tableRef = ref();

const listData = computed(() => props.tableData.filter((ts: any) => ts.sku.toLowerCase().includes(txt.value.toLowerCase())));

const selectData = computed(() => tableRef?.value?.getCheckboxRecords());

const open = () => {
  visible.value = true;
  txt.value = '';
};

const add = () => {
  emit('add', selectData.value);
  visible.value = false;
};

defineExpose({ open });


</script>

<style scoped lang="scss">
@use '@/views/OA/factory/style/card.scss';

:deep() {
  .vxe-cell--col-resizable {
    &::before {
      background-color: transparent !important;
    }
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  img {
    width: 14px;
    cursor: pointer;
  }
}
</style>
