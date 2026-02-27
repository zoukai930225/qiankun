<template>
  <div>
    <ContentWrap>
      <SWForm ref="SWFormRef" :fields="configList" @search="handleSearch" @reset="handleReset"
        :categoryList="categoryList" @add-more="handleAddMore" />
      <!-- </ContentWrap>
    <ContentWrap> -->
      <div v-loading="loading">
        <div v-if="nodeList && nodeList.length > 0"
          style="border: 1px solid #DDE2E9;margin-top: 15px;margin-bottom: 20px;box-sizing: border-box;">
          <SWNode ref="planChartsRef" :nodeList="nodeList" :parallelHeaderNodeList="parallelHeaderNodeList" />
        </div>
        <div class="table-main">
          <SWTable ref="SWTableRef" :tableColumns="configList" :tableData="list" :total="total" @blur="handleBlur"
            @page-change="handlePageChange" @sort-change="handleSortChange" @handle-online="handleOnline"
            @handle-progress="handleProgress" @information-export="informationExport" @handle-design="handleDesign"
            @handle-view="handleView" @handle-template="openTemplate" @open-node="openNode"
            @handle-competitor="openCompetitor" @selection-change="handleSelectionChange"
            @handle-product-number="handleProductNumber" @handle-new="handleNew" @update-progress="updateProgress"
            @refreshList="refreshList" />
        </div>
      </div>
    </ContentWrap>
    <NewDrawer ref="newDialogRef" />
    <!-- 上架信息维护 -->
    <EditOnlineInfoDialog ref="editOnlineInfoDialogRef" @success="getList" />
    <!-- 进度模板 -->
    <TemplateDialog ref="templateRef" @success="getList" />
    <!-- 竞品信息 -->
    <CompetitorDrawer ref="competitorRef" @success="getList" />
    <!-- 详情 -->
    <addDialog ref="addDialogRef" />
  </div>
</template>

<script lang="ts" setup>
import {
  getPlanNodeByDesignId,
  getProductPlanList,
  updateProductPlanStatus
} from '@/api/oa/new/develop'
import { getBasicAttribute } from '@/api/oa/new/plan/index'
import addDialog from './components/addDialog.vue'
import CompetitorDrawer from './components/competitorDrawer.vue'
import EditOnlineInfoDialog from './components/editOnlineInfoDialog.vue'
import NewDrawer from './components/newDrawer.vue'
import SWForm from './components/SWForm.vue'
import SWNode from './components/SWNode.vue'
import SWTable from './components/SWTable.vue'
import TemplateDialog from './components/templateDialog.vue'
import { useCategoryList } from './hooks.js'

import { getDesignDetailById, updateDesign } from '@/api/oa/new/designGallery/index'
import { planProductInfoExport } from '@/api/oa/new/plan/index'
import download from '@/utils/download'
import { getParallelHeaderNodeList, productStatusMap, testNodeList } from './utils'
import { redrawTree } from '@/utils'
import { cloneDeep } from 'lodash-es'

const { categoryList, initSelectData } = useCategoryList()

const route = useRoute()
const router = useRouter()
const productNumber = route.query.productNumber || undefined

const ids = route.query.ids || undefined

const message = useMessage() // 消息弹窗
defineOptions({ name: 'Product' })
const list = ref([]) // 列表数据
const total = ref(0) // 总数
const configList = ref([]) // 配置列表
const form = ref({
  page: 1,
  size: 10,
  productNumber
})
const loading = ref(false)
const planName = ref('')
const planCode = ref('')
// 节点
const nodeList = ref<any[]>([])

const newDialogRef = ref()
// 点击企划名称
const handleNew = (row: any) => {
  // console.log('点击', row)
  newDialogRef.value.open(row.developmentPlanId)
}

// 点击产品编号
const handleProductNumber = (row: any) => {
  console.log('点击产品编号', row)
}

// 进度模板
const templateRef = ref()
const openTemplate = (row: any) => {
  templateRef.value.open(row.id, row.templateId, row.planCode, row.planName)
}
// 竞品
const competitorRef = ref()
const openCompetitor = (row) => {
  competitorRef.value.open(row.npCompetitiveInformationId)
}

