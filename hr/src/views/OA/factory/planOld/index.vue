<template>
  <ContentWrap>
    <div class="mb-5px">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="mb-5px" label-width="80">
            <el-form-item label="供应商名称" prop="supplierName">
              <template #label>
                <div>
                  <div style="height: 16px;line-height: 16px;">供应商名</div>
                  <div style="height: 16px;line-height: 16px;">称</div>
                </div>
              </template>
              <el-input class="!w200px" v-model="queryParams.supplierName" placeholder="请输入供应商名称" clearable />
            </el-form-item>
            <el-form-item label="货品编码" prop="productCode">
              <el-input class="!w200px" v-model="queryParams.productCode" placeholder="请输入货品编码" clearable />
            </el-form-item>
            <el-form-item label="系列" prop="series">
              <el-input class="!w200px" v-model="queryParams.series" placeholder="请输入系列" clearable />
            </el-form-item>
            <el-form-item label="品类" prop="categoryName">
              <el-input class="!w200px" v-model="queryParams.categoryName" placeholder="请输入品类" clearable />
              <!-- <el-select
                class="!w200px"
                v-model="queryParams.category"
                placeholder="请选择品类"
                clearable
              >
              <el-option 
                v-for="cate in categoryList"
                :key="cate.code"
                :label="cate.name"
                :value="cate.code"
              />
              </el-select> -->
            </el-form-item>

            <!-- <el-form-item label="当前节点" prop="issueType" v-if="isExpand">
              <el-input
                class="!w200px"
                v-model="queryParams.orderNo"
                placeholder="请输入当前节点"
                clearable
              />
            </el-form-item> -->
            <el-form-item label="采购人员" prop="purchaseUserId" v-if="isExpand">
              <SWSelectPeople style="width: 200px" :isEdit="true" v-model:modelValue="queryParams.purchaseUserId"
                placeholder="请选择采购人员" :deptCode="'NEW_DEPT_PURCHASE'" />
            </el-form-item>
            <el-form-item label="版师" prop="patternMakerId" v-if="isExpand">
              <SWSelectPeople style="width: 200px" :isEdit="true" :multiple="false"
                v-model:modelValue="queryParams.patternMakerId" type="operate" placeholder="请选择版师"
                :deptCode="'NEW_PRODUCT_DEPT_DEVELOP'" />
            </el-form-item>
            <el-form-item label="设计师/买手" prop="designerId" v-if="isExpand">
              <SWSelectPeople style="width: 200px" :isEdit="true" :multiple="false"
                v-model:modelValue="queryParams.designerId" type="operate" placeholder="请选择设计师/买手"
                :deptCode="'NEW_PRODUCT_DEPT_DEVELOP'" />
            </el-form-item>

            <el-form-item label="选供专员" prop="chosenSupplierStaffId" v-if="isExpand">
              <SWSelectPeople style="width: 200px" :isEdit="true" :multiple="false"
                v-model:modelValue="queryParams.chosenSupplierStaffId" placeholder="请选择选供专员"
                :deptCode="'NEW_PRODUCT_DEPT_SUPPLY'" />
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="handleQuery" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
              重置
            </el-button>
          </div>
          <SWFilterExpandAllNew :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
        </div>
      </div>
    </div>

    <!-- 节点进度流程图 -->
    <div v-if="currentRow.fsTaskId" v-loading="nodeProgressLoading" style="border-radius: 8px; margin-bottom: 10px">
      <flow-charts ref="flowRef" />
    </div>
    <!-- <div class="nodeProgress" v-if="currentRow.fsTaskId">
      <el-scrollbar v-loading="nodeProgressLoading">
        <nodeDotProgress :nodeData="currentNodeProgressData" />
      </el-scrollbar>
    </div> -->
    <!-- 列表 -->
    <listTable ref="tableRef" :list="list" :loading="loading" @click-btn="handleClick" />
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList" />
    </div>
  </ContentWrap>
</template>

<script lang="tsx" setup>
import * as factoryPlanApi from '@/api/oa/factory/plan'
import listTable from './components/listTable.vue'
import nodeDotProgress from './components/node/nodeDotProgress.vue'
import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
import FlowCharts from './components/flow.vue'
import { treeToArray, redrawTree } from '@/utils'
import { useRouteInfo } from '@/hooks/common/useRouteInfo'
import { bottom } from '@antv/x6/lib/registry/port-layout/line'

const { getRouteInfo } = useRouteInfo()

const router = useRouter(),
  tableRef = ref()
// import { useCategoryList } from '@/views/OA/factory/hooks'
const message = useMessage()
// const { categoryList, initSelectData } = useCategoryList()

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0),
  flowRef = ref() // 列表的总页数
const isExpand = ref(false)

const queryParams = ref<any>({
  page: 1,
  size: 10
})

/** 操作 */
const currentRow = ref<any>({})
const currentNodeProgressData = ref<Array<any>>([])
const nodeProgressLoading = ref(false)
const handleClick = async (type: string, row: any) => {
  const { fsTaskId, supplierId } = row
  if (type === 'progress') {
    router.push({
      name: 'FactoryProductProgress',
      query: {
        supplierId
      },
      params: {
        id: fsTaskId
      }
    })
  }

  if (type === 'selectRow') {
    currentRow.value = row
    const { fsTaskId, supplierId } = row
    nodeProgressLoading.value = true
    try {
      const data = await factoryPlanApi.getProgressDashboard({ fsTaskId, supplierId })
      const list: any = treeToArray([data], 'taskDefinitionKey', 'nextProgress');
      // lengthways
      flowRef?.value?.initCharts([data], list,
        {
          mode: 'horizontal',
          site: { x: 50, y: 100 },
          size: { width: 66, height: 66 },
          space: { x: 200, y: 72, },
          corner: {
            top: { addX: 182, reduceX: 25, addY: 32, reduceY: 35 },
            bottom: { addX: 95, reduceX: 87, addY: 36, reduceY: 85 }
          },
          args: {
            dx: 15,
            dy: 30,
          },
        });
    } finally {
      nodeProgressLoading.value = false
    }
  }
}

const queryFormRef = ref() // 搜索的表单
/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()

  handleQuery()
}
// 处理参数
const handleParams = () => {
  const params = { ...queryParams.value }
  params.purchaseUserId = params.purchaseUserId?.map((item: any) => item.userId).join(',')
  params.chosenSupplierStaffId = params.chosenSupplierStaffId?.length
    ? params.chosenSupplierStaffId[0].userId
    : ''
  params.patternMakerId = params.patternMakerId?.length ? params.patternMakerId[0].userId : ''
  params.designerId = params.designerId?.length ? params.designerId[0].userId : ''
  return params
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = handleParams()
    const data = await factoryPlanApi.getProductPlanList(params)
    list.value = data.records || [{}]
    total.value = data.total
    list?.value?.length && tableRef?.value?.defaultClick(list.value[0])
  } finally {
    loading.value = false
  }
}

// 跳转带id查询
const route = useRoute()
if (route.query?.fsTaskId) {
  const newUrl = window.location.href.replace(/\?.*$/, '')
  history.replaceState({}, '', newUrl)
}

/** 初始化 **/
onMounted(() => {
  if (route.query?.fsTaskId) {
    queryParams.value.fsTaskId = route.query?.fsTaskId
    queryParams.value.supplierId = route.query?.supplierId
    getList()
    delete queryParams.value.fsTaskId
    delete queryParams.value.supplierId
  } else {
    getList()
  }
  // initSelectData()
})
</script>

<style lang="less" scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 2px;
}

.nodeProgress {
  width: 100%;
  margin-bottom: 20px;
}
</style>
