<!--
 * @Date: 2025-02-11 15:09:16
-->
<template>
  <div :class="['card', backgroundClass]" :style="styleObject">
    <div class="card-content">
      <slot></slot>
    </div>
    <div class="card-checkbox">
      <!-- chooseStatus 选中状态 0 未选中 1选中 2已选中 3 样衣上传后待选中 4 淘汰 -->
      <!-- examineStatus 审核状态 2 通过 1拒绝 -->
      <div
        style="font-size: 14px; margin-right: 8px"
        v-if="item.chooseStatus == '3' || item.chooseStatus == '2'"
      >
        选品
      </div>
      <el-popover
        ref="popover"
        placement="right"
        :width="102"
        trigger="hover"
        :visible="visible"
        key="visible"
        v-if="item.chooseStatus == '3'"
      >
        <template #default>
          <div style="cursor: pointer">
            <div class="pop-item" @click.stop="handleSelect('2')">选中</div>
            <div class="pop-item" @click.stop="openConfirmDialog(2)">淘汰</div>
            <!-- <div class="pop-item" @click="handleCancle">取消选中</div> -->
          </div>
        </template>
        <template #reference>
          <div class="circle" @click.stop="visible = true"></div>
        </template>
      </el-popover>

      <el-popover
        ref="popover"
        placement="right"
        :width="102"
        key="selectedVisible"
        trigger="hover"
        :visible="selectedVisible"
        v-if="item.chooseStatus == '2'"
      >
        <template #default>
          <div style="cursor: pointer">
            <div class="pop-item" @click.stop="openConfirmDialog(1)">取消选中</div>
          </div>
        </template>

        <template #reference>
          <div class="circle-activity" @click.stop="selectedVisible = true"></div>
        </template>
      </el-popover>
    </div>
    <img
      :src="iconUrl"
      class="icon"
      v-if="item.examineStatus == '2' || item.examineStatus == '1'"
    />
    <img
      src="@/assets/imgs/oa/xuanzhong.png"
      class="xuanzhong"
      v-if="item.chooseStatus == '2' && item.examineStatus == '2'"
    />
    <img src="@/assets/imgs/oa/taotai.png" class="xuanzhong" v-if="item.chooseStatus == '4'" />
  </div>

  <confirmDialog
    ref="confirmDialogRef"
    @confirm="handleConfirmComplete"
    :title="'系统提醒'"
    cancelText="取消"
    confirmText="确定"
    :content="messageContent"
  />
</template>

<script lang="ts" setup>
import { choosePicture } from '@/api/oa/new/designGallery/index'
import { getPlanNodeByDesignId, sendFeiShuMessage } from '@/api/oa/new/develop'
import confirmDialog from '@/views/OA/new/develop/components/confirmDialog.vue'
import { defineEmits, defineProps, ref } from 'vue'
const message = useMessage() // 消息弹窗

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  styleObject: {
    type: Object,
    default: () => ({})
  }
})

const visible = ref(false)
const selectedVisible = ref(false)
onMounted(() => {
  window.addEventListener('click', () => {
    visible.value = false
    selectedVisible.value = false
  })
})

const isRequesting = ref(false)
const handleSelect = async (value) => {
  try {
    if (isRequesting.value) {
      return
    }
    const data = {
      id: props.item.id, //设计图id
      developmentPlanId: props.item.developmentPlanId, //开发计划id
      enterprisePlanId: props.item.enterprisePlanId, //企划id
      chooseStatus: value //选中状态 0未选中 1选中 2已选中 4 淘汰
    }
    isRequesting.value = true
    await choosePicture(data)
    message.success('操作成功')
    emit('success', false)
    visible.value = false
    selectedVisible.value = false
    isRequesting.value = false
    const res = await getPlanNodeByDesignId({ npDesignPictureGodownId: props.item.id })
    if (res && res.length > 0) {
      let currentIndex = -1
      res.forEach((item, index) => {
        if (item.nodeCode === 'ChooseMeeting') {
          currentIndex = index
        }
      })
      let nextNode = {}
      if (currentIndex >= 0 && currentIndex + 1 >= 0 && currentIndex + 1 < res.length) {
        nextNode = { ...res[currentIndex + 1] }
      }
      let receiveIds = []
      if ((Number(nextNode.isExamine) || 0) === 0) {
        // 提交人员
        receiveIds = (nextNode.personInCharge && nextNode.personInCharge.split(',')) || []
      } else if ((Number(nextNode.isExamine) || 0) === 1) {
        // 审核人员
        const examineInfo = (nextNode.examineInfo && JSON.parse(nextNode.examineInfo)) || {}
        if (examineInfo && examineInfo.length > 0) {
          let examinePersonArr = []
          examineInfo.forEach((element) => {
            const arr = (element.examineNodePerson && element.examineNodePerson.split(',')) || []
            arr.forEach((item1) => {
              if (item1 && !examinePersonArr.includes(item1)) {
                examinePersonArr.push(item1)
              }
            })
          })
          receiveIds = [...examinePersonArr]
        }
      }

      const feiShuSendParam = {
        designPictureId: props.item.id || '',
        noteName: '选品',
        currentNodeCode: 'ChooseMeeting',
        nextNodeName: nextNode.nodeName || '',
        nextNodeCode: nextNode.nodeCode || '',
        nodeStatus: '已结束',
        receiveIds: receiveIds || []
      }

      await sendFeiShuMessage(feiShuSendParam)
    }
  } catch (error) {
    visible.value = false
    selectedVisible.value = false
  }
}

