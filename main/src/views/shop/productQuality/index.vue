<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <div>
      <div class="commonTopFilterWrap">
        <div class="commonTopFilterWrap-filter">
          <el-form ref="queryFormRef" :inline="true" :model="queryParams" :label-width="80">
            <el-form-item label="产品编码" prop="productCode">
              <el-input :prefix-icon="Search" class="searchFormItemWidth" v-model="queryParams.productCode"
                placeholder="请输入产品编码" clearable @keyup.enter="handleQuery" @clear="handleQuery" />
            </el-form-item>
            <el-form-item label="类目" prop="category">
              <el-select class="searchFormItemWidth" v-model="queryParams.category" placeholder="请选择类目" clearable
                @change="handleQuery" @clear="handleQuery">
                <el-option v-for="dict in getIntDictOptions(DICT_TYPE.PRODUCT_QUALITY_CHECK_CATEGORY, true)"
                  :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="设计师" prop="designer">
              <selectPeople v-model:modelValue="designers" :getSearchList="remoteMethod" style="width: 200px" />
              <!-- <el-input
                :prefix-icon="Search"
                class="searchFormItemWidth"
                v-model="queryParams.designer"
                placeholder="请输入设计师"
                clearable
                @keyup.enter="handleQuery"
                @clear="handleQuery"
              /> -->
            </el-form-item>
            <el-form-item label="执行标准" prop="enforceStandard">
              <el-select class="searchFormItemWidth" v-model="queryParams.enforceStandard" placeholder="请选择执行标准"
                clearable @change="handleQuery" @clear="handleQuery">
                <el-option v-for="dict in getIntDictOptions(
                  DICT_TYPE.PRODUCT_QUALITY_CHECK_ENFORCE_STANDARD,
                  true
                )" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>

            <el-form-item v-show="isExpand" label="安全类别" prop="securityCategory">
              <el-select class="searchFormItemWidth" v-model="queryParams.securityCategory" placeholder="请选择安全类别"
                clearable @change="handleQuery" @clear="handleQuery">
                <el-option v-for="dict in getIntDictOptions(
                  DICT_TYPE.PRODUCT_QUALITY_CHECK_SECURITY_CATEGORY,
                  true
                )" :key="dict.value" :label="dict.label" :value="dict.value" />
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
            <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0">
              重置
            </el-button>

            <SWFilterAdd class="commonAddBtn" :list="addList" :current-code="currentAddCode" :loading="addBtnLoading"
              @add-btn-click="addBtnClick" />
          </div>
        </div>
      </div>
      <SWFilterExpandAll :isExpand="isExpand" @expand-click="isExpand = !isExpand" />
    </div>
    <!-- 列表 -->
    <el-table ref="sortTableRef" :header-cell-style="appStore.headerCellStyle" v-loading="loading" :data="list"
      :stripe="true" row-class-name="commonTableRow" class="SWCommonTable" v-horizontal-scroll="'always'">
      <el-table-column label="产品编码" prop="productCode" min-width="150">
        <template #default="scope">
          {{ scope.row.productCode || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="产品图片" width="150">
        <template #default="scope">
          <div class="row">
            <div v-if="getImageArray(scope.row.productImage).length <= 3" style="display: flex">
              <!-- 图片数组分割，只显示前三张 -->
              <div v-for="img in getImageArray(scope.row.productImage)" :key="img">
                <ArticleCover :cover="img" />
              </div>
            </div>

            <!-- 如果图片数量超过三张，则显示popover -->
            <el-popover v-else-if="getImageArray(scope.row.productImage).length > 3" placement="bottom-start"
              trigger="hover" popper-style="padding:8px 8px 0 8px">
              <template #reference>
                <!-- 展示前三张图片 -->
                <div class="row">
                  <div v-for="img in getImageArray(scope.row.productImage).slice(0, 3)" :key="img">
                    <ArticleCover :cover="img" />
                  </div>
                </div>
              </template>
              <!-- 展示剩下的图片 -->
              <div style="display: flex; flex-wrap: wrap">
                <div v-for="img in getImageArray(scope.row.productImage).slice(3)" :key="img"
                  style="margin-bottom: 8px">
                  <ArticleCover :cover="img" />
                </div>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="类目" prop="category">
        <template #default="scope">
          {{ getDictLabel(DICT_TYPE.PRODUCT_QUALITY_CHECK_CATEGORY, scope.row.category) || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="设计师" prop="designer" align="center" :width="200">
        <template #default="scope">
          <div style="display: flex; width: 200px; flex-wrap: wrap; align-items: center" v-if="scope.row.designers">
            <div v-for="item in scope.row.designers" :key="item.userId" class="designerItem">
              <img :src="item.avatarOrigin" alt="" />
              {{ item.name }}
            </div>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="尺码范围" prop="sizeRange" :width="120">
        <template #default="scope">
          <div style="display: flex; width: 120px; flex-wrap: wrap; align-items: center" v-if="scope.row.sizeRange">
            <div v-for="(item, index) in scope.row.sizeRange?.split(',')" :key="index" class="sizeRangeItem"
              :style="{ backgroundColor: getColor(index) }">
              {{ item }}
            </div>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="面料成分" prop="fabricComposition">
        <template #default="scope"> {{ scope.row.fabricComposition || '-' }}</template>
      </el-table-column>
      <el-table-column label="内裤成分" prop="pantyIngredients">
        <template #default="scope"> {{ scope.row.pantyIngredients || '-' }}</template>
      </el-table-column>

      <el-table-column label="成分报告打码版" width="150">
        <template #default="scope">
          <div class="row">
            <div v-if="getImageArray(scope.row.compositionReport).length <= 3" style="display: flex">
              <!-- 图片数组分割，只显示前三张 -->
              <div v-for="img in getImageArray(scope.row.compositionReport)" :key="img">
                <ArticleCover :cover="img" />
              </div>
            </div>

            <!-- 如果图片数量超过三张，则显示popover -->
            <el-popover v-else-if="getImageArray(scope.row.compositionReport).length > 3" placement="bottom-start"
              trigger="hover" popper-style="padding:8px 8px 0 8px">
              <template #reference>
                <!-- 展示前三张图片 -->
                <div class="row">
                  <div v-for="img in getImageArray(scope.row.compositionReport).slice(0, 3)" :key="img">
                    <ArticleCover :cover="img" />
                  </div>
                </div>
              </template>
              <!-- 展示剩下的图片 -->
              <div style="display: flex; flex-wrap: wrap">
                <div v-for="img in getImageArray(scope.row.compositionReport).slice(3)" :key="img"
                  style="margin-bottom: 8px">
                  <ArticleCover :cover="img" />
                </div>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="抗菌报告打码版" width="150">
        <template #default="scope">
          <div class="row">
            <div v-if="getImageArray(scope.row.antimicrobialReport).length <= 3" style="display: flex">
              <!-- 图片数组分割，只显示前三张 -->
              <div v-for="img in getImageArray(scope.row.antimicrobialReport)" :key="img">
                <ArticleCover :cover="img" />
              </div>
            </div>

            <!-- 如果图片数量超过三张，则显示popover -->
            <el-popover v-else-if="getImageArray(scope.row.antimicrobialReport).length > 3" placement="bottom-start"
              trigger="hover" popper-style="padding:8px 8px 0 8px">
              <template #reference>
                <!-- 展示前三张图片 -->
                <div class="row">
                  <div v-for="img in getImageArray(scope.row.antimicrobialReport).slice(0, 3)" :key="img">
                    <ArticleCover :cover="img" />
                  </div>
                </div>
              </template>
              <!-- 展示剩下的图片 -->
              <div style="display: flex; flex-wrap: wrap">
                <div v-for="img in getImageArray(scope.row.antimicrobialReport).slice(3)" :key="img"
                  style="margin-bottom: 8px">
                  <ArticleCover :cover="img" />
                </div>
              </div>
            </el-popover>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="执行标准" prop="enforceStandard" min-width="140">
        <template #default="scope">
          {{
            getDictLabel(
              DICT_TYPE.PRODUCT_QUALITY_CHECK_ENFORCE_STANDARD,
              scope.row.enforceStandard
            ) || '-'
          }}
        </template>
      </el-table-column>
      <el-table-column label="安全类别" prop="securityCategory" min-width="160">
        <template #default="scope">
          {{
            getDictLabel(
              DICT_TYPE.PRODUCT_QUALITY_CHECK_SECURITY_CATEGORY,
              scope.row.securityCategory
            ) || '-'
          }}
        </template>
      </el-table-column>
      <el-table-column label="风格" prop="style">
        <template #default="scope">
          {{ getDictLabel(DICT_TYPE.PRODUCT_QUALITY_CHECK_STYLE, scope.row.style) || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="remark">
        <template #default="scope"> {{ scope.row.remark || '-' }}</template>
      </el-table-column>
      <el-table-column fixed="right" width="130" label="操作" align="center">
        <template #default="scope">
          <div class="action-wrap">
            <div class="action-edit" @click="openForm('update', scope.row.id)"><el-icon
                style="margin-right: 4px; vertical-align: middle">
                <Edit />
              </el-icon>编辑</div>
            <div class="action-delete" @click="handleDelete(scope.row.id)"><el-icon
                style="margin-right: 4px; vertical-align: middle">
                <Delete />
              </el-icon>删除</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size" @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <AddProdForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import SWFilterExpandAll from '@/components/SWBaseComponent/SWFilterExpandAll/index.vue' // 展开组件
import AddProdForm from './components/addProdForm.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import ArticleCover from './components/articleCover.vue'
import { Search } from '@element-plus/icons-vue'
import { useAppStore } from '@/store/modules/app'
import selectPeople from './components/selectPeople.vue'
import { DICT_TYPE, getIntDictOptions, getDictLabel } from '@/utils/dict'
import * as productQualityApi from '@/api/shop/productQuality'
const message = useMessage()
const { t } = useI18n() // 国际化
const isExpand = ref(false) // 是否展开
const appStore = useAppStore()
const addBtnLoading = ref(false)

// 尺码范围的颜色
const getColor = (index) => {
  switch (index) {
    case 0:
      return '#FAE8D066'
    case 1:
      return '#D2EEFB66'
    case 2:
      return '#F9EDC766'
    case 3:
      return '#CDF1ED66'
    default:
      return '' // 默认无背景颜色
  }
}
const designers = ref([]) // 设计师列表
// 查询参数
const queryParams = ref({
  page: 1,
  size: 10,
  productCode: '',
  category: '',
  designer: '',
  enforceStandard: '',
  securityCategory: ''
})

// 搜索
const handleQuery = () => {
  if (designers.value) {
    queryParams.value.designer = designers.value.join(',')
  }

  queryParams.value.page = 1
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
    // queryParams.value.store = queryParams.value.store ? queryParams.value.store : ''
    const data = await productQualityApi.getInspectList(queryParams.value).catch(() => { })
    if (data) {
      list.value = data.records
      total.value = data.total

      // console.log('--', list.value)
    }
  } finally {
    loading.value = false
  }
}

// 重置
const resetQuery = () => {
  queryParams.value = {
    page: 1,
    size: 10,
    productCode: '',
    category: '',
    designer: '',
    enforceStandard: '',
    securityCategory: ''
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
    await productQualityApi.deleteInspect(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
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

const getImageArray = (str) => {
  return str ? str.split(',') : []
}

// 获取设计师列表
const remoteMethod = async (value) => {
  console.log('调取接口')
  return await productQualityApi.getDesignerList(value)
}

onMounted(async () => {
  getList()
})
</script>

<style lang="scss" scoped>
@use './index.scss';

.designerItem {
  background: #cad6f8;
  border-radius: 13px;
  margin: 0 5px 5px 0;
  padding: 2px 8px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:last-child {
    margin: 0 5px 0 0;
  }

  img {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    vertical-align: middle;
  }
}

.sizeRangeItem {
  width: 40px;
  border-radius: 13px;
  padding: 2px 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px 5px 0;

  &:last-child {
    margin: 0 5px 0 0;
  }
}

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
  margin-right: 8px;
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
