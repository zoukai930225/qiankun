/*
 * @Date: 2025-01-07 11:22:44
 */
import { getCategoryNameList } from '@/api/shop/InventoryLow/index.js'
import { getDictDataPage } from '@/api/system/dict/dict.data'

import { getPersonRosterAvatarOriginList } from '@/api/hrAdmin/personRoster/index'

// 分类列表
interface OptionItem {
  name: string
  code: string
}

// 获取分类列表
export function useCategoryList() {
  const categoryList = ref<OptionItem[]>([])

  const initSelectData = async () => {
    const params = {
      type: 'NP'
    }
    const res = await getCategoryNameList(params)
    categoryList.value = res || []
  }

  onMounted(() => {
    initSelectData()
  })

  return {
    categoryList,
    initSelectData
  }
}

interface DicItem {
  id: number
  name: string
  // 其他属性
}

export const useDicList = () => {
  const dicList = ref<DicItem[]>([])

  const initDicList = async () => {
    const params = {
      page: 1,
      size: 1000,
      type: 1
    }
    const res = await getDictDataPage(params)
    dicList.value = res.data || []
  }

  const getDic = (dictCode) => {
    console.log(dicList.value, 'dicList.value')
    const item = dicList.value.find((dict) => dict.id == dictCode)
    console.log('dictCode', dictCode)
    return item
  }

  onMounted(() => {
    initDicList()
  })

  return {
    getDic,
    dicList
  }
}

interface Person {
  userId: string
  name: string
  // 其他属性
}

export const usePeopleList = () => {
  const peopleList = ref<Person[]>([])

  const initPeople = async () => {
    const data = {
      status: '2'
    }
    const res = await getPersonRosterAvatarOriginList(data)
    peopleList.value = res || []
  }

  const getName = (ids) => {
    if (!ids || ids.length === 0) return ''
    const idsArr = ids.split(',')
    const names = idsArr
      .map((id) => {
        const arr = peopleList.value.filter((item) => item.userId === id)
        return arr?.[0]?.name ?? ''
      })
      .filter((name) => name !== '')
    return names.join(',')
  }

  return {
    peopleList,
    initPeople,
    getName
  }
}
