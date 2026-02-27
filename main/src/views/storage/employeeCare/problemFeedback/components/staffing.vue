<!--
 * @Author: wangxifeng-ZJ3bu
 * @Date: 2026-01-22 16:01:58
 * @LastEditors: wangxifeng-ZJ3bu
 * @LastEditTime: 2026-02-11 16:02:03
-->
<template>
  <scheme-dialog ref="detailsRef" class="problemFeedbackStaffing" name="problemFeedbackStaffing" width="800">
    <template #card>
      <div class="problemFeedbackStaffing-content">
        <div class="problemFeedbackStaffing-content-item" v-for="item in domSetting" :key="item.value">
          <div class="problemFeedbackStaffing-content-item-label">
            <span class="required">*</span>{{ item.label }}：
          </div>
          <div class="problemFeedbackStaffing-content-item-value">
            <flexible-user-select v-model="currentSelection[item.value]" url="/api/user/userBasicInfoInCompany"
              :params="userSelectParams" placeholder="请输入人员姓名/手机号码筛选" :value-key="'userId'" :label-key="'realName'"
              :remote="false" @change="(_, user) => handleUserSelect(item.value, user)" />
            <div class="selected-users">
              <div v-for="user in selectedUsers[item.value]" :key="user.userId" class="user-tag">
                <el-avatar :src="user.avatarOrigin || avatarLogo" :size="24" />
                <span class="user-name">{{ user.name }}</span>
                <el-icon class="remove-icon" @click="removeUser(item.value, user.userId)">
                  <Close />
                </el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #button>
      <el-button @click="detailsRef?.close()" :disabled="loading" type="primary">关闭</el-button>
      <el-button type="primary" @click="submitForm" :disabled="loading">提交</el-button>
    </template>
  </scheme-dialog>
</template>

<script lang="tsx">
export default { name: 'problemFeedbackStaffingDetails' }
</script>

<script lang="tsx" setup>
import { debounce } from 'lodash-es'
import FlexibleUserSelect from '@/components/common/user/FlexibleUserSelect.vue'
import { Close } from '@element-plus/icons-vue'
import request from '@/config/axios'
import avatarLogo from '@/assets/imgs/avatar_logo.png'
const message = useMessage()
class selectedUsersData {
  internalLeader: Array<any> = []
  externalLeader: Array<any> = []
  internalManager: Array<any> = []
  externalManager: Array<any> = []
  chief: Array<any> = []
}
const detailsRef = ref<any>(),
  formRef = ref(),
  viewType = ref<string>('add'),
  loading = ref<boolean>(false),
  // 每个角色当前选中的用户ID
  currentSelection = ref<Record<string, string>>({
    internalLeader: '',
    externalLeader: '',
    internalManager: '',
    externalManager: '',
    chief: ''
  }),
  bukValue = ref<selectedUsersData>(new selectedUsersData())
const userSelectParams = ref<Record<string, any>>({
  page: 1,
  pageSize: 99999
})
const domSetting = ref<any[]>([
  {
    label: '内仓组长',
    value: 'internalLeader',
    configType: 1
  },
  {
    label: '外仓组长',
    value: 'externalLeader',
    configType: 2
  },
  {
    label: '内仓经理',
    value: 'internalManager',
    configType: 3
  },
  {
    label: '外仓经理',
    value: 'externalManager',
    configType: 4
  },
  {
    label: '总负责人',
    value: 'chief',
    configType: 5
  }
])
// 已选择的用户列表
const selectedUsers = ref<selectedUsersData>(new selectedUsersData())

const title = computed(() => '管理人员设置')

// 处理用户选择
const handleUserSelect = (roleType: string, user: any) => {
  if (!user || !user.userId) {
    return
  }

  const userId = user.userId
  const userName = user.realName
  const avatarOrigin = user.avatarOrigin

  // 检查是否已在其他角色中
  for (const [role, users] of Object.entries(selectedUsers.value)) {
    if (users.some((u: any) => u.userId === userId)) {
      message.warning(`该人员已在${getDomLabel(role)}中，不能重复选择`)
      currentSelection.value[roleType] = '' // 清空当前选择
      return
    }
  }

  // 添加到已选列表
  if (['internalLeader', 'externalLeader'].includes(roleType)) {
    // 组长可以选择多人
    selectedUsers.value[roleType].push({
      userId,
      name: userName,
      avatarOrigin,
      roleType
    })
  } else {
    // 其他角色只能选择一人
    selectedUsers.value[roleType] = [
      {
        userId,
        name: userName,
        avatarOrigin,
        roleType
      }
    ]
  }

  // 清空当前选择
  currentSelection.value[roleType] = ''
}

