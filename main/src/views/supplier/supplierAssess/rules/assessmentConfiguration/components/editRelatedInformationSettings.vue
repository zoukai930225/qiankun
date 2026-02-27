<template>
  <div>
    <div class="header-row">
      <div class="info-grid">
        <el-descriptions label-width="100px" :column="2" border class="supplier-descriptions">
          <el-descriptions-item label="供应商简称">
            {{ baseInfo.abbreviationCompany || '-' }}
          </el-descriptions-item>
          <el-descriptions-item label="供应商类型">
            {{ supplierTypeLabel(baseInfo.supplierType) }}
          </el-descriptions-item>
          <el-descriptions-item label="公司名称" :span="2">
            {{ baseInfo.fullCompany || '-' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="flex items-center justify-between mt-24px mb-24px">
        <div class="status-box">
          <span class="text-14px text-#333">考核状态</span>
          <el-switch v-model="enabled" />
        </div>
        <el-button
          v-if="permissionSet.has('AssessmentConfiguration:Link:Edit:Add')"
          type="primary"
          @click="onAdd"
        >
          <el-icon>
            <Plus />
          </el-icon>
          <span>添加</span>
        </el-button>
      </div>
    </div>

    <el-form ref="formRef" :model="formModel" label-width="0" scroll-to-error>
      <s-table
        border
        ref="tableRef"
        :columns="columns"
        :data="rows"
        row-key="rowKey"
        :show-pagination="false"
        :span-method="spanMethod"
      />
    </el-form>
  </div>
</template>
<script lang="tsx" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElAvatar, ElFormItem, ElSelect, ElOption, ElButton } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'
import { getDictLabel, DICT_TYPE } from '@/utils/dict'
import {
  getAssessmentUpdateShow,
  updateAssessmentConfiguration,
  getAssessmentUpdateShowTypes
} from '@/api/supplier/assessmentConfiguration'
import { useAssessorsOptions } from '../hooks/useAssessorsOptions'
import { pickUserId } from '../utils'
import { useMessage } from '@/hooks/web/useMessage'
import { getPermission } from '@/utils'

interface Props {
  supplierId?: string
  row?: any
}

defineOptions({ name: 'EditRelatedInformationSettings' })

const props = defineProps<Props>()
const supplierId = computed<string | undefined>(
  () => props.supplierId || props.row?.supplierId || props.row?.id
)
const permissionSet = new Set(getPermission())
const { ensureMany, getOptions } = useAssessorsOptions()
const message = useMessage()

// 顶部信息
const baseInfo = ref<any>({})
const enabled = ref<boolean>(true)

// 表格与表单
const formRef = ref()
const rows = ref<any[]>([])
const formModel = ref<{ rows: any[] }>({ rows: rows.value })

watch(
  () => rows.value,
  (val) => {
    formModel.value.rows = val
  },
  { deep: true }
)

function supplierTypeLabel(val: any) {
  return getDictLabel(DICT_TYPE.SUPPLIER_TYPE, val) || '-'
}

const columns = ref<any[]>([
  {
    prop: 'assessmentType',
    label: '考核类型',
    minWidth: 100,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }: any) =>
      getDictLabel(DICT_TYPE.SUPPLIER_ASSESSMENT_TYPE, row?.assessmentType) || '-'
  },
  {
    prop: 'assessmentModule',
    label: '考核模块',
    minWidth: 160,
    align: 'left',
    headerAlign: 'left'
  },
  {
    prop: 'assessors',
    label: '考核人',
    minWidth: 220,
    align: 'center',
    headerAlign: 'center',
    className: 'assessors-col',
    showOverflowTooltip: false,
    customRender: ({ row, $index }: any) => {
      const propPath = `rows[${$index}].assessors`
      const depId = row?.departmentId
      const options = getOptions(depId)
      return (
        <div class="flex items-center justify-center gap-6px">
          <ElFormItem
            prop={propPath}
            rules={[
              {
                validator: (_: any, _val: any, cb: any) => {
                  const val = row?.assessors
                  const ok =
                    !!val && (Array.isArray(val) ? val.length > 0 : pickUserId(val) != null)
                  return ok ? cb() : cb(new Error('请选择考核人'))
                },
                trigger: 'change'
              }
            ]}
          >
            <ElSelect
              filterable
              clearable
              value-key="userId"
              placeholder="请选择考核人"
              modelValue={row.assessors}
              onUpdate:modelValue={(val: any) => (row.assessors = val)}
            >
              {options.map((u: any) => (
                <ElOption key={u?.userId} label={u?.userName || u?.name || '-'} value={u}>
                  <div class="person flex items-center gap-6px">
                    <ElAvatar size={18} src={u?.avatarOrigin || DefaultAvatar} class="avatar" />
                    <span class="name">{u?.userName || u?.name || '-'}</span>
                  </div>
                </ElOption>
              ))}
            </ElSelect>
          </ElFormItem>
        </div>
      )
    }
  },
  {
    prop: 'operation',
    label: '操作',
    width: 80,
    fixed: 'right',
    align: 'center',
    headerAlign: 'center',
    customRender: ({ row, $index }: any) => {
      const uniqueTypeCount = new Set(
        rows.value
          .map((r) => (r?.assessmentType != null ? String(r.assessmentType) : ''))
          .filter((v) => v !== '')
      ).size
      const disabled = uniqueTypeCount <= 1
      if (permissionSet.has('AssessmentConfiguration:Link:Edit:Remove')) {
        return (
          <ElButton type="danger" link disabled={disabled} onClick={() => onRemove(row, $index)}>
            移除
          </ElButton>
        )
      } else return null
    }
  }
])

