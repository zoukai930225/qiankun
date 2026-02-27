<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle">
    <div class="drawerContent">
      <el-form class="dialogForm" :class="{ editForm: isEdit }" ref="formRef" v-loading="formLoading" :model="formData"
        :rules="formRules" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="条码" prop="barcode" required>
              <el-input style="width: 300px" placeholder="" v-model="formData.barcode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productCategory" label="产品类目">
              <el-input style="width: 300px" placeholder="" v-model="formData.productCategory" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="SKU编码" prop="skuCode">
              <el-input style="width: 300px" placeholder="" v-model="formData.skuCode" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productModelNumber" label="产品款号">
              <el-input style="width: 300px" placeholder="" v-model="formData.productModelNumber" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-input style="width: 300px" placeholder="" v-model="formData.brand" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sampleCategory" label="样品类别">
              <el-input style="width: 300px" placeholder="" v-model="formData.sampleCategory" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="尺码" prop="size">
              <el-select class="!w-300px" v-model="formData.size" placeholder="请选择尺码" disabled>
                <el-option v-for="dict in sampleSizeList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="colour" label="颜色">
              <el-input style="width: 300px" placeholder="" v-model="formData.colour" disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 库位增加 -->
        <div v-for="(loc, index) in locationDetailList" :key="index">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="`存放位置${index + 1}`" required>
                <el-select class="!w-300px" v-model="loc.locationId" placeholder="请选择库位位置" disabled>
                  <el-option v-for="dict in locationList" :key="dict.value" :label="dict.label" :value="dict.value" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="`库存数量${index + 1}`">
                <el-input style="width: 300px" placeholder="请输入" v-model="loc.storageNum" readonly disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="`报废数${index + 1}`" required>
                <el-input-number style="width: 300px" placeholder="请输入" v-model="loc.number"
                  :min="Math.min(0, loc.storageNum)" :max="loc.storageNum" />
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <el-row>
          <el-col :span="12">
            <el-form-item label="报废数">
              <el-input style="width: 300px" placeholder="请输入" :value="totalNumber()" readonly disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="报废原因" required prop="remark">
              <s-text-area style="width: 900px" v-model="formData.remark" placeholder="" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="图片">
              <UploadImg v-model:modelValue="imageList" :limit="1" :uploadDisabled="!isEdit" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="drawerVisible = false">关 闭</el-button>
      <el-button :disabled="formLoading" type="primary" @click="submitForm" class="mr20px">提 交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import UploadImg from '../../components/uploadImg.vue'
import * as sampleManageApi from '@/api//sample/sampleManage'
import { sampleSizeList } from '@/views/newMedia/hooks/useSample'

const props = defineProps({
  locationList: {
    type: Array as any,
    default: () => []
  }
})

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const scrollRef = ref()
const drawerVisible = ref(false) // 弹窗的是否展示
const drawerTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  barcode: '',
  productCategory: '', //产品类目
  skuCode: '', // SKU编码
  productModelNumber: '',
  brand: '',
  sampleCategory: '',
  size: '',
  colour: '',
  image: '',
  details: [
    {
      locationId: '',
      number: 0 // 报废数量
    }
  ],
  totalNumber: '', //报废数量 总数只是前端使用 不传后端
  remark: ''
})
const imageList = ref<any>([])

const formRef = ref()
const isEdit = ref(true)

const locationDetailList = ref<any>([])
//totalNumber:'', //申请数量 总数只是前端使用 不传后端
const totalNumber = () => {
  return locationDetailList.value.reduce((sum, item) => {
    return sum + Number(item.number)
  }, 0)
}

/** 打开drawer */
const open = async (id?: string) => {
  resetForm()
  drawerVisible.value = true
  drawerTitle.value = '报废'
  if (id) {
    // 查详情
    const data = await sampleManageApi.getInventoryById(id)
    if (data) {
      formData.value = data
      locationDetailList.value = formData.value.details.map((item) => ({
        locationId: item.locationId,
        number: '',
        storageNum: item.number
      }))
      if (data.image) imageList.value.push({ fileUrl: data.image })
      formData.value.remark = ''
    }
  }
}

defineExpose({ open }) // 提供 open 方法，用于打开弹窗

// 表单校验规则

const formRules = reactive({
  productCategory: [{ required: true, message: '请输入产品类目', trigger: 'blur' }],
  skuCode: [{ required: false, message: '请输入skuCode', trigger: 'blur' }],
  productModelNumber: [{ required: false, message: '请输入产品款号', trigger: 'blur' }],
  brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  sampleCategory: [{ required: true, message: '请输入样品类别', trigger: 'blur' }],
  size: [{ required: true, message: '请选择尺码', trigger: 'blur' }],
  colour: [{ required: true, message: '请输入颜色', trigger: 'blur' }],
  remark: [{ required: true, message: '请输入报废原因', trigger: 'blur' }]
})

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 校验通过 提交
  if (Number(totalNumber()) === 0) {
    return message.error('报废总数量不能为0')
  }
  formLoading.value = true
  try {
    /**
       *  "barcode": "SP00005", //条形码
        "locationId": "f9aa8006-5691-4d44-8756-fffe79051965", //库位id
        "number": "10", //数量
        "status": 2, //固定位2
        "remark":"报废原因"
       */
    let params = [] as any
    let image = imageList.value[0]?.fileUrl || ''
    console.log(formData.value.details)
    params = locationDetailList.value.map((item) => ({
      barcode: formData.value.barcode,
      locationId: item.locationId,
      number: item.number,
      status: 2,
      remark: formData.value.remark,
      image
    }))
    await sampleManageApi.createScrapSample(params)
    message.success('保存成功')
    formLoading.value = false
    reset()
  } catch {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formRef.value?.resetFields()
  imageList.value = []
}

const reset = () => {
  resetForm()
  drawerVisible.value = false
  emit('success')
}
</script>

<style lang="less" scoped>
@import '@/views/newMedia/style/drawer.scss';
</style>
