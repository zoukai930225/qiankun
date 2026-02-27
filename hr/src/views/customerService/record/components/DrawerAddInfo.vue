<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      :before-close="
        (done) => {
          resetForm()
          done()
        }
      "
      class="drawer"
      size="968"
      @close="reset"
    >
      <div class="row-center topView">
        <div class="drawerTitle">{{ drawerTitle }}</div>
        <img src="@/assets/imgs/system/fieldManageConfig/close.png" class="close" @click="reset" />
      </div>
      <div class="drawerContent">
        <el-form
          class="dialogForm"
          ref="formRef"
          v-loading="formLoading"
          :model="formData"
          :rules="formRules"
          label-width="100px"
        >
          <el-form-item label="店铺" prop="store">
            <StoreRangePlus v-model="formData.store" width="100%" />
          </el-form-item>
          <el-form-item label="小组名称" prop="groupName">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.groupName"
              placeholder="请输入小组名称"
            />
          </el-form-item>
          <el-form-item label="类别" prop="groupCategory">
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.groupCategory"
              placeholder="请选择类别"
              clearable
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.CUSTOMER_CATEGORY, true)"
                :key="dict.code"
                :label="dict.label"
                :value="dict.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否二线" prop="isSecond">
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.isSecond"
              placeholder="请选择是否二线"
              clearable
            >
              <el-option label="是" :value="'1'" />
              <el-option label="否" :value="'0'" />
            </el-select>
          </el-form-item>
          <el-form-item label="组员" prop="teamDetailList">
            <div class="groupMemberBg">
              <div class="groupMemberBg-content">
                <peopleItem
                  class="groupMemberBg-content-item"
                  v-for="(item, index) in formData.teamDetailList"
                  :key="index"
                  :data="item"
                  :index="index"
                  @edit-person-info="editPersonInfo"
                  @delete-person-info="deletePersonInfo"
                />
              </div>
              <div
                v-if="formData.teamDetailList && formData.teamDetailList.length > 0"
                class="line"
              ></div>
              <div class="addMember" @click="addGroupMember">
                <img class="addIcon" src="@/assets/imgs/customerService/add.png" />
                <div class="addMemberText">添加组员</div>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
          <el-button @click="drawerVisible = false">取 消</el-button>
          <el-button :disabled="formLoading" type="primary" @click="submitForm">
            {{ formType === 'create' ? '保 存' : '提 交' }}</el-button
          >
        </div>
      </div>
    </el-drawer>
    <AddPeopleDialog ref="addPeopleDialogRef" @success="addGroupMemberSuccess" />
    <EditLeaderDialog ref="editLeaderDialogRef" @success="editLeaderSuccess" />
  </div>
</template>
<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'

import AddPeopleDialog from './addPeopleDialog.vue'
import EditLeaderDialog from './editLeaderDialog.vue'
import PeopleItem from './peopleItem.vue'

import * as CustomerServiceRecordApi from '@/api/customerService/record'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  store: undefined,
  groupName: undefined,
  groupCategory: undefined,
  isSecond: '0',
  teamDetailList: []
})

// 校验店铺

// const validateStore = (rule: any, value: any, callback: any) => {
//   if ((value === '' || value === null || value === undefined) && !searchStoreName.value) {
//     callback(new Error('请选择店铺'))
//   } else {
//     callback()
//   }
// }
const validateTeamDetailList = (rule: any, value: any, callback: any) => {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    formData.value.teamDetailList.length === 0
  ) {
    callback(new Error('请添加组员'))
  } else {
    callback()
  }
}

const formRules = reactive({
  store: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
  groupName: [{ required: true, message: '小组名称不能为空', trigger: 'blur' }],
  groupCategory: [{ required: true, message: '请选择类别', trigger: 'blur' }],
  isSecond: [{ required: true, message: '请选择是否二线', trigger: 'blur' }],
  teamDetailList: [
    { required: true, validator: validateTeamDetailList, trigger: ['blur', 'change'] }
  ]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  console.log('---', type, id)
  drawerVisible.value = true
  drawerTitle.value =
    type === 'create' ? '新增' : type === 'update' ? '编辑' : type === 'view' ? '查看' : ''
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await CustomerServiceRecordApi.getDetailById(id)
      if (data) {
        formData.value = data || {}
        searchStoreName.value = data.storeName || '全渠道'
        formData.value.isSecond = data.isSecond || '0'
      }
    } finally {
      formLoading.value = false
    }
  }
}

