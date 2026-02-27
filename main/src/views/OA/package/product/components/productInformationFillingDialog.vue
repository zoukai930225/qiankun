<template>
  <SWDialog v-if="visible" v-model="visible" :title="dialogTitle" :width="width" :showTitleLine="true"
    :show-bottom-line="true">
    <div class="dialog-content"
      style="width: 580px; height: auto; padding: 20px; padding-bottom: 0px; box-sizing: border-box">
      <el-form ref="ruleFormRef" :model="form" label-width="auto" style="max-width: 580px" :rules="rules">
        <el-form-item label="货品编码:" prop="productCode">
          <el-input v-model="form.productCode" clearable placeholder="请输入货品编码" :disabled="forbidEdit" />
        </el-form-item>

        <el-form-item label="工艺:" prop="craft">
          <el-input v-model="form.craft" clearable placeholder="请输入工艺" :disabled="forbidEdit" />
        </el-form-item>
        <el-form-item label="材质:" prop="material">
          <el-input v-model="form.material" clearable placeholder="请输入材质" :disabled="forbidEdit" />
        </el-form-item>
        <el-form-item label="规格尺码:" prop="packageSize">
          <el-input v-model="form.packageSize" clearable placeholder="请输入规格尺码" :disabled="forbidEdit" />
        </el-form-item>
        <el-form-item label="条码:" prop="barcode">
          <el-input v-model="form.barcode" clearable placeholder="请输入条码" :disabled="forbidEdit" />
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <s-text-area v-model="form.remark" clearable placeholder="请输入备注" :disabled="forbidEdit" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="confirmDialog" v-if="selectItem.status == 'active'">提交</el-button>
      </div>
    </template>
  </SWDialog>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getProductInfoById, updateSaveReport } from '@/api/oa/package/designGallery/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  forbidEdit: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    required: false
  },

  width: {
    type: String,
    default: '620px'
  },
  designInfo: {
    type: Object,
    default() {
      return {}
    }
  }
})
const dialogTitle = ref('')
const form = ref({
  productCode: undefined,
  craft: undefined,
  material: undefined,
  packageSize: undefined,
  barcode: undefined,
  remark: undefined
})

const selectItem = ref()
const open = async (data: any) => {
  console.log(props.designInfo, '1111', data)

  dialogTitle.value = data.nodeName || ''
  selectItem.value = data || {}
  visible.value = true
  getDesignDetail()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 回显
const getDesignDetail = async () => {
  try {
    const res = await getProductInfoById(props.designInfo.productPlanId)
    form.value = res
  } catch (error) {
    console.log('error', error)
  }
}

const rules = reactive({
  productCode: [{ required: true, message: '请填写货品编码', trigger: 'blur' }]
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}
const ruleFormRef = ref()
const confirmDialog = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        productPlanId: props.designInfo.productPlanId,
        ...form.value
      }
      await updateSaveReport(data)
      message.success('操作成功')
      emit('confirm', data)
      emit('update:modelValue', false)
      handleClose()
    } else {
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.dialog-footer {
  margin-top: 10px;
  margin-right: 20px;
}
</style>
