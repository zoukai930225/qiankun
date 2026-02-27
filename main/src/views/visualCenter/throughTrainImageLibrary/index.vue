<template>
  <content-wrap>
    <s-w-search-form
      :schema="searchSchema"
      :expand-threshold="3"
      :show-expand="!!selectedPersonType"
      expand-text="展开"
      collapse-text="收起"
      @search="handleSearch"
      @reset="handleReset"
      ref="searchFormRef"
      auto-search-on-change
    >
      <el-button type="primary" @click="handleExport">导出</el-button>
    </s-w-search-form>
    <div class="mt-4">
      <s-table
        ref="tableRef"
        show-loading
        :columns="columns"
        :span-method="handleSpanMethod"
        :fetch="imageManageApi.getPromotionGallery"
        :fetch-params="queryParams"
        :after-fetch="afterFetchHandler"
        row-key="id"
      />
    </div>
    <View ref="viewRef" @close="handleResearch" />
    <!-- 图片详情抽屉 -->
    <DetailDrawer
      ref="detailDrawerRef"
      :detail-data="drawerData"
      :current-is-auto="currentIsAuto"
      @edit="handleDetailEdit"
      @close="handleDetailClose"
    />
    <!-- 编辑抽屉 -->
    <EditDrawer
      ref="editDrawerRef"
      :edit-data="editData"
      :current-is-auto="currentEditIsAuto"
      @close="handleEditClose"
      @submit="handleEditSubmit"
    />
  </content-wrap>
</template>

<script setup lang="tsx">
import { ref, nextTick } from 'vue'
import { FormSchema } from '@/types/form'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
dayjs.locale('zh-cn')
import * as PersonRosterApi from '@/api/hrAdmin/personRoster'
import * as imageManageApi from '@/api/visualCenter/imageManage'
import { downloadFileFromResponse } from '@/utils/file'
import { getUrlByTypeAndId, getImageUrl } from '@/utils'
import SWSelectPeople from '@/views/OA/new/develop/components/SWSelectPeople.vue'
import ImgView from './components/imgView.vue'
import CarImgView from './components/carImgView.vue'
import View from './components/view.vue'
import DetailDrawer from './components/detailDrawer.vue'
import EditDrawer from './components/editDrawer.vue'
import * as GalleryApi from '@/api/gallery'
import GoodCard from './components/goodCard.vue'
import { DICT_TYPE, getDictLabel, getIntDictOptions } from '@/utils/dict'

// API返回的数据结构 Through Train Image Library
interface ApiPromotionGalleryItem {
  id: string
  promotionImageUrls: string[] // 推广图URL多个运营拼接
  version: number // 版本号
  mappingPurpose: string // 测图目的
  versionTime: string // 版本时间
  uploadTime: string // 车图上传时间
  clickRateSeven: string // 七天免费点击率
  clickConversionRateSeven: string // 七天免费点击转化率
  clickRateFifteen: string // 15天付费点击率
  clickConversionRateFifteen: string // 15天免费点击转化率
  conclusionType: number // 结论类型
  conclusion: string // 结论
}

interface ApiDataItem {
  id: string
  masterImageUrl: string // 商品主图url
  goodsName: string // 商品名称
  goodsId: string // 商品id
  goodsCode: string // 商品编码
  groundingTime: string // 上架时间
  channel?: string // 渠道类型 (可选，如果API没有返回则使用默认值)
  categoryName: string
  promotionGalleryItems: ApiPromotionGalleryItem[] // 车图版本集合
}

// 表格显示的扁平化数据类型
interface TableRow {
  id: string
  originalId: string
  masterImageUrl: string // 主图
  goodsName: string // 商品名称
  goodsId: string // 商品ID
  goodsCode: string // 商品编码
  groundingTime: string // 上架时间
  channel: string // 渠道类型 (TaoBao/Tmall/Pdd/Douyin)
  categoryName: string
  carImageUrl: string[] // 车图URL数组
  promotionVersion: string // 推广版本
  mappingPurpose: string // 测图目的
  versionTime: string // 版本时间
  uploadTime: string // 车图上传时间
  clickRateSeven: string // 7天付费点击率%
  clickConversionRateSeven: string // 7天付费转换率%
  clickRateFifteen: string // 15天付费点击率%
  clickConversionRateFifteen: string // 15天付费转换率%
  conclusionType: number // 结论类型
  conclusion: string // 结论
  // 合并相关字段
  masterImageRowSpan?: number // 主图行合并数
  isFirstRowOfGroup?: boolean // 是否为组的第一行
}

