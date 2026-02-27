<template>
  <div>
    <s-w-search-form
        ref="swSearchRef"
        :schema="searchSchema"
        :expand-threshold="4"
        :show-expand="true"
        expand-text="展开"
        collapse-text="收起"
        @search="handleSearch"
        @reset="handleReset"
        auto-search-on-change
        :default-expand-all="false"
        :showSearchButton="false"
      />
    <s-table
      ref="tableRef"
      :columns="columns"
      :fetch="queryArchivalMaterials"
      :fetch-params="searchForm"
      :after-fetch="afterFetchProductDocs"
      :span-method="handleSpanMethod"
      :border="true"
      @pagination-change="handlePaginationChange"
      pagination-teleport="#product-list-dashboard-documentation-pagination"
    />
    <div id="product-list-dashboard-documentation-pagination"></div>
  </div>
  <!-- <flux-wrap>
    <template #header>
      
    <template #footer>
      
    </template>
  </flux-wrap> -->
</template>

<script lang="tsx" setup>
import { FormSchema } from '@/types/form'
import { watch, computed } from 'vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { queryArchivalMaterials } from '@/api/oa/new/progressDashboardList'
import * as CommonApi from '@/api/common'
import * as SystemConstantApi from '@/api/system/systemConstant'
import { useCategoryList } from '@/views/OA/new/product/hooks.js'
import StoreTreeCascader from '@/components/StoreTreeCascader/src/StoreTreeCascader.vue'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import SearchTime from '@/components/common/time/search.vue'
import type { TableColumn } from '@/components/SWTable/src/table'
import { createDocumentationColumns } from './components/columns'
import { nextFrameTick } from '@/utils/util'
import { useDrawer } from '@/hooks/web/useDrawer'
import OperationalInformation from './components/operationalInformation.vue'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'


defineOptions({ name: 'ProductDocumentation' })

const { categoryList } = useCategoryList()

// 将品类 code 映射为名称，用于表格展示
const categoryCodeToName = computed(() => {
  const list = Array.isArray(categoryList.value) ? categoryList.value : []
  const map: Record<string, string> = {}
  list.forEach((item: any) => {
    if (!item) return
    const code = item.code != null ? String(item.code) : undefined
    if (code) map[code] = item.name ?? code
  })
  return map
})

// 搜索表单数据
const searchForm = ref({})

const tableRef = ref()

// 人员选择相关
const personList = ref<any>([])
const openIds = ref('')
const peopleList1 = ref<any>([])
const chosenSupplierStaffIdList = ref([])
const chosenSupplierStaffIdOpenIds = ref('')

// 搜索表单ref，用于在自定义组件动作后主动触发搜索
const swSearchRef = ref<any>()
// 计划上架月份组件 ref（用于读取 formatValue）
const timeRef = ref<any>()

// 设计师/买手
const remoteMethod = async (_value) => {
  if (!openIds.value) {
    openIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_DEVELOP'
    ).catch(() => {})
  }
  if (personList.value.length > 0) {
    return personList.value || []
  }
  const data = await CommonApi.getPersonByOpenId(openIds.value).catch(() => {})
  personList.value = data || []
  return data || []
}

// 运营负责人/采购负责人
const remoteMethod1 = async (_value) => {
  if (peopleList1.value.length > 0) {
    return peopleList1.value
  }
  const data = await CommonApi.getPersonByOpenId('1').catch(() => {})
  peopleList1.value = data || []
  return data || []
}

// 供应链开发
const remoteMethodChosenSupplierStaffId = async (_value) => {
  if (chosenSupplierStaffIdList.value.length > 0) {
    return chosenSupplierStaffIdList.value
  }
  if (!chosenSupplierStaffIdOpenIds.value) {
    chosenSupplierStaffIdOpenIds.value = await SystemConstantApi.getSystemConstantConfigbyCode(
      'NEW_PRODUCT_DEPT_SUPPLY'
    ).catch(() => {})
  }
  const data = await CommonApi.getPersonByOpenId(chosenSupplierStaffIdOpenIds.value).catch(() => {})
  chosenSupplierStaffIdList.value = data || []
  return data || []
}

// 人员选择保存处理
const saveSelectPeople = (fieldCode, list) => {
  searchForm.value[fieldCode] = list && list.map((item) => item.userId).join(',')
  // 主动触发一次搜索，确保条件即时生效
  swSearchRef.value?.search?.()
}

