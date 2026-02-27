import { PageItem, Screen } from '@/components/template/config/type';
import dayjs from "dayjs";
import StoreCascader from "@/components/BIStoreCascader/src/storeCascader.vue"
import StoreCell from "../components/storeCell.vue";
// 查询结构
export class SearchItem {
  dataDate: string = dayjs().format('YYYY-MM-DD');
  stores: Array<any> = [];
  statusList: string = ''
};

// 表格数据结构
export class DataItem {
  /**
      * 渠道
      */
  channel: string = '';
  /**
   * 清洗指标
   */
  cleanIndicators: string = '';
  /**
   * 订单日期
   */
  dataDate: string = '';
  /**
   * 结束时间
   */
  endTime: string = '';
  /**
   * 执行SQL
   */
  executeSql: string = '';
  /**
   * 失败原因
   */
  failMsg: string = '';
  /**
   * 主键
   */
  id: string = '';
  /**
   * 清洗项
   */
  item: string = '';
  /**
   * 来源列
   */
  originColumn: string = '';
  /**
   * 来源表
   */
  originTable: string = '';
  /**
   * 结果条数
   */
  resultSize: number = 0;
  /**
   * 序号;时间戳串
   */
  seqNo: string = '';
  /**
   * 开始时间
   */
  startTime: string = '';
  /**
   * 清洗结果
   */
  status?: string = '';
  /**
   * 店铺
   */
  store: string = '';
  storeName: string = '';
  /**
   * 目标列
   */
  targetColumn: string = '';
  /**
   * 目标表
   */
  targetTable: string = '';
  /**
   * 耗时
   */
  timeConsuming: string = '';
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
  const scheme = computed(() => ([{
    field: 'dataDate', label: '日期', component: 'DatePicker',
    width: 220,
    componentProps: {
      valueFormat: "YYYY-MM-DD",
      clearable: false
    }
  },
  {
    field: 'stores', label: '店铺', width: 220, isCustom: true, customRender: () =>
      <StoreCascader cascaderProps={{ multiple: true }} popperAppendToBody/>
  },
  {
    field: 'statusList',
    label: '状态',
    component: 'Select',
    width: 220,
    options: [{
      label: '成功',
      value: '成功'
    }, {
      label: '失败',
      value: '失败'
    }],
    componentProps: {
      clearable: true,
      valueOnClear: ''
    },
  }
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({
    ...new Screen({
    })
  }));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'cleanIndicators', title: '任务名称', minWidth: 150, fixed: 'left' },
    { field: 'storeName', title: '店铺名称', width: 200, isCustom: true, customRender: (_item) => <StoreCell row={_item} /> },
    { field: 'startTime', title: '开始时间', width: 180 },
    { field: 'status', title: '状态', width: 120, isCustom: true, customRender: (_item) => _item.status === '成功' ? <sapn class="each-tag each-tag-success" >成功</sapn> : <sapn class="each-tag each-tag-fail" >失败</sapn> },
    { field: 'timeConsuming', title: '耗时', minWidth: 100 },
    { field: 'resultSize', title: '处理行数', minWidth: 100 },
    { field: 'targetTable', title: '目标表', minWidth: 150 },
    { field: 'targetColumn', title: '目标列', minWidth: 150 },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'view', txt: '详情' },
    { fun: 'reCall', txt: '重新执行', reveal: (_item) => _item.status === '失败', type: 'danger' },
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

