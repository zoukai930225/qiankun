import { PageItem } from '@/components/template/config/type'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import pwdView from '@/assets/imgs/common/pwd_view.png'
import pwdHide from '@/assets/imgs/common/pwd_hide.png'

// 查询结构
export class SearchItem {
  nickName: string = ''
  loginUserName: string = ''
  type: string | number = ''
}

// 表格数据结构
export class DataItem {
  id: string = ''
  nickName: string = ''
  type: string | number = ''
  robotClientName: string = ''
  robotClientUuid: string = ''
  status: string | number = ''
  machineName: string = ''
  loginUserName: string = ''
  loginPassWord: string = ''
  yingdaoUserName: string = ''
  robotRemark?: string = ''
  clientIp: string = ''
  windowsUserName: string = ''
  windowsPassWord: string = ''
  todeskUserName: string = ''
  todeskPassWord: string = ''
  migrationCode: string = ''
  appsPath: string = ''
  description: string = ''
  yingyongUuid: string = ''
  remark: string = ''
  showPassword: boolean = false
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  const { syncLoading = ref(false), togglePassword } = params

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  // 查询配置(必配)
  const scheme = computed(() => [
    { field: 'nickName', label: '节点简称' },
    { field: 'loginUserName', label: ['影刀登录账号'] },
    {
      field: 'type',
      label: '节点类型',
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.YINGDAO_NOTE_TYPE, true),
      componentProps: { clearable: true, placeholder: '请选择节点类型' }
    }
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({}))

  // 操作配置
  const btns = computed(() => [
    { fun: 'add', txt: '新增', type: 'primary' },
    {
      fun: 'syncData',
      txt: syncLoading.value ? '同步中...' : '同步企业节点',
      type: 'primary',
      plain: true,
      disabled: () => syncLoading.value
    }
  ])

  // 表格配置
  const column = computed(() => [
    { field: 'nickName', title: '节点简称', minWidth: 180, fixed: 'left' },
    { field: 'loginUserName', title: '影刀登录账户', minWidth: 220 },
    { field: 'clientIp', title: '服务器IP', minWidth: 220 },
    {
      field: 'type',
      title: '节点类型',
      minWidth: 120,
      isFormatter: true,
      formatter: (row: any) => getDictLabel(DICT_TYPE.YINGDAO_NOTE_TYPE, row.type) || '-'
    },
    { field: 'todeskUserName', title: 'todesk账号', minWidth: 180 },
    {
      field: 'todeskPassWord',
      title: 'todesk密码',
      minWidth: 200,
      isCustom: true,
      customRender: (row: any) => (
        <div class="password-cell">
          <span>
            {row.showPassword ? row.todeskPassWord || '-' : row.todeskPassWord ? '******' : '-'}
          </span>
          {row.todeskPassWord ? (
            <img
              class="icon-view-password"
              src={row.showPassword ? pwdView : pwdHide}
              alt={row.showPassword ? '隐藏密码' : '显示密码'}
              onClick={() => togglePassword && togglePassword(row)}
            />
          ) : null}
        </div>
      )
    },
    { field: 'yingyongUuid', title: '统一登录应用UUID', minWidth: 200 },
    { field: 'remark', title: '备注', minWidth: 240 }
  ])

  // 表格操作行
  const handleColumn = computed(() => [
    { fun: 'view', txt: '查看' },
    { fun: 'edit', txt: '编辑' },
    { fun: 'delete', txt: '删除', type: 'danger' }
  ])

  const setRouterInfo = () => {
    const params: Record<string, any> = {}
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
