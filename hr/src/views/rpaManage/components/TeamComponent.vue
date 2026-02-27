<template>
  <div style="border-radius: 16px; overflow: hidden">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      @close="handleDrawerClose"
      class="drawer"
      :size="968"
    >
      <div>
        <div class="drawerTitle">
          <div>
            <el-button type="primary" class="mr-6px" @click="addEchelon" :disabled="loading">
              <Icon class="mr-5px" icon="ep:plus" />
              新增梯队
            </el-button>
            <el-popover placement="top-start" title="颜色说明" :width="380" trigger="hover">
              <template #reference>
                <el-icon><QuestionFilled /></el-icon>
              </template>
              <div>
                <div>
                  <div class="d-flex"
                    ><p class="color-explain color-red-icon mr-2"></p>
                    红色=今日存在执行失败日志</div
                  >
                  <div class="d-flex">
                    <p class="color-explain color-yellow-icon mr-2"></p
                    >黄色=今日存在执行告警日志</div
                  >
                  <div class="d-flex"
                    ><p class="color-explain color-green-icon mr-2"></p>
                    绿色=所有日志都为执行成功或者失败已处理</div
                  >
                  <div class="d-flex"
                    ><p class="color-explain color-gray-icon mr-2"></p> 灰色=今日存在未执行</div
                  >
                </div>
              </div>
            </el-popover>
          </div>

          <img
            src="@/assets/imgs/dashboard/programGroup/close1.png"
            alt=""
            @click="handleDrawerClose"
          />
        </div>
      </div>
      <div v-if="loading" class="loading-placeholder">
        <el-icon class="is-loading"><Loading /></el-icon>
        加载中...
      </div>
      <div v-else-if="Object.keys(categorizedList).length > 0">
        <div class="drawerContent" v-for="(items, type) in categorizedList" :key="type">
          <div class="drawerContent-title">
            <div>
              <span class="mr-30px" style="color: #333; font-weight: 600">梯队{{ type }}</span>
              <el-form ref="form" :model="teamForm" v-if="type !== '1'" inline style="height: 32px">
                <el-form-item label="触发类型" prop="echelonExecuteType">
                  <el-select
                    class="searchFormItemWidth"
                    v-model="teamForm[type].echelonExecuteType"
                    placeholder="请选择"
                    clearable
                    value-on-clear=""
                    style="width: 200px"
                  >
                    <el-option
                      v-for="dict in getIntDictOptions(
                        DICT_TYPE.TASK_PROGRAM_TWOECHELON_EXECUTE_TYPE,
                        true
                      )"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="执行时间"
                  prop="echelonExecuteCron"
                  v-if="teamForm[type].echelonExecuteType === '1'"
                >
                  <el-input
                    v-model="teamForm[type].echelonExecuteCron"
                    clearable
                    placeholder="请输入执行时间"
                    style="width: 200px"
                  />
                </el-form-item>
              </el-form>
              <!-- <el-checkbox v-model="checkboxStates[type]" @change="handleCheckboxChange(type)" />
              <span class="ml-5px">强制检测上一梯队执行结果</span> -->
            </div>
            <div>
              <el-button type="danger" class="mr-6px" link @click="deleteEchelon(type)">
                <el-icon><Delete /></el-icon>
                删除梯队
              </el-button>
              <el-button type="primary" class="mr-6px" link @click="openChooseteam(type)">
                <img
                  src="@/assets/imgs/dashboard/programGroup/chooseTeam.png"
                  class="mr-5px"
                  alt=""
                />
                选择应用
              </el-button>
            </div>
          </div>
          <ul class="drawerContent-itemList">
            <!-- :style="{
                backgroundColor:
                  item.statusColor === '绿色'
                    ? ' #EAF7EE'
                    : item.statusColor === '黄色'
                      ? '#FEF7EA'
                      : item.statusColor === '红色'
                        ? '#FFF5F4'
                        : '#F1F5F4',
                borderColor:
                  item.statusColor === '绿色'
                    ? '#C4E5CE'
                    : item.statusColor === '黄色'
                      ? '#EDB135'
                      : item.statusColor === '红色'
                        ? '#EFDDDC'
                        : '#C3CDCB'
              }" -->
            <li
              class="drawerContent-itemList-item"
              v-for="item in items"
              :key="item.id"
              :style="getBoardStyle(item.statusColor)"
            >
              <img
                class="drawerContent-itemList-item-icon"
                src="@/assets/imgs/dashboard/programGroup/pg_green.png"
                alt=""
                v-if="item.statusColor === '绿色'"
                @click="openDashboard(item)"
              />

              <img
                class="drawerContent-itemList-item-icon"
                src="@/assets/imgs/dashboard/programGroup/pg_yellow.png"
                alt=""
                v-else-if="item.statusColor === '黄色'"
                @click="openDashboard(item)"
              />
              <img
                class="drawerContent-itemList-item-icon"
                src="@/assets/imgs/dashboard/programGroup/pg_red.png"
                alt=""
                v-else-if="item.statusColor === '红色'"
                @click="openDashboard(item)"
              />
              <img
                class="drawerContent-itemList-item-icon"
                src="@/assets/imgs/dashboard/programGroup/pg_gray.png"
                alt=""
                @click="openDashboard(item)"
                v-else
              />
              <div class="drawerContent-itemList-item-text">{{ item.name }}</div>
              <!-- 删除 -->
              <img
                src="@/assets/imgs/dashboard/delete_green.png"
                alt=""
                class="drawerContent-itemList-item-delete"
                v-if="item.statusColor === '成功'"
                @click="deleteItem(item.echelon, item.id)"
              />
              <img
                src="@/assets/imgs/dashboard/delete_yellow.png"
                alt=""
                class="drawerContent-itemList-item-delete"
                v-else-if="item.statusColor === '进行中'"
                @click="deleteItem(item.echelon, item.id)"
              />
              <img
                src="@/assets/imgs/dashboard/delete_red.png"
                alt=""
                class="drawerContent-itemList-item-delete"
                v-else-if="item.statusColor === '失败'"
                @click="deleteItem(item.echelon, item.id)"
              />
              <img
                src="@/assets/imgs/dashboard/delete_gray.png"
                alt=""
                class="drawerContent-itemList-item-delete"
                @click="deleteItem(item.echelon, item.id)"
                v-else
              />
            </li>
          </ul>
          <!-- <div v-if="loading">加载中...</div> -->
          <div> </div>
        </div>
      </div>

      <el-empty v-else description="暂无数据" />
      <div class="drawerFooter">
        <el-button :disabled="formLoading" type="primary" @click="submitForm"> 保存</el-button>
      </div>
    </el-drawer>
    <!-- 选择应用 -->
    <ChooseTeam ref="chooseTeamRef" @success="getList" @close="handleClose" />

    <!-- 查看看板 -->
    <DashboardForm class="Dashboard-form" ref="DashboardFormRef" />
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'AddTask' })
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as rpaApi from '@/api/rpaManage'
import ChooseTeam from './ChooseTeam.vue'
import DashboardForm from '@/views/dashboard/components/dashboardForm.vue'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const drawerVisible = ref(false) // 弹窗的是否展示
// const teamForm = ref({
//   echelonExecuteType: '', // 触发类型
//   echelonExecuteCron: '' // 执行时间
// }) // 弹窗的表单数据
const teamForm = ref<any>({}) // 弹窗的表单数据

