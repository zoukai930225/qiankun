import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import dayjs from 'dayjs'

// 查询结构
export class SearchItem {
  data: Array<any> = []
  searchKey: string = ''
}

// 表格数据结构
export class DataItem {
  commitDate: string = ''
  name: string = ''
  nameAvatar: string = ''
  problemRecord: string = ''
  isReply: boolean = false
  replyTime: string = ''
  replyContent: string = ''
  replyPerson: string = ''
  replyPersonAvatar: string = ''
}
const statusOptions = computed(() => {
  return [
    { label: '待处理', value: 0 },
    { label: '已回复', value: 1 },
    { label: '已升级', value: 2 },
    { label: '已关闭', value: 3 }
  ]
})
const statusTypeColor = (index: number) => {
  if (index === 1) {
    return {
      backgroundColor: 'rgba(52, 155, 52, 0.15)',
      color: 'rgba(52, 155, 52, 1)'
    }
  } else {
    return {
      backgroundColor: 'rgba(235, 55, 55, 0.15)',
      color: 'rgba(235, 55, 55, 1)'
    }
  }
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
    {
      field: 'data',
      label: '日期选择',
      component: 'DatePicker',
      componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD', format: 'YYYY-MM-DD' }
    },
    { field: 'searchKey', label: '姓名' }
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({
    // ...new Screen({
    //   field: 'sftb',
    //   label: '填报状态:',
    //   options: [{ label: '已填报', value: 1 }, { label: '未填报', value: 0 }],
    //   props: {}
    // })
  }))

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => [
    { fun: 'setManager', txt: '管理人员设置', type: 'primary' }
    // { fun: 'seal', txt: '数据封版', disabled: () => !userInfo.value.isHrbp },
    // { fun: 'solution', txt: '数据解封', disabled: () => !userInfo.value.isManagement },
    // { fun: 'export', txt: '导出', type: 'primary', api: `/api/employeeMonthlyAssessment/exportList`, method: 'downloadPost', exportName: '月度考核' },
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    {
      field: 'createdAt',
      title: '提交日期',
      minWidth: 120
    },
    {
      field: 'feedbackUserName',
      title: '姓名',
      width: 110,
      fixed: 'left',
      isCustom: true,
      customRender: (_item) => <LineAvatar user={{ name: _item.feedbackUserName, avatarOrigin: _item.feedbackUserAvatarOrigin }} />
    },
    {
      field: 'content',
      title: '问题记录',
      minWidth: 240
    },
    {
      field: 'isReply',
      title: '是否回复',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => (
        <span class="status-type-span" style={{ ...statusTypeColor(_item.status) }}>{statusOptions.value.find((item) => item.value === _item.status)?.label || '-'}</span>
      )
    },
    {
      field: 'replyTime',
      title: '回复时间',
      minWidth: 120
    },
    {
      field: 'replierUserName',
      title: '回复人员',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) =>
        _item.replierUserName ? (
          <LineAvatar user={{ name: _item.replierUserName, avatarOrigin: _item.replierUserAvatarOrigin }} />
        ) : (
          <span>-</span>
        )
    }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [{ fun: 'view', txt: '详情' }])

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
