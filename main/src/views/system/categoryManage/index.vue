<template>
  <ex-screen>
    <query-scheme
      v-model="queryParams"
      :scheme="currentSchema"
      name="categoryManage"
      :show-expand="false"
    >
      <template #appendButtons>
        <el-button
          v-if="activeChannel === 'Settings'"
          @click="viewDetails({}, 'add')"
          type="primary"
        >
          <Icon icon="ep:plus" class="mr-5px" />新增单品
        </el-button>
        <el-button :disabled="loading" type="primary" class="ml-10px" @click="refreshCategory">
          <Icon icon="ep:refresh" class="mr-5px" /> 回写映射类目
        </el-button>
      </template>
    </query-scheme>

    <div class="listWrapper">
      <div class="tabs-container relative">
        <el-tabs v-model="activeChannel" class="channel-tabs" @tab-click="handleClick">
          <el-tab-pane
            v-for="(tab, index) in channelTabs"
            :key="index"
            :label="tab.label"
            :name="tab.name"
          >
            <div
              v-if="activeChannel !== 'Settings'"
              class="tree-content-wrapper"
              v-loading="loading"
              :style="{ 'min-height': loading || dataList.length > 0 ? '300px' : 'auto' }"
            >
              <el-tree
                v-if="dataList.length > 0"
                ref="refTree"
                class="custom-tree"
                empty-text="无"
                node-key="id"
                :data="dataList"
                :props="defaultProps"
                :expand-on-click-node="true"
                :default-expanded-keys="isLoadExpandKey ? expandKey : []"
                @node-expand="nodeExpand"
                @node-collapse="nodeCollapse"
                :indent="36"
              >
                <template #default="{ data }">
                  <span class="custom-tree-node">
                    <span class="custom-tree-node-left">{{ data.officialCategory }}</span>
                    <span class="custom-tree-node-right">
                      <template v-if="activeChannel !== 'wdt'">
                        <div class="custom-tree-node-right-company">
                          <div v-if="isCanUpdate(data)">
                            <el-select
                              :style="{ width: '200px' }"
                              v-model="data.platformCategoryCode"
                              :empty-values="[null, undefined]"
                              placeholder="请选择品类"
                              @change="changePlatformCategory(data)"
                            >
                              <el-option
                                v-for="dict in categoryList"
                                :key="dict.label"
                                :label="dict.label"
                                :value="dict.value"
                              />
                            </el-select>
                          </div>
                        </div>
                        <div class="custom-tree-node-right-opera">
                          <div v-if="isCanUpdate(data)">
                            <el-select
                              :style="{ width: '200px' }"
                              v-model="data.platformSubCategoryCode"
                              :empty-values="[null, undefined]"
                              placeholder="请选择二级品类"
                              @change="changePlatformCategory(data)"
                            >
                              <el-option
                                v-for="dict in subCategoryList(data.platformCategoryCode)"
                                :key="dict.label"
                                :label="dict.label"
                                :value="dict.value"
                              />
                            </el-select>
                          </div>
                        </div>
                      </template>

                      <template v-if="activeChannel === 'wdt'">
                        <div class="custom-tree-node-right-opera flex-1">
                          <div v-if="isCanUpdate(data)" class="flex-1">
                            <el-cascader
                              v-model="data.platformSubCategoryCode"
                              :options="productInfoData.categoryOptions"
                              :props="{ ...customProps, multiple: false, checkStrictly: true }"
                              placeholder="请选择货品类目"
                              collapse-tags
                              collapse-tags-tooltip
                              clearable
                              :style="{ width: '60%' }"
                              @change="changePlatformCategory(data)"
                            />
                          </div>
                        </div>
                      </template>
                    </span>
                  </span>
                </template>
              </el-tree>

              <div
                v-if="dataList.length === 0 && !loading"
                class="flex flex-col items-center justify-center pt-20px pb-40px"
              >
                <img class="mt30px w-200px" src="@/assets/imgs/empty/empty1.png" alt="" />
                <div class="mb24px text-[#909399] text-14px">暂无相关内容</div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div v-if="activeChannel !== 'Settings' && dataList.length > 0" class="tree-toggle-btn">
          <el-button link type="primary" @click="toggleTreeExpand" :loading="expandLoading">
            {{ isExpandAll ? '收起类目' : '展开类目' }}
            <el-icon class="el-icon--right">
              <component :is="isExpandAll ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
          </el-button>
        </div>
      </div>

      <div v-if="activeChannel === 'Settings'" class="table">
        <s-table
          ref="tableRef"
          stripe
          :columns="columns"
          :fetch="getGoodsList"
          :fetchParams="{
            isEffect: queryParams.status,
            goodsId: queryParams.goodsId
          }"
        />
      </div>
    </div>
  </ex-screen>
