import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import dayjs from 'dayjs'
import { getIntDictOptions, DICT_TYPE, getDictLabel } from '@/utils/dict'
import GoodCode from '@/components/template/query/components/goodCode.vue'
import SelectUser from '@/components/common/user/selectUser.vue'
import { hasPermissionsJs } from '@/utils/index'
import LineImage from '@/components/template/table/components/lineImage.vue'
import LineVideo from '@/components/template/table/components/lineVideo.vue'
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
import { tabsOptions, urlValue } from '../../components/utils'
// 查询结构
export class SearchItem {
  warehouse: Array<any> = []
  orderNo: string = ''
  issueType: Array<any> = []
  sendLessProductCode: string = ''
  productCode: string = ''
  logisticsOrderNo: string = ''
  registrar: Array<any> = []
  registrarName: string = ''
  handler: any
  warehouseIssueExistence: string = ''
  isHandle: string = ''
  registrationTime: Array<any> = []
  isPay: string = ''
  rejectOrderNumber: string = ''
}

// 表格数据结构
export class DataItem {
  typeValue: string = ''
  warehouse: string = ''
  rejectOrderNumber: string = ''
  orderNo: string = ''
  issueType: string = ''
  logisticsOrderNo: string = ''
  wrongContent: string = ''
  isPay: number = 0
  returnLogisticsOrderNo: string = ''
  financialLoss: string = ''
  courierWeight: number = 0
  productCode: string = ''
  productCodeList?: Array<string> = []
  sendLessProductCode: string = ''
  sendLessProductCodeList?: Array<string> = []
  quantity: number = 1
  financialLossAmount: number = 0
  productValue: number = 0
  handler: string = ''
  warningTime: Array<any> = []
  returnAddress: string = ''
  csRemark: string = ''
  warehouseIssueExistence: number | null = null
  formIsHandle: string = ''
  warehouseOrderNo: string = ''
  whRemark: string = ''
  id: string = ''
  type: string = ''
  isHandle: number = 0
  imagesUrls: string = ''
  certificateUrls: string = ''
  shippingVideoUrls: string = ''
  whImageUrls: string = ''
  logisticsCompany: string = ''
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const { userInfo, tabValue, roles, getRole, grabChecks } = params
  let feedBackOptions: any = ref<any>([])
  const isAdd = computed(() => {
    if (tabValue.value === '3') {
      return roles.value.includes('客服仓库') && !roles.value.includes('退货退款换货处理人')
    } else {
      return roles.value.includes('客服仓库')
    }
  })

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  // 查询配置(必配)
  const scheme = computed(() => {
    const warehouse = {
      field: 'warehouse',
      label: '所属仓库',
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.CS_WAREHOUSE_DOCKING_WAREHOUSE, true),
      componentProps: {
        multiple: true,
        clearable: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }
    const orderNo = {
      field: 'orderNo',
      label: '订单编号'
    }
    const issueType = {
      field: 'issueType',
      label: '问题类型',
      component: 'Select',
      options: getIntDictOptions(
        DICT_TYPE[
          tabValue.value === '1'
            ? 'CS_WAREHOUSE_DOCKING_ISSUE_TYPE'
            : 'CS_WAREHOUSE_DOCKING_REFUND_ISSUE_TYPE'
        ],
        true
      ),
      componentProps: {
        multiple: true,
        clearable: true,
        collapseTags: true,
        collapseTagsTooltip: true
      }
    }
    const productCode = {
      field: tabValue.value === '4' ? 'sendLessProductCode' : 'productCode',
      label: tabValue.value === '4' ? ['顾客收到', '产品编码'] : '产品编码',
      isCustom: true,
      customRender: (_item, _model) => (
        <GoodCode
          url={'/api/wdtSpec/listSpecNo'}
          v-model={searchData.value[tabValue.value === '4' ? 'sendLessProductCode' : 'productCode']}
          placeholder={`请选择${`${tabValue.value === '4' ? '顾客收到' : ''}产品编码`}`}
        />
      )
    }
    const logisticsOrderNo = {
      field: 'logisticsOrderNo',
      label: '物流单号'
    }
    // const registrar = {
    //   field: 'registrar',
    //   label: '登记人',
    //   isCustom: true,
    //   customRender: (_item, _model) => (
    //     <SelectUser
    //       v-model={searchData.value.registrar}
    //       role={getRole('客服仓库')}
    //       feedBackOptions={feedBackOptions.value}
    //       autoLoadOnInit={true}
    //     />
    //   )
    // }
    const registrar = {
      field: 'registrarName',
      label: '登记人'
    }
    const handler = {
      field: 'handler',
      label: '处理人'
    }
    const handlerNew = {
      field: 'handler',
      label: '处理人',
      isCustom: true,
      customRender: (_item, _model) => (
        <SelectUser v-model={searchData.value.handler} role={getRole('退货退款换货处理人')} />
      )
    }
    const warehouseIssueExistence = {
      field: 'warehouseIssueExistence',
      label: ['问题是否', '存在'],
      component: 'Select',
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '2' },
        { label: '客服填写信息需完善', value: '0' }
      ],
      componentProps: {
        clearable: true,
        placeholder: '请选择问题是否存在'
      }
    }
    const isHandle = {
      field: 'isHandle',
      label: ['问题是否', '处理'],
      component: 'Select',
      options: [
        { label: '已处理', value: 1 },
        { label: '未处理', value: 0 }
      ],
      componentProps: {
        clearable: true,
        placeholder: '请选择问题是否处理'
      }
    }
    const registrationTime = {
      field: 'registrationTime',
      label: '登记时间',
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
    }
    const isPay = {
      field: ' isPay',
      label: '转寄运费',
      component: 'Select',
      options: [
        { label: '已支付', value: 1 },
        { label: '未支付', value: 0 }
      ]
    }
    const issuedProductCode = {
      field: ' productCode',
      label: ['应发产品', '编码'],
      isCustom: true,
      customRender: (_item, _model) => (
        <GoodCode
          url={'/api/wdtSpec/listSpecNo'}
          v-model={searchData.value.productCode}
          placeholder={'请选择应发产品编码'}
        />
      )
    }
    const rejectOrderNumber = {
      field: ' rejectOrderNumber',
      label: ['驳回出库', '单号'],
      placeholder: '请输入驳回出库单号'
    }
    let arr: Array<any> = []
    switch (tabValue.value) {
      case '1':
        arr = hasPermissionsJs(['warehouseDocking:add'])
          ? [
              warehouse,
              orderNo,
              issueType,
              productCode,
              logisticsOrderNo,
              registrar,
              handler,
              registrationTime,
              warehouseIssueExistence,
              isHandle
            ]
          : [
              orderNo,
              issueType,
              productCode,
              logisticsOrderNo,
              registrar,
              handler,
              registrationTime,
              warehouseIssueExistence,
              isHandle
            ]
        break
      case '2':
        arr = hasPermissionsJs(['warehouseDocking:add'])
          ? [
              warehouse,
              orderNo,
              logisticsOrderNo,
              registrationTime,
              isPay,
              registrar,
              handler,
              isHandle
            ]
          : [orderNo, logisticsOrderNo, registrationTime, isPay, registrar, handler, isHandle]
        break
      case '3':
        arr = hasPermissionsJs(['warehouseDocking:add'])
          ? [
              warehouse,
              orderNo,
              logisticsOrderNo,
              registrationTime,
              issueType,
              registrar,
              handlerNew,
              isHandle
            ]
          : [
              orderNo,
              logisticsOrderNo,
              registrationTime,
              issueType,
              registrar,
              handlerNew,
              isHandle
            ]
        break
      case '4':
        arr = [warehouse, orderNo, issuedProductCode, productCode, registrationTime, registrar]
        break
      case '5':
        arr = [orderNo, rejectOrderNumber, registrar, registrationTime, isHandle]
        break
      default:
        break
    }
    return arr
  })

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
    { fun: 'add', txt: '新增', type: 'primary', display: () => !isAdd.value },
    {
      fun: 'export',
      txt: '导出',
      type: 'primary',
      api: `/api/${urlValue(tabValue.value as string, 'export')}/export`,
      method: 'downloadPost',
      exportName: `客服仓库对接问题汇总表-${tabsOptions(roles.value, tabValue.value as string)?.label}统计表.xlsx`
    }
  ])

  // 表格配置(非必配)
  const column = computed(() => {
    let arr: Array<any> = []
    const warehouse = {
      field: 'warehouse',
      title: '所属仓库',
      isFormatter: true,
      formatter: (row: any) =>
        getDictLabel(DICT_TYPE.CS_WAREHOUSE_DOCKING_WAREHOUSE, row.warehouse) || '-'
    }
    const orderNo = { field: 'orderNo', title: '订单编号', minWidth: 220 }
    const issueType = {
      field: 'issueType',
      title: '问题类型',
      isFormatter: true,
      formatter: (row: any) =>
        getDictLabel(
          DICT_TYPE[
            tabValue.value === '1'
              ? 'CS_WAREHOUSE_DOCKING_ISSUE_TYPE'
              : 'CS_WAREHOUSE_DOCKING_REFUND_ISSUE_TYPE'
          ],
          row.issueType
        ) || '-'
    }
    const logisticsCompany = { field: 'logisticsCompany', title: '物流公司', minWidth: 220 }
    const logisticsOrderNo = { field: 'logisticsOrderNo', title: '物流单号', minWidth: 220 }
    const courierWeight = { field: 'courierWeight', title: '快递重量(KG)', align: 'right' }
    const productCode = {
      field: 'productCode',
      title: `${tabValue.value === '4' ? '应发' : ''}产品编码`,
      minWidth: 220
    }
    const productValue = { field: 'productValue', title: '产品价值(元)', align: 'right' }
    const registrarName = {
      field: 'registrarName',
      title: '登记人',
      isCustom: true,
      customRender: (row: any) => <LineAvatar user={row.registrarObj} />
    }
    const registrationTime = { field: 'registrationTime', title: '登记时间', minWidth: 165 }
    const imagesUrls = {
      field: 'imagesUrls',
      title: '图片',
      isCustom: true,
      customRender: (row: any) => <LineImage urls={row.imagesUrls} />
    }
    const csRemark = { field: 'csRemark', title: '备注(客服)', minWidth: 200 }
    const warningTime = { field: 'warningTime', title: '预警时间', minWidth: 165 }
    const handler = { field: 'handler', title: '处理人' }
    const warehouseIssueExistence = {
      field: 'warehouseIssueExistence',
      title: '问题是否存在',
      minWidth: 160,
      isFormatter: true,
      formatter: (row: any) =>
        row.warehouseIssueExistence === 1
          ? '是'
          : row.warehouseIssueExistence === 0
            ? '客服填写信息需完善'
            : row.warehouseIssueExistence === 2
              ? '否'
              : '-'
    }
    const shippingVideoUrls = {
      field: 'shippingVideoUrls',
      title: '发货视频',
      isCustom: true,
      customRender: (row: any) => <LineVideo urls={row.shippingVideoUrls} />
    }
    const whImageUrls = {
      field: 'whImageUrls',
      title: '图片(仓库)',
      isCustom: true,
      customRender: (row: any) => <LineImage urls={row.whImageUrls} />
    }
    const whRemark = { field: 'whRemark', title: '备注(仓库)' }
    const wrongContent = { field: 'wrongContent', title: '寄错内容' }
    const isPay = {
      field: 'isPay',
      title: '是否支付转寄运费',
      minWidth: 160,
      isFormatter: true,
      formatter: (row: any) => (row.isPay === 1 ? '已支付' : row.isPay === 0 ? '未支付' : '-')
    }
    const returnAddress = { field: 'returnAddress', title: '转寄地址' }
    const returnLogisticsOrderNo = { field: 'returnLogisticsOrderNo', title: '寄回物流单号' }
    const warehouseOrderNo = { field: 'warehouseOrderNo', title: '仓库转寄单号' }
    const isHandle = {
      field: 'isHandle',
      title: '问题是否处理',
      isFormatter: true,
      formatter: (row: any) => (row.isHandle === 1 ? '已处理' : row.isHandle === 0 ? '未处理' : '-')
    }
    const sendLessProductCode = {
      field: 'sendLessProductCode',
      title: '顾客收到产品编码',
      minWidth: 220
    }
    const certificateUrls = {
      field: 'certificateUrls',
      title: '合格证图片',
      align: 'center',
      isCustom: true,
      customRender: (row: any) => <LineImage urls={row.certificateUrls} />
    }
    const quantity = { field: 'quantity', title: '件数' }
    const financialLoss = { field: 'financialLoss', title: '资损' }
    const financialLossAmount = {
      field: 'financialLossAmount',
      title: '资损金额(元)',
      align: 'right'
    }
    const rejectOrderNumber = { field: 'rejectOrderNumber', title: '驳回出库单号' }
    switch (tabValue.value) {
      case '1':
        arr = [
          warehouse,
          orderNo,
          issueType,
          logisticsCompany,
          logisticsOrderNo,
          courierWeight,
          productCode,
          productValue,
          registrarName,
          registrationTime,
          imagesUrls,
          csRemark,
          warningTime,
          handler,
          warehouseIssueExistence,
          shippingVideoUrls,
          whImageUrls,
          whRemark
        ]
        break
      case '2':
        arr = [
          warehouse,
          orderNo,
          logisticsCompany,
          logisticsOrderNo,
          wrongContent,
          imagesUrls,
          isPay,
          returnAddress,
          returnLogisticsOrderNo,
          csRemark,
          financialLoss,
          warningTime,
          registrarName,
          registrationTime,
          handler,
          warehouseOrderNo,
          whImageUrls,
          whRemark
        ]
        break
      case '3':
        arr = [
          warehouse,
          orderNo,
          logisticsCompany,
          logisticsOrderNo,
          issueType,
          imagesUrls,
          csRemark,
          warningTime,
          registrarName,
          registrationTime,
          handler,
          isHandle,
          whImageUrls,
          whRemark
        ]
        break
      case '4':
        arr = [
          warehouse,
          orderNo,
          productCode,
          sendLessProductCode,
          imagesUrls,
          certificateUrls,
          quantity,
          financialLossAmount,
          registrarName,
          registrationTime
        ]
        break
      case '5':
        arr = [
          warehouse,
          rejectOrderNumber,
          csRemark,
          registrarName,
          registrationTime,
          handler,
          isHandle,
          whImageUrls,
          whRemark
        ]
        break
      default:
        break
    }
    return arr
  })

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'view', txt: '详情' },
    {
      fun: 'edit',
      txt: '编辑',
      reveal: (_item) =>
        _item.isHandle &&
        ((grabChecks('仓处理人') && tabValue.value !== '4') ||
          (grabChecks('退货退款换货处理人') && tabValue.value === '3'))
    },
    {
      fun: 'edit',
      txt: '处理',
      reveal: (_item) =>
        !_item.isHandle &&
        ((grabChecks('仓处理人') && tabValue.value !== '4') ||
          (grabChecks('退货退款换货处理人') && tabValue.value === '3'))
    },
    {
      fun: 'editorKeFu',
      txt: '编辑',
      reveal: (_item) =>
        (grabChecks('客服仓库') || tabValue.value === '4') && _item.registrar === userStore.user.id
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
      if (key !== 'tabValue') {
        if (key === 'isHandle') {
          params[key] = Number(query[key])
        } else {
          params[key] = query[key]
        }
      } else {
        tabValue.value = query[key]
      }
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
