<template>
  <div style="
      display: flex;
      padding: 20px;
      background: #fff;
      border-radius: 10px;
      padding-bottom: 0px;
      margin-bottom: 20px;
    ">
    <!-- 条件筛选框 -->
    <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="78px">
      <el-form-item label="店铺" prop="storeName">
        <el-select v-model="queryParams.storeName" filterable placeholder="请选择" style="width: 240px" @change="getList"
          clearable>
          <el-option v-for="item in storeList" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName">
        <el-input class="searchFormItemWidth" v-model.trim="queryParams.goodsName" placeholder="请输入商品" clearable
          @blur="getList" />
      </el-form-item>
      <el-form-item label="上新日期" prop="date">
        <el-date-picker v-model="queryParams.date" value-format="YYYY-MM-DD" type="daterange" placeholder="请选择日期时间"
          class="!w-200px" @change="getList" />
      </el-form-item>
    </el-form>
    <div class="commonTopFilterWrap-search">
      <div class="commonTopFilterWrap-search-container">
        <el-button @click="getList" class="commonSearchBtn">
          <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
          搜索
        </el-button>
        <el-button @click="resetQuery" class="commonResetBtn" style="margin-left: 0px">
          重置
        </el-button>
        <el-button @click="exportFn" class="commonResetBtn" style="margin-left: 10px" :loading="loading">
          导出
        </el-button>
      </div>
    </div>
  </div>
  <CategorySelect :selectCategory="selectCategory" :list="categoryList" @category-select="categorySelect" />
  <div class="mainContainer">
    <div class="content">
      <!-- 列表 -->
      <el-table :data="list" style="width: 100%" :header-cell-style="appStore.headerCellStyle"
        row-class-name="commonTableRow" class="SWCommonTable">
        <el-table-column prop="categoryType" label="类目" width="100" />
        <el-table-column prop="goodsName" width="450" :show-overflow-tooltip="false" label="商品名称" fixed="left">
          <template #default="scope">
            <div class="row-center">
              <el-popover placement="right" :width="348" trigger="hover" :show-arrow="false" :offset="0">
                <template #reference>
                  <div>
                    <div class="goodImg">
                      <img style="width: 42px; height: 42px; border-radius: 4px" :src="scope.row.goodsImg" />
                    </div>
                    <div class="goodName">{{ scope.row.goodsName || scope.row.goods_name }}</div>
                  </div>
                </template>
                <goodCard2 :good="{
                  goodsHref: scope.row.goodsHref,
                  materialName: scope.row.goodsName || scope.row.goods_name,
                  materialId: scope.row.id,
                  goodsImage: scope.row.goodsImg,
                  channel: scope.row.channel || ''
                }" />
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="storeName" label="店铺" width="160">
          <template #default="scope">
            <el-button type="primary" link @click="goStore(scope.row)">{{
              scope.row.storeName
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="价格" />
        <el-table-column prop="" label="上新日期" width="110">
          <template #default="scope">
            {{ scope.row.dataDate }}
          </template>
        </el-table-column>
        <el-table-column prop="goodsCount" label="目前销量" />
        <el-table-column prop="" label="主打卖点" width="480">
          <template #default="scope">
            <el-tooltip v-if="scope.row.sellingPoints.length >= 100" effect="dark" content="" placement="top">
              <template #content>
                <div>{{ scope.row.sellingPoints }}</div>
              </template>
              <div class="maidian">{{ scope.row.sellingPoints }}</div>
            </el-tooltip>
            <div v-else class="maidian">{{ scope.row.sellingPoints }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" link @click="submit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <ContentWrap>
        <Pagination v-if="total > 0" style="margin-right: 25px; margin-top: 0" :total="total"
          v-model:page="queryParams.page" v-model:limit="queryParams.size" @pagination="getList" />
      </ContentWrap>
    </div>
  </div>

  <!-- 抽屉 -->
  <div class="chouTi">
    <el-drawer v-model="isVisible" :with-header="false" size="50%" @close="reset">
      <div class="drawer-wapper">
        <div class="content-wapper">
          <div class="flex-row title-wapper">
            <div class="title">修改</div>
            <img src="@/assets/imgs/system/fieldManageConfig/close.png" alt="" class="close" @click="reset" />
          </div>
        </div>
        <ContentWrap>
          <el-form :model="drawerData" inline ref="sumbitFormRef" label-width="100">
            <el-row :gutter="1">
              <el-col :span="12">
                <el-form-item class="w100%" label="商品名称" prop="goodsName">
                  <el-input v-model="drawerData.goodsName" placeholder="请输入商品名称" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="w100%" label="商品链接" prop="goodsHref">
                  <el-input v-model="drawerData.goodsHref" placeholder="请输入商品链接" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="1">
              <el-col :span="12">
                <el-form-item class="w100%" label="店铺" prop="storeName">
                  <el-select v-model="drawerData.storeName" filterable placeholder="请选择" clearable>
                    <el-option v-for="item in storeList" :key="item" :label="item" :value="item" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item class="w100%" label="店铺链接" prop="storePath">
                  <el-input v-model="drawerData.storePath" placeholder="请输入店铺链接" clearable />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="1">
              <el-col :span="12"><el-form-item class="w100%" label="类目" prop="categoryType">
                  <el-select v-model="drawerData.categoryType" filterable placeholder="请选择" clearable>
                    <el-option label="内衣" value="内衣" />
                    <el-option label="女裤" value="女裤" />
                    <el-option label="袜子" value="袜子" />
                    <el-option label="男裤" value="男裤" />
                    <el-option label="胸贴" value="胸贴" />
                    <el-option label="季节品" value="季节品" />
                  </el-select> </el-form-item></el-col>
              <el-col :span="12"><el-form-item class="w100%" label="价格" prop="goodsPrice">
                  <el-input v-model="drawerData.goodsPrice" placeholder="请输入价格" clearable /> </el-form-item></el-col>
            </el-row>
            <el-row :gutter="1">
              <el-col :span="12"><el-form-item class="w100%" label="上新日期">
                  <el-date-picker v-model="drawerData.dataDate" value-format="YYYY-MM-DD" type="date"
                    placeholder="请选择日期时间" style="flex: 1" /> </el-form-item></el-col>
              <el-col :span="12"><el-form-item class="w100%" label="目前销量" prop="goodsCount">
                  <el-input v-model="drawerData.goodsCount" placeholder="请输入目前销量" clearable /> </el-form-item></el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item class="w100%" label="主打卖点" prop="sellingPoints">
                  <s-text-area v-model="drawerData.sellingPoints" :rows="4" placeholder="请输入主打卖点" />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </ContentWrap>
        <div class="btn-wapper">
          <el-button @click="reset">取消</el-button>
          <el-button type="primary" @click="save">提交</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import STextArea from "@/components/common/input/s-textarea.vue";
import { useAppStore } from '@/store/modules/app'
import * as teamApi from '@/api/team'
import download from '@/utils/download'
import goodCard2 from '../components/goodCard.vue'
import CategorySelect from '../components/categorySelect.vue'
import { cloneDeep } from 'lodash-es'
const appStore = useAppStore()
const message = useMessage() // 消息弹窗
const queryParams = ref({
  storeName: '',
  goodsName: '',
  date: [],
  page: 1,
  size: 10,
  beginTime: '',
  endTime: '',
  categoryType: '女裤'
})

const loading = ref(false)
const total = ref(0)
const isVisible = ref(false)
const storeList = ref([])
const selectCategory = ref('女裤')
const categoryList = ref([
  // { label: '内衣', name: '内衣' },
  { label: '女裤', name: '女裤' },
  { label: '男裤', name: '男裤' },
  { label: '文胸', name: '文胸' },
  { label: '胸贴', name: '胸贴' },
  { label: '袜子', name: '袜子' },
  { label: '吊带背心', name: '吊带背心' },
  { label: '季节品', name: '季节品' }
])
const list = ref([])
const drawerData = ref({
  goodsName: '',
  goodsHref: '',
  storeName: '',
  storePath: '',
  categoryType: '',
  goodsPrice: '',
  goodsCount: '',
  sellingPoints: '',
  dataDate: '',
  goodsImg: ''
})
const getStoreList = () => {
  teamApi.storeList().then((res) => {
    storeList.value = res
  })
}
const getList = () => {
  if (queryParams.value.date) {
    queryParams.value.beginTime = queryParams.value.date[0]
    queryParams.value.endTime = queryParams.value.date[1]
  }
  teamApi.opCompetitorCampaign(queryParams.value).then((res) => {
    list.value = res.records
    total.value = res.total
  })
}

const queryFormRef = ref()
/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  getList()
}
const sumbitFormRef = ref()
const reset = () => {
  // 抽屉数据清空
  drawerData.value = {
    goodsName: '',
    goodsHref: '',
    storeName: '',
    storePath: '',
    categoryType: '',
    goodsPrice: '',
    goodsCount: '',
    sellingPoints: '',
    dataDate: '',
    goodsImg: ''
  }
  sumbitFormRef.value.resetFields()
  isVisible.value = false
}
// 导出
const exportFn = () => {
  if (total.value === 0) {
    message.warning('当前条件下无数据')
    return
  }
  if (queryParams.value.date) {
    queryParams.value.beginTime = queryParams.value.date[0]
    queryParams.value.endTime = queryParams.value.date[1]
  }
  loading.value = true
  teamApi.opCompetitorExport(queryParams.value).then((res) => {
    console.log(res)
    const fileName = queryParams.value.date
      ? `${queryParams.value.date}竞店新品统计.xlsx`
      : '竞店新品统计.xlsx'
    if (res) {
      download.excel(res, fileName)
      message.success('导出成功')
      loading.value = false
    }
  })
}

// 修改
const submit = (row) => {
  drawerData.value = cloneDeep(row)
  isVisible.value = true
}
// 修改提交
const save = () => {
  teamApi.opCompetitorCampaignPost(drawerData.value).then((res) => {
    console.log(res)
    message.success('修改成功')
    isVisible.value = false
    getList()
  })
}

//  超链接跳转
const goStore = (row) => {
  window.open(row.storePath, '_blank')
}
// 分类选择
const categorySelect = (value) => {
  selectCategory.value = value || ''
  queryParams.value.categoryType = value || ''
  getList()
}

onMounted(() => {
  getStoreList()
  getList()
})
</script>
<style lang="scss" scoped>
.mainContainer {
  background: #fff;

  .content {
    padding: 14px 12px;
  }
}

.tabBox {
  margin-top: 20px;
  margin-bottom: 20px;
}

:deep(.el-drawer__body) {
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}

.drawer-wapper {
  min-width: 700px;
  background: #f6f6f6;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  min-height: 100%;
  background: linear-gradient(102deg, #ecf0f9 0%, #effdfd 100%);
  padding-right: 20px;
}

.title-wapper {
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;

  .close {
    width: 23px;
    height: 23px;
    cursor: pointer;
  }

  .title {
    font-size: 14px;
    color: #333333;
    font-weight: 500;
  }
}

.form-wapper {
  margin-top: 18px;
}

.config-item-wapper {
  .config-item {
    align-items: center;
    background: white;
    display: flex;
    flex-direction: row;
    width: 300px;
    padding: 8px;
    box-sizing: border-box;
    margin-bottom: 12px;
  }

  .select-more {
    width: 12px;
    height: 13px;
    margin-right: 16px;
  }

  .select-del {
    color: red;
    margin-left: 16px;
    display: inline;
    cursor: pointer;
  }

  .add-select {
    cursor: pointer;
    width: 300px;
    height: 36px;
    border-radius: 4px;
    border: 1px dashed #0064ff;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    justify-items: center;

    .add-btn {
      width: 12px;
      height: 12px;
      margin-right: 14px;
    }

    .add-text {
      font-weight: 400;
      font-size: 14px;
      color: #0064ff;
    }
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.goodsNameBox {
  display: flex;

  .goodsNameBox-left {
    width: 50px;
    height: 50px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .goodsNameBox-right {
    margin-top: 20px;
    /* 强制文本不换行 */
    white-space: nowrap;
    /* 超出容器宽度的部分隐藏 */
    overflow: hidden;
    /* 当文本溢出时，显示省略号 */
    text-overflow: ellipsis;
    color: #409eff;
  }
}

.tooltipBox {
  width: 200px;
  height: 240px;
  background-color: #fff;
  margin: -20px;
  padding: 10px;
  border-radius: 10px;

  .text {
    color: #409eff;
    /* 限制文本显示为两行 */
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* 标准属性，目前处于实验阶段，支持 Firefox 等浏览器 */
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }

  .pic {
    width: 200px;
    height: 200px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
}

.goodImg {
  width: 42px;
  height: 42px;
  border-radius: 2px;
  margin-right: 8px;
}

.goodName {
  flex: 1;
  font-size: 14px;
  color: #0064ff;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: break-all;
}

.personalStyle {
  color: #0064ff;
  cursor: pointer;
  font-weight: 500;
  text-decoration: underline;
}

.maidian {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-tooltip__trigger) {
  display: flex;
  align-items: center;
  width: 100%;
}
</style>
