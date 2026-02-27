<template>
  <div class="detail-content">
    <div class="card flex">
      <el-image :src="getUrl(dataValue.productPicture) || empty" class="img" fit="contain"
        :preview-src-list="[dataValue.productPicture]" preview-teleported />
      <div class="info-content">
        <div class="name">{{ dataValue.productName || '-' }}</div>
        <div class="flex">
          <div class="code">货品编码：{{ dataValue.productCode }}</div>
          <div class="type">类目：{{ dataValue?.completeCategoryName || '' }}</div>
        </div>
        <div class="flex box-content">
          <box title="近30天销售额" :value="xse" type="amount"></box>
          <box title="近30天退款率" :value="[null, undefined, NaN, Infinity].includes(tkl) ? 0 : tkl" type="percent" style="color: #eb3737"></box>
          <box title="近30天差评率" :value="[null, undefined, NaN, Infinity].includes(cpl) ? 0 : cpl" type="percent" style="color: #eb3737"></box>
          <box title="近30天销量" :value="xsjs" type="integer"></box>
          <box title="近30天销售单数" :value="xsds" type="integer"></box>
        </div>
      </div>
    </div>

    <div class="card">
      <div style="font-size: 16px; font-weight: 500; color: #333333">基础规格属性</div>
      <desc-table title="核心属性" :list="mainList" :data="dataValue"></desc-table>
      <desc-table title="面料与工艺" :list="mlList" :data="dataValue"></desc-table>
      <desc-table title="SKU规格" :list="skuList" :data="dataValue"></desc-table>
    </div>

    <div class="flex">
      <div class="card" style="width: 1000px; margin-right: 20px">
        <div style="font-size: 16px; font-weight: 500; color: #333333">数字资产库</div>
        <div style="position: relative">
          <el-tabs v-model="activeKey" @tab-change="changeTab">
            <el-tab-pane v-for="item in tabs" :label="`${item.name}(${item.count})`" :name="item.key"></el-tab-pane>
          </el-tabs>
          <div style="position: absolute; right: 0; top: 2px">
            <el-button type="primary" v-if="activeKey === '2'" @click="openUploadDialog">共享素材上传</el-button>
          </div>
          <images-list :list="imageList" v-loading="imageLoading"></images-list>
        </div>
      </div>
      <div class="card" style="flex: 1">
        <div style="font-size: 16px; font-weight: 500; color: #333333">专业资料文档</div>
        <files-list :list="fileList"></files-list>
      </div>
    </div>

    <div class="flex">
      <div class="card" style="width: 1000px; margin-right: 20px">
        <div style="font-size: 16px; font-weight: 500; color: #333333">实时全渠道库存</div>
        <div class="inv-content">
          <div class="inv-box flex">
            <inv-box title="在库" :value="goodsStock" color="#349b34" bg="rgba(52, 155, 52, 0.1)"></inv-box>
            <inv-box title="在途" :value="inTransitNum" color=" #0064ff" bg="rgba(0, 100, 255, 0.1)"></inv-box>
            <inv-box title="在厂" :value="inFactoryNum" color="#db6a0f" bg="#fff7ec"></inv-box>
          </div>
          <!-- SKU库存分布 -->
          <inv-top :list="invTopList"></inv-top>
        </div>
      </div>
      <div class="card" style="flex: 1">
        <div style="font-size: 16px; font-weight: 500; color: #333333">供应商信息</div>
        <supplier-card :list="supplierList"></supplier-card>
      </div>
    </div>

    <div class="card">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <div style="font-size: 16px; font-weight: 500; color: #333333">中差评评价</div>
        <div class="flex" style="cursor: pointer" v-if="totalNegativeList && totalNegativeList.length > 10"
          @click="changeRecord">
          <img src="@/assets/svgs/oa/refresh.svg" alt="" style="width: 14px; height: 14px; margin-right: 8px" />
          <span style="font-size: 14px; color: #0064ff">换一批</span>
        </div>
      </div>
      <negative-list :list="negativeList[chooseIndex]" v-loading="recordLoading"></negative-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
