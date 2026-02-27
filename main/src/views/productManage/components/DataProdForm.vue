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
          <span class="header-name">货品名称：</span>
          <img src="@/assets/imgs/productMng/proname.png" alt="" />
          <span class="header-code">{{ queryParams.wdtGoodsName }}</span>
          <span class="header-code"> 货品编号：{{ queryParams.wdtGoodsNo }}</span>
        </div>
      </template>
      <el-table :data="list" style="width: 100%" v-loading="loading" key="table1" :show-overflow-tooltip="true"
        :header-cell-style="{
          background: '#E6F0FF',
          color: '#333333',
          border: 'none',
          fontFamily: 'PingFangSC, PingFang SC'
        }" class="SWCommonTable" v-horizontal-scroll="'always'">
        <el-table-column label="所属商品" prop="goodsName" min-width="200">
          <template #default="scope">
            <el-popover v-if="scope.row.picUrl" placement="top" trigger="hover" :show-arrow="false" :width="228">
              <template #reference>
                <span @click="getUrlByTypeAndId(scope.row.platformId, scope.row.goodsId)"
                  style="color: #2f8df5; cursor: pointer">
                  <img style="width: 28px; height: 28px; border-radius: 4px" :src="scope.row.picUrl" />{{
                    scope.row.goodsName }}
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

        <el-table-column label="当前负责人" prop="wdtGoodsCurator" :formatter="createFormatterArray('wdtGoodsCurator')"
          :show-overflow-tooltip="false" min-width="50" />
      </el-table>
      <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size"
        @pagination="getList" />
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
// import UnRelatedProgramList from './unRelatedProgramList.vue'
import { Search } from '@element-plus/icons-vue'
import { getUrlByTypeAndId, getImageUrl } from '@/utils/index'
import * as productApi from '@/api/productManage'
const message = useMessage() // 消息弹窗
import { ElMessageBox } from 'element-plus'
const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
defineOptions({ name: 'RelatedProgramList' })

const list = ref<any[]>([])
const loading = ref(false) // 列表的加载中

/** 打开弹窗 */
const open = async (wdtGoodsName: string, wdtGoodsNo?: string) => {
  dialogVisible.value = true
  dialogTitle.value = wdtGoodsName
  if (wdtGoodsNo) {
    formLoading.value = true
    try {
      queryParams.value.wdtGoodsNo = wdtGoodsNo
      queryParams.value.wdtGoodsName = wdtGoodsName
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
    const data = await productApi.getQueryGoodsIdDetailed(queryParams.value).catch(() => {
      loading.value = false
    })
    list.value = data.records || []
    total.value = data.total
  } finally {
    loading.value = false
  }
}

// 处理列表的负责人数据
const createFormatterArray = (prop) => {
  return (row) => {
    if (row[prop] === null) {
      return '--' // 如果属性为null，返回'--'
    }
    if (Array.isArray(row[prop])) {
      return row[prop].length > 0 ? row[prop].join(',') : '--' // 如果数组不为空，连接成字符串，否则返回'--'
    }
    return row[prop]
  }
}

/** 搜索按钮操作 */
const queryFormRef = ref() // 搜索的表单
const queryParams = ref({
  wdtGoodsNo: '',
  wdtGoodsName: '',
  page: 1,
  size: 10
})

// 在关闭对话框的时候让父组件刷新列表
const closeDialog = () => { }

/** 初始化 */
// onMounted(() => {
//   getList()
// })
</script>
<style lang="scss" scoped>
img {
  vertical-align: middle;
  margin: 0 4px 0 0;
}

.wrap {
  :deep(.el-dialog__body) {
    padding: 0 20px;
  }
}

a {
  color: #2f8df5;
  text-decoration: none;
}

.my-header {
  img {
    vertical-align: middle;
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
