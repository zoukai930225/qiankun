/*
 * @Date: 2025-01-22 15:46:07
 */
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
export const tabsList = ref([
  {
    name: '临时需求',
    code: 'temporary',
    icon: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/linshi.png`,
    acitvityIcon: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/linshi-activity.png`
  },
  {
    name: '新品需求',
    code: 'newProduct',
    icon: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/xinpin.png`,
    acitvityIcon: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/xinpin-activity.png`
  },
  {
    name: '优化需求',
    code: 'optimization',
    icon: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/youhua.png`,
    acitvityIcon: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/youhua-activity.png`
  },
  {
    name: '内部需求',
    code: 'internal',
    icon: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/youhua.png`,
    acitvityIcon: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/youhua-activity.png`
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

// （需求类型）通过一级需求类型寻找二级类型
export const formarTwoType = (oneStr, twoStr) => {
  const arr = getIntDictOptions(oneStr, true)
  if (twoStr == 'ALL') return ''
  const item = arr.filter((ite) => ite.value == twoStr)
  return item[0]?.label
}
