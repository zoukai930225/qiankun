<template>
  <div class="sudoku-set-wrap">
    <!-- 搜索栏 -->
    <ContentWrap>
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
        <div class="filter-wrap">
          <span style="margin-right: 11px">关键词</span>
          <el-input
            v-model.trim="queryParams.gridName"
            clearable
            placeholder="九宫格名称匹配"
            @clear="handleQuery"
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </div>

        <div style="display: flex; align-items: center">
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
            重置
          </el-button>
          <!-- <el-button
            @click="handleQuery"
            style="border: 1px solid #eaeaea; background-color: #f1f3f7"
          >
            搜索</el-button
          > -->
          <!-- <el-button @click="resetQuery">重置</el-button> -->
          <SWFilterAdd
            class="commonAddBtn"
            :list="addList"
            :current-code="currentAddCode"
            @add-btn-click="addBtnClick"
          />
        </div>
      </div>
    </ContentWrap>
    <!-- 内容 -->

    <div class="sudoku-set-content" v-if="sudokuList.length">
      <!-- 九宫格部分 -->
      <div class="sudoku-wrap" v-for="item in sudokuList" :key="item.id">
        <div class="sudoku-title-wrap">
          <div class="sudoku-title-left">
            <img src="@/assets/imgs/otr/sudokuSet/index_logo.png" alt="" class="sudoku-logo" />
            <div class="sudoku-title">{{ item.gridName }}</div>
          </div>
          <!-- 已被活动使用的九宫格无法删除， -->
          <img
            src="@/assets/imgs/otr/sudokuSet/index_delete.png"
            alt=""
            class="sudoku-delete"
            v-if="item.actName.length === 0"
            @click="handleDelete(item)"
          />
        </div>
        <div class="sudoku-desc">
          <div class="sudoku-desc-left">
            <img src="@/assets/imgs/otr/sudokuSet/index_icon.png" alt="" />
            <span>活动</span>
          </div>

          <div v-if="item.actName && item.actName.length > 1">
            <el-tooltip class="box-item" effect="dark" placement="top-start">
              <template #content>
                <div v-for="(actName, index) in item.actName" :key="index">
                  <span>{{ actName }}</span>
                </div>
              </template>
              <div v-for="(actName, index) in item.actName" :key="index">
                <span>{{ actName }}</span
                >...
              </div>
            </el-tooltip>
          </div>
          <div v-else-if="item.actName && item.actName.length === 1">
            <div v-for="(actName, index) in item.actName" :key="index">
              <span>{{ actName }}</span>
            </div>
          </div>
          <div class="sudoku-desc-right" v-else>暂无活动</div>
        </div>
        <div class="sudoku-content" @click="openForm('update', item.id)">
          <Axis :x-axis-name="item.xnameAxis" :y-axis-name="item.ynameAxis" />
          <NineGrid :id="item.id" :key="nineGridKey" />
        </div>
      </div>
    </div>
    <el-empty v-else description="暂无数据" />
    <AddSudokuForm ref="formRef" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'SudokuSet' })
import NineGrid from './components/nineGrid.vue'
import Axis from './components/axis.vue'
import AddSudokuForm from './components/addSudokuForm.vue'
import * as sudokuSetApi from '@/api/otr/sudokuSet'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const queryParams = reactive({
  gridName: ''
})
const sudokuList = ref([])
const loading = ref(false)
const getList = async () => {
  loading.value = true
  try {
    const data = await sudokuSetApi.getSudokuSetList(queryParams).catch(() => {})
    if (data) {
      sudokuList.value = data || []
    }
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  getList()
}

const resetQuery = () => {
  queryParams.gridName = ''
  handleQuery()
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
/** 新增操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id)
  }
}

/** 删除按钮操作 */
const handleDelete = async (item: any) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await sudokuSetApi.deleteSudokuSet(item.id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const nineGridKey = ref(Date.now())
const handleSuccess = () => {
  getList()
  nineGridKey.value = Date.now()
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
.sudoku-set-wrap {
  padding: 14px 18px;
  font-size: 14px;
  color: #666666;
}
.sudoku-set-content {
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
}

.sudoku-wrap {
  width: 817px;
  height: 643px;
  background: #ffffff;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  cursor: pointer;
  &::after {
    content: '';
    display: block;
    width: 374px;
    height: 162px;
    position: absolute;
    top: 0;
    right: 0;
    background-image: url(@/assets/imgs/otr/sudokuSet/index_bg.png);
  }
  .sudoku-title-wrap {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px 15px 0;
    box-sizing: border-box;
    .sudoku-title-left {
      display: flex;
      align-items: center;
      z-index: 9;
    }
    .sudoku-logo {
      width: 70px;
      height: 70px;
      vertical-align: middle;
    }
    .sudoku-title {
      font-weight: 540;
      font-size: 26px;
      color: #333333;
    }
    .sudoku-delete {
      width: 30px;
      z-index: 9;
      cursor: pointer;
    }
  }
  .sudoku-desc {
    width: 355px;
    display: flex;
    margin-left: 101px;
    padding: 17px 20px;
    background: linear-gradient(276deg, #ffffff00 0%, #e3fdff 100%);
    border-radius: 14px 20px 20px 14px;

    &-left {
      width: 100px;
      margin-right: 10px;
      img {
        width: 13px;
        margin-right: 10px;
      }
    }
    &-right {
      color: #333333;
      line-height: 1.5;
    }
  }
  .sudoku-content {
    width: 480px;
    margin: 12px 0 12px 99px;
    position: relative;
  }
}
</style>
