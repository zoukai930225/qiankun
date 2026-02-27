<template>
  <teleport :to="TELEPORT_SELECTORS.searchRow">
    <s-w-search-form
      label-width="auto"
      :schema="searchSchema"
      :expand-threshold="4"
      :show-expand="false"
      auto-search-on-change
      @search="onSearch"
      @reset="onReset"
    >
      <el-button
        v-if="permissionSet.has('AssessmentConfiguration:Rule:Add')"
        type="primary"
        @click="onAdd"
      >
        <el-icon>
          <Plus />
        </el-icon>
        新增
      </el-button>
    </s-w-search-form>
  </teleport>

  <div v-if="records.length > 0" v-loading="loading" class="rule-cards">
    <div v-for="item in records" :key="item.id" class="rule-card">
      <div class="row">
        <div class="label">考核规则</div>
        <el-tooltip
          placement="top"
          :content="item.name"
          :disabled="!isOverflow(item.id, 'name')"
          :teleported="false"
          popper-class="rule-tooltip"
        >
          <div
            class="value name ellipsis"
            :ref="(el) => setTextRef(item.id, 'name', el as HTMLDivElement | null)"
          >
            {{ item.name }}
          </div>
        </el-tooltip>
      </div>

      <div class="row">
        <div class="label">运行状态</div>
        <div class="value">
          <el-switch v-model="item.running" @change="(v: boolean) => onToggle(item, v)" />
        </div>
      </div>

      <div class="row">
        <div class="label">创建类型</div>
        <div class="value">
          <el-tag type="warning" effect="light">{{
            item.createType === 1 ? '重复创建' : '单次创建'
          }}</el-tag>
        </div>
      </div>

      <div class="row">
        <div class="label">考核类型</div>
        <div class="value">{{ item.assessmentType }}</div>
      </div>

      <div class="row">
        <div class="label">考核维度</div>
        <div class="value">{{ item.dimension }}</div>
      </div>

      <div class="content-row">
        <div class="row" v-if="item.createType === 1">
          <div class="label">重复规则</div>
          <el-tooltip
            placement="top"
            :content="item.repeatRule"
            :disabled="!isOverflow(item.id, 'repeatRule')"
            :teleported="false"
            popper-class="rule-tooltip"
          >
            <div
              class="value ellipsis"
              :ref="(el) => setTextRef(item.id, 'repeatRule', el as HTMLDivElement | null)"
            >
              {{ item.repeatRule }}
            </div>
          </el-tooltip>
        </div>

        <div class="row" v-if="item.createType === 0">
          <div class="label">考核期</div>
          <el-tooltip
            placement="top"
            :content="item.period"
            :disabled="!isOverflow(item.id, 'period')"
            :teleported="false"
            popper-class="rule-tooltip"
          >
            <div
              class="value ellipsis"
              :ref="(el) => setTextRef(item.id, 'period', el as HTMLDivElement | null)"
            >
              {{ item.period }}
            </div>
          </el-tooltip>
        </div>

        <div class="row">
          <div class="label">考核时间</div>
          <el-tooltip
            placement="top"
            :content="item.timeRange"
            :disabled="!isOverflow(item.id, 'timeRange')"
            :teleported="false"
            popper-class="rule-tooltip"
          >
            <div
              class="value ellipsis"
              :ref="(el) => setTextRef(item.id, 'timeRange', el as HTMLDivElement | null)"
            >
              {{ item.timeRange }}
            </div>
          </el-tooltip>
        </div>

        <div class="row">
          <div class="label">问卷发布</div>
          <el-tooltip
            placement="top"
            :content="item.publishRule"
            :disabled="!isOverflow(item.id, 'publishRule')"
            :teleported="false"
            popper-class="rule-tooltip"
          >
            <div
              class="value ellipsis"
              :ref="(el) => setTextRef(item.id, 'publishRule', el as HTMLDivElement | null)"
            >
              {{ item.publishRule }}
            </div>
          </el-tooltip>
        </div>

        <div class="row">
          <div class="label">提醒时间</div>
          <el-tooltip
            placement="top"
            :content="item.remindRule"
            :disabled="!isOverflow(item.id, 'remindRule')"
            :teleported="false"
            popper-class="rule-tooltip"
          >
            <div
              class="value ellipsis"
              :ref="(el) => setTextRef(item.id, 'remindRule', el as HTMLDivElement | null)"
            >
              {{ item.remindRule }}
            </div>
          </el-tooltip>
        </div>
      </div>

      <div class="actions">
        <el-button
          v-if="permissionSet.has('AssessmentConfiguration:Rule:Delete')"
          type="danger"
          plain
          @click="onDelete(item)"
          >删除</el-button
        >
        <el-button
          v-if="permissionSet.has('AssessmentConfiguration:Rule:Copy')"
          plain
          @click="onCopy(item)"
          >复制</el-button
        >
        <el-button
          v-if="permissionSet.has('AssessmentConfiguration:Rule:Edit')"
          type="primary"
          plain
          @click="onEdit(item)"
          >编辑</el-button
        >
      </div>
    </div>
  </div>
  <div v-else>
    <Empty />
  </div>
  <!-- <teleport :to="TELEPORT_SELECTORS.footer">
    <SPagination
      v-if="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="onPageChange"
    />
  </teleport> -->
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { nextFrameTick } from '@/utils/util'
import { TELEPORT_SELECTORS } from '../config/teleport'
import { Plus } from '@element-plus/icons-vue'
import type { FormSchema } from '@/types/form'
// import SPagination from '@/components/SWTable/src/SPagination.vue'
import { useMessage } from '@/hooks/web/useMessage'
import useDrawer from '@/hooks/web/useDrawer'
import RuleEditForm from './ruleEditForm.vue'
import {
  getAssessmentRuleList,
  updateAssessmentRuleStatus,
  deleteAssessmentRule
} from '@/api/supplier/assessmentConfiguration'
import Empty from '@/components/SWTable/src/empty.vue'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import { getPermission } from '@/utils'

