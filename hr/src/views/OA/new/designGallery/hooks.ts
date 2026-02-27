/*
 * @Date: 2025-02-13 15:44:46
 */

import { getPersonRosterAvatarOriginList } from '@/api/hrAdmin/personRoster/index'
import { getCategoryNameList } from '@/api/shop/InventoryLow/index'
import { getDictDataPage } from '@/api/system/dict/dict.data'

export const useCategoryConfig = () => {
  const getNameByCode = ref<any>({})

  const getConfigCategory = async () => {
    const params = {
      type: 'NP'
    }
    const res = await getCategoryNameList(params)
    res.forEach((item) => {
      getNameByCode.value[item.code] = item.name
    })
  }
  getConfigCategory()
  return {
    getNameByCode,
    getConfigCategory
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

    // const arr = peopleList.value.filter((item) => item.userId === id)
    // return arr?.[0]?.name || ''
  }

  return {
    peopleList,
    initPeople,
    getName
  }
}
