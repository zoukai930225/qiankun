import MenuSelect from "@/components/common/menus/menuSelect.vue";
import SelectUser from '@/components/common/user/selectUser.vue';
import { PageItem } from '@/components/template/config/type';

// 查询结构
export class SearchItem {
  userId: Array<String> = [];
  secondaryMenuId: string = '';
  requestUrl: string = '';
  version: string = '';
  dateTime: Array<String> = [];
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
  const scheme = computed(() => ([
    { field: 'userId', label: '操作人', isCustom: true, customRender: (_item, _model) => <SelectUser /> },
    { field: 'secondaryMenuId', label: '菜单名称', isCustom: true, customRender: (_item, _model) => <MenuSelect is-multiple /> },
    { field: 'requestUrl', label: '请求url', componentProps: { placeholder: '请输入请求url', clearable: true } },
    { field: 'version', label: '版本', componentProps: { clearable: true } },
    { field: 'dateTime', label: '操作时间', component: 'DatePicker', width: 520, componentProps: { type: 'datetimerange', valueFormat: 'YYYY-MM-DD HH:mm:ss', format: 'YYYY-MM-DD HH:mm:ss' } }
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({}));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'secondaryMenuName', title: '菜单名称', minWidth: 120 },
    { field: 'version', title: '版本', width: 160 },
    { field: 'creator', title: '操作人', width: 120 },
    { field: 'createdAt', title: '操作时间', width: 165 },
    { field: 'ipAddress', title: '请求ip', width: 150 },
    { field: 'requestUrl', title: '请求url', minWidth: 240 },
    { field: 'recordChangeDataFlag', title: '修改数据', width: 100, isFormatter: true, formatter: (_item) => _item?.recordChangeDataFlag ? '是' : '否' }
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([]));

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

