<template>
  <el-drawer v-model="dialogVisible" size="960" :with-header="false" :title="dialogTitle" @close="handleClose">
    <div class="drawer-wapperMenu">
      <div>
        <div class="title"><span style="font-size: 16px; font-weight: bold">分配用户 ( {{ formData.permissionName }})</span>
          <img src="@/assets/imgs/common/close-drawer.png" alt="" class="close" @click="handleClose" />
        </div>
      </div>
      <div class="form-wapper">
        <div class="form">
          <el-form :inline="true" ref="formRef" v-loading="formLoading" :model="formData" class="form-inline">
            <el-form-item label="账号:" prop="userNo" class="form-item">
              <el-input v-model="formData.userNo" placeholder="请输入账号" clearable @keyup.enter="submitForm"
                @clear="submitForm" />
            </el-form-item>
            <el-form-item label="姓名:" prop="userName" class="form-item">
              <el-input v-model="formData.userName" placeholder="请输入姓名" clearable @keyup.enter="submitForm"
                @clear="submitForm" />
            </el-form-item>
            <el-form-item label="部门:" prop="departmentId" class="form-item">
              <Menuitem v-model="formData.departmentId" @change="handleSearch" />
            </el-form-item>
          </el-form>
          <div style="
              margin-bottom: 20px;
              display: flex;
              flex-direction: row;
              justify-content: end;
              width: 100%;
            ">
            <el-button :disabled="formLoading" type="primary" @click="submitForm" class="ok" :icon="Search">确
              定</el-button>
            <el-button @click="dialogVisible = false" class="cancle">取 消</el-button>
          </div>
        </div>
        <!--已选择 -->
        <div class="select-wapper">
          <div class="table-title">已选择</div>
          <div class="table-content">
            <div class="table-header"><span class="table-name">
                <span class="select" :class="{ 'active-select': topFlag }" @click="selectAll(1)"></span><span>账号</span>
              </span><span class="table-name">姓名</span>
              <span class="table-name">公司</span>
              <span class="table-name">手机号码</span><span class="table-name">账号类型</span>
            </div>

            <div class="table-header" v-for="item in topList" :key="item.id"><span class="table-value row-center">
                <span class="select" :class="{ 'active-select': topSelectId?.includes(item.id) }"
                  @click="selectItem(1, item.id)"></span>
                <span>{{ item.username || '' }}</span> </span><span class="table-value">{{ item.realName || ''
                }}</span><span class="table-value">{{ translateCompany(item.company) || '' }}</span><span
                class="table-value">{{ item.phone || '' }}</span>
              <!-- 账号类型 -->
              <span class="table-value">{{ item.numberType || '' }}</span>
            </div>

            <div class="pagination">
              <Pagination v-model:limit="topParams.size" v-model:page="topParams.page" :total="topTotal"
                @pagination="getList(1)" />
            </div>
          </div>
        </div>
        <div class="btn-wapper-mid">
          <el-tooltip content="授权" placement="top">
            <div class="btn-item" :class="{ bottom: bottomSelectId.length > 0, top: bottomSelectId.length === 0 }"
              @click="handleSubmit(1)">
              <img v-if="bottomSelectId.length > 0" src="@/assets/imgs/common/top.png" class="img" alt="" />
              <img v-else src="@/assets/imgs/common/top_hl.png" class="img" alt="" />
            </div>
          </el-tooltip>

          <el-tooltip content="取消授权" placement="bottom">
            <div class="btn-item" :class="{ bottom: topSelectId.length > 0, top: topSelectId.length === 0 }"
              @click="handleSubmit(2)">
              <img v-if="topSelectId.length > 0" src="@/assets/imgs/common/bottom.png" class="img" alt="" />
              <img v-else src="@/assets/imgs/common/bottom_hl.png" class="img" alt="" />
            </div>
          </el-tooltip>
        </div>
        <!--未选择 -->
        <div class="select-wapper no-select-wapper">
          <div class="table-title">未选择</div>
          <div class="table-content">
            <div class="table-header"><span class="table-name"><span class="select"
                  :class="{ 'active-select': bottomFlag }" @click="selectAll(2)"></span><span>账号</span></span><span
                class="table-name">姓名</span>
              <span class="table-name">公司</span>
              <span class="table-name">手机号码</span><span class="table-name">账号类型</span>
            </div>

            <div class="table-header" v-for="item in bottomList" :key="item.id"><span
                class="table-value row-center"><span class="select"
                  :class="{ 'active-select': bottomSelectId?.includes(item.id) }"
                  @click="selectItem(2, item.id)"></span>
                <span>{{ item.username || '' }}</span> </span><span class="table-value">{{ item.realName || '' }}</span>
              <span class="table-value">{{ translateCompany(item.company) || '' }}</span>
              <span class="table-value">{{ item.phone || '' }}</span>
              <!-- 账号类型 -->
              <span class="table-value">{{ item.numberType || '' }}</span>
            </div>

            <div class="pagination">
              <Pagination v-model:limit="bottomParams.size" v-model:page="bottomParams.page" :total="bottomTotal"
                @pagination="getList(2)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script lang="ts" setup>
