<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer" size="482"
      :close-on-click-modal="!formLoading">
      <div class="drawerTitle">
        <div>{{ formType === 'create' ? '新增' : '编辑' }}</div>
        <div @click="drawerVisible = false">
          <img src="@/assets/imgs/team/close_drawer.svg" alt="" />
        </div>
      </div>
      <div class="drawerContent">
        <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
          label-width="80px">
          <!-- 图片上传 -->
          <el-form-item label="图片" prop="image">
            <uploadImg v-model:modelValue="formData.image" width="104px" height="104px" borderradius="2px" :limit="1" />
          </el-form-item>
          <el-form-item label="一级分类" prop="firstLevelType">
            <el-select class="dialogFormItemWidth" v-model="formData.firstLevelType" placeholder="请选择" clearable
              @change="handleFirsLevelTypeChange">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SHOOTING_CLOTHING_WAREHOUSE, true)"
                :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类" prop="secondLevelType">
            <el-select class="dialogFormItemWidth" v-model="formData.secondLevelType" placeholder="请选择" clearable>
              <el-option v-for="dict in secondLevelOptions" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="尺码" prop="size">
            <el-select class="dialogFormItemWidth" v-model="formData.size" placeholder="请选择" clearable>
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SHOOTING_CLOTHING_WAREHOUSE_SIZE, true)"
                :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="notes">
            <s-text-area class="dialogFormItemWidth" v-model="formData.notes" placeholder="请输入备注" :rows="5"
              resize="none" />
          </el-form-item>
        </el-form>
      </div>
      <div class="drawerFooter">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm"> 保 存</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddDrawer' })
import STextArea from "@/components/common/input/s-textarea.vue";
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as ClothesLibraryApi from '@/api/team/clothesLibrary'
import uploadImg from './uploadImg.vue'
import { useUserStore } from '@/store/modules/user'
import { ref } from 'vue'
const userStore = useUserStore()
const drawerVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const formType = ref('') // 表单类型：create、update
import type { FormInstance } from 'element-plus'
const formRef = ref<FormInstance | null>(null)
/** 打开弹窗 */
const open = async (type: string, id: string) => {
  drawerVisible.value = true
  formLoading.value = true
  formType.value = type
  resetFormData()
  try {
    if (id) {
      const data = await ClothesLibraryApi.getClothesLibraryDetail(id)
      formData.value = Object.assign(formData.value, data)
      initSecondLevel()
    }
  } finally {
    formLoading.value = false
  }
}
const formData = ref({
  id: '',
  firstLevelType: '',
  secondLevelType: '',
  size: '',
  notes: '',
  image: '',
  uploader: ''
})

const resetFormData = () => {
  formData.value = {
    id: '',
    firstLevelType: '',
    secondLevelType: '',
    size: '',
    image: '',
    uploader: '',
    notes: ''
  }
  formRef.value?.resetFields()
}

// 初始化二级分类选项
const initSecondLevel = () => {
  const selectedFirstLevel = formData.value.firstLevelType

  if (!selectedFirstLevel) {
    secondLevelOptions.value = []
    return
  }

  secondLevelOptions.value = getIntDictOptions(selectedFirstLevel, true)
}

// 一级分类变化
const secondLevelOptions = ref<any>([])
const handleFirsLevelTypeChange = (value) => {
  formData.value.secondLevelType = ''
  secondLevelOptions.value = []
  if (!value) return
  secondLevelOptions.value = getIntDictOptions(value, true)
}

const formRules = reactive({
  image: [{ required: true, message: '请上传图片', trigger: 'change' }],
  firstLevelType: [{ required: true, message: '请选择一级分类', trigger: 'change' }],
  secondLevelType: [{ required: true, message: '请选择二级分类', trigger: 'change' }]
})

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as any
    const submitData = {
      id: data.id,
      image: data.image,
      firstLevelType: data.firstLevelType,
      secondLevelType: data.secondLevelType,
      size: data.size,
      notes: data.notes,
      uploader: userStore.user.userNo
    }

    if (formType.value === 'create') {
      submitData.id = undefined
      await ClothesLibraryApi.addOrUpdateClothesLibrary(submitData)
      message.success(t('common.createSuccess'))
    } else {
      await ClothesLibraryApi.addOrUpdateClothesLibrary(submitData)
      message.success(t('common.updateSuccess'))
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
// 背景颜色
:deep(.el-drawer__body) {
  background-color: #f8f8f9 !important;
  padding: 0 !important;
  border-radius: 8px 0px 0px 8px !important;
}

.drawerTitle {
  font-size: 16px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  height: 54px;
  padding: 0 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
}

.drawerContent {
  width: 442px;
  margin: 20px auto 0;

  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 52px;
  padding: 0 20px;
  box-sizing: border-box;
  border-radius: 0px 0px 8px 8px;
  background: #ffffff;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
}
</style>
