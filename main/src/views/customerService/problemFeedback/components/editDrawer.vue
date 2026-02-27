<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle">
    <el-card shadow="never" class="infoCard">
      <template #header>
        <div class="header">
          <div class="line"></div>
          <div class="title">客服人员维护</div>
        </div>
      </template>
      <el-form :model="formParams" label-width="80" :rules="fromRules" ref="formRef"
        :hide-required-asterisk="isFeedbackDisabled">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="反馈日期" prop="feedbackDate">
              <el-date-picker class="!w100%" v-model="formParams.feedbackDate" placeholder="请选择反馈日期"
                :disabled="isFeedbackDisabled" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预计完成日期" prop="estimatedCompleteDate" class="longLabel">
              <el-date-picker class="!w100%" v-model="formParams.estimatedCompleteDate" placeholder="请选择预计完成日期"
                :disabled="isFeedbackDisabled" value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题情况说明" prop="description" class="longLabel">
              <s-text-area v-model="formParams.description"  :autosize="{ minRows: 3, maxRows: 4 }"
                placeholder="请输入问题情况说明" maxlength="500" show-word-limit :disabled="isFeedbackDisabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="问题处理部门" prop="handleDept" class="longLabel">
              <el-select class="!w100%" v-model="formParams.handleDept" placeholder="请选择问题处理部门" filterable
                :disabled="isFeedbackDisabled || (drawerType === 'edit')"
                :suffix-icon="(isFeedbackDisabled || (drawerType === 'edit')) ? '' : 'ArrowDown'"
                @change="getCategoryByDept">
                <el-option v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_HANDLE_DEPT, true)"
                  :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品类" prop="category">
              <el-select class="!w100%" v-model="formParams.category" placeholder="请选择品类" filterable
                :suffix-icon="(isFeedbackDisabled || (drawerType === 'edit')) ? '' : 'ArrowDown'"
                :disabled="isFeedbackDisabled || !formParams.handleDept || (drawerType === 'edit')"
                @change="getFeedBackType">
                <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="问题反馈类型" prop="type" class="longLabel">
              <el-select class="!w100%" v-model="formParams.type" placeholder="请选择问题反馈类型" filterable
                @change="getProblemDirector"
                :suffix-icon="(isFeedbackDisabled || (drawerType === 'edit')) ? '' : 'ArrowDown'"
                :disabled="isFeedbackDisabled || (!formParams.handleDept || !formParams.category) || (drawerType === 'edit')">
                <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题对接负责人" prop="directorName" class="longLabel" required>
              <SelectUser v-if="drawerType === 'changeDirector'" v-model="formParams.directorId" :multiple="false" :needUserInfo="true"
                @change="handleChangeDirector" :showAvatarLable="true" :role="getRole('客服处理人')" :feedBackOptions="directorOptions"/>
              <div class="user" v-else>
                <el-avatar v-if="formParams.directorAvatarOrigin"
                  :src="formParams.directorAvatarOrigin || DefaultAvatar" :size="22" class="ava" />
                <span v-if="formParams.directorName">{{ formParams.directorName }}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="产品编码" prop="">
              <good-code url='/api/wdtSpec/listSpecNo' v-model="formParams.productCode" placeholder="请输入产品编码"
                :disabled="isFeedbackDisabled" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="图片" prop="">
              <uploadImg :onlyUploadImg="true" v-model:modelValue="imageList" :disabled="isFeedbackDisabled"
                :bussiness-code="'CUSTOMER_COMPLAINT_FEEDBACK'" :width="340" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

    </el-card>
    <el-card shadow="never" class="infoCard" v-if="drawerType === 'handle' || isShow || isProblemDirector">
      <template #header>
        <div class="header">
          <div class="line"></div>
          <div class="title">对接人员维护</div>
        </div>
      </template>
      <el-form :model="handleForm" label-width="80" :rules="handleFormRules" ref="handleFormRef"
        :hide-required-asterisk="isHandleDisabled">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="问题是否存在" prop="issueExistence" class="longLabel">
              <el-select class="!w100%" v-model="handleForm.issueExistence" placeholder="请选择问题是否存在"
                :disabled="isHandleDisabled" :suffix-icon="isHandleDisabled ? '' : 'ArrowDown'">
                <el-option label="是" :value="1" />
                <el-option label="否" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select class="!w100%" v-model="handleForm.status" placeholder="请选择状态" :disabled="isHandleDisabled"
                :suffix-icon="isHandleDisabled ? '' : 'ArrowDown'">
                <el-option v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_STATUS, true)"
                  :key="item.value" :disabled="item.value === '1'" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="最新进展" prop="latestProgress">
              <s-text-area  v-model="handleForm.latestProgress" class="!w100%" placeholder="请填写最新进展"
                :autosize="{ minRows: 3, maxRows: 4 }" maxlength="200" show-word-limit :disabled="isHandleDisabled" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <template #footer>
      <el-button @click="reset">关闭</el-button>
      <el-button @click="submit" v-if="drawerType !== 'show'" type="primary" class="mr20px">提交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import * as problemFeedbackApi from '@/api/customerService/problemFeedback'
