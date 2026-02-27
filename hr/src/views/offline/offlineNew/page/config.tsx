import LineAvatars from '@/components/template/table/components/lineAvatars.vue'
import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import dayjs from 'dayjs'
import UserScreen from '@/components/common/user/userScreen.vue'
import LineImage from '@/components/template/table/components/lineImage.vue'
import LineTxt from '@/components/template/table/components/lineTxt.vue'
import { getDictLabel, getIntDictOptions } from '@/utils/dict'
import CategorySelect from '@/views/OA/new/components/selectCategory.vue'
import personListPopover from '@/views/OA/factory/components/personListPopover.vue'

// 查询结构
export class SearchItem {
  productName: string = ''
  productCode: string = ''
  styleChart: string = ''
  categoryCode: string = ''
  personInCharge: string = ''
  nodeCode: string = ''
}

// 表格数据结构
export class DataItem {
  baseInfoId: string = ''
  productName: string = ''
  sampleGarmentStyleNumber: string = ''
  styleChart: string = ''
  estimatedLaunchDate: string = ''
  productCode: string = ''
  certificateProductName: string = ''
  categoryCodes: string[] = []
  categoryCode: string = ''
  // category: string[] = []
  fabricComposition: string = ''
  fabricSpecification: string = ''
  fabricSupplier: string = ''
  specSizeCode: string = ''
  specSizeCodes?: string[] = []
  specName: string = ''
  processStatus: string = ''
  isSubmit: number = 0
  offlineNpSkuDetailList: any = []
  executionStandards: string = ''
  securityCategory: string = ''
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const { userInfo, allNodeList, hasTemPerm, hasAddPerm } = params

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  // 查询配置(必配)
  const scheme = computed(() => [
    { field: 'productName', label: '品名' },
    { field: 'productCode', label: '货品编码' },
    {
      field: 'categoryCode',
      label: '品类',
      isCustom: true,
      customRender: (_item) => (
        <CategorySelect v-model={_item.categoryCode} placeholder="请选择品类"></CategorySelect>
      )
    },
    {
      field: 'personInCharge',
      label: '负责人',
      isCustom: true,
      customRender: (_item) => (
        <UserScreen item={_item} id="personInCharge" name="userName"></UserScreen>
      )
    },
    {
      field: 'nodeCode',
      label: '当前节点',
      component: 'Select',
      options: allNodeList.value,
      componentProps: {
        placeholder: '请选择当前节点',
        clearable: true
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
    { fun: 'add', txt: '建档', type: 'primary', display: () => !hasAddPerm.value },
    {
      fun: 'handover',
      txt: '离职交接',
      type: 'primary',
      display: () => !hasTemPerm.value
    }
    // { fun: 'seal', txt: '数据封版', disabled: () => !userInfo.value.isHrbp },
    // { fun: 'solution', txt: '数据解封', disabled: () => !userInfo.value.isManagement },
    // { fun: 'export', txt: '导出', type: 'primary', api: `/api/employeeMonthlyAssessment/exportList`, method: 'downloadPost', exportName: '月度考核' },
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    { field: 'productName', title: '品名', minWidth: 160, fixed: 'left' },
    {
      field: 'styleChart',
      title: '款式图',
      width: 100,
      isCustom: true,
      customRender: (_item) => <LineImage urls={_item.styleChart}></LineImage>
    },
    { field: 'productCode', title: '货品编码', width: 100 },
    {
      field: 'categoryName',
      title: '品类',
      width: 180
    },
    {
      field: 'projectCreator',
      title: '建档人',
      width: 100,
      isCustom: true,
      customRender: (_item) => <LineAvatar user={_item.projectCreator}></LineAvatar>
    },
    { field: 'projectCreatorDate', title: '建档日期', width: 180 },
    {
      field: 'currentNodeName',
      title: '当前节点',
      width: 100,
      isCustom: true,
      customRender: (_item) => {
        if (_item.processStatus === '000') {
          return (
            <LineTxt
              txt={_item.currentNodeName}
              style={{ color: '#0064FF' }}
              isClick={true}
              name="OfflineNew"
              info={{ scope: _item }}
            ></LineTxt>
          )
        }
        return <span>{_item.currentNodeName}</span>
      }
    },
    {
      field: 'patternMakers',
      title: '版师',
      width: 230,
      isCustom: true,
      customRender: (_item) => (
        <LineAvatars
          users={_item.patternMakers && _item.patternMakers.length > 0 ? _item.patternMakers : [{}]}
        ></LineAvatars>
      )
    },
    {
      field: 'sampleWorkers',
      title: '样工',
      width: 230,
      isCustom: true,
      customRender: (_item) => (
        <LineAvatars
          users={_item.sampleWorkers && _item.sampleWorkers.length > 0 ? _item.sampleWorkers : [{}]}
        ></LineAvatars>
      )
    },
    {
      field: 'technicians',
      title: '工艺师',
      width: 230,
      isCustom: true,
      customRender: (_item) => (
        <LineAvatars
          users={_item.technicians && _item.technicians.length > 0 ? _item.technicians : [{}]}
        ></LineAvatars>
      )
    },
    {
      field: 'merchandisers',
      title: '跟单',
      width: 230,
      isCustom: true,
      customRender: (_item) => (
        <LineAvatars
          users={_item.merchandisers && _item.merchandisers.length > 0 ? _item.merchandisers : [{}]}
        ></LineAvatars>
      )
    }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    {
      fun: 'patternAssign',
      txt: '版师分配',
      reveal: (_item) => _item.isDisplayNodeOperate && _item.operateButtonCode === 'patternAssign'
    },
    {
      fun: 'patternConfirm',
      txt: '打版确认',
      reveal: (_item) => _item.isDisplayNodeOperate && _item.operateButtonCode === 'patternConfirm'
    },
    {
      fun: 'sampleWorkerAssign',
      txt: '样工分配',
      reveal: (_item) =>
        _item.isDisplayNodeOperate && _item.operateButtonCode === 'sampleWorkerAssign'
    },
    {
      fun: 'sampleConfirm',
      txt: '样衣确认',
      reveal: (_item) => _item.isDisplayNodeOperate && _item.operateButtonCode === 'sampleConfirm'
    },
    {
      fun: 'sampleAudit',
      txt: '样衣审核',
      reveal: (_item) => _item.isDisplayNodeOperate && _item.operateButtonCode === 'sampleAudit'
    },
    {
      fun: 'colorSampleConfirm',
      txt: '齐色样确认',
      reveal: (_item) =>
        _item.isDisplayNodeOperate && _item.operateButtonCode === 'colorSampleConfirm'
    },
    {
      fun: 'techPackage',
      txt: '工艺包上传',
      reveal: (_item) => _item.isDisplayNodeOperate && _item.operateButtonCode === 'techPackage'
    },
    {
      fun: 'merchandiserAssign',
      txt: '跟单分配',
      reveal: (_item) =>
        _item.isDisplayNodeOperate && _item.operateButtonCode === 'merchandiserAssign'
    },
    {
      fun: 'priceQuote',
      txt: '报价核价',
      reveal: (_item) => _item.isDisplayNodeOperate && _item.operateButtonCode === 'priceQuote'
    },
    {
      fun: 'preProductionConfirm',
      txt: '产前样确认',
      reveal: (_item) =>
        _item.isDisplayNodeOperate && _item.operateButtonCode === 'preProductionConfirm'
    },
    {
      fun: 'firstEightConfirm',
      txt: '首八件确认',
      reveal: (_item) =>
        _item.isDisplayNodeOperate && _item.operateButtonCode === 'firstEightConfirm'
    },
    {
      fun: 'terminate',
      txt: '流程结束',
      reveal: (_item) => !!_item.isDisplayTerminate
    },
    { fun: 'info', txt: '资料信息', reveal: (_item) => !!_item.isDisplayDataInformation },
    {
      fun: 'edit',
      txt: '编辑',
      reveal: (_item) => !!_item.isDisplayEdit
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
