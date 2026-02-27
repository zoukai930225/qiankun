import { getCategoryNameList } from '@/api/shop/InventoryLow/index.js'
import { getPersonRosterAvatarOriginList } from '@/api/hrAdmin/personRoster'
import { getProductCodeList } from '@/api/oa/factory/develop'

// 分类列表
interface OptionItem {
  name: string
  code: string
}

// 获取分类列表
export function useCategoryList() {
  const categoryList = ref<OptionItem[]>([])

  const initSelectData = async () => {
    const res = await getCategoryNameList({
      type: 'NP'
    })
    categoryList.value = res || []
  }

  return {
    categoryList,
    initSelectData
  }
}

// 获取人员列表
export function usePersonList() {
  const personList = ref<any>([])

  const getPersonList = async () => {
    const data = await getPersonRosterAvatarOriginList({
      status: '2'
    })
    personList.value = data || []
  }

  return {
    personList,
    getPersonList
  }
}

// 获取 工厂二开货品编码信息
export function useProductCodeList() {
  const productCodeList = ref<any>([])

  const getProductCodes = async () => {
    const data = await getProductCodeList()
    productCodeList.value = data || []
  }

  return {
    productCodeList,
    getProductCodes
  }
}

import { isImgPath } from '@/utils/is'
import { downloadByUrl2 } from '@/utils/download'
export const splitImgOrFile = (fileUrl: string) => {
  let imageUrls = [] as any
  let fileUrls = [] as any
  const fileUrlList = fileUrl?.split(',').filter((url: any) => !!url).map((url: any) => {
    const fileName = url.split('?name=')[1] || url.split('/')[url.split('/').length - 1] || '未知文件'
    const isImage = isImgPath(url)
    return {
      fileUrl: url,
      fileName,
      isImage
    }
  })

  imageUrls = fileUrlList && fileUrlList.filter(att => att.isImage) || []
  fileUrls = fileUrlList && fileUrlList.filter(att => !att.isImage) || []

  return {
    imageUrls,
    fileUrls,
    fileUrlList
  }

}

// 下载附件
export const downloadAttachFile = (file: any) => {
  downloadByUrl2(file.fileUrl, file.fileName)
}