// 搜索表单配置
const searchSchema = ref<FormSchema[]>([
  {
    field: 'planName',
    label: '企划名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入企划名称',
      clearable: true
    }
  },
  {
    field: 'productCode',
    label: '货品编码',
    component: 'Input',
    componentProps: {
      placeholder: '请输入货品编码',
      clearable: true
    }
  },
  {
    field: 'category',
    label: '品类',
    // component: 'Select',
    // componentProps: {
    //   placeholder: '请选择品类',
    //   clearable: true,
    //   options: categoryList.value.map((item) => ({
    //     label: item.name,
    //     value: item.code
    //   }))
    // }
    customRender: (_item, model) => (
      <CategorySelect   vModel={model.category} onChange={() => swSearchRef.value?.search?.()}/>
    )
  },
  {
    field: 'store',
    label: '店铺',
    customRender: (_item, model) => (
      <StoreTreeCascader
        vModel={model.store}
        onChange={() => swSearchRef.value?.search?.()}
        onClear={() => swSearchRef.value?.search?.()}
      />
    )
  },
  {
    field: 'planType',
    label: '企划类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择企划类型',
      clearable: true,
      options: getIntDictOptions(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, true)
    }
  },
  {
    field: 'isCore',
    label: '产品等级',
    component: 'Select',
    componentProps: {
      placeholder: '请选择产品等级',
      clearable: true,
      options: getIntDictOptions(DICT_TYPE.NP_PRODUCTGRADE, true)
    }
  },
  {
    field: 'planListDate',
    label: '计划上架月份',
    // 使用 SearchTime 组件（与 @SWForm.vue 一致）
    customRender: (_item, model) => (
      <SearchTime
        class="search-time"
        ref={timeRef}
        vModel={model.planListDate}
        style="width: 200px"
        placeholder="请选择计划上架日期"
        layout="日,周,月"
        onChange={() => swSearchRef.value?.search?.()}
      />
    )
  },
  {
    field: 'planCode',
    label: '任务编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入任务编号',
      clearable: true
    }
  },
  {
    field: 'productNumber',
    label: '产品编号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入产品编号',
      clearable: true
    }
  },
  
  {
    field: 'designerList',
    label: '设计师/买手',
    customRender: (_item, model) => (
      <div>
        <SWSelectPeople
          isEdit={true}
          multiple={false}
          vModel={model.designerList}
          type="operate"
          getSearchList={remoteMethod}
          onSaveSelectPeople={() => saveSelectPeople('designer', model.designerList)}
        />
      </div>
    )
  },
  {
    field: 'operateManageIdList',
    label: '运营负责人',
    customRender: (_item, model) => (
      <div>
        <SWSelectPeople
          isEdit={true}
          multiple={false}
          vModel={model.operateManageIdList}
          type="operate"
          getSearchList={remoteMethod1}
          onSaveSelectPeople={() => saveSelectPeople('operateManageId', model.operateManageIdList)}
        />
      </div>
    )
  },
  {
    field: 'procurementManagerIdList',
    label: '采购负责人',
    customRender: (_item, model) => (
      <div>
        <SWSelectPeople
          isEdit={true}
          multiple={false}
          vModel={model.procurementManagerIdList}
          type="operate"
          getSearchList={remoteMethod1}
          onSaveSelectPeople={() =>
            saveSelectPeople('procurementManagerId', model.procurementManagerIdList)
          }
        />
      </div>
    )
  }
  // {
  //   field: 'chosenSupplierStaffIdList',
  //   label: '供应链开发',
  //   customRender: (_item, model) => (
  //     <div>
  //       <SWSelectPeople
  //         isEdit={true}
  //         multiple={false}
  //         vModel={model.chosenSupplierStaffIdList}
  //         type="operate"
  //         getSearchList={remoteMethodChosenSupplierStaffId}
  //         onSaveSelectPeople={() =>
  //           saveSelectPeople('chosenSupplierStaffId', model.chosenSupplierStaffIdList)
  //         }
  //       />
  //     </div>
  //   )
  // }
])

// s-table 远程获取数据
// const fetchProductDocs = async (params: any) => {
//   const res: any = await queryProgressList({ ...params })
//   return {
//     records: Array.isArray(res?.records) ? res.records : [],
//     total: Number(res?.total) || 0
//   }
// }

// 当前表格的完整数据（用于合并单元格计算，按当前分页切片）
const currentFullRows = ref<any[]>([])

// s-table 获取后处理：将每条企划的 items 扁平为表格行，并合并父级字段到子项
const afterFetchProductDocs = (records: any[]) => {
  if (!Array.isArray(records)) return []
  const rows = records.flatMap((record: any) => {
    const { items, ...rest } = record || {}
    const itemList = Array.isArray(items) ? items : []
    return itemList.map((item: any) => ({ ...rest, ...item }))
  })
  currentFullRows.value = rows
  console.log('rows', rows)
  // 数据刷新后重算一次合并
  queueMicrotask?.(() => recomputeMerge())
  return rows
}

