<!--
 * @Date: 2024-08-05 18:08:34
 评论 
-->
<template>
  <div class="comment-wapper item-row">
    <div class="comment-title" :class="formatCommonTitleDesc()">
      <span class="comment-icon" :class="formatCommonIcon()"></span>
      <span class="comment-desc">{{ formatTitle() }} </span>
    </div>
    <div class="comment-content" :class="formatBgContent()">
      <el-form :model="addForm" label-width="100" label-position="left" ref="formRef">
        <el-form-item label="备注" prop="remark">
          <s-text-area v-model="addForm.remark" style="width: 770px" :rows="4" placeholder="请输入" />
        </el-form-item></el-form>
      <div class="btn-wapper">
        <el-button @click="oncancel" style="width: 64px; height: 32px" :loading="commonType == 4 && loading">{{
          commonType == 4 ? '拒绝' : '取消' }}</el-button>
        <el-button type="primary" style="width: 64px; height: 32px" :loading="loading" @click="onSubmit(1)">{{
          commonType == 4 ? '通过' : '提交' }}</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { createRecord } from '@/api/team/index'
defineOptions({ name: 'CheckTask' })
const message = useMessage() // 消息弹窗

let addForm = reactive({
  remark: undefined //其他说明
})
const loading = ref(false)

const props = defineProps({
  detail: {
    type: Object,
    default: () => { }
  },
  commonType: {
    //1、评论 2、暂停 3/取消暂停 4/审核 5/终止
    type: Number,
    default: 1
  }
})
const emit = defineEmits(['success', 'cancel'])

const formatTitle = () => {
  const typeTitles = {
    1: '评论',
    2: '任务暂停',
    3: '取消暂停',
    4: '审核',
    5: '终止'
  }

  return typeTitles[props.commonType]
}

const formatCommonIcon = () => {
  const typeIcons = {
    2: 'comment-del',
    3: 'pause-icon',
    4: 'shenhe-icon',
    5: 'stop-icon'
  }
  return typeIcons[props.commonType]
}

const formatCommonTitleDesc = () => {
  const typeDescriptions = {
    2: 'comment',
    3: 'pause',
    4: 'shenhe',
    5: 'stop'
  }
  return typeDescriptions[props.commonType]
}

const formatBgContent = () => {
  const typeBgContent = {
    2: 'comment-content-del',
    3: 'comment-content-pause',
    4: 'comment-content-shenhe'
  }
  return typeBgContent[props.commonType]
}

const formatNode = () => {
  const typeNodes = {
    1: 0,
    2: 6,
    3: 6,
    4: 7,
    5: 6
  }

  return typeNodes[props.commonType]
}

const formatType = () => {
  const typeValues = {
    1: 5,
    2: 4,
    3: 6,
    4: 7,
    5: 10
  }

  return typeValues[props.commonType]
}
const onSubmit = async (type) => {
  //   type  任务指派卡片 1 (方案、拍摄、后期、页面)完成卡片 2 任务暂停 4 评论卡片 5    视觉审核卡片 7
  //   node 节点0-任务录入（评论挂在该节点）1-出方案｜2-拍摄｜3-后期｜4-页面｜5-任务完成｜6-任务终止 7 - 视觉审核
  try {
    loading.value = true
    const params = {
      parentId: props.detail.id,
      node: formatNode(),
      type: formatType(),
      remark: addForm.remark
    }

    // 审核节点区分通过还是拒绝
    if (props.commonType == 4 && type == 1) {
      params.type = 7
    } else if (props.commonType == 4 && type == 2) {
      params.type = 8
    }
    await createRecord(params)
    loading.value = false
    message.success('操作成功')
    emit('success')
  } catch (error) {
    loading.value = false
  }
}

const oncancel = () => {
  if (props.commonType == 4) {
    onSubmit(2)
  } else {
    emit('cancel')
  }
}
</script>

<style scoped lang="scss">
.comment-wapper {
  .comment-title {
    padding-left: 16px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: 52px;
    background: #e3e3fc;
    box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
    border-radius: 8px 8px 0px 0px;

    .comment-icon {
      display: block;
      width: 3px;
      height: 10px;
      background: #716fc9;
      margin-right: 6px;
    }

    .comment-del {
      background: #656565;
    }

    .pause-icon {
      background: #01960c;
    }

    .shenhe-icon {
      background: #008fac;
    }

    .stop-icon {
      background: red;
    }
  }

  .comment {
    background: #d9d9d9;
    box-shadow: 0px 2px 11px 0px #cdcdcd;
    border-radius: 8px 8px 0px 0px;
  }

  .pause {
    background: #b1e7b5;
    box-shadow: 0px 2px 11px 0px rgba(0, 71, 5, 0.13);
    border-radius: 8px 8px 0px 0px;
  }

  .shenhe {
    background: #d1eff4;
    box-shadow: 0px 2px 13px 0px rgba(0, 59, 68, 0.23);
    border-radius: 8px 8px 0px 0px;
  }

  .stop {
    background: rgba(228, 16, 39, 0.15);
    border-radius: 8px 8px 0px 0px;
  }

  .comment-content {
    width: 100%;
    background: #fbfcff;
    box-shadow: 0px 2px 11px 0px rgba(0, 44, 110, 0.3);
    border-radius: 0px 0px 4px 4px;
    padding: 16px 16px 12px 16px;
    box-sizing: border-box;

    .title {
      font-size: 12px;
      color: #999999;
      margin-bottom: 6px;
    }

    .content {
      font-size: 12px;
      color: #666666;
    }

    .mid {
      border-bottom: 1px solid #e6eaf8;
      margin-bottom: 12px;
      margin-top: 14px;
    }

    .info {
      .time {
        font-size: 12px;
        color: #999999;
      }

      .name {
        font-weight: 400;
        font-size: 12px;
      }
    }
  }

  .comment-content-del {
    background: #f5f5f5;
    box-shadow: 0px 2px 11px 0px #cdcdcd;
    border-radius: 0px 0px 4px 4px;
  }

  .comment-content-pause {
    background: #fbfffa;
    box-shadow: 0px 2px 11px 0px rgba(0, 71, 5, 0.13);
    border-radius: 0px 0px 4px 4px;
  }

  .comment-content-shenhe {
    background: #f9feff;
    box-shadow: 0px 2px 13px 0px #cdcdcd;
    border-radius: 0px 0px 4px 4px;
  }
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
}
</style>
