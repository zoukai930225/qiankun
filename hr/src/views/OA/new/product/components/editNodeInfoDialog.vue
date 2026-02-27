<!--
 * @Date: 2025-02-11 17:22:22
-->
<template>
  <div>
    <!-- <el-drawer
      v-model="visible"
      :size="dialogWidth"
      :before-close="handleClose"
      @open="resetForm"
      :show-close="false"
      :class="{
        'oadialog-background1': nodeData && nodeData.nodeCode === 'ProductinformationFilling'
      }"
      style="border-radius: 20px 0 0 20px"
    > -->
    <SWDrawer
      :append-to-body="true"
      v-model="visible"
      :title="title"
      :width="dialogWidth"
      :before-close="handleClose"
    >
       <div
        class="flex-row"
        style="border-radius: 8px; background: #ffffff;margin-bottom: 20px;"
      >
        <div
          v-if="nodeData && nodeData.nodeCode === 'ProductinformationFilling'"
          class="dialog-content"
        >
          <EditGoodInfo
            ref="EditGoodInfoRef"
            :isEditInfo="true"
            :designInfo="designInfo"
            :forbidEdit="forbidEdit"
            @confirm="confirm"
          />
        </div>
      </div>
      <!-- <template #header="{}">
        <div class="header_txt"> {{ title }}</div>
        <el-icon @click="visible = false" class="header_close">
          <CloseBold />
        </el-icon>
      </template> -->
      <template #footer>
        <div class="dialog-footer">
          <!-- <el-button @click="handleClose">取消</el-button>
          <el-button
            v-if="nodeData && nodeData.nodeCode === 'ProductinformationFilling' && !forbidEdit"
            @click="confirmDialog(true)"
            class="templeSaveBtn"
            >暂存</el-button
          >
          <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog(false)"
            >提交</el-button
          > -->

          <el-button @click="handleClose">取消</el-button>
          <template v-if="nodeData.nodeCode === 'ProductinformationFilling'">
            <el-button
              v-if="!forbidEdit || !finishedErpNode"
              type="primary"
              @click="confirmDialog(false)"
              >暂存</el-button
            >
          </template>
          <template v-else>
            <el-button
              v-if="
                (nodeData && nodeData.nodeCode === 'ProductinformationFilling' && !forbidEdit) ||
                !finishedErpNode
              "
              @click="confirmDialog(true)"
              class="templeSaveBtn"
              >暂存</el-button
            >
            <el-button
              v-if="!forbidEdit || !finishedErpNode"
              type="primary"
              @click="confirmDialog(false)"
              >提交</el-button
            >
          </template>
        </div>
      </template>
    </SWDrawer>
  </div>
</template>

<script lang="ts" setup>
import { useDicList } from '@/views/OA/new/designGallery/hooks.js'
import { defineProps } from 'vue'

import EditGoodInfo from './editGoodInfo.vue'

import { debounce } from 'lodash-es'

import { getDesignDetailById, saveDesign, updateDesign } from '@/api/oa/new/designGallery/index'

const message = useMessage() // 消息弹窗

const { finishedErpNode } = inject('finishedErpNode')

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

console.log(props.forbidEdit, 999)

const radioOptions = [
  {
    label: '是',
    value: '1'
  },
  {
    label: '否',
    value: '0'
  }
]

const { dicList } = useDicList()

const listDic = ref([])

const EditGoodInfoRef = ref()

const dialogWidth = ref('868px')

// const skuList = ref([{ name: "红色L", code: "B621-Hong-L" }, { name: "红色XL", code: "B621-Hong-XL" }, { name: "红色XXL", code: "B621-Hong-XXL" }])

watch(dicList, (newVal) => {
  // @ts-ignore
  listDic.value = newVal || []
})

const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const localForm = ref<any>({})
const nodeData = ref<any>({})