// 表格引用
const tableRef = ref()
const viewRef = ref()
const detailDrawerRef = ref()
const editDrawerRef = ref()
const searchFormRef = ref()
// 抽屉相关数据
const drawerData = ref({})
const currentIsAuto = ref(false)

// 编辑抽屉相关数据
const editData = ref({})
const currentEditIsAuto = ref(false)

// 获取前一周的日期范围
const getLastWeekRange = () => {
  const today = dayjs()
  const lastWeekStart = today.subtract(1, 'week').startOf('week').format('YYYY-MM-DD')
  const lastWeekEnd = today.subtract(1, 'week').endOf('week').format('YYYY-MM-DD')
  console.log('getLastWeekRange计算结果:', [lastWeekStart, lastWeekEnd])
  return [lastWeekStart, lastWeekEnd]
}

// 查询参数
const [defaultStartTime, defaultEndTime] = getLastWeekRange()
const queryParams = ref({
  searchContent: '', // 商品主键
  personType: null as string | null, // 人员类型 1、运营 2、策划 3、拍摄 4、后期 5、设计
  personId: '', // 人员id
  uploadTimeStart: defaultStartTime, // 车图上传开始时间 - 默认前一周
  uploadTimeEnd: defaultEndTime, // 车图上传结束时间 - 默认前一周
  conclusion: '', // 结论类型 1-优化成功 2-优化失败 3-继续优化
  channel: '', // 渠道
  category: [] // 类目
})

const personId = ref() as any
const personList = ref([])
const personalRequest = ref(false)
const selectedPersonType = ref('') // 跟踪选择的人员类型，用于条件渲染

// 组件初始化时同步状态
selectedPersonType.value = queryParams.value.personType || ''

// 人员类型选项
const optionOptions = [
  { value: '1', label: '运营' },
  { value: '2', label: '策划' },
  { value: '3', label: '拍摄' },
  { value: '4', label: '后期' },
  { value: '5', label: '设计' }
]

// 结论类型选项
//  <el-option label="继续测图" :value="5" />
// <el-option label="测图结束" :value="6" />
// <el-option label="运营暂无安排测图" :value="7" />
const conclusionOptions = [
  { value: '1', label: '优化成功' },
  { value: '2', label: '优化失败' },
  { value: '3', label: '继续优化' },
  { value: '4', label: '优化停止' },
  { value: '5', label: '继续测图' },
  { value: '6', label: '测图结束' },
  { value: '7', label: '运营暂无安排测图' }
]

// 渠道
const channelOptions = getIntDictOptions(DICT_TYPE.SYSTEM_PARAM_CHANNEL, true)

// 类目
const categoryOptions = [
  { label: '内衣', value: 'UNDERWEAR_CATEGORY_GROUP' },
  { label: '季节品', value: 'SEASONAL_CATEGORY_GROUP' },
  { label: '女士内裤', value: 'WOMANPANTS_CATEGORY_GROUP' },
  { label: '袜子', value: 'SOCKS_CATEGORY_GROUP' },
  { label: '男士内裤', value: 'MANPANTS_CATEGORY_GROUP' },
  { label: '胸贴', value: 'PASTIES_CATEGORY_GROUP' }
]

// 真实的远程搜索人员方法
const remoteMethod = async () => {
  if (personalRequest.value) {
    return []
  }
  if (personList.value && personList.value.length > 0) {
    return personList.value
  }
  personalRequest.value = true
  const data = await PersonRosterApi.getPersonRosterAvatarOriginList({
    status: '2'
  }).catch(() => {
    personalRequest.value = false
  })
  personList.value = data || []
  personalRequest.value = false
  return personList.value
}

