import LineTages from '@/components/template/table/components/lineTage.vue'
import { PageItem } from '@/components/template/config/type'

// 查询结构
export class SearchItem {
  merchantCode: string = '' // 商家编码
  frequency: number | string = 'all' // 动销频率
  isTuning: number | string = 'all' // 是否
}

// 表格数据结构
export class DataItem {
  id: string = ''
  merchantCode: string = '' // 商家编码
  rank: number | null = null // 日销排名
  avgDailySales: number | null = null // 均日销量
  sevenDaySales: number | null = null // 7日销量
  fourthFloorInventory: number | null = null // 4楼存存
  optimizeFor2Days: string = '' // 2日动销状态
  optimizeFor5Days: string = '' // 5日动销状态
  optimizeFor7Days: string = '' // 7日动销状态
  optimizeFor10Days: string = '' // 10日动销状态
}

// 通用入参
export const usePage = (_params: any = {}) => {
  const route = useRoute()

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  // 查询配置(必配)
  const scheme = computed(() => [
    { field: 'merchantCode', label: '商家编码', placeholder: '请输入' },
    {
      field: 'frequency',
      label: '动销频率',
      component: 'Select',
      options: [
        { label: '全部', value: 'all' },
        { label: '2日', value: 2 },
        { label: '5日', value: 5 },
        { label: '7日', value: 7 },
        { label: '10日', value: 10 }
      ],
      componentProps: {
        clearable: false,
        placeholder: '请选择'
      }
    },
    {
      field: 'isTuning',
      label: '是否',
      component: 'Select',
      options: [
        { label: '全部', value: 'all' },
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      componentProps: {
        clearable: false,
        placeholder: '请选择'
      }
    }
  ])

  // 状态筛选(非必配) - 本页面无需状态筛选
  const screen = computed(() => ({}))

  // 动销状态渲染函数 - 根据天数显示不同颜色
  const renderStatusTag = (status: string, days: number) => {
    if (status === '否') {
      // 否：不显示背景色，直接显示文本
      return <span>否</span>
    }

    // 是：根据天数显示不同颜色
    const colorMap = {
      2: { background: 'rgba(235, 55, 55, 0.2)', color: '#EB3737' }, // 红色
      5: { background: 'rgba(219, 106, 15, 0.2)', color: '#DB6A0F' }, // 橙色
      7: { background: 'rgba(255, 244, 200, 1)', color: '#CD8200' }, // 黄色
      10: { background: 'rgba(52, 155, 52, 0.2)', color: '#349B34' } // 绿色
    }
    const config = colorMap[days] || { background: '#409eff', color: '#fff' }
    return <LineTages txt={status} background={config.background} color={config.color} />
  }

  // 操作配置(非必配)
  const btns = computed(() => [
    // {
    //   fun: 'refresh',
    //   txt: '刷新',
    //   type: 'primary'
    // },
    {
      fun: 'export',
      txt: '导出',
      type: 'primary',
      api: `/api/stageBacklog/exportWarning`,
      inputMethod: 'params',
      method: 'download',
      exportName: `库存调优`
    }
  ])

  // 表格配置(必配)
  const column = computed(() => {
    const baseColumn: any[] = [
      { field: 'merchantCode', title: '商家编码', minWidth: 120, fixed: 'left' },
      { field: 'rank', title: '日销排名', minWidth: 90 },
      { field: 'avgDailySales', title: '均日销量', minWidth: 100 },
      { field: 'sevenDaySales', title: '7日销量', minWidth: 100 },
      { field: 'fourthFloorInventory', title: '4楼库存', minWidth: 100 }
    ]
    if (['all', 2].includes(searchData.value.frequency)) {
      baseColumn.push({
        field: 'optimizeFor2Days',
        title: '2日动销状态',
        minWidth: 115,
        align: 'center',
        isCustom: true,
        customRender: (_item) => renderStatusTag(_item.optimizeFor2Days, 2)
      })
    }
    if (['all', 5].includes(searchData.value.frequency)) {
      baseColumn.push({
        field: 'optimizeFor5Days',
        title: '5日动销状态',
        minWidth: 115,
        align: 'center',
        isCustom: true,
        customRender: (_item) => renderStatusTag(_item.optimizeFor5Days, 5)
      })
    }
    if (['all', 7].includes(searchData.value.frequency)) {
      baseColumn.push({
        field: 'optimizeFor7Days',
        title: '7日动销状态',
        minWidth: 115,
        align: 'center',
        isCustom: true,
        customRender: (_item) => renderStatusTag(_item.optimizeFor7Days, 7)
      })
    }
    if (['all', 10].includes(searchData.value.frequency)) {
      baseColumn.push({
        field: 'optimizeFor10Days',
        title: '10日动销状态',
        minWidth: 115,
        align: 'center',
        isCustom: true,
        customRender: (_item) => renderStatusTag(_item.optimizeFor10Days, 10)
      })
    }
    return baseColumn
  })

  // 表格操作行(非必配) - 本页面无操作列
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
