<!--
 * @Date: 2024-06-06 10:13:37
-->
<template>
  <div>
    <ContentWrap>
      <div class="flex-row">
        <div style="flex: 1">
          <el-form :model="queryParams" ref="formRef" :inline="true" label-width="100px">
            <el-form-item label="货品编号" prop="productNumber">
              <el-input
                class="searchFormItemWidth"
                v-model="queryParams.productNumber"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                placeholder="请输入货品编码"
                clearable
              />
            </el-form-item>
            <el-form-item label="货品名称" prop="productName">
              <el-input
                class="searchFormItemWidth"
                v-model="queryParams.productName"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                placeholder="请输入货品名称"
                clearable
              />
            </el-form-item>
            <el-form-item label="采购人员" prop="procurementPersonnel">
              <el-select
                class="dialogFormItemWidth"
                v-model="queryParams.procurementPersonnel"
                placeholder="请选择采购人员"
                clearable
                @change="handleQuery"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in peopleList"
                  :key="dict.userId"
                  :label="dict.name"
                  :value="dict.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="运营人员" v-show="isExpand" prop="operationsPersonnel">
              <el-select
                class="dialogFormItemWidth"
                v-model="queryParams.operationsPersonnel"
                placeholder="请选择运营人员"
                clearable
                @change="handleQuery"
                style="width: 200px"
              >
                <el-option
                  v-for="dict in peopleList"
                  :key="dict.userId"
                  :label="dict.name"
                  :value="dict.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="产品出处" v-show="isExpand" prop="productSource">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.productSource"
                placeholder="请选择产品出处"
                @change="handleQuery"
                @clear="handleQuery"
                clearable
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PRODUCT_SOURCE, true)"
                  :key="dict.code"
                  :label="dict.label"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="新老品" v-show="isExpand" prop="goodsNewOld">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.goodsNewOld"
                placeholder="请选择状态"
                @change="handleQuery"
                @clear="handleQuery"
                clearable
              >
                <el-option
                  v-for="dict in getIntDictOptions(
                    DICT_TYPE.SYSTEM_PARAM_NEW_AND_OLD_PRODUCTS,
                    true
                  )"
                  :key="dict.code"
                  :label="dict.label"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item label="类目" prop="category" v-show="isExpand">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.category"
                placeholder="请选择类目"
                @change="handleQuery"
                @clear="handleQuery"
                clearable
              >
                <el-option
                  v-for="dict in categoryList"
                  :key="dict.code"
                  :label="dict.name"
                  :value="dict.code"
                />
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="等级" prop="productGrade" v-show="isExpand">
              <el-input
                class="searchFormItemWidth"
                v-model="queryParams.productGrade"
                @clear="handleQuery"
                @keyup.enter="handleQuery"
                placeholder="请输入等级"
                clearable
              />
            </el-form-item> -->
            <el-form-item label="是否安全期内" prop="isSafe" v-show="isExpand">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.isSafe"
                placeholder="请选择"
                @change="handleQuery"
                @clear="handleQuery"
                clearable
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)"
                  :key="dict.label"
                  :label="dict.label"
                  :value="dict.label"
                />
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <div class="commonTopFilterWrap-search">
            <div class="commonTopFilterWrap-search-container">
              <el-button @click="handleQuery" class="commonSearchBtn">
                <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                搜索
              </el-button>

              <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
                重置
              </el-button>
              <SWFilterAdd
                class="commonAddBtn"
                :list="addList"
                :current-code="currentAddCode"
                @add-btn-click="addBtnClick"
              />
            </div>
          </div>
        </div>
      </div>
      <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
      <div>
        <el-table
          :header-cell-style="appStore.headerCellStyle"
          v-loading="loading"
          :data="list"
          :stripe="true"
          :show-overflow-tooltip="true"
          class="SWCommonTable"
          v-horizontal-scroll="'always'"
        >
          <el-table-column label="类目" prop="category" min-width="120">
            <template #default="scope">
              {{ formatCategoryList(scope.row.category) }}
            </template>
          </el-table-column>
          <el-table-column label="供应商" prop="supplier" min-width="120">
            <template #default="scope">
              {{ formartSupplier(scope.row.supplier) }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="新品老品" prop="goodsNewOld" min-width="120">
            <template #default="scope">
              {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_NEW_AND_OLD_PRODUCTS, scope.row.goodsNewOld) }}
            </template>
          </el-table-column>

          <el-table-column label="产品等级" prop="productGrade" min-width="180">
            <template #default="scope">
              {{ getproductGradeLabel(scope.row.productGrade) }}
            </template>
          </el-table-column> -->
          <el-table-column label="产品出处" prop="productSource" min-width="180">
            <template #default="scope">
              {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_PRODUCT_SOURCE, scope.row.productSource) }}
            </template>
          </el-table-column>
          <el-table-column label="货品编号" prop="productNumber" min-width="180" />
          <el-table-column label="货品名称" prop="productName" min-width="180" />
          <el-table-column label="30天周转天数是否在安全值内" prop="isSafe" min-width="150" />
          <el-table-column
            label="对比前日销量涨幅(20%及以上填写)"
            prop="salesGrowthRate"
            min-width="150"
          />
          <el-table-column label="昨日销量" prop="yesterdaySales" min-width="180" />
          <el-table-column label="前日销量" prop="dayBeforeYesterdaySales" min-width="180" />
          <el-table-column label="7天销量" prop="salesSevenDays" min-width="180" />
          <el-table-column
            label="7天销量对应库存周转天数"
            prop="sevenTurnoverDays"
            min-width="120"
          />
          <el-table-column label="14天销量" prop="salesFourteenDays" min-width="180" />
          <el-table-column
            label="14天销量对应库存周转天数"
            prop="fourteenTurnoverDays"
            min-width="120"
          />
          <el-table-column label="30天销量" prop="salesThirtyDays" min-width="180" />
          <el-table-column
            label="30天销量对应库存周转天数"
            prop="thirtyTurnoverDays"
            min-width="120"
          />
          <el-table-column label="可发库存" prop="availableInventory" min-width="120" />
          <el-table-column label="采购在途" prop="purchaseInTransit" min-width="180" />
          <el-table-column label="工厂未发" prop="factoryNotSendOutGoods" min-width="180" />
          <el-table-column label="出货周期" prop="categoryName" min-width="180">
            <template #default="scope">
              {{ formatInterval(scope.row) }}
            </template>
          </el-table-column>
          <el-table-column label="出货量(周)" prop="shipmentVolumeWeek" min-width="180" />
          <el-table-column label="安全库存周期" prop="safetyStockCycle" min-width="180" />
          <el-table-column label="最近出货时间" prop="recentShipmentTime" min-width="180" />
          <el-table-column label="采购人员" prop="procurementPersonnel" min-width="180">
            <template #default="scope">
              {{ getProcurementPersonnel(scope.row.procurementPersonnel) }}
            </template>
          </el-table-column>
          <el-table-column label="运营周转天数" prop="operatingTurnoverDaysMax" min-width="180" />
          <el-table-column label="运营人员" prop="operationsPersonnel" min-width="180">
            <template #default="scope">
              {{ getProcurementPersonnel(scope.row.operationsPersonnel) }}
            </template>
          </el-table-column>
          <el-table-column label="更新人" prop="createdId" min-width="180" />
          <el-table-column label="更新时间" prop="updatedAt" min-width="180">
            <template #default="scope">
              {{ formatTime(scope.row.updatedAt, 'yyyy-MM-dd HH:mm:ss') }}
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" fixed="right" width="260">
            <template #default="scope">
              <el-button link type="primary" @click="showTrend(scope.row.productNumber)">
                销量趋势
              </el-button>
              <el-button link type="primary" @click="openDel(scope.row)"> SKU明细 </el-button>
              <el-button link type="primary" @click="openAdd(scope.row)"> 编辑 </el-button>
              <el-button link type="danger" @click="delRow(scope.row)"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <Pagination
          :total="total"
          v-model:page="queryParams.page"
          v-model:limit="queryParams.pageSize"
          @pagination="getList"
        />

        <AddForm
          ref="addFormRef"
          @success="handleSuccess"
          :peopleList="peopleList"
          :categoryList="categoryList"
          :supplierList="supplierList"
        />
        <Trend ref="trendRef" />
        <ImportTemplate ref="importTemplateRef" @success="handleSuccess" />
        <!-- 表单弹窗 SKU明细-->
        <SkuDetailForm ref="skuRef" @success="getList" :supplierList="supplierList" />
      </div>
    </ContentWrap>
  </div>
