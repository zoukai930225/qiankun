/**
 * 舆情类型与二级分类数据
 */

export interface OpinionTypeItem {
  value: string
  label: string
  children?: OpinionTypeItem[]
}
export const OPINION_TYPE_OPTIONS: OpinionTypeItem[] = [
  {
    value: '重大舆情',
    label: '重大舆情',
    children: [
      { value: '网红明星', label: '网红明星' },
      { value: '点赞量破50', label: '点赞量破50' },
      { value: '评论量破20', label: '评论量破20' },
      { value: '转发量破20', label: '转发量破20' }
    ]
  },
  {
    value: '人身伤害',
    label: '人身伤害',
    children: [
      { value: '泛红', label: '泛红' },
      { value: '起疹子', label: '起疹子' },
      { value: '发痒', label: '发痒' },
      { value: '红肿', label: '红肿' },
      { value: '其他过敏症状', label: '其他过敏症状' }
    ]
  },
  {
    value: '产品质量',
    label: '产品质量',
    children: [
      { value: '掉色', label: '掉色' },
      { value: '同尺码大小不一', label: '同尺码大小不一' },
      { value: '起球', label: '起球' },
      { value: '裆部线头', label: '裆部线头' },
      { value: '虫', label: '虫' },
      { value: '毛发', label: '毛发' },
      { value: '血渍', label: '血渍' },
      { value: '针', label: '针' },
      { value: '裆部污渍', label: '裆部污渍' },
      { value: '异味', label: '异味' },
      { value: '黑点', label: '黑点' },
      { value: '破损', label: '破损' },
      { value: '线头', label: '线头' },
      { value: '脏污', label: '脏污' },
      { value: '色差', label: '色差' },
      { value: '压痕', label: '压痕' },
      { value: '尺码偏大', label: '尺码偏大' },
      { value: '尺码偏小', label: '尺码偏小' },
      { value: '夹屁股', label: '夹屁股' },
      { value: '不粘', label: '不粘' },
      { value: '翘边', label: '翘边' },
      { value: '清洗不干净', label: '清洗不干净' },
      { value: '主观材质较差', label: '主观材质较差' },
      { value: '不透气', label: '不透气' },
      { value: '卷边', label: '卷边' },
      { value: '掉', label: '掉' },
      { value: '不好穿', label: '不好穿' },
      { value: '不聚拢', label: '不聚拢' },
      { value: '勒人', label: '勒人' },
      { value: '包装大', label: '包装大' },
      { value: '脱胶', label: '脱胶' },
      { value: '太薄了', label: '太薄了' },
      { value: '卡裆', label: '卡裆' },
      { value: '松', label: '松' },
      { value: '不是客户想要的材质', label: '不是客户想要的材质' },
      { value: '压胸', label: '压胸' },
      { value: '掉档', label: '掉档' },
      { value: '开线', label: '开线' },
      { value: '褶皱', label: '褶皱' },
      { value: '假冒合格产品', label: '假冒合格产品' },
      { value: '顾客感知质量一般', label: '顾客感知质量一般' },
      { value: '透', label: '透' },
      { value: '滑', label: '滑' },
      { value: '闷', label: '闷' },
      { value: '撕裂感太强', label: '撕裂感太强' },
      { value: '生锈', label: '生锈' },
      { value: '发霉', label: '发霉' },
      { value: '勾丝', label: '勾丝' },
      { value: '掉毛', label: '掉毛' },
      { value: '材质与页面不符', label: '材质与页面不符' },
      { value: '不隐形', label: '不隐形' },
      { value: '不显大', label: '不显大' },
      { value: '支撑性差', label: '支撑性差' },
      { value: '戳肉', label: '戳肉' },
      { value: '空杯', label: '空杯' },
      { value: '明显穿着痕迹', label: '明显穿着痕迹' },
      { value: '磨皮肤', label: '磨皮肤' },
      { value: '效果未达预期', label: '效果未达预期' },
      { value: '洗完发硬', label: '洗完发硬' },
      { value: '裆部发黄', label: '裆部发黄' },
      { value: '开胶', label: '开胶' },
      { value: '洗唛不牢', label: '洗唛不牢' },
      { value: '货不对板', label: '货不对板' },
      { value: '变形', label: '变形' },
      { value: '卡脚趾', label: '卡脚趾' },
      { value: '跑杯', label: '跑杯' }
    ]
  },
  {
    value: '服务态度',
    label: '服务态度',
    children: [
      { value: '客服服务态度差', label: '客服服务态度差' },
      { value: '物流服务态度差', label: '物流服务态度差' }
    ]
  },
  {
    value: '物流问题',
    label: '物流问题',
    children: [
      { value: '物流超时', label: '物流超时' },
      { value: '丢件', label: '丢件' },
      { value: '物流错分', label: '物流错分' },
      { value: '快递员态度差', label: '快递员态度差' },
      { value: '包裹破损', label: '包裹破损' },
      { value: '送达未通知', label: '送达未通知' },
      { value: '签收未收到（虚假签收）', label: '签收未收到（虚假签收）' },
      { value: '未发送取件码', label: '未发送取件码' },
      { value: '未投递成功', label: '未投递成功' },
      { value: '包装破损', label: '包装破损' },
      { value: '未送货上门', label: '未送货上门' }
    ]
  },
  {
    value: '发货问题',
    label: '发货问题',
    children: [
      { value: '包装乱', label: '包装乱' },
      { value: '未按约定时间发货', label: '未按约定时间发货' },
      { value: '时效内催发货', label: '时效内催发货' },
      { value: '拆分发货', label: '拆分发货' },
      { value: '主商品错发', label: '主商品错发' },
      { value: '主商品漏发', label: '主商品漏发' },
      { value: '赠品错发', label: '赠品错发' },
      { value: '赠品漏发', label: '赠品漏发' },
      { value: '明显二销痕迹', label: '明显二销痕迹' },
      { value: '包装标签贴错', label: '包装标签贴错' },
      { value: '缺货', label: '缺货' },
      { value: '赵今麦周边重复', label: '赵今麦周边重复' }
    ]
  },
  {
    value: '产品设计',
    label: '产品设计',
    children: [
      { value: '设计不合理', label: '设计不合理' },
      { value: '版型不喜欢', label: '版型不喜欢' },
      { value: '丑不好看', label: '丑不好看' },
      { value: '裆部短', label: '裆部短' },
      { value: '颜色不好看', label: '颜色不好看' },
      { value: '与其他品牌相同', label: '与其他品牌相同' }
    ]
  },
  {
    value: '吐槽',
    label: '吐槽',
    children: [
      { value: '吐槽客服', label: '吐槽客服' },
      { value: '吐槽品牌', label: '吐槽品牌' },
      { value: '消息骚扰', label: '消息骚扰' },
      { value: '吐槽公司', label: '吐槽公司' },
      { value: '吐槽价格', label: '吐槽价格' },
      { value: '评测贴', label: '评测贴' },
      { value: '搞笑贴', label: '搞笑贴' },
      { value: '安利风险贴', label: '安利风险贴' },
      { value: '内裤支持退换', label: '内裤支持退换' },
      { value: '吐槽包装', label: '吐槽包装' },
      { value: '吐槽产品名称', label: '吐槽产品名称' },
      { value: '产品', label: '产品' },
      { value: '咨询帖', label: '咨询帖' },
      { value: '周边重复', label: '周边重复' },
      { value: '周边漏发', label: '周边漏发' }
    ]
  },
  {
    value: '活动相关',
    label: '活动相关',
    children: [
      { value: '降价了', label: '降价了' },
      { value: '主观虚假宣传', label: '主观虚假宣传' }
    ]
  },
  {
    value: '客户建议',
    label: '客户建议',
    children: [
      { value: '水洗唛', label: '水洗唛' },
      { value: '上新', label: '上新' }
    ]
  }
]
import logo_douyin from '@/assets/imgs/common/logo/douyin.png'
import logo_taobao from '@/assets/imgs/common/logo/taobao.png'
import logo_kuaishou from '@/assets/imgs/common/logo/kuaishou.png'
import logo_xhs from '@/assets/imgs/common/logo/xhs-square.svg'
import logo_zhihu from '@/assets/imgs/common/logo/zhihu.svg'
import logo_weibo from '@/assets/imgs/common/logo/weibo.svg'
import logo_jinritoutiao from '@/assets/imgs/common/logo/jinritoutiao.svg'
import logo_weixingongzhonghao from '@/assets/imgs/common/logo/weixingongzhonghao.svg'
import logo_heimao from '@/assets/imgs/common/logo/heimao.svg'
import logo_yidianzixun from '@/assets/imgs/common/logo/yidianzixun.svg'
import logo_xiguashipin from '@/assets/imgs/common/logo/xiguashipin.svg'
import logo_12315 from '@/assets/imgs/common/logo/12315.svg'
import logo_xiaofeibao from '@/assets/imgs/common/logo/xiaofeibao.svg'
import logo_xinlang from '@/assets/imgs/common/logo/xinlang.svg'
import logo_souhu from '@/assets/imgs/common/logo/souhu.svg'
import logo_baidu from '@/assets/imgs/common/logo/baidu.svg'
import logo_bilibili from '@/assets/imgs/common/logo/bilibili.svg'
import logo_douban from '@/assets/imgs/common/logo/douban.svg'

