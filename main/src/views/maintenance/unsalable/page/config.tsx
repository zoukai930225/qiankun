import { categoryOps, typeOps, seasonCategoryOps, transformCategory, transformType, transformSeasonType, formatNumberToWan, retain9 } from './options'
import LineImage from "@/components/template/table/components/lineImage.vue";
import Synchronization from "../components/synchronization.vue";
import { PageItem } from '@/components/template/config/type';
import dayjs from "dayjs";

// 查询结构
export class SearchItem {
  dataDate: string = dayjs().add(-1, 'days').format('YYYY-MM-DD');
  category: number | null = null;
  type: number | null = null;
  seasonCategory: number | null = null;
  productNumber: string = '';
  productName: string = '';
  directorName: string = '';
};

// 表格数据结构
export class DataItem {
  id?: string = '';
  category?: number | null = null;
  company?: string = '';
  companyName?: string = '';
  costs?: string = '';
  costsEdit?: number | null = null;
  createdAt?: string = '';
  createdId?: string = '';
  directorId?: string = '';
  directorName?: string = '';
  image?: string = '';
  inventory?: string = '';
  isDeleted?: number | null = null;
  productName?: string = '';
  productNumber?: string = '';
  recordChangeDataFlag?: boolean
  salesSevenDays?: string = '';
  seasonCategory?: number | null = null;
  store?: string = '';
  totalCargoValue?: string = '';
  turnaroundDays?: string = '';
  type?: number | null = null;
  updatedAt?: string = '';
  updatedId?: string = '';
  yesterdayCargoValue?: string = '';
  yesterdaySales?: string = '';
  dataDate?: string = ''
  codeType?: number = 1;
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { selectRows } = params;

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 查询配置(必配)
  const scheme = computed(() => ([
    { field: 'dataDate', label: '日期', component: 'DatePicker', width: 230, componentProps: { type: 'date', valueFormat: 'YYYY-MM-DD', format: 'YYYY-MM-DD', clearable: false, editable: false } },
    { field: 'category', label: '品类', component: 'Select', options: categoryOps, componentProps: { multiple: false, clearable: true } },
    { field: 'type', label: '类别', component: 'Select', options: typeOps, componentProps: { multiple: false, clearable: true } },
    { field: 'seasonCategory', label: '季节分类', component: 'Select', options: seasonCategoryOps, componentProps: { multiple: false, clearable: true } },
    { field: 'productNumber', label: '编码' },
    { field: 'productName', label: '货品名称' },
    { field: 'directorName', label: '责任人' }
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({}));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
    // date={searchData.value.dataDate}
    { fun: 'synchronized', txt: '待同步商品', isCustom: true, customRender: (_item) => <Synchronization /> },
    { fun: 'batchDeletion', txt: '批量删除', type: 'danger', plain: true, disabled: () => !selectRows.value.length },
    { fun: 'import', txt: '导入', api: `/api/opUnsalableGoods/import?dataDate=${searchData.value.dataDate}` },
    { fun: 'export', txt: '导出', api: `/api/opUnsalableGoods/export`, method: 'download', inputMethod: 'params', exportName: '滞销滞卖货品清单' },
    { fun: 'add', txt: '新增', type: 'primary' },
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'dataDate', title: '日期', width: 120, fixed: 'left' },
    { field: 'image', title: '图片', width: 100, isCustom: true, customRender: (_item, _model) => <LineImage urls={_item.image} width={66} height={66} /> },
    { title: '品类', field: 'category', isFormatter: true, formatter: (_item) => transformCategory(_item.category) },
    { title: '成本', field: 'costs', isFormatter: true, formatter: (_item) => retain9(_item.costs), width: 60 },
    { title: '类别', field: 'type', isFormatter: true, formatter: (_item) => transformType(_item.type), width: 60 },
    { title: '季节分类', field: 'seasonCategory', isFormatter: true, formatter: (_item) => transformSeasonType(_item.seasonCategory) },
    { title: '编码', field: 'productNumber', width: 150 },
    { title: '货品名称', field: 'productName', width: 250 },
    { title: '库存', field: 'inventory' },
    { title: '总货值', field: 'totalCargoValue', isFormatter: true, formatter: (_item) => formatNumberToWan(_item.totalCargoValue) },
    { title: '昨日销量', field: 'yesterdaySales' },
    { title: '昨日货值', field: 'yesterdayCargoValue', isFormatter: true, formatter: (_item) => formatNumberToWan(_item.yesterdayCargoValue) },
    { title: '七天销量', field: 'salesSevenDays' },
    { title: '周转天数', field: 'turnaroundDays' },
    { title: '负责人', field: 'directorName' },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'edit', txt: '编辑' },
    { fun: 'delData', txt: '删除', type: 'danger' },
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

