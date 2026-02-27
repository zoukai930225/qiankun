<template>
  <div>
    <Dialog
      style="width: 1300px"
      :modal-append-to-body="false"
      v-model="dialogVisible"
      :title="dialogTitle"
    >
      <div class="maniContent">
        <div class="maniContent-left">
          <DepartmentPersonnelSelection
            :showBottomBtn="false"
            ref="departmentPersonnelSelectionRef"
            @select-people="selectDepartmentPeople"
            :departId="departId"
            :list="displayList"
            :isFeedBack="false"
            @cancle="dialogVisible = false"
          />
        </div>
        <div class="maniContent-center">
          <img
            v-if="selectDeptPersonList.length > 0"
            class="img"
            src="@/assets/imgs/customerService/addMember_hl.png"
            alt=""
            @click="addMemberClick"
          />
          <img v-else class="img" src="@/assets/imgs/customerService/addMember_normal.png" alt="" />
        </div>
        <div class="maniContent-right">
          <ElScrollbar class="mainContent">
            <div class="item" v-for="(value, index) in selectPersonList" :key="index">
              <CustomerServicePeople class="item-userInfo2" :data="value" />
              <el-tooltip
                effect="dark"
                :content="value.customerNickName ? value.customerNickName : `客服${value.name}`"
                placement="top"
              >
                <div class="item-leader text1">
                  {{ value.customerNickName ? value.customerNickName : `客服${value.name}` }}
                </div>
              </el-tooltip>

              <img
                v-if="value.isLeader"
                class="item-star"
                src="@/assets/imgs/customerService/leader_star.png"
              />
              <div v-else class="item-star"></div>
              <div class="item-edit" @click="editPersonInfo(value)">
                <div class="item-edit-item">编辑 </div>
              </div>
              <div class="item-delete" @click="deletePersonInfo(index, value.userId)">
                <div class="item-delete-item">删除 </div>
              </div>
            </div>
          </ElScrollbar>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      </template>
    </Dialog>
    <EditLeaderDialog ref="editLeaderDialogRef" @success="editLeaderSuccess" />
  </div>
</template>
<script lang="ts" setup>
import DepartmentPersonnelSelection from '@/components/DepartmentPersonnelSelection/index.vue'
import CustomerServicePeople from '@/views/customerService/components/people.vue'
import EditLeaderDialog from './editLeaderDialog.vue'

const message = useMessage()
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRef = ref() // 表单 Ref

const departmentPersonnelSelectionRef = ref() // 部门人员选择组件 Ref
const departId = ref('') // 部门id
const displayList = ref([]) // 部门人员列表
const selectPersonList = ref([]) // 已选择的人员列表
const selectDeptPersonList = ref([])

/** 打开弹窗 */
const open = async (list?: []) => {
  dialogVisible.value = true
  dialogTitle.value = '添加组员'
  resetForm()
  selectPersonList.value = list || []
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (selectPersonList.value.length === 0) {
    message.warning('请选择组员')
    return
  }
  try {
    emit('success', selectPersonList.value)
    dialogVisible.value = false
  } finally {
    formLoading.value = false
  }
}
// 删除接受人
const handleUserDelete = (userId) => {
  console.log('删除的用户：', userId)
  displayList.value = displayList.value.filter((item) => item !== userId)
  selectDeptPersonList.value = selectDeptPersonList.value.filter((item) => item.userId !== userId)
  departmentPersonnelSelectionRef.value.handleSelectTableValue(selectDeptPersonList.value)
}

// 选择部门人员
const selectDepartmentPeople = (data) => {
  console.log('-=-=', data)

  selectDeptPersonList.value = data.list || []

  console.log('大家分手快乐jlk', selectDeptPersonList.value)
  // 处理回显的人员列表
  displayList.value = selectPersonList.value.map((item) => item && item.userId)
  // 处理回显的部门id
  departId.value = data.departId
}

// 添加组员按钮点击事件
const addMemberClick = () => {
  selectDeptPersonList.value.forEach((item) => {
    if (!selectPersonList.value.some((item1) => item1.userId === item.userId)) {
      selectPersonList.value.push(item)
    }
  })
  console.log('选择的人员:', selectDeptPersonList.value, selectPersonList.value)
}

const editLeaderDialogRef = ref()
const editPersonInfo = (row) => {
  editLeaderDialogRef.value?.open(row)
}
const deletePersonInfo = (index, userId) => {
  handleUserDelete(userId)
  selectPersonList.value.splice(index, 1)
}

// 编辑leader成功
const editLeaderSuccess = (data) => {
  selectPersonList.value.forEach((item) => {
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

/** 重置表单 */
const resetForm = () => {
  departId.value = ''
  displayList.value = []
  selectPersonList.value = []
  selectDeptPersonList.value = []
  formRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.maniContent {
  display: flex;
  flex-direction: row;
  &-left {
    width: 700px;
  }
  &-center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    width: 92px;
    .img {
      margin-left: 20px;
      width: 53px;
      height: 32px;
    }
  }
  &-right {
    width: 424px;
    height: 384px;
    background: #ffffff;
    border-radius: 10px;
    border: 1px solid #dcdfe6;
    .mainContent {
      margin: 30px;
      margin-top: 20px;
      margin-right: 0px;
      height: 359px;
      .item {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: 40px;
        &-userInfo2 {
          width: 90px;
        }

        &-leader {
          width: 105px;
        }
        &-star {
          margin-left: 20px;
          // margin-right: 20px;
          width: 12px;
          height: 14px;
        }
        &-edit {
          width: 84px;
          margin-left: auto;
          &-item {
            cursor: pointer;
            margin-left: 30px;
            width: 48px;
            height: 25px;
            background: #ffeaea;
            border-radius: 13px;
            font-size: 12px;
            color: #eb3737;
            line-height: 25px;
            text-align: center;
          }
        }

        &-delete {
          // width: 84px;
          margin-left: auto;
          margin-right: 20px;
          &-item {
            cursor: pointer;

            width: 48px;
            height: 25px;
            background: #ffeaea;
            border-radius: 13px;
            font-size: 12px;
            color: #eb3737;
            line-height: 25px;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>

<style scoped>
:deep(.el-dialog) {
  /* background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important; */
  /* box-shadow: 10px 10px 24px 0px rgba(0, 0, 0, 0.07); */
  /* background: linear-gradient(225deg, #f2f3ff 0%, #ffffff 39%, #ffffff 88%, #f0f8ff 100%); */
}
:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
  /* min-height: 50vh; */
  /* max-height: 70vh; */
}
:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
/* :deep(.CommonSearchForm) {
  border-bottom: none;
} */
</style>
