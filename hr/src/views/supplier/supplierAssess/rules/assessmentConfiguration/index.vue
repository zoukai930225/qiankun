<template>
  <flux-wrap>
    <template #header>
      <div class="kpi-header">
        <div
          v-for="(card, idx) in cards"
          :key="card.key"
          class="kpi-card"
          :class="{ active: activeKey === card.key }"
          @click="openCard(card, idx)"
        >
          <div class="kpi-title">{{ card.title }}</div>
          <div class="kpi-value">
            <span class="kpi-value-text">{{ formatValue(card.value) }}</span>
          </div>
          <div class="kpi-img">
            <el-image :src="card.imgUrl" />
          </div>
        </div>
      </div>
      <div class="tab-row">
        <el-tabs v-model="activeTab">
          <el-tab-pane v-for="tab in tabs" :key="tab.name" :name="tab.name" :label="tab.label" />
        </el-tabs>
      </div>

      <div class="search-row">
        <div :id="TELEPORT_IDS.searchRowId"></div>
      </div>
    </template>
    <component
      v-if="isContainerReady && tabs.length"
      :is="activeTab === 'rule' ? AssessmentRulesSetting : RelatedInformationSettings"
      ref="childRef"
      @changed="refreshStatistics"
    />
    <template v-if="activeTab === 'link'" #footer>
      <div :id="TELEPORT_IDS.footerId"></div>
    </template>
  </flux-wrap>
</template>
<script lang="tsx" setup>
import { ref, defineAsyncComponent, nextTick, watch, onMounted } from 'vue'
import { FluxWrap } from '@/components/ContentWrap'
import { useDialog } from '@/hooks/web/useDialog'
import RelatedInformationSettings from './components/relatedInformationSettings.vue'
import AssessmentRulesSetting from './components/assessmentRulesSetting.vue'
import { TELEPORT_IDS } from './config/teleport'
import { getAssessmentStatistics } from '@/api/supplier/assessmentConfiguration'
import invited from '@/assets/svgs/supplier/assessment/invited.svg'
import related from '@/assets/svgs/supplier/assessment/related.svg'
import unrelated from '@/assets/svgs/supplier/assessment/unrelated.svg'
import participated from '@/assets/svgs/supplier/assessment/participated.svg'
import unparticipated from '@/assets/svgs/supplier/assessment/unparticipated.svg'
import { getPermission } from '@/utils'
// 子组件承载搜索，父级仅提供 teleport 容器

const permissionSet = new Set(getPermission())

const isContainerReady = ref(false)

interface KpiCardItem {
  key: string
  title: string
  value: number | string
  imgUrl: string
}

// /api/saConfig/statistics 返回结构
interface AssessmentStatisticsVo {
  passedNum?: number // 验厂通过数
  assessmentNum?: number // 已关联考核的供应商数
  unAssessmentNum?: number // 未关联考核的供应商数
  participatedNum?: number // 已参与考核供应商
  waitParticipatedNum?: number // 待参与考核供应商
}

const cards = ref<KpiCardItem[]>([
  { key: 'invited', title: '验厂已通过供应商', value: 0, imgUrl: invited },
  { key: 'related', title: '已关联供应商', value: 0, imgUrl: related },
  { key: 'unrelated', title: '未关联供应商', value: 0, imgUrl: unrelated },
  { key: 'participated', title: '已参与考核供应商', value: 0, imgUrl: participated },
  { key: 'unparticipated', title: '未参与考核供应商', value: 0, imgUrl: unparticipated }
])

function formatValue(val: number | string): string {
  const n = Number(val)
  if (!Number.isFinite(n)) return String(val ?? '-')
  return n.toLocaleString()
}

const { openDialog } = useDialog()
const CardDetail = defineAsyncComponent(() => import('./components/cardDetail.vue'))
// 子组件已承载模块列表弹窗

function openCard(card: KpiCardItem, index: number) {
  activeKey.value = card.key
  openDialog({
    title: card.title,
    width: '1000px',
    content: CardDetail,
    props: { list: cards.value, activeKey: card.key, activeIndex: index },
    showConfirmFooter: false,
    onClose: () => {
      activeKey.value = null
    },
    onClosed: () => {
      activeKey.value = null
    }
  })
}

