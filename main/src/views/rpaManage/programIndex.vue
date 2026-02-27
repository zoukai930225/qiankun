<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" class="-mb-15px">
          <el-form-item label="任务" prop="taskName">
            <!-- <el-input
          class="dialogFormItemWidth"
          v-model="queryParams.taskName"
          placeholder="请输入任务名称"
          :suffix-icon="Search"
          clearable
          style="width: 223px"
          @clear="handleQuery"
          @keyup.enter="handleQuery"
        /> -->
            <el-select
              class="searchFormItemWidth"
              v-model="queryParams.taskName"
              placeholder="请输入任务名称"
              clearable
              filterable
              @clear="handleClear"
              @change="handleQuery"
            >
              <el-option
                v-for="dict in taskOptions"
                :key="dict.value"
                :label="dict.label"
                :value="dict.label"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="应用名称/code" prop="param">
            <el-input
              class="searchFormItemWidth"
              :prefix-icon="Search"
              v-model="queryParams.param"
              placeholder="请输入应用名称/code"
              clearable
              style="width: 223px"
              @clear="handleQuery"
              @keyup.enter="handleQuery"
            />
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
    <div v-if="list.length > 0">
      <div class="categorizedList" v-for="item in list" :key="item.id">
        <div class="categorizedList-type cursor_pointer"
          >{{ item.taskName }}
          <!-- 修改任务名称 -->
          <img
            src="@/assets/imgs/dashboard/programGroup/icon_1.png"
            alt=""
            style="margin-left: 14px"
            @click="updateTaskName(item.id)"
          />
          <span class="line"> | </span>
          <!-- 关联 -->
          <img
            src="@/assets/imgs/dashboard/programGroup/icon_2.png"
            alt=""
            @click="openTeamComponent(item.id)"
          />
          <span class="line"> | </span>
          <!-- 删除 -->
          <el-icon color="#888" @click="handleTitleDelete(item.id)"><Delete /></el-icon>
        </div>

        <div class="categorizedList-card">
          <!-- 表头 -->
          <div class="categorizedList-header" v-if="item.skTabulateGroups.length > 0">
            <div class="content-item-wrap">
              <div class="header-item">应用名称</div>
              <div class="header-item">应用编码</div>
              <div class="header-item" style="width: 10%">梯队编号</div>
              <div class="header-item" style="width: 10%">触发类型</div>
            </div>
            <div class="action">操作</div>
          </div>
          <!-- 表格内容 -->
          <div v-if="item.skTabulateGroups.length > 0">
            <div class="categorizedList-content" v-for="i in item.skTabulateGroups" :key="i.id">
              <div class="content-item-wrap">
                <!-- 应用名称 -->
                <div class="content-item">{{ i.name || '--' }}</div>
                <!-- 应用编码 -->
                <div class="content-item">{{ i.code || '--' }}</div>

                <!-- 梯队编号 -->
                <div class="content-item" style="width: 10%"
                  >梯队{{ convertToNumber(i.echelon) || '--' }}</div
                >
                <!-- 触发类型 -->
                <div
                  class="content-item"
                  :style="{
                    width: '10%'
                  }"
                >
                  {{
                    getDictLabel(
                      DICT_TYPE.TASK_PROGRAM_TWOECHELON_EXECUTE_TYPE,
                      i.echelonExecuteType
                    ) || '--'
                  }}</div
                >
              </div>

              <!-- 操作 -->
              <div class="action cursor_pointer">
                <!-- <div @click="openForm('update', i.skBoardEchelonTabulateGroupId)" class="action-btn"
                  ><el-icon style="vertical-align: middle"><Edit /></el-icon>编辑</div
                > -->
                <div
                  @click="handleDelete(i.skBoardEchelonTabulateGroupId)"
                  class="action-btn"
                  style="color: #eb3737"
                  >删除</div
                >
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

    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <ListForm ref="formRef" @success="getList" />
  <!-- 弹窗：已关联参数配置 -->
  <RelatedConfigList ref="RelatedConfigRef" />
  <!-- 维护任务 -->
  <AddTask ref="AddTaskRef" @success="getList" />

  <!-- 新增应用 -->
  <ProgramGroupForm ref="ProgramGroupFormRef" @success="getList" />

  <!-- 维护任务与应用的对照关系 -->
  <TeamComponent ref="TeamComponentRef" @success="getList" />
</template>

<script lang="ts" setup>
defineOptions({ name: 'RpaListIndex' })
import { computed, ref, markRaw } from 'vue'
import ListForm from './components/ListForm.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import RelatedConfigList from './components/relatedConfigList.vue'
import AddTask from './components/AddTask.vue'
import ProgramGroupForm from './components/ProgramGroupForm.vue'
import TeamComponent from './components/TeamComponent.vue'
import { Edit, Search, Memo } from '@element-plus/icons-vue'

