<!--
 * @Date: 2025-08-20 08:46:38
 * @Description: 进度维护
-->

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
const productPlanId = route.query.productPlanId
const designGalleryId = route.query.designGalleryId
const progressDialogRef = ref()
onMounted(() => {
  const rowData = {
    id,
    developmentPlanId,
    productPlanId,
    designGalleryId
  }
  progressDialogRef.value.open(rowData)
})
</script>

<style lang="scss" scoped>
.progressMainContent {
  height: calc(100vh - 100px);
}
</style>
