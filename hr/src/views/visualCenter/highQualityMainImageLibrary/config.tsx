import { computed } from 'vue'
import type { HighQualityRecord } from '@/api/visualCenter/highQualityMainImageLibrary'
import SelectUser from '@/components/common/user/selectUser.vue'

export const pageName = 'HighQualityMainImageLibrary'

// 查询表单结构
export class SearchForm {
  createdTime: string[] = []
  createdId: string = ''
  unfilled: string[] = []
}

export interface FilterState {
  marketPosition: string[]
  masterImageCollectionCategory: string[]
  masterImageCollectionFabric: string[]
  masterImageCollectionForm: string[]
 
}

export const createDefaultFilterState = (): FilterState => ({
  marketPosition: [],
  masterImageCollectionCategory: [],
  masterImageCollectionFabric: [],
  masterImageCollectionForm: [],
})

export const useScheme = (getRole: (name: string) => string) =>
  computed(() => [
    {
      field: 'createdTime',
      label: '收藏时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        unlinkPanels: true,
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        clearable: true,
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期'
      }
    },
    {
      field: 'createdId',
      label: '收藏人',
      isCustom: true,
      componentProps: {
        placeholder: '请选择收藏人',
        clearable: true,
        role: getRole('优质主图收藏'),
        multiple: false,
        filterable: true,
        collapseTags: true,
        collapseTagsTooltip: true
      },
      customRender: () => SelectUser
    }
  ])

const compactValue = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.length ? value : undefined
  }
  if (value === '' || value === null || value === undefined) {
    return undefined
  }
  return value
}

export const buildQueryParams = (search: SearchForm, filterState: FilterState) => {
  const [createdTimeBegin, createdTimeEnd] = search.createdTime || []
  const payload: Record<string, any> = {
    createdId: search.createdId,
    createdTimeBegin,
    createdTimeEnd,
    marketPosition: filterState.marketPosition,
    masterImageCollectionCategory: filterState.masterImageCollectionCategory,
    masterImageCollectionFabric: filterState.masterImageCollectionFabric,
    masterImageCollectionForm: filterState.masterImageCollectionForm,
  }

  Object.keys(payload).forEach((key) => {
    const normalized = compactValue(payload[key])
    if (normalized === undefined) {
      delete payload[key]
      return
    }
    if (Array.isArray(normalized)) {
      payload[key] = normalized.join(',')
    } else {
      payload[key] = normalized
    }
  })

  return payload
}

// 新增：列表项的数据结构定义
export type ImageItem = HighQualityRecord & {
  checked: boolean
}
