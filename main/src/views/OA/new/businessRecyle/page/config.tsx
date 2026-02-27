import LineAvatar from "@/components/template/table/components/lineAvatar.vue";
import LineImage from "@/components/template/table/components/lineImage.vue";
import LineTages from "@/components/template/table/components/lineTage.vue";
import LineFile from "@/components/template/table/components/lineFile.vue";
import { PageItem } from '@/components/template/config/type';
import { DICT_TYPE, getDictLabel } from '@/utils/dict'

// 查询结构
export class SearchItem {
  planName: string = '';
  planCode: string = '';
  productNumber: string = '';
  productCode: string = '';
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
    { field: 'planName', label: '企划名称' },
    { field: 'productCode', label: '货品编码' },
    { field: 'planCode', label: '任务编码' },
    { field: 'productNumber', label: '产品编号' },
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({}));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'planName', title: '企划名称', minWidth: 220, fixed: 'left' },
    { field: 'planType', title: '企划类型', width: 100, isCustom: true, customRender: (_item) => <LineTages txt={getDictLabel(DICT_TYPE.NP_ENTERPRISE_PLANTYPE, Number(_item.planType || '')) || '--'} background={getDicInfo(_item.planType, 'background')} color={getDicInfo(_item.planType, 'color')} /> },
    { field: 'productType', title: '企划类型', width: 100, isCustom: true, customRender: (_item) => <LineTages txt={getDictLabel(DICT_TYPE.NP_CATEGORY_PRODUCT_TYPE, Number(_item.productType || '')) || '--'} background={getDicInfo(_item.productType, 'background', productTypeList)} color={getDicInfo(_item.productType, 'color', productTypeList)} /> },
    { field: 'level', title: '产品等级', width: 150, isFormatter: true, formatter: (_item) => getDictLabel(DICT_TYPE.NP_PRODUCTGRADE, _item.level) || '--' },
    { field: 'productPicture', title: '设计图', width: 90, isCustom: true, customRender: (_item) => <LineImage urls={_item.productPicture} /> },
    { field: 'planCode', title: '任务编号', minWidth: 189 },
    { field: 'productNumber', title: '产品编号', minWidth: 220 },
    { field: 'productCode', title: '货品编码', minWidth: 220 },
    { field: 'recycleReason', title: '回收原因', minWidth: 150, fixed: 'right' },
    { field: 'recyclePersonName', title: '回收人', minWidth: 120, fixed: 'right', isCustom: true, customRender: (_item) => <LineAvatar user={_item} name={'recyclePersonName'} image={'recyclePersonAvatarOrigin'} /> },
    { field: 'createdAt', title: '回收时间', minWidth: 180, fixed: 'right' },
    { field: 'recycleAttachmentUrl', title: '回收附件', width: 150, fixed: 'right', isCustom: true, customRender: (_item) => <LineFile info={_item} url={'recycleAttachmentUrl'} /> }
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([]));

  const planTypeList = reactive([
    { value: 0, color: '#03A3B6', background: '#B7EEF6' },
    { value: 1, color: '#F35CAA', background: '#FFDCF0' },
    { value: 2, color: '#349B34', background: '#D6EBD6' },
    { value: 3, color: '#0064FF', background: '#CCE0FF' },
  ]);

  const productTypeList = reactive([
    { value: 0, color: '#03A3B6', background: '#B7EEF6' },
    { value: 1, color: '#CD8200', background: '#FFF4C8' },
  ]);

  const getDicInfo = (value: any, name: string = 'color', list: any = planTypeList) => {
    const tar: any = list.find((dic: any) => dic.value === Number(value));
    return tar && tar[name] ? tar[name] : '';
  };

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

