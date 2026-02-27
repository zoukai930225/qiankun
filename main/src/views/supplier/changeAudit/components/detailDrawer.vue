<template>
  <s-w-drawer v-model="isShow" title="查看" width="88%" @closed="handleClosed">
    <el-card shadow="never" class="!border-0">
      <div class="title"> 变更申请 </div>
      <el-divider />

      <el-form :model="formData" label-width="90" scroll-to-error>
        <el-row>
          <el-col :span="6">
            <el-form-item label="生产单号">
              <el-input :model-value="formData.scPurchaseOrderNo" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请人">
              <el-input :model-value="formData.applicantObj?.name" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="申请时间">
              <el-input :model-value="formData.createdAt" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商">
              <el-input :model-value="formData.supplier" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item ref="queryFormRef" prop="changeReason" label="变更原因">
              <s-text-area
                v-model="formData.changeReason"
                maxlength="200"
                :rows="5"
                disabled
                placeholder="--"
                show-word-limit
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="附件" class="form-item-files">
          <files-upload v-model:modelValue="formData.url" disabled :url="formData.url" />
        </el-form-item>
      </el-form>

      <div class="title"> 变更申请明细 </div>
      <el-divider />
      <sw-table
        ref="tableRef"
        :data="tableData"
        :options="changeAuditTable2"
        :loading="loading"
        :max-height="620"
        :show-overflow-tooltop="true"
      />
    </el-card>
    <template #footer>
      <div class="flex justify-end">
        <el-button class="mlauto" @click="isShow = false">取消</el-button>
      </div>
    </template>
  </s-w-drawer>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import SwTable from '@/views/supplier/components/table.vue'
import { scPoChangeRequestDetailApi } from '@/api/supplier/changeAudit'
import FilesUpload from '@/views/supplier/product/components/changePageUpload.vue'
import { changeAuditTable2 } from '../option'
import SWDrawer from '@/components/SWDrawer/src/SWDrawer.vue'

const isShow = ref(false)
const formData = ref<Record<string, any>>({})
const loading = ref(false)
const tableData = ref<Record<string, any>[]>([])
const filter = ref({
  sku: []
})

/**
 * 处理数据并添加汇总行
 * @param {Array} dataSource - 数据源
 * @param {Object} sumFields - 需要汇总的字段配置
 * @returns {Array} 处理后的数据
 */
function processData(dataSource: Array<any>): Array<any> {
  if (!Array.isArray(dataSource) || dataSource.length === 0) {
    return []
  }
  const processedData = dataSource.map((row) => fillEmptyValues(row))
  return [...processedData]
}

/**
 * 将对象中的所有空值替换为'--'
 * @param {Object} obj - 要处理的对象
 * @returns {Object} 处理后的对象
 */
function fillEmptyValues(obj: object): object {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === null || value === undefined || value === '' ? '--' : value
    ])
  )
}

async function open(id: string) {
  isShow.value = true
  try {
    loading.value = true
    const res = await scPoChangeRequestDetailApi(id)
    if (res) {
      formData.value = res
      tableData.value = processData(res.changeRequestDetails)
      tableData.value.unshift(sumRow.value)
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleClosed() {
  // 重置筛选条件
  Object.keys(filter.value).forEach((key) => (filter.value[key] = []))
}

const sumRow = computed(() => {
  const row: any = {}

  function computedSum(key: string) {
    return (
      Math.round(tableData.value.reduce((arr, cur) => arr + (cur[key] || 0), 0) * 100) / 100 || 0
    )
  }

  const keys = [
    'purchasedGoodsQuantity',
    'goodsNoDeliveryQuantity',
    'goodsDeliveryQuantity',
    'goodsInboundQuantity'
  ]

  keys.forEach((key) => {
    row[key] = computedSum(key)
  })

  row.price =
    Math.round(
      tableData.value.reduce(
        (arr, cur) => arr + (cur.deliveryGoodsQuantity || 0) * (cur.supplierGoodsPrice || 0),
        0
      ) * 100
    ) / 100 || 0
  row.key = 'sumRow'
  return row
})

defineExpose({ open })
</script>
<style lang="less" scoped>
@import url(../../index.scss);

.title {
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 20px;

  &::before {
    content: '';
    display: block;
    width: 3px;
    height: 10px;
    margin-right: 6px;
    background-color: rgb(0, 100, 255);
  }
}

:deep(.el-divider) {
  width: calc(100% + 40px);
  margin: 20px -20px;
}
</style>