</template>

<script setup lang="tsx">
import { getIntDictOptions, DICT_TYPE } from '@/utils/dict'
import * as CategoryApi from '@/api/system/categoryMng'
import CategoryDetails from './details.vue'
import {
  getGoodsList,
  refreshSpecialGoodsCategory,
  refreshGoodsCategory
} from '@/api/system/categoryMng'
import GoodCard from '@/components/common/goods/goodCard.vue'
import { getUrlByTypeAndId, getStoreIcon } from '@/utils/index'
import useDrawer from '@/hooks/web/useDrawer'
import request from '@/config/axios'
import { productInfoStore } from '@/store/modules/productInfo'
import { customProps } from '@/views/supplier/supplierProduct/options'
import { debounce } from 'lodash-es'
import { nextFrameTick } from '@/utils/util'

defineOptions({ name: 'CategoryManage' })

const productInfoData = productInfoStore()
const { openDrawer } = useDrawer()
const message = useMessage()

// --- 搜索相关逻辑 ---

const queryParams = ref<any>({
  status: '1',
  goodsId: '',
  category: '',
  isMapping: ''
})

const tableRef = ref()

const statusList = ref<any[]>([
  { label: '全部', value: '3' },
  { label: '生效中', value: '1' },
  { label: '待生效', value: '4' },
  { label: '已作废', value: '2' }
])

// 搜索Schema配置
const platformSchema = [
  {
    field: 'category',
    label: '类目',
    component: 'Input',
    componentProps: { placeholder: '请输入类目', clearable: true }
  },
  {
    field: 'isMapping',
    label: '是否映射',
    component: 'Select',
    componentProps: {
      options: [
        { label: '是', value: '1' },
        { label: '否', value: '0' }
      ],
      clearable: true
    }
  }
]

const settingsSchema = [
  {
    field: 'goodsId',
    label: '商品ID',
    component: 'Input',
    componentProps: { placeholder: '请输入商品ID', clearable: true }
  },
  {
    field: 'status',
    label: '状态',
    component: 'Select',
    componentProps: { options: statusList.value, clearable: true },
    defaultValue: '1'
  }
]

const currentSchema = computed(() => {
  return activeChannel.value === 'Settings' ? settingsSchema : platformSchema
})

const onQueryChange = debounce(() => {
  if (activeChannel.value === 'Settings') {
    refreshTable()
  } else {
    getDeptList(activeChannel.value)
  }
}, 300)

// query-scheme / schemeForm 通过 inject(`${name}Form`) 依赖 page/onSearch/resetForm
// 这里补齐 provide，避免 schemeForm 内部 page.value 读取 undefined 导致报错
const page = ref<any>({ page: 1 })
const onSearch = () => onQueryChange()

provide('categoryManageForm', {
  page,
  onSearch,
  resetForm: () => {
    if (activeChannel.value === 'Settings') {
      queryParams.value = { status: '1', goodsId: '' }
      page.value = { ...page.value, page: 1 }
      refreshTable()
    } else {
      queryParams.value = { category: '', isMapping: '' }
      page.value = { ...page.value, page: 1 }
      getDeptList(activeChannel.value)
    }
  }
})

// --- Tabs & Tree 逻辑 ---

