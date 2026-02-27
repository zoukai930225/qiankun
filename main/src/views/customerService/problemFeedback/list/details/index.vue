<template>
  <scheme-details ref="detailsRef" name="List" :width="936">
    <template #card >
      <el-card shadow="never" class="infoCard" v-loading="loading">
        <template #header>
          <div class="csheader">
            <div class="line"></div>
            <div class="title">客服人员维护</div>
          </div>
        </template>
        <el-form :model="dataValue" label-width="80" :rules="fromRules" ref="formRef"
          :hide-required-asterisk="isFeedbackDisabled">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="反馈日期" prop="feedbackDate">
                <el-date-picker class="!w100%" v-model="dataValue.feedbackDate" placeholder="请选择反馈日期"
                  :disabled="isFeedbackDisabled || (viewType === 'edit')" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="预计完成日期" prop="estimatedCompleteDate" class="longLabel">
                <el-date-picker class="!w100%" v-model="dataValue.estimatedCompleteDate" placeholder="请选择预计完成日期"
                  :disabled="isFeedbackDisabled" value-format="YYYY-MM-DD" />
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="问题情况说明" prop="description" class="longLabel">
                <s-text-area v-model="dataValue.description"  :autosize="{ minRows: 3, maxRows: 4 }"
                  placeholder="请输入问题情况说明" maxlength="500" show-word-limit :disabled="isFeedbackDisabled" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="问题处理部门" prop="handleDept" class="longLabel">
                <el-select class="!w100%" v-model="dataValue.handleDept" placeholder="请选择问题处理部门" filterable
                  :disabled="isFeedbackDisabled "
                  :suffix-icon="(isFeedbackDisabled) ? '' : 'ArrowDown'"
                  @change="getCategoryByDept">
                  <el-option v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_HANDLE_DEPT, true)"
                    :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品类" prop="category">
                <el-select class="!w100%" v-model="dataValue.category" placeholder="请选择品类" filterable
                  :suffix-icon="(isFeedbackDisabled) ? '' : 'ArrowDown'"
                  :disabled="isFeedbackDisabled || !dataValue.handleDept"
                  @change="getFeedBackType">
                  <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="问题反馈类型" prop="type" class="longLabel">
                <el-select class="!w100%" v-model="dataValue.type" placeholder="请选择问题反馈类型" filterable
                  @change="getProblemDirector"
                  :suffix-icon="(isFeedbackDisabled ) ? '' : 'ArrowDown'"
                  :disabled="isFeedbackDisabled || (!dataValue.handleDept || !dataValue.category)">
                  <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="问题对接负责人" prop="directorName" class="longLabel" required>
                <SelectUser v-if="viewType === 'changeDirector'" v-model="dataValue.directorId" :multiple="false"
                  :needUserInfo="true" @change="handleChangeDirector" :showAvatarLable="true" :role="getRole('客服处理人')"
                  :feedBackOptions="directorOptions" />
                <div class="user" v-else>
                  <el-avatar v-if="dataValue.directorAvatarOrigin"
                    :src="dataValue.directorAvatarOrigin || DefaultAvatar" :size="22" class="ava" />
                  <span v-if="dataValue.directorName">{{ dataValue.directorName }}</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="产品编码" prop="">
                <good-code url='/api/wdtSpec/listSpecNo' v-model="dataValue.productCode" placeholder="请输入产品编码"
                  :disabled="isFeedbackDisabled" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="图片" prop="">
                <uploadImg :onlyUploadImg="true" v-model:modelValue="imageList" :disabled="isFeedbackDisabled"
                :businessCode="'CUSTOMER_COMPLAINT_FEEDBACK'" :width="340" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </el-card>
      <el-card shadow="never" class="infoCard mt20px"
      v-loading="loading"
        v-if="viewType === 'handle' || viewType === 'view' || isProblemDirector">
        <template #header>
          <div class="header">
            <div class="line"></div>
            <div class="title">对接人员维护</div>
          </div>
        </template>
        <el-form :model="dataValue" label-width="80" :rules="handleFormRules" ref="handleFormRef"
          :hide-required-asterisk="isHandleDisabled">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="问题是否存在" prop="issueExistence" class="longLabel">
                <el-select class="!w100%" v-model="dataValue.issueExistence" placeholder="请选择问题是否存在"
                  :disabled="isHandleDisabled" :suffix-icon="isHandleDisabled ? '' : 'ArrowDown'">
                  <el-option label="是" :value="1" />
                  <el-option label="否" :value="0" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态" prop="status">
                <el-select class="!w100%" v-model="dataValue.status" placeholder="请选择状态" :disabled="isHandleDisabled"
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
                <s-text-area  v-model="dataValue.latestProgress" class="!w100%" placeholder="请填写最新进展"
                  :autosize="{ minRows: 3, maxRows: 4 }" maxlength="200" show-word-limit :disabled="isHandleDisabled" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'ListDetails' };
</script>

<script lang="tsx" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { FromProvideType } from '@/components/template/config/type';
import { cloneDeep, debounce } from "lodash-es";
import { DataItem } from "../page/config";
import { useUserStore } from '@/store/modules/user';
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import * as problemFeedbackApi from '@/api/customerService/problemFeedback'
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import uploadImg from '@/components/SWUoloadFile/index.vue'
import dayjs from 'dayjs'

const message = useMessage();
const userStore = useUserStore();