// 合并单元格：按 planName 分组合并企划阶段的基础字段
const mergeFields = [
  'planName',
  'planType',
  'store',
  'isCore',
  'planOrderDate',
  'planListDate',
  'remark'
]
// 获取当前页展示的数据：后端已分页，直接返回当前页 rows，避免二次切片
const getCurrentPageRows = () => {
  return Array.isArray(currentFullRows.value) ? currentFullRows.value : []
}

// 仅基于当前页数据预计算合并行映射，避免复杂度
const mergeMap = ref<Record<number, number>>({})

const recomputeMerge = () => {
  const rows = getCurrentPageRows()
  const map: Record<number, number> = {}
  let i = 0
  while (i < rows.length) {
    const start = i
    const key = rows[i]?.planName
    while (i < rows.length && rows[i]?.planName === key) i++
    map[start] = i - start
  }
  mergeMap.value = map
}

const handleSpanMethod = ({ column, row, rowIndex }) => {
  if (!mergeFields.includes(column.property)) return { rowspan: 1, colspan: 1 }
  // 使用当前页数据中的索引，避免分页导致的 rowIndex 偏移问题
  const rows = getCurrentPageRows()
  const idx = rows.indexOf(row)
  const keyIndex = idx > -1 ? idx : rowIndex
  const span = mergeMap.value[keyIndex]
  if (span === undefined) return { rowspan: 0, colspan: 1 }
  return { rowspan: span, colspan: 1 }
}

// 分页变化时重算合并
const handlePaginationChange = () => {
  // recomputeMerge()
}

// 搜索处理
const handleSearch = async (formData: any) => {
  // 处理日期范围（优先使用 SearchTime 的 formatValue）
  const planListDate = formData.planListDate || []
  const formatValue: any = timeRef.value?.formatValue
  let startDate: any = null
  let endDate: any = null
  if (Array.isArray(formatValue) && formatValue.length) {
    ;[startDate, endDate] = formatValue
  } else if (Array.isArray(planListDate) && planListDate.length) {
    ;[startDate, endDate] = planListDate
  }
  const mapListToIds = (list: any) => {
    if (!Array.isArray(list)) return undefined
    const ids = list.map((item: any) => (item && (item.userId ?? item)) as string).filter(Boolean)
    return ids.length ? ids.join(',') : undefined
  }
  const params = {
    ...formData,
    planListStartDate: startDate || null,
    planListEndDate: endDate || null,
    // 人员字段映射为后端需要的 id 字符串
    designer: mapListToIds(formData.designerList),
    operateManageId: mapListToIds(formData.operateManageIdList),
    procurementManagerId: mapListToIds(formData.procurementManagerIdList),
    chosenSupplierStaffId: mapListToIds(formData.chosenSupplierStaffIdList),
    // 清理不需要的字段
    planListDate: undefined,
    operateManageIdList: undefined,
    procurementManagerIdList: undefined,
    chosenSupplierStaffIdList: undefined,
    designerList: undefined
  }

  searchForm.value = Object.assign({}, params)
  await nextFrameTick()
  console.log('searchForm.value', searchForm.value)
  // 重置页码并刷新表格
  tableRef.value?.refresh?.(true)
  // 刷新后重算合并（异步确保数据已渲染）
  // queueMicrotask?.(() => recomputeMerge())
}

// 重置处理
const handleReset = () => {
  searchForm.value = {}
  // 重置并刷新表格
  // tableRef.value?.refresh?.(true)
  // queueMicrotask?.(() => recomputeMerge())
}

// 竞品信息
const { openDrawer } = useDrawer()
const handleOpenDrawer = (type: string, row: any) => {
  if (type === 'operationalInformation') {
    openDrawer({
      title: '竞品信息',
      content: OperationalInformation,
      wrapperStyle: { padding: 'unset', backgroundColor: 'unset' },
      props: { row },
      showConfirmFooter: false
    })
  }
}

// 动态更新“品类”下拉选项，确保分类异步加载后表单内的 options 同步
watch(
  () => categoryList.value,
  (val) => {
    const opts = (val || []).map((item: any) => ({ label: item.name, value: item.code }))
    swSearchRef.value?.setSchema?.([
      { field: 'category', path: 'componentProps.options', value: opts }
    ])
  },
  { immediate: true, deep: true }
)

// 企划阶段表头（抽离为组件配置，列宽统一使用 minWidth）
const columns = ref<TableColumn[]>(
  createDocumentationColumns({
    getCategoryNameByCode: (code: string) => categoryCodeToName.value[code],
    onOpenDrawer: handleOpenDrawer
  })
)
</script>

<style lang="scss" scoped>
:deep(.sw-search) {
  .cascaderBoxAdmin .el-input__wrapper {
    height: 32px;
  }
  .search-time {
    width: unset !important;
    .el-input__wrapper {
      height: 34px;
    }
  }
}
</style>