// 打开
const open = async (data: any) => {
  visible.value = true
  if (data) {
    nodeData.value = { ...data }
    if (
      nodeData.value.nodeCode &&
      (nodeData.value.nodeCode === 'ProductinformationFilling' ||
        nodeData.value.nodeCode === 'ERPInformationFilling')
    ) {
      if (nodeData.value.nodeCode === 'ProductinformationFilling') {
        dialogWidth.value = '936px'
      } else {
        dialogWidth.value = '490px'
      }
      if (nodeData.value.nodeCode === 'ProductinformationFilling') {
        setTimeout(() => {
          EditGoodInfoRef.value?.open(nodeData.value)
        }, 30)
        return
      }
      //商品资料填写
      const res = await getDesignDetailById(data.npDesignPictureGodownId) //回显详情
      if (res) {
        localForm.value = { ...res }
        if (nodeData.value.nodeCode === 'ProductinformationFilling') {
          if (localForm.value.color && localForm.value.color.length > 0) {
            localForm.value.color = JSON.parse(localForm.value.color) || []
            // tempColor.value = colorArr
          }

          if (localForm.value.braGn && localForm.value.braGn.length > 0) {
            localForm.value.braGn = JSON.parse(localForm.value.braGn) || []
          }

          if (localForm.value.underwearGn && localForm.value.underwearGn.length > 0) {
            localForm.value.underwearGn = JSON.parse(localForm.value.underwearGn) || []
          }

          // if (localForm.value.color) {
          //   const colorArr = JSON.parse(localForm.value.color) || []
          //   tempColor.value = colorArr
          // }
          if (localForm.value.size) {
            localForm.value.size = JSON.parse(localForm.value.size) || []
          }

          // ;(localForm.value.size = localForm.value.size ? JSON.parse(localForm.value.size) : []), //尺寸
          localForm.value.washLabel = res.washLabel
            ? res.washLabel.split(',').map((item) => {
                return {
                  url: item
                }
              })
            : [] //水洗标识

          localForm.value.tmPicture = res.tmPicture
            ? res.tmPicture.split(',').map((item) => {
                return {
                  url: item
                }
              })
            : [] //烫唛照片
        }
      }
    }
  }
}

defineExpose({ open })

onMounted(() => {})

const handleClose = () => {
  visible.value = false
  emit('close')
}

const ruleFormRef = ref()

const rules = reactive({
  productCode: [{ required: true, message: '请输入货品编码', trigger: 'blur' }]
})
const resetForm = () => {}

const confirmDialog = debounce(async (isTempSave = false) => {
  if (nodeData.value.nodeCode === 'ProductinformationFilling') {
    EditGoodInfoRef.value?.productinformationFillingConfirm(isTempSave)
  } else if (nodeData.value.nodeCode === 'ERPInformationFilling') {
    ruleFormRef.value &&
      ruleFormRef.value.validate(async (valid) => {
        if (valid) {
          eRPInformationFillingConfirm()
        } else {
          return false
        }
      })
  }
})

const confirm = () => {
  emit('confirm')
  visible.value = false
}

const eRPInformationFillingConfirm = async () => {
  const data = {
    ...localForm.value
  }
  if (localForm.value.id) {
    await updateDesign(data)
    message.success('操作成功')
    emit('confirm')
    visible.value = false
  } else {
    await saveDesign(data)
    message.success('操作成功')
    emit('confirm')
    visible.value = false
  }
}
</script>

<style scoped lang="scss">
.dialog-footer {
  text-align: right;
}

.header_txt {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

:deep() {
  .el-drawer__header {
    margin: 0;
    padding: 16px 20px;
    border-bottom: 1px solid #f0f0f0;
    // border: solid red 1px;
  }

  .el-drawer__footer {
    background-color: #ffffff;
  }
  //     .my-header {
  //       display: flex;
  //       align-items: center;
  //       font-size: 16px;
  //       border: solid red 1px;
  //       color: #333333;

  //       .shenhe-title {
  //         width: 14px;
  //         height: 16px;
  //         margin-right: 3px;
  //         margin-top: 3px;
  //       }
  //     }
}
</style>

<style scoped lang="scss">
.dialogBg {
  position: absolute;
  top: -16px;
  left: -15px;
  // width: 968px;
  // height: 444px;
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

:deep(.upload) {
  width: 146px;
  height: 146px;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);

  &:hover {
    border-color: var(--el-color-primary);
  }

  .el-upload {
    position: relative;
    width: 146px;
    height: 146px;

    .upload-empty {
      width: 146px;
      height: 146px;
    }

    .upload-handle {
      position: absolute;
      top: 0;
      right: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      cursor: pointer;
      background: rgb(0 0 0 / 60%);
      opacity: 0;
      box-sizing: border-box;
      text-align: center;

      .handle-icon {
        color: #fff;
      }
    }

    &:hover {
      .upload-handle {
        opacity: 1;
      }
    }
  }

  .upload-image {
    width: 146px;
    height: 146px;
  }
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
