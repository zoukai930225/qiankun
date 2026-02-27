<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer"
      @close="handleCloseDrawer" size="968">
      <div>
        <div class="drawerTitle">
          <div>校准意见</div>
          <div @click="handleCloseDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="80px">
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>姓名：{{ formData.name }}</div>
          </div>
          <div class="form-label">本人认为的在工作中的两个优点</div>
          <el-row :gutter="36">
            <el-col :span="12" v-for="(item, index) in formData.advantageList" :key="index">
              <el-form-item label="" prop="" label-width="0">
                <div class="drawerContent-disabledInput">{{ item }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!formData.advantageList || formData.advantageList.length == 0">
              <el-form-item label="" prop="" label-width="0">
                <div class="drawerContent-disabledInput"></div>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!formData.advantageList || formData.advantageList.length == 0">
              <el-form-item label="" prop="" label-width="0">
                <div class="drawerContent-disabledInput"></div>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="form-label">本人认为的在工作中的两个提升点</div>
          <el-row :gutter="36">
            <el-col :span="12" v-for="(item, index) in formData.improveList" :key="index">
              <el-form-item label="" prop="" label-width="0">
                <div class="drawerContent-disabledInput">{{ item }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!formData.improveList || formData.improveList.length == 0">
              <el-form-item label="" prop="" label-width="0">
                <div class="drawerContent-disabledInput"></div>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!formData.improveList || formData.improveList.length == 0">
              <el-form-item label="" prop="" label-width="0">
                <div class="drawerContent-disabledInput"></div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>补充</div>
          </div>
          <el-form-item label="" prop="advantagesWork" label-width="0">
            <div class="form-label">在工作中的优点</div>
            <s-text-area class="dialogFormItemWidth" v-model="formData.advantagesWork" placeholder="请输入"
              style="width: 100%" @keyup.enter="formData.advantagesWork += '\n'" :autosize="{ minRows: 3, maxRows: 4 }"
              :disabled="onlyView" />
          </el-form-item>
          <el-form-item label="" prop="improvementWork" label-width="0">
            <div class="form-label">在工作中的提升点</div>
            <s-text-area class="dialogFormItemWidth" v-model="formData.improvementWork" placeholder="请输入"
              style="width: 100%" @keyup.enter="formData.improvementWork += '\n'" :autosize="{ minRows: 3, maxRows: 4 }"
              :disabled="onlyView" />
          </el-form-item>
        </div>
        <!-- 晋升计划 -->
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>晋升计划</div>
          </div>
          <el-row :gutter="36">
            <el-col :span="12">
              <el-form-item label="晋升潜力" prop="prefermentPotentiality">
                <el-select class="dialogFormItemWidth" v-model="formData.prefermentPotentiality" placeholder="请选择"
                  clearable value-on-clear="" :disabled="onlyView" style="width: 100%">
                  <el-option v-for="dict in getIntDictOptions(
                    DICT_TYPE.OTR_CALIBRATION_VIEW_PREFERMENT_POTENTIALITY,
                    true
                  )" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="任用计划" prop="appointPlans">
                <el-select class="dialogFormItemWidth" v-model="formData.appointPlans" placeholder="请选择" clearable
                  multiple :value-on-clear="[]" :disabled="onlyView" style="width: 100%">
                  <el-option v-for="dict in getIntDictOptions(
                    DICT_TYPE.OTR_CALIBRATION_VIEW_APPOINT_PLAN,
                    true
                  )" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select> </el-form-item></el-col>
          </el-row>
          <!-- 发展建议 -->
          <el-form-item label="发展建议" prop="developSuggestion">
            <s-text-area class="dialogFormItemWidth" v-model="formData.developSuggestion" placeholder="请输入"
              style="width: 100%" @keyup.enter="formData.developSuggestion += '\n'" :disabled="onlyView"
              :autosize="{ minRows: 3, maxRows: 4 }" />
          </el-form-item>
        </div>
        <!-- 继任者 -->
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>继任者</div>
          </div>
          <el-row :gutter="36">
            <el-col :span="12">
              <el-form-item label="立刻" prop="competentImmediate" style="width: 100%">
                <el-input class="dialogFormItemWidth" v-model="formData.competentImmediate" placeholder="请输入"
                  style="width: 100%" :disabled="onlyView" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="1年内" prop="competentInOneYear" style="width: 100%">
                <el-input class="dialogFormItemWidth" v-model="formData.competentInOneYear" placeholder="请输入"
                  style="width: 100%" :disabled="onlyView" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="36">
            <el-col :span="12">
              <el-form-item label="1~3年内" prop="competentInThreeYear" style="width: 100%">
                <el-input class="dialogFormItemWidth" v-model="formData.competentInThreeYear" placeholder="请输入"
                  style="width: 100%" :disabled="onlyView" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 风险评估 -->
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>风险评估</div>
          </div>
          <el-row :gutter="36">
            <el-col :span="12">
              <el-form-item label="离职可能性" prop="resignPossibility" label-width="90px">
                <el-select class="dialogFormItemWidth" v-model="formData.resignPossibility" placeholder="请选择" clearable
                  value-on-clear="" style="width: 100%" :disabled="onlyView">
                  <el-option v-for="dict in getIntDictOptions(
                    DICT_TYPE.OTR_CALIBRATION_VIEW_RESIGN_POSSIBILITY,
                    true
                  )" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="离职影响" prop="resignEffect">
                <el-select class="dialogFormItemWidth" v-model="formData.resignEffect" placeholder="请选择" clearable
                  value-on-clear="" style="width: 100%" :disabled="onlyView">
                  <el-option v-for="dict in getIntDictOptions(
                    DICT_TYPE.OTR_CALIBRATION_VIEW_RESIGN_EFFECT,
                    true
                  )" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select> </el-form-item></el-col>
          </el-row>
        </div>
        <!-- 校准备注 -->
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>校准备注</div>
          </div>
          <el-form-item label="备注" prop="remark">
            <s-text-area class="dialogFormItemWidth" v-model="formData.remark" placeholder="请输入"
              @keyup.enter="formData.remark += '\n'" style="width: 100%" :autosize="{ minRows: 3, maxRows: 4 }"
              :disabled="onlyView" />
          </el-form-item>
        </div>
      </el-form>
      <div class="drawerFooter">
        <!-- <div
        class="drawerFooter"
        v-if="(formType == 'create' || formType == 'update') && inspectStatus == 0"
      > -->
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button v-if="!onlyView" :disabled="formLoading" type="primary" @click="submitForm">
          <!-- formType === 'create' ? '保 存' : '提 交' -->
          {{ '保 存' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
defineOptions({ name: 'AddProdForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import * as InventoryCalibrationApi from '@/api/otr/InventoryCalibration'

const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

const formData = ref({
  id: '',
  name: '', // 姓名
  inventoryId: '', // 活动ID
  remark: '', //备注
  userId: '', // 用户ID
  advantageList: [], // 本人认为的在工作中的两个优点
  improveList: [], // 本人认为的在工作中的两个提升点
  prefermentPotentiality: '', //晋升潜力
  appointPlan: '', //任用计划
  appointPlans: [], // 任用计划多选数组
  developSuggestion: '', //发展建议
  competentImmediate: '', //立刻
  competentInOneYear: '', //1年内
  competentInThreeYear: '', //1~3年内
  resignPossibility: '', //离职可能性
  resignEffect: '' //离职影响
})
const formRules = reactive({})
const inspectStatus = ref('0') // 状态
const formRef = ref() // 表单 Ref
const onlyView = ref(false) // 是否只查看

/** 打开弹窗 */
const open = async (type: string, userId: string, inventoryId: string, status: string) => {
  drawerVisible.value = true
  drawerTitle.value = t('action.' + type)
  formType.value = type
  inspectStatus.value = status

  onlyView.value = type === 'view' //在盘点结果中为只查看状态

  resetForm()
  formData.value.inventoryId = inventoryId
  console.log('打开弹窗userId', userId)
  console.log('打开弹窗inventoryId', inventoryId)
  // 修改时，设置数据
  if (userId) {
    formLoading.value = true
    try {
      const data = await InventoryCalibrationApi.getCalibrationDetail({
        userId: userId,
        inventoryId: inventoryId
      })
      formData.value = data
      if (formData.value.appointPlan) {
        formData.value.appointPlans = (formData.value.appointPlan.split(',') || []) as any
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    console.log('提交表单formData', formData.value)
    if (formData.value.appointPlans && formData.value.appointPlans.length > 0) {
      formData.value.appointPlan = formData.value.appointPlans.join(',')
    } else {
      formData.value.appointPlan = ''
    }
    const data = formData.value as any

    await InventoryCalibrationApi.updateCalibration(data)
    message.success(t('common.updateSuccess'))

    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: '',
    name: '', // 姓名
    inventoryId: '', // 活动ID
    remark: '', //备注
    userId: '', // 用户ID
    advantageList: [], // 本人认为的在工作中的两个优点
    improveList: [], // 本人认为的在工作中的两个提升点
    prefermentPotentiality: '', //晋升潜力
    appointPlan: '', //任用计划
    appointPlans: [],
    developSuggestion: '', //发展建议
    competentImmediate: '', //立刻
    competentInOneYear: '', //1年内
    competentInThreeYear: '', //1~3年内
    resignPossibility: '', //离职可能性
    resignEffect: '' //离职影响
  }
}

const handleCloseDrawer = () => {
  drawerVisible.value = false
}
</script>

<style lang="scss" scoped>
.form-label {
  font-size: 14px;
  color: #666666;
  margin-bottom: 14px;
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
  border: none !important;
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
  padding: 16px 20px 5px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;

  &-title {
    margin: 0 0 14px 0;
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

  .tips {
    margin: 0 0 16px 80px;
    color: #2693f8;
    font-size: 14px;

    &-important {
      color: #eb3737;
    }

    img {
      width: 12px;
    }
  }

  &-disabledInput {
    width: 426px;
    padding: 0 16px;
    min-height: 40px;
    box-sizing: border-box;
    background-image: url(@/assets/imgs/common/input_disabled.png);
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }

  .disabledInput_cover {
    background-image: url(@/assets/imgs/common/input_disabled_cover.png);
    width: 100%;
  }

  .disabledInput_remark {
    background-image: url(@/assets/imgs/common/input_disabled_remark.png);
    width: 100%;
    min-height: 92px;
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