export const getImageUrl = (platform) => {
  const imageUrls = {
    '018': logo_douban,
    '017': logo_bilibili,
    '016': logo_baidu,
    '015': logo_souhu,
    '014': logo_xinlang,
    '013': logo_xiaofeibao,
    '012': logo_12315,
    '011': logo_xiguashipin,
    '010': logo_yidianzixun,
    '009': logo_heimao,
    '008': logo_weixingongzhonghao,
    '007': logo_jinritoutiao,
    '006': logo_weibo,
    '005': logo_zhihu,
    '004': logo_kuaishou,
    '003': logo_taobao,
    '002': logo_douyin,
    '001': logo_xhs
  }

  return imageUrls[platform] || ''
}
// export const OPINION_TYPE_OPTIONS: OpinionTypeItem[] = [
//   {
//     value: 'MAJOR_PUBLIC_OPINION',
//     label: '重大舆情',
//     children: [
//       { value: 'INTERNET_CELEBRITY', label: '网红明星' },
//       { value: 'LIKES_OVER_50', label: '点赞量破50' },
//       { value: 'COMMENTS_OVER_20', label: '评论量破20' },
//       { value: 'REPOSTS_OVER_20', label: '转发量破20' }
//     ]
//   },
//   {
//     value: 'PERSONAL_INJURY',
//     label: '人身伤害',
//     children: [
//       { value: 'REDNESS', label: '泛红' },
//       { value: 'RASH', label: '起疹子' },
//       { value: 'ITCHING', label: '发痒' },
//       { value: 'SWELLING', label: '红肿' },
//       { value: 'OTHER_ALLERGIC_SYMPTOMS', label: '其他过敏症状' }
//     ]
//   },
//   {
//     value: 'PRODUCT_QUALITY',
//     label: '产品质量',
//     children: [
//       { value: 'COLOR_FADING', label: '掉色' },
//       { value: 'SIZE_INCONSISTENCY', label: '同尺码大小不一' },
//       { value: 'PILLING', label: '起球' },
//       { value: 'CROTCH_THREAD', label: '裆部线头' },
//       { value: 'INSECT', label: '虫' },
//       { value: 'HAIR', label: '毛发' },
//       { value: 'BLOOD_STAIN', label: '血渍' },
//       { value: 'NEEDLE', label: '针' },
//       { value: 'CROTCH_STAIN', label: '裆部污渍' },
//       { value: 'ODOR', label: '异味' },
//       { value: 'BLACK_DOTS', label: '黑点' },
//       { value: 'DAMAGE', label: '破损' },
//       { value: 'THREAD', label: '线头' },
//       { value: 'DIRT', label: '脏污' },
//       { value: 'COLOR_DIFFERENCE', label: '色差' },
//       { value: 'IMPRESSION', label: '压痕' },
//       { value: 'SIZE_TOO_BIG', label: '尺码偏大' },
//       { value: 'SIZE_TOO_SMALL', label: '尺码偏小' },
//       { value: 'WEDGIE', label: '夹屁股' },
//       { value: 'NOT_STICKY', label: '不粘' },
//       { value: 'PEELING', label: '翘边' },
//       { value: 'HARD_TO_CLEAN', label: '清洗不干净' },
//       { value: 'SUBJECTIVE_POOR_QUALITY', label: '主观材质较差' },
//       { value: 'NOT_BREATHABLE', label: '不透气' },
//       { value: 'ROLLING_EDGE', label: '卷边' },
//       { value: 'FALLING_OFF', label: '掉' },
//       { value: 'HARD_TO_WEAR', label: '不好穿' },
//       { value: 'NOT_GATHERING', label: '不聚拢' },
//       { value: 'TIGHT', label: '勒人' },
//       { value: 'BULKY_PACKAGING', label: '包装大' },
//       { value: 'DEGLUING', label: '脱胶' },
//       { value: 'TOO_THIN', label: '太薄了' },
//       { value: 'CROTCH_PINCH', label: '卡裆' },
//       { value: 'LOOSE', label: '松' },
//       { value: 'UNEXPECTED_MATERIAL', label: '不是客户想要的材质' },
//       { value: 'CHEST_PRESSURE', label: '压胸' },
//       { value: 'SAGGING', label: '掉档' },
//       { value: 'SEAM_OPENING', label: '开线' },
//       { value: 'WRINKLES', label: '褶皱' },
//       { value: 'FAKE_CERTIFIED_PRODUCT', label: '假冒合格产品' },
//       { value: 'PERCEIVED_POOR_QUALITY', label: '顾客感知质量一般' },
//       { value: 'TRANSPARENT', label: '透' },
//       { value: 'SLIPPERY', label: '滑' },
//       { value: 'STUFFY', label: '闷' },
//       { value: 'STRONG_TEAR_SENSATION', label: '撕裂感太强' },
//       { value: 'RUST', label: '生锈' },
//       { value: 'MOLD', label: '发霉' },
//       { value: 'SNAG', label: '勾丝' },
//       { value: 'SHEDDING', label: '掉毛' },
//       { value: 'MATERIAL_MISMATCH', label: '材质与页面不符' },
//       { value: 'NOT_INVISIBLE', label: '不隐形' },
//       { value: 'NOT_FLATTERING', label: '不显大' },
//       { value: 'POOR_SUPPORT', label: '支撑性差' },
//       { value: 'POKING', label: '戳肉' },
//       { value: 'GAP_CUP', label: '空杯' },
//       { value: 'VISIBLE_WEAR_MARKS', label: '明显穿着痕迹' },
//       { value: 'CHAFING', label: '磨皮肤' },
//       { value: 'UNEXPECTED_EFFECT', label: '效果未达预期' },
//       { value: 'HARD_AFTER_WASH', label: '洗完发硬' },
//       { value: 'CROTCH_YELLOWING', label: '裆部发黄' },
//       { value: 'GLUE_OPENING', label: '开胶' },
//       { value: 'WEAK_CARE_LABEL', label: '洗唛不牢' },
//       { value: 'PRODUCT_MISMATCH', label: '货不对板' },
//       { value: 'DEFORMATION', label: '变形' },
//       { value: 'TOE_PINCH', label: '卡脚趾' },
//       { value: 'CUP_SHIFTING', label: '跑杯' }
//     ]
//   },
//   {
//     value: 'SERVICE_ATTITUDE',
//     label: '服务态度',
//     children: [
//       { value: 'POOR_CUSTOMER_SERVICE', label: '客服服务态度差' },
//       { value: 'POOR_LOGISTICS_SERVICE', label: '物流服务态度差' }
//     ]
//   },
//   {
//     value: 'LOGISTICS_ISSUE',
//     label: '物流问题',
//     children: [
//       { value: 'DELIVERY_DELAY', label: '物流超时' },
//       { value: 'LOST_PACKAGE', label: '丢件' },
//       { value: 'LOGISTICS_MISROUTED', label: '物流错分' },
//       { value: 'POOR_COURIER_ATTITUDE', label: '快递员态度差' },
//       { value: 'PACKAGE_DAMAGE', label: '包裹破损' },
//       { value: 'NO_DELIVERY_NOTICE', label: '送达未通知' },
//       { value: 'FALSE_SIGNATURE', label: '签收未收到（虚假签收）' },
//       { value: 'NO_PICKUP_CODE', label: '未发送取件码' },
//       { value: 'DELIVERY_FAILED', label: '未投递成功' },
//       { value: 'PACKAGING_DAMAGE', label: '包装破损' },
//       { value: 'NO_DOORSTEP_DELIVERY', label: '未送货上门' }
//     ]
//   },
//   {
//     value: 'SHIPPING_ISSUE',
//     label: '发货问题',
//     children: [
//       { value: 'MESSY_PACKAGING', label: '包装乱' },
//       { value: 'MISSED_SHIPPING_DEADLINE', label: '未按约定时间发货' },
//       { value: 'URGING_SHIPPING_WITHIN_TIME', label: '时效内催发货' },
//       { value: 'SPLIT_SHIPMENT', label: '拆分发货' },
//       { value: 'MAIN_PRODUCT_WRONG', label: '主商品错发' },
//       { value: 'MAIN_PRODUCT_MISSING', label: '主商品漏发' },
//       { value: 'GIFT_WRONG', label: '赠品错发' },
//       { value: 'GIFT_MISSING', label: '赠品漏发' },
//       { value: 'SECONDARY_SALE_MARKS', label: '明显二销痕迹' },
//       { value: 'WRONG_PACKAGING_LABEL', label: '包装标签贴错' },
//       { value: 'OUT_OF_STOCK', label: '缺货' },
//       { value: 'ZHAO_JINMAI_MERCH_DUPLICATE', label: '赵今麦周边重复' }
//     ]
//   },
//   {
//     value: 'PRODUCT_DESIGN',
//     label: '产品设计',
//     children: [
//       { value: 'UNREASONABLE_DESIGN', label: '设计不合理' },
//       { value: 'UNLIKED_FIT', label: '版型不喜欢' },
//       { value: 'UGLY', label: '丑不好看' },
//       { value: 'SHORT_CROTCH', label: '裆部短' },
//       { value: 'UNPLEASING_COLOR', label: '颜色不好看' },
//       { value: 'SAME_AS_OTHER_BRANDS', label: '与其他品牌相同' }
//     ]
//   },
//   {
//     value: 'COMPLAINT',
//     label: '吐槽',
//     children: [
//       { value: 'COMPLAIN_CUSTOMER_SERVICE', label: '吐槽客服' },
//       { value: 'COMPLAIN_BRAND', label: '吐槽品牌' },
//       { value: 'MESSAGE_HARASSMENT', label: '消息骚扰' },
//       { value: 'COMPLAIN_COMPANY', label: '吐槽公司' },
//       { value: 'COMPLAIN_PRICE', label: '吐槽价格' },
//       { value: 'REVIEW_POST', label: '评测贴' },
//       { value: 'FUNNY_POST', label: '搞笑贴' },
//       { value: 'RECOMMENDATION_RISK_POST', label: '安利风险贴' },
//       { value: 'UNDERWEAR_EXCHANGE_SUPPORT', label: '内裤支持退换' },
//       { value: 'COMPLAIN_PACKAGING', label: '吐槽包装' },
//       { value: 'COMPLAIN_PRODUCT_NAME', label: '吐槽产品名称' },
//       { value: 'PRODUCT_COMPLAINT', label: '产品' },
//       { value: 'INQUIRY_POST', label: '咨询帖' },
//       { value: 'MERCH_DUPLICATE', label: '周边重复' },
//       { value: 'MERCH_MISSING', label: '周边漏发' }
//     ]
//   },
//   {
//     value: 'ACTIVITY_RELATED',
//     label: '活动相关',
//     children: [
//       { value: 'PRICE_DROP', label: '降价了' },
//       { value: 'SUBJECTIVE_FALSE_ADVERTISING', label: '主观虚假宣传' }
//     ]
//   },
//   {
//     value: 'CUSTOMER_SUGGESTION',
//     label: '客户建议',
//     children: [
//       { value: 'CARE_LABEL', label: '水洗唛' },
//       { value: 'NEW_ARRIVAL', label: '上新' }
//     ]
//   }
// ]