</template>
<script lang="ts" setup>
import {
  getGoodsInventoryAlarmList,
  deletedGoodsInventoryAlarm,
  getCategoryNameList
} from '@/api/shop/InventoryLow/index'
import { getDictDataPage } from '@/api/system/dict/dict.data'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
import SkuDetailForm from './components/skuDetailForm.vue' // sku明细
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import { useAppStore } from '@/store/modules/app'
import AddForm from './components/addForm.vue'
import Trend from './components/trend.vue'
import ImportTemplate from './components/importTemplate.vue'
import { downloadByUrl } from '@/utils/download'
import { getPersonRosterAvatarOriginList } from '@/api/hrAdmin/personRoster/index'
import { goodsPersonalQueryTag } from '@/api/shop/index'
import { formatTime } from '@/utils/index'
const url =
  'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/common/template/%E5%BA%93%E5%AD%98%E5%91%8A%E8%AD%A6%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx'
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
defineOptions({ name: 'InventoryLow' })

let queryParams = reactive({
  page: 1,
  pageSize: 10,
  productNumber: undefined, //货品编号
  productName: undefined, //货品名称
  procurementPersonnel: undefined, //采购人员
  operationsPersonnel: undefined, //运营人员
  productSource: undefined, //产品出处
  category: undefined, //分组
  productGrade: undefined, //产品等级
  goodsNewOld: undefined, //新品老品
  isSafe: undefined //是否在安全期内
})
const total = ref()
const list = ref()
const isExpand = ref(false) // 是否展开
const loading = ref(false)

