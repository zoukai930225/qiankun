import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { PageItem, Screen } from '@/components/template/config/type' // 假设路径一致
import { ElLink, ElTag } from 'element-plus'
import Tag from '@/components/common/tag/tag.vue'
import AvatarDisplay from '@/components/Image/AvatarDisplay/index.vue'

export class SearchItem {
  purchaseNo: string = '' // 采购单号
  goodsNo: string = '' // 货品编号
  // 检验时间范围（对应接口 inspectionTimeBegin/inspectionTimeEnd）
  inspectionTimeRange: string[] = []
  inspectionStatus: string | number = '' // (质检状态0:未检查；1：合格；2.部分合格；3.不合格)
  inspectionQc: string = '' // 验货QC
  inspectionUser: string = '' // 质检员
}

// 2. 表格数据结构
export class DataItem {
  id: string = ''
  purchaserName: string = '' // 跟单员
  providerName: string = '' // 供应商
  purchaseNo: string = '' // 采购单号
  num2: number = 0 // 采购量
  productClass: number | null = null // 货品分类；0：半成品；1：成品
  inspectionStatus: number = 0 // 质检状态0:未检查；1：合格；2.部分合格；3.不合格
  checkTime: string = '' // 来货日期
  operatorTime: string = '' // 检验日期
  inspectionQc: string = '' // 验货QC
  inspectionUser: string = '' // 质检员
  inspectionRemark: string = '' // 备注
}

// 定义 Tag 组件支持的类型
type TagType = 'success' | 'warning' | 'info' | 'danger'

// 3. 字典 map (修改后)
const inspectionStatusMap: Record<number, { label: string; type: TagType }> = {
  0: { label: '未检', type: 'info' }, // 对应需求: 未检 -> info
  1: { label: '合格', type: 'success' }, // 对应需求: 合格 -> success
  2: { label: '部分合格', type: 'warning' }, // 对应需求: 部分合格 -> warning
  3: { label: '不合格', type: 'danger' } // 对应需求: 不合格 -> danger
}

const productClassMap: Record<number, { label: string; type: TagType }> = {
  0: { label: '半成品', type: 'info' }, // 对应需求: 半成品 -> info
  1: { label: '成品', type: 'success' } // 对应需求: 成品 -> success
}
export const usePage = (_params: any = {}) => {
  const route = useRoute()
  const openDetails = _params?.openDetails as undefined | ((item: any) => void)

  // 基础变量
  const dataList = ref<Array<DataItem>>([])
  const stateInfo = ref<any>({})
  const statistics = ref<any>({})
  const searchData = ref<SearchItem>({ ...new SearchItem() })
  const loading = ref<boolean>(false)
  const page = ref<PageItem>({ ...new PageItem() })

  const scheme = computed(() => [
    {
      field: 'purchaseNo',
      label: '采购单号',
      component: 'Input',
      componentProps: { placeholder: '请输入采购单号', clearable: true }
    },
    {
      field: 'goodsNo',
      label: '货品编号',
      component: 'Input',
      componentProps: { placeholder: '请输入货品编号', clearable: true }
    },
    {
      field: 'inspectionTimeRange',
      label: '检验日期',
      component: 'DatePicker',
      componentProps: {
        type: 'daterange',
        valueFormat: 'YYYY-MM-DD',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        clearable: true
      }
    },
    {
      field: 'inspectionStatus',
      label: '状态',
      component: 'Select',
      options: [
        { label: '未检', value: 0 },
        { label: '合格', value: 1 },
        { label: '部分合格', value: 2 },
        { label: '不合格', value: 3 }
      ],
      componentProps: { clearable: true, placeholder: '请选择状态' }
    },
    {
      field: 'inspectionQc',
      label: '验货QC',
      component: 'Input',
      componentProps: { placeholder: '请输入验货QC', clearable: true }
    },
    {
      field: 'inspectionUser',
      label: '质检员',
      component: 'Input',
      componentProps: { placeholder: '请输入质检员', clearable: true }
    }
  ])

  const btns = computed(() => [
    // 导出按钮配置
    {
      fun: 'exportCustom',
      txt: '导出',
      type: 'primary',
      // 没有列表数据时禁用导出按钮
      disabled: () => !dataList.value?.length,
      exportName: '来料检验单'
    }
  ])

  const column = computed(() => [
    {
      field: 'purchaseNo',
      title: '采购单号',
      width: 140,
      fixed: 'left',
      isCustom: true,

      customRender: (_item) => (
        <ElLink type="primary" underline={false} onClick={() => openDetails?.(_item)}>
          {_item.purchaseNo}
        </ElLink>
      )
    },
    { field: 'purchaserName', title: '跟单员', width: 100 },
    { field: 'num2', title: '采购量', width: 80, align: 'right' },
    {
      field: 'productClass',
      title: '货品分类',
      width: 100,
      isCustom: true,
      customRender: (_item) => {
        const code = Number(_item?.productClass)
        // 获取配置，默认给 info
        const conf = productClassMap[code] || { label: '-', type: 'info' }
        return <Tag type={conf.type}>{conf.label}</Tag>
      }
    },
    {
      field: 'inspectionStatus',
      title: '状态',
      width: 120,
      isCustom: true,
      customRender: (_item) => {
        const code = Number(_item?.inspectionStatus)
        // 获取配置，默认给 info
        const conf = inspectionStatusMap[code] || { label: '未知', type: 'info' }
        return <Tag type={conf.type}>{conf.label}</Tag>
      }
    },
    { field: 'checkTime', title: '来货日期', width: 160 },
    { field: 'operatorTime', title: '检验日期', width: 160 },
    { field: 'inspectionQc', title: '验货QC', minWidth: 100 },
    { field: 'inspectionUser', title: '质检员', minWidth: 100 },
    { field: 'inspectionRemark', title: '备注', minWidth: 200, showOverflowTooltip: true },
    {
      field: 'operatorUserName',
      title: '操作人',
      minWidth: 100,
      isCustom: true,
      customRender: (_item) => {
        return (
          <AvatarDisplay
            avatars={[{ name: _item.operatorUserName, src: _item.operatorUserAvatarOrigin }]}
          />
        )
      }
    }
  ])

  const handleColumn = computed(() => [
    {
      fun: 'inspect',
      txt: '检验',
      // 只有状态为“未检”(0)时才显示“检验”按钮
      reveal: (_item) => Number(_item?.inspectionStatus) === 0
    }
  ])

  const screen = computed(() => ({
    ...new Screen({})
  }))

  // 设置路由参数回显
  const setRouterInfo = () => {
    let params: Object = {}
    const param: any = route.params
    const query: any = route.query
    Object.assign(params, param, query)
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
    setRouterInfo
  }
}
