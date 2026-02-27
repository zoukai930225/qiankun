<template>
  <div>
    <ContentWrap>
      <SWForm ref="SWFormRef" @search="handleSearch" @reset="handleReset" />
    </ContentWrap>
    <ContentWrap>
      <SWNode :nodeList="nodeList" :parallelHeaderNodeList="parallelHeaderNodeList" />
      <div class="table-main">
        <SWTable ref="SWTableRef" :tableData="list" :total="total" :loading="loading" @page-change="handlePageChange"
          @sort-change="handleSortChange" @handle-progress="handleProgress" @open-node="openNode"
          @selection-change="handleSelectionChange" @handle-new="handleNew" @update-progress="updateProgress" />
      </div>
    </ContentWrap>

    <NewDrawer ref="newDialogRef" />
  </div>
</template>

<script lang="ts" setup>
import { getPlanNodeByDesignId, getProductPlanList } from '@/api/oa/package/develop'
import { cloneDeep } from 'lodash-es'
import NewDrawer from './components/newDrawer.vue'
import SWForm from './components/SWForm.vue'
import SWNode from './components/SWNode.vue'
import SWTable from './components/SWTable.vue'
import { getParallelHeaderNodeList } from './utils'

const route = useRoute()
const router = useRouter()
const productNumber = route.query.productNumber || undefined
const productCode = route.query.productCode || undefined
const ids = route.query.ids || undefined

const message = useMessage() // 消息弹窗
defineOptions({ name: 'PackageProduct' })
const list = ref<any[]>([]) // 列表数据
const total = ref(0) // 总数
const form = ref<any>({
  page: 1,
  pageSize: 10,
  planListDate: undefined,
  productNumber: undefined,
  ids: undefined
})
const loading = ref(false)
// 节点
const nodeList = ref<any[]>([])

const newDialogRef = ref()
// 点击企划名称
const handleNew = (row: any) => {
  newDialogRef.value.open(row.developmentTaskId)
}

// 获取节点信息
const isNode = ref(false)
const openNodeInfo = ref<any>({})
const openNode = (row: any) => {
  openNodeInfo.value = row || {}

  getNodeInfo(row)
}

// 并行头部节点  使用设计图id查询绑定各节点
const parallelHeaderNodeList = ref<any[]>([])
const getNodeInfo = async (row: any) => {
  isNode.value = false
  const params = {
    enterprisePlanId: row.enterprisePlanId || '', //企划id
    taskId: row.developmentTaskId, //任务id
    designGalleryId: row.designGalleryId || '' //设计图id
  }

  const res = await getPlanNodeByDesignId(params)
  console.log('节点信息111', res)
  const res1 = formatNodeListTree(res)
  if (typeof res1 === 'string') {
    isNode.value = false
    message.warning(res1)
  } else {
    isNode.value = true
    nodeList.value = res1
  }
  parallelHeaderNodeList.value = getParallelHeaderNodeList(cloneDeep(res1))
  if (
    parallelHeaderNodeList.value.length > 1 &&
    parallelHeaderNodeList.value[1].childNodes &&
    parallelHeaderNodeList.value[1].childNodes.length === 1
  ) {
    const oneNode = parallelHeaderNodeList.value[1].childNodes[0]
    let tempList: any[] = []
    nodeList.value.forEach((item) => {
      if (item.nodeCode == oneNode.nodeCode) {
        tempList.push(item)
        item.nextNodeCode = 'hideNode'
        let tempObj = { ...item }
        tempList.push({
          ...tempObj,
          id: '9999999',
          nodeName: '',
          nodeCode: 'hideNode',
          preNodeCode: oneNode.nodeCode,
          nextNodeCode: oneNode.nextNodeCode,
          childNodes: null
        })
      } else {
        tempList.push(item)
      }
    })
    nodeList.value = tempList
    parallelHeaderNodeList.value = getParallelHeaderNodeList(nodeList.value)
  }
}

