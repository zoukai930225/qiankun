<template>
  <content-wrap>
    <section>
      <s-w-search-form
        ref="searchFormRef"
        :schema="searchForm"
        :show-search-button="false"
        :show-reset-button="false"
      >
        <el-button type="primary" @click="onExport" :loading="exportLoading">导出图片</el-button>
      </s-w-search-form>
    </section>
    <section class="sales-refund-rate-table">
      <!-- 添加标题行 -->
      <s-table
        :show-pagination="false"
        :columns="columns"
        :data="tableData"
        :header-cell-class-name="headerCellClassName"
        :row-class-name="rowClassName"
      />
    </section>
  </content-wrap>
</template>
<script lang="tsx" setup>
import { FormSchema } from '@/types/form'
import GoodCard from './goodCard.vue'
import TrendChart from '@/views/channelData/components/trendChart.vue'
import { MultiTableExportUtil } from '@/utils/exportImg'
import { getGoodsRufundMaxDate, getGoodsRufundList } from '@/api/channelData'
import dayjs from 'dayjs'
import { QuestionFilled } from '@element-plus/icons-vue'

const props = defineProps({
  store: {
    type: String,
    default: ''
  }
})

// 添加选择的日期响应式变量
const selectedDate = ref('')
const exportLoading = ref(false)
// 添加最大日期响应式变量
const maxDate = ref('')
// 添加表格数据响应式变量
const tableData = ref<any[]>([])

