<template>
  <scheme-dialog ref="detailsRef" class="storageProblemFeedback" name="Storageproblemfeedback" width="800">
    <template #card>
      <div class="problem-feedback-details">
        <div class="problem-feedback-question">
          <div class="flex-start">
            <div class="problem-feedback-user">
              <img :src="dataValue.feedbackUserAvatarOrigin || DefaultAvatar" alt="" />
              <div>
                <div class="name">{{ dataValue.feedbackUserName }}</div>
                <div class="commit-date">{{ dataValue.createdAt }}</div>
              </div>
              <view class="badge badge-question">问</view>
            </div>
          </div>
          <div class="problem-feedback-content">
            <div class="problem-feedback-content-text">{{ dataValue.content }}</div>
          </div>
        </div>
        <template v-if="dataValue.feedbackReplyInfoList.length > 0">
          <div class="problem-feedback-reply" v-for="item in dataValue.feedbackReplyInfoList" :key="item.feedbackId">
            <div class="flex-end">
              <div class="problem-feedback-user">
                <div>
                  <div class="name">{{ item.replierUserName }}</div>
                  <div class="commit-date">{{ item.updatedAt }}</div>
                </div>
                <img :src="item.replierUserAvatarOrigin || DefaultAvatar" alt="" />
                <view class="badge badge-answer">答</view>
              </div>
            </div>
            <div class="problem-feedback-content">
              <!-- <div>{{ dataValue.replyContent }}</div> -->
              <div class="problem-feedback-content-text reply-feedback">{{ item.content }}</div>
            </div>
          </div>
        </template>
        <template v-else>
          <el-empty description="暂无回复内容" />
        </template>
      </div>
    </template>
    <template #button>
      <!-- <div> 按钮操作区 </div> -->
      <el-button @click="detailsRef?.close()" :disabled="loading" type="primary">关闭</el-button>
      <!-- <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button> -->
    </template>
  </scheme-dialog>
</template>

<script lang="tsx">
export default { name: 'StorageproblemfeedbackDetails' }
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type'
import { viewTypeCheck } from '@/components/template/config/index'
import { cloneDeep, debounce } from 'lodash-es'
import { DataItem } from '../page/config'
import request from '@/config/axios'
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'

const message = useMessage()

const { onSearch } = inject(`StorageproblemfeedbackForm`) as FromProvideType

const detailsRef = ref<any>(),
  formRef = ref(),
  dataValue = ref<Record<string, any>>({}),
  bukValue = ref<Record<string, any>>({}),
  viewType = ref<string>('view'),
  loading = ref<boolean>(false)

// const props = defineProps({
//   dicInfo: { type: Array<any>, default: () => [] },
// });

const title = computed(() => viewTypeCheck(viewType.value))

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDialog方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDialog(
    async () => {
      const res = await request.get({ url: `/api/whUserFeedbackProblemInfo/${item.id}` })
      dataValue.value = { ...res }
      viewType.value = type
    },
    () => {
      nextTick(() => {
        formRef?.value?.clearValidate()
      })
    }
  )
}

// 通用表单校验
const checkValue = async () => {
  return await formRef?.value?.validate((valid: boolean) => {
    return valid
  })
}

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue()
  valid && submit()
}

// 实际提交（防抖）
const submit = debounce(async () => {
  // loading.value = true;
  // request.post({ url: `/api/employeeMonthlyAssessment/update`, data: dataValue.value }).then(() => {
  //   message.success('操作成功');
  //   detailsRef?.value?.closed();
  //   onSearch();
  // }).finally(() => {
  //   loading.value = false;
  // });
}, 500)

defineExpose({ openView })

provide('StorageproblemfeedbackDetails', { dataValue, bukValue, viewType, title })

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
