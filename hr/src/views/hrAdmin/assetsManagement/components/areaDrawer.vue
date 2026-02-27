<template>
  <div class="area-drawer">
    <s-w-search-form
      ref="searchFormRef"
      :schema="searchSchema"
      :expand-threshold="3"
      show-expand
      @search="onSearch"
      @reset="onReset"
      :show-search-button="false"
      :show-reset-button="false"
      auto-search-on-change
    >
      <el-button type="primary" @click="onAdd">
        <Icon class="mr-4px" color="#fff" icon="ep:plus" /> 添加区域</el-button
      >
      <el-button
        type="primary"
        :disabled="!selectedData || selectedData.length === 0"
        @click="relationOrgan"
      >
        关联组织</el-button
      >
    </s-w-search-form>

    <s-table
      ref="tableRef"
      :columns="columns"
      :fetch="getList"
      :fetch-params="queryParams"
      :selection="true"
      :onSelectionChange="onSelectionChange"
    />
  </div>
</template>

<script lang="tsx" setup>
import { ref, nextTick } from 'vue'
import { FormSchema } from '@/types/form'
import useDialog from '@/hooks/web/useDialog'
import { defineAsyncComponent } from 'vue'
import { useMessage } from '@/hooks/web/useMessage'
import { getAssetAreaList, deleteAssetArea } from '@/api/hrAdmin/asset'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const canChooseCompany = computed(() => {
  const companyOptions = getIntDictOptions(DICT_TYPE.PR_COMPANY, true)
  if (userStore?.user.company !== 'SecretWorld') {
    return companyOptions.filter((item: any) => item.value === userStore?.user?.company) || []
  }
  return companyOptions || []
})

const message = useMessage()

const { openDialog } = useDialog()
const AreaAddDialog = defineAsyncComponent(() => import('./areaAddDialog.vue'))

const searchFormRef = ref()
const tableRef = ref()
const dataList = ref([])
const selectedData = ref([])

const onSelectionChange = (selection: any[]) => {
  selectedData.value = Array.isArray(selection) ? selection : []
}

const queryParams = ref({
  qymc: undefined as string | undefined,
  sszz: undefined as string | undefined,
  page: 1,
  size: 10
})

const searchSchema = ref<FormSchema[]>([
  {
    field: 'qymc',
    label: '区域名称',
    component: 'Input',
    componentProps: {
      style: { width: '180px' },
      placeholder: '请输入区域名称',
      clearable: true
    }
  },
  {
    field: 'sszz',
    label: '所属组织',
    component: 'Select',
    componentProps: {
      style: { width: '180px' },
      placeholder: '请选择所属组织',
      options: canChooseCompany.value,
      clearable: true
    }
  }
])

const refresh = async (reset = false) => {
  await nextTick()
  tableRef.value?.refresh(reset)
}

const onSearch = (model: any) => {
  queryParams.value = { ...model }
  refresh(true)
}

const onReset = () => {
  queryParams.value = { qymc: undefined, sszz: undefined }
}

const onAdd = () => {
  openDialog({
    title: '添加区域',
    width: '560px',
    content: AreaAddDialog,
    props: { type: 'create' },
    onSuccess: () => {
      refresh(true)
    }
  })
}

const onEdit = (row: any) => {
  openDialog({
    title: '编辑区域',
    width: '560px',
    content: AreaAddDialog,
    props: {
      type: 'update',
      record: row
    },
    onSuccess: () => {
      refresh()
    }
  })
}

const onDelete = async (row: any) => {
  try {
    await message.delConfirm('确认删除该区域吗')
    await deleteAssetArea({ ids: [row?.id] })
    message.success('删除成功')
    refresh()
  } catch (e) {}
}

const columns = ref<any[]>([
  { type: 'selection', minWidth: 200, headerAlign: 'left', align: 'left' },
  { prop: 'qymc', label: '区域名称', minWidth: 200, headerAlign: 'left', align: 'left' },
  {
    prop: 'sszz',
    label: '所属组织',
    minWidth: 200,
    headerAlign: 'left',
    align: 'left',
    customRender: ({ row }) => {
      const obj = canChooseCompany.value.find((item: any) => item.value === row.sszz)
      return obj?.label || '-'
    }
  },
  {
    prop: 'priority',
    label: '优先级',
    minWidth: 200,
    headerAlign: 'left',
    align: 'left',
  },
  {
    prop: 'operation',
    label: '操作',
    width: 120,
    align: 'left',
    headerAlign: 'left',
    showOverflowTooltip: false,
    customRender: ({ row }) => (
      <div class="actions left">
        <el-button type="primary" link onClick={() => onEdit(row)}>
          编辑
        </el-button>
        <el-button type="danger" link onClick={() => onDelete(row)}>
          删除
        </el-button>
      </div>
    )
  }
])

const getList = async (params: any) => {
  try {
    const query = { ...queryParams.value, ...params }
    if (userStore?.user.company !== 'SecretWorld') {
      query['sszz'] = canChooseCompany.value && canChooseCompany.value[0]?.value
    }
    const res = await getAssetAreaList(query)
    return res
  } finally {
  }
}

const relationOrgan = () => {
  openDialog({
    title: '关联组织',
    width: '560px',
    content: AreaAddDialog,
    props: {
      type: 'relation',
      selectedData: selectedData.value
    },
    onSuccess: () => {
      refresh()
    }
  })
}
</script>

<style scoped lang="scss">
.area-drawer {
  padding: 4px 0 0 0;
}

.pagination {
  margin-top: 10px;
  text-align: right;
  width: 100%;
  height: 35px;
  position: relative;
}
</style>