// 合并“考核类型”和“操作”两列：同一类型的相邻行合并
const spanMethod = ({ column, rowIndex }: any) => {
  const prop = column?.property
  const needMerge = prop === 'assessmentType' || prop === 'operation'
  if (!needMerge) return { rowspan: 1, colspan: 1 }
  const list = rows.value
  // 若上一行类型相同，隐藏本行该单元格
  if (rowIndex > 0 && list[rowIndex - 1]?.assessmentType === list[rowIndex]?.assessmentType) {
    return { rowspan: 0, colspan: 0 }
  }
  // 统计向下连续相同类型的行数
  let rowspan = 1
  for (let i = rowIndex + 1; i < list.length; i++) {
    if (list[i]?.assessmentType === list[rowIndex]?.assessmentType) rowspan++
    else break
  }
  return { rowspan, colspan: 1 }
}

function onRemove(_row: any, index?: number) {
  const type =
    _row?.assessmentType ?? (index != null && index >= 0 ? rows.value[index]?.assessmentType : null)
  if (type == null) return
  // 移除该类型的整组行
  const before = rows.value.length
  rows.value = rows.value.filter((r) => r?.assessmentType !== type)
  const after = rows.value.length
  if (after < before) {
    console.log('已移除')
  }
}

// 添加：查询可添加的考核类型及模块并展开为行
async function onAdd() {
  const existingTypes = Array.from(
    new Set(
      rows.value
        .map((r) => (r?.assessmentType != null ? String(r.assessmentType) : ''))
        .filter((v) => v !== '')
    )
  )
  let resp: any
  try {
    resp = await getAssessmentUpdateShowTypes(existingTypes)
  } catch (_e) {
    return
  }
  const data = (resp && (resp.data ?? resp)) || []
  const items: any[] = Array.isArray(data) ? data : []
  if (!items.length) {
    message.warning('暂无可添加类型')
    return
  }
  const supplierIdVal = baseInfo.value?.supplierId
  const departmentIds: any[] = []
  const currentKeys = new Set<string>(rows.value.map((r) => String(r?.rowKey ?? '')))
  const appended: any[] = []
  items.forEach((group: any) => {
    const type = group?.type
    const modules = Array.isArray(group?.assessmentTypes) ? group.assessmentTypes : []
    modules.forEach((m: any, idx: number) => {
      const assessmentTypeId = m?.assessmentTypeId ?? m?.id
      const departmentId = m?.departmentId
      const name = m?.name
      const rowKey = `${supplierIdVal}-${type}-${assessmentTypeId || name || idx}`
      if (currentKeys.has(rowKey)) return
      appended.push({
        supplierId: supplierIdVal,
        abbreviationCompany: baseInfo.value?.abbreviationCompany,
        fullCompany: baseInfo.value?.fullCompany,
        supplierType: baseInfo.value?.supplierType,
        assessmentType: type,
        assessmentModule: name,
        assessmentTypeId,
        departmentId,
        assessors: null,
        rowKey
      })
      if (departmentId !== null && departmentId !== undefined && departmentId !== '') {
        departmentIds.push(departmentId)
      }
    })
  })
  if (!appended.length) {
    message.info('没有新的考核模块可添加')
    return
  }
  // 预加载考核人选项
  await ensureMany(departmentIds)
  rows.value = [...rows.value, ...appended]
  message.success(`已添加 ${appended.length} 个考核模块`)
}

