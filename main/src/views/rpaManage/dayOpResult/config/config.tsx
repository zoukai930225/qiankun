import { PageItem, Screen } from '@/components/template/config/type';
import dayjs from "dayjs";
// 查询结构
export class SearchItem {
  dataDate: string = dayjs().format('YYYY-MM-DD');
};

// 表格数据结构
export class DataItem {
  status: string = '';
  totalCount: string = '';
  totalRate: string = '';
  totalExecutionCount: string = '';
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 查询配置(必配)
  const scheme = computed(() => ([{
    field: 'dataDate', label: '日期', component: 'DatePicker', componentProps: {
      clearable: false,
      valueFormat: 'YYYY-MM-DD',
    }
  }]));

  // 状态筛选(非必配)
  const screen = computed(() => ({
    ...new Screen({
      field: 'sftb',
      label: route.meta.title,
      options: [],
      props: {}
    })
  }));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'status', title: '任务状态', minWidth: 110, fixed: 'left' },
    { field: 'totalCount', title: '任务数', minWidth: 120 },
    { field: 'totalRate', title: '任务占比', minWidth: 120 },
    { field: 'totalExecutionCount', title: '执行次数', minWidth: 120 },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    // { fun: 'view', txt: '详情' },
    // { fun: 'edit', txt: '编辑', reveal: (_item) => !!userInfo?.value?.isManagement ? true : (!_item.isStop && !!_item?.isSubordinate) },
    { fun: 'jumpDetail', txt: '查看详情' },
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

