import { PageItem } from '@/components/template/config/type'
import dayjs from 'dayjs'
// 组类型枚举
export enum GroupType {
  GC = 'gc', // 挂车组
  ZN = 'zn',
  QC = 'qc' // 千川组
}

// 查询结构
export class SearchItem {
  groupId: string = '' // 所属分组
  month: string = dayjs().format('YYYY-MM')
}

// 挂车组数据结构
export class GcDataItem {
  id?: string = '' // ID
  group: string = '' // 所属分组
  gmvRangeStart: number = 0 // 单条GMV起始值
  gmvRangeEnd: number = 0 // 单条GMV结束值
  bonus: number = 0 // 奖金（元）
  editor: number = 0 // 剪辑（%）
  director: number = 0 // 编导（%）
}

// 千川组数据结构
export class QcDataItem {
  id?: string = '' // ID
  group: string = '' // 所属分组
  projectName: string = '' // 所属项目
  consumptionTotal: number = 0 // 消耗总量（元）
  consumptionPoint: number = 0 // 消耗提点（%）
  roiCoefficient: number = 0 // roi系数
  totalBonusPackage: number = 0 // 总奖金包（元）
  consumptionRangeStart: number = 0 // 单条消耗起始值
  consumptionRangeEnd: number = 0 // 单条消耗结束值
  score: number = 0 // 对应分数（分）
  editor: number = 0 // 剪辑（%）
  director: number = 0 // 编导（%）
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const { activeTab, groupOptions } = params

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const gcDataList = ref<Array<GcDataItem>>([]) // 挂车组数据
  const qcDataList = ref<Array<QcDataItem>>([]) // 千川组数据
  const stateInfo = ref<any>({})
  const statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() })
  const loading = ref<boolean>(false)
  const page = ref<PageItem>({ ...new PageItem() })

  // 当前激活的数据列表
  const dataList = computed(() => {
    return activeTab.value === GroupType.GC || activeTab.value === GroupType.ZN
      ? gcDataList.value
      : qcDataList.value
  })
  console.log(groupOptions.value)
  // 查询配置(必配) - 根据activeTab动态配置
  const scheme = computed(() => {
    // 挂车组和千川组的搜索条件相同
    return [
      // {
      //   field: 'groupId',
      //   label: '所属分组',
      //   component: 'Select',
      //   options: groupOptions.value,
      //   componentProps: {
      //     clearable: true,
      //     placeholder: '请选择所属分组'
      //   }
      // },
      {
        field: 'month',
        label: '月份',
        component: 'DatePicker',
        labelWidth: 40,
        componentProps: {
          type: 'month',
          valueFormat: 'YYYY-MM',
          format: 'YYYY-MM',
          clearable: false,
          editable: false
        }
      }
    ]
  })

  // 状态筛选(非必配)
  const screen = computed(() => ({}))

  // 操作配置(非必配) - 根据activeTab动态配置
  const btns = computed(() => [{ fun: 'add', txt: '新增', type: 'primary' }])

  // 挂车组表格配置
  const gcColumn = computed(() => [
    {
      field: 'month',
      title: '月份',
      fixed: 'left',
      minWidth: 120
    },
    {
      field: 'groupName',
      title: '所属分组',
      fixed: 'left',
      minWidth: 150
    },
    {
      field: 'gmv',
      title: '单条GMV（元）',
      minWidth: 180
    },
    {
      field: 'bonus',
      title: '奖金（元）',
      minWidth: 120
    },
    {
      field: 'editorProportion',
      title: '剪辑（%）',
      minWidth: 120
    },
    {
      field: 'directorProportion',
      title: '编导（%）',
      minWidth: 120
    }
  ])

  // 千川组表格配置
  const qcColumn = computed(() => [
    {
      field: 'month',
      title: '月份',
      fixed: 'left',
      minWidth: 120
    },
    {
      field: 'groupName',
      title: '所属分组',
      fixed: 'left',
      minWidth: 150
    },
    {
      field: 'owningProject',
      title: '所属项目',
      fixed: 'left',
      minWidth: 150
    },
    {
      field: 'expenditureTotal',
      title: '消耗总量（元）',
      minWidth: 180
    },
    {
      field: 'expenditurePoint',
      title: '消耗提点（%）',
      minWidth: 180
    },
    {
      field: 'roiCoefficient',
      title: 'roi系数',
      minWidth: 180
    },
    {
      field: 'clipFirstPlaceRatio',
      title: '剪辑第一名比例（%）',
      minWidth: 180
    },
    {
      field: 'clipSecondPlaceRatio',
      title: '剪辑第二名比例（%）',
      minWidth: 180
    },
    {
      field: 'clipThirdPlaceRatio',
      title: '剪辑第三名比例（%）',
      minWidth: 180
    },
    {
      field: 'bonusTotal',
      title: '总奖金包（元）',
      minWidth: 180
    },
    {
      field: 'expenditureSingle',
      title: '单条消耗（元）',
      minWidth: 180
    },
    {
      field: 'score',
      title: '对应分数（分）',
      minWidth: 180
    },
    {
      field: 'editorProportion',
      title: '剪辑（%）',
      minWidth: 120
    },
    {
      field: 'directorProportion',
      title: '编导（%）',
      minWidth: 120
    }
  ])

  // 动态列配置
  const column = computed(() => {
    return activeTab.value === GroupType.GC || activeTab.value === GroupType.ZN
      ? gcColumn.value
      : qcColumn.value
  })

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    {
      fun: 'edit',
      txt: '编辑'
    }
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
    gcDataList,
    qcDataList,
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
