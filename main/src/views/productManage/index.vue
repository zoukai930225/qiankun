<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <el-form ref="queryFormRef" :model="queryParams" class="-mb-15px">
      <el-form-item label="" prop="shopName">
        <div class="title-select">
          <img src="@/assets/imgs/productMng/pro_title_icon.png" alt="" />
          <span class="title-text">货品管理</span>
          <span style="color: #2f8df5">旺店通旗舰店</span>
        </div>
      </el-form-item>
      <!-- 搜索条件 -->
      <div style="display: flex; justify-content: space-between; align-items: center">
        <div class="container" style="display: flex; align-items: center; min-width: 600px">
          <!-- 搜索货品 -->
          <el-form-item label="">
            <el-select v-model="inputValue" filterable placeholder="搜索货品" size="large" style="width: 240px" clearable
              @clear="handleProdClear" @change="handleSelectProd" :filter-method="handleProdChange">
              <template #prefix>
                <div>
                  <img src="@/assets/imgs/productMng/search.png" alt="" />
                </div>
              </template>
              <template #empty>
                <div> 请输入搜索条件 </div>
              </template>

              <el-option v-for="item in computedOptions" :key="item.value" :label="item.label" :value="item.value">
                <span v-html="highlightVal(item.label, inputValue)"></span>
              </el-option>
            </el-select>
            <!-- 多行编码搜索 -->
            <el-popover placement="bottom" trigger="hover" :show-arrow="false" :width="320">
              <template #reference>
                <div class="title-btn"><img src="@/assets/imgs/productMng/title_icon_input.png" alt="" />
                </div>
              </template>
              <template #default>
                <div class="textarea-wrap">
                  <s-text-area v-model="queryParams.textarea" style="width: 100%; border: none" :rows="5"
                    placeholder="多个货品编码换行输入(不超过100个)" />
                  <div class="textarea-btn">
                    <el-button @click="handleMultCodeQuery" class="commonSearchBtn">
                      <Icon class="commonSearchBtnIcon" :size="12" icon="ep:search" />
                      搜索
                    </el-button>
                    <!-- <el-button
                      type="primary"
                      @click="handleMultCodeQuery"
                      style="background-color: #496cd4"
                      >搜索</el-button
                    > -->
                    <el-button @click="clearValue">清空</el-button>
                  </div>
                </div>
              </template>
            </el-popover>
            <!-- <div class="title-btn" @click="openTextarea"
              ><img src="@/assets/imgs/productMng/title_icon_input.png" alt="" />
            </div> -->
          </el-form-item>

          <!-- 选择渠道 -->
          <el-form-item label="" prop="">
            <el-cascader v-model="channel" filterable clearable placeholder="请选择渠道" :options="treeData" />
            <div class="title-btn" style="width: 32px" @click="warningMessage"><img
                src="@/assets/imgs/productMng/title_icon_plus.png" alt="" /></div>
          </el-form-item>
        </div>
        <!-- 右边操作按钮 -->
        <div class="title-operation">
          <div :class="{ active: active === 1 }" @click="openSetPersonInChargeForm('multiSet')"><img
              src="@/assets/imgs/productMng/title_icon1.png" alt="" />设置负责人</div>
          <div :class="{ active: active === 2 }" @click="warningMessage"><img
              src="@/assets/imgs/productMng/title_icon2.png" alt="" />设为无效货品</div>
          <div :class="{ active: active === 3 }" @click="warningMessage"><img
              src="@/assets/imgs/productMng/title_icon3.png" alt="" />设置代发货品</div>
          <div :class="{ active: active === 4 }" @click="handleExportWdtGoods(4)"><img
              src="@/assets/imgs/productMng/title_icon5.png" alt="" />导出</div>
          <div :class="{ active: active === 5 }" @click="warningMessage"><img
              src="@/assets/imgs/productMng/title_icon4.png" alt="" />导入</div>

          <div :class="{ active: active === 6 }" @click="warningMessage"><img
              src="@/assets/imgs/productMng/title_icon6.png" alt="" />导入历史记录</div>
        </div>
      </div>
    </el-form>
  </ContentWrap>

  <div> </div>

  <ContentWrap>
    <el-table :data="list" ref="tableRef" :header-cell-style="{
      background: '#F2F6FC',
      color: '#333333',
      border: 'none',
      fontFamily: 'PingFangSC, PingFang SC'
    }" :row-style="tableRowStyle" :row-class-name="row_class_name" :table-layout="tableLayout" v-loading="loading"
      :show-overflow-tooltip="true" @selection-change="handleSelectionChange" class="SWCommonTable"
      v-horizontal-scroll="'always'">
      <el-table-column type="selection" width="55" />
      <el-table-column label="货品名称" prop="wdtGoodsName" :show-overflow-tooltip="false"
        :formatter="createFormatter('wdtGoodsName')" fixed min-width="200">
        <template #default="scope">
          <span style="color: #2f8df5">
            <img src="@/assets/imgs/productMng/proname.png" alt="" class="table_icon" />
            {{ scope.row.wdtGoodsName }}
          </span>
        </template>
      </el-table-column>

      <el-table-column fixed label="货品编码" prop="wdtGoodsNo" :show-overflow-tooltip="false" min-width="120">
        <template #default="scope">
          <span @click="handleCopy(scope.row.wdtGoodsNo)" style="cursor: pointer">
            {{ scope.row.wdtGoodsNo ? scope.row.wdtGoodsNo : '--' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="所属商品" prop="goodsName" min-width="240">
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
      <el-table-column label="所属商品ID" prop="goodsId" min-width="200" :show-overflow-tooltip="false">
        <template #default="scope">
          <div style="cursor: pointer">
            <span @click="handleCopy(scope.row.goodsId)">{{ scope.row.goodsId || '--' }}</span>
            <img src="@/assets/imgs/productMng/proId.png" alt="" class="ml-1" style="width: 12px"
              @click="openForm(scope.row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="SKU名称" prop="skuName" min-width="140">
        <template #default="scope">
          <img src="@/assets/imgs/productMng/skuname.png" alt="" class="table_icon" />
          {{ scope.row.skuName ? scope.row.skuName : '--' }}
        </template>
      </el-table-column>
      <el-table-column label="SKU ID" prop="skuId" min-width="180" :show-overflow-tooltip="false">
        <template #default="scope">
          <div style="cursor: pointer">
            <span @click="handleCopy(scope.row.skuId)">{{
              scope.row.skuId ? scope.row.skuId : '--'
            }}</span>
            <img src="@/assets/imgs/productMng/skuId.png" alt="" style="width: 12px; margin-left: 4px"
              @click="openSKUIDForm(scope.row)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属店铺" prop="shopName" min-width="180">
        <template #default="scope">
          <img :src="getImageUrl(scope.row.platformId)" v-if="scope.row.platformId" alt="" />

          {{ scope.row.shopName ? scope.row.shopName : '--' }}
        </template>
      </el-table-column>

      <el-table-column label="成本价" prop="costs" :formatter="createFormatter('costs')" />
      <el-table-column label="核算成本价" prop="calculateCosts" :formatter="createFormatter('calculateCosts')" />
      <el-table-column label="成本生效时间" prop="costEffectTime" :formatter="createFormatter('costEffectTime')" />
      <el-table-column label="组合装数量" prop="suiteNum" :formatter="createFormatter('suiteNum')" />
      <el-table-column label="附加成本价" prop="addCosts" :formatter="createFormatter('addCosts')" />
      <el-table-column label="货品重量(kg)" prop="goodsWeight" :formatter="createFormatter('goodsWeight')" />
      <el-table-column label="核算货品重量(kg)" prop="calculateGoodsWeight"
        :formatter="createFormatter('calculateGoodsWeight')" />
      <el-table-column prop="goodsVolume" :formatter="createFormatter('goodsVolume')">
        <template #header>
          <span>货品体积(m<sup>3</sup>)</span>
        </template>
      </el-table-column>
      <el-table-column prop="calculateGoodsVolume" :formatter="createFormatter('calculateGoodsVolume')">
        <template #header>
          <span>核算货品体积(m<sup>3</sup>)</span>
        </template>
      </el-table-column>
      <el-table-column label="货品长宽高(cm)" prop="goodsDimensions" :formatter="createFormatter('goodsDimensions')" />
      <el-table-column label="核算货品长宽高(cm)" prop="calculateGoodsDimensions"
        :formatter="createFormatter('calculateGoodsDimensions')" align="center" /><el-table-column label="更新时间"
        prop="modified" :formatter="createFormatter('modified')" min-width="120" />
      <el-table-column label="货品负责人" prop="wdtGoodsCurator" :formatter="createFormatterArray('wdtGoodsCurator')"
        min-width="120" />
      <el-table-column fixed="right" label="操作" min-width="120">
        <template #default="scope">
          <div class="row-center" style="margin-left: -20px">
            <el-button type="primary" icon="el-icon-my-message" link @click="openViewDrawerForm(scope.row)">
              <!-- <img src="@/assets/imgs/productMng/look.png" alt="" style="margin-right: 2px" /> -->
              查看
            </el-button>
            <el-button type="primary" link @click="openSetPersonInChargeForm('singleSet', scope.row)">
              <!-- <img src="@/assets/imgs/productMng/setting.png" alt="" style="margin-right: 2px" /> -->
              设置
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <Pagination :total="total" v-model:page="queryParams.page" v-model:limit="queryParams.size" @pagination="getList" />
  </ContentWrap>

  <!-- 所属商品ID弹窗 -->
  <DataProdForm ref="formRef" @success="getList" />
  <!-- SKUID弹窗 -->
  <DataSKUIDForm ref="dataSkuIdFormRef" @success="getList" />
  <!-- 设置负责人 -->
  <SetPersonInCharge ref="setPersonInChargeRef" @success="getList" />
  <!-- 查看 -->
  <ViewDrawer ref="viewDrawerRef" @success="getList" />
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import DataProdForm from './components/DataProdForm.vue'
import DataSKUIDForm from './components/DataSKUIDForm.vue'
import SetPersonInCharge from './components/SetPersonInCharge.vue'
import ViewDrawer from './components/ViewDrawer.vue'
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict'
// import RelatedConfigList from './components/relatedConfigList.vue'
import { copyText } from '@/utils/copyText'
import download from '@/utils/download'
import { useAppStore } from '@/store/modules/app'
import { ElMessage } from 'element-plus'
import * as productApi from '@/api/productManage'
import type { TableInstance } from 'element-plus'
import { getUrlByTypeAndId, getImageUrl } from '@/utils/index'
import { ElNotification } from 'element-plus'
const tableLayout = ref<TableInstance['tableLayout']>('fixed')
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const active = ref(1)

/** 搜索按钮操作 */
const queryFormRef = ref() // 搜索的表单
const queryParams = ref({
  page: 1,
  size: 10,
  goodsQueryInfo: undefined,
  textarea: undefined, //输入多个货品编码

  wdtGoodsName: undefined, //货品名称
  wdtGoodsNo: undefined, //货品编码
  goodsId: undefined, //商品id
  skuId: undefined, //skuID
  skuName: undefined, //sku名称

  shopName: undefined, //店铺名称
  platformId: undefined, //平台id
  storeCode: undefined //店铺编码
})
// 查询
const handleQuery = () => {
  queryParams.value.page = 1
  // console.log('queryParams', queryParams.value);
  getList()
}
// 重置
const resetQuery = () => {
  inputValue.value = ''
  // 清空货品搜索选项
  computedOptions.value = []
  queryParams.value = {
    page: 1,
    size: 10,
    goodsQueryInfo: undefined,
    textarea: undefined, //输入多个货品编码

    wdtGoodsName: undefined, //货品名称
    wdtGoodsNo: undefined, //货品编码
    goodsId: undefined, //商品id
    skuId: undefined, //skuID
    skuName: undefined, //sku名称

    shopName: undefined, //店铺名称
    platformId: undefined, //平台id
    storeCode: undefined //店铺编码
  }
  queryFormRef.value.resetFields()
  handleQuery()
}

// 搜索货品输入框绑定的值
const inputValue = ref('')
// 列表里展示的数据
const computedOptions = ref<any[]>([])
const prodOptions = ref([
  { value: 'wdtGoodsName', label: '货品名称' },
  { value: 'wdtGoodsNo', label: '货品编码' },
  { value: 'goodsId', label: '商品ID' },
  { value: 'skuId', label: 'SKUID' },
  { value: 'skuName', label: 'SKU名称' }
])
// 根据输入的值改变列表展示内容
const handleProdChange = (val) => {
  if (val) {
    computedOptions.value = prodOptions.value.map((option) => ({
      label: `${option.label}包含 ${val} 的记录`,
      value: `${option.value},${val}`
    }))
    inputValue.value = val.trim()
  }
}

// 选择事件
const handleSelectProd = (val) => {
  // 根据选择的值，改变搜索条件
  queryParams.value.wdtGoodsName = undefined
  queryParams.value.wdtGoodsNo = undefined
  queryParams.value.goodsId = undefined
  queryParams.value.skuId = undefined
  queryParams.value.skuName = undefined

  // 将从选项中获取到的`${option.value}/${val}`拆分，第一个是搜索条件，第二个是搜索的值
  const [optionValue, inputValue] = val.split(',')
  // 给搜索条件赋值
  queryParams.value[optionValue] = inputValue.trim()
  // 搜索
  // console.log('val', val);
  handleQuery()
}
// 将输入值高亮
const highlightVal = (label, val) => {
  if (!val) return label
  return label.replace(val, `<span style="color: #2F8DF5;">${val}</span>`)
}

// 清空货品搜索
const handleProdClear = () => {
  queryParams.value.wdtGoodsName = undefined
  queryParams.value.wdtGoodsNo = undefined
  queryParams.value.goodsId = undefined
  queryParams.value.skuId = undefined
  queryParams.value.skuName = undefined
  inputValue.value = ''
  computedOptions.value = []
  handleQuery()
}

// 多行编码搜索
const handleMultCodeQuery = () => {
  inputValue.value = ''
  queryParams.value.wdtGoodsName = undefined
  queryParams.value.wdtGoodsNo = undefined
  queryParams.value.goodsId = undefined
  queryParams.value.skuId = undefined
  queryParams.value.skuName = undefined
  computedOptions.value = []
  handleQuery()
  // 搜索完把输入框置空
  // queryParams.value.textarea = undefined
}

// 清空多行编码输入框
const clearValue = () => {
  queryParams.value.textarea = undefined
  handleQuery()
}

// 查询渠道
const channel = ref('')
const ChannelLoading = ref(false)
const treeData = ref([])
const getQueryChannels = async () => {
  ChannelLoading.value = true
  try {
    const listData = await productApi.getQueryChannels().catch(() => { })
    treeData.value = transformData(listData, getIntDictOptions(DICT_TYPE.PRODUCT_PARAM_PLATFORM))
  } finally {
    ChannelLoading.value = false
  }
}

// 处理渠道数据为树形结构
const transformData = (listData, dictionaryData) => {
  let tree = [] as any

  dictionaryData.forEach((dict) => {
    let children = listData
      .filter((item) => item.platformId === dict.value)
      .map((item) => ({
        value: item.storeCode,
        label: item.shopName
      }))

    if (children.length > 0) {
      tree.push({
        value: dict.value,
        label: dict.label,
        children: children
      })
    }
  })

  return tree
}

// 监听渠道选择的变化
watch(channel, (val) => {
  if (val && val.length > 0) {
    queryParams.value.platformId = val[0] as any
    // queryParams.value.shopName = val[1] as any
    queryParams.value.storeCode = val[1] as any
    getList()
  } else {
    // 清空选择
    queryParams.value.platformId = undefined
    // queryParams.value.shopName = undefined
    queryParams.value.storeCode = undefined
    getList()
  }
  console.log('watch', val)
})

// 修改表格斑马纹
const tableRowStyle = (row) => {
  return row.rowIndex % 2 === 0 ? { background: '#fff' } : { background: 'rgba(242, 246, 252,1)' }
}
const tableRef = ref(null)
const selectedRow = ref<any[]>([])

// 给当前选中行加边框
const row_class_name = ({ row, rowIndex }) => {
  let className = ''
  if (selectedRow.value !== null) {
    selectedRow.value.some((item) => {
      if (item.id === row.id) {
        if (rowIndex === list.value.length - 1) {
          className = 'last-row-selected'
        } else {
          className = 'selected'
        }
        return true
      }
    })
  }
  return className
}

/** 分页 */
const total = ref(10) // 列表的总页数
const list = ref<any[]>([])
const loading = ref(false) // 列表的加载中
/** 查询字典类型列表 */
const getList = async () => {
  loading.value = true
  try {
    // console.log('queryParams.value.textarea', queryParams.value.textarea)
    // 如果通过多行编码查询
    if (queryParams.value.textarea) {
      let resultArray = queryParams.value.textarea.split('\n')
      let queryData = {
        shopName: queryParams.value.shopName,
        platformId: queryParams.value.platformId,
        data: resultArray
      }
      const data = await productApi.getWdtGoodsByWdtGoodsNo(queryData).catch(() => { })
      list.value = data.records || []
      total.value = data.total
    } else {
      const data = await productApi.getWdtGoodsList(queryParams.value).catch(() => { })
      list.value = data.records || []
      total.value = data.total
    }
  } finally {
    loading.value = false
  }
}

/** 通用格式化函数，用于检查属性是否为空字符串，如果为空则显示 '--' */
const createFormatter = (propName) => (row) => {
  return row[propName] === null || row[propName] === '' ? '--' : row[propName]
}

// 处理列表的负责人数据
const createFormatterArray = (prop) => {
  return (row) => {
    if (Array.isArray(row[prop])) {
      return row[prop].length > 0 ? row[prop].join(',') : '--' // 如果数组不为空，连接成字符串，否则返回 '--'
    }
    return row[prop]
  }
}

/** 打开SKUID弹窗 */
const dataSkuIdFormRef = ref()
const openSKUIDForm = (row) => {
  if (dataSkuIdFormRef.value) {
    // console.log(row);
    dataSkuIdFormRef.value.open(row.wdtGoodsName, row.wdtGoodsNo)
  }
}

/** 打开商品ID弹窗 */
const formRef = ref()
const openForm = (row) => {
  if (formRef.value) {
    formRef.value.open(row.wdtGoodsName, row.wdtGoodsNo)
  }
}

/** 查看-ERP价格变动 */
const viewDrawerRef = ref()
const openViewDrawerForm = (row) => {
  if (viewDrawerRef.value) {
    viewDrawerRef.value.open(row)
  }
}

// 打开设置负责人弹窗
const setPersonInChargeRef = ref()
const openSetPersonInChargeForm = (type: string, row?: any) => {
  console.log('row', row)
  if (setPersonInChargeRef.value) {
    if (type === 'multiSet') {
      if (selectedRow.value.length === 0) {
        ElMessage({
          message: '请选择要添加负责人的商品',
          type: 'warning'
        })
        return
      }
      setPersonInChargeRef.value.open('multiSet', selectedRow.value)
    } else {
      // console.log(row)
      let data = {
        wdtGoodsId: row.id,
        wdtGoodsNo: row.wdtGoodsNo,
        wdtGoodsCurator: row.wdtGoodsCurator,
        replenishmentCycle: row.replenishmentCycle
      }
      setPersonInChargeRef.value.open('singleSet', data)
    }
  }
}

// 功能开发提示
const warningMessage = () => {
  ElMessage({
    message: '功能开发中',
    type: 'warning'
  })
}

/**
 * 多选
 */

// 选择
const handleSelectionChange = (val) => {
  selectedRow.value = val
  console.log('selectedRow', selectedRow.value)
}

// 复制文本到剪贴板的函数
const handleCopy = async (text) => {
  await copyText(text)
}

// 导出

const exporting = ref(false)
const handleExportWdtGoods = async (index) => {
  try {
    exporting.value = true
    const data = await productApi.exportWdtGoods(queryParams.value)
    console.log(data)
    if (data) {
      download.excel(data, '货品管理导出.xls')
      ElNotification({
        title: '导出成功',
        customClass: 'productManage_notifyStyle_success',
        type: 'success'
      })
    } else {
      ElNotification({
        title: '导出失败',
        customClass: 'productManage_notifyStyle_error',
        type: 'error'
      })
    }
  } catch (error) {
    ElNotification({
      title: '导出失败',
      customClass: 'productManage_notifyStyle_error',
      type: 'error'
    })
  } finally {
    exporting.value = false
  }
}

/** 初始化 */
onMounted(() => {
  // 查询列表数据
  getList()
  // 获取查询渠道
  getQueryChannels()
})
</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
<style lang="scss">
.productManage_notifyStyle_success {
  background-color: #e5f9f3;
  font-size: 14px;
}

.productManage_notifyStyle_error {
  background-color: #fef0f0;
  font-size: 14px;
}
</style>
