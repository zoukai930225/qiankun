<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      size="968"
    >
      <div>
        <div class="drawerTitle"
          ><div>文本内容</div
          ><div @click="drawerVisible = false"
            ><el-icon><CloseBold /></el-icon
          ></div>
        </div>
      </div>
      <el-form
        class="dialogForm"
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <div class="drawerContent">
          <el-form-item label="标题" prop="messageTitle" style="width: 100%">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.messageTitle"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="内容" prop="messageContent" style="width: 100%">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.messageContent"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="跳转链接" prop="jumpLink" style="width: 100%">
            <el-input
              class="dialogFormItemWidth"
              v-model="formData.jumpLink"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </div>
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon2">
              <img src="@/assets/imgs/feishuSend/icon1.png" alt="" />
              <span>接受人</span>
            </div>

            <img
              src="@/assets/imgs/feishuSend/add.png"
              alt=""
              class="addBtn"
              @click="dialogVisible = true"
            />
          </div>

          <div class="receiverList" v-if="formData.receiverList?.length > 0">
            <div v-for="item in formData.receiverList" :key="item.userId" class="userListItem">
              <img :src="item.avatarOrigin" alt="" class="avatar" />
              <span class="name"> {{ item.name }}</span>
              <img
                src="@/assets/imgs/feishuSend/close.png"
                alt=""
                class="closeBtn"
                @click="handleUserDelete(item.userId)"
              />
            </div>
          </div>
          <div v-else class="empty-img">
            <!-- <img src="@/assets/imgs/common/empty_list.png" alt="" /> -->
            <div>暂无接受人</div>
          </div>
        </div>
        <div class="drawerContent">
          <div class="drawerContent-title">
            <div class="drawerContent-title-icon2">
              <img src="@/assets/imgs/feishuSend/icon2.png" alt="" />
              <span>定时发送</span>
            </div>
            <img
              src="@/assets/imgs/feishuSend/add.png"
              alt=""
              class="addBtn"
              @click="openTimeChooseForm"
            />
          </div>
          <div class="schedulerBody" style="margin-left: 25px">
            <el-table
              ref="sortTableRef"
              :header-cell-style="appStore.headerCellStyle"
              v-loading="loading"
              :data="formData.schedulerBody"
              :stripe="false"
              height="300"
              row-class-name="commonTableRow"
              class="SWCommonTable"
              v-horizontal-scroll="'always'"
              show-overflow-tooltip
            >
              <el-table-column label="类型" prop="executeType">
                <template #default="scope"> {{ getExecuteTypeAndOther(scope.row) }}</template>
              </el-table-column>

              <el-table-column label="时间" prop="executeTime">
                <template #default="scope"> {{ scope.row.executeTime || '-' }}</template>
              </el-table-column>

              <el-table-column fixed="right" width="130" label="操作" align="center">
                <template #default="scope">
                  <div class="action-wrap">
                    <div class="action-delete" @click="handleTimeDelete(scope.row.id)">删除</div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <div class="drawerFooter">
        <el-button :disabled="formLoading" @click="submitForm('save')"> 保存</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm('send')">
          立刻发送</el-button
        >
      </div>
    </el-drawer>
  </div>
  <time-choose ref="timeChooseRef" @submit="handleTimeChooseSubmit" />
  <el-dialog
    class="commomDialig"
    v-model="dialogVisible"
    :title="''"
    destroy-on-close
    style="
      background: linear-gradient(
        226deg,
        #f2f3ff 0%,
        #ffffff 39%,
        #ffffff 88%,
        #e8f6fd 95%,
        #f0f8ff 100%
      );
      border-radius: 14px;
      width: 877px;
    "
  >
    <DepartmentPersonnelSelection
      ref="departmentPersonnelSelectionRef"
      @confirm="handleUserChoose"
      :departId="departId"
      :list="displayList"
      @cancle="dialogVisible = false"
    />
  </el-dialog>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddProdForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import { nanoid } from 'nanoid'
import timeChoose from './timeChoose.vue'
import DepartmentPersonnelSelection from '@/components/DepartmentPersonnelSelection/index.vue'
import * as FeishuSendApi from '@/api/feishuSend'
import { useAppStore } from '@/store/modules/app'

const dialogVisible = ref(false) // 选择接受人弹窗的是否展示
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const appStore = useAppStore()
const formData = ref<any>({
  id: undefined,
  messageTitle: '',
  messageContent: '',
  jumpLink: '', // 跳转链接

  receiverList: [], // 接受人列表
  receivers: '', // 接受人列表的用户id字符串，用逗号分隔
  schedulerBody: []
})
const formRules = reactive({
  messageTitle: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  messageContent: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  jumpLink: [{ required: true, message: '请输入跳转链接', trigger: 'blur', whitespace: true }]
})

const departId = ref('') // 部门id
const displayList = ref([]) // 部门人员列表
const loading = ref(false)
const formRef = ref() // 表单 Ref
/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  formType.value = type
  resetForm()

  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await FeishuSendApi.queryById(id)
      formData.value = data
      if (formData.value.schedulerBody) {
        formData.value.schedulerBody = JSON.parse(formData.value.schedulerBody)
        formData.value.schedulerBody = formData.value.schedulerBody.map((item, index) => {
          return {
            ...item,
            id: nanoid()
          }
        })
      } else {
        formData.value.schedulerBody = []
      }

      departId.value = data.receiverList[0].departmentId
      displayList.value = data.receivers.split(',')
      console.log('formData', formData.value)
      console.log('departId', departId.value)
    } finally {
      formLoading.value = false
    }
  }
  formData.value.jumpLink = formData.value.jumpLink
    ? formData.value.jumpLink
    : 'http://116.62.235.33'
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 类型
const getExecuteType = (type) =>
  ({
    '1': '每日',
    '2': '每周',
    '3': '每月'
  })[type] || '-'