import empty from '@/assets/svgs/oa/empty.svg'
import { getUrl } from './util'
import { DICT_TYPE } from '@/utils/dict'
import request from '@/config/axios'
import box from './component/box.vue'
import invBox from './component/invBox.vue'
import descTable from './component/descTable.vue'
import filesList from './component/filesList.vue'
import imagesList from './component/imagesList.vue'
import invTop from './component/invTop.vue'
import supplierCard from './component/supplierCard.vue'
import NegativeList from './component/negativeList.vue'
import uploadAssets from './component/uploadAssets.vue'
import dayjs from 'dayjs'
import useDialog from '@/hooks/web/useDialog'
const { openDialog } = useDialog()
const route = useRoute()
const detailId = route?.params?.id || ''
const imageList = ref([]),
  loading = ref(false),
  salesData = ref({}),
  fileList = ref([]),
  supplierList = ref([]),
  badList = ref([])
const activeKey = ref('0')
const tabs = ref([
  { name: '卖点推广', count: 0, conKey: 'mdtgCon', key: '0' },
  { name: '生产素材', count: 0, conKey: 'scscCon', key: '1' },
  { name: '共享素材', count: 0, conKey: 'gxscCon', key: '2' }
])
const invTopList = ref([])
class DataValue {
  completeCategoryName: string = '';
  productPicture: string = ''
  productCode: string = ''
  productName: string = ''
  categoryCode: string = ''
  extraField: string = ''
  extraFields: any = []

}

class SalesData {
  xsjs: number = 0
  xse: number = 0
}
const dataValue = ref({ ...new DataValue() })
const mainList = [
  [
    {
      fieldName: '企划负责人',
      fieldValue: '',
      fieldKey: 'planHandlerList'
    },
    {
      fieldName: '产研负责人',
      fieldValue: '',
      fieldKey: 'designHandlerList'
    },
    {
      fieldName: '运营负责人',
      fieldValue: '',
      fieldKey: 'operationHandlerList'
    },
    {
      fieldName: '选供负责人',
      fieldValue: '',
      fieldKey: 'supplyHandlerList'
    },
    {
      fieldName: '品类',
      fieldValue: '',
      fieldKey: 'completeCategoryName'
    },
    {
      fieldName: '系列',
      fieldValue: '',
      fieldKey: 'series'
    },
    {
      fieldName: '类型',
      fieldValue: '',
      fieldKey: 'productType',
      dictCode: DICT_TYPE.NP_DESIGN_PRODUCT_TYPE
    },
    {
      fieldName: '产品等级',
      fieldValue: '',
      fieldKey: 'productGrade',
      dictCode: DICT_TYPE.NP_PRODUCTGRADE
    },
    {
      fieldName: '使用季节',
      fieldValue: '',
      fieldKey: 'useSeason',
      dictCode: DICT_TYPE.NP_USE_SEASON
    },
    {
      fieldName: '适用性别',
      fieldValue: '',
      fieldKey: 'applyGender',
      dictCode: DICT_TYPE.NP_APPLY_GENDER
    },
    {
      fieldName: '执行标准',
      fieldValue: '',
      fieldKey: 'executionStandards',
      dictCode: DICT_TYPE.EXECUTION_STANDARDS
    },
    {
      fieldName: '安全类别',
      fieldValue: '',
      fieldKey: 'securityCategory',
      dictCode: DICT_TYPE.SECURITY_CATEGORY
    },
    {
      fieldName: '使用对象',
      fieldValue: '',
      fieldKey: 'useObject',
      dictCode: DICT_TYPE.NP_USE_TARGET
    },
    {
      fieldName: '工艺',
      fieldValue: '',
      fieldKey: 'craft'
    },
    {
      fieldName: '目标客群',
      fieldValue: '',
      fieldKey: 'targetAudience'
    },
    {
      fieldName: '尺码',
      fieldValue: '',
      fieldKey: 'size',
      dictCode: DICT_TYPE.NP_DESIGN_PRODUCT_SIZE,
      span: 1
    }
  ],
  [
    {
      fieldName: '竞品链接',
      fieldValue: '',
      fieldKey: 'competitionLink',
      span: 4
    }
  ],
  [
    {
      fieldName: '卖点',
      fieldValue: '',
      span: 4,
      fieldKey: 'salePoint'
    }
  ],
  [
    {
      fieldName: '颜色',
      fieldValue: '',
      span: 4,
      fieldKey: 'colorPicture'
    }
  ]

  // {
  //   fieldName: '品类特殊字段',
  //   value: ''
  // },
]

const mlList = [[{ fieldName: '面料成分', fieldValue: '', fieldKey: 'fabricComponent', span: 4 }]]

