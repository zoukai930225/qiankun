<template>
  <div>
    <el-dialog v-model="dialogVisible" class="mainImgdialog" :class="{ isUpload: dialogType !== 'features' }"
      :before-close="handleClose">
      <div>
        <div class="dialog-content">
          <el-scrollbar>
            <el-form ref="ruleFormRef" :model="form" label-width="100px" label-position="left"
              :validate-on-rule-change="false" :rules="dialogType === 'features' ? rules1 : dialogType === 'competitor' ? rules2 : rules3
                ">
              <el-form-item label="" :prop="formParams.item1.key" v-if="formParams.item1.key">
                <UploadImg v-model:modelValue="mainImageDialogList" :limit="1" @validate="emitValidate" />
              </el-form-item>
              <el-form-item :label="formParams.item2.label" :prop="formParams.item2.key">
                <s-text-area style="width: 330px" v-model="form[formParams.item2.key]" placeholder="请输入" :rows="4"
                  :resize="'none'" />
              </el-form-item>
              <el-form-item :label="formParams.item3.label" :prop="formParams.item3.key">
                <s-text-area style="width: 330px" v-model="form[formParams.item3.key]" placeholder="请输入" :rows="4"
                  :resize="'none'" />
              </el-form-item>
              <el-form-item :label="formParams.item4.label" :prop="formParams.item4.key">
                <s-text-area style="width: 330px" v-model="form[formParams.item4.key]" placeholder="请输入" :rows="4"
                  :resize="'none'" />
              </el-form-item>
            </el-form>
          </el-scrollbar>
        </div>
      </div>
      <template #header="{ }">
        <div class="my-header">
          <img :src="imgSrc" class="title-img" />
          <span class="title-text">{{ title }}</span>
        </div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">关 闭</el-button>
          <el-button type="primary" @click="confirmDialog">保 存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import * as mainImageApi from '@/api/oa/new/mainImageAnalyse'

import UploadImg from './uploadImg.vue'

import dialog1 from '@/assets/imgs/oa/mainImg/dialog1.svg'
import dialog2 from '@/assets/imgs/oa/mainImg/dialog2.svg'
import dialog3 from '@/assets/imgs/oa/mainImg/dialog3.svg'

const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示

const form = ref<any>({})
const ruleFormRef = ref()

const validateImg = (rule: any, value: any, callback: any) => {
  if (mainImageDialogList.value.length === 0) {
    callback(new Error('请上传图片'))
  } else {
    callback()
  }
}

const rules1 = reactive({
  attributeType: [{ required: true, message: '请填写属性(款式,材质,工艺，参数)', trigger: 'blur' }],
  attributeUse: [{ required: true, message: '请填写属性的用处', trigger: 'blur' }],
  advantage: [{ required: true, message: '请填写用处的优势', trigger: 'blur' }]
})
const rules2 = reactive({
  mainImageInfo: [{ validator: validateImg, trigger: 'blur' }],
  competitorAdvantage: [{ required: true, message: '请填写优势', trigger: 'blur' }],
  competitorLearn: [{ required: true, message: '请填写可取之处', trigger: 'blur' }],
  competitorUrl: [{ required: true, message: '请填写竞品链接', trigger: 'blur' }]
})
const rules3 = reactive({
  mainImageInfo: [{ validator: validateImg, trigger: 'blur' }],
  sellingPointRef: [{ required: true, message: '请填写卖点参考', trigger: 'blur' }],
  mainImageCopy: [{ required: true, message: '请填写主图文案', trigger: 'blur' }],
  highlightPoint: [{ required: true, message: '请填写强调突出', trigger: 'blur' }]
})

const emit = defineEmits(['confirm'])

const dialogType = ref('')
const title = ref('')
const imgSrc = ref('')
const isUpdate = ref(false)
const orderNum = ref(1)
const mainImageDialogList = ref<any>([])
const formParams = ref<any>({})
const titleMap = {
  features: {
    title: '本产品特点',
    imgSrc: dialog1,
    formParams: {
      item1: {
        label: '',
        key: ''
      },
      item2: {
        label: '属性(款式,材质,工艺，参数)',
        key: 'attributeType'
      },
      item3: {
        label: '属性的用处',
        key: 'attributeUse'
      },
      item4: {
        label: '用处的优势',
        key: 'advantage'
      }
    },
    form: {
      attributeType: '',
      attributeUse: '',
      advantage: ''
    }
  },
  competitor: {
    title: '竞品分析',
    imgSrc: dialog2,
    formParams: {
      item1: {
        label: '',
        key: 'mainImageInfo'
      },
      item2: {
        label: '优势',
        key: 'competitorAdvantage'
      },
      item3: {
        label: '可取之处',
        key: 'competitorLearn'
      },
      item4: {
        label: '竞品链接',
        key: 'competitorUrl'
      }
    },
    form: {
      mainImageInfo: {},
      competitorAdvantage: '',
      competitorLearn: '',
      competitorUrl: ''
    }
  },
  sellingPoint: {
    title: '本品主图卖点方向',
    imgSrc: dialog3,
    formParams: {
      item1: {
        label: '',
        key: 'mainImageInfo'
      },
      item2: {
        label: '卖点参考',
        key: 'sellingPointRef'
      },
      item3: {
        label: '主图文案',
        key: 'mainImageCopy'
      },
      item4: {
        label: '强调突出',
        key: 'highlightPoint'
      }
    },
    form: {
      mainImageInfo: {},
      sellingPointRef: '',
      mainImageCopy: '',
      highlightPoint: ''
    }
  }
}

