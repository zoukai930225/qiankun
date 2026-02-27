<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <div class="commonTopFilterWrap">
      <div class="commonTopFilterWrap-filter">
        <el-form
          ref="queryFormRef"
          :inline="true"
          :model="queryParams"
          class="-mb-15px"
          label-width="78px"
        >
          <el-form-item label="店铺名称:" prop="name">
            <el-input
              v-model="queryParams.name"
              :prefix-icon="Search"
              class="searchFormItemWidth"
              clearable
              placeholder="请输入店铺名称"
              @keyup.enter="handleQuery"
              @clear="handleQuery"
            />
          </el-form-item>
          <el-form-item label="渠道:" prop="channel">
            <SelectChannels v-model="queryParams.channel" />
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
    <div v-if="categorizedList && Object.keys(categorizedList).length > 0">
      <div class="categorizedList" v-for="(items, type) in categorizedList" :key="type">
        <div class="categorizedList-type cursor_pointer">
          <div class="channel-icon">
            <img :src="getImageUrl(items[0].channel)" alt="" />
          </div>
          <span style="margin-right: 8px">{{ type ? type : '--' }}</span>
          <el-icon size="19" @click="openDirectorDialog(items)"><Avatar /></el-icon>
          <span style="margin-left: 8px">{{ items[0].channelDirectorName }}</span>
        </div>

        <div class="categorizedList-card">
          <!-- 表头 -->
          <div class="categorizedList-header">
            <div class="content-item-wrap">
              <div class="header-item">店铺名称</div>
              <div class="header-item">店铺Code</div>
              <div class="header-item">简称</div>
              <div class="header-item">标签</div>
              <div class="header-item" width="10%">责任人</div>
              <div class="header-item">公司</div>
              <div class="header-item">创建时间</div>
            </div>

            <div class="action">操作</div>
          </div>
          <!-- 表格内容 -->
          <div class="categorizedList-content" v-for="item in items" :key="item.id">
            <div class="content-item-wrap">
              <!-- 店铺名称 -->
              <div class="content-item">{{ item.name || '--' }}</div>
              <!-- 店铺Code -->
              <div class="content-item">{{ item.code || '--' }}</div>
              <!-- 简称 -->
              <div class="content-item">{{ item.nickName || '--' }}</div>
              <!-- 标签 -->
              <div class="content-item">
                <div
                  :style="{
                    fontSize: '16px',
                    color: (item.tagContent && item.tagContent.tagColor) || '#333'
                  }"
                  >{{ (item.tagContent && item.tagContent.tagSymbol) || '--' }}</div
                >
              </div>
              <!-- 责任人 -->
              <div class="content-item" width="10%">{{ item.directorName }}</div>
              <!-- 公司 -->
              <div class="content-item">{{ item.companyName || '--' }}</div>
              <!-- 创建时间 -->
              <div class="content-item">{{ formatDate(item.createdAt) || '--' }}</div>
            </div>
            <!-- 操作 -->
            <div class="action cursor_pointer">
              <div @click="openForm('update', item.id)" class="action-btn"
                ><el-icon style="vertical-align: middle"><Edit /></el-icon>修改</div
              >
              <div class="action-btn" @click="openDirectorDialog(undefined, item)"
                ><el-icon style="vertical-align: middle"><User /></el-icon>负责人</div
              >
              <div @click="handleDelete(item.id)" class="action-btn">删除</div>
              <div @click="handleStoreConfig(item.id)" class="action-btn">店铺配置</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="empty">
      <el-empty description="暂无数据" />
    </div>
    <!-- <el-table
      :border="true"
      :header-cell-style="appStore.headerCellStyle"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="店铺名称" prop="name" min-width="180" />
      <el-table-column label="店铺Code" prop="code" min-width="180" />
      <el-table-column label="公司" prop="companyName" min-width="140" />
      <el-table-column label="渠道" prop="channelName" min-width="120" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column fixed="right" width="150" label="操作">
        <template #default="scope">
          <el-button
            class="operate-btn-space"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            修改
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table> -->
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.size"
      v-model:page="queryParams.page"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <StoreForm ref="formRef" @success="getList" />
  <!-- 设置责任人的弹窗 -->
  <el-dialog :title="directorDialogTitle" v-model="isShowDialog" width="600">
    <el-form :model="directorData" ref="directorForm" :rules="directorRules">
      <el-form-item prop="directorName" label="选择人员" required>
        <select-people
          :multiple="false"
          v-model:model-value="directorRes"
          :user-id="directorData.directorId"
          @update:director="updateDirector"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="closeDirectorDialog">取消</el-button>
      <el-button type="primary" @click="submitDirector">确认</el-button>
    </template>
  </el-dialog>
  <!-- 店铺配置弹窗 -->
  <StoreConfigDrawer ref="storeConfigDrawerRef" @success="getList" />
</template>

<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { formatDate } from '@/utils/formatTime'
import { Search } from '@element-plus/icons-vue'
import * as StoreApi from '@/api/system/store'
import StoreForm from './StoreForm.vue'
import SelectPeople from './components/selectPeople.vue'
import { getImageUrl } from '@/utils'
import { SelectChannels } from '@/components/SelectChannels/index'
import StoreConfigDrawer from './components/storeConfigDrawer.vue'

