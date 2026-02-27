<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2026-01-23
 * @Description: 灵活的用户选择器，支持自定义接口和参数
-->
<template>
  <el-select v-model="dataValue" popper-class="flexible-user-select-popper" :placeholder="placeholder"
    :loading="loading" :loading-text="loadingText" :disabled="disabled" :clearable="clearable" :filterable="filterable"
    :remote="remote" :remote-method="handleRemoteMethod" @change="handleChange" @focus="handleFocus"
    @clear="handleClear" v-bind="$attrs">
    <!-- 自定义选中值的回显 -->
    <template #label="{ label, value }">
      <slot name="label" :label="label" :value="value" :user="getSelectedUser(value)">
        <div class="selected-user-label">
          <el-avatar :src="getSelectedUser(value)?.avatarOrigin || defaultAvatar" :size="20" />
          <span class="user-name">{{ label }}</span>
        </div>
      </slot>
    </template>

    <!-- 选项列表 -->
    <el-option v-for="user in userList" :key="user[valueKey]" :label="user[labelKey]" :value="user[valueKey]"
      :disabled="user.disabled">
      <slot name="option" :user="user">
        <div class="user-option-item">
          <div class="user-info">
            <el-avatar :src="user.avatarOrigin || defaultAvatar" :size="36" />
            <div class="user-details">
              <div class="user-name-row">
                <span class="name">{{ user[labelKey] || '-' }}</span>
                <span class="department">{{ user.dept || '-' }}</span>
              </div>
              <span class="company">{{
                user?.company ? getDictLabel(DICT_TYPE.PR_COMPANY, user.company) : '-'
              }}</span>
            </div>
          </div>
          <span class="job-num">{{ user.jobNum || '-' }}</span>
        </div>
      </slot>
    </el-option>

    <!-- 空状态 -->
    <template #empty>
      <div class="empty-state">
        <span>{{ emptyText }}</span>
      </div>
    </template>
  </el-select>
</template>

<script lang="ts">
export default { name: 'FlexibleUserSelect' }
</script>

<script lang="ts" setup>
import { getDictLabel, DICT_TYPE, getIntDictOptions } from '@/utils/dict'
import request from '@/config/axios'
import defaultAvatar from '@/assets/imgs/avatar_logo.png'
import { debounce } from 'lodash-es'

// ==================== Props 定义 ====================
interface Props {
  // 请求配置
  url?: string // 请求地址
  method?: 'get' | 'post' // 请求方法
  params?: Record<string, any> // 请求参数
  dataPath?: string // 数据路径，如 'data.list'
  immediate?: boolean // 是否立即加载

  // 字段映射
  valueKey?: string // value 字段名
  labelKey?: string // label 字段名

  // 基础配置
  placeholder?: string
  disabled?: boolean
  clearable?: boolean
  filterable?: boolean
  remote?: boolean
  loadingText?: string
  emptyText?: string

  // 远程搜索字段key
  searchKey?: string
}

const props = withDefaults(defineProps<Props>(), {
  method: 'get',
  params: () => ({}),
  dataPath: '',
  immediate: true,
  valueKey: 'userId',
  labelKey: 'name',
  placeholder: '请输入人员姓名/手机号码筛选',
  disabled: false,
  clearable: true,
  filterable: true,
  remote: true,
  loadingText: '数据加载中',
  emptyText: '暂无数据',
  searchKey: 'search'
})

// ==================== Emits 定义 ====================
interface Emits {
  (e: 'change', value: any, user: any): void
  (e: 'focus'): void
  (e: 'clear'): void
}

const emit = defineEmits<Emits>()

// ==================== 响应式数据 ====================
const dataValue = defineModel<any>()
const loading = ref(false)
const userList = ref<Array<any>>([])

// ==================== 计算属性 ====================
// 获取选中用户的完整信息
const getSelectedUser = (value: any) => {
  return userList.value.find((user) => user[props.valueKey] === value) || null
}

// ==================== 方法 ====================
/**
 * 从响应数据中提取用户列表
 */
const extractData = (response: any): any[] => {
  if (!props.dataPath) {
    // 尝试常见的数据路径
    if (response.data && Array.isArray(response.data)) return response.data
    if (response.records && Array.isArray(response.records)) return response.records
    if (Array.isArray(response)) return response
    return []
  }

  const paths = props.dataPath.split('.')
  let data = response

  for (const path of paths) {
    if (data && typeof data === 'object' && path in data) {
      data = data[path]
    } else {
      return []
    }
  }

  return Array.isArray(data) ? data : []
}

/**
 * 加载用户列表
 */
const loadUsers = async (searchParams?: Record<string, any>) => {
  if (!props.url) {
    console.warn('FlexibleUserSelect: url 未配置')
    return
  }

  loading.value = true

  try {
    const requestParams = {
      ...props.params,
      ...searchParams
    }

    let response: any

    if (props.method === 'post') {
      response = await request.post({
        url: props.url,
        data: requestParams
      })
    } else {
      response = await request.get({
        url: props.url,
        params: requestParams
      })
    }

    const data = extractData(response)
    userList.value = data
  } catch (error) {
    console.error('FlexibleUserSelect 加载数据失败:', error)
    userList.value = []
  } finally {
    loading.value = false
  }
}

/**
 * 远程搜索方法（防抖）
 */
const handleRemoteMethod = debounce((query: string) => {
  if (query) {
    loadUsers({ [props.searchKey]: query })
  }
}, 300)

/**
 * 值变化回调
 */
const handleChange = (value: any) => {
  const user = getSelectedUser(value)
  emit('change', value, user)
}

/**
 * 聚焦回调
 */
const handleFocus = () => {
  emit('focus')

  // 如果是远程搜索且列表为空，加载初始数据
  if (props.remote && userList.value.length === 0) {
    loadUsers()
  }
}

/**
 * 清空回调
 */
const handleClear = () => {
  emit('clear')
}

/**
 * 刷新用户列表（对外暴露）
 */
const refresh = (params?: Record<string, any>) => {
  loadUsers(params)
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 立即加载（非远程搜索模式）
  if (props.immediate && props.url && !props.remote) {
    loadUsers()
  }
})

// ==================== 对外暴露 ====================
defineExpose({
  refresh,
  loadUsers,
  userList
})
</script>

<style lang="scss" scoped>
.selected-user-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 2px 8px;
  height: 24px;
  border-radius: 12px;
  background-color: #cad6f8;

  .user-name {
    color: #333;
    font-size: 14px;
  }
}

.user-option-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  min-height: 42px;

  .user-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .user-name-row {
        display: flex;
        align-items: center;
        gap: 8px;

        .name {
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }

        .department {
          font-size: 12px;
          color: #999;
        }
      }

      .company {
        font-size: 12px;
        color: #999;
      }
    }
  }

  .job-num {
    font-size: 12px;
    color: #666;
    margin-left: 12px;
  }
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>

<style lang="scss">
.flexible-user-select-popper {
  .el-select-dropdown__item {
    height: auto !important;
    line-height: normal !important;
    padding: 0 !important;
  }
}
</style>
