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

export class ModelLibPageItem{
  size: number;
  page: number;
  total: number;
  constructor(data: any = {}) {
    this.size = data?.size || 12;
    this.page = data?.current || 1;
    this.total = data?.total || 0;
  }
}

export class SearchItem {
  name: string = '';
  modelType: string = '';
  productType: string = '';
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