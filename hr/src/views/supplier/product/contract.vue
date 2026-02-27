<template>
  <el-card class="!border-0 mb-20px !rounded-8px" shadow="never">
    <div class="flex items-center">
      <span class="font-size-14px supplierName">
        <span class="color-#666">供应商：</span>
        <span class="color-#333">
          {{ pageInfo.secondFullCompany }}
          <span v-if="pageInfo.abbreviationCompany">（{{ pageInfo.abbreviationCompany }}）</span>
        </span>
      </span>

      <span class="font-size-14px flex items-center mr-30px">
        <span class="color-#666">业务状态：</span>
        <span
          class="flex items-center px-16px py-4px rounded-14px"
          :style="{ backgroundColor: statusConfig?.bg, color: statusConfig?.color }"
        >
          <component :is="statusConfig?.icon" />
          <span class="ml-6px lh-20px">{{ statusConfig?.label }}</span>
        </span>
      </span>

      <span class="font-size-14px flex items-center mr-30px">
        <span class="color-#666">签约人：</span>
        <span class="flex items-center">
          <component :is="person(undefined, undefined, pageInfo.secondName)" />
        </span>
      </span>

      <span class="font-size-14px flex items-center mr-30px">
        <span class="color-#666">手机号：</span>
        <span class="flex items-center"> {{ pageInfo.secondPhone }} </span>
      </span>

      <div class="ml-auto flex items-center">
        <component :is="easyBtnGroup(topBtnsConfig)" class="mr-12px" />
      </div>
    </div>
  </el-card>
  <special-card>
    <el-scrollbar ref="contentRef">
      <preview-page
        :print-info="pageInfo!"
        :is-add="isAdd"
        :is-edit="isEdit"
        :is-check="isCheck"
        ref="previewRef"
        @change:text="(val) => (pageInfo.text = val)"
        @change:frame-contract-date="(val) => (pageInfo.frameContractDate = val)"
        @change:frame-contract-no="(val) => (pageInfo.frameContractNo = val)"
      />
    </el-scrollbar>

    <template #footer>
      <el-button @click="handleBack">返回</el-button>
    </template>
  </special-card>
</template>
<script lang="tsx" setup>
import previewPage from './components/previewPage.vue'
import { getContractInfoApi } from '@/api/supplier/purchase'
import specialCard from '../components/specialCard.vue'
import { downloadByUrl2 } from '@/utils/download'
import { formatDate } from '@/utils/formatTime'
import { useTagsView } from '@/hooks/web/useTagsView'
import {
  downloadContractApi,
  getContractInfoByIdApi,
  remindSignApi,
  saveAndSendContractApi,
  saveContractApi,
  sendToSignApi
} from '@/api/supplier/contract'
import { CONTRACT_STATUS, statusOps } from '../contract/options'
import { easyBtnGroup, person } from '../components/twoFourSix'
import { Icon } from '@/components/Icon'

const message = useMessage()
const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsView()

const emit = defineEmits<{
  (e: 'update:model-value', value: boolean | undefined): void
}>()

const previewRef = ref<InstanceType<typeof previewPage>>()
const pageInfo = ref<Supplier.Contract.ScPoContractPageVo>({})
const contentRef = ref<InstanceType<any>>()

const isAdd = computed(
  () =>
    route.name === 'PurchaseContract' &&
    ((route.query.poStatus === '10' &&
      (!statusConfig.value || statusConfig.value?.value === CONTRACT_STATUS.DRAFT)) ||
      (route.query.poStatus === '14' && statusConfig.value?.value === CONTRACT_STATUS.DRAFT))
)
const isEdit = computed(() => route.name === 'SupplierContractEdit')
const isCheck = computed(
  () =>
    route.name === 'SupplierContractCheck' ||
    (route.query.poStatus === '14' && statusConfig.value?.value !== CONTRACT_STATUS.DRAFT)
)

