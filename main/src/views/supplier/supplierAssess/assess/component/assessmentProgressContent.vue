<template>
  <el-card ref="contentRef" v-loading="isLoading" shadow="never" class="!border-0 rounded-8px">
    <slot name="preContent"></slot>
    <!-- 空状态处理 -->
    <template v-if="progressInfo.length === 0 && !isLoading">
      <div class="empty-state">
        <el-empty :description="`暂无${title}数据`" />
      </div>
    </template>

    <!-- 进度卡片列表 -->
    <el-card
      v-for="(progress, index) in progressInfo"
      :key="getProgressKey(progress)"
      shadow="never"
      class="!bg-#f9f9f9 rounded-8px content mb-4"
      :class="{ hide: !expends[index] }"
    >
      <template #header>
        <div class="flex items-center">
          <span>{{ progress[0].assessmentModuleName }}</span>

          <!-- 总分显示 -->
          <span v-if="getScoreStatus(progress)?.value" class="ml-2">
            （总分:{{ getSumMaxScore(progress) }}分）
          </span>

          <!-- 状态标签 -->
          <div
            class="status ml-4 text-sm px-2 py-1"
            :style="{
              color: getScoreStatus(progress)?.color,
              backgroundColor: getScoreStatus(progress)?.bg
            }"
          >
            {{ getScoreStatus(progress)?.label }}
          </div>

          <!-- 得分显示 -->
          <span class="ml-auto text-sm text-[#0064ff] mr-10px fw-600">
            得分：{{ getSumScore(progress) || '--' }}
          </span>
        </div>
      </template>

      <!-- 考核人员列表 -->
      <div class="assess-persons">
        <div
          v-for="person in getAssessPersons(progress)"
          :key="person?.userId"
          class="order-handler-item flex items-center"
        >
          <el-avatar class="mr-2" :size="18" :src="person?.avatarOrigin ?? DEFAULT_AVATAR" />
          <div class="name text-sm">{{ person?.name ?? '——' }}</div>
        </div>
      </div>

      <!-- 考核项目详情 -->
      <div class="assessment-details mt-3">
        <div v-for="item in progress" :key="item.id" class="assessment-item mb-3">
          <el-form
            :model="item"
            :rules="rules[item.id!]"
            :ref="(ele: FormInstance) => (formRefs[item.id!] = ele)"
            :style="{ transform: 'translateY(8px)' }"
            scroll-to-error
          >
            <div class="title font-normal h-[40px] bg-#E5E5E5 p-[10px] flex items-center">
              <span>{{ item.assessmentItemName }}</span>
              <span class="ml-2">（分值：{{ item.maxScore }}分）</span>
              <span class="ml-auto text-sm text-[#0064ff]">
                <el-form-item
                  v-if="isAssessPerson(item)"
                  prop="score"
                  :style="{ transform: 'translateY(8px)' }"
                >
                  <template #label>
                    <span class="w-3em text-[#0064ff]">得分：</span>
                  </template>

                  <sw-input-number
                    v-model="item.score"
                    :style="{ width: '80px' }"
                    :max="item.maxScore"
                  />
                </el-form-item>

                <span v-else>
                  <span class="w-3em">得分：</span>
                  <span>{{ item.score ?? '--' }}</span>
                </span>
              </span>
            </div>

            <!-- 规则内容，带展开/折叠动画 -->
            <div
              :style="{
                opacity: expends[index] ? 1 : 0,
                'white-space': 'pre-line',
                'word-break': 'break-all'
              }"
              class="mt-[14px] text-[#666] text-sm overflow-hidden transition-all duration-300"
            >
              {{ item.rules?.replace(/\\n/g, '\n') }}

              <el-form-item v-if="item.comment || isAssessPerson(item)" prop="comment">
                <s-text-area
                  v-model="item.comment"
                  :readonly="!isAssessPerson(item)"
                  :rows="5"
                  placeholder="请输入备注"
                  class="mt-12px"
                />
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>

      <!-- 展开/折叠按钮 -->
      <template #footer>
        <div class="flex items-center justify-center">
          <el-button @click="toggleExpand(index)" type="primary" link class="ml-[12px]">
            <img
              src="@/assets/svgs/supplier/zhankai.svg"
              class="mr-[4px] transition-transform duration-300"
              :style="{ transform: expends[index] ? 'rotate(0)' : 'rotate(180deg)' }"
            />
            {{ expends[index] ? '收起' : '展开' }}
          </el-button>
        </div>
      </template>
    </el-card>

    <el-card
      v-if="assessScoreInfo?.length"
      shadow="never"
      class="!bg-#f9f9f9 rounded-8px content mb-4"
      :class="{ hide: !expends[expends.length - 1] }"
    >
      <template #header>
        <div class="flex items-center">
          <span>加减分项</span>

          <!-- 得分显示 -->
          <span class="ml-auto text-sm text-[#0064ff] mr-10px fw-600">
            得分：{{ getSumScore2(assessScoreInfo) || '--' }}
          </span>
        </div>
      </template>

      <!-- 考核项目详情 -->
      <div class="assessment-details">
        <div v-for="item in assessScoreInfo" :key="item.id" class="assessment-item mb-3">
          <div class="title font-normal h-[40px] bg-#E5E5E5 p-[10px] flex items-center">
            <span>{{ item.name }}</span>
            <span class="ml-2">（{{ item.type === 1 ? '加分项' : '减分项' }}）</span>
            <span
              class="ml-auto text-sm"
              :style="{ color: item.type === 1 ? '#EB3737' : '#349B34' }"
            >
              得分：{{ item.type === 1 ? '+' : '-' }}{{ item.score ?? '--' }}
            </span>
          </div>

          <!-- 规则内容，带展开/折叠动画 -->
          <div
            :style="{
              opacity: expends[expends?.length - 1] ? 1 : 0,
              'white-space': 'pre-line',
              'word-break': 'break-all'
            }"
            class="mt-[14px] text-[#666] text-sm overflow-hidden transition-all duration-300"
          >
            {{ item.rule?.replace(/\\n/g, '\n') }}

            <!-- 备注 -->
            <s-text-area
              v-if="item.comment"
              :model-value="item.comment"
              readonly
              :rows="5"
              class="mt-12px"
            />
          </div>
        </div>
      </div>

      <!-- 展开/折叠按钮 -->
      <template #footer>
        <div class="flex items-center justify-center">
          <el-button
            @click="toggleExpand(expends?.length - 1)"
            type="primary"
            link
            class="ml-[12px]"
          >
            <img
              src="@/assets/svgs/supplier/zhankai.svg"
              class="mr-[4px] transition-transform duration-300"
              :style="{ transform: expends[expends.length - 1] ? 'rotate(0)' : 'rotate(180deg)' }"
            />
            {{ expends[expends?.length - 1] ? '收起' : '展开' }}
          </el-button>
        </div>
      </template>
    </el-card>
  </el-card>
