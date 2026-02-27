<template>
  <el-dialog
    title="进度模版"
    :model-value="visible"
    :show-close="false"
    class="templateDialog"
    :style="{
      width: '490px',
      background:
        'linear-gradient( 226deg, #F2F3FF 0%, #FFFFFF 39%, #FFFFFF 88%, #E8F6FD 95%, #F0F8FF 100%)',
      'box-shadow': '10px 10px 24px 0px rgba(0,0,0,0.07)',
      'border-radius': '14px'
    }"
    @close="handleClose"
  >
    <template #header>
      <div class="header">
        <div>进度模版</div>
        <img src="@/assets/imgs/common/close.png" alt="" @click="handleClose" />
      </div>
    </template>
    <div class="dialog-wrap">
      <div class="top">
        <div class="top-left">
          <span class="label">企划名称：</span>
          <span class="text">{{ dataInfo.planName }}</span>
        </div>
        <div class="top-right">
          <span class="label">任务编号：</span>
          <span class="text">{{ dataInfo.planCode }}</span>
        </div>
      </div>
      <div class="center">
        <el-select
          style="width: 297px"
          size="large"
          v-model="selectVal"
          placeholder="请选择进度模板"
          @change="handleChange"
          disabled
        >
          <el-option
            v-for="dict in templateList"
            :key="dict.id"
            :label="dict.templateName"
            :value="dict.id"
          />
        </el-select>
      </div>
      <div class="main" v-if="nodeList && nodeList.length > 0">
        <el-scrollbar
          :style="{
            width: '100%',
            height: nodeList.length > 2 ? '500px' : 'auto',
            'min-height': '200px'
          }"
        >
          <div class="node" style="min-height: 200px">
            <div
              class="node-item"
              v-for="(item, index) in nodeList"
              :key="item.npProgressTemplateNodeId"
            >
              <div class="text-body">
                <div class="name">{{ item.nodeName }}</div>
                <div class="time time-start">
                  <img :src="startDot" alt="" />
                  <div class="cell-line"></div>
                  <div class="time-box">
                    <div class="label">计划开始</div>
                    <div class="text">{{ formatCustomDate(item.planStartTime) }}</div>
                  </div>
                </div>
                <div class="time time-end">
                  <img :src="endDot" alt="" />
                  <div class="time-box">
                    <div class="label">计划结束</div>
                    <div class="text">{{ formatCustomDate(item.planEndTime) }}</div>
                  </div>
                </div>
              </div>
              <div class="row-line"></div>
              <div class="progress">
                <div class="number">0{{ index + 1 }}</div>
                <img :src="arrow" alt="" />
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </el-dialog>
</template>
<script setup lang="tsx">
import startDot from '@/assets/imgs/oa/product/dot-success.png'
import endDot from '@/assets/imgs/oa/product/dot-fail.png'
import arrow from '@/assets/imgs/oa/develop/arrow.png'
import { getProgressList, getProductPlanNodeByTemplate } from '@/api/oa/new/develop'

import { formatCustomDate } from './../utils'
const templateList = ref<any[]>([])
const dataInfo = ref({
  planName: '',
  planCode: ''
})
const nodeList = ref<any[]>([])
const selectVal = ref('')
const visible = ref(false)
const currentId = ref('')
const templateId = ref('')
const progressTemplate = ref('') // 进度模版名称
const resetData = () => {
  // 清空
  selectVal.value = ''
  templateId.value = ''
  dataInfo.value.planCode = ''
  dataInfo.value.planName = ''
  nodeList.value = []
}

const open = async (id, selectTemplateId, planCode, planName) => {
  resetData()

  visible.value = true
  currentId.value = id
  console.log('打开页面的模版ID', selectTemplateId)
  dataInfo.value.planCode = planCode
  dataInfo.value.planName = planName

  await _getProgressList()
  if (selectTemplateId) {
    console.log('模版ID', templateId.value)
    selectVal.value = selectTemplateId || ''
    templateId.value = selectTemplateId || ''
    console.log('templateList.value', templateList.value)
    const item = templateList.value.find((item) => item.id === selectTemplateId)
    if (item) {
      progressTemplate.value = item.templateName
    }
    console.log('调方法前的模板id', templateId.value)

    getData()
  }
}

// 获取节点数据
const getData = async () => {
  const res = await getProductPlanNodeByTemplate({
    id: currentId.value,
    templateId: templateId.value
  })
  nodeList.value = res.node || []
  // 按照节点顺序排序
  nodeList.value.sort((a, b) => a.nodeOrder - b.nodeOrder)
}
const _getProgressList = async () => {
  const res = await getProgressList()
  templateList.value = res.records || []
}
const handleClose = () => {
  visible.value = false

  emit('success')
}

// 改变选择模板
const handleChange = async (val) => {
  // console.log('触发选择模板', val);
  templateId.value = val
  const arr = templateList.value.filter((item) => item.id === val)
  progressTemplate.value = arr.length ? arr[0].templateName : ''
  console.log('---', progressTemplate.value)
  getData()
}

const emit = defineEmits(['success'])
defineExpose({
  open
})
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: bold;
  padding-bottom: 6px;

  img {
    width: 14px;
    cursor: pointer;
  }
}

.dialog-wrap {
  .top {
    display: flex;
    justify-content: space-between;

    .text {
      color: #0064ff;
    }
  }

  .center {
    display: flex;
    justify-content: center;
    margin: 20px auto;
  }
}

.node {
  padding: 14px;

  &-item {
    display: flex;
    position: relative;
    margin-top: -10px;

    .text-body {
      position: absolute;
      left: 0;
      box-sizing: border-box;
      width: 149px;
      height: 171px;
      background: #ffffff;
      box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.19);
      border-radius: 8px;
      padding: 14px 12px 10px 15px;

      .name {
        padding-bottom: 10px;
      }

      .time {
        display: flex;
        position: relative;

        img {
          width: 10px;
          height: 10px;
          margin-top: 4px;
        }

        .cell-line {
          position: absolute;
          top: 8px;
          left: 4px;
          width: 1px;
          height: 60px;
          border-left: 1px dashed #d5dee4;
        }

        .time-box {
          margin-left: 10px;

          .label {
            color: #666;
            font-size: 12px;
            padding-bottom: 3px;
          }

          .text {
            background-color: #f2fcf8;
            color: #333;
            padding: 7px 10px;
          }
        }
      }

      .time-start {
        margin-bottom: 10px;
      }

      .time-end {
        .time-box {
          .text {
            background-color: #fef7eb;
          }
        }
      }
    }

    .progress {
      margin-left: 196px;
      width: 38px;
      height: 104px;
      background: url('../../../../../assets/imgs/oa/develop/down-blue.png') no-repeat center center;
      background-size: 38px 104px;

      .number {
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        text-align: center;
        padding-top: 40px;
        padding-bottom: 10px;
      }

      img {
        display: block;
        margin: 0 auto;
      }
    }

    .row-line {
      position: absolute;
      left: 149px;
      top: 65px;
      width: 45px;
      height: 1px;
      border-top: 1px dashed #d5dee4;
    }

    &:nth-child(2n) {
      .text-body {
        right: 0;
        left: auto;
      }

      .progress {
        background-image: url('../../../../../assets/imgs/oa/develop/down-gray.png');
      }

      .row-line {
        right: 149px;
        left: auto;
      }
    }

    &:first-child {
      margin-top: 0;

      .progress {
        background-image: url('../../../../../assets/imgs/oa/develop/down-blue-first.png');
      }
    }
  }
}
</style>
