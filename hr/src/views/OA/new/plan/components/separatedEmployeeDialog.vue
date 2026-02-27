<template>
  <div>
    <SWDialog
      v-if="visible"
      v-model="visible"
      :show-bottom-line="true"
      :showTitleLine="true"
      :title="title"
    >
      <div>
        <div class="dialog-content">
          <div class="flex-row form-wapper">
            <el-form ref="formRef" :model="localForm" :rules="formRules" label-width="90px">
              <el-form-item label="离职人员" class="formItem" prop="resignPerson">
                <SWSelectPeople
                  :isEdit="true"
                  :multiple="false"
                  v-model:modelValue="localForm[`resignPersonList`]"
                  type="operate"
                  :getSearchList="remoteMethod"
                  @save-select-people="saveSelectPeople(localForm, 'resignPerson')"
                />
              </el-form-item>
              <el-form-item label="交接人员" class="formItem" prop="handoverPerson">
                <SWSelectPeople
                  :isEdit="true"
                  :multiple="false"
                  v-model:modelValue="localForm[`handoverPersonList`]"
                  type="operate"
                  :getSearchList="remoteMethod"
                  @save-select-people="saveSelectPeople(localForm, 'handoverPerson')"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <template #footer>
        <div style="margin-top: 10px; margin-right: 15px">
          <el-button @click="handleClose">取消</el-button>
          <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog">提交</el-button>
        </div>
      </template>
    </SWDialog>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import { debounce } from 'lodash-es'

import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'

import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import { separatedEmployeeSubmit } from '@/api/oa/new/plan/index'

const message = useMessage() // 消息弹窗

const props = defineProps({
  title: {
    type: String,
    default: '离职人员交接'
  },
  width: {
    type: String,
    default: '560px'
  },
  forbidEdit: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const localForm = ref({
  resignPerson: '',
  resignPersonList: [],
  handoverPerson: '',
  handoverPersonList: []
})
const formRef = ref()

// 打开
const open = async () => {
  visible.value = true
  // remoteMethod()
}

defineExpose({ open })

onMounted(() => {})

const formRules = reactive({
  resignPerson: [{ required: true, message: '请选择离职人员', trigger: 'blur' }],
  handoverPerson: [{ required: true, message: '请选择交接人员', trigger: 'blur' }]
})

const personList = ref<any>([])

const remoteMethod = async (value) => {
  if (!value) {
    return []
  }
  const data = await PersonRosterApi.getPersonRosterList({ param: value }).catch(() => {})
  personList.value = (data && data.data) || []
  return data.data || []
}

const saveSelectPeople = async (row, fieldCode) => {
  row.editeCode = undefined
  row[`${fieldCode}`] =
    row[`${fieldCode}List`] && row[`${fieldCode}List`].map((item) => item.userId).join(',')
}

const handleClose = () => {
  // 将visible的值设置为false
  visible.value = false
  // 触发close事件
  emit('close')
}
const confirmDialog = debounce(async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  const data = {
    ...localForm.value
  }

  await separatedEmployeeSubmit(data)
  message.success('操作成功')
  emit('confirm')
  visible.value = false
})
</script>

<style lang="scss" scoped>
.dialog-content {
  background: #ffffff;
  border-radius: 20px;
  margin: 0 auto;
  padding-top: 20px;
  box-sizing: border-box;
  overflow: auto;
}
.formItem {
  width: 500px;
}
</style>
