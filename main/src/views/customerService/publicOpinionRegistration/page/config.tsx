import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import LineImage from '@/components/template/table/components/lineImage.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import { useUserStore } from '@/store/modules/user'
import SelectUser from '@/components/common/user/selectUser.vue'
import GoodCode from '@/components/template/query/components/goodCode.vue'
import { OPINION_TYPE_OPTIONS, getImageUrl } from '../data/opinionTypes'
import { ElCascader } from 'element-plus'

// 是否选项
export const YES_NO_OPTIONS = [
  { label: '是', value: 1 },
  { label: '否', value: 0 }
]

// 查询结构
export class SearchItem {
  registrationDate: Array<string> = [] // 登记日期
  registrantIds: Array<string> = [] // 登记人
  publishPlatforms: Array<string> = [] // 发布平台
  publishType: string = '' // 发布类型
  publishDate: Array<string> = [] // 发布日期
  productCategory: Array<string> = [] // 产品类型
  productCode: Array<string> = [] // 产品编码（GoodCode组件使用单个ID）
  orderNumber: string = '' // 订单号
  opinionType: Array<string> = [] // 舆情类型
  sfReceived: string = '' // 是否领取
  sfReply: string = '' // 是否回评
  sfDeleted: string = '' // 是否删除
  disposalResult: Array<string> = [] // 处置结果
  status: Array<string> = [] // 状态
}

// 表格数据结构
export class DataItem {
  id: string = '' // ID
  riskLevel: number | string = '' // 风险程度
  registrationDate: string = '' // 登记日期
  registrantId: string = '' // 登记人ID
  registrantName: string = '' // 登记人姓名
  registrantAvatar: string = '' // 登记人头像
  publishPlatform: string = '' // 发布平台
  publishType: string = '' // 发布类型
  publishDate: string = '' // 发布日期
  productCategory: string = '' // 产品类型
  productCode: string = '' // 产品编码
  orderNumber: string = '' // 订单号（表单字段名）
  opinionTypeArr: Array<string> = [] // 舆情类型级联值（用于级联选择器）
  opinionType: string = '' // 舆情类型
  secondaryCategory: string = '' // 二级分类
  sfReceived: number | string = '' // 是否领取
  receiveTime: string = '' // 领取时间
  sfReply: number | string = '' // 是否回评
  replyTime: string = '' // 回评时间
  sfDeleted: number | string = '' // 是否删除
  deleteTime: string = '' // 删除时间
  disposalResult: string = '' // 处置结果
  status: string = '' // 状态 0-待开始 1-进行中 2-已完成

  // 新增/编辑表单专用字段
  grassInfluencer: string = '' // 种草达人（表单字段名）
  postIdNickname: string = '' // 发帖ID昵称（表单字段名）
  mainCommentIdNickname: string = '' // 主评ID昵称（表单字段名）
  followUpCustomerId: Array<string> = [] // 跟进客服id
  followUpCustomerName: Array<string> = [] // 跟进客服姓名
  followUpCustomerInfo: Array<any> = [] // 跟进客服（多选，表单字段名）
  publicOpinionPr: string = '' // 舆情公关（表单字段名）
  publicOpinionPrName: string = '' // 舆情公关姓名
  publicOpinionPrInfo: any = {} // 舆情公关（表单字段名）
  originalLink: string = '' // 原文链接
  originalContent: string = '' // 原文内容（表单字段名）
  picture: string = '' // 图片（表单字段名，逗号分隔的URL字符串）

  // 客服处理字段
  deleter: string = '' // 删除人
  deleterName: string = '' // 删除人姓名
  deleterAvatar: string = '' // 删除人头像
  deleterInfo: any = {} // 删除人信息
  finalSolution: string = '' // 最终方案
  customerServiceRemark: string = '' // 备注
  feedbackScreenshot: string = '' // 反馈截图

