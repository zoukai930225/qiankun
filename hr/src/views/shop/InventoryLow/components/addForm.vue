<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer"
      @close="handleCloseDrawer" size="968">
      <div>
        <div class="drawerTitle">
          <div>{{ drawerTitle }}</div>
          <div @click="handleCloseDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="90px" :inline="true">
        <div class="drawerContent">
          <el-form-item label="类目" prop="category" style="width: 40%" required>
            <el-select class="searchFormItemWidth" v-model="formData.category" placeholder="请选择类目" clearable
              style="width: 100%">
              <el-option v-for="dict in categoryList" :key="dict.code" :label="dict.name" :value="dict.code" />
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="产品等级" prop="productGrade" style="width: 40%" required>
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.productGrade"
              placeholder="请选择"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="dict in productGradeList"
                :key="dict.id"
                :label="dict.tagSymbol"
                :value="dict.id"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="产品出处" prop="productSource" style="width: 40%" required>
            <el-select class="dialogFormItemWidth" v-model="formData.productSource" placeholder="请选择产品出处" clearable
              style="width: 100%">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PRODUCT_SOURCE, true)"
                :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>

          <el-form-item label="货品编号" prop="productNumber" style="width: 40%" required>
            <el-input class="dialogFormItemWidth" v-model="formData.productNumber" placeholder="请输入货品编号"
              style="width: 400px" />
          </el-form-item>
          <el-form-item label="货品名称" prop="productName" style="width: 40%" required>
            <el-input class="dialogFormItemWidth" v-model="formData.productName" placeholder="请输入货品名称"
              style="width: 400px" />
          </el-form-item>

          <!-- <el-form-item label="新老品" prop="goodsNewOld">
            <el-select
              class="searchFormItemWidth"
              v-model="formData.goodsNewOld"
              placeholder="请选择状态"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_NEW_AND_OLD_PRODUCTS, true)"
                :key="dict.code"
                :label="dict.label"
                :value="dict.code"
              />
            </el-select>
          </el-form-item> -->
          <el-form-item label="供应商" prop="supplier" style="width: 80%">
            <el-select class="searchFormItemWidth" v-model="formData.supplier" placeholder="请选择供应商" clearable
              style="width: 100%">
              <el-option v-for="dict in supplierList" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </div>
      </el-form>

      <el-form class="dialogForm" ref="formRef1" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="110px" :inline="true">
        <div class="drawerContent">
          <el-form-item label="工厂未发" prop="factoryNotSendOutGoods" style="width: 40%">
            <el-input class="dialogFormItemWidth" v-model="formData.factoryNotSendOutGoods" placeholder="请输入工厂未发"
              style="width: 400px" type="number" />
          </el-form-item>
          <el-form-item label="出货量(周)" prop="shipmentVolumeWeek" style="width: 40%">
            <el-input class="dialogFormItemWidth" v-model="formData.shipmentVolumeWeek" placeholder="请输入出货量(周)"
              style="width: 400px" type="number" />
          </el-form-item>
          <el-form-item label="出货周期" style="width: 40%" required>
            <el-input class="dialogFormItemWidth" v-model="formData.shippingCycle" placeholder="填写值"
              style="width: 110px" type="number" />-
            <el-input class="dialogFormItemWidth" v-model="formData.shippingCycleZs" placeholder="填写值"
              style="width: 110px" type="number" />
          </el-form-item>

          <el-form-item label="安全库存周期" prop="safetyStockCycle" style="width: 40%">
            <el-input class="dialogFormItemWidth" v-model="formData.safetyStockCycle" placeholder="请输入安全库存周期"
              style="width: 400px" type="number" />
          </el-form-item>
          <el-form-item label="最近出货时间" prop="recentShipmentTime" style="width: 40%">
            <el-date-picker class="!w-200px" v-model="formData.recentShipmentTime" value-format="YYYY-MM"
              placeholder="请选择时间" />
          </el-form-item>

          <el-form-item label="采购人员" prop="procurementPersonnel" style="width: 40%">
            <el-select class="dialogFormItemWidth" v-model="formData.procurementPersonnel" placeholder="请选择采购人员"
              clearable style="width: 100%">
              <el-option v-for="dict in peopleList" :key="dict.userId" :label="dict.name" :value="dict.userId" />
            </el-select>
          </el-form-item>
          <el-form-item label="采购说明" prop="purchaseDescription" style="width: 80%">
            <s-text-area v-model="formData.purchaseDescription" placeholder="请输入采购说明"
              :autosize="{ minRows: 3, maxRows: 8 }" />
          </el-form-item>
        </div>
      </el-form>
      <!-- 11111111 -->
      <el-form class="dialogForm" v-loading="formLoading" :model="formData" :rules="formRules" label-width="110px"
        :inline="true">
        <div class="drawerContent">
          <el-form-item label="预计销量涨幅" prop="expectedSalesIncrease" style="width: 40%">
            <el-input class="dialogFormItemWidth" v-model="formData.expectedSalesIncrease" placeholder="请输入预计销量涨幅"
              style="width: 100%" />
          </el-form-item>
          <el-form-item label="涨幅原因/库存周转浮动原因" prop="floatingReasons" class="inline-label" style="width: 40%">
            <el-input class="dialogFormItemWidth" v-model="formData.floatingReasons" placeholder="请输入涨幅原因/库存周转浮动原因"
              style="width: 100%" />
          </el-form-item>
          <el-form-item label="运营周转天数" style="width: 40%">
            <el-input class="dialogFormItemWidth" v-model="formData.operatingTurnoverDays" placeholder="填写值"
              style="width: 110px" type="number" />-
            <el-input class="dialogFormItemWidth" v-model="formData.operatingTurnoverDaysMax" placeholder="填写值"
              style="width: 110px" type="number" />
          </el-form-item>

          <el-form-item label="运营人员" prop="operationsPersonnel" style="width: 40%">
            <el-select class="dialogFormItemWidth" v-model="formData.operationsPersonnel" placeholder="请选择运营人员"
              clearable style="width: 100%">
              <el-option v-for="dict in peopleList" :key="dict.userId" :label="dict.name" :value="dict.userId" />
            </el-select>
          </el-form-item>
          <el-form-item label="运营说明" prop="operationInstructions" style="width: 80%">
            <s-text-area v-model="formData.operationInstructions" placeholder="请输入运营说明"
              :autosize="{ minRows: 3, maxRows: 8 }" />
          </el-form-item>
          <el-form-item label="备注" prop="remarks" style="width: 80%">
            <s-text-area v-model="formData.remarks" placeholder="请输入备注" :autosize="{ minRows: 3, maxRows: 8 }" />
          </el-form-item>
        </div>
      </el-form>
      <div class="drawerFooter">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ '提 交' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
