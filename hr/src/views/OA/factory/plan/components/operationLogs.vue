<template>
  <div class="audit-content" style="overflow-y: auto;height: calc(100vh - 242px);">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item v-for="(key, index) in Object.keys(operationRecords)" :title="key" :icon="ArrowRight"
        :name="index.toString()" :key="index">
        <div class="audit-content-item" v-for="(value, index) in operationRecords[key]" :key="index">
          <div class="row">
            <div class="audit-timeLine" :class="{ 'audit-timeLineLast': index === operationRecords[key].length - 1 }">
              <img class="audit-icon" :src="getStatusOptions(value.examineResult)?.icon" alt="" />
            </div>

            <div class="mb10px">
              <div class="audit-title">
                <div class="audit-person">
                  <commonUser :data="{ avatarOrigin: value.avatarOrigin, name: value.examinePersonName }" />
                </div>
                <div class="audit-status" :style="{ color: getStatusOptions(value.examineResult)?.color }">
                  {{ value.examineTitle }}
                </div>
              </div>
              <div class="audit-time">{{ value.createdAt }}</div>
              <div class="audit-remark" v-if="value.examineRemark">{{ value.examineRemark }}</div>
            </div>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>

  </div>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue'
import failSvg from '@/assets/svgs/failed.svg'
import passSvg from '@/assets/svgs/done.svg'
import commonUser from '@/views/OA/factory/components/commonUser.vue'
import { defineProps } from 'vue'

const props = defineProps({
  operationRecords: {
    type: Object as any,
    default: () => { }
  },
  recordLoading: {
    type: Boolean,
    default: false
  }
})

const activeNames = ref(['0']) // 控制折叠面板的展开状态
const handleChange = (newActiveNames) => {
  activeNames.value = newActiveNames
}

const getStatusOptions = (status: number) => {
  if (status === 1) {
    return {
      icon: passSvg,
      color: '#349B34'
    }

  } else if (status === 2) {
    return {
      icon: failSvg,
      color: '#EB3737'
    }
  }
}

</script>

<style scoped lang="scss">
.audit-content {
  // padding: 20px;
  // padding-top: 10px;
  border-radius: 4px;
  box-sizing: border-box;

  .audit-time {
    font-size: 12px;
    width: 141px;
    color: #8c8e90;
    margin: 6px 0 0;
  }

  .audit-timeLine {
    display: flex;
    width: 1px;
    height: auto;
    margin-right: 20px;
    background: #d8dce5;

    .audit-icon {
      margin-left: -8px;
      width: 16px;
      height: 16px;
    }
  }

  .audit-timeLineLast {
    background: transparent;
  }

  .audit-title {
    margin-top: -1px;
    padding-bottom: 3px;
    display: flex;
    align-items: center;
  }

  .audit-status {
    font-size: 14px;
    color: #349b34;
  }

  .audit-remark {
    margin-top: 6px;
    font-size: 14px;
    color: #333;
    word-break: break-all;
  }
}

:deep(.el-collapse) {
  --el-collapse-border-color: transparent;
}

:deep(.el-collapse-item__wrap) {
  padding: 10px;
  border-radius: 4px;
}

:deep(.el-collapse-item__header) {
  background: #F4F6FA;
  color: #666;
  padding: 0 10px;
}

:deep(.el-collapse-item) {
  margin-bottom: 10px;
}
</style>
