<template>
  <div>
    <el-dialog
      v-model="visible"
      append-to-body
      :show-close="false"
      align-center
      width="600"
      style="padding: 0"
      :close-on-click-modal="false"
    >
      <template #header>
        <div class="header">
          <div>选择商品</div>
          <img src="@/assets/imgs/common/close.png" alt="" @click="visible = false" />
        </div>
      </template>
      <div style="padding: 4px 20px">
        <el-form label-width="70">
          <el-form-item label="规格名称">
            <el-input
              v-model="txt"
              :placeholder="`请输入规格名称`"
              clearable
              style="width: 240px; margin-right: 20px"
            />
            <el-button @click="txt = ''">重置</el-button>
          </el-form-item>
        </el-form>
        <vxe-table
          :header-cell-style="{
            color: '#666666',
            fontWeight: 400,
            backgroundColor: '#F2F6FC',
            fontFamily: 'pingFang SC'
          }"
          :cell-style="{ fontFamily: 'pingFang SC' }"
          style="width: 100%"
          show-overflow
          :max-height="400"
          :data="listData"
          :column-config="{ resizable: true }"
          :virtual-y-config="{ enabled: true, gt: 0 }"
          ref="tableRef"
          border="full"
        >
          <vxe-column type="checkbox" width="60" align="center" />
          <vxe-column type="seq" width="60" align="center" />
          <vxe-column field="productCode" title="货品编码" />
          <vxe-column field="color" title="规格名称" />
          <!-- <vxe-column field="size" title="规格码" width="105" /> -->
        </vxe-table>
      </div>
      <template #footer>
        <div style="padding: 10px 20px; border-top: solid #f0f0f0 1px">
          <el-button @click="visible = false">取 消</el-button>
          <el-button type="primary" @click="add" :disabled="!selectData?.length">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
defineOptions({ name: 'DevelopQuoteGoods' })

const emit = defineEmits(['add'])

const props = defineProps({
  tableData: { type: Array<any>, default: () => [] }
})

const visible = ref<boolean>(false),
  txt = ref<string>(''),
  tableRef = ref()

const listData = computed(() =>
  props.tableData.filter((ts: any) => ts.color.toLowerCase().includes(txt.value.toLowerCase()))
)

const selectData = computed(() => tableRef?.value?.getCheckboxRecords())

const open = () => {
  visible.value = true
  txt.value = ''
}

const add = () => {
  emit('add', selectData.value)
  visible.value = false
}

defineExpose({ open })
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
  font-weight: 500;
  font-size: 16px;
  padding: 16px 20px;
  border-bottom: solid #f0f0f0 1px;

  img {
    width: 14px;
    cursor: pointer;
  }
}
</style>
