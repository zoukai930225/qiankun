<template>
  <ContentWrap>
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="mb-0px searchForm"
            label-width="80px"
          >
            <el-form-item label="问题处理部门" prop="handleDept" class="textWapper">
              <el-select
                class="!w200px"
                v-model="queryParams.handleDept"
                placeholder="请选择问题处理部门"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_HANDLE_DEPT, true)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="品类" prop="category">
              <el-select
                class="!w200px"
                v-model="queryParams.category"
                placeholder="请选择品类"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_CATEGORY, true)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="反馈类型" prop="type">
              <el-select
                class="!w200px"
                v-model="queryParams.type"
                placeholder="请选择反馈类型"
                clearable
                @change="handleQuery"
              >
                <el-option
                  v-for="item in getIntDictOptions(DICT_TYPE.CS_PROBLEM_FEEDBACK_TYPE, true)"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>    
            </el-form-item>
            <el-form-item label="问题对接负责人" prop="directorId" class="textWapper">
              <!-- <SelectUser  v-model="queryParams.directorId" :multiple="false"   class="!w200px" /> -->
               <!-- <el-input v-model="queryParams.directorName" placeholder="请输入问题对接负责人" clearable class="!w200px" /> -->
                <el-select class="!w200px" popper-class="eloption" :popper-append-to-body="true" v-model="queryParams.directorId"
                placeholder="请选择" filterable clearable  @change="userChange" remote :remote-method="remoteMethod">
                <template #label>
                  <div class="label-wrapper">
                    <img class="avatorLogo" :src="queryParams.avatarOrigin || DefaultAvatar" alt="" />
                    <span class="name">{{ queryParams.directorName }} </span>
                  </div>
                </template>
                <el-option v-for="dict in peopleList" :key="dict.userId" :label="dict.userName"
                  :value="dict" value-key="userId">
                  <div class="peopleOption">
                    <div class="left-wapper">
                      <img class="img" :src="dict.avatarOrigin || DefaultAvatar" alt="" />
                      <div class="info">
                        <span class="text name">{{ dict.userName }}</span>
                        <!-- <span class="text desc">{{ dict.departmentName || '--' }}</span> -->
                      </div>
                    </div>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button @click="resetQuery">
                  重置
              </el-button>
                <SWFilterAdd
                  class="commonAddBtn"
                  :list="addList"
                  :current-code="currentAddCode"
                  @add-btn-click="addBtnClick"
                />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 列表 -->
    <el-table
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      row-class-name="commonTableRow"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="问题处理部门" prop="deptName" min-width="250">
        <template #default="scope">
          <div class="row text1">
            {{ scope.row.deptName || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="品类" prop="categoryName" min-width="210">
        <template #default="scope">
          <div class="row">
            {{ scope.row.categoryName || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="反馈类型" prop="typeName" min-width="120">
       <template #default="scope">
          <div class="row">
            {{ scope.row.typeName || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="问题对接负责人" prop="directorName" min-width="150">
        <template #default="scope">
          <div class="row">
            <LineAvatar :user="{image:scope.row.avatarOrigin,name:scope.row.directorName}" image="image"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建人" prop="createUserName" min-width="200">
        <template #default="scope">
          <div class="row">
            <LineAvatar :user="{image:scope.row.createAvatarOrigin,name:scope.row.createUserName}" image="image"/>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="createdAt" min-width="200" />
      <el-table-column label="操作按钮" :show-overflow-tooltip="false" fixed="right" width="150">
        <template #default="scope">
          <el-button type="primary"  @click="openForm('update', scope.row.id)" link>
            编辑
          </el-button>
          <el-button type="danger" @click="handleDelete(scope.row.id)" link>
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </div>
  </ContentWrap>
  <!-- 表单抽屉 -->
  <ActionDialog ref="formRef" @success="getList"  :key = "dialogKey"/>
</template>

<script lang="ts" setup>

import { useAppStore } from '@/store/modules/app'
import { Delete, Edit } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import ActionDialog from './components/ActionDialog.vue'
import * as prolemContactApi from '@/api/customerService/problemContact'
import LineAvatar from '@/components/template/table/components/lineAvatar.vue';
import SelectUser from '@/components/common/user/selectUser.vue';
import DefaultAvatar from '@/assets/svgs/defaultAvatar.svg'
import request from '@/config/axios';
const appStore = useAppStore()

const dialogKey = ref(0)
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(false) // 列表的加载中
const list = ref<any[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = ref<any>({
  page: 1,
  size: 10,
  handleDept: '',
  category: '',
  type: '',
  directorId: '',
  directorName: '',
  avatarOrigin: '',
})
const queryFormRef = ref() // 搜索的表单

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
      openForm('create', '')
    }
  }
}
// 选择用户
const peopleList = ref<any>([])
const userChange = (val) => {
  console.log("val",val)
  if (!val){
    queryParams.value.directorId = ''
    queryParams.value.directorName = ''
    queryParams.value.avatarOrigin = ''
    handleQuery()
    return
  }
  queryParams.value.directorId = val.userId
  queryParams.value.directorName = val.userName
  queryParams.value.avatarOrigin = val.avatarOrigin
  handleQuery()
}
const remoteMethod = (val: string) => {
  request.get({
    url: `/api/csProblemContactPersonConfig/getPersonnelData?userName=${val}`,
    method: 'get',
  }).then((res) => {
    peopleList.value = res || []
  }).catch((error) => {
    // message.error(error.message)
  })
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  dialogKey.value ++;
  nextTick(() =>{
        if (formRef.value) {
    formRef.value.open(type, id)
  }
  })

}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  // queryParams.value.store = ''
  handleQuery()
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const params = { ...queryParams.value }
    delete params.avatarOrigin
    const data = await prolemContactApi.configList(queryParams.value)
    // 给每一项添加一个showPassword属性
    list.value = (data.records || []).map((item) => {
      return {
        ...item
      }
    })
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await prolemContactApi.deleteConfigById({id})
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}



/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="less" scoped>
:deep(.searchForm){
  display: flex;
  flex-wrap: wrap;
}
.textWapper{
  :deep(.el-form-item__label){
  line-height: 16px !important;
  text-align: right;
}
}
.test-btn {
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrapper {
  width: 100%;
  height: 100%;
  // padding: 11px;
  box-sizing: border-box;
  // background-color: #f2f6fc;
  background-color: #fff;
}
.header-wrapper {
  background-color: #fff;
  padding: 16px 20px;
  box-sizing: border-box;
  border-top-left-radius: 14px;
  border-top-right-radius: 14px;
  &-title {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    margin: 0 0 16px 0;
  }
}
.user{
  display: flex;
  align-items: center;
  .ava{
    margin-right: 10px;
  }
}
.action-btn-wapper{
  width: 100%;
  display: flex;
  justify-content: space-between;
  .el-button+.el-button{
    margin-left: 0px !important;
   }
}
// 上传人选择器
.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}

// 下拉选项样式
.peopleOption {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;
  width: 100px;

  .left-wapper {
    display: flex;
    align-items: center;
  }

  .img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 14px;

    .text {
      height: 20px;
      line-height: 20px;
    }

    .name {
      font-size: 14px;
      color: #333333;
    }

    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}

// 选择的人样式
.label-wrapper {
  display: flex;
  align-items: center;
  height: 26px;
  background: #cad6f8;
  border-radius: 13px;
  padding: 1px 6px;
  box-sizing: border-box;
  width: fit-content;
  .name {
    font-size: 14px;
    color: #333333;
    margin-left: 6px;
    margin-right: 6px;
  }

  .avatorLogo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
}
</style>
