<!--
 * @Date: 2024-09-12 13:12:09
-->
<!--圆形进度条-->
<template>
  <div class="wapper">
    <el-form :model="addForm" label-width="100" label-position="left" ref="formRef" :rules="rules">
      <div class="bottom-form">
        <el-form-item label="交付时间" prop="deliveryTime">
          <el-date-picker v-model="addForm.deliveryTime" type="date" aria-label="Pick a date" placeholder="请选择交付时间"
            style="width: 100%" value-format="YYYY-MM-DD" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <s-text-area v-model="addForm.remark" placeholder="请输入备注" />
        </el-form-item>

        <el-form-item label="附件" prop="fileList">
          <!-- 上传文件和附件 -->
          <SWuploadFile :fileList="otherList" :imgList="imgList" :allFileList="fileList" />
          <!-- 动态添加链接列表 -->
          <SWaddlink v-model:modelValue="inputItems" />
        </el-form-item>

        <el-form-item>
          <div class="btn-wapper">
            <el-button @click="oncancel" size="small">取消</el-button>
            <el-button size="small" type="primary" :disabled="btnLoading" :loading="btnLoading" @click="onSubmit">
              保存</el-button>
          </div>
        </el-form-item>
      </div>
    </el-form>
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
  },
  index: {
    type: Number,
    default: 1
  },
  parentId: {
    type: String,
    default: ''
  }
})

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

watch(
  () => props.detail,
  (newValue, oldValue) => {
    if (newValue != oldValue) {
      // 重新赋值数据
      addForm.remark = newValue.remark
      addForm.deliveryTime = newValue.createdAt
      const imageFormats = ['png', 'jpg', 'jpeg', 'gif', 'bmp']

      // 链接
      const arr: any = []
      const imgArr: any = []
      const otherArr: any = []

      imgList.value = []
      otherList.value = []
      inputItems.value = []

      newValue.annexes.forEach((item) => {
        if (item.type == '1') {
          arr.push({
            label: 'URL',
            value: item.url,
            placeholder: '',
            description: '备注：方案设计图、链接、PPT',
            desc: item.urlRemarks
          })
        } else if (item.type == '0') {
          const extension = item.fileType.toLowerCase()
          const isImg = imageFormats.includes(extension)

          if (isImg) {
            imgArr.push({
              fileName: item.fileName,
              fileType: item.fileType,
              imageKey: item.imageKey,
              ossPath: item.ossPath
            })
          } else {
            otherArr.push({
              fileName: item.fileName,
              fileType: item.fileType,
              imageKey: item.imageKey,
              ossPath: item.ossPath
            })
          }
        }
      })

      imgList.value = imgArr || []
      otherList.value = otherArr || []
      inputItems.value = arr || []
    }
  },
  {
    deep: true,
    immediate: true
  }
)

const rules = reactive<FormRules<any>>({
  deliveryTime: [
    {
      type: 'date',
      required: true,
      message: '请输入交付时间',
      trigger: 'change'
    }
  ]
})

// 提交成功或者取消
const emit = defineEmits(['success', 'cancel'])
const oncancel = () => {
  emit('cancel', props.index)
}

interface Annex {
  type?: number
  url?: string
  urlRemarks?: string
}

// 任务提交
const onSubmit = async () => {
  try {
    if (!addForm.deliveryTime) {
      ElMessage.error('请输入交付时间')
      return
    }
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

    const params = {
      node: props.detail.node,
      parentId: props.parentId,
      type: 2,
      expectedCompletionTime: addForm.deliveryTime, //交付时间
      remark: addForm.remark, //备注
      annexes: annexes,
      subNode: props.currentSubType ? props.currentSubType : undefined,
      id: props.detail.id
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
.btn-wapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  width: 100%;
}
</style>
