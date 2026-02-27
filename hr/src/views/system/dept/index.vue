<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="100px"
    >
      <!-- <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入部门名称"
          clearable
          @keyup.enter="handleQuery"
          @clear="handleQuery"
          class="!w-240px"
        />
      </el-form-item> -->
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 刷新部门数据
        </el-button>
        <!-- <el-button @click="resetQuery"> <Icon icon="ep:refresh" class="mr-5px" /> 重置 </el-button> -->
        <!-- 新增 -->
        <!-- <el-button type="primary" @click="openForm('create', '0', '0', '')">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button> -->
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap class="dept-manage">
    <!-- title -->
    <div class="custom-tree-node title" :style="{ 'padding-left': 20 + 'px', height: '40px' }">
      <span class="custom-tree-node-left">部门名称</span>
      <span class="custom-tree-node-right">
        <div class="custom-tree-node-right-hr">HR</div>
        <div class="custom-tree-node-right-company">公司</div>
        <div class="custom-tree-node-right-opera">操作</div>
      </span>
    </div>
    <el-tree
      ref="refTree"
      class="custom-tree"
      node-key="id"
      :data="dataList"
      :props="defaultProps"
      :expand-on-click-node="true"
      :default-expanded-keys="isLoadExpandKey ? expandKey : []"
      @node-expand="nodeExpand"
      @node-collapse="nodeCollapse"
    >
      <template #default="{ data }">
        <span class="custom-tree-node">
          <!-- left -->
          <span class="custom-tree-node-left">{{ data.name }}</span>
          <!-- right -->
          <span class="custom-tree-node-right">
            <!-- hr -->
            <div class="custom-tree-node-right-hr">
              {{ data.hrName }}
            </div>
            <!-- 公司 -->
            <div class="custom-tree-node-right-company">
              {{ data.company }}
            </div>
            <!-- opera -->
            <div class="custom-tree-node-right-opera">
              <!-- <el-button
                type="text"
                size="small"
                class="operateBtn"
                v-if="isCanAddNode()"
                @click="() => openForm('create', '0', data.id, data.name)"
              >
                新增子部门
              </el-button>
              <el-button v-else type="text" size="small" class="operateBtn" style="opacity: 0">
                新增子部门
              </el-button> -->
              <div v-if="data.pId" class="custom-tree-node-right-opera-line"></div>
              <div v-else class="custom-tree-node-right-opera-line" style="opacity: 0"></div>
              <el-button
                type="text"
                size="small"
                class="operateBtn"
                v-if="data.pId"
                @click.stop="() => openForm('update', data.id, data.parendId, data.parentName)"
              >
                编辑
              </el-button>
              <div
                v-if="!data.children || data.children.length === 0"
                class="custom-tree-node-right-opera-line"
              ></div>
              <el-button
                type="text"
                size="small"
                class="operateBtn"
                style="color: #eb2330"
                v-if="!data.children || data.children.length === 0"
                @click="() => deleteNode(data)"
              >
                删除
              </el-button>
            </div>
          </span>
        </span></template
      >
    </el-tree>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <DeptForm ref="formRef" @success="getDeptList" />
</template>

<script setup lang="ts">
import DeptForm from './DeptForm.vue'

import * as DeptApi from '@/api/system/dept'
// import { getDeptTree } from '@/api/hrAdmin/personRoster/index'

defineOptions({ name: 'SystemDept' })

const dataList = ref<DeptApi.DeptVO[]>([]) // 分类数据源
const expandKey = ref<string[]>([]) // 展开的Key
const isLoadExpandKey = ref(false)
const defaultProps = ref({
  children: 'children',
  label: 'name'
})

const getDeptList = async () => {
  const data = await DeptApi.getAllDeptTree()
  dataList.value = data || []
  handleCategoryData(dataList.value, 1, '')
  isLoadExpandKey.value = true
}

/**  处理请求到的分类数据 */
const handleCategoryData = (list, level, parentName) => {
  if (list) {
    list.forEach((item, index) => {
      item.level = level
      item.index = index + 1
      item.parentName = parentName || ''
      handleCategoryData(item.children, level + 1, item.name)
    })
  }
}

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const queryParams = reactive({
  name: undefined
})
const queryFormRef = ref() // 搜索的表单

/** 搜索按钮操作 */
const handleQuery = () => {
  getDeptList()
}

/** 重置按钮操作 */
// const resetQuery = () => {
//   queryFormRef.value.resetFields()
//   handleQuery()
// }

/** 是否可以新增 */
const isCanAddNode = () => {
  return true
  // return data.level < 2
}

/** 删除节点 */
const deleteNode = async (data: DeptApi.DeptVO) => {
  let content = `确定要删除${data.name}？`
  let statusT = '删除部门'
  // 删除的二次确认
  await message.delConfirm(content, statusT)
  await deleteNodeReq(data.id as string)
  message.success('删除成功')
}

/**节点展开 */
const nodeExpand = (data: DeptApi.DeptVO, _) => {
  if (!isExistExpandKey(data.id)) {
    if (data.id) {
      expandKey.value.push(data.id as string)
    }
  }
}

/**节点关闭 */
const nodeCollapse = (data, _) => {
  if (isExistExpandKey(data.id)) {
    removeExpandKey(data.id)
    data.children.forEach((item) => {
      nodeCollapse(item, null)
    })
  }
}

/**是否存在已展开节点中 */
const isExistExpandKey = (id) => {
  var isExist = false
  expandKey.value.forEach((key) => {
    if (key === id) {
      isExist = true
    }
  })
  return isExist
}

/**移除展开节点 */
const removeExpandKey = (id) => {
  let keyList: string[] = []
  expandKey.value.forEach((nodeId) => {
    if (nodeId !== id) {
      keyList.push(nodeId)
    }
  })
  expandKey.value = keyList
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string, parentId?: string, parentName?: string) => {
  formRef.value.open(type, id, parentId, parentName)
}

/** 删除请求 */
const deleteNodeReq = async (id: string) => {
  // 发起删除
  await DeptApi.deleteDept(id)
  message.success(t('common.delSuccess'))
  // 刷新列表
  await getDeptList()
}

/** 初始化 **/
onMounted(() => {
  getDeptList()
})
</script>

<style lang="scss" scoped>
.dept-manage {
  width: 100%;

  .title {
    height: 40px;
    background: #f2f3f5;
    font-weight: 500;

    .custom-tree-node-left {
      margin-left: 8px;
    }
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
    color: #333333;
    height: 50px;

    &-left {
      display: inline-block;
      white-space: pre-wrap;
      word-break: break-all;
      word-wrap: break-word;
      text-align: left;
      // padding: 8px;
    }

    &-right {
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: -6px;
      width: 600px;

      &-hr {
        margin-right: 50px;
        width: 140px;
        text-align: left;
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;
      }
      &-company {
        margin-right: 50px;
        width: 140px;
        text-align: left;
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;
      }

      &-opera {
        min-width: 200px;
        display: flex;
        align-self: center;
        align-items: center;

        &-line {
          margin-left: 2px;
          margin-right: 2px;
          width: 1px;
          height: 10px;
          background: #e5e7eb;
          border-radius: 1px;
        }
      }
    }
  }

  :deep(.el-tree-node__content) {
    height: 50px;
    border-bottom: 1px solid #e5e7eb;
  }
}

.operateBtn {
  font-size: 14px;
  color: #126efe;
}
</style>
