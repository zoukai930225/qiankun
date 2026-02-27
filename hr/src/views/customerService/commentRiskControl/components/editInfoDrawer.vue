<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer v-model="drawerVisible" :with-header="false" :wrapper-closable="true" :before-close="(done) => {
        resetForm()
        done()
      }
      " class="drawer" size="968" @close="reset">
      <div class="row-center topView">
        <div class="drawerTitle">{{ drawerTitle }}</div>
        <img src="@/assets/imgs/system/fieldManageConfig/close.png" class="close" @click="reset" />
      </div>
      <div class="drawerContent">
        <el-form class="dialogForm" ref="formRef" v-loading="formLoading" :model="formData" :rules="formRules"
          label-width="100px">
          <el-form-item label="店铺" prop="store">
            <StoreRangePlus v-model="formData.store" width="100%" />
          </el-form-item>
          <el-form-item label="指标总数" prop="groupName">
            <div class="total warning">
              <span style="vertical-align: middle"><el-icon color="#F56C6C" size="12" v-if="totalPercentage > 100">
                  <WarningFilled />
                </el-icon></span>
              <el-tag effect="light" :type="totalPercentage > 100 ? 'danger' : 'primary'" class="mr-1 ml-1">
                <span :style="{ color: totalPercentage > 100 ? '#EB3737' : '#0064FF' }">
                  {{ totalPercentage }}
                </span>
              </el-tag>
              <span>%</span>
            </div>
          </el-form-item>
          <el-form-item style="margin-top: -18px">
            <div class="notice" style="opacity: 0.6">
              <span style="margin-right: 6px"><img src="@/assets/imgs/customerService/question.png" alt=""
                  style="width: 11px; height: 10px" /></span>
              <span>需以下每个评论专员的“指标占比”总和为100%，才可正常保存数据</span>
            </div>
          </el-form-item>
          <el-form-item label="评论专员" prop="teamDetailList">
            <div class="groupMemberBg">
              <div class="groupMemberBg-content" v-if="formData.teamDetailList && formData.teamDetailList.length > 0">
                <peopleItem class="groupMemberBg-content-item" v-for="(item, index) in formData.teamDetailList"
                  :key="index" :data="item" :index="index" @delete-person-info="deletePersonInfo"
                  @edit-person-per="editPersonPer" />
              </div>
              <div v-if="formData.teamDetailList && formData.teamDetailList.length > 0" class="line"></div>
              <div class="addMember" @click="addGroupMember">
                <img class="addIcon" src="@/assets/imgs/customerService/add.png" />
                <div class="addMemberText">添加专员</div>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <div class="drawerFooter" v-if="formType == 'create' || formType == 'update'">
          <el-button @click="drawerVisible = false">取 消</el-button>
          <el-button :disabled="formLoading || totalPercentage !== 100" type="primary" @click="submitForm">
            {{ formType === 'create' ? '保 存' : '提 交' }}</el-button>
        </div>
      </div>
    </el-drawer>
    <AddPeopleDialog ref="addPeopleDialogRef" @success="addGroupMemberSuccess" />
  </div>
</template>
<script lang="ts" setup>
import PeopleItem from './peopleItem.vue'
import AddPeopleDialog from './addPeopleDialog.vue'

import * as commentApi from '@/api/customerService/comment'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  store: '',
  teamDetailList: [] as any[]
})

const validateTeamDetailList = (rule: any, value: any, callback: any) => {
  if (
    value === '' ||
    value === null ||
    value === undefined ||
    formData.value.teamDetailList.length === 0
  ) {
    callback(new Error('请添加专员'))
  } else {
    callback()
  }
}

const formRules = reactive({
  store: [{ required: true, message: '请选择店铺', trigger: 'blur' }],
  teamDetailList: [
    { required: true, validator: validateTeamDetailList, trigger: ['blur', 'change'] }
  ]
})

const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  drawerVisible.value = true
  drawerTitle.value =
    type === 'create' ? '新增' : type === 'update' ? '编辑' : type === 'view' ? '查看' : ''
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      const data = await commentApi.queryPersonAssignment({ store: id })
      if (data.success) {
        formData.value.store = id
        formData.value.teamDetailList = data.data.map((item: any) => {
          const { store, userId, percentage, userName, avatarOrigin } = item
          return {
            store,
            userId,
            name: userName,
            avatarOrigin,
            percentage: parseInt(percentage)
          }
        })
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
    // 新增
    formData.value.teamDetailList = list || []
  } else {
    // 修改
    const filterList = [] as any[]
    list.forEach((item: any) => {
      const user = formData.value.teamDetailList.find((item1) => item1.userId === item.userId)
      if (!user) {
        filterList.push(item)
      }
    })
    formData.value.teamDetailList = [...formData.value.teamDetailList, ...filterList]
  }
  const peopleNum = formData.value.teamDetailList.length
  const perNum = Math.floor(100 / peopleNum)
  formData.value.teamDetailList = formData.value.teamDetailList.map((item: any) => {
    // 删除 重新赋值计算后的数值
    delete item.percentage
    return {
      ...item,
      percentage: perNum
    }
  })
}

// 计算所有评论专员的指标占比
const totalPercentage = ref<number>(0)
watch(
  () => formData.value.teamDetailList,
  (newVal) => {
    totalPercentage.value = newVal.reduce((sum, e) => sum + Number(e.percentage), 0)

    // 如果超过100 弹窗提示
    if (totalPercentage.value > 100) {
      message.confirm('指标总比已超上限，请及时调整评论专员的指标占比后再进行保存！')
    }
  },
  {
    deep: true,
    immediate: true
  }
)
// 删除组员
const deletePersonInfo = (index: number) => {
  if (index < formData.value.teamDetailList.length) {
    formData.value.teamDetailList.splice(index, 1)
  }
}
// 编辑评论专员的指标占比
const editPersonPer = (value: string | number, index: number) => {
  formData.value.teamDetailList[index].percentage = Number(value)
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
    const submitData = data.teamDetailList.map((item: any) => ({
      store: data.store,
      userId: item.userId,
      percentage: Number(item.percentage) + '%'
    }))
    if (formType.value === 'create') {
      await commentApi.saveComment(submitData)
      message.success(t('common.createSuccess'))
    } else {
      console.log('修改', submitData)
      await commentApi.updateComment(submitData)
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
    store: '',
    teamDetailList: []
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

:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.topView {
  display: flex;
  flex-direction: row;
  align-content: center;
  margin-bottom: 6px;
  margin-top: -10px;

  .drawerTitle {
    font-family: AlibabaPuHuiTi_2_75_SemiBold;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    font-weight: 600;
    margin: auto 0;
  }

  .close {
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
    width: 810px;
    background: #f8f8f9;
    border-radius: 4px;
    box-sizing: border-box;

    &-content {
      width: 770px;
      padding: 16px;
      min-height: 40px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;

      &-item {
        width: 320px;
        height: 40px;
        margin-bottom: 18px;
      }
    }

    .line {
      margin-left: 14px;
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
      margin-top: 16px;

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
