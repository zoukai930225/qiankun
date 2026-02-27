/*
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2025-12-02 11:50:19
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-01-04 17:25:43
 */
import {
  categoryOps,
  seasonCategoryOps,
  isUnsalableOps
} from '@/views/maintenance/unsalable/page/options'
import LineChannel from '@/components/template/table/components/lineChannel.vue'
import GoodInfo from '@/components/common/goods/goodInfo.vue'
import { PageItem } from '@/components/template/config/type'
import SynchronizedRevokeBtn from '../components/revokeBtn.vue'
import EditableCellComp from '../components/EditableCell.vue'

// 将组件赋值给变量以在 TSX 中使用
const EditableCell = EditableCellComp as any

// 查询结构
export class SearchItem {
  productName: string = ''
  productNumber: string = ''
  goodsId: string = ''
  store: string = ''
  isUnsalable: any = ''
  groundingTime: any = ''
}

// 表格数据结构
export class DataItem {
  id: string = ''
  goodsId: string = ''
  name: string = ''
  productName: string = ''
  productNumber: string = ''
  channel: string = ''
  storeName: string = ''
  xl30: number = 0
  costs: number = 0
  isUnsalable: any = ''
  category: any = ''
  seasonCategory: any = ''
  directorId: string = ''
  directorName: string = ''
  image: string = ''
  store: string = ''
  groundingTime: string = ''
}

// 通用入参
export const usePage = (params: any = {}) => {
  const route = useRoute()

  // 外部组件入参
  const { selectRows, storeOptions, channels, activeTabs } = params

  // 模板必备变量(不可修改，按需追加，自行导出使用)
  const dataList = ref<Array<DataItem>>([]),
    stateInfo = ref<any>({}),
    statistics = ref<any>({})

  const searchData = ref<SearchItem>({ ...new SearchItem() }),
    loading = ref<boolean>(false),
    page = ref<PageItem>({ ...new PageItem() })

  // 查询配置(必配)
  const scheme = computed(() => [
    { field: 'productName', label: '货品名称' },
    { field: 'productNumber', label: '编码' },
    { field: 'goodsId', label: '商品ID' },
    {
      field: 'store',
      label: '店铺',
      component: 'Select',
      options: storeOptions.value,
      // [{ label: '已封版', value: 1 }, { label: '未封版', value: 0 }]
      componentProps: { clearable: true }
    },
    {
      field: 'isUnsalable',
      label: ['是否为滞', '销品'],
      component: 'Select',
      options: isUnsalableOps,
      // [{ label: '已封版', value: 1 }, { label: '未封版', value: 0 }]
      componentProps: { clearable: true }
    },
    {
      field: 'groundingTime',
      label: '上架时间',
      component: 'DatePicker',
      width: 210,
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        format: 'YYYY-MM-DD',
        clearable: true
      }
    }
    // { field: 'store', label: '店铺', isCustom: true, customRender: (_item) => <StoreRangePlus v-model={_item.storeName} width={230} placeholder={"请选择店铺"} clearable={true} /> }
  ])

  // 状态筛选(非必配)
  const screen = computed(() => ({}))

  // 操作配置(非必配，默认新增fun为add，内部已处理直接打开对应抽屉)
  const btns = computed(() => [
    {
      fun: 'batchDeletion',
      txt: '批量移除',
      type: 'danger',
      plain: true,
      disabled: () => !selectRows.value.length
    },
    {
      fun: 'set',
      txt: '批量设置',
      type: 'primary',
      plain: true,
      disabled: () => !selectRows.value.length
    },
    {
      fun: 'revoke',
      txt: '撤销同步',
      isCustom: true,
      customRender: (_item) => <SynchronizedRevokeBtn />
    },
    {
      fun: 'importDiy',
      type: 'primary',
      plain: true,
      txt: '导入'
    },
    {
      fun: 'exportDiy',
      type: 'primary',
      plain: true,
      txt: '导出'
    },
    { fun: 'goods', txt: '同步货品', type: 'primary' }
  ])

  // 表格配置(非必配)
  const column = computed(() => [
    {
      field: 'name',
      title: '商品',
      minWidth: 200,
      fixed: 'left',
      isCustom: true,
      customRender: (_item) => <GoodInfo row={{ ..._item, goodsImage: _item.image }} />
    },
    { field: 'productName', title: '货品名称', minWidth: 180 },
    { field: 'productNumber', title: '编码', width: 100 },
    { field: 'goodsId', title: '商品ID', minWidth: 180 },
    {
      field: 'channel',
      title: '渠道',
      width: 110,
      isCustom: true,
      customRender: (_item) => <LineChannel channel={_item.channel} />
    },
    { field: 'storeName', title: '店铺', minWidth: 220 },
    { field: 'xl30', title: '30天销量', width: 100 },
    {
      field: 'costs',
      title: '成本',
      width: 140,
      isCustom: true,
      customRender: (_item) => (
        <EditableCell
          v-model={_item.costs}
          type="number"
          precision={9}
          onChange={(val) => (_item.costs = val)}
          placeholder="请输入"
        />
      )
    },
    {
      field: 'groundingTime',
      title: '上架时间',
      minWidth: 190
    },
    {
      field: 'isUnsalable',
      title: '是否为滞销品',
      width: 160,
      isCustom: true,
      customRender: (_item) => (
        <EditableCell
          v-model={_item.isUnsalable}
          type="select"
          options={isUnsalableOps}
          onChange={(val) => setIsUnsalable(val, _item)}
          placeholder="请选择"
        />
      )
    },
    {
      field: 'category',
      title: '品类',
      width: 160,
      isCustom: true,
      customRender: (_item) => (
        <EditableCell
          v-model={_item.category}
          type="select"
          options={categoryOps}
          onChange={(val) => (_item.category = val)}
          placeholder="请选择"
        />
      )
    },
    {
      field: 'seasonCategory',
      title: '季节分类',
      width: 160,
      isCustom: true,
      customRender: (_item) => (
        <EditableCell
          v-model={_item.seasonCategory}
          type="select"
          options={seasonCategoryOps}
          onChange={(val) => (_item.seasonCategory = val)}
          placeholder="请选择"
        />
      )
    },
    {
      field: 'directorId',
      title: '责任人',
      width: 200,
      isCustom: true,
      customRender: (_item) => (
        <EditableCell
          v-model={_item.directorId}
          type="user"
          userName="directorName"
          userId="directorId"
          item={_item}
          onChange={(val) => (_item.directorId = val)}
          placeholder="请选择"
        />
      )
    }
  ])

  // 表格操作行(非必配，涉及抽屉编辑(edit)和详情(view)唯一且不可修改)
  const handleColumn = computed(() => [{ fun: 'delLine', txt: '移除', type: 'danger' }])

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

  const setIsUnsalable = (value: any, _item: any) => {
    const tar: any = channels.value.find((cl: any) => cl.code === activeTabs.value)
    tar.data.find((rs: any) => rs.goodsId === _item.goodsId).isUnsalable = value
    dataList.value = [...tar.data]
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
    setRouterInfo,
    setIsUnsalable
  }
}