// 初始化teamForm的结构
const initializeTeamForm = (echelons) => {
  echelons.forEach((echelon) => {
    teamForm.value[echelon] = {
      echelonExecuteType: '',
      echelonExecuteCron: ''
    }
  })
}

const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用

const formRef = ref() // 表单 Ref

const getBoardStyle = (statusColor) => {
  const colorMap = {
    红色: '#EFDDDC',
    绿色: '#C4E5CE',
    黄色: '#EDB135'
  }
  const backgroundColorMap = {
    红色: '#FFF5F4',
    绿色: '#EAF7EE',
    黄色: '#FEF7EA'
  }

  // 使用解构和默认值来获取颜色
  const { [statusColor]: borderColor = '#C3CDCB' } = colorMap
  const { [statusColor]: backgroundColor = '#F1F5F4' } = backgroundColorMap

  return {
    borderColor,
    backgroundColor
  }
}

/** 打开程序执行记录 */
const DashboardFormRef = ref()
const openDashboard = (item) => {
  if (DashboardFormRef.value) {
    DashboardFormRef.value.open(item.id)
  }
}
const submitFormData = ref([])
const dataBoardTaskId = ref('')

/** 打开弹窗 */
const open = async (taskId) => {
  // console.log('---', type, id)
  drawerVisible.value = true
  // 清空数据
  list.value = []
  dataBoardTaskId.value = ''
  categorizedList.value = {}

  teamForm.value = {}
  console.log('打开弹窗', teamForm.value)

  // 获取数据
  if (taskId) {
    formLoading.value = true
    try {
      dataBoardTaskId.value = taskId
      await getList(taskId)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const addEchelon = () => {
  // 检查当前梯队数量是否已经达到两个
  if (Object.keys(categorizedList.value).length >= 2) {
    console.error('已达最大梯队数量限制，无法新增更多梯队。')
    return message.error('已达最大梯队数量限制。') // 如果已经有两个梯队，则直接返回，不再新增
  }

  // 检查是否存在梯队2
  const hasEchelon2 = categorizedList.value.hasOwnProperty('2')

  // 如果已经有梯队2，则新增梯队1
  if (hasEchelon2) {
    // 新增梯队1
    categorizedList.value[1] = []
    teamForm.value[1] = {
      echelonExecuteType: '',
      echelonExecuteCron: ''
    }
    console.log('新增梯队1', teamForm.value)
  } else {
    // 获取categorizedList中的最大梯队序号
    const maxEchelonNumber =
      Object.keys(categorizedList.value).length > 0
        ? Math.max(...Object.keys(categorizedList.value).map(Number))
        : 0

    // 新增梯队的序号（最大的梯队序号加1）
    const newEchelonNumber = maxEchelonNumber + 1

    // 将新增梯队添加到categorizedList中
    categorizedList.value[newEchelonNumber] = []
    teamForm.value[newEchelonNumber] = {
      echelonExecuteType: '',
      echelonExecuteCron: ''
    }
    console.log('新增梯队', teamForm.value)
  }

  // 打印更新后的categorizedList
  console.log('新增梯队后的categorizedList.value', categorizedList.value)
}

// 删除梯队
const deleteEchelon = (echelon) => {
  // console.log('删除梯队前=', categorizedList.value)
  console.log('删除梯队', echelon)
  // 删除对应梯队的分类
  delete categorizedList.value[echelon]
  teamForm.value[echelon] = {
    echelonExecuteType: '',
    echelonExecuteCron: ''
  }
  console.log('-删除', teamForm.value)

  // 对删除梯队后的categorizedList.value进行梯队序号重排
  // const newCategorizedList = {}
  // Object.keys(categorizedList.value)
  //   .filter((key) => Number(key) >= 0)
  //   .forEach((key) => {
  //     const numericKey = Number(key)
  //     console.log('numericKey', numericKey)
  //     // 只有当梯队序号大于被删除的梯队序号时，才需要重新排列
  //     if (numericKey > echelon) {
  //       newCategorizedList[numericKey - 1] = categorizedList.value[key]
  //       // 遍历newCategorizedList，将里面newCategorizedList[numericKey - 1]的数据里的echelon值改为numericKey - 1
  //       newCategorizedList[numericKey - 1].forEach((item) => {
  //         item.echelon = numericKey - 1
  //       })
  //       checkboxStates.value[numericKey - 1] = checkboxStates.value[key]
  //       // console.log('newCategorizedList', newCategorizedList);
  //     } else {
  //       newCategorizedList[numericKey] = categorizedList.value[key]
  //       checkboxStates.value[numericKey] = checkboxStates.value[key]
  //     }
  //   })

  // categorizedList.value = newCategorizedList

  // 打印更新后的categorizedList
  // console.log('删除梯队后的categorizedList.value', categorizedList.value)
}

// 删除应用
const deleteItem = (echelon, id) => {
  // 删除对应梯队的分类
  categorizedList.value[echelon] = categorizedList.value[echelon].filter((item) => item.id !== id)
}

// 选择完应用
const handleClose = (value) => {
  // console.log('关闭选择', value)

  // 遍历传入的数据，按照echelon分类并添加到categorizedList中
  value.forEach((item) => {
    const { echelon } = item

    // 如果categorizedList中还没有这个echelon的分类，则初始化一个空数组
    if (!categorizedList.value[echelon]) {
      categorizedList.value[echelon] = []
    }

    // 将当前项添加到对应echelon的分类中
    categorizedList.value[echelon].push(item)
  })
  console.log('--选择完应用', categorizedList.value)
}

// 选择应用
const chooseTeamRef = ref()
const openChooseteam = (type) => {
  chooseTeamRef.value.open(type)
}

// 查询数据
const loading = ref(false) // 加载中
const list = ref([]) // 数据
const categorizedList = ref({}) // 按照 梯队序号 分类的数据

const getList = async (taskId) => {
  loading.value = true
  try {
    const data = await rpaApi.getProgramGroupListByTaskId({ taskId: taskId })
    // console.log('原数据', data)
    list.value = data || []

    // 获取所有echelon值，用于初始化teamForm
    const echelons = [...new Set(list.value.map((item) => item.echelon))]
    initializeTeamForm(echelons)

    // 按照 梯队序号 分类，并处理 isConstrain 为 null 的情况
    categorizedList.value = list.value.reduce((acc, item) => {
      // 设置默认值为0，并更新item对象

      const { echelon } = item
      if (!acc[echelon]) {
        acc[echelon] = []
      }
      acc[echelon].push(item) // 使用更新后的item对象

      if (echelon !== '1') {
        teamForm.value[echelon].echelonExecuteType = item.echelonExecuteType
        teamForm.value[echelon].echelonExecuteCron = item.echelonExecuteCron
        // console.log('--', teamForm.value)
      }

      return acc
    }, {})
    console.log('分类后的数据', categorizedList.value)
  } finally {
    loading.value = false
  }
}

/** 提交数据 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 提交请求
  formLoading.value = true
  try {
    submitFormData.value = []
    const categorizedListArray = Object.values(categorizedList.value)

    //  categorizedListArray 是一个二维数组，其中每个一维数组代表一个梯队的项目数组
    const flattenedArray = categorizedListArray.flatMap((items) => items)

    // console.log('flattenedArray---', flattenedArray)
    if (flattenedArray.length > 0) {
      // 遍历 flattenedArray 并收集数据
      flattenedArray.forEach((item) => {
        // 确定 echelonExecuteType 的值
        const echelonExecuteType =
          item.echelon !== '1' ? teamForm.value[item.echelon].echelonExecuteType : undefined

        const shouldHaveEchelonExecuteCron =
          item.echelon !== '1' && teamForm.value[item.echelon].echelonExecuteType === '1'

        // 赋值 echelonExecuteCron
        const echelonExecuteCron = shouldHaveEchelonExecuteCron
          ? teamForm.value[item.echelon].echelonExecuteCron
          : undefined
        // 添加每个项目的 skTabulateGroupId、echelon、isConstrain 和 dataBoardTaskId 到 submitFormData 中
        submitFormData.value.push({
          skTabulateGroupId: item.id,
          echelon: item.echelon,
          echelonExecuteType,
          echelonExecuteCron,
          dataBoardTaskId: dataBoardTaskId.value
        })
      })
    } else {
      submitFormData.value.push({
        dataBoardTaskId: dataBoardTaskId.value
      })
    }

    // console.log('提交的数据', submitFormData.value)
    // const data = formData.value as any

    // data.id = undefined
    await rpaApi.addEchelon(submitFormData.value)
    message.success(t('common.createSuccess'))

    drawerVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

// 关闭弹窗
const handleDrawerClose = () => {
  drawerVisible.value = false
  // emit('success')
}
</script>

<style lang="scss" scoped>
// 加载中的效果
.loading-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 422px;
}
:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}
// 背景
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}
.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
  &-title {
    margin-bottom: 18px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
  }
  &-itemList {
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 38px; /* 列间距 */
    grid-row-gap: 20px; /* 行间距 */
    &-item {
      font-size: 14px;
      list-style: none;
      display: flex;
      align-items: center;
      color: #333333;

      border-radius: 14px;
      border: 1px solid #c4e5ce;
      padding: 7px 14px 4px;
      position: relative;

      &-icon {
        cursor: pointer;
      }
      &-text {
        margin-left: 10px;
        margin-bottom: 6px;
      }
      &-delete {
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
      }
    }
  }
}
.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}

.d-flex {
  display: flex;
  align-items: center;
}
.color-explain {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.color-red-icon {
  background: #e15a51;
}
.color-yellow-icon {
  background: #edb135;
}
.color-green-icon {
  background: #1aac2e;
}
.color-gray-icon {
  background: #999f9e;
}
</style>
