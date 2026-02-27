<!--
 * @Date: 2025-02-19 15:55:00
-->
<template>
  <div>
    <el-dialog
      v-model="visible"
      :width="width"
      :before-close="handleClose"
      class="oadialog-background"
      :append-to-body="true"
    >
      <div>
        <div class="dialog-content" style="width: 388px; height: 162px">
          <el-form
            ref="ruleFormRef"
            :model="form"
            label-width="auto"
            style="max-width: 600px; margin-left: 25px; margin-right: 25px"
            :rules="rules"
          >
            <el-form-item label="色系" prop="colorSeries">
              <el-select
                class="inputBg"
                style="border: none"
                v-model="form.colorSeries"
                placeholder="请选择色系"
                clearable
              >
                <el-option
                  v-for="(color, index) in colorList"
                  :key="index"
                  :label="color"
                  :value="color"
                />
              </el-select>
            </el-form-item>
            <div style="height: 15px"></div>
            <el-form-item label="颜色名称" prop="color">
              <div class="row-center">
                <el-input
                  class="inputBg input2"
                  v-model="form.color"
                  placeholder="请输入颜色名称"
                />
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #header="{}">
        <div class="my-header">
          <img src="@/assets/imgs/oa/oa_design_fabric.png" class="shenhe-title" />
          <span>{{ title }}</span>
        </div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmDialog">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import * as DictDataApi from '@/api/system/dict/dict.data'
const message = useMessage() // 消息弹窗

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  colorList: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: '新增颜色'
  },
  width: {
    type: String,
    default: '428px'
  },

  selectItem: {
    type: Object,
    default: () => ({})
  }
})

const form = reactive({
  colorSeries: '',
  color: ''
})

const rules = reactive({
  colorSeries: [{ required: true, message: '请选择色系', trigger: 'blur' }],
  color: [{ required: true, message: '请填写颜色', trigger: 'blur' }]
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const handleClose = () => {
  form.colorSeries = ''
  form.color = ''
  emit('update:modelValue', false)
}

const ruleFormRef = ref()
const confirmDialog = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      addColorRequest()
    } else {
      return false
    }
  })
}

const addColorRequest = async () => {
  await DictDataApi.createDictData({
    shortName: form.colorSeries,
    name: form.color,
    code: `${form.colorSeries}_${form.color}`,
    pCode: 'np_design_product_color'
  })
  message.success('新增成功')
  emit('confirm')
  emit('update:modelValue', false)
}
</script>

<style scoped lang="scss">
:deep(.el-dialog) {
  border-radius: 20px;
}

.dialogBg {
  position: absolute;
  top: -16px;
  left: -15px;
  width: 470px;
  height: 344px;
  z-index: -1;
}

.dialog-footer {
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .shenhe-title {
    width: 14px;
    height: 14px;
    margin-right: 20px;
  }
}

.inputBg {
  width: 250px;
  height: 32px;
  background: #f8f8f9;
  border-radius: 4px;
}

:deep(.el-input__wrapper) {
  background: #f8f8f9;
  border-radius: 4px;
}

:deep(.el-input) {
  border: none;
}

:deep(.el-select__wrapper) {
  height: 32px;
  font-size: 14px;
  color: #333333;
  background: #f8f8f9;
  box-shadow: none;
  line-height: 22px;
  border-radius: 4px;
  padding-left: 20px;
}

:deep(.el-select__placeholder) {
  width: 95px;
  font-size: 14px;
  color: #333;
  line-height: 22px;
}

:deep(.el-input__wrapper) {
  border-radius: 4px;
}

:deep(.el-input__wrapper) {
  box-shadow: none;
  background: #f8f8f9;
  border-radius: 4px;
}
</style>

<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
  :deep(.el-select-group__title) {
    font-size: 14px; //
    color: #0064ff;
  }
}
</style>

<style>
.el-select-group {
  border: none !important;
  margin-bottom: 2px;
  padding-left: 4px;
  padding-right: 4px;
  border-bottom: 0.5px solid #ececec !important;
}
.el-select-group__title {
  padding-left: 24px;
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  color: #333333;
  height: 32px;
}
</style>
