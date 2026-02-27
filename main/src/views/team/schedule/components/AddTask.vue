<!--
 * @Date: 2024-08-06 16:12:02
  任务提交 编辑
-->
<template>
  <div class="task-wapper">
    <div class="task-title-wapper">
      <span class="task-icon"></span>
      <span class="task-title">任务提交（{{ formatTitle() }}）</span>
    </div>
    <div class="task-content">
      <el-form :model="addForm" label-width="100" label-position="left" ref="formRef" :rules="rules">
        <div class="bottom-form">
          <el-form-item label="交付时间" prop="deliveryTime">
            <el-date-picker v-model="addForm.deliveryTime" type="date" aria-label="Pick a date"
              placeholder="请按照实际的交付时间填写" style="width: 100%" value-format="YYYY-MM-DD" />
          </el-form-item>

          <el-form-item label="备注" prop="remark">
            <s-text-area v-model="addForm.remark" placeholder="如对下个环节或内容有额外的注意事项，并且现在没有指定的伙伴可以对接时，请备注，没有请写无" />
          </el-form-item>

          <el-form-item label="附件（交付内容截图）" prop="fileList">
            <!-- 上传文件和附件 -->
            <SWuploadFile :fileList="otherList" :imgList="imgList" :allFileList="fileList" />
            <!-- 动态添加链接列表 -->
            <SWaddlink v-model:modelValue="inputItems" />
          </el-form-item>

          <el-form-item>
            <div class="btn-wapper">
              <el-button @click="oncancel" style="width: 64px; height: 32px">取消</el-button>
              <el-button type="primary" :disabled="btnLoading" style="width: 64px; height: 32px"
                @click="onSubmit">提交</el-button>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { createRecord } from '@/api/team/index'
import type { FormRules } from 'element-plus'
import SWaddlink from '../baseComponents/SWaddlink.vue'
import SWuploadFile from '../baseComponents/SWuploadFile.vue'
defineOptions({ name: 'AddTask' })
const btnLoading = ref(false)

let addForm = reactive({
  remark: undefined,
  deliveryTime: undefined, //交付时间
  attachment: undefined, //附件
  goodsPosition: undefined,
  url: undefined
})

const imgList = ref([])
const otherList = ref([])
const inputItems = ref([
  { label: 'URL', value: '', placeholder: '', description: '备注：方案设计图、链接、PPT', desc: '' }
])
const fileList = ref([]) // 文件列表

const props = defineProps({
  node: {
    type: Number,
    default: 1
  },
  detail: {
    type: Object,
    default: () => { }
  },
  currentSubType: {
    type: String,
    default: ''
  }
})

const rules = reactive<FormRules<any>>({
  deliveryTime: [
    {
      type: 'date',
      required: true,
      message: '请输入交付时间',
      trigger: 'change'
    }
  ],
  remark: [
    {
      required: true,
      message: '请输入备注',
      trigger: 'blur'
    }
  ]
})

// 格式化标题
const formatTitle = () => {
  const nodeTitles = {
    1: '方案',
    2: '拍摄',
    3: '后期',
    4: '页面',
    5: '临时'
  }
  return nodeTitles[props.node] || ''
}

// 提交成功或者取消
const emit = defineEmits(['success', 'cancel'])
const oncancel = () => {
  emit('cancel')
}

interface Annex {
  type?: number
  url?: string
  urlRemarks?: string
}
const formRef = ref()
// 任务提交
const onSubmit = async () => {
  try {
    //校验
    await formRef.value.validate()
    btnLoading.value = true
    const annexes: Annex[] = []
    // 多个地址链接
    const itemsWithValue = inputItems.value.filter((item) => item.value !== '')
    itemsWithValue.forEach((item) => {
      // @ts-ignore
      annexes.push({
        type: 1,
        url: item.value,
        urlRemarks: item.desc
      })
    })

    // 附件
    if (otherList.value.length) {
      otherList.value.forEach((item) => {
        // @ts-ignore
        annexes.push({ ...item, type: 0 })
      })
    }
    if (imgList.value.length) {
      imgList.value.forEach((item) => {
        // @ts-ignore
        annexes.push({ ...item, type: 0 })
      })
    }

    if (annexes.length === 0) {
      ElMessage.error('请上传附件或添加链接')
      btnLoading.value = false
      return
    }

    const params = {
      node: `${props.node}`,
      parentId: props.detail.id,
      type: 2,
      expectedCompletionTime: addForm.deliveryTime, //交付时间
      remark: addForm.remark, //备注
      annexes: annexes,
      subNode: props.currentSubType ? props.currentSubType : undefined
    }
    await createRecord(params)
    btnLoading.value = false
    emit('success')
  } catch (error) {
    btnLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.task-wapper {
  width: 100%;
  background: #fbfcff;
  box-shadow: 0px 2px 13px 0px rgba(0, 59, 68, 0.23);
  border-radius: 0px 0px 4px 4px;

  .task-title-wapper {
    width: 100%;
    height: 53px;
    background: linear-gradient(90deg, #e5efff 0%, #c2daff 100%);
    box-shadow: 0px 2px 13px 0px rgba(0, 59, 68, 0.23);
    border-radius: 4px 4px 0px 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding-left: 16px;
    box-sizing: border-box;

    .task-icon {
      display: block;
      width: 3px;
      height: 10px;
      background: #0064ff;
      margin-right: 6px;
    }

    .task-title {
      font-size: 12px;
      color: #333333;
    }
  }

  .task-content {
    width: 100%;
    background: #fbfcff;
    box-shadow: 0px 2px 13px 0px rgba(0, 59, 68, 0.23);
    border-radius: 0px 0px 4px 4px;
    padding: 16px;
    box-sizing: border-box;
  }
}

:deep(.el-upload-list--picture-card) {
  width: 110px;
  height: 110px;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
}

.upload-cus {
  width: 110px;
  height: 108px;
  font-size: 12px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px dashed #b8b8b8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .add-default-img {
    width: 30px;
    height: 26px;
    margin-bottom: 8px;
  }
}

.bottom-info {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  margin-top: 22px;
  align-items: center;
  font-size: 12px;
  color: #0064ff;

  .add-blue {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
}

.input-item {
  width: 100%;
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;

  .input {
    width: 65%;
    // flex: 1;
  }

  .input-desc {
    box-sizing: border-box;
    font-weight: 400;
    font-size: 12px;
    color: #999999;
    background: #fafafa;
    border-radius: 6px;
    margin-left: 14px;
    height: 36px;
    line-height: 36px;
    width: 35%;
  }
}

.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
}

:deep(.el-input__wrapper) {
  height: 32px;
  background: #ffffff !important;
  border-radius: 4px;
}

:deep(.el-textarea__inner) {
  height: 124px;
  background: #ffffff !important;
  border-radius: 4px;
}
</style>
