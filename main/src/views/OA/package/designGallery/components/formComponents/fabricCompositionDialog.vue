<!--
 * @Date: 2025-02-19 15:55:00
-->
<template>
  <el-dialog
    v-model="visible"
    :width="width"
    :before-close="handleClose"
    class="oadialog-background"
  >
    <div>
      <!-- <img src="@/assets/imgs/oa/oa_design_audit_bg.png" class="dialogBg" /> -->
      <div class="dialog-content" style="width: 388px;height: 162px;">
        <el-form
          ref="ruleFormRef"
          :model="form"
          label-width="auto"
          style="max-width: 600px; margin-left: 25px; margin-right: 25px"
          :rules="rules"
        >
          <el-form-item label="面料种类" prop="category">
            <!-- <el-input
            style="border: none"
            class="inputBg"
            v-model="form.category"
            placeholder="请输入面料种类"
          /> -->
            <el-select
              class="inputBg"
              style="border: none"
              v-model="form.category"
              placeholder="请选择面料"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.FABRIC, true)"
                :key="dict.code"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
          <div style="height: 15px"></div>
          <el-form-item label="面料占比" prop="percent">
            <div class="row-center">
              <el-input
                class="inputBg input2"
                v-model="form.percent"
                placeholder="请输入面料占比"
                @input="(value) => handleInput(value)"
              />
              <div class="percent" style="margin-left: 10px">%</div>
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
</template>

<script lang="ts" setup>
import { designExamine } from '@/api/oa/new/designGallery/index'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
const message = useMessage() // 消息弹窗

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '面料成分'
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
  category: '',
  percent: ''
})

const rules = reactive({
  category: [{ required: true, message: '请填写面料种类', trigger: 'blur' }],
  percent: [{ required: true, message: '请填写面料占比', trigger: 'blur' }]
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
  form.category = ''
  form.percent = ''
  emit('update:modelValue', false)
}

const ruleFormRef = ref()
const confirmDialog = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      emit('confirm', `${form.category} ${form.percent}%`)
      emit('update:modelValue', false)
    } else {
      return false
    }
  })
}

const handleInput = (value: string) => {
  // 限制只能输入数字和小数点
  let value1 = value.replace(/[^0-9.]/g, '')

  // 限制只能输入两位小数
  value1 = value1.replace(/^(\d+(\.\d{0,2})?)?.*$/, '$1')

  // 限制输入值不大于100
  if (parseFloat(value1) > 100) {
    value1 = '100'
  }
  form.percent = value1
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
}
</style>
