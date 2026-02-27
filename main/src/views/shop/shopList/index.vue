<!--
 * @Date: 2024-06-06 10:13:37
-->
<template>
  <div>
    <!-- 列表 -->
    <ContentWrap>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="78px">
            <el-form-item label="分级:" prop="inventoryClassification">
              <el-select
                style="width: 200px"
                v-model="queryParams.inventoryClassification"
                placeholder="请选择库存分级"
                clearable
              >
                <el-option
                  v-for="dict in getIntDictOptions(DICT_TYPE.GOODGLIST_INVENTORY_CLASSIFICATION)"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="供应商:" prop="supplier">
              <el-input
                :prefix-icon="Search"
                class="dialogFormItemWidth"
                style="width: 200px"
                v-model="queryParams.supplier"
                placeholder="请输入供应商"
                clearable
              />
            </el-form-item>
            <el-form-item label="商家编号:" prop="goodsCode">
              <el-input
                class="dialogFormItemWidth"
                :prefix-icon="Search"
                style="width: 200px"
                v-model="queryParams.goodsCode"
                placeholder="请输入商家编号"
                clearable
              />
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

      <el-table
        :border="true"
        :header-cell-style="appStore.headerCellStyle"
        v-loading="loading"
        :data="list"
        :stripe="true"
        class="SWCommonTable"
        v-horizontal-scroll="'always'"
      >
        <el-table-column label="分级" prop="inventoryClassificationName" />
        <el-table-column label="供应商" prop="supplier" />
        <el-table-column label="厂家编号" prop="factoryCode" min-width="150" />
        <el-table-column label="货品编号" prop="productCode" />
        <el-table-column label="商家编码" prop="goodsCode" />
        <el-table-column label="规格名称" prop="formName" />
        <el-table-column label="规格码" prop="formCode" />
        <el-table-column label="价格" prop="price" />
        <el-table-column label="操作" align="center" fixed="right" width="200">
          <template #default="scope">
            <el-button class="operate-btn-space" link type="primary" @click="handleAdd(scope.row)">
              编辑
            </el-button>
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

    <!-- 新增 -->
    <Dialog v-model="dialogVisible" :title="dialogTitle" @close="closeDialog">
      <el-form
        class="dialogForm"
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        label-width="130px"
      >
        <el-form-item label="库存分级" prop="inventoryClassification">
          <el-select
            style="width: 200px"
            v-model="formData.inventoryClassification"
            placeholder="请选择库存分级"
            clearable
          >
            <el-option
              v-for="dict in getIntDictOptions(DICT_TYPE.GOODGLIST_INVENTORY_CLASSIFICATION)"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-select
            style="width: 200px"
            v-model="formData.supplier"
            placeholder="请选择供应商"
            clearable
            filterable
          >
            <el-option
              v-for="dict in supplierOptions"
              :key="dict.value"
              :label="dict.label"
              :value="dict.label"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="厂家编码" prop="factoryCode">
          <el-input
            class="dialogFormItemWidth"
            v-model="formData.factoryCode"
            placeholder="请输入厂家编码"
          />
        </el-form-item>
        <el-form-item label="货品编码" prop="productCode">
          <el-input
            class="dialogFormItemWidth"
            v-model="formData.productCode"
            placeholder="请输入货品编码"
          />
        </el-form-item>
        <el-form-item label="商家编码" prop="goodsCode">
          <el-input
            class="dialogFormItemWidth"
            v-model="formData.goodsCode"
            placeholder="请输入商家编码"
          />
        </el-form-item>
        <el-form-item label="规格名称" prop="formName">
          <el-input
            class="dialogFormItemWidth"
            v-model="formData.formName"
            placeholder="请输入规格名称"
          />
        </el-form-item>
        <el-form-item label="规格码" prop="formCode">
          <el-input
            class="dialogFormItemWidth"
            v-model="formData.formCode"
            placeholder="请输入规格码"
          />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            class="dialogFormItemWidth"
            type="number"
            v-model="formData.price"
            placeholder="请输入价格"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </template>
    </Dialog>

    <!-- 导入TODO 待抽离 -->
    <Dialog v-model="importVisible" :title="importTitle" @close="handleCloseImport">
      <div style="margin-bottom: 20px">
        <el-select
          style="width: 200px"
          v-model="formData1.company"
          placeholder="请选择企业"
          clearable
          filterable
        >
          <el-option
            v-for="dict in getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_DYNAMIC_COMPANY)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </div>

      <el-upload
        ref="uploadRef"
        class="CommonFileUpload"
        v-model:file-list="fileList"
        :action="importUrl"
        :auto-upload="false"
        :disabled="formLoading1"
        :headers="uploadHeaders"
        :data="formData1"
        :limit="1"
        :on-error="submitFormError"
        :on-exceed="handleExceed"
        :on-success="submitFormSuccess"
        accept=".xlsx, .xls"
        drag
      >
        <Icon icon="ep:upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip text-center">
            <span>仅允许导入 xls、xlsx 格式文件。</span>
          </div>
        </template>
      </el-upload>

      <template #footer>
        <el-button
          :disabled="formLoading1"
          type="primary"
          :loading="formLoading1"
          @click="submitForm1"
          >{{ formLoading1 ? '上传中' : '确 定' }}</el-button
        >
        <el-button @click="importVisible = false">取 消</el-button>
      </template>
    </Dialog>
  </div>
</template>
<script lang="ts" setup>
import { useAppStore } from '@/store/modules/app'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { downloadByUrl } from '@/utils/download'
import { shopListDownloadTemplate } from '@/config/common'
import { getAccessToken } from '@/utils/auth'
import { Search } from '@element-plus/icons-vue'

