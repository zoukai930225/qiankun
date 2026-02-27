<template>
  <ElScrollbar class="OTRCommonMainContainer">
    <!-- 搜索工作栏 -->
    <ContentWrap :border-radius="0">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="-mb-15px"
            label-width="58px"
            @submit.prevent
          >
            <el-form-item label="关键词" prop="keyWord">
              <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.keyWord"
                clearable
                placeholder="名称或者内容关键词匹配"
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              />
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button @click="handleQuery" class="commonSearchBtn">
            <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
            搜索
          </el-button>
          <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
            重置
          </el-button>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
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
    <CardList ref="cardListRef" :list="list" @get-list="getList" />
    <AddDrawer ref="addDrawerRef" @success="getList" />
  </ElScrollbar>
</template>

<script lang="ts" setup>
import { Search } from '@element-plus/icons-vue'
import CardList from './components/cardList.vue'
import AddDrawer from './components/addDrawer.vue'

import * as OtrSchemeSetApi from '@/api/otr/schemeSet/index'
defineOptions({ name: 'SchemeSet' })
const total = ref(0) // 列表的总页数
const list = ref<any[]>([]) // 表格数据
const queryParams = reactive({
  page: 1,
  size: 999999,
  keyWord: ''
})
const queryFormRef = ref() // 搜索的表单
const addDrawerRef = ref() // 新增弹窗
const addList = ref([
  {
    label: '新增方案',
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

const openForm = (type: string, id?: string) => {
  if (addDrawerRef.value) {
    addDrawerRef.value.open(type, id)
  }
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

const cardListRef = ref()
/** 查询列表 */
const getList = async () => {
  let loadingInstance = ElLoading.service({ fullscreen: false })
  try {
    const data = await OtrSchemeSetApi.getDataList(queryParams).catch(() => {})
    if (data) {
      list.value = data.records || []
      total.value = data.total || 0
      nextTick(() => {
        if (cardListRef.value) {
          cardListRef.value?.resizeHandler()
        }
      })
    }
  } finally {
    loadingInstance.close()
  }
}

onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped></style>