// 搜索表单Schema配置
const searchSchema: FormSchema[] = [
  {
    field: 'searchContent',
    label: '商品主键',
    component: 'Input',
    componentProps: {
      placeholder: '请输入商品名称/ID/编码',
      clearable: true
    }
  },
  {
    field: 'personnel',
    label: '人员查询',
    customRender: (_item, _model) => {
      return (
        <div class="flex items-center">
          <el-select
            v-model={queryParams.value.personType}
            placeholder="请选择人员类型"
            clearable
            onChange={(value) => {
              // 同步更新用于条件渲染的响应式变量
              selectedPersonType.value = value || ''
              if (!value) {
                personId.value = null
                performSearch()
              }
            }}
          >
            {optionOptions.map((option) => (
              <el-option key={option.value} value={option.value} label={option.label} />
            ))}
          </el-select>
          {/* 横杠分隔符 - 只在选择了人员类型时显示 */}
          {selectedPersonType.value && <div class="w-[14px] h-[1px] bg-gray-600 mx-3"></div>}
          {/* 人员选择 - 只在选择了人员类型时显示 */}
          {selectedPersonType.value && (
            <div class="valueBgInput">
              <SWSelectPeople
                v-model={personId.value}
                isEdit={true}
                multiple={false}
                getSearchList={remoteMethod}
                onSelectPeopleChange={performSearch}
                onClear={performSearch}
              />
            </div>
          )}
        </div>
      )
    }
  },
  {
    field: 'uploadTimeRange',
    label: '上传时间',
    component: 'DatePicker',
    value: getLastWeekRange(), // 设置默认值为前一周
    componentProps: {
      type: 'daterange',
      rangeSeparator: '至',
      startPlaceholder: '开始日期',
      endPlaceholder: '结束日期',
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD'
    }
  },
  {
    field: 'conclusion',
    label: '结论',
    component: 'Select',
    componentProps: {
      placeholder: '请选择结论类型',
      options: conclusionOptions,
      clearable: true
    }
  },
  {
    field: 'channel',
    label: '渠道',
    customRender: () => {
      return (
        <el-select v-model={queryParams.value.channel} placeholder="请选择渠道" clearable>
          {channelOptions.map((option) => (
            <el-option key={option.value} value={option.value} label={option.label}>
              <div class="flex items-center">
                <img src={getImageUrl(option.value)} class="h20px w20px mr6px" />
                <span>{option.label}</span>
              </div>
            </el-option>
          ))}
        </el-select>
      )
    }
  },
  {
    field: 'category',
    label: '类目',
    component: 'Select',
    componentProps: {
      placeholder: '请选择类目',
      options: categoryOptions,
      clearable: true,
      multiple: true
    }
  }
]

// 数据扁平化处理函数
const flattenApiData = (apiData: ApiDataItem[]): TableRow[] => {
  const flattenedData: TableRow[] = []

  apiData.forEach((item) => {
    if (item.promotionGalleryItems && item.promotionGalleryItems.length > 0) {
      // 为每个 promotionGalleryItem 创建一行，车图URL数组放在同一个格子中
      item.promotionGalleryItems.forEach((promoItem, promoIndex) => {
        flattenedData.push({
          id: `${item.goodsId}_${promoIndex}`,
          originalId: promoItem.id,
          masterImageUrl: item.masterImageUrl,
          goodsName: item.goodsName,
          goodsId: item.goodsId,
          goodsCode: item.goodsCode,
          groundingTime: item.groundingTime,
          channel: item.channel || '', // 如果API没有返回channel则默认为空
          categoryName: item.categoryName,
          carImageUrl: promoItem.promotionImageUrls || [], // 保存整个数组
          promotionVersion: `第${promoItem.version}版`,
          mappingPurpose: promoItem.mappingPurpose,
          versionTime: promoItem.versionTime,
          uploadTime: promoItem.uploadTime,
          clickRateSeven: promoItem.clickRateSeven,
          clickConversionRateSeven: promoItem.clickConversionRateSeven,
          clickRateFifteen: promoItem.clickRateFifteen,
          clickConversionRateFifteen: promoItem.clickConversionRateFifteen,
          conclusionType: promoItem.conclusionType,
          conclusion: promoItem.conclusion
        })
      })
    }
  })

  // 计算合并信息
  return calculateMergeInfo(flattenedData)
}