const handleBlur = async (row, key) => {
  let obj = JSON.parse(JSON.stringify(row))
  if (obj.jsonData) {
    delete obj.jsonData
  }
  const res = await getDesignDetailById(obj.id)

  res.productCode = obj.goodsCode || ''

  await updateDesign(res)

  getList()
}

// 获取节点信息
const isNode = ref(false)
const productType = ref('')
const openNodeInfo = ref({})
const openNode = (row: any) => {
  planName.value = row.planName || ''
  planCode.value = row.planCode || ''
  productType.value = row.productType || ''
  openNodeInfo.value = row || {}

  getNodeInfo(row.id, row.templateId)
}

// 并行头部节点
const parallelHeaderNodeList = ref([])
const getNodeInfo = async (id, templateId) => {
  if (!id) {
    return
  }
  isNode.value = false

  const res = await getPlanNodeByDesignId({ npDesignPictureGodownId: id })
  if (typeof res === 'string') {
    isNode.value = false
    message.warning(res)
    nodeList.value = []
  } else {
    isNode.value = true
    nodeList.value = res || []
  }
  nextTick(() => {
    transtoTree(nodeList.value)
  })
}

const planChartsRef = ref()
const transtoTree = (nodes: any) => {
  const list: any[] = []
  nodes.forEach((item: any) => {
    const { preNodeCode } = item
    const temp = preNodeCode.split(',')
    temp.forEach((tem: any) => {
      const obj = cloneDeep(item)
      obj['preNodeCode'] = tem
      list.push(obj)
    })
  })
  const tree = redrawTree(list, '0', 'preNodeCode', 'nodeCode')
  planChartsRef?.value?.initCharts(tree, list, {
    mode: 'horizontal',
    site: { x: 80, y: 110 }, // 起始位置
    size: { width: 56, height: 56 }, // 节点大小
    space: { x: 250, y: 72, }, // 节点间距
    corner: {
      top: { addX: 225, reduceX: 25, addY: 32, reduceY: 43 },
      bottom: { addX: 75, reduceX: 87, addY: 28, reduceY: 85 }
    },
    args: {
      dx: 15,
      dy: 25,
    },
  })
};

// 上架维护
const editOnlineInfoDialogRef = ref()
const handleOnline = async (row: any) => {
  editOnlineInfoDialogRef.value?.open(row)
}

// 进度维护
const handleProgress = async (row: any) => {
  router.push({
    name: 'ProductProgress',
    params: {
      id: row.id || ''
    },
    query: {
      developmentPlanId: row.developmentPlanId,
      productType: row.productType
    }
  })
}

//资料导出

const informationExport = async (row: any) => {
  try {
    row.loading = true
    const data = await planProductInfoExport(row.id).catch((err: {}) => {
      console.log(err)
    })
    if (data) {
      download.excel(data, '定品资料.xlsx')
    }
  } finally {
    row.loading = false
  }
}

// 打开详情
const addDialogRef = ref()
const handleView = (row: any) => {
  console.log('详情', row)
  addDialogRef.value.open(row)
}

// 新增设计图
const handleDesign = (row: any) => {
  console.log(row)
}
// 参数变化
const handleSearch = (val: any) => {
  openNodeInfo.value = {}
  form.value = Object.assign({ page: 1, size: form.value.size }, val)
  if (!form.value.planListDate) {
    form.value.planListDate = undefined
  }
  getList()
}

const handleReset = () => {
  openNodeInfo.value = {}
  form.value = { page: 1, size: 10 }
  orderParam.value = { prop: '', custorOrder: null }
  getList()
}

// 分页变化
const handlePageChange = (val: any) => {
  form.value = { ...form.value, ...val }
  getList()
}

const orderParam = ref({
  prop: '',
  custorOrder: null
})

const handleSortChange = ({ prop, custorOrder }) => {
  orderParam.value = { prop, custorOrder }
  getList()
}

const warnConfig = {
  id: 0,
  name: '',
  listDisplay: true,
  state: 1,
  code: 'customWarn'
}

// 获取配置
const getConfig = async () => {
  const params = {
    code: 'Product'
  }
  const res = await getBasicAttribute(params)
  configList.value = res || []

  // 将配置列表根据sort进行排序
  configList.value.sort((a, b) => a.sort - b.sort)
  handleIsShowWarnInfo()
}

