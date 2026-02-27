<template>
  <ContentWrap>
    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%">
      <div class="filter-wrap">
        <div>
          <span style="margin-right: 11px">商品ID</span>
          <el-input
            v-model="queryParams.goodsId"
            clearable
            :prefix-icon="Search"
            placeholder="商品ID"
            @clear="handleQuery"
            @keyup.enter="handleQuery"
            class="!w-240px"
          />
        </div>
        <div>
          <span style="margin: 0 11px">店铺</span>
          <el-select
            v-model="queryParams.store"
            clearable
            @clear="handleQuery"
            @change="handleQuery"
            class="!w-240px"
          >
            <el-option
              v-for="item in shopList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
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
      <!-- <div style="display: flex; align-items: center">
        <el-button
          @click="handleQuery"
          style="border: 1px solid #eaeaea; background-color: #f1f3f7"
        >
          搜索</el-button
        >
        <el-button @click="resetQuery">重置</el-button>
        <SWFilterAdd
          class="commonAddBtn"
          :list="addList"
          :current-code="currentAddCode"
          @add-btn-click="addBtnClick"
        />
      </div> -->
    </div>
  </ContentWrap>
  <ContentWrap>
    <!-- 列表 -->
    <div class="list-wrap">
      <!-- 表头 -->
      <div class="list-header">
        <div class="header-item">店铺</div>
        <div class="header-item">监控范围</div>
        <div class="header-item">监控指标</div>
        <div class="header-item">监控类型</div>
        <div class="header-item" style="text-align: center; width: 12%">操作</div>
      </div>
      <div v-if="list.length > 0">
        <div class="list-content" v-for="item in list" :key="item.id">
          <!-- 店铺 -->
          <div class="content-item cursor_pointer">{{ getStoreName(item.store) }}</div>
          <!-- 监控范围 -->
          <div class="content-item">{{ item.monitorRange }}</div>

          <!-- 监控指标 -->
          <div class="content-item cursor_pointer" style="display: flex; align-items: center">
            {{ item.monitorIndex }}
          </div>
          <!-- 监控类型 -->
          <div class="content-item">{{
            getDictLabel(DICT_TYPE.MONITORING_CATEGORY, item.monitoringCategory)
          }}</div>

          <!-- 操作 -->
          <div
            class="content-item action-wrap"
            style="text-align: center; width: 12%; min-width: 140px"
          >
            <span class="action-edit" @click="handleExecute(item)" v-if="item.status === 1">
              <img src="@/assets/imgs/common/action.png" alt="" class="action-img" />
              启用</span
            >
            <span class="action-delete" @click="handleExecute(item)" v-if="item.status === 0">
              <img src="@/assets/imgs/common/action2.png" alt="" class="action-img" />
              禁用</span
            >
            <span class="action-edit" @click="openForm('update', item.id)">
              <img src="@/assets/imgs/common/edit.png" alt="" class="action-img" />
              编辑</span
            >
            <span class="action-delete" @click="handleDelete(item.id)">
              <img src="@/assets/imgs/common/delete.png" alt="" class="action-img" />
              删除</span
            >
          </div>
        </div>
      </div>
      <div v-else class="empty-img">
        <img src="@/assets/imgs/common/empty_list.png" alt="" />
        <div>暂无数据</div>
      </div>
    </div>

    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>
  <!-- 表单弹窗：添加/修改 -->
  <AddProdForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as productMonitorApi from '@/api/serviceConfiguration/productMonitor'
import AddProdForm from './components/addProdForm.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
const message = useMessage()
const { t } = useI18n() // 国际化
// 查询参数
const queryParams = ref({
  goodsId: '',
  store: '',
  pageNo: 1,
  pageSize: 10
})

// 搜索
const handleQuery = () => {
  queryParams.value.pageNo = 1
  getList()
  // console.log('queryParams', queryParams.value)
}

// 列表数据
const loading = ref(false)
const list = ref([])
const total = ref(0)

const getList = async () => {
  loading.value = true
  try {
    queryParams.value.store = queryParams.value.store ? queryParams.value.store : ''
    const data = await productMonitorApi.getPageList(queryParams.value).catch(() => {})
    if (data) {
      list.value = data.records || []
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

// 重置
const resetQuery = () => {
  queryParams.value = {
    goodsId: '',
    store: '',
    pageNo: 1,
    pageSize: 10
  }
  handleQuery()
}

/** 新增程序 */
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
    await productMonitorApi.deleteById({ id: id })
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 执行按钮操作 */
const handleExecute = async (data: any) => {
  try {
    // 执行的二次确认
    ElMessageBox.confirm(
      `确定${data.status === 0 ? '<span style="color: #eb3737;">禁用</span>' : '<span style="color: #007eff;">启用</span>'}该商品监控配置吗？`,
      '系统提醒',
      {
        dangerouslyUseHTMLString: true, // 允许message内容为HTML
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }
    ).then(async () => {
      await productMonitorApi.enableOrDisable({ id: data.id, status: data.status === 1 ? 0 : 1 })
      message.success('操作成功')
      // 刷新列表
      await getList()
    })
  } catch {}
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

const shopList = ref([])
// 获取店铺列表
const getShopList = async () => {
  let data = await productMonitorApi.getShopList()
  shopList.value = data.map((item) => ({ label: item.name, value: item.code }))
}
// 列表回显店铺名称
const getStoreName = (code) => {
  const item = shopList.value.find((item) => item.value === code)
  return item ? item.label : ''
}

onMounted(() => {
  getList()
  getShopList()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
.checkOrClose-wrap {
  width: 56px;
  height: 22px;
  line-height: 22px;
  background: #f7f7f7;
  border-radius: 12px;
  font-size: 14px;
  color: #333333;
  text-align: center;
  img {
    vertical-align: middle;
    width: 12px;
    height: 12px;
  }
}

.action-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-edit {
  color: #007eff;
  cursor: pointer;
}
.action-delete {
  color: #eb3737;
  cursor: pointer;
}
.action-img {
  width: 14px;
  vertical-align: middle;
}
</style>
