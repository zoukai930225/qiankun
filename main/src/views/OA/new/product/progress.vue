<template>
  <div class="progressMainContent">
    <ProgressDialog ref="progressDialogRef" />
  </div>
</template>

<script lang="ts" setup>
import ProgressDialog from './components/progressDialog.vue'
const route = useRoute() // 路由

const id = route.params.id
const developmentPlanId = route.query.developmentPlanId
const productType = route.query.productType
const progressDialogRef = ref()
onMounted(() => {
  const rowData = {
    id,
    developmentPlanId,
    productType
  }
  progressDialogRef.value.open(rowData)
})
</script>

<style lang="scss" scoped>
.progressMainContent {
  height: calc(100vh - 100px);
}
</style>
