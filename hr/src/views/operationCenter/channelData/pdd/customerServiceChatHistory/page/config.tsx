import LineAvatar from '@/components/template/table/components/lineAvatar.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

// 查询结构
export class SearchItem {
  date: string[] = [] // 用于接收时间范围数组
  goodsId: string = ''
  orderId: string = '' // 对应 API 的 orderId
}

// 通用入参 hook
export const usePage = (params: any = {}) => {
  const route = useRoute()
  const { userInfo } = params

  // 这里的 dataList 可以保留，或者我们主要使用 chatData
  const dataList = ref<Array<any>>([])

  const searchData = ref<SearchItem>({ ...new SearchItem() })
  const loading = ref<boolean>(false)

  // 默认分页配置
  const page = ref<PageItem>({ ...new PageItem(), size: 10 })

  // --- 关键修改：查询配置 ---
  const scheme = computed(() => [
    {
      field: 'date',
      label: '查询时间',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD HH:mm:ss', // 确保格式符合后端 string 要求
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间'
      }
    },
    { field: 'goodsId', label: '商品ID' },
    { field: 'orderId', label: '订单号' } // 注意这里字段名改为 orderId 匹配 API
  ])

  // 本页面主要是一个自定义视图，不需要通用的 Table Column 和 Screen
  const screen = computed(() => ({ ...new Screen() }))
  const column = computed(() => [])
  const btns = computed(() => [])
  const handleColumn = computed(() => [])

  const setRouterInfo = () => {
    let params: Object = {}
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
    btns,
    column,
    screen,
    handleColumn,
    setRouterInfo
  }
}