// 计算合并信息
const calculateMergeInfo = (data: TableRow[]): TableRow[] => {
  const result = [...data]
  let currentGroup = ''
  let groupStartIndex = 0
  let groupSize = 0

  for (let i = 0; i < result.length; i++) {
    const row = result[i]
    const groupKey = row.masterImageUrl + '_' + row.goodsName

    if (currentGroup !== groupKey) {
      // 设置上一个组的合并信息
      if (groupSize > 0 && groupStartIndex < i) {
        result[groupStartIndex].masterImageRowSpan = groupSize
        result[groupStartIndex].isFirstRowOfGroup = true
        for (let j = groupStartIndex + 1; j < groupStartIndex + groupSize; j++) {
          result[j].masterImageRowSpan = 0 // 不显示
          result[j].isFirstRowOfGroup = false
        }
      }

      // 开始新组
      currentGroup = groupKey
      groupStartIndex = i
      groupSize = 1
    } else {
      groupSize++
    }
  }

  // 处理最后一个组
  if (groupSize > 0) {
    result[groupStartIndex].masterImageRowSpan = groupSize
    result[groupStartIndex].isFirstRowOfGroup = true
    for (let j = groupStartIndex + 1; j < groupStartIndex + groupSize; j++) {
      result[j].masterImageRowSpan = 0
      result[j].isFirstRowOfGroup = false
    }
  }

  return result
}

// afterFetch 处理函数 - 在数据获取后自动处理数据扁平化和合并单元格
const afterFetchHandler = (records: ApiDataItem[]): TableRow[] => {
  console.log('afterFetch 接收到的原始数据:', records)

  if (!Array.isArray(records) || records.length === 0) {
    console.log('没有数据需要处理')
    return []
  }

  // 使用现有的扁平化处理函数处理数据
  const processedData = flattenApiData(records)
  console.log('afterFetch 处理后的数据:', processedData)

  return processedData
}

