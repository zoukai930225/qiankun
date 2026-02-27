<template>
  <div>
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form
            class="-mb-15px"
            :model="queryParams"
            ref="queryFormRef"
            :inline="true"
            label-width="78px"
            @submit.prevent
          >
            <el-form-item label="渠道：" prop="channel" style="width: 300px">
              <el-select
                class="searchFormItemWidth"
                v-model="queryParams.channel"
                placeholder="请选择"
                clearable
                @clear="handleQuery"
                @change="handleQuery"
              >
                <el-option
                  v-for="dict in filteredDictOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
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
    <!-- 列表 -->
    <ContentWrap>
      <el-table
        :border="true"
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :stripe="true"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column label="渠道" prop="channelName" />
        <el-table-column label="来源" prop="source" />
        <el-table-column label="模块" prop="module" />
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button
              class="operate-btn-space"
              link
              type="primary"
              @click="openForm('update', scope.row.id)"
            >
              编辑
            </el-button>
            <router-link :to="'/admin/system/thirdPartyFields/data/index/' + scope.row.id">
              <el-button class="operate-btn-space" link type="primary">字段</el-button>
            </router-link>
            <el-button class="operate-btn-space" link type="primary" @click="handleDel(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <Pagination
        :total="total"
        v-model:page="queryParams.page"
        v-model:limit="queryParams.size"
        @pagination="getList"
      />
    </ContentWrap>
  </div>
  <!-- 新增 -->
  <ThirdPartyListForm ref="ThirdPartyListFormRef" @success="getList" />
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import ThirdPartyListForm from './components/thirdPartyListForm.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import * as ThirdPartyFieldsApi from '@/api/system/thirdPartyFields'

const message = useMessage() // 消息弹窗
const appStore = useAppStore()

defineOptions({ name: 'SystemThirdPartyFields' })

/**
 * 搜索查询
 */
// 渠道--获取字典数据并过滤掉 '全部' 选项
const getFilteredDictOptions = (dictType) => {
  return getIntDictOptions(dictType).filter((dict) => dict.label !== '全部')
}
// 渠道
const filteredDictOptions = computed(() => getFilteredDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL))

// 搜索 form
const queryParams = ref({
  page: 1,
  size: 10,
  channel: undefined //渠道
})

const total = ref(0) // 列表的总页数
interface ListItem {
  id: string
  channel: string
  source: string
  module: string
}

const list = ref<ListItem[]>([])

/** 添加/修改操作 */
const ThirdPartyListFormRef = ref()
const openForm = (type: string, id?: string) => {
  if (ThirdPartyListFormRef.value) {
    ThirdPartyListFormRef.value.open(type, id)
  }
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

// 获取列表数据
const getList = async () => {
  loading.value = true
  try {
    const res = await ThirdPartyFieldsApi.getThirdPartyFieldsList(queryParams.value)
    total.value = res.total
    list.value = res.data || []
  } finally {
    loading.value = false
  }
}

const loading = ref(false) //table loading
// 搜索
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

// 删除
const handleDel = async (row: any) => {
  let content = `确认删除所选数据？`
  let statusT = '删除'
  await message.delConfirm(content, statusT)
  await ThirdPartyFieldsApi.deleteThirdPartyFields(row.id)
  message.success('操作成功')
  getList()
}

// 重置按钮操作
const queryFormRef = ref()
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
.topStatics {
  margin-bottom: 16px;
}
</style>
