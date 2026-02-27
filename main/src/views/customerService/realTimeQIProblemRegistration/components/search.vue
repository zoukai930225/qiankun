<template>
  <s-w-search-form
    class="rt_qi_search"
    :schema="searchSchema"
    :expand-threshold="4"
    show-expand
    expand-text="展开"
    collapse-text="收起"
    @search="onSearch"
    @reset="reSetData"
    default-expand-all
    ref="searchFormRef"
  >
    <el-dropdown @command="commandChange" v-if="isAdd">
      <el-button type="primary">新增</el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="detailsView">新增</el-dropdown-item>
          <el-dropdown-item command="exportData">导出</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button v-else type="primary" @click="exportData">导出</el-button>
  </s-w-search-form>
</template>

<script lang="tsx">
export default { name: 'RealTimeQISearch' }
</script>

<script lang="tsx" setup>
import { exportQI } from '@/api/customerService/realTImeQIProblemRegistration'
import StoreSelect from '@/components/common/store/storeSelect.vue'
import GoodCode from '@/components/template/query/components/goodCode.vue'
import { TabsProvideType, SearchItem } from './type'
import SelectUser from '@/components/common/user/selectUser.vue'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { FormSchema } from '@/types/form'
import download from '@/utils/download'
import { cloneDeep, debounce } from 'lodash-es'
import { nextTick } from 'vue'

const { permissionList, roleList, activeValue, detailsView, getDataList } = inject(
  'realtimeqi_handle'
) as TabsProvideType

const queryParams = ref<SearchItem>({ ...new SearchItem() }),
  searchFormRef = ref(),
  timeSelectRef = ref(),selectUserRef = ref()

const searchSchema: Array<FormSchema> = [
  {
    field: 'store',
    label: '店铺',
    customRender: (_item, _model) => (
      <StoreSelect placeholder="请选择" v-model={queryParams.value.store} onChange={storeChange} />
    )
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
    field: 'orderNo',
    label: '订单号',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
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
    field: 'customerId',
    label: '客户ID',
    component: 'Input',
    componentProps: {
      placeholder: '请输入',
      clearable: true,
      onChange: (val: any) => valueChange(val, 'customerId'),
      onkeydown: async (event: any) => {
        if ((event as any)?.key === 'Enter') {
          queryParams.value = {
            ...queryParams.value,
            customerId: searchFormRef.value?.formModel?.customerId
          }
          await nextTick()
          onSearch()
        }
      }
    }
  },
  {
    field: 'violatingPublicOpinion',
    label: '触犯舆情',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: getIntDictOptions(DICT_TYPE.VIOLATING_PUBLIC_OPINION),
      collapseTags: true,
      collapseTagsTooltip: true,
      multiple: true,
      clearable: true,
      onChange: (val: any) => userChange(val, 'violatingPublicOpinion')
    }
  },
  {
    field: 'inspectionTime',
    label: '质检时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'inspectionTime')
    }
  },
  {
    field: 'expectHandleTime',
    label: '期望完成时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'expectHandleTime')
    }
  },
  {
    field: 'completeTime',
    label: '完结时间',
    component: 'DatePicker',
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      onChange: (val: any) => timeChange(val, 'completeTime')
    }
  },
  {
    field: 'rootCause',
    label: '产生原因',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: getIntDictOptions(DICT_TYPE.ROOT_CAUSE),
      collapseTags: true,
      collapseTagsTooltip: true,
      multiple: true,
      clearable: true,
      onChange: (val: any) => userChange(val, 'rootCause')
    }
  },
  {
    field: ' productId',
    label: '产品编码',
    customRender: (_item, _model) => (
      <GoodCode
        url={'/api/wdtSpec/listSpecNo'}
        v-model={queryParams.value.productId}
        onChange={onSearch}
        placeholder={'请输入'}
      />
    )
  },
  {
    field: 'customerPlanTimeService',
    label: '客服当时方案',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: getIntDictOptions(DICT_TYPE.CUSTOMER_PLAN_TIME_SERVICE),
      collapseTags: true,
      collapseTagsTooltip: true,
      multiple: true,
      clearable: true,
      onChange: (val: any) => userChange(val, 'customerPlanTimeService')
    }
  },
  {
    field: 'customerTimeFeedback',
    label: '客服当时反馈',
    component: 'Select',
    componentProps: {
      placeholder: '请选择',
      options: getIntDictOptions(DICT_TYPE.CUSTOMER_TIME_FEEDBACK),
      collapseTags: true,
      collapseTagsTooltip: true,
      multiple: true,
      clearable: true,
      onChange: (val: any) => userChange(val, 'customerTimeFeedback')
    }
  },
  {
    field: 'registrationId',
    label: '登记人',
    customRender: (_item, _model) => (
      <SelectUser
        placeholder="请选择"
        v-model={queryParams.value.registrationIds}
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
        placeholder="请选择"
        v-model={queryParams.value.handleIds}
        role={getRole('质检问题处理人')}
        onChange={(val: any) => userChange(val, 'handleId')}
      />
    )
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

const isAdd = computed(() =>
  permissionList.value
    .map((ps: any) => ps.name)
    .join(',')
    .includes('质检人员')
)

const getRole = (name: string) => {
  const tar: any = roleList.value.find((rs: any) => rs.name.includes(name))
  return tar?.id || ''
}

const timeChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value })
  obj[`${name}Begin`] = val?.length ? val[0] : null
  obj[`${name}End`] = val?.length ? val[1] : null
  queryParams.value = { ...obj }
  onSearch()
}