import {
  getSkuGoodsList,
  deleteSkuGoodsById,
  createSkuGoods,
  updateSkuGoods
} from '@/api/shop/index'
import * as DictDataApi from '@/api/system/dict/dict.data'

import { debounce } from 'lodash-es'
const message = useMessage() // 消息弹窗
const appStore = useAppStore()

defineOptions({ name: 'ShopList' })

const queryParams = reactive({
  page: 1,
  size: 10,
  inventoryClassification: undefined, //库存分级
  supplier: undefined, //供应商
  goodsCode: undefined //商家编号
})
const total = ref(0) // 列表的总页数
const loading = ref(false)
const supplierOptions = ref([])
const list = ref([]) // 列表的数据

const addList = ref([
  {
    label: '新增',
    code: 'add'
  },
  {
    label: '导入',
    code: 'import'
  },
  {
    label: '模版下载',
    code: 'template'
  }
])
// 当前新增按钮code码
const currentAddCode = ref(addList.value[0].code)

// 新增按钮点击
const addBtnClick = (value) => {
  if (value) {
    currentAddCode.value = value.code
    if (currentAddCode.value === 'add') {
      handleAdd({})
    } else if (currentAddCode.value === 'import') {
      importVisible.value = true
    } else if (currentAddCode.value === 'template') {
      downloadTemplate()
    }
  }
}

onMounted(() => {
  getList()
  getSupplierList()
})

// 下载模版
const downloadTemplate = () => {
  downloadByUrl(shopListDownloadTemplate, '商品导入模版')
}

// 删除
const handleDel = async (row: any) => {
  let content = `确定要删除？`
  let statusT = '删除'
  await message.delConfirm(content, statusT)
  await deleteSkuGoodsById(row.id)
  message.success('操作成功')
  getList()
}

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('新增') // 弹窗的标题
const formLoading = ref(false)
const formData = ref({
  id: undefined,
  inventoryClassification: undefined, //库存分级
  supplier: undefined, //供应商
  factoryCode: undefined, //厂家编码
  productCode: undefined, //货品编码
  goodsCode: undefined, //商家编码
  formName: undefined, //规格名称
  formCode: undefined, //规格码
  price: undefined //价格
})

// 添加
const submitForm = debounce(async () => {
  const params = { ...formData.value }
  // 有id是编辑 没有id是新增
  if (params.id) {
    await updateSkuGoods(params)
  } else {
    await createSkuGoods(params)
  }
  message.success(`${params.id ? '编辑' : '新增'}操作成功`)
  dialogVisible.value = false
  getList()
  resetForm()
}, 200)

// 添加
const handleAdd = (row: any) => {
  if (row.id) {
    formData.value = row
  }
  dialogTitle.value = row.id ? '编辑' : '新增'
  dialogVisible.value = true
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.page = 1
  getList()
}

const queryFormRef = ref()
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const closeDialog = () => {
  resetForm()
}

/** 重置表单 */
const formRef = ref() // 表单 Ref
const resetForm = () => {
  formRef.value?.resetFields()
  formData.value = {
    id: undefined,
    inventoryClassification: undefined, //库存分级
    supplier: undefined, //供应商
    factoryCode: undefined, //厂家编码
    productCode: undefined, //货品编码
    goodsCode: undefined, //商家编码
    formName: undefined, //规格名称
    formCode: undefined, //规格码
    price: undefined //价格
  }
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getSkuGoodsList(queryParams)
    list.value = data.records || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 查询供应商列表 */
const getSupplierList = async () => {
  const data = await DictDataApi.getDictDataPage({
    page: 1,
    size: 999999,
    type: 2,
    pCode: 'supplier'
  })
  if (data && data.data) {
    supplierOptions.value = []
    data.data.forEach((item) => {
      supplierOptions.value.push({
        value: item.code,
        label: item.name
      })
    })
  }
  console.log('代课老师付了款； ', supplierList.value)
}

// ~~~~~~~TODO：抽离~~~~~~
const importVisible = ref(false)
const importTitle = ref('导入商品')
const handleCloseImport = () => {
  importVisible.value = false
}
const uploadRef = ref()
const fileList = ref([]) // 文件列表
const formLoading1 = ref(false) // 表单的加载中
const uploadHeaders = ref() // 上传 Header 头
const formData1 = ref({ company: undefined })
// 导入接口URL
const importUrl =
  import.meta.env.VITE_BASE_URL + import.meta.env.VITE_API_URL + '/api/skuGoods/import'

/** 上传错误提示 */
const submitFormError = (): void => {
  message.error('上传失败，请您重新上传！')
  formLoading1.value = false
}

/** 文件数超出提示 */
const handleExceed = (): void => {
  message.error('最多只能上传一个文件！')
}

/** 文件上传成功 */
// const emits = defineEmits(['success'])
const submitFormSuccess = (response: any) => {
  if (response.code !== 200) {
    message.error(response.msg)
    formLoading1.value = false
    return
  }
  message.success('导人成功')
  importVisible.value = false
  resetImport()
  queryParams.page = 1
  getList() // 重新获取数据
  // 发送操作成功的事件
  // emits('success')
}
// 提交导入
const submitForm1 = async () => {
  if (!formData1.value.company) {
    message.error('请选择企业')
    return
  }

  if (fileList.value.length == 0) {
    message.error('请上传文件')
    return
  }
  uploadHeaders.value = {
    token: getAccessToken()
  }
  formLoading1.value = true
  uploadRef.value!.submit()
}
// 重制
const resetImport = () => {
  importVisible.value = false
  formData1.value.company = undefined
  fileList.value = []
}
// ~~~~~~~~~~~~~~~~~~~~
</script>

<style scoped>
.topStatics {
  margin-bottom: 16px;
}
</style>
