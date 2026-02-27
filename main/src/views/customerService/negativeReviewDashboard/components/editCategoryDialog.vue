<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <el-dialog v-model="dialogVisible" :width="640" style="padding: 0; height: 515px" :show-close="false">
    <div>
      <div class="dialog-content">
        <el-form ref="formRef" :model="form" label-width="auto" :rules="rules" inline>
          <el-form-item label="一级分类" prop="primaryClassification">
            <el-select style="width: 220px" v-model="form.primaryClassification" placeholder="请选择一级分类" clearable
              filterable value-on-clear="" @change="handleFirstLevelChange">
              <el-option v-for="dict in oneLevelList" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类" prop="secondaryClassification" style="margin-right: 0">
            <el-select class="dialogFormItemWidth" v-model="form.secondaryClassification" placeholder="请选择二级分类"
              clearable filterable style="width: 220px" value-on-clear="">
              <el-option v-for="dict in twoLevelList" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="dialog-order-code-wrapper">
          <div class="dialog-order-title"> 订单号</div>
          <div class="dialog-order-code">{{ form.orderNo }} </div>
        </div>
        <div class="dialog-order-content-wrapper">
          <div class="dialog-order-title">订单内容 </div>
          <div class="dialog-order-content">
            <ElScrollbar height="150px">
              {{ form.content }}
            </ElScrollbar>
          </div>
        </div>
      </div>
    </div>
    <template #header>
      <div class="header-class">
        <span>编辑分类</span>
        <img src="@/assets/imgs/negativeReviewDashboard/close.svg" alt="" style="cursor: pointer" class="icon"
          @click="dialogVisible = false" />
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
        <el-button type="primary" @click="submitForm">保 存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as negativeReviewDashboardApi from '@/api/negativeReviewDashboard'

import { debounce } from 'lodash-es'
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false)
const { t } = useI18n() // 国际化
const formRef = ref()
const form = ref({
  id: undefined,
  primaryClassification: '',
  secondaryClassification: '',
  store: '',
  orderNo: '', // 订单号
  content: ''
})

// 置空
const resetForm = () => {
  form.value = {
    id: undefined,
    primaryClassification: '',
    secondaryClassification: '',
    store: '',
    orderNo: '', // 订单号
    content: ''
  }
  formRef.value?.resetFields()
}

// 打开弹窗
const open = async (id: any) => {
  dialogVisible.value = true
  resetForm()

  if (id) {
    await getEvaluation()
    const res = await negativeReviewDashboardApi.getNegativeReviewData({ id: id })
    form.value = Object.assign(form.value, res)
    initTwoLevelList()
  }
}

const rules = reactive({})

const dataMap = ref({})
const oneLevelList = ref<any>([])
const twoLevelList = ref<any>([])
// 获取查询条件 一级分类/二级分类的下拉列表
const getEvaluation = async () => {
  const res = await negativeReviewDashboardApi.getEvaluationList({})
  oneLevelList.value = []
  if (res) {
    dataMap.value = res

    // 获取 res 所有 key
    const subKeys = Object.keys(res.中差评)
    if (subKeys.length == 0) return

    // 赋值给 一级分类列表
    oneLevelList.value = subKeys.map((key) => ({
      label: key,
      value: key
    }))

    console.log('一级分类', oneLevelList.value)
  }
}

// 根据打开页面时的一级分类名称，更新二级分类列表
const initTwoLevelList = () => {
  twoLevelList.value = []
  if (
    !form.value.primaryClassification ||
    !dataMap.value['中差评'] ||
    !dataMap.value['中差评'][form.value.primaryClassification]
  )
    return

  const subList = dataMap.value['中差评'][form.value.primaryClassification]
  if (subList.length == 0) return
  twoLevelList.value = subList.map((item) => ({
    label: item.levelThreeLabel,
    value: item.levelThreeLabel
  }))
}

// 选择一级分类时更新二级列表
const handleFirstLevelChange = () => {
  // 切换一级分类时，清空二级分类名称
  form.value.secondaryClassification = ''
  twoLevelList.value = []

  // 当一级分类为空或没有二级分类时，清空二级分类列表
  if (
    !form.value.primaryClassification ||
    !dataMap.value['中差评'][form.value.primaryClassification]
  )
    return

  // 赋值给 二级分类
  twoLevelList.value = dataMap.value['中差评'][form.value.primaryClassification].map((item) => ({
    label: item.levelThreeLabel,
    value: item.levelThreeLabel
  }))
  console.log('二级分类', twoLevelList.value)
}
/** 提交表单 */

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const formLoading = ref(false) // 表单提交loading
const submitForm = debounce(async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  if (!form.value.primaryClassification || !form.value.secondaryClassification) {
    return message.error('请选择要修改的分类')
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      id: form.value.id,
      primaryClassification: form.value.primaryClassification,
      secondaryClassification: form.value.secondaryClassification,
      store: form.value.store
    }
    console.log('数据）', data)
    await negativeReviewDashboardApi.updateEvaluationBoard(data)
    message.success(t('common.updateSuccess'))

    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}, 200)

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style scoped lang="scss">
.header-class {
  height: 54px;
  line-height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 20px;
  box-sizing: border-box;
  width: 100%;
}

.dialog-content {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

  .dialog-order-title {
    width: 600px;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    font-weight: bold;
    background: #f2f6fc;
    padding: 0 16px;
    color: #333333;
    box-sizing: border-box;
  }

  .dialog-order-code {
    height: 46px;
    line-height: 46px;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .dialog-order-content {
    padding: 10px 16px 0;
    box-sizing: border-box;
  }
}

.dialog-footer {
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
