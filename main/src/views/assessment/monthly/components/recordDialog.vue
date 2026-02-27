<template>
  <scheme-dialog ref="recordsRef" name="MonthAssessmentRecordDialog" :width="1000">
    <template #card>
      <div style="padding:10px 20px">
        <scheme-table
          :height="600"
          :showScreen="false"
          name="MonthAssessmentDialog"
          :column="column"
          :table-data="dataList"
        />
      </div>
    </template>
  </scheme-dialog>
</template>

<script lang="tsx">
export default { name: 'MonthAssessmentRecordDialogDetails' }
</script>

<script lang="tsx" setup>
import { cloneDeep, debounce } from 'lodash-es'
import { DataItem } from '../config/config'
import { usePage, otherOptions } from '../config/config'
import request from '@/config/axios'
import { getIntDictOptions } from '@/utils/dict'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const recordsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<DataItem>({ ...new DataItem() }),
  bukValue = ref<DataItem>({ ...new DataItem() }),
  viewType = ref<string>('view'),
  loading = ref<boolean>(false)

// const { searchData } = inject('MonthAssessmentForm')
const { dicInfo } = inject('MonthAssessmentRecordDialog')
const title = ref('月度考核列表')

const dialogVisible = ref(false),
  page = ref({
    page: 1,
    size: 10
  }),
  searchData = ref({})
const { column, dataList } = usePage({
  dicInfo: toRef(dicInfo, 'value')
})

const options = [
  { label: '能力', value: 'nl' },
  { label: '潜力', value: 'ql' },
  { label: '价值观', value: 'jzg' },
  { label: '团队中价值', value: 'tdzjz' },
  { label: '主动性', value: 'zdx' },
  { label: '概念思维', value: 'gnsw' },
  { label: '影响力', value: 'yxl' },
  { label: '成就导向', value: 'cjdx' },
  { label: '坚韧性', value: 'jrx' }
]

const getDictValue = (dict: any, label: string) => {
  const tar = dict.find((item: any) => item.label === label)
  return tar?.value
}

const query = ref({})
const getQuery = (e: any) => {
  query.value = {}
  const { name, seriesName } = e
  const key = getDictValue(options, name)
  if (key) {
    let val
    if (['zdx', 'gnsw', 'yxl', 'cjdx', 'jrx'].includes(key)) {
      val = getDictValue(otherOptions, seriesName)
    } else {
      val = getDictValue(dicInfo.value, seriesName)
    }
    query.value[key] = val ? [val] : null
  }
}

// 弹出通用
const openView = (item: any = {}, type: string = 'view', searchValue: any) => {
  searchData.value = searchValue
  recordsRef?.value?.openDialog(async () => {
    getQuery(item)
    onSearch()
  })
}

const setParamsData = (noPage: boolean = false) => {
  return noPage
    ? { ...searchData.value }
    : { ...searchData.value, page: page.value.page, pageSize: page.value.size }
}

const onSearch = () => {
  const params = { ...setParamsData(), ...query.value }
  if (params.firstDepartIds) {
    const firstDepartIds = params.firstDepartIds.map((item: any) => item[item.length - 1]).join()
    params.firstDepartIds = firstDepartIds ? firstDepartIds.split(',') : null
  }
  loading.value = true
  request
    .post({
      url: `/api/employeeMonthlyAssessment/pageList`,
      data: params
    })
    .then((res: any) => {
      dataList.value = res.records?.length ? [...res.records] : []
      page.value = { ...page.value, total: res.total }
      dialogVisible.value = true
    })
    .finally(() => {
      loading.value = false
    })
}

provide('MonthAssessmentDialogForm', {
  //   searchData,
  dataList,
  page,
  loading,
  //   stateInfo,
  //   statistics,
  //   setParamsData,
  //   resetForm,
  onSearch
  //   onButtonClick,
  //   viewDetails
})

defineExpose({ openView })

provide('MonthAssessmentRecordDialogDetails', { dataValue, bukValue, viewType, title })
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 10px 0 0 0 !important;
}
</style>
