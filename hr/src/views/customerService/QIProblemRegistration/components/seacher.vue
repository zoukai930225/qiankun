<template>
  <!-- <div>{{ queryParams }}</div> -->
  <s-w-search-form
    :schema="searchSchema"
    :expand-threshold="4"
    show-expand
    expand-text="展开"
    collapse-text="收起"
    default-expand-all
    @search="onSearch"
    @reset="reSetData"
    ref="searchFormRef"
    auto-search-on-change
  >
    <el-dropdown @command="commandChange" v-if="isCreater">
      <el-button type="primary">新增</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="detailsView">新增</el-dropdown-item>
          <el-dropdown-item command="exportData">导出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button v-else type="primary" @click="handlexport">导出</el-button>
  </s-w-search-form>
</template>

<script lang="tsx" setup>
import StoreSelect from '@/components/common/store/storeSelect.vue'
import { TabsProvideType, SearchItem } from './Type'
import SelectUser from '@/components/common/user/selectUser.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { FormSchema } from '@/types/form'
import download from '@/utils/download'
import { cloneDeep, debounce } from 'lodash-es'
import { nextTick } from 'vue'
import * as QIProblemRegistrationApi from '@/api/customerService/QIProblemRegistration'
const message = useMessage() // 消息弹窗
const { roleList, getList, handleAdd, isCreater, tabsInit,customerConfigList } = inject(
  'QIProblemRegistration'
) as TabsProvideType

const queryParams = ref<SearchItem>({ ...new SearchItem() }),
  searchFormRef = ref(),
  timeSelectRef = ref(),
  selectUserRef = ref()

const searchSchema: Array<FormSchema> = [
  {
    field: 'qualityInspectionType',
    label: '质检类型',
    component: 'Select',
    componentProps: {
      placeholder: '请选择质检类型',
      clearable: true,
      collapseTags: true,
      collapseTagsTooltip: true,
      multiple: true,
      options: getIntDictOptions(DICT_TYPE.QUALITY_INSPECTION_TYPE, true),
      onChange: (val: any) => valueChange(val, 'qualityInspectionType')
    }
  },
  {
    field: 'problemRiskLevel',
    label: '问题风险程度',
    component: 'Select',
    componentProps: {
      placeholder: '请选择问题风险程度',
      clearable: true,
      options: getIntDictOptions(DICT_TYPE.PROBLEM_RISK_LEVEL, true),
      onChange: (val: any) => valueChange(val, 'problemRiskLevel')
    }
  },

  {
    field: 'stores',
    label: '店铺',
    customRender: (_item, _model) => (
      <StoreSelect v-model={queryParams.value.stores} onChange={storeChange} />
    )
  },
  {
    field: 'orderNo',
    label: '订单号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入订单号',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'orderNo'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = {
            ...queryParams.value,
            orderNo: searchFormRef.value?.formModel?.orderNo
          }
          await nextTick()
          onSearch()
        }
      }
    }
  },
  {
    field: 'customerName',
    label: '旺旺名 (客服)',
    component: 'Input',
    componentProps: {
      placeholder: '请输入旺旺名(客服)',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'customerName'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = {
            ...queryParams.value,
            customerName: searchFormRef.value?.formModel?.customerName
          }
          await nextTick()
          onSearch()
        }
      }
    }
  },
  {
    field: 'registrationId',
    label: '登记人',
    customRender: (_item, _model) => (
      <SelectUser
        v-model={queryParams.value.registrationId}
        role={getRole('质检人员')}
        onChange={(val: any) => userChange(val, 'registrationId')}
      />
    )
  },
  {
    field: 'handleId',
    label: '问题对接人',
    customRender: (_item, _model) => (
      <SelectUser
        ref={(el)=>selectUserRef.value = el}
        v-model={queryParams.value.handleId}
        role={getRole('质检问题处理人')}
        onChange={(val: any) => userChange(val, 'handleId')}
      />
    )
  },
  {
    field: 'registerTime',
    label: '登记日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'registerTime')
    }
  },
  {
    field: 'handleTime',
    label: '处理日期',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'handleTime')
    }
  },
  {
    field: 'warehouseIssueComplete',
    label: '问题是否完成',
    component: 'Select',
    componentProps: {
      placeholder: '请选择问题是否完成',
      clearable: true,
      options: [
        { label: '已完成', value: 1 },
        { label: '未完成', value: 0 }
      ],
      onChange: (val: any) => valueChange(val, 'warehouseIssueComplete')
    }
  }
]

