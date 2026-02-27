
import { getStoreIcon } from '@/utils/index';
export const channelList = [
  { id: 1, label: '抖音 ', value: 'Douyin', icon: getStoreIcon('swDouyin') },
  { id: 2, label: '淘宝 ', value: 'TaoBao', icon: getStoreIcon('swTaobao') },
  { id: 3, label: '拼多多 ', value: 'Pdd', icon: getStoreIcon('swPdd') }
]

export const matchList = [
  { id: 0, label: '否 ', value: '0' },
  { id: 1, label: '是 ', value: '1' },
]
//匹配状态1匹配中2匹配成功3匹配失败
export const matchStatusList = [
  { id: 1, label: '匹配中 ', value: '1' },
  { id: 2, label: '匹配成功 ', value: '2' },
  { id: 3, label: '匹配失败 ', value: '3' },
]

export const getChannelIcon = (channel) => {
  return channelList.find(item => item.value === channel)?.icon;
}

export const getLabelByValue = (list, value) => {
  return list.find(item => item.value === value)?.label;
}