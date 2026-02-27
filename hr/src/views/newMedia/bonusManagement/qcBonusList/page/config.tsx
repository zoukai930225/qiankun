import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem } from '@/components/template/config/type'
import { ElImage, ElTooltip } from 'element-plus'
import dayjs from 'dayjs'
import { useUserStore } from '@/store/modules/user'
import questionIcon from '@/assets/imgs/newMedia/question.svg'
import LineImage from '@/components/template/table/components/lineImage.vue'
// 查询结构
export class SearchItem {
  month: Array<string> = [dayjs().format('YYYY-MM'), dayjs().format('YYYY-MM')]
  videoId: string = '' // 视频ID
  groupIds: string[] = [] // 所属分组（多选）
  editorName: string = '' // 剪辑
  directorName: string = '' // 编导
}

// 表格数据结构
export class DataItem {
  videoId: string = '' // 视频ID
  owningProjectId: string = '' // 所属项目
  owningProject: string = '' // 所属项目名称
  expenditureSingle?: number // 单条消耗（元）
  editorId: string = '' // 剪辑（人员ID）
  editorName: string = '' // 剪辑名称
  editorAvatar: string = '' // 剪辑头像
  directorId: string = '' // 编导（人员ID）
  directorName: string = '' // 编导名称
  directorAvatar: string = '' // 编导头像
  editorScore?: number = 0 // 剪辑积分
  directorScore?: number = 0 // 编导积分
  groupId: string = '' // 所属分组
  groupName?: string = '' // 所属分组名称
  proofImgUrls: string = '' // 数据证明图片
  month?: string = '' // 月份
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()
  const user: any = useUserStore().user || {}
  // 外部组件入参
  const { groupOptions, configInfoList, grabCheck } = params

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
      field: 'videoId',
      label: '视频ID',
      component: 'Input',
      componentProps: { placeholder: '请输入视频ID', clearable: true }
    },
    {
      field: 'groupIds',
      label: '所属分组',
      component: 'Select',
      options: groupOptions.value,
      componentProps: {
        clearable: true,
        multiple: true,
        placeholder: '请选择所属分组'
      }
    },
    {
      field: 'editorName',
      label: '剪辑',
      component: 'Input',
      componentProps: { placeholder: '请输入剪辑', clearable: true }
    },
    {
      field: 'directorName',
      label: '编导',
      component: 'Input',
      componentProps: { placeholder: '请输入编导', clearable: true }
    }
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({}))

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => [
    {
      fun: 'export',
      txt: '导出',
      type: 'primary',
      api: `/api/nmQcBonus/export`,
      method: 'downloadPost',
      exportName: '千川组奖金',
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
    { field: 'videoId', title: '视频ID', fixed: 'left', minWidth: 150 },
    {
      field: 'owningProject',
      title: '所属项目',
      minWidth: 180,
      isFormatter: true,
      formatter: (_item) => _item.owningProject || '-'
    },
    {
      field: 'expenditureSingle',
      title: '单条消耗（元）',
      minWidth: 130,
      isFormatter: true,
      formatter: (_item) => (_item.expenditureSingle ? Number(_item.expenditureSingle) : '-')
    },
    {
      field: 'editorName',
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
      field: 'directorName',
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
      field: 'editorIntegral',
      isHeaderCustom: true,
      customHeaderRender: () => (
        <div class="column-header-with-tip">
          <span>剪辑积分</span>
          <ElTooltip placement="bottom" raw-content>
            {{
              default: () => <img src={questionIcon} style="width: 16px; height: 16px;" alt="" />,
              content: () => (
                <div style="line-height: 1.8;">
                  {configInfoList.value.length > 0 ? (
                    configInfoList.value.map((item: any) => (
                      <div key={item.id} style="margin-bottom: 5px;">
                        {item.expenditureSingleStart}元≤单条消耗&lt;{item.expenditureSingleEnd}元：
                        {item.score}分
                      </div>
                    ))
                  ) : (
                    <span>暂无积分规则</span>
                  )}
                </div>
              )
            }}
          </ElTooltip>
        </div>
      ),
      minWidth: 130,
      isFormatter: true,
      formatter: (_item) => (_item.editorIntegral ? Number(_item.editorIntegral) : '-')
    },
    {
      field: 'directorIntegral',
      isHeaderCustom: true,
      customHeaderRender: () => (
        <div class="column-header-with-tip">
          <span>编导积分</span>
          <ElTooltip placement="bottom" raw-content>
            {{
              default: () => <img src={questionIcon} style="width: 16px; height: 16px;" alt="" />,
              content: () => (
                <div style="line-height: 1.8;">
                  {configInfoList.value.length > 0 ? (
                    configInfoList.value.map((item: any) => (
                      <div key={item.id} style="margin-bottom: 5px;">
                        {item.expenditureSingleStart}元≤单条消耗&lt;{item.expenditureSingleEnd}元：
                        {item.score}分
                      </div>
                    ))
                  ) : (
                    <span>暂无积分规则</span>
                  )}
                </div>
              )
            }}
          </ElTooltip>
        </div>
      ),
      minWidth: 130,
      isFormatter: true,
      formatter: (_item) => (_item.directorIntegral ? Number(_item.directorIntegral) : '-')
    },
    {
      field: 'groupName',
      title: '所属分组',
      minWidth: 150,
      isFormatter: true,
      formatter: (_item) => _item.groupName || '-'
    },
    {
      field: 'registrantName',
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
      field: 'proofImgUrls',
      title: '数据证明图片',
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
    }
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