const skuList = [
  [
    {
      fieldName: 'SKU',
      fieldValue: '',
      fieldKey: 'skuCode',
      span: 4
    }
  ]
]

const map = {
  1: 4,
  2: 3,
  3: 2,
  4: 1
}

const getDetail = async () => {
  try {
    loading.value = true
    const res = await request.get({ url: `/api/pr/repository/get/${detailId}` })
    dataValue.value = res || {}
    const { extraField } = dataValue.value
    if (extraField) {
      const arr = JSON.parse(extraField)
      arr[arr.length - 1]['span'] = map[arr.length % 4]
      console.log(arr, 98786)
      mainList.splice(1, 0, arr)
    }
    await getSalesData()
    getMaterialCon()
    getMaterial()
    getPrList()
    getInvData()
    getInventoryDataByGoodsNo()
    getSupplierInfoByGoodsNo()
    getEvaluationBoard()
  } finally {
    loading.value = false
  }
}

// 查询近30天销售数据
const xse = ref(0),
  tkl = ref(0),
  xsjs = ref(0),
  xsds = ref(0),
  cpl = ref(0)
const getSalesData = async () => {
  const query = {
    goodsNo: dataValue?.value?.productCode,
    dataDateStart: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    dataDateEnd: dayjs().format('YYYY-MM-DD')
  }
  const res = await request.post({ url: '/api/bi/external/goods/querySalesData', params: query })
  xse.value = res?.xse || 0
  tkl.value = res?.tkl || 0
  xsjs.value = res?.xsjs || 0
  cpl.value = res?.cpl || 0
  xsds.value = res?.xsds || 0
}

// 查询实时库存(在库)数据
const goodsStock = ref(0)
const getInvData = async () => {
  invTopList.value = []
  const data = {
    dataDate: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    goodsNo: dataValue?.value?.productCode
  }
  const res = await request.post({ url: '/api/bi/external/goods/queryInventory', params: data })
  goodsStock.value = res?.goodsStock || 0
  if (res?.goodsInventoryDataList?.length) {
    const total = res.goodsInventoryDataList.reduce((sum: number, item: any) => {
      return (sum += item.goodsStock)
    }, 0)
    invTopList.value = res.goodsInventoryDataList.map((item: any) => {
      return {
        ...item,
        percent: Number(((item.goodsStock / total) * 100).toFixed(2))
      }
    })
  }
}

// 查询实时库存（在途，在厂）数据
const inFactoryNum = ref(0),
  inTransitNum = ref(0)
const getInventoryDataByGoodsNo = async () => {
  try {
    const params = {
      productCode: dataValue?.value?.productCode
    }
    const res = await request.get({ url: '/api/pr/repository/getInventoryDataByGoodsNo', params })
    inFactoryNum.value = res?.inFactoryNum || 0
    inTransitNum.value = res?.inTransitNum || 0
  } finally {
  }
}

// 获取供应商信息
const getSupplierInfoByGoodsNo = async () => {
  try {
    const params = {
      productCode: dataValue?.value?.productCode
    }
    const res = await request.get({ url: '/api/pr/repository/getSupplierInfoByGoodsNo', params })
    const { supplierInfos } = res
    supplierList.value = supplierInfos || []
  } finally {
  }
}

// 查询专业文档资料
const getPrList = async () => {
  try {
    const data = {
      goodsId: detailId,
      materialType: '3'
    }
    const res = await request.post({ url: '/api/pr/material/list', data })
    fileList.value = res?.length ? res : []
  } finally {
  }
}

// 获取资产总数
const getMaterialCon = async () => {
  try {
    const query = {
      goodsId: detailId,
      productCode: dataValue?.value?.productCode
    }
    const res = await request.get({ url: '/api/pr/material/getCon', params: query })
    tabs.value.map((item: any) => {
      const { conKey } = item
      item['count'] = res?.[conKey] || 0
    })
  } finally {
  }
}

