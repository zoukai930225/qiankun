<template>
  <div>
    <el-drawer v-model="visible" v-if="visible" :with-header="false" :wrapper-closable="true" class="drawer" :size="968"
      @closed="close">
      <div>
        <div class="drawerTitle">
          <div>查看资质</div>
          <div @click="handleCloseDrawer"><el-icon>
              <CloseBold />
            </el-icon></div>
        </div>
      </div>
      <div>
        <el-tabs v-model="activeTab" @tab-change="handleClick" class="demo-tabs">
          <el-tab-pane label="基本信息" name="base" key="base">
            <Base v-model:id="curId" @next="nextTab" v-if="activeTab === 'base'" :type="type" />
          </el-tab-pane>
          <el-tab-pane name="business" key="business" :disabled="!curId">
            <Business :id="curId" @next="nextTab" v-if="activeTab === 'business'" :type="type" />
            <template #label>
              <el-tooltip v-if="!curId" content="请先完成基本信息的填写并点击下一步">
                <span>经营信息</span>
              </el-tooltip>
              <span v-else>经营信息</span>
            </template>
          </el-tab-pane>
          <el-tab-pane name="others" key="others" :disabled="!curId">
            <Others :id="curId" @next="close" v-if="activeTab === 'others'" :type="(type as any)"
              @refresh="emit('refresh')" />
            <template #label>
              <el-tooltip v-if="!curId" content="请先完成基本信息的填写并点击下一步">
                <span>其他信息</span>
              </el-tooltip>
              <span v-else>其他信息</span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="drawer_btn" v-if="isCanEdit && type === 'view'">
        <el-button type="primary" @click="type = 'edit'">编辑</el-button>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="tsx" setup>
import Base from './base.vue'
import Business from './business.vue'
import Others from './others.vue'

// const props = defineProps<{
//   type?: 'add' | 'edit' | 'view'
// }>()

const emit = defineEmits(['refresh'])

defineOptions({ name: 'SupplierInfo' })

const type = ref<string>('view'), isCanEdit = ref<boolean>(false);

const visible = ref(false)
const curId = ref('')
const open = (id: string, edit: boolean = false) => {
  type.value = 'view';
  visible.value = true
  activeTab.value = 'base'
  isCanEdit.value = edit;
  curId.value = id
}
const activeTab = ref('base')
const handleClick = (tab: any) => {
  activeTab.value = tab
}
const handleCloseDrawer = () => {
  visible.value = false
}
const nextTab = (str: string) => {
  activeTab.value = str
}
const close = () => {
  visible.value = false
}
defineExpose({
  open
})
onMounted(() => { })
</script>
<style lang="scss" scoped>
// @use '@/styles/drawer.scss';

.drawerTitle {
  display: flex;
  justify-content: space-between;
}


:deep(.drawer) {
  background-color: #F8F8F9 !important;

  // .el-drawer__header {
  //   margin-bottom: 0;

  //   .el-drawer__title {
  //     font-size: 14px;
  //     color: #333333;
  //     line-height: 20px;
  //     font-style: normal;
  //   }
  // }
  .drawerTitle {
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    font-style: normal;
    font-weight: 600;
  }

  .el-drawer__body {
    padding: 20px !important;
  }
}
.drawer_btn {
  text-align: right;
  margin-top: 10px;
  background: #fff;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px 20px;
}
</style>
