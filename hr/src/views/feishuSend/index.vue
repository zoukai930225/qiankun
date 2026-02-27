<template>
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form ref="queryFormRef" :inline="true" :model="queryParams" :label-width="80">
          <el-form-item label="标题" prop="messageTitle">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.messageTitle"
              placeholder="请输入"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="创建人" prop="creator">
            <el-input
              :prefix-icon="Search"
              class="searchFormItemWidth"
              v-model="queryParams.creator"
              placeholder="请输入"
              clearable
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
            <!-- <el-select
              v-model="queryParams.superintendent"
              placeholder="请选择"
              clearable
              filterable
              style="width: 210px"
              @change="handleQuery"
              @clear="handleQuery"
            >
              <el-option
                v-for="dict in resUserList"
                :key="dict.id"
                :label="dict.realName"
                :value="dict.username"
              />
            </el-select> -->
          </el-form-item>
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

          <SWFilterAdd
            class="commonAddBtn"
            :list="addList"
            :current-code="currentAddCode"
            @add-btn-click="addBtnClick"
          />
        </div>
      </div>
    </div>
    <!-- 列表 -->
    <div v-if="list && list.length > 0">
      <div class="categorizedList">
        <div class="categorizedList-card">
          <!-- 表头 -->
          <div class="categorizedList-header">
            <div class="content-item-wrap">
              <div class="header-item">发送标题</div>
              <div class="header-item" style="width: 60px">创建人</div>
              <div class="header-item" style="min-width: 380px">收件人</div>
              <div class="header-item">内容</div>
            </div>

            <div class="action">操作</div>
          </div>
          <!-- 表格内容 -->
          <div class="categorizedList-content" v-for="item in list" :key="item.id">
            <div class="content-item-wrap">
              <!-- 发送标题 -->
              <div class="content-item">{{ item.messageTitle || '--' }}</div>
              <!-- 创建人 -->
              <div class="content-item" style="width: 60px">{{ item.createdId || '--' }}</div>
              <!-- 收件人 -->
              <div class="content-item" style="min-width: 380px">
                <div class="row">
                  <div v-if="item.receiverList?.length <= 3" style="display: flex">
                    <!-- 如果总人数小于等于3，则直接展示 -->
                    <div v-for="i in item.receiverList" :key="i" class="userListItem">
                      <img :src="i.avatarOrigin" alt="" class="avatar" />
                      <span class="name"> {{ i.name }}</span>
                    </div>
                  </div>

                  <!-- 如果图片数量超过三张，则显示popover -->
                  <el-popover
                    v-else-if="item.receiverList.length > 3"
                    placement="right"
                    trigger="hover"
                    popper-style="padding:8px 8px 0 8px;min-height:100px"
                    width="300"
                  >
                    <template #reference>
                      <!-- 展示前三张图片 -->
                      <div class="row">
                        <div
                          v-for="i in item.receiverList.slice(0, 3)"
                          :key="i"
                          class="userListItem"
                        >
                          <img :src="i.avatarOrigin" alt="" class="avatar" />
                          <span class="name"> {{ i.name }}</span>
                        </div>
                      </div>
                    </template>
                    <!-- 展示剩下的图片 -->
                    <div style="display: flex; flex-wrap: wrap">
                      <div
                        v-for="i in item.receiverList.slice(3)"
                        :key="i"
                        style="margin-bottom: 8px"
                        class="userListItem"
                      >
                        <img :src="i.avatarOrigin" alt="" class="avatar" />
                        <span class="name"> {{ i.name }}</span>
                      </div>
                    </div>
                  </el-popover>
                </div>
              </div>
              <!-- 内容 -->
              <div class="content-item">{{ item.messageContent || '--' }}</div>
            </div>
            <!-- 操作 -->
            <div class="action cursor_pointer">
              <div class="action-btn" @click="handleSend(item)">
                <img src="@/assets/imgs/feishuSend/send.png" alt="" /> 发送</div
              >
              <div @click="openForm('update', item.id)" class="action-btn">
                <img src="@/assets/imgs/feishuSend/config.png" alt="" />
                配置</div
              >
              <div @click="handleDelete(item.id)" class="action-btn deleteBtn">
                <el-icon style="vertical-align: middle"><Delete /></el-icon>
                删除</div
              >
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
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <AddForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts">
import AddForm from './components/addForm.vue'

import { Search } from '@element-plus/icons-vue'
import * as FeishuSendApi from '@/api/feishuSend'

import { useAppStore } from '@/store/modules/app'
import * as rpaApi from '@/api/rpaManage'
const emits = defineEmits([])
const message = useMessage()
const appStore = useAppStore()
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
      openForm('create')
    }
  }
}

// 查询参数
const queryParams = ref({
  page: 1,
  size: 10,
  messageTitle: '', // 发送标题
  creator: '' // 创建人
})

// 重置
const resetQuery = () => {
  queryParams.value = {
    page: 1,
    size: 10,
    messageTitle: '',
    creator: ''
  }
  handleQuery()
}

// 查询
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

// 列表数据
const loading = ref(false)
const list = ref<any>([])
const total = ref(0)

const getList = async () => {
  loading.value = true
  try {
    const data = await FeishuSendApi.queryList(queryParams.value).catch(() => {})
    if (data) {
      list.value = data.records
      total.value = data.total
    }
    // console.log('list', list.value);
  } finally {
    loading.value = false
  }
}

/** 新增/修改弹窗 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  if (formRef.value) {
    formRef.value.open(type, id)
  }
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FeishuSendApi.deleteData(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

// 发送消息
const handleSend = async (item) => {
  console.log('item', item)
  try {
    // 发送的二次确认
    await message.confirm('确定要发送该消息吗？')
    // 发送消息
    await FeishuSendApi.sendData(item)
    message.success('发送成功')
    // 刷新列表
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
