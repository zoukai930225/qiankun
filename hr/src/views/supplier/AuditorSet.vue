<template>
  <div>
    <el-drawer
      v-model="dialogVisible"
      class="drawer"
      size="1000"
      :with-header="false"
      :title="dialogTitle"
      @close="handleClose"
    >
      <div class="drawer-wapperMenu">
        <div>
          <div class="title"
            ><span>审核人员设置</span
            ><img
              src="@/assets/imgs/common/close-drawer.png"
              alt=""
              class="close"
              @click="handleClose" /></div
        ></div>
        <div class="form-wapper">
          <div class="form">
            <el-form
              :inline="true"
              ref="formRef"
              v-loading="formLoading"
              :model="formData"
              label-width="60px"
              @submit.prevent
            >
              <el-form-item label="关键词:">
                <el-input
                  class="dialogFormItemWidth"
                  v-model="formData.inquire"
                  placeholder="请输入姓名/手机号码"
                  clearable
                  @keyup.enter="getData"
                  @clear="getData"
                  style="width: 223px; height: 32px"
                />
              </el-form-item>
              <el-button
                :disabled="formLoading"
                type="primary"
                @click="getData"
                class="ok"
                :icon="Search"
                >确 定</el-button
              >
              <el-button @click="resetHandle" size="small" class="cancle">取 消</el-button>
            </el-form>
          </div>
          <!--已选择 -->
          <div class="select-wapper">
            <div class="table-title">已选择</div>
            <div class="table-content">
              <div class="table-header"
                ><span class="table-name">
                  <span
                    class="select"
                    :class="{ 'active-select': topFlag }"
                    @click="selectAll(1)"
                  ></span
                  ><span>姓名</span></span
                >
                <span class="table-name">公司</span>
                <span class="table-name">手机号码</span></div
              >

              <div class="table-header" v-for="item in topList" :key="item.id"
                ><span class="table-value row-center">
                  <span
                    class="select"
                    :class="{ 'active-select': topSelectId?.includes(item.id) }"
                    @click="selectItem(1, item.id, item)"
                  ></span>
                  <span>{{ item.name || '' }}</span> </span
                ><span class="table-value">{{ translateCompany(item.userCompany) || '' }}</span
                ><span class="table-value">{{ item.mobile || '' }}</span></div
              >

              <div class="pagination">
                <Pagination
                  v-model:limit="topParams.size"
                  v-model:page="topParams.page"
                  :total="topTotal"
                  @pagination="getList(1)"
                />
              </div>
            </div>
          </div>
          <div class="btn-wapper-mid">
            <el-tooltip content="授权" placement="top">
              <div
                class="btn-item"
                :class="{ bottom: bottomSelectId.length > 0, top: bottomSelectId.length === 0 }"
                @click="handleSubmit(1)"
              >
                <img
                  v-if="bottomSelectId.length > 0"
                  src="@/assets/imgs/common/top.png"
                  class="img"
                  alt=""
                />
                <img v-else src="@/assets/imgs/common/top_hl.png" class="img" alt="" />
              </div>
            </el-tooltip>

            <el-tooltip content="取消授权" placement="bottom">
              <div
                class="btn-item"
                :class="{ bottom: topSelectId.length > 0, top: topSelectId.length === 0 }"
                @click="handleSubmit(2)"
              >
                <img
                  v-if="topSelectId.length > 0"
                  src="@/assets/imgs/common/bottom.png"
                  class="img"
                  alt=""
                />
                <img v-else src="@/assets/imgs/common/bottom_hl.png" class="img" alt="" />
              </div>
            </el-tooltip>
          </div>
          <!--未选择 -->
          <div class="select-wapper no-select-wapper">
            <div class="table-title">未选择</div>
            <div class="table-content">
              <div class="table-header"
                ><span class="table-name"
                  ><span
                    class="select"
                    :class="{ 'active-select': bottomFlag }"
                    @click="selectAll(2)"
                  ></span
                  ><span>姓名</span></span
                >
                <span class="table-name">公司</span>
                <span class="table-name">手机号码</span></div
              >

              <div class="table-header" v-for="item in bottomList" :key="item.userId"
                ><span class="table-value row-center"
                  ><span
                    class="select"
                    :class="{ 'active-select': bottomSelectId?.includes(item.userId) }"
                    @click="selectItem(2, item.userId, item)"
                  ></span>
                  <span>{{ item.name || '' }}</span>
                </span>
                <span class="table-value">{{ translateCompany(item.company) || '' }}</span>
                <span class="table-value">{{ item.mobile || '' }}</span></div
              >

              <div class="pagination">
                <Pagination
                  v-model:limit="bottomParams.size"
                  v-model:page="bottomParams.page"
                  :total="bottomTotal"
                  @pagination="getList(2)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import { getUnboundPerson, getBoundPerson, removePerson, saveBandPerson } from '@/api/supplier'
