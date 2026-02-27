<template>
  <div class="drawer-wrapper">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" class="drawer" size="968">
      <div>
        <div class="drawerTitle">
          <div>{{ drawerTitle }}</div>
          <div @click="drawerVisible = false"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
        label-width="80px">
        <div class="drawerContent">
          <el-form-item label="活动名称" prop="actName">
            <el-input class="dialogFormItemWidth" v-model="formData.actName" placeholder="请输入" style="width: 100%"
              :disabled="isView" />
          </el-form-item>
          <el-form-item label="盘点方案" prop="displayInventoryPlanName">
            <el-select class="dialogFormItemWidth" v-model="formData.displayInventoryPlanName" placeholder="请选择"
              filterable @change="handleInventoryPlanChange" clearable style="width: 100%" :disabled="isView">
              <el-option v-for="dict in schemeList" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动年度" prop="actYear">
            <el-date-picker v-model="formData.actYear" type="year" placeholder="请选择" style="width: 100%"
              class="activitySet-icon-disabled" :disabled="isView" />
          </el-form-item>
          <el-form-item label="活动时间" prop="dateRange" required>
            <el-col :span="11">
              <el-date-picker v-model="formData.beginTime" type="date" value-format="YYYY-MM-DD" placeholder="开始时间"
                style="width: 100%" @change="handleStartDateChange" :disabled="isView" />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">至</span>
            </el-col>
            <el-col :span="11">
              <el-date-picker v-model="formData.endTime" type="date" value-format="YYYY-MM-DD" placeholder="结束时间"
                style="width: 100%" class="activitySet-icon-disabled" :disabled-date="disabledEndDate"
                @change="handleEndDateChange" :disabled="isView" />
            </el-col>
          </el-form-item>
          <el-form-item label="九宫格" prop="nineSquareGridId">
            <el-select class="dialogFormItemWidth" v-model="formData.nineSquareGridId" placeholder="请选择类型" clearable
              style="width: 100%" :disabled="isView">
              <el-option v-for="dict in nineGridList" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="活动描述" prop="actDescribe">
            <s-text-area class="dialogFormItemWidth" v-model="formData.actDescribe" placeholder="请输入"
              style="width: 100%" :autosize="{ minRows: 4, maxRows: 5 }" maxlength="500" show-word-limit
              :disabled="isView" />
          </el-form-item>
          <!-- <el-form-item label="管理者" prop="userList">
            <el-select
              class="dialogFormItemWidth"
              v-model="formData.userList"
              placeholder="请选择"
              clearable
              multiple
              filterable
              style="width: 100%"
            >
              <el-option
                v-for="dict in managerList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item> -->
        </div>
      </el-form>
      <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
        <el-button @click="drawerVisible = false">取 消</el-button>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">
          {{ formType === 'create' ? '保 存' : '提 交' }}</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