import * as PermissionApi from '@/api/system/permission'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import Menuitem from '@/views/hrAdmin/resources/components/Menuitem.vue'
import { Search } from '@element-plus/icons-vue'
defineOptions({ name: 'SystemPermissionForm' })
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: '',
  userNo: '',
  userName: '',
  permissionName: '',
  departmentId: ''
})

const formRef = ref() // 表单 Ref

const handleClose = () => {
  dialogVisible.value = false
  topSelectId.value = []
  bottomSelectId.value = []
  resetForm()
}
const topFlag = ref(false) // 已授权全选
const bottomFlag = ref(false) // 未授权全选
const getList = async (type) => {
  // type 1 已授权 2 未授权
  if (type == 1) {
    getUserListChoice()
    topFlag.value = false
    topSelectId.value = []
  } else if (type == 2) {
    bottomFlag.value = false
    bottomSelectId.value = []
    getUserListNotChoice()
  }
}

// 搜索
const handleSearch = (value) => {
  topParams.value.page = 1
  bottomParams.value.page = 1
  // value 是 Menuitem 组件传递过来的值
  if (value) {
    formData.value.departmentId = value[value.length - 1]
  }
  getUserListNotChoice()
  getUserListChoice()
}

const topSelectId = ref<string[]>([])
const bottomSelectId = ref<string[]>([])
const selectAll = (type) => {
  // type 1 已授权 2 未授权
  if (type == 1) {
    topFlag.value = !topFlag.value
    if (topFlag.value) {
      topSelectId.value = topList.value.map((item) => {
        return item.id
      })
    } else {
      topSelectId.value = []
    }
  } else if (type == 2) {
    bottomFlag.value = !bottomFlag.value
    if (bottomFlag.value) {
      bottomSelectId.value = bottomList.value.map((item) => {
        return item.id
      })
    } else {
      bottomSelectId.value = []
    }
  }
}

const selectItem = (type, id) => {
  if (type == 1) {
    const index = topSelectId.value.indexOf(id)
    if (index == -1) {
      topSelectId.value.push(id)
    } else {
      topSelectId.value.splice(index, 1)
    }

    if (topSelectId.value.length == topList.value.length) {
      topFlag.value = true
    } else {
      topFlag.value = false
    }
  } else if (type == 2) {
    const index = bottomSelectId.value.indexOf(id)
    if (index == -1) {
      bottomSelectId.value.push(id)
    } else {
      bottomSelectId.value.splice(index, 1)
    }

    if (bottomSelectId.value.length == bottomList.value.length) {
      bottomFlag.value = true
    } else {
      bottomFlag.value = false
    }
  }
}
const handleSubmit = async (type) => {
  // 1、授权 2、取消授权  // permissionUserSave
  let data = { id: '', ids: [] }
  data.id = formData.value.id
  if (type == 1) {
    data.ids = bottomSelectId.value as []
  } else if (type == 2) {
    data.ids = topSelectId.value as []
  }
  if (data.ids.length > 0) {
    if (type == 1) {
      await PermissionApi.permissionUserSave(data)
    } else if (type == 2) {
      await PermissionApi.permissionUserRemove(data)
    }
    message.success('操作成功')
    getUserListNotChoice()
    getUserListChoice()
    reset()
  }
}
const reset = () => {
  topSelectId.value = []
  bottomSelectId.value = []
  topFlag.value = false
  bottomFlag.value = false
}

const topList = ref() //已授权
const bottomList = ref() //未授权
const topParams = ref({
  page: 1,
  size: 10
})
const bottomParams = ref({
  page: 1,
  size: 10
})
const topTotal = ref(10) // 列表的总页数
const bottomTotal = ref(10) // 列表的总页数

// 户权限分配列表未分配该权限
const getUserListNotChoice = async () => {
  const params = {
    ...bottomParams.value,
    ...formData.value,
    permissionId: formData.value.id,
    departmentId: formData.value.departmentId ? formData.value.departmentId : '',
    id: undefined
  }
  const res = await PermissionApi.getUserListNotChoice(params)
  bottomTotal.value = res.total || 0
  bottomList.value = res.data || []
}