// 添加mock数据
const mockData = [
  {
    goodsName: '苹果iPhone 15 Pro Max 256GB 深空黑色',
    goodsImage: 'https://via.placeholder.com/42x42/007AFF/FFFFFF?text=iPhone',
    goodsCode: 'IP15PM256B',
    goodsId: '1001',
    thtkl: 2.5,
    jtkl: 1.8,
    ztkl: 4.3,
    isWarn: '1',
    thtklList: [
      { dataDate: '2024-01-01', thtkl: 2.1 },
      { dataDate: '2024-01-02', thtkl: 2.3 },
      { dataDate: '2024-01-03', thtkl: 2.0 },
      { dataDate: '2024-01-04', thtkl: 2.7 },
      { dataDate: '2024-01-05', thtkl: 2.4 },
      { dataDate: '2024-01-06', thtkl: 2.6 },
      { dataDate: '2024-01-07', thtkl: 2.5 }
    ],
    jtklList: [
      { dataDate: '2024-01-01', jtkl: 1.5 },
      { dataDate: '2024-01-02', jtkl: 1.7 },
      { dataDate: '2024-01-03', jtkl: 1.6 },
      { dataDate: '2024-01-04', jtkl: 1.9 },
      { dataDate: '2024-01-05', jtkl: 1.8 },
      { dataDate: '2024-01-06', jtkl: 2.0 },
      { dataDate: '2024-01-07', jtkl: 1.8 }
    ],
    ztklList: [
      { dataDate: '2024-01-01', ztkl: 3.6 },
      { dataDate: '2024-01-02', ztkl: 4.0 },
      { dataDate: '2024-01-03', ztkl: 3.6 },
      { dataDate: '2024-01-04', ztkl: 4.6 },
      { dataDate: '2024-01-05', ztkl: 4.2 },
      { dataDate: '2024-01-06', ztkl: 4.6 },
      { dataDate: '2024-01-07', ztkl: 4.3 }
    ]
  },
  {
    goodsName: '华为Mate 60 Pro 512GB 雅川青',
    goodsImage: 'https://via.placeholder.com/42x42/FF0000/FFFFFF?text=Huawei',
    goodsCode: 'HW60P512G',
    goodsId: '1002',
    thtkl: 1.8,
    jtkl: 1.2,
    ztkl: 3.0,
    isWarn: '1',
    thtklList: [
      { dataDate: '2024-01-01', thtkl: 1.5 },
      { dataDate: '2024-01-02', thtkl: 1.7 },
      { dataDate: '2024-01-03', thtkl: 1.6 },
      { dataDate: '2024-01-04', thtkl: 1.9 },
      { dataDate: '2024-01-05', thtkl: 1.8 },
      { dataDate: '2024-01-06', thtkl: 2.0 },
      { dataDate: '2024-01-07', thtkl: 1.8 }
    ],
    jtklList: [
      { dataDate: '2024-01-01', jtkl: 1.0 },
      { dataDate: '2024-01-02', jtkl: 1.1 },
      { dataDate: '2024-01-03', jtkl: 1.2 },
      { dataDate: '2024-01-04', jtkl: 1.3 },
      { dataDate: '2024-01-05', jtkl: 1.1 },
      { dataDate: '2024-01-06', jtkl: 1.4 },
      { dataDate: '2024-01-07', jtkl: 1.2 }
    ],
    ztklList: [
      { dataDate: '2024-01-01', ztkl: 2.5 },
      { dataDate: '2024-01-02', ztkl: 2.8 },
      { dataDate: '2024-01-03', ztkl: 2.8 },
      { dataDate: '2024-01-04', ztkl: 3.2 },
      { dataDate: '2024-01-05', ztkl: 2.9 },
      { dataDate: '2024-01-06', ztkl: 3.4 },
      { dataDate: '2024-01-07', ztkl: 3.0 }
    ]
  },
  {
    goodsName: '小米14 Ultra 1TB 钛金属黑',
    goodsImage: 'https://via.placeholder.com/42x42/FF6700/FFFFFF?text=Xiaomi',
    goodsCode: 'XM14U1TB',
    goodsId: '1003',
    thtkl: 3.2,
    jtkl: 2.1,
    ztkl: 5.3,
    thtklList: [
      { dataDate: '2024-01-01', thtkl: 2.8 },
      { dataDate: '2024-01-02', thtkl: 3.0 },
      { dataDate: '2024-01-03', thtkl: 3.1 },
      { dataDate: '2024-01-04', thtkl: 3.3 },
      { dataDate: '2024-01-05', thtkl: 3.2 },
      { dataDate: '2024-01-06', thtkl: 3.4 },
      { dataDate: '2024-01-07', thtkl: 3.2 }
    ],
    jtklList: [
      { dataDate: '2024-01-01', jtkl: 1.8 },
      { dataDate: '2024-01-02', jtkl: 2.0 },
      { dataDate: '2024-01-03', jtkl: 2.1 },
      { dataDate: '2024-01-04', jtkl: 2.2 },
      { dataDate: '2024-01-05', jtkl: 2.1 },
      { dataDate: '2024-01-06', jtkl: 2.3 },
      { dataDate: '2024-01-07', jtkl: 2.1 }
    ],
    ztklList: [
      { dataDate: '2024-01-01', ztkl: 4.6 },
      { dataDate: '2024-01-02', ztkl: 5.0 },
      { dataDate: '2024-01-03', ztkl: 5.2 },
      { dataDate: '2024-01-04', ztkl: 5.5 },
      { dataDate: '2024-01-05', ztkl: 5.3 },
      { dataDate: '2024-01-06', ztkl: 5.7 },
      { dataDate: '2024-01-07', ztkl: 5.3 }
    ]
  },
  {
    goodsName: 'OPPO Find X7 Ultra 256GB 墨玉黑',
    goodsImage: 'https://via.placeholder.com/42x42/008000/FFFFFF?text=OPPO',
    goodsCode: 'OPX7U256B',
    goodsId: '1004',
    thtkl: 2.8,
    jtkl: 1.9,
    ztkl: 4.7,
    thtklList: [
      { dataDate: '2024-01-01', thtkl: 2.5 },
      { dataDate: '2024-01-02', thtkl: 2.7 },
      { dataDate: '2024-01-03', thtkl: 2.6 },
      { dataDate: '2024-01-04', thtkl: 2.9 },
      { dataDate: '2024-01-05', thtkl: 2.8 },
      { dataDate: '2024-01-06', thtkl: 3.0 },
      { dataDate: '2024-01-07', thtkl: 2.8 }
    ],
    jtklList: [
      { dataDate: '2024-01-01', jtkl: 1.6 },
      { dataDate: '2024-01-02', jtkl: 1.8 },
      { dataDate: '2024-01-03', jtkl: 1.7 },
      { dataDate: '2024-01-04', jtkl: 2.0 },
      { dataDate: '2024-01-05', jtkl: 1.9 },
      { dataDate: '2024-01-06', jtkl: 2.1 },
      { dataDate: '2024-01-07', jtkl: 1.9 }
    ],
    ztklList: [
      { dataDate: '2024-01-01', ztkl: 4.1 },
      { dataDate: '2024-01-02', ztkl: 4.5 },
      { dataDate: '2024-01-03', ztkl: 4.3 },
      { dataDate: '2024-01-04', ztkl: 4.9 },
      { dataDate: '2024-01-05', ztkl: 4.7 },
      { dataDate: '2024-01-06', ztkl: 5.1 },
      { dataDate: '2024-01-07', ztkl: 4.7 }
    ]
  },
  {
    goodsName: 'vivo X100 Pro+ 512GB 星云紫',
    goodsImage: 'https://via.placeholder.com/42x42/4169E1/FFFFFF?text=vivo',
    goodsCode: 'VX100P512G',
    goodsId: '1005',
    thtkl: 2.1,
    jtkl: 1.5,
    ztkl: 3.6,
    thtklList: [
      { dataDate: '2024-01-01', thtkl: 1.8 },
      { dataDate: '2024-01-02', thtkl: 2.0 },
      { dataDate: '2024-01-03', thtkl: 1.9 },
      { dataDate: '2024-01-04', thtkl: 2.2 },
      { dataDate: '2024-01-05', thtkl: 2.1 },
      { dataDate: '2024-01-06', thtkl: 2.3 },
      { dataDate: '2024-01-07', thtkl: 2.1 }
    ],
    jtklList: [
      { dataDate: '2024-01-01', jtkl: 1.3 },
      { dataDate: '2024-01-02', jtkl: 1.4 },
      { dataDate: '2024-01-03', jtkl: 1.5 },
      { dataDate: '2024-01-04', jtkl: 1.6 },
      { dataDate: '2024-01-05', jtkl: 1.4 },
      { dataDate: '2024-01-06', jtkl: 1.7 },
      { dataDate: '2024-01-07', jtkl: 1.5 }
    ],
    ztklList: [
      { dataDate: '2024-01-01', ztkl: 3.1 },
      { dataDate: '2024-01-02', ztkl: 3.4 },
      { dataDate: '2024-01-03', ztkl: 3.4 },
      { dataDate: '2024-01-04', ztkl: 3.8 },
      { dataDate: '2024-01-05', ztkl: 3.5 },
      { dataDate: '2024-01-06', ztkl: 4.0 },
      { dataDate: '2024-01-07', ztkl: 3.6 }
    ]
  },
  {
    goodsName: '荣耀Magic6 Pro 1TB 墨玉黑',
    goodsImage: 'https://via.placeholder.com/42x42/FFD700/FFFFFF?text=Honor',
    goodsCode: 'RYM6P1TB',
    goodsId: '1006',
    thtkl: 1.9,
    jtkl: 1.3,
    ztkl: 3.2,
    thtklList: [
      { dataDate: '2024-01-01', thtkl: 1.6 },
      { dataDate: '2024-01-02', thtkl: 1.8 },
      { dataDate: '2024-01-03', thtkl: 1.7 },
      { dataDate: '2024-01-04', thtkl: 2.0 },
      { dataDate: '2024-01-05', thtkl: 1.9 },
      { dataDate: '2024-01-06', thtkl: 2.1 },
      { dataDate: '2024-01-07', thtkl: 1.9 }
    ],
    jtklList: [
      { dataDate: '2024-01-01', jtkl: 1.1 },
      { dataDate: '2024-01-02', jtkl: 1.2 },
      { dataDate: '2024-01-03', jtkl: 1.3 },
      { dataDate: '2024-01-04', jtkl: 1.4 },
      { dataDate: '2024-01-05', jtkl: 1.2 },
      { dataDate: '2024-01-06', jtkl: 1.5 },
      { dataDate: '2024-01-07', jtkl: 1.3 }
    ],
    ztklList: [
      { dataDate: '2024-01-01', ztkl: 2.7 },
      { dataDate: '2024-01-02', ztkl: 3.0 },
      { dataDate: '2024-01-03', ztkl: 3.0 },
      { dataDate: '2024-01-04', ztkl: 3.4 },
      { dataDate: '2024-01-05', ztkl: 3.1 },
      { dataDate: '2024-01-06', ztkl: 3.6 },
      { dataDate: '2024-01-07', ztkl: 3.2 }
    ]
  },
  {
    goodsName: '一加12 256GB 苍绿',
    goodsImage: 'https://via.placeholder.com/42x42/FF4500/FFFFFF?text=OnePlus',
    goodsCode: 'YJ12256G',
    goodsId: '1007',
    thtkl: 2.6,
    jtkl: 1.7,
    ztkl: 4.3,
    thtklList: [
      { dataDate: '2024-01-01', thtkl: 2.3 },
      { dataDate: '2024-01-02', thtkl: 2.5 },
      { dataDate: '2024-01-03', thtkl: 2.4 },
      { dataDate: '2024-01-04', thtkl: 2.7 },
      { dataDate: '2024-01-05', thtkl: 2.6 },
      { dataDate: '2024-01-06', thtkl: 2.8 },
      { dataDate: '2024-01-07', thtkl: 2.6 }
    ],
    jtklList: [
      { dataDate: '2024-01-01', jtkl: 1.5 },
      { dataDate: '2024-01-02', jtkl: 1.6 },
      { dataDate: '2024-01-03', jtkl: 1.7 },
      { dataDate: '2024-01-04', jtkl: 1.8 },
      { dataDate: '2024-01-05', jtkl: 1.6 },
      { dataDate: '2024-01-06', jtkl: 1.9 },
      { dataDate: '2024-01-07', jtkl: 1.7 }
    ],
    ztklList: [
      { dataDate: '2024-01-01', ztkl: 3.8 },
      { dataDate: '2024-01-02', ztkl: 4.1 },
      { dataDate: '2024-01-03', ztkl: 4.1 },
      { dataDate: '2024-01-04', ztkl: 4.5 },
      { dataDate: '2024-01-05', ztkl: 4.2 },
      { dataDate: '2024-01-06', ztkl: 4.7 },
      { dataDate: '2024-01-07', ztkl: 4.3 }
    ]
  },
  {
    goodsName: '魅族21 128GB 无界黑',
    goodsImage: 'https://via.placeholder.com/42x42/32CD32/FFFFFF?text=Meizu',
    goodsCode: 'MZ21128G',
    goodsId: '1008',
    thtkl: 3.5,
    jtkl: 2.3,
    ztkl: 5.8,
    thtklList: [
      { dataDate: '2024-01-01', thtkl: 3.1 },
      { dataDate: '2024-01-02', thtkl: 3.3 },
      { dataDate: '2024-01-03', thtkl: 3.2 },
      { dataDate: '2024-01-04', thtkl: 3.6 },
      { dataDate: '2024-01-05', thtkl: 3.5 },
      { dataDate: '2024-01-06', thtkl: 3.7 },
      { dataDate: '2024-01-07', thtkl: 3.5 }
    ],
    jtklList: [
      { dataDate: '2024-01-01', jtkl: 2.0 },
      { dataDate: '2024-01-02', jtkl: 2.2 },
      { dataDate: '2024-01-03', jtkl: 2.1 },
      { dataDate: '2024-01-04', jtkl: 2.4 },
      { dataDate: '2024-01-05', jtkl: 2.3 },
      { dataDate: '2024-01-06', jtkl: 2.5 },
      { dataDate: '2024-01-07', jtkl: 2.3 }
    ],
    ztklList: [
      { dataDate: '2024-01-01', ztkl: 5.1 },
      { dataDate: '2024-01-02', ztkl: 5.5 },
      { dataDate: '2024-01-03', ztkl: 5.3 },
      { dataDate: '2024-01-04', ztkl: 6.0 },
      { dataDate: '2024-01-05', ztkl: 5.8 },
      { dataDate: '2024-01-06', ztkl: 6.2 },
      { dataDate: '2024-01-07', ztkl: 5.8 }
    ]
  },
  {
    goodsName: '努比亚Z60 Ultra 512GB 星空蓝',
    goodsImage: 'https://via.placeholder.com/42x42/000080/FFFFFF?text=nubia',
    goodsCode: 'NBZ60U512G',
    goodsId: '1009',
    thtkl: 2.3,
    jtkl: 1.6,
    ztkl: 3.9,
    thtklList: [
      { dataDate: '2024-01-01', thtkl: 2.0 },
      { dataDate: '2024-01-02', thtkl: 2.2 },
      { dataDate: '2024-01-03', thtkl: 2.1 },
      { dataDate: '2024-01-04', thtkl: 2.4 },
      { dataDate: '2024-01-05', thtkl: 2.3 },
      { dataDate: '2024-01-06', thtkl: 2.5 },
      { dataDate: '2024-01-07', thtkl: 2.3 }
    ],
    jtklList: [
      { dataDate: '2024-01-01', jtkl: 1.4 },
      { dataDate: '2024-01-02', jtkl: 1.5 },
      { dataDate: '2024-01-03', jtkl: 1.6 },
      { dataDate: '2024-01-04', jtkl: 1.7 },
      { dataDate: '2024-01-05', jtkl: 1.5 },
      { dataDate: '2024-01-06', jtkl: 1.8 },
      { dataDate: '2024-01-07', jtkl: 1.6 }
    ],
    ztklList: [
      { dataDate: '2024-01-01', ztkl: 3.4 },
      { dataDate: '2024-01-02', ztkl: 3.7 },
      { dataDate: '2024-01-03', ztkl: 3.7 },
      { dataDate: '2024-01-04', ztkl: 4.1 },
      { dataDate: '2024-01-05', ztkl: 3.8 },
      { dataDate: '2024-01-06', ztkl: 4.3 },
      { dataDate: '2024-01-07', ztkl: 3.9 }
    ]
  },
  {
    goodsName: '联想拯救者Y90 1TB 钛金灰',
    goodsImage: 'https://via.placeholder.com/42x42/808080/FFFFFF?text=Lenovo',
    goodsCode: 'LXZJY901TB',
    goodsId: '1010',
    thtkl: 4.1,
    jtkl: 2.8,
    ztkl: 6.9,
    thtklList: [
      { dataDate: '2024-01-01', thtkl: 3.7 },
      { dataDate: '2024-01-02', thtkl: 3.9 },
      { dataDate: '2024-01-03', thtkl: 3.8 },
      { dataDate: '2024-01-04', thtkl: 4.2 },
      { dataDate: '2024-01-05', thtkl: 4.1 },
      { dataDate: '2024-01-06', thtkl: 4.3 },
      { dataDate: '2024-01-07', thtkl: 4.1 }
    ],
    jtklList: [
      { dataDate: '2024-01-01', jtkl: 2.5 },
      { dataDate: '2024-01-02', jtkl: 2.7 },
      { dataDate: '2024-01-03', jtkl: 2.6 },
      { dataDate: '2024-01-04', jtkl: 2.9 },
      { dataDate: '2024-01-05', jtkl: 2.8 },
      { dataDate: '2024-01-06', jtkl: 3.0 },
      { dataDate: '2024-01-07', jtkl: 2.8 }
    ],
    ztklList: [
      { dataDate: '2024-01-01', ztkl: 6.2 },
      { dataDate: '2024-01-02', ztkl: 6.6 },
      { dataDate: '2024-01-03', ztkl: 6.4 },
      { dataDate: '2024-01-04', ztkl: 7.1 },
      { dataDate: '2024-01-05', ztkl: 6.9 },
      { dataDate: '2024-01-06', ztkl: 7.3 },
      { dataDate: '2024-01-07', ztkl: 6.9 }
    ]
  }
]

