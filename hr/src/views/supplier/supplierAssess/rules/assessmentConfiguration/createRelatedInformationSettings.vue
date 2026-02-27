<template>
  <flux-wrap>
    <template #header>
      <section-title-header>
        新增
        <template #left>
          <div class="status-switch">
            <el-switch v-model="enabled" />
            <span class="label">运行状态</span>
          </div>
        </template>
      </section-title-header>

      <div class="tab-row">
        <el-tabs v-model="activeTab">
          <el-tab-pane
            v-for="opt in assessmentTypeOptions"
            :key="String(opt.value)"
            :name="String(opt.value)"
            :label="opt.label"
          />
        </el-tabs>
        <el-button
          v-if="permissionSet.has('CreateRelatedInformationSettings:AddSupplier')"
          type="primary"
          class="add-button"
          @click="onAddSupplier"
        >
          <el-icon>
            <Plus />
          </el-icon>
          添加供应商
        </el-button>
      </div>
    </template>
    <el-form ref="formRef" :model="formModel" label-width="0" scroll-to-error>
      <s-table
        ref="tableRef"
        border
        :columns="columns"
        :data="selectedSuppliers"
        row-key="rowKey"
        :show-pagination="false"
        :span-method="spanMethod"
      />
    </el-form>
    <template #footer>
      <div class="footer-buttons flex justify-between items-center">
        <div class="text-14px text-#333">
          已添加供应商：<span class="count text-#0064FF">{{ totalUniqueSuppliers }}</span
          >个
        </div>
        <div>
          <el-button @click="onBack"> 返回 </el-button>
          <el-button
            v-if="permissionSet.has('CreateRelatedInformationSettings:Save')"
            type="primary"
            @click="onSave"
          >
            保存
          </el-button>
        </div>
      </div>
    </template>
  </flux-wrap>
