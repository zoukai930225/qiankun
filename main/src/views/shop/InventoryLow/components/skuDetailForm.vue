<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer"
      @close="handleCloseDrawer" size="968">
      <div>
        <div class="drawerTitle">
          <div>明细</div>
          <div @click="handleCloseDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <div class="form-wrap">
        <ContentWrap>
          <div>
            <div class="commonTopFilterWrap">
              <div class="commonTopFilterWrap-filter">
                <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" label-width="100px"
                  :inline="true">
                  <el-form-item label="商品编码" prop="goodsCode" label-width="110">
                    <el-input class="searchFormItemWidth" v-model="formData.goodsCode" placeholder="请输入商品编码" clearable
                      @keyup.enter="handleQuery" @clear="handleGoodsCodeClear" />
                  </el-form-item>
                  <el-form-item label="供应商:" prop="supplier">
                    <el-select class="searchFormItemWidth" v-model="formData.supplier" placeholder="请选择供应商"
                      :clearable="false" @change="handleQuery" style="width: 200px" filterable>
                      <el-option v-for="dict in supplierList" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="30天周转天数是否在安全值内" prop="isSafe" class="inline-label" label-width="110">
                    <el-select style="width: 200px" v-model="formData.isSafe" placeholder="请选择" clearable filterable
                      @change="handleQuery">
                      <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_WHETHER, true)"
                        :key="dict.label" :label="dict.label" :value="dict.label" />
                    </el-select>
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
                  <el-button type="primary" @click="handleAdd">
                    <Icon class="mr-5px" icon="ep:plus" />
                    新增
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </ContentWrap>

        <div class="table-wrap">
          <el-table :header-cell-style="appStore.headerCellStyle" :data="skuList" :stripe="true"
            :show-overflow-tooltip="true" v-loading="loading" class="SWCommonTable" v-horizontal-scroll="'always'">
            <el-table-column label="商品编码" prop="goodsCode" min-width="160">
              <template #default="scope">
                <div @mouseover="handleMouseOver(scope.row, 'goodsCode', scope.$index)"
                  @mouseout="saveSkuItem('goodsCode')">
                  <el-input v-model="skuDiffList[scope.$index].goodsCode" placeholder="请输入" class="row-input"
                    @keyup.enter="saveSkuItem('goodsCode')" clearable :disabled="editItemRef.__key !== 'goodsCode' || editItemRef.$index !== scope.$index
                      " />
                </div>
              </template>
            </el-table-column>

            <el-table-column label="供应商" prop="supplier" min-width="160">
              <template #default="scope">
                <div @mouseover="handleMouseOver(scope.row, 'supplier', scope.$index)" style="width: 100%">
                  <div>
                    <el-select v-model="skuDiffList[scope.$index].supplier" placeholder="请选择供应商" clearable
                      @change="saveSkuItem('supplier')" style="width: 100%" :popper-append-to-body="false" :disabled="editItemRef?.__key !== 'supplier' || editItemRef.$index !== scope.$index
                        ">
                      <el-option v-for="dict in supplierList" :key="dict.value" :label="dict.label"
                        :value="dict.value" />
                    </el-select>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="出货周期" min-width="180">
              <template #default="scope">
                <div style="width: 100%">
                  <div style="display: flex; align-items: center">
                    <el-input @mouseover="handleMouseOver(scope.row, 'shippingCycle', scope.$index)"
                      v-model="skuDiffList[scope.$index].shippingCycle" placeholder="请输入" class="row-input"
                      @keyup.enter="saveSkuItem('shippingCycle')" @mouseout="saveSkuItem('shippingCycle')" clearable
                      :disabled="editItemRef?.__key !== 'shippingCycle' ||
                        editItemRef.$index !== scope.$index
                        " />
                    <span> - </span>
                    <el-input v-model="skuDiffList[scope.$index].shippingCycleZs"
                      @mouseover="handleMouseOver(scope.row, 'shippingCycleZs', scope.$index)" placeholder="请输入"
                      class="row-input" @mouseout="saveSkuItem('shippingCycleZs')"
                      @keyup.enter="saveSkuItem('shippingCycleZs')" clearable :disabled="editItemRef?.__key !== 'shippingCycleZs' ||
                        editItemRef.$index !== scope.$index
                        " />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="出货量(周)" prop="shipmentVolumeWeek" min-width="140">
              <template #default="scope">
                <div @mouseover="handleMouseOver(scope.row, 'shipmentVolumeWeek', scope.$index)"
                  @mouseout="saveSkuItem('shipmentVolumeWeek')" style="width: 100%">
                  <div>
                    <el-input v-model="skuDiffList[scope.$index].shipmentVolumeWeek" placeholder="请输入" class="row-input"
                      @keyup.enter="saveSkuItem('shipmentVolumeWeek')" clearable type="number" :disabled="editItemRef?.__key !== 'shipmentVolumeWeek' ||
                        editItemRef.$index !== scope.$index
                        " />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="最近出货时间" prop="recentShipmentTime" min-width="160">
              <template #default="scope">
                <div @mouseover="handleMouseOver(scope.row, 'recentShipmentTime', scope.$index)" style="width: 100%">
                  <div>
                    <el-date-picker v-model="skuDiffList[scope.$index].recentShipmentTime" value-format="YYYY-MM-DD"
                      placeholder="请选择出货时间" @change="saveSkuItem('recentShipmentTime')"
                      @blur="saveSkuItem('recentShipmentTime')" style="width: 100%" :append-to-body="false" :disabled="editItemRef?.__key !== 'recentShipmentTime' ||
                        editItemRef.$index !== scope.$index
                        " />
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="30天周转天数 是否在安全值内" prop="isSafe" width="125" />
            <el-table-column label="对比前日销量涨幅 (20%及以上填写)" prop="salesGrowthRate" min-width="150" />
            <el-table-column label="昨日销量" prop="yesterdaySales" min-width="120" />
            <el-table-column label="前日销量" prop="dayBeforeYesterdaySales" min-width="120" />
            <el-table-column label="7天销量" prop="salesSevenDays" min-width="120" />
            <el-table-column label="7天销量对应 库存周转天数" prop="sevenTurnoverDays" width="120" />
            <el-table-column label="14天销量" prop="salesFourteenDays" min-width="120" />
            <el-table-column label="14天销量对应 库存周转天数" prop="fourteenTurnoverDays" width="120" />
            <el-table-column label="30天销量" prop="salesThirtyDays" min-width="120" />
            <el-table-column label="30天销量对应 库存周转天数" prop="thirtyTurnoverDays" width="120" />
            <el-table-column label="采购在途" prop="purchaseInTransit" min-width="120" />
            <el-table-column label="工厂未发" prop="factoryNotSendOutGoods" min-width="120" />
            <el-table-column label="可发库存" prop="availableInventory" min-width="120" />
            <el-table-column label="操作" align="center" fixed="right" width="140">
              <template #default="scope">
                <el-button link type="primary" @click="
                  showTrend({
                    productNumber: scope.row.productNumber,
                    goodsCode: scope.row.goodsCode
                  })
                  ">
                  销量趋势
                </el-button>
                <el-button link type="primary" @click="openEdit(scope.row.id)"> 编辑 </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <Pagination :total="total" v-model:page="page.page" v-model:limit="page.pageSize" @pagination="getList" />
        </div>
      </div>
    </el-drawer>
    <!-- 销量趋势 -->
    <SkuTrend ref="skuTrendRef" />
    <SkuAdd ref="skuAddRef" :supplierList="supplierList" @success="handleSuccess"
      :productNumber="rowRef?.productNumber" />
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddProdForm' })

