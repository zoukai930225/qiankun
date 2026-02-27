<template>
  <el-dialog v-model="drawerVisible" @close="handleCloseDrawer" size="931" :title="drawerTitle">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" :inline="true">
      <div class="drawerContent">
        <el-form-item label="商品编码" prop="goodsCode" style="width: 40%" required>
          <el-input
            class="dialogFormItemWidth"
            v-model="formData.goodsCode"
            placeholder="请输入商品编码"
            style="width: 340px"
          />
        </el-form-item>

        <el-form-item label="供应商" prop="supplier" style="width: 40%" required>
          <el-select
            class="searchFormItemWidth"
            v-model="formData.supplier"
            placeholder="请选择供应商"
            clearable
            style="width: 340px"
          >
            <el-option
              v-for="dict in supplierList"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="出货周期" prop="shippingCycle" style="width: 40%" required>
          <div style="display: flex; width: 100%">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.shippingCycle"
              placeholder="填写值"
              style="width: 10px; flex-grow: 1"
              type="number"
            />
            <span style="padding: 0 5px">-</span>
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.shippingCycleZs"
              placeholder="填写值"
              style="width: 10px; flex-grow: 1"
              type="number"
            />
          </div>
        </el-form-item>

        <el-form-item label="出货量(周)" prop="shipmentVolumeWeek" style="width: 40%">
          <el-input
            class="dialogFormItemWidth"
            v-model="formData.shipmentVolumeWeek"
            placeholder="请输入出货量(周)"
            style="width: 340px"
            type="number"
          />
        </el-form-item>
        <el-form-item label="最近出货时间" prop="recentShipmentTime" style="width: 40%">
          <el-date-picker
            v-model="formData.recentShipmentTime"
            value-format="YYYY-MM-DD"
            style="width: 340px"
            placeholder="请选择出货时间"
          />
        </el-form-item>

        <el-form-item label="工厂未发" prop="factoryNotSendOutGoods" style="width: 40%">
          <el-input
            class="dialogFormItemWidth"
            v-model="formData.factoryNotSendOutGoods"
            placeholder="请输入工厂未发"
            style="width: 340px"
            type="number"
          />
        </el-form-item>
      </div>
    </el-form>
    <div class="drawerFooter">
      <el-button @click="drawerVisible = false">取 消</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">提 交</el-button>
    </div>
  </el-dialog>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddSkuForm' })

const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false)
import { goodsPersonalQueryTag } from '@/api/shop/index'
import { getDetailById, updateSku, saveSku } from '@/api/shop/InventoryLow/index'
const formData = ref({
  category: undefined,
  productGrade: undefined,
  id: undefined,
  productSource: undefined,
  productName: undefined,
  shipmentVolumeWeek: undefined, //出货量(周)
  shippingCycle: undefined, //最小出货周期
  shippingCycleZs: undefined, //最大出货周期
  recentShipmentTime: undefined, //最近出货时间
  safetyStockCycle: undefined,
  supplier: undefined, //供应商
  goodsCode: undefined,
  factoryNotSendOutGoods: undefined //工厂未发
})

// 校验周期
const validateCycle = (rule: any, value: any, callback: any) => {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    formData.value.shippingCycleZs === '' ||
    formData.value.shippingCycleZs === null ||
    formData.value.shippingCycleZs === undefined
  ) {
    callback(new Error('请输入出货周期'))
  } else if (!!value && value > formData.value.shippingCycleZs) {
    callback(new Error('最大周期不能小于最小周期'))
  } else {
    callback()
  }
}

const formRules = reactive({
  goodsCode: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
  supplier: [{ required: true, message: '请选择供应商', trigger: 'change' }],
  shippingCycle: [{ required: true, validator: validateCycle, trigger: ['blur', 'change'] }]
})
const props = defineProps({
  supplierList: {
    type: Array<any>,
    deftault: () => []
  },
  productNumber: String
})

const formRef = ref() // 表单 Ref
const productGradeList = ref()
const currentId = ref()
/** 打开弹窗 */
const open = (id) => {
  initBase()
  drawerVisible.value = true
  drawerTitle.value = id ? '编辑' : '新增'
  resetForm()
  if (id) {
    currentId.value = id
    getDetail()
  }
  console.log({ id })
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getDetail = async () => {
  console.log(currentId)
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
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  const params = {
    ...formData.value,
    productNumber: props.productNumber
  }
  formLoading.value = true
  try {
    if (currentId.value) {
      await updateSku(params)
    } else {
      await saveSku(params)
    }
  } finally {
    formLoading.value = false
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
    productName: undefined,
    goodsCode: undefined,
    factoryNotSendOutGoods: undefined, //工厂未发
    shipmentVolumeWeek: undefined, //出货量(周)
    shippingCycle: undefined, //最小出货周期
    shippingCycleZs: undefined, //最大出货周期
    safetyStockCycle: undefined, //安全库存周期
    recentShipmentTime: undefined, //最近出货时间
    // procurementPersonnel: undefined, //采购人员
    // purchaseDescription: undefined, //采购说明
    // expectedSalesIncrease: undefined, //预计销量涨幅
    // floatingReasons: undefined, //涨幅原因/库存周转浮动原因
    // operatingTurnoverDays: undefined, //运营周转天数
    // operatingTurnoverDaysMax: undefined, //运营周转天数最大
    // operationsPersonnel: undefined, //运营人员
    // operationInstructions: undefined, //运营说明
    // remarks: undefined, //备注
    // goodsNewOld: undefined, //新老产品
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

:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body){
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
