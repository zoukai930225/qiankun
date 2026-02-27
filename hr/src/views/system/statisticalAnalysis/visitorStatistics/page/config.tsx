import { PageItem } from '@/components/template/config/type'
import { ElLink, ElTreeSelect } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
// 假设 TableHeaderFilter 存放在通用组件目录，请根据实际路径调整
import TableHeaderFilter from '../components/filter.vue'

// 查询结构
export class SearchItem {
  menuId: string[] = [] // 菜单ID
  curVersion: string = '' // 当前版本号
  // 可以根据后端接口要求添加排序字段，例如：
  // sortField: string = '';
  // sortOrder: string = '';
  // filterParams: any = {};
}

// 表格数据结构
export class DataItem {
  menuName: string = '' // 菜单名称
  menuId: string[] = [] // 菜单id
  env: string = '' // 菜单环境
  totalVisits: number = 0 // 总访问量
  totalvisitsIds: number = 0 // 总访问用户数
  visits: string = '' // 总访问ids，没去重

  curVersion: string = '' // 当前版本
  curVisits: number = 0 // 当前版本访问量
  curVisitIds: string = '' // 当前版本访问ids，没去重
  curDays: number = 0 // 当前版本访问天数

  prevVersion: string = '' // 前版本
  prevVisits: number = 0 // 前版本访问量
  prevVisitIds: string = '' // 前版本访问ids，没去重
  prevDays: number = 0 // 前版本访问天数

  curDayVisits: number = 0 // 当前版本日平均总访问量
  curDayVisitIds: number = 0 // 当前版本日平均访问用户数
  curUserIds: number = 0 // 当前版本访问用户数
  prevUserIds: number = 0 // 前版本访问用户数
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 接收外部传入的响应式菜单数据、回调方法以及查询方法
  // 注意：这里可能需要从 params 中解构出 onSearch 来触发刷新
  const { menuOptions, versionOptions, onTrend, searchTrigger } = params

  const dataList = ref<Array<DataItem>>([])
  const stateInfo = ref<any>({})
  const searchData = ref<SearchItem>({ ...new SearchItem() })
  const loading = ref<boolean>(false)
  const page = ref<PageItem>({ ...new PageItem() })

  // 新增：用于存储各列的排序和筛选状态
  // 结构示例: { totalVisits: { sort: 'asc', filter: 100 }, ... }
  const sortState = ref<any>({})

  const handleSortChange = (field: string, val: { sort: string; filter: any }) => {
    const hasRangeFilter = (fv: any) =>
      fv && ((fv?.min !== '' && fv?.min != null) || (fv?.max !== '' && fv?.max != null))

    // 后端接口仅支持单列 sort + 单列 range（min/max），这里做互斥控制：
    // - sort：保持互斥（同一时刻只有一列有 sort）
    // - filter：也保持互斥（同一时刻只有一列有 min/max）
    const shouldClearOthers = !!val.sort || hasRangeFilter(val.filter)
    if (shouldClearOthers) {
      Object.keys(sortState.value).forEach((key) => {
        if (key !== field && sortState.value[key]) {
          sortState.value[key] = { ...sortState.value[key], sort: '', filter: { min: '', max: '' } }
        }
      })
    }

    // 2. 更新当前列状态
    // 如果该列状态尚未初始化，先初始化对象
    if (!sortState.value[field]) {
      sortState.value[field] = {}
    }
    // 更新值
    sortState.value[field] = val

    // 3. 触发刷新（具体参数映射在页面 onSearch 内完成）
    searchTrigger?.value?.()
  }
  // 查询配置
  const scheme = computed(() => [
    {
      field: 'menuId',
      label: '菜单名称',
      isCustom: true, // 开启自定义渲染
      customRender: () => (
        <ElTreeSelect
          v-model={searchData.value.menuId} // 直接绑定数组
          data={menuOptions.value}
          props={{ label: 'name', value: 'id', children: 'children', disabled: 'disabled' }}
          filterable
          multiple={true} // 开启多选
          check-strictly={false}
          show-checkbox={true} // 显示复选框
          collapse-tags={true} // 折叠标签，防止撑开高度
          collapse-tags-tooltip={true} // 悬停显示所有选中项
          clearable
          node-key="id"
          placeholder="请选择菜单"
          style={{ width: '100%' }}
          onCheck={(data: any, { checkedKeys }: any) => {
            // checkedKeys 包含了所有打钩的节点 ID (父级+子级)
            // 如果您还需要包含“半选”状态的父节点(即只选了部分子节点的父级)，可以将 checkedKeys 替换为 [...checkedKeys, ...halfCheckedKeys]
            searchData.value.menuId = checkedKeys
          }}
        />
      )
    },
    {
      field: 'curVersion',
      label: '版本',
      component: 'Select',
      options: versionOptions?.value || [],
      componentProps: {
        placeholder: '请选择版本',
        clearable: false
      }
    }
  ])

