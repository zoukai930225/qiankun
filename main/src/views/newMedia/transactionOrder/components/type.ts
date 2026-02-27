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
  self: boolean = false;
  keyword: string = '';
  categoryName: string = '';
  store: string = '';
  stores: string = '';
  salePoint: string = '';
  statuses: Array<number> = [];
  created: Array<number> = [];
  createdUser: string = '';
  commentCreated: Array<number> = [];
  commentCreatedUser: string = '';
  middlegroundCreated: Array<number> = [];
  middlegroundCreatedUser: string = '';
}

export class DataItem {
  middlegroundCreatedId: string = '';
  goodsId: string = '';
  goodsCode: string = '';
  categoryId: string = '';
  categoryName: string = '';
  goodsName: string = '';
  store: string = '';
  storeName: string = '';
  orderSku: string = '';
  salePoint: string = '';
  expectedDate: string = '';
  orderCount: number | null = null;
  isCommit: number | null = null;
  middlegroundIsCommit: number | null = null;
  commentIsCommit: number | null = null;
  id: string = '';
  batchId: string = '';
  link: string = '';
  status: number = 0;
  commentId: string = '';
  contentExpectedDate: string = '';
  commentSalePoint: string = '';
  mainComment: string = '';
  mainCommentLink: string = '';
  mainCommentLinks: Array<string> = [];
  followupComment: string = '';
  followupCommentLink: string = '';
  followupCommentLinks: Array<string> = [];
  contentStatus: number = 0;
  middlegroundId: string = '';
  orderExpectedDate: string = '';
  orderNo: string = '';
  payAmount: number = 0;
  commentStatus: number | null | string = null;
  commission: number = 0;
  accountId: string = '';
  // invalidCost: number = 2.15;
  // invalidFreightCost: number = 1.65;
  // invalidGoodsCode: string = 'C110-lan-F';
  invalidCost: number | null = null;
  invalidFreightCost: number | null = null;
  invalidGoodsCode: string = ' ';
  commentLinks: string = '';
  commentLinkFiles: Array<string> = [];
  commentCreatedId: string = '';
  commentStatuslist: Array<any> = [];
  commit: number = 0;
}

export const statusOptions: Array<any> = [
  { label: '待接单', value: 10, color: '#f3784433', txt: '#F37844' },
  { label: '已接单', value: 20, color: '#5db30033', txt: '#5DB300' },
  { label: '待补单', value: 30, color: '#f3784433', txt: '#F37844' },
  { label: '已完成', value: 40, color: '#5db30033', txt: '#5DB300' }
];

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
  updetaValue: (value: DataItem) => void;
}