const activeKey = ref<string | null>(null)

function applyStatisticsToCards(stats: AssessmentStatisticsVo) {
  const mapping: Record<string, number | undefined> = {
    invited: stats?.passedNum,
    related: stats?.assessmentNum,
    unrelated: stats?.unAssessmentNum,
    participated: stats?.participatedNum,
    unparticipated: stats?.waitParticipatedNum
  }
  cards.value = cards.value.map((c) => ({
    ...c,
    value: mapping[c.key] ?? 0
  }))
}

async function refreshStatistics() {
  try {
    const res: any = await getAssessmentStatistics({})
    const data: AssessmentStatisticsVo = (res && (res.data ?? res)) || {}
    applyStatisticsToCards(data)
  } catch (e) {
    // 忽略错误提示，保持界面可用
  }
}

// tabs
const tabs = computed(() => {
  const origin = [
    { name: 'link', label: '关联信息设置', permission: 'AssessmentConfiguration:Link' },
    { name: 'rule', label: '考核规则设置', permission: 'AssessmentConfiguration:Rule' }
  ]

  return origin.filter((ele) => permissionSet.has(ele.permission))
})
const activeTab = ref<string>('link')
watch(
  activeTab,
  (current) => {
    if (current === 'rule') {
      queryParams.value = {
        page: 1,
        pageSize: 10,
        keyword: undefined
      }
    } else {
      queryParams.value = {
        page: 1,
        pageSize: 10,
        abbreviationCompany: undefined,
        fullCompany: undefined,
        supplierType: undefined,
        keyword: undefined
      }
    }
    nextTick(() => {
      refreshTable(true)
    })
  },
  { immediate: false }
)

// child table
const childRef = ref()
const queryParams = ref<any>({
  page: 1,
  pageSize: 10,
  abbreviationCompany: undefined,
  fullCompany: undefined,
  supplierType: undefined,
  keyword: undefined
})

// remove in parent: columns and fetch are handled in child

function refreshTable(toFirstPage = false) {
  if (toFirstPage) queryParams.value.page = 1
  nextTick(() => childRef.value?.refresh?.(toFirstPage))
}

onMounted(() => {
  refreshStatistics()
  nextTick(() => {
    isContainerReady.value = true
  })
})

// 搜索交互由子组件内部处理
</script>
<style scoped lang="less">
.tab-row {
  margin-bottom: 8px;
}

.kpi-header {
  display: flex;
  gap: 16px;
}

.kpi-card {
  cursor: pointer;
  min-width: 220px;
  flex: 1 0 auto;
  padding: 16px;
  border-radius: 8px;
  /* 应用/灰色底色 */
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  /* 应用/边框 */
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease;
  position: relative;

  .active {
    border: 1px solid #687FF3;
    background: linear-gradient(179deg, #ffffff 3%, #f4f5fc 97%);

    &::after {
      content: '';
      display: block;
      width: 24px;
      height: 3px;
      background: linear-gradient(
        90deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(104, 127, 243, 0.4) 25%,
        rgba(104, 127, 243, 0.4) 78%,
        rgba(255, 255, 255, 0) 100%
      );

      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 10px;
    }
  }

  &.active {
    .active();
  }

  &:active {
    .active();
  }

  &:hover {
    .active();

    border: 1px solid rgba(104, 127, 243, 0.2);
    background: linear-gradient(179deg, #FFFFFF 3%, #F4F5FC 96%);
    box-shadow: 0 4px 10px 0 #00000020;
  }

  & .kpi-img {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 38px;
    height: 38px;
    border-radius: 6px;
    background: #eff3ff;

    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 16px;
  }
}

.kpi-title {
  color: #666;
  font-size: 14px;
  line-height: 18px;
  margin-bottom: 22px;
}

.kpi-value {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #333;
  font-size: 24px;
  font-weight: 500;

  .unit {
    font-size: 14px;
    color: #666;
  }

  // height: 36px;
}

.kpi-trend {
  color: #a6a6a6;
  font-size: 14px;
}

:deep(.sw-search) {
  .el-form {
    .half-label {
      .el-form-item__label {
        line-height: 32px !important;
      }
    }
  }
}
</style>