</template>
<script lang="tsx" setup>
import { ref, defineAsyncComponent, watch, computed, nextTick } from 'vue'
import { FluxWrap } from '@/components/ContentWrap'
import SectionTitleHeader from '@/components/Title/SectionTitleHeader.vue'
import { Plus } from '@element-plus/icons-vue'
import { useDialog } from '@/hooks/web/useDialog'
import { ElAvatar, ElButton, ElFormItem, ElSelect, ElOption, ElTooltip } from 'element-plus'
import DefaultAvatar from '@/assets/imgs/avatar_logo.png'
import { getDictLabel, DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import { useMessage } from '@/hooks/web/useMessage'
import { addAssessmentConfiguration } from '@/api/supplier/assessmentConfiguration'
import { useRouter } from 'vue-router'
import { useShowUsers } from './hooks/useShowUsers'
import { pickUserId, hasAssessors } from './utils'
import copySvg from '@/assets/svgs/copy.svg'
import { getPermission } from '@/utils'

const permissionSet = new Set(getPermission())

const enabled = ref<boolean>(true)
const assessmentTypeOptions = getIntDictOptions(
  DICT_TYPE.SUPPLIER_ASSESSMENT_TYPE,
  true
) as any[]
// const assessmentTypeOptions = allAssessmentTypeOptions.filter(
//   (opt: any) => opt?.label === '定制' || opt?.label === '现货'
// )
const activeTab = ref<string>(String(assessmentTypeOptions?.[0]?.value ?? ''))

const { openDialog } = useDialog()
const AddSupplier = defineAsyncComponent(() => import('./components/addSupplier.vue'))

// 本页选中的供应商集合（由“添加供应商”对话框返回），按考核类型分组
const tableRef = ref()
const selectedSuppliersMap = ref<Record<string, any[]>>({})
assessmentTypeOptions.forEach((opt: any) => {
  const key = String(opt.value)
  selectedSuppliersMap.value[key] = []
})
const selectedSuppliers = computed<any[]>(() => selectedSuppliersMap.value[activeTab.value] || [])
const optionsMap = ref(new Map<string, any[]>())
const optionsLoadingMap = ref(new Map<string, boolean>())

// 跨所有考核类型 Tab 去重后的供应商数
const totalUniqueSuppliers = computed<number>(() => {
  const uniqueIds = new Set<string>()
  assessmentTypeOptions.forEach((opt: any) => {
    const type = String(opt.value)
    const rows: any[] = selectedSuppliersMap.value[type] || []
    rows.forEach((r) => {
      const supplierId = r?.supplierId
      if (supplierId !== null && supplierId !== undefined) {
        uniqueIds.add(String(supplierId))
      }
    })
  })
  return uniqueIds.size
})

// 表单模型与校验
const formRef = ref()
const formModel = ref<{ rows: any[] }>({ rows: selectedSuppliers.value })
watch(
  () => selectedSuppliers.value,
  (val) => {
    formModel.value.rows = val
  },
  { deep: true }
)

// 切换 Tab 后重新触发表单校验，确保错误提示不会因组件卸载而消失
watch(activeTab, async () => {
  await nextTick()
  try {
    await formRef.value?.validate?.()
  } catch (_) {
    // 忽略异常，错误由表单项提示
  }
})

// 每个供应商默认生成的考核模块（如需本地兜底可启用）

const { fetchShowUsers } = useShowUsers()

async function ensureAssessorsByDepartmentId(depId: any) {
  if (depId === null || depId === undefined || depId === '') return
  const key = String(depId)
  if (optionsMap.value.has(key) || optionsLoadingMap.value.get(key)) return
  optionsLoadingMap.value.set(key, true)
  try {
    const res = await fetchShowUsers({ departmentId: depId })
    const normalized = (Array.isArray(res) ? res : []).map((u: any) => {
      const id = pickUserId(u)
      return { ...u, userId: id ?? u?.userId }
    })
    optionsMap.value.set(key, normalized)
  } catch (_) {
    optionsMap.value.set(key, [])
  } finally {
    optionsLoadingMap.value.set(key, false)
  }
}

const columns = ref<any[]>([
  {
    prop: 'abbreviationCompany',
    label: '供应商简称',
    minWidth: 160,
    align: 'left',
    headerAlign: 'left'
  },
  { prop: 'fullCompany', label: '公司名称', minWidth: 220, align: 'left', headerAlign: 'left' },
  {
    prop: 'supplierType',
    label: '供应商类型',
    minWidth: 120,
    align: 'left',
    headerAlign: 'left',
    customRender: ({ row }: any) => getDictLabel(DICT_TYPE.SUPPLIER_TYPE, row?.supplierType) || '-'
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
      const depKey = depId != null ? String(depId) : ''
      const options = depKey ? optionsMap.value.get(depKey) || [] : []
      console.log('options', options, row)
      return (
        <div class="flex items-center justify-center gap-6px">
          <ElFormItem
            prop={propPath}
            rules={[
              {
                validator: (_: any, _val: any, cb: any) => {
                  const val = row?.assessors
                  console.log('val', val)
                  const hasSelection =
                    !!val && (Array.isArray(val) ? val.length > 0 : pickUserId(val) != null)
                  return hasSelection ? cb() : cb(new Error('请选择考核人'))
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
              style="min-width: 220px;"
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
          <ElTooltip content="一键应用当前考核模块考核人至所有供应商" placement="top">
            <el-image
              src={copySvg}
              class="copy-icon cursor-pointer"
              onClick={() => applyAssessorsToAllInModule(row)}
            />
          </ElTooltip>
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
    customRender: ({ row }: any) => (
      <ElButton type="danger" link onClick={() => onRemove(row)}>
        移除
      </ElButton>
    )
  }
])

// 合并除“考核模块”“考核人”之外的同供应商字段
const spanMethod = ({ row, column, rowIndex }: any) => {
  const prop = column?.property
  // 不合并的列
  if (!prop || ['assessmentModule', 'assessors'].includes(prop)) {
    return { rowspan: 1, colspan: 1 }
  }

  // 依据 supplierId 分组，统计连续相同行数
  const list = selectedSuppliers.value
  const supplierId = row?.id ?? row?.supplierId

  // 如果上一行是同一供应商，则本行隐藏
  if (rowIndex > 0) {
    const prev = list[rowIndex - 1]
    const prevId = prev?.id ?? prev?.supplierId
    if (prevId === supplierId) return { rowspan: 0, colspan: 0 }
  }

  let rowspan = 1
  for (let i = rowIndex + 1; i < list.length; i++) {
    const next = list[i]
    const nextId = next?.id ?? next?.supplierId
    if (nextId === supplierId) {
      rowspan++
    } else {
      break
    }
  }
  return { rowspan, colspan: 1 }
}

async function mergeSuppliers(rows: any[]) {
  // 现有 key: 供应商ID-模块
  const currentList = selectedSuppliers.value
  const existingKeys = new Set(
    currentList
      .filter(
        (r: any) =>
          r?.assessmentTypeId !== null &&
          r?.assessmentTypeId !== undefined &&
          r?.assessmentTypeId !== ''
      )
      .map((r: any) => `${r?.supplierId}-${r?.assessmentTypeId}`)
  )
  // 预取当前返回的 assessmentTypes 下每个部门的考核人列表
  if (rows && rows.length) {
    const assessmentTypes = Array.isArray(rows[0]?.assessmentTypes) ? rows[0].assessmentTypes : []
    const deptIds = Array.from(
      new Set(
        assessmentTypes
          .map((m: any) => m?.departmentId)
          .filter((v: any) => v !== null && v !== undefined && v !== '')
          .map((v: any) => String(v))
      )
    )
    deptIds.forEach((depId: any) => ensureAssessorsByDepartmentId(depId))
    // await Promise.all()
  }
  console.log('optionsMap', optionsMap.value)
  const expanded: any[] = []
  ;(rows || []).forEach((r) => {
    const supplierId = r?.supplierId
    const assessmentTypes = r?.assessmentTypes || []
    assessmentTypes.forEach((item) => {
      const uniqueKey =
        item?.id !== null && item?.id !== undefined && item?.id !== ''
          ? `${supplierId}-${item.id}`
          : undefined
      if (uniqueKey && existingKeys.has(uniqueKey)) return
      const base = { ...r }
      const rowKey =
        uniqueKey ?? `${supplierId}-${item?.name}-${String(Math.random()).slice(2, 10)}`
      const row = {
        ...base,
        id: supplierId,
        supplierId,
        assessmentModule: item.name,
        departmentId: item?.departmentId,
        assessmentTypeId: item?.id,
        assessors: null,
        rowKey
      }
      expanded.push(row)
      if (uniqueKey) existingKeys.add(uniqueKey)
    })
  })

  if (expanded.length) {
    const type = activeTab.value
    selectedSuppliersMap.value[type] = [...(selectedSuppliersMap.value[type] || []), ...expanded]
  }
}

function onRemove(row: any, index?: number) {
  const type = activeTab.value
  const list = selectedSuppliersMap.value[type] || []
  let supplierId: any = row?.supplierId
  if ((supplierId === null || supplierId === undefined) && index != null && index >= 0) {
    const r = list[index]
    supplierId = r?.supplierId
  }
  if (supplierId === null || supplierId === undefined) return
  // 一次性移除该供应商的所有模块行
  selectedSuppliersMap.value[type] = list.filter((r: any) => r?.supplierId !== supplierId)
}

function onAddSupplier() {
  openDialog({
    title: '添加供应商',
    width: '891px',
    content: AddSupplier,
    props: {
      selectedSupplierIds: Array.from(
        new Set(
          ((selectedSuppliers.value as any[]) || [])
            .map((r) => r?.id ?? r?.supplierId)
            .filter((v) => v !== null && v !== undefined)
            .map((v) => String(v))
        )
      ),
      type: activeTab.value
    },
    showConfirmFooter: true,
    confirmText: '确定',
    on: {
      success: async (rows: any[]) => {
        await mergeSuppliers(rows)
      }
    },
    onSuccess: () => {
      // 可选：成功后刷新父列表或提示
    }
  })
}

// 对外暴露校验方法
async function validate() {
  if (!formRef.value) return true
  return await formRef.value
    .validate()
    .then(() => true)
    .catch(() => false)
}

const message = useMessage()

// pickUserId 提取到 utils

async function onSave() {
  // 先进行跨 Tab 的必填校验（考核人）
  const allValid = await ensureAllTabsValid()
  if (!allValid) return

  const status = enabled.value ? 1 : 0
  const addRelaDetails: any[] = []

  assessmentTypeOptions.forEach((opt: any) => {
    const type = String(opt.value)
    const rows: any[] = selectedSuppliersMap.value[type] || []
    if (!rows.length) return

    // 按供应商分组
    const bySupplier = new Map<string, any[]>()
    rows.forEach((r) => {
      const sid = String(r?.id ?? r?.supplierId)
      if (!bySupplier.has(sid)) bySupplier.set(sid, [])
      bySupplier.get(sid)!.push(r)
    })

    const relationDetails: any[] = []
    bySupplier.forEach((items, sid) => {
      const userAndTypeRela: any[] = []
      items.forEach((it: any) => {
        const selected = Array.isArray(it?.assessors)
          ? it.assessors
          : it?.assessors
            ? [it.assessors]
            : []
        if (!selected.length) return
        selected.forEach((u: any) => {
          const uid = pickUserId(u)
          if (uid == null) return
          userAndTypeRela.push({
            assessmentTypeId: it?.assessmentTypeId,
            name: it?.assessmentModule,
            departmentId: it?.departmentId,
            userId: uid,
            user: u // user 取 row 选择的 assessors 对象
          })
        })
      })
      if (userAndTypeRela.length > 0) {
        relationDetails.push({ supplierId: sid, userAndTypeRela })
      }
    })

    if (relationDetails.length > 0) {
      addRelaDetails.push({ type, relationDetails })
    }
  })

  const payload = { status, addRelaDetails }

  try {
    await addAssessmentConfiguration(payload)
    message.success('保存成功')
    onBack()
  } catch (e) {
    // 交由全局拦截统一提示
  }
}

// hasAssessors 提取到 utils

async function ensureAllTabsValid(): Promise<boolean> {
  for (const opt of assessmentTypeOptions as any[]) {
    const type = String(opt.value)
    const rows: any[] = selectedSuppliersMap.value[type] || []
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      if (!hasAssessors(row?.assessors)) {
        // 跳转到存在错误的 Tab，并触发表单校验以展示错误
        activeTab.value = type
        await nextTick()
        try {
          await formRef.value?.validate?.()
        } catch (_) {
          // 忽略，错误提示交由表单展示
        }
        message.error('请为所有考核模块选择考核人')
        return false
      }
    }
  }
  return true
}

const router = useRouter()
function onBack() {
  router.push({ name: 'AssessmentConfiguration' })
}
defineExpose({ validate })

function applyAssessorsToAllInModule(row: any) {
  const type = activeTab.value
  const list = selectedSuppliersMap.value[type] || []
  const moduleName = row?.assessmentModule
  const source = row?.assessors
  if (!source || (Array.isArray(source) && source.length === 0)) {
    message.warning('请先选择考核人')
    return
  }
  list.forEach((r: any) => {
    if (r?.assessmentModule === moduleName) {
      r.assessors = Array.isArray(source) ? [...source] : source
    }
  })
  message.success('已应用至所有供应商')
}
</script>
<style scoped lang="scss">
.tab-row {
  margin-top: 8px;
  position: relative;
  .add-button {
    position: absolute;
    right: 0;
    top: 0;
  }
}

.status-switch {
  display: flex;
  align-items: center;
  gap: 11px;
  margin-left: 30px;

  .label {
    font-size: 14px;
    font-weight: normal;
    line-height: normal;
    letter-spacing: 0px;
    font-variation-settings: 'opsz' auto;
    white-space: nowrap;
    /* 文字/二级 */
    color: #666666;
  }
}

// 表格辅助样式
.assessor-list {
  display: inline-flex;
  gap: 10px;
  flex-wrap: wrap;
}
.person {
  display: inline-flex;
  align-items: center;
  .avatar {
    margin-right: 6px;
  }
}
.tags :deep(.el-tag) {
  margin-right: 6px;
}
.placeholder {
  color: #a6a6a6;
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
</style>
