<template>
  <div class="title mt20px mb--6px">
    <span>货品明细</span>
    <el-tooltip content="请先选择供应商和货品编码" :disabled="!!data?.goodsId">
      <el-button
        type="primary"
        :disabled="!data?.goodsId"
        :style="{ marginLeft: 'auto' }"
        @click="handleAdd"
        >新增</el-button
      >
    </el-tooltip>
  </div>
  <el-divider />
  <sw-table
    ref="tableRef"
    :data="tableData"
    :options="goodsDetailTable"
    :copyable-cells="['sku']"
    :rules="rules"
    :btns-options="btnsOptions"
    :loading-btns="['停用', '启用']"
    :loading="loading"
  >
    <template
      v-for="slotName in ['baseProdCost', 'fgCost', 'whPackCost']"
      :key="slotName"
      #[slotName]="{ row, col, index }"
    >
      <div class="flex flex-1" v-if="isShowInput(row, slotName, index)">
        <sw-input-number
          v-model="row[slotName]"
          placeholder="请输入"
          :clearable="true"
          :min="0"
          :precision="4"
          :controls="false"
        />

        <el-tooltip :content="`向下复制`">
          <el-button type="primary" class="ml-4px" link @click="handleCopy(slotName, index)">
            <copy-icon :size="16" />
          </el-button>
        </el-tooltip>
      </div>

      <div v-else>{{ col }}</div>
    </template>

    <template #hasTax="{ row, index }">
      <div class="flex flex-1" v-if="isShowInput(row, 'hasTax', index)">
        <el-select v-model="row.hasTax" placeholder="请选择是否含税" clearable>
          <el-option
            v-for="{ label, value } in hasTaxOptions"
            :key="label"
            :value="value"
            :label="label"
          />
        </el-select>

        <el-tooltip :content="`向下复制`">
          <el-button type="primary" class="ml-4px" link @click="handleCopy('hasTax', index)">
            <copy-icon :size="16" />
          </el-button>
        </el-tooltip>
      </div>

      <div v-else>
        <component :is="() => statusDom(hasTaxOptions)(row, undefined, row.hasTax)" />
      </div>
    </template>

    <template #minPurchaseQty="{ row, col, index }">
      <div class="flex flex-1" v-if="isShowInput(row, 'minPurchaseQty', index)">
        <sw-input-number
          v-model="row.minPurchaseQty"
          placeholder="请输入"
          :clearable="true"
          :min="0"
          :controls="false"
        />

        <el-tooltip :content="`向下复制`">
          <el-button
            type="primary"
            class="ml-4px"
            link
            @click="handleCopy('minPurchaseQty', index)"
          >
            <copy-icon :size="16" />
          </el-button>
        </el-tooltip>
      </div>

      <div v-else>{{ col }}</div>
    </template>

    <template
      v-for="slotName in ['taxRate', 'discountRate']"
      :key="slotName"
      #[slotName]="{ row, col, index }"
    >
      <div class="flex flex-1" v-if="isShowInput(row, slotName, index)">
        <sw-input-number
          :style="{ width: '90px' }"
          v-model="row[slotName]"
          placeholder="请输入"
          :clearable="true"
          :min="0"
          :max="1"
          :precision="2"
          :controls="false"
        />

        <el-tooltip :content="`向下复制`">
          <el-button type="primary" class="ml-4px" link @click="handleCopy(slotName, index)">
            <copy-icon :size="16" />
          </el-button>
        </el-tooltip>
      </div>

      <div v-else>{{ col }}</div>
    </template>
    <template #discountRate="{ row, col, index }">
      <sw-input-number
        v-if="isShowInput(row, 'discountRate', index)"
        v-model.trim="row.discountRate"
        placeholder="请输入"
        :clearable="true"
        :min="0"
        :precision="2"
        :controls="false"
      />
      <div v-else>{{ col }}</div>
    </template>
  </sw-table>
