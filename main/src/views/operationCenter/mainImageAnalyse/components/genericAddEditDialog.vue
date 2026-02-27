<template>
  <scheme-dialog ref="dialogRef" name="AddAnalyse" :width="500" @closed="handleClosed">
    <template #card>
      <el-form
        ref="formRef"
        :model="form"
        :rules="currentRules"
        label-width="100px"
        :validate-on-rule-change="false"
      >
       <el-form-item v-if="needUpload" :label="dialogType === 'competitor'?'是否有竞品图':'是否有图片'" prop="isNeedImg">
        <el-select v-model="form.isNeedImg">
          <el-option label="是" :value="1"/>
          <el-option label="否" :value="0"/>
        </el-select>
       </el-form-item>
        <el-form-item v-if="needUpload" label="图片" :prop="form.isNeedImg?'mainImageInfo':''" >
          <Transfer
            v-model="mainImageDialogList"
            :limit="1"
            accept-type="image"
            :is-file-show="true"
            :multiple="false"
            value-type="array"
          />
        </el-form-item>

        <el-form-item :label="formConfig.item1.label" :prop="formConfig.item1.key">
          <s-textarea
            v-model="form[formConfig.item1.key]"
            placeholder="请输入"
            :rows="3"
            :resize="'none'"
          />
        </el-form-item>

        <el-form-item :label="formConfig.item2.label" :prop="formConfig.item2.key">
          <s-textarea
            v-model="form[formConfig.item2.key]"
            placeholder="请输入"
            :rows="3"
            :resize="'none'"
          />
        </el-form-item>
        <el-form-item v-if="formConfig.item4.key" :label="formConfig.item4.label" :prop="formConfig.item4.key" >
          <el-select v-model="form[formConfig.item4.key]">
            <el-option label="模特" value="模特"/>
            <el-option label="静物" value="静物"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="formConfig.item5.label" :prop="formConfig.item5.key" v-if="formConfig.item5.key">
          <s-textarea
            v-model="form[formConfig.item5.key]"
            placeholder="请输入"
            :rows="3"
            :resize="'none'"
          />
        </el-form-item>

        <el-form-item :label="formConfig.item3.label" :prop="formConfig.item3.key" v-if="formConfig.item3.key">
          <s-textarea
            v-model="form[formConfig.item3.key]"
            placeholder="请输入"
            :rows="3"
            :resize="'none'"
          />
        </el-form-item>
      </el-form>
    </template>

    <template #button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="confirmDialog">保存</el-button>
    </template>
  </scheme-dialog>
</template>

<script lang="tsx">
export default { name: 'NewAddAnalyseDialog' }
</script>

<script lang="tsx" setup>
import { ref, computed, nextTick, provide, defineProps, defineEmits, defineExpose } from 'vue'
// 假设的导入路径，请根据您的项目实际路径调整
import * as mainImageApi from '@/api/oa/new/mainImageAnalyse'
import Transfer from '@/components/common/upload/transfer.vue'

const message = useMessage()
const formRef = ref<any>()
const dialogRef = ref<any>()
const mainImageDialogList = ref<any>([])

const dialogType = ref('')
const isUpdate = ref(false)
const orderNum = ref(1) // 当前操作项的序号
const form = ref<any>({})
const formConfig = ref<any>({})

const emit = defineEmits(['confirm', 'success'])

// 配置映射 (保持不变)
const configMap: any = {
  features: {
    title: '产品特征',
    needUpload: false,
    item1: { label: '属性(款式,材质,工艺,参数)', key: 'attributeType' },
    item2: { label: '解决人群痛点', key: 'attributeUse' },
    // item3: { label: '用处的优势', key: 'advantage' },
    item3:{ },
    item4:{ },
    item5:{ },
    defaultForm: {
      attributeType: '',
      attributeUse: '',
      advantage: ''
    }
  },
  competitor: {
    title: '竞品分析',
    needUpload: true,
    item1: { label: '优势', key: 'competitorAdvantage' },
    item2: { label: '可取之处', key: 'competitorLearn' },
    item3: { label: '竞品链接', key: 'competitorUrl' },
    item4:{ },
    item5:{ },
    defaultForm: {
      mainImageInfo: {},
      competitorAdvantage: '',
      competitorLearn: '',
      competitorUrl: '',
      isNeedImg:1
    }
  },
  sellingPoint: {
    title: '本品主图卖点方向',
    needUpload: true,
    item1: { label: '图片参考点', key: 'sellingPointRef' },
    item2:  { label: '运营主图需求', key: 'highlightPoint' },
    item4:  { label: '图片类型', key: 'imgType' },
    item5:  { label: '建议拍摄颜色', key: 'suggestColor' },
    item3: { label: '主图文案', key: 'mainImageCopy' },
    defaultForm: {
      mainImageInfo: {},
      sellingPointRef: '',
      mainImageCopy: '',
      highlightPoint: '',
      imgType:'',
      suggestColor:'',
      isNeedImg:1
    }
  }
}