// 获取角色中文名称
const getDomLabel = (value: string) => {
  const item = domSetting.value.find((d) => d.value === value)
  return item?.label || value
}

// 移除用户
const removeUser = (roleType: string, userId: string) => {
  selectedUsers.value[roleType] = selectedUsers.value[roleType].filter(
    (u: any) => u.userId !== userId
  )
}

// 弹出通用
const openView = () => {
  // detailsRef openDialog方法支持前/后置方法入参，无需操作抽屉显隐，内部已处理
  detailsRef?.value?.openDialog(
    async () => {
      // 加载已有数据
      await loadStaffingData()
    },
    () => {
      nextTick(() => {
        formRef?.value?.clearValidate()
      })
    }
  )
}

// 加载人员配置数据
const loadStaffingData = async () => {
  try {
    const res = await request.get({
      url: '/api/whUserFeedbackProblemInfo/selectManagePersonnelConfigList'
    })
    domSetting.value.forEach((item) => {
      selectedUsers.value[item.value] =
        res
          .find((r: any) => r.configType === item.configType)
          ?.userInfoList.map((u: any) => ({
            userId: u.userId,
            name: u.userName,
            avatarOrigin: u.avatar
          })) || []
    })
    // bukValue.value = res
  } catch (error) {
    console.error('加载人员配置失败:', error)
  }
}

// 通用表单校验
const checkValue = () => {
  // 校验每个角色至少选择一个人
  for (const role of domSetting.value) {
    if (selectedUsers.value[role.value].length === 0) {
      message.warning(`请至少选择一个${role.label}`)
      return false
    }
  }

  return true
}

// 提交
const submitForm = async () => {
  const valid = checkValue()
  if (valid) {
    submit()
  }
}

// 实际提交（防抖）
const submit = debounce(async () => {
  loading.value = true
  try {
    const submitData = domSetting.value.map((item) => ({
      configType: item.configType,
      userId: selectedUsers.value[item.value].map((u: any) => u.userId).join(','),
      configName: item.label,
      sortOrder: item.configType
    }))

    await request.post({
      url: '/api/whUserFeedbackProblemInfo/batchManagePersonnelConfig',
      data: submitData
    })

    message.success('操作成功')
    detailsRef?.value?.closed()
  } catch (error: any) {
    console.error('提交失败:', error)
    message.error(error.message || '操作失败，请重试')
  } finally {
    loading.value = false
  }
}, 500)

defineExpose({ openView })

provide('problemFeedbackStaffingDetails', {
  title,
  viewType,
  bukValue,
  dataValue: selectedUsers
})
</script>
<style lang="scss" scoped>
.problemFeedbackStaffing-content {
  padding: 6px;
  padding-left: 0;

  &-item {
    display: flex;
    margin-bottom: 24px;
    align-items: flex-start;

    &:last-child {
      margin-bottom: 0;
    }

    &-label {
      width: 84px;
      flex-shrink: 0;
      line-height: 32px;
      font-size: 14px;
      color: #333;
      text-align: right;
      padding-right: 6px;

      .required {
        color: #f56c6c;
        margin-right: 4px;
      }
    }

    &-value {
      flex: 1;
      min-width: 0;

      .selected-users {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 12px;

        .user-tag {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          background: #f0f2f5;
          border-radius: 16px;
          transition: all 0.3s;

          &:hover {
            background: #e6e8eb;

            .remove-icon {
              opacity: 1;
            }
          }

          .user-name {
            margin: 0 8px;
            font-size: 14px;
            color: #333;
          }

          .remove-icon {
            cursor: pointer;
            font-size: 14px;
            color: #999;
            opacity: 0.6;
            transition: all 0.3s;

            &:hover {
              color: #f56c6c;
              opacity: 1;
            }
          }
        }
      }
    }
  }
}
</style>