const { onSearch } = inject(`ListForm`) as FromProvideType;
const { getRole, grabCheck } = inject('getRole') as any
const detailsRef = ref<any>(), formRef = ref(), dataValue = ref<DataItem>({ ...new DataItem() }), bukValue = ref<DataItem>({ ...new DataItem() }), viewType = ref<string>('view'), loading = ref<boolean>(false);

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const imageList = ref<any>([]) // 图片

const title = computed(() => viewType.value === 'add' ? '新增' : viewType.value === 'view' ? '详情' : viewType.value === 'edit' ? '编辑' : viewType.value === 'handle' ? '处理' : '修改处理人');

// 当前登陆人 userId
const currentUserId = computed(() => userStore.user?.userNo)
const isProblemCs = computed(() => {
  return bukValue.value.status !== '3' && bukValue.value.feedbackPersonId === currentUserId.value && grabCheck('客诉请求')
})
const isProblemDirector = computed(() => {
  return bukValue.value.status !== '1' && bukValue.value.status !== '3' && bukValue.value.directorId === currentUserId.value && grabCheck('客服处理人')
})
const isShow = computed(() => viewType.value === 'view')
const isFeedbackDisabled = computed(() => {
  if (isShow.value) {
    return isShow.value
  } else if (viewType.value === 'handle') {
    return true
  } else if (viewType.value === 'edit') {
    return !isProblemCs.value
  } else if (viewType.value === 'changeDirector') {
    return true
  }
})
const isHandleDisabled = computed(() => {
  return isShow.value
})

const directorOptions = ref<any>([])
// 修改处理人
const directorForm = ref({
  id: '',
  updateUserId: ''
})
const handleChangeDirector = (director: any) => {
  directorForm.value.updateUserId = director.userId
}

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDrawer(async () => {
    dataValue.value = { ...new DataItem(), ...item };
    if (item.id) {
      try {
        directorForm.value.id = item.id
        loading.value = true
        const data = await problemFeedbackApi.getDetailsById({ id: item.id })
        if (data) {
          dataValue.value = data
          imageList.value = dataValue.value.image
          ? JSON.parse(dataValue.value.image).map((el) => ({ url: el }))
          : []
          directorForm.value.updateUserId = dataValue.value.directorId
          directorOptions.value = [{ userId: dataValue.value.directorId, realName: dataValue.value.directorName, avatarOrigin: dataValue.value.directorAvatarOrigin }]
        }
      } finally {
        loading.value = false
      }
    }else{
      // 当前登录用户
      const { userNo, realName } = userStore.user
      dataValue.value.feedbackPersonId = String(userNo)
      dataValue.value.feedbackPersonName = String(realName)
      const today = dayjs().format('YYYY-MM-DD')
      dataValue.value.feedbackDate = today
    }

    // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
    bukValue.value = cloneDeep({ ...dataValue.value });
    viewType.value = type;
  }, () => {
    nextTick(() => {
      formRef?.value?.clearValidate();
    });
  });
};

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
  issueExistence: [{ required: true, message: '请选择问题是否存在', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }, { validator: validateStatus, trigger: 'change' }],
  latestProgress: [{ required: true, message: '请输入最新进展', trigger: 'change' }],
})

// 根据部门查分类
const categoryList = ref<any>(getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_CATEGORY, true))
const getCategoryByDept: any = async () => {
  const { handleDept } = dataValue.value
  dataValue.value.category = ''
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
  const { handleDept, category } = dataValue.value
  dataValue.value.type = ''
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
  dataValue.value.directorId = ''
  dataValue.value.directorName = ''
  dataValue.value.directorAvatarOrigin = ''
}
const getProblemDirector = () => {
  const { handleDept, category, type } = dataValue.value
  if (handleDept && category && type) {
    problemFeedbackApi.selectDirectorList({ handleDept, category, type }).then((res: any) => {
      if (res && res.length) {
        dataValue.value.directorId = res[0].userId
        dataValue.value.directorName = res[0].name
        dataValue.value.directorAvatarOrigin = res[0].avatarOrigin
      } else {
        clearDirectors()
      }
      formRef.value?.validateField('directorName')
    })
  }
}


// 通用表单校验
const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  });
};

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue();
  if(viewType.value === 'handle') await handleFormRef.value?.validate()
  loading.value = true;
  valid && submit();
};

// 实际提交（防抖）
const submit = debounce(async () => {
  try {
    if (viewType.value === 'handle') {
      const params = { ...dataValue.value }
      // 处理
      problemFeedbackApi.handleProblem(params).then(() => {
        message.success('处理完成')
        loading.value = false
        detailsRef?.value?.closed();
        onSearch();
      }).catch(() => {
        loading.value = false
      })
    } else if (viewType.value === 'changeDirector') {
      problemFeedbackApi.updateHandleUser(directorForm.value).then((res: any) => {
        message.success('修改完成')
        loading.value = false
        detailsRef?.value?.closed();
        onSearch();
      }).catch(() => {
        loading.value = false
      })
    } else {
      let params
      if (isProblemDirector.value) {
        params = { ...dataValue.value }
      } else {
        const image = imageList.value?.map((item) => item.url) || ''
        params = { ...dataValue.value, image: JSON.stringify(image) }
        delete params.status
      }
      problemFeedbackApi.saveOrUpdate(params).then((res: any) => {
        message.success('保存成功')
        loading.value = false
        detailsRef?.value?.closed();
        onSearch();
      }).catch(() => {
        loading.value = false
      })
    }
  } catch {
    loading.value = false
  }
}, 500);

defineExpose({ openView });

provide('ListDetails', { dataValue, bukValue, viewType, title });

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */

</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
