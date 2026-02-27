import { defineStore } from 'pinia'
import { store } from '../index'
// @ts-ignore
import { DictDataVO } from '@/api/system/dict/types'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import { getAccessToken } from '@/utils/auth'

const { wsCache } = useCache('sessionStorage')
import { getAllDictDataList } from '@/api/system/dict/dict.data'
import { getBasicAttribute } from '@/api/oa/new/plan/index'

export interface DictValueType {
  value: any
  label: string
  clorType?: string
  cssClass?: string
}
export interface DictTypeType {
  dictType: string
  dictValue: DictValueType[]
}
export interface DictState {
  dictMap: Map<string, any>
  designFields: any[]
  isSetDict: boolean
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    dictMap: new Map<string, any>(),
    designFields: [],
    isSetDict: false
  }),
  getters: {
    getDictMap(): Recordable {
      const dictMap = wsCache.get(CACHE_KEY.DICT_CACHE)
      if (dictMap) {
        this.dictMap = dictMap
      }
      return this.dictMap
    },
    getIsSetDict(): boolean {
      return this.isSetDict
    },
    getDesignFields(): any[] {
      return this.designFields || wsCache.get(CACHE_KEY.NewGoodDesignField) || []
    }
  },
  actions: {
    async setDictMap(refresh = false) {
      const dictMap = wsCache.get(CACHE_KEY.DICT_CACHE)
      if (dictMap && !refresh) {
        this.dictMap = dictMap
        this.isSetDict = true
      } else {
        if (!getAccessToken()) {
          return
        }
        const res = await getAllDictDataList('supplier').catch(() => {})
        const dictDatas = res?.data || []
        // 设置数据
        const dictDataMap = new Map<string, any>()
        dictDatas.forEach((dictData: DictDataVO) => {
          // 获得 dictType pCode 层级
          const enumValueObj = dictDataMap[dictData.pCode]
          if (!enumValueObj) {
            dictDataMap[dictData.pCode] = []
          }
          // 处理 dictValue 层级
          dictDataMap[dictData.pCode].push({
            value: dictData.code,
            label: dictData.name,
            code: dictData.code,
            shortName: dictData.shortName
          })
        })
        this.dictMap = dictDataMap
        this.isSetDict = true
        wsCache.set(CACHE_KEY.DICT_CACHE, dictDataMap, { exp: 60 }) // 60 秒 过期
      }
    },

    async setDesignFields(refresh = false) {
      const designFields = wsCache.get(CACHE_KEY.NewGoodDesignField)
      if (designFields && !refresh) {
        this.designFields = designFields
      } else {
        if (!getAccessToken()) {
          return
        }
        const res = await await getBasicAttribute({ code: 'DesignGallery' }).catch(() => {})
        this.designFields = res || []
        wsCache.set(CACHE_KEY.NewGoodDesignField, res || [], { exp: 60 }) // 60 秒 过期
      }
    },

    getDictByType(type: string) {
      if (!this.isSetDict) {
        this.setDictMap()
      }
      return this.dictMap[type]
    },
    async resetDict() {
      wsCache.delete(CACHE_KEY.DICT_CACHE)
      const res = await getAllDictDataList('supplier').catch(() => {})

      const dictDatas = res?.data || []
      // 设置数据
      const dictDataMap = new Map<string, any>()
      dictDatas.forEach((dictData: DictDataVO) => {
        // 获得 dictType pCode 层级
        const enumValueObj = dictDataMap[dictData.pCode]
        if (!enumValueObj) {
          dictDataMap[dictData.pCode] = []
        }
        // 处理 dictValue 层级
        dictDataMap[dictData.pCode].push({
          value: dictData.code,
          label: dictData.name,
          code: dictData.code,
          shortName: dictData.shortName
        })
      })
      this.dictMap = dictDataMap
      this.isSetDict = true
      wsCache.set(CACHE_KEY.DICT_CACHE, dictDataMap, { exp: 60 }) // 60 秒 过期
    }
  }
})

export const useDictStoreWithOut = () => {
  return useDictStore(store)
}
