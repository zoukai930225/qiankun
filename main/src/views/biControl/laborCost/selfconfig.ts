export enum scopNames {
  channel = 'channel',
  store = 'store',
  category = 'category',
  product = 'goods',
  warehouse = 'warehouse'
}
export enum includeTypes {
  include = 1,
  uninclude = 2,
}
export enum scopeTypes {
  and = 'and',
  or = 'or',
}

export enum conditionTypes {
  single = 'single',
  group = 'group'
}

export enum channelTypes {
  Tmall = 'Tmall',
  Douyin = 'Douyin',
  TaoBao = 'TaoBao',
  Pdd = 'Pdd'
}

export interface ConditionDTO {
  //自定义费用值(货品/渠道/店铺/仓库) - 当为类目值时，value传渠道
  value: string;
  //一级类目名称
  primaryCategory?: string;
  //二级类目名称
  secondaryCategory?: string;
  // 三级类目名称
  leafCategory?: string;
  // 四级类目名称
  fourthCategory?: string;
  //类目级别
  categoryLevel?: number;
}
interface ScopeConditionDTO {
  scopeName: scopNames | '';
  nameType: string;
  //包含类型 1-包含 2-不包含
  includeType: includeTypes | '';
  cateObjList: ConditionDTO[] | [];
  categoryNameStr: string | null;
}
export interface ScopeListDTO {
  scopeType: string;
  type: string;
  condition: ScopeConditionDTO | null;
}

export interface ScopeNodeDTO {
  scopeType: scopeTypes | '';
  //single-条件 group-条件组
  type: conditionTypes;
  condition: ScopeConditionDTO | null;
  list: ScopeListDTO[] | null;
}

export const scopeNameList = [{
  name: '按渠道',
  value: scopNames.channel
},
{
  name: '按店铺',
  value: scopNames.store
}, {
  name: '按类目',
  value: scopNames.category
}, {
  name: '按货品',
  value: scopNames.product
}, {
  name: '按仓库',
  value: scopNames.warehouse
}]

export enum categoryNames {
  dianshang = 'eCategory',
  oldstandard = 'swOldStandardCategory',
  standard = 'swStandardCategory',
}

export const categoryList = [{
  name: '电商类目',
  value: categoryNames.dianshang
},
{
  name: 'SW标准类目(old)',
  value: categoryNames.oldstandard
}, {
  name: 'SW标准类目',
  value: categoryNames.standard
}
]


export const includeList = [{
  name: '包含',
  value: includeTypes.include
},
{
  name: '不包含',
  value: includeTypes.uninclude
}]

export const scopeTypeList = [{
  name: '且',
  value: scopeTypes.and
},
{
  name: '或',
  value: scopeTypes.or
}]

export const channelList = [{
  name: '拼多多',
  value: channelTypes.Pdd
},
{
  name: '抖音',
  value: channelTypes.Douyin
}, {
  name: '天猫',
  value: channelTypes.Tmall
}, {
  name: '淘宝',
  value: channelTypes.TaoBao
}]

//单个条件class
export class conditionClass {
  scopeType: string = '';
  type: string = conditionTypes.single;
  condition: ScopeConditionDTO = {
    scopeName: "",
    nameType: "",
    includeType: "",
    cateObjList: [],
    categoryNameStr: null
  }
};