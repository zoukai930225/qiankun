<template>
  <!-- 搜索 -->
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="88px"
    >
      <el-form-item label="店铺：" prop="storeCode">
        <el-select
          class="!w-200px"
          v-model="queryParams.storeCode"
          placeholder="请选择店铺"
          clearable
          @clear="handleQuery"
          @change="handleQuery"
        >
          <el-option
            v-for="dict in storeList"
            :key="dict.code"
            :label="dict.name"
            :value="dict.code"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
          重置
        </el-button>
        <!-- <el-button @click="handleQuery"><Icon icon="ep:search" />搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button> -->
        <el-button type="primary" @click="openForm('create')">
          <Icon icon="ep:plus" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>
  <ContentWrap>
    <el-table
      :border="true"
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      class="SWCommonTable"
      v-horizontal-scroll="'always'"
    >
      <el-table-column label="店铺" prop="storeName" min-width="150" />
      <el-table-column label="三方平台" prop="platformName" min-width="120" />
      <el-table-column label="商家名称" prop="sellerName" min-width="120" />
      <el-table-column label="商家授权Token" prop="sellerAuthValue" min-width="200" />
      <el-table-column label="状态" align="center" key="status" width="100">
        <template #default="scope">
          <div class="row-center" @click.stop.prevent="switchChange(scope.row)">
            <el-switch
              class="SWSwitch"
              style="margin-left: auto; margin-right: auto"
              active-color="#126EFE"
              v-model="scope.row.status"
              :before-change="switchBeforeChange"
              active-text="启用"
              inactive-text="禁用"
              :active-value="1"
              :inactive-value="0"
            />
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" fixed="right" width="110">
        <template #default="scope">
          <div class="row-center">
            <el-button link type="primary" @click="openForm('update', scope.row.id)">
              修改
            </el-button>
            <el-button link type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:page="queryParams.page"
      v-model:limit="queryParams.size"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 添加或修改对话框 -->
  <AddOrUpdateForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import * as StoreApi from '@/api/system/store'
import * as ThirdPlatformSellerApi from '@/api/system/thirdPlatform/seller'
import AddOrUpdateForm from './addOrUpdateSellerForm.vue'

defineOptions({ name: 'SystemThirdPlatform' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const route = useRoute() // 路由

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<ThirdPlatformSellerApi.ThirdPlatformSellerConfigVO[]>([]) // 列表的数
const storeList = ref<StoreApi.StoreVO[]>([]) // 店铺列表

const queryParams = reactive({
  page: 1,
  size: 10,
  storeCode: '',
  platform: route.params.platform || ''
})
const queryFormRef = ref() // 搜索的表单

/**
 * 获取店铺列表
 */

const getStoreList = async () => {
  try {
    const data = await StoreApi.getStorePage({ page: 1, size: 99999 }).catch(() => {})
    storeList.value = data.data || []
  } finally {
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await ThirdPlatformSellerApi.getThirdPlatformSellerConfigPage(queryParams)
    list.value = data.data
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id, queryParams.platform)
}

const switchBeforeChange = () => {
  return new Promise((resolve) => {
    return resolve(false)
  })
}
/**
 * 状态发生变化
 */
const switchChange = async (row) => {
  const statusText = row.status === 1 ? '禁用' : '启用'
  const content = `是否${statusText}该数据？`
  const successText = `${statusText}成功`
  try {
    // 状态的二次确认
    await message.confirm(content)
    const updateStatus = row.status === 1 ? 0 : 1
    // 更改装该
    await ThirdPlatformSellerApi.updateThirdPlatformSellerConfigStatus(row.id, updateStatus)
    message.success(successText)

    // 刷新列表
    await getList()
  } catch {}
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await ThirdPlatformSellerApi.deleteThirdPlatformSellerConfig(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 */
onMounted(() => {
  getStoreList()
  getList()
})
</script>
