·<!--
 * @Date: 2024-11-13 10:27:37
-->
<!-- 批量操作 -->
<template>
  <div class="drawer-wrapper">
    <el-drawer
      v-model="drawerVisible"
      :with-header="false"
      :wrapper-closable="true"
      class="drawer"
      @close="reset"
      size="968"
    >
      <div style="padding: 20px; box-sizing: border-box">
        <div class="drawerTitle"
          ><div>批量操作</div
          ><div @click="drawerVisible = false"
            ><el-icon><CloseBold /></el-icon
          ></div>
        </div>
        <!-- table -->
        <div class="table-wapper">
          <div class="table-header">
            <div style="width: 20%">平台</div>
            <div style="width: 20%">品类</div>
            <div style="width: 20%">需求类型</div>
            <div style="width: 20%">运营</div>
            <div style="width: 20%">产品编码</div>
          </div>
          <div class="table-item" v-for="item in list" :key="item.id">
            <div class="table-value">{{ getStoreByValue(item?.store) }}</div>
            <div class="table-value">{{ getCategoryByValue(item?.category) }}</div>
            <div class="table-value">{{
              `${formarTwoType(item?.demandType, item?.secondDemandType)}`
            }}</div>
            <div class="table-value">{{ item?.createdRealname }}</div>
            <div class="table-value">{{ item?.goodsCode || '' }}</div>
          </div>
        </div>
        <!-- select -->
        <div class="common-select-wapper">
          <div class="select-wapper" v-if="!isTemporary">
            <div
              class="select-item"
              v-for="(item, index) in selectList"
              @click="selectChange(index)"
              :key="item"
              :class="{ activity: currentTab == index }"
              >{{ item }}</div
            >
          </div>
          <!--  新品需求&优化需求-->
          <SWtabsTable
            :node="currentTab + 1"
            :isTemporary="isTemporary"
            v-if="drawerVisible"
            :list="list"
            @success="handleSuccess"
          />
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script lang="ts" setup>
import SWtabsTable from '../baseComponents/SelectSwtabsTable.vue'
import { formarTwoType } from '../common.js'
import { getCategoryByValue, getStoreByValue } from './common'
defineOptions({ name: 'ListForm' })

const message = useMessage()
const drawerVisible = ref(false)
const list = ref()
const currentTab = ref(0)
const selectList = ['方案', '拍摄', '后期', '页面']

const selectChange = (index) => {
  currentTab.value = index
}
const isTemporary = ref(false) // 是否是临时任务
const open = async (arr) => {
  drawerVisible.value = true
  isTemporary.value = arr[0].demandType == 'temporary'
  if (isTemporary.value) {
    currentTab.value = 4
  }
  list.value = arr
}

const reset = () => {
  currentTab.value = 0
  isTemporary.value = false
}

const handleSuccess = () => {
  drawerVisible.value = false
  reset()
  emit('success')
}

defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success'])
</script>

<style lang="scss" scoped>
:deep(.el-drawer){
  border-top-left-radius: 16px !important;
  border-bottom-left-radius: 16px !important;
  overflow: hidden !important;
}

// 背景
:deep(.el-drawer__body){
  background-image: url('@/assets/imgs/drawer_bg.png') !important;
  background-size: cover !important;
}
.drawer-wrapper {
  overflow: hidden;
  border-radius: 16px;
}

.drawerTitle {
  font-size: 14px;
  display: flex;
  color: #333333;
  font-weight: 600;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin: 0 0 18px 0;
}
.table-wapper {
  width: 100%;
  min-height: 200px;
  padding: 20px;
  box-sizing: border-box;
  width: 928px;
  background: #ffffff;
  border-radius: 8px 0px 0px 8px;
  text-align: center;
  .table-header {
    width: 100%;
    height: 50px;
    background: #f2f6fc;
    border-radius: 4px;
    display: flex;
    flex-direction: row;
    line-height: 50px;
    font-weight: 400;
    font-size: 14px;
    color: #666666;
  }
  .table-item {
    display: flex;
    flex-direction: row;
    .table-value {
      width: 20%;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
      padding: 20px 0;
      box-sizing: border-box;
    }
    border-bottom: 1px solid #f0f0f0;
  }
  .table-item:last-child {
    border-bottom: none;
  }
}
.common-select-wapper {
  margin-top: 10px;
  width: 100%;
  background: #ffffff;
  border-radius: 8px 0px 0px 8px;
  padding: 20px;
  box-sizing: border-box;
  .select-wapper {
    display: flex;
    flex-direction: row;
    .select-item {
      cursor: pointer;
      width: 97px;
      height: 48px;
      line-height: 48px;
      text-align: center;
      background: url('@/assets/imgs/team/commen-select.png');
      background-size: 100% 100%;
      margin-right: 22px;
      font-weight: 400;
      font-size: 14px;
      color: #333333;
    }
    .activity {
      background: url('@/assets/imgs/team/common-select-active.png');
      background-size: 100% 100%;
      color: #ffffff;
      height: 55px;
    }
  }
}

.item {
  height: 40px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 7px;
  box-sizing: border-box;
  .left-wapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .img {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }
  .info {
    display: flex;
    flex-direction: column;
    margin-left: 14px;
    .text {
      height: 20px;
      line-height: 20px;
    }
    .name {
      font-size: 14px;
      color: #333333;
    }
    .desc {
      font-size: 12px;
      color: #999999;
    }
  }
}

.itemValue {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 26px;
  background: #cad6f8;
  border-radius: 13px;
  padding: 1px 6px;
  box-sizing: border-box;

  .itemDesc {
    font-size: 14px;
    color: #333333;
    margin-left: 6px;
    margin-right: 6px;
  }
  .avatorLogo {
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }

  .itemClose {
    cursor: pointer;
    width: 6px;
    height: 6px;
  }
}

.eloption .el-select-dropdown__wrap .el-select-dropdown__item {
  height: 50px !important;
}
.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
}
</style>
