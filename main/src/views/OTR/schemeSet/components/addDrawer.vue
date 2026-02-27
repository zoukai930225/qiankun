<template>
  <div>
    <el-drawer custom-class="addDrawer" v-model="drawerVisible" :title="dialogTitle" size="958" @close="
      () => {
        notificationRef?.close()
      }
    ">
      <div class="drawerContent">
        <div class="drawerContent-title">
          <div class="drawerContent-title-icon"></div>
          <div>基本信息</div>
        </div>
        <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
          label-width="105px">
          <el-form-item label="方案名称" prop="planTitle">
            <div v-if="formData.isUse === 1 || !isEdit" class="seeBg">
              <div class="seeBg-text">{{ formData.planTitle }}</div>
            </div>
            <el-input v-else class="dialogFormItemWidth" v-model="formData.planTitle" placeholder="请输入方案名称" clearable />
          </el-form-item>
          <el-form-item label="方案描述" prop="planDescription">
            <s-text-area class="dialogFormItemWidth" v-model="formData.planDescription" placeholder="请输入方案描述"
              :autosize="{ minRows: 3, maxRows: 4 }" :disabled="formData.isUse === 1 || !isEdit" />
          </el-form-item>
          <el-form-item label="启用加分项" prop="status">
            <el-switch v-model="formData.bonusPoint" active-value="1" inactive-value="0"
              style="--el-switch-on-color: #0064ff" :disabled="formData.isUse === 1 || !isEdit" />
          </el-form-item>
        </el-form>
      </div>
      <div class="drawerContent" v-for="(value, index) in list" :key="index">
        <div class="drawerContent-title">
          <div class="drawerContent-title-icon"></div>
          <div>评价对象</div>
          <div v-if="isEdit" class="drawerContent-item" @click="deleteClick(index)">
            <img class="drawerContent-item-icon" src="@/assets/imgs/otr/schemeSet/delete_icon.png" alt="" />
          </div>
        </div>
        <el-form class="dialogForm" :model="value" :rules="formRules" label-width="105px">
          <el-form-item label="对象名称" prop="objectName">
            <div class="itemBg">
              <el-input v-model="value.objectName" placeholder="请输入对象名称" clearable
                :disabled="formData.isUse === 1 || !isEdit" />
            </div>
          </el-form-item>
          <el-form-item label="评价维度" prop="evaluationDimensions">
            <div class="evaluateWeidu">
              <WeiduItem class="evaluateWeidu-item" v-for="(item, index1) in value.evaluationDimensions" :data="item"
                :object-index="index" :index="index1" :key="index1" @weidu-edit-action="weiduEditAction"
                @delete-dimension="deleteDimension" :disabled="formData.isUse === 1 || !isEdit" />
              <img v-if="isEdit && value.evaluationDimensions.length < 2" class="evaluateWeidu-add"
                src="@/assets/imgs/otr/schemeSet/add.png" @click="addWeiduClick(index)" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="addMoreBg" v-if="isEdit">
        <div class="addMore" @click="addMoreClick">
          <el-icon class="addMore-icon" color="#0064ff" :size="12">
            <Plus />
          </el-icon>
          <div class="addMore-text">点击添加</div>
        </div>
      </div>

      <div class="drawerFooter">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="editForm" v-if="formType === 'view'">编 辑</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm" v-else>提 交</el-button>
      </div>
    </el-drawer>
    <AddWeiduDialog ref="addWeiduDialogRef" @add-weidu-success="addWeiduSuccess"
      @edit-weidu-success="editWeiduSuccess" />
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import WeiduItem from './weiduItem.vue'
import AddWeiduDialog from './addWeiduDialog.vue'
import { strIsOnlySpaces } from '@/utils/index'
const message = useMessage() // 消息弹窗
import { ElNotification } from 'element-plus'
const drawerVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const addWeiduDialogRef = ref()
import * as OtrSchemeSetApi from '@/api/otr/schemeSet/index'

const formData = ref({
  id: '',
  isUse: 0,
  activityTitle: '',
  planTitle: '',
  planDescription: '',
  bonusPoint: '0' // 1-启用,0-未启用
})

// 评价对象列表
const list = ref<any>([])

const formRef = ref() // 表单 Ref

const formRules = reactive({
  planTitle: [{ required: true, message: '方案名称不能为空', whitespace: true, trigger: 'blur' }],
  objectName: [{ required: true, message: '对象名称不能为空', whitespace: true, trigger: 'blur' }],
  evaluationDimensions: [{ required: true, message: '评价维度不能为空', trigger: 'blur' }]
})

// 是否可编辑
const isEdit = ref(false)

/** 打开弹窗 */
const open = async (type?: string, id?: string) => {
  drawerVisible.value = true
  dialogTitle.value =
    type === 'create'
      ? '新增'
      : type === 'update'
        ? '编辑'
        : type === 'view'
          ? '查看'
          : type === 'copy'
            ? '复制'
            : ''
  formType.value = type || ''
  isEdit.value = formType.value !== 'view'
  resetForm()
  list.value = []
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await OtrSchemeSetApi.getDataById(id).catch(() => {
        formLoading.value = false
      })
      if (data) {
        formData.value = data
        formData.value.bonusPoint = `${formData.value.bonusPoint}`
        list.value = data.evaluationObjects || []
      }

      // 复制 充值数据 方案名称
      if (formType.value === 'copy') {
        formData.value.planTitle = formData.value.planTitle + '-复制'
        formData.value.isUse = 0
        formData.value.id = ''
        formData.value.bonusPoint = '0'
      }
    } finally {
      formLoading.value = false
    }
  }
}

