import LineTages from '@/components/template/table/components/lineTage.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import dayjs from 'dayjs'

// 查询结构
export class SearchItem {
  productCode: string = ''
  singleDayAlert: string = ''
  sevenDayAlert: string = ''
}

// 表格数据结构
export class DataItem {
  id: string = ''
}
// 根据天数显示不同颜色
const renderWarningTag = (status: string) => {
  if (status === '否') {
    // 否：不显示背景色，直接显示文本
    return <span>否</span>
  }
  return <LineTages txt={status} background="rgba(235, 55, 55, 0.2)" color="#EB3737" />
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const { userInfo } = params

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  // 查询配置(必配)
  const scheme = computed(() => [
    { field: 'productCode', label: '商品编码', placeholder: '请输入商品编码' },
    {
      field: 'singleDayAlert',
      label: '单日预警',
      placeholder: '请选择单日预警',
      component: 'Select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    },
    {
      field: 'sevenDayAlert',
      label: '七日预警',
      placeholder: '请选择七日预警',
      component: 'Select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ]
    }
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({
    // ...new Screen({
    //   field: 'sftb',
    //   label: '填报状态:',
    //   options: [
    //     { label: '已填报', value: 1 },
    //     { label: '未填报', value: 0 }
    //   ],
    //   props: {}
    // })
  }))

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => [
    // { fun: 'board', txt: '数据看板', disabled: () => !dataList?.value?.length }
    // { fun: 'seal', txt: '数据封版', disabled: () => !userInfo.value.isHrbp },
    // { fun: 'solution', txt: '数据解封', disabled: () => !userInfo.value.isManagement },
    // { fun: 'export', txt: '导出', type: 'primary', api: `/api/employeeMonthlyAssessment/exportList`, method: 'downloadPost', exportName: '月度考核' },
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    {
      field: 'productCode',
      title: '商品编码',
      fixed: 'left'
    },
    {
      field: 'singleDayAlert',
      title: '单日预警',
      minWidth: 120,
      align: 'center',
      isCustom: true,
      customRender: (_item) => renderWarningTag(_item.singleDayAlert)
    },
    {
      field: 'sevenDayAlert',
      title: '七日预警',
      minWidth: 120,
      align: 'center',
      isCustom: true,
      customRender: (_item) => renderWarningTag(_item.sevenDayAlert)
    },
    { field: 'finishedGoodsQuantity', title: '成品仓数量', minWidth: 120 },
    { field: 'semiFinishedQuantity', title: '半成品仓数量', minWidth: 120 },
    { field: 'avgDailySales', title: '日销量', minWidth: 120 },
    { field: 'sevenDaySales', title: '七日销量', minWidth: 120 }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [])

  const setRouterInfo = () => {
    let params: Object = {}
    const param: any = route.params
    const query: any = route.query
    Object.keys(param).forEach((key) => {
      params[key] = param[key]
    })
    Object.keys(query).forEach((key) => {
      params[key] = query[key]
    })
    if (Object.keys(params).length !== 0) {
      searchData.value = { ...searchData.value, ...params }
      const newUrl = window.location.href.replace(/\?.*$/, '')
      history.replaceState({}, '', newUrl)
    }
  }

  return {
    dataList,
    searchData,
    loading,
    page,
    scheme,
    btns,
    column,
    screen,
    stateInfo,
    statistics,
    handleColumn,
    setRouterInfo
  }
}
