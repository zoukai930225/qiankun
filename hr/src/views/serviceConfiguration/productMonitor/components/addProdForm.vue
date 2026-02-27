<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer" size="968">
      <div>
        <div class="drawerTitle">
          <div>{{ drawerTitle }}</div>
          <div @click="drawerVisible = false"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="110px">
        <div class="drawerContent">
          <el-form-item label="表名(编码)" prop="code" required>
            <el-input class="dialogFormItemWidth" v-model="formData.code" placeholder="请输入监控指标" style="width: 100%" />
          </el-form-item>
          <el-form-item label="监控字段(编码)" prop="monitoCode">
            <el-input class="dialogFormItemWidth" v-model="formData.monitoCode" placeholder="请输入监控字段(编码)"
              style="width: 100%" />
          </el-form-item>
          <el-form-item label="监控字段(名称)" prop="monitoName">
            <s-text-area class="dialogFormItemWidth" v-model="formData.monitoName" placeholder="不填即为监控全部商品"
              style="width: 100%" :autosize="{ minRows: 4, maxRows: 8 }" />
          </el-form-item>
          <div class="tips">
            <img src="@/assets/imgs/common/tips2.png" alt="" />
            填写多个用英文逗号隔开，编码和名称保持顺序一致！
            <!-- <span class="tips-important"></span> -->
          </div>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="阈值设定" prop="thresholdSetting" style="width: 100%">
                <el-select class="dialogFormItemWidth" v-model="formData.thresholdSetting" placeholder="请选择" clearable
                  style="width: 100%">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.THRESHOLD_SETTING, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="" label-width="0" prop="threshold" style="width: 100%">
                <el-input class="dialogFormItemWidth" v-model="formData.threshold" placeholder="填写值" style="width: 100%"
                  type="number" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="" label-width="0" prop="thresholdType" style="width: 100%">
                <el-select class="dialogFormItemWidth" v-model="formData.thresholdType" placeholder="请选择" clearable
                  style="width: 100%">
                  <el-option v-for="dict in getIntDictOptions(DICT_TYPE.THRESHOLD_TYPE, true)" :key="dict.value"
                    :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="监控类型" prop="monitoringCategory">
            <el-select class="dialogFormItemWidth" v-model="formData.monitoringCategory" placeholder="请选择" clearable
              style="width: 100%">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.MONITORING_CATEGORY, true)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <!-- TODO：需要根据监控类型判断显示哪个 -->
          <el-form-item label="定时时间" prop="timedTime" v-if="formData.monitoringCategory == 'regular_time'"
            :required="formData.monitoringCategory == 'regular_time'"
            :rules="[{ required: true, message: '请选择定时时间', trigger: 'change' }]">
            <el-time-picker placeholder="选择的值为每日定时开始的时间" format="HH:mm" value-format="HH:mm"
              v-model="formData.timedTime" style="width: 100%" />
          </el-form-item>
          <el-form-item label="实时间隔" prop="realTime" v-else-if="formData.monitoringCategory == 'real_time'"
            :required="formData.monitoringCategory == 'real_time'"
            :rules="[{ required: true, message: '请选择实时间隔', trigger: 'change' }]">
            <el-time-picker placeholder="选择的值为时间间隔" format="HH:mm" value-format="HH:mm" v-model="formData.realTime"
              style="width: 100%" />
          </el-form-item>
          <el-form-item label="过滤字段" prop="filterField">
            <el-input class="dialogFormItemWidth" v-model="formData.filterField" placeholder="请输入过滤字段"
              style="width: 100%" />
          </el-form-item>
          <el-form-item label="过滤值" prop="goodsSelect">
            <s-text-area class="dialogFormItemWidth" v-model="formData.goodsSelect" placeholder="不填即为监控全部商品"
              style="width: 100%" :autosize="{ minRows: 4, maxRows: 8 }" />
          </el-form-item>
          <div class="tips">
            <img src="@/assets/imgs/common/tips2.png" alt="" />
            输入
            <span class="tips-important">需要</span>
            监控的值,多个请用英文逗号,隔开，不填则为监控全部
          </div>
          <el-form-item label="" prop="goodsInvert">
            <s-text-area class="dialogFormItemWidth" v-model="formData.goodsInvert" placeholder="不填即为监控全部商品"
              style="width: 100%" :autosize="{ minRows: 4, maxRows: 8 }" />
          </el-form-item>
          <div class="tips">
            <img src="@/assets/imgs/common/tips2.png" alt="" />
            输入
            <span class="tips-important">不需要</span>
            监控的值,多个请用英文逗号,隔开，不填则为监控全部
          </div>
        </div>
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon"></div>
            <div>机器人设置</div>
          </div>
          <el-form-item label="地址" prop="robotWebhookAddress">
            <el-input class="dialogFormItemWidth" v-model="formData.robotWebhookAddress" placeholder="填写值"
              style="width: 100%" />
          </el-form-item>
          <el-form-item label="密钥" prop="robotSecret">
            <el-input class="dialogFormItemWidth" v-model="formData.robotSecret" placeholder="填写值"
              style="width: 100%" />
          </el-form-item>
        </div>
      </el-form>
      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button>
      </div>
    </el-drawer>
    <!-- <LinkAccountDialog ref="linkAccountRef" @selectLinkObject="selectLinkAccountObject" />
    <LinkNodeDialog ref="linkNodeRef" @selectLinkObject="selectLinkNodeObject" /> -->
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
// import LinkAccountDialog from './linkAccountDialog.vue'
// import LinkNodeDialog from './linkNodeDialog.vue'

