<template>
  <div class="copyParamTypeForm__dialog">
    <el-dialog class="commomDialig" v-model="dialogVisible" :show-close="false" align-center>
      <el-steps :active="active" finish-status="success" align-center class="steps">
        <el-step title="选择指定日期" />
        <el-step title="修改参数值" />
        <el-step title="确认生效日期" />
      </el-steps>

      <!--选择指定日期  -->
      <div v-if="active === 0">
        <div class="dialog_tip">
          <img src="@/assets/imgs/system/param/dialog_tips.png" alt="" />
          请选择指定日期，系统将获取该日期生效的所有日报动态参数！
        </div>
        <div class="selectDate">
          <img src="@/assets/imgs/system/param/dialog_img.png" alt="" />
          <div>
            指定日期
            <el-date-picker
              v-model="formData.queryDate"
              style="width: 348px; margin-left: 10px"
              placeholder="选择日期"
              type="date"
              value-format="YYYY-MM-DD"
            />
          </div>
        </div>
      </div>

      <!-- 修改参数值 -->
      <div class="modifyParamValue" v-if="active === 1">
        <div class="dialog_tip">
          <img src="@/assets/imgs/system/param/dialog_tips.png" alt="" />
          {{ formData.queryDate }}生效的参数如下，可以直接修改每个参数的值！
        </div>
        <ModifyParamValue ref="modifyParamValueRef" :queryDate="formData.queryDate" />
      </div>
      <!-- 确认生效日期 -->
      <div class="confirmEffectiveDate" v-if="active === 2">
        <div class="dialog_tip">
          <img src="@/assets/imgs/system/param/dialog_tips.png" alt="" />
          请选择生效日期，生效日期必须大于{{ formData.queryDate }}
        </div>
        <div class="effectiveDate">
          <img src="@/assets/imgs/system/param/dialog_img.png" alt="" />
          <div style="display: flex; justify-content: center">
            <div style="margin: 5px 20px 0 0">生效日期 </div>
            <div>
              <el-date-picker
                v-model="formData.startDate"
                style="width: 348px"
                placeholder="开始日期"
                type="date"
                value-format="YYYY-MM-DD"
                @change="handleStartDateChange"
                :disabled-date="disabledStartDate"
              />
              <div style="margin-top: 20px">
                <el-date-picker
                  v-model="formData.endDate"
                  style="width: 348px"
                  placeholder="结束日期"
                  type="date"
                  value-format="YYYY-MM-DD"
                  :disabled-date="disabledEndDate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="footer-btn">
        <el-button :loading="formLoading" @click="lastStep" v-if="active > 0">上一步</el-button>
        <el-button :loading="formLoading" type="primary" @click="nextStep" v-if="active < 2"
          >下一步</el-button
        >

        <el-button :disabled="formLoading" type="primary" @click="submitForm" v-if="active === 2"
          >保 存</el-button
        >
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as DynamicParamsApi from '@/api/system/param'
import ModifyParamValue from './modifyParamValue.vue'

defineOptions({ name: 'CopyParamTypeForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  queryDate: '', // 指定日期
  startDate: '', // 生效日期的开始时间
  endDate: '', // 生效日期的结束时间
  sysDynamicParamsList: [] // 数据列表
})
/** 打开弹窗 */
const open = () => {
  dialogVisible.value = true
  resetForm()
}

/**禁用开始时间小于指定日期selectedDate的时间 */
const disabledStartDate = (date) => {
  const queryDate = formData.value.queryDate
  if (!queryDate) return false // 如果没有指定日期，不禁用任何日期
  return new Date(date).getTime() < new Date(queryDate).getTime()
}
/** 禁用结束时间 开始日期可选*/
const disabledEndDate = (date) => {
  const startDate = formData.value.startDate
  if (!startDate) return false // 如果没有开始日期，不禁用任何日期
  return new Date(date).getTime() <= new Date(startDate).getTime() - 8.64e7
}