defineOptions({ name: 'SystemStore' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<StoreApi.StoreVO[]>([]) // 表格数据
const queryParams = reactive({
  page: 1,
  size: 10,
  name: '',
  channel: ''
})
const queryFormRef = ref() // 搜索的表单

const categorizedList = ref<any>({}) // 按照type分类的列表
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

// 第三方平台店铺配置弹窗
const storeConfigDrawerRef = ref()
// 店铺配置弹窗打开
const handleStoreConfig = (id: string) => {
  storeConfigDrawerRef.value?.open(id)
}


/** 查询字典类型列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await StoreApi.getStorePage(queryParams).catch(() => {
      loading.value = false
    })
    list.value = data.data || []
    total.value = data.total

    categorizedList.value = list.value.reduce((acc, item:any) => {
      const { channelName } = item
      if (!acc[channelName]) {
        acc[channelName] = []
      }
      acc[channelName].push({ ...item })

      return acc
    }, {})

    // 遍历获取每一个渠道的责任人
    Object.keys(categorizedList.value).forEach(async (key: string) => {
      if (!categorizedList.value[key][0].channel) return
      const res = await StoreApi.getChannelByCode(categorizedList.value[key][0].channel!)
      categorizedList.value[key][0].channelDirectorName = res?.directorName
      categorizedList.value[key][0].channelDirectorId = res?.directorId
      categorizedList.value[key][0].channelManegerId = res?.id
    })
  } finally {
    loading.value = false
  }
}

// 设置责任人的数据
const directorDialogTitle = ref('')
const directorForm = ref()
const directorRules = reactive({
  directorName: [
    {
      required: true,
      message: '请选择责任人'
    }
  ]
})
const isShowDialog = ref(false)
const directorRes = ref<string[]>([])
const directorData = ref<any>({
  id: '',
  directorName: '',
  directorId: '',
  channel: '',
  channelName: '',
  channelDirectorName: '' as string | undefined,
  channelDirectorId: '' as string | undefined
})
const emptyDirectorData = JSON.parse(JSON.stringify(directorData.value))
function updateDirector(value: typeof directorData.value) {
  directorData.value.directorId = value.directorId
  directorData.value.directorName = value.directorName
}
// 新增和修改渠道责任人
async function submitDirector() {
  if (!directorForm.value) return
  await directorForm.value.validate(async (valid) => {
    if (!valid) return
    let res: any = {}
    try {
      delete directorData.value.channelDirectorId
      delete directorData.value.channelDirectorName
      res = await StoreApi[apiKey.value](directorData.value)
      if (res.success) {
        message.success('提交成功')
        getList()
        closeDirectorDialog()
      }
    } catch (error) {
      message.error('提交失败')
    }
  })
}
const apiKey = ref('')
async function openDirectorDialog(
  items?: (typeof directorData.value)[],
  item?: typeof directorData.value
) {
  if (items) {
    // 渠道
    // 获取渠道责任人信息
    directorDialogTitle.value = '渠道'
    try {
      directorRes.value = [items[0].channelDirectorId || '']
      directorData.value.channel = items[0].channel
      directorData.value.channelName = items[0].channelName
      directorData.value.id = items[0].channelManegerId
      directorRes.value = items[0].channelDirectorId ? [items[0].channelDirectorId] : []
      apiKey.value = 'channelDirectorManagerSave'
    } catch (error) {}
  } else if (item) {
    //店铺
    directorData.value.channel = item.channel
    directorData.value.channelName = item.channelName
    directorData.value.id = item.id
    directorDialogTitle.value = '店铺'
    item.directorId && (directorRes.value = [item.directorId])
    apiKey.value = 'storeDirecormaintenaction'
  }
  isShowDialog.value = true
  nextTick(() => directorForm.value.resetFields())
}
function closeDirectorDialog() {
  directorData.value = JSON.parse(JSON.stringify(emptyDirectorData))
  isShowDialog.value = false
  directorRes.value = []
  directorForm.value.resetFields()
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await StoreApi.deleteStore(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

// 格式化时间
const formatTime = (originalTime) => {
  return new Date(originalTime)
    .toLocaleString('zh-CN', { hour12: false })
    .replace(/\//g, '-')
    .replace(',', '')
}
/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style lang="less" scoped>
.categorizedList {
  min-width: 1000px;
  &-type {
    font-weight: 600;
    font-size: 14px;
    color: #333333;
    margin-bottom: 20px;
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
      width: 15%;
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
      width: 15%;
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
    min-width: 220px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    &-btn {
      color: #409eff;
    }
  }
}
.cursor_pointer {
  display: flex;
  .channel-icon {
    display: flex;
    align-items: center;
    width: 19px;
    height: 19px;
    img {
      width: 14px;
    }
  }
}
:deep(.el-dialog__body) {
  padding-right: 32px !important;
}
:deep(.el-dialog__footer) {
  padding-right: 32px;
  padding-top: 0;
  padding-bottom: 16px;
}
</style>
