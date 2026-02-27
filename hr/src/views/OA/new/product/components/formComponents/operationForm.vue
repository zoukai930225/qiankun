<template>
  <el-form
    class="dialogForm"
    ref="formRef"
    v-loading="formLoading"
    :model="formData"
    :rules="formRules"
    label-width="110px"
  >
    <div class="formWrapper" @click="bgClick">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="类型" prop="productType" style="width: 100%">
            <div class="seeBg">
              <div class="seeBg-text">{{ getProductType(formData?.productType) }}</div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计划上架日期" prop="planListDate" style="width: 100%">
            <div class="seeBg">
              <div class="seeBg-text">{{ formData?.planListDate }}</div>
            </div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="拍摄规划时间" prop="planShootTime" style="width: 100%">
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{
                formatCustomDate(formData?.planShootTime, 'yyyy-MM-dd')
              }}</div>
            </div>
            <el-date-picker
              v-else
              v-model="formData.planShootTime"
              type="date"
              placeholder="请选择拍摄规划时间"
              style="width: 100%"
              :disabled="isEdit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="售价" prop="monthCount" style="width: 100%">
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData?.price || '--' }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="formData.price"
              placeholder="请输入售价"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            label="起订量"
            prop="minimumQuantity"
            style="width: 100%"
            :rules="[{ required: true, message: '请输入起订量', trigger: 'blur' }]"
          >
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData?.minimumQuantity || '--' }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="formData.minimumQuantity"
              placeholder="请输入起订量"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="首单数量"
            prop="firstOrderQuantity"
            style="width: 100%"
            :rules="[{ required: true, message: '请输入首单数量', trigger: 'blur' }]"
          >
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData?.firstOrderQuantity || '--' }}</div>
            </div>
            <el-input-number
              v-else
              class="dialogFormItemWidth"
              v-model="formData.firstOrderQuantity"
              placeholder="请输入首单数量"
              :controls="false"
              :precision="0"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="longlabel">
            <el-form-item
              label="营销策略-预估月销量"
              prop="monthCount"
              style="width: 100%"
              :rules="[{ required: true, message: '请输入营销策略-预估月销量', trigger: 'blur' }]"
            >
              <div v-if="!isEdit" class="seeBg">
                <div class="seeBg-text">{{ formData?.monthCount || '--' }}</div>
              </div>
              <el-input
                v-else
                class="dialogFormItemWidth"
                v-model="formData.monthCount"
                placeholder="请输入营销策略-预估月销量"
                clearable
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="longlabel">
            <el-form-item
              label="营销策略-预估季度销量"
              prop="seasonCount"
              style="width: 100%"
              :rules="[{ required: true, message: '请输入营销策略-预估季度销量', trigger: 'blur' }]"
            >
              <div v-if="!isEdit" class="seeBg">
                <div class="seeBg-text">{{ formData?.seasonCount || '--' }}</div>
              </div>
              <el-input
                v-else
                class="dialogFormItemWidth"
                v-model="formData.seasonCount"
                placeholder="请输入营销策略-预估季度销量"
                clearable
              />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="longlabel">
            <el-form-item
              label="预估退货率"
              prop="estimatedReturnRate"
              style="width: 100%"
              :rules="[{ required: true, message: '请输入预估退货率', trigger: 'blur' }]"
            >
              <div v-if="!isEdit" class="seeBg">
                <div class="seeBg-text">{{ formData?.estimatedReturnRate || '--' }}</div>
              </div>
              <el-input
                v-else
                class="dialogFormItemWidth"
                v-model="formData.estimatedReturnRate"
                placeholder="请输入预估退货率"
                clearable
              />
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="新品销售月份"
            prop="npSalesMonth"
            style="width: 100%"
            :rules="[{ required: true, message: '请输入新品销售月份', trigger: 'blur' }]"
          >
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData?.npSalesMonth || '--' }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="formData.npSalesMonth"
              placeholder="例如六月～九月"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            label="刚上新活动量规划"
            prop="activityVolumePlan"
            style="width: 100%"
            :rules="[{ required: true, message: '请输入刚上新活动量规划', trigger: 'blur' }]"
          >
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData?.activityVolumePlan || '--' }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="formData.activityVolumePlan"
              placeholder="例如私域活动等"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="链接详情页面主打方向"
            prop="linkDetailKeyFocus"
            style="width: 100%"
            :rules="[{ required: true, message: '请输入链接详情页面主打方向', trigger: 'blur' }]"
          >
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData?.linkDetailKeyFocus || '--' }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="formData.linkDetailKeyFocus"
              placeholder="请输入链接详情页面主打方向"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="是否收到拍摄样品" prop="isReceiveShootSample" style="width: 100%">
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData?.isReceiveShootSample ? '是' : '否' }}</div>
            </div>
            <el-select
              v-else
              class="dialogFormItemWidth"
              v-model="formData.isReceiveShootSample"
              placeholder="请选择是否收到拍摄样品"
              clearable
            >
              <el-option label="是" value="1" />
              <el-option label="否" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item
            label="包装编码"
            prop="packageCode"
            style="width: 100%"
            :rules="[{ required: true, message: '请输入包装编码', trigger: 'blur' }]"
          >
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData.packageCode || '--' }}</div>
            </div>
            <el-input
              v-else
              class="dialogFormItemWidth"
              v-model="formData.packageCode"
              placeholder="请输入包装编码"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="是否分SKU包装"
            prop="isSkuPackage"
            style="width: 100%"
            :rules="[{ required: true }]"
          >
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData.isSkuPackage ? '是' : '否' }}</div>
            </div>
            <!-- @change="skuPackageChange" -->
            <el-radio-group v-else v-model="formData.isSkuPackage" class="saleTimeHeader-radio">
              <el-radio label="1">是</el-radio>
              <el-radio label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="Number(formData.isSkuPackage || '') == 1">
        <el-col :span="24">
          <el-form-item
            label="分SKU包装编码"
            prop="skuPackageCode"
            style="width: 100%"
            :rules="[{ required: true, message: '请输入分SKU包装编码', trigger: 'blur' }]"
          >
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData.skuPackageCode || '--' }}</div>
            </div>
            <s-text-area
              v-else
              :autosize="{ minRows: 3, maxRows: 3 }"
              class="dialogFormItemWidth"
              v-model="formData.skuPackageCode"
              placeholder="请输入分SKU包装编码"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="下单明细" prop="npPrenatalSampleInfoList" style="width: 100%">
            <el-descriptions
              :column="2"
              border
              v-if="
                erpInfo?.npPrenatalSampleInfoList && erpInfo?.npPrenatalSampleInfoList.length > 0
              "
            >
              <el-descriptions-item
                v-for="(value, index) in erpInfo.npPrenatalSampleInfoList"
                :key="index"
                :label="`${value.skuName}(${value.skuCode})`"
                label-align="center"
                align="left"
                label-class-name="item-title"
                class-name="item-value"
                label-width="234px"
                :width="
                  erpInfo.npPrenatalSampleInfoList.length % 2 === 1 &&
                  index === erpInfo.npPrenatalSampleInfoList.length - 1
                    ? '534px'
                    : '150px'
                "
                :span="
                  erpInfo.npPrenatalSampleInfoList.length % 2 === 1 &&
                  index === erpInfo.npPrenatalSampleInfoList.length - 1
                    ? 2
                    : 1
                "
              >
                {{ value.orderQuantity }}
              </el-descriptions-item>
              <el-descriptions-item
                label="合计"
                label-align="center"
                align="left"
                label-class-name="item-title"
                class-name="item-value"
                label-width="234px"
                width="534px"
                :span="2"
              >
                {{ erpInfo?.totalOrderQuantity || 0 }}
              </el-descriptions-item>
            </el-descriptions>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="运营备注" prop="operationRemark" style="width: 100%">
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData?.operationRemark || '--' }}</div>
            </div>
            <s-text-area
              v-else
              :autosize="{ minRows: 3, maxRows: 4 }"
              class="dialogFormItemWidth"
              v-model="formData.operationRemark"
              placeholder="请输入备注"
              clearable
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label=""
            :required="false"
            prop="salesTargetFirstMonth"
            :style="{ width: `100%`, height: 'auto' }"
          >
            <template #label>
              <div>
                <div>销售目标</div>
                <div>(第一月)</div>
              </div>
            </template>
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData.salesTargetFirstMonth || '--' }}</div>
            </div>
            <el-input
              v-else
              v-model="formData.salesTargetFirstMonth"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label=""
            :required="false"
            prop="salesTargetSecondMonth"
            :style="{ width: `100%`, height: 'auto' }"
          >
            <template #label>
              <div>
                <div>销售目标</div>
                <div>(第二月)</div>
              </div>
            </template>
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData.salesTargetSecondMonth || '--' }}</div>
            </div>
            <el-input
              v-else
              v-model="formData.salesTargetSecondMonth"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label=""
            :required="false"
            prop="salesTargetThirdMonth"
            :style="{ width: `100%`, height: 'auto' }"
          >
            <template #label>
              <div>
                <div>销售目标</div>
                <div>(第三月)</div>
              </div>
            </template>
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData.salesTargetThirdMonth || '--' }}</div>
            </div>
            <el-input
              v-else
              v-model="formData.salesTargetThirdMonth"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label=""
            :required="true"
            prop="salesTargetQuarter"
            :style="{ width: `100%`, height: 'auto' }"
          >
            <template #label>
              <div style="color: #ea0000">
                <div>销售目标</div>
                <div>(季度)</div>
              </div>
            </template>
            <div v-if="!isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData.salesTargetQuarter || '--' }}</div>
            </div>
            <el-input v-else v-model="formData.salesTargetQuarter" placeholder="请输入"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" v-if="!isEdit && formData.salesTargetDismantling">
          <!-- 销售目标拆解 -->
          <el-form-item
            label="销售目标拆解"
            :required="true"
            prop="salesTargetDismantling"
            :rules="[{ required: true, message: '销售目标拆解不能为空', trigger: 'blur' }]"
            :style="{ width: `100%`, height: 'auto' }"
          >
            <uploadFile
              ref="salesTargetDismantlingUploadFileRef"
              v-model:modelValue="formData.salesTargetDismantling"
              :width="352"
              :only-show="!isEdit"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="Number(formData.isSkuPackage || '') == 1">
          <!-- 分SKU包装 流程图 -->
          <el-form-item
            label="分SKU包装流程图"
            :required="false"
            prop="skuPackagePicture"
            :rules="[{ required: false, message: '分SKU包装流程图不能为空', trigger: 'blur' }]"
            :style="{ width: `100%`, height: 'auto' }"
          >
            <uploadFile
              ref="skuPackagePictureUploadFileRef"
              v-model:modelValue="formData.skuPackagePicture"
              :width="324"
              :only-show="!isEdit"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { formatCustomDate } from '@/views/OA/new/product/utils'
