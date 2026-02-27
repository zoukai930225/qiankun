import { PageItem, Screen } from '@/components/template/config/type';
import ChannelCell from "@/views/dutyRight/channel/components/channelCell.vue";
import DirectorsCell from "@/views/dutyRight/channel/components/directorsCell.vue";
import DirectorsTimeCell from "@/views/dutyRight/channel/components/directorsTimeCell.vue";
import StoreCascader from "@/components/BIStoreCascader/src/storeCascader.vue"
import StoreCell from '../components/storeCell.vue';
import SelectPeople from "../../components/selectPeople.vue"
// 查询结构
export class SearchItem {
  validFlag: Array<number> = [1];
  storeCode: Array<any> = [];
  hasDirector: string = '';
  directorId: Array<any> = [];
};

// 表格数据结构
export class DataItem {
  bizType: number = 1;
  bizIds: Array<any> = [];
  directors: Array<any> = [];
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
    {
      field: 'storeCode', label: '店铺', width: 220, isCustom: true, customRender: () =>
        <StoreCascader cascaderProps={{ multiple: true }} filterChannel={['TaoBao', 'Tmall', 'Pdd', 'Douyin']} 
        popperAppendToBody/>
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
      field: 'directorId', label: '负责人', width: 220, isCustom: true, customRender: () => <SelectPeople
        multiple={false} />
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
    { field: 'storeName', title: '店铺', width: 180, fixed: 'left', isCustom: true, customRender: (_item) => <StoreCell row={_item} /> },
    { field: 'channelCode', title: '渠道', width: 120, isCustom: true, customRender: (_item) => <ChannelCell row={_item} showIcon={false} /> },
    { field: 'directorVos', title: '当前负责人', width: 320, isCustom: true, customRender: (_item) => <DirectorsCell row={_item} /> },
    { field: 'directorVos', title: '当前责权时间', width: 700, minWidth: 700, isCustom: true, customRender: (_item) => <DirectorsTimeCell row={_item} /> },
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

  return { dataList, searchData, loading, page, scheme, btns, column, screen, stateInfo, statistics, handleColumn, setRouterInfo }
}

