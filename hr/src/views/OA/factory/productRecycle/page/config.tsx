import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import UserScreen from '@/components/common/user/userScreen.vue'
import dayjs from 'dayjs'

// 查询结构
export class SearchItem {
  // khzq: string = dayjs().add(-1, 'month').format('YYYY-MM')
  productCode: string = ''
  series: string = ''
  categoryName: string = ''
  recycleNode: string = ''
  recycleReason: string = ''
  recycleUserName: string = ''
  recycleUserId: string = ''
  recycleTime: string[] = []
}

// 表格数据结构
export class DataItem {
  id: string = ''
  productCode: string = ''
  series: string = ''
  categoryName: string = ''
  recycleNodes: string = ''
  recycleReason: string = ''
  recycleUserId: string = ''
  recycleTime: string[] = []
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const { permissions, dicInfo, resonDict, getDictLabels } = params

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  // 查询配置(必配)
  const scheme = computed(() => [
    { field: 'productCode', label: '货品编码' },
    { field: 'series', label: '系列' },
    { field: 'categoryName', label: '品类' },
    {
      field: 'supplierName',
      label: ['供应商名', '称'],
      componentProps: { placeholder: '请输入供应商名称' }
    },
    {
      field: 'recycleNode',
      label: ['回收时', '所在节点'],
      component: 'Select',
      options: dicInfo,
      componentProps: { clearable: true, placeholder: '请选择回收时所在节点' }
    },
    {
      field: 'recycleReason',
      label: '回收原因',
      component: 'Select',
      options: resonDict,
      componentProps: {
        clearable: true,
        placeholder: '请选择回收原因',
        multiple: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    },
    { field: 'remark', label: '备注' },
    {
      field: 'recycleUserId',
      label: '回收人',
      isCustom: true,
      customRender: (_item: any) => (
        <UserScreen name={'recycleUserName'} id={'recycleUserId'} item={_item}></UserScreen>
      )
    },
    {
      field: 'recycleTime',
      label: '回收时间',
      component: 'DatePicker',
      componentProps: {
        style: { width: '210px' },
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        clearable: true,
        editable: false
      }
    }
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
    // { fun: 'board', txt: '数据看板', disabled: () => !dataList?.value?.length },
    // { fun: 'seal', txt: '数据封版', disabled: () => !userInfo.value.isHrbp },
    // { fun: 'solution', txt: '数据解封', disabled: () => !userInfo.value.isManagement },
    // { fun: 'export', txt: '导出', type: 'primary', api: `/api/employeeMonthlyAssessment/exportList`, method: 'downloadPost', exportName: '月度考核' },
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    {
      field: 'productCode',
      title: '货品编码',
      width: 110
    },
    { field: 'series', title: '系列', width: 120 },
    { field: 'categoryName', title: '品类', width: 120 },
    { field: 'supplierName', title: '供应商名称', width: 180 },
    { field: 'recycleNodesDisplay', title: '回收时所在节点', width: 200 },
    {
      field: 'recycleReason',
      title: '回收原因',
      minWidth: 200,
      isFormatter: true,
      formatter: (_item) => getDictLabels(resonDict, _item.recycleReason)
    },
    { field: 'remark', title: '备注', minWidth: 300 },
    {
      field: 'recycleUserName',
      title: '回收人',
      width: 120,
      isCustom: true,
      customRender: (_item) => (
        <LineAvatar user={{ name: _item.recycleUserName, avatarOrigin: _item.recycleUserAvatar }} />
      )
    },
    { field: 'recycleTime', title: '回收时间', width: 180 }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'view', txt: '查看详情', reveal: (_item) => _item.showDetailBtn },
    {
      fun: 'recover',
      txt: '重新恢复',
      reveal: (_item) => permissions.includes('oa:factoryProductRecycle:recover')
    },
    {
      fun: 'delete',
      txt: '删除',
      type: 'danger',
      reveal: (_item) => permissions.includes('oa:factoryProductRecycle:delete')
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
