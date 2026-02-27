<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px" label-width="78px">
          <el-form-item label="权限名称:" prop="name">
            <el-input v-model="queryParams.name" :prefix-icon="Search" class="searchFormItemWidth" clearable
              placeholder="请输入权限名称" @keyup.enter="handleQuery" @clear="handleQuery" />
          </el-form-item>
          <el-form-item label="渠道:" prop="channel">
            <SelectChannels v-model="queryParams.channel" @clear="handleQuery" @change="handleQuery" />
          </el-form-item>
          <el-form-item label="权限类型:" prop="permissionType">
            <el-select :prefix-icon="Search" class="searchFormItemWidth" v-model="queryParams.permissionType"
              placeholder="请选择权限类型" clearable @clear="handleQuery" @change="handleQuery">
              <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PERMISSION_TYPE)" :key="dict.value"
                :label="dict.label" :value="dict.label" />
            </el-select>
          </el-form-item>
          <el-form-item label="分组:" prop="groupType">
            <el-select :prefix-icon="Search" class="searchFormItemWidth" v-model="queryParams.groupType"
              placeholder="请选择分组" clearable @change="handleQuery">
              <el-option v-for="dict in groupTypeList" :key="dict.value" :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
          <SWFilterAdd class="commonAddBtn" :list="addList" :current-code="currentAddCode"
            @add-btn-click="addBtnClick" />
        </div>
      </div>
    </div>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div v-if="list.length > 0">
      <!-- <el-table
      :border="true"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
    >
      <el-table-column label="权限名称" prop="name" min-width="120" />
      <el-table-column label="渠道" prop="channelName" min-width="120" />
      <el-table-column
        :formatter="dateFormatter"
        label="创建时间"
        prop="createdAt"
        min-width="180"
      />
      <el-table-column fixed="right" :width="330" label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.id)">
            编辑
          </el-button>
          <el-button link title="菜单权限" type="primary" @click="openAssignMenuForm(scope.row)">
            菜单权限
          </el-button>
          <el-button link title="分配用户" type="primary" @click="openAssignUserForm(scope.row)">
            分配用户
          </el-button>
          <el-button link title="分配部门" type="primary" @click="openAssignDeptForm(scope.row)">
            分配部门
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
        </template>
</el-table-column>
</el-table> -->
      <div class="cus-table" v-for="item in list" :key="item.name">
        <div class="item-wapper">
          <div class="item-title" style="padding-bottom: 16px">{{ item.name }}</div>
          <div class="item">
            <div class="row-title">
              <div class="row-title" style="padding-left: 0px; width: 20%; box-sizing: border-box">权限名称</div>
              <div class="row-title" style="padding-left: 8px; width: 10%">渠道</div>
              <div class="row-title" style="padding-left: 0px; width: 30%">备注</div>
              <div class="row-title" style="padding-left: 0px; width: 30%">分组</div>
              <div class="row-title" style="width: 100px">操作</div>
            </div>
            <div class="row-content" v-for="ite in item.value" :key="ite.id">
              <div class="content-title" style="width: 20%">{{ ite.name }}</div>
              <div class="content-title" style="width: 10%">
                <img v-if="ite?.channel" :src="getImageUrl(ite.channel)" class="img-content" />
              </div>
              <div class="content-title" style="width: 30%">{{ ite.remark || '--' }}</div>
              <div class="content-title" style="width: 30%">{{
                ite.groupType == 0 ? '权限组' : ite.groupType == 1 ? '用户组' : '--'
              }}</div>
              <div class="content-title flex-row" style="width: 100px">
                <span class="btn-edit" @click="openForm('update', ite.id)">编辑</span>
                <span class="btn-del" @click="handleDelete(ite.id)">删除</span>

                <el-popover placement="right" trigger="hover" :width="85" :popper-style="{
                  'min-width': '85px !important',
                  width: '85px',
                  padding: '4px 0',
                  'text-align': 'center'
                }">
                  <template #reference>
                    <img src="@/assets/imgs/common/more.png" alt="" class="more" />
                  </template>
                  <div class="more-btn">
                    <span class="more-btn-item" @click="openAssignDeptForm(ite)">分配部门</span>
                    <span class="more-btn-item" @click="openMenu(ite)"> 分配用户</span>
                    <span class="more-btn-item" @click="openAssignMenuForm(ite)">分配菜单</span>
                  </div>
                </el-popover>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-img">
      <img src="@/assets/imgs/common/empty_list.png" alt="" />
      <div>暂无数据</div>
    </div>
  </ContentWrap>
  <!-- 分页 -->
  <div class="pagination" v-if="total > 0">
    <Pagination v-model:limit="queryParams.size" v-model:page="queryParams.page" :total="total" @pagination="getList" />
  </div>

  <!-- 表单弹窗：添加/修改 -->
  <PermissionForm ref="formRef" @success="getList" />
  <!-- 菜单权限 分配用户 -->
  <PermissionsMenu ref="permissionsMenu" />
  <!-- 表单弹窗：菜单权限 分配菜单 -->
  <PermissionAssignMenuForm ref="assignMenuFormRef" @success="getList" />
  <!-- 表单弹窗：分配部门权限 -->
  <PermissionAssignDeptForm ref="assignDeptFormRef" @success="getList" />
