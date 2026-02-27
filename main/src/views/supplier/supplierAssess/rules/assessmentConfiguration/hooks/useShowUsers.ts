import { ref } from 'vue'
import { showUsers } from '@/api/supplier/assessmentConfiguration'

export interface ShowUsersParams {
  // 保留灵活性：后端可能需要 type、assessmentModuleName、supplierId 等
  [key: string]: any
}

export interface ShowUserItem {
  // 常见字段，保持可选，兼容不同返回结构
  userId?: string | number
  id?: string | number
  userName?: string
  name?: string
  avatarOrigin?: string
  assessmentModuleName?: string
  [key: string]: any
}

export function useShowUsers() {
  const loading = ref(false)
  const list = ref<ShowUserItem[]>([])
  const error = ref<any>(null)

  const fetchShowUsers = async (params: ShowUsersParams): Promise<ShowUserItem[]> => {
    try {
      loading.value = true
      error.value = null
      const res: any = await showUsers(params)
      // 兼容常见的返回结构：数组 / { records } / { list }
      const data = Array.isArray(res)
        ? res
        : Array.isArray(res?.records)
          ? res.records
          : Array.isArray(res?.list)
            ? res.list
            : []
      list.value = data as ShowUserItem[]
      return list.value
    } catch (e) {
      error.value = e
      list.value = []
      return []
    } finally {
      loading.value = false
    }
  }

  return { loading, list, error, fetchShowUsers }
}

// 单次便捷调用
export async function getShowUsers(params: ShowUsersParams): Promise<ShowUserItem[]> {
  const { fetchShowUsers } = useShowUsers()
  return await fetchShowUsers(params)
}
