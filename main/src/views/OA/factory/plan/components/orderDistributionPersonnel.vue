<template>
  <el-dialog ref="dialogRef" title="下单人员分配" v-model="dialogVisible" append-to-body :show-close="false" top="40vh" width="520"
    style="border-radius: 8px;
      transform: none;
      position: static;
      margin-top: var(--el-dialog-margin-top) !important;
      padding: 0 0 20px 0;">
    <template #header>
      <div class="header" style="display: flex;
        align-items: center;
        justify-content: space-between;
        font-weight: bold;
        padding: 16px 20px;
        border-bottom: solid #f0f0f0 1px;
      ">
        <div>下单人员分配</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
      </div>
    </template>
    <div style="padding: 0 16px;">
      <el-form :model="formData" label-width="80px" ref="formRef" :validate-on-rule-change="false" :rules="{
        assignedOrderPersonnels: [{ required: true, message: '请选择下单人员', trigger: 'change' }]
      }">
        <el-form-item label="下单人员" prop="assignedOrderPersonnels">
          <SWSelectPeople :isEdit="isEdit" :deptCode="'NEW_DEPT_PURCHASE'" :multiple="true"
            v-model:modelValue="formData.assignedOrderPersonnels" />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div style="border-top: solid #f0f0f0 1px;padding-top: 20px;padding-right: 20px;margin-top: -14px;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">提 交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import * as factoryPlanApi from '@/api/oa/factory/plan'
import SWSelectPeople from '@/views/OA/factory/components/selectPeople.vue'
import * as SystemConstantApi from '@/api/system/systemConstant'
import * as CommonApi from '@/api/common'
const message = useMessage()
const emit = defineEmits(['success'])
const dialogVisible = ref(false)
const dialogRef = ref()
const formRef = ref()
const formData = ref({
  fsTaskId: '',
  supplierId: '',
  assignedOrderPersonnels: []
})

const isEdit = ref(false)
const open = async (taskId: string, suppId: string, isNodeInProgress: boolean) => {
  dialogVisible.value = true
  formData.value.fsTaskId = taskId
  formData.value.supplierId = suppId
  await getPersonList()
  getDetail()
  isEdit.value = isNodeInProgress
}

const handleClosed = () => {
  dialogVisible.value = false
}

const submit = () => {
  formRef?.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const data = { ...formData.value }
        data['assignedOrderPersonnelIds'] = data.assignedOrderPersonnels.map((item: any) => item.userId)
        await factoryPlanApi.assignOrderPersonnel(data)
        message.success('下单人员分配成功')
        handleClosed()
        emit('success')
      } catch (e) {

      }
    }
  })
}

const personList = ref<any>([])
const getPersonList = async ()=>{
  try{
    const openId = await SystemConstantApi.getSystemConstantConfigbyCode('NEW_DEPT_PURCHASE')
    const list = await CommonApi.getPersonByOpenId(openId)
    personList.value = list
  }finally{

  }
  
}

const getDetail = async () => {
  const data = await factoryPlanApi.queryDetail(formData.value.fsTaskId,formData.value.supplierId )
  formData.value.assignedOrderPersonnels = data?.assignedOrderPersonnelId ? personList.value.filter((item :any) => data.assignedOrderPersonnelId.split(',').includes(item.userId)) : []
}

defineExpose({ open })
</script>

<style lang="scss">
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;

  img {
    width: 14px;
    cursor: pointer;
  }
}
</style>