// 数字资产库
const imageLoading = ref(false)
// class PageItem {
//   size: number = 5
//   page: number = 1
// }
// const page = ref({ ...new PageItem() })
const getMaterial = async () => {
  try {
    imageLoading.value = true
    const data =
      activeKey.value === '0'
        ? {
          goodsCode: dataValue?.value?.productCode
        }
        : {
          goodsId: detailId,
          materialType: activeKey.value
        }
    if (activeKey.value === '0') {
      // 卖点推广
      const res = await request.get({
        url: '/api/pictureGallery/getImagesByGoodsCode',
        params: data
      })
      const { cts, zts } = res
      imageList.value =
        (
          cts.map((item: any) => {
            return { docUrl: item }
          }) || []
        ).concat(
          zts.map((item: any) => {
            return { docUrl: item }
          }) || []
        ) || []
    } else {
      const res = await request.post({ url: '/api/pr/material/list', data })
      imageList.value = res?.length ? res : []
    }
  } finally {
    imageLoading.value = false
  }
}

const totalNegativeList = ref([])
const negativeList = ref<any[][]>([])
const initIndex = ref(0),
  chooseIndex = ref(0)
const recordLoading = ref(false)
const getEvaluationBoard = async () => {
  try {
    const params = {
      goodsCode: dataValue?.value?.productCode,
      startDay: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
      endDay: dayjs().format('YYYY-MM-DD')
    }
    recordLoading.value = true
    const res = await request.get({ url: '/api/evaluationBoard/getDataByTime', params })
    const { orderCount, plsj } = res
    totalNegativeList.value = plsj || []
    initIndex.value = 0
    chooseIndex.value = 0
    if (totalNegativeList.value.length) {
      // 页数向上取整
      initIndex.value = Math.ceil(totalNegativeList.value.length / 10)
      const arr: any = []
      for (let i = 0; i < initIndex.value; i++) {
        arr.push(totalNegativeList.value.slice(i * 10, (i + 1) * 10))
      }
      negativeList.value = arr
    }
    if (Number(xsds.value) === 0 || Number(orderCount) === 0) {
      cpl.value = 0
      return
    }
    cpl.value = Number(((orderCount / xsds.value) * 100).toFixed(2)) || 0
  } finally {
    recordLoading.value = false
  }
}

// 换一批
const changeRecord = () => {
  recordLoading.value = true
  ++chooseIndex.value
  if (chooseIndex.value === initIndex.value) {
    chooseIndex.value = 0
  }
  recordLoading.value = false
}

// const uploadDialog = ref(false)
const openUploadDialog = () => {
  openDialog({
    title: '共享素材上传',
    width: '600px',
    content: uploadAssets,
    props: {
      goodsId: detailId,
      productCode: dataValue.value.productCode
    },
    showConfirmFooter: true,
    footerStyle: {
      borderTop: 'solid #f0f0f0 1px'
    },
    onSuccess: () => {
      getMaterialCon()
      getMaterial()
    }
  })
}

const changeTab = () => {
  // page.value = { ...new PageItem() }
  getMaterial()
}

onMounted(() => {
  getDetail()
})
</script>

<style lang="scss" scoped>
.detail-content {
  min-width: 1650px;
  padding: 0 10px;

  .flex {
    display: flex;
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .card {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 20px;
    // display: flex;
    // align-items: center;
    margin-bottom: 20px;

    // overflow: hidden;
    .img {
      width: 226px;
      height: 226px;
      border-radius: 10px;
      background-color: #f2f2f2;
    }

    .info-content {
      padding-left: 16px;
      flex: 1;
      overflow: hidden;

      .name {
        font-size: 22px;
        font-weight: 500;
        color: #333333;
        margin-bottom: 16px;
        padding-top: 15px;
        word-break: break-all;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }

      .code {
        padding: 7px 12px;
        background: #fff4c8;
        border-radius: 4px;
        color: #cd8200;
      }

      .type {
        font-size: 14px;
        color: #666666;
        margin-left: 30px;
      }

      .box-content {
        justify-content: space-between;
        margin-top: 28px;
        overflow: auto;
      }
    }
  }
}

.inv-content {
  padding-top: 16px;

  .inv-box {
    justify-content: space-between;

    .box {
      &:last-child {
        margin-right: 0;
      }
    }
  }
}

:deep() {
  .el-tabs__item {
    padding: 0 10px;
  }

  .el-tabs__nav-wrap {
    &::after {
      height: 1px;
      background-color: #f0f0f0;
    }
  }

  .sw-dialog-footer {
    border-top: solid 1px #f0f0f0 !important;
  }

  .el-dialog__footer {
    border-top: solid 1px #f0f0f0 !important;
  }
}
</style>
