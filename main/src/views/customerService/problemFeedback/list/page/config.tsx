import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import dayjs from 'dayjs'
import SelectUser from '@/components/common/user/selectUser.vue'
import { getDictLabel, getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import { ElImage } from 'element-plus'
import LineTage from '@/components/template/table/components/lineTage.vue'
// 查询结构
export class SearchItem {
  handleDept: string = ''
  handleDeptList?: Array<any> = []
  category: string = ''
  categoryList?: Array<any> = []
  type: string = ''
  typeList?: Array<any> = []
  feedbackPersonId: string = ''
  directorId: string = ''
  finishStatus: string = ''
  finishStatusList?: Array<any> = []
  status: string = ''
  statusList?: Array<any> = []
  feedbackDate?: Array<any> = []
  feedbackDateStart: string = ''
  feedbackDateEnd: string = ''
  directorName?: string = ''
}

// 表格数据结构
export class DataItem {
  id: string = ''
  feedbackDate: string = ''
  feedbackPersonId: string = ''
  feedbackPersonName: string = ''
  // estimatedCompleteDate: string = '';
  description: string = ''
  handleDept: string = ''
  category: string = ''
  type: string = ''
  directorName: string = ''
  directorAvatarOrigin: string = ''
  directorId: string = ''
  productCode: string = ''
  image: string = ''
  issueExistence: string = ''
  status: string = ''
  latestProgress: string = ''
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const { userInfo, getRole, grabCheck, hasChangePer } = params
  let feedBackOptions: any = ref<any>([])
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
      field: 'handleDeptList',
      label: ['问题处理', '部门'],
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_HANDLE_DEPT, true),
      componentProps: {
        placeholder: '请选择问题处理部门',
        collapseTags: true,
        collapseTagsTooltip: true,
        multiple: true,
        clearable: true
      }
    },
    {
      field: 'categoryList',
      label: '品类',
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_CATEGORY, true),
      componentProps: {
        collapseTags: true,
        collapseTagsTooltip: true,
        multiple: true,
        clearable: true
      }
    },
    {
      field: 'typeList',
      label: ['问题反馈', '类型'],
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_TYPE, true),
      componentProps: {
        placeholder: '请选择问题反馈类型',
        collapseTags: true,
        collapseTagsTooltip: true,
        multiple: true,
        clearable: true
      }
    },
    {
      field: 'feedbackPersonId',
      label: '反馈人',
      isCustom: true,
      customRender: () => (
        <SelectUser
          v-model={searchData.value.feedbackPersonId}
          multiple={false}
          showAvatarLable={true}
          role={getRole('客诉请求')}
          autoLoadOnInit={true}
        />
      )
    },
    {
      field: 'directorId',
      label: ['问题对接', '负责人'],
      isCustom: true,
      customRender: () => (
        <SelectUser
          v-model={searchData.value.directorId}
          multiple={false}
          showAvatarLable={true}
          role={getRole('客服处理人')}
          autoLoadOnInit={true}
          feedBackOptions={feedBackOptions.value}
        />
      )
    },
    {
      field: 'finishStatusList',
      label: ['是否按时', '完成'],
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_FINISH_STATUS, true),
      componentProps: {
        placeholder: '请选择是否按时完成',
        collapseTags: true,
        collapseTagsTooltip: true,
        multiple: true,
        clearable: true
      }
    },
    {
      field: 'statusList',
      label: '状态',
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_STATUS, true),
      componentProps: {
        placeholder: '请选择状态',
        collapseTags: true,
        collapseTagsTooltip: true,
        multiple: true,
        clearable: true
      }
    },
    {
      field: 'feedbackDate',
      label: '反馈日期',
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
      field: 'directorName',
      label: '负责人'
    },
    {
      field: 'sfChange',
      label: ['对接人是', '否修改'],
      component: 'Select',
      options: [
        { label: '是', value: 1 },
        { label: '否', value: 0 }
      ],
      componentProps: {
        placeholder: '请选择对接人是否修改',
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
    { fun: 'add', txt: '新增', type: 'primary', display: () => !grabCheck('客诉请求') },
    { fun: 'board', txt: '数据看板', type: 'primary' },
    { fun: 'sumBoard', txt: '客诉汇总看板', type: 'primary' },
    {
      fun: 'export',
      txt: '导出',
      type: 'primary',
      api: `/api/csProblemFeedback/export`,
      method: 'download',
      inputMethod: 'params',
      exportName: '客服问题反馈汇总表'
    },
    {
      fun: 'changeDirector',
      txt: '对接人修改',
      type: 'primary',
      display: () => !hasChangePer.value
    }
  ])

  function isValidImage(image: string): boolean {
    if (!image) return false
    try {
      const arr = JSON.parse(image)
      return Array.isArray(arr) && arr.length > 0
    } catch {
      return false
    }
  }

  const getStatus = (status: string) => {
    if (status === '3')
      return {
        txt: getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_STATUS, status),
        background: 'rgba(52, 155, 52, 0.2)',
        color: '#349B34'
      }
    if (status === '2')
      return {
        txt: getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_STATUS, status),
        color: '#DB6A0F',
        background: 'rgba(219, 107, 15, 0.2)'
      }
    if (status === '1')
      return {
        txt: getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_STATUS, status),
        color: '#333',
        background: '#E8E8E8'
      }
  }

  // 表格配置(非必配)
  const column = computed(() => [
    {
      field: 'handleDept',
      title: '问题处理部门',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => (
        <span>
          {getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_HANDLE_DEPT, _item.handleDept) || '-'}
        </span>
      )
    },
    {
      field: 'category',
      title: '品类',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => (
        <span>{getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_CATEGORY, _item.category) || '-'}</span>
      )
    },
    {
      field: 'type',
      title: '问题反馈类型',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => (
        <span>{getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_TYPE, _item.type) || '-'}</span>
      )
    },
    { field: 'description', title: '问题情况说明', minWidth: 120 },
    {
      field: 'directorName',
      title: '问题对接负责人',
      minWidth: 110,
      isCustom: true,
      customRender: (_item) => (
        <LineAvatar user={{ name: _item.directorName, avatarOrigin: _item.directorAvatarOrigin }} />
      )
    },
    { field: 'productCode', title: '产品编码', minWidth: 120 },
    { field: 'latestProgress', title: '最新进展', minWidth: 120 },
    // { field: 'estimatedCompleteDate', title: '预计完成日期', minWidth: 120},
    { field: 'actualCompleteDate', title: '实际完成日期', minWidth: 120 },
    {
      field: 'finishStatus',
      title: '是否按时完成',
      minWidth: 110,
      isCustom: true,
      customRender: (_item) => (
        <span>
          {getDictLabel(DICT_TYPE.CS_PROBLEM_FEEDBACK_FINISH_STATUS, _item.finishStatus) || '-'}
        </span>
      )
    },
    {
      field: 'feedbackPersonName',
      title: '反馈人',
      minWidth: 110,
      isCustom: true,
      customRender: (_item) => (
        <LineAvatar
          user={{ name: _item.feedbackPersonName, avatarOrigin: _item.feedbackAvatarOrigin }}
        />
      )
    },
    { field: 'feedbackDate', title: '反馈日期', minWidth: 120 },
    {
      field: 'image',
      title: '图片',
      minWidth: 90,
      isCustom: true,
      customRender: (_item) =>
        isValidImage(_item.image) ? (
          <ElImage
            src={JSON.parse(_item.image)[0]}
            preview-src-list={JSON.parse(_item.image)}
            style="width:60px;height:60px"
            fit="cover"
            preview-teleported
          />
        ) : (
          <span>{'-'}</span>
        )
    },
    {
      field: 'sfChange',
      title: '对接人是否修改',
      minWidth: 120,
      isCustom: true,
      customRender: (_item) => <span>{_item.sfChange ? '是' : '否'}</span>
    },
    { field: 'changeTime', title: '修改对接人时间', minWidth: 120 },
    {
      field: 'status',
      title: '状态',
      minWidth: 120,
      fixed: 'right',
      isCustom: true,
      customRender: (_item) => (
        <LineTage
          txt={getStatus(_item.status)?.txt}
          color={getStatus(_item.status)?.color}
          background={getStatus(_item.status)?.background}
        />
      )
    }
  ])

  // 是否可以编辑 区分一下 处理人(对接负责人是自己 directorId)和客服(反馈人是自己 feedbackPersonId)
  const isFeedBackEdit = (row: any) => {
    return (
      row.status !== '3' && row.feedbackPersonId === userInfo.value.userNo && grabCheck('客诉请求')
    )
  }
  const isDirectorEdit = (row: any) => {
    return (
      row.status !== '1' &&
      row.status !== '3' &&
      row.directorId === userInfo.value.userNo &&
      grabCheck('客服处理人')
    )
  }
  // 是否可以删除 只有客服可以删除
  const canDelete = (row: any) => {
    if (grabCheck('客诉请求')) {
      return row.feedbackPersonId === userInfo.value.userNo
    }
  }
  // 是否可以处理
  const canHandle = (row: any) => {
    if (grabCheck('客服处理人')) {
      return row.status === '1' && row.directorId === userInfo.value.userNo
    }
  }
  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'view', txt: '详情' },
    { fun: 'edit', txt: '编辑', reveal: (_item) => isFeedBackEdit(_item) || isDirectorEdit(_item) },
    { fun: 'handle', txt: '处理', reveal: (_item) => canHandle(_item) },
    { fun: 'changeDirector', txt: '修改处理人', reveal: (_item) => canHandle(_item) },
    { fun: 'delete', txt: '删除', type: 'danger', reveal: (_item) => canDelete(_item) }
  ])

  const setRouterInfo = () => {
    let params: Object = {}
    const param: any = route.params
    const query: any = route.query
    Object.keys(param).forEach((key) => {
      params[key] = param[key]
    })
    Object.keys(query).forEach((key) => {
      if (key === 'feedBackOptions') {
        feedBackOptions.value = [JSON.parse(query[key])]
      } else {
        params[key] = query[key]
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
