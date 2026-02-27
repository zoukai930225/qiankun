import { PageItem, Screen } from '@/components/template/config/type'

// 查询结构
export class SearchItem {
  configId: string | number = ''
  rangeValue: number | null = null
}

// 表格数据结构
export class DataItem {
  id: string | number = ''
  initialValue: number | string = 0
  endValue: number | string = 0
  rangeLabel: string = ''
  sampleSize: number | string = 0
  onePointFiveAc: number | string = 0
  onePointFiveRe: number | string = 0
  twoPointFiveAc: number | string = 0
  twoPointFiveRe: number | string = 0
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

  const planOptions = ref<Array<any>>([])

  // 查询配置(必配)
  const scheme = computed(() => [
    {
      field: 'rangeValue',
      label: '批量范围',
      component: 'InputNumber',
      componentProps: {
        controls: false,
        min: 0,
        step: 1,
        stepStrictly: true,
        precision: 0,
        placeholder: '请输入批量范围',
        max: 10000000
      }
    }
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({ ...new Screen() }))

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => [
    { fun: 'add', txt: '新增', type: 'primary', display: () => !userInfo?.value?.isAdd }
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    { field: 'rangeLabel', title: '批量范围', minWidth: 160 },
    { field: 'sampleSize', title: '样本量', width: 100 },
    {
      field: 'onePointFiveAc', title: '1.5', width: 200, align: 'center', children: [
        { field: 'onePointFiveAc', title: 'AC', width: 100 },
        { field: 'onePointFiveRe', title: 'RE', width: 100 },
      ]
    },
    {
      field: 'twoPointFiveAc', title: '2.5', width: 200, align: 'center', children: [
        { field: 'twoPointFiveAc', title: 'AC', width: 100 },
        { field: 'twoPointFiveRe', title: 'RE', width: 100 },
      ]
    }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'edit', txt: '编辑' },
    // { fun: 'delete', txt: '删除', type: 'danger' },
    {
      fun: 'del',
      txt: '删除',
      type: 'danger',
      api: '/api/spotCheckConfiguration/deleteById',
      method: 'post',
      tips: '确认删除抽查方案配置吗？'
    }
  ])

  const setRouterInfo = () => {
    let params: Record<string, any> = {}
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
    setRouterInfo,
    planOptions
  }
}
