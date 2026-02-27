<!--
 * @Date: 2025-07-08 15:42:46
-->
<template>
  <el-drawer v-model="isVisible" :with-header="false" size="958" @close="reset" class="drawer">
    <div class="drawer-wapper">
      <div class="content-wapper">
        <div class="flex-row title-wapper">
          <div class="title">分配信息</div>
          <img
            src="@/assets/imgs/system/fieldManageConfig/close.png"
            class="close"
            @click="reset"
          />
        </div>
        <div class="content">
          <!-- 分配部门 -->
          <div class="left-wapper">
            <div class="content-title">
              <span class="desc"></span>
              <span class="title">分配部门</span>
            </div>
            <div>
              <el-tree
                ref="treeRef"
                :data="deptList"
                :props="defaultProps"
                :default-expanded-keys="selectIds"
                :filter-node-method="filterNode"
                :default-checked-keys="selectIds"
                node-key="id"
              />
            </div>
          </div>
          <!-- 分配用户 -->
          <div class="right-wapper">
            <div class="content-title">
              <span class="desc"></span>
              <span class="title">分配用户</span>
            </div>
            <div style="padding: 0 0px 20px 20px; box-sizing: border-box">
              <el-form ref="formRef" :model="formData" :inline="true" class="form-wapper">
                <el-form-item label="姓名" prop="name">
                  <el-input
                    v-model="formData.name"
                    clearable
                    placeholder="请输入姓名"
                    style="width: 142px"
                  />
                </el-form-item>
                <el-form-item label="手机号码" prop="phone">
                  <el-input
                    v-model="formData.phone"
                    clearable
                    placeholder="输入手机号码"
                    style="width: 142px"
                  />
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                  <Menuitem v-model="formData.deptId" @change="handleSearch" style="width: 142px" />
                </el-form-item>
              </el-form>
              <div
                style="
                  display: flex;
                  justify-content: end;
                  padding-right: 20px;
                  box-sizing: border-box;
                "
              >
                <el-button @click="search" class="commonSearchBtn">
                  <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />搜 索</el-button
                >
                <el-button @click="resetForm">重 置</el-button>
              </div>
              <!-- table -->
              <div style="padding-right: 20px; box-sizing: border-box; margin-top: 20px">
                <el-table
                  :data="tableData"
                  style="width: 100%"
                  :header-cell-style="appStore.headerCellStyle"
                >
                  <el-table-column prop="username" label="账号" />
                  <el-table-column prop="realName" label="姓名" />
                  <el-table-column prop="phone" label="手机号码" />
                  <el-table-column prop="numberType" label="账号类型" />
                  <el-table-column prop="company" label="公司">
                    <template #default="scope">
                      <div>{{ getDictLabel(DICT_TYPE.PR_COMPANY, scope.row.company) || '--' }}</div>
                    </template>
                  </el-table-column>
                </el-table>

                <!-- 分页 -->
                <Pagination
                  v-model:limit="formData.size"
                  v-model:page="formData.page"
                  :total="total"
                  @pagination="pageChange"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import { queryDeptMenuId, queryPersonMenuId } from '@/api/system/menu'
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { defaultProps } from '@/utils/tree'
import Menuitem from '@/views/hrAdmin/resources/components/Menuitem.vue'
const appStore = useAppStore()
defineOptions({ name: 'ReviewPeople' })

const isVisible = ref(false) // 弹窗的是否展示
const menuId = ref('') // 菜单ID

// page size
const formData = ref({
  name: '',
  phone: '',
  deptId: '',
  // 分页参数
  page: 1,
  size: 10
})

const filterNode = (value: string, data: Tree) => {
  console.log('过滤节点', value, data)
  if (!value) return true
  return selectIds.value.includes(data.id)
}

const showDisabled = (item) => {
  console.log('是否禁用', item)
  return true
}

const open = (id: string, parentId: string) => {
  console.log('查看人员', id, parentId)
  isVisible.value = true // 打开弹窗
  menuId.value = id // 设置菜单ID

  getPeopleList()
  getDept()
}

const selectIds = ref<any[]>([]) // 选中的部门ID列表
const deptList = ref([]) // 部门列表
const getDept = async () => {
  const params = {
    menuId: menuId.value
  }
  const res = await queryDeptMenuId(params)
  deptList.value = (res && filterTree(res)) || []

  if (res?.length > 0) {
    formatDeps(res)
  }
  console.log('部门数据', deptList.value)
}

