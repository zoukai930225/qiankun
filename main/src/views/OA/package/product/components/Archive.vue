<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <div>
    <el-dialog
      :append-to-body="true"
      v-model="visible"
      :width="dialogWidth"
      :before-close="handleClose"
      @open="resetForm"
      style="border-radius: 20px"
    >
      <div class="dialog-content">
        <el-form ref="ruleFormRef" :model="form" label-width="120" :rules="rules">
          <el-form-item label="文件资料包" prop="documentInformatioPackage">
            <SWUploadFile v-model:modelValue="imageList" :onlyShow="nodeData.status != 'active'" />
          </el-form-item>
        </el-form>
      </div>

      <template #header="{}">
        <div class="my-header">
          <span style="margin-left: 10px">{{ title }}</span>
        </div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmDialog" v-if="nodeData.status == 'active'"
            >提交</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useDicList } from '@/views/OA/package/designGallery/hooks.js'
import { defineProps } from 'vue'

import { debounce } from 'lodash-es'

import { getArchiveInfoById, saveArchiveInfo } from '@/api/oa/package/designGallery/index'
import SWUploadFile from '@/components/SWUoloadFile/index.vue'

const message = useMessage() // 消息弹窗

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '868px'
  },
  forbidEdit: {
    type: Boolean,
    default: false
  },
  designInfo: {
    type: Object,
    default() {
      return {}
    }
  }
})

const form = ref<any>({
  productPictureUrl: ''
})

const imageList = ref<any[]>([])

const { dicList } = useDicList()

const listDic = ref([])

const dialogWidth = ref('868px')

watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const nodeData = ref<any>({})

// 打开
const open = async (data: any) => {
  visible.value = true
  console.log('data11', data)
  if (data) {
    nodeData.value = { ...data }
    getDetail()
  }
}

const getDetail = async () => {
  try {
    const res = await getArchiveInfoById(props.designInfo.productPlanId)
    if (res.documentInformationPackage) {
      imageList.value = res.documentInformationPackage.split(',').map((item: string) => {
        return {
          name: item.split('?fileName=')[1],
          url: item
        }
      })
    }
  } catch (error) {}
}

defineExpose({ open })

onMounted(() => {})

const handleClose = () => {
  visible.value = false
  form.value = {
    productPictureUrl: ''
  }
  imageList.value = []
  emit('close')
}

const ruleFormRef = ref()

const rules = reactive({
  // 自定义校验
  documentInformatioPackage: {
    required: true,
    message: '请上传文件资料包',
    trigger: 'change'
  }
})

watch(
  imageList,
  (newVal) => {
    form.value.documentInformatioPackage = newVal
      .map((item) => `${item.url}?fileName=${item.name}`)
      .join(',')
  },
  { deep: true }
)

const resetForm = () => {}

const confirmDialog = debounce(async () => {
  ruleFormRef.value &&
    ruleFormRef.value.validate(async (valid) => {
      if (valid) {
        const data = {
          productPlanId: props.designInfo.productPlanId,
          documentInformationPackage: form.value.documentInformatioPackage
        }
        await saveArchiveInfo(data)
        message.success('操作成功')
        emit('confirm')
        visible.value = false
      } else {
        return false
      }
    })
})
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;
  font-size: 16px;

  color: #333333;
  .shenhe-title {
    width: 14px;
    height: 16px;
    margin-right: 3px;
    margin-top: 3px;
  }
}
</style>

<style scoped lang="scss">
.dialogBg {
  position: absolute;
  top: -16px;
  left: -15px;

  z-index: -1;
}

.form-wapper {
  display: flex;
  flex-wrap: wrap;
}
</style>
<style lang="scss">
.oadialog-background {
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/oa_design_audit_bg.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
    overflow: auto;
  }
}
.oadialog-background1 {
  border-radius: 20px;
  background: #f8f8f9;

  .dialog-content {
    background: #ffffff;
    border-radius: 8px;
    margin: 0 auto;
    padding-top: 20px;
    box-sizing: border-box;
    overflow: auto;
    box-shadow: 0px -4px 10px 0px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    .form-wapper {
      display: flex;
      flex-direction: column;
      margin-top: -20px;
      &-header {
        height: 52px;
        display: flex;
        flex-direction: row;
        align-items: center;
        padding-left: 20px;
        border-bottom: 1px solid #f0f0f0;
        margin-bottom: 16px;
        &-line {
          width: 3px;
          height: 10px;
          background: #0064ff;
        }
        &-title {
          padding-left: 6px;
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          letter-spacing: normal;
          color: #333333;
        }
      }
      &-form {
        margin-left: 20px;
        display: flex;
        flex-wrap: wrap;
        width: 100%;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.plan-detail {
  width: 100%;
  min-height: 100px;
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.flex-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

:deep(.el-upload--picture-card) {
  width: 110px;
  height: 110px;
  border: none;
}

.avatar-uploader-icon {
  position: absolute;
  margin-left: 98px;
  margin-top: 105px;
}

:deep(.el-upload--picture-card) {
  width: 98px;
  height: 98px;
  border: none;
}

:deep(.el-form-item__content) {
  align-items: start;
}
:deep(.el-select-group__title) {
  padding-left: 24px;
  font-size: 14px;
  font-weight: 500;
  line-height: 32px;
  color: #333333;
  height: 32px;
}

:deep(.el-select-group) {
  border: none !important;
  margin-bottom: 2px;
  padding-left: 4px;
  padding-right: 4px;
  border-bottom: 0.5px solid #ececec !important;
}
:deep(.el-form-item--default .el-form-item__label) {
  line-height: 20px;
  text-align: right;
  display: flex;
  align-items: center;
  padding-left: 0px;

  font-size: 14px;
  font-weight: normal;
  line-height: normal;
  text-align: right;
  letter-spacing: normal;
  color: #666666;
}
:deep(.el-form-item__label) {
  padding-left: 0px;
  padding-right: 10px;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 98px;
  height: 98px;
}
</style>
