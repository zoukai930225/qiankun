<template>
    <el-form  :model="form">
        <sw-input-number v-model="form.num"  prop="num" label="数量" required ref="inputRef" :form-item="true">
          <template #prefix>
              <div>11</div>
          </template>
        </sw-input-number>
        <sw-form-item prop="num1" label="数量1" required :validateTrigger="['blur']">
            <template #default>
                   <!-- <el-input v-model="form.num1" ref="inputRef" /> -->
                  <sw-input-number v-model="form.num"  ref="inputRef" :form-item="false" />
            </template>
        </sw-form-item>
     <el-button @click="test">测试</el-button>
    </el-form>
</template> 

<script lang="ts" setup>
import swInputNumber from '@/components/common/inputNumber/index.vue'
import swFormItem from '@/components/common/formItem/SWFormItem.vue'
const inputRef = ref< InstanceType<typeof swInputNumber> | null>(null)
const form = ref({
  num: 1,
  num1:2,
})
const test =() =>{
  inputRef.value?.focus()
  setTimeout(() => {
     inputRef.value?.blur()
  }, 1000);
}

</script>