import { getBasicAttribute } from '@/api/oa/new/plan/index'
import uploadFile from '@/components/SWUoloadFile/index.vue'
const props = defineProps({
  isEdit: {
    type: Boolean,
    default: false
  },
  formLoading: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object as any,
    default: () => {}
  },
  erpInfo: {
    type: Object as any,
    default: () => {}
  }
})
const formData = computed(() => {
  console.log(props.data)
  return props.data || {}
})

const productTypeColumnOptions = ref()
const getProductTypeColumnOptions = async () => {
  getBasicAttribute({ code: 'Develop' }).then((res: any) => {
    if (res) {
      const productTypeColumn = res.find((item) => item.code === 'productType')
      productTypeColumnOptions.value = productTypeColumn.options // 获取产品类型选项
    }
  })
}
// 获取产品类型选项名称
const getProductType = (productType) => {
  if (!productType || !productTypeColumnOptions.value) return ''
  const options = productTypeColumnOptions.value.filter((item) => item.code === productType)
  return options.length > 0 ? options[0].value : ''
}

const formRules = reactive({})

const salesTargetDismantlingUploadFileRef = ref()

const bgClick = () => {
  salesTargetDismantlingUploadFileRef.value?.cancelUploadSelect()
}

onMounted(() => {
  getProductTypeColumnOptions()
})
</script>

