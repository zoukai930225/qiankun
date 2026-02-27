<template>
  <div class="evaluateCategoryWrap">
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          :label-width="80"
          @submit.prevent="handleQuery"
        >
          <el-form-item label="关键词" prop="labelName">
            <el-input
              style="width: 260px"
              :prefix-icon="Search"
              v-model="queryParams.labelName"
              placeholder="一级/二级分类名称模糊查询"
              clearable
              @clear="handleQuery"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="commonTopFilterWrap-search">
        <div class="commonTopFilterWrap-search-container">
          <!-- <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn"> 重置 </el-button> -->

          <SWFilterAdd
            class="commonAddBtn"
            :list="addList"
            :current-code="currentAddCode"
            @add-btn-click="addBtnClick"
          />
        </div>
      </div>
    </div>
  </div>

  <ContentWrap>
    <div class="contentWrap" v-if="Object.keys(originalData).length">
      <div v-for="(data, oneLevel) in originalData" :key="oneLevel">
        <!-- 一级分类名称 -->
        <div class="level1Title">
          <div class="level1Title-left">
            <div class="level1Title-icon"></div>
            <div
              v-if="!editableLevels[oneLevel]"
              class="level1Title-name no-select"
              @dblclick="handleTitledblclick(oneLevel)"
            >
              {{ oneLevel }}
            </div>
            <el-input
              v-else
              type="text"
              v-model.trim="editableLevelValues[oneLevel]"
              style="width: 166px"
              :maxlength="30"
            />
            <listChangeCom
              v-if="editableLevels[oneLevel]"
              :data="{ data: editableLevelValues[oneLevel], originalLabel: oneLevel }"
              :type="'changeTitle'"
              @cancel="handleCancel"
              @submit="handleSubmit"
            />
          </div>
          <div class="level1Title-right cursor_pointer" @click="openForm('createTwo', oneLevel)">
            <img src="@/assets/imgs/evaluate/addTwoLevel.png" alt="" />
          </div>
        </div>
        <!-- 二级分类列表 -->
        <div class="level2List">
          <div v-for="(item, twoLevel) in data" :key="twoLevel">
            <div class="level2List-item" v-if="twoLevel !== ''">
              <div class="level2List-item-delete" @click="openConfirmDialog('two', item)">
                <img src="@/assets/imgs/evaluate/delete.png" alt="" />
              </div>
              <div class="level2Title">
                <div
                  v-if="!editableLevels[twoLevel]"
                  class="level2Title-name no-select"
                  @dblclick="handleTitledblclick(twoLevel)"
                >
                  {{ twoLevel }}</div
                >
                <el-input
                  v-else
                  type="text"
                  v-model.trim="editableLevelValues[twoLevel]"
                  style="width: 166px"
                  :maxlength="20"
                />
                <listChangeCom
                  v-if="editableLevels[twoLevel]"
                  :data="{ data: editableLevelValues[twoLevel], originalLabel: twoLevel }"
                  :type="'changeTitle'"
                  @cancel="handleCancel"
                  @submit="handleSubmit"
                />
              </div>
              <div class="level3List">
                <ElScrollbar height="280px">
                  <el-checkbox-group v-model="checkList">
                    <div v-for="i in item" :key="i.id" class="level3List-item">
                      <div style="display: flex; align-items: center" v-if="i.originalLabel">
                        <el-checkbox :value="i.id" />
                        <div
                          v-if="!i.editable"
                          @dblclick="toggleEditable(i)"
                          class="text-content no-select"
                        >
                          {{ i.levelThreeLabel || '---' }}
                        </div>
                        <el-input
                          v-else
                          type="text"
                          v-model.trim="i.levelThreeLabel"
                          style="width: 166px"
                          :maxlength="30"
                        />

                        <listChangeCom
                          v-if="i.editable"
                          :data="{ data: i }"
                          @cancel="handleCancel"
                          @submit="handleSubmit"
                        />
                      </div>
                    </div>
                  </el-checkbox-group>
                </ElScrollbar>
              </div>
              <div class="level3List-item-btn">
                <div class="deleteBtn btn cursor_pointer" @click="openConfirmDialog('three')">
                  <img src="@/assets/imgs/evaluate/delete.png" alt="" />
                  <span>删除</span>
                </div>

                <div
                  class="addBtn btn cursor_pointer"
                  @click="openForm('createThree', oneLevel, twoLevel)"
                >
                  <img src="@/assets/imgs/evaluate/addTwoLevel.png" alt="" />
                  <span>添加</span>
                </div>
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

  <confirmDialog
    ref="confirmDialogRef"
    @confirm="handleConfirmComplete"
    :title="'系统提醒'"
    :content="confirmContent"
  />

  <!-- 表单弹窗：添加/修改 -->
  <AddCategory ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
defineOptions({ name: 'EvaluateCategory' })
import AddCategory from './components/addCategory.vue'
import listChangeCom from './components/listChangeCom.vue'
import confirmDialog from './components/confirmDialog.vue'
import { Search } from '@element-plus/icons-vue'
import * as EvaluationApi from '@/api/serviceConfiguration/evaluation'

const checkList = ref([])

// 标题是否显示编辑
const editableLevels = ref({}) //用于跟踪哪些一级分类是可编辑的
const editableLevelValues = ref({}) //用于存储编辑状态的值

