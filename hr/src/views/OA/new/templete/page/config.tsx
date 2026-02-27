import { PageItem } from '@/components/template/config/type';

// 查询结构
export class SearchItem {
  templateName: string = '';
};

// 表格数据结构
export class DataItem {
  id: string = '';
};

// 通用入参
export const usePage = () => {

  const route = useRoute();

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 查询配置(必配)
  const scheme = computed(() => ([{ field: 'templateName', label: '模板名称' }]));

  // 状态筛选(非必配)
  const screen = computed(() => ({}));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([{ fun: 'add', txt: '新增', type: 'primary', icon: 'plus' }]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'templateName', title: '模板名称', minWidth: 200, isCopy: true, isClick: true, style: { color: '#0064ff !important' } },
    { field: 'createdAt', title: '创建时间', minWidth: 185, sort: true },
    { field: 'createdId', title: '创建人', minWidth: 140 },
    { field: 'updatedAt', title: '更新时间', minWidth: 185 },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'link', txt: '模板维护' },
    //  reveal: (_item) => !!userInfo?.value?.isManagement ? true : (!_item.isStop && !!_item?.isSubordinate)
    { fun: 'edit', txt: '编辑', },
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

