import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import dayjs from 'dayjs'
import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
import LineStaff from '@/components/template/table/components/lineStaff.vue'
import SupplierCount from '@/views/OA/factory/develop/components/supplierCount.vue'
import AuditDetail from '@/views/OA/factory/develop/components/auditDetail.vue'
import { ElPopover } from 'element-plus'

// 查询结构
export class SearchItem {
  productCode: string = ''
  secondaryDevReason: string = ''
  series: string = ''
  categoryName: string = ''
  patternMakerId: any[] = []
  chosenSupplierStaffId: any[] = []
  fabricDesignerId: any[] = []
  handle: string[] = []
  startTime: string = ''
  endTime: string = ''
}

// 表格数据结构
export class DataItem {
  id: string = ''
  productCode: string = ''
  secondaryDevReason: string = ''
  secondaryDevReasonName: string = ''
  remark: string = ''
  series: string = ''
  category: string = ''
  categoryName: string = ''
  patternMakerId: any[] = []
  chosenSupplierStaffId: any[] = []
  handle: string[] = []
  chosenSupplierStaffList: any[] = []
  salesForecast: string = ''
  createdUser: any = {}
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const { userInfo, patternMakerSave, grabCheck, reasonDic } = params

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
    { field: 'secondaryDevReason', label: '二开原因' },
    { field: 'series', label: '系列' },
    { field: 'categoryName', label: '品类' },
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
      field: 'fabricDesignerId',
      label: '面料师',
      isCustom: true,
      customRender: (_item) => (
        <SWSelectPeople
          isEdit={true}
          multiple={false}
          v-model={searchData.value.fabricDesignerId}
          type="operate"
          placeholder="请选择面料师"
          deptCode="NEW_PRODUCT_DEPT_DEVELOP"
          style="width: 240px !important;"
        />
      )
    },
    {
      field: 'handle',
      label: '更新时间',
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
    { fun: 'add', type: 'primary', txt: '新增', display: () => !grabCheck('二开企划负责人') }
    // { fun: 'seal', txt: '数据封版', disabled: () => !userInfo.value.isHrbp },
    // { fun: 'solution', txt: '数据解封', disabled: () => !userInfo.value.isManagement },
    // { fun: 'export', txt: '导出', type: 'primary', api: `/api/employeeMonthlyAssessment/exportList`, method: 'downloadPost', exportName: '月度考核' },
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    {
      field: 'productCode',
      title: '货品编码',
      width: 120
      // isCustom: true,
      // customRender: (_item) => <LineAvatar user={{ name: _item.name, avatarOrigin: _item.tx }} />
    },
    { field: 'secondaryDevReasonName', title: '二开原因', width: 180 },
    { field: 'remark', title: '备注', width: 180 },
    { field: 'series', title: '系列', width: 120 },
    { field: 'categoryName', title: '品类', width: 180 },
    {
      field: 'patternMakerList',
      title: '版师',
      width: 320,
      isCustom: true,
      customRender: (_item) => (
        <LineStaff
          updateByChange={true}
          key={'patternMaker' + _item.id}
          v-model={_item.patternMakerList}
          code="NEW_PRODUCT_DEPT_DEVELOP"
          onSave={(list: any) => patternMakerSave(list, _item, 'patternMaker', 'patternMakerIds')}
          disabled={!(grabCheck('二开产研主管') && _item.status === 2)}
          placeholder={_item.patternMakerList?.length ? '-' : '请选择版师'}
        />
      )
    },
    {
      field: 'chosenSupplierStaffList',
      title: '选供专员',
      width: 320,
      isCustom: true,
      customRender: (_item) => (
        <LineStaff
          updateByChange={true}
          key={'chosenSupplier' + _item.id}
          v-model={_item.chosenSupplierStaffList}
          code="NEW_PRODUCT_DEPT_SUPPLY"
          onSave={(list: any) => patternMakerSave(list, _item, 'supplyStaff', 'supplyStaffIds')}
          disabled={!(grabCheck('二开供应链主管') || grabCheck('二开企划负责人'))}
          placeholder={_item.chosenSupplierStaffList?.length ? '-' : '请选择选供专员'}
        />
      )
    },
    {
      field: 'fabricDesignerList',
      title: '面料师',
      width: 320,
      isCustom: true,
      customRender: (_item) => (
        <LineStaff
          updateByChange={true}
          key={'chosenSupplier' + _item.id}
          v-model={_item.fabricDesignerList}
          code="NEW_PRODUCT_DEPT_DEVELOP"
          onSave={(list: any) => patternMakerSave(list, _item, 'fabricDesigner', 'fabricDesignerIds')}
          disabled={!(grabCheck('二开供应链主管'))}
          placeholder={_item.fabricDesignerList?.length ? '-' : '请选择面料师'}
        />
      )
    },
    {
      field: 'updatedAt',
      title: '更新时间',
      width: 220
    },
    {
      field: 'supplierList',
      title: '供应商数',
      width: 100,
      isCustom: true,
      customRender: (_item) => (
        <ElPopover
          placement="left"
          show-arrow={false}
          width={560}
          trigger="hover"
          offset={6}
          disabled={!_item.supplierList?.length}
          v-slots={{
            reference: () => (
              <span class={[_item.supplierList?.length ? 'linkText' : '']}>
                {_item.supplierList?.length}
              </span>
            ),
            default: () => <SupplierCount list={_item.supplierList} />
          }}
        ></ElPopover>
      )
    },
    {
      field: 'createdAt',
      title: '二开发起人',
      width: 120,
      isCustom: true,
      customRender: (_item) => <LineAvatar user={_item.createdUser}></LineAvatar>
    },
    {
      field: 'createdAt',
      title: '二开发起时间',
      width: 160
    },
    {
      field: 'fsAuditHistories',
      title: '审核详情',
      width: 220,
      isCustom: true,
      customRender: (_item) => (
        <ElPopover
          width={420}
          trigger="hover"
          v-slots={{
            reference: () => (
              <span style="cursor: pointer;font-weight: 500;font-size: 14px;color: #0064ff;">
                查看
              </span>
            ),
            default: () => <AuditDetail list={_item.fsAuditHistories || []} />
          }}
        ></ElPopover>
      )
    }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'supplier', txt: '供应商信息', reveal: (_item) => _item.showSupplierInfoBtn },
    { fun: 'audit', txt: '审核', reveal: (_item) => _item.showExamBtn },
    {
      fun: 'edit',
      txt: '编辑',
      reveal: (_item) => _item.showEditBtn
    },
    {
      fun: 'delete',
      txt: '删除',
      type: 'danger',
      reveal: (_item) => _item.showDeleteBtn
    },
    {
      fun: 'progress',
      txt: '打样进度',
      reveal: (_item) => _item.showSampleProgressBtn
    },
    {
      fun: 'recycle',
      txt: '回收',
      reveal: (_item) => _item.showRecycleBtn
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