function normalizeToRows(payload: any): any[] {
  const supplierIdVal = payload?.supplierId
  baseInfo.value = {
    supplierId: supplierIdVal,
    abbreviationCompany: payload?.abbreviationCompany,
    fullCompany: payload?.fullCompany,
    supplierType: payload?.supplierType
  }
  enabled.value = (payload?.status ?? 1) === 1

  const details = Array.isArray(payload?.addRelaDetails) ? payload.addRelaDetails : []
  const flat: any[] = []
  details.forEach((d: any) => {
    const type = d?.type
    const userAndTypeRela = Array.isArray(d?.userAndTypeRela) ? d.userAndTypeRela : []
    userAndTypeRela.forEach((rel: any, idx: number) => {
      const value = rel?.user ?? (rel?.userId != null ? { userId: rel.userId } : null)
      flat.push({
        supplierId: supplierIdVal,
        abbreviationCompany: payload?.abbreviationCompany,
        fullCompany: payload?.fullCompany,
        supplierType: payload?.supplierType,
        assessmentType: type,
        assessmentModule: rel?.name,
        assessmentTypeId: rel?.assessmentTypeId,
        departmentId: rel?.departmentId,
        assessors: value,
        rowKey: `${supplierIdVal}-${type}-${rel?.assessmentTypeId || rel?.name || idx}`
      })
    })
  })
  return flat
}

onMounted(async () => {
  if (!supplierId.value) return
  const res: any = await getAssessmentUpdateShow({ supplierId: supplierId.value })
  const data = (res && (res.data ?? res)) || {}
  const list = normalizeToRows(data)
  rows.value = list
  // 预加载每个部门的考核人选项
  await ensureMany(list.map((r) => r?.departmentId))
})

// 供对话框确定按钮调用
async function submit() {
  // 验证必填
  try {
    await formRef.value?.validate?.()
  } catch (_e) {
    throw _e
  }

  const groupedByType = new Map<string, any[]>()
  rows.value.forEach((r) => {
    const type = String(r?.assessmentType ?? '')
    if (!groupedByType.has(type)) groupedByType.set(type, [])
    const uid = pickUserId(r?.assessors)
    if (uid == null) return
    groupedByType.get(type)!.push({
      assessmentTypeId: r?.assessmentTypeId,
      name: r?.assessmentModule,
      departmentId: r?.departmentId,
      userId: uid,
      user: null
    })
  })

  const addRelaDetails: any[] = []
  groupedByType.forEach((arr, type) => {
    if (arr.length > 0) addRelaDetails.push({ type, userAndTypeRela: arr })
  })

  const payload = {
    supplierId: supplierId.value,
    status: enabled.value ? 1 : 0,
    addRelaDetails
  }

  await updateAssessmentConfiguration(payload)
}

defineExpose({ submit })
</script>
<style scoped lang="scss">
.info-item .label {
  color: #666;
  font-size: 12px;
}
.info-item .value {
  color: #333;
  font-size: 14px;
  margin-top: 4px;
}
.status-box {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-self: end;
}

::deep(.assessors-col .cell) {
  overflow: visible;
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: 0;
  }
  .copy-icon {
    width: 14px;
    height: 14px;
  }
}

:deep(.assessors-col .cell) {
  overflow: visible;
}

:deep(.el-descriptions) {
  .el-descriptions__label.el-descriptions__cell.is-bordered-label {
    font-weight: normal;
  }
}
</style>