const addList = ref([
  {
    label: '新增',
    code: 'add'
  },
  {
    label: '模版下载',
    code: 'download'
  },
  {
    label: '导入',
    code: 'import'
  }
])

// 出货周期格式化
const formatInterval = (item) => {
  const { shippingCycle, shippingCycleZs } = item || {}
  if (!shippingCycle && !shippingCycleZs) return ''
  if (!shippingCycleZs) return shippingCycle || ''
  return `${shippingCycle}~${shippingCycleZs} `
}

// 删除的二次确认
const delRow = async (item) => {
  try {
    await message.delConfirm()
    const data = [item.id]
    await deletedGoodsInventoryAlarm(data)
    message.success('操作成功')
    getList()
  } catch (error) {
    console.log(error)
  }
}

const handleSuccess = () => {
  queryParams.page = 1
  getList()
}

const importTemplateRef = ref()
// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)
const addFormRef = ref()
// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openAdd()
    } else if (currentAddCode.value === 'download') {
      downloadByUrl(url, '库存告警导入模版')
    } else if (currentAddCode.value === 'import') {
      // 导入
      importTemplateRef.value.open()
    }
  }
}

// 新增编辑
const openAdd = (item?) => {
  const id = item?.id ? item.id : undefined
  addFormRef.value.open(id)
}

// 销量趋势
const trendRef = ref()
const showTrend = (id) => {
  trendRef.value.open(id)
}

// SKU明细
const skuRef = ref()
const openDel = (row) => {
  if (skuRef.value) {
    skuRef.value.open(row)
  }
}

// 获取数据
const getList = async () => {
  try {
    const res = await getGoodsInventoryAlarmList(queryParams)
    total.value = res.total
    list.value = res.records || []
  } catch (error) {
    console.log(error)
  }
}

// 重置
const formRef = ref()
const resetQuery = () => {
  formRef.value.resetFields()
  queryParams.page = 1
  getList()
}

const handleQuery = () => {
  queryParams.page = 1
  getList()
}

// 人员信息
const peopleList = ref()
const initPeople = async () => {
  const data = {
    status: '2'
  }
  const res = await getPersonRosterAvatarOriginList(data)
  peopleList.value = res
}

const productGradeList = ref()
const initBase = async () => {
  const params = {
    tagCategory: 'goods'
  }
  const res = await goodsPersonalQueryTag(params)
  productGradeList.value = res.records || []
}

const getproductGradeLabel = (value) => {
  if (!value) return ''
  const midArr = productGradeList.value?.filter((item) => item.id == value)
  return midArr?.length ? midArr[0].tagSymbol : ''
}

const formatCategoryList = (value) => {
  if (!value) return ''
  const midArr = categoryList.value?.filter((item) => item.code == value)
  return midArr?.length ? midArr[0].name : ''
}

//渠道商格式化
const formartSupplier = (value) => {
  if (!value) return ''
  const arr = value.split()
  let str = ''
  if (!arr?.length) return ''
  if (!supplierList.value?.length) return ''
  arr.forEach((item) => {
    const mid = supplierList.value?.filter((it) => it.value == item)
    if (mid[0]?.label) {
      str += mid[0]?.label
    }
  })
  return str
}

const getProcurementPersonnel = (value) => {
  if (!value) return ''
  const midArr = peopleList.value?.filter((item) => item.userId == value)
  return midArr?.length ? midArr[0].name : ''
}

// 品类
const categoryList = ref([])
const initCategoryList = async () => {
  const res = await getCategoryNameList()
  categoryList.value = res || []
  console.log(categoryList.value, 'categoryList.value')
}

/** 查询供应商列表 */
const supplierList = ref<any[]>([])
const getSupplierList = async () => {
  const data = await getDictDataPage({
    page: 1,
    size: 999999,
    type: 2,
    pCode: 'supplier'
  })

  if (data && data.data) {
    supplierList.value = []
    data.data.forEach((item) => {
      supplierList.value.push({
        value: item.code,
        label: item.name
      })
    })
  }
}

onMounted(() => {
  initBase()
  initCategoryList()
  getSupplierList()
  initPeople()
  getList()
})
</script>

<style scoped lang="scss">
.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.form-wapper {
  // width: 100%;
}
</style>