// 处理是否显示提醒信息
const handleIsShowWarnInfo = () => {
  if (list.value.length > 0 && configList.value.length > 0) {
    const isShowWarn = list.value.some((item) => item.newProgress === '1')
    if (configList.value[0].code === 'customWarn' && !isShowWarn) {
      configList.value.splice(0, 1)
    } else if (configList.value[0].code !== 'customWarn' && isShowWarn) {
      configList.value = [warnConfig, ...configList.value]
    }
  }
}

const updateProgress = (row) => {
  list.value.forEach((item) => {
    if (item.id === row.id) {
      item.newProgress = row.newProgress
    }
  })
  handleIsShowWarnInfo()
}

//商企回收刷新页面
const refreshList = (id) => {
  if (openNodeInfo.value && openNodeInfo.value.id === id) {
    getList(true)
  } else {
    getList(false)
  }
}

const getList = async (hideNode = false) => {
  isNode.value = false
  try {
    let formData = new FormData()
    formData.append(
      'queryParam',
      JSON.stringify({
        ...form.value,
        chooseStatus: '2',
        page: undefined,
        size: undefined
      })
    )
    loading.value = true
    const res = await getProductPlanList({
      ...form.value,
      chooseStatus: '2'
    })
    list.value = res.records || []
    total.value = res.total || 0
    handleIsShowWarnInfo()
  } catch (error) {
  } finally {
    loading.value = false
  }
  if (openNodeInfo.value && openNodeInfo.value.id) {
    if (hideNode) {
      nodeList.value = []
    } else {
      selectHgiglightRow()
      openNode(openNodeInfo.value)
    }
  } else {
    if (list.value.length > 0 && !openNodeInfo.value.id) {
      openNodeInfo.value = list.value[0]
      getNodeInfo(openNodeInfo.value.id, openNodeInfo.value.templateId)
      selectHgiglightRow()
    }
  }
}

const SWTableRef = ref()
const selectHgiglightRow = () => {
  if (openNodeInfo.value) {
    SWTableRef.value?.selectHgiglightRow(openNodeInfo.value)
  }
}

const selectRows = ref([]) // 选中行
const handleSelectionChange = (val: any) => {
  console.log(val)
  selectRows.value = val
}

// 点击打样，制样，齐色，定品
const handleAddMore = async (data: any) => {
  const { code } = data
  if (selectRows.value.length === 0) return message.warning('请选择需要操作的行')

  // 如果 selectRows.value 为空，或者 productStatus 为 null 或 undefined，继续执行
  // 如果已经进入下一阶段，则提示
  if (
    selectRows.value.length > 0 &&
    selectRows.value[0].productStatus &&
    selectRows.value[0].productStatus >= code
  ) {
    return message.warning(
      `产品已经在${productStatusMap(
        selectRows.value[0].productStatus
      )}状态，不能进行${productStatusMap(code)}操作`
    )
  }

  // 请求接口
  const ids = selectRows.value.map((item) => item.id)

  await updateProductPlanStatus({
    status: code,
    data: ids
  })

  message.success('操作成功')

  getList()
  console.log('请求接口')
}

onMounted(async () => {
  initSelectData()
  await getConfig()
  !ids && getList()
})

onActivated(() => {
  handleRouteParam()
  if (nodeList.value && nodeList.value.length > 0) {
    transtoTree(nodeList.value)
  }
})

const SWFormRef = ref()
const handleRouteParam = () => {
  let parmProductNumber = route.query.productNumber || ''
  if (ids) {
    form.value.ids = ids
    getList()
  }
  if (parmProductNumber) {
    form.value.productNumber = parmProductNumber + ''
    SWFormRef.value.setSearchProductNumberValue(parmProductNumber)
    getList()
  }
}

if (productNumber || ids) {
  const newUrl = window.location.href.replace(/\?.*$/, '') // 获取当前路径，并去除参数
  history.replaceState({}, '', newUrl)
}
</script>

<style lang="scss" scoped>
.table-main {
  border-radius: 6px;
}
</style>
