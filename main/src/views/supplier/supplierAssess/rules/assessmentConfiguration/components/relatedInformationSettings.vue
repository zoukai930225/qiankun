<template>
  <teleport :to="TELEPORT_SELECTORS.searchRow">
    <!-- <s-w-search-form
      label-width="auto"
      :schema="searchSchema"
      :expand-threshold="4"
      :show-expand="false"
      auto-search-on-change
      @search="onSearch"
      @reset="onReset"
    >
      <el-button
        v-if="permissionSet.has('AssessmentConfiguration:Link:Add')"
        type="primary"
        @click="onAdd"
      >
        <el-icon>
          <Plus />
        </el-icon>
        新增
      </el-button>
    </s-w-search-form> -->

    <div class="!flex justify-start justify-between items-center pb-20px">
      <el-form inline>
        <el-form-item :prop="codeType" label-width="0" class="!mb-0">
          <el-input v-model.trim="queryParams[codeType]" :placeholder="codeTypes[codeType].placeholder" clearable
            @keydown.enter="onSearch(queryParams)" @clear="onSearch(queryParams)">
            <template #prepend>
              <el-select v-model="codeType" @change="handleChangeCodeType">
                <el-option v-for="(value, key) in codeTypes" :key="key" :value="key" :label="value.label" />
              </el-select>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="供应商类型" class="!mb-0">
          <el-select v-model="queryParams.supplierType" style="width:200px" clearable @change="onSearch(queryParams)">
            <el-option v-for="item in getIntDictOptions(DICT_TYPE.SUPPLIER_TYPE, true)" :key="item.value"
              :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="!flex justify-end items-center">
        <el-button type="primary" v-if="permissionSet.has('AssessmentConfiguration:Link:BatchDelete')" @click="handleBatchDelete()" :disabled="batchSelectedRows.length === 0">批量删除</el-button>
        <el-button type="primary" v-if="permissionSet.has('AssessmentConfiguration:Link:BatchOpen')" @click="handleBatchEnable()" :disabled="batchSelectedRows.length === 0">批量开启</el-button>
        <el-button type="primary" v-if="permissionSet.has('AssessmentConfiguration:Link:BatchClose')" @click="handleBatchDisable()" :disabled="batchSelectedRows.length === 0">批量关闭</el-button>
        <el-button v-if="permissionSet.has('AssessmentConfiguration:Link:Add')" type="primary" @click="onAdd">
          <el-icon>
            <Plus />
          </el-icon>
          新增
        </el-button>
      </div>
    </div>
  </teleport>
  <s-table ref="tableRef" :columns="columns" :fetch="getAssessmentConfigurationPage" :fetch-params="queryParams"
    row-key="supplierId" border :pagination-map="{ pageNum: 'pageNum', pageSize: 'pageSize' }"
    :pagination-teleport="TELEPORT_SELECTORS.footer" />