</template>
<script lang="tsx" setup>
import SwTable from '../../components/table.vue'
import { FormInstance, FormRules } from 'element-plus'
import { goodsDetailTable, hasTaxOptions } from '../options'
import { enableSupplierApi } from '@/api/supplier/supplierProduct'
import { cloneDeep } from 'lodash-es'
import { AuditBtn } from '../../changeAudit/option'
import { toReactive } from '@vueuse/core'
import CopyIcon from '@/assets/svgs/supplier/copy.vue'
import { statusDom } from '../../components/twoFourSix'

defineOptions({ name: 'PurchaseProductOrderAdd' })

const props = defineProps<{
  data?: Supplier.SupplierProduct.SaveOrUpdateSupplierGoodsParam
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'update:data', params: typeof props.data): void
  (e: 'refresh'): void
}>()

const message = useMessage()
const route = useRoute()

const tableRef = ref<InstanceType<typeof SwTable>>()
const oldData = ref<any>({})
const rules: FormRules = {
  fgCost: { required: true, message: '请输入' },
  baseProdCost: { required: true, message: '请输入' },
  whPackCost: { required: true, message: '请输入' },
  minPurchaseQty: { required: true, message: '请输入' },
  taxRate: {
    required: true,
    validator(_, value, callback) {
      if (value && Number(value) > 1) return callback(new Error('请输入小于1的数字'))
      callback()
    }
  },
  discountRate: {
    required: true,
    validator(_, value, callback) {
      if (value && Number(value) > 1) return callback(new Error('请输入小于1的数字'))
      callback()
    }
  },
  hasTax: { required: true, message: '请选择' }
}
const editable = computed(() => {
  return tableData.value.map((row) => {
    return toReactive(Object.fromEntries(Object.keys(row).map((key) => [key, false])))
  })
})

const tableData = computed(() => {
  props.data?.details?.forEach((row) => {
    row.taxRate = row.taxRate ?? 0
    row.discountRate = row.discountRate ?? 1
  })

  return props.data?.details ?? []
})

const isEdit = computed(() => !!route.params.id)

const btnsOptions = computed(() =>
  tableData.value.map((row, index) => {
    const btns: AuditBtn[] = []
    if (row.enable === 1 && showEditBtn(index) && row.id)
      btns.push(new AuditBtn('编辑', handleEdit, {}))
    if (row.enable === 1 && showCancelBtn(index) && row.id)
      btns.push(new AuditBtn('取消', handleCancle, {}))
    if (!row.id || !isEdit.value) btns.push(new AuditBtn('应用到所有行', handleCopyRow, {}))
    if (isEdit.value && row.enable === 1)
      btns.push(new AuditBtn('停用', handleEnable, { type: 'danger' }))
    if (isEdit.value && row.enable === 0) btns.push(new AuditBtn('启用', handleEnable, {}))
    if (!row.id) btns.push(new AuditBtn('删除', handleDeleteRow, { type: 'danger' }))

    return toReactive(btns)
  })
)

function setOldData() {
  oldData.value = cloneDeep(props.data?.details)
}

function showEditBtn(index) {
  return Object.values(editable.value[index]).some((ele) => !ele)
}

function showCancelBtn(index) {
  return Object.values(editable.value[index]).some((ele) => ele)
}

function handleAdd() {
  emit('add')
}

function isShowInput(row, key, index) {
  return !isEdit.value || !row.id || editable.value[index][key]
}

// 获取表单
const instance = getCurrentInstance()
function getFormDOM(index: number, key: string) {
  const formRefName = `${key}_${index}`
  const form = instance?.refs[formRefName]
  if (form) {
    return form as FormInstance
  }
}

async function validateAll() {
  return await Promise.all(
    editable.value.map(async (row, index) => {
      const rowValues = Object.values(row)
      const rowKeys = Object.keys(row)

      const isAllFieldsFilled = rowValues.every((item) => item) || !tableData.value[index].id
      const isPartialFieldsFilled = rowValues.some((item) => item) && tableData.value[index].id

      if (isAllFieldsFilled) {
        return await tableRef.value?.validateFileds(undefined, index)
      } else if (isPartialFieldsFilled) {
        return await tableRef.value?.validateFileds(rowKeys, index)
      }
    })
  )
}

