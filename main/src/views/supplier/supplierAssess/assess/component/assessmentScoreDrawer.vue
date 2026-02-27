<template>
  <s-w-drawer
    :model-value="modelValue"
    title="加减赋分"
    :width="width"
    append-to-body
    @open="handleOpen"
    @closed="handleClosed"
  >
    <div class="mr--20px overflow-x-hidden">
      <div :style="{ transform: transform }" class="content flex w-[calc(200%)]">
        <el-card shadow="never" class="!border-0 rounded-8px mr-20px flex-1">
          <template #header>
            <div class="flex items-center justify-end">
              <el-button
                class="mr-auto"
                v-if="
                  (rowData.assessmentStatus === '1' || Manangerment) &&
                  permissionSet.has('SupplierAssess:Check:Score:Add')
                "
                type="primary"
                @click="handleAdd"
              >
                <Icon class="mr4px" icon="ep:plus" />添加分值
              </el-button>
              <el-button
                v-if="permissionSet.has('SupplierAssess:Check:Score:Log')"
                class="ml-auto"
                type="primary"
                link
                @click="handleLog"
              >
                操作记录
              </el-button>
            </div>
          </template>

          <sw-table border :options="scoreTableOption" :data="tableData" :loading="loading">
            <template #options="{ row, index }">
              <s-w-table-btns
                ref="swTableBtnsRef"
                :row="row"
                :options="btnsOptions[index] || []"
                :row-index="index"
              />
            </template>
          </sw-table>
        </el-card>

        <quiz-extra-score-log
          :quizId="rowData.id || ''"
          ref="logRef"
          @back="transform = 'translateX(0%)'"
        />
      </div>
    </div>

    <template #footer>
      <el-button @click="handleClosed">取消</el-button>
    </template>
  </s-w-drawer>

  <add-assess-score-dialog
    v-model:model-value="addScoreDialogProp.modelValue"
    v-model:row-data="addScoreDialogProp.rowData"
    :title="addScoreDialogProp.title"
    :quizId="addScoreDialogProp.quizId"
    @refresh="handleRefresh"
  />
</template>
<script lang="ts" setup>
import {
  supplierAssessmentDeleteQuizExtraScoreApi,
  supplierAssessmentPageQuizExtraScoreApi
} from '@/api/supplier/assess'
import SwTable from '../../../components/table.vue'
import { scoreTable } from '../option'
import { AuditBtn } from '@/views/supplier/changeAudit/option'
import AddAssessScoreDialog from './addAssessScoreDialog.vue'
import QuizExtraScoreLog from './quizExtraScoreLog.vue'
import { toReactive } from '@vueuse/core'
import { useRole } from '@/hooks/common/useRole'
import { getPermission } from '@/utils'

const message = useMessage()
const permissionSet = new Set(getPermission())

const { grabCheck, getPermissionInfo } = useRole('供应链')
const Manangerment = computed(() => {
  return grabCheck('供应商考核管理员')
})

interface Props {
  modelValue: boolean
  rowData: Supplier.Assess.SupplierAssessmentQuizVo
  width?: number
}

interface Emit {
  (e: 'update:model-value', value: boolean): void
  (e: 'refresh'): void
}

const props = withDefaults(defineProps<Props>(), { width: 800 })

const emit = defineEmits<Emit>()

const tableData = ref<Supplier.Assess.SupplierAssessmentQuizExtraScore[]>([])
const loading = ref(false)
const transform = ref('translateX(0)')
const logRef = ref<{ getList: () => Promise<any> }>()

const addScoreDialogProp = reactive({
  modelValue: false,
  rowData: {} as Supplier.Assess.SupplierAssessmentQuizVo,
  title: '',
  quizId: ''
})

/** 计算按钮配置 */
const btnsOptions = computed(() =>
  tableData.value.map(() => {
    const hideBtns: AuditBtn[] = [
      new AuditBtn('编辑', handleEdit, { permission: 'SupplierAssess:Check:Score:Edit' }),
      new AuditBtn('删除', handleDelete, {
        type: 'danger',
        permission: 'SupplierAssess:Check:Score:Delete'
      })
    ]

    return toReactive(hideBtns)
  })
)

const scoreTableOption = computed(() => {
  return props.rowData.assessmentStatus === '1' || Manangerment.value
    ? scoreTable
    : scoreTable.filter((ele) => ele.prop !== 'options')
})

function handleEdit(row: Supplier.Assess.SupplierAssessmentQuizExtraScore) {
  addScoreDialogProp.title = '编辑分值'
  addScoreDialogProp.rowData = { ...row }
  addScoreDialogProp.modelValue = true
  addScoreDialogProp.quizId = props.rowData.id || ''
}

function handleAdd() {
  addScoreDialogProp.title = '添加分值'
  addScoreDialogProp.modelValue = true
  addScoreDialogProp.quizId = props.rowData.id || ''
}

async function handleDelete(row: Supplier.Assess.SupplierAssessmentQuizExtraScore) {
  if (!row.id) return
  try {
    await message.confirm('删除将影响考核分数，确定删除吗？')

    const res = await supplierAssessmentDeleteQuizExtraScoreApi(row.id)

    if (res.success) {
      message.success('删除成功')
      getDetail()
      emit('refresh')
    }
  } catch (error) {}
}

function handleRefresh() {
  getDetail()
  emit('refresh')
}

function handleClosed() {
  emit('update:model-value', false)
  transform.value = 'translateX(0)'
}

async function getDetail() {
  if (!props.rowData.id) return
  try {
    loading.value = true
    const res = await supplierAssessmentPageQuizExtraScoreApi(props.rowData.id)
    tableData.value = [...res]
  } catch (error) {
  } finally {
    loading.value = false
  }
}

function handleOpen() {
  getPermissionInfo()
  getDetail()
}

async function handleLog() {
  await logRef.value?.getList()
  transform.value = 'translateX(-50%)'
}
</script>
<style lang="less" scoped>
@import url(../../../index.scss);

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

.content {
  :deep(.el-card__header) {
    padding-top: 16px;
    padding-bottom: 16px;
  }

  :deep(.el-card__body) {
    overflow: hidden;
    box-sizing: border-box;
  }

  transition: all 0.2s;
}

.hide {
  :deep(.el-card__body) {
    display: none;
  }
}

.score-drawer {
  :deep(.el-drawer__body) {
    overflow-x: hidden;
  }
}

:deep(.el-pagination) {
  margin-bottom: 0;
}
</style>
