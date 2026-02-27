<!--
 * @Date: 2025-02-19 15:55:00
-->
<template>
  <div>
    <SWDialog
      v-if="visible"
      v-model="visible"
      :width="width"
      :title="title"
      :showTitleLine="true"
      :showBottomLine="true"
      @close="handleClose"
      :alignCenter="true"
    >
      <div class="dialog-content">
        <el-form
          ref="ruleFormRef"
          :model="form"
          label-width="auto"
          style="margin-left: 5px; margin-right: 5px"
          :rules="rules"
        >
          <el-form-item label="类型" prop="category">
            <el-input
              style="border: none; width: 100%"
              v-model="form.category"
              placeholder="请输入"
            />
          </el-form-item>
          <!-- <div style="height: 15px"></div> -->
          <el-form-item label="面料成分" prop="component">
            <FabricComposition
              :list="(form.component && form.component.split(',')) || []"
              @delete-click="deleteFabricComposition"
              @add-click="addFabricComposition"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              style="border: none; width: 100%"
              v-model="form.remark"
              placeholder="请输入"
            />
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmDialog">提交</el-button>
        </div>
      </template>
      <!-- 面料成分新增 -->
      <FabricCompositionDialog
        v-if="dialogVisible"
        v-model="dialogVisible"
        @confirm="handleConfirm"
      />
    </SWDialog>
  </div>
</template>

<script lang="ts" setup>
import FabricComposition from '@/views/OA/new/designGallery/components/formComponents/fabricComposition.vue'
import FabricCompositionDialog from '@/views/OA/new/designGallery/components/formComponents/fabricCompositionDialog.vue'

const message = useMessage() // 消息弹窗

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: '新增面辅料'
  },
  width: {
    type: String,
    default: '600px'
  },

  selectItem: {
    type: Object,
    default: () => ({})
  }
})

const form = reactive({
  category: '',
  component: '',
  remark: ''
})

const componentValidate = ((rules, value, callback) => {
  console.log(rules, value, callback)
  if(!value) return callback(new Error('请添加面料成分'))
  return callback()
})

const rules = reactive({
  category: [{ required: true, message: '请输入类型', trigger: 'blur' }],
  component: [{ required: true, validator: componentValidate,  message: '请添加面料成分', trigger: ['change', 'blur'] }]
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = ref(props.modelValue)
const dialogVisible = ref(false)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const handleClose = () => {
  form.category = ''
  form.component = ''
  form.remark = ''
  emit('update:modelValue', false)
}

const ruleFormRef = ref()
const confirmDialog = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      console.log('倒计时付款了', form)
      if (percentValid()) {
        let component = form.component
        component = component.replaceAll(' ', '')
        component = component.replaceAll(',', ' ')

        emit('confirm', `${form.category}:${component}${form.remark ? `(${form.remark})` : ''}`)
        emit('update:modelValue', false)
      }
    } else {
      return false
    }
  })
}
const percentValid = () => {
  const arr = (form.component && form.component.split(',')) || []
  let percent = 0
  arr.forEach((item) => {
    let arr1 = item.split(' ')
    if (arr1.length > 0) {
      let percentValue = arr1[arr1.length - 1]
      percentValue = percentValue.replace('%', '')
      percent += Number(percentValue)
    }
  })
  if (Math.abs(percent - 100) > 1e-6) {
    message.warning('面料成分百分比总和必须为100%')
    return false
  }
  return true
}

// 新增面料
const addFabricComposition = () => {
  dialogVisible.value = true
}

// 删除面料
const deleteFabricComposition = (index) => {
  const arr = form.component.split(',') || []
  let newArr = arr.filter((item, idx) => {
    return idx !== index
  })
  form.component = newArr.join(',')
  ruleFormRef?.value?.validateField('component')
}

// 面料新增确认
const handleConfirm = (data) => {
  if (form.component && data) {
    const arr = form.component.split(',') || []
    arr.push(data)
    form.component = arr.join(',')
  } else {
    form.component = data || ''
  }
  ruleFormRef?.value?.validateField('component')
}
</script>

<style scoped lang="scss">
.dialog-content {
  margin-top: 20px;

  .item {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 10px;
    margin-bottom: 10px;
    height: 32px;
    background: rgba(0, 100, 255, 0.1);
    border-radius: 4px;
    border: 1px solid #0064ff;

    .item-add {
      margin-left: 12px;
      margin-right: -2px;
      width: 8px;
      height: 8px;
    }

    .item-text {
      padding-left: 10px;
      padding-right: 10px;
      height: 32px;
      line-height: 32px;
      font-size: 14px;
      color: #0064ff;
    }

    .item-text1 {
      color: #333333;
    }

    .item-textDisable {
      color: #333333;
    }

    .item-close {
      margin-left: -4px;
      margin-right: 12px;
      width: 8px;
      height: 8px;
      cursor: pointer;
    }
  }

  .item1 {
    background: #ffffff;
    border: 1px dashed #d9d9d9;
    cursor: pointer;
  }
}

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
  margin-top: 10px;
  margin-right: 20px;
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
  // background: #f8f8f9;
  border-radius: 4px;
}

:deep(.el-input__wrapper) {
  // background: #f8f8f9;
  border-radius: 4px;
}

:deep(.el-input) {
  border: none;
}

:deep(.el-select__wrapper) {
  height: 32px;
  font-size: 14px;
  color: #333333;
  // background: #f8f8f9;
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

// :deep(.el-input__wrapper) {
//   box-shadow: none;
//   background: #f8f8f9;
//   border-radius: 4px;
// }
</style>