const userChange = (val: any, name: string) => {
  let obj: any = cloneDeep({ ...queryParams.value })
  obj[name] = val?.length ? val.join(',') : ''
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

const onSearch = debounce(() => getDataList(), 500)

const commandChange = (com: string) =>
  com === 'exportData' ? exportData() : detailsView({}, 'add')

const reSetData = () => {
  timeSelectRef?.value?.resetDate()
  queryParams.value = { ...new SearchItem() }
}

const exportData = async () => {
  const loadingInstance = ElLoading.service({
    lock: true
  })
  exportQI({
    ...queryParams.value,
    selectClass: activeValue.value === 'all' ? '1' : '2'
  })
    .then((res: any) => {
      res &&
        download.excel(
          res,
          `${activeValue.value === 'all' ? '全部' : '我的'}实时质检问题反馈汇总表.xlsx`
        )
    })
    .finally(() => {
      loadingInstance.close()
    })
}

const applyRouteQuery = async (query: Record<string, any> = {}) => {
  const resolveString = (value: unknown): string => {
    if (Array.isArray(value)) return value[0] ?? ''
    return typeof value === 'string' ? value : ''
  }

  const update: Partial<SearchItem> = {}

  const inspectionBegin = resolveString(query.inspectionTimeBegin)
  const inspectionEnd = resolveString(query.inspectionTimeEnd)
  if (inspectionBegin) update.inspectionTimeBegin = inspectionBegin
  if (inspectionEnd) update.inspectionTimeEnd = inspectionEnd

  const warehouseCompleteRaw = resolveString(query.warehouseIssueComplete)
  if (warehouseCompleteRaw !== '') {
    const parsed = Number(warehouseCompleteRaw)
    if (!Number.isNaN(parsed)) {
      update.warehouseIssueComplete = parsed as SearchItem['warehouseIssueComplete']
    }
  }

  const selectClass = resolveString(query.selectClass)
  if (selectClass === '1' || selectClass === '2') {
    update.selectClass = selectClass
  }

  const customerName = resolveString(query.customerName)
  if(customerName)update.customerName = customerName

  const handleId = resolveString(query.handleId)
  if(handleId)update.handleIds = [handleId]

  if (!Object.keys(update).length) return update

  queryParams.value = {
    ...queryParams.value,
    ...update
  }

  const formValues: Record<string, any> = {}

  if (update.inspectionTimeBegin || update.inspectionTimeEnd) {
    const begin = update.inspectionTimeBegin || update.inspectionTimeEnd
    const end = update.inspectionTimeEnd || update.inspectionTimeBegin
    formValues.inspectionTime = begin && end ? [begin, end] : []
  }

  if (Object.prototype.hasOwnProperty.call(update, 'warehouseIssueComplete')) {
    formValues.warehouseIssueComplete = update.warehouseIssueComplete
  }
  if (Object.prototype.hasOwnProperty.call(update, 'customerName')) {
    formValues.customerName = update.customerName
  }
  if (Object.prototype.hasOwnProperty.call(update, 'handleIds')) {
    formValues.handleIds = update.handleIds
  }

  if (Object.keys(formValues).length) {
    await nextTick()
    selectUserRef.value?.focusOn()
    searchFormRef.value?.setValues(formValues)
  }

  return update
}

defineExpose({ onSearch, queryParams, applyRouteQuery })
</script>

<style lang="less" scoped></style>
