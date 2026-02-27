/*
 * @Date: 2024-11-05 15:17:51
 */
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

export const baseUrl = (name) => {
  return `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/${name}`
}

export const showInfo = ref([
  { text: '已完成', class: 'desc-item-finished' },
  { text: '进行中', class: 'desc-item-ing' },
  { text: '未审核', class: 'desc-item-pause' },
  { text: '已拒绝', class: 'desc-item-stop' }
])

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

// （需求类型）通过一级需求类型寻找二级类型
export const formarTwoType = (oneStr, twoStr) => {
  const arr = getIntDictOptions(oneStr, true)
  if (twoStr == 'ALL') return ''
  const item = arr.filter((ite) => ite.value == twoStr)
  return item[0]?.label
}

// 每一行table展示的背景图标
export const showBgImg = (item) => {
  const type = item?.state
  if (type == 5) return false //终止单独的样式
  if (item?.auditState == 0) {
    return baseUrl('stop-bg.png')
  } else {
    const urlMap = {
      0: baseUrl('ing-bg.png'),
      1: baseUrl('ing-bg.png'),
      3: baseUrl('green-bg.png'),
      4: baseUrl('stop-icon-bg.png'),
      5: baseUrl('stop-bg.png')
    }
    return urlMap[type] || ''
  }
}

// 上架周期
export const formatCycle = (value) => {
  if (!value) return ''
  const arr = getIntDictOptions(DICT_TYPE.LISTING_CYCLE, true)
  const item = arr.find((item) => item.code === value)
  return item ? item.label : ''
}

// 单个节点分多个节点展示(3)
export const subNodeList = ref([
  {
    subNode: '2',
    name: '视频'
  },
  {
    subNode: '1',
    name: '静物'
  },
  {
    subNode: '0',
    name: '人像'
  }
])
// 单个节点分多个节点展示(2)
export const twoSubNodeList = ref([
  {
    subNode: '4',
    name: '平面'
  },
  {
    subNode: '3',
    name: '视觉'
  }
])

export const typeList = [
  {
    label: '跳过',
    value: 0,
    img: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/pass-icon.png`,
    activeImg: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/pass-icon-active.png`
  },
  {
    label: '指派',
    value: 1,
    img: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/zhipai-icon.png`,
    activeImg: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/zhipai-icon-active.png`
  },
  {
    label: '上传',
    value: 2,
    img: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/upload-icon.png`,
    activeImg: `https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/obs/upload-icon-active.png`
  }
]

const NodeType = {
  Three: 3,
  Two: 2
}

export const getSubNodeList = async (type = NodeType.Three) => {
  const ThreeTypes = ['0', '1', '2']
  const res = await getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_VISUAL_SUBNODE, true)
  // 根据传入的类型参数执行不同的逻辑
  const filteredList = res.filter((item) => {
    if (
      (type == NodeType.Three && ThreeTypes.includes(item.code)) ||
      (type == NodeType.Two && !ThreeTypes.includes(item.code))
    ) {
      return item
    }
  })
  return filteredList
}

export const downloadByUrl = (url) => {
  const suffix = url.slice(url.lastIndexOf('.'))
  const filename = Date.now() + suffix
  fetch(url)
    .then((response) => response.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(blobUrl)
      link.remove()
    })
}
