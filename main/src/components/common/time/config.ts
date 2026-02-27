
export class OffsetItem {
  // 时间类型（day,week,month,year）
  type: string;
  // 偏移方式（subtract，add）
  mode: string;
  // 偏移值
  offset: number | null;
  // 原点时间
  origin: any;
  constructor(data: any = {}) {
    this.type = data?.type || 'day';
    this.mode = data?.mode || 'subtract';
    this.offset = data?.offset || null;
    this.origin = data?.origin || new Date();
  }
};
export class TimeItem {
  // 名称
  label: string;
  // 序号
  index: number;
  // 提示词
  tips: string;
  // 是否为时间组件
  isComponents: boolean;
  // 非组件时间查询区间参数
  timeOffset: OffsetItem;
  // 外部入参
  params: Object;
  // 格式化
  format: string;
  // 组件类型
  componentType: string;
  // 禁用方法
  disabledDate: Function;
  // 时间限制区间
  timeLimit: any;
  // 确认前回调
  beforeConfirme: Function;
  constructor(data: any = {}) {
    this.label = data?.label || '';
    this.index = data?.index || 0;
    this.tips = data?.tips || '';
    this.isComponents = data?.isComponents || false;
    this.params = data?.params || {};
    this.timeOffset = data?.timeOffset || new OffsetItem();
    this.format = data?.format || 'YYYY-MM-DD';
    this.componentType = data?.componentType || 'date';
    this.disabledDate = data?.disabledDate || (() => { return false });
    this.beforeConfirme = data?.beforeConfirme || (() => { return true });
    this.timeLimit = data?.timeLimit || [null, null];
  }
};

export const componentConfig: Array<TimeItem> = [
  { label: '日', tips: '支持对符合所选日期的数据进行分析', isComponents: true, format: 'YYYY-MM-DD', componentType: 'date' },
  { label: '周', tips: '支持对符合所选周区间内的数据进行分析', isComponents: true, format: 'YYYY-MM-DD', componentType: 'week' },
  { label: '月', tips: '支持对符合所选月度区间内的数据进行分析', isComponents: true, format: 'YYYY-MM', componentType: 'month' },
  { label: '年', tips: '支持对符合所选年份区间内的数据进行分析', isComponents: true, format: 'YYYY', componentType: 'year' },
  { label: '自定义', tips: `自定义支持在可选时间范围内,对任意连续最多31天的数据进行分析`, isComponents: true, format: 'YYYY-MM-DD', componentType: 'daterange' },
].map((item: any, index: number) => ({ ...item, index }));

export const typeMapLabel = (label: string) => {
  const tar: any = [
    { label: '日', type: 'day' },
    { label: '周', type: 'week' },
    { label: '月', type: 'month' },
    { label: '年', type: 'year' },
  ].find((tbs: any) => tbs.label === label);
  return tar?.type || 'day';
};