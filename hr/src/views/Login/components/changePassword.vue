<template>
  <SWDialog v-model="dialogVisible" width="600" :title="dialogTitle" :showTitleLine="true" :showBottomLine="true"
    v-loading="loading" @close="close">
    <el-form :model="params" labelWidth="120" class="mt10px" :rules="formRule" ref="formRef">
      <el-input type="password" v-show="false"/>
      <el-form-item label="新密码:" prop="newPassword">
        <el-input v-model.trim="params.newPassword" autocomplete="off" type="password" placeholder="请输入新密码" clearable auto-complete="new-password"  show-password/>
      </el-form-item>
      <el-form-item label="确认密码:" prop="confirmPassword">
        <el-input v-model.trim="params.confirmPassword" autocomplete="off" type="password" placeholder="请确认新密码" clearable auto-complete="new-password"  show-password/>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class=" mr10px mt10px">
        <el-button @click="close">取消</el-button>
        <el-button @click="handleSubmit" type="primary" >提交</el-button>
      </div>
    </template>
  </SWDialog>
 
</template>
<script lang="ts" setup>
import request from '@/config/axios'
import { debounce } from 'lodash-es'
const emit = defineEmits(['success'])
const message = useMessage()
const params = ref<any>({})
const dialogVisible = ref(false);
const dialogType = ref()
const dialogTitle = ref()
const loading = ref(false)
const open = (type?: string, row?: any) => {
  dialogVisible.value = true
  dialogType.value = type
  dialogTitle.value = '修改密码'
  params.value.id = row.userId
  params.value.newPassword = ''
  params.value.confirmPassword = ''
  formRef.value?.resetFields()
}

const close = () => {
  params.value.newPassword = ''
  params.value.confirmPassword = ''
  dialogVisible.value = false
}
const formRef = ref()
const validatePassword = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入新密码'))
  } else if (value.length < 8 || value.length > 16) {
    callback(new Error('密码长度必须在8-16位之间'))
  }else if( value === '00000000'){
    callback(new Error('密码不能为00000000'))
  } else {
    callback()
  }
}
const validateConfirmPass = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请确认新密码'))
  } else if (value !== params.value.newPassword) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}
const formRule = reactive({
  newPassword:[{ required:true,validator:validatePassword,trigger:['blur','change'] }],
  confirmPassword:[{ required:true,validator:validateConfirmPass,trigger:['blur','change'] }]
})

const handleSubmit = debounce(async()=>{
  await formRef.value?.validate()
  console.log(params.value)
  const data = {
    id:params.value.id,
    password:params.value.newPassword
  }
  request.post({
    url:'/api/user/updatePassword',
    data
  }).then(res=>{
    message.success('修改密码成功')
    emit('success')
    close()
  })
})
defineExpose({
  open
})

</script>
<style lang="scss" scoped>


</style>