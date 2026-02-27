import { PageItem, Screen } from '@/components/template/config/type';
import StoreCascader from "@/components/BIStoreCascader/src/storeCascader.vue"
import ShopCard from "@/views/daMoPan/peopleMonitor/components/shopCard.vue"
import DirectorAllCell from '../components/directorAllCell.vue';
import CategoryCascader from '../../components/categoryCascader.vue';
import TimeRangeSelect from '../../components/timeRangeSelect.vue';
import MixSelect from '../components/mixSelect.vue';
// 查询结构
export class SearchItem {
  validFlag: Array<number> = [1];
  store: Array<any> = [];
  hasDirector: string = '';
  categroy: Array<any> = [];
  status: string | number = 1;
  //负责时间
  confirmTimes: object = {
    startTime: '',
    endTime: ''
  };
  //上架时间
  addTimes: object = {
    groundingStartTime: '',
    groundingEndTime: ''
  };
  //混合查找
  mix: object | null | string = null;
};

// 表格数据结构
export class DataItem {
  bizType: number = 3;
  bizIds: Array<any> = [];
  directors: Array<any> = [];
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { userInfo, channelCode } = params;

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 查询配置(必配)
  const scheme = computed(() => ([
    {
      field: 'store', label: '店铺', width: 220, isCustom: true, customRender: () =>
        <StoreCascader cascaderProps={{ multiple: true }} onChange={(val, node) => storeChange(val, node)} 
        filterChannel={['TaoBao','Tmall','Pdd','Douyin']} popperAppendToBody/>
    },
    {
      field: 'categroy', label: '类目', width: 220, isCustom: true, customRender: () =>
        <CategoryCascader cascaderProps={{ checkStrictly: true }} disabledChannel={true}
          channelCode={channelCode.value} />
    },
    {
      field: 'status',
      label: '销售状态',
      component: 'Select',
      width: 220,
      options: [
        { label: '售卖中', value: 1 },
        { label: '已下架', value: 2 },
      ],
      componentProps: {
        clearable: true,
        valueOnClear: ''
      },
    },
    {
      field: 'confirmTimes', label: '负责时间', width: 480, isCustom: true, customRender: () =>
        <TimeRangeSelect />
    },
    {
      field: 'hasDirector',
      label: ['是否有责', '任人'],
      component: 'Select',
      width: 220,
      options: [{ label: '是', value: 1 },
      { label: '否', value: 0 }],
      componentProps: {
        clearable: true,
        valueOnClear: '',
        placeholder: '请选择',
      },
    },
    {
      field: 'mix', label: '混合搜索', width: 220, isCustom: true, customRender: () =>
        <MixSelect />
    },
    {
      field: 'addTimes', label: '上架时间', width: 480, isCustom: true, customRender: () =>
        <TimeRangeSelect start={'groundingStartTime'} end={'groundingEndTime'} />
    },
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({
    ...new Screen({
      field: 'validFlag',
      label: '生效状态:',
      options: [{ label: '只看生效', value: 1 }],
      props: {
      }
    })
  }));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
    { fun: 'multipleAdd', txt: '批量添加' },
    { fun: 'multipleRemove', txt: '批量移除' },
    { fun: 'log', txt: '操作日志' },
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'goodsId', title: '商品信息', width: 570, fixed: 'left', isCustom: true, customRender: (_item) => <ShopCard row={_item} second={{ name: '商品ID', width: 120, key: 'goodsId', copy: true }} showThree={true} />, componentProps: { align: 'center' } },
    { field: 'categoryName', title: '类目', width: 180, minWidth: 180 },
    { field: 'groundingTime', title: '上架时间', width: 180 },
    { field: 'directorVos', title: '当前负责人', width: 300, minWidth: 300, isCustom: true, customRender: (_item) => <DirectorAllCell row={_item} /> },
    { field: 'status', title: '状态', width: 120, isCustom: true, customRender: (_item) => _item.status === '1' ? <sapn class="each-tag each-tag-info" >售卖中</sapn> : _item.status === '2' ? <sapn class="each-tag each-tag-fail" >已下架</sapn> : <sapn class="each-tag each-tag-wait" >未开始</sapn> },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'set', txt: '设置', display: (item) => item.channelCode && item.storeCode },
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

  const storeChange = (val: any, node: any[]) => {
    let labels: string[] = [];
    if (Array.isArray(node) && node?.length > 0) {
      node.map(item => {
        if (item && item?.pathLabels?.length > 0) {
          labels.push(item.pathLabels[0])
        }
      })
      labels = [...new Set(labels)]
      if (searchData.value?.categroy.length > 0 && !labels.includes(searchData.value.categroy[0])) {
        searchData.value.categroy = []
      }

    }
  }


  return { dataList, searchData, loading, page, scheme, btns, column, screen, stateInfo, statistics, handleColumn, setRouterInfo }
}

