import { computed, provide, ref } from 'vue'
import type { Ref } from 'vue'
import { useRoute } from 'vue-router'
import { PageItem } from '@/components/template/config/type'
import { ElCascader } from 'element-plus'
import SelectUser from '@/components/common/user/selectUser.vue'
import { useCategoryTree } from '@/views/OA/buyer/hooks/useCategoryTree'
import RematchIcon from '@/assets/svgs/oa/buyer/rematch.svg'
import DirectIcon from '@/assets/svgs/oa/buyer/direct.svg'
import ObsoleteProductIcon from '@/assets/svgs/oa/buyer/obsolete_products.svg'
import VersionEvisionIcon from '@/assets/svgs/oa/buyer/version_evision.svg'
const { categoryList, getCategoryTree, casProps } = useCategoryTree()
getCategoryTree()
export const CATEGORY_PROVIDE_KEY = 'ProductReferenceLibraryCategoryOptions' as const
export const categoryListKey = 'ProductReferenceLibraryCategoryList' as const

export type CategoryProvideContext = {
  tree: Ref<any[]>
  props: Record<string, any>
}

// 查询结构
export class SearchItem {
  category: string | number | '' = ''
  candidateProductStatus: number | '' = ''
  productName = ''
  planName = ''
  uploadUserId: string | number | '' = ''
  id: string | number | '' = ''
  artworkNumber: string = ''
  confirmResult: number[] = []
}

// 表格数据结构
export class DataItem {
  id: string | number = ''
  bpBusinessEnterprisePlanId: string | number = ''
  planName = ''
  category: string | number | '' = ''
  categoryName = ''
  productName = ''
  supplierId: string | number = ''
  supplierName = ''
  unitPrice: string | number = ''
  realPhotos: string | string[] = ''
  salePoint = ''
  uploadUserId: string | number = ''
  uploadUser: Record<string, any> | null = null
  candidateProductStatus: number | '' = ''
  candidateProductStatusName = ''
  confirmResult: number | string | undefined = undefined
  reviewInfoList: Array<Record<string, any>> = []
  availableButtons: Array<string> = []
}

// 通用入参
export const usePage = (_userInfo: Ref<Record<string, any>>) => {
  const route = useRoute()
  provide(categoryListKey, categoryList)
  provide(CATEGORY_PROVIDE_KEY, {
    tree: categoryList,
    props: casProps
  })
  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<any>>([])
  const stateInfo = ref<any>({})
  const statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() })
  const loading = ref<boolean>(false)
  const page = ref<PageItem>({ ...new PageItem() })

  const statusOptions = [
    { label: '待选品', value: 100 },
    { label: '未选中', value: 200 },
    { label: '已选中', value: 300 },
    { label: '待审核', value: 400 },
    { label: '待确认', value: 500 },
    { label: '已暂存', value: 0 }
    // { label: '已确认', value: 600 }
  ]

  // 已确认的细分状态 （1:直接下单、2:版型改版、3:淘汰产品、4:重新匹配）
  const confirmedStatusOptions = [
    { label: '重新匹配', value: 4, icon: RematchIcon },
    { label: '直接下单', value: 1, icon: DirectIcon },
    { label: '版型改版', value: 2, icon: VersionEvisionIcon },
    { label: '淘汰产品', value: 3, icon: ObsoleteProductIcon }
  ]

  // 查询配置(必配)
  const scheme = computed(() => [
    {
      field: 'planName',
      label: '企划名称',
      component: 'Input',
      componentProps: {
        clearable: true,
        placeholder: '请输入企划名称'
      }
    },
     {
      field: 'artworkNumber',
      label: '图稿编号',
      component: 'Input',
      componentProps: {
        clearable: true,
        placeholder: '请输入图稿编号'
      }
    },
    {
      field: 'productName',
      label: '产品名称',
      component: 'Input',
      componentProps: {
        clearable: true,
        placeholder: '请输入产品名称'
      }
    },
    {
      field: 'category',
      label: '品类',
      isCustom: true,
      customRender: (_item, _model) => (
        <ElCascader options={categoryList.value} props={casProps} separator=">" />
      ),
      componentProps: {
        clearable: true,
        filterable: true,
        placeholder: '请选择品类'
      }
    },
    // {
    //   field: 'category',
    //   label: '品类',
    //   component: 'Select',
    //   options: categoryOptions,
    //   componentProps: {
    //     clearable: true,
    //     filterable: true,
    //     placeholder: '请选择品类'
    //   }
    // },
    {
      field: 'candidateProductStatus',
      label: '参选状态',
      component: 'Select',
      options: statusOptions,
      componentProps: {
        clearable: true,
        filterable: true,
        placeholder: '请选择参选状态'
      }
    },
    
    {
      field: 'uploadUserId',
      label: '上传人',
      isCustom: true,
      customRender: () => <SelectUser />,
      componentProps: {
        placeholder: '请选择上传人',
        multiple: false,
        clearable: true
      }
    },
  ])

  const setRouterInfo = () => {
    const params: Record<string, any> = {}
    const param: any = route.params
    const query: any = route.query
    Object.keys(param).forEach((key) => {
      params[key] = param[key]
    })
    Object.keys(query).forEach((key) => {
      params[key] = query[key]
    })
    if (Object.keys(params).length !== 0) {
      searchData.value = { ...searchData.value, ...params }
      const newUrl = window.location.href.replace(/\?.*$/, '')
      history.replaceState({}, '', newUrl)
    }
  }

  return {
    dataList,
    searchData,
    loading,
    page,
    scheme,
    stateInfo,
    statistics,
    setRouterInfo,
    confirmedStatusOptions
  }
}
