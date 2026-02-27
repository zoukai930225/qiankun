import LineAvatar from "@/components/template/table/components/lineAvatar.vue";
import LineTages from "@/components/template/table/components/lineTage.vue";
import { PageItem, Screen } from '@/components/template/config/type';
import SelectUser from '@/components/common/user/selectUser.vue';
import StyleNumber from "../components/styleNumber.vue";
import { useUserStore } from '@/store/modules/user';
import { getDictLabel } from '@/utils/dict';
import LineImage from "@/components/template/table/components/lineImage.vue";
import { ElLink } from "element-plus";

// 查询结构
export class SearchItem {
  scPurchaseOrderNo: string = '';
  time: Array<string> = [];
  qualityInspectionCycle: string = '';
  qualityInspectionCycles: Array<string> = [];
  supplier: string = '';
  suppliers: Array<string> = [];
  itemNumberIds: string = '';
  itemNumberId: Array<any> = [];
  itemNumberName: Array<string> = [];
  styleDescription: string = '';
  styleDescriptions: Array<string> = [];
  createdId: string = '';
  createdIds: Array<string> = [];
  testResults: string = '';
  testResult: Array<string> = [];
};

// 表格数据结构
export class DataItem {
  id: string = '';
};

// 通用入参
export const usePage = (params: any = {}) => {
  const user: any = useUserStore().user || {};

  const route = useRoute();
  const router = useRouter();

  // 外部组件入参
  const { cycle, userInfo, optionInfo, supplierList, categoryDic } = params;

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]), stateInfo = ref<any>({}), statistics = ref<any>({});

  const searchData = ref<SearchItem>({ ...new SearchItem() }), loading = ref<boolean>(false), page = ref<PageItem>({ ...new PageItem() });

  const testResults = reactive([{ label: '通过', value: 1, color: '#349B34', background: '#D6EBD6' }, { label: '不通过', value: 0, color: '#EB3737', background: 'rgba(235, 55, 55, 0.1)' }]);

  // 查询配置(必配)
  const scheme = computed(() => ([
    { field: 'scPurchaseOrderNo', label: ['生产订单','号'],componentProps: { placeholder: '请输入生产订单号',clearable: true } },
    { field: 'time', label: '日期', component: 'DatePicker', width: 210, componentProps: { type: 'daterange', valueFormat: 'YYYY-MM-DD', format: 'YYYY-MM-DD' } },
    { field: 'qualityInspectionCycles', label: '质检周期', component: 'Select', options: cycle.value, componentProps: { multiple: true, collapseTags: true, collapseTagsTooltip: true, clearable: true } },
    { field: 'suppliers', label: '供应商', component: 'SelectV2', options: supplierList.value, componentProps: { multiple: true, collapseTags: true, collapseTagsTooltip: true, clearable: true } },
    { field: 'itemNumberId', label: '款号', isCustom: true, customRender: (_item, _model) => <StyleNumber v-model:name={searchData.value.itemNumberName} componentProps={{ multiple: true, collapseTags: true, collapseTagsTooltip: true, clearable: true }} />},
    { field: 'productType', label: '商品类型', component: 'Select', options: optionInfo.value.productType},
    { field: 'styleDescriptions', label: '款式描述', component: 'Select', options: categoryDic.value, componentProps: { multiple: true, collapseTags: true, collapseTagsTooltip: true, clearable: true } },
    { field: 'createdIds', label: '登记人', isCustom: true, customRender: (_item, _model) => <SelectUser role={userInfo.value.role} /> }
  ]));

  // 状态筛选(非必配)
  const screen = computed(() => ({ ...new Screen({ field: 'testResult', label: '检测结果:', options: testResults, props: {} }) }));

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => ([
    { fun: 'cusAdd', txt: '新增', type: 'primary', display: () => !userInfo?.value?.isAdd },
    { fun: 'export', txt: '导出', type: 'primary', api: `/api/qcQualityInspectionReportInfo/export`, method: 'downloadPost', exportName: `QC质检报告汇总表.xlsx` },
  ]));

  const getCategoryName = (list: any, value: string) => {
    if(!value) return
    const tar = list.find((item: any) => item.value === value)
    return tar && tar.label
  }

  // 表格配置(非必配)
  const column = computed(() => ([
    { field: 'scPurchaseOrderNo', title: '生产订单号', width: 120, fixed: 'left',isCustom: true, customRender: (_item) =>  _item.scPurchaseOrderNo? <ElLink underline='never' type="primary" size="small" onClick={() => router.push({ name: 'ShippingVerification', query: { scPurchaseOrderNo: _item.scPurchaseOrderNo } })} >{_item.scPurchaseOrderNo}</ElLink> : <span>-</span> },
    { field: 'submissionDate', title: '日期', width: 120, fixed: 'left' },
    { field: 'qualityInspectionCycle', title: '质检周期', minWidth: 110, fixed: 'left', isFormatter: true, formatter: (_item) => _item.qualityInspectionCycle === 1 ? '初期' : (_item.qualityInspectionCycle === 2 ? '中期' : '尾期') },
    { field: 'abbreviationCompany', title: '供应商', minWidth: 120 },
    { field: 'goodsNo', title: '款号', minWidth: 120 },
    { field: 'productType', title: '商品类型', minWidth: 120, isFormatter: true, formatter: (_item) => getDictLabel('np_design_product_type', _item.productType) || '-'  },
    { field: 'styleDescription', title: '款式描述', minWidth: 120, isFormatter: true, formatter: (_item) => getCategoryName(categoryDic.value, _item.styleDescription) || '-' },
    { field: 'materialsAccessoriesTest', title: '面辅料测试', minWidth: 120,isCustom: true, customRender: (_item) =>_item.materialsAccessoriesTest === null?<span>-</span>:  <LineTages txt={Number(_item.materialsAccessoriesTest) === 1 ? '已做':'未做'} background={Number(_item.materialsAccessoriesTest) === 1 ? '#D6EBD6':'rgba(102, 102, 102, 0.2)'} color={Number(_item.materialsAccessoriesTest) === 1 ? '#349B34' : '#666'} /> },
    { field: 'inspectionRecord', title: '巡检记录', minWidth: 120,isFormatter: true, formatter: (_item) =>_item.inspectionRecord === null ? <span>-</span>: <LineTages txt={Number(_item.inspectionRecord) === 1 ? '已做':'未做'} background={Number(_item.inspectionRecord) === 1 ? '#D6EBD6':'rgba(102, 102, 102, 0.2)'} color={Number(_item.inspectionRecord) === 1 ? '#349B34' : '#666'} /> },
    { field: 'finishProductCheckRecord', title: '成品抽检记录', minWidth: 120,isFormatter: true, formatter: (_item) => _item.finishProductCheckRecord === null ?<span>-</span>: <LineTages txt={Number(_item.finishProductCheckRecord) === 1 ? '已做':'未做'} background={Number(_item.finishProductCheckRecord) === 1 ? '#D6EBD6':'rgba(102, 102, 102, 0.2)'} color={Number(_item.finishProductCheckRecord) === 1 ? '#349B34' : '#666'} /> },
    { field: 'templateCheck', title: '样板核对', minWidth: 120,isFormatter: true, formatter: (_item) =>_item.templateCheck === null?<span>-</span>: <LineTages txt={Number(_item.templateCheck) === 1 ? '已核对':'未核对'} background={Number(_item.templateCheck) === 1 ? '#D6EBD6':'rgba(102, 102, 102, 0.2)'} color={Number(_item.templateCheck) === 1 ? '#349B34' : '#666'} /> },
    { field: 'num', title: '验货数量', minWidth: 120 },
    { field: 'spotCheckNum', title: '抽验数量', minWidth: 120 },
    { field: 'defectNum', title: '疵点数量', minWidth: 120 },
    { field: 'spotCheckRate', title: '抽验数次品率', tipsWidth: 300, tips: `抽验数次品率=疵点数/抽验数量*100%`, minWidth: 120 },
    { field: 'orderMultipleTimesYieldRate', title: '订单数次品率', tipsWidth: 300, tips: `订单数次品率=疵点数/验货数量*100%`, minWidth: 120 },
    { field: 'testResults', title: '检测结果',fixed: 'right', width: 95, isCustom: true, customRender: (_item) => <LineTages txt={getDicInfo(_item.testResults, 'label')} background={getDicInfo(_item.testResults, 'background')} color={getDicInfo(_item.testResults, 'color')} /> },
    { field: 'createName', title: '登记人', width: 120, isCustom: true, customRender: (_item) => <LineAvatar user={{ name: _item.createName, avatarOrigin: _item.createAvatarOrigin }} /> },
    { field: 'comment', title: '评语', minWidth: 120 },
    { field: 'mainFileIds', title: '签字附件', minWidth: 120,isCustom: true, customRender: (_item) => <LineImage urls={_item.mainFileIds} />  },
  ]));

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改) 
  const handleColumn = computed(() => ([
    { fun: 'view', txt: '查看', reveal: (_item) => true},
    { fun: 'preview', txt: '打印预览', reveal: (_item) => user.id === _item.createdId },
    { fun: 'edit', txt: '编辑', reveal: (_item) => user.id === _item.createdId },
    { fun: 'attachUpload', txt: '附件上传', reveal: (_item) => user.id === _item.createdId },
    { fun: 'del', txt: '删除', type: 'danger', reveal: (_item) => user.id === _item.createdId && Number(_item.testResults) !== 1, api: '/api/qcQualityInspectionReportInfo/deleteById', method: 'post' },
  ]));

  const getDicInfo = (value: any, name: string = 'color') => {
    const tar: any = testResults.find((dic: any) => dic.value === Number(value));
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
      if (JSON.stringify(route.query) !== JSON.stringify({ operate: 'refresh' })) {
        searchData.value = { ...searchData.value, ...params };
        const newUrl = window.location.href.replace(/\?.*$/, '');
        history.replaceState({}, '', newUrl)
      }
    };
  };

  return { dataList, searchData, loading, page, scheme, btns, column, screen, stateInfo, statistics, handleColumn, setRouterInfo }
}

