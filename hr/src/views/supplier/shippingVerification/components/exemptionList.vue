<template>
  <el-card shadow="never" class="!border-0 !rounded-16px">
    <div v-if="isProduct" class="mb-20px w-[max-content] ml-auto">
      <component :is="easyBtnGroup(topBtns)" />
    </div>

    <special-table
      :data="tableData"
      :options="exemptionTable"
      :btns-options="btnsOptions"
      v-model:filters="filters"
      :loading="loading"
      :loading-btns="['撤回']"
    />
  </el-card>
</template>
<script lang="tsx" setup>
import specialTable from '@/views/supplier/components/table.vue'
import { exemptionTable, QCStatusOptions } from '../options'
import { AuditBtn } from '../../changeAudit/option'
import { useUserStore } from '@/store/modules/user'
import { getExemptionListApi, recallExemptionAuditApi } from '@/api/supplier/shippingVerification'
import { easyBtnGroup } from '../../components/twoFourSix'
import { Icon } from '@/components/Icon'
import { toReactive } from '@vueuse/core'

const message = useMessage()
const userInfo = useUserStore()
const route = useRoute()

const props = defineProps<{
  id: string
}>()

const emit = defineEmits<{
  (e: 'check', id: string): void
  (e: 'add'): void
}>()

const tableData = ref<any[]>([])
const filters = ref({
  statusLabel: []
})

const isProduct = computed(() => route.name === 'SupplierProductIndex')
const isShippingVerification = computed(() => route.name === 'ShippingVerification')

const topBtns = computed(() => {
  return [
    {
      label: '新增',
      icon: <Icon icon="ep:plus"></Icon>,
      type: 'primary',
      onClick: handleAdd,
      page: tableData.value.every((row) => row.status !== '10'),
      permission: 'SupplierProduct:MyOrder:ExemptionApplication:Add'
    }
  ]
})

enum BTNS_KEYS {
  /** 查看 */ CHECK,
  /** 撤回 */ RECALL
}

const BTNS_CONFIG = computed<
  Record<BTNS_KEYS, [string, ((...arg: any[]) => any)?, Partial<AuditBtn>?]>
>(() => {
  const node = {
    [String(isProduct.value)]: 'SupplierProduct:MyOrder:ExemptionApplication',
    [String(isShippingVerification.value)]: 'ShippingVerification:ExemptionLog'
  }['true']

  return {
    [BTNS_KEYS.CHECK]: ['查看', handleCheck, { permission: `${node}:Check` }],
    [BTNS_KEYS.RECALL]: ['撤回', handleRecall, { permission: `${node}:Recall`, type: 'danger' }]
  }
})

const btnsOptions = computed(() =>
  tableData.value.map(({ status, creatorInfo }) => {
    const btnsKey = new Set([BTNS_KEYS.CHECK])

    if (status === '10' && userInfo.user.id === creatorInfo.userId) btnsKey.add(BTNS_KEYS.RECALL)

    return toReactive(
      Array.from(btnsKey)
        .sort((a, b) => a - b)
        .map((key) => new AuditBtn(...BTNS_CONFIG.value[key]))
    )
  })
)

function handleCheck(row) {
  emit('check', row.id)
}

async function handleRecall(row) {
  await message.confirm('确定要撤回审核吗？')
  try {
    const res = await recallExemptionAuditApi(row.id)
    if (res.success) {
      message.success('撤回成功！')
      getList()
    }
  } catch (error) {}
}

const loading = ref(false)
async function getList() {
  loading.value = true
  try {
    const res = await getExemptionListApi({ scPurchaseOrderId: props.id })
    if (!res) return
    tableData.value = res.map((row) => {
      return { ...row, statusLabel: QCStatusOptions.find((ele) => ele.value === row.status)?.label }
    })
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleAdd() {
  emit('add')
}

function clearList() {
  tableData.value = []
}

defineExpose({ getList, clearList })
</script>
<style lang="less" scoped></style>
