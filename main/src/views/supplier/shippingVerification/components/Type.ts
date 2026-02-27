import { Ref } from 'vue';

export class PageItem {
  size: number;
  page: number;
  total: number;
  constructor(data: any = {}) {
    this.size = data?.size || 10;
    this.page = data?.current || 1;
    this.total = data?.total || 0;
  }
}

export class SearchItem {
  txt:string ='';
  sku:string ='';
  goodsCode:string = '';
  status:string = '';
  supplierName:string = '';
  scPurchaseOrderNo:string = '';
}

export class DataItem {
  store: string = '';
  customerName: string = '';
  orderNo: string = '';
  customerId: string = '';
  violatingPublicOpinion: string = '';
  productId: string = '';
  problemRemark: string = '';
  rootCause: string = '';
  specificReason: string = '';
  inspectionTime: string = '';
  id: string = '';
  expectHandleTime: string = '';
  customerPlanTimeService: string = '';
  customerTimeFeedback: string = '';
  customerTimeHandle: string = '';
  handler: string = '';
  handlerAvatarOrigin: string = '';
  handlerName: string = '';
  imagesUrls: string = '';
  warehouseIssueComplete: any;
  completeTime: string = '';
  feedbackResult: string = '';
  handleUrls: string = '';
  isHandle: number = 0;
}

export interface TabsProvideType {
  activeValue: Ref<String>;
  permissionList: Ref<Array<any>>;
  roleList: Ref<Array<any>>;
  getDataList: () => void;
  detailsView: (row: any, type: string) => void;
}

export interface DetailProvideType {
  dataValue: Ref<DataItem>;
  disabled: Ref<boolean>;
  isStorage: Ref<boolean>;
  type: Ref<String>;
  feedBackOptions: Ref<Array<any>>;
  updetaValue: (value: DataItem) => void;
}


export const warehouseIssueCompleteOptions: Array<any> = [
  { label: '已完成', value: 1 },
  { label: '未完成', value: 0 }
];
export const filterStatusOption = [
  { label: '待排产', value: '10', color: '#9737EB', bg: '#F2E3FF' },
  { label: '工厂确认', value: '13', color: 'rgba(5, 162, 173, 1)', bg: 'rgba(189, 242, 246, 1)' },
  { label: '已发货', value: '20', color: '#349B34', bg: 'rgba(52, 155, 52, 0.2)' },
  { label: '部分到货', value: '30', color: 'rgba(230, 55, 130, 1)', bg: 'rgba(230, 55, 130, 0.2)' },
  // { label: '已清单', value: '40', color: '#349B34', bg: 'rgba(52, 155, 52, 0.2)' },
  // { label: '手动结单', value: '50', color: '#0064FF', bg: 'rgba(0, 100, 255, 0.2)' },
  // { label: '变更中', value: '99', color: '#3E47FA', bg: '#E6E8FF' }
]