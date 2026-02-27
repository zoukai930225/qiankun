<template>
  <el-dialog
    :fullscreen="fullscreen"
    :model-value="modelValue"
    :show-close="false"
    width="1300"
    @open="handleOpen"
    @closed="handleClosed"
  >
    <template #header>
      <div class="flex justify-between">
        <span>产前样登记</span>
        <div class="flex items-start">
          <el-link @click="fullscreen = !fullscreen" :underline="false" class="mr-8px">
            <el-icon :size="16"><FullScreen /></el-icon>
          </el-link>

          <el-link :underline="false" @click="handleClosed">
            <el-icon :size="16"><Close /></el-icon>
          </el-link>
        </div>
      </div>
    </template>

    <div class="mb-16px flex justify-end">
      <el-button type="primary" @click="handleBatchAdd">
        <Icon icon="ep:plus" class="mr-4px" />批量新增
      </el-button>
      <el-button type="primary" @click="handleAdd">
        <Icon icon="ep:plus" class="mr-4px" />新增
      </el-button>
    </div>

    <special-table
      ref="tableRef"
      :data="tableData"
      :options="beforeProductList"
      :rules="rules"
      :btns-options="btnsOptions"
      :loading-btns="['上传', '重新上传']"
    >
      <template #sku="{ row, index }">
        <el-select-v2
          v-model="row.sku"
          filterable
          remote
          :options="skuOptions"
          :remote-method="remoteMethod"
          :disabled="!!row.businessId"
          @change="(val) => handleChangeSku(val, index)"
          @click="handleClickSku(row)"
        />
      </template>
    </special-table>

    <template #footer>
      <el-button @click="handleClosed">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>

  <audit-log-drawer :api="scProduceBeforeQueryLog" ref="auditLogRef">
    <template #default="{ auditLogs }">
      <audit-line :audit-logs="auditLogs" />
    </template>
  </audit-log-drawer>

  <!-- 批量新增弹窗 -->
  <batch-add-dialog
    :is-already="tableData"
    ref="batchAddDialogRef"
    :other-params="{ scPurchaseOrderId: poId }"
    :is-page="false"
    :api="getScPurchaseDetailApi"
    :table-ops="beforeProduct_batchAddTableOps"
    v-model:filters="filters"
    @batch-add="handleBatch"
  />
</template>
<script lang="ts" setup>
import {
  scProduceBeforeQueryByPoId,
  getScPurchaseDetailApi,
  scProduceBeforeReUpload,
  scProduceBeforeBatchSaveOrUpdate,
  scProduceBeforeQueryLog
} from '@/api/supplier/purchase'
import specialTable from '@/views/supplier/components/table.vue'
import { beforeProduct_batchAddTableOps, beforeProductList } from '../options'
import { AuditBtn } from '../../changeAudit/option'
import { toReactive } from '@vueuse/core'
import auditLogDrawer from '../../appointment/components/auditLogDrawer.vue'
import { FormRules } from 'element-plus'
import auditLine from './auditLine.vue'
import batchAddDialog from '../../components/batchAddDialog.vue'
import { handleCopyCode } from '@/utils/copyText'

interface Props {
  modelValue: boolean
  poId: string
}

interface Emit {
  (e: 'update:model-value', v: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const message = useMessage()

const tableData = ref<any[]>([])
const skuOptions = ref<any[]>([])
const auditLogRef = ref()
const tableRef = ref()
const fullscreen = ref(false)
const batchAddDialogRef = ref<InstanceType<typeof batchAddDialog>>()
const rules: FormRules = {
  sku: {
    required: true,
    validator: (_, value, callback) => {
      const sameSku = tableData.value.filter((row) => row.sku === value)
      if (sameSku.length > 1) {
        return callback(new Error('不可上传重复的商品'))
      }
      return callback()
    }
  }
}
const filters = ref({
  sku: []
})

/** 按钮排列次序 */
enum buttonPriority {
  '上传',
  '重新上传',
  '查看日志',
  '删除'
}

/**计算按钮配置 */
const btnsOptions = computed(() =>
  // 内部计算方法视情况而定，不一定非要设置一个明确的staticBtns，最后返回一个按钮数组即可
  tableData.value.map(({ businessId, auditStatus }) => {
    const staticBtns: AuditBtn[] = []

    if (!businessId) {
      staticBtns.push(new AuditBtn('删除', handleRemove, { type: 'danger' }))
    }

    switch (auditStatus) {
      case '1':
        staticBtns.push(new AuditBtn('上传', handleUpload, {}))
        break
      case '2':
      case '3':
        staticBtns.push(new AuditBtn('查看日志', handleCheckLog, {}))
        break
      case '4':
        staticBtns.push(
          new AuditBtn('重新上传', handleUpload, {}),
          new AuditBtn('查看日志', handleCheckLog, {})
        )
        break
      default:
        break
    }

    // 需要使用toReactive，不然改变loading状态会不响应
    return toReactive(
      staticBtns.sort((a, b) => {
        const priorityA = buttonPriority[a.label]
        const priorityB = buttonPriority[b.label]
        return priorityA - priorityB
      })
    )
  })
)

function handleRemove(_: any, index: number) {
  tableData.value.splice(index, 1)
}

function handleCheckLog(row) {
  auditLogRef.value?.open({ poId: props.poId, sku: row.sku })
}

async function handleUpload(row) {
  try {
    const res = await scProduceBeforeReUpload({
      poId: props.poId,
      sku: row.sku
    })

    if (res.success) {
      message.success('上传成功！')
      handleOpen()
    }
  } catch (error) {}
}

const loading = ref(false)
async function handleSubmit() {
  try {
    await tableRef.value?.validateFileds()

    loading.value = true
    const data = tableData.value.map((ele) => ({ ...ele, scPurchaseOrderId: props.poId }))
    const res = await scProduceBeforeBatchSaveOrUpdate(data)

    if (res.success) {
      message.success('上传成功！')
      emit('update:model-value', false)
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

async function handleOpen() {
  try {
    const res = await scProduceBeforeQueryByPoId(props.poId)
    tableData.value = res
  } catch (error) {}
}

function handleClosed() {
  emit('update:model-value', false)
  tableData.value = []
}

function handleAdd() {
  tableData.value.unshift({})
}

function handleBatchAdd() {
  batchAddDialogRef.value?.open()
}

function handleBatch(val) {
  tableData.value = Array.from(
    new Map([...val, ...tableData.value].map((row) => [row.sku, row])).values()
  )
}

async function remoteMethod(sku) {
  try {
    const res = await getScPurchaseDetailApi({ sku, scPurchaseOrderId: props.poId })
    if (res) {
      skuOptions.value = res.scPurchaseOrderDetailList.map((ele) => ({
        ...ele,
        label: ele.sku,
        value: ele.sku
      }))
    } else {
      skuOptions.value = []
    }
  } catch (error) {}
}

function handleChangeSku(val, index) {
  const selectedItem = skuOptions.value.find((ele) => ele.sku === val)
  tableData.value[index] = selectedItem
}

function handleClickSku(row) {
  if (!!row.businessId) {
    handleCopyCode(row.sku)
  }
}
</script>
<style lang="less" scoped>
@import url(../../index.scss);

:deep(.el-table__body-wrapper .el-scrollbar__view) {
  display: none;
  max-height: calc(100vh - 210px);
}

:deep(.el-select__wrapper.is-disabled) {
  cursor: pointer;
}
</style>
