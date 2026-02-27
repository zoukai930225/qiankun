import { ref } from 'vue'
import { getShowUsers, ShowUserItem } from './useShowUsers'

export function useAssessorsOptions() {
  const optionsMap = ref(new Map<string, ShowUserItem[]>())
  const loadingMap = ref(new Map<string, boolean>())

  const getKey = (depId: any) => (depId != null && depId !== '' ? String(depId) : '')

  async function ensureOptionsByDepartmentId(depId: any): Promise<ShowUserItem[]> {
    const key = getKey(depId)
    if (!key) return []
    if (optionsMap.value.has(key)) return optionsMap.value.get(key) || []
    if (loadingMap.value.get(key)) return optionsMap.value.get(key) || []
    loadingMap.value.set(key, true)
    try {
      const list = await getShowUsers({ departmentId: depId })
      optionsMap.value.set(key, list)
      return list
    } catch (_) {
      optionsMap.value.set(key, [])
      return []
    } finally {
      loadingMap.value.set(key, false)
    }
  }

  async function ensureMany(depIds: any[]) {
    const ids = Array.from(
      new Set((depIds || []).filter((v) => v !== null && v !== undefined && v !== ''))
    )
    await Promise.all(ids.map((id) => ensureOptionsByDepartmentId(id)))
  }

  function getOptions(depId: any): ShowUserItem[] {
    const key = getKey(depId)
    if (!key) return []
    return optionsMap.value.get(key) || []
  }

  return { optionsMap, loadingMap, ensureOptionsByDepartmentId, ensureMany, getOptions }
}