const channelTabs = [
  { label: '淘宝', name: 'TaoBao' },
  { label: '天猫', name: 'Tmall' },
  { label: '抖音', name: 'Douyin' },
  { label: '拼多多', name: 'Pdd' },
  { label: '单品设置', name: 'Settings' },
  { label: '旺店通', name: 'wdt' }
]
const activeChannel = ref('TaoBao')
const refTree = ref<any>(null)
const isExpandAll = ref(false)

// --- 优化后的 Tabs & Tree 逻辑 ---

const handleClick = async ({ props }) => {
  // 1. 重置查询参数
  if (props.name === 'Settings') {
    queryParams.value = { status: '1', goodsId: '' }
  } else {
    queryParams.value = { category: '', isMapping: '' }
  }

  // 2. 清空现有数据（避免 UI 闪烁旧数据）
  dataList.value = []
  isExpandAll.value = false

  // 3. 移除此处的 loading.value = true，避免 Settings 页签死锁

  await nextTick() // 使用 nextTick 即可，通常不需要 setTimeout

  // 4. 根据类型发起请求
  if (activeChannel.value === 'Settings') {
    refreshTable() // 表格通常内部自管理 loading
  } else {
    getDeptList(activeChannel.value) // 树形结构请求
  }
}

// --- 优化后的获取数据逻辑 ---

const getDeptList = async (channel) => {
  if (channel === 'Settings') return

  // 1. 在请求开始前开启 loading
  loading.value = true

  try {
    const params = {
      channel,
      category: queryParams.value.category,
      isMapping: queryParams.value.isMapping
    }
    const data = await CategoryApi.getTree(params)
    dataList.value = data || []

    // 处理树形数据
    handleTreeData(dataList.value)
    isLoadExpandKey.value = true
  } catch (error) {
    console.error('获取类目失败', error)
    dataList.value = [] // 出错时确保列表为空
  } finally {
    // 2. 无论成功或失败，最终都要关闭 loading
    loading.value = false
  }
}
const toggleTreeExpand = async () => {
  expandLoading.value = true
  await nextFrameTick()
  setTimeout(() => {
    try {
      isExpandAll.value = !isExpandAll.value
      const shouldExpand = isExpandAll.value
      const trees = Array.isArray(refTree.value) ? refTree.value : [refTree.value]
      trees.forEach((treeInstance: any) => {
        if (treeInstance && treeInstance.store && treeInstance.store.nodesMap) {
          const nodesMap = treeInstance.store.nodesMap
          for (const key in nodesMap) {
            nodesMap[key].expanded = shouldExpand
          }
        }
      })
    } catch (e) {
      console.error('Toggle Expand Error:', e)
    } finally {
      expandLoading.value = false
    }
  }, 100)
}

const dataList = ref<any>([])
const expandKey = ref<string[]>([])
const isLoadExpandKey = ref(false)
const defaultProps = ref({
  children: 'children',
  label: 'officialCategory'
})

// 字典相关
const categoryList = computed(() => {
  return [...getIntDictOptions(DICT_TYPE.STANDARD_CATEGORY, true), { label: '无', value: '无' }]
})
const categoryMap = ref({})
getIntDictOptions(DICT_TYPE.STANDARD_CATEGORY, true).forEach((category) => {
  categoryMap[category.label] = category.value
})

const subCategoryList = (platformSubCategoryCode) => {
  if (platformSubCategoryCode && platformSubCategoryCode !== '无') {
    const KEY = `STANDARD_CATEGORY_${platformSubCategoryCode}`
    return [...getIntDictOptions(DICT_TYPE[KEY], true), { label: '无', value: '无' }]
  }
  return [{ label: '无', value: '无' }]
}

// 独立的 loading 状态
const loading = ref(false)
const expandLoading = ref(false)

// 数据预处理 (递归替代 redrawTree)
const handleTreeData = (tree) => {
  if (!tree || !Array.isArray(tree)) return
  tree.forEach((item) => {
    if (activeChannel.value === 'wdt') {
      item['categories'] = []
      if (!item.platformCategoryCode && !item.platformSubCategoryCode) {
        item['categories'] = ['无', '无']
      } else {
        if (item.platformCategoryCode) item['categories'].push(item.platformCategoryCode)
        if (item.platformSubCategoryCode) item['categories'].push(item.platformSubCategoryCode)
      }
    }
    item.platformCategoryCode = item.platformCategoryCode || '无'
    item.platformSubCategoryCode = item.platformSubCategoryCode || '无'
    if (item.children) {
      handleTreeData(item.children)
    }
  })
}

