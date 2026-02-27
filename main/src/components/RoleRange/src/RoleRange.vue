<template>
  <el-dialog
    title="权限管理"
    v-model="dialogVisible"
    :show-close="false"
    :append-to-body="true"
    style="
      width: 540px;
      padding: 20px;
      background: linear-gradient(226deg, #ffffff 0%, #ffffff 88%, #e8f6fd 95%, #f0f8ff 100%);
      border-radius: 14px;
    "
  >
    <template #header>
      <div class="header">
        <div>权限管理</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
      </div>
    </template>

    <div class="container" v-loading="PermissionLoading">
      <!-- 权限类型 -->
      <div class="channel-container">
        <div
          v-for="(key, index) in Object.keys(platformData).sort()"
          :key="index"
          @click="handlePlatformClick(key, index)"
          class="channel-item"
          :class="{ 'channel-item_selected': index === currentIndex }"
        >
          {{ key }}
        </div>
      </div>
      <!-- 权限名称 -->
      <div class="role-container">
        <el-checkbox-group v-model="checkList" @change="handleStoreChange">
          <el-checkbox
            :label="showPermissionName(item)"
            :value="item"
            v-for="(item, index) in roleData"
            :key="index"
            class="role-item"
          />
        </el-checkbox-group>
      </div>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import * as UserApi from '@/api/system/user'
const emit = defineEmits(['submit']) // 定义 submit 事件，用于保存后的回调
const dialogVisible = ref(false) // 弹窗的是否展示
const checkList = ref<string[]>([]) // 选中的列表
const isSingleSelect = ref(false) // 是否单选

/** 打开弹窗 */
const open = async (roleRange: [], type: string, singleSelect = false) => {
  console.log('打开弹窗,', roleRange)
  dialogVisible.value = true
  isSingleSelect.value = singleSelect
  resetData()
  await getQueryPermissions()
  if (roleRange.length) {
    // 回显
    checkList.value = roleRange
  }
}

/** 显示权限名称 */
const showPermissionName = (item) => {
  if (item.channel === 'ALL') {
    return `${item.name}-全部渠道`
  } else {
    if (item.channelName) {
      return `${item.name}-${item.channelName}`
    } else {
      return `${item.name}`
    }
  }
}

// 获取全部角色数据
const PermissionLoading = ref(false)
const platformData = ref({}) // 权限分类
const roleData = ref<any>([]) // 角色数据
const getQueryPermissions = async () => {
  PermissionLoading.value = true
  try {
    const data = await UserApi.getPermissionModule().catch(() => {})

    platformData.value = data
    roleData.value = platformData.value[Object.keys(platformData.value).sort()[0]]
  } finally {
    PermissionLoading.value = false
  }
}

// 点击分类时，获取对应分类的角色列表
const currentIndex = ref(0)
const handlePlatformClick = (platformId, index) => {
  currentIndex.value = index
  roleData.value = platformData.value[platformId]
}

// 更新选中的角色列表
const handleStoreChange = (value) => {
  if (isSingleSelect.value) {
    if (checkList.value && checkList.value.length > 0) {
      checkList.value = [checkList.value[checkList.value.length - 1]]
    }
  } else {
    checkList.value = value
  }
  console.log('value', value)
}

// 提交
const handleSubmit = () => {
  dialogVisible.value = false

  emit('submit', {
    currentIndex: currentIndex.value,
    checkList: checkList.value
  })
}

// 重置数据
const resetData = () => {
  currentIndex.value = 0
  platformData.value = {}
  checkList.value = []
  roleData.value = []
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗
</script>

<style lang="scss" scoped>
/* 隐藏滚动条，但保持滚动功能 */
::-webkit-scrollbar {
  display: none;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  img {
    width: 14px;
    cursor: pointer;
  }
}
.container {
  display: flex;
  width: 100%;
  max-height: 443px;
  margin: 0 auto;
  .channel-container {
    width: 120px;
    padding: 10px 4px;
    max-height: 320px;
    overflow: auto;
    border: 1px solid #dcdfe6;
    border-radius: 14px;
    margin-right: 14px;
    box-sizing: border-box;
    cursor: pointer;
    .channel-item {
      font-size: 14px;
      color: #333333;
      padding: 10px 0 10px 20px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: relative;
      margin-bottom: 6px;
    }
    .channel-item_selected {
      background: #ecf4ff;
      &::before {
        content: ' ';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background: #0064ff;
        border-radius: 4px 0px 0px 4px;
      }
    }
  }
  .role-container {
    flex-grow: 1;
    min-width: 300px;
    cursor: pointer;
    padding: 10px 16px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 14px;
    max-height: 320px;
    overflow: auto;
    .role-item {
      display: flex;
      font-size: 14px;
    }
  }
}
</style>
