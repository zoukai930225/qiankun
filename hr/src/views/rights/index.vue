<template>
  <ContentWrap>
    <div class="tab-bar mt16px">
      <el-tabs v-model="activityName" @tab-change="handleTabChange">
        <el-tab-pane v-for="{ label, name, icon, activedIcon } in tabsOps" :key="name" :name="name">
          <template #label>
            <img class="mr8px" :src="name === activityName ? activedIcon : icon" alt="" />
            <span>{{ label }}</span>
          </template>
        </el-tab-pane>
      </el-tabs>
      <el-checkbox
        v-model="validFlag"
        label="只看生效"
        :true-value="1"
        :false-value="0"
        @change="handleCheckBoxChange"
      />
    </div>
    <!-- <el-row class="tab-content" :gutter="0" :style="{ transform: transformOps[activityName] }">
      <el-col :span="6"> -->
        <channel-page
          ref="channelRef"
          :validFlag="validFlag"
          v-model:code="drawerCode"
          @set="onSet"
          v-show="activityName === 0"
        />
      <!-- </el-col>
      <el-col :span="6"> -->
        <store-page ref="storeRef" :validFlag="validFlag" v-model:code="drawerCode" @set="onSet" 
           v-show="activityName === 1"/>
      <!-- </el-col> -->
      <!-- <el-col :span="6">
        <category-page
          ref="categoryRef"
          :validFlag="validFlag"
          v-model:code="drawerCode"
          @set="onSet"
        />
      </el-col> -->
      <!-- <el-col :span="6"> -->
        <goods-page ref="goodsRef" :validFlag="validFlag" v-model:code="drawerCode" @set="onSet" 
           v-show="activityName === 3"/>
      <!-- </el-col>
    </el-row> -->
  </ContentWrap>

  <drawer
    v-model:is-show="isShow"
    :biz-id="drawerCode"
    :biz-type="activityName"
    :title="drawerTitle"
    @refresh="currentPage[activityName].getList()"
  />
</template>
<script lang="ts" setup>
import ChannelIcon from '@/assets/svgs/rights/channel.svg'
import ChannelIconActived from '@/assets/svgs/rights/channel-actived.svg'
import StoreIcon from '@/assets/svgs/rights/store.svg'
import StoreIconActived from '@/assets/svgs/rights/store-actived.svg'
import CategoryIcon from '@/assets/svgs/rights/category.svg'
import CategoryIconActived from '@/assets/svgs/rights/category-actived.svg'
import GoodsIcon from '@/assets/svgs/rights/goods.svg'
import GoodsIconActived from '@/assets/svgs/rights/goods-actived.svg'
import { useRightsStore } from '@/store/modules/rights'
const ChannelPage = defineAsyncComponent(() => import('./pages/channel.vue'))
const StorePage = defineAsyncComponent(() => import('./pages/store.vue'))
const CategoryPage = defineAsyncComponent(() => import('./pages/category.vue'))
const GoodsPage = defineAsyncComponent(() => import('./pages/goods.vue'))
const Drawer = defineAsyncComponent(() => import('./components/drawer.vue'))

const rights = useRightsStore()

const activityName = ref<0 | 1 | 2 | 3>(0)
const tabsOps = [
  { label: '渠道', name: 0, icon: ChannelIcon, activedIcon: ChannelIconActived },
  { label: '店铺', name: 1, icon: StoreIcon, activedIcon: StoreIconActived },
  // { label: '类目', name: 2, icon: CategoryIcon, activedIcon: CategoryIconActived },
  { label: '商品', name: 3, icon: GoodsIcon, activedIcon: GoodsIconActived }
]
const validFlag = ref<0 | 1>(1)
const transformOps = {
  0: 'translateX(0)',
  1: 'translateX(-25%)',
  // 2: 'translateX(-50%)',
  3: 'translateX(-50%)'
}
const channelRef = ref()
const storeRef = ref()
const categoryRef = ref()
const goodsRef = ref()
const isShow = ref(false)
const drawerCode = ref('')
const category = ref('')

const currentPage = computed(() => [
  channelRef.value,
  storeRef.value,
  categoryRef.value,
  goodsRef.value
])

const drawerTitle = computed(() => {
  let title = `${tabsOps.find((ele) => ele.name === activityName.value)?.label}负责人设置`
  if (category.value) {
    title += `(${category.value})`
  }
  return title
})

function onSet(val?: string) {
  category.value = val!
  isShow.value = true
}

function handleCheckBoxChange() {
  currentPage.value[activityName.value].getList()
}

function handleTabChange() {
  currentPage.value[activityName.value].getList()
}

onBeforeMount(() => {
  if (!rights.storeOptions.length) {
    rights.getStoreOptions()
  }

  if (!rights.categoryOptions.length) {
    rights.getCategoryOptions()
  }
})
</script>
<style lang="less" scoped>
* {
  line-height: 150%;
  --el-color-primary: #0064ff;
}
:deep(.el-card__body) {
  padding: 0 20px;
}
.tab-bar {
  position: relative;
  :deep(.el-checkbox) {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-70%);
  }
}
.tab-content {
  display: flex;
  width: calc(400% + 80px);
  transition: all 0.2s;
  #channel,
  #store,
  #category,
  #goods {
    flex: 1;
    padding-right: 20px;
  }
}

td {
  white-space: pre-line;
}

:deep(.avatar) {
  width: 18px;
  height: 18px;
  margin-right: 8px;
  border-radius: 50%;
  vertical-align: middle;
}

:deep(.directors) {
  margin-bottom: 12px;
  &:last-of-type {
    margin-bottom: 0;
  }
}

:deep(.director) {
  margin-bottom: 12px;
  font-size: 14px;
  color: #333;
}

:deep(.time) {
  margin-bottom: 12px;
  &:last-of-type {
    margin-bottom: 0;
  }
}

.filter {
  :deep(.el-input) {
    flex: 1;
  }
}

:deep(.logo) {
  max-width: 20px;
  max-height: 20px;
}

:deep(.center) {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper) {
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.el-cascader__tags) {
  flex-wrap: nowrap;

  .el-tag {
    max-width: 70%;
  }
}
</style>