const topBtnsConfig = computed(() => {
  const node = {
    [String(isAdd.value)]: 'SupplierProduct:MyOrder:Contract',
    [String(isEdit.value)]: 'SupplierContract:Edit',
    [String(isCheck.value)]: 'SupplierContract:Check'
  }['true']

  return [
    {
      label: '保存',
      onClick: handleSave,
      page: isAdd.value || isEdit.value,
      permission: `${node}:Save`,
      type: 'primary'
    },
    {
      label: '保存并发送',
      onClick: handleSubmit,
      page: isAdd.value || isEdit.value,
      permission: `${node}:Save&Send`,
      type: 'primary'
    },
    {
      label: '催签',
      onClick: handleRemind,
      permission: `${node}:Remind`,
      type: 'primary',
      page: pageInfo.value.status === CONTRACT_STATUS.PENDING,
      loading: remindLoading.value
    },
    {
      label: '重发',
      onClick: handleReSend,
      permission: `${node}:Resend`,
      type: 'primary',
      page: pageInfo.value.status === CONTRACT_STATUS.ERROR
    },
    {
      label: '下载',
      onClick: handleDownload,
      type: 'primary',
      icon: <Icon icon="ep:download"></Icon>,
      loading: exportLoading.value,
      plain: true
    }
  ]
})

async function handleSave() {
  await previewRef.value?.validate()
  const loading = ElLoading.service({
    text: '合同数据保存中...'
  })

  try {
    const res = await saveContractApi(pageInfo.value)

    if (res && res.success) {
      message.success('保存成功！')
      handleBack()
    }
  } catch (error: any) {
    throw new Error(error)
  } finally {
    loading.close()
  }
}
async function handleSubmit() {
  await previewRef.value?.validate()
  const loading = ElLoading.service({
    text: '合同数据保存并发送中...'
  })

  try {
    const res = await saveAndSendContractApi(pageInfo.value)

    if (res && res.success) {
      message.success('保存并发送成功！')
      handleBack()
    }
  } catch (error: any) {
    throw new Error(error)
  } finally {
    loading.close()
  }
}

const remindLoading = ref(false)
async function handleRemind() {
  if (remindLoading.value) return
  remindLoading.value = true
  try {
    const res = await remindSignApi(pageInfo.value.id!)
    if (res && res.success) {
      message.success('催签消息已发出！')
    }
  } catch (error) {
  } finally {
    const timer = setTimeout(() => {
      remindLoading.value = false
      clearTimeout(timer)
    }, 500)
  }
}

async function handleReSend() {
  const loading = ElLoading.service({
    text: '正在发送...'
  })

  try {
    const res = await sendToSignApi(pageInfo.value.id!)

    if (res && res.success) {
      message.success('发送成功！')
      handleBack()
    }
  } catch (error) {
  } finally {
    loading.close()
  }
}

async function handleOpen() {
  try {
    await getInfo()
    previewRef.value?.onOpen()

    nextTick(() => {
      const target = (contentRef.value?.$el as HTMLElement).querySelector(
        '.el-scrollbar__view'
      ) as HTMLElement
      Object.assign(target.style, {
        maxHeight: 'calc(100vh - 187px - 80px)'
      } as Partial<CSSStyleDeclaration>)
    })
  } catch (error) {
    throw new Error('获取信息失败')
  }
}

async function getInfo() {
  const loading = ElLoading.service({
    target: 'body',
    text: '数据加载中，请稍后...'
  })
  try {
    const api = {
      [String(isAdd.value || (isCheck.value && route.query.from === 'SupplierAppointmentIndex'))]:
        getContractInfoApi,
      [String(isEdit.value || (isCheck.value && route.query.from !== 'SupplierAppointmentIndex'))]:
        getContractInfoByIdApi
    }['true']

    const res = await api(route.params.id as string)
    if (res) {
      pageInfo.value = res
    }
  } catch (error) {
    throw new Error('获取信息失败')
  } finally {
    loading.close()
  }
}

const exportLoading = ref(false)
async function handleDownload() {
  if (exportLoading.value) return
  exportLoading.value = true
  try {
    const res = await downloadContractApi(pageInfo.value.id!)
    if (res.success) {
      downloadByUrl2(res.data, `采购合同_${formatDate(new Date(), 'YYYYMMDDHHmmss')}`)

      message.success('合同导出成功！')
    }
  } catch (error) {
  } finally {
    const timer = setTimeout(() => {
      exportLoading.value = false
      clearTimeout(timer)
    }, 500)
  }
}

function handleBack() {
  tagsViewStore.closeCurrent()

  router.push({ name: route.query.from as string })
}

const statusConfig = computed(() => {
  return statusOps.find((ele) => ele.value === (pageInfo.value.status || '0'))
})

onMounted(handleOpen)
</script>
<style lang="less" scoped>
.supplierName {
  display: flex;
  align-items: center;
  &::after {
    content: '';
    display: block;
    height: 20px;
    border-right: 1px solid #e5e5e5;
    margin: 0 16px;
  }
}
</style>

<style lang="less">
.contract-content {
  display: none !important;
}
</style>
