<template>
  <div class="popularize">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="产品对照" name="first">
        <Product />
      </el-tab-pane>
      <el-tab-pane label="人群对照" name="second">
        <People />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Product from './components/product.vue'
import People from './components/people.vue'

const activeName = ref('first')
</script>

<style lang="scss" scoped></style>
