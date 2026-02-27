<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <el-dialog
    v-model="visible"
    :width="width"
    :before-close="handleClose"
    class="oadialog-background"
    :append-to-body="true"
  >
    <div>
      <div
        class="dialog-content"
        style="width: 580px; height: 100px; padding: 20px; box-sizing: border-box"
      >
        <el-form
          ref="ruleFormRef"
          :model="form"
          label-width="auto"
          style="max-width: 580px"
          :rules="rules"
        >
          <el-form-item label="采购负责人" prop="procurementManagerId">
            <template #label>
              <span class="custom-require">*</span>
              <span>采购负责人</span>
            </template>
            <SWSelectPeople
              :isEdit="!forbidEdit"
              v-model:modelValue="form[`procurementManagerIdList`]"
              :getSearchList="remoteMethod"
              @select-people-change="selectPeopleChange()"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template #header="{}">
      <div class="my-header">
        <img src="@/assets/imgs/oa/yangyishangchuan-title.png" class="shenhe-title" />
        <span>{{ dialogTitle }}</span>
      </div>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog">提交</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import {
  getPurchaseManagerById,
  updateDistributeProcurementManager
} from '@/api/oa/package/designGallery/index'
import SWSelectPeople from '@/views/OA/package/develop/components/SWSelectPeople.vue'

import * as CommonApi from '@/api/common'

const message = useMessage() // 消息弹窗

const props = defineProps({
  forbidEdit: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    required: false
  },

  width: {
    type: String,
    default: '620px'
  },
  designInfo: {
    type: Object as PropType<any>,
    default: () => {}
  }
})
const dialogTitle = ref('')
const form = reactive({
  procurementManagerId: undefined,
  procurementManagerIdList: undefined
})

const selectItem = ref()
const open = async (data: any) => {
  dialogTitle.value = data.nodeName || ''
  selectItem.value = data || {}
  form.procurementManagerId = undefined
  form.procurementManagerIdList = undefined
  visible.value = true
  getDesignDetail()
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const getDesignDetail = async () => {
  try {
    const res = await getPurchaseManagerById(props.designInfo.productPlanId)
    form.procurementManagerIdList = res.purchaseManagers || []
  } catch (error) {
    console.log('error', error)
  }
}

const rules = reactive({
  // examineRemark: [{ required: true, message: '请填写备注', trigger: 'blur' }]
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const peopleList = ref([])
const remoteMethod = async (value) => {
  if (peopleList.value.length > 0) {
    return peopleList.value
  }

  const data = await CommonApi.getPersonByOpenId('1')
  peopleList.value = data || []
  return data || []
}

// 更新选择的人
const selectPeopleChange = () => {
  const codeList = form && form[`procurementManagerIdList`]
  console.log('codeList', codeList)
  if (codeList && codeList.length > 0) {
    const userIds = codeList.map((item) => item.userId) || []
    form.procurementManagerId = userIds.join(',')
    form.procurementManagerIdList = codeList
  } else {
    form.procurementManagerId = undefined
    form.procurementManagerIdList = undefined
  }
}

const handleClose = () => {
  form.procurementManagerId = undefined
  form.procurementManagerIdList = undefined

  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}

const ruleFormRef = ref()
const confirmDialog = async () => {
  if (!form.procurementManagerId) {
    message.error('请选择采购主管')
    return
  }

  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        purchaseManagerId: form.procurementManagerId,
        productPlanId: props.designInfo.productPlanId //开发计划id
      }
      await updateDistributeProcurementManager(data)
      message.success('操作成功')
      emit('confirm', data)
      emit('update:modelValue', false)
      handleClose()
    } else {
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;

  .shenhe-title {
    width: 14px;
    height: 16px;
    margin-right: 6px;
    margin-top: 3px;
  }
}

.custom-require {
  color: red;
  margin-right: 3px;
  font-size: 15px;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}
</style>

<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
  }
}
</style>
