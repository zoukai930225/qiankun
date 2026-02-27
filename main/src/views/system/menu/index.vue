<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="78px">
      <!-- <el-form-item label="菜单名称:" prop="name">
        <el-input
          v-model="queryParams.name"
          class="!w-240px"
          clearable
          placeholder="请输入菜单名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态:" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="请选择菜单状态"
        >
          <el-option
            v-for="dict in CommonStatusOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <!-- <el-button @click="resetQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          重置
        </el-button> -->
        <!-- v-hasPermi="['system:menu:create']" -->
        <el-button type="primary" @click="openForm('create', '', '0')">
          <Icon class="mr-5px" icon="ep:plus" />
          新增
        </el-button>
        <el-button plain type="danger" @click="toggleExpandAll">
          <Icon class="mr-5px" icon="ep:sort" />
          展开/折叠
        </el-button>
        <el-button @click="handleQuery">
          <Icon class="mr-5px" icon="ep:refresh" />
          刷新菜单数据
        </el-button>
        <el-button plain @click="refreshMenu">
          <Icon class="mr-5px" icon="ep:refresh" />
          刷新菜单缓存
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-segmented v-model="tabValue" :options="envOptions" style="padding: 0 !important;" @change="getList" />
    <el-table :border="true" :header-cell-style="appStore.headerCellStyle" v-if="refreshTable" v-loading="loading"
      :data="list" :default-expand-all="isExpandAll" row-key="id" class="SWCommonTable" v-horizontal-scroll="'always'">
      <el-table-column :show-overflow-tooltip="true" label="菜单名称" prop="name" width="250" />
      <!-- 类型 -->
      <el-table-column label="类型" prop="type" width="100">
        <template #default="scope">
          {{ getTypeName(scope.row.type) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="图标" prop="icon" width="100">
        <template #default="scope">
          <Icon :icon="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" width="60" />
      <el-table-column :show-overflow-tooltip="true" label="权限标识" prop="permission" />
      <el-table-column :show-overflow-tooltip="true" label="组件路径" prop="component" />
      <el-table-column :show-overflow-tooltip="true" label="组件名称" prop="componentName" />
      <!-- <el-table-column label="状态" prop="status" width="80">
        <template #default="scope">
          {{ CommonStatusName(scope.row.status) }}
        </template>
      </el-table-column> -->
      <el-table-column align="center" fixed="right" width="300" label="操作">
        <template #default="scope">
          <!-- v-hasPermi="['system:menu:update']" -->
          <!-- v-hasPermi="['system:menu:create']" -->
          <!-- v-hasPermi="['system:menu:delete']" -->
          <el-button link type="primary" @click="reviewPeople(scope.row.id, scope.row.pId)">
            查看人员
          </el-button>

          <el-button link type="primary" @click="reviewPermissionsDetail(scope.row.id, scope.row.pId)">
            所属权限
          </el-button>

          <el-button link type="primary" @click="openForm('update', scope.row.id, scope.row.pId)">
            修改
          </el-button>
          <el-button link type="primary" @click="openForm('create', '', scope.row.id, scope.row)">
            新增
          </el-button>
          <el-button v-if="!scope.row.children || scope.row.children.length === 0" link type="danger"
            @click="handleDelete(scope.row.id)">
            删除
          </el-button>
          <el-button v-else link type="danger" disabled> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <MenuForm ref="formRef" @success="getList" />
  <!-- 查看人员 -->
  <ReviewPeople ref="reviewPeopleRef" />
  <!-- 查看权限 -->
  <PermissionsDetail ref="permissionsDetailRef" />
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
// import { CommonStatusName } from '@/types/enumOptions'
import * as MenuApi from '@/api/system/menu'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'
import MenuForm from './MenuForm.vue'
import PermissionsDetail from './PermissionsDetail.vue'
import ReviewPeople from './ReviewPeople.vue'
import { envOptions } from "./menu";
const appStore = useAppStore()

defineOptions({ name: 'SystemMenu' })

const { wsCache } = useCache()
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const loading = ref(true) // 列表的加载中
const list = ref<any>([]) // 列表的数据
const queryParams = reactive({
  name: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单
const isExpandAll = ref(false) // 是否展开，默认全部折叠
const refreshTable = ref(true) // 重新渲染表格状态

const tabValue = ref<string>('1');

const getTypeName = (type: number) =>
  ({
    1: '目录',
    2: '菜单',
    3: '按钮'
  })[type] ?? '未知'

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await MenuApi.getMenuList({ ...queryParams, menuEnv: tabValue.value });
    list.value = data || []
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
// const resetQuery = () => {
//   queryFormRef.value.resetFields()
//   handleQuery()
// }

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string, parentId?: string, item?: any) => {
  formRef.value.open(type, id, parentId, item?.id ? { menuEnv: item.menuEnv } : {})
}

const reviewPeopleRef = ref()
// 查看人员
const reviewPeople = (id: string, parentId: string) => {
  reviewPeopleRef.value.open(id, parentId)
}

// 查看权限
const permissionsDetailRef = ref()
const reviewPermissionsDetail = (id: string, parentId: string) => {
  permissionsDetailRef.value.open(id, parentId)
}

/** 展开/折叠操作 */
const toggleExpandAll = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 刷新菜单缓存按钮操作 */
const refreshMenu = async () => {
  try {
    await message.confirm('即将更新缓存刷新浏览器！', '刷新菜单缓存')
    // 清空，从而触发刷新
    wsCache.delete(CACHE_KEY.USER)
    wsCache.delete(CACHE_KEY.ROLE_ROUTERS)
    // 刷新浏览器
    location.reload()
  } catch { }
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await MenuApi.deleteMenu(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 初始化 **/
onMounted(() => {
  tabValue.value = '1';
  getList()
})
</script>
