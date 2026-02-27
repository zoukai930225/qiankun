import LineAvatar from "@/components/template/table/components/lineAvatar.vue";
import { PageItem, Screen } from '@/components/template/config/type';
import dayjs from "dayjs";
import { ElTag,ElLink,ElCascader,ElText } from "element-plus";
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import LineImage from '@/components/template/table/components/lineImage.vue'
import LineVideo from '@/components/template/table/components/lineVideo.vue'
import GoodCode from '@/components/template/query/components/goodCode.vue'

const yesterday = dayjs().subtract(1, 'day')

const startOfYesterday = yesterday.startOf('day').format('YYYY-MM-DD')
const endOfYesterday = yesterday.endOf('day').format('YYYY-MM-DD')

// 查询结构
export class SearchItem {
  store: string[] = [];// 店铺编码
  stores?: Array<any> = []; // 店铺
  goodsParam: string = ''; // 商品ID/商品编码
  goodsCode: string[] = []; // 商品编码
  classification?: Array<any> = []; // 分类
  primaryClassification: string[] = []; // 一级分类
  secondaryClassification: string[] = []; // 二级分类
  isHasPicture: string = ''; // 是否有图
  startTime: string = ''; // 初次评价开始日期
  endTime: string = ''; // 初次评价结束日期
  dateRange?: string[] = [startOfYesterday, endOfYesterday]; // 评价时间范围
  type?: string[] = []; // 评价类型
};

// 表格数据结构
export class DataItem {
  id: string = '';
};

