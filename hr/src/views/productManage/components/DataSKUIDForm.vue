<template>
  <div class="wrap">
    <el-dialog class="commomDialig" v-model="dialogVisible" :destroy-on-close="true" style="
        width: 50%;
        background: linear-gradient(226deg, #f2f3ff 0%, #ffffff 50%, #f0f8ff 100%);
        min-width: 500px;
        padding: 0 10px;
      " :align-center="true">
      <template #header>
        <div class="my-header">
          <span class="header-name">货品名称:</span>
          <img src="@/assets/imgs/productMng/proname.png" alt="" />
          <span class="header-code"> {{ queryParams.wdtGoodsName }} </span>

          <span class="header-code"> 货品编号: {{ queryParams.wdtGoodsNo }}</span>
        </div>
      </template>
      <el-table :data="list" style="width: 100%" v-loading="loading" key="table1" :show-overflow-tooltip="true"
        :header-cell-style="{
          background: '#E6F0FF',
          color: '#333333',
          border: 'none',
          fontFamily: 'PingFangSC, PingFang SC'
        }" class="SWCommonTable" v-horizontal-scroll="'always'">
        <el-table-column label="SKU名称" prop="skuName" min-width="140" />
        <el-table-column label="SKU ID" prop="skuId" />
        <el-table-column label="所属商品" prop="goodsName " min-width="140">
          <template #default="scope">
            <el-popover v-if="scope.row.picUrl" placement="top" trigger="hover" :show-arrow="false" :width="228">
              <template #reference>
                <span @click="getUrlByTypeAndId(scope.row.platformId, scope.row.goodsId)"
                  style="color: #2f8df5; cursor: pointer">
                  <img style="width: 28px; height: 28px; border-radius: 4px" :src="scope.row.picUrl" />
                  {{ scope.row.goodsName }}
                </span>
              </template>
              <template #default>
                <div style="width: 100%">
                  <img style="width: 200px; height: 200px; border-radius: 4px; cursor: pointer" :src="scope.row.picUrl"
                    @click="getUrlByTypeAndId(scope.row.platformId, scope.row.goodsId)" />
                </div>
              </template>
            </el-popover>
            <div v-else @click="getUrlByTypeAndId(scope.row.platformId, scope.row.goodsId)"
              style="color: #2f8df5; cursor: pointer">
              <img src="@/assets/imgs/productMng/goods.png" alt="" class="mr-1" />
              {{ scope.row.goodsName || '--' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="所属店铺" prop="shopName" min-width="120">
          <template #default="scope">
            <img :src="getImageUrl(scope.row.platformId)" v-if="scope.row.platformId" alt="" />
            <span>{{ scope.row.shopName || '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="所属商品ID" prop="goodsId">
          <template #default="scope">
            <span>{{ scope.row.goodsId || '--' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
// import UnRelatedProgramList from './unRelatedProgramList.vue'
import { Search } from '@element-plus/icons-vue'
import * as productApi from '@/api/productManage'
import { getUrlByTypeAndId, getImageUrl } from '@/utils/index'
import { ElMessageBox } from 'element-plus'
const message = useMessage() // 消息弹窗
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
defineOptions({ name: 'RelatedProgramList' })

const list = ref<any[]>([])
const loading = ref(false) // 列表的加载中

/** 打开弹窗 */
const open = async (wdtGoodsName, wdtGoodsNo) => {
  dialogVisible.value = true
  // queryParams.value.wdtGoodsNo = wdtGoodsNo

  if (wdtGoodsNo) {
    formLoading.value = true
    try {
      queryParams.value.wdtGoodsName = wdtGoodsName
      queryParams.value.wdtGoodsNo = wdtGoodsNo
      // queryParams.value.wdtGoodsName ='secretworld80支莫代尔男士内裤平角裤衩透气舒适纯色无痕简约潮'
      getList()
    } finally {
      formLoading.value = false
    }
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 分页 */
const total = ref(10) // 列表的总页数
/** 查询字典类型列表 */
const getList = async () => {
  // console.log('查询参数', queryParams.value)
  loading.value = true
  try {
    const data = await productApi.getQuerySameGoods(queryParams.value).catch(() => {
      loading.value = false
    })
    list.value = data.records || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 通用格式化函数，用于检查属性是否为空字符串，如果为空则显示 '暂无' */
const createFormatter = (propName) => (row) => {
  return row[propName] === null || row[propName] === '' ? '--' : row[propName]
}

const formatNotes = createFormatter('notes') //备注

/** 搜索按钮操作 */
const queryFormRef = ref() // 搜索的表单
const queryParams = ref({
  wdtGoodsName: undefined,
  wdtGoodsNo: undefined,
  page: 1,
  size: 10
})

const closeDialog = () => { }
</script>
<style lang="scss" scoped>
.wrap {
  :deep(.el-dialog__body) {
    padding: 0 20px;
  }
}

img {
  vertical-align: middle;
  margin: 0 4px 0 0;
}

a {
  color: #2f8df5;
  text-decoration: none;
}

.my-header {
  img {
    vertical-align: middle;
    margin: 0 11px;
  }

  .header-name {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 600;
    font-size: 16px;
    color: #333333;
    line-height: 22px;
    text-align: left;
    font-style: normal;
  }

  .header-code {
    font-family:
      PingFangSC,
      PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    text-align: left;
    font-style: normal;
  }
}
</style>