const isCanUpdate = (data) => {
  return !data.children || data.children.length === 0
}

const changePlatformCategory = async (node) => {
  let { id, platformCategoryCode, platformSubCategoryCode, officialCategory } = node
  const query = {
    id,
    platformCategory: categoryList.value.find((item) => item.value === platformCategoryCode)?.label,
    platformSubCategory: subCategoryList(platformSubCategoryCode)?.find(
      (item) => item.value === platformSubCategoryCode
    )?.label,
    officialCategory,
    platformCategoryCode,
    platformSubCategoryCode
  }
  if (activeChannel.value === 'wdt') {
    query.platformSubCategoryCode = platformSubCategoryCode[platformSubCategoryCode.length - 1]
  }
  await CategoryApi.updatePlatformCategory(query)
  message.success('维护成功')
  getDeptList(activeChannel.value)
}

const nodeExpand = (data: any, _) => {
  if (!isExistExpandKey(data.id) && data.id) {
    expandKey.value.push(data.id as string)
  }
}

const nodeCollapse = (data, _) => {
  if (isExistExpandKey(data.id)) {
    removeExpandKey(data.id)
    data.children.forEach((item) => nodeCollapse(item, null))
  }
}

const isExistExpandKey = (id) => expandKey.value.includes(id)

const removeExpandKey = (id) => {
  expandKey.value = expandKey.value.filter((key) => key !== id)
}

const refreshTable = async () => {
  await nextTick()
  tableRef.value?.refresh(true)
}

const viewDetails = (row: any, type: string = 'edit') => {
  openDrawer({
    title: `${type === 'add' ? '新增' : '编辑'}单品设置`,
    size: 650,
    footer: true,
    content: () => CategoryDetails,
    props: { formType: type, row },
    onSuccess: () => refreshTable()
  })
}

const clickGoodCard = (row: any) => {
  if (row.goodsId) {
    getUrlByTypeAndId(row.channel, row.goodsId)
  }
}

async function refreshCategory() {
  if (activeChannel.value === 'Settings') {
    await refreshSpecialGoodsCategory()
    tableRef.value?.refresh(true)
  } else {
    await refreshGoodsCategory({ channel: activeChannel.value })
    getDeptList(activeChannel.value)
  }
  message.success('数据刷新成功')
}

