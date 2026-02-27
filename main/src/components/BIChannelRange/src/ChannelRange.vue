<template>
  <el-dialog
    title="应用范围"
    v-model="dialogVisible"
    :show-close="false"
    style="
      width: 520px;
      height: 440px;
      background: linear-gradient(226deg, #ffffff 0%, #ffffff 88%, #e8f6fd 95%, #f0f8ff 100%);
      border-radius: 14px;
    "
  >
    <template #header>
      <div class="header">
        <div>应用范围</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="dialogVisible = false" />
      </div>
    </template>

    <div class="container">
      <!-- 渠道 -->
      <div class="channel-container">
        <div
          v-for="(key, index) in Object.keys(platformData)"
          :key="index"
          @click="handlePlatformClick(key, index)"
          class="channel-item"
          :class="{ 'channel-item_selected': index === currentIndex }"
        >
          {{ getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, key) || key }}
        </div>
      </div>
      <!-- 店铺 -->
      <div class="store-container">
        <el-checkbox-group
          v-model="checkList"
          v-if="storeData.length > 0"
          @change="handleStoreChange"
        >
          <el-checkbox
            :label="item.shopName"
            :value="{ shopName: item.shopName, storeCode: item.storeCode }"
            v-for="(item, index) in storeData"
            :key="index"
            class="store-item"
          />
        </el-checkbox-group>
        <el-empty description="全渠道" v-else />
      </div>
    </div>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">保 存</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import * as CommonApi from '@/api/common'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
const emit = defineEmits(['submit', 'getDefaultChannel']) // 定义 submit 事件，用于保存后的回调
const dialogVisible = ref(false) // 弹窗的是否展示
const checkList = ref<string[]>([]) // 选中的店铺列表

/** 打开弹窗 */
const open = async (storeRangeStr: string, type: string, selectChannel: string) => {
  dialogVisible.value = true
  resetData()
  currentPlatformId.value = selectChannel
  await getQueryChannels()
  if (storeRangeStr) {
    updateSelectedStores(storeRangeStr, type)
  }
}
// 将传入的字符串转换成数组，并更新选中的店铺列表--回显处理
const updateSelectedStores = (storeRangeStr, type) => {
  // 如果传入的字符串是全渠道，则他不对应任何一个店铺，直接返回空数组

  if (storeRangeStr !== '全渠道') {
    const shopNamesArray = storeRangeStr.split(', ')
    const matchedShops = []
    for (const platform in platformData.value) {
      platformData.value[platform].forEach((shop) => {
        const valueToMatch = type === 'storeCode' ? shop.storeCode : shop.shopName
        // 检查店铺名称是否在 shopNamesArray 中
        if (shopNamesArray.includes(valueToMatch)) {
          // 如果匹配，添加到 matchedShops 数组中
          matchedShops.push({ storeCode: shop.storeCode, shopName: shop.shopName })
        }
      })
    }
    checkList.value = matchedShops
  } else {
    checkList.value = []
  }
}

// 获取平台数据
const ChannelLoading = ref(false)
const platformList = ref([])
const platformData = ref({}) // 平台数据
const storeData = ref([]) // 店铺数据
const getQueryChannels = async () => {
  ChannelLoading.value = true
  try {
    const data = await CommonApi.getQueryChannels({ isPermission: 1, type: 'BI' }).catch(() => {})
    platformList.value = data || []
    const categorizedData = transformData(data)

    platformData.value = categorizedData
    // 在第一条添加一条数据,用于展示"全渠道"的选项
    platformData.value = {
      ...{ 全渠道: [] }, // 首先添加"全渠道"的条目
      ...categorizedData // 然后添加其他渠道的数据
    }

    Object.keys(platformData.value).forEach((value, index) => {
      if (value === currentPlatformId.value) {
        currentIndex.value = index
        getStoreList(currentPlatformId.value)
      }
    })
    console.log('觉得撒库拉发', currentPlatformId.value, platformData)
    // console.log('platformData', platformData.value)
  } finally {
    ChannelLoading.value = false
  }
}
// 处理数据，根据platformId分类
const transformData = (listData) => {
  // 使用reduce方法将数据按platformId分类
  return listData.reduce((acc, item) => {
    // 如果累加器中还没有当前platformId的键，则创建一个空数组
    if (!acc[item.platformId]) {
      acc[item.platformId] = []
    }
    // 将当前店铺信息添加到对应platformId的数组中
    acc[item.platformId].push({
      storeCode: item.storeCode,
      shopName: item.shopName
    })
    return acc
  }, {}) // 初始化累加器为一个空对象
}

// 点击平台标签时，获取对应平台的店铺列表
const currentIndex = ref(0)
const currentPlatformId = ref('')
const handlePlatformClick = (platformId, index) => {
  currentIndex.value = index
  currentPlatformId.value = platformId
  // console.log('platformId', platformId)
  if (platformId === '全渠道') {
    checkList.value = []
    storeData.value = []
  } else {
    // 获取对应平台的店铺列表
    getStoreList(platformId)
  }
}

// 获取店铺列表
const getStoreList = (platformId) => {
  try {
    storeData.value = platformData.value[platformId]
  } catch (error) {
    console.log(error)
  }
}

// 点击店铺复选框时，更新选中的店铺列表
const handleStoreChange = (value) => {
  checkList.value = value
  // console.log('value', value);
}

// 提交
const handleSubmit = () => {
  dialogVisible.value = false
  if (currentIndex.value === 0) {
    // 如果选择的是全渠道，则清空选中的店铺列表
    checkList.value = []
  }
  emit('submit', {
    currentIndex: currentIndex.value,
    checkList: checkList.value,
    platformId: currentPlatformId.value,
    platformName:
      getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, currentPlatformId.value || '') ||
      currentPlatformId.value ||
      ''
  })
}

// 重置数据
const resetData = () => {
  currentIndex.value = 0
  platformData.value = {}
  checkList.value = []
  storeData.value = []
}

const getDefaultStore = async () => {
  const data = await CommonApi.getQueryChannels({ isPermission: 1, type: 'BI' }).catch(() => {})
  if (data && data.length > 0) {
    const platformId = data[0].platformId || ''
    const sotre = data[0].storeCode || ''
    const channelName = getDictLabel(DICT_TYPE.SYSTEM_PARAM_CHANNEL, currentPlatformId.value || '')
    const storeName = data[0].shopName || ''
    emit('getDefaultChannel', platformId, sotre, channelName, storeName)
  }
}

onMounted(() => {
  getDefaultStore()
})

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
  width: 430px;
  height: 320px;
  margin: 0 auto;
  .channel-container {
    width: 120px;
    padding: 10px 4px;
    height: 320px;
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
  .store-container {
    min-width: 300px;
    cursor: pointer;
    padding: 10px 16px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    border-radius: 14px;
    height: 320px;
    overflow: auto;
    .store-item {
      display: flex;
      font-size: 14px;
    }
  }
}
</style>