const searchFormRef = ref<any>()
const searchForm = ref<FormSchema[]>([
  {
    field: 'date',
    label: '统计时间',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      format: 'YYYY-MM-DD',
      clearable: false,
      // 添加默认值和change事件
      onChange: (value: string) => {
        selectedDate.value = value
        // 日期变化时重新获取数据
        getGoodsRufundListData()
      },
      disabledDate: (time: Date) => {
        // 如果没有最大日期限制，则不禁用任何日期
        if (!maxDate.value) return false
        // 禁用大于最大日期的日期
        return time.getTime() > new Date(maxDate.value).getTime()
      }
    },
    value: ''
  }
])

// 初始化默认日期
onMounted(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  selectedDate.value = `${year}-${month}-${day}`
})

const columns = computed(() => [
  {
    label: `${selectedDate.value} SW${props.store === 'swTaobao' ? '淘宝' : '天猫'}店铺销量1W+退款率`,
    prop: 'header',
    customRenderHeader: () => (
      <div class="flex items-center justify-center gap-1">
        <span>{`${selectedDate.value} SW${props.store === 'swTaobao' ? '淘宝' : '天猫'}店铺销量1W+退款率`}</span>
        <el-tooltip placement="top" effect="dark">
          {{
            default: () => (
              <el-icon class="cursor-pointer text-gray-400" size={14}>
                <QuestionFilled />
              </el-icon>
            ),
            content: () => (
              <div>
                <div>类目总退款率≥设定阈值则整行标黄</div>
                <div>女士内裤：13%</div>
                <div>男士内裤：10%</div>
                <div>内衣：25%</div>
                <div>胸贴：13%</div>
                <div>袜子：10%</div>
                <div>季节品：25%</div>
              </div>
            )
          }}
        </el-tooltip>
      </div>
    ),
    children: [
      {
        type: 'index',
        label: '序号',
        width: 80,
        customRenderHeader: () => (
          <div class="flex items-center justify-center gap-1">
            <span>序号</span>
            <el-tooltip content="近30天销售件数降序" placement="top" effect="dark">
              <el-icon class="cursor-pointer text-gray-400 ">
                <QuestionFilled />
              </el-icon>
            </el-tooltip>
          </div>
        )
      },
      {
        label: '商品',
        prop: 'goodsId',
        minWidth: 140,
        customRender: ({ row }: any) => {
          return (
            <div class="flex justify-center items-center">
              <el-popover
                placement="right"
                width={348}
                trigger="hover"
                showArrow={false}
                offset={20}
              >
                {{
                  reference: () => (
                    <div>
                      <img class="w-120px h-120px rounded-4px" src={row.imageUrl} />
                    </div>
                  ),
                  default: () => (
                    <GoodCard
                      good={{
                        materialName: row.name || '-',
                        materialId: row.goodsId,
                        goodsImage: row.imageUrl,
                        channel: props.store === 'swTaobao' ? 'TaoBao' : 'Tmall'
                      }}
                    />
                  )
                }}
              </el-popover>
              {/* <div
                class="text-#0064ff text-14px leading-20px truncate cursor-pointer max-w-240px"
                onClick={() => toShop(row.productDetailH5Url)}
                title={row.name || '-'}
              >
                {row.name || '-'}
              </div> */}
            </div>
          )
        }
      },
      {
        label: '编码',
        prop: 'code',
        minWidth: 120
      },
      {
        label: '商品ID',
        prop: 'goodsId',
        minWidth: 150
      },
      {
        label: '退货退款率',
        prop: 'yesterdayRefundRate',
        minWidth: 120,
        customRenderHeader: () => (
          <div class="flex items-center justify-center gap-1">
            <span>退货退款率</span>
            <el-tooltip placement="top" effect="dark">
              {{
                default: () => (
                  <el-icon class="cursor-pointer text-gray-400 ">
                    <QuestionFilled />
                  </el-icon>
                ),
                content: () => (
                  <div>
                    <div>按商品金额计算的普通单发货后的退货退款率，按退款成功时间统计</div>
                    <div>计算公式：普通单退款金额(已发货退货退款) / 普通单销售额(支付) * 100%</div>
                  </div>
                )
              }}
            </el-tooltip>
          </div>
        )
      },
      {
        label: '仅退款率',
        prop: 'yesterdayRefundUserCount',
        minWidth: 100,
        customRenderHeader: () => (
          <div class="flex items-center justify-center gap-1">
            <span>仅退款率</span>
            <el-tooltip placement="top" effect="dark">
              {{
                default: () => (
                  <el-icon class="cursor-pointer text-gray-400 ">
                    <QuestionFilled />
                  </el-icon>
                ),
                content: () => (
                  <div>
                    <div>
                      按商品金额计算的普通单仅退款率，包含已发货仅退款和未发货退款，按退款成功时间统计
                    </div>
                    <div>
                      计算公式：[ 普通单退款金额(未发货) + 普通单退款金额(已发货仅退款) ] /
                      普通单销售额(支付) * 100%
                    </div>
                  </div>
                )
              }}
            </el-tooltip>
          </div>
        )
      },
      {
        label: '总退款率',
        prop: 'totalRefundRate',
        minWidth: 100,
        customRenderHeader: () => (
          <div class="flex items-center justify-center gap-1">
            <span>总退款率</span>
            <el-tooltip placement="top" effect="dark">
              {{
                default: () => (
                  <el-icon class="cursor-pointer text-gray-400 ">
                    <QuestionFilled />
                  </el-icon>
                ),
                content: () => (
                  <div>
                    <div>按商品金额计算的普通单总退款率，按退款成功时间统计</div>
                    <div>
                      计算公式：[ 普通单退款金额(已发货退货退款) + 普通单退款金额(未发货) +
                      普通单退款金额(已发货仅退款) ] / 普通单销售额(支付) * 100%
                    </div>
                  </div>
                )
              }}
            </el-tooltip>
          </div>
        )
      },
      {
        label: '近7天退货退款趋势图',
        prop: 'totalRefundUserCount',
        minWidth: 500,
        customRender: ({ row }: any) => {
          // 退货退款趋势数据
          const refundTrendData = row.refundTrendData || []

          return (
            <div class="w-full">
              {refundTrendData && refundTrendData.length > 0 ? (
                <TrendChart
                  text="退货退款率"
                  udid={`refund-chart-${row.goodsId}`}
                  list={refundTrendData}
                  list1={[]}
                />
              ) : (
                <span class="text-gray-400">暂无数据</span>
              )}
            </div>
          )
        }
      },
      {
        label: '近7天仅退款率趋势图',
        prop: 'totalRefundUserCount',
        minWidth: 500,
        customRender: ({ row }: any) => {
          // 仅退款率趋势数据
          const refundRateTrendData = row.refundRateTrendData || []

          return (
            <div class="w-full">
              {refundRateTrendData && refundRateTrendData.length > 0 ? (
                <TrendChart
                  text="仅退款率"
                  udid={`refund-rate-chart-${row.goodsId}`}
                  list={refundRateTrendData}
                  list1={[]}
                />
              ) : (
                <span class="text-gray-400">暂无数据</span>
              )}
            </div>
          )
        }
      },
      {
        label: '近7天总退款率趋势图',
        prop: 'totalRefundUserCount',
        minWidth: 500,
        customRender: ({ row }: any) => {
          // 总退款率趋势数据
          const totalRefundTrendData = row.totalRefundTrendData || []

          return (
            <div class="w-full">
              {totalRefundTrendData && totalRefundTrendData.length > 0 ? (
                <TrendChart
                  text="总退款率"
                  udid={`total-refund-chart-${row.goodsId}`}
                  list={totalRefundTrendData}
                  list1={[]}
                />
              ) : (
                <span class="text-gray-400">暂无数据</span>
              )}
            </div>
          )
        }
      }
    ]
  }
])

