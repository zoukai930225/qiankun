import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem } from '@/components/template/config/type'
import { useUserStore } from '@/store/modules/user'
import dayjs from 'dayjs'
import LineImage from '@/components/template/table/components/lineImage.vue'
// 查询结构
export class SearchItem {
  month: Array<string> = [dayjs().format('YYYY-MM'), dayjs().format('YYYY-MM')]
  workId: string = '' // 作品ID
  publishDate: string = '' // 发布日期
  gmvAmount: number | null = null // GMV金额（元）
  editorName: string = '' // 剪辑（人员ID）
  directorName: string = '' // 编导（人员ID）
  groupIds: Array<string> = [] // 所属分组
}

export enum GroupType {
  GC = 'gc', // 挂车组
  ZN = 'zn', // 站内组
  QC = 'qc' // 千川组
}

// 表格数据结构
export class DataItem {
  workId: string = '' // 作品ID
  publishDate: string = '' // 发布日期
  gmv?: number // GMV金额（元）
  editorId: string = '' // 剪辑（人员ID）
  directorId: string = '' // 编导（人员ID）
  groupId: string = '' // 所属分组
  groupName?: string = '' // 所属分组名称
  proofImgUrls: string = '' // 数据证明图片
  registrantId?: string = '' // 登记人ID
  registrantName?: any = null // 登记人信息（用于展示）
  bonusLevel?: string = '' // 奖金挡位
  editorBonus?: number = 0 // 剪辑奖金（元）
  directorBonus?: number = 0 // 编导奖金（元）
  month?: string = '' // 月份
}

// 通用入参
export const usePage = (params: any = {}) => {
  console.log(params, 'params')
  const route = useRoute()
  const user: any = useUserStore().user || {}
  // 外部组件入参
  const { groupOptions, grabCheck } = params

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
      field: 'month',
      label: '月份',
      labelWidth: 40,
      component: 'DatePicker',
      width: 210,
      componentProps: {
        type: 'monthrange',
        valueFormat: 'YYYY-MM',
        format: 'YYYY-MM'
      }
    },
    {
      field: 'workId',
      label: '作品ID',
      component: 'Input',
      componentProps: { placeholder: '请输入作品ID' }
    },
    {
      field: 'publishDate',
      label: '发布日期',
      component: 'DatePicker',
      width: 210,
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        clearable: false,
        editable: false
      }
    },
    {
      field: 'gmvAmount',
      label: 'GMV金额(元)',
      labelWidth: 100,
      component: 'Input',
      componentProps: { placeholder: '请输入GMV金额（元）' }
    },
    {
      field: 'editorName',
      label: '剪辑',
      labelWidth: 40,
      component: 'Input',
      componentProps: { placeholder: '请输入剪辑' }
    },
    {
      field: 'directorName',
      label: '编导',
      labelWidth: 40,
      component: 'Input',
      componentProps: { placeholder: '请输入编导' }
    },
    {
      field: 'groupIds',
      label: '所属分组',
      component: 'Select',
      options: groupOptions.value,
      componentProps: { clearable: true, multiple: true }
    }
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({
    // ...new Screen({
    //   field: 'sftb',
    //   label: '填报状态:',
    //   options: [
    //     { label: '已填报', value: 1 },
    //     { label: '未填报', value: 0 }
    //   ],
    //   props: {}
    // })
  }))

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => [
    // { fun: 'seal', txt: '数据封版', disabled: () => !userInfo.value.isHrbp },
    // { fun: 'solution', txt: '数据解封', disabled: () => !userInfo.value.isManagement },
    {
      fun: 'export',
      txt: '导出',
      type: 'primary',
      api: `/api/nmTrailerBonus/export`,
      method: 'downloadPost',
      exportName: '奖金列表',
      disabled: () => !dataList?.value?.length
    },
    { fun: 'board', txt: '奖金看板', type: 'primary' },
    { fun: 'add', txt: '新增', type: 'primary' }
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    {
      field: 'month',
      title: '月份',
      minWidth: 110,
      fixed: 'left'
    },
    { field: 'workId', title: '作品ID', fixed: 'left', minWidth: 150 },
    { field: 'publishDate', title: '发布日期', minWidth: 120 },
    {
      field: 'gmv',
      title: 'GMV金额（元）',
      minWidth: 130,
      isFormatter: true,
      formatter: (_item) => (_item.gmv ? Number(_item.gmv) : '-')
    },
    {
      field: 'editor',
      title: '剪辑',
      minWidth: 150,
      isCustom: true,
      customRender: (_item) =>
        _item.editorName ? (
          <LineAvatar
            user={{
              name: _item.editorName,
              avatarOrigin: _item.editorAvatar
            }}
          />
        ) : (
          <span>-</span>
        )
    },
    {
      field: 'director',
      title: '编导',
      minWidth: 150,
      isCustom: true,
      customRender: (_item) =>
        _item.directorName ? (
          <LineAvatar
            user={{
              name: _item.directorName,
              avatarOrigin: _item.directorAvatar
            }}
          />
        ) : (
          <span>-</span>
        )
    },
    {
      field: 'groupName',
      title: '所属分组',
      minWidth: 150,
      isFormatter: true,
      formatter: (_item) => _item.groupName || '-'
    },
    {
      field: 'registrant',
      title: '登记人',
      minWidth: 150,
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
      field: 'dataProofPhoto',
      title: '数据证明照片',
      minWidth: 160,
      isCustom: true,
      customRender: (_item) => {
        // 解析图片数据
        // if (!_item.proofImgUrls) {
        //   return <span>暂无图片</span>
        // }
        return (
          <div class="image-preview-container">
            <LineImage urls={_item.proofImgUrls} width={36} height={36} />
          </div>
        )
      }
    },
    // 只有管理员才能看到以下三列
    ...(grabCheck('云视频管理员') || (!grabCheck('剪辑') && !grabCheck('编导'))
      ? [
          { field: 'bonusLevel', title: '奖金档位', minWidth: 110 },
          {
            field: 'editorBonus',
            title: '剪辑奖金（元）',
            minWidth: 130,
            isFormatter: true,
            formatter: (_item) => (_item.editorBonus ? Number(_item.editorBonus) : '0')
          },
          {
            field: 'directorBonus',
            title: '编导奖金（元）',
            minWidth: 130,
            isFormatter: true,
            formatter: (_item) => (_item.directorBonus ? Number(_item.directorBonus) : '0.00')
          }
        ]
      : [])
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'view', txt: '详情' },
    {
      fun: 'edit',
      txt: '编辑',
      reveal: (_item) => user.id === _item.registrantId || grabCheck('云视频管理员')
    },
    {
      fun: 'delete',
      txt: '删除',
      type: 'danger',
      reveal: (_item) => user.id === _item.registrantId || grabCheck('云视频管理员')
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
