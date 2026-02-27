// 表格数据结构
export class DataItem {
  qualityInspectionCycle: number = 1;  //质检周期 1.初期；2.中期；3.尾期
  supplier: string = '';   //供应商(来自供应链中心-供应商-供应商管理全部供应商,取简称字段) supplier_basic_info主鍵id
  itemNumberIds: number | null = null;   //商品款号(来自供应链中心-货品信息-货品编码字段)  wdt_goods表goods_id
  itemNumberNames: string = '';
  styleDescription: number | null = null;   //款式描述（关联字典style_description）
  submissionDate: string = '';  //日期
  checksNumber: number | null | string = null;   //第几次抽查
  materialsAccessoriesTest: string = '';  //面辅料测试(1.已做、0.未做)
  inspectionRecord: string = ''; //巡检记录(1.已做、0.未做)
  finishProductCheckRecord: string = '';  //成品抽查记录(1.已做、0.未做)
  dimenMeasureList: Array<DimenItem> = [];
  problemDescriptionList: Array<ProblemItem> = [];
  testResults: string = '1';
  fileIds: string = '';
  packagingFileIds: string = '';
  productFileIds: string = '';
  inspectionColorFileIds: string = '';
  logoFileIds: string = '';
  certificateFileIds: string = '';
  durabilityLabelFileIds: string = '';
  packQuantityFileIds: string = '';
  deliveryTime: string = '';
  num: number | null = null;
  packQuantity: number | null = null;
  crop: number | null = null;
  sew: number | null = null;
  inspection: number | null = null;
  pack: number | null = null;
  orderFollowId: string = '';
  fabricColor: string = '';
  fabricCylinderDifference: string = '';
  fabricFeelWool: string = '';
  fabricGramWeight: string = '';
  fabricOrgan: string = '';
  fabricFeel: string = '';
  fabricPrint: string = '';
  fabricHomeWash: string = '';
  accessMainLabel: string = '';
  accessOrnament: string = '';
  accessRubberBand: string = '';
  accessIngredient: string = '';
  accessCareLabel: string = '';
  accessSuture: string = '';
  accessLogo: string = '';
  accessCertificate: string = '';
  packagFoldingMethod: string = '';
  packagBulk: string = '';
  packagBox: string = '';
  packagBag: string = '';
  institutionalTestFabric: string = '';
  institutionalReadyWear: string = '';
  institutionalLining: string = '';
  institutionalFunction: string = '';
  chestPatchesProductProcess: string = '';
  chestPatchesProductProcessList: Array<string> = [];
  chestPatchesStyle: string = '';
  chestPatchesStyleList: Array<string> = [];
  packingMethod: string = '';
  packingMethodList: Array<string> = [];
  measureSituation: string = '';
  spotCheckPlanList: Array<SpotCheckPlanItem> = [];
  defectDescriptionList: Array<DefectDescriptionItem> = [{ ...new DefectDescriptionItem() }];
  orderFollowIds: Array<string> = [];
  id?: string = '';
  scPurchaseOrderNo: string = ''
};

export class DefectDescriptionItem {
  defect: string = '';
  serious: number | null = null;
  slight: number | null = null;
  image: string = '';
}

export class SpotCheckPlanItem {
  batchRangeName: string = '';
  sampleSize: string = '';
  onePointFiveAc: string = '';
  onePointFiveRe: string = '';
  twoPointFiveAc: string = '';
  twoPointFiveRe: string = '';
  isHit: string = '';
}

export class DimenItem {
  partName: string = '';
  tolerance: string = '';
  sizeDetailsOne: Object = { standard: '', sample: '' };
  sizeDetailsTwo: Object = { standard: '', sample: '' };
  sizeDetailsThree: Object = { standard: '', sample: '' };
  sizeDetailsFour: Object = { standard: '', sample: '' };
}

export class ProblemItem {
  number: string = '';
  problemDescription: string = '';
}

// 通用入参
export const useDetails = (params: any = {}) => {
  const route = useRoute();

  const viewType = ref<string>('view'), queryInfo = ref<any>({});

  const initRouter = (fun: Function = () => { }) => {
    queryInfo.value = { ...route.query };
    viewType.value = String(route?.query?.type || 'view');
    fun();
  };

  return { viewType, queryInfo, initRouter }
}