</template>

<script lang="ts">
// 类型定义
export interface Props {
  rowData: Supplier.Assess.SupplierAssessmentQuizVo
  title?: string
  editable?: boolean
  api?: (params: any) => Promise<any>
  /** 是否在考核期内 */
  isInTime?: boolean
}

export interface Emit {
  (e: 'update:model-value', value: boolean): void
}
</script>
<script lang="ts" setup>
import STextArea from '@/components/common/input/s-textarea.vue'
import { supplierAssessmentQueryAssessmentProgressApi } from '@/api/supplier/assess'
import { assessUserNumOps } from '../option'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'
import { CardInstance, ElEmpty, FormInstance, FormRules } from 'element-plus'

const DEFAULT_AVATAR = DefaultAvatar

// Props和Emit
const props = withDefaults(defineProps<Props>(), {
  title: '考核进度',
  api: supplierAssessmentQueryAssessmentProgressApi,
  isInTime: true
})
const emit = defineEmits<Emit>()

// 状态管理
const progressInfo = ref<Supplier.Assess.SupplierAssessmentQuizDetailDto[][]>([])
const assessScoreInfo = ref<Supplier.Assess.SupplierAssessmentQuizDetailDto[]>([])
const expends = ref<boolean[]>([])
const isLoading = ref(false)
const requestAbortController = ref<AbortController | null>(null)
const rules = ref<Record<string, FormRules>>({})
const formRefs = ref<Record<string, FormInstance>>({})
const originData = ref<any[]>()
const contentRef = ref<CardInstance>()

// 计算总分
const getSumMaxScore = (progress: Supplier.Assess.SupplierAssessmentQuizDetailDto[]) => {
  return progress.reduce((sum, item) => sum + (item.maxScore ?? 0), 0)
}

// 计算得分
const getSumScore = (progress: Supplier.Assess.SupplierAssessmentQuizDetailDto[]) => {
  return progress.reduce((sum, item) => sum + (item.score ?? 0), 0)
}

const getSumScore2 = (progress: Supplier.Assess.SupplierAssessmentQuizDetailDto[]) => {
  return progress.reduce(
    (sum, item) => (item.type === 1 ? sum + (item.score ?? 0) : sum - (item.score ?? 0)),
    0
  )
}

// 获取进度状态
const getScoreStatus = (progress: Supplier.Assess.SupplierAssessmentQuizDetailDto[]) => {
  const hasScore = !!getSumScore(progress)
  return assessUserNumOps.find((ele) => ele.value === hasScore)
}