const columns = [
  {
    label: '主图',
    prop: 'masterImageUrl',
    width: 300,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => {
      // 只有当 masterImageRowSpan > 0 时才渲染内容
      if (row.masterImageRowSpan === 0) {
        return null
      }
      return (
        <div
          class="goods-image-container flex items-center gap-6px cursor-pointer"
          onClick={() => handleProductJump(row)}
        >
          <el-popover placement="right" width={348} trigger="hover" showArrow={false} offset={20}>
            {{
              default: () => (
                <GoodCard
                  good={{
                    materialName: row.goodsName || row.goodsCode,
                    materialId: row.goodsId || row.goodsCode,
                    goodsImage: row.masterImageUrl,
                    channel: row.channel,
                    goodsCode: row.goodsCode
                  }}
                />
              ),
              reference: () => (
                <div class="goods-image-wrapper">
                  <img
                    src={row.masterImageUrl}
                    alt={row.goodsCode}
                    style="width: 42px; height: 42px; object-fit: contain; border-radius: 4px;"
                  />
                </div>
              )
            }}
          </el-popover>
          <div class="flex-1 min-w-0 text-[#0064ff] line-clamp-2 overflow-hidden whitespace-pre-wrap cursor-pointer lh-18px">
            {row.goodsName}
          </div>
        </div>
      )
    }
    // customRender: ({ row }) => {
    //   // 只有当 masterImageRowSpan > 0 时才渲染内容
    //   if (row.masterImageRowSpan === 0) {
    //     return null
    //   }

    //   return (
    //     <div
    //       class="flex items-center gap-6px cursor-pointer"
    //       onClick={() => handleProductJump(row)}
    //     >
    //       <ImgView
    //         url={row.masterImageUrl}
    //         goodsName={row.goodsName}
    //         goodsCode={row.goodsCode}
    //         goodsId={row.goodsId}
    //         groundingTime={row.groundingTime}
    //         channel={row.channel}
    //         showProductInfo={true}
    //       />
    //       <div class="flex-1 min-w-0">
    //         <div class="text-(14px #333) line-clamp-2 leading-5 whitespace-normal">
    //           {row.goodsName}
    //         </div>
    //       </div>
    //     </div>
    //   )
    // }
  },
  {
    label: '商品ID',
    prop: 'goodsId',
    width: 200,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => {
      if (row.masterImageRowSpan === 0) {
        return ''
      }
    }
  },
  {
    label: '商品编码',
    prop: 'goodsCode',
    width: 120,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => {
      if (row.masterImageRowSpan === 0) {
        return ''
      }
    }
  },
  {
    label: '渠道',
    prop: 'channel',
    width: 120,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => {
      if (row.masterImageRowSpan === 0) {
        return ''
      }
      return (
        <div class="flex items-center">
          <img src={getImageUrl(row.channel)} class="w20px h20px mr10px" />
          <span>{channelOptions.find((el: any) => el.value === row.channel)?.label}</span>
        </div>
      )
    }
  },
  {
    label: '类目',
    prop: 'categoryName',
    width: 280,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => {
      if (row.masterImageRowSpan === 0) {
        return ''
      }
    }
  },
  {
    label: '车图',
    prop: 'carImageUrl',
    width: 90,
    align: 'center',
    headerAlign: 'center',
    customRender: ({ row }) => {
      // console.log('车图列 row.carImageUrl:', row.carImageUrl)
      // console.log('车图列 完整 row:', row)
      return <CarImgView carImageUrls={row.carImageUrl || []} />
    }
  },
  {
    label: '推广版本',
    prop: 'promotionVersion',
    width: 120,
    align: 'left',
    headerAlign: 'left'
  },
  {
    label: '测图目的',
    prop: 'mappingPurpose',
    width: 120,
    align: 'left',
    headerAlign: 'left'
  },
  {
    label: '版本时间',
    prop: 'versionTime',
    width: 140,
    align: 'left',
    headerAlign: 'left'
  },
  {
    label: '车图上传时间',
    prop: 'uploadTime',
    width: 180,
    align: 'left',
    headerAlign: 'left'
  },
  {
    label: '7天付费点击率%',
    prop: 'clickRateSeven',
    width: 130,
    align: 'right',
    headerAlign: 'right'
  },
  {
    label: '7天付费转换率%',
    prop: 'clickConversionRateSeven',
    width: 130,
    align: 'right',
    headerAlign: 'right'
  },
  {
    label: '15天付费点击率%',
    prop: 'clickRateFifteen',
    width: 140,
    align: 'right',
    headerAlign: 'right'
  },
  {
    label: '15天付费转换率%',
    prop: 'clickConversionRateFifteen',
    width: 140,
    align: 'right',
    headerAlign: 'right'
  },
  {
    label: '结论',
    prop: 'conclusion',
    width: 100,
    align: 'center',
    customRender: ({ row }) => {
      return (
        conclusionOptions.find((item) => Number(item.value) === row.conclusionType)?.label || '-'
      )
    }
  },
  {
    label: '结论备注',
    prop: 'conclusion',
    minWidth: 150,
    align: 'center'
  },
  {
    label: '操作',
    prop: 'action',
    width: 140,
    align: 'left',
    headerAlign: 'left',
    fixed: 'right',
    showOverflowTooltip: false,
    customRender: ({ row }) => {
      return (
        <div class="flex ">
          <el-button type="primary" link onClick={() => handleEdit(row)}>
            编辑
          </el-button>
          <el-button type="primary" link onClick={() => handleDetail(row)}>
            详情
          </el-button>
          <el-button type="primary" link onClick={() => handleView(row)}>
            查看
          </el-button>
        </div>
      )
    }
  }
]

// 行合并处理函数
const columnSpanList = ['masterImageUrl', 'goodsId', 'goodsCode', 'channel', 'categoryName']
const handleSpanMethod = ({ row, column }) => {
  // 需要合并的列
  if (columnSpanList.includes(column.property)) {
    if (row.masterImageRowSpan !== undefined) {
      return {
        rowspan: row.masterImageRowSpan,
        colspan: row.masterImageRowSpan === 0 ? 0 : 1
      }
    }
  }
  return { rowspan: 1, colspan: 1 }
}

const handleResearch = async () => {
  await nextTick()
  tableRef.value.refresh()
}

// 搜索处理
const handleSearch = async (formData: Record<string, any>) => {
  console.log('搜索参数:', formData)

  // 设置查询参数
  queryParams.value.searchContent = formData.searchContent || ''
  queryParams.value.conclusion = formData.conclusion || ''

  // 同步更新人员类型选择状态
  selectedPersonType.value = queryParams.value.personType || ''

  if (personId.value) {
    queryParams.value.personId = personId.value[0]?.userId || ''
  }

  // 类目
  queryParams.value.category =
    formData.category && formData.category.length ? formData.category.join(',') : ''

  // 处理上传时间范围
  if (formData.uploadTimeRange && formData.uploadTimeRange.length === 2) {
    queryParams.value.uploadTimeStart = formData.uploadTimeRange[0]
    queryParams.value.uploadTimeEnd = formData.uploadTimeRange[1]
  } else {
    queryParams.value.uploadTimeStart = ''
    queryParams.value.uploadTimeEnd = ''
  }
  await nextTick()
  tableRef.value.refresh()
  console.log('搜索处理后 queryParams.value:', queryParams.value)
}

