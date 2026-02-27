import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import SelectUser from '@/components/common/user/selectUser.vue'
// import StoreSelect from '@/components/common/store/storeSelect.vue'
import StoreTreeCascader from '@/components/StoreTreeCascader/src/StoreTreeCascader.vue'
import GoodCode from '@/components/template/query/components/goodCode.vue'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import lineTage from '@/components/template/table/components/lineTage.vue'
import UserSelect from '../components/UserSelect.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import dayjs from 'dayjs'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { getImageUrl } from '@/utils'
import LineTage from '@/components/template/table/components/lineTage.vue'

// 查询结构
export class SearchItem {
  createdIds?: string[] = [] // 申请人列表
  createdId: string = '' // 申请人
  stores: string = ''
  store: string = '' // 店铺
  sampleItemCodeList?: Array<any> = [] // 样品款号
  sampleItemCode: string = ''
  applyPurposeList?: Array<any> = [] // 申请用途 （关联字典apply_purpose）
  applyPurpose: string = ''
  searchKey: string = '' //原始单号
  statusList?: Array<any> = [] //1.上级审核、2.样品管理员审核、3.审核通过、4.审核拒绝
  status: string = ''
  createdTime?: string[] = []
  createdTimeBegin: string = ''
  createdTimeEnd: string = ''
  applyUserOneDepIds?: string[] = []
  applyUserOneDepId: string = ''
}

