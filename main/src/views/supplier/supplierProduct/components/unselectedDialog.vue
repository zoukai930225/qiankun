<template>
  <s-w-dialog title="选择商品" v-model:model-value="isShow" width="800" @closed="handleClosed">
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form :model="queryParams" ref="queryFormRef" :label-width="90">
          <el-form-item label="SKU编码" prop="sku">
            <scroll-select
              class-name="!w-100%"
              v-model:model-value="queryParams.sku"
              :api="getInfoBySku2"
              item-label-key="sku"
              item-value-key="sku"
              selectKey="sku"
              :multiple="true"
              clearable
              @change="handleQuery"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" :style="{ marginLeft: '0px' }">
            重置
          </el-button>
        </div>
      </div>
    </div>
    <sw-table
      ref="swTableRef"
      :data="tableData"
      :options="unselectedSkuTable"
      :height="500"
      :loading="loading"
      :copyable-cells="['sku']"
      @select="handleSelect"
    >
      <template #imgUrl="{ col }">
        <div class="picture">
          <el-image
            fit="contain"
            :src="col"
            :style="{ height: '60px' }"
            :preview-src-list="[col]"
            preview-teleported
            lazy
            hide-on-click-modal
          >
            <template #error>
              <img src="@/assets/imgs/supplier/defaultImg.svg" :style="{ width: '60px' }" />
            </template>
          </el-image>
        </div>
      </template>
    </sw-table>

    <template #footer>
      <el-button type="primary" @click="handleConfirm">确定</el-button>
      <el-button @click="isShow = false">取消</el-button>
    </template>
  </s-w-dialog>
</template>
<script lang="ts" setup>
import { getUnSelectedSkuApi } from '@/api/supplier/supplierProduct'
import SwTable from '../../components/table.vue'
import { unselectedSkuTable } from '../options'
import { FormInstance } from 'element-plus'
import { getInfoBySku2 } from '@/api/supplier/purchase'

const props = defineProps<{
  goodsId?: string
  formData: Supplier.SupplierProduct.SaveOrUpdateSupplierGoodsParam
}>()

const emit = defineEmits<{
  (e: 'update:form-data', data: typeof props.formData): void
}>()

const isShow = ref(false)
const queryParams = reactive({ sku: '' })
const tableData = ref<Supplier.SupplierProduct.SkuInfoVO[]>([])
const allData = ref<Supplier.SupplierProduct.SkuInfoVO[]>([])
const selectedRows = ref<typeof tableData.value>([])
const loading = ref(false)
const queryFormRef = ref<FormInstance>()

function open() {
  isShow.value = true
  getList()
}

function handleClosed() {
  isShow.value = false
  selectedRows.value = []
  queryFormRef.value?.resetFields()
}

function handleQuery() {
  tableData.value = allData.value.filter((item) => item.sku?.includes(queryParams.sku))
}

function resetQuery() {}

async function getList() {
  try {
    loading.value = true
    const res = await getUnSelectedSkuApi({
      goodsId: props.goodsId || '',
      selectedSku: props.formData.details?.map((item) => item.sku ?? '') ?? []
    })
    if (res) {
      allData.value = res
      tableData.value = [...res]
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleSelect(selection: typeof selectedRows.value) {
  selectedRows.value = selection
}

function handleConfirm() {
  const details = props.formData.details ?? []
  details?.push(...selectedRows.value)
  const detailsMap = new Map(details.map((ele) => [ele.sku, ele] as const))
  emit('update:form-data', { ...props.formData, details: Array.from(detailsMap.values()) })
  isShow.value = false
}

defineExpose({ open })
</script>
<style lang="less" scoped>
@import url(../../index.scss);
</style>