// 执行搜索的方法 - 简化版本，因为数据处理在afterFetch中自动完成
const performSearch = () => {
  console.log('执行搜索，查询参数:', queryParams.value)
  // 表格会自动使用新的查询参数重新获取数据
  // afterFetch 会自动处理数据扁平化和合并单元格
}

// 编辑操作 - 打开编辑抽屉
const handleEdit = async (row: TableRow) => {
  try {
    console.log('编辑行:', row)

    // 使用相同的接口获取详情数据
    const data = await GalleryApi.getDetailPage({ goodsId: row.goodsId })

    console.log('获取的编辑数据:', data)

    // 从row.id中提取推广图片项的索引
    // row.id格式为：${goodsId}_${promoIndex}
    const promoIndex = parseInt(row.id.split('_')[1])
    console.log('推广图片索引:', promoIndex)

    // 根据索引找到对应的推广图片项
    if (data.promotionImageList && data.promotionImageList.length > promoIndex) {
      const targetPromotionItem = data.promotionImageList.find((item) => item.id === row.originalId)

      // 统一使用非自动模式，直接使用 targetPromotionItem
      const imageList = [targetPromotionItem.imageUrl]

      // 构造编辑数据结构
      const dialogData = {
        ...targetPromotionItem, // 使用对应的 promotionItem 数据
        currentIndex: 0, // 添加当前索引
        url: targetPromotionItem.imageUrl, // 当前显示的图片URL
        imageList: imageList, // 图片列表
        masterImageInfo: data.masterImageInfo // 添加主图信息
      }

      // 设置相关状态 - 统一为非自动模式
      currentEditIsAuto.value = false
      editData.value = dialogData

      console.log('处理后的编辑数据:', dialogData)

      // 打开编辑抽屉
      editDrawerRef.value?.open(dialogData)
    } else {
      ElMessage.warning('暂无推广图片数据或数据索引无效')
    }
  } catch (error) {
    console.error('获取编辑数据失败:', error)
    ElMessage.error('获取编辑数据失败')
  }
}

// 详情操作
// 详情操作 - 打开 detailDrawer
const handleDetail = async (row: TableRow) => {
  try {
    console.log('详情行:', row)

    // 使用相同的接口获取详情数据
    const data = await GalleryApi.getDetailPage({ goodsId: row.goodsId })

    console.log('获取的详情数据:', data)

    // 从row.id中提取推广图片项的索引
    // row.id格式为：${goodsId}_${promoIndex}
    const promoIndex = parseInt(row.id.split('_')[1])
    console.log('推广图片索引:', promoIndex)

    // 根据索引找到对应的推广图片项
    if (data.promotionImageList && data.promotionImageList.length > promoIndex) {
      const targetPromotionItem = data.promotionImageList.find((item) => item.id === row.originalId)

      // 检查是否有 dataList，如果有则选择第一个，如果没有则使用自身
      const targetItem =
        targetPromotionItem.dataList && targetPromotionItem.dataList.length > 0
          ? targetPromotionItem.dataList[0]
          : targetPromotionItem

      // 参考 view.vue 中 openDialog 的数据处理逻辑
      const isAuto = targetPromotionItem.dataList && targetPromotionItem.dataList.length > 0
      const imageList = isAuto
        ? targetPromotionItem.dataList.map((item) => item.imageUrl)
        : [targetPromotionItem.imageUrl]

      // 构造与 view.vue 中相同的数据结构
      const dialogData = {
        ...targetPromotionItem, // 使用对应的 promotionItem 数据
        currentIndex: 0, // 添加当前索引
        url: targetItem.imageUrl, // 当前显示的图片URL
        imageList: imageList, // 图片列表
        masterImageInfo: data.masterImageInfo // 添加主图信息
      }

      // 设置相关状态
      currentIsAuto.value = isAuto
      drawerData.value = dialogData

      console.log('处理后的详情数据:', dialogData)

      // 打开抽屉
      detailDrawerRef.value?.open(dialogData)
    } else {
      ElMessage.warning('暂无推广图片数据或数据索引无效')
    }
  } catch (error) {
    console.error('获取详情数据失败:', error)
    ElMessage.error('获取详情数据失败')
  }
}