const getDayOfWeek = (dayOfWeek) =>
  ({
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六',
    '7': '周日'
  })[dayOfWeek] || '-'

// 其他信息获取函数
const getExecuteOther = (row) => {
  switch (row.executeType) {
    case '2':
      return getDayOfWeek(row.dayOfWeek)
    case '3':
      return row.dayOfMonth == 32 ? '最后一日' : `${row.dayOfMonth}号`
    default:
      return ''
  }
}

// 处理显示的类型和其他信息
const getExecuteTypeAndOther = (row) => {
  const type = getExecuteType(row.executeType)
  const other = getExecuteOther(row)
  return other ? `${type}${other}` : type // 如果没有其他信息，则只返回类型
}

// 打开选择时间范围弹窗
const timeChooseRef = ref(null)
const openTimeChooseForm = () => {
  if (timeChooseRef.value) {
    timeChooseRef.value.open()
  }
}

// 选择时间范围
const handleTimeChooseSubmit = (data: any) => {
  console.log('--', data)
  console.log('schedulerBody', formData.value.schedulerBody)
  formData.value.schedulerBody.push({ ...data, id: nanoid() })
  console.log('选择的时间范围：', formData.value.schedulerBody)
}
/** 删除定时时间操作 */
const handleTimeDelete = (id: number) => {
  console.log('删除的时间范围：', id)
  formData.value.schedulerBody = formData.value.schedulerBody.filter((item) => item.id !== id)
  console.log('修改完了的数据：', formData.value.schedulerBody)
}

// 选择接受人
const handleUserChoose = (data) => {
  console.log('-=-=', data)
  let dataInfo = data.list.map((item) => {
    return {
      userId: item.userId,
      name: item.name,
      avatarOrigin: item.avatarOrigin
    }
  })
  formData.value.receiverList = dataInfo
  // 处理回显的人员列表
  displayList.value = data.list.map((item) => item.userId)
  // 处理回显的部门id
  departId.value = data.departId
  dialogVisible.value = false
  console.log('选择的用户：', formData.value)
}
// 删除接受人
const handleUserDelete = (userId) => {
  console.log('删除的用户：', userId)
  formData.value.receiverList = formData.value.receiverList.filter((item) => item.userId !== userId)
  displayList.value = displayList.value.filter((item) => item !== userId)
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: '',
    messageTitle: '',
    messageContent: '',
    jumpLink: '',
    receiverList: [],
    receivers: '',
    schedulerBody: []
  }
  departId.value = ''
  displayList.value = []
}

/** 发送 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

/** 保存表单 */
const submitForm = async (submitType: string) => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return

  if (formData.value.receiverList.length === 0) {
    message.error('请选择接受人')
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = { ...formData.value }
    // 处理定时发送--删除每个对象的id属性
    let schedulerBodyArray = []
    schedulerBodyArray = data.schedulerBody.map((item) => {
      const { id, ...rest } = item
      return rest
    })

    data.schedulerBody = data.schedulerBody.length > 0 ? JSON.stringify(schedulerBodyArray) : ''
    // 处理接受人列表
    data.receivers = data.receiverList.map((item) => item.userId).join(',')

    console.log('formData', data)
    // 新增或者修改数据
    if (submitType === 'save') {
      if (formType.value === 'create') {
        data.id = undefined
        await FeishuSendApi.addData(data)
        message.success(t('common.createSuccess'))
      } else {
        await FeishuSendApi.updateData(data)
        message.success(t('common.updateSuccess'))
      }
    } else if (submitType === 'send') {
      // 立即发送
      await FeishuSendApi.sendData(data)
      message.success('发送成功')
    }

    drawerVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.empty-img {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 14px;
  color: #909399;
}
.receiverList {
  margin: 0 0 18px 25px;
  display: flex;
  flex-wrap: wrap;
}
.userListItem {
  background: #cad6f8;
  border-radius: 13px;
  margin: 0 20px 5px 0;
  padding: 5px 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  .avatar {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
  .name {
    margin: 0 8px;
    font-size: 14px;
  }
  .closeBtn {
    width: 8px;

    cursor: pointer;
    &:hover {
      scale: 1.2;
    }
  }
}
// 修改表单label的行高
:deep(.longlabel .el-form-item--default .el-form-item__label) {
  line-height: 1.5;
}
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

// 背景颜色
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px 20px 20px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
  &-title {
    margin: 0 0 18px 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 0 0 14px 0;
    border-bottom: 1px solid #f0f0f1;
    &-icon2 {
      img {
        width: 12px;
        vertical-align: middle;
        margin-right: 4px;
      }
    }
    .addBtn {
      width: 24px;
      cursor: pointer;
    }
  }
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

.action-wrap {
  .action-delete {
    color: #eb3737;
    cursor: pointer;
  }
}
</style>
