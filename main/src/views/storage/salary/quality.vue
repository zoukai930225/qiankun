<template>
  <salary />
</template>
<script lang="ts" setup>
import { getDictValue } from '@/utils/dict'
import Salary from './components/salary2.vue'
import { useSalary } from '@/store/modules/storage'

defineOptions({ name: 'StorageSalaryQuality' })

const salary = useSalary()

onBeforeMount(() => {
  salary.currentRolesMask = getDictValue(DICT_TYPE.ROLES_MASK, '质检员')
})
</script>
<style lang="less" scoped></style>