const formatNodeListTree = (res1) => {
  if (typeof res1 === 'string') return res1
  const arr = [res1]
  const result: any[] = []

  const traverse = (nodes, preNodeCode = 0, parentIndex = '') => {
    nodes.forEach((node, idx) => {
      const nodeCode = node.taskDefinitionKey
      const nextNodeArr = node.nextProgress?.map((item) => item.taskDefinitionKey)?.join() || ''
      let childNodes1 = null
      const currentIndex = parentIndex === '' ? `${idx}` : `${parentIndex}-${idx}`

      if (node.nextProgress && node.nextProgress.length > 1) {
        childNodes1 = node.nextProgress.map((item, childIdx) => {
          return {
            ...item,
            nodeCode: item.taskDefinitionKey,
            preNodeCode: nodeCode,
            nextNodeCode: item.nextProgress?.map((n) => n.taskDefinitionKey).join() || '',
            childNodes: null,
            nodeName: item?.taskName,
            nextProgress: null,
            index: `${currentIndex}-${childIdx}` // 分支子节点index
          }
        })
      }

      const flatNode = {
        ...node,
        nodeName: node?.taskName,
        nodeCode,
        preNodeCode,
        nextNodeCode: nextNodeArr,
        childNodes: childNodes1,
        nextProgress: null,
        index: currentIndex // 当前节点index
      }
      result.push(flatNode)

      // 递归下一级
      if (node.nextProgress && node.nextProgress.length > 0) {
        traverse(cloneDeep(node.nextProgress), nodeCode, currentIndex)
      }
    })
  }

  traverse(arr)

  console.log('平铺节点', cloneDeep(result))
  //result 遍历result 如果nodeCode 和 nodeName 和 nextNodeCode 都相同 这两项合并 preNodeCode是相同节点的并集 字符串用逗号分隔
  const mergedResult: any[] = []
  result.forEach((item) => {
    const existingItem = mergedResult.find(
      (i) =>
        i.nodeCode === item.nodeCode &&
        i.nodeName === item.nodeName &&
        i.nextNodeCode === item.nextNodeCode
    )
    if (existingItem) {
      const preNodeCodes = new Set(
        existingItem.preNodeCode.split(',').concat(item.preNodeCode.split(','))
      )
      existingItem.preNodeCode = Array.from(preNodeCodes).join(',')
    } else {
      mergedResult.push({ ...item })
    }
  })
  console.log('合并后节点', cloneDeep(mergedResult))

  // 比如  preNodeCode: "DesignPictureExamine,SupplierChainDistribution"
  //  循环数组 当前项的preNodeCode包含两项。那么去数组中找 nodecode包含在这两项中的节点排到当前项的前面
  const finalResult: any[] = []
  mergedResult.forEach((item) => {
    const preNodeCodes = item.preNodeCode == 0 ? '0' : item.preNodeCode.split(',')
    if (preNodeCodes.length > 1) {
      preNodeCodes.forEach((code) => {
        const foundIndex = mergedResult.findIndex((i) => i.nodeCode === code)
        if (foundIndex !== -1) {
          const foundItem: any = mergedResult[foundIndex]
          if (!finalResult.includes(foundItem)) {
            finalResult.push(foundItem)
          }
        }
      })
      if (!finalResult.includes(item)) {
        finalResult.push(item)
      }
    } else {
      if (!finalResult.includes(item)) {
        finalResult.push(item)
      }
    }
  })
  console.log('最终节点', cloneDeep(finalResult))

  return cloneDeep(finalResult)
}

// 进度维护
const handleProgress = async (row: any) => {
  router.push({
    name: 'PackageProductProgress',
    params: { id: row.enterprisePlanId || '' },
    query: {
      developmentPlanId: row.developmentTaskId,
      productPlanId: row.productPlanId,
      designGalleryId: row.designGalleryId
    }
  })
}

// 参数变化
const handleSearch = (val: any) => {
  form.value = Object.assign({ page: 1, pageSize: form.value.pageSize }, val)
  if (!form.value.planListDate) {
    form.value.planListDate = undefined
  }
  console.log("handleSearch")
  getList()
}

const handleReset = () => {
  form.value = { page: 1, pageSize: 10, productNumber: undefined, planListDate: undefined }
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

// 更新进度提醒状态
const updateProgress = (row) => {
  nextTick(() => {
    list.value.forEach((item) => {
      if (item.productPlanId == row.id) {
        item.isNewProgress = row.isNewProgress
      }
    })
  })
}

// 获取产品计划列表
const getList = async () => {
  isNode.value = false
  try {
    loading.value = true
    const res = await getProductPlanList(form.value)
    list.value = res.records || []
    total.value = res.total || 0
  } catch (error) {
  } finally {
    loading.value = false
  }
  if (openNodeInfo.value && openNodeInfo.value.id) {
    selectHgiglightRow()
    openNode(openNodeInfo.value)
  }
}

const SWTableRef = ref()
const selectHgiglightRow = () => {
  if (openNodeInfo.value) {
    SWTableRef.value?.selectHgiglightRow()
  }
}

const selectRows = ref([]) // 选中行
const handleSelectionChange = (val: any) => {
  console.log(val)
  selectRows.value = val
}

onMounted(async () => {
  console.log("onMounted", productCode)
  if (!productCode && !ids) {
    getList()
  }

})

onActivated(() => {
  handleRouteParam()
})

const SWFormRef = ref()
const handleRouteParam = () => {
  let parmProductNumber = route.query.productNumber || ''
  let parmProductCode = route.query.productCode || ''
  if (ids) {
    form.value.ids = ids
    getList()
  }
  if (parmProductNumber) {
    form.value.productNumber = parmProductNumber + ''
    SWFormRef.value.setSearchProductNumberValue(parmProductNumber)
    getList()
  }
  if (parmProductCode) {
    form.value.productCode = parmProductCode + ''
    SWFormRef.value.setSearchProductCode(parmProductCode)
    getList()
  }
}

if (productNumber || productCode || ids) {
  const newUrl = window.location.href.replace(/\?.*$/, '') // 获取当前路径，并去除参数
  history.replaceState({}, '', newUrl)
}
</script>

<style lang="scss" scoped>
.table-main {
  background: linear-gradient(0,
      rgba(250, 252, 255, 0.19) 0%,
      rgba(242, 247, 255, 0.78) 37%,
      #ebf2ff 100%);
  border-radius: 6px;
  padding: 20px;
}
</style>
