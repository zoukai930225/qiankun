<template>
  <div>
    <el-dialog v-model="visible" :width="dialogWidth" :before-close="handleClose" @open="resetForm"
      class="oadialog-background2" style="border-radius: 8px" :append-to-body="true">
      <div>
        <div class="dialog-content">
          <div class="flex-row form-wapper" style="margin-left: 0px">
            <el-form ref="formRef" :model="localForm" :rules="formRules" label-width="80px">
              <div style="display: flex; flex-wrap: wrap">
                <el-form-item label="店铺" class="formItem" prop="store">
                  <el-input v-model="localForm.store" placeholder="请输入店铺" />
                </el-form-item>
                <el-form-item label="链接" class="formItem" prop="competitiveLink">
                  <el-input v-model="localForm.competitiveLink" placeholder="请输入链接" />
                </el-form-item>
                <el-form-item label="销量" style="width: 276px" prop="salesVolume">
                  <el-input v-model="localForm.salesVolume" placeholder="请输入销量" />
                </el-form-item>
                <el-form-item label="客单价" style="width: 276px" prop="customerUnitPrice">
                  <el-input v-model="localForm.customerUnitPrice" placeholder="请输入客单价" />
                </el-form-item>
                <el-form-item label="平台备注" class="formItem" prop="remarks">
                  <s-text-area v-model="localForm.remarks" :autosize="{ minRows: 3, maxRows: 3 }"
                    placeholder="请输入平台备注" />
                </el-form-item>
                <el-form-item label="图片" prop="imgUrl">
                  <uploadFile v-model:modelValue="localForm.imgUrl" :width="324" :only-upload-img="true" :limit="1" />
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
      </div>
      <template #header="{ }">
        <div class="my-header">
          <span style="margin-left: 10px">{{ titleLbl }}</span>
        </div>
        <div class="myHeaderBorder"></div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button v-if="!forbidEdit" type="primary" @click="confirmDialog">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import { defineProps } from 'vue'
import { debounce } from 'lodash-es'
import uploadFile from '@/components/SWUoloadFile/index.vue'

import { addCompetor, updateCompetitive } from '@/api/oa/new/develop'

const message = useMessage() // 消息弹窗

const props = defineProps({
  title: {
    type: String,
    default: '竞品信息'
  },
  width: {
    type: String,
    default: '868px'
  },
  forbidEdit: {
    type: Boolean,
    default: false
  }
})
const formRef = ref()
const dialogWidth = ref('600px')
const emit = defineEmits(['update:modelValue', 'confirm', 'close'])
const visible = ref(false)
const localForm = ref({
  npDevelopmentPlanId: '',
  npDesignPictureId: '',
  store: '',
  competitiveLink: '',
  salesVolume: '',
  customerUnitPrice: '',
  remarks: '',
  imgUrl: '',
  imgUrlList: []
})
const nodeData = ref({})

const titleLbl = ref('')
// 打开
const open = async (data: any, npDevelopmentPlanId: any, developmentPlanId: any) => {
  visible.value = true
  nodeData.value = data
  localForm.value = {
    npDevelopmentPlanId: developmentPlanId,
    npDesignPictureId: npDevelopmentPlanId,
    store: '',
    competitiveLink: '',
    salesVolume: '',
    customerUnitPrice: '',
    remarks: '',
    imgUrl: '',
    imgUrlList: []
  }
  if (data) {
    titleLbl.value = '编辑竞品信息'
    localForm.value = data
    localForm.value.npDevelopmentPlanId = developmentPlanId || ''
    localForm.value.npDesignPictureId = npDevelopmentPlanId || ''

    if (localForm.value.imgUrl) {
      localForm.value.imgUrl = localForm.value.imgUrl
        .split(',')
        .map((item) => {
          let array = item.split('?name=')
          return {
            name: array.length > 1 ? array[1] : '',
            url: array[0]
          }
        })
    }
  } else {
    titleLbl.value = '新增竞品信息'
  }
}

defineExpose({ open })

onMounted(() => { })

const formRules = reactive({
  store: [{ required: true, message: '请输入店铺', trigger: 'blur' }],
  competitiveLink: [{ required: true, message: '请输入链接', trigger: 'blur' }]
})

const handleClose = () => {
  visible.value = false
  emit('close')
}
const resetForm = () => { }

const confirmDialog = debounce(async () => {
  productinformationFillingConfirm()
})

const productinformationFillingConfirm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  const data = {
    ...localForm.value
  }
  if (data.imgUrl && data.imgUrl.length > 0) {
    data.imgUrl = data.imgUrl
      .map((item) => {
        if (item.item) {
          return item.url && item.url + '?name=' + item.name
        } else {
          return item.url
        }
      })
      .join(',')
  }
  if (localForm.value.id) {
    let obj = JSON.parse(JSON.stringify(data))
    if (obj.jsonData) {
      delete obj.jsonData
    }
    await updateCompetitive(obj)
    message.success('操作成功')
    emit('confirm')
    visible.value = false
  } else {
    await addCompetor(data)
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

.my-header {
  display: flex;
  align-items: center;

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
  // width: 968px;
  // height: 444px;
  z-index: -1;
}
</style>
<style lang="scss" scoped>
.oadialog-background2 {
  border-radius: 8px;
  background: #ffffff;

  .dialog-content {
    background: #ffffff;
    border-radius: 0px;
    margin: 0 auto;
    padding-top: 6px;
    box-sizing: border-box;
    overflow: auto;
    margin-right: 5px;
  }

  .formItem {
    width: 556px;
  }
}

.myHeaderBorder {
  margin-top: 16px;
  width: calc(100% + 60px);
  height: 1px;
  background: #f0f0f0;
  margin-left: -16px;
}
</style>