  // 辅助函数：生成带 Filter 的表头配置
  // 避免重复编写相同的 customHeaderRender 逻辑
  const createFilterColumn = (field: string, title: string, minWidth: number) => ({
    field,
    title,
    minWidth,
    align: 'left',
    isHeaderCustom: true,
    customHeaderRender: () => (
      <TableHeaderFilter
        title={title}
        // 启用区间模式
        filterType="range"
        // 绑定状态
        sortStatus={sortState.value[field]?.sort}
        filterValue={sortState.value[field]?.filter}
        // 事件绑定
        onUpdate:sortStatus={(val: string) => {
          if (!sortState.value[field]) sortState.value[field] = {}
          sortState.value[field].sort = val
        }}
        onUpdate:filterValue={(val: any) => {
          if (!sortState.value[field]) sortState.value[field] = {}
          sortState.value[field].filter = val
        }}
        onChange={(val: any) => handleSortChange(field, val)}
      />
    )
  })

  // 表格列配置
  const column = computed(() => [
    { field: 'menuName', title: '菜单名称', minWidth: 160, fixed: 'left' },
    { field: 'env', title: '环境', minWidth: 90, align: 'left' },
    // 使用辅助函数生成带筛选功能的列
    createFilterColumn('totalVisits', '总访问量', 110),
    createFilterColumn('totalvisitsIds', '总访问用户数', 130),
    createFilterColumn('curDayVisits', '日均访问量', 110),
    createFilterColumn('curDayVisitIds', '日均访问用户数', 130),
    createFilterColumn('curVisits', '当前版本访问量', 140),
    createFilterColumn('curUserIds', '当前版本访问用户数', 160),
    createFilterColumn('prevVisits', '前版本访问量', 140),
    createFilterColumn('prevUserIds', '前版本访问用户数', 160)
  ])

  // 操作列配置
  const handleColumn = computed(() => [
    {
      fun: 'trend',
      txt: '趋势分析',
      width: 100,
      isCustom: true,
      customRender: (row: any) => (
        <ElLink type="primary" underline={false} onClick={() => onTrend(row)}>
          趋势分析
        </ElLink>
      )
    }
  ])

  const setRouterInfo = () => {
    const query = route.query
    if (Object.keys(query).length !== 0) {
      searchData.value = { ...searchData.value, ...query }
    }
  }

  const resetForm = () => {
    // 重置查询条件
    const next = { ...new SearchItem() }
    // 默认回到最新版本（版本 options 已按最新在前构造）
    const latest = versionOptions?.value?.[0]?.value
    if (latest) next.curVersion = latest
    searchData.value = next

    // 重置分页/排序筛选
    page.value = { ...page.value, page: 1 }
    sortState.value = {}

    // 触发查询
    searchTrigger?.value?.()
  }

  return {
    dataList,
    searchData,
    loading,
    page,
    scheme,
    column,
    handleColumn,
    setRouterInfo,
    stateInfo,
    sortState,
    resetForm // 导出状态供调试或外部使用
  }
}