// 店铺选择--打开弹窗
const searchStoreName = ref('')

const addPeopleDialogRef = ref()

// 添加组员
const addGroupMember = () => {
  console.log('addGroupMember')
  addPeopleDialogRef.value.open()
}

// 添加组员成功
const addGroupMemberSuccess = (list: any) => {
  if (formData.value.teamDetailList.length === 0) {
    formData.value.teamDetailList = list || []
  } else {
    const filterList = []
    let newListLeaderUserId = ''
    list.forEach((item) => {
      if (item.isLeader) {
        newListLeaderUserId = item.userId || ''
      }
      const user = formData.value.teamDetailList.find((item1) => item1.userId === item.userId)
      if (!user) {
        filterList.push(item)
      }
    })

    formData.value.teamDetailList = [...formData.value.teamDetailList, ...filterList]
    if (newListLeaderUserId) {
      formData.value.teamDetailList.forEach((item) => {
        if (item.userId === newListLeaderUserId) {
          item.isLeader = 1
        } else {
          item.isLeader = 0
        }
      })
    }
  }
}

const editLeaderDialogRef = ref()
// 编辑成功
const editPersonInfo = (data) => {
  editLeaderDialogRef.value?.open(data)
}

// 编辑个人信息成功
const editLeaderSuccess = (data) => {
  formData.value.teamDetailList.forEach((item) => {
    if (item.userId === data.userId) {
      item.isLeader = data.isLeader
      item.customerNickName = data.customerNickName || ''
    } else {
      if (data.isLeader) {
        item.isLeader = 0
      }
    }
  })
}
// 删除组员
const deletePersonInfo = (index: number) => {
  if (index < formData.value.teamDetailList.length) {
    formData.value.teamDetailList.splice(index, 1)
  }
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
    const submitData = {
      id: data.id,
      store: data.store,
      groupName: data.groupName,
      groupCategory: data.groupCategory,
      isSecond: data.isSecond,
      teamDetailList: data.teamDetailList.map((item) => ({
        userId: item.userId,
        customerNickName: item.customerNickName || '',
        isLeader: `${item.isLeader || '0'}`
      }))
    }
    if (formType.value === 'create') {
      data.id = undefined
      await CustomerServiceRecordApi.addCustomerGroup(submitData)
      message.success(t('common.createSuccess'))
    } else {
      console.log('倒计时付了款', submitData)
      await CustomerServiceRecordApi.updateCustomerGroup(submitData)
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
  formData.value = {
    id: undefined,
    store: undefined,
    groupName: undefined,
    groupCategory: undefined,
    teamDetailList: [],
    isSecond: '0'
  }
  searchStoreName.value = ''
  formRef.value?.resetFields()
}

const reset = () => {
  drawerVisible.value = false
}
</script>

<style lang="less" scoped>
// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
.topView {
  display: flex;
  flex-direction: row;
  align-content: center;
  .drawerTitle {
    font-family: AlibabaPuHuiTi_2_75_SemiBold;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    font-weight: 600;
    margin: 0 0 18px 0;
  }
  .close {
    margin-bottom: 10px;
    margin-left: auto;
    width: 23px;
    height: 23px;
    cursor: pointer;
  }
}

.drawerContent {
  width: 100%;
  padding: 20px 20px 1px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 20px;
  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .groupMemberBg {
    width: 811px;
    // min-height: 305px;
    background: #f8f8f9;
    border-radius: 4px;
    &-content {
      width: 808px;
      min-height: 40px;
      display: flex;
      flex-wrap: wrap;
      &-item {
        width: 388px;
        height: 40px;
      }
    }
    .line {
      margin-left: 48px;
      margin-right: 20px;
      margin-top: 10px;
      margin-bottom: 16px;
      // height: 1px;
      border: 1px dashed rgba(151, 151, 151, 0.27);
    }
    .addMember {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 14px;
      color: #0064ff;
      line-height: 20px;
      cursor: pointer;
      margin-bottom: 16px;
      .addIcon {
        margin-left: auto;
        width: 12px;
        height: 12px;
      }
      .addMemberText {
        padding-left: 12px;
        margin-right: auto;
      }
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
</style>
