<!--
 * @Date: 2025-02-11 18:11:15
-->
<template>
  <div class="plan-detail">
    <FormTitle title="货品编码" />
    <el-form :model="localForm" label-width="auto" :inline="true">
      <el-form-item label="货品编码" style="width: 330px" prop="productCode">
        <el-input v-model="localForm.productCode" clearable />
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'
import FormTitle from './formTitle.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['update:modelValue'])

const localForm = ref({ ...props.modelValue })

let isInternalUpdate = false

watch(
  () => props.modelValue,
  (newForm) => {
    if (!isInternalUpdate) {
      localForm.value = { ...newForm }
    }
    isInternalUpdate = false
  },
  { deep: true, immediate: true }
)

watch(
  localForm,
  (newLocalForm) => {
    isInternalUpdate = true
    emit('update:modelValue', newLocalForm)
  },
  { deep: true }
)
</script>

<style scoped>
.plan-detail {
  width: 100%;
  min-height: 100px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
}
</style>
