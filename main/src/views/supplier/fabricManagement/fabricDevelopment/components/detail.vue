<template>
  <SWDrawer :model-value="visible" :show-befor-close="true" @before-close="cancel" :title="title" :width="936" @close="emit('update:visible', false)">
    <div :class="[!['add', 'edit', 'progress'].includes(actionType) ? 'card' : '']">
      <el-tabs v-model="activeName" class="cus-tabs" @tab-click="handleClick"
        v-if="!['add', 'edit', 'progress'].includes(actionType)">
        <el-tab-pane label="面料信息" name="detail"></el-tab-pane>
        <el-tab-pane label="打样进度" name="progress"></el-tab-pane>
        <el-tab-pane label="供应商信息" name="supplier"></el-tab-pane>
      </el-tabs>
      <component :is="renderComponent" :id="(detailData as any)?.id || ''" :detailData="detailData"
        :isDetail="actionType === 'detail'" :ref="(el: ComponentRef) => setEditRef(el)" @refresData="refresData"
        :success="success" />
    </div>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button @click="submit" type="primary" class="mr0px" v-if="!['detail', 'progress'].includes(actionType)"
        :loading="loading">提交</el-button>
    </template>
  </SWDrawer>
</template>

<script lang="ts" setup>
import EditContent from './editContent.vue';
import DetailContent from './detailContent.vue';
import DevProgress from './devProgress.vue';
import SupplierInfor from './supplierInfor.vue';
import type { IDrawerService } from '../service/IDrawerService'
type EditContentInstance = InstanceType<typeof EditContent>
type ComponentRef = EditContentInstance | null;

const contentRef = ref<IDrawerService | null>(null);
const loading = ref(false)
const emit = defineEmits(['update:visible', 'success', 'refresData'])

type drawerType = {
  visible: boolean,
  title: string,
  detailData: object | null,
  actionType: string,
  success: () => {}
}
const props = withDefaults(defineProps<Partial<drawerType>>(), {
  visible: false,
  actionType: 'add'
})
// 组件映射
const COMPONENT_MAP: Record<string, Component> = {
  detail: DetailContent,
  edit: EditContent,
  add: EditContent,
  progress: DevProgress,
  supplier: SupplierInfor
}

let componentType = props.actionType

const activeName = ref('detail')

const handleClick = (tab: any, event: Event) => {
  componentType = tab.props.name
  renderComponent.value = COMPONENT_MAP[componentType]
}

const renderComponent: any = shallowRef(COMPONENT_MAP[componentType])


const refresData = () => emit('refresData');

const setEditRef = (el: ComponentRef) => {
  if (el && ['add', 'edit', 'progress', 'supplier'].includes(props.actionType)) {
    contentRef.value = el
  }
};


const cancel = () => {
  if (props.actionType === 'detail') {
    emit('update:visible', false)
    return
  }
  if (!contentRef.value?.beforCancel()) {
    ElMessageBox.confirm(
      '当前有未保存的修改，确定要关闭吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
      .then(() => {
        emit('update:visible', false)
      })

  } else {
    emit('update:visible', false)
  }
}

const afterSubmit = () => {
  emit('success')
  emit('update:visible', false)
}
const handleLoading = (val) => {
  loading.value = val
}

const submit = () => {
  contentRef.value?.submit(afterSubmit, handleLoading)
}




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
      padding: 16px 0px;

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

.card {
  // padding: 5px 20px 20px 20px;
  background-color: #fff;
  border-radius: 10px;
  .cus-tabs {
    padding: 0px 20px;
    border-bottom: solid 1px #f0f0f0;
    box-sizing: border-box;
    :deep() {
      .el-tabs__nav-wrap:after {
        height: 0;
      }
      .el-tabs__item {
        height: 46px;
      }
    }
  }
}

:deep() {
  .el-tabs__header {
    margin-bottom: 0px;
  }
}
</style>
