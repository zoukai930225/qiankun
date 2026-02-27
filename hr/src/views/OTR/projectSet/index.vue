<!--
 * @Date: 2024-10-10 09:01:47
-->
<template>
  <div class="content-wapper">
    <div class="content">
      <!-- 搜索 -->
      <div class="commonTopFilterWrap" style="margin-bottom: 20px">
        <div class="commonTopFilterWrap-filter">
          <el-form
            ref="queryFormRef"
            :inline="true"
            :model="queryParams"
            class="-mb-15px"
            label-width="58px"
          >
            <el-form-item label="分类:" prop="typeCode">
              <el-select
                style="width: 200px"
                v-model="queryParams.typeCode"
                placeholder="请选择分类"
                clearable
                @change="getList"
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.OTR_PROGRAM_TYPE, true)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="关键词" prop="keyword">
              <el-input
                class="searchFormItemWidth"
                v-model="queryParams.keyword"
                clearable
                maxlength="50"
                placeholder="请输入关键词"
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
      <!-- table切换 -->
      <Tabs :currentTab="currentTab" @tab-change="tabChange" :tabList="tabList" />
      <div v-loading="loading">
        <div v-if="list?.length">
          <TabItem
            v-for="item in list"
            :key="item?.id"
            :item="item"
            @item-click="goDetail"
            @del-item="delItem"
          />
        </div>

        <div class="empty-content" v-else>
          <img src="@/assets/imgs/common/empty.png" class="empty-img" alt="" />
          <span class="empty-desc">暂无数据</span>
        </div>
      </div>
    </div>

    <AddDrawer ref="addDrawerRef" @success="getList" />
  </div>
</template>

<script lang="ts" setup>
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import Tabs from './components/tabs.vue'
import TabItem from './components/tabItem.vue'
import AddDrawer from './components/addDrawer.vue'
import { getProgramList, deleteProgramById } from '@/api/otr/projectSet'
const message = useMessage() // 消息弹窗
defineOptions({ name: 'ProjectSet' })
const queryParams = reactive({
  keyword: '',
  typeCode: ''
})

const loading = ref(false) // 列表的加载中

const addList = ref([
  {
    label: '新增题目',
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
      openForm()
    }
  }
}

const tabChange = (value) => {
  currentTab.value = value
  getList()
}

const addDrawerRef = ref() // 新增弹窗
const openForm = () => {
  if (addDrawerRef.value) {
    addDrawerRef.value.open()
  }
}

const delItem = async (item) => {
  try {
    await deleteProgramById({ id: item.id })
    message.success('操作成功')
    getList()
  } catch (error) {
    console.log(error)
  }
}

const goDetail = (item) => {
  if (addDrawerRef.value) {
    addDrawerRef.value.open(item.id)
  }
}

const handleQuery = () => {
  getList()
}
/** 重置按钮操作 */
const resetQuery = () => {
  queryParams.keyword = ''
  queryParams.typeCode = ''
  handleQuery()
}

const allList = ref() //数据源
const getList = async () => {
  loading.value = true
  try {
    const params = { ...queryParams }
    const res = await getProgramList(params)
    allList.value = res || []
    formatList()
    loading.value = false
  } finally {
    loading.value = false
  }
}

const list = ref() // 渲染数据源
const formatList = () => {
  const arr = allList.value.filter((item) => {
    if (item.dimension == currentTab.value) {
      return item
    }
  })
  list.value = arr
}

const queryFormRef = ref() // 搜索的表单
const currentTab = ref('') //当前维度
const tabList = ref([]) //维度列表
const initBaseList = () => {
  const arr = getIntDictOptions(DICT_TYPE.OTR_PROGRAM_DIMENSION, true)
  if (arr?.length) {
    currentTab.value = arr[0].code
  }
  console.log(arr, 'arr')
  // @ts-ignore
  tabList.value = arr || []
}

onMounted(() => {
  initBaseList()
  getList()
})
</script>

<style lang="scss" scoped>
.content-wapper {
  width: 100%;
  height: 100%;
  padding: 14px 18px;
  box-sizing: border-box;
  .content {
    background: #ffffff;
    border-radius: 8px;
    min-height: calc(100vh - 78px);
    padding: 23px 20px;
    box-sizing: border-box;
  }
}
.empty-content {
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .empty-img {
    width: 393px;
    height: 231px;
  }
  .empty-desc {
    margin-top: 20px;
    font-weight: 400;
    font-size: 14px;
    color: #999999;
  }
}
</style>