import SkuTrend from './skuTrend.vue'
import SkuAdd from './addSkuForm.vue'
import { useAppStore } from '@/store/modules/app'
const message = useMessage() // 消息弹窗

import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

const appStore = useAppStore()
const drawerVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const loading = ref(false)
import { getSkuPageList, updateSku } from '@/api/shop/InventoryLow'
import { cloneDeep } from 'lodash-es'

const props = defineProps({
  supplierList: {
    type: Array<any>,
    deftault: () => []
  }
})

const INIT_FORM_DATA = {
  goodsCode: undefined,
  supplier: undefined,
  isSafe: undefined,
  productNumber: undefined
}
const formData = ref<any>({
  ...INIT_FORM_DATA
})

const formRef = ref() // 表单 Ref
const rowRef = ref()
const page = reactive({ page: 1, pageSize: 10 })

const total = ref(0)
const editItemRef = ref<{
  goodsCode: string
  $index: number
  shippingCycle: string
  shippingCycleZs: string
  recentShipmentTime: string
  shipmentVolumeWeek: string
  supplier: string
  __key:
  | 'goodsCode'
  | 'supplier'
  | 'shipmentVolumeWeek'
  | 'shippingCycle'
  | 'recentShipmentTime'
  | 'shippingCycleZs'
}>({} as any)
const handleMouseOver = (row, key, $index) => {
  editItemRef.value = {
    ...row,
    $index,
    __key: key
  }
}