// 户权限分配列表已分配该权限
const getUserListChoice = async () => {
  const params = {
    ...topParams.value,
    ...formData.value,
    permissionId: formData.value.id,
    departmentId: formData.value.departmentId ? formData.value.departmentId : '',
    id: undefined
  }
  const res = await PermissionApi.getUserListChoice(params)
  topTotal.value = res.total || 0
  topList.value = res.data || []
}

/** 打开弹窗 */
const open = async (id: string, name: string) => {
  dialogVisible.value = true
  resetForm()
  formData.value.id = id
  formData.value.permissionName = name
  // 修改时，设置数据
  //获取未分配权列表
  getUserListNotChoice()
  getUserListChoice()
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: '',
    userNo: '',
    userName: '',
    permissionName: '',
    departmentId: ''
  }
  formRef.value?.resetFields()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
// 搜索按钮
const submitForm = async () => {
  getUserListNotChoice()
  getUserListChoice()
}

// 所属公司
const translateCompany = (companyValue) => {
  const Company = getIntDictOptions(DICT_TYPE.PR_COMPANY).find(
    (option) => option.value === companyValue
  )

  return Company ? Company.label : companyValue
}
</script>

<style scoped lang="scss">
.drawer-wapperMenu {
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  padding: 23px 22px 0 18px;
  box-sizing: border-box;
  width: 960px;
  overflow-x: hidden;
  height: auto;

  .title {
    font-size: 14px;
    color: #333333;
    margin-bottom: 18px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .close {
      width: 21px;
      height: 24px;
      cursor: pointer;
    }
  }

  .form-wapper {
    background: #ffffff;
    border-radius: 8px;
    padding: 16px 20px 20px 27px;
    box-sizing: border-box;

    .btn-wapper {
      display: flex;
      justify-content: flex-end;
    }

    .form {}
  }
}

:global(.el-drawer__body) {
  padding: 0 !important;
  // background: rgba(0, 0, 0, 0.5);
}

:deep(.el-input__wrapper) {
  height: 32px;
  background: #f8f8f9;
  border-radius: 4px;
}

:deep(.el-select__wrapper) {
  height: 32px;
  background: #f8f8f9;
  border-radius: 4px;
}

:global(.el-drawer__header) {
  // background: rgba(0, 0, 0, 0.5);
  // margin-bottom: 0;
  // padding: 0;
}

:deep(.el-form) {
  display: flex;
  flex-wrap: wrap;
}

.ok {
  width: 75px;
  height: 32px;
  line-height: 32px;
  background: #f1f3f7;
  text-align: center;
  border-radius: 4px;
  border: 1px solid #eaeaea;
  font-size: 12px;
  color: #666666;
}

.cancle {
  width: 64px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
}

.select-wapper {
  .table-title {
    width: 100%;
    height: 40px;
    line-height: 40px;
    background: #f3f5f8;
    border-radius: 6px 6px 0px 0px;
    font-weight: 500;
    font-size: 14px;
    color: #333333;
    padding-left: 20px;
    box-sizing: border-box;
  }

  .table-content {
    width: 100%;
    background: #fdfeff;
    border: 1px solid #ecedef;

    .table-header {
      display: flex;
      flex-direction: row;
      align-items: center;
      // justify-content: space-between;
      padding: 17px 23px;
      box-sizing: border-box;
      border-bottom: 1px solid #f0f0f0;

      .table-name {
        font-weight: 400;
        font-size: 14px;
        color: #666666;
        min-width: 20%;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .table-value {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        min-width: 20%;
      }

      .select {
        display: inline-block;
        width: 14px;
        height: 14px;
        border: 1px solid #e5e5e5;
        margin-right: 14px;
        cursor: pointer;
      }

      .active-select {
        cursor: pointer;
        background: url('@/assets/imgs/common/select-bg.png');
        background-size: 100% 100%;
      }
    }

    .table-header:last-child {
      border-bottom: none;
    }
  }
}

.btn-wapper-mid {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 16px 0;

  .btn-item {
    cursor: pointer;
    width: 56px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    .img {
      width: 8px;
      height: 13px;
    }
  }

  .top {
    background: #eaf3ff;
    border: 1px solid #67a3ff;
    margin-right: 26px;
    opacity: 0.5;
  }

  .bottom {
    border: 0px solid #67a3ff;
    background: #0064ff;
    margin-right: 26px;
    opacity: 1;
  }
}

.no-select-wapper {}

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

.form-inline {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.form-item {
  flex: 1;
  margin-right: 20px;

  &:last-child {
    margin-right: 0;
  }

  .el-input,
  Menuitem {
    width: 100%;
  }
}
</style>