// 编辑
const notificationRef = ref()
const editForm = () => {
  notificationRef.value?.close()
  // isUse
  if (formData.value.isUse) {
    notificationRef.value = ElNotification({
      message:
        '当前方案存在关联活动，请先删除关联的活动或在对应的活动中移除该方案后，即可进行编辑！',
      showClose: false,
      offset: 300,
      customClass: 'activity-Notification'
    })
  } else {
    dialogTitle.value = '编辑'
    formType.value = 'edit'
    isEdit.value = true
  }
}

// 点击添加
const addMoreClick = () => {
  if (formData.value.isUse === 1) {
    return
  }
  list.value.push({
    id: '',
    objectName: '',
    evaluationDimensions: []
  })
}
// 删除按钮点击
const deleteClick = (index) => {
  list.value.splice(index, 1)
}

// 添加维度按钮点击
const addWeiduClick = (index) => {
  if (formData.value.isUse === 1) {
    return
  }
  let selectedDimensions = [] as any
  let selectedEvaluationWay = null
  if (index < list.value.length) {
    list.value[index].evaluationDimensions &&
      list.value[index].evaluationDimensions.forEach((item) => {
        if (item.dimension) {
          selectedDimensions.push(item.dimension)
          selectedEvaluationWay = Number(item.evaluationWay)
        }
      })
  }
  addWeiduDialogRef.value?.open(index, 0, null, selectedDimensions, selectedEvaluationWay)
}

// 删除技能
const deleteDimension = (objectIndex: number, index: number) => {
  if (objectIndex < list.value.length) {
    if (index < list.value[objectIndex].evaluationDimensions.length) {
      list.value[objectIndex].evaluationDimensions.splice(index, 1)
    }
  }
}

// 编辑技能
const weiduEditAction = (objectIndex: number, index: number) => {
  // if(!isEdit.value) return;
  if (objectIndex < list.value.length) {
    if (index < list.value[objectIndex].evaluationDimensions.length) {
      addWeiduDialogRef.value?.open(
        objectIndex,
        index,
        list.value[objectIndex].evaluationDimensions[index],
        [],
        formData.value.isUse === 1 ? true : false
      )
    }
  }
}

// 添加维度成功
const addWeiduSuccess = (data: any, index: number) => {
  if (index < list.value.length) {
    list.value[index].evaluationDimensions.push(data)
  }
}

// 编辑维度成功
const editWeiduSuccess = (data: any, index: number, itemIndex: number) => {
  if (index < list.value.length) {
    if (itemIndex < list.value[index].evaluationDimensions.length) {
      list.value[index].evaluationDimensions[itemIndex] = data
    }
  }
}

const validInputParam = () => {
  let valid = true
  list.value.forEach((item) => {
    if (!item.objectName || (item.objectName && strIsOnlySpaces(item.objectName))) {
      valid = false
    }
  })
  return valid
}

const submitForm = async () => {
  if (formData.value.isUse === 1) {
    return
  }
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  if (!validInputParam()) return

  // 校验 每个评价对象的维度是否是两个
  const errors = []
  list.value.forEach((item) => {
    if (item.evaluationDimensions.length < 2) {
      // 当前评价对象的维度小于两个
      errors.push(`${item.objectName}的评价维度必须是两个`)
    }
  })
  if (errors.length) {
    return ElNotification({
      title: '',
      message: '盘点方案的评价维度必须是两种!请检查后重新设置！',
      type: 'error'
    })
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      id: formData.value.id,
      planTitle: formData.value.planTitle,
      planDescription: formData.value.planDescription,
      bonusPoint: Number(formData.value.bonusPoint),
      evaluationObjects: list.value || []
    }
    if (formType.value === 'create' || formType.value === 'copy') {
      data.id = ''
      await OtrSchemeSetApi.addOrUpdateData(data)
      message.success('新增成功')
    } else {
      await OtrSchemeSetApi.addOrUpdateData(data)
      message.success('修改成功')
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
  formData.value = {
    id: '',
    isUse: 0,
    activityTitle: '',
    planTitle: '',
    planDescription: '',
    bonusPoint: '0' // 1-启用,0-未启用
  }
  formRef.value?.resetFields()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
</script>

<style lang="scss">
.activity-Notification {
  width: 400px;
  right: 240px !important;
  background: #666;

  .el-notification__content {
    color: #fff;
  }
}
</style>
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

  &-item {
    margin-left: auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

    &-item {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &-icon {
      width: 14px;
      height: 14px;
    }
  }

  .itemBg {
    width: 100%;
    height: 32px;
    // background-image: url(@/assets/imgs/common/input_disabled_cover.png);
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

  .seeBg {
    width: 100%;
    height: 32px;
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

  .evaluateWeidu {
    display: flex;
    flex-direction: row;
    align-items: center;

    &-add {
      width: 16px;
      height: 16px;
      cursor: pointer;
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

.addMoreBg {
  width: calc(100%);
  display: flex;
  flex-direction: column;
  align-items: center;

  .addMore {
    cursor: pointer;
    width: 116px;
    height: 36px;
    border-radius: 4px;
    border: 1px solid #0064ff;
    display: flex;
    flex-direction: row;
    align-items: center;

    &-icon {
      margin-left: 20px;
      margin-right: 6px;
    }

    &-text {
      font-size: 14px;
      color: #0064ff;
      line-height: 20px;
    }
  }
}

:deep(.el-textarea__inner),
:deep(.el-input__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
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