const saveSkuItem = async (key) => {
  const $index = editItemRef.value.$index
  const editItem = skuDiffList.value[$index]
  if (editItemRef.value.__key !== key) {
    return
  } else {
    if (editItem[key] === skuList.value[$index][key]) {
      editItemRef.value = {} as any
      skuDiffList.value = cloneDeep(skuList.value)
      return
    }
  }
  if (!editItem[key]) {
    message.warning('请填写后再更新')
    return
  }
  const params = {
    ...editItem,
    productNumber: rowRef.value.productNumber
  }
  loading.value = true
  try {
    await updateSku(params)
    getList()
  } catch (e) {
    console.log(e)
  }
  editItemRef.value = {} as any
}

/** 打开弹窗 */
const open = async (row) => {
  drawerVisible.value = true
  rowRef.value = row
  skuList.value = []
  resetForm()
  formData.value.productNumber = row.productNumber
  formData.value.supplier = props?.supplierList?.length ? props?.supplierList[0]?.value : 'all';
  handleQuery()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    ...INIT_FORM_DATA
  }
}

const handleGoodsCodeClear = () => {
  formData.value.goodsCode = undefined
  handleQuery()
}

const handleCloseDrawer = () => {
  drawerVisible.value = false
}

//渠道商格式化
const formartSupplier = (value) => {
  if (!value) return ''
  if (!props.supplierList?.length) return ''
  let str = ''
  const mid: any[] = props.supplierList?.filter((it: any) => it.value == value) || []
  if (mid[0]?.label) {
    str = mid[0]?.label
  }
  return str
}

// 获取列表数据
const skuList = ref<any[]>([])
const skuDiffList = ref<any[]>([])
const handleQuery = () => {
  page.page = 1
  getList()
}
const getList = async () => {
  loading.value = true
  try {
    const params = {
      ...formData.value,
      ...page
    }
    const res = await getSkuPageList(params)
    total.value = res.total || 0
    skuList.value = res.records || []
    skuDiffList.value = cloneDeep(res.records || [])
  } catch (e) {
    console.log(e)
  }
  loading.value = false
}

// 重置
const resetQuery = () => {
  formRef.value.resetFields()
  handleQuery()
}
const handleSuccess = () => {
  getList()
}

// 销量趋势
const skuTrendRef = ref()
const showTrend = (params: { productNumber: string; goodsCode: string }) => {
  skuTrendRef.value.open(params)
}

// 编辑、新增
const skuAddRef = ref()
const openEdit = (id?: String | undefined) => {
  skuAddRef.value.open(id)
}
const handleAdd = () => {
  skuAddRef.value.open()
}
</script>

<style lang="scss" scoped>
:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.form-wrap {
  background-color: #fff;
  border-radius: 8px;
}

.table-wrap {
  padding: 0 20px;
}

.ContentWrap {
  box-shadow: none;
  margin-bottom: 0;
}

.content-wapper {
  background: white;
  padding-bottom: 20px;

  .form {
    // display: flex;
    // flex-direction: row;
    // align-items: center;
    // justify-content: space-between;
    padding: 20px 20px 0;
    box-sizing: border-box;
  }
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;

  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }

  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

.commonTopFilterWrap-filter .el-form--inline .el-form-item {
  margin-right: 10px;
}
</style>