</template>
<script lang="ts" setup>
import * as PermissionApi from '@/api/system/permission'
import { getImageUrl } from '@/utils'
// import { SelectChannels } from '@/components/SelectChannels/index'
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { Search } from '@element-plus/icons-vue'
import PermissionAssignDeptForm from './PermissionAssignDeptForm.vue'
import PermissionAssignMenuForm from './PermissionAssignMenuForm.vue'
import PermissionForm from './PermissionForm.vue'
import PermissionsMenu from './PermissionsMenu.vue'

const router = useRouter()
const appStore = useAppStore()

defineOptions({ name: 'SystemPermission' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<PermissionApi.PermissionVO[]>([]) // 列表的数据
const queryParams = reactive({
  page: 1,
  size: 10,
  name: '',
  channel: '',
  groupType: undefined,
  permissionType: ''
})
const queryFormRef = ref() // 搜索的表单
const groupTypeList = ref([
  { label: '权限组', value: 0 },
  { label: '用户组', value: 1 }
])

const addList = ref([
  {
    label: '新增',
    code: 'add'
  }
])
// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      openForm('create')
    }
  }
}

/** 查询角色列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await PermissionApi.getPermissionPage(queryParams)
    // list.value = data.data
    total.value = data.total
    formatData(data.data || [])
  } finally {
    loading.value = false
  }
}

// 格式化数据
const formatData = (arr) => {
  const midArr: any = []
  let obj = {}
  for (let i = 0; i < arr.length; i++) {
    if (obj.hasOwnProperty(arr[i].permissionType)) {
      obj[arr[i].permissionType].push(arr[i])
    } else {
      obj[arr[i].permissionType] = [arr[i]]
    }
  }

  for (const key in obj) {
    const item = { name: key, value: obj[key] }
    midArr.push(item)
  }

  list.value = midArr
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

//菜单权限
const permissionsMenu = ref()
const openMenu = (item: any) => {
  permissionsMenu.value.open(item.id, item.name)
}

/** 菜单权限操作 */
const assignMenuFormRef = ref()
const openAssignMenuForm = async (row: any) => {
  assignMenuFormRef.value.open(row)
}

/** 分配用户操作 */
const openAssignUserForm = async (row: PermissionApi.PermissionVO) => {
  router.push({ name: `PermissionUsers`, params: { id: row.id } })
}

// 分配部门

const assignDeptFormRef = ref()
const openAssignDeptForm = async (row?: any) => {
  assignDeptFormRef.value.open(row)
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await PermissionApi.deletePermisson(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.pagination {
  background: white;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  justify-content: end;
  padding-right: 20px;
}

.srarch-btn {
  background: #f1f3f7;
  border-radius: 4px;
  border: 1px solid #eaeaea;
  font-size: 12px;
  color: #666666;
}

.reset-btn {
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  font-size: 12px;
  color: #666666;
}

.add-btn {
  background: #0064ff;
  border-radius: 4px;
  font-size: 14px;
  color: #ffffff;
}

.cus-table {
  margin-bottom: 16px;

  .item-title {
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    margin-top: 4px;
  }

  .item {
    padding: 16px;
    box-sizing: border-box;
    background: linear-gradient(0deg,
        rgba(250, 252, 255, 0.19) 0%,
        rgba(242, 247, 255, 0.78) 37%,
        #ebf2ff 100%);

    border-radius: 6px;

    .row-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      font-weight: 400;
      font-size: 14px;
      color: #666666;
      padding: 0 20px;
      box-sizing: border-box;
    }

    .content-title {
      width: 30%;
      font-weight: 400;
      font-size: 14px;
      color: #333333;

      .btn-edit {
        font-weight: 400;
        font-size: 14px;
        color: #0078ff;
        cursor: pointer;
      }

      .btn-del {
        cursor: pointer;
        margin: 0 14px;
        font-weight: 400;
        font-size: 14px;
        color: #eb3737;
      }

      .more {
        width: 15px;
        height: 15px;
      }

      .img-content {
        margin-left: 10px;
        width: 24px;
        height: 24px;
      }
    }

    // .content-title:last-child {
    //   display: flex;
    //   flex-direction: row;
    //   justify-content: end;
    // }
    // .content-title:nth-child(2) {
    //   display: flex;
    //   flex-direction: row;
    //   justify-content: center;
    // }
    .row-content {
      width: 100%;
      height: 52px;
      background: #ffffff;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
      border-radius: 4px;
      margin: 16px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
    }

    .row-content:last-child {
      margin-bottom: 0px;
    }
  }
}

.cus-table:last-child {
  margin-bottom: 0;
}

.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
}

.more-btn {
  display: flex;
  flex-direction: column;

  .more-btn-item {
    height: 28px;
    line-height: 28px;
    width: 85px;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
    cursor: pointer;
  }

  .more-btn-item:hover {
    width: 85px;
    height: 28px;
    background: #f3f4f7;
    line-height: 28px;
    font-weight: 400;
    font-size: 14px;
    color: #0078ff;
  }
}

.empty-img {
  width: 100%;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #666666;
}
</style>