import uploadImg from '@/components/SWUoloadFile/index.vue'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import dayjs from 'dayjs'
import { ref, reactive } from 'vue'
import { useMessage } from "@/hooks/web/useMessage"

const getRole = inject<any>('getRole')
const directorOptions = ref<any>([])

// 获取当前用户
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()

const message = useMessage()
const drawerVisible = ref(false)
const drawerTitle = ref('')
const drawerLoading = ref(false)
const drawerType = ref('')
const isShow = ref(false)
const isFeedbackDisabled = computed(() => {
  if (isShow.value) {
    return isShow.value
  } else if (drawerType.value === 'handle') {
    return true
  } else if (drawerType.value === 'edit') {
    return !isProblemCs.value
  } else if (drawerType.value === 'changeDirector') {
    return true
  }
})
const isHandleDisabled = computed(() => {
  return isShow.value
})
const isProblemDirector = ref(false) // 是否客服处理人 并且是这条数据的问题对接人 可以编辑
const isProblemCs = ref(false) // 是否客服 并且是这条数据的问题反馈人 可以编辑
const open = async (type, id, isProblemHandle, isCs) => {
  reset()
  drawerVisible.value = true
  drawerType.value = type
  drawerTitle.value = type === 'add' ? '新增' : type === 'edit' ? '编辑' : type === 'handle' ? '处理' : type === 'changeDirector' ? '修改处理人' : '查看'
  isShow.value = type === 'show'
  isProblemDirector.value = isProblemHandle
  isProblemCs.value = isCs
  if (id) {
    try {
      directorForm.value.id = id
      handleForm.value.id = id
      drawerLoading.value = true
      const data = await problemFeedbackApi.getDetailsById({ id })
      if (data) {
        formParams.value = data
        director.value = formParams.value.directorId
          ? { name: formParams.value.directorName, userId: formParams.value.directorId }
          : null
        imageList.value = formParams.value.image
          ? JSON.parse(formParams.value.image).map((el) => ({ url: el }))
          : []

        handleForm.value.status = data.status
        handleForm.value.issueExistence = data.issueExistence
        handleForm.value.latestProgress = data.latestProgress
        directorForm.value.updateUserId = formParams.value.directorId
        directorOptions.value = [{userId: formParams.value.directorId, realName: formParams.value.directorName, avatarOrigin: formParams.value.directorAvatarOrigin }]
      }
    } finally {
      drawerLoading.value = false
    }
  } else {
    // 当前登录用户
    const { userNo, realName } = userStore.user
    formParams.value.feedbackPersonId = String(userNo)
    formParams.value.feedbackPersonName = String(realName)
    const today = dayjs().format('YYYY-MM-DD')
    const tomorrow = dayjs().add(1, 'day').format('YYYY-MM-DD')
    formParams.value.feedbackDate = today
    formParams.value.estimatedCompleteDate = tomorrow
  }
}

// 根据部门查分类
const categoryList = ref<any>(getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_CATEGORY, true))
const getCategoryByDept: any = async () => {
  const { handleDept } = formParams.value
  formParams.value.category = ''
  categoryList.value = []
  const list = getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_CATEGORY, true)
  if (handleDept) {
    const res = await problemFeedbackApi.selectCategoryByDept(handleDept)
    if (res && res.length) categoryList.value = list.filter((el: any) => res.includes(el.code))
  }

}

// 根据部门 分类 查 问题反馈类型
const typeList = ref<any>(getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_TYPE, true))
const getFeedBackType: any = () => {
  const list = getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_TYPE, true)
  const { handleDept, category } = formParams.value
  formParams.value.type = ''
  typeList.value = []
  if (handleDept && category) {
    problemFeedbackApi.selectTypeList({ handleDept, category }).then((res: any) => {
      if (res && res.length) {
        typeList.value = list.filter((el: any) => res.includes(el.code))
      }
    })
  }
}

// 根据部门/品类/反馈类型查询对应关系下面的问题对接负责人
// 清空对接负责人
const clearDirectors = () => {
  formParams.value.directorId = ''
  formParams.value.directorName = ''
  formParams.value.directorAvatarOrigin = ''
}
const getProblemDirector = () => {
  const { handleDept, category, type } = formParams.value
  if (handleDept && category && type) {
    problemFeedbackApi.selectDirectorList({ handleDept, category, type }).then((res: any) => {
      if (res && res.length) {
        formParams.value.directorId = res[0].userId
        formParams.value.directorName = res[0].name
        formParams.value.directorAvatarOrigin = res[0].avatarOrigin
      } else {
        clearDirectors()
      }
      formRef.value?.validateField('directorName')
    })
  }
}