const needUpload = computed(() => configMap[dialogType.value]?.needUpload || false)
const dialogTitle = computed(() => configMap[dialogType.value]?.title || '')

// 定义 Props 接收完整的列表数据
const props = defineProps({
  valueType: { type: String, default: 'array' },
  // 本产品特点列表
  productFeatureList: {
    type: Array as () => any[],
    default: () => []
  },
  // 竞品分析/卖点方向列表
  productComparisonList: {
    type: Array as () => any[],
    default: () => []
  },
  productSellingPointList: {
    type: Array as () => any[],
    default: () => []
  }
})

// Provide/Inject 逻辑 (保持不变)
const dataValue = computed(() => ({
  form: form.value,
  mainImageDialogList: mainImageDialogList.value
}))

const bukValue = ref<any>({})

provide('AddAnalyseDetails', {
  dataValue,
  bukValue,
  viewType: computed(() => 'create'),
  title: dialogTitle,
  loading: ref(false)
})

// 验证逻辑 (保持不变)
const validateImg = (_rule: any, _value: any, callback: any) => {
  if (props.valueType === 'array') {
    if (!mainImageDialogList.value || mainImageDialogList.value.length === 0) {
      callback(new Error('请上传图片'))
    } else {
      callback()
    }
  } else {
    if (!mainImageDialogList.value || mainImageDialogList.value === '') {
      callback(new Error('请上传图片'))
    } else {
      callback()
    }
  }
}

const currentRules = computed(() => {
  if (dialogType.value === 'features') {
    return {
      attributeType: [
        { required: true, message: '请填写属性(款式,材质,工艺,参数)', trigger: 'blur' }
      ],
      attributeUse: [{ required: true, message: '请填写属性的用途', trigger: 'blur' }],
      // advantage: [{ required: true, message: '请填写用途的优势', trigger: 'blur' }]
    }
  } else if (dialogType.value === 'competitor') {
    return {
      isNeedImg:[{required:true,message:'请选择是否有竞品图',trigger:'blur'}],
      mainImageInfo: [{ validator: validateImg, trigger: 'blur', required: true }],
      competitorAdvantage: [{ required: true, message: '请填写优势', trigger: 'blur' }],
      competitorLearn: [{ required: true, message: '请填写可取之处', trigger: 'blur' }],
      competitorUrl: [{ required: true, message: '请填写竞品链接', trigger: 'blur' }]
    }
  } else {
    return {
      isNeedImg:[{required:true,message:'请选择是否有图片',trigger:'blur'}],
      mainImageInfo: [{ validator: validateImg, trigger: 'blur', required: true }],
      sellingPointRef: [{ required: true, message: '请填写卖点参考', trigger: 'blur' }],
      mainImageCopy: [{ required: true, message: '请填写主图文案', trigger: 'blur' }],
      highlightPoint: [{ required: true, message: '请填写强调突出', trigger: 'blur' }],
      imgType: [{ required: true, message: '请选择图片类型', trigger: 'blur' }],
      suggestColor: [{ required: true, message: '请填写建议拍摄颜色', trigger: 'blur' }],
    }
  }
})

// 从 transfer 组件获取图片数据 (保持不变)
const getImageData = () => {
  if (!mainImageDialogList.value || mainImageDialogList.value.length === 0) {
    return null
  }
  return mainImageDialogList.value[0]
}

/**
 * 打开弹窗 (已修正 orderNum 逻辑)
 */
const open = async (type: string, mainId: string, id?: string, num?: number) => {
  dialogRef.value?.openDialog(
    async () => {
      resetForm()
      dialogType.value = type
      const config = configMap[type]
      formConfig.value = {
        item1: config.item1,
        item2: config.item2,
        item3: config.item3,
        item4: config.item4,
        item5: config.item5,
      }
      form.value = { ...config.defaultForm, mainId }

      orderNum.value = (num || 0) + 1

      // 编辑模式
      if (id) {
        form.value.id = id
        isUpdate.value = true

        let res: any
        if (type === 'features') {
          res = await mainImageApi.getProductFeatureById(id)
        } else {
          res = await mainImageApi.getProductComparisonById(id)
        }

        form.value = { ...res, mainId,isNeedImg:type === 'competitor'? res.sfImage : res.sfMainImage }

        if (res.orderNum) {
          orderNum.value = res.orderNum
        }

        // 转换为 transfer 组件需要的格式 (保持不变)
        if (type !== 'features' && res.mainImageInfo) {
          mainImageDialogList.value = [
            {
              ...res.mainImageInfo,
              uid: Date.now(),
              name: res.mainImageInfo.fileName || '图片',
              url: res.mainImageInfo.fileUrl,
              fileUrl: res.mainImageInfo.fileUrl,
              fileName: res.mainImageInfo.fileName,
              status: 'success'
            }
          ]
        } else {
          mainImageDialogList.value = []
        }
      } else {
        form.value.id = ''
        isUpdate.value = false
      }

      // 保存初始状态
      bukValue.value = JSON.parse(
        JSON.stringify({
          form: form.value,
          mainImageDialogList: mainImageDialogList.value
        })
      )
    },
    () => {
      nextTick(() => {
        formRef.value?.clearValidate()
      })
    }
  )
}