// 表格列配置
const columns = ref([
  { prop: 'goodsId', label: '商品ID', minWidth: 120 },
  {
    prop: 'abbreviationCompany',
    label: '商品名称',
    minWidth: 160,
    customRender: ({ row }) => (
      <div
        class="goods-image-container flex items-center gap-6px cursor-pointer"
        onClick={() => clickGoodCard(row)}
      >
        <el-popover placement="right" width={348} trigger="hover" showArrow={false} offset={20}>
          {{
            default: () => (
              <GoodCard
                good={{
                  materialName: row.goodsName || row.goodsCode,
                  materialId: row.goodsId || row.goodsCode,
                  goodsImage: row.goodsImage,
                  channel: row.channel
                }}
              />
            ),
            reference: () => (
              <div class="goods-image-wrapper">
                <img
                  src={row.goodsImage}
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
  },
  {
    prop: 'shopName',
    label: '店铺',
    minWidth: 160,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }) => {
      const storeIcon = getStoreIcon(row.store)
      return (
        <div class="row-left flex items-center">
          {storeIcon && <img src={storeIcon} class="w-18px h-18px mr-6px" />}
          <div class="single-line">{row.storeName}</div>
        </div>
      )
    }
  },
  { prop: 'categoryName', label: '平台类目', minWidth: 220 },
  { prop: 'platformCategory', label: '标准一级类目', minWidth: 115 },
  {
    prop: 'platformSubCategory',
    label: '标准二级类目',
    minWidth: 115,
    customRender: ({ value }) => value ?? '-'
  },
  {
    label: '起止日期',
    minWidth: 160,
    customRender: ({ row }) =>
      row.beginDate && row.endDate ? `${row.beginDate} ~ ${row.endDate}` : '-'
  },
  {
    prop: 'isEffect',
    label: '状态',
    minWidth: 105,
    customRender: ({ value }) => (
      <el-tag type={value === '1' ? 'success' : value === '2' ? 'danger' : 'info'}>
        {statusList.value.find((item) => item.value === value)?.label || '-'}
      </el-tag>
    )
  },
  {
    prop: 'operation',
    label: '操作',
    fixed: 'right',
    width: 100,
    customRender: ({ row }) =>
      row.isEffect !== '2' ? (
        <div>
          <el-button link type="primary" onClick={() => viewDetails(row)} class="btn normal">
            编辑
          </el-button>
        </div>
      ) : (
        ''
      )
  }
])

// 类目树数据（当前页面未直接使用，但 getCategoryTree 会写入，需先声明避免 ReferenceError）
const categoryData = ref<any[]>([])

const processCategoryTree = (nodes: any[], parentId: string = '') => {
  if (!nodes || nodes.length === 0) return []
  const result: any[] = []

  nodes.forEach((node) => {
    if (node.subCategories && node.subCategories.length > 0) {
      const currentId = node.id || ''
      const safeId = `${currentId}_${parentId}`

      const newNode = {
        ...node,
        id: safeId,
        category: node.category,
        children: processCategoryTree(node.subCategories, currentId)
      }
      result.push(newNode)
    }
  })
  return result
}

const getCategoryTree = async () => {
  try {
    const res = await request.get({ url: `/api/sysCategory/queryCategoryTree` })
    const processedTree = processCategoryTree(res, 'root')
    const rootNode = [
      {
        category: '无',
        id: 'root_none',
        children: [{ category: '无', id: 'child_none' }]
      }
    ]
    categoryData.value = rootNode.concat(processedTree)
  } catch (error) {
    console.error('getCategoryTree error:', error)
    categoryData.value = []
  }
}

/** 初始化 **/
onMounted(() => {
  getCategoryTree()
  getDeptList(activeChannel.value)
})

onBeforeMount(() => {
  productInfoData.getCategoryOptions()
})
</script>

<style lang="less" scoped>
.operation-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.table {
  display: inline-block;
  width: 100%;
  margin: 10px 0 1px 0;
  .table_body {
    display: block;
  }
  .pagination {
    margin-top: 10px;
    float: right;
  }
}

.listWrapper {
  width: 100%;
  .tabs-container {
    position: relative;
    width: 100%;
    .tree-toggle-btn {
      position: absolute;
      right: 0;
      top: 10px;
      z-index: 10;
    }
  }
  .channel-tabs {
    :deep(.el-tabs__header) {
      margin-bottom: 0 !important;
    }
  }
  .title {
    height: 40px;
    background: #f2f3f5;
    font-weight: 500;
    .custom-tree-node-left {
      margin-left: 8px;
    }
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;
    font-size: 14px;
    color: #333333;
    height: 50px;
    &-left {
      display: inline-block;
      white-space: pre-wrap;
      word-break: break-all;
      word-wrap: break-word;
      text-align: left;
    }
    &-right {
      height: 50px;
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-right: -6px;
      width: 500px;
      &-company {
        margin-right: 50px;
        width: 140px;
        text-align: left;
        display: flex;
        justify-content: center;
        align-items: center;
        align-self: center;
      }
      &-opera {
        min-width: 200px;
        display: flex;
        align-self: center;
        align-items: center;
        &-line {
          margin-left: 2px;
          margin-right: 2px;
          width: 1px;
          height: 10px;
          background: #e5e7eb;
          border-radius: 1px;
        }
      }
    }
  }
  :deep(.el-tree-node__content) {
    height: 50px;
    border-bottom: 1px solid #e5e7eb;
  }
}

.operateBtn {
  font-size: 14px;
  color: var(--el-color-primary);
}
</style>
