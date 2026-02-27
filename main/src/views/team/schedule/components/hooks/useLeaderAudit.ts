import { ref, type Ref } from 'vue'
import { getLeaderRoster } from '@/api/team/index'

interface Operator {
  avatarOrigin: string
  dept: string
  jobNum: number
  operatorId: string
  operatorRealname: string
  sort?: number
  unionId?: string | null
}

interface AddForm {
  operate: string[]
  audit: string[]
  expectedCompletionTime?: string | undefined
}

function upsertUnique(listRef: Ref<Operator[]>, item: Operator) {
  if (!listRef.value.some((it) => it.operatorId === item.operatorId)) {
    listRef.value = listRef.value.concat(item)
  }
}

export function useLeaderAudit(
  addForm: AddForm,
  auditList: Ref<Operator[]>,
  auditSearchResult: Ref<Operator[]>
) {
  const operatorIdToAuditorIdMap = ref(new Map<string, string>())
  const previousAutoAuditorIds = ref<Set<string>>(new Set())

  const fetchAuditorByOperator = async (operatorId: string): Promise<string | undefined> => {
    const cached = operatorIdToAuditorIdMap.value.get(operatorId)
    if (cached) return cached

    const res: any = await getLeaderRoster({ userId: operatorId })
    const auditor: Operator | undefined = Array.isArray(res) ? res?.[0] : res

    if (auditor && auditor.operatorId) {
      operatorIdToAuditorIdMap.value.set(operatorId, auditor.operatorId)
      // 确保选项与格式化数据中存在该审核方
      upsertUnique(auditSearchResult, auditor)
      upsertUnique(auditList, auditor)
      return auditor.operatorId
    }

    return undefined
  }

  const syncAuditorsByOperators = async (selectedOperatorIds: string[]): Promise<void> => {
    const results = await Promise.all(selectedOperatorIds.map((id) => fetchAuditorByOperator(id)))
    const newAutoSet = new Set<string>(results.filter(Boolean) as string[])

    // 保留用户手动选择的审核方（上一次自动选择之外的）
    const manualAuditors = (addForm.audit || []).filter(
      (id) => !previousAutoAuditorIds.value.has(id)
    )

    // 合并新的自动审核方
    const merged = Array.from(new Set<string>([...manualAuditors, ...Array.from(newAutoSet)]))
    addForm.audit = merged

    previousAutoAuditorIds.value = newAutoSet
  }

  return {
    syncAuditorsByOperators
  }
}
