<template>
  <main-content v-bind="{ ...props }" ref="contentRef" :table-options="categoryTable">
    <template #default="{ params, handleQuery }">
      <el-col :span="6">
        <el-form-item label="货品品类" prop="category">
          <scroll-select
            v-model="params.category"
            :api="getCategorySelectorApi"
            select-key="categoryName"
            itemLabelKey="categoryName"
            itemValueKey="categoryCode"
            page-key="pageNum"
            size-key="pageSize"
            clearable
            @change="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="统计日期">
          <el-date-picker
            v-model="params.date"
            value-format="YYYY-MM-DD"
            format="YYYY-MM-DD"
            placeholder="请选择统计日期"
            :clearable="false"
            @change="handleQuery"
          />
        </el-form-item>
      </el-col>
    </template>
  </main-content>
</template>
<script lang="ts" setup>
import { getCategorySelectorApi } from '@/api/supplier/supplierData'
import { categoryTable } from '../options'
import mainContent from './skuPage.vue'

defineOptions({ name: 'SupplierFullDataCategory' })

const props = withDefaults(
  defineProps<{
    innerHeight?: number
    dimension: string
  }>(),
  {
    innerHeight: 0
  }
)

const contentRef = ref<InstanceType<typeof mainContent>>()

defineExpose({ getList: () => contentRef.value?.getList() })
</script>
<style lang="less" scoped></style>