// 修改处理人
const directorForm = ref({
  id:'',
  updateUserId:''
})
const handleChangeDirector = (director:any) => {
  directorForm.value.updateUserId = director.userId
}

// 请求参数
const formParams = ref<any>({
  category: '',
  type: '',
  description: '',
  handleDept: '',
  directorName: '',
  directorId: '',
  directorAvatarOrigin: '',
  finishStatus: undefined,
  estimatedCompleteDate: '',
  actualCompleteDate: '',
  feedbackDate: '',
  feedbackPersonId: '',
  feedbackPersonName: '',
  productCode: '',
  image: ''
})
// 处理人
const handleForm = ref<any>({
  id: '',
  issueExistence: undefined,
  status: '',
  latestProgress: '',
})
const director = ref()
const imageList = ref<any>([]) // 图片
const formRef = ref()
const handleFormRef = ref()
const fromRules = reactive({
  category: [{ required: true, message: '请选择品类', trigger: 'change' }],
  type: [{ required: true, message: '请选择问题反馈类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入问题情况说明', trigger: 'change' }],
  handleDept: [{ required: true, message: '请选择问题处理部门', trigger: 'change' }],
  feedbackDate: [{ required: true, message: '请选择反馈日期', trigger: 'change' }],
  directorName: [{ required: true, message: '问题对接负责人不存在', trigger: 'change' }]
})
const validateStatus = (rules: any, value: any, callback: any) => {
  if (value === '1') {
    callback(new Error('请更改状态'))
  } else {
    callback()
  }
}
const handleFormRules = reactive({
  issueExistence: [{ required: true, message: '请选择问题是否存在', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'blur' }, { validator: validateStatus, trigger: 'blur' }],
  latestProgress: [{ required: true, message: '请输入最新进展', trigger: 'blur' }],
})
const submit = async () => {
  console.log(formParams.value)
  await formRef.value.validate()
  try {
    if (drawerType.value === 'handle') {
      await handleFormRef.value?.validate()
      const params = { ...handleForm.value }
      // 处理
      problemFeedbackApi.handleProblem(params).then(() => {
        message.success('处理完成')
        reset()
        emits('success')
      })
    } else if(drawerType.value === 'changeDirector'){
      console.log(directorForm.value)
      problemFeedbackApi.updateHandleUser(directorForm.value).then((res:any)=>{
        message.success('修改完成')
        reset()
        emits('success')
      })
    } else {
      let params
      if (isProblemDirector.value) {
        params = { ...handleForm.value }
      } else {
        const image = imageList.value?.map((item) => item.url) || ''
        params = { ...formParams.value, image: JSON.stringify(image) }
        delete params.status
      }
      problemFeedbackApi.saveOrUpdate(params).then((res: any) => {
        message.success('保存成功')
        reset()
        emits('success')
      })
    }

  } finally {
  }
}
const reset = () => {
  director.value = null
  imageList.value = []
  formParams.value = {
    category: '',
    type: '',
    description: '',
    handleDept: '',
    directorName: '',
    directorId: '',
    directorAvatarOrigin: '',
    finishStatus: undefined,
    estimatedCompleteDate: '',
    actualCompleteDate: '',
    feedbackDate: '',
    feedbackPersonId: '',
    feedbackPersonName: '',
    productCode: '',
    image: ''
  }
  handleForm.value = {
    id: '',
    issueExistence: undefined,
    status: '',
    latestProgress: '',
  }
  directorForm.value = {
    id:'',
    updateUserId:''
  }
  formRef.value?.resetFields()
  handleFormRef.value?.resetFields()
  drawerVisible.value = false
}
const emits = defineEmits(['success'])
defineExpose({ open })
</script>

<style lang="less" scoped>
.infoCard {
  border-radius: 10px;
  background: #fff;
  margin-bottom: 20px;
  border: none;

  .header {
    display: flex;
    align-items: center;

    .line {
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 6px;
    }

    .title {
      font-size: 14px;
      color: #333;
      font-weight: 600;
    }
  }

  :deep(.el-card__header) {
    padding: 16px 20px;
  }

  :deep(.el-form--inline .el-form-item) {
    margin-right: 10px;
  }

  :deep(.el-form-item--default .el-form-item__label) {
    text-align: right;
  }

  .longLabel {
    :deep(.el-form-item__label) {
      line-height: 16px;
    }
  }
}

.user {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  background: #f8f8f9;
  padding: 4px 12px;
  height: 32px;
  width: 100%;
  border-radius: 4px;
  box-shadow: 0 0 0 1px #e5e5e5 inset;

  .ava {
    margin-right: 6px;
  }

  span {
    color: #333;
  }
}
</style>
