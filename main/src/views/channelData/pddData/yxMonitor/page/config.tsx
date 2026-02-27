import { PageItem, Screen } from '@/components/template/config/type';
import StoreCascader from "@/components/BIStoreCascader/src/storeCascader.vue"
import ShopCard from "@/views/daMoPan/peopleMonitor/components/shopCard.vue"
import dayjs from 'dayjs';
// 查询结构
export class SearchItem {
  enrollTime: string = dayjs().format('YYYY-MM-DD');
  store: string[] = ['Pdd', 'swPddOfficial'];
  goodsName: string = '';
  activityName: string = '';
};

// 表格数据结构
export class DataItem {
  id: string = '';
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { tab } = params;

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem(), size: 50 });

  // 查询配置(必配)
  const scheme = computed(() => ([{
    field: 'enrollTime', label: '采集日期', component: 'DatePicker',
    width: 220,
    componentProps: {
      valueFormat: "YYYY-MM-DD"
    }
  }, {
    field: 'store', label: '店铺', width: 220, isCustom: true, customRender: () =>
      <StoreCascader filterChannel={['Pdd']} clear={false} collapseTagsTooltip={false} />
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
    field: 'activity',
    label: '活动',
    component: 'Input',
    width: 220,
    componentProps: {
      placeholder: '请输入活动ID或名称',
      clearable: true,
    }
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
    { field: 'goodsId', title: '商品信息', width: 492, fixed: 'left', isCustom: true, customRender: (_item) => <ShopCard row={_item} second={{ name: '商品ID', width: 120, key: 'goodsId' }} />, componentProps: { align: 'center' } },
    {
      field: 'activityName', title: '活动名称', minWidth: 150, isCustom: true, customRender: (_item, scope) => <div style={{ width: '100%' }}>
        <div>{_item.activityName || '-'}</div>
        <div>ID：{_item.activityId}</div>
      </div>
    },
    {
      field: 'activityPrice', title: '活动信息(元)', minWidth: 320, isCustom: true, customRender: (_item, scope) => <div style={{ width: '100%' }}>
        <div class="text-red">活动价：{_item.activityPrice || '-'}</div>
        <div>外场活动价：{_item.onSiteActivityPrice || '-'}</div>
        <div>活动时间：{_item.activityTime}</div>
      </div>
    },
    {
      field: 'enrollTime', title: '提交时间', width: 180
    },
    {
      field: 'activityStatus', title: '活动状态', width: 120
    }
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
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

