<template>
  <div class="wrapper">
    <div style="padding: 20px 20px 0 20px">
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" :label-width="80"
            @submit.prevent="handleQuery">
            <el-form-item label="一级分类" prop="firstLevelType">
              <el-select class="dialogFormItemWidth" v-model="queryParams.firstLevelType" placeholder="请选择一级分类"
                clearable style="width: 200px" value-on-clear="" @change="handleFirsLevelTypeChange">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.SHOOTING_CLOTHING_WAREHOUSE, true)"
                  :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="二级分类" prop="secondLevelType">
              <el-select class="dialogFormItemWidth" v-model="queryParams.secondLevelType" placeholder="请选择二级分类"
                clearable style="width: 200px" value-on-clear="">
                <el-option v-for="dict in secondLevelOptions" :key="dict.value" :label="dict.label"
                  :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="尺码" prop="size">
              <el-select class="dialogFormItemWidth" v-model="queryParams.size" placeholder="请选择尺码" clearable
                style="width: 200px" value-on-clear="">
                <el-option v-for="dict in getIntDictOptions(
                  DICT_TYPE.SHOOTING_CLOTHING_WAREHOUSE_SIZE,
                  true
                )" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="上传人" prop="uploader">
              <user-screen :item="queryParams" id="uploader" />
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
            <el-button type="primary" style="margin-left: 16px" v-hasPermi="['team:clothesLibrary:create']"
              @click="addBtnClick">
              <el-icon color="#fff" :size="16" style="margin-right: 4px">
                <Plus />
              </el-icon>
              新增</el-button>
            <!-- <SWFilterAdd
              class="commonAddBtn"
              v-hasPermi="['team:clothesLibrary:create']"
              :list="addList"
              :current-code="currentAddCode"
              @add-btn-click="addBtnClick"
            /> -->
          </div>
        </div>
      </div>

      <el-table class="SWCommonTable" :data="list" width="100%" :show-overflow-tooltip="false" v-loading="loading"
        v-horizontal-scroll="'always'" row-class-name="commonTableRow" :header-cell-style="headerCellStyle"
        :header-row-style="headerRowStyle" :row-style="rowStyle" @sort-change="handleSortChange">
        <el-table-column prop="account" label="图片">
          <template #default="{ row }">
            <el-image style="width: 44px; height: 44px" :src="row.image + '?x-oss-process=image/quality,q_50'" alt=""
              fit="contain" :preview-src-list="[row.image]" preview-teleported hide-on-click-modal />
          </template>
        </el-table-column>
        <el-table-column prop="firstLevelType" label="一级类型">
          <template #default="{ row }">
            <el-tag effect="light" round :type="getColor(row.firstLevelType)" size="large">
              <div style="color: #333; padding: 0 4px">
                {{ getDictLabel(DICT_TYPE.SHOOTING_CLOTHING_WAREHOUSE, row.firstLevelType) }}
              </div>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="secondLevelType" label="二级类型">
          <template #default="{ row }">
            <span>{{ getDictLabel(row.firstLevelType, row.secondLevelType) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="size" label="尺码">
          <template #default="{ row }">
            <span>{{
              getDictLabel(DICT_TYPE.SHOOTING_CLOTHING_WAREHOUSE_SIZE, row.size) || '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="notes" label="备注" min-width="140">
          <template #default="{ row }">
            <el-tooltip placement="top-start" :disabled="!row.notes" effect="dark">
              <span class="text2">{{ row.notes || '--' }}</span>
              <template #content>
                <div style="max-width: 320px">
                  {{ row.notes }}
                </div>
              </template>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="uploader" label="上传人">
          <template #default="{ row }">
            <div class="uploaderInfo" v-if="row.uploader">
              <img class="uploaderInfo-icon" :src="row.avatarOrigin" />
              <span class="uploaderInfo-text">{{ row.name }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="uploadTime" label="上传时间" sortable="custom" />
        <!-- 操作列 -->
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link v-hasPermi="['team:clothesLibrary:update']" type="primary" style="color: #0064ff"
              @click="openForm('update', row.id)">编辑</el-button>
            <el-button link v-hasPermi="['team:clothesLibrary:delete']" type="danger"
              @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="empty-img">
            <img src="@/assets/imgs/common/empty_list.png" alt="" />
            <div>暂无数据</div>
          </div>
        </template>
      </el-table>
    </div>

    <div class="pagination">
      <!-- 分页 -->
      <Pagination v-model:limit="queryParams.pageSize" v-model:page="queryParams.page" :total="total"
        @pagination="getList" />
    </div>
    <!-- 新增/编辑弹窗 -->
    <addDrawer ref="addDrawerRef" @success="getList" />
  </div>
</template>

<script lang="ts" setup>
import * as ClothesLibraryApi from '@/api/team/clothesLibrary'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'
import addDrawer from './components/addDrawer.vue'
import UserScreen from "@/components/common/user/userScreen.vue";
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const queryFormRef = ref()
const loading = ref(false) // 加载状态
const headerCellStyle = {
  backgroundColor: '#F2F6FC',
  color: '#333',
  fontSize: '14px',
  fontWeight: '600',
  height: '40px',
  'line-height': '30px',
  borderBottom: 'none',
  padding: 0
}
const headerRowStyle = {
  backgroundColor: '#F2F6FC'
}

const rowStyle = {
  marginBottom: '16px',
  height: '50px'
}

let cachedMap: Map<string, string> | null = null
let lastListVersion: any[] | null = null

type TagType = 'primary' | 'success' | 'warning' | 'danger' | 'info'
const getColor = (firstLevelType: string): TagType => {
  const colorPool: TagType[] = ['primary', 'success', 'warning', 'danger', 'info']
  const currentList = getIntDictOptions(DICT_TYPE.SHOOTING_CLOTHING_WAREHOUSE, true)

  if (cachedMap && lastListVersion === currentList) {
    return (cachedMap.get(firstLevelType) as TagType) || colorPool[0]
  }

  cachedMap = new Map()
  lastListVersion = currentList

  currentList.forEach((item, index) => {
    const value = item.value as string
    const color = colorPool[index % colorPool.length] ?? 'primary'
    cachedMap!.set(value, color)
  })

  return (cachedMap.get(firstLevelType) as TagType) || colorPool[0]
}

// 新增
const addList = ref([
  {
    label: '新增',
    code: 'add'
  }
])
// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = () => {
  openForm('create', undefined)
}
// 查询参数
const queryParams = ref({
  pageSize: 10,
  page: 1,
  firstLevelType: '',
  secondLevelType: '',
  size: '',
  id: '',
  name: '',
  uploader: '',
  dateOrderType: 'desc' // 上传时间排序 asc/desc
})

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  selectedPerson.value = ''
  handleQuery()
}

const total = ref(0)
const list = ref([])
const getList = async () => {
  try {
    const res = await ClothesLibraryApi.getClothesLibraryList(queryParams.value)
    list.value = res.records || []
    total.value = res.total || 0
  } finally {
    loading.value = false
  }
}

// 新增
const addDrawerRef = ref()
const openForm = (type: string, id?: string) => {
  if (addDrawerRef.value) {
    addDrawerRef.value.open(type, id)
  }
}

// 排序事件
const handleSortChange = ({ prop, order }) => {
  if (prop === 'uploadTime') {
    queryParams.value.dateOrderType = { ascending: 'asc', descending: 'desc' }[order]
  }
  queryParams.value.dateOrderType = queryParams.value.dateOrderType
    ? queryParams.value.dateOrderType
    : 'desc'

  getList()
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ClothesLibraryApi.deleteClothesLibrary([id])
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

// 一级分类变化
const secondLevelOptions = ref<any>([])
const handleFirsLevelTypeChange = (value) => {
  queryParams.value.secondLevelType = ''
  secondLevelOptions.value = []
  if (!value) return
  secondLevelOptions.value = getIntDictOptions(value, true)
}

// 选择上传人
const selectedPerson = ref('')
const selectedPersonInfo = ref<any>({})
const peopleList = ref<any>([])
const selectLoading = ref(false)

// const getPeopleList = async () => {
//   try {
//     selectLoading.value = true
//     const data = await ClothesLibraryApi.getPersonRosterAvatarOriginList({
//       status: '2'
//     })
//     peopleList.value = data || []
//   } catch (error) {
//     console.error('请求失败:', error)
//   } finally {
//     selectLoading.value = false
//   }
// }
// 选择人员
const handleSelectChange = (data) => {
  if (!data) {
    selectedPersonInfo.value = {}
    queryParams.value.uploader = ''
    return
  }
  selectedPersonInfo.value = data
  queryParams.value.uploader = data.userId
}
// onBeforeMount(() => {
//   getPeopleList()
// })
onMounted(() => {
  getList()
})
</script>

<style lang="scss" scoped>
.wrapper {
  background-color: #fff;
  border-radius: 8px;
}

// 一级分类背景色
.firstLevelTypeBg {
  width: max-content;
  padding: 2px 14px;
  border-radius: 12px;
  color: #fff;
}

// 头像
.uploaderInfo {
  &-icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    vertical-align: middle;
    margin-right: 6px;
  }
}

// 上传人选择器
.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}

.peopleOption {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;
  width: 100px;

  .left-wapper {
    display: flex;
    align-items: center;
  }

  .img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .info {
    display: flex;
    flex-direction: column;
    margin-left: 14px;

    .text {
      height: 20px;
      line-height: 20px;
    }

    .name {
      font-size: 14px;
      color: #333333;
    }

    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}

.label-wrapper {
  display: flex;
  align-items: center;
  height: 26px;
  background: #cad6f8;
  border-radius: 13px;
  padding: 1px 6px;
  width: min-content;
  box-sizing: border-box;

  .name {
    font-size: 14px;
    color: #333333;
    margin-left: 6px;
    margin-right: 6px;
  }

  .avatorLogo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
}

.tooltip-class {
  max-width: 200px;
}

// 分页
.pagination {
  width: 100%;
  display: flex;
  padding: 0 20px;
  box-sizing: border-box;
  justify-content: flex-end;
  margin-top: 20px;
  border-radius: 0px 0px 8px 8px;
  box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
}
</style>
