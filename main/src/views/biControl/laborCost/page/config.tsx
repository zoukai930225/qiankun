import { PageItem, Screen } from '@/components/template/config/type';
import dayjs from "dayjs";
import { getDictLabel, DICT_TYPE } from '@/utils/dict';
import { ScopeNodeDTO as ScopeNodeDTOType, conditionTypes, scopNames } from '../selfconfig'
// 查询结构
export class SearchItem {
  feeName: string = '';
  remark: string = '';
  date: string = '';
};

// 表格数据结构
export class DataItem {
  id: string = '';
  feeNameId: string = '';
  feeName: string = '';
  remark: string = '';
  //计算维度 PAY(按支付)/DELIVER(按发货)/REFUND(按退款)
  calculateDimension: string = 'PAY';
  calculateIndex: string = '';//计算指标
  calculateCoefficient: string | undefined = undefined;//计算系数
  effectiveStartDate: string = '';// 生效开始日期
  effectiveEndDate: string = '';// 生效结束日期
  scopeNodeDTO: ScopeNodeDTOType = {
    scopeType: '',
    //默认为条件`
    type: conditionTypes.single,
    condition: {
      scopeName: scopNames.channel,
      nameType: '',
      includeType: '',
      cateObjList: [],
      categoryNameStr: null
    },
    list: null
  }
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
    { field: 'feeName', label: '费用名称', component: 'Input', width: 220 },
    { field: 'remark', label: '备注信息', component: 'Input', width: 220 },
    {
      field: 'date', label: '生效日期', component: 'DatePicker', width: 220, componentProps: {
        valueFormat: "YYYY-MM-DD"
      }
    }
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({
    ...new Screen({
    })
  }));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
    { fun: 'add', txt: '新增费用', type: 'primary' },
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'feeName', title: '费用名称', minWidth: 110, fixed: 'left' },
    { field: 'remark', title: '备注信息', minWidth: 120 },
    {
      field: 'calculateDimension', title: '计算维度', width: 120, isFormatter: true, formatter: (row: any) => {
        return row.calculateDimension === 'PAY' ? '按支付' : row.calculateDimension === 'DELIVER' ? '按发货' : '按退款'
      }
    },
    {
      field: 'calculateIndex', title: '费用明细', minWidth: 200, isFormatter: true, formatter: (row: any) => {
        return getDictLabel(DICT_TYPE.CALCULATE_INDICATOR, row.calculateIndex) + ' * ' + row.calculateCoefficient + '%'
      }
    },
    {
      field: 'effectiveStartDate', title: '生效日期', width: 240, isFormatter: true, formatter: (row: any) => {
        let start = '-', end = '-'
        if (dayjs(row.effectiveStartDate).isValid()) {
          start = dayjs(row.effectiveStartDate).format('YYYY-MM-DD')
        }
        if (dayjs(row.effectiveEndDate).isValid()) {
          end = dayjs(row.effectiveEndDate).format('YYYY-MM-DD')
        }
        return `${start} ~ ${end}`
      },
      tipsWidth: 320, tips: `<p style='word-break: break-all'>当前日期超过生效结束日期62天后的费用不可再次编辑</p>`
    },
    { field: 'updatedId', title: '操作人', width: 150 },
    { field: 'updatedAt', title: '更新日期', width: 180, isFormatter: true, formatter: (row: any) => dayjs(row.updatedAt).isValid() ? dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss') : '-' },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'see', txt: '查看', reveal: (_item) => !_item.update },
    { fun: 'edit', txt: '编辑', reveal: (_item) => _item.update },
    { fun: 'copy', txt: '复制' },
    { fun: 'delete', txt: '删除', type: 'danger', reveal: (_item) => _item.update },
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

