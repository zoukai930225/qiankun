<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer v-model="drawerVisible" :with-header="false" class="drawer" show-close size="968" @close="closeDrawer">
      <div>
        <div class="drawerTitle">
          <div>ERP价格变动</div>
          <div @click="closeDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <div class="drawerContent">
        <!-- 商品信息 -->
        <div class="productInfo">
          <div class="productInfo-title">{{ productInfo.wdtGoodsName }}</div>
          <div class="productInfo-content">
            <img class="productInfo-img" :src="productInfo.picUrl ? productInfo.picUrl : defaultImg" alt="" />
            <div>
              <div class="productInfo-goodsNo">货品编码</div>
              <div>{{ productInfo.wdtGoodsNo }}</div>
            </div>
          </div>
        </div>
        <!-- 选择成本类型 -->
        <div class="costType">
          <div class="costType-label"></div>
          <div>选择成本类型：</div>
          <el-radio-group v-model="radio" @change="changeRadio">
            <el-radio :label="2">核算成本价</el-radio>
            <el-radio :label="1">ERP价格变动</el-radio>
          </el-radio-group>
        </div>

        <!-- 选择核算成本价 表单 -->
        <div class="form1" v-if="radio === 2">
          <el-form :model="formData" ref="cost_calculation_formRef" label-width="auto" :rules="formRules1">
            <el-form-item label="核算成本" prop="cost">
              <el-input v-model="formData.cost" placeholder="请输入核算成本 " />
            </el-form-item>
            <el-form-item label="生效时间" required prop="dateRange">
              <el-date-picker v-model="formData.dateRange" type="daterange" range-separator="-" start-placeholder="开始时间"
                end-placeholder="结束时间" @change="changeDate" :prefix-icon="Clock" />
            </el-form-item>
          </el-form>
          <!-- 规则提示 -->
          <div class="form1-tips">
            <div> <img src="@/assets/imgs/productMng/tip.png" alt="" /></div>
            <div clsss="form1-tips-content">
              <div>1.系统将于修改规则后的第2天生效计算规则</div>
              <div>2.生效时间有效期外，将启用ERP成本价</div>
            </div>
          </div>
        </div>
        <!-- ERP成本价 -->
        <div class="form1" v-if="radio === 1">
          <el-form :model="formData" label-width="auto" :rules="formRules2" ref="erp_price_change_formRef">
            <el-form-item label="生效时间" required prop="dateRange">
              <el-date-picker v-model="formData.dateRange" type="daterange" range-separator="-" start-placeholder="开始时间"
                end-placeholder="结束时间" @change="changeDate" :prefix-icon="Clock" />
            </el-form-item>
          </el-form>
          <!-- 规则提示 -->
          <div class="form1-tips">
            <div> <img src="@/assets/imgs/productMng/tip.png" alt="" /></div>

            <div clsss="form1-tips-content">
              <div>系统将于修改规则后的第2天生效计算规则</div>
            </div>
          </div>
        </div>
        <!-- 历史记录列表 -->
        <div class="historyList">
          <div class="historyList-title">历史记录</div>
          <el-table :data="list" ref="tableRef" :height="list.length > 4 ? '240px' : 'auto'" :header-cell-style="{
            background: ' #f4f4ff80',
            color: '#333333',
            border: 'none',
            height: '50px',
            fontFamily: 'PingFangSC, PingFang SC'
          }" v-loading="loading" :show-overflow-tooltip="true" :row-style="{}" :cell-style="{}" :border="false"
            class="SWCommonTable" v-horizontal-scroll="'always'">
            <el-table-column label="成本类型" prop="costType">
              <template #default="scope">
                {{ scope.row.costType === 1 ? 'ERP成本价' : '核算成本价' }}
              </template>
            </el-table-column>
            <el-table-column label="价格" prop="cost">
              <template #default="scope">
                {{
                  scope.row.cost !== undefined && scope.row.cost !== null ? scope.row.cost : '--'
                }}
              </template>
            </el-table-column>
            <el-table-column label="开始日期" prop="startDate">
              <template #default="scope">{{ formatDateString(scope.row.startDate) }}</template>
            </el-table-column>
            <el-table-column label="结束日期" prop="endDate">
              <template #default="scope">{{ formatDateString(scope.row.endDate) }}</template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template #default="scope">
                <el-button type="primary" link v-if="shouldShowEditButton(scope.row)"
                  @click="openCostCalculationForm(scope.row)">
                  编辑
                </el-button>
                <el-button type="primary" link @click="handleDelete(scope.row.id)">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="drawer-footer">
          <el-button :disabled="formLoading" type="primary" @click="submitForm">
            保存设置</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
  <!-- 编辑弹窗 -->
  <CostCalculationForm ref="CostCalculationFormRef" @success="getList" />
</template>
<script lang="ts" setup>
import { Clock } from '@element-plus/icons-vue'
import CostCalculationForm from './CostCalculationForm.vue'
import { ref, reactive } from 'vue'
import * as productApi from '@/api/productManage'
import defaultImg from '@/assets/imgs/productMng/goods.png'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const drawerVisible = ref(false) // 弹窗的是否展示

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formData = ref<any>({
  cost: undefined,
  startDate: undefined,
  endDate: undefined,
  dateRange: undefined,
  wdtGoodsNo: undefined,
  costType: undefined //成本类型 1-erp成本价 2-核算成本价
})

const radio = ref(2)
const loading = ref(false)
const cost_calculation_formRef = ref() // 核算成本价表单 Ref
const erp_price_change_formRef = ref() // ERP价格变动表单 Ref

