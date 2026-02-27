import { PageItem, Screen } from '@/components/template/config/type';
import dayjs from "dayjs";
import ShopCard from "@/views/daMoPan/peopleMonitor/components/shopCard.vue"
import ChangeTag from "../components/changeTag.vue";

// 查询结构
export class SearchItem {
  //采集日期
  dataDate: string = '';
  goods: string = '';
  store: string = '';
  ischange: string = '';
};

// 表格数据结构
export class DataItem {
  id: string = '';
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { maxDate } = params;

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });
  searchData.value.dataDate = maxDate?.value ?? '';

  const disabledDate = maxDate

  // 查询配置(必配)
  const scheme = computed(() => ([{
    field: 'dataDate', label: '采集日期', component: 'DatePicker',
    width: 220,
    componentProps: {
      valueFormat: "YYYY-MM-DD",
      clearable: false,
      disabledDate: (date: any) => {
        return dayjs(date).isAfter(dayjs(disabledDate.value));
      },
    }
  }, {
    field: 'goods',
    label: '商品',
    component: 'Input',
    width: 220,
    componentProps: {
      placeholder: '请输入商品ID或名称',
      clearable: true,
    }
  }, {
    field: 'ischange',
    label: '是否变化',
    component: 'Select',
    width: 220,
    options: [{
      label: '是',
      value: '0'
    }, {
      label: '否',
      value: '1'
    }],
    componentProps: {
      clearable: true,
    },
  }]));

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
    {
      field: 'goodsId', title: '商品信息', width: 500, fixed: 'left', isCustom: true, customRender: (_item) => <div class='flex-column row-center'><ShopCard row={_item} second={{ name: '商品ID', width: 120, key: 'goodsId' }} /></div>, align: 'center', tipsWidth: 260, tips: `<p>近15日销量（销售件数）≥1万的商品</p>`,
    },
    { field: 'commentTime', title: '采集时间', minWidth: 180, align: 'center' },
    {
      field: 'commentchanges', title: '评论是否变化', minWidth: 160, isCustom: true, customRender: (_item) => <div class='flex-column row-center'><ChangeTag changeType={_item.commentchanges === '是' ? 0 : 1} /></div>, align: 'center',
      tipsWidth: 320, tips: `<p style='word-break: break-all'>按商品维度，使用最新一次采集的评论/问大家 与 上一次采集的评论/问大家 进行对比，如果评论ID/问题ID有变动，则「是否变化=是」</p><p style='word-break: break-all;margin-top:5px'>如：商品A：本次采集的评论ID/问题ID是：2,3,4,5,6；上次采集的评论ID/问题ID是1,2,3,4,5，则：是否变化=是</p>`
    },
    {
      field: 'questionstchanges', title: '问大家是否变化', minWidth: 160, isCustom: true, customRender: (_item) => <div class='flex-column row-center'><ChangeTag changeType={_item.questionstchanges === '是' ? 0 : 1} /></div>, align: 'center',
      tipsWidth: 320, tips: `<p style='word-break: break-all'>按商品维度，使用最新一次采集的评论/问大家 与 上一次采集的评论/问大家 进行对比，如果评论ID/问题ID有变动，则「是否变化=是」</p><p style='word-break: break-all;margin-top:5px'>如：商品A：本次采集的评论ID/问题ID是：2,3,4,5,6；上次采集的评论ID/问题ID是1,2,3,4,5，则：是否变化=是</p>`
    },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'view', txt: '评论详情' },
    { fun: 'view', txt: '问大家详情' },
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

