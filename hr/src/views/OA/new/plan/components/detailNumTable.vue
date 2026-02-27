<template>
  <el-table class="palnCountTable" :data="data" align="center">
    <el-table-column width="90" property="category" label="品类">
      <template #default="{ row: innerRow }">
        <!-- {{ formatCategory(innerRow.category) }} -->
        {{ innerRow.completeCategoryName || '-' }}
      </template>
    </el-table-column>
    <el-table-column width="90" property="series" label="系列" />
    <el-table-column label="类型" prop="series">
      <template #default="scope">
        <div>{{
          scope.row.productType == '0' ? '买手款' : scope.row.productType == '1' ? '定制款' : '--'
        }}</div>
      </template>
    </el-table-column>
    <el-table-column width="120" property="packageMethod" label="包装方式">
      <template #default="scope">
        {{ scope.row.packageMethod || '--' }}
      </template>
    </el-table-column>

    <el-table-column label="包装图片" prop="unRoutinePackagePicture" width="120">
      <template #default="scope">
        <el-image
          v-if="scope.row.unRoutinePackagePicture"
          :src="scope.row.unRoutinePackagePicture"
          :preview-src-list="[scope.row.unRoutinePackagePicture || '']"
          :preview-teleported="true"
          alt=""
          style="width: 26px; height: 26px"
        />
        <div v-else>--</div>
      </template>
    </el-table-column>
    <!-- <el-table-column width="80" property="designNumber" label="定制款" />
                <el-table-column width="80" property="marketNumber" label="买手款" /> -->
  </el-table>
</template>

<script lang="ts" setup>
const props = defineProps({
  data: {
    type: Array,
    default: () => []
  }
})
</script>
