import { PageItem } from '@/components/template/config/type';
import { getDictLabel } from '@/utils/dict';
import { ElCascader } from "element-plus";

// 查询结构
export class SearchItem {
  categoryCode: any = []
  nodeId: string = ''
};

// 表格数据结构
export class DataItem {
  id: string = '';
  nodeId: string=''
  categoryCode: string = ''
  basisDuration: number = 1
  durationUnit: string = ''
};

export type CategoryItem = {
  category: string,
  subCategories: CategoryItem[]
}

// 通用入参
export const usePage = (params: any = {}) => {

  const { categoryTree, unitDic } = params;

  const route = useRoute();

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  const casProps = {
    label: 'categoryName', value: 'categoryCode', children: 'subCategories', checkStrictly: true
  }

  // 查询配置(必配)
  const scheme = computed(() => ([{ field: 'categoryCode', label: '品类名称', isCustom: true, customRender: (_item, _model) => (<ElCascader options={categoryTree.value} props={casProps} separator=">"/>) }]));

  // 状态筛选(非必配)
  const screen = computed(() => ({}));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([]));

  const getDictLabel = (dicts: any, value: string) => {
    if(!dicts || dicts.length === 0 || !value) return ''
    const obj = dicts.find((item: any) => item.value === value)
    return obj && obj.label
  }

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'completeCategoryName', title: '品类名称', minWidth: 185 },
    { field: 'basisDuration', title: '基准时长', minWidth: 100 },
    { field: 'durationUnit', title: '时长单位', minWidth: 100, isFormatter: true, formatter: (_item) =>getDictLabel(unitDic, _item.durationUnit)},
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    // { fun: 'link', txt: '模板维护' },
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

