<template>
  <salary ref="salaryRef">
    <template #othersBtns>
      <el-button type="primary" @click="openUnpackDialog">拦截件分配</el-button>
    </template>
  </salary>
</template>
<script lang="ts" setup>
import { getDictValue } from '@/utils/dict'
import Salary from './components/salary.vue'
import { useSalary } from '@/store/modules/storage'

defineOptions({ name: 'StorageSalaryUnpack' })

const salary = useSalary()

const salaryRef = ref()

function openUnpackDialog() {
  nextTick(() => {
    salaryRef.value.handleOpenUnpackDialog()
  })
}

onBeforeMount(() => {
  salary.currentRolesMask = getDictValue(DICT_TYPE.ROLES_MASK, '拆包员')
})
</script>
<style lang="less" scoped>
* {
  --el-select-width: 220px;
  --el-input-width: 220px;
  --el-date-editor-width: 220px;
  --el-color-primary: #0064ff;
}

.el-button {
  font-size: 12px;
  &.is-link {
    font-size: 14px;
  }
}
</style>
