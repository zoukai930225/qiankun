import { computed, reactive, ref } from 'vue'
import type { FilterGroup } from '@/components/Filter/commonFilter/index.vue'
import { getDictDataItemList } from '@/api/system/dict/dict.data'

const DICT_MAPPING = {
  marketPosition: 'market_position',
  masterImageCollectionCategory: 'master_image_collection_category',
  masterImageCollectionFabric: 'master_image_collection_fabric',
  masterImageCollectionForm: 'master_image_collection_form'
} as const

type DictKey = keyof typeof DICT_MAPPING

interface DictItem {
  code: string
  name: string
}

export type HighQualityDictKey = DictKey
export const HIGH_QUALITY_DICT_KEYS = Object.keys(DICT_MAPPING) as HighQualityDictKey[]

const dictState = reactive<Record<DictKey, DictItem[]>>({
  marketPosition: [],
  masterImageCollectionCategory: [],
  masterImageCollectionFabric: [],
  masterImageCollectionForm: []
})

const loaded = ref(false)
const loading = ref(false)
let initPromise: Promise<void> | null = null

const normalizeDictList = (list: any): DictItem[] => {
  if (!Array.isArray(list)) return []
  return list
    .map((item: any) => ({
      code: item?.code ?? item?.value ?? '',
      name: item?.name ?? item?.label ?? ''
    }))
    .filter((item: DictItem) => item.code && item.name)
}

const fetchDicts = async (force = false): Promise<void> => {
  if (loading.value) {
    return initPromise ?? Promise.resolve()
  }
  if (loaded.value && !force) {
    return Promise.resolve()
  }
  loading.value = true
  initPromise = (async () => {
    try {
      const entries = Object.entries(DICT_MAPPING) as Array<[DictKey, string]>
      await Promise.all(
        entries.map(async ([key, code]) => {
          const list = await getDictDataItemList(code).catch(() => [])
          dictState[key] = normalizeDictList(list)
        })
      )
      loaded.value = true
    } finally {
      loading.value = false
    }
  })()
  return initPromise
}

const optionMap = computed(() => {
  const result = {} as Record<DictKey, FilterGroup['options']>
  ;(Object.keys(DICT_MAPPING) as DictKey[]).forEach((key) => {
    result[key] = dictState[key].map((item) => ({
      label: item.name,
      value: item.code
    }))
  })
  return result
})

const filterGroups = computed<FilterGroup[]>(() => [
  {
    key: 'marketPosition',
    label: '市场定位',
    multiple: true,
    options: optionMap.value.marketPosition
  },
  {
    key: 'masterImageCollectionCategory',
    label: '品类',
    multiple: true,
    options: optionMap.value.masterImageCollectionCategory
  },
  {
    key: 'masterImageCollectionFabric',
    label: '面料',
    multiple: true,
    options: optionMap.value.masterImageCollectionFabric
  },
  {
    key: 'masterImageCollectionForm',
    label: '形式',
    multiple: true,
    options: optionMap.value.masterImageCollectionForm
  }
])

const valueLabelMap = computed(() => {
  const map = {} as Record<DictKey, Record<string, string>>
  ;(Object.keys(DICT_MAPPING) as DictKey[]).forEach((key) => {
    map[key] = dictState[key].reduce(
      (acc, item) => {
        acc[item.code] = item.name
        return acc
      },
      {} as Record<string, string>
    )
  })
  return map
})

const dictLoading = computed(() => loading.value)
const isReady = computed(() => loaded.value)

export const useHighQualityDict = () => ({
  filterGroups,
  valueLabelMap,
  fetchDicts,
  dictLoading,
  isReady
})
