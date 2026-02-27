import StoreRangePlus from '@/components/StoreRangePlus/src/StoreRangePlus.vue'
import SelectUser from '@/components/common/user/selectUser.vue'
import LineReveals from '@/components/template/table/components/lineReveals.vue'
import LineImage from '@/components/template/table/components/lineImage.vue'
import { PageItem, Screen } from '@/components/template/config/type'
import { selectCountForUnblock } from '@/api/oa/new/mainImageAnalyse'
import { ElLink } from 'element-plus'
import { OverflowTooltip } from '@/components/Overflow'
// 快照截图 从 主图 到 本品主图卖点方向和透出顺序

// 查询结构
export class SearchItem {
  store: string = ''
  productCode: string = ''
  operator: string = ''
  id?: string = ''
}

// 表格数据结构
export class DataItem {
  id: string = ''
  storeName?: string = ''
  productCode?: string = ''
  operatorList?: Array<any> = []
  mainDirection?: string = ''
  imgUrl?: string = ''
  mainImageUrl?: string = ''
  productFeaturesQuantity?: number = 0
  competitorAnalysisQuantity?: number = 0
  mainImageSellingPointsQuantity?: number = 0
  sfqr?: number = 0
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  function selectable(row: any) {
    // 未解封
    return row.isUnblock === 0
  }

  // 外部组件入参
  const {
    selectRows,
    openSection,
    hasPermission,
    operatorRole,
    canSnapshotRelease,
    isMainImgVisual,
    isMainImgOperator
  } = params

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const getDefaultStateInfo = (): Record<string, number> => ({ 0: 0, 1: 0 })

  const dataList = ref<Array<DataItem>>([])
  const stateInfo = ref<Record<string, number>>(getDefaultStateInfo())
  const statistics = ref<any>({})
  const normalizeStateInfo = (data: any): Record<string, number> => {
    const base = getDefaultStateInfo()
    if (!data) return base
    if (typeof data === 'object') {
      Object.keys(data).forEach((key) => {
        const valueNumber = Number((data as Record<string, number | string>)[key])
        base[key] = Number.isFinite(valueNumber) ? valueNumber : 0
      })
    }
    return base
  }

  const lastScreenQueryKey = ref<string>('')