const onExport = async () => {
  if (exportLoading.value) return
  exportLoading.value = true

  // 使用setTimeout创建宏任务，确保loading状态在开始执行图片导出之前能够被渲染出来
  setTimeout(async () => {
    try {
      console.log('Exporting image for:', selectedDate.value)
      const tableContainer = document.querySelector('.sales-refund-rate-table') as HTMLElement
      if (!tableContainer) {
        console.error('找不到表格元素')
        exportLoading.value = false
        return
      }
      console.log(props.store, 'props.store')
      await MultiTableExportUtil.exportElements([tableContainer], {
        filename: `SW${props.store === 'swTaobao' ? '淘宝' : '天猫'}店铺销量1W+退款率-${selectedDate.value}.png`,
        defaultWidths: [1200],
        extraWidth: 0 // 减少额外的宽度，避免出现边框
      })

      console.log('Export completed')
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      exportLoading.value = false
    }
  }, 0)
}

function toShop(url?: string) {
  if (!url) return
  window.open(url)
}

const headerCellClassName = ({ rowIndex }: { rowIndex: number; columnIndex: number }) => {
  // 主标题行（第一行）
  if (rowIndex === 0) {
    return 'main-title-header product-header'
  }

  // 子标题行（第二行）
  if (rowIndex === 1) {
    return 'product-header'
  }

  return ''
}