async function clearAll() {
  const validationPromises = tableData.value.flatMap((_, rowIndex) =>
    Object.keys(rules).map(async (key) => getFormDOM(rowIndex, key)?.clearValidate())
  )
  await Promise.all(validationPromises)
}

async function handleDeleteRow(row: any, index: number) {
  await message.confirm(`确定删除${row.sku}吗？`)

  const arr = [...(props.data?.details || [])]
  arr.splice(index, 1)
  emit('update:data', { ...props.data, details: arr })
}

async function handleCopy(key: string, index: number) {
  const date = tableData.value[index][key]
  await message.confirm(`确定将当前价格向下复制吗？`)
  tableData.value.forEach((row, i) => {
    if (i >= index) {
      row[key] = date
      editable.value[i][key] = true
    }
  })
}

function handleCancle(row, index) {
  Object.keys(editable.value[index]).forEach((key) => {
    editable.value[index][key] = false
    tableRef.value?.clearValidate(undefined, index)
  })

  Object.assign(tableData.value[index], cloneDeep(oldData.value[index]))
  delete row.editable
}

function handleEdit(_, index) {
  Object.keys(editable.value[index]).forEach((key) => {
    editable.value[index][key] = true
  })
}

async function handleCopyRow(row: Supplier.Appoint.ScAdvancedShippingRequestOrderDetail) {
  await message.confirm(
    `确定将${row.sku}的成品采购价、裸货采购价、仓库包装成本、是否含税、最小采购量、税率、折扣应用到所有商品中吗？`
    // `确定将${row.sku}的成品采购价、裸货采购价、最小采购量、税率、折扣应用到所有商品中吗？`
  )

  // 提取需要更新的字段，集中管理便于维护
  const updateFields = [
    'fgCost',
    'baseProdCost',
    'whPackCost',
    'minPurchaseQty',
    'taxRate',
    'discountRate',
    'hasTax'
  ] as const

  // 处理详情数据，为每个元素合并更新字段
  const updatedDetails = (props.data?.details ?? []).map((ele) => {
    if (ele.id) {
      return ele
    } else {
      return {
        ...ele,
        ...updateFields.reduce(
          (acc, field) => {
            acc[field] = row[field]
            return acc
          },
          {} as Record<(typeof updateFields)[number], any>
        )
      }
    }
  })

  // 触发更新事件
  emit('update:data', {
    ...props.data,
    details: updatedDetails
  })
}

async function handleEnable(row) {
  const enable = row.enable === 0 ? 1 : 0
  const keyword = enable === 0 ? '停用' : '启用'
  await message.confirm(`确定${keyword}${row.sku}吗？`)

  try {
    row.enableLoading = true
    const res = await enableSupplierApi({ supplierGoodsDetailId: row.id, enable })
    if (res.success) {
      message.success(`${keyword}成功`)
      row.enable = enable
    }
  } catch (error) {
  } finally {
    delete row.enableLoading
  }
}

defineExpose({ validateAll, clearAll, setOldData })
</script>
<style lang="less" scoped>
@import url(../../index.scss);

.commonTopFilterWrap-filter {
  flex: 1;
}

.commonTopFilterWrap-search {
  padding-left: 115px;
  justify-content: flex-end;
}

:deep(.cell) {
  // display: flex;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.el-table {
  :deep(.el-form-item__content) {
    justify-content: flex-end;
  }
}

.el-card {
  border: 0;
  border-radius: 8px;

  :deep(.el-card__body) {
    padding-bottom: 0;
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
}

:deep(.el-card__body) {
  height: 100%;
}

.is_warning {
  // display: none;

  :deep(.el-input__wrapper) {
    box-shadow: 0 0 0 1px #ffca57;

    &:focus {
      box-shadow: 0 0 0 1px #ffca57 inset;
    }
  }
}

:deep(.el-input) {
  max-width: 100px;
}

:deep(.el-input-number) {
  max-width: 100px;
}
</style>