defineOptions({ name: 'AddForm' })

const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false)
import { goodsPersonalQueryTag } from '@/api/shop/index'
import {
  saveGoodsInventoryAlarm,
  getDetailById,
  updateGoodsInventoryAlarm
} from '@/api/shop/InventoryLow/index'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
const formData = ref({
  category: undefined,
  id: undefined,
  productGrade: undefined, //等级
  productSource: undefined,
  productNumber: undefined,
  productName: undefined,
  factoryNotSendOutGoods: undefined, //工厂未发
  shipmentVolumeWeek: undefined, //出货量(周)
  shippingCycle: undefined, //最小出货周期
  shippingCycleZs: undefined, //最大出货周期
  safetyStockCycle: undefined, //安全库存周期
  recentShipmentTime: undefined, //最近出货时间
  procurementPersonnel: undefined, //采购人员
  purchaseDescription: undefined, //采购说明
  expectedSalesIncrease: undefined, //预计销量涨幅
  floatingReasons: undefined, //涨幅原因/库存周转浮动原因
  operatingTurnoverDays: undefined, //运营周转天数
  operatingTurnoverDaysMax: undefined, //运营周转天数最大
  operationsPersonnel: undefined, //运营人员
  operationInstructions: undefined, //运营说明
  goodsNewOld: undefined, //新老产品
  remarks: undefined, //备注
  supplier: undefined //供应商
})
const formRules = reactive({
  category: [{ required: true, message: '请选择类目', trigger: 'change' }],
  productGrade: [{ required: true, message: '请选择产品等级', trigger: 'change' }],
  productSource: [{ required: true, message: '请选择产品出处', trigger: 'change' }],
  productNumber: [{ required: true, message: '请输入货品编号', trigger: 'change' }],
  productName: [{ required: true, message: '请输入货品名称', trigger: 'change' }]
  // procurementPersonnel: [{ required: true, message: '请选择采购人员', trigger: 'change' }]
})
const props = defineProps({
  peopleList: {
    type: Array<any>,
    deftault: () => []
  },
  categoryList: {
    type: Array<any>,
    deftault: () => []
  },
  supplierList: {
    type: Array<any>,
    deftault: () => []
  }
})

