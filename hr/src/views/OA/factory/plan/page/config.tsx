import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
import LineStaff from '@/components/template/table/components/lineStaff.vue'
import PersonListPopover from '@/views/OA/factory/components/personListPopover.vue'
import dayjs from 'dayjs'

// 查询结构
export class SearchItem {
  supplierName: string = ''
  productCode: string = ''
  series: string = ''
  categoryName: string = ''
  purchaseUserId: any = []
  patternMakerId: any = []
  fabricDesigner: any=[]
  chosenSupplierStaffId: any = []
  fsTaskId: string = ''
  supplierId: string = ''
  currentNode: string = ''
}

// 表格数据结构
export class DataItem {
  id: string = ''
  fsTaskId: string = ''
  supplierName: string = ''
  productCode: string = ''
  series: string = ''
  patternMakers: any = []
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const { userInfo, dicInfo } = params

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
      field: 'supplierName',
      label: ['供应商名', '称'],
      componentProps: {
        clearable: true,
        placeholder: '请输入供应商名称'
      }
    },
    {
      field: 'productCode',
      label: '货品编码',
      componentProps: {
        clearable: true,
        placeholder: '请输入货品编码'
      }
    },
    {
      field: 'series',
      label: '系列',
      componentProps: {
        clearable: true,
        placeholder: '请输入系列'
      }
    },
    {
      field: 'categoryName',
      label: '品类',
      componentProps: {
        clearable: true,
        placeholder: '请输入品类'
      }
    },
    {
      field: 'purchaseUserId',
      label: '采购人员',
      isCustom: true,
      customRender: (_item) => (
        <SWSelectPeople
          isEdit={true}
          multiple={false}
          v-model={searchData.value.purchaseUserId}
          type="operate"
          placeholder="请选择选供专员"
          deptCode="NEW_DEPT_PURCHASE"
          style="width: 240px !important;"
        />
      )
    },
    {
      field: 'patternMakerId',
      label: '版师',
      isCustom: true,
      customRender: (_item) => (
        <SWSelectPeople
          isEdit={true}
          multiple={false}
          v-model={searchData.value.patternMakerId}
          type="operate"
          placeholder="请选择版师"
          deptCode="NEW_PRODUCT_DEPT_DEVELOP"
          style="width: 240px !important;"
        />
      )
    },
    {
      field: 'chosenSupplierStaffId',
      label: '选供专员',
      isCustom: true,
      customRender: (_item) => (
        <SWSelectPeople
          isEdit={true}
          multiple={false}
          v-model={searchData.value.chosenSupplierStaffId}
          type="operate"
          placeholder="请选择选供专员"
          deptCode="NEW_PRODUCT_DEPT_SUPPLY"
          style="width: 240px !important;"
        />
      )
    },
    {
      field: 'fabricDesigner',
      label: '面料师',
      isCustom: true,
      customRender: (_item) => (
        <SWSelectPeople
          isEdit={true}
          multiple={false}
          v-model={searchData.value.fabricDesigner}
          type="operate"
          placeholder="请选择面料师"
          deptCode="NEW_PRODUCT_DEPT_DEVELOP"
          style="width: 240px !important;"
        />
      )
    },
    {
      field: 'currentNode',
      label: '当前节点',
      component: 'Select',
      options: dicInfo,
      componentProps: { clearable: true, placeholder: '请选择当前节点' }
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
    // { fun: 'board', txt: '数据看板', disabled: () => !dataList?.value?.length }
    // { fun: 'seal', txt: '数据封版', disabled: () => !userInfo.value.isHrbp },
    // { fun: 'solution', txt: '数据解封', disabled: () => !userInfo.value.isManagement },
    // { fun: 'export', txt: '导出', type: 'primary', api: `/api/employeeMonthlyAssessment/exportList`, method: 'downloadPost', exportName: '月度考核' },
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    { field: 'supplierName', title: '供应商名称', minWidth: 120 },
    { field: 'productCode', title: '货品编码', minWidth: 180 },
    { field: 'series', title: '系列', minWidth: 120 },
    { field: 'categoryName', title: '品类', minWidth: 180 },
    { field: 'currentNodeName', title: '当前节点', minWidth: 180 },
    {
      field: 'patternMakers',
      title: '版师',
      width: 320,
      isCustom: true,
      customRender: (_item) => (
        <LineStaff
          key={'patternMaker' + _item.id}
          v-model={_item.patternMakers}
          code="NEW_PRODUCT_DEPT_DEVELOP"
          disabled
        />
      )
    },
    {
      field: 'supplierSpecialists',
      title: '选供专员',
      width: 320,
      isCustom: true,
      customRender: (_item) => (
        <LineStaff
          key={'patternMaker' + _item.id}
          v-model={_item.supplierSpecialists}
          code="NEW_PRODUCT_DEPT_SUPPLY"
          disabled
        />
      )
    },
    {
      field: 'fabricDesigners',
      title: '面料师',
      width: 320,
      isCustom: true,
      customRender: (_item) => (
        <LineStaff
          key={'fabricDesigner' + _item.id}
          v-model={_item.fabricDesigners}
          code="NEW_PRODUCT_DEPT_DEVELOP"
          disabled
        />
      )
    },
    {
      field: 'purchaseUsers',
      title: '采购人员',
      width: 320,
      isCustom: true,
      customRender: (_item) =>
        // <LineStaff
        //   key={'patternMaker' + _item.id}
        //   v-model={_item.supplierSpecialists}
        //   code="NEW_PRODUCT_DEPT_SUPPLY"
        //   disabled
        // />
        {
          if (!_item?.purchaseUsers?.length) {
            return <span>-</span>
          }
          return <PersonListPopover person-list={_item.purchaseUsers || []} />
        }
    }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'progress', txt: '进度维护' },
    { fun: 'recycle', txt: '回收', reveal: (_item) => _item.showRecycleBtn }
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