defineOptions({ name: 'AddProdForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import * as productMonitorApi from '@/api/serviceConfiguration/productMonitor'
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'

const formData = ref({
  id: '',
  thresholdType: '', // 阈值类型
  thresholdSetting: '', // 阈值设定
  threshold: '', // 阈值
  monitoringCategory: '', // 监控类型 -实时/定时
  monitorIndex: '', // 监控指标
  code: '', // 表名(编码)
  monitoCcode: '', // 监控字段(编码)
  monitoName: '', // 监控字段(名称)
  goodsSelect: '', // 商品正选
  goodsInvert: '', // 商品反选
  timedTime: '', // 定时时间
  realTime: '', // 实时时间
  robotWebhookAddress: '', // 机器人地址
  robotSecret: '' // 机器人密钥
})
const formRules = reactive({
  store: [{ required: true, message: '请选择店铺', trigger: 'change' }],
  monitorIndex: [{ required: true, message: '请输入监控指标', trigger: 'blur' }],
  thresholdSetting: [{ required: true, message: '请选择', trigger: 'change' }],
  threshold: [{ required: true, message: '请输入阈值', trigger: 'blur' }],
  thresholdType: [{ required: true, message: '请选择', trigger: 'change' }],
  monitoringCategory: [{ required: true, message: '请选择', trigger: 'change' }]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  drawerTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // console.log('打开弹窗', id)
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await productMonitorApi.getMonitorDetail({ id: id })
      formData.value = data
    } finally {
      formLoading.value = false
    }
  }
  // 获取店铺列表
  getShopList()
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
    const data = formData.value as any

    // console.log('提交的数据：', data)
    if (formType.value === 'create') {
      data.id = undefined
      await productMonitorApi.addMonitor(data)
      message.success(t('common.createSuccess'))
    } else {
      await productMonitorApi.updateMonitor(data)
      message.success(t('common.updateSuccess'))
    }
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
    ; (formData.value.id = ''),
      (formData.value.thresholdType = ''),
      (formData.value.thresholdSetting = ''),
      (formData.value.threshold = ''),
      (formData.value.monitoringCategory = ''),
      (formData.value.monitorIndex = ''),
      (formData.value.store = ''),
      (formData.value.goodsSelect = ''),
      (formData.value.goodsInvert = ''),
      (formData.value.timedTime = ''),
      (formData.value.realTime = ''),
      (formData.value.robotWebhookAddress = ''),
      (formData.value.robotSecret = '')
}

// 获取店铺列表
const shopList = ref([])
const getShopList = async () => {
  let data = await productMonitorApi.getShopList()
  shopList.value = data.map((item) => ({ label: item.name, value: item.code }))
}
</script>

<style lang="scss" scoped>
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
    width: 340px;
    padding: 0 16px;
    min-height: 32px;
    box-sizing: border-box;
    background-image: url(@/assets/imgs/common/input_disabled.png);
    background-repeat: no-repeat;
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