// 查看操作
const handleView = async (row: TableRow) => {
  try {
    viewRef.value.open(row.goodsId, {
      uploadTimeStart: queryParams.value.uploadTimeStart,
      uploadTimeEnd: queryParams.value.uploadTimeEnd
    })
  } catch (error) {}
}

// 跳转到商品链接
const handleProductJump = (row: TableRow) => {
  if (row.goodsId && row.channel) {
    getUrlByTypeAndId(row.channel, row.goodsId)
  } else {
    ElMessage.warning('商品信息不完整，无法跳转')
  }
}

// 处理详情抽屉的编辑事件
const handleDetailEdit = (data) => {
  console.log('编辑详情数据:', data)
  // 这里可以实现编辑功能，比如打开编辑弹窗
  ElMessage.info('编辑功能待开发')
}

// 处理详情抽屉的关闭事件
const handleDetailClose = () => {
  console.log('详情抽屉关闭')
  // 清理数据
  drawerData.value = {}
  currentIsAuto.value = false
}

// 处理编辑抽屉的关闭事件
const handleEditClose = () => {
  console.log('编辑抽屉关闭')
  // 清理数据
  editData.value = {}
  currentEditIsAuto.value = false
}

// 处理编辑抽屉的提交事件
const handleEditSubmit = (params) => {
  console.log('编辑提交成功:', params)

  // 刷新表格列表
  tableRef.value?.refresh()

  // 清理编辑数据
  editData.value = {}
  currentEditIsAuto.value = false

  ElMessage.success('编辑成功')
}

// 导出操作
const handleExport = async () => {
  try {
    // 准备导出参数，与搜索参数相同
    const params = {
      searchContent: queryParams.value.searchContent,
      personType: queryParams.value.personType,
      personId: queryParams.value.personId,
      uploadTimeStart: queryParams.value.uploadTimeStart,
      uploadTimeEnd: queryParams.value.uploadTimeEnd,
      conclusion: queryParams.value.conclusion,
      channel: queryParams.value.channel,
      category:
        queryParams.value.category && queryParams.value.category.length
          ? queryParams.value.category.join(',')
          : ''
    }

    // 过滤掉空值参数
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== '' && value !== null)
    )

    console.log('导出参数:', filteredParams)

    // 调用导出API获取文件流
    const response = await imageManageApi.exportPromotionGallery(filteredParams)

    // 从响应头获取文件名并下载（如果响应头没有文件名则使用默认文件名）
    const defaultFileName = `车图图库导出_${new Date().toLocaleDateString().replace(/\//g, '-')}.xlsx`
    downloadFileFromResponse(response, defaultFileName)

    ElMessage.success('导出成功！')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  }
}

// 重置处理
const handleReset = () => {
  console.log('表单已重置')

  // 获取新的前一周日期范围
  const [resetStartTime, resetEndTime] = getLastWeekRange()

  // 重置查询参数，上传时间恢复到前一周
  queryParams.value = {
    searchContent: '',
    personType: null,
    personId: '',
    uploadTimeStart: resetStartTime,
    uploadTimeEnd: resetEndTime,
    conclusion: '',
    channel: '',
    category: ''
  }

  // 重置人员选择
  personId.value = null

  // 重置人员类型选择状态
  selectedPersonType.value = ''

  // 表格会自动使用重置后的查询参数重新获取数据
  // ElMessage.info('表单已重置')
}
</script>

<style scoped lang="scss">
// 使用UnoCSS类替代，保留必要的深度选择器样式
// 人员选择组件的背景样式，与gallery保持一致
// :deep(.el-form) {
//   .valueBgInput {
//     .select-wapper {
//       .el-select {
//         .el-select__wrapper {
//           background: unset;
//         }
//       }
//     }
//   }
// }
:deep(.el-table) {
  margin-top: 16px;
}
</style>