const getRole = (name: string) => {
  const tar: any = roleList.value.find((rs: any) => rs.name.includes(name))
  return tar?.id || ''
}

const timeChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value })
  obj[`${name}Start`] = val?.length ? val[0] : null
  obj[`${name}End`] = val?.length ? val[1] : null
  queryParams.value = { ...obj }
  onSearch()
}

const userChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value })
  console.log('name', val, name)
  obj[name] = val
  queryParams.value = { ...obj }
  onSearch()
}

const storeChange = (val: any) => {
  let obj: any = cloneDeep({ ...queryParams.value })
  obj.store = val?.length ? val[1] : ''
  queryParams.value = { ...obj }
  onSearch()
}

const valueChange = (val: any, name: string) => {
  if (queryParams.value[name] !== val) {
    queryParams.value[name] = val
    onSearch()
  }
}

const onSearch = debounce(() => getList(), 500)

const commandChange = (com: string) => (com === 'detailsView' ? handleAdd() : handlexport())

const reSetData = () => {
  timeSelectRef?.value?.resetDate()
  queryParams.value = { ...new SearchItem() }
  tabsInit()
}

const applyRouteQuery = (query: Record<string, any> = {}) => {
  const resolveString = (value: unknown): string => {
    if (Array.isArray(value)) return value[0] ?? ''
    return typeof value === 'string' ? value : ''
  }

  const update: Partial<SearchItem> = {}

  const registerBegin = resolveString(query.registerTimeBegin)
  const registerEnd = resolveString(query.registerTimeEnd)
  if (registerBegin) update.registerTimeBegin = registerBegin
  if (registerEnd) update.registerTimeEnd = registerEnd

  const selectClass = resolveString(query.selectClass)
  if (selectClass === '1' || selectClass === '2') {
    update.selectClass = selectClass
  }

  const customerName = resolveString(query.customerName)
  if(customerName)update.customerName = customerName

  const handleId = resolveString(query.handleId)
  if(handleId)update.handleId = [handleId]

  const warehouseCompleteRaw = resolveString(query.warehouseIssueComplete)
  if (warehouseCompleteRaw !== '') {
    const parsed = Number(warehouseCompleteRaw)
    if (!Number.isNaN(parsed)) {
      update.warehouseIssueComplete = parsed as SearchItem['warehouseIssueComplete']
    }
  }

  if (!Object.keys(update).length) return update

  queryParams.value = {
    ...queryParams.value,
    ...update
  }

  const formValues: Record<string, any> = {}

  if (update.registerTimeBegin || update.registerTimeEnd) {
    const begin = update.registerTimeBegin || update.registerTimeEnd
    const end = update.registerTimeEnd || update.registerTimeBegin
    formValues.registerTime = begin && end ? [begin, end] : []
  }

  if (Object.prototype.hasOwnProperty.call(update, 'warehouseIssueComplete')) {
    formValues.warehouseIssueComplete = update.warehouseIssueComplete
  }

  if (Object.prototype.hasOwnProperty.call(update, 'customerName')) {
    formValues.customerName = update.customerName
  }
  if (Object.prototype.hasOwnProperty.call(update, 'handleId')) {
    formValues.handleId = update.handleId
  }

  if (Object.keys(formValues).length) {
    nextTick(() => {
      selectUserRef.value?.focusOn()
      searchFormRef.value?.setValues(formValues)
    })
  }

  return update
}

const tabsClick = (val) => {
  queryParams.value.selectClass = val
}

const handlexport = async () => {
  const exportParams: Record<string, any> = {
    ...queryParams.value,
    qualityInspectionType: queryParams.value.qualityInspectionType.join(',')
  }
  try {
    // 发起删除
    const data = await QIProblemRegistrationApi.exportList(exportParams)
    if (data) {
      const prefileType = queryParams.value.selectClass === '1' ? '全部' : '我的'
      download.excel(data, `${prefileType}质检问题反馈汇总表.xlsx`)
    }
    message.success('导出成功')
  } catch {}
}

defineExpose({ onSearch, queryParams, tabsClick, applyRouteQuery })
</script>
<style lang="scss" scoped></style>
