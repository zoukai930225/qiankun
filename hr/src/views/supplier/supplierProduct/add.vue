<template>
  <special-card shadow="never">
    <add-form ref="queryFormRef" v-model:form-data="formData" @change-po="handleChangePo" />

    <add-table
      ref="addTableRef"
      v-model:data="formData"
      :loading="loading"
      @add="unselectedDialogRef?.open()"
      @refresh="getDetail"
    />

    <template #footer>
      <el-button @click="handleBack">返回</el-button>
      <el-button
        type="primary"
        v-if="!isCheck"
        :loading="saveLoading"
        :disabled="saveLoading"
        @click="handleSave"
      >
        保存
      </el-button>
    </template>
  </special-card>

  <unselected-dialog
    ref="unselectedDialogRef"
    :goods-id="formData.goodsId"
    v-model:form-data="formData"
  />
</template>
<script lang="tsx" setup>
import { FormInstance } from 'element-plus'
import { useTagsView } from '@/hooks/web/useTagsView'
import { deepEqual } from '@/utils/common'
import AddTable from './components/addTable.vue'
import AddForm from './components/addForm.vue'
import { cloneDeep } from 'lodash-es'
import specialCard from '../components/specialCard.vue'
import {
  getSupplierGoodsByIdApi,
  saveOrUpdateSupplierGoodsApi
} from '@/api/supplier/supplierProduct'
const unselectedDialog = defineAsyncComponent(() => import('./components/unselectedDialog.vue'))

defineOptions({ name: 'SupplierProductAdd' })

const router = useRouter()
const route = useRoute()
const message = useMessage()
const tagsViewStore = useTagsView()
const unselectedDialogRef = ref<{ open: () => void }>()

const formData = ref<Supplier.SupplierProduct.SaveOrUpdateSupplierGoodsParam>({})
const tableData = ref<Supplier.Appoint.ScAdvancedShippingRequestOrderDetail[]>([])
const queryFormRef = ref<FormInstance>()

const loading = ref(false)
const oldFormData = ref<typeof formData.value>({})
const addTableRef = ref()

const isCheck = computed(() => route.query.pageType === '1')
async function handleBack() {
  const res = !deepEqual(oldFormData.value, {
    ...formData.value
  })

  if (res) {
    await message.confirm('确定要离开当前页面吗？离开后当前未保存数据会丢失')
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierSupplierProductIndex', query: { tab: route.query.tab } })
  } else {
    tagsViewStore.closeCurrent()
    router.push({ name: 'SupplierSupplierProductIndex', query: { tab: route.query.tab } })
  }
}

const saveLoading = ref(false)
async function handleSave() {
  try {
    if (!formData.value.details?.length) return message.warning('未选择货品')

    const ress = await Promise.all([
      queryFormRef.value?.validate(),
      addTableRef.value?.validateAll()
    ])
    console.log(ress)

    saveLoading.value = true
    const res = await saveOrUpdateSupplierGoodsApi({
      ...formData.value,
      supplierGoodsId: (route.params.id as string) ?? undefined
    })
    if (res.success) {
      message.success(route.params.id ? '编辑成功' : '保存成功')
      tagsViewStore.closeCurrent()
      router.push({ name: 'SupplierSupplierProductIndex' })
    }
  } catch (error: any) {
  } finally {
    saveLoading.value = false
  }
}

const timer = ref<NodeJS.Timeout>()
function getDetail() {
  loading.value = true
  timer.value && clearTimeout(timer.value)

  timer.value = setTimeout(async () => {
    tableData.value = []
    try {
      const res = await getSupplierGoodsByIdApi({ supplierGoodsId: route.params.id as string })
      if (res) transformForm(res)
    } catch (error) {
    } finally {
      oldFormData.value = cloneDeep(formData.value)
      loading.value = false
    }
  }, 1000)
}

async function handleChangePo(val: string) {
  if (!val) return (tableData.value = [])
  loading.value = true
  try {
    addTableRef.value.clearAll()
    const res = await getSupplierGoodsByIdApi({ supplierGoodsId: route.params.id as string })
    if (res) transformForm(res)
  } catch (error) {
  } finally {
    oldFormData.value = cloneDeep(formData.value)
    loading.value = false
  }
}

function transformForm(res: any) {
  formData.value = { ...res.goodsInfo, details: res.details, ...res.supplier }
  nextTick(() => addTableRef.value?.setOldData())
}

defineExpose({ getDetail })

onActivated(async () => {
  route.params.id && !formData.value.goodsId && (await getDetail())
})

onMounted(async () => {
  route.params.id && (await getDetail())
})
</script>
<style lang="less" scoped>
@import url(../index.scss);
</style>
