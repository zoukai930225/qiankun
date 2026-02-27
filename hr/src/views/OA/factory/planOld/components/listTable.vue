<template>
  <el-table ref="singleTableRef" class="SWCommonTable" :data="list" width="100%" v-loading="loading"
    v-horizontal-scroll="'always'" row-class-name="commonTableRow" :header-cell-style="appStore.headerCellStyle"
    :highlight-current-row="true" row-key="id" @current-change="handleCurrentChange">
    <el-table-column label="供应商名称" prop="supplierName" min-width="120">
      <template #default="{ row }">
        {{ row.supplierName || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="货品编码" prop="productCode" min-width="180">
      <template #default="{ row }">
        {{ row.productCode || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="系列" prop="series" min-width="120">
      <template #default="{ row }">
        {{ row.series || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="品类" prop="categoryName" min-width="180">
      <template #default="{ row }">
        {{ row.categoryName || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="当前节点" prop="currentNodeName" min-width="180">
      <template #default="{ row }">
        {{ row.currentNodeName || '-' }}
      </template>
    </el-table-column>
    <el-table-column label="版师" prop="patternMakers" min-width="320">
      <template #default="{ row }">
        <line-staff :code="'NEW_PRODUCT_DEPT_DEVELOP'" disabled v-model="row.patternMakers" />
      </template>
    </el-table-column>
    <el-table-column label="设计师/买手" prop="designers" min-width="320">
      <template #default="{ row }">
        <line-staff :code="'NEW_PRODUCT_DEPT_DEVELOP'" disabled v-model="row.designers" />
      </template>
    </el-table-column>
    <el-table-column label="选供专员" prop="supplierSpecialists" min-width="320">
      <template #default="{ row }">
        <line-staff :code="'NEW_PRODUCT_DEPT_SUPPLY'" disabled v-model="row.supplierSpecialists" />
      </template>
    </el-table-column>
    <el-table-column label="采购人员" prop="purchaseUsers" min-width="200">
      <template #default="{ row }">
        <personListPopover v-if="row.purchaseUsers?.length" :person-list="row.purchaseUsers || []" />
        <span v-else>-</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" :show-overflow-tooltip="false" fixed="right" width="100" align="left">
      <template #default="{ row }">
        <el-button type="primary" class="btn normal" @click.stop="emits('clickBtn', 'progress', row)" link>
          进度维护
        </el-button>
      </template>
    </el-table-column>
    <template #empty>
      <div class="empty-img">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <div>暂无数据</div>
      </div>
    </template>
  </el-table>

</template>
<script lang="ts" setup>
import LineStaff from '@/components/template/table/components/lineStaff.vue';
import { useAppStore } from '@/store/modules/app'
// import { getDictLabel, DICT_TYPE } from '@/utils/dict'
const appStore = useAppStore()
import personListPopover from '@/views/OA/factory/components/personListPopover.vue'
const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['clickBtn'])

const currentRow = ref()
const handleCurrentChange = async (row: any) => {
  currentRow.value = row
  emits('clickBtn', 'selectRow', row)
}

const singleTableRef = ref();

const defaultClick = (tar: any) => {
  singleTableRef.value!.setCurrentRow(tar);
};



// watch(() => props.list, (val) => {
//   if (val && val.length) {
//     console.log(1111111);
//     nextTick(() => {
//       singleTableRef.value!.setCurrentRow(val?.[0])
//     })
//   }
// }, { immediate: true, deep: true });

defineExpose({ defaultClick });

</script>

<style lang="scss" scoped>
.el-table {
  :deep(.el-popper) {
    max-width: 400px !important;
    white-space: pre-wrap !important;
  }
}

:deep(.el-table__body tr.current-row > td.el-table__cell) {
  background-color: rgb(236, 245, 255);
}
</style>
