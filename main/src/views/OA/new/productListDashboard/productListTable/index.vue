<template>
  <ContentWrap>
    <el-tabs  class="demo-tabs" v-model="activeTab" @tab-change="handleChange">
      <el-tab-pane :label="tab.label" :name="tab.value" v-for="tab in tabList" :key="tab.value"/>
    </el-tabs>
    <component :is="currentList"/>
  </ContentWrap>
</template>

<script lang="ts" setup>
import ProductDocumentation from '@/views/OA/new/productListDashboard/productDocumentation/index.vue'
import ProductPlanning from '@/views/OA/new/productListDashboard/productPlanning/index.vue'

const currentList = shallowRef(ProductPlanning)
const handleChange = (tab)=>{
  if(tab === 'document'){
    currentList.value  = ProductDocumentation
  }else{
    currentList.value = ProductPlanning
  }
}
const tabList = ref([
  {
    label:'产品规划',
    value:'plan'
  },
  {
    label:'产品建档资料',
    value:'document'
  }
])
const activeTab = ref('plan')

</script>

<style lang="scss" scoped></style>
