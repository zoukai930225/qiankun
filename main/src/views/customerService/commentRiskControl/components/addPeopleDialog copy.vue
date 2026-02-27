<template>
  <div>
    <Dialog
      style="width: 1300px"
      :modal-append-to-body="false"
      v-model="dialogVisible"
      :title="dialogTitle"
    >
      <div class="content">
        <div class="content-form">
          <el-form :inline="true" :model="queryForm">
            <el-form-item label="部门">
              <el-input v-model="queryForm.department" placeholder="请输入部门" clearable />
            </el-form-item>
            <el-form-item label="关键字">
              <el-input v-model="queryForm.keyword" placeholder="请输入关键字" clearable />
            </el-form-item>
          </el-form>
        </div>
        <div class="content-transfer">
          <div class="left">
            <el-table
              ref="sortTableRef"
              :header-cell-style="appStore.headerCellStyle"
              v-loading="loading"
              :data="personList"
              row-class-name="commonTableRow"
              class="SWCommonTable"
              v-horizontal-scroll="'always'"
              @selection-change="handleSelectionChange"
              :row-key="(row) => row.userId"
            >
              <el-table-column type="selection" width="55" />
              <el-table-column label="部门" prop="department">
                <template #default="scope">
                  {{ scope.row.department || '-' }}
                </template>
              </el-table-column>
              <el-table-column label="手机号" prop="mobile">
                <template #default="scope">
                  {{ scope.row.mobile || '-' }}
                </template>
              </el-table-column>
              <el-table-column label="姓名" prop="name">
                <template #default="scope">
                  <span v-html="formarName(scope.row.name)"> </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="center">
            <img
              v-if="selectDeptPersonList.length > 0"
              class="img"
              src="@/assets/imgs/customerService/addMember_hl.png"
              alt=""
              @click="addMemberClick"
            />
            <img
              v-else
              class="img"
              src="@/assets/imgs/customerService/addMember_normal.png"
              alt=""
            />
          </div>
          <div class="right">
            <ElScrollbar class="right-table">
              <div class="item" v-for="(value, index) in selectPersonList" :key="value.userId">
                <CustomerServicePeople class="item-userInfo" :data="value" />
                <div class="item-per">
                  <el-input
                    v-model="value.percentage"
                    @input="(val) => handleInput(val, value.userId)"
                    placeholder="请输入"
                  />
                  <span>%</span>
                </div>
                <div class="item-delete" @click="deletePersonInfo(index, value.userId)">
                  <div class="item-delete-item">删除 </div>
                </div>
              </div>
            </ElScrollbar>
          </div>
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
import CustomerServicePeople from '@/views/customerService/components/people.vue'
import { useAppStore } from '@/store/modules/app'

const loading = ref(false)
const appStore = useAppStore()
const message = useMessage()
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formRef = ref() // 表单 Ref

const departmentPersonnelSelectionRef = ref() // 部门人员选择组件 Ref
const departId = ref('') // 部门id
const displayList = ref([]) // 部门人员列表
const selectPersonList = ref<any[]>([]) // 已选择的人员列表
const selectDeptPersonList = ref<any[]>([])

/** 打开弹窗 */
const open = async (list?: []) => {
  dialogVisible.value = true
  dialogTitle.value = '添加组员'
  resetForm()
  selectPersonList.value = list || []
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 查询条件 */
const queryForm = ref({
  department: '',
  keyword: ''
})
const currentValue = ref('') // 输入框
const sortTableRef = ref() // table实例
const personList = ref<any[]>([])
// table 名字格式化
const formarName = (name: string) => {
  if (!name) return '-'
  const flag = currentValue.value != '' && name.includes(currentValue.value)
  return flag ? `<div style="color:#0064FF">${name}</div>` : name
}
// 选中的table数据
const selectTableValue = ref([])

const handleSelectionChange = (value) => {
  selectTableValue.value = value
  console.log('选中', value)
  selectDeptPersonList.value = value.map((item: {}) => ({ ...item, percentage: '' }))
}

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
// 删除接受人
const handleUserDelete = (userId: string) => {
  console.log('删除的用户：', userId)
  displayList.value = displayList.value.filter((item) => item !== userId)
  selectDeptPersonList.value = selectDeptPersonList.value.filter((item) => item.userId !== userId)
  departmentPersonnelSelectionRef.value.handleSelectTableValue(selectDeptPersonList.value)
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

const deletePersonInfo = (index, userId) => {
  handleUserDelete(userId)
  selectPersonList.value.splice(index, 1)
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
.content {
  box-sizing: border-box;
  height: 480px;
  &-form {
  }
  &-transfer {
    display: flex;
    .left {
      border-radius: 10px;
      border: 1px solid #dcdfe6;
      height: 400px;
      width: 600px;
      .SWCommonTable {
        margin: 10px;
        width: 580px;
      }
    }
    .center {
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
    .right {
      flex: 1;
      border-radius: 10px;
      border: 1px solid #dcdfe6;
      &-table {
        margin: 30px;
        margin-top: 20px;
        margin-right: 0px;
        .item {
          display: flex;
          flex-direction: row;
          align-items: center;
          height: 40px;
          &-userInfo {
            width: 90px;
          }
          &-per {
            display: flex;
            span {
              align-self: center;
              margin-left: 4px;
            }
          }
          &-delete {
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
