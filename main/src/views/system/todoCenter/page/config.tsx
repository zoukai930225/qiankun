import { PageItem, Screen } from '@/components/template/config/type';
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

// 查询结构
export class SearchItem {
  //编码
  itemCode: string = '';
  //待办类型-字典值
  todoType: string = '';
  //待办事项
  todoText: string = '';
};

// 表格数据结构
export class DataItem {
  id: string | undefined = undefined;
  todoType: string = '';
  todoText: string = '';
  itemCode: string = '';
  orderNum: number | undefined = undefined;
  jumpResourcesMenuId: string = '';
  icon: string = '';
  customParameters: string | undefined = ''
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { userInfo } = params;

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 查询配置(必配)
  const scheme = computed(() => ([
    { field: 'itemCode', label: '编码', component: 'Input', width: 220 },
    {
      field: 'todoType', label: '待办类型', component: 'Select', width: 220, options: getIntDictOptions(DICT_TYPE.SYS_TODO_TYPE, true), componentProps: {
        filterable: true,
        clearable: true,
      }
    },
    { field: 'todoText', label: '待办事项', component: 'Input', width: 220 }
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({
    ...new Screen()
  }));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
    { fun: 'add', txt: '新增' },
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    {
      field: 'todoType', title: '待办类型', minWidth: 120, fixed: 'left',
      isFormatter: true, formatter: (_item) => getDictLabel(DICT_TYPE.SYS_TODO_TYPE, _item.todoType),
    },
    { field: 'todoText', title: '待办事项', minWidth: 150 },
    { field: 'itemCode', title: '事项编码', minWidth: 120 },
    { field: 'orderNum', title: '顺序', width: 100 },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'edit', txt: '编辑' },
    { fun: 'delete', txt: '删除', type: 'danger' },
  ]));

  const setRouterInfo = () => {
    let params: Object = {};
    const param: any = route.params;
    const query: any = route.query;
    Object.keys(param).forEach(key => {
      params[key] = param[key];
    });
    Object.keys(query).forEach(key => {
      params[key] = query[key];
    });
    if (Object.keys(params).length !== 0) {
      searchData.value = { ...searchData.value, ...params };
      const newUrl = window.location.href.replace(/\?.*$/, '');
      history.replaceState({}, '', newUrl)
    };
  };

  return { dataList, searchData, loading, page, scheme, btns, column, screen, stateInfo, statistics, handleColumn, setRouterInfo }
}