// 表格数据结构
export class DataItem {
  id: string = ''
  applyUserName: string = '' // 申请人
  applyUserAvatarOrigin: string = ''
  applyDate: string = ''
  departmentName: string = ''
  store: string = '' // 店铺
  storeName: string = ''
  sampleItemCode: string = '' // 样品款号
  applyPurpose: string = '' // 申请用途 （关联字典apply_purpose）
  applyPurposeValue: string = ''
  searchKey: string = '' //原始单号
  status: string = '' //1.上级审核、2.样品管理员审核、3.审核通过、4.审核拒绝
  createdTimeBegin: string = ''
  createdTimeEnd: string = ''
  pca: string = ''
  mailingAddress: string = ''
  expressCompany: string = ''
  expressCompanyValue: string = ''
  remark: string = ''
  originalOrderNumber: string = ''
  trackingNo: string = ''
  approvalRecordList?: Array<any>
  dueDate?: string = ''
  isDueText?: string = ''
  filePaths?: string = ''
  isBeenReturn: number | null = null
  orderDetails?: Array<any>
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const { userInfo,deptList } = params

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem(),size:30 })

  const statusOptions = [
    { label: '上级审核', value: 1 },
    { label: '样品管理员审核', value: 2 },
    { label: '审核通过', value: 3 },
    { label: '审核拒绝', value: 4 }
  ]
  const purposeOptions = getIntDictOptions(DICT_TYPE.APPLY_PURPOSE, true)
  const customList = [
    {
      id: 'SecretWorld',
      name: 'SW',
      children: [
        {
          parentId: 'SecretWorld',
          name: 'SW-商务寄样',
          id: 'sw-swjy'
        }
      ]
    }
  ]

  // 查询配置(必配)
  const scheme = computed(() => [
    {
      field: 'createdId',
      label: '申请人',
      isCustom: true,
      customRender: (_item) => <UserSelect v-model={searchData.value.createdIds}></UserSelect>
    },
    {
      field:'applyUserOneDepIds',
      label:['所属一级','部门'],
      component:'Select',
      options:deptList.value,
      componentProps:{
        clearable:true,
        multiple:true,
        placeholder:'请选择所属一级部门'
      }

    },
    {
      field: 'createdTime',
      label: '申请日期',
      component: 'DatePicker',
      width: 210,
      componentProps: {
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD'
      }
    },
    {
      field: 'store',
      label: '店铺',
      isCustom: true,
      customRender: (_item, _model) => (
        <StoreTreeCascader v-model={searchData.value.store} customList={customList} />
      )
    },
    {
      field: 'sampleItemCode',
      label: '样品款号',
      isCustom: true,
      customRender: (_item, _model) => (
        <GoodCode
          url={'/api/wdtSpec/listSpecNo'}
          v-model={searchData.value.sampleItemCodeList}
          multiple
        />
      )
    },
    {
      field: 'applyPurposeList',
      label: '申请用途',
      component: 'Select',
      options: purposeOptions,
      componentProps: {
        placeholder: '请选择申请用途',
        collapseTags: true,
        collapseTagsTooltip: true,
        multiple: true,
        clearable: true
      }
    },
    {
      field: 'searchKey',
      label: '原始单号'
    },
    {
      field: 'statusList',
      label: '状态',
      component: 'Select',
      options: statusOptions,
      componentProps: {
        placeholder: '请选择状态',
        collapseTags: true,
        collapseTagsTooltip: true,
        multiple: true,
        clearable: true
      }
    },
    {
      field: 'isDueText',
      label: ['是否需要','归还'],
      componentProps:{
        placeholder:'请输入',
        clearable: true
      }
      
    },
  ])

  const timeChange = (val: any, name: string) => {
    let obj: any = { ...searchData.value }
    obj[`${name}Begin`] = val?.length ? val[0] : null
    obj[`${name}End`] = val?.length ? val[1] : null
    searchData.value = { ...obj }
  }

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
    {
      fun: 'export',
      txt: '导出',
      type: 'primary',
      api: `/api/warehouseSampleAdjustApply/export`,
      method: 'downloadPost',
      exportName: '仓库调样申请记录'
    }
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    {
      field: 'name',
      title: '申请人',
      isCustom: true,
      customRender: (_item) => (
        <LineAvatar
          user={{ name: _item.applyUserName, avatarOrigin: _item.applyUserAvatarOrigin }}
        />
      )
    },
    { field:'departmentName',title:'所属一级部门', minWidth: 110 },
    { field: 'applyDate', title: '申请日期', minWidth: 110 },
    {
      field: 'storeName',
      title: '店铺',
      minWidth: 220,
      isCustom: true,
      customRender: (_item) => {
        return (
          <div class="row-center">
            <img
              v-if="row.platFormId && getImageUrl(row.platFormId)"
              style="width: 14px; height: 14px; margin-right: 8px"
              src={getImageUrl(_item.storeChannel)}
              alt=""
            />
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
              {_item.storeName}
            </div>
          </div>
        )
      }
    },
    { field: 'sampleItemCode', title: '样品款号', minWidth: 220 },
    { field: 'applyPurposeValue', title: '申请用途', minWidth: 140 },
    { field: 'dueDate', title: '归还日期', minWidth: 140 },
    { field: 'pca', title: '邮寄省市区', minWidth: 280 },
    { field: 'mailingAddress', title: '邮寄信息', minWidth: 220 },
    { field: 'expressCompanyValue', title: '快递公司', minWidth: 220 },
    { field: 'remark', title: '备注', minWidth: 220 },
    { field: 'originalOrderNumber', title: '原始单号', minWidth: 220 },
    { field: 'trackingNo', title: '快递单号', minWidth: 220 },
    { field: 'isDueText', title: '是否需要归还', minWidth: 220 },
    { field: 'isBeenReturn', title: '是否已经归还', minWidth: 220,isFormatter: true, formatter: (_item) =>_item.isBeenReturn === null ? '-': Number(_item.isBeenReturn) === 1 ? '是':'否'  },
    {
      field: 'statusName',
      title: '状态',
      fixed: 'right',
      minWidth: 130,
      isCustom: true,
      customRender: (_item) => (
        <LineTage
          txt={getStatus(_item.statusName).txt}
          color={getStatus(_item.statusName).color}
          background={getStatus(_item.statusName).background}
        />
      )
    }
  ])

  const getStatus = (statusName: string) => {
    const txt = statusName
    switch (statusName) {
      case '上级审核':
        return {
          color: '#F37844',
          background: 'rgba(228, 54, 54, 0.1)',
          txt
        }
      case '样品管理员审核':
        return {
          color: '#F37844',
          background: 'rgba(228, 54, 54, 0.1)',
          txt
        }
      case '审核通过':
        return {
          color: '#5DB300',
          background: 'rgba(93, 179, 0, 0.1)',
          txt
        }
      case '审核拒绝':
        return {
          color: '#E43636',
          background: 'rgba(228, 54, 54, 0.1)',
          txt
        }
      default:
        return {}
    }
  }

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'view', txt: '详情' },
    { fun:'skuDetails',txt:'订单明细' }
    // { fun: 'edit', txt: '编辑', reveal: (_item) => !!userInfo?.value?.isManagement ? true : (!_item.isStop && !!_item?.isSubordinate) },
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
