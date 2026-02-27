/*
 * @Date: 2024-08-07 14:09:34
 */
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

export const urgencyLevelOptions = ref([
  {
    value: '0',
    label: '紧急'
  },
  {
    value: '1',
    label: '一般'
  }
])

export const goodsPositionOptions = ref([
  {
    value: '0',
    label: 'A类'
  },
  {
    value: '1',
    label: 'B类'
  },
  {
    value: '2',
    label: 'C类'
  }
])

export const takePartOptions = ref([
  {
    value: 1,
    label: '是'
  }
])

export const undertakeOptions = ref([
  {
    value: 0,
    label: '待承接'
  },
  {
    value: 1,
    label: '已承接'
  },
  {
    value: 2,
    label: '已拒绝'
  }
])

export const statePositionOptions = ref([
  {
    value: 0,
    label: '运营待审核'
  },
  {
    value: -1,
    label: '视觉待审核'
  },
  {
    value: 1,
    label: '需求进行中'
  },
  {
    value: 3,
    label: '需求已完成'
  },
  {
    value: 2,
    label: '需求已暂停'
  },
  {
    value: 4,
    label: '需求已拒绝'
  },
  {
    value: 5,
    label: '需求已终止'
  }
])

// 根据key获取平台名字
export const getStoreByValue = (key) => {
  const arr = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_STORE)
  for (const item of arr) {
    if (item.code === key) {
      return item.shortName
    }
  }
}

// 根据key获取审批流的品类
export const getCategoryByValue = (key) => {
  const arr = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_VISUAL_CATEGORY)
  for (const item of arr) {
    if (item.code === key) {
      return item.label
    }
  }
}
// 获取需求类型
export const getDemandTypeByValue = (key) => {
  const arr = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DEMAND_TYPE)
  for (const item of arr) {
    if (item.code === key) {
      return item.label
    }
  }
}

export const urgencyLevels = {
  0: '紧急',
  1: '一般'
}

export const goodsPositions = {
  0: 'A类',
  1: 'B类',
  2: 'C类'
}

export const ImageType = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'JPG']

export const openWindowByUrl = (url) => {
  const midUrl = url.startsWith('http') ? url : `https://${url}`
  window.open(midUrl)
}