interface RuleItemVo {
  id: string
  name: string
  running: boolean
  createType: 0 | 1
  assessmentType: string
  dimension: string
  period: string
  timeRange: string
  repeatRule: string
  publishRule: string
  remindRule: string
}

const queryParams = ref<any>({
  ruleName: undefined
})
const total = ref<number>(0)
const records = ref<RuleItemVo[]>([])
const permissionSet = new Set(getPermission())

const ruleName = ref<string | undefined>(undefined)
const message = useMessage()
const loading = ref(false)
// 通知父组件：有状态变更，需刷新统计
const emit = defineEmits(['changed'])
const searchSchema: FormSchema[] = [
  {
    field: 'ruleName',
    label: '规则名称',
    component: 'Input',
    componentProps: { placeholder: '请输入规则名称', clearable: true }
  }
]

function mapRuleToVo(it: any): RuleItemVo {
  const assessmentTypeCode = it?.assessmentType
  const dimensionCode = it?.dimension
  const assessmentTypeLabel = getDictLabel(DICT_TYPE.SUPPLIER_ASSESSMENT_TYPE, assessmentTypeCode)
  const dimensionLabel = getDictLabel(DICT_TYPE.SUPPLIER_ASSESSMENT_DIMENSION, dimensionCode)
  return {
    id: String(it?.id ?? ''),
    name: it?.ruleName ?? '-',
    running: (it?.status ?? 0) === 1,
    createType: Number(it?.quizCreateType ?? 0) as 0 | 1,
    assessmentType: assessmentTypeLabel || assessmentTypeCode || '-',
    dimension: dimensionLabel || dimensionCode || '-',
    period: it?.period ?? '-',
    timeRange: it?.timeRange ?? '-',
    repeatRule: it?.repeatRule ?? '-',
    publishRule: it?.quizSend ?? '-',
    remindRule: it?.quizNotifyTime ?? '-'
  }
}