defineExpose({ open })

const handleClose = () => {
  dialogRef.value?.close()
}

const handleClosed = () => {
  resetForm()
}

const resetForm = () => {
  formRef.value?.resetFields()
  formRef.value?.clearValidate()
  form.value = {}
  mainImageDialogList.value = []
}

/**
 * 确认保存对话框 (已修正为保存完整列表并关闭对话框)
 */
const confirmDialog = async () => {
  const valid = await formRef.value?.validate()
  if (!valid) return

  try {
    let payload: any

    if (dialogType.value === 'features') {
      const data = { ...form.value, orderNum: orderNum.value }
      if (isUpdate.value) {
        await mainImageApi.updateProductFeature(data)
      } else {
        await mainImageApi.addProductFeature(data)
      }
      // // 1. 复制现有列表
      // const currentFeatureList = [...props.productFeatureList]
      // // 2. 准备新的或修改后的项目
      // const featureItem = {
      //   ...form.value,
      //   orderNum: orderNum.value
      // }

      // const index = currentFeatureList.findIndex((item) => item.id === featureItem.id)
      // if (index > -1) {
      //   currentFeatureList.splice(index, 1, featureItem)
      // } else {
      //   currentFeatureList.push(featureItem)
      // }

      // 4. 构建完整的 payload
      // payload = {
      //   mainId: form.value.mainId,
      //   opProductFeatureList: currentFeatureList // 发送完整的列表
      // }
      // // 5. 调用批量添加/修改 API
      // await mainImageApi.batchAddProductFeature(payload)
    } else {
      const type = dialogType.value === 'competitor' ? 1 : 2
      const imageData = getImageData()
      const sfImage = dialogType.value === 'competitor' ? form.value.isNeedImg : undefined
      const sfMainImage = dialogType.value === 'sellingPoint' ? form.value.isNeedImg : undefined
      const data = {
        ...form.value,
        sfImage,
        sfMainImage,
        type,
        orderNum: orderNum.value,
        mainImageInfo: imageData
      }
      delete data.isNeedImg
      if (isUpdate.value) {
        await mainImageApi.updateProductComparison(data)
      } else {
        await mainImageApi.addProductComparison(data)
      }

      // 1. 复制现有列表
      // const currentComparisonList =
      //   dialogType.value === 'competitor'
      //     ? [...props.productComparisonList]
      //     : [...props.productSellingPointList]

      // // 2. 准备新的或修改后的项目
      // const comparisonItem = {
      //   ...form.value,
      //   type,
      //   orderNum: orderNum.value,
      //   mainImageInfo: imageData
      // }

      // // 3. 更新列表
      // const index = currentComparisonList.findIndex((item) => item.id === comparisonItem.id)
      // if (index > -1) {
      //   currentComparisonList.splice(index, 1, comparisonItem)
      // } else {
      //   currentComparisonList.push(comparisonItem)
      // }

      // // 4. 构建完整的 payload
      // payload = {
      //   mainId: form.value.mainId,
      //   type,
      //   opProductComparisonList: currentComparisonList // 发送完整的列表
      // }

      // // 5. 调用批量添加/修改 API
      // await mainImageApi.batchAddProductComparison(payload)
    }

    message.success(isUpdate.value ? '修改成功' : '新增成功')

    bukValue.value = JSON.parse(
      JSON.stringify({
        form: form.value,
        mainImageDialogList: mainImageDialogList.value
      })
    )
    // *** 关键修正 1：关闭对话框 ***
    dialogRef.value?.close()

    // 成功后通知父组件
    emit('success', dialogType.value)
  } catch (error) {
    // 错误处理
  }
}
</script>

<style scoped lang="scss">
:deep(.el-textarea__inner) {
  color: #333;
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: 18px;
  }
}
:deep(.el-form-item__label) {
    line-height: 16px;
    text-align: right;
  }
</style>