const formRef = ref() // 表单 Ref
const formRef1 = ref() // 表单 Ref
const productGradeList = ref()
const currentId = ref()
/** 打开弹窗 */
const open = async (id) => {
  initBase()
  drawerVisible.value = true
  drawerTitle.value = id ? '编辑' : '新增'
  resetForm()
  if (id) {
    currentId.value = id
    getDetail()
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getDetail = async () => {
  const res = await getDetailById(currentId.value)
  formData.value = {
    ...res
  }
}

const initBase = async () => {
  const params = {
    tagCategory: 'goods'
  }
  const res = await goodsPersonalQueryTag(params)
  productGradeList.value = res.records || []
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

const submitForm = async () => {
  // 校验表单
  if (!formRef || !formRef1) return
  const valid = await formRef.value.validate()
  const valid1 = await formRef1.value.validate()
  if (!valid || !valid1) return

  const params = {
    ...formData.value
    // supplier: formData.value.supplier ? formData.value.supplier.join(',') : undefined
  }

  if (currentId.value) {
    await updateGoodsInventoryAlarm(params)
  } else {
    await saveGoodsInventoryAlarm(params)
  }

  message.success('操作成功')
  drawerVisible.value = false
  emit('success')
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: undefined,
    category: undefined,
    productGrade: undefined,
    productSource: undefined,
    productNumber: undefined,
    productName: undefined,
    factoryNotSendOutGoods: undefined, //工厂未发
    shipmentVolumeWeek: undefined, //出货量(周)
    shippingCycle: undefined, //最小出货周期
    shippingCycleZs: undefined, //最大出货周期
    safetyStockCycle: undefined, //安全库存周期
    recentShipmentTime: undefined, //最近出货时间
    procurementPersonnel: undefined, //采购人员
    purchaseDescription: undefined, //采购说明
    expectedSalesIncrease: undefined, //预计销量涨幅
    floatingReasons: undefined, //涨幅原因/库存周转浮动原因
    operatingTurnoverDays: undefined, //运营周转天数
    operatingTurnoverDaysMax: undefined, //运营周转天数最大
    operationsPersonnel: undefined, //运营人员
    operationInstructions: undefined, //运营说明
    remarks: undefined, //备注
    goodsNewOld: undefined, //新老产品
    supplier: undefined //供应商
  }
}

const handleCloseDrawer = () => {
  drawerVisible.value = false
  currentId.value = undefined
}
</script>

<style lang="scss" scoped>
// 尺码范围
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #fae8d066;
  border-radius: 15px;
}

:deep(.el-upload-list__item) {
  width: 110px;
  height: 110px;
}

:deep(.el-upload-list--text) {
  display: flex;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}

// 修改表单label的行高
:deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

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

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;

  &-title {
    margin: 0 0 18px 0;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
