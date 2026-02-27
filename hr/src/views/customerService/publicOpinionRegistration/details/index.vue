<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2026-01-06 15:24:04
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-01-19 20:11:31
-->
<template>
  <scheme-details
    ref="detailsRef"
    name="PublicOpinionRegistration"
    :class="[
      'public-opinion-registration-details',
      viewType === 'view' ? 'public-opinion-registration-details-view' : ''
    ]"
    :title="title"
    :width="936"
  >
    <template #card>
      <!-- 登记信息表单 -->
      <RegistrationForm
        ref="registrationFormRef"
        v-model="dataValue"
        :disabled="registrationDisabled"
        :role-list="roleList"
      />

      <!-- 客服处理表单 -->
      <ServiceForm
        v-if="showServiceForm"
        ref="serviceFormRef"
        v-model="dataValue"
        :disabled="serviceDisabled"
        :status-disabled="serviceStatusDisabled"
        :role-list="roleList"
      />

      <!-- 公关处理表单 -->
      <PublicRelationsForm
        v-if="showPrForm"
        ref="prFormRef"
        v-model="dataValue"
        :disabled="prDisabled"
      />
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading">取消</el-button>
      <el-button
        v-if="showSubmitButton"
        type="primary"
        @click="submitForm"
        :disabled="loading"
        :loading="loading"
      >
        提交
      </el-button>
    </template>
  </scheme-details>
</template>

<script lang="tsx">
export default { name: 'PublicOpinionRegistrationDetails' }
</script>

<script lang="tsx" setup>
import { FromProvideType } from '@/components/template/config/type'
import { cloneDeep, debounce } from 'lodash-es'
import { DataItem } from '../page/config'
import request from '@/config/axios'
import RegistrationForm from './components/RegistrationForm.vue'
import ServiceForm from './components/ServiceForm.vue'
import PublicRelationsForm from './components/PublicRelationsForm.vue'
import { useUserStore } from '@/store/modules/user'
import dayjs from 'dayjs'
const message = useMessage()

const { onSearch, roleList, dictDataList } = inject(
  `PublicOpinionRegistrationForm`
) as FromProvideType & {
  roleList: Ref<any[]>
  dictDataList: Ref<Record<string, any[]>>
}

const detailsRef = ref<any>()
const registrationFormRef = ref<any>()
const serviceFormRef = ref<any>()
const prFormRef = ref<any>()

const dataValue = ref<DataItem>({ ...new DataItem() })
const bukValue = ref<DataItem>({ ...new DataItem() })
const viewType = ref<string>('view') // view | add | edit | service | pr
const loading = ref<boolean>(false)

const user: any = useUserStore().user || {}

// 标题计算
const title = computed(() => {
  const titleMap = {
    view: '详情',
    add: '新增',
    edit: '编辑',
    service: '客服处理',
    pr: '公关处理'
  }
  return titleMap[viewType.value] || '详情'
})

// 登记信息表单是否禁用
const registrationDisabled = computed(() => {
  // add、edit模式可编辑，其他模式禁用
  return !['add', 'edit'].includes(viewType.value)
})

// 是否显示客服处理表单
const showServiceForm = computed(() => {
  // service、pr模式显示
  return ['view', 'service', 'pr'].includes(viewType.value)
})

// 客服处理表单是否禁用
const serviceDisabled = computed(() => {
  // service模式可编辑
  return viewType.value !== 'service'
})

// 客服处理表单状态字段是否禁用
const serviceStatusDisabled = computed(() => {
  // pr模式下状态可编辑，service模式也可编辑
  return !['service', 'pr'].includes(viewType.value)
})

// 是否显示公关处理表单
const showPrForm = computed(() => {
  // pr模式显示
  return ['view', 'pr'].includes(viewType.value)
})

// 公关处理表单是否禁用
const prDisabled = computed(() => {
  // pr模式可编辑
  return viewType.value !== 'pr'
})

// 是否显示提交按钮
const showSubmitButton = computed(() => {
  // view模式不显示，已完成状态不显示
  if (viewType.value === 'view') return false
  // if (
  //   dataValue.value.status ===
  //   dictDataList.value['pi_status'].find((item: any) => item.label === '已完成')?.value
  // )
  //   return false
  return true
})

// 弹出通用
const openView = (item: any = {}, type: string = 'view') => {
  // detailsRef openDrawer方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  dataValue.value = { ...new DataItem(), ...item }
  // 处理数据回显
  if (item.id) {
    // 如果有舆情类型，转换为级联选择器需要的数组格式
    if (item.opinionType && item.secondaryCategory) {
      dataValue.value.opinionTypeArr = [item.opinionType, item.secondaryCategory] as any
    }
    // 人员类型选择框回显操作
    dataValue.value.followUpCustomerId =
      JSON.parse(item.followUpCustomers)?.map((item: any) => item.userId) || []
    dataValue.value.followUpCustomerInfo = JSON.parse(item.followUpCustomers)
    dataValue.value.publicOpinionPrInfo = {
      userId: item.publicOpinionPr,
      realName: item.publicOpinionPrName,
      avatarOrigin: item.publicOpinionPrAvatar
    }
    dataValue.value.deleterInfo = {
      userId: item.deleter,
      realName: item.deleterName,
      avatarOrigin: item.deleterAvatar
    }
    dataValue.value.sfDeleted == 1 &&
      !dataValue.value.deleteTime &&
      (dataValue.value.deleteTime = dayjs().format('YYYY-MM-DD HH:mm:ss'))
    dataValue.value.sfReply == 1 &&
      !dataValue.value.replyTime &&
      (dataValue.value.replyTime = dayjs().format('YYYY-MM-DD HH:mm:ss'))
  } else {
    // 新增时，设置默认状态为待开始
    dataValue.value.status = dictDataList.value['pi_status'].find(
      (item: any) => item.label === '待开始'
    )?.value
    dataValue.value.publicOpinionPr = 'ou_753055f2d7581753ff624cc8e2721f5e'
  }

  detailsRef?.value?.openDrawer(
    async () => {
      // service模式：被领取后自动设置状态为进行中
      if (
        type === 'service' &&
        dataValue.value.status ===
          dictDataList.value['pi_status'].find((item: any) => item.label === '待开始')?.value
      ) {
        dataValue.value.status = dictDataList.value['pi_status'].find(
          (item: any) => item.label === '进行中'
        )?.value
      }

      // bukValue为备份数据，用以处理已操作未保存数据校验，慎重！！！
      bukValue.value = cloneDeep({ ...dataValue.value })
      viewType.value = type
    },
    () => {
      nextTick(() => {
        registrationFormRef?.value?.clearValidate()
        serviceFormRef?.value?.clearValidate()
        prFormRef?.value?.clearValidate()
      })
    }
  )
}