import { copyText } from '@/utils/copyText'
import { ElMessage } from 'element-plus'
import * as rpaApi from '@/api/rpaManage'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
/** 分页 */
const total = ref(10) // 列表的总页数
const list = ref<any[]>([])
const loading = ref(false) // 列表的加载中

const categorizedList = ref<any>({}) // 按照type分类的列表

const addList = ref([
  // {
  //   label: '新增',
  //   code: 'add'
  // },
  {
    label: '维护任务',
    code: 'maintenanceTasks'
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
    } else if (currentAddCode.value === 'maintenanceTasks') {
      openMaintenanceTaskForm('create')
    }
  }
}

/** 查询字典类型列表 */
const getList = async () => {
  list.value = []
  loading.value = true
  try {
    console.log('queryParams', queryParams.value)
    const data = await rpaApi.getProgramGroupList(queryParams.value).catch(() => {
      loading.value = false
    })
    console.log('data', data)
    list.value = data.data || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const convertToNumber = (number) => {
  const chineseNumbers = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
  const num = parseInt(number, 10)
  return chineseNumbers[num] || '--'
}

/** 搜索按钮操作 */
const queryFormRef = ref() // 搜索的表单
const queryParams = ref({
  page: 1,
  pageSize: 10,
  taskName: '',
  param: ''
})
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 维护任务 新增任务 */
const AddTaskRef = ref()
const openMaintenanceTaskForm = (type: string) => {
  if (AddTaskRef.value) {
    AddTaskRef.value.open(type)
  }
}
// 维护任务与应用的对照关系

const TeamComponentRef = ref()
const openTeamComponent = (taskId) => {
  if (TeamComponentRef.value) {
    TeamComponentRef.value.open(taskId)
  }
}
/** 删除应用按钮操作 */
const handleDelete = async (skBoardEchelonTabulateGroupId: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除

    await rpaApi.deleteProgramGroup({ id: skBoardEchelonTabulateGroupId })
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

// 删除任务
const handleTitleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await rpaApi.deleteTask(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 新增应用 */
const ProgramGroupFormRef = ref()
const openForm = (type: string, id?: string) => {
  if (ProgramGroupFormRef.value) {
    ProgramGroupFormRef.value.open(type, id)
  }
}

// 获取下拉 任务列表
const taskOptions = ref([])
const getGroupOptions = async () => {
  let data = await rpaApi.getTaskList()
  taskOptions.value = data.map((item) => ({ label: item.taskName, value: item.id }))
}

/** 修改任务名称 */
const updateTaskName = async (taskId) => {
  console.log('type', taskId)
  ElMessageBox.prompt('请输入新的任务名称', '任务名称修改', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    draggable: true,
    icon: markRaw(Edit)
  })
    .then(({ value }) => {
      let task = {
        id: taskId,
        taskName: value
      }

      // 发送请求
      rpaApi.saveOrupdateTask(task).then(() => {
        ElMessage({
          type: 'success',
          message: `任务名称修改成功`
        })
        // 刷新列表
        getList()
      })
    })
    .catch(() => {})
}

// 处理任务下拉框的清空
const handleClear = () => {
  queryParams.value.taskName = ''
  handleQuery()
}

/** 初始化 */
onMounted(() => {
  getList()
  getGroupOptions()
  // getTaskOptions()
  // getUserList()
})
</script>
<style scoped lang="scss">
.line {
  color: #e5e5e5;
  margin: 0 6px;
}
.categorizedList {
  min-width: 1000px;
  &-type {
    font-weight: 600;
    font-size: 14px;
    color: #333333;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
  }
  &-card {
    width: 100%;
    padding: 6px 20px 6px;
    box-sizing: border-box;
    background-image: linear-gradient(
      to top,
      rgba(250, 252, 255, 0.19) 0%,
      rgba(242, 247, 255, 0.78) 37%,
      #ebf2ff 100%
    );
    border-radius: 6px;
    margin-bottom: 10px;
  }

  &-header {
    display: flex;
    padding: 0 20px;
    box-sizing: border-box;

    .header-item {
      text-align: left;
      padding: 10px 0;
      box-sizing: border-box;
      width: 33%;
      min-width: 120px;
      font-size: 14px;
      color: #666666;
    }
  }
  &-content {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 6px 20px;
    box-sizing: border-box;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    border-radius: 4px;
    background-color: #fff;
    font-size: 14px;
    color: #333333;
    margin-bottom: 16px;
    .content-item {
      width: 33%;
      text-align: left;
      min-width: 120px;
      padding-right: 6px;
      box-sizing: border-box;
      word-wrap: break-word;
    }
  }
  .content-item-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
  }

  // 操作
  .action {
    width: 220px;
    min-width: 120px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    &-btn {
      color: #409eff;
    }
  }
}
.options-icon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
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