<style lang="scss" scoped>
:deep(.longLabel .el-form-item__label) {
  line-height: 16px;
  text-align: right;
}

:deep(.el-input-number .el-input__inner) {
  text-align: left;
}

.formWrapper {
  padding: 0 20px 20px;
}

.seeBg {
  width: 100%;
  min-height: 32px;
  padding: 2px 0;
  border-radius: 4px;
  /* 应用/边框 */
  background: #f8f8f9;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;

  &-text {
    font-size: 14px;

    color: #666666;
    line-height: 20px;
    padding-left: 16px;
    padding-right: 16px;
    line-height: 22px;
    padding-top: 5px;
    padding-bottom: 5px;
  }
}
</style>
<style lang="scss" scoped>
.orderDetailBg {
  // width: 758px;
  display: flex;
  flex-wrap: wrap;
}

.item {
  width: calc(50% - 1px);
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-left {
  width: 379px;
}

.item-titleBg {
  width: 234px;
  height: 45px;
  padding-left: 16px;
  padding-right: 16px;
  background: #f4f6fa;
  border: 1px solid #e5e5e5;
  border-right: none;
  border-bottom: none;
  border-left: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-titleBg1 {
  border-top: none;
}

.item-valueBg {
  height: 45px;
  width: 145px;
  background: #ffffff;
  border: 1px solid #e5e5e5;
  border-right: none;
  border-bottom: none;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.item-valueBg1 {
  border-top: none;
}

.item-valueBg2 {
  border-right: 1px solid #e5e5e5;
}

.item-title {
  font-size: 14px;
  color: #666666;
  line-height: 22px;
}

.item-value {
  height: 45px;
  margin-left: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