  const refreshScreenState = async (params: any = {}) => {
    const queryKey = JSON.stringify(params || {})
    lastScreenQueryKey.value = queryKey
    try {
      const res = await selectCountForUnblock(params).catch(() => null)
      if (lastScreenQueryKey.value !== queryKey) return
      stateInfo.value = normalizeStateInfo(res)
    } catch (error) {
      if (lastScreenQueryKey.value !== queryKey) return
      stateInfo.value = getDefaultStateInfo()
    }
  }

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  // 查询配置
  const scheme = computed(() => [
    {
      field: 'store',
      label: '店铺',
      isCustom: true,
      customRender: () => (
        <StoreRangePlus
          width="230px"
          showAllChannels={false}
          multiple={false}
          placeholder="请选择店铺"
        />
      ),
      componentProps: { showAllChannels: false, multiple: false, placeholder: '请选择店铺' }
    },
    {
      field: 'productCode',
      label: '货品编码',
      componentProps: { placeholder: '请输入货品编码', clearable: true }
    },
    {
      field: 'operator',
      label: '运营人员',
      isCustom: true,
      customRender: () => (
        <SelectUser multiple={false} showAvatarLable={true} role={operatorRole?.value || ''} />
      ),
      componentProps: {
        multiple: false,
        showAvatarLable: true,
        role: operatorRole?.value || '',
        placeholder: '请选择运营人员'
      }
    }
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({
    ...new Screen({
      field: 'isUnblock',
      label: '列表状态:',
      options: [
        { label: '已解封', value: 1 },
        { label: '未解封', value: 0 }
      ],
      props: {}
    })
  }))
  const hasCreate = computed(() => !isMainImgOperator?.value)
  const hasSnapshotRelease = computed(() => !canSnapshotRelease?.value)
  const btns = computed(() => {
    return [
      {
        fun: 'create',
        txt: '新增分析',
        type: 'primary',
        display: () => hasCreate.value
      },
      {
        fun: 'snapshotRelease',
        txt: '快照解封',
        type: 'primary',
        plain: true,
        disabled: () => !selectRows?.value?.length,
        display: () => hasSnapshotRelease.value
      }
    ]
  })

  const column = computed(() => [
    { field: 'storeName', title: '店铺', minWidth: 200, fixed: 'left' },
    {
      field: 'productCode',
      title: '货品编码',
      width: 150,
      isCustom: true,
      customRender: (_item: any) => {
        const productCode = _item.productCode
        // typeof _item.productCode === 'string'
        //   ? _item.productCode.split(',').join(' ')
        //   : _item.productCode
        return <OverflowTooltip content={productCode || '-'} lineClamp={2}></OverflowTooltip>
      }
    },
    {
      field: 'operatorList',
      title: '运营人员',
      width: 300,
      isCustom: true,
      customRender: (_item: any) => (
        <LineReveals optionsList={_item.operatorList || []} noBg={true} />
      )
    },
    {
      field: 'createdAt',
      title: '创建时间',
      width: 180,
    },
    {
      field: 'updatedAt',
      title: '更新时间',
      width: 180,
    },
    {
      field: 'mainDirection',
      title: '链接主打方向',
      width: 300,
      isCustom: true,
      customRender: (_item: any) => (
        <OverflowTooltip content={_item.mainDirection || '-'} lineClamp={2}></OverflowTooltip>
      )
    },
    {
      field: 'imgUrl',
      title: '快照信息',
      width: 130,
      align: 'center',
      isCustom: true,
      customRender: (_item: any) => <LineImage urls={_item.imgUrl || ''} width={40} height={40} />
    },
    {
      field: 'mainImageUrl',
      title: '产品款式图',
      width: 130,
      align: 'center',
      isCustom: true,
      customRender: (_item: any) => (
        <LineImage urls={_item.mainImageUrl || ''} width={40} height={40} />
      )
    },
    {
      field: 'productFeaturesQuantity',
      title: '产品特点',
      width: 120,
      align: 'right',
      isCustom: true,
      customRender: (_item: any) => (
        <ElLink type="primary" underline={false} onClick={() => openSection?.('features', _item)}>
          {_item.productFeaturesQuantity ?? 0}
        </ElLink>
      )
    },
    {
      field: 'competitorAnalysisQuantity',
      title: '竞品分析',
      width: 120,
      align: 'right',
      isCustom: true,
      customRender: (_item: any) => (
        <ElLink type="primary" underline={false} onClick={() => openSection?.('competitor', _item)}>
          {_item.competitorAnalysisQuantity ?? 0}
        </ElLink>
      )
    },
    {
      field: 'mainImageSellingPointsQuantity',
      title: '主图卖点',
      width: 120,
      align: 'right',
      isCustom: true,
      customRender: (_item: any) => (
        <ElLink
          type="primary"
          underline={false}
          onClick={() => openSection?.('sellingPoint', _item)}
        >
          {_item.mainImageSellingPointsQuantity ?? 0}
        </ElLink>
      )
    }
  ])

  const handleColumn = computed(() => [
    { fun: 'view', txt: '查看' },
    {
      fun: 'edit',
      txt: '编辑',
      reveal: (row: any) => !!hasPermission?.(row) || row.sfqr === 1
    },
    {
      fun: 'confirm',
      txt: '快照确认',
      reveal: (row: any) => row.sfqr === 1
    },
    {
      fun: 'delete',
      txt: '删除',
      type: 'danger',
      reveal: (row: any) => !!hasPermission?.(row) || row.sfqr === 1
    }
  ])

  const setRouterInfo = () => {
    let params: Record<string, any> = {}
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
    stateInfo,
    statistics,
    handleColumn,
    refreshScreenState,
    setRouterInfo,
    selectable
  }
}