import { Search } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
defineOptions({ name: 'SystemPermissionForm' })
const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formData = ref({
  inquire: ''
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

const topSelectId = ref<string[]>([])
const bottomSelectId = ref<string[]>([])
const bottomSelectList = ref<string[]>([])
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
        return item.userId
      })
      bottomSelectList.value = JSON.parse(JSON.stringify(bottomList.value))
    } else {
      bottomSelectId.value = []
      bottomSelectList.value = []
    }
  }
}

const selectItem = (type, id, item) => {
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
      bottomSelectList.value.push(item)
      console.log(bottomSelectList.value)
    } else {
      bottomSelectId.value.splice(index, 1)
      bottomSelectList.value.splice(index, 1)
    }

    if (bottomSelectId.value.length == bottomList.value.length) {
      bottomFlag.value = true
    } else {
      bottomFlag.value = false
    }
  }
}
const handleSubmit = async (type) => {
  // 1、授权 2、取消授权
  if (
    (bottomSelectId.value.length === 0 && type == 1) ||
    (topSelectId.value.length === 0 && type == 2)
  ) {
    return
  }
  let list = []
  if (type == 1) {
    list = bottomSelectList.value.map((item: any) => {
      return {
        userId: item.userId,
        name: item.name,
        userCompany: item.company,
        mobile: item.mobile.replace('+86 ', '')
      }
    }) as []
    await saveBandPerson(list)
  } else if (type == 2) {
    list = topSelectId.value as []
    await removePerson(list)
  }
  message.success('操作成功')
  getUserListNotChoice()
  getUserListChoice()
  reset()
}
const reset = () => {
  topSelectId.value = []
  bottomSelectId.value = []
  bottomSelectList.value = []
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
    ...formData.value
  }
  const res = await getUnboundPerson(params)
  bottomTotal.value = res.total || 0
  bottomList.value =
    res.records.map((item: any) => {
      return {
        ...item,
        mobile: item.mobile.replace('+86 ', '')
      }
    }) || []
}

// 户权限分配列表已分配该权限
const getUserListChoice = async () => {
  const params = {
    ...topParams.value,
    ...formData.value
  }
  const res = await getBoundPerson(params)
  topTotal.value = res.total || 0
  topList.value = res.records || []
}

/** 打开弹窗 */
const open = async () => {
  dialogVisible.value = true
  resetForm()
  // 修改时，设置数据
  //获取未分配权列表
  getUserListNotChoice()
  getUserListChoice()
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    inquire: ''
  }
  formRef.value?.resetFields()
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const resetHandle = () => {
  resetForm()
  getData()
}
/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
// 搜索按钮
const getData = async () => {
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
@use '@/styles/drawer.scss';
.drawer-wapperMenu {
  background: url('@/assets/imgs/common/drawer-bg.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
  // width: 960px;
  height: auto;
  border-radius: 0;
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
    .form {
    }
  }
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

:deep(.el-form) {
  display: flex;
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
        min-width: 33.33%;
        display: flex;
        flex-direction: row;
        align-items: center;
      }
      .table-value {
        font-weight: 400;
        font-size: 14px;
        color: #333333;
        min-width: 33.33%;
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
</style>
