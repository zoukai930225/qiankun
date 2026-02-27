<template>
  <special-card shadow="never" v-loading="loading" class="relative">
    <add-form ref="queryFormRef" v-model:form-data="formData">
      <template #gotoAuditLogBtn>
        <!-- 查看审核记录 -->
        <div class="auditLog" v-if="isHaveAuditLog">
          <component :is="easyBtnGroup(topBtns)" />
        </div>
      </template>
    </add-form>
    <add-table ref="addTableRef" v-model:data="tableData" :table-options="tableOptions" />

    <template #footer>
      <el-button @click="handleBack">返回</el-button>
      <component :is="easyBtnGroup(footerBtns)" />
    </template>
  </special-card>

  <el-dialog title="预约发货审核" v-model="auditFormVisible">
    <el-form ref="auditFormRef" :model="auditForm">
      <el-form-item
        label="审核意见"
        prop="auditComment"
        :rules="
          auditForm.auditFlag === '2'
            ? [{ required: true, message: '请填写审核意见', trigger: 'blur' }]
            : []
        "
      >
        <s-text-area v-model="auditForm.auditComment" placeholder="请填写审核意见" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitAudit">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </template>
  </el-dialog>
  <!-- 审核记录 -->
  <auditLogDrawer
    ref="auditLogDrawerRef"
    time-key="auditTime"
    status-key="auditType"
    person-key="auditUserName"
    comment-key="auditComment"
    descKey="auditTypeTxt"
    :is-no-pass="(status) => status === 3"
    :is-pass="(status) => status === 2"
    :is-recall="(status) => status === 4"
    :is-submit="(status) => status === 1"
  />
</template>
<script lang="tsx" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { useTagsView } from '@/hooks/web/useTagsView'
import AddTable from './components/addTable.vue'
import AddForm from './components/addForm.vue'
import specialCard from '../components/specialCard.vue'
import auditLogDrawer from '@/views/supplier/appointment/components/auditLogDrawer.vue'

import {
  updateAppointApprove,
  getAdvancedShippingRequestOrderById
} from '@/api/supplier/appointAudit'
import { cloneDeep } from 'lodash-es'
import { easyBtnGroup } from '../components/twoFourSix'

defineOptions({ name: 'PurchaseAppointmentOrderAudit' })

const props = withDefaults(
  defineProps<{
    isStorageReceiving?: boolean
    tableOptions?: TableOption
  }>(),
  {
    isStorageReceiving: false
  }
)

const router = useRouter()
const route = useRoute()
const message = useMessage()
const tagsViewStore = useTagsView()

const formData = ref<Supplier.Product.UpdateParams>({})
const tableData = ref<Supplier.Appoint.ScAdvancedShippingRequestOrderDetail[]>([])

const loading = ref(false)
const oldFormData = ref<typeof formData.value>({})

// 查看审核记录
const isHaveAuditLog = ref(false)
const auditLogDrawerRef = ref()
const gotoAuditLog = () => {
  auditLogDrawerRef.value?.open(route.query.id)
}

// 审核
const auditType = (route.query.type as string) || ''
const auditForm = ref({
  auditComment: '',
  auditFlag: ''
})
const auditFormRef = ref()
const auditFormVisible = ref(false)
const topBtns = computed(() => {
  return [
    {
      label: '查看审核记录',
      type: 'primary',
      onClick: gotoAuditLog,
      permission: `SupplierAppointmentAudit:Audit:AuditLog`
    }
  ]
})
const footerBtns = computed(() => {
  const btns = [
    {
      label: '审核不通过',
      type: 'danger',
      onClick: () => handleAudit('2'),
      permission: `SupplierAppointmentAudit:Audit:NoPass`,
      page: auditType === 'audit'
    },
    {
      label: '审核通过',
      type: 'primary',
      onClick: () => handleAudit('1'),
      permission: `SupplierAppointmentAudit:Audit:Pass`,
      page: auditType === 'audit'
    }
  ]

  return btns
})

async function handleBack() {
  const name = !props.isStorageReceiving ? 'SupplierAppointmentAudit' : 'SupplierStorageReceiving'
  router.push({ name })
}

async function handleAudit(auditFlag) {
  auditFormVisible.value = true
  auditForm.value.auditFlag = auditFlag
}

const submitAudit = async () => {
  await auditFormRef.value?.validate()
  const params = {
    advancedShippingRequestOrderId: (route.query.id as string) || '',
    auditFlag: auditForm.value.auditFlag,
    auditComment: auditForm.value.auditComment
  }
  await updateAppointApprove(params)
  message.success('审核成功')
  auditFormVisible.value = false
  tagsViewStore.closeCurrent()
  router.push({ name: 'appointmentAudit' })
}
const cancel = () => {
  auditFormVisible.value = false
}
async function getDetail() {
  if (loading.value) return
  loading.value = true
  const id = (route.query.id as string) || ''
  try {
    const res = await getAdvancedShippingRequestOrderById(id)
    if (res) {
      formData.value = res
      tableData.value = res.scAdvancedShippingRequestOrderDetailList || []
      isHaveAuditLog.value = res.auditLogFlag === 1
    }
  } catch (error) {
  } finally {
    oldFormData.value = cloneDeep(formData.value)
    loading.value = false
  }
}

defineExpose({ getDetail })

onBeforeMount(() => {
  route.query.id && getDetail()
})

onActivated(() => {
  route.query.id && getDetail()
})
</script>
<style lang="less" scoped>
@import url(../index.scss);
:deep(.title) {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  font-weight: 600;

  &::before {
    content: '';
    display: block;
    margin-right: 6px;
    width: 3px;
    height: 10px;
    background-color: #0064ff;
  }
}

:deep(.el-divider) {
  width: calc(100% + 40px);
  margin: 20px -20px;
}

.auditLog {
  margin-left: auto;
}

:deep(.el-table__cell) {
  padding: 0;
}
</style>