  // 公关处理字段
  disposalAction: string = '' // 处置动作
  prRemark: string = '' // 公关备注
  screenshot: string = '' // 公关截图
}
const opinionTypeColor = (index: number) => {
  if ([0, 1, 2, 3].includes(index)) {
    return {
      backgroundColor: 'rgba(235, 55, 55, 0.15)',
      color: 'rgba(235, 55, 55, 1)'
    }
  } else if ([4, 5].includes(index)) {
    return {
      backgroundColor: 'rgba(219, 106, 15, 0.15)',
      color: 'rgba(219, 106, 15, 1)'
    }
  } else if ([6, 7].includes(index)) {
    return {
      backgroundColor: 'rgba(0, 100, 255, 0.15)',
      color: 'rgba(0, 100, 255, 1)'
    }
  } else {
    return {
      backgroundColor: 'rgba(52, 155, 52, 0.15)',
      color: 'rgba(52, 155, 52, 1)'
    }
  }
}
const statusColor = (status: string) => {
  if (status === '01') {
    return {
      backgroundColor: 'rgba(102, 102, 102, 0.15)',
      color: 'rgba(102, 102, 102, 1)'
    }
  }

  if (status === '02') {
    return {
      backgroundColor: 'rgba(219, 106, 15, 0.15)',
      color: 'rgba(219, 106, 15, 1)'
    }
  }

  if (status === '03') {
    return {
      backgroundColor: 'rgba(52, 155, 52, 0.15)',
      color: 'rgba(52, 155, 52, 1)'
    }
  }
}
const riskLevelColor = (riskLevel: string) => {
  if (riskLevel === '9') {
    return {
      backgroundColor: 'rgba(235, 55, 55, 0.15)',
      color: 'rgba(235, 55, 55, 1)'
    }
  }
  if (riskLevel === '5') {
    return {
      backgroundColor: 'rgba(219, 106, 15, 0.15)',
      color: 'rgba(219, 106, 15, 1)'
    }
  }
  if (riskLevel === '1') {
    return {
      backgroundColor: 'rgba(52, 155, 52, 0.15)',
      color: 'rgba(52, 155, 52, 1)'
    }
  }
}
// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()
  const user: any = useUserStore().user || {}
  // 外部组件入参
  const { roleList, dictDataList, userAuth } = params
  console.log(userAuth, 'userAuth')
  const statusOptions = computed(() => dictDataList.value['pi_status'] || [])
  const getRole = (name: string) => {
    const tar: any = roleList.value.find((rs: any) => rs.name.includes(name))
    return tar?.id || ''
  }
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
      field: 'riskLevel',
      label: '风险程度',
      component: 'Select',
      options: dictDataList.value['pi_risk_level'] || [],
      componentProps: {
        clearable: true,
        placeholder: '请选择风险程度'
      }
    },
    {
      field: 'registrationDate',
      label: '登记日期',
      component: 'DatePicker',
      width: 210,
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD'
      }
    },
    {
      field: 'registrantIds',
      label: '登记人',
      isCustom: true,
      customRender: (_item) => (
        <SelectUser v-model={searchData.value.registrantIds} role={getRole('质检人员')} />
      )
    },
    {
      field: 'publishPlatforms',
      label: '发布平台',
      component: 'Select',
      options: dictDataList.value?.['pi_publishing_platform'] || [],
      componentProps: {
        clearable: true,
        multiple: true,
        placeholder: '请选择发布平台'
      }
    },
    {
      field: 'publishType',
      label: '发布类型',
      component: 'Select',
      options: dictDataList.value['pi_publishing_type'] || [],
      componentProps: {
        clearable: true,
        placeholder: '请选择发布类型'
      }
    },
    {
      field: 'publishDate',
      label: '发布日期',
      component: 'DatePicker',
      width: 210,
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD'
      }
    },
    {
      field: 'productCategory',
      label: '产品类型',
      component: 'Select',
      options: dictDataList.value['pi_product_type'] || [],
      componentProps: {
        clearable: true,
        multiple: true,
        placeholder: '请选择产品类型'
      }
    },
    {
      field: 'productCode',
      label: '产品编码',
      isCustom: true,
      customRender: (_item) => (
        <GoodCode
          url={'/api/wdtSpec/listSpecNo'}
          v-model={searchData.value.productCode}
          multiple={true}
          placeholder={'请输入产品编码'}
        />
      )
    },
    {
      field: 'orderNumber',
      label: '订单号',
      component: 'Input',
      componentProps: {
        placeholder: '请输入订单号'
      }
    },
    {
      field: 'opinionType',
      label: '舆情类型',
      isCustom: true,
      customRender: (_item) => (
        <ElCascader
          v-model={searchData.value.opinionType}
          options={OPINION_TYPE_OPTIONS}
          props={{
            label: 'label',
            value: 'value',
            children: 'children',
            multiple: true
          }}
          collapseTags={true}
          collapseTagsTooltip={true}
          separator=">"
          placeholder="请选择舆情类型"
          clearable
        />
      )
    },
    {
      field: 'sfReceived',
      label: '是否领取',
      component: 'Select',
      options: YES_NO_OPTIONS,
      componentProps: {
        clearable: true,
        placeholder: '请选择'
      }
    },
    {
      field: 'sfReply',
      label: '是否回评',
      component: 'Select',
      options: YES_NO_OPTIONS,
      componentProps: {
        clearable: true,
        placeholder: '请选择'
      }
    },
    {
      field: 'sfDeleted',
      label: '是否删除',
      component: 'Select',
      options: YES_NO_OPTIONS,
      componentProps: {
        clearable: true,
        placeholder: '请选择'
      }
    },
    {
      field: 'disposalResult',
      label: '处置结果',
      component: 'Select',
      options: dictDataList.value['pi_disposal_result'] || [],
      componentProps: {
        clearable: true,
        multiple: true,
        placeholder: '请选择处置结果'
      }
    }
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({
    ...new Screen({
      field: 'status',
      label: '状态:',
      options: statusOptions.value,
      props: {}
    })
  }))

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => [
    {
      fun: 'export',
      txt: '导出',
      api: `/api/publicOpinionInfo/export`,
      method: 'download',
      inputMethod: 'params',
      exportName: '舆情问题登记',
      type: 'primary',
      disabled: () => !dataList?.value?.length
    },
    { fun: 'add', txt: '新增', type: 'primary', display: () => !userAuth.value.isAdd },
    { fun: 'board', txt: '数据看板', type: 'primary', display: () => !userAuth.value.isBoard }
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    {
      field: 'riskLevel',
      title: '风险程度',
      minWidth: 120,
      fixed: 'left',
      isCustom: true,
      customRender: (_item) => {
        return (
          <span
            class="opinion-type-span"
            style={{
              ...riskLevelColor(_item.riskLevel)
            }}
          >
            {dictDataList.value?.['pi_risk_level']?.find(
              (item: any) => item.value === _item.riskLevel
            )?.label || '-'}
          </span>
        )
      }
    },
    {
      field: 'registerDate',
      title: '登记日期',
      minWidth: 120,
      fixed: 'left'
    },
    {
      field: 'registrant',
      title: '登记人',
      minWidth: 150,
      fixed: 'left',
      isCustom: true,
      customRender: (_item) =>
        _item.registrantName ? (
          <LineAvatar
            user={{
              name: _item.registrantName,
              avatarOrigin: _item.registrantAvatar
            }}
          />
        ) : (
          <span>-</span>
        )
    },
    {
      field: 'publishPlatform',
      title: '发布平台',
      minWidth: 140,
      isCustom: true,
      customRender: (_item) => {
        return (
          <div class="row-center">
            <img
              src={getImageUrl(_item.publishPlatform)}
              alt=""
              style={{
                width: '20px',
                height: '20px',
                marginRight: '6px'
              }}
            />
            <span style={{ whiteSpace: 'nowrap' }}>
              {dictDataList.value?.['pi_publishing_platform']?.find(
                (item: any) => item.value === _item.publishPlatform
              )?.label || '-'}
            </span>
          </div>
        )
      }
    },
    {
      field: 'publishType',
      title: '发布类型',
      minWidth: 100,
      isCustom: true,
      customRender: (_item) => {
        return (
          <span>
            {dictDataList.value?.['pi_publishing_type']?.find(
              (item: any) => item.value === _item.publishType
            )?.label || '-'}
          </span>
        )
      }
    },
    {
      field: 'publishDate',
      title: '发布日期',
      minWidth: 120
    },
    {
      field: 'productCategory',
      title: '产品类型',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => {
        return (
          <span>
            {dictDataList.value?.['pi_product_type']?.find(
              (item: any) => item.value === _item.productCategory
            )?.label || '-'}
          </span>
        )
      }
    },
    {
      field: 'productCode',
      title: '产品编码',
      minWidth: 140
    },
    {
      field: 'orderNumber',
      title: '订单号',
      minWidth: 160
    },
    {
      field: 'grassInfluencer',
      title: '种草达人',
      minWidth: 120
    },
    {
      field: 'postIdNickname',
      title: '发帖ID昵称',
      minWidth: 120
    },
    {
      field: 'mainCommentIdNickname',
      title: '主评ID昵称',
      minWidth: 120
    },
    {
      field: 'opinionType',
      title: '舆情类型',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => {
        return (
          <span
            class="opinion-type-span"
            style={{
              ...opinionTypeColor(
                OPINION_TYPE_OPTIONS.findIndex((item: any) => item.value === _item.opinionType)
              )
            }}
          >
            {_item.opinionType}
          </span>
        )
      }
    },
    {
      field: 'secondaryCategory',
      title: '二级分类',
      minWidth: 120
      // isCustom: true,
      // customRender: (_item) => {
      //   return (
      //     <span>
      //       {OPINION_TYPE_OPTIONS.find(
      //         (item: any) => item.value === _item.opinionType
      //       )?.children?.find((item: any) => item.value === _item.secondaryCategory)?.label || '-'}
      //     </span>
      //   )
      // }
    },
    {
      field: 'originalLink',
      title: '原文链接',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => {
        return (
          <el-tooltip
            effect="dark"
            placement="top"
            popper-class="original-content-tooltip"
            v-slots={{
              content: () => (
                <div
                  style={{
                    maxWidth: '400px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: '14px'
                  }}
                >
                  {_item.originalLink || '-'}
                </div>
              )
            }}
          >
            <a
              href={_item.originalLink}
              target="_blank"
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'inline-block'
              }}
            >
              {_item.originalLink || '-'}
            </a>
          </el-tooltip>
        )
      }
    },
    {
      field: 'originalContent',
      title: '原文内容',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => {
        const content = _item.originalContent || '-'
        return (
          <el-tooltip
            effect="dark"
            placement="top"
            popper-class="original-content-tooltip"
            v-slots={{
              content: () => (
                <div
                  style={{
                    maxWidth: '400px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    fontSize: '14px'
                  }}
                >
                  {content}
                </div>
              )
            }}
          >
            <div
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'pointer'
              }}
            >
              {content}
            </div>
          </el-tooltip>
        )
      }
    },
    {
      field: 'picture',
      title: '图片',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => {
        return (
          <div class="image-preview-container">
            <LineImage urls={_item.picture} width={36} height={36} />
          </div>
        )
      }
    },
    {
      field: 'followUpCustomerName',
      title: '跟进客服',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) =>
        _item.followUpCustomerName ? (
          <LineAvatar
            user={{
              name: _item.followUpCustomerName,
              avatarOrigin: _item.followUpCustomerAvatar
            }}
          />
        ) : (
          <span>-</span>
        )
    },
    {
      field: 'sfReceived',
      title: '是否领取',
      minWidth: 100,
      isFormatter: true,
      formatter: (_item) => (_item.sfReceived == '1' ? '已领取' : '未领取')
    },
    {
      field: 'receiveTime',
      title: '领取时间',
      minWidth: 160,
      isFormatter: true,
      formatter: (_item) => _item.receiveTime || '-'
    },
    {
      field: 'sfReply',
      title: '是否回评',
      minWidth: 100,
      isFormatter: true,
      formatter: (_item) => {
        if (_item.sfReply == '1') return '已回评'
        if (_item.sfReply == '0') return '未回评'
        return '-'
      }
    },
    {
      field: 'replyTime',
      title: '回评时间',
      minWidth: 160,
      isFormatter: true,
      formatter: (_item) => _item.replyTime || '-'
    },
    {
      field: 'sfDeleted',
      title: '是否删除',
      minWidth: 100,
      isFormatter: true,
      formatter: (_item) => {
        if (_item.sfDeleted == '1') return '已删除'
        if (_item.sfDeleted == '0') return '未删除'
        return '-'
      }
    },
    {
      field: 'deleteTime',
      title: '删除时间',
      minWidth: 160,
      isFormatter: true,
      formatter: (_item) => _item.deleteTime || '-'
    },
    {
      field: 'deleterName',
      title: '删除人',
      isCustom: true,
      customRender: (_item) =>
        _item.deleter ? (
          <LineAvatar
            user={{
              name: _item.deleterName,
              avatarOrigin: _item.deleterAvatar
            }}
          />
        ) : (
          <span>-</span>
        )
    },
    {
      field: 'finalSolution',
      title: '最终方案',
      minWidth: 120
    },
    {
      field: 'customerServiceRemark',
      title: '客服备注',
      minWidth: 120
    },
    {
      field: 'feedbackScreenshot',
      title: '反馈截图',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => {
        return (
          <div class="image-preview-container">
            <LineImage urls={_item.feedbackScreenshot} width={36} height={36} />
          </div>
        )
      }
    },
    {
      field: 'publicOpinionPrName',
      title: '舆情公关',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) =>
        _item.publicOpinionPrName ? (
          <LineAvatar
            user={{
              name: _item.publicOpinionPrName,
              avatarOrigin: _item.publicOpinionPrAvatar
            }}
          />
        ) : (
          <span>-</span>
        )
    },
    {
      field: 'disposalAction',
      title: '处置动作',
      minWidth: 120
    },
    {
      field: 'disposalResult',
      title: '处置结果',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => {
        return (
          <span>
            {dictDataList.value?.['pi_disposal_result']?.find(
              (item: any) => item.value === _item.disposalResult
            )?.label || '-'}
          </span>
        )
      }
    },
    {
      field: 'prRemark',
      title: '公关备注',
      minWidth: 120
    },
    {
      field: 'screenshot',
      title: '截图',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => {
        return (
          <div class="image-preview-container">
            <LineImage urls={_item.screenshot} width={36} height={36} />
          </div>
        )
      }
    },
    {
      field: 'status',
      title: '状态',
      minWidth: 100,
      fixed: 'right',
      isCustom: true,
      customRender: (_item) => {
        return (
          <span
            class="opinion-type-span"
            style={{
              ...statusColor(_item.status)
            }}
          >
            {statusOptions.value.find((item: any) => item.value === _item.status)?.label || '-'}
          </span>
        )
      }
    }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'view', txt: '详情' },
    {
      fun: 'edit',
      txt: '编辑',
      reveal: (_item) =>
        user.userNo === _item.registrant && _item.status !== '03' && userAuth.value.isEdit
    },
    {
      fun: 'receive',
      txt: '领取',
      type: 'primary',
      reveal: (_item) => {
        // 领取按钮只有未领取时显示，且当前用户为跟进客服
        return _item.sfReceived == 0 && _item.followUpCustomerIds.includes(user.userNo)
      }
    },
    {
      fun: 'serviceHandle',
      txt: '处理',
      type: 'primary',
      reveal: (_item) => {
        // 客服处理按钮：已领取且未完成时显示
        return (
          _item.sfReceived == 1 &&
          _item.status == '02' &&
          user.userNo === _item.followUpCustomerId &&
          user.userNo != _item.publicOpinionPr &&
          userAuth.value.isKsProcess
        )
      }
    },
    {
      fun: 'prHandle',
      txt: '处理',
      type: 'warning',
      reveal: (_item) => {
        // 公关处理按钮：未完成时显示（需要增加公关角色判断）
        return (
          _item.status == '02' &&
          user.userNo === _item.publicOpinionPr &&
          userAuth.value.isGgProcess
        )
      }
    },
    {
      fun: 'delete',
      txt: '删除',
      type: 'danger',
      reveal: (_item) => user.userNo === _item.registrant && userAuth.value.isDelete
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
