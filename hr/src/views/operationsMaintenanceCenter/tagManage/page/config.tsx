import { PageItem, Screen } from '@/components/template/config/type'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'

// 查询结构
export class SearchItem {
  tagName: string = ''
  tagCategory: string | number = ''
}

// 表格数据结构
export class DataItem {
  id: string = ''
  tagCategory: string | number = ''
  tagName: string = ''
  tagColor: string = ''
  tagSymbol: string = ''
  rangeUse: string = ''
  isShow: string | number = '1'
}

// 通用入参
export const usePage = () => {
  const route = useRoute()

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  // 查询配置
  const scheme = computed(() => [
    { field: 'tagName', label: '标签名称' },
    {
      field: 'tagCategory',
      label: '标签类别',
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.TAG_CATEGORY_DATA, true),
      componentProps: { clearable: true, placeholder: '请选择标签类别' }
    }
  ])

  // 状态筛选
  const screen = computed(() => ({ ...new Screen() }))

  // 操作配置
  const btns = computed(() => [{ fun: 'add', txt: '新增', type: 'primary' }])

  // 表格配置
  const column = computed(() => [
    {
      field: 'tagCategory',
      title: '标签类别',
      minWidth: 140,
      isFormatter: true,
      formatter: (row: any) => getDictLabel(DICT_TYPE.TAG_CATEGORY_DATA, row.tagCategory) || '-'
    },
    {
      field: 'isShow',
      title: '是否显示',
      minWidth: 100,
      isFormatter: true,
      formatter: (row: any) => (Number(row.isShow) === 1 ? '是' : '否')
    },
    { field: 'tagName', title: '标签名称', minWidth: 140 },
    {
      field: 'tagSymbol',
      title: '标签展示',
      minWidth: 200,
      isCustom: true,
      customRender: (row: any) => (
        <div class="tag-symbol-wrap">
          {(row.tagSymbol || '')
            .split(',')
            .filter((item: string) => !!item)
            .map((item: string, index: number) => (
              <span
                class="tag-symbol-item"
                key={`${item}_${index}`}
                style={{ backgroundColor: row.tagColor || '#f8f8f9' }}
              >
                {item}
              </span>
            ))}
        </div>
      )
    },
    { field: 'rangeUse', title: '应用渠道', minWidth: 200 }
  ])

  // 表格操作行
  const handleColumn = computed(() => [
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
