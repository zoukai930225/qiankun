<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="80px"
          @submit.prevent
        >
          <el-form-item label="名称" prop="typeName">
            <el-input
              class="queryFormItemWidth"
              v-model="queryParams.typeName"
              clearable
              placeholder="请输入名称"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item label="编码" prop="typeCode">
            <el-input
              class="queryFormItemWidth"
              v-model="queryParams.typeCode"
              clearable
              placeholder="请输入编码"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
            />
          </el-form-item>

          <el-form-item label="类型" prop="typeCategory">
            <el-select
              class="queryFormItemWidth"
              v-model="queryParams.typeCategory"
              placeholder="请选择"
              clearable
              @change="handleQuery"
              @clear="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.APPLICATION_TYPE, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <!-- 优先级 -->
          <el-form-item label="业务场景" prop="businessScenario">
            <el-select
              class="queryFormItemWidth"
              v-model="queryParams.businessScenario"
              placeholder="请选择"
              clearable
              @change="handleQuery"
              @clear="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.RPA_PROGRAM_TYPE, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="isExpand" label="渠道" prop="channel">
            <el-select
              class="queryFormItemWidth"
              v-model="queryParams.channel"
              placeholder="请选择"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="isExpand" label="负责人" prop="rpaPersonInCharge">
            <el-select
              class="queryFormItemWidth"
              v-model="queryParams.rpaPersonInCharge"
              placeholder="请选择"
              clearable
              filterable
              @change="handleQuery"
            >
              <el-option
                v-for="dict in userList"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-show="isExpand" label="优先级" prop="priority">
            <el-select
              class="queryFormItemWidth"
              v-model="queryParams.priority"
              placeholder="请选择"
              clearable
              @change="handleQuery"
            >
              <el-option
                v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_PRIORITY, true)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
          <!-- <el-button @click="resetQuery">
            <Icon class="mr-5px" icon="ep:refresh" />
            重置
          </el-button> -->
          <SWFilterAdd
            class="commonAddBtn"
            :list="addList"
            :current-code="currentAddCode"
            @add-btn-click="addBtnClick"
          />
        </div>
      </div>
    </div>
  </ContentWrap>
  <ContentWrap>
    <ElScrollbar>
      <!-- 列表 -->
      <div class="list-wrap">
        <!-- 表头 -->
        <div class="list-header">
          <div class="header-item" style="min-width: 300px">名称</div>
          <div class="header-item" style="min-width: 320px">编码</div>
          <div class="header-item">类型</div>
          <!-- <div class="header-item">执行时间</div> -->
          <div class="header-item">数据库表</div>
          <div class="header-item">业务场景</div>
          <div class="header-item" style="width: 240px; text-align: center; min-width: 200px"
            >操作</div
          >
        </div>
        <div v-if="loading" class="loading-placeholder">
          <el-icon class="is-loading"><Loading /></el-icon>
          加载中...
        </div>
        <div v-else-if="list.length > 0">
          <div class="list-content" v-for="item in list" :key="item.id">
            <!-- 名称 -->
            <div
              class="content-item cursor-pointer"
              style="min-width: 300px"
              @click="copyText(item.typeName)"
              >{{ item.typeName || '--' }}</div
            >
            <!-- 编码 -->
            <div
              class="content-item cursor-pointer"
              style="min-width: 320px"
              @click="copyText(item.typeCode)"
              >{{ item.typeCode || '--' }}</div
            >

            <!-- 类型 -->
            <div class="content-item">
              {{ getDictLabel(DICT_TYPE.APPLICATION_TYPE, item.typeCategory) || '--' }}
            </div>
            <!-- 执行时间 -->
            <!-- <div class="content-item"> -->
            <!-- {{ item.executionTime || '--' }} -->
            <!-- 只取后面的时分秒 -->
            <!-- {{
                item.executionTime && item.executionTime !== ''
                  ? formatDate(new Date(item.executionTime), 'HH:mm:ss')
                  : '--'
              }} -->
            <!-- </div> -->
            <!-- 数据库表 -->
            <div class="content-item cursor-pointer" @click="copyText(item.typeDbName)">{{
              item.typeDbName || '--'
            }}</div>
            <!-- 业务场景 -->
            <div class="content-item">
              {{ getDictLabel(DICT_TYPE.RPA_PROGRAM_TYPE, item.businessScenario) || '--' }}
            </div>
            <!-- 操作 -->
            <div
              class="content-item action-wrap"
              style="width: 240px; text-align: center; min-width: 200px"
            >
              <span class="action-edit more-btn-item" @click="openRelatedConfig(item)">
                <img src="@/assets/imgs/rpaManage/open.png" alt="" class="action-img" />
                查看参数</span
              >

              <span class="action-edit more-btn-item" @click="openForm('update', item.id)">
                <img src="@/assets/imgs/rpaManage/edit.png" alt="" class="action-img" />
                编辑</span
              >

              <span class="action-delete more-btn-item" @click="handleDelete(item.id)">
                <el-icon><Delete /></el-icon>
                删除</span
              >
            </div>
          </div>
        </div>
        <div v-else class="empty-img">
          <img src="@/assets/imgs/common/empty_list.png" alt="" />
          <div>暂无数据</div>
        </div>
      </div>
    </ElScrollbar>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <ProgramTypeForm ref="formRef" @success="getList" />
  <!-- 查看参数 -->
  <RelatedConfigList ref="RelatedConfigRef" />
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime'
import { ref, onMounted } from 'vue'
import { copyText } from '@/utils/copyText'
import * as rpaProgramTypeApi from '@/api/rpaManage/programType'
import * as rpaApi from '@/api/rpaManage'
import { IProgramType } from '@/api/rpaManage/programType'
import ProgramTypeForm from './components/addProgramType.vue'
import RelatedConfigList from '../components/relatedConfigList.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
const isExpand = ref(false) // 是否展开
const message = useMessage()
const { t } = useI18n() // 国际化
const queryFormRef = ref()
// 查询参数
const queryParams = ref({
  page: 1,
  pageSize: 10,
  typeCode: '',
  typeName: '',
  typeCategory: '',
  businessScenario: '',
  channel: '',
  rpaPersonInCharge: '',
  priority: ''
})

// 搜索
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

// 列表数据
const loading = ref(false)
const list = ref<any[]>([])
const total = ref(0)

const getList = async () => {
  loading.value = true
  try {
    const data = await rpaProgramTypeApi.getProgramTypeList(queryParams.value).catch(() => {})
    if (data) {
      list.value = data.records
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

// 重置
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 新增类型 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id)
  }
}

// 查看参数操作
const RelatedConfigRef = ref()
const openRelatedConfig = (data?: any) => {
  console.log('打开查看参数:', data)
  if (RelatedConfigRef.value) {
    RelatedConfigRef.value.open(data.typeName, data.typeCode, data.id)
  }
}
/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await rpaProgramTypeApi.deleteProgramType({ id: id })
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

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

// 查询负责人
interface User {
  label: string
  value: string
}
const userList = ref<User[]>([])
const getUserList = async () => {
  let data = await rpaApi.getUserList({ page: 1, size: 99999 })
  userList.value = data?.data.map((item) => ({ label: item.realName, value: item.id }))
}

onMounted(() => {
  getList()
  getUserList()
})
</script>

<style lang="scss" scoped>
@use '../index.scss';

.queryFormItemWidth {
  width: 200px;
}

.action-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.action-edit {
  color: #007eff;
}
.action-delete {
  color: #ff4d4f;
}

.action-img {
  width: 12px;
}
</style>
