<template>
  <el-popover
    placement="bottom-start"
    :width="255"
    :offset="0"
    trigger="hover"
    :popper-style="{
      borderRadius: '10px',
      padding: '14px 16px',
      height:
        (Number(tab.isExamine || 0) === 0 &&
          (getNodeSubmitter(tab) || tab.remarks || parseExamineInfoFiles(tab).length > 0)) ||
        Number(tab.isExamine || 0) === 1
          ? '340px'
          : '160px'
    }"
  >
    <template #reference>
      <div class="popoverIcon">
        <img
          v-if="tab.status == 'future'"
          src="@/assets/imgs/oa/node/node_unStart.png"
          style="width: 55px; height: 55px; margin-left: -3px"
        />
        <div
          v-else
          style="
            display: flex;
            width: 56px;
            height: 56px;
            border-radius: 28px;
            background: #ffffff;
            box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.21);
          "
        >
          <div
            style="
              margin-left: 5px;
              margin-top: 5px;
              width: 46px;
              height: 46px;
              border-radius: 23px;
              display: flex;
              flex-direction: column;
              align-items: center;
            "
            :style="{
              background: getNodeBgStatusColor(tab.duration || '')
            }"
          >
            <div style="display: flex; flex-direction: column; align-items: center; height: 46px">
              <div
                style="
                  font-weight: 500;
                  font-size: 16px;
                  color: #ffffff;
                  line-height: 20px;
                  margin-top: auto;
                "
                v-if="tab.status != 'active' && tab.taskDefinitionKey !== 'EnterPrisePlanCreate'"
                >{{
                  getNodeWaitTime(tab.duration || '') == '待处理'
                    ? ''
                    : getNodeWaitTime(tab.duration || '')
                }}</div
              >
              <div
                v-if="tab.status != 'active' && tab.taskDefinitionKey !== 'EnterPrisePlanCreate'"
                style="
                  font-weight: 500;
                  font-size: 12px;
                  color: #ffffff;
                  line-height: 14px;
                  margin-bottom: auto;
                "
                >{{ getNodeWaitTimeUnit(tab.duration || '') }}</div
              >
            </div>
          </div>
        </div>
      </div>
    </template>
    <nodeDetail :nodeList="nodeList" :tab="tab" :index="index" />
  </el-popover>
</template>

<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import {
  getNodeBgStatusColor,
  getNodeSubmitter,
  getNodeWaitTime,
  getNodeWaitTimeUnit,
  parseExamineInfoFiles
} from '@/views/OA/package/product/utils.js'

import nodeDetail from './nodeDetail.vue'
const props = defineProps({
  nodeList: {
    type: Array as PropType<any[]>,
    default: () => {
      return []
    }
  },
  tab: propTypes.object.def({}),
  index: propTypes.number.def(0)
})

onMounted(() => {})
</script>

<style lang="scss" scoped>
.download-text {
  width: calc(100% - 20px);
  &:hover {
    color: #0064ff;
    cursor: pointer;
  }
}
.popoverIcon {
  width: 50px;
  height: 50px;
  position: relative;
  // margin-left: 20%;
  margin-left: 35px;
  z-index: 9;
}
</style>
