<template>
  <div class="p3">
    <div class="p2">输入框</div>
    <div class="p2">
      <p class="p2">原生输入框</p>
      <div style="width: 240px;">
        <sw-text-input v-model="text1" />
      </div>
    </div>
    <div class="p2">
      <p class="p2">超出长度显示...，悬浮展示全量信息</p>
      <div style="width: 240px;">
        <sw-text-input v-model="text2" disabled />
      </div>
    </div>
    <div class="p2">
      <p class="p2">未超出不展示</p>
      <div style="width: 240px;">
        <sw-text-input v-model="text3" disabled />
      </div>
    </div>

    <div class="p2">
      <div class="p2">表单, 带正则校验</div>
      <el-form ref="formRef" :model="formModel" label-width="80" inline>
        <sw-text-input autofocus v-model="formModel.name" required prop="name" label="姓名"></sw-text-input>
        <sw-text-input v-model="formModel.phone" required prop="phone" label="手机号码"></sw-text-input>
        <sw-text-input v-model="formModel.email" prop="email" label="邮箱"
          :pattern="/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/"></sw-text-input>
        <sw-text-input v-model="formModel.result" prop="result" label="最终测试结果"></sw-text-input>
      </el-form>
      <el-button @click="confirm">提 交</el-button>
    </div>

  </div>
</template>

<script lang="ts" setup>
import SwTextInput from './index.vue';
const text1 = ref('测试测试测试测试测试测试测测试测试测试测试测试测试测')
const text2 = ref('测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试')
const text3 = ref('测试测试测试测试测')
const text4 = ref('')
const formModel = ref({
  name: '',
  email: '',
  phone: '',
  result: '',
  msg: ''
})
const formRef = ref()

const confirm = () => {
  formRef?.value?.validate(valid => {
    if (valid) {
      formModel.value.msg = '校验成功'
    } else {
      formModel.value.msg = '校验失败'
    }
  })
}

</script>

<style lang="scss">
.app-container {
  padding: 20px;
}
</style>