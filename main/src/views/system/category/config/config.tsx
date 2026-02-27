import { PageItem, Screen } from '@/components/template/config/type';
import { ElCascader } from "element-plus";

export type CategoryItem = {
  category: string,
  subCategories: CategoryItem[]
}

// 查询结构
export class SearchItem {
  categoryCode: string | undefined = undefined;
  mainPromotedMonth: string = '';
  suitableTemperature: string = '';
  isSeasonalProduct: string = '';
};

// 表格数据结构
export class DataItem {
  id: string = '';
  parentCodes: string[] = [];
  parentCode: string = '';
  categoryCode: string = '';
  categoryName: string = '';
  mainPromotedMonth: string = '';
  suitableTemperature: string = '';
  isSeasonalProduct: string = '';
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { userInfo, categoryTree } = params;

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  const casProps = {
    label: 'categoryName', value: 'categoryCode', children: 'subCategories', checkStrictly: true
  }

  // 查询配置(必配)
  const scheme = computed(() => ([
    { field: 'category', label: '类目', isCustom: true, customRender: (_item, _model) => (<ElCascader options={categoryTree.value} props={casProps} separator=">"/>) },
    {
      field: 'isSeasonalProduct', label: ['是否', '季节品'], component: 'Select',
      options: [{ label: '否', value: 0 }, { label: '是', value: 1 }],
      componentProps: {
        placeholder: '请选择',
        multiple: false,
        clearable: true
      }
    },
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({
    // ...new Screen({
    //   field: 'sftb',
    //   label: '填报状态:',
    //   options: [{ label: '已填报', value: 1 }, { label: '未填报', value: 0 }],
    //   props: {}
    // })
  }));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
    { fun: 'add', txt: '新增', type: 'primary' },
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'completeCategoryName', title: '类目名称', minWidth: 110 },
    { field: 'categoryCode', title: '类目编码', minWidth: 120 },
    { field: 'mainPromotedMonth', title: '主推月份', minWidth: 120 },
    { field: 'suitableTemperature', title: '适合温度', minWidth: 120 },
    { field: 'isSeasonalProduct', title: '是否季节品', minWidth: 120, isFormatter: true, formatter: (_item) => _item.isSeasonalProduct + '' ? (_item.isSeasonalProduct === 1 ? '是' : '否') : '-' },
    // { field: 'khzq', title: '考核周期', width: 100 },
    // { field: 'nl', title: '能力', width: 80, isCustom: true, customRender: (_item) => <LineTages txt={getDicInfo(_item.nl, 'label')} background={getDicInfo(_item.nl, 'background')} color={getDicInfo(_item.nl, 'color')} /> },
    // { field: 'ql', title: '潜力', width: 80, isCustom: true, customRender: (_item) => <LineTages txt={getDicInfo(_item.ql, 'label')} background={getDicInfo(_item.ql, 'background')} color={getDicInfo(_item.ql, 'color')} /> },
    // { field: 'jzg', title: '价值观', width: 80, isCustom: true, customRender: (_item) => <LineTages txt={getDicInfo(_item.jzg, 'label')} background={getDicInfo(_item.jzg, 'background')} color={getDicInfo(_item.jzg, 'color')} /> },
    // { field: 'sftbTxt', title: '填报状态', width: 90, isFormatter: true, formatter: (_item) => _item.sftb === 1 ? '已填报' : '未填报' },
    // { field: 'isStop', title: '封版状态', width: 90, isFormatter: true, formatter: (_item) => _item.isStop === 1 ? '已封版' : '未封版' },
    // { field: 'managerName', title: '直属上级', width: 110, isCustom: true, customRender: (_item) => <LineAvatar user={{ name: _item.managerName, avatarOrigin: _item.sjtx }} /> },
    // { field: 'hrName', title: 'HRBP', width: 110, isCustom: true, customRender: (_item) => <LineAvatar user={{ name: _item.hrName, avatarOrigin: _item.hrtx }} /> },
    // { field: 'remark', title: '备注', minWidth: 264 }
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    // { fun: 'view', txt: '详情' },
    { fun: 'edit', txt: '编辑' },
    { fun: 'customDel', txt: '删除', type: 'danger' },
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