// 通用表单校验
const checkValue = async (): Promise<boolean> => {
  let valid = true

  try {
    // 根据不同模式验证不同表单
    if (viewType.value === 'add' || viewType.value === 'edit') {
      // 新增/编辑：只验证登记信息
      valid = await registrationFormRef?.value?.validate()
    } else if (viewType.value === 'service') {
      // 客服处理：验证客服处理表单
      valid = await serviceFormRef?.value?.validate()
    } else if (viewType.value === 'pr') {
      // 公关处理：验证公关处理表单（状态字段在客服处理表单中，也需要验证）
      // const serviceValid = await serviceFormRef?.value?.validate()
      valid = await prFormRef?.value?.validate()
    }
  } catch {
    valid = false
  }

  return valid
}

// 提交
const submitForm = async () => {
  const valid: boolean = await checkValue()
  valid && submit()
  // submit()
}

// 实际提交（防抖）
const submit = debounce(async () => {
  loading.value = true
  try {
    // 处理舆情类型数据
    const submitData: any = { ...dataValue.value }

    // 从级联选择器的值中提取舆情类型和二级分类
    if (dataValue.value.opinionTypeArr) {
      submitData.opinionType = dataValue.value.opinionTypeArr[0]
      submitData.secondaryCategory = dataValue.value.opinionTypeArr[1] || ''
    }

    // 处理 各选人入参格式
    submitData.followUpCustomerIds =
      submitData.followUpCustomerInfo?.map((item: any) => item.userId).join(',') || ''
    submitData.followUpCustomers = JSON.stringify(
      submitData.followUpCustomerInfo?.map((item: any) => {
        return {
          userId: item.userId,
          realName: item.realName,
          avatarOrigin: item.avatarOrigin
        }
      })
    )
    submitData.publicOpinionPrName = submitData.publicOpinionPrInfo?.realName || ''
    submitData.publicOpinionPrAvatar = submitData.publicOpinionPrInfo?.avatarOrigin || ''

    if (viewType.value === 'add') {
      submitData.registerDate = dayjs().format('YYYY-MM-DD HH:mm:ss')
      submitData.registrant = user.userNo
      submitData.registrantName = user.realName
      submitData.registrantAvatar = user.avatarUrl
    }
    if (submitData.followUpCustomerIds.includes(submitData.publicOpinionPr)) {
      message.error('所属客服分配了公关人员，请修改后重新提交!!!')
      return
    }
    if (viewType.value === 'service') {
      submitData.deleter = submitData.deleterInfo?.userId
      submitData.deleterName = submitData.deleterInfo?.realName
      submitData.deleterAvatar = submitData.deleterInfo?.avatarOrigin
      submitData.sfReply == 1 &&
        !submitData.replyTime &&
        (submitData.replyTime = dayjs().format('YYYY-MM-DD HH:mm:ss'))
      submitData.sfDeleted == 1 &&
        !submitData.deleteTime &&
        (submitData.deleteTime = dayjs().format('YYYY-MM-DD HH:mm:ss'))
    }
    // 删除空字段
    Object.keys(submitData).forEach((key) => {
      // if (submitData[key] === '' || submitData[key] === null || submitData[key] === undefined) {
      //   delete submitData[key]
      // }
      // 防止编辑后 非必填字段清空不了
      if (submitData[key] === undefined) {
        submitData[key] = ''
      }
    })
    // 删除提交不需要的字段
    delete submitData.followUpCustomerId
    delete submitData.followUpCustomerInfo
    delete submitData.followUpCustomerName
    delete submitData.opinionTypeArr
    delete submitData.publicOpinionPrInfo
    delete submitData.deleterInfo
    let url = '/api/publicOpinionInfo/saveOrUpdate'
    await request.post({ url, data: submitData })

    message.success('操作成功')
    detailsRef?.value?.closed()
    onSearch()
  } catch (error) {
    console.error('提交失败:', error)
  } finally {
    loading.value = false
  }
}, 500)
watch(
  dataValue,
  (newVal) => {
    console.log(newVal, 'newVal')
  },
  { deep: true, immediate: true }
)
defineExpose({ openView })

provide('PublicOpinionRegistrationDetails', { dataValue, bukValue, viewType, title })

/**************************************以上文件文件内容非必要不可删除，按需追加使用******************************************************* */
</script>
<style lang="scss" scoped>
@use './styles.scss';
</style>
