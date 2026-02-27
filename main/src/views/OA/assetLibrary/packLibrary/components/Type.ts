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
export class GoodsPageItem {
  size: number;
  page: number;
  total: number;
  constructor(data: any = {}) {
    this.size = data?.size || 16;
    this.page = data?.current || 1;
    this.total = data?.total || 0;
  }
}