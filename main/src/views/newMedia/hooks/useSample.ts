import * as LocationApi from '@/api/sample/storageLocationManage'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

// 样品尺寸列表
export const sampleSizeList = getIntDictOptions(DICT_TYPE.NP_DESIGN_PRODUCT_SIZE, true)

// 样品状态列表
export const sampleStatusList = reactive([
  {
    label: '已入库',
    value: '3'
  },
  {
    label: '已出库',
    value: '4'
  },
  {
    label: '报废',
    value: '2'
  }
])

// 样品申请状态列表
export const sampleApplyStatusList =  getIntDictOptions(DICT_TYPE.SAMPLE_MANAGEMENT_INVENTORY_APPLY_STATUS, true)

// 样品类别列表 暂时不用
export const sampleTypeList = reactive([
  {
    label: '大货样',
    value: '大货样'
  },
  {
    label: '打样',
    value: '打样'
  },
  {
    label: '其他',
    value: '其他'
  }
])

/**
 * 
 *  申请用途：达人寄样、模特拍摄可归还、模特拍摄并赠与、静物拍摄、试穿、调样留底、公司伙伴礼物、工厂寄样
    入库来源：采购、退样、达人归还、仓库、供应商

    
 */
export const applyPurposeList = reactive([
  {
    label: '达人寄样',
    value: '达人寄样'
  },
  {
    label: '模特拍摄可归还',
    value: '模特拍摄可归还'
  },
  {
    label: '模特拍摄并赠与',
    value: '模特拍摄并赠与'
  },
  {
    label: '静物拍摄',
    value: '静物拍摄'
  },
  {
    label: '试穿',
    value: '试穿'
  },
  {
    label: '调样留底',
    value: '调样留底'
  },
  {
    label: '公司伙伴礼物',
    value: '公司伙伴礼物'
  },
  {
    label: '工厂寄样',
    value: '工厂寄样'
  },
  {
    label: '剪做色样',
    value: '剪做色样'
  }
])

export const resourceList = reactive([
  {
    label: '采购',
    value: '采购'
  },
  {
    label: '退样',
    value: '退样'
  },
  {
    label: '达人归还',
    value: '达人归还'
  },
  {
    label: '仓库',
    value: '仓库'
  },
  {
    label: '供应商',
    value: '供应商'
  }
])

// 库位列表
export const getLocationList = async () => {
  const data = await LocationApi.getLocationList({
    page: 1,
    pageSize: 9999999
  }).catch(() => {})
  return data.records.map((el) => ({
    label: el.location,
    value: el.id
  }))
}
