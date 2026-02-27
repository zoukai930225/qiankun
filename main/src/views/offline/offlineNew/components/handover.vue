<template>
  <el-form ref="formRef" :model="form" :rules="formRules" label-width="80">
    <el-form-item prop="resignedUser" label="离职人员">
      <user-screen :item="form.resignedUser" id="userId" name="userName"></user-screen>
    </el-form-item>
    <el-form-item prop="handoverUser" label="交接人员">
      <user-screen :item="form.handoverUser" id="userId" name="userName"></user-screen>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import userScreen from '@/components/common/user/userScreen.vue'
import request from '@/config/axios'
const message = useMessage()
const props = defineProps({
  baseInfoId: {
    type: String,
    default: ''
  }
})

const checkResignedUser = (rule: any, value: any, callback: any) => {
  if (!value || !value.userId) {
    return callback(new Error('请选择离职人员'))
  }
  callback()
}

const checkHandoverUser = (rule: any, value: any, callback: any) => {
  if (!value || !value.userId) {
    return callback(new Error('请选择交接人员'))
  }
  callback()
}

const formRules = ref({
  resignedUser: [
    { required: true, validator: checkResignedUser, message: '请选择离职人员', trigger: 'change' }
  ],
  handoverUser: [
    { required: true, validator: checkHandoverUser, message: '请选择交接人员', trigger: 'change' }
  ]
})
const form = ref({
  resignedUser: {},
  handoverUser: {}
})

const formRef = ref(),
  loading = ref(false)
const submit = async () => {
  if (loading.value) return
  const valid = await formRef.value.validate()
  if (valid) {
    const { resignedUser, handoverUser } = form.value
    const resignedUserId = (resignedUser as any)?.userId || ''
    const handoverUserId = (handoverUser as any)?.userId || ''
    if (resignedUserId === handoverUserId) {
      message.notifyWarning('离职人员与交接人员相同！')
      return
    }
    await message.confirm(
      '是否确认更换离职人员？保存后，所有未结束的流程的相应人员将会更换为交接人员'
    )
    try {
      loading.value = true
      const data = {
        resignedUserId,
        handoverUserId
      }
      await request.post({ url: `/api/offline/np/base/handover`, data })
    } finally {
      loading.value = false
    }
  }
}

defineExpose({ submit })
</script>
