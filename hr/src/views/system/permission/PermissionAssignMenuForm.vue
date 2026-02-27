<template>
  <!-- <Dialog v-model="dialogVisible" title="菜单权限"> -->
  <el-drawer v-model="dialogVisible" size="960" :with-header="false" title="菜单权限" @close="handleClose">
    <div class="drawer-wapper">
      <el-form ref="formRef" v-loading="formLoading" :model="formData" label-width="80px">
        <el-form-item label="权限名称:">
          <div>{{ formData.name }}</div>
        </el-form-item>
        <el-form-item label="渠道:">
          <div>{{ formData.channelName }}</div>
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-card class="cardHeight" v-if="menuOptions && menuOptions.length > 0">
            <el-tabs v-model="tabValue" @tab-change="tabChange">
              <el-tab-pane v-for="item in envOptions" :label="item.label" :name="item.value" />
            </el-tabs>
            <span style="margin-right: 10px">全选/全不选:</span>
            <el-switch v-model="treeNodeAll" active-text="是" inactive-text="否" inline-prompt
              @change="handleCheckedTreeNodeAll" />
            <span style="margin-left: 30px; margin-right: 10px">全部展开/折叠:</span>

            <el-switch v-model="menuExpand" active-text="展开" inactive-text="折叠" inline-prompt
              @change="handleCheckedTreeExpand" />
            <el-tree ref="treeRef" :data="menuOptions" :props="defaultProps" empty-text="加载中，请稍候" node-key="id"
              show-checkbox />
          </el-card>
        </el-form-item>
      </el-form>
      <div class="btn-wapper">
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </div>
  </el-drawer>
  <!-- </Dialog> -->
</template>
<script lang="ts" setup>
import { defaultProps } from '@/utils/tree'
import * as PermissionApi from '@/api/system/permission'
import * as MenuApi from '@/api/system/menu'
import { envOptions } from "@/views/system/menu/menu";

defineOptions({ name: 'SystemRoleAssignMenuForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false), tabValue = ref<string>('1') // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: '',
  name: '',
  channelName: '',
  menuIds: []
})
const formRef = ref() // 表单 Ref
const menuOptions = ref<any[]>([]) // 菜单树形结构
const menuExpand = ref(false) // 展开/折叠
const treeRef = ref() // 菜单树组件 Ref
const treeNodeAll = ref(false) // 全选/全不选

/** 打开弹窗 */
const open = async (row: PermissionApi.PermissionVO) => {
  tabValue.value = '1';
  dialogVisible.value = true
  resetForm()
  const data = await MenuApi.getMenuList({ menuEnv: tabValue.value })
  menuOptions.value = data || []
  // 设置数据
  formData.value.id = row.id as string
  formData.value.name = row.name
  formData.value.channelName = row.channelName
  formLoading.value = true
  try {
    const data = await PermissionApi.permissonMenus(row.id as string, tabValue.value)
    formData.value.menuIds = data || []
    nextTick(() => {
      // 设置选中
      formData.value.menuIds.forEach((menuId: number) => {
        treeRef.value.setChecked(menuId, true, false)
      })
    })
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const tabChange = async () => {
  menuExpand.value = false;
  treeNodeAll.value = false;
  const data = await MenuApi.getMenuList({ menuEnv: tabValue.value });
  menuOptions.value = data || [];
  formLoading.value = true
  try {
    const data = await PermissionApi.permissonMenus(formData.value.id as string, tabValue.value);
    formData.value.menuIds = data || []
    nextTick(() => {
      // 设置选中
      formData.value.menuIds.forEach((menuId: number) => {
        treeRef.value.setChecked(menuId, true, false)
      })
    })
  } finally {
    formLoading.value = false
  }
};

/**
 * 获取选择菜单ids
 */
const getSelectedMenuIds = () => {
  return treeRef.value
    ? [
      ...(treeRef.value.getCheckedKeys(false) as unknown as Array<number>), // 获得当前选中节点
      ...(treeRef.value.getHalfCheckedKeys() as unknown as Array<number>) // 获得半选中的父节点
    ]
    : []
}

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  // 提交请求
  formLoading.value = true
  try {
    const data = {
      id: formData.value.id,
      ids: getSelectedMenuIds(),
      menuEnv: tabValue.value
    }
    await PermissionApi.permissonSaveMenu(data)
    message.success('菜单权限分配成功')
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  // 重置选项
  treeNodeAll.value = false
  menuExpand.value = false
  // 重置表单
  formData.value = {
    id: '',
    name: '',
    channelName: '',
    menuIds: []
  }
  treeRef.value?.setCheckedNodes([])
  formRef.value?.resetFields()
}

/** 全选/全不选 */
const handleCheckedTreeNodeAll = () => {
  treeRef.value.setCheckedNodes(treeNodeAll.value ? menuOptions.value : [])
}

/** 展开/折叠全部 */
const handleCheckedTreeExpand = () => {
  const nodes = treeRef.value?.store.nodesMap
  for (let node in nodes) {
    if (nodes[node].expanded === menuExpand.value) {
      continue
    }
    nodes[node].expanded = menuExpand.value
  }
}
</script>
<style lang="scss" scoped>
.cardHeight {
  width: 100%;
  overflow-y: scroll;
  max-height: calc(100vh - 190px);
}

.drawer-wapper {
  width: 100%;
  height: 100%;
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 23px 22px 0 18px;
  box-sizing: border-box;
}

.btn-wapper {
  display: flex;
  justify-content: flex-end;
}
</style>