defineOptions({ name: 'AddForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗
import { debounce } from 'lodash-es'
import * as activitySetApi from '@/api/otr/activitySet'
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formRef = ref() // 表单 Ref
const nineGridList = ref([] as any) // 九宫格列表
const nineGridObj = ref({} as any) // 九宫格key-value 映射
const formData = ref({
  id: undefined,
  actName: '', //活动名称
  actYear: '', //活动年度
  beginTime: '', //开始时间
  endTime: '', //结束时间
  actDescribe: '', //活动描述
  // userList: [], //管理者
  userIds: [], //管理者 -新增/编辑使用
  dateRange: ['', ''], //日期范围
  inventoryPlan: '', //盘点方案
  inventoryPlanId: '', //方案id
  displayInventoryPlanName: '', //方案名称 -回显使用
  nineSquareGridName: '', // 九宫格
  nineSquareGridId: ''
})

// 获取九宫格列表
const getNineGridList = async () => {
  const data = await activitySetApi.getNineGridList().catch(() => { })
  if (data) {
    nineGridList.value = data.map((v) => ({ label: v.gridName, value: v.id }))
    nineGridList.value.forEach((el) => {
      nineGridObj.value[el.value] = el.label
    })
  }
}

// 校验规则
const formRules = reactive({
  actName: [{ required: true, message: '请输入活动名称', whitespace: true, trigger: 'blur' }],
  displayInventoryPlanName: [
    { required: true, message: '请选择盘点方案', trigger: ['change', 'blur'] }
  ],
  actYear: [{ required: true, message: '请输入活动年度', trigger: 'blur' }],
  dateRange: [
    {
      validator: (rule, value, callback) => {
        console.log('value', value)
        if (!value[0]) {
          callback(new Error('开始时间不能为空'))
        } else if (!value[1]) {
          callback(new Error('结束时间不能为空'))
        } else if (new Date(value[0]) >= new Date(value[1])) {
          callback(new Error('结束时间不能早于或等于开始时间'))
        } else {
          callback()
        }
      },
      trigger: ['blur']
    }
  ],
  nineSquareGridId: [{ required: true, message: '请选择九宫格', trigger: 'blur' }]

  // userList: [{ required: true, message: '请选择管理者', trigger: 'change' }]
})

const isView = ref(false) // 是否查看(不可编辑)
/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  drawerTitle.value = type === 'view' ? '查看' : t('action.' + type)
  formType.value = type
  isView.value = type === 'view'
  resetForm()
  // 获取方案列表
  getSchemeList()
  // 获取管理员列表
  getManagerList()
  // 获取九宫格列表
  getNineGridList()
  // 编辑时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await activitySetApi.getDataById(id)

      formData.value = {
        ...data,
        // userList: data.userList.split(','),
        dateRange: [data.beginTime, data.endTime],
        displayInventoryPlanName: data.inventoryPlan
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = debounce(async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      ...formData.value,
      // userList: formData.value.userList.join(','), // 对userList进行修改为后端需要的字符串
      // userIds: formData.value.userList || undefined,
      nineSquareGridName: nineGridObj.value[formData.value.nineSquareGridId],
      actYear: new Date(formData.value.actYear).getFullYear().toString()
    }
    // console.log('提交的数据：', data)
    if (formType.value === 'create') {
      data.id = undefined
      await activitySetApi.addData(data)
      message.success(t('common.createSuccess'))
    } else {
      await activitySetApi.updateData(data)
      message.success(t('common.updateSuccess'))
    }
    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}, 200)

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: undefined,
    actName: '',
    inventoryPlan: '',
    inventoryPlanId: '',
    displayInventoryPlanName: '',
    actYear: '',
    beginTime: '',
    endTime: '',
    actDescribe: '',
    // userList: [],
    userIds: [],
    dateRange: ['', ''],
    nineSquareGridName: '',
    nineSquareGridId: ''
  }
}

// 获取盘点方案列表
interface OptionItem {
  label: string
  value: string
}
const schemeList = ref<OptionItem[]>([])
const getSchemeList = async () => {
  let data = await activitySetApi.getSchemeList()
  if (data) {
    schemeList.value = data.map((item) => ({ label: item.planTitle, value: item.id }))
  }
}

/** 处理盘点方案的变化 */
const handleInventoryPlanChange = (value) => {
  let data = schemeList.value.find((item) => item.value === value)
  if (data) {
    formData.value.inventoryPlan = data.label
    formData.value.displayInventoryPlanName = data.label
    formData.value.inventoryPlanId = value
  }
}

// 获取管理员列表
const managerList = ref<OptionItem[]>([])
const getManagerList = async () => {
  let data = await activitySetApi.getManagerList()
  if (data) {
    managerList.value = data.map((item) => ({ label: item.name, value: item.userId }))
  }
}

/** 禁用结束时间 */
const disabledEndDate = (date) => {
  const beginTime = formData.value.beginTime
  if (!beginTime) return false // 如果没有开始日期，不禁用任何日期
  return new Date(date).getTime() < new Date(beginTime).getTime()
}

// 开始时间的选择事件
const handleStartDateChange = (date) => {
  // 禁用所有小于开始日期的时间
  const endTime = formData.value.endTime
  // 当开始日期变化时，更新 dateRange 数组
  formData.value.dateRange = [date, endTime]
  if (endTime) {
    const endDateObj = new Date(endTime)
    if (endDateObj.getTime() < new Date(date).getTime()) {
      formData.value.endTime = ''
      // 当开始日期变化时，更新 dateRange 数组
      formData.value.dateRange = [date, '']
    }
  }
}
// 结束时间的选择事件
const handleEndDateChange = (date) => {
  // 当结束日期变化时，更新 dateRange 数组
  formData.value.dateRange = [formData.value.beginTime, date]
}
</script>

<style>
/* 隐藏 el-date-picker 的图标 */
.activitySet-icon-disabled .el-input__prefix-inner {
  display: none;
}
</style>
<style lang="scss" scoped>
// 修改多选框的背景色
:deep(.el-tag, .el-tag.el-tag--primary) {
  background-color: #bfc9d266;
  border-radius: 15px;
}

// 修改备注的文本框背景
:deep(.el-textarea__inner),
:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  background-color: #f8f8f9 !important;
  box-shadow: none !important;
}

:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 修改弹窗的标题样式
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
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
