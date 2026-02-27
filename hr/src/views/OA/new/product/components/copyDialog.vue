<template>
  <div>
    <SWDialog
      v-if="visible"
      v-model="visible"
      :title="dialogTitle"
      :width="width"
      :showTitleLine="true"
      :show-bottom-line="true"
    >
      <div
        class="dialog-content"
        style="
          width: 780px;
          height: auto;
          padding: 20px;
          padding-bottom: 0px;
          padding-left: 0px;
          box-sizing: border-box;
        "
      >
        <el-form
          ref="ruleFormRef"
          :model="form"
          label-width="auto"
          :rules="rules"
          @click="formBgClick"
        >
          <el-form-item label="图稿编号" prop="artworkNumber">
            <el-input v-model="form.artworkNumber" placeholder="请输入图稿编号"></el-input>
            <div class="row-center">
              <img
                src="@/assets/imgs/common/warning_icon.png"
                alt=""
                style="width: 14px; height: 14px"
              />
              <div style="font-size: 14px; color: #e26a00; margin-left: 5px">
                增加图稿编号，在还没有产生大货编号之前可以由设计师/买手自由编辑，方便快速定位，不可重复</div
              >
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog" :loading="loading">提交</el-button>
        </div>
      </template>
    </SWDialog>
  </div>
</template>

<script lang="ts" setup>
// import STextArea from '@/components/common/input/s-textarea.vue'
// import SWUploadFile from '@/components/SWUoloadFile/index.vue'

// import { businessRecycleSubmit } from '@/api/oa/new/develop'

// import dialog_title_warn from '@/assets/imgs/common/dialog_title_warn.png'

import request from '@/config/axios'

const message = useMessage() // 消息弹窗

const props = defineProps({
  forbidEdit: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    required: true
  },

  width: {
    type: String,
    default: '800px'
  }
})
const dialogTitle = ref('复制')
const form = reactive({
  npDesignPictureId: undefined,
  artworkNumber: undefined
})

const selectItem = ref()
const open = async (data: any) => {
  // selectItem.value = data || {}
  const {id} = data
  form.npDesignPictureId = id
  visible.value = true
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const rules = reactive({
  artworkNumber: [{ required: true, message: '请输入图稿编号', trigger: 'blur' }]
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

const visible = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    visible.value = newVal
  }
)

const fileDataUploadFileRef = ref()

const formBgClick = () => {
  fileDataUploadFileRef.value?.cancelUploadSelect()
}

const handleClose = () => {

  visible.value = false
  emit('update:modelValue', false)
  emit('cancel')
}
const loading = ref(false)
const ruleFormRef = ref()
const confirmDialog = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (valid) {
      const data = {
        ...form,
      }
      loading.value = true
      try {
        await request.post({url: '/api/np/plan/copyProductPlan', data})
        message.success('操作成功')
        emit('confirm', data)
        emit('update:modelValue', false)
        handleClose()
      } finally {
        loading.value = false
      }
    } else {
      return false
    }
  })
}
</script>

<style scoped lang="scss">
.dialog-footer {
  margin-top: 10px;
  margin-right: 20px;
}
</style>