const rowClassName = ({ row }: { row: any }) => {
  // 如果行的 isWarn 为 "1"，则添加警告样式类名
  console.log(row, 'row')
  if (row.isWarn === '1') {
    return 'sw-table-row_warning'
  }
  return ''
}

async function getGoodsRufundListData() {
  try {
    const res = await getGoodsRufundList({
      store: props.store,
      dataDate: selectedDate.value
    })
    // console.log(res)
    // 使用mock数据
    // const res = mockData
    // console.log('使用mock数据:', res)

    // 处理返回的数据，转换为表格需要的格式
    if (res && Array.isArray(res)) {
      tableData.value = res.map((item) => ({
        ...item,
        name: item.goodsName,
        imageUrl: item.goodsImage,
        code: item.goodsCode,
        goodsId: item.goodsId,
        yesterdayRefundRate: `${item.thtkl}%`, // 退货退款率
        yesterdayRefundUserCount: `${item.jtkl}%`, // 仅退款率
        totalRefundRate: `${item.ztkl}%`, // 总退款率
        // 处理趋势图数据
        refundTrendData:
          item.thtklList?.map((trend: any) => ({
            date: trend.dataDate,
            value: trend.thtkl
          })) || [],
        refundRateTrendData:
          item.jtklList?.map((trend: any) => ({
            date: trend.dataDate,
            value: trend.jtkl
          })) || [],
        totalRefundTrendData:
          item.ztklList?.map((trend: any) => ({
            date: trend.dataDate,
            value: trend.ztkl
          })) || []
      }))
    } else {
      tableData.value = []
    }
  } catch (error) {
    console.error('获取退款率数据失败:', error)
    tableData.value = []
  }
}

