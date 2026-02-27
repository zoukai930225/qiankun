import { PageItem, Screen } from '@/components/template/config/type'
import LineImage from '@/components/template/table/components/lineImage.vue'
import { OverflowTooltip } from '@/components/Overflow'
import { ElTooltip, ElLink, ElCascader } from 'element-plus'
import { useCategoryTree } from '@/views/OA/buyer/hooks/useCategoryTree'
import { provide } from 'vue'
const { categoryList, getCategoryTree, casProps } = useCategoryTree()
getCategoryTree()
export const CATEGORY_PROVIDE_KEY = 'BuyerPlanCategoryOptions' as const
export const categoryListKey = 'BuyerPlanCategoryList' as const

const DEFAULT_CATEGORY_OPTIONS = Object.freeze([
  { label: '内裤品', value: 1 },
  { label: '内衣', value: 2 },
  { label: '季节品', value: 3 },
  { label: '袜子', value: 4 }
])

type CategoryOption = { label: string; value: string | number }
export type CategoryProvideContext = {
  options: CategoryOption[]
  labelMap: Map<string | number, string>
  valueMap: Map<string, string | number>
}

// 查询结构
export class SearchItem {
  configId: string | number = ''
  rangeValue: number | null = null
  // 新增筛选字段
  category: string | number | '' = ''
  keyword: string = ''
  planName: string = ''
  planInitiateTime: Array<string> | [] = []
}

// 表格数据结构
export class DataItem {
  id: string | number = ''
  category: string | number = ''
  categoryName: string = ''
  planName: string = ''
  productPicture: string = ''
  productLink: string = ''
  chooseDirection: string = ''
  salePoint: string = ''
  fabricContent: string = ''
  fabricComposition: Array<{ key: string; value: number }> = []
  pricing: string = ''
  salesVolume: string = ''
  costEstimate: string = ''
  createdAt: string = ''
  chooseTime: string = ''
  sizeText: string = ''
  sizeFile: string = ''
  createdId: string | number = ''
  createdName: string = ''
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()
  provide(categoryListKey, categoryList)

  // 外部组件入参
  const { userInfo } = params

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  const planOptions = ref<Array<any>>([])

  const categoryContext = inject<CategoryProvideContext>(CATEGORY_PROVIDE_KEY, {
    options: [],
    labelMap: new Map<string | number, string>(),
    valueMap: new Map<string, string | number>()
  })

  const categoryOptions = computed(() =>
    categoryContext.options.length ? categoryContext.options : DEFAULT_CATEGORY_OPTIONS
  )

  // 查询配置(必配)
  const scheme = computed(() => [
    // {
    //   field: 'category',
    //   label: '品类',
    //   component: 'Select',
    //   options: categoryOptions.value,
    //   componentProps: {
    //     clearable: true,
    //     filterable: true,
    //     placeholder: '请选择品类'

    //   }
    // },
    {
      field: 'planName',
      label: '企划名称',
      component: 'Input',
      componentProps: {
        clearable: true,
        placeholder: '请输入企划名称'
      }
    },
    {
      field: 'planInitiateTime',
      label: ['企划发起时间'],
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        unlinkPanels: true,
        clearable: true
      }
    },
    {
      field: 'category',
      label: '品类',
      isCustom: true,
      customRender: (_item, _model) => (
        <ElCascader options={categoryList.value} props={casProps} separator=">" />
      ),
      componentProps: {
        clearable: true,
        filterable: true,
        placeholder: '请选择品类'
      }
    },
    {
      field: 'keyword',
      label: '关键词',
      component: 'Input',
      componentProps: {
        clearable: true,
        placeholder: '请输入关键词'
      }
    },
    
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({ ...new Screen() }))

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => [
    { fun: 'add', txt: '新增', type: 'primary', display: () => !userInfo?.value?.isAdd }
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    { field: 'categoryName', title: '品类', minWidth: 200 },
    { field: 'planName', title: '企划名称', minWidth: 180 },
    {
      field: 'productPicture',
      title: '产品图片',
      width: 88,
      align: 'center',
      isCustom: true,
      customRender: (_item: any) => <LineImage urls={_item?.productPicture || ''} />
    },
    {
      field: 'productLink',
      title: '竞品链接',
      minWidth: 140,
      isCustom: true,
      customRender: (_item: any) =>
        _item?.productLink ? (
          <ElLink type="primary" underline={false} href={_item.productLink} target="_blank">
            点击跳转
          </ElLink>
        ) : (
          <span>-</span>
        )
    },
    {
      field: 'chooseDirection',
      title: '选品方向',
      minWidth: 180,
      isCustom: true,
      customRender: (_item: any) => {
        return <OverflowTooltip content={_item?.chooseDirection} lineClamp={2}></OverflowTooltip>
      }
    },
    {
      field: 'salePoint',
      title: '核心卖点',
      minWidth: 180,
      isCustom: true,
      customRender: (_item: any) => {
        return <OverflowTooltip content={_item?.salePoint} lineClamp={2}></OverflowTooltip>
      }
    },
    {
      field: 'fabricContent',
      title: '面料成分',
      minWidth: 260,
      isCustom: true,
      customRender: (_item: any) => {
        const rawContent = _item?.fabricContent
        if (!rawContent) return <span>-</span>

        let displayStr = ''

        // 格式化单个对象的辅助函数
        const formatItem = (item: any) => {
          const key = item?.name ?? item?.material ?? item?.key ?? ''
          const rawValue = item?.percentage ?? item?.percent ?? item?.value ?? ''
          const hasValue = rawValue !== '' && rawValue !== undefined && rawValue !== null
          const valueText = hasValue
            ? `${rawValue}${String(rawValue).includes('%') ? '' : '%'}`
            : ''
          return `${key}${key && valueText ? ' ' : ''}${valueText}`.trim()
        }

        try {
          // 情况1: 是字符串且看起来像 JSON 数组
          if (typeof rawContent === 'string' && rawContent.trim().startsWith('[')) {
            const parsed = JSON.parse(rawContent)
            if (Array.isArray(parsed)) {
              displayStr = parsed.map(formatItem).join('、')
            } else {
              displayStr = rawContent
            }
          }
          // 情况2: 本身就是数组
          else if (Array.isArray(rawContent)) {
            displayStr = rawContent.map(formatItem).join('、')
          }
          // 情况3: 普通字符串
          else {
            displayStr = String(rawContent)
          }
        } catch (e) {
          // 解析失败，直接展示原字符串
          displayStr = String(rawContent)
        }

        // 使用 OverflowTooltip 防止文字过长撑开表格，保持整洁
        return <OverflowTooltip content={displayStr} lineClamp={2}></OverflowTooltip>
      }
    },
    { field: 'pricing', title: '定价', minWidth: 160 },
    { field: 'salesVolume', title: '销量', minWidth: 140 },
    { field: 'createdAt', title: '企划发起时间', minWidth: 180 }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [
    { fun: 'view', txt: '查看详情' },
    { fun: 'candidate', txt: '参选产品' },
    {
      fun: 'edit',
      txt: '编辑',
      reveal: (_item) => {
        return _item.allowEdit
      }
    },
    {
      fun: 'delete',
      txt: '删除',
      type: 'danger',
      reveal: (_item) => {
        return _item.allowDelete
      }
    }
  ])

  const setRouterInfo = () => {
    let params: Record<string, any> = {}
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
    setRouterInfo,
    planOptions
  }
}