const validateCost = (rule, value, callback) => {
  if (value === '' || value === undefined || value === null) {
    callback(new Error('请输入核算成本'))
  } else if (parseFloat(value) < 0) {
    callback(new Error('核算成本不能为负数'))
  } else {
    callback()
  }
}
const formRules1 = reactive({
  // 表单验证规则-核算成本价
  cost: [
    { required: true, message: '请输入核算成本', trigger: 'blur' },
    { validator: validateCost, trigger: 'blur' }
  ],
  dateRange: [{ required: true, message: '请选择生效时间', trigger: 'change' }]
})
const formRules2 = reactive({
  // 表单验证规则-ERP价格变动
  dateRange: [{ required: true, message: '请选择生效时间', trigger: 'change' }]
})
const list = ref<any>([])

const cost = ref(0) //保存成本价
const wdtGoodsNo = ref('') //保存货品编码

/** 打开弹窗 */
const productInfo = ref<any>({})
const open = async (data?: any) => {
  drawerVisible.value = true
  resetForm()
  if (data) {
    formLoading.value = true
    try {
      // 获取商品信息
      productInfo.value = data
      // 保存成本价和货品编码
      cost.value = data.costs
      wdtGoodsNo.value = data.wdtGoodsNo
      await getList()
    } finally {
      formLoading.value = false
    }
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 获取list数据
const getList = async () => {
  loading.value = true
  try {
    list.value = await productApi.getHistoryList({ wdtGoodsNo: productInfo.value.wdtGoodsNo })
  } finally {
    loading.value = false
  }
}
// 切换radio -选择成本类型
const changeRadio = (val) => {
  resetForm()
  formData.value.costType = val
}

// 日期选择
const changeDate = (val: [string, string]) => {
  // 核算成本价
  formData.value.startDate = formatDate(val[0])
  formData.value.endDate = formatDate(val[1])
  // console.log('格式化', formData1.value)
}

// 列表显示日期格式化
const formatDateString = (dateString) => {
  return dateString.split(' ')[0]
}
// 日期格式化
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const seconds = date.getSeconds().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
// 核算成本价在结束日期在当前日期之前，不显示编辑按钮
const shouldShowEditButton = (row) => {
  if (row.costType === 2) {
    const today = new Date()
    const endDateObj = new Date(row.endDate)
    return endDateObj >= today
  }
  return true // 当 costType 不等于 2 时，始终显示编辑按钮
}

// 限制只能选今天之后的时间
const pickerOptionsRang = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 8.64e7 毫秒数代表一天
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  const formRef = radio.value === 2 ? cost_calculation_formRef : erp_price_change_formRef
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  // 提交请求
  formLoading.value = true
  try {
    // console.log('radio', radio.value)

    // 如果成本类型为ERP成本价，则赋成本价
    if (radio.value === 1) {
      formData.value.cost = cost.value
    }

    formData.value.costType = radio.value // 给成本类型赋值
    formData.value.wdtGoodsNo = wdtGoodsNo.value // 给货品编码赋值

    const data = formData.value as any
    await productApi.getAddErpPrice(data)

    message.success('添加成功')
    await getList()
    resetForm()
  } catch (error) {
    formLoading.value = false
  } finally {
    formLoading.value = false
  }
}

// 关闭抽屉
const closeDrawer = () => {
  drawerVisible.value = false
  radio.value = 2
  resetForm()
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    cost: undefined,
    startDate: undefined,
    endDate: undefined,
    dateRange: undefined,
    wdtGoodsNo: undefined,
    costType: undefined //成本类型 1-erp成本价 2-核算成本价
  }
  cost_calculation_formRef.value?.resetFields()
  erp_price_change_formRef.value?.resetFields()
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await productApi.getRemoveErpPrice(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 打开编辑弹窗 */
const CostCalculationFormRef = ref()
const openCostCalculationForm = (row) => {
  if (CostCalculationFormRef.value) {
    CostCalculationFormRef.value.open(row, productInfo.value.wdtGoodsNo)
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/drawer.scss'; // 修改备注的文本框背景

img {
  vertical-align: middle;
}

.productInfo {
  &-title {
    padding: 10px 16px;
    box-sizing: border-box;
    font-size: 14px;
    color: #333333;
    font-weight: 600;
    background: linear-gradient(270deg, #f2eeff 0%, #e7edfc 100%);
    border-radius: 4px 4px 0px 0px;
  }

  &-content {
    display: flex;
    color: #666666;
    font-size: 14px;
    background: #f9f9ff;
    padding: 10px 16px;
    box-sizing: border-box;
  }

  &-img {
    width: 100px;
    height: 100px;
    margin-right: 20px;
  }

  &-goodsNo {
    margin-bottom: 10px;
  }
}

// 选择成本类型
.costType {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333333;
  font-weight: 600;
  margin-top: 20px;

  &-label {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }
}

.drawerTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 9px solid #f6f6fe80;
}

:deep(.el-table__row) {
  box-shadow: 0px 10px 10px -10px rgba(0, 0, 0, 0.1);
}

// 历史记录
.historyList {
  width: 100%;
  background: linear-gradient(to bottom, rgba(245, 248, 255, 1) 0%, rgba(255, 255, 255, 1) 100%);

  padding: 20px;
  box-sizing: border-box;
  margin-top: 16px;
  border-radius: 4px;

  &-title {
    color: #333333;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 8px;
  }
}

// 核算成本价表单
.form1 {
  margin-top: 20px;

  &-tips {
    background: #fef8f1;
    border-radius: 4px;
    display: flex;
    padding: 12px 20px;
    box-sizing: border-box;
    font-size: 12px;
    color: #666666;
    line-height: 2;

    img {
      width: 14px;
      height: 14px;
      margin-right: 12px;
    }
  }
}

.drawer-footer {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0 0;
}
</style>
