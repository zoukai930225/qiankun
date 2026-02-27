<template>
  <div>
    <Dialog style="width: 1300px" :modal-append-to-body="false" v-model="dialogVisible" :title="dialogTitle">
      <div class="maniContent">
        <div class="maniContent-left">
          <DepartmentPersonnelSelection :showBottomBtn="false" ref="departmentPersonnelSelectionRef"
            @select-people="selectDepartmentPeople" :departId="departId" :list="displayList" :isFeedBack="false"
            @cancle="dialogVisible = false" :isComment="true" />
        </div>
        <div class="maniContent-center">
          <img v-if="selectDeptPersonList.length > 0" class="img" src="@/assets/imgs/customerService/addMember_hl.png"
            alt="" @click="addMemberClick" />
          <img v-else class="img" src="@/assets/imgs/customerService/addMember_normal.png" alt="" />
        </div>
        <div class="maniContent-right">
          <ElScrollbar class="mainContent">
            <div class="item" v-for="(value, index) in selectPersonList" :key="index">
              <CustomerServicePeople class="item-userInfo2" :data="value" />
              <!-- <div class="item-per">
                  <el-input v-model="value.percentage" @input="(val)=>handleInput(val,value.userId)" placeholder="请输入"/>
                  <span>%</span>
              </div> -->
              <el-button class="item-delete" type="danger" :icon="Delete" @click="deletePersonInfo(index, value.userId)"
                link>
                删除
              </el-button>
              <!-- <div  @click="deletePersonInfo(index, value.userId)">
                <div class="item-delete-item">删除 </div>
              </div> -->
            </div>
          </ElScrollbar>
        </div>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { Delete } from '@element-plus/icons-vue'
import DepartmentPersonnelSelection from '@/components/DepartmentPersonnelSelection/index.vue'
import CustomerServicePeople from '@/views/customerService/components/people.vue'

const message = useMessage()
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRef = ref() // 表单 Ref

const departmentPersonnelSelectionRef = ref() // 部门人员选择组件 Ref
const departId = ref('') // 部门id
const displayList = ref<any[]>([]) // 部门人员列表
const selectPersonList = ref<any[]>([]) // 已选择的人员列表
const selectDeptPersonList = ref<any[]>([])

/** 打开弹窗 */
const open = async (list?: []) => {
  dialogVisible.value = true
  dialogTitle.value = '添加专员'
  resetForm()
  selectPersonList.value = list || []
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (selectPersonList.value.length === 0) {
    message.warning('请选择专员')
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

  console.log('选择', selectDeptPersonList.value)
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
  console.log('选择的人员 添加按钮:', selectDeptPersonList.value, selectPersonList.value)
}

const editLeaderDialogRef = ref()
const editPersonInfo = (row) => {
  editLeaderDialogRef.value?.open(row)
}
const deletePersonInfo = (index, userId) => {
  handleUserDelete(userId)
  selectPersonList.value.splice(index, 1)
}

// 定义一个处理输入的方法 限制输入100以内的正整数
const handleInput = (val: String, id: Number) => {
  const index = selectDeptPersonList.value.findIndex((item) => item.userId === id)
  // 过滤掉非数字字符
  let num: string | number = val.replace(/\D/g, '')
  // 如果输入不为空，将其转换为整数
  if (num) {
    num = parseInt(num, 10)
    // 检查数字是否超过 100，如果超过则限制为 100
    if (num > 100) {
      num = 100
    }
    // 将处理后的值重新赋值给输入框
    selectDeptPersonList.value[index].percentage = num.toString()
  } else {
    // 如果输入为空，直接赋值为空字符串
    selectDeptPersonList.value[index].percentage = ''
  }
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

        &-per {
          display: flex;

          span {
            align-self: center;
            margin-left: 4px;
          }
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
:deep(.com-dialog .el-dialog__body) {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

:deep(.com-dialog .el-dialog__header) {
  border-bottom: none;
  font-weight: 500;
  font-size: 16px;
  color: #333333;
  line-height: 22px;
}
</style>