const handleTitledblclick = (levelName) => {
  editableLevels.value[levelName] = true
  editableLevelValues.value[levelName] = levelName
}
const toggleEditable = (item) => {
  item.editable = true
  item.originalLabel = item.levelThreeLabel
}

// 提交
const handleSubmit = async (item) => {
  console.log('提交', item)
  // 判断是一级/二级还是三级分类
  if (item.originalLabel) {
    // 说明是修改的一级/二级分类
    if (item.data === '') {
      return message.error('标签名称不能为空')
    }
    // 判断是一级分类还是二级分类
    if (originalData.value.hasOwnProperty(item.originalLabel)) {
      // 说明是一级分类
      const firstKey = Object.keys(originalData.value[item.originalLabel])[0] // 获取一级分类下的第一个键
      const firstValue = originalData.value[item.originalLabel][firstKey] // 获取对应键的值，即数组
      let firstItemInArray = firstValue[0] // 获取数组的第一个元素
      firstItemInArray.type = 1
      firstItemInArray.levelOneLabel = item.data

      await EvaluationApi.updateEvaluation(firstItemInArray)
      message.success(t('common.updateSuccess'))
      editableLevels.value[item.originalLabel] = false
    } else {
      // 说明是二级分类
      let firstItemInArray = null
      for (const itemObject of Object.values(originalData.value)) {
        const matchKey = Object.keys(itemObject).find((key) => key === item.originalLabel)
        if (matchKey) {
          itemObject[matchKey][0].levelTwoLabel = item.data
          itemObject[matchKey][0].type = 2
          firstItemInArray = itemObject[matchKey][0]
          break
        }
      }

      if (firstItemInArray) {
        await EvaluationApi.updateEvaluation(firstItemInArray)
        message.success(t('common.updateSuccess'))
        editableLevels.value[item.originalLabel] = false
      }
    }
  } else {
    // 说明是修改的三级标签
    console.log('提交', item.data)
    if (item.data.levelThreeLabel === '') {
      return message.error('标签名称不能为空')
    }
    await EvaluationApi.updateEvaluation(item.data)
    message.success(t('common.updateSuccess'))
    item.data.editable = false
  }

  getList()
}

// 点击取消
const handleCancel = (item) => {
  console.log('取消', item)
  if (item.originalLabel) {
    // 说明是修改的一级/二级分类
    editableLevels.value[item.originalLabel] = false
  } else {
    // 说明是修改的三级标签
    item.data.editable = false
    item.data.levelThreeLabel = item.data.originalLabel
  }
}

const emits = defineEmits([])
const message = useMessage()

const { t } = useI18n() // 国际化
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
      openForm('createOne')
    }
  }
}

// 查询参数
const queryParams = ref({
  labelName: ''
})

// 查询
const handleQuery = () => {
  getList()
}

// 列表数据
const loading = ref(false)
const originalData = ref({})

const getList = async () => {
  loading.value = true
  try {
    checkList.value = []
    const data = await EvaluationApi.getEvaluationList(queryParams.value).catch(() => {})
    if (data) {
      for (const oneLevel in data) {
        if (data[oneLevel] && typeof data[oneLevel] === 'object') {
          // 遍历每个一级分类下的二级分类
          for (const twoLevel in data[oneLevel]) {
            // 检查data[oneLevel][twoLevel]是否是数组
            if (Array.isArray(data[oneLevel][twoLevel])) {
              // 遍历每个二级分类下的三级列表项
              data[oneLevel][twoLevel] = data[oneLevel][twoLevel].map((i) => ({
                ...i,
                editable: false, // 添加editable属性并设置为false
                originalLabel: i.levelThreeLabel // 保存原始label
              }))
            }
          }
        }
      }
      originalData.value = data
    }
  } finally {
    loading.value = false
  }
}

/** 新增标签 */
const formRef = ref()
const openForm = (type: string, oneLevel?: any, twoLevel?: any) => {
  if (formRef.value) {
    formRef.value.open(type, oneLevel, twoLevel)
  }
}

// 删除确认弹窗
const confirmContent = ref('')
const confirmDialogRef = ref()
const openConfirmDialog = (type, data) => {
  if (!confirmDialogRef.value) return // 如果弹窗引用不存在，直接返回

  let confirmMessage
  switch (type) {
    case 'three':
      if (checkList.value.length === 0) {
        message.error('请选择要删除的标签')
        return
      }
      confirmMessage = '是否确认删除'
      break
    case 'two':
      if (!data || data.length === 0) {
        console.error('缺少必要的删除数据')
        return
      }
      const { levelTwoLabel } = data[0]
      confirmMessage = `是否确认删除${levelTwoLabel}分类，删除后该分类下的所有子分类也一并删除`
      break
    default:
      console.error('未知的操作类型')
      return
  }

  confirmContent.value = confirmMessage
  confirmDialogRef.value.open(data) // 打开确认对话框
}

const handleConfirmComplete = async (item) => {
  // console.log('确认完成', item);
  // -item存在则为二级分类，不存在则为三级分类
  const idsToDelete = item ? item.map(({ id }) => id) : checkList.value

  try {
    await EvaluationApi.deleteEvaluation(idsToDelete)
    message.success(t('common.delSuccess'))
    await getList()
  } catch (error) {
    console.error('删除失败:', error)
  }
}

onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
