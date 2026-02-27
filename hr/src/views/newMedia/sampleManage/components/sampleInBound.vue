<template>
  <SWDrawer v-model="drawerVisible" :title="drawerTitle">
    <div class="drawerContent">
      <el-form class="dialogForm" :class="{ editForm: isEdit }" ref="formRef" v-loading="formLoading" :model="formData"
        :rules="formRules" label-width="100px" label-position="right">
        <el-row>
          <el-col :span="12">
            <el-form-item label="条码" prop="barcode">
              <el-input style="width: 300px" placeholder="请输入" v-model="formData.barcode" readonly disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productCategory" label="产品类目">
              <el-input style="width: 300px" placeholder="请输入" v-model="formData.productCategory" readonly disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="SKU编码" prop="skuCode">
              <el-input style="width: 300px" placeholder="请输入" v-model="formData.skuCode" readonly disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="productModelNumber" label="产品款号">
              <el-input style="width: 300px" placeholder="请输入" v-model="formData.productModelNumber" readonly
                disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-input style="width: 300px" placeholder="请输入" v-model="formData.brand" readonly disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="sampleCategory" label="样品类别">
              <el-input style="width: 300px" placeholder="请输入" v-model="formData.sampleCategory" readonly disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="尺码" prop="size">
              <el-select class="!w-300px" v-model="formData.size" placeholder="请选择尺码" readonly disabled>
                <el-option v-for="dict in sampleSizeList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="colour" label="颜色">
              <el-input style="width: 300px" placeholder="请输入" v-model="formData.colour" readonly disabled />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 库位增加 -->
        <el-row v-for="(loc, index) in formData.details" :key="index">
          <el-col :span="12">
            <el-form-item :label="`存放位置${index + 1}`" :prop="`details.${index}.locationId`"
              :rules="[{ required: true, message: '请选择库位位置', trigger: 'change' }]" required>
              <el-select class="!w-300px" v-model="loc.locationId" placeholder="请选择库位位置" clearable>
                <el-option v-for="dict in locationList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="`入库数量${index + 1}`">
              <el-input-number style="width: 300px" placeholder="请输入" v-model="loc.number" :min="0" />
              <img :src="plusSvg" class="iconButton" v-if="index === 0" @click.stop="addLocation" />
              <img :src="delSvg" class="iconButton" v-else @click.stop="delLocation(index)" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="入库日期" prop="date">
              <el-date-picker v-model="formData.date" type="date" placeholder="请选择入库日期" style="width: 300px"
                value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="source" label="来源">
              <!-- <el-input style="width:300px;" placeholder="请输入" v-model="formData.source" /> -->
              <el-select class="!w-300px" v-model="formData.source" placeholder="请选择来源">
                <el-option v-for="dict in resourceList" :key="dict.value" :label="dict.label" :value="dict.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="图片">
              <UploadImg v-model:modelValue="imageList" :limit="1" :uploadDisabled="!isEdit" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <s-text-area style="width: 900px" v-model="formData.remark" placeholder="" :rows="3" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="drawerVisible = false">关 闭</el-button>
      <el-button type="primary" @click="submitForm" class="mr20px">提 交</el-button>
    </template>
  </SWDrawer>
</template>
<script lang="ts" setup>
import STextArea from "@/components/common/input/s-textarea.vue";
import UploadImg from '../../components/uploadImg.vue'
import { sampleSizeList, resourceList } from '@/views/newMedia/hooks/useSample'
import plusSvg from '@/assets/imgs/newMedia/plus.svg'
import delSvg from '@/assets/imgs/newMedia/del.svg'
import * as sampleManageApi from '@/api//sample/sampleManage'
import dayjs from 'dayjs'
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
      number: 0
    }
  ],
  date: '',
  source: '',
  remark: ''
})
const imageList = ref<any>([])

const formRef = ref()
const isEdit = ref(true)

// 库位相关操作

// 增加
const addLocation = () => {
  formData.value.details.push({
    locationId: '',
    number: 0
  })
}
// 删除
const delLocation = (index) => {
  formData.value.details.splice(index, 1)
}

/** 打开drawer */
const open = async (id?: string) => {
  resetForm()
  drawerVisible.value = true
  drawerTitle.value = '入库'
  if (id) {
    // 查详情
    console.log(id)
    const data = await sampleManageApi.queryBasicInfoByBarcode({ barcode: id })
    if (data) {
      formData.value = data
      if (data.image) imageList.value.push({ fileUrl: data.image })
      formData.value.details = [
        {
          locationId: '',
          number: 0
        }
      ]
      formData.value.date = dayjs().format('YYYY-MM-DD')
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
  date: [{ required: true, message: '请选择入库日期', trigger: 'blur' }],
  source: [{ required: true, message: '请选择来源', trigger: 'blur' }]
})

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 校验通过 提交
  formLoading.value = true
  try {
    // 入库
    let params = [] as any
    let image = imageList.value[0]?.fileUrl || ''
    params = formData.value.details.map((item) => ({
      barcode: formData.value.barcode,
      locationId: item.locationId,
      number: item.number,
      status: 3,
      date: formData.value.date,
      source: formData.value.source,
      remark: formData.value.remark,
      image
    }))
    console.log(params)
    await sampleManageApi.inWarehouse(params)
    message.success('保存成功')
    formLoading.value = false
    drawerVisible.value = false
    reset()
  } catch (err) {
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