const emitValidate = () => {
  ruleFormRef.value && ruleFormRef.value.validateField('mainImageInfo')
}
/** 打开弹窗 */
const open = async (type: string, mainId: string, id: string, num: number) => {
  resetForm()
  dialogVisible.value = true
  dialogType.value = type
  title.value = titleMap[type].title
  imgSrc.value = titleMap[type].imgSrc
  formParams.value = titleMap[type].formParams
  form.value = titleMap[type].form
  form.value.mainId = mainId
  orderNum.value = num + 1
  // 编辑
  if (id) {
    form.value.id = id
    isUpdate.value = true
    if (dialogType.value === 'features') {
      const res = await mainImageApi.getProductFeatureById(id)
      form.value = res
    } else {
      const res = await mainImageApi.getProductComparisonById(id)
      form.value = res
      mainImageDialogList.value = res.mainImageInfo ? [res.mainImageInfo] : []
    }
  } else {
    form.value.id = ''
    isUpdate.value = false
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

const handleClose = () => {
  dialogVisible.value = false
  resetForm()
}
const resetForm = () => {
  // 清空
  ruleFormRef.value?.resetFields()
  ruleFormRef.value?.clearValidate()
  form.value = {}
  mainImageDialogList.value = []
}

const confirmDialog = async () => {
  ruleFormRef.value &&
    ruleFormRef.value.validate(async (valid) => {
      if (valid) {
        // 提交
        if (dialogType.value === 'features') {
          // 本产品特点
          const data = { ...form.value }
          data.orderNum = orderNum.value
          if (isUpdate.value) await mainImageApi.updateProductFeature(data).catch(() => { })
          else await mainImageApi.addProductFeature(data).catch(() => { })
        } else if (dialogType.value === 'competitor') {
          // 竞品分析
          const data = { ...form.value, type: 1 }
          data.mainImageInfo = mainImageDialogList.value[0]
          data.orderNum = orderNum.value
          if (isUpdate.value) await mainImageApi.updateProductComparison(data).catch(() => { })
          else await mainImageApi.addProductComparison(data).catch(() => { })
        } else {
          // 本品卖点
          const data = { ...form.value, type: 2 }
          data.mainImageInfo = mainImageDialogList.value[0]
          data.orderNum = orderNum.value
          if (isUpdate.value) await mainImageApi.updateProductComparison(data).catch(() => { })
          else await mainImageApi.addProductComparison(data).catch(() => { })
        }
        if (isUpdate.value) message.success('修改成功')
        else message.success('新增成功')
        emit('confirm', dialogType.value)
        handleClose()
      } else {
        return false
      }
    })
}
</script>

<style scoped lang="scss">
:deep(.mainImgdialog) {
  width: 496px;
  height: 508px;
  padding: 20px;
  border-radius: 20px;
  background-image: url('@/assets/imgs/oa/mainImg/dialogbg1.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;

  .dialog-content {
    width: 456px;
    height: 375px;
    background: #ffffff;
    border-radius: 20px;
    margin: 0 auto;
    padding: 16px 12px;
    box-sizing: border-box;
  }

  &.isUpload {
    height: 638px;
    background-image: url('@/assets/imgs/oa/mainImg/dialogbg2.png');

    .dialog-content {
      height: 505px;
    }
  }
}

.dialog-footer {
  margin-top: 4px;
  text-align: right;
}

.my-header {
  display: flex;
  align-items: center;

  .title-img {
    width: 14px;
    height: 16px;
    margin-right: 2px;
    margin-top: 2px;
  }

  .title-text {
    font-size: 15px;
    font-weight: 500;
    color: #333;
    margin-left: 14px;
  }
}

:deep(.el-textarea__inner) {
  color: #333;
}
</style>
