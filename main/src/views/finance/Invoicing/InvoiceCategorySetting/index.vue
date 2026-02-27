<!-- 发票类目设置 -->
<template>
  <div>
    <ContentWrap>
      <!-- 查询表单 -->
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form :inline="true" :model="queryParams" ref="queryFormRef">
            <el-form-item label="订单商品关键字：" prop="orderKeywords">
              <el-input style="width: 200px" v-model.trim="queryParams.orderKeywords" placeholder="请输入订单商品关键字" clearable
                @keyup.enter="getList" @clear="getList" />
            </el-form-item>
            <el-form-item label="开票名称：" prop="invoiceName">
              <el-select style="width: 200px" v-model="queryParams.invoiceName" placeholder="请选择开票名称" clearable
                @change="getList" @clear="getList">
                <el-option v-for="dict in invoiceNameList" :key="dict.code" :label="dict.label" :value="dict.code" />
              </el-select>
            </el-form-item>
            <el-form-item label="单位：" prop="unit">
              <el-input style="width: 200px" v-model.trim="queryParams.unit" @keyup.enter="getList" @clear="getList"
                placeholder="请输入单位" clearable />
            </el-form-item>
            <el-form-item label="店铺：" prop="store">
              <StoreRangePlus style="width: 200px" ref="storeRangeRef" :showAllChannels="false" placeholder="请选择店铺"
                v-model="queryParams.store" @change="getList" />
            </el-form-item>
          </el-form>
        </div>
        <div class="commonTopFilterWrap-search">
          <div class="commonTopFilterWrap-search-container">
            <el-button @click="getList" class="commonSearchBtn">
              <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
              搜索
            </el-button>
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
              重置
            </el-button>
            <el-button type="primary" style="margin-left: 15px; margin-right: 15px" @click="openDialog(0, null)">
              <el-icon :size="16" color="#FFFFFF" class="commonSearchBtnIcon">
                <Plus />
              </el-icon>
              新增
            </el-button>
          </div>
        </div>
      </div>

      <!-- list列表 -->
      <div style="margin-top: 20px">
        <el-table :border="true" :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
          :stripe="true" class="SWCommonTable" v-horizontal-scroll="'always'" show-overflow-tooltip>
          <el-table-column prop="storeName" label="店铺" width="240" />
          <el-table-column prop="orderKeywords" label="订单商品关键字" width="240" />
          <el-table-column prop="invoiceName" label="开票名称" width="240" />
          <el-table-column prop="unit" label="单位" width="200" />
          <el-table-column prop="isProduct" label="商品标记" width="140">
            <template #header>
              <div style="display: flex">
                <div>商品标记</div>
                <el-tooltip class="box-item" effect="dark" placement="top">
                  <template #content>
                    用于区分订单中商品类目匹配问题，<br />例如，邮费类金额将合并至已匹配的类目商品中
                  </template>
                  <el-icon style="vertical-align: middle; color: #ff0200ad; margin-top: 4px">
                    <QuestionFilled />
                  </el-icon>
                </el-tooltip>
              </div>
            </template>
            <template #default="{ row }">
              {{ row.isProduct ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" width="240" />
          <el-table-column prop="" label="操作" align="center">
            <template #default="{ row }">
              <el-button link type="primary" :icon="Edit" @click="openDialog(1, row)">编辑</el-button>
              <el-button link type="danger" :icon="Delete" @click="deleteId(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <Pagination v-model:limit="queryParams.size" v-model:page="queryParams.page" :total="total"
          @pagination="getList" />
      </div>
      <div class="drawer-wrapper">
        <el-drawer v-model="dialogVisible" :with-header="false" direction="rtl" :before-close="dialogBeforeClose"
          size="40%">
          <div>
            <div class="drawerTitle">
              <div>{{ title }}</div>
              <div @click="dialogBeforeClose"><el-icon>
                  <CloseBold />
                </el-icon></div>
            </div>
          </div>
          <div>
            <el-form ref="submitFormRef" :model="form" label-width="140px" :rules="rules">
              <div class="drawerContent">
                <el-form-item label="店铺：" prop="store">
                  <StoreRangePlus ref="storeRangeRef2" v-model="form.store" :showAllChannels="false" placeholder="请选择店铺"
                    width="100%" />
                </el-form-item>
                <el-form-item label="商品订单关键字：" prop="orderKeywords">
                  <el-input v-model="form.orderKeywords" placeholder="商品订单关键字" clearable />
                </el-form-item>
                <el-form-item label="开票名称：" prop="invoiceName">
                  <el-select v-model="form.invoiceName" placeholder="请选择开票名称">
                    <el-option v-for="dict in invoiceNameList" :key="dict.code" :label="dict.label"
                      :value="dict.code" />
                  </el-select>
                </el-form-item>
                <el-form-item label="单位：" prop="unit">
                  <el-input v-model="form.unit" placeholder="请输入单位" clearable />
                </el-form-item>
                <el-form-item label="商品标记：" prop="isProduct">
                  <template #label>
                    <div style="display: flex">
                      <div>商品标记：</div>
                      <el-tooltip class="box-item" effect="dark" placement="top">
                        <template #content>
                          用于区分订单中商品类目匹配问题，<br />例如，邮费类金额将合并至已匹配的类目商品中
                        </template>
                        <el-icon style="vertical-align: middle; color: #ff0200ad; margin-top: 9px">
                          <QuestionFilled />
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </template>
                  <el-select v-model="form.isProduct" placeholder="是否默认">
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                  </el-select>
                </el-form-item>
                <el-form-item label="备注：" prop="remark">
                  <s-text-area v-model="form.remark" :rows="2" placeholder="备注" />
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div class="drawerFooter">
            <el-button @click="dialogBeforeClose">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
          </div>
        </el-drawer>
      </div>
    </ContentWrap>
  </div>
</template>
<script setup lang="ts">
import STextArea from "@/components/common/input/s-textarea.vue";
import { Delete, Edit } from '@element-plus/icons-vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
const message = useMessage() // 消息弹窗
import { useAppStore } from '@/store/modules/app'
import * as financeApi from '@/api/finance/index'
import { cloneDeep } from 'lodash-es'
const appStore = useAppStore()
const queryParams = ref({
  page: 1,
  size: 10,
  orderKeywords: '',
  invoiceName: '',
  unit: '',
  store: '' // 店铺
})
const form = ref({
  store: '',
  orderKeywords: '',
  invoiceName: '',
  remark: '',
  isProduct: '',
  unit: ''
})
const rules = ref({
  store: [{ required: true, message: '请选择店铺', trigger: 'change' }],
  invoiceName: [{ required: true, message: '请选择开票名称', trigger: 'change' }],
  unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
  isProduct: [{ required: true, message: '请选择商品标记', trigger: 'change' }],
  orderKeywords: [{ required: true, message: '请选择商品标记', trigger: 'blur' }]
})
const title = ref('')
const total = ref(0)
const list = ref([])
const dialogVisible = ref(false)

// 开票名称字典列表
const invoiceNameList = ref<any>([])
const invoiceNameMap = ref([])

// 重置
const queryFormRef = ref()
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getList()
}
const submitFormRef = ref()
const resetQuery2 = () => {
  form.value = {
    store: '',
    orderKeywords: '',
    invoiceName: '',
    remark: '',
    isProduct: '',
    unit: ''
  }
  submitFormRef.value.resetFields()
}

const storeRangeRef = ref()
const storeRangeRef2 = ref()

const loading = ref(false)

const dialogBeforeClose = () => {
  dialogVisible.value = false
  resetQuery2()
}
const getList = () => {
  loading.value = true
  financeApi
    .list(queryParams.value)
    .then((res) => {
      loading.value = false
      list.value = res.records
      total.value = res.total
    })
    .catch(() => {
      loading.value = false
    })
}

const openDialog = (index, row) => {
  if (index === 0) {
    title.value = '新增'
    dialogVisible.value = true
    submitFormRef.value.clearValidate('store')
  }
  if (index === 1) {
    dialogVisible.value = true
    title.value = '编辑'
    nextTick(() => {
      form.value = cloneDeep(row)
      form.value.invoiceName = invoiceNameMap[form.value.invoiceName]
    })
  }
}

// 新增 编辑
const submit = () => {
  submitFormRef.value.validate((valid) => {
    if (valid) {
      if (title.value === '编辑') {
        financeApi.update(form.value).then((res) => {
          if (res) {
            message.success('编辑成功')
            dialogBeforeClose()
            getList()
          }
        })
      }
      if (title.value === '新增') {
        financeApi.save(form.value).then((res) => {
          if (res) {
            message.success('新增成功')
            dialogBeforeClose()
            getList()
          }
        })
      }
    }
  })
}

// 删除
const deleteId = async (row) => {
  await message.confirm('确认删除此条数据？')
  financeApi.deleteId(row.id).then((res) => {
    if (res) {
      message.success('删除成功')
      getList()
    }
  })
}

onMounted(() => {
  getList()
  invoiceNameList.value = getIntDictOptions(DICT_TYPE.PRODUCT_CATEGORY, true)
  invoiceNameList.value.forEach((item) => {
    invoiceNameMap[item.label] = item.code
  })
})
</script>
<style lang="scss" scoped>
// 修改备注的文本框背景
.drawerContent {

  :deep(.el-textarea__inner),
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    background-color: #f8f8f9 !important;
    box-shadow: none !important;
  }
}

:deep(.el-drawer) {
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景颜色
:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}

.drawerContent {
  width: 100%;
  padding: 20px 20px 20px 0;
  background-color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.drawerFooter {
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
}
</style>
