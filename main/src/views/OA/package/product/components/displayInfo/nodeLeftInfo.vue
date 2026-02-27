<!--
 * @Date: 2025-08-25 18:20:42
-->
<template>
  <div class="nodeLeftInfo">
    <CollapsibleFileList title="报价单" :list="quotationSheetList()" />
    <CollapsibleFileList title="文件资料包" :list="documentInformationPackage()" />
  </div>
</template>

<script setup lang="ts">
import CollapsibleFileList from './collapsibleFileList.vue'

const props = defineProps({
  data: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})
// 文件资料包
const documentInformationPackage = () => {
  if (props.data && props.data.documentInformationPackage) {
    return props.data.documentInformationPackage.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}

// 报价单
const quotationSheetList = () => {
  if (props.data && props.data.quotationSheetFile) {
    return props.data.quotationSheetFile.split(',').map((item) => {
      return {
        url: item
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.nodeLeftInfo {
  width: 229px;
}
</style>
