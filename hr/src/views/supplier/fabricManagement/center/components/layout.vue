<template>
  <ul class="layout-list">
    <li class="layout-item" v-for="layout in layouts" :key="layout.key">
      <div class="layout-title">
        <h2>{{ layout.label }}</h2>
      </div>
      <div class="layout-content">
        <slot :name="layout.key"></slot>
      </div>
    </li>
  </ul>
</template>
<script lang="ts" setup>
const layouts = [
  {
    label: '基本信息',
    key: 'basicInfo'
  },
  {
    label: '面料信息',
    key: 'fabricInfo'
  },
  {
    label: '其他信息',
    key: 'otherInfo'
  }
]
</script>
<style scoped lang="scss">
.layout-list {
  .layout-item {
    background-color: #fff;
    border-radius: 8px;
    &:not(:first-child) {
      margin-top: 20px;
    }
    .layout-title {
      border-bottom: 1px solid #f0f0f0;
      padding: 16px 20px;
      h2 {
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        display: flex;
        align-items: center;
        gap: 6px;
        &:before {
          content: '';
          width: 3px;
          height: 10px;
          background-color: #0064ff;
        }
      }
    }
    .layout-content {
      padding: 20px;
    }
  }
}
</style>
