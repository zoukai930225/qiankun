<!--
 * @Date: 2025-02-11 15:09:16
-->
<template>
  <div :class="['card', backgroundClass, borderClass]" :style="styleObject">
    <div class="card-content">
      <slot></slot>
    </div>
    <div class="card-checkbox">
      <!-- chooseStatus 选中状态 0 未选中 1选中 2已选中 3 样衣上传后待选中 4 淘汰 -->
      <!-- examineStatus 审核状态 2 通过 1拒绝 -->
      <div class="chooseNormal" :class="[
        { 'chooseNormal-status-2': item.examineStatus === '1' && hover },
        { 'chooseNormal-status-3': item.examineStatus === '2' && hover },
        { 'chooseNormal-status-4': item.chooseStatus === '4' && hover },
        {
          'chooseNormal-status-default':
            item.examineStatus !== '1' && item.examineStatus !== '2' && hover
        }
      ]" :style="{ marginTop: item.isCore === 'S' ? '18px' : '0px' }" @mouseover="hover = true"
        @mouseleave="hover = false" v-if="
          (item.chooseStatus == '2' || item.chooseStatus == '3' || item.chooseStatus == '4') &&
          item.isShowChoose
        " @click="chooseVisible = true">
        选品
      </div>
      <el-popover ref="popover" placement="right" :width="102" trigger="hover" :visible="visible" key="visible"
        v-if="item.chooseStatus == '3' && false">
        <template #default>
          <div style="cursor: pointer">
            <div class="pop-item" @click.stop="chooseSelectConfirm()">选中</div>
            <div class="pop-item" @click.stop="openConfirmDialog(2)">淘汰</div>
            <!-- <div class="pop-item" @click="handleCancle">取消选中</div> -->
          </div>
        </template>
        <template #reference>
          <div class="circle" @click.stop="visible = true"></div>
        </template>
      </el-popover>

      <el-popover ref="popover" placement="right" :width="102" key="selectedVisible" trigger="hover"
        :visible="selectedVisible" v-if="item.chooseStatus == '2' && false">
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

    <img src="@/assets/imgs/oa/xuanzhong.png" class="xuanzhong"
      v-if="item.chooseStatus == '2' && item.examineStatus == '2'" />
    <img src="@/assets/imgs/oa/taotai.png" class="xuanzhong" v-if="item.chooseStatus == '4'" />
  </div>

  <confirmDialog ref="confirmDialogRef" @confirm="handleConfirmComplete" :title="'系统提醒'" cancelText="取消"
    confirmText="确定" :content="messageContent" />
  <ChooseReasonDialog ref="chooseSelectDialogRef" @success="chooseSelectSuccess" />
  <!-- 选品 -->
  <ChooseDialog v-model="chooseVisible" :selectItem="item" :designerName="designerName" @confirm="handleConfirm"
    @cancel="handleCancle" @cancel-choose="cancelChoose" :loading="isRequesting"/>
</template>

<script lang="ts" setup>
import { choosePicture } from '@/api/oa/new/designGallery/index'
import confirmDialog from '@/views/OA/new/develop/components/confirmDialog.vue'
import ChooseDialog from './chooseDialog.vue'
import ChooseReasonDialog from './chooseReasonDialog.vue'

import { defineEmits, defineProps, ref } from 'vue'
const message = useMessage() // 消息弹窗

const props = defineProps({
  item: {
    type: Object,
    default: () => ({})
  },
  designerName: {
    type: String,
    default: ''
  },
  styleObject: {
    type: Object,
    default: () => ({})
  }
})
const hover = ref(false)
const visible = ref(false)
const selectedVisible = ref(false)
onMounted(() => {
  window.addEventListener('click', () => {
    visible.value = false
    selectedVisible.value = false
  })
})

const chooseVisible = ref(false)

const handleConfirm = async (data) => {
  if (data.type === '1') {
    // 选中
    handleSelect('2', data.chooseReason)
  } else if (data.type === '2') {
    // 淘汰
    handleSelect('4', data.chooseReason)
  }
}

const handleCancle = () => { }

const chooseSelectDialogRef = ref()
// 选品选中确认弹框 编写选品理由
const chooseSelectConfirm = () => {
  chooseSelectDialogRef.value?.open()
}

const chooseSelectSuccess = (chooseReason) => {
  handleSelect('2', chooseReason)
}

const isRequesting = ref(false)
const handleSelect = async (value, chooseReason = '') => {
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
    if (value === '2' || value === '4') {
      data.chooseReason = chooseReason || ''
    }
    isRequesting.value = true
    await choosePicture(data)
    message.success('操作成功')
    emit('success', false)
    visible.value = false
    chooseVisible.value = false
    selectedVisible.value = false
    isRequesting.value = false
  } catch (error) {
    visible.value = false
    selectedVisible.value = false
  } finally {
    isRequesting.value = false
  }
}

const messageContent = ref('')

const cancelChoose = async () => {
  openConfirmDialog(1)
}
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
  if (props.item.chooseStatus === '4') {
    return 'status-4' //红色
  }
  switch (props.item.examineStatus) {
    case '1':
      return 'status-2' //黄色
    case '2':
      return 'status-3' //绿色
    default:
      return 'status-default' //灰色
  }
})

const borderClass = computed(() => {
  if (props.item.isCore === 'S') {
    return 'isCoreBorder'
  }
  return ''
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

.isCoreBorder {
  border: 2px solid #FFDE87;
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

.chooseNormal {
  width: 60px;
  height: 32px;

  margin-right: -8px;
  border-radius: 4px;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid #e5e5e5;
  font-size: 14px;
  font-weight: normal;
  line-height: 32px;
  letter-spacing: normal;
  /* 文字/一级 */
  color: #333333;
  text-align: center;
}

.chooseNormal-status-2:hover {
  /* 黄色背景 */
  color: #c86e00;
  border: 1px solid #ff8d02;
}

.chooseNormal-status-3:hover {
  /* 绿色背景 */
  color: #518412;
  border: 1px solid #88b74e;
}

.chooseNormal-status-default:hover {
  /* 灰色背景 */
  color: #34425d;
  border: 1px solid #94a3c0;
}

.chooseNormal-status-4:hover {
  /* 红色背景 */
  color: #b35252;
  border: 1px solid #ea8787;
}
</style>