function filterTree(nodes) {
  if (!Array.isArray(nodes)) return []

  return nodes.map((node) => filterNodeSource(node)).filter((node) => node !== null) // 最终过滤掉顶层的 null 节点
}

const filterNodeSource = (node) => {
  if (!node) return null

  const { isPermission, children = [] } = node

  // 递归处理所有子节点
  const filteredChildren = children
    ?.map((child) => filterNodeSource(child))
    ?.filter((child) => child !== null) // 子节点中已经过滤掉 null

  // 如果当前节点 isPermission 不是 null（即 true），则必须保留该节点
  if (isPermission != null) {
    return {
      ...node,
      disabled: true, // 禁用当前节点
      children: filteredChildren // 更新子节点为过滤后的结果
    }
  }

  // 当前节点 isPermission 是 null 的情况
  if (filteredChildren?.length > 0) {
    // 虽然当前节点 isPermission 是 null，但它有有效的子节点，所以保留父节点
    return {
      ...node,
      disabled: true, // 禁用当前节点
      children: filteredChildren
    }
  }

  // 当前节点 isPermission 是 null，且没有有效的子节点，则删除该节点
  return null
}

const formatDeps = (data) => {
  // 格式化部门数据
  data.forEach((item) => {
    if (item?.isPermission) {
      selectIds.value.push(item.id) // 将部门ID添加到选中列表
    }
    if (item.children && item.children.length > 0) {
      formatDeps(item.children) // 递归处理子节点
    }
  })
}

const tableData = ref([])

// 获取人员列表
const getPeopleList = async () => {
  const params = {
    ...formData.value,
    menuId: menuId.value // 将菜单ID添加到请求数据中
  }
  const res = await queryPersonMenuId(params)
  total.value = res.total
  tableData.value = res.records || [] // 设置表格数据
  console.log('人员数据', res)
}

const total = ref(0) // 分页总数
const pageChange = (page) => {
  console.log('分页', page)
  formData.value.page = page.page
  formData.value.size = page.limit
  getPeopleList()
}

const reset = () => {
  isVisible.value = false // 关闭弹窗
}

const resetForm = () => {
  formData.value = {
    name: '',
    phone: '',
    deptId: '',
    page: 1,
    size: 10
  }
  getPeopleList()
}

const search = () => {
  console.log('提交表单', formData.value)
  formData.value.page = 1 // 重置页码为1
  getPeopleList() // 重新获取人员列表
}

// 搜索
const handleSearch = (value) => {
  // value 是 Menuitem 组件传递过来的值
  console.log('选择的部门', value)
  if (value) {
    formData.value.deptId = value[value.length - 1]
  }
  getPeopleList() // 根据选择的部门重新获取人员列表
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
:deep(.el-form--inline .el-form-item) {
  margin-right: 20px !important;
}

:deep(.el-drawer__body) {
  border-radius: 8px 0px 0px 8px;
  /* 应用/灰色底色 */
  background: #f8f8f9;
  padding: 0 !important;
}

.drawer-wapper {
  border-radius: 8px 0px 0px 8px;
  min-width: 700px;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: #f8f8f9;
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  height: 54px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  box-sizing: border-box;
  border-width: 0px 0px 1px 0px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 13px;

  .close {
    width: 23px;
    height: 23px;
    cursor: pointer;
  }

  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}

.content {
  flex: 1;
  display: flex;
  flex-direction: row;
  margin: 0 20px 20px 20px;
  .left-wapper {
    width: 166px;
    height: 100%;
    border-radius: 8px;
    background: #ffffff;
  }
  .right-wapper {
    flex: 1;
    height: 100%;
    border-radius: 8px;
    background: #ffffff;
    margin-left: 20px;
  }
}

.content-wapper {
  height: calc(100vh - 54px);
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
}
.content-title {
  padding: 16px 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 20px;

  .desc {
    /* 自动布局子元素 */
    width: 3px;
    height: 10px;
    z-index: 0;
    background: #0064ff;
    margin-right: 6px;
    display: inline-block;
  }
  .title {
    font-family: 阿里巴巴普惠体 2;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    letter-spacing: normal;
    color: #333333;
  }
}
.form-wapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
:deep(.el-table__row) {
  height: 52px;
}
</style>

<style lang="scss">
.drawer {
  .el-drawer__body {
    padding: 0 !important;
  }
}
</style>
