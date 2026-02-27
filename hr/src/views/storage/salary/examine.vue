<template>
  <salary />
</template>
<script lang="ts" setup>
import { getDictValue } from '@/utils/dict'
import Salary from './components/salary.vue'
import { useSalary } from '@/store/modules/storage'

defineOptions({ name: 'StorageSalaryExamine' })

const salary = useSalary()

onBeforeMount(() => {
  salary.currentRolesMask = getDictValue(DICT_TYPE.ROLES_MASK, '验货员')
})
</script>
<style lang="less" scoped></style>