const handleStartDateChange = (date) => {
  // 禁用所有小于开始日期的时间
  const endDate = formData.value.endDate
  if (endDate) {
    const endDateObj = new Date(endDate)
    if (endDateObj.getTime() < new Date(date).getTime()) {
      formData.value.endDate = ''
    }
  }
}

const active = ref(0) // 当前步骤
const modifyParamValueRef = ref()

/** 上一步 */
const lastStep = () => {
  if (active.value-- < 0) active.value = 2
}
/** 下一步 */
const nextStep = () => {
  // 指定日期必填
  if (active.value === 0 && !formData.value.queryDate) {
    message.error('请先选择指定日期！')
    return
  }
  //  将子组件传过来的当前数据保存到formData
  if (active.value == 1) {
    const currentData = modifyParamValueRef.value.getCurrentData()
    console.log('子组件传过来的当前数据', currentData)
    formData.value.sysDynamicParamsList = currentData.listData
  }

  if (active.value++ > 2) active.value = 0
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (active.value === 2) {
    // 生效日期的开始时间和结束时间都是必填的
    if (!formData.value.startDate || !formData.value.endDate) {
      message.error('请完整填写生效日期的开始时间和结束时间')
      return
    }
    // 提交请求
    formLoading.value = true
    try {
      const data = {
        ...formData.value
      }
      console.log('提交数据', data)
      await DynamicParamsApi.copyDynamicParamType(data)
      message.success('操作成功!')
      emit('success') // 触发 success 事件
      dialogVisible.value = false
    } finally {
      formLoading.value = false
    }
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    queryDate: '', // 指定日期
    startDate: '', // 生效日期的开始时间
    endDate: '', // 生效日期的结束时间
    sysDynamicParamsList: [] // 数据列表
  }
  active.value = 0
  formLoading.value = false
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss">
.copyParamTypeForm__dialog {
  position: relative;
  .el-dialog {
    width: 1148px;
    height: 672px;

    background: url('@/assets/imgs/system/param/dialog_bg.png') no-repeat center center;
    background-size: 100% 100%;
  }
}
</style>

<style lang="less" scoped>
@publicColor: #0064ff;
@publicHeight: 35px;
.steps {
  width: 100%;
  margin: 20px auto 0;
  font-size: 16px;
  height: @publicHeight;
  :deep(.el-step) {
    height: 100%;
    .el-step__line {
      background-color: rgba(0, 0, 0, 0.15);
      margin-right: 30px !important;
      margin-left: 135px !important;
      top: 50%;
      height: 1px;
    }
    .el-step__icon {
      width: @publicHeight;
      height: @publicHeight;
      font-size: 16px;
      border: 1px solid;

      .el-step__icon-inner {
        font-weight: unset !important;
      }
    }
    .el-step__head.is-process {
      color: @publicColor;
      border-color: @publicColor;
    }
    .el-step__head.is-success {
      color: @publicColor;
      border-color: @publicColor;
    }
    .is-process .el-step__icon.is-text {
      background: @publicColor;
      color: #fff;
    }
    .el-step__title.is-process {
      color: @publicColor;
    }
    .el-step__title.is-success {
      color: #565656;
    }
    .el-step__head.is-wait {
      color: #333333;
    }
    .el-step__title {
      position: absolute;
      top: calc((100% - @publicHeight) / 2);
      left: calc(50% + 25px);
      color: #333333;
    }
  }
}

// 提醒
.dialog_tip {
  width: 1022px;
  height: 62px;
  line-height: 62px;
  font-size: 16px;
  color: #0064ff;
  text-align: center;
  background: #e6f1ff;
  border-radius: 4px;
  margin: 20px auto 0;
  img {
    width: 18px;
    height: 18px;
    vertical-align: middle;
  }
}

// 选择指定日期
.selectDate,
.effectiveDate {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 100px;
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  img {
    width: 178px;
    margin-right: 20px;
  }
}

// 修改参数值
.modifyParamValue {
}
.footer-btn {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
