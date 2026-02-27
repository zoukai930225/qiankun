<template>
  <ex-screen>
    <el-skeleton :loading="overviewLoading" animated>
      <template #template>
        <div class="statistics-cards">
          <div class="stat-card">
            <el-skeleton-item variant="rect" style="height: 60px; width: 100%" />
          </div>
          <div class="stat-card">
            <el-skeleton-item variant="rect" style="height: 60px; width: 100%" />
          </div>
          <div class="stat-card">
            <el-skeleton-item variant="rect" style="height: 60px; width: 100%" />
          </div>
          <div class="stat-card">
            <el-skeleton-item variant="rect" style="height: 60px; width: 100%" />
          </div>
        </div>
      </template>
      <template #default>
        <div class="statistics-cards">
          <div class="stat-card">
            <div class="card-label">全站总访问量 (PV)</div>
            <div class="card-content">
              <span class="main-value">{{ statsInfo.totalPv }}</span>
              <span class="sub-info">
                今日新增
                <span
                  :class="Number(statsInfo.todayNew) >= 0 ? 'trend-red trend' : 'trend-green trend'"
                >
                  {{ Number(statsInfo.todayNew) > 0 ? '+' : '' }}{{ statsInfo.todayNew }}
                </span>
              </span>
            </div>
          </div>

          <div class="stat-card">
            <div class="card-label">全站总访问用户数 (PV)</div>
            <div class="card-content">
              <span class="main-value">{{ statsInfo.totalUserPv }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="card-label">当前版本</div>
            <div class="card-content">
              <span class="main-value">{{ statsInfo.version }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="card-label">环比趋势</div>
            <div class="card-content">
              <span
                class="main-value"
                :class="{
                  'trend-red': Number(statsInfo.trend) > 0,
                  'trend-green': Number(statsInfo.trend) < 0
                }"
              >
                {{ Number(statsInfo.trend) > 0 ? '+' : '' }}{{ statsInfo.trend }}%

                <img v-if="Number(statsInfo.trend) > 0" :src="hbUp" class="trend-icon" />
                <img v-if="Number(statsInfo.trend) < 0" :src="hbDown" class="trend-icon" />
              </span>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>

    <div class="divider">
      <!-- <el-divider></el-divider> -->
    </div>

    <query-scheme
      :scheme="scheme"
      v-model="searchData"
      name="Visitorstatistics"
      :show-expand="false"
    />
    <scheme-table
      ref="tableRef"
      :handle-column="handleColumn"
      name="Visitorstatistics"
      :column="column"
      :table-data="dataList"
      :list-name="'系统访问列表'"
      :is-selection="false"
    />
    <visitorstatistics-details ref="detailsRef" />
  </ex-screen>
</template>

<script lang="tsx">
export default { name: 'Visitorstatistics' }
</script>

<script lang="tsx" setup>
import { usePage } from './config'
import VisitorstatisticsDetails from '../details/index.vue'
import { getMenuList } from '@/api/system/menu'
import {
  getArchiveList,
  getArchiveTotal,
  getListVersions
} from '@/api/system/statisticalAnalysis/visitorStatistics'
import { onMounted, provide, ref } from 'vue'
import hbUp from '@/assets/imgs/Bi/hb_up.svg'
import hbDown from '@/assets/imgs/Bi/hb_down.svg'

const detailsRef = ref<any>()
const menuOptions = ref<any[]>([])
const versionOptions = ref<Array<{ label: string; value: string }>>([])
// 给 config.tsx 用的“可延后绑定”的查询触发器
const searchTrigger = ref<null | (() => void)>(null)

const statsInfo = ref({
  totalPv: '0',
  todayNew: 0,
  totalUserPv: '0',
  version: '',
  trend: 0
})

// 总览Loading状态
const overviewLoading = ref(true)

// 趋势分析回调
const onTrend = (row: any) => {
  detailsRef.value?.openView(row, 'trend')
}

// 使用配置Hook
const {
  dataList,
  page,
  loading,
  scheme,
  searchData,
  column,
  handleColumn,
  setRouterInfo,
  resetForm,
  sortState
} = usePage({
  menuOptions,
  versionOptions,
  searchTrigger,
  onTrend
})

/**
 * 递归过滤菜单数据
 */
const filterMenuData = (list: any[]) => {
  if (!list || !list.length) return []
  const res: any[] = []
  list.forEach((item) => {
    // 1. 过滤 type = 3
    if (item.type === 3) return

    const newItem = { ...item }

    // 2. 递归处理子级
    if (newItem.children && newItem.children.length > 0) {
      newItem.children = filterMenuData(newItem.children)
    }

    // 3. 若处理后子级为空数组，则删除 children 属性
    if (newItem.children && newItem.children.length === 0) {
      delete newItem.children
    }

    // 4. 设置禁用状态: 若仍有子级 或 type === 1
    // if (newItem.type === 1) {
    //   newItem.disabled = true
    // }

    res.push(newItem)
  })
  return res
}

// 获取菜单列表
const getMenus = async () => {
  try {
    const res = await getMenuList({ menuEnv: 1 })
    menuOptions.value = filterMenuData(res || [])
  } catch (error) {
    console.error('获取菜单失败', error)
  }
}

const calcTrendPercent = (cur: number, prev: number) => {
  const c = Number(cur || 0)
  const p = Number(prev || 0)
  if (p <= 0) return c > 0 ? 100 : 0
  return Number((((c - p) / p) * 100).toFixed(2))
}

const formatNum = (n: any) => {
  const v = Number(n || 0)
  return Number.isFinite(v) ? v.toLocaleString() : '0'
}

const normalizeVersionKey = (v: string) => {
  const digits = String(v || '').replace(/\D/g, '')
  return digits ? Number(digits) : 0
}

const loadVersions = async () => {
  const list: any[] = (await getListVersions()) || []
  const versions = list.map((it: any) => String(it?.version || '')).filter(Boolean)

  const sorted = [...versions].sort((a, b) => normalizeVersionKey(b) - normalizeVersionKey(a))
  versionOptions.value = sorted.map((v) => ({ label: v, value: v }))

  // 默认选中最新版本
  if (!searchData.value.curVersion) {
    searchData.value.curVersion = sorted[0] || ''
  }
}

// 构建排序和筛选参数
const buildSortFilterParams = () => {
  const state = sortState?.value || {}
  const hasRange = (fv: any) =>
    fv && ((fv?.min !== '' && fv?.min != null) || (fv?.max !== '' && fv?.max != null))

  const activeField = Object.keys(state).find((k) => state[k]?.sort || hasRange(state[k]?.filter))
  if (!activeField) return {}

  const out: any = { sortField: activeField }
  if (state[activeField]?.sort) out.sortOrder = state[activeField].sort

  const fv = state[activeField]?.filter
  if (hasRange(fv)) {
    const min = fv?.min !== '' && fv?.min != null ? Number(fv.min) : undefined
    const max = fv?.max !== '' && fv?.max != null ? Number(fv.max) : undefined
    if (min != null && !Number.isNaN(min)) out.minValue = min
    if (max != null && !Number.isNaN(max)) out.maxValue = max
  }
  return out
}

const applyTotalToCards = (res: any) => {
  const total = res?.totalVisits ?? res?.total
  const totalUser = res?.totalvisitsIds ?? res?.allVisitUser
  const today = res?.curDayVisits ?? res?.today

  statsInfo.value.totalPv = formatNum(total)
  statsInfo.value.totalUserPv = formatNum(totalUser)
  statsInfo.value.version = String(res?.curVersion || searchData.value.curVersion || '')
  statsInfo.value.todayNew = Number(today || 0)

  if (res?.percent != null) {
    const p = String(res.percent).replace('%', '')
    const pv = Number(p)
    statsInfo.value.trend = Number.isFinite(pv) ? pv : 0
  } else {
    statsInfo.value.trend = calcTrendPercent(
      Number(res?.curVisits || 0),
      Number(res?.prevVisits || 0)
    )
  }
}

/**
 * [新增] 独立获取总览数据
 * 只在初始化时调用一次，不受后续搜索条件或版本切换影响
 */
const getOverview = async () => {
  overviewLoading.value = true
  try {
    // 使用初始化时的版本号（最新版本）获取一次总览
    const res = await getArchiveTotal({ curVersion: searchData.value.curVersion })
    applyTotalToCards(res)
  } catch (error) {
    console.error('获取总览失败', error)
  } finally {
    overviewLoading.value = false
  }
}

/**
 * [修改] 查询列表
 * 只负责列表数据的查询，不处理总览数据
 */
const onSearch = async () => {
  // 提取 menuId 并处理
  const rawMenuId = searchData.value.menuId
  const menuIdStr = Array.isArray(rawMenuId) ? rawMenuId.join(',') : ''

  const params: any = {
    menuId: menuIdStr, // 传递处理后的字符串给后端
    curVersion: searchData.value.curVersion,
    page: page.value.page,
    size: page.value.size,
    ...buildSortFilterParams()
  }

  loading.value = true
  try {
    const listRes: any = await getArchiveList(params)
    const records = listRes?.records || listRes?.list || []
    dataList.value = Array.isArray(records) ? records : []
    page.value.total = Number(listRes?.total || 0)
  } finally {
    loading.value = false
  }
}
// 绑定给 config.tsx，让排序/重置可以触发查询
searchTrigger.value = onSearch

const viewDetails = (type: string, item?: any) => {
  detailsRef?.value?.openView(item, type)
}

onMounted(() => {
  getMenus()
  loadVersions().finally(() => {
    // 1. 获取总览数据 (仅一次)
    getOverview()
    // 2. 获取列表数据
    onSearch()
  })
})

setRouterInfo()

provide('VisitorstatisticsForm', {
  searchData,
  dataList,
  page,
  loading,
  onSearch,
  viewDetails,
  resetForm
})
</script>

<style lang="scss" scoped>
@use './styles.scss';

.divider {
  margin-top: 20px;
}

:deep(.g-query) {
  .el-divider--horizontal {
    display: none;
  }
}

.statistics-cards {
  display: flex;
  width: 100%;
  gap: 20px;

  .stat-card {
    flex: 1;
    background: #ffffff;
    border: 1px solid #e5e5e5;
    border-radius: 8px;
    padding: 26px 30px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.02);

    .card-label {
      font-size: 14px;
      color: #666666;
      margin-bottom: 12px;
    }

    .card-content {
      display: flex;
      align-items: baseline;
      min-height: 24px;
      min-width: 1px;

      .main-value {
        font-size: 24px;
        font-weight: 500;
        color: #303133;
        line-height: 1;
        margin-right: 12px;
        display: inline-flex;
        align-items: center;

        &.text-normal {
          font-size: 20px;
        }
      }

      .sub-info {
        font-size: 12px;
        color: #909399;

        .trend {
          font-size: 14px;
        }
      }
    }
  }
}

/* 颜色工具类 */
.trend-red {
  color: #eb3737 !important;
}

.trend-green {
  color: #349b34 !important;
}

/* 图标样式 */
.trend-icon {
  width: 20px;
  height: 20px;
  margin-left: 10px;
  vertical-align: middle;
}
</style>