// 通用入参
export const usePage = (params: any = {}) => {

  const route = useRoute();

  // 外部组件入参
  const { userInfo, negativeReviewDashboardStore, storeList, oneLevelList } = params;

  // 获取店铺名称
  const getStoreName = (storeCode: string) => {
    if (!storeCode) return ''
    const store = negativeReviewDashboardStore.storeList?.find((item) => item.storeCode === storeCode)
    return store?.storeName || ''
  }
  // 评价类型标签：中评→warning；差评/负面评价→danger
 const getTypeMeta = (type: string | null | undefined)=>{
    const defaultMeta: { name: string; tagType?: 'warning' | 'danger' | 'success' } = { name: '' }
    if (!type || type.trim() === '') return defaultMeta

    const trimmedType = type.trim()
    if (trimmedType === '1') return { name: '好评', tagType: 'success' }
    if (trimmedType === '2') return { name: '中评', tagType: 'warning' }
    if (trimmedType === '3') return { name: '差评', tagType: 'danger' }
    if (trimmedType === '4') return { name: '负面评价', tagType: 'danger' }
    return defaultMeta
 }

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  // 查询配置(必配)
  const scheme = computed(() => ([
    { field: 'goodsParam', 
      label: '商品主键' ,
      componentProps: {
        placeholder: '请输入商品ID/商品编码'
      }
    },
    {
      field:'goodsCode',
      label: '商品编码',
      isCustom: true,
      customRender: (_item) => <GoodCode 
        url={'/api/qcQualityInspectionReportInfo/selectWdtGoodsList50'} 
        placeholder={'请选择商品编码'} 
        paramsValue={{label:'goodsNo',value:'goodsNo'}}
        multiple={true}
        name={'goodsNo'}
      />,
    },
    {
      field:'dateRange',
      label:['初次评价','日期'],
      component: 'DatePicker',
      width: 200,
      componentProps: {
        type: 'daterange',
        rangeSeparator: '-',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD'
      }
    },{
      field: 'stores',
      label: '店铺',
      component: 'Select',
      options:storeList.value?.map((item) => ({ label: item.storeName, value: item })) || [],
      componentProps: {
        multiple: true,
        filterable: true,
        clearable: true,
        valueKey: 'storeCode',
        collapseTags: true,
        collapseTooltip: true,
        // options: negativeReviewDashboardStore.storeList?.map((item) => ({ label: item.storeName, value: item.storeCode })) || [],
      }
    },{
      field: 'classification',
      label: '分类',
      isCustom: true,
      customRender: (_item) => <ElCascader  options={oneLevelList.value} props={{multiple: true}} clearable collapse-tags collapse-tags-tooltip/>,
    },{
      field: 'isHasPicture',
      label: '是否有图',
      component: 'Select',
      options: getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)

    },{
      field: 'type',
      label: '评价类型',
      component: 'Select',
      options: [{ label: '好评', value: '1' },{ label: '中评', value: '2' }, { label: '差评', value: '3' }, { label: '负面评价', value: '4' }],
      componentProps: {
        multiple: true,
        filterable: true,
        clearable: true,
      }
    }
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
    { fun: 'export', txt: '导出', type: 'primary', api: `/api/evaluationBoard/listExportNew`, method: 'downloadPost', exportName: '中差评数据看板' },
    { fun: 'reason', txt: '评价看板', type: 'primary',},
    { fun: 'number', txt: '数据看板', type: 'primary',},
  ]));

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'store', title: '店铺', minWidth: 210, fixed: 'left', isFormatter: true, formatter: (_item) => getStoreName(_item.store) },
    { field: 'month', title: '月份', minWidth: 100 },
    { field: 'monthWithWeek', title: '周度', minWidth: 100 },
    { field: 'firstEvaluate', title: '初次评价日期', minWidth: 180 },
    { field: 'type', title: '评价类型', minWidth: 100, isCustom: true, customRender: (_item) => _item.type ? <ElTag type={getTypeMeta(_item.type).tagType} round hit={false}>{ getTypeMeta(_item.type).name }</ElTag> : <span>-</span> },
    { field: 'number', title: '数量', minWidth: 100 },
    { field: 'goodsId', title: '商品ID', minWidth: 200 },
    { field: 'goodsCode', title: '商品编码', minWidth: 300 },
    { field: 'categoryName', title: '产品类目', minWidth: 300 },
    { field: 'orderNo', title: '订单号', minWidth: 200 },
    { field: 'content', title: '评价内容', minWidth: 200 },
    { field: 'primaryClassification', title: '一级分类', minWidth: 200 },
    { field: 'secondaryClassification', title: '二级分类', minWidth: 200 },
    { field: 'commentStatus', title: '是否已处置', minWidth: 100, isFormatter: true, formatter: (_item) =>  _item.commentStatus === null? '-' : _item.commentStatus === 1 ? '是' : '否' },
    { field: 'imgUrls', title: '图片链接', minWidth: 200, isCustom: true, customRender: (_item) => _item.imgUrls ? <LineImage urls={_item.imgUrls} /> : <span>-</span> },
    { field: 'videoUrls', title: '视频链接', minWidth: 200, isCustom: true, customRender: (_item) => _item.videoUrls ? <LineVideo urls={_item.videoUrls} title='视频'/> : <span>-</span> },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun:'editClassification',txt:'编辑分类'}
    // { fun: 'view', txt: '详情' },
    // { fun: 'edit', txt: '编辑', reveal: (_item) => !!userInfo?.value?.isManagement ? true : (!_item.isStop && !!_item?.isSubordinate) },
  ]));

  const setRouterInfo = () => {
    let params:  any = {};
    const param: any = route.params;
    const query: any = route.query;
    Object.keys(param).forEach(key => {
      params[key] = param[key];
    });
    Object.keys(query).forEach(key => {
      params[key] = query[key];
    });
    if (Object.keys(params).length !== 0) {
      searchData.value = { ...searchData.value, ...params};
      searchData.value.dateRange = [params?.startTime,params?.endTime];
      searchData.value.type = params?.isNegativeReview === '1' ? ['2','3','4'] :  [];
      const newUrl = window.location.href.replace(/\?.*$/, '');
      history.replaceState({}, '', newUrl)
    };
  };

  return { dataList, searchData, loading, page, scheme, btns, column, screen, stateInfo, statistics, handleColumn, setRouterInfo }
}

