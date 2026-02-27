<!--
 * @Date: 2025-02-19 15:55:00
-->
<template>
  <div>
    <el-dialog
      v-model="visible"
      :show-close="false"
      :width="width"
      :append-to-body="true"
      :align-center="true"
      :before-close="handleClose"
      footer-class="custom-footer"
    >
    <!-- <el-dialog
      v-model="visible"
      :width="width"
      :before-close="handleClose"
      :append-to-body="true"
    > -->
      <!-- <div @click.stop.prevent="bgClick">
        <div class="dialog-content"> -->
          <el-form
            ref="ruleFormRef"
            :model="form"
            label-width="80px"
            :rules="rules"
          >
            <el-form-item label="颜色" prop="color">
              <div class="row dialogFormItemWidth" style="width: 300px">
                <el-input v-model="form.color" placeholder="请输入颜色" clearable />
                <!-- <el-select
                  :style="{ width: '230px' }"
                  v-model="form.color"
                  placeholder="请选择颜色"
                  clearable
                >
                  <el-option-group
                    v-for="group in Object.keys(colorDict)"
                    :value="group"
                    :key="group"
                    :label="group"
                  >
                    <el-option
                      v-for="item in colorDict[`${group}`]"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name"
                    />
                  </el-option-group>
                </el-select>
                <div
                  style="margin-left: 10px; color: #409eff; cursor: pointer"
                  @click="addColorDialog"
                  >新增</div
                > -->
              </div>
            </el-form-item>
            <el-form-item label="图片" prop="colorPic">
              <!-- <div class="row-center"> -->
                <SWUploadFile
                  ref="swUploadFileRef"
                  v-model:modelValue="form.colorList"
                  :onlyUploadImg="true"
                  :width="400"
                  :limit="1"
                />
              <!-- </div> -->
            </el-form-item>
          </el-form>
        <!-- </div>
      </div> -->
      <!-- <template #header="{}">
        <div class="my-header">
          <span>{{ title }}</span>
        </div>
      </template> -->
      <template #header="{ close }">
        <slot name="header" :close="close" :title="title">
          <div class="custom-header">
            <div class="header_txt"> {{ title }}</div>
            <el-icon @click="handleClose" class="header_close">
              <CloseBold />
            </el-icon>
          </div>
        </slot>
      </template>
      <template #footer>
        <div class="contain_btn">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmDialog">保存</el-button>
          <el-button type="primary" @click="continueConfirmDialog">再次提交</el-button>
        </div>
        <!-- <div class="dialog-footer"> -->
          
        <!-- </div> -->
      </template>
    </el-dialog>
    <!-- 新增颜色弹框-->
    <AddColorDialog
      v-if="colorDialogVisible"
      v-model="colorDialogVisible"
      :colorList="Object.keys(colorDict)"
      @confirm="queryColorList"
    />
  </div>
</template>

<script lang="ts" setup>
import { queryDesignProductColor } from '@/api/oa/new/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'
import AddColorDialog from './addColorDialog.vue'

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
    default: '添加颜色'
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
  color: '',
  colorPic: '',
  colorList: []
})

const validateTeamColorPic = (rule: any, value: any, callback: any) => {
  const colors = form.colorList.map((item) => {
    return item.url && item.url
  })
  if (!colors || colors.length === 0) {
    callback(new Error('请上传图片'))
  } else {
    callback()
  }
}
const rules = reactive({
  color: [{ required: true, message: '请输入颜色', trigger: 'blur' }],
  colorPic: { required: true, validator: validateTeamColorPic, trigger: ['blur', 'change'] }
})

const emit = defineEmits(['update:modelValue', 'confirm', 'addColorSuccess'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
    alert(11)
  }
)

const handleClose = () => {
  form.color = ''
  form.colorPic = ''
  emit('update:modelValue', false)
}

const swUploadFileRef = ref()

const bgClick = () => {
  swUploadFileRef.value?.cancelUploadSelect()
}

const ruleFormRef = ref()
const confirmDialog = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      addColorSuccess(true)
    } else {
      return false
    }
  })
}

const continueConfirmDialog = () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      addColorSuccess(false)
      setTimeout(() => {
        form.color = ''
        form.colorPic = ''
        form.colorList = []
      }, 30)
    } else {
      return false
    }
  })
}

// 颜色字典
const colorDict = ref({})
/**
 * 获取颜色列表
 */
const queryColorList = async () => {
  const data = await queryDesignProductColor().catch(() => {})
  colorDict.value = data || {}
  console.log('获取颜色列表', data)
}

if (visible) {
  queryColorList()
}

const colorDialogVisible = ref(false)
const addColorDialog = () => {
  colorDialogVisible.value = true
}

const addColorSuccess = (isCloseDialog: boolean) => {
  const colors = form.colorList.map((item) => {
    return item.url && item.url
  })
  if (colors && colors.length > 0) {
    form.colorPic = colors[0]
  }
  if (form.colorPic) {
    emit('addColorSuccess', `${form.color}_${form.colorPic}`)
    if (isCloseDialog) {
      emit('update:modelValue', false)
    }
  } else {
    ElMessage.warning('请添加图片')
  }
}
</script>

<style scoped lang="scss">
.header_txt {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.header_close,
.header-close {
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 15px;
}

// :deep(.el-dialog) {
//   border-radius: 20px;
// }

.custom-header {
  display: flex;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: solid #f0f0f0 1px;
  margin-left: -15px;
  margin-right: -15px;
  padding-left: 15px;
}

.contain_btn {
  border-top: solid #f0f0f0 1px;
  padding-top: 15px;
  margin-left: -15px;
  margin-right: -15px;
  padding-right: 15px;
}

// .dialogBg {
//   position: absolute;
//   top: -16px;
//   left: -15px;
//   width: 470px;
//   height: 344px;
//   z-index: -1;
// }

// .dialog-footer {
//   text-align: right;
// }

// .my-header {
//   display: flex;
//   align-items: center;
//   margin-bottom: 10px;
//   font-weight: 500;
//   color: #333333;

//   .shenhe-title {
//     width: 14px;
//     height: 14px;
//     margin-right: 20px;
//   }
// }

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
.custom-footer {
  padding-top: 0;
}
</style>
