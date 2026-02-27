<template>
  <ul class="layout-list">
    <li class="layout-item" v-for="layout in layouts" :key="layout.key">
      <div class="layout-title">
        <CardTitle :title="layout.label" />
      </div>
      <div class="layout-content">
        <slot :name="layout.key"></slot>
      </div>
    </li>
  </ul>
</template>
<script lang="ts" setup>

type drawerType = {
  layouts: any
}
const props = withDefaults(defineProps<Partial<drawerType>>(), {
  layouts: [
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
})
</script>
<style scoped lang="scss">
.layout-list {
  .layout-item {
    margin: 0px !important;
    background-color: #fff;
    border-radius: 8px;

    &:not(:first-child) {
      margin-top: 20px;
    }

    .layout-title {
      padding: 16px 0px 0px 5px;

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
      padding: 20px 0 0 0;
    }
  }
}
</style>