async function getGoodsRufundMaxDateData() {
  try {
    const date = await getGoodsRufundMaxDate({
      store: props.store
    })
    if (date) {
      selectedDate.value = date
      maxDate.value = date
    } else {
      selectedDate.value = dayjs().format('YYYY-MM-DD')
      maxDate.value = dayjs().format('YYYY-MM-DD')
    }
    searchFormRef.value.setValues({
      date: selectedDate.value
    })
  } catch (error) {
    console.error(error)
  }
}

onMounted(async () => {
  await getGoodsRufundMaxDateData()
  getGoodsRufundListData()
})
</script>
<style scoped lang="scss">
.table-title {
  margin-bottom: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px;
  border-left: 4px solid #409eff;

  h2 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    text-align: center;
  }
}

// .sales-refund-rate-table {
//   // 确保导出时没有多余边框
//   border: none !important;
//   outline: none !important;
//   padding: 16px 0;
//   background-color: white;
//   border-radius: 0;
// }

:deep(.s-table) {
  .product-header {
    background: linear-gradient(
      180deg,
      rgba(218, 245, 213, 0.33) 0%,
      rgba(255, 255, 255, 0.33) 100%
    ) !important;
  }

  // 主标题行文字加大加粗
  .main-title-header {
    font-size: 18px !important;
    font-weight: bold !important;
    color: #333 !important;
    .el-icon {
      color: rgb(156 163 175 / var(--un-text-opacity));
    }
  }
}

// 多行tooltip样式
:deep(.multi-line-tooltip) {
  .el-tooltip__content {
    white-space: pre-line !important;
  }
}
</style>