const messageContent = ref('')

// 打开淘汰确认弹窗
const confirmType = ref(0) // 1取消选中 2淘汰
const confirmDialogRef = ref() // 确认弹窗的 Ref
const openConfirmDialog = async (type) => {
  confirmType.value = type
  confirmType.value === 1
    ? (messageContent.value = '确认取消选中此产品吗?')
    : (messageContent.value = '确认淘汰此产品吗?')
  confirmDialogRef.value.open()
}

// 确定淘汰
const handleConfirmComplete = async () => {
  if (confirmType.value === 1) {
    handleSelect('1')
  } else {
    handleSelect('4')
  }
}

const backgroundClass = computed(() => {
  if (props.item.disPlayEditorAgainButton) {
    return 'status-2' //黄色
  } else {
    switch (props.item.examineStatus) {
      //  case 2:
      //   return 'status-2' //黄色
      case 2:
        return 'status-4' //红色
      case 1:
        return 'status-3' //绿色
      default:
        return 'status-default' //灰色
    }
  }
})

const iconUrl = computed(() => {
  switch (props.item.examineStatus) {
    case '2':
      return 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/877444744-reject-icon.png'
    case '1':
      return 'https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/265091067-pass-icon.png'

    default:
      return ''
  }
})

const emit = defineEmits(['update:modelValue', 'success'])
</script>

<style scoped lang="scss">
.card {
  width: 389px;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 12px;
  box-sizing: border-box;
  position: relative;
  border: 1px solid #ececee;
}

.icon {
  // width: 70px;
  // height: 50px;
  // position: absolute;
  // bottom: 63px;
  // left: 137px;
}
.xuanzhong {
  // width: 80px;
  // height: 80px;
  position: absolute;
  top: -15px;
  left: -20px;
}

.card-content {
  flex: 1;
}

.card-checkbox {
  display: flex;
  flex-direction: row;
  position: absolute;
  top: 10px;
  right: 16px;

  .circle {
    // border-radius: 50%;
    width: 20px;
    height: 20px;
    border: 1px solid #bbbbbb;
    background: #ffffff;
    border-radius: 2px;
  }

  .circle-activity {
    // border-radius: 50%;
    width: 20px;
    height: 20px;
    background: url('@/assets/imgs/oa/selected_square.png') no-repeat;
    background-size: 100% 100%;
  }
}
// 黄色背景
.status-2 {
  /* background: url('https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/855322331-reject-bg.png')
    no-repeat;
  background-size: 100% 100%; */
  background: linear-gradient(225deg, #ffd17b 0%, #fff3d8 100%);
}
// 绿色背景
.status-3 {
  // background: url('https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/998241693-pass-bg.png')
  //   no-repeat;
  // background-size: 100% 100%;
  background: linear-gradient(225deg, #d6f1b6 0%, #f5fced 64%, #f6fcef 100%);
}
// 灰色背景
.status-default {
  // background: url('https://zhouwenkeji.oss-cn-hangzhou.aliyuncs.com/visualApproval/514062160-normal.png')
  //   no-repeat;
  // background-size: 100% 100%;

  background: linear-gradient(225deg, #dadfea 0%, #f2f6fd 100%);
}
// 红色背景
.status-4 {
  background: linear-gradient(225deg, #febaba 0%, #fff3f2 100%);
}

.pop-item {
  width: 100%;
  height: 33px;
  line-height: 33px;
  background: white;
  font-weight: 400;
  font-size: 14px;
  color: #666666;
  text-align: left;
  font-style: normal;
  text-align: center;
}
.pop-item:hover {
  background: #f3f4f7;
  color: #486228;
}
</style>
