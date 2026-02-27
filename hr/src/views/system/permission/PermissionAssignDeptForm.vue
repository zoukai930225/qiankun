<template>
  <div>
    <ElDrawer custom-class="deptDrawer" v-model="dialogVisible" title="分配部门" size="507">
      <div class="editBg">
        <el-input
          class="search-input"
          v-model="filterText"
          placeholder="搜索"
          suffix-icon="search"
        />
        <div class="deptTree">
          <el-tree
            ref="treeRef"
            :data="menuOptions"
            :props="defaultProps"
            :default-expanded-keys="defaultExpandedKeys"
            :filter-node-method="filterNode"
            node-key="id"
            show-checkbox
          />
        </div>

        <div class="footer">
          <el-button
            style="margin-left: auto; margin-right: 9px"
            :disabled="formLoading"
            type="primary"
            @click="submitForm"
            >确 定</el-button
          >
          <el-button style="margin-right: 20px; margin-right: 9px" @click="dialogVisible = false"
            >取 消</el-button
          >
        </div>
      </div>
    </ElDrawer>
  </div>
</template>
<script lang="ts" setup>
import { getDeptByPermissionId } from '@/api/system/dept'
import * as PermissionApi from '@/api/system/permission'
import { defaultProps } from '@/utils/tree'

defineOptions({ name: 'SystemRoleAssignMenuForm' })

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  id: '',
  menuIds: []
})
const formRef = ref() // 表单 Ref
const menuOptions = ref([]) // 分类数据源
const menuExpand = ref(false) // 展开/折叠
const defaultExpandedKeys = ref<any[]>([]) // 默认展开的节点
const filterText = ref('')
const treeRef = ref() // 菜单树组件 Ref
const treeNodeAll = ref(false) // 全选/全不选

/** 打开弹窗 */
const open = async (row: PermissionApi.PermissionVO) => {
  dialogVisible.value = true
  resetForm()
  const data = await getDeptByPermissionId({ permissionId: row.id })
  menuOptions.value = data || []
  if (menuOptions.value.length > 0) {
    defaultExpandedKeys.value = [(menuOptions.value[0].id as string) || '']
  }
  // 设置数据
  formData.value.id = row.id as string
  formLoading.value = true
  try {
    formData.value.menuIds = formatData(data) || []
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

const formatData = (arr) => {
  let result = []
  const search = (data) => {
    for (const item of data) {
      if (item.isPermission == true) {
        // @ts-ignore
        result.push(item.id)
      }
      if (item.children && item.children.length > 0) {
        search(item.children)
      }
    }
  }
  search(arr)
  return result
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

const filterNode = (value: string, data: Tree) => {
  if (!value) return true
  return data.name.includes(value)
}

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
      ids: getSelectedMenuIds()
    }
    // const arr = getSelectedMenuIds().map((item) => {
    //   return {
    //     permissionId: formData.value.id,
    //     departmentId: item
    //   }
    // })

    console.log(data, '?????getSelectedMenuIds')
    await PermissionApi.saveDepartmentPermission(data)
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
    menuIds: []
  }
  treeRef.value?.setCheckedNodes([])
  formRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.deptDrawer {
}
.editBg {
  margin-top: 0px;
  margin-left: 17px;
  margin-right: 17px;
  background: #ffffff;
  border-radius: 8px;
  .search-input {
    margin-left: 24px;
    margin-top: 28px;
    height: 32px;
    width: 269px;
    height: 32px;
    background: #ffffff;
    border-radius: 4px;
    border: 1px solid #e5e5e5;
  }
  .deptTree {
    overflow-y: scroll;
    overflow: auto;
    margin-top: 22px;
    margin-left: 20px;
    margin-right: 20px;
    max-height: calc(100vh - 240px);
  }
}
.footer {
  margin-top: 0px;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
}
:deep(.el-input__wrapper) {
  height: auto;
}
</style>

<style scoped>
:deep(.el-drawer) {
  background-image: url('@/assets/imgs/system/assign_dept_bg.png') !important;
  background-size: cover !important;
  border-radius: 12px 0px 0px 0px;
}
:deep(.el-drawer__title) {
  font-weight: 500;
  font-size: 14px;
  color: #333333;
  line-height: 20px;
}
:deep(.el-drawer__header) {
  margin-bottom: 20px;
}
:deep(.el-drawer__body) {
  padding-top: 0px;
}

:deep(.el-input__wrapper) {
  background: #f8f8f9;
  border-radius: 4px;
  box-shadow: none;
}

:deep(.el-input__wrapper) {
  background: #ffffff;
  border-radius: 4px;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #0064ff;
  border-color: #0064ff;
}
:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: #0064ff;
  border-color: #0064ff;
}
</style>