// 获取考核人员
const getAssessPersons = (progress: Supplier.Assess.SupplierAssessmentQuizDetailDto[]) => {
  // 去重处理
  const persons = progress.map((item) => item.assessmentUser).filter(Boolean)
  return [...new Map(persons.map((p) => [p!.userId, p])).values()]
}

// 判断当前用户是不是当前考核模块的审核人
function isAssessPerson(progressItem: Supplier.Assess.SupplierAssessmentQuizDetailDto) {
  return progressItem.ratable && props.isInTime
}

// 获取进度项唯一标识（替代index作为key）
const getProgressKey = (progress: Supplier.Assess.SupplierAssessmentQuizDetailDto[]) => {
  return progress[0]?.assessmentItemId ?? progress[0]?.id
}

// 切换展开/折叠状态
const toggleExpand = (index: number) => {
  expends.value[index] = !expends.value[index]
}

// 分组函数（flatMap逆向操作）
function reverseFlatMap<T, K>(array: T[], groupFn: (item: T, index: number) => K): T[][] {
  const groups = new Map<K, T[]>()

  array.forEach((item, index) => {
    const key = groupFn(item, index)
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)?.push(item)
  })

  return Array.from(groups.values()).map((ele) =>
    ele.sort((a: any, b: any) => a.assessmentItemSort - b.assessmentItemSort)
  )
}

// 表单校验方法
async function validate() {
  try {
    if (!originData.value) return true

    const validateRes = await Promise.all(
      originData.value.map((item) => {
        return formRefs.value[item.id].validate()
      })
    )

    return validateRes
  } catch (error: any) {
    // 展开所有
    expends.value = expends.value.map(() => true)
    // 定位报错位置
    const firstErrorItem = (contentRef.value?.$el as HTMLElement).querySelector('.is-error')
    nextTick(() => {
      firstErrorItem?.scrollIntoView(true)
    })
    // 抛出错误中断
    throw new Error(error.score[0].message)
  }
}
//
async function resetField() {
  originData.value?.forEach((item) => {
    nextTick(() => {
      formRefs.value[item.id].clearValidate()
    })
  })
}

// 获取详情数据
async function getDetail() {
  // 清除之前的请求
  if (requestAbortController.value) {
    requestAbortController.value.abort()
  }

  const abortController = new AbortController()
  requestAbortController.value = abortController

  const quizId = props.rowData?.quizId ?? props.rowData?.id

  if (!quizId) {
    progressInfo.value = []
    return
  }

  try {
    isLoading.value = true
    const res = await props.api(quizId)

    originData.value = res

    // 处理数据分组
    progressInfo.value = reverseFlatMap<any, () => void>(
      [...(res?.quizDetailDtos ?? res)],
      (item) => {
        return item.assessmentModuleName
      }
    )

    rules.value = Object.fromEntries(
      (res.quizDetailDtos ?? res).map((ele) => [
        ele.id,
        { score: { required: true, message: '请输入' } }
      ])
    )

    assessScoreInfo.value = res?.quizExtraScoreDtos

    // 初始化展开状态
    expends.value = (
      assessScoreInfo.value ? [...progressInfo.value, ...assessScoreInfo.value] : progressInfo.value
    ).map(() => false)
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('请求已取消')
      return
    }
    console.error('获取考核进度失败:', error)
    progressInfo.value = []
  } finally {
    isLoading.value = false
    resetField()
  }
}

function expendClose() {
  expends.value.forEach((ele) => (ele = false))
  expends.value = []
}

// 组件卸载前清理
onBeforeUnmount(() => {
  if (requestAbortController.value) {
    requestAbortController.value.abort()
  }
})

defineExpose({ getDetail, progressInfo, validate, expendClose })
</script>
<style lang="less" scoped>
@import url(../../../index.scss);

// 空状态样式
.empty-state {
  padding: 40px 0;
  text-align: center;
}

// 卡片样式
.content {
  margin-bottom: 12px;

  :deep(.el-card__header) {
    padding: 15px;
    padding-bottom: 10px;
  }

  :deep(.el-card__body) {
    padding: 15px;
    overflow: hidden;
    box-sizing: border-box;
    transition: all 0.3s ease;
  }

  :deep(.el-card__footer) {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}

// 隐藏状态
.hide {
  :deep(.el-card__body) {
    padding-top: 0;
    padding-bottom: 0;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
  }

  :deep(.el-card__footer) {
    border-top: 0;
  }
}

// 标题样式
.title {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;

  &::before {
    content: '';
    display: block;
    margin-right: 6px;
    width: 3px;
    height: 10px;
    background-color: #0064ff;
  }
}

// 考核人员样式
.assess-persons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 5px 0;
}

.order-handler-item {
  align-items: center;
}

.assessment-item {
  margin-bottom: 15px;

  &:last-child {
    margin-bottom: 0;
  }
}

// 状态标签样式
.status {
  border-radius: 14px;
  font-size: 14px;
}
</style>