</template>
<script lang="tsx" setup>
import { ref, defineAsyncComponent } from 'vue'
import { TELEPORT_SELECTORS } from '../config/teleport'
import { useDialog } from '@/hooks/web/useDialog'
import { useMessage } from '@/hooks/web/useMessage'
import { Plus } from '@element-plus/icons-vue'
import { getDictLabel, DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import {
  getAssessmentConfigurationPage,
  updateAssessmentStatus,
  deleteAssessmentConfiguration
} from '@/api/supplier/assessmentConfiguration'
import { useRouter } from 'vue-router'
import { useDrawer } from '@/hooks/web/useDrawer'
import request from '@/config/axios';


const router = useRouter()
const { openDialog } = useDialog()
const { openDrawer } = useDrawer()
const message = useMessage()
const permissionSet = new Set(getPermission())
const NumberOfRelatedAssessmentModules = defineAsyncComponent(
  () => import('./numberOfRelatedAssessmentModules.vue')
)
const EditRelatedInformationSettings = defineAsyncComponent(
  () => import('./editRelatedInformationSettings.vue')
)

const tableRef = ref()
// 通知父组件：有关联信息的变更，需刷新统计
const emit = defineEmits(['changed'])

const queryParams = ref<any>({
  abbreviationCompany: undefined,
  fullCompany: undefined,
  supplierType: undefined,
  keyword: undefined
})

const columns = ref<any[]>([
  {
    type: 'selection',
    width: 60,
    align: 'center',
    headerAlign: 'center',
    reserveSelection: true,
  },
  {
    prop: 'abbreviationCompany',
    label: '供应商简称',
    minWidth: 160,
    align: 'left',
    headerAlign: 'left'
  },
  { prop: 'fullCompany', label: '公司名称', minWidth: 220, align: 'left', headerAlign: 'left' },
  {
    prop: 'supplierType',
    label: '供应商类型',
    minWidth: 120,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => getDictLabel(DICT_TYPE.SUPPLIER_TYPE, row.supplierType) || '-'
  },
  {
    prop: 'status',
    label: '考核状态',
    minWidth: 120,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => (
      <el-switch
        model-value={Boolean(row?.status ? 1 : 0)}
        onChange={(val: boolean) => onToggleAssessment(row, val)}
      />
    )
  },
  {
    prop: 'itemNum',
    label: '关联考核模块数',
    minWidth: 140,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => {
      const count = Number(row?.itemNum ?? 0)
      return (
        <el-button type="primary" link onClick={() => onOpenModuleList(row)}>
          {Number.isFinite(count) ? count : '-'}
        </el-button>
      )
    }
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: 120,
    align: 'left',
    headerAlign: 'left',
    showOverflowTooltip: false,
    customRender: ({ row }) => (
      <div class="actions left">
        {permissionSet.has('AssessmentConfiguration:Link:Edit') ? (
          <el-button type="primary" link onClick={() => onEdit(row)}>
            编辑
          </el-button>
        ) : null}
        {permissionSet.has('AssessmentConfiguration:Link:Delete') ? (
          <el-button type="danger" link onClick={() => onDelete(row)}>
            删除
          </el-button>
        ) : null}
      </div>
    )
  }
])

// 批量操作
const batchSelectedRows = computed(() => tableRef.value?.getTableRef?.().getSelectionRows() || [])
const isAllSelected = computed(() => batchSelectedRows.value.length === tableRef.value?.getPagination?.().total)
// 处理选择变化
// function handleSelectionChange(rows: any[]) {
//   console.log(rows,tableRef.value?.getTableRef?.().getSelectionRows())
//   batchSelectedRows.value = rows
// }
// // 处理全选变化
// function selectSingleTableAll(rows: any[]) {
//   console.log(rows,tableRef.value?.getTableRef?.().getSelectionRows())
//   batchSelectedRows.value = rows
// }

// 批量删除
async function handleBatchDelete() {
  if (batchSelectedRows.value.length === 0) {
    message.warning('请选择要删除的关联信息')
    return
  }
  await message.confirm('请确认是否删除选择的关联信息')
  const supplierIds = batchSelectedRows.value.map((row) => row?.supplierId)
  try {
    await request.post({
      url: '/api/saConfig/relation/batchDelete',
      data: { supplierIds ,allFlag:isAllSelected.value}
    })
    message.success('删除成功')
    tableRef.value?.getTableRef?.().clearSelection?.()
    tableRef.value?.refresh?.()
    emit('changed')
  } catch (e) {
    message.error('删除失败')
  }
}
// 批量开启
async function handleBatchEnable() {
  if (batchSelectedRows.value.length === 0) {
    message.warning('请选择要开启的关联信息')
    return
  }
  await message.confirm('请确认是否开启选择的关联信息')
  const supplierIds = batchSelectedRows.value.map((row) => row?.supplierId)
  try {
    await request.post({
      url: '/api/saConfig/relation/batchOpen',
      data: { supplierIds ,allFlag:isAllSelected.value ,operateStatus:1}
    })
    message.success('开启成功')
    tableRef.value?.getTableRef?.().clearSelection?.()
    tableRef.value?.refresh?.()
    emit('changed')
  } catch (e) {
    message.error('开启失败')
  }
}
// 批量关闭关联信息
async function handleBatchDisable() {
  if (batchSelectedRows.value.length === 0) {
    message.warning('请选择要关闭的关联信息')
    return
  }
  await message.confirm('请确认是否关闭选择的关联信息')
  const supplierIds = batchSelectedRows.value.map((row) => row?.supplierId)
  try {
    await request.post({
      url: '/api/saConfig/relation/batchClose',
      data: { supplierIds ,allFlag:isAllSelected.value ,operateStatus:0}
    })
    message.success('关闭成功')
    tableRef.value?.getTableRef?.().clearSelection?.()
    tableRef.value?.refresh?.()
    emit('changed')
  } catch (e) {
    message.error('关闭失败')
  }
}



// 供应商考核配置的分页数据由 getAssessmentConfigurationPage 提供

async function onToggleAssessment(row: any, enabled: boolean) {
  const supplierId = row?.supplierId || row?.id
  if (!supplierId) return
  const status = enabled ? 1 : 0
  try {
    await updateAssessmentStatus({ supplierId, status })
    // 乐观更新本地行，便于表格内即时反馈
    row.status = status
    row.assessmentStatus = status
  } catch (e) {
    // 忽略错误提示细节，保持行为与全局一致
  } finally {
    // 刷新当前页，确保数据与服务端一致
    // tableRef.value?.refresh?.()
    emit('changed')
  }
}

function onOpenModuleList(row: any) {
  openDialog({
    title: '关联考核模块',
    width: '800px',
    content: NumberOfRelatedAssessmentModules,
    props: { row, supplierId: row?.supplierId || row?.id },
    showConfirmFooter: false
  })
}

function onEdit(row: any) {
  openDrawer({
    title: '编辑',
    width: '800px',
    content: EditRelatedInformationSettings,
    props: { row, supplierId: row?.supplierId || row?.id },
    showConfirmFooter: true,
    confirmText: '保存',
    onSuccess: () => {
      // 保存成功后刷新列表
      tableRef.value?.refresh?.()
      emit('changed')
    }
  })
}

function onDelete(row: any) {
  const supplierId = row?.supplierId || row?.id
  if (!supplierId) return
  message
    .delConfirm('确定删除该关联信息吗？')
    .then(async () => {
      await deleteAssessmentConfiguration({ supplierId })
      message.success('删除成功')
      tableRef.value?.refresh?.()
      emit('changed')
    })
    .catch(() => { })
}

function onAdd() {
  router.push({ name: 'CreateRelatedInformationSettings' })
}

defineExpose({
  refresh: (toFirstPage = false) => {
    tableRef.value?.refresh?.(toFirstPage)
    tableRef.value?.getTableRef?.().clearSelection?.()
  }
})

// ----- search schema and handlers moved here -----
import { getPermission } from '@/utils'

const codeTypes = {
  abbreviationCompany: { label: '供应商简称', placeholder: '请输入供应商简称' },
  fullCompany: { label: '公司名称', placeholder: '请输入公司名称' }
}
const codeType = ref('abbreviationCompany')

function handleChangeCodeType() {
  let val = ''
  Object.keys(codeTypes).forEach((key) => {
    queryParams[key] && (val = queryParams[key])
    queryParams[key] = ''
  })
  val && onSearch(queryParams.value)
}

async function onSearch(model: Record<string, any>) {
  const { supplierType, abbreviationCompany, fullCompany } = model || {}
  const newParams = {
    supplierType: supplierType || undefined,
    abbreviationCompany: abbreviationCompany || undefined,
    fullCompany: fullCompany || undefined,
    keyword: undefined
  }
  queryParams.value = {
    ...queryParams.value,
    ...newParams
  }
  await nextTick()
  tableRef.value?.refresh?.(true)
  tableRef.value?.getTableRef?.().clearSelection?.()
}
</script>
<style scoped lang="less">
@import url(../../../../index.scss);
</style>
