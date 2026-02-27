import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import dayjs from 'dayjs'

// 查询结构
export class SearchItem {
  productCode: string = ''
  dataDate: string = dayjs().format('YYYY-MM-DD')
}

// 表格数据结构
export class DataItem {
  productCodeCombination: string = ''
  bundleCount: number = 0
  validCountRatio: number = 0
  dataDate: string = ''
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
      field: 'dataDate',
      label: '日期',
      placeholder: '请选择日期',
      component: 'DatePicker',
      componentProps: {
        type: 'date',
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        clearable: false
      }
    }
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({}))

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => [
    {
      fun: 'viewSku',
      txt: '查看SKU',
      type: 'primary'
    },
    {
      fun: 'refresh',
      txt: '刷新',
      type: 'primary'
    },
    {
      fun: 'uploadSku',
      txt: '上传SKU',
      type: 'primary'
    },
    {
      fun: 'exportAction',
      txt: '导出',
      type: 'primary'
    },
    {
      fun: 'exportDrawer',
      txt: '结果下载',
      type: 'primary'
    }
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    {
      field: 'productCodeCombination',
      title: '货品编号组合',
      minWidth: 200
    },
    { field: 'bundleCount', title: '原始搭配次数', minWidth: 200 },
    { field: 'validCountRatioStr', title: '有效次数占比', minWidth: 200 },
    { field: 'dataDate', title: '分析日期', minWidth: 200 }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    // { fun: 'view', txt: '详情' },
    // {
    //   fun: 'edit',
    //   txt: '编辑',
    //   reveal: (_item) =>
    //     !!userInfo?.value?.isManagement ? true : !_item.isStop && !!_item?.isSubordinate
    // }
  ])

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
