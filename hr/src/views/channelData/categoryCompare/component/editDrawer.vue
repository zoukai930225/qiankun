<template>
  <div>
    <el-drawer custom-class="editDrawer" v-model="drawerVisible" :title="dialogTitle" size="968">
      <div class="drawerContent">
        <div class="drawerContent-title">
          <div class="drawerContent-title-icon"></div>
          <div>品类：{{ editCategoryName }}</div>
        </div>
        <el-form class="dialogForm" :model="formData" label-width="105px">
          <el-form-item label="昨日复盘" prop="yestory">
            <div class="inputBg">
              <Editor height="200px" v-model:modelValue="formData.yesterdayReview" />
            </div>
          </el-form-item>
          <el-form-item label="今日操作" prop="today">
            <div class="inputBg">
              <Editor height="200px" v-model:modelValue="formData.todayOperation" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="drawerFooter">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '提交' : '提交' }}</el-button
        >
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
const message = useMessage() // 消息弹窗
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
import type { FormInstance } from 'element-plus'
import * as ChannelDataApi from '@/api/channelData'
const editCategoryName = ref('')

const formData = ref({
  id: '',
  yesterdayReview: '',
  todayOperation: '',
  remarksDate: '',
  category: '',
  type: ''
})

/** 打开弹窗 */
const open = async (
  id: string,
  remarksDate: string,
  category: string,
  yesterdayReview: string,
  todayOperation: string,
  categoryName: string,
  store: string
) => {
  drawerVisible.value = true
  dialogTitle.value = '编辑'
  resetForm()
  editCategoryName.value = categoryName || ''
  formData.value.id = id
  formData.value.remarksDate = remarksDate
  formData.value.category = category
  formData.value.yesterdayReview = yesterdayReview
  formData.value.todayOperation = todayOperation

  const typeMap = {
    swTaobao: '1',
    swTmall: '2'
  }

  const type = typeMap[store] || '1'
  formData.value.type = type //1:淘宝 2:天猫 3：拼多多
}

const submitForm = async () => {
  // 提交请求
  formLoading.value = true
  try {
    if (formData.value.id) {
      await ChannelDataApi.categoryDataRemarksUpdate(formData.value)
      message.success('更新成功')
    } else {
      await ChannelDataApi.categoryDataRemarksCreate([formData.value])
      message.success('新增成功')
    }

    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const formRef = ref<FormInstance | null>(null)

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    yesterdayReview: '',
    todayOperation: '',
    remarksDate: '',
    category: '',
    type: ''
  }
  formRef.value?.resetFields()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss" scoped>
.drawerTitle {
  font-family: AlibabaPuHuiTi_2_75_SemiBold;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 600;
  margin: 0 0 18px 0;
}
.drawerContent {
  width: 100%;
  padding: 16px 20px 1px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 16px;
  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
  }
  .drawerContent-title-icon {
    width: 3px;
    height: 10px;
    background: #0064ff;
    margin-right: 6px;
  }
  &-store {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    &-icon {
      width: 14px;
      height: 14px;
      margin-right: 12px;
    }
    &-link {
      font-size: 14px;
      color: #0064ff;
      line-height: 20px;
    }
  }
  .inputBg {
    width: 100%;
    background: #f8f8f9;
    border-radius: 4px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    box-sizing: border-box;
    &-text {
      font-size: 14px;
      color: #333333;
      line-height: 20px;
      padding-left: 16px;
      line-height: 32px;
    }
  }
}
.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
.dialogFormItemWidth {
  width: 100%;
}
:deep(.el-drawer__header) {
  margin-bottom: 0px;
}
:deep(.el-drawer__title) {
  font-size: 14px;
  color: #333333;
  line-height: 20px;
  font-weight: 500;
}

:deep(.el-drawer) {
  border-radius: 12px 0px 0px 0px;
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}
:deep(.el-drawer__body) {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
}
:deep(.el-input__wrapper) {
  background: transparent;
  border-radius: 4px;
  box-shadow: none;
}
:deep(.el-table .cell) {
  margin-left: 5px;
}

:deep(.el-table) {
  --el-table-row-hover-bg-color: transparent;
}
</style>