async function fetchList() {
  loading.value = true
  try {
    const res: any = await getAssessmentRuleList(queryParams.value)
    const arr = res || []
    total.value = Array.isArray(arr) ? arr.length : Number(res?.total ?? 0)
    records.value = (arr || []).map((it: any) => mapRuleToVo(it))
    await nextTick()
    recomputeAllOverflows()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

function refresh() {
  nextFrameTick().then(() => fetchList())
}

// 无分页

function onSearch(model: Record<string, any>) {
  ruleName.value = model?.ruleName || undefined
  queryParams.value.ruleName = ruleName.value
  refresh()
}

function onReset() {
  // ruleName.value = undefined
  // queryParams.value.ruleName = undefined
  // refresh()
}

function onAdd() {
  const { openDrawer } = useDrawer()
  openDrawer({
    title: '新增',
    content: RuleEditForm,
    props: { model: null },
    showConfirmFooter: true,
    width: '1050px',
    confirmText: '保存',
    cancelText: '取消',
    on: {
      success: (_data: RuleItemVo) => {
        refresh()
        emit('changed')
      }
    }
  })
}

function onEdit(row: RuleItemVo) {
  const { openDrawer } = useDrawer()
  openDrawer({
    title: '编辑',
    content: RuleEditForm,
    props: { model: row },
    showConfirmFooter: true,
    width: '1050px',
    confirmText: '保存',
    cancelText: '取消',
    on: {
      success: () => {
        // const idx = records.value.findIndex((r) => r.id === row.id)
        // if (idx > -1) {
        //   records.value.splice(idx, 1, { ...row, ...data })
        // }
        fetchList()
        emit('changed')
      }
    }
  })
}

function onCopy(row: RuleItemVo) {
  const { openDrawer } = useDrawer()
  // 打开抽屉，复制：清空“考核规则、创建类型”，其他保留
  const copyModel = {
    ...row,
    id: undefined as any,
    name: '',
    createType: undefined as any,
    copyFromId: row.id
  }
  openDrawer({
    title: '复制',
    content: RuleEditForm,
    props: { model: copyModel },
    showConfirmFooter: true,
    width: '1050px',
    confirmText: '保存',
    cancelText: '取消',
    on: {
      success: (_data: RuleItemVo) => {
        fetchList()
        emit('changed')
      }
    }
  })
}

async function onDelete(row: RuleItemVo) {
  try {
    await message.delConfirm('确认删除该考核规则吗？')
    await deleteAssessmentRule({ id: row.id })
    message.success('删除成功')
    fetchList()
    emit('changed')
  } catch (e) {
    // 用户取消或请求失败时不额外处理
  }
}

async function onToggle(row: RuleItemVo, val: boolean) {
  try {
    await updateAssessmentRuleStatus({ id: row.id, status: val ? 1 : 0 })
    row.running = val
    emit('changed')
  } catch (e) {
    // 失败回滚
    row.running = !val
    console.error(e)
  }
}

// 溢出测量：仅当文本单行溢出时展示 tooltip（通用）
const textElMap = new Map<string, HTMLDivElement>()
const overflowMap = ref<Record<string, boolean>>({})

function buildOverflowKey(id: string, field: string) {
  return `${id}::${field}`
}

function setTextRef(id: string, field: string, el: HTMLDivElement | null) {
  const key = buildOverflowKey(id, field)
  if (el) {
    textElMap.set(key, el)
  } else {
    textElMap.delete(key)
  }
}

function isOverflow(id: string, field: string) {
  const key = buildOverflowKey(id, field)
  return !!overflowMap.value[key]
}

function computeOverflow(el: HTMLDivElement) {
  // 单行省略判断：内容实际宽度大于可见宽度
  return el.scrollWidth > el.clientWidth
}

function recomputeAllOverflows() {
  const next: Record<string, boolean> = {}
  for (const [key, el] of textElMap.entries()) {
    if (el) next[key] = computeOverflow(el)
  }
  overflowMap.value = next
}

watch(records, async () => {
  await nextTick()
  recomputeAllOverflows()
})

function handleResize() {
  recomputeAllOverflows()
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  fetchList()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

defineExpose({ refresh })
</script>
<style scoped lang="scss">
.rule-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, 390px);
  gap: 16px;
  font-size: 14px;
}

.rule-card {
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  padding: 16px 0;
  box-sizing: border-box;
  background: #fcfcfd;
  :deep(.el-tag) {
    border-radius: 156px;
  }
}

.row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 16px;
  padding: 0 16px;
}

.label {
  width: 56px;
  color: #666;
  flex: 0 0 auto;
}

.value {
  color: #333;
  line-height: 18px;
}

.name {
  max-width: 100%;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.actions {
  display: flex;
  justify-content: flex-end;
  // gap: 8px;
  margin-top: 16px;
  padding: 0 16px;
  .el-button + .el-button {
    margin-left: 16px;
  }
}

:deep(.el-tooltip) {
  max-width: 380px !important;
  white-space: normal;
  word-break: break-word;
  text-align: left;
}

.pager {
  display: flex;
  justify-content: flex-end;
}

.content-row {
  padding-top: 16px;
  background: #f8fafb;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  // min-height: 188px;
  box-sizing: border-box;
}
</style